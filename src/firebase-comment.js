import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDPJLUkAJqfq6e0BRZkuHkD5zKJ9_e5q-U",
  authDomain: "portfolio-1cae2.firebaseapp.com",
  projectId: "portfolio-1cae2",
  storageBucket: "portfolio-1cae2.firebasestorage.app",
  messagingSenderId: "499253190007",
  appId: "1:499253190007:web:59ccfd8c0ae7a3baf81572",
  measurementId: "G-8E95R6DZ3Q"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };