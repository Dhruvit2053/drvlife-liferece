/**
 * DrvLife Local Receipt Image Store (IndexedDB)
 * 100% Free Firebase Spark Tier Architecture.
 * 
 * In accordance with privacy-first and zero-cloud-cost principles:
 * - Receipt image binaries are stored strictly on the local device in IndexedDB.
 * - NO Firebase Cloud Storage is used.
 * - NO Base64 strings are stored in Firestore documents.
 * - Transaction metadata (hasReceiptImage: true, receiptImageDevice: string) syncs to Firestore.
 */

const DB_NAME = 'drvlife_local_receipts';
const DB_VERSION = 1;
const STORE_NAME = 'receipt_images';
const MAX_DIMENSION = 1200;
const MAX_IMAGE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB client cap

interface StoredReceipt {
  transactionId: string;
  blob: Blob;
  mimeType: string;
  sizeBytes: number;
  createdAt: number;
}

function openReceiptDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'transactionId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Resizes and compresses an image to keep it under 1.5 MB before local IndexedDB storage.
 */
export async function compressReceiptImage(file: File | Blob): Promise<Blob> {
  return new Promise((resolve) => {
    // If not in a browser canvas environment, return original
    if (typeof document === 'undefined') {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size <= MAX_IMAGE_SIZE_BYTES) {
            resolve(blob);
          } else if (blob) {
            // Further compress if needed
            canvas.toBlob((secondBlob) => resolve(secondBlob || file), 'image/jpeg', 0.6);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.8
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

/**
 * Saves a receipt image locally in IndexedDB keyed by transactionId.
 */
export async function saveLocalReceipt(
  transactionId: string,
  file: File | Blob
): Promise<boolean> {
  try {
    const compressedBlob = await compressReceiptImage(file);
    const db = await openReceiptDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: StoredReceipt = {
        transactionId,
        blob: compressedBlob,
        mimeType: compressedBlob.type || 'image/jpeg',
        sizeBytes: compressedBlob.size,
        createdAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save receipt to IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieves a locally saved receipt image URL (Blob Object URL) for display.
 * Returns null if the receipt image was captured on a different device and is not in local IndexedDB.
 */
export async function getLocalReceipt(transactionId: string): Promise<string | null> {
  try {
    const db = await openReceiptDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(transactionId);
      req.onsuccess = () => {
        const record = req.result as StoredReceipt | undefined;
        if (record && record.blob) {
          resolve(URL.createObjectURL(record.blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Checks if a local receipt image exists in this browser's IndexedDB.
 */
export async function hasLocalReceipt(transactionId: string): Promise<boolean> {
  try {
    const db = await openReceiptDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count(transactionId);
      req.onsuccess = () => resolve(req.result > 0);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Deletes a receipt image from local IndexedDB when the transaction is deleted.
 */
export async function deleteLocalReceipt(transactionId: string): Promise<void> {
  try {
    const db = await openReceiptDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(transactionId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Graceful no-op
  }
}

