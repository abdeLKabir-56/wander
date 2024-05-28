// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-71aab.firebaseapp.com",
  projectId: "mern-blog-71aab",
  storageBucket: "mern-blog-71aab.appspot.com",
  messagingSenderId: "565579024784",
  appId: "1:565579024784:web:b7112b2f99b53958524b15",
  measurementId: "G-3N9B6RHJ5H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
console.log(app)