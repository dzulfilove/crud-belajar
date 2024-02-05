// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZOCEWf1bygOramctJ0LOwCxk_nEykXU8",
  authDomain: "todolistapp-fe606.firebaseapp.com",
  projectId: "todolistapp-fe606",
  storageBucket: "todolistapp-fe606.appspot.com",
  messagingSenderId: "649731640116",
  appId: "1:649731640116:web:15fbcb0f5164eded457361",
  measurementId: "G-0JBRMBQHLZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const getAuthFB = getAuth(app);
