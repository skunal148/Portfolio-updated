import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAmf4cDSNci2jU1XUKVmAqpTFGKs3uiEbM",
  authDomain: "portfoliobuilder-5a522.firebaseapp.com",
  projectId: "portfoliobuilder-5a522",
  storageBucket: "portfoliobuilder-5a522.firebasestorage.app",
  messagingSenderId: "596949120402",
  appId: "1:596949120402:web:dbb971596e1b05de70bd4b",
  measurementId: "G-PL04WFEKXR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();