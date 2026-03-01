import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// SETUP: Replace the values below with your Firebase project
// credentials from the Firebase Console:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or select existing)
// 3. Add a Web app to get your config
// 4. Enable Authentication (Email/Password)
// 5. Create a Firestore Database
// 6. Enable Storage
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAwmp5-Kz8QEkDi6gndGJzv8yfwRIuxrTo",
  authDomain: "pawprint-ab367.firebaseapp.com",
  projectId: "pawprint-ab367",
  storageBucket: "pawprint-ab367.firebasestorage.app",
  messagingSenderId: "1004475338306",
  appId: "1:1004475338306:web:25852b8393997c7717a7db",
  measurementId: "G-XC4CS0F9S2"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
