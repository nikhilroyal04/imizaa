import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { getUserByEmail, createUser } from './firestore';

// Register a new user
export async function registerUser(email, password, username, phoneNumber) {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, { displayName: username });
    
    // Create user document in Firestore
    await createUser({
      uid: user.uid,
      username,
      email,
      phoneNumber,
      role: 'user'
    });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        username,
        phoneNumber,
        role: 'user'
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Sign in a user
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get additional user data from Firestore
    const userData = await getUserByEmail(email);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        username: userData?.username || user.displayName,
        phoneNumber: userData?.phoneNumber,
        role: userData?.role || 'user'
      }
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Sign out a user
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get current user
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}
