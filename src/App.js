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
