// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJpHzzTa0RZuVXNf4oeCG5Iem79RMHmA0",
  authDomain: "loan-95b54.firebaseapp.com",
  databaseURL: "https://loan-95b54-default-rtdb.firebaseio.com",
  projectId: "loan-95b54",
  storageBucket: "loan-95b54.appspot.com",
  messagingSenderId: "406655409430",
  appId: "1:406655409430:web:3f70ad32e22a4f9de6c437",
  measurementId: "G-05VTY6R82L"
};
  //write data in database

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
export default app;
