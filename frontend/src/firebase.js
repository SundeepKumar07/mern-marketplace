// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_FIREBASE_KEY,
  authDomain: "mern-market-place.firebaseapp.com",
  projectId: "mern-market-place",
  storageBucket: "mern-market-place.firebasestorage.app",
  messagingSenderId: "451781749626",
  appId: "1:451781749626:web:01db35f3c48d13f07144c3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);