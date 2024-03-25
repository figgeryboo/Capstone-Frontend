import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {   
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app);



export {  auth, onAuthStateChanged, firestore, GoogleAuthProvider  };