// firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoVojsDxPvBBYwq1OjzrdRM--iJNq6Wr0",
  authDomain: "ecommerceapp-5c73a.firebaseapp.com",
  projectId: "ecommerceapp-5c73a",
  storageBucket: "ecommerceapp-5c73a.firebasestorage.app",
  messagingSenderId: "231377253173",
  appId: "1:231377253173:web:3984b4b0be8ff0a9e1d27c",
  measurementId: "G-MMP43ZW92Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;