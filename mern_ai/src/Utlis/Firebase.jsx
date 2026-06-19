 import { initializeApp } from "firebase/app";
 import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDcTcPDl56pxEfziU_nWQ0qR_cDIDwqo5s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "airesumechecker-27c7f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "airesumechecker-27c7f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "airesumechecker-27c7f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "279619884945",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:279619884945:web:b247a5cedcebdd2c41ac30",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BG5ZX97CEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
const provider=new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export {auth,provider};
