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

// STEP 2: Replace your handleAuth function in App.js with this:

const handleAuth = async () => {
  // Debug check first
  console.log('🔐 Authentication attempt started');
  console.log('Environment variables check:');
  console.log('- API Key exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
  console.log('- Auth Domain exists:', !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
  console.log('- Project ID exists:', !!process.env.REACT_APP_FIREBASE_PROJECT_ID);
  
  if (!process.env.REACT_APP_FIREBASE_API_KEY) {
    alert('❌ Firebase not configured! Environment variables are missing.');
    console.error('Missing Firebase environment variables on Vercel');
    return;
  }
  
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  
  try {
    let user;
    console.log(`Attempting ${authMode}...`);
    
    if (authMode === 'login') {
      user = await signIn(email, password);
    } else {
      user = await signUp(email, password);
    }
    
    console.log('✅ Authentication successful');
    setUser(user);
  } catch (error) {
    console.error('❌ Authentication error:', error.code, error.message);
    
    if (error.code === 'auth/configuration-not-found') {
      alert('🚨 VERCEL ISSUE: Firebase configuration not found!\n\nThis means:\n1. Environment variables are not set in Vercel dashboard\n2. OR you need to redeploy after adding them\n3. OR there\'s a typo in the variable names');
    } else if (error.code === 'auth/email-already-in-use') {
      alert('Email already in use. Please login instead.');
    } else if (error.code === 'auth/weak-password') {
      alert('Password should be at least 6 characters.');
    } else if (error.code === 'auth/user-not-found') {
      alert('No account found with this email. Please sign up.');
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password. Please try again.');
    } else {
      alert(`Authentication failed: ${error.message}\n\nCode: ${error.code}`);
    }
  }
};

// STEP 3: Add this temporary debug div to your authentication screen
// Find the part in your App.js where you have the login form
// Add this right before the form (inside the main white container):

<div style={{
  background: '#fee2e2',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '16px',
  fontSize: '12px'
}}>
  <strong>🔍 Debug Info (remove after fixing):</strong>
  <div>Environment: {process.env.NODE_ENV}</div>
  <div>API Key: {process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</div>
  <div>Auth Domain: {process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</div>
  <div>Project ID: {process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</div>
  <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</div>
</div>
