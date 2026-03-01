import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err.code) });
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err.code) });
      throw err;
    }
  };

  const resendVerification = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err.code) });
      throw err;
    }
  };

  const reloadUser = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        dispatch({ type: 'SET_USER', payload: auth.currentUser });
      }
    } catch (err) {
      // silently fail
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err.code) });
      throw err;
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout, resetPassword, resendVerification, reloadUser, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function getErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
