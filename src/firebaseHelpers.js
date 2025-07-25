import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile document
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: serverTimestamp(),
      streak: { days: 0, lastDate: null }
    });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Replace your saveCard function with this:

export const saveCard = async (userId, cardData) => {
  try {
    console.log('💾 Attempting to save card for user:', userId);
    console.log('💾 Card data:', cardData);
    
    const cardWithMetadata = {
      ...cardData,
      userId,
      createdAt: serverTimestamp(),
      // Keep the original dateAdded if it exists, or use current time
      dateAdded: cardData.dateAdded || new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'cards'), cardWithMetadata);
    console.log('✅ Card saved successfully with ID:', docRef.id);
    
    // Return the card with the actual createdAt timestamp
    const savedCard = {
      ...cardWithMetadata,
      id: docRef.id,
      createdAt: new Date().toISOString() // Use current time for immediate display
    };
    
    console.log('✅ Returning saved card:', savedCard);
    return savedCard;
  } catch (error) {
    console.error('❌ Error saving card:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};

// Replace your getCards function with this temporarily:

export const getCards = async (userId) => {
  try {
    console.log('📥 Loading cards for user:', userId);
    
    // Simplified query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'cards'), 
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const cards = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in JavaScript instead of Firestore
    cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('✅ Cards loaded successfully:', cards.length, 'cards found');
    console.log('✅ Cards data:', cards);
    return cards;
  } catch (error) {
    console.error('❌ Error loading cards:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // If the error is because the index doesn't exist yet, return empty array
    if (error.code === 'failed-precondition') {
      console.log('ℹ️ Index not ready yet, returning empty array');
      return [];
    }
    
    // Don't throw error, return empty array to prevent app crash
    return [];
  }
};

export const deleteCard = async (cardId) => {
  try {
    await deleteDoc(doc(db, 'cards', cardId));
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

// Streak functions
export const updateStreak = async (userId, streakData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      streak: streakData
    }, { merge: true });
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

export const getStreak = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().streak) {
      return docSnap.data().streak;
    }
    return { days: 0, lastDate: null };
  } catch (error) {
    console.error('Error getting streak:', error);
    return { days: 0, lastDate: null };
  }
};
