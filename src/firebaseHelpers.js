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

// Card functions
export const saveCard = async (userId, cardData) => {
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      ...cardData,
      userId,
      createdAt: serverTimestamp()
    });
    return { ...cardData, id: docRef.id };
  } catch (error) {
    console.error('Error saving card:', error);
    throw error;
  }
};

export const getCards = async (userId) => {
  try {
    const q = query(
      collection(db, 'cards'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const cards = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() });
    });
    return cards;
  } catch (error) {
    console.error('Error getting cards:', error);
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