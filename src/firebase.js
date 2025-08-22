// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbXja-KPink-aIda9T_0_jl6B4iBQ8hQc",
  authDomain: "expense-tracker-2bd10.firebaseapp.com",
  projectId: "expense-tracker-2bd10",
  storageBucket: "expense-tracker-2bd10.firebasestorage.app",
  messagingSenderId: "1030963223273",
  appId: "1:1030963223273:web:168f093a2a30a082fcee78",
  measurementId: "G-X21KZN2DSH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };