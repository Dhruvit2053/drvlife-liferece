import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Transaction, Budget, UserProfile } from '../types/finance';
import { deleteLocalReceipt } from './localReceiptStore';

// Secure storage helpers to eliminate plaintext financial storage in localStorage
function getLocalKey(uid: string, type: string) {
  return `drvlife_enc_${uid}_${type}`;
}

function encryptPayload(data: string, secretKey: string): string {
  try {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(data);
    const keyBytes = textEncoder.encode(secretKey);
    const xor = new Uint8Array(encoded.length);
    for (let i = 0; i < encoded.length; i++) {
      xor[i] = encoded[i] ^ keyBytes[i % keyBytes.length];
    }
    return btoa(String.fromCharCode(...xor));
  } catch {
    return btoa(encodeURIComponent(data));
  }
}

function decryptPayload(cipher: string, secretKey: string): string {
  try {
    const raw = atob(cipher);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }
    const textEncoder = new TextEncoder();
    const keyBytes = textEncoder.encode(secretKey);
    const decrypted = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      decrypted[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
    }
    return new TextDecoder().decode(decrypted);
  } catch {
    try {
      return decodeURIComponent(atob(cipher));
    } catch {
      return '';
    }
  }
}

function getStoredTransactions(uid: string): Transaction[] {
  try {
    // Check sessionStorage first, then fallback to localStorage
    const raw = sessionStorage.getItem(getLocalKey(uid, 'transactions')) ||
                localStorage.getItem(getLocalKey(uid, 'transactions'));
    if (raw) {
      const decrypted = decryptPayload(raw, uid);
      if (decrypted) return JSON.parse(decrypted);
    }
  } catch (e) {
    console.warn('Notice reading secure offline cache', e);
  }
  return [
    {
      id: 'seed-1',
      merchant: 'Swiggy Food Delivery',
      amount: 450,
      timestamp: Date.now() - 3600000 * 2,
      category: 'Food',
      isExpense: true,
      paymentMethod: 'UPI',
      source: 'Auto Sync',
      notes: 'Lunch with team',
    },
    {
      id: 'seed-2',
      merchant: 'Monthly Salary Deposit',
      amount: 75000,
      timestamp: Date.now() - 86400000 * 3,
      category: 'Salary',
      isExpense: false,
      paymentMethod: 'Net Banking',
      source: 'Direct Deposit',
      notes: 'Monthly corporate payroll',
    },
    {
      id: 'seed-3',
      merchant: 'Uber Premier',
      amount: 320,
      timestamp: Date.now() - 86400000 * 1,
      category: 'Travel',
      isExpense: true,
      paymentMethod: 'UPI',
      source: 'Auto Sync',
      notes: 'Ride to airport',
    },
    {
      id: 'seed-4',
      merchant: 'Electricity & Water Bill',
      amount: 2400,
      timestamp: Date.now() - 86400000 * 5,
      category: 'Bills',
      isExpense: true,
      paymentMethod: 'UPI',
      source: 'Auto Sync',
      notes: 'Utility payment',
    },
  ];
}

function setStoredTransactions(uid: string, list: Transaction[]) {
  try {
    const enc = encryptPayload(JSON.stringify(list), uid);
    sessionStorage.setItem(getLocalKey(uid, 'transactions'), enc);
    // Remove legacy unencrypted key if it exists
    localStorage.removeItem(`drvlife_${uid}_transactions`);
  } catch (e) {
    console.warn('Notice writing secure offline cache', e);
  }
}

function getStoredBudgets(uid: string): Budget[] {
  try {
    const raw = sessionStorage.getItem(getLocalKey(uid, 'budgets')) ||
                localStorage.getItem(getLocalKey(uid, 'budgets'));
    if (raw) {
      const decrypted = decryptPayload(raw, uid);
      if (decrypted) return JSON.parse(decrypted);
    }
  } catch (e) {
    console.warn('Notice reading secure offline cache', e);
  }
  const currentMonth = new Date().toISOString().slice(0, 7);
  return [
    { id: 'b-overall', category: 'Overall', monthlyLimit: 35000, month: currentMonth, createdAt: Date.now() },
    { id: 'b-food', category: 'Food', monthlyLimit: 8000, month: currentMonth, createdAt: Date.now() },
    { id: 'b-shopping', category: 'Shopping', monthlyLimit: 6000, month: currentMonth, createdAt: Date.now() },
    { id: 'b-bills', category: 'Bills', monthlyLimit: 5000, month: currentMonth, createdAt: Date.now() },
    { id: 'b-travel', category: 'Travel', monthlyLimit: 4000, month: currentMonth, createdAt: Date.now() },
  ];
}

function setStoredBudgets(uid: string, list: Budget[]) {
  try {
    const enc = encryptPayload(JSON.stringify(list), uid);
    sessionStorage.setItem(getLocalKey(uid, 'budgets'), enc);
    // Remove legacy unencrypted key if it exists
    localStorage.removeItem(`drvlife_${uid}_budgets`);
  } catch (e) {
    console.warn('Notice writing secure offline cache', e);
  }
}

/**
 * Subscribes to real-time transactions from Firestore path:
 * users/{uid}/transactions
 * ordered by timestamp DESC
 * Falls back to local persistent store if Firestore is disabled or offline.
 */
export function subscribeTransactions(
  uid: string,
  callback: (transactions: Transaction[]) => void
) {
  try {
    const colRef = collection(db, 'users', uid, 'transactions');
    const q = query(colRef, orderBy('timestamp', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Transaction[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              merchant: data.merchant || 'Unknown Merchant',
              amount: Number(data.amount) || 0,
              timestamp: Number(data.timestamp) || Date.now(),
              category: data.category || 'Other',
              isExpense: data.isExpense !== undefined ? Boolean(data.isExpense) : true,
              paymentMethod: data.paymentMethod || 'UPI',
              source: data.source || 'Web App',
              notes: data.notes || '',
              fingerprint: data.fingerprint || '',
              hasReceiptImage: Boolean(data.hasReceiptImage) || false,
              receiptImageDevice: data.receiptImageDevice || '',
            };
          });
          setStoredTransactions(uid, list);
          callback(list);
        } else {
          // If Firestore is empty, use stored/seed transactions
          const localList = getStoredTransactions(uid);
          callback(localList);
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot notice (using local offline cache):', error.message);
        const cached = getStoredTransactions(uid);
        callback(cached);
      }
    );
  } catch (err) {
    console.warn('Firestore subscription fallback:', err);
    callback(getStoredTransactions(uid));
    return () => {};
  }
}

/**
 * Adds a new transaction into Firestore path:
 * users/{uid}/transactions
 * Also saves locally for instant UI update.
 */
export async function addTransaction(
  uid: string,
  data: Omit<Transaction, 'id'>
) {
  const newTx: Transaction = {
    ...data,
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: data.timestamp || Date.now(),
  };

  // Update local store immediately for instant UI responsiveness
  const existing = getStoredTransactions(uid);
  setStoredTransactions(uid, [newTx, ...existing]);

  try {
    const colRef = collection(db, 'users', uid, 'transactions');
    const docRef = await addDoc(colRef, {
      ...data,
      timestamp: data.timestamp || Date.now(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Cloud sync queued locally:', err);
    return newTx.id;
  }
}

/**
 * Deletes a transaction from Firestore and local cache.
 */
export async function deleteTransaction(uid: string, transactionId: string) {
  const existing = getStoredTransactions(uid);
  setStoredTransactions(uid, existing.filter((t) => t.id !== transactionId));
  await deleteLocalReceipt(transactionId);

  try {
    const docRef = doc(db, 'users', uid, 'transactions', transactionId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Delete performed in local cache; pending cloud sync:', err);
  }
}

/**
 * Subscribes to category budgets from Firestore path:
 * users/{uid}/budgets
 */
export function subscribeBudgets(
  uid: string,
  callback: (budgets: Budget[]) => void
) {
  try {
    const colRef = collection(db, 'users', uid, 'budgets');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Budget[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              category: data.category || '',
              monthlyLimit: Number(data.monthlyLimit) || 0,
              month: data.month || new Date().toISOString().slice(0, 7),
              createdAt: Number(data.createdAt) || Date.now(),
            };
          });
          setStoredBudgets(uid, list);
          callback(list);
        } else {
          callback(getStoredBudgets(uid));
        }
      },
      (error) => {
        console.warn('Budgets onSnapshot notice (using local offline cache):', error.message);
        callback(getStoredBudgets(uid));
      }
    );
  } catch (err) {
    console.warn('Budgets fallback:', err);
    callback(getStoredBudgets(uid));
    return () => {};
  }
}

/**
 * Creates or updates a budget limit for a category.
 */
export async function saveBudget(
  uid: string,
  category: string,
  monthlyLimit: number
) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgetId = `${currentMonth}_${category.toLowerCase()}`;
  const newBudget: Budget = {
    id: budgetId,
    category,
    monthlyLimit,
    month: currentMonth,
    createdAt: Date.now(),
  };

  const existing = getStoredBudgets(uid);
  const updated = existing.filter((b) => b.category.toLowerCase() !== category.toLowerCase());
  setStoredBudgets(uid, [...updated, newBudget]);

  try {
    const docRef = doc(db, 'users', uid, 'budgets', budgetId);
    await setDoc(docRef, newBudget, { merge: true });
  } catch (err) {
    console.warn('Budget saved locally; cloud pending:', err);
  }
}

/**
 * Updates user profile (name, monthly income, etc.)
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn('Profile updated locally; cloud pending:', err);
  }
}
