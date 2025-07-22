// STEP 1: Replace your firebase.js completely with this:

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug logging for Vercel
console.log('🔍 Firebase Config Status:');
console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? 'SET' : 'MISSING');
console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING'); 
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING');
console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'Server');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
