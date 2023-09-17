// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from '@firebase/auth';
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_bOsq70DMbICJIFfo6f1mefr09YTzpdo",
  authDomain: "waterloofucks.firebaseapp.com",
  projectId: "waterloofucks",
  storageBucket: "waterloofucks.appspot.com",
  messagingSenderId: "275198819771",
  appId: "1:275198819771:web:090f928225630b5810589e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);