// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "food-delivery-app-816df.firebaseapp.com",
  projectId: "food-delivery-app-816df",
  storageBucket: "food-delivery-app-816df.firebasestorage.app",
  messagingSenderId: "609700870181",
  appId: "1:609700870181:web:a0e2a11bafa12f81e9a7cc",
  measurementId: "G-C4Z3QCPDE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth}