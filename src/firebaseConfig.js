// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLhjuC0_HkdgRIlBVmN_nDp6AWwcIVxYk",
  authDomain: "studio-10-3a194.firebaseapp.com",
  projectId: "studio-10-3a194",
  messagingSenderId: "962822055267",
  appId: "1:962822055267:web:23a671a8909289c79a5f56",
  storageBucket:"studio-10-3a194.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
export const storage= getStorage(app);
