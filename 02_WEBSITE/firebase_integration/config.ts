import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// DrvLife Official Firebase Project (100% Free Firebase Spark Plan)
export const firebaseConfig = {
  apiKey: "AIzaSyAoOdoHxlOYwrBX_SYkZaUdaEWLdhgcCaM",
  authDomain: "drvlife-50995.firebaseapp.com",
  projectId: "drvlife-50995",
  messagingSenderId: "793531499006",
  appId: "1:793531499006:web:3089b8f29a4c5760df80af",
  measurementId: "G-DHDQ76DZ55"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
