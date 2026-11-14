import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { UserProfile } from '../types/finance';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAnonymous: () => Promise<void>;
  register: (email: string, pass: string, name: string, income: number) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Listen to live profile updates with resilient fallback
        const unsubDoc = onSnapshot(
          userDocRef,
          (snap) => {
            if (snap.exists()) {
              setProfile(snap.data() as UserProfile);
            } else {
              const defProfile: UserProfile = {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
                email: currentUser.email || '',
                monthlyIncome: 50000,
                currency: '₹',
                autoSyncEnabled: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              };
              try {
                setDoc(userDocRef, defProfile, { merge: true });
              } catch {
                // Ignore cloud write error if offline
              }
              setProfile(defProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('Profile onSnapshot notice (using local offline profile):', error.message);
            const defProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              email: currentUser.email || '',
              monthlyIncome: 50000,
              currency: '₹',
              autoSyncEnabled: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            setProfile(defProfile);
            setLoading(false);
          }
        );

        return () => unsubDoc();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const loginAnonymous = async () => {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.warn('Anonymous auth falling back to ephemeral guest session:', e);
      const guestUid = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const guestUser = {
        uid: guestUid,
        email: 'guest@drvlife.local',
        displayName: 'Guest Demo User',
        isAnonymous: true,
      } as unknown as User;
      setUser(guestUser);
      setProfile({
        uid: guestUid,
        name: 'Guest Demo User',
        email: 'guest@drvlife.local',
        monthlyIncome: 65000,
        currency: '₹',
        autoSyncEnabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, income: number) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      name: name.trim() || 'User',
      email: cred.user.email || '',
      monthlyIncome: Number(income) || 50000,
      currency: '₹',
      autoSyncEnabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    } catch (err) {
      console.warn('Profile cloud write queued:', err);
    }
    setProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginAnonymous, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
