import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoVojsDxPvBBYwq1OjzrdRM--iJNq6Wr0",
  authDomain: "ecommerceapp-5c73a.firebaseapp.com",
  projectId: "ecommerceapp-5c73a",
  storageBucket: "ecommerceapp-5c73a.firebasestorage.app",
  messagingSenderId: "231377253173",
  appId: "1:231377253173:web:3984b4b0be8ff0a9e1d27c",
  measurementId: "G-MMP43ZW92Q"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;