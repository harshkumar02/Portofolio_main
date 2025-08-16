import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPJLUkAJqfq6e0BRZkuHkD5zKJ9_e5q-U",
  authDomain: "portfolio-1cae2.firebaseapp.com",
  projectId: "portfolio-1cae2",
  storageBucket: "portfolio-1cae2.firebasestorage.app",
  messagingSenderId: "499253190007",
  appId: "1:499253190007:web:59ccfd8c0ae7a3baf81572",
  measurementId: "G-8E95R6DZ3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, addDoc };