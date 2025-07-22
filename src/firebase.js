// STEP 1: Replace your firebase.js with this debug version

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Debug function to log environment
const debugEnvironment = () => {
  console.log('🔍 VERCEL + FIREBASE DEBUG REPORT');
  console.log('================================');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Platform:', typeof window !== 'undefined' ? 'Browser' : 'Server');
  
  // Check all Firebase env vars
  const envVars = {
    'REACT_APP_FIREBASE_API_KEY': process.env.REACT_APP_FIREBASE_API_KEY,
    'REACT_APP_FIREBASE_AUTH_DOMAIN': process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    'REACT_APP_FIREBASE_PROJECT_ID': process.env.REACT_APP_FIREBASE_PROJECT_ID,
    'REACT_APP_FIREBASE_STORAGE_BUCKET': process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID': process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    'REACT_APP_FIREBASE_APP_ID': process.env.REACT_APP_FIREBASE_APP_ID
  };
  
  let allPresent = true;
  Object.entries(envVars).forEach(([key, value]) => {
    const status = value ? '✅ PRESENT' : '❌ MISSING';
    console.log(`${key}: ${status}`);
    if (!value) allPresent = false;
  });
  
  console.log('================================');
  return allPresent;
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug the environment first
const envOK = debugEnvironment();

// Initialize Firebase with error handling
let app, auth, db;
try {
  console.log('🚀 Attempting Firebase initialization...');
  console.log('Config object:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    authDomainValue: firebaseConfig.authDomain,
    projectIdValue: firebaseConfig.projectId
  });
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully!');
  console.log('Auth object:', !!auth);
  console.log('Firestore object:', !!db);
  
} catch (error) {
  console.error('❌ Firebase initialization failed!');
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  console.error('Full error:', error);
  
  // Create fallback objects to prevent app crashes
  auth = null;
  db = null;
}

// Export with additional debugging
export { auth, db };

// Add a function to check Firebase status
export const checkFirebaseStatus = () => {
  return {
    initialized: !!auth && !!db,
    auth: !!auth,
    db: !!db,
    envVarsPresent: envOK,
    config: {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId
    }
  };
};

// STEP 2: Add this to your firebaseHelpers.js at the top

import { auth, db, checkFirebaseStatus } from './firebase';

// Debug wrapper for auth functions
const debugAuth = (functionName, originalFunction) => {
  return async (...args) => {
    console.log(`🔐 ${functionName} called`);
    const status = checkFirebaseStatus();
    console.log('Firebase status:', status);
    
    if (!status.initialized) {
      console.error(`❌ ${functionName} failed: Firebase not initialized`);
      throw new Error('Firebase not initialized. Check environment variables.');
    }
    
    try {
      const result = await originalFunction(...args);
      console.log(`✅ ${functionName} succeeded`);
      return result;
    } catch (error) {
      console.error(`❌ ${functionName} failed:`, error.code, error.message);
      throw error;
    }
  };
};

// STEP 3: Add this check function to your App.js

const VercelFirebaseDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  
  useEffect(() => {
    const status = checkFirebaseStatus();
    setDebugInfo({
      ...status,
      currentURL: window.location.href,
      isVercel: window.location.href.includes('vercel.app'),
      timestamp: new Date().toISOString()
    });
  }, []);
  
  if (!debugInfo) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: debugInfo.initialized ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      wordBreak: 'break-word'
    }}>
      <strong>Firebase Debug Panel</strong>
      <div>Status: {debugInfo.initialized ? '✅ OK' : '❌ FAILED'}</div>
      <div>URL: {debugInfo.currentURL}</div>
      <div>Is Vercel: {debugInfo.isVercel ? 'Yes' : 'No'}</div>
      <div>Auth: {debugInfo.auth ? '✅' : '❌'}</div>
      <div>DB: {debugInfo.db ? '✅' : '❌'}</div>
      <div>Env Vars: {debugInfo.envVarsPresent ? '✅' : '❌'}</div>
      <div>Time: {debugInfo.timestamp}</div>
      {!debugInfo.initialized && (
        <div style={{marginTop: '10px', fontSize: '11px'}}>
          <strong>Likely Issues:</strong>
          <br/>• Environment variables not set in Vercel
          <br/>• Domain not authorized in Firebase
          <br/>• Firebase project misconfigured
        </div>
      )}
    </div>
  );
};

// STEP 4: Add this component to your main App.js return statement
// Add <VercelFirebaseDebugPanel /> right after your opening <div>

// STEP 5: Test Authentication with Debug
const handleAuthWithDebug = async () => {
  console.log('🔐 Starting authentication process...');
  const status = checkFirebaseStatus();
  console.log('Pre-auth Firebase status:', status);
  
  if (!status.initialized) {
    alert('Firebase is not initialized! Check the debug panel in top-right corner.');
    return;
  }
  
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  
  try {
    let user;
    if (authMode === 'login') {
      console.log('Attempting sign in...');
      user = await signIn(email, password);
    } else {
      console.log('Attempting sign up...');
      user = await signUp(email, password);
    }
    console.log('✅ Authentication successful:', user);
    setUser(user);
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    if (error.code === 'auth/configuration-not-found') {
      alert('Firebase configuration not found! This means environment variables are missing or incorrect.');
    } else {
      alert(`Authentication failed: ${error.message}`);
    }
  }
};
