// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseConfig?.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseConfig?.authDomain,
  projectId: Constants.expoConfig?.extra?.firebaseConfig?.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseConfig?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseConfig?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseConfig?.appId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
