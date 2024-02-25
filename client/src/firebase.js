// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fir-rtc-14328.firebaseapp.com",
  projectId: "fir-rtc-14328",
  storageBucket: "fir-rtc-14328.appspot.com",
  messagingSenderId: "42750159151",
  appId: "1:42750159151:web:aa544202c25462d9cfd9da",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
