import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, GoogleAuthProvider, getIdToken } from "firebase/auth"
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, get the JWT token
//     // console.log("User:", user);
//     user.getIdToken().then((token)=>{ console.log(token)
//       setToken(token)})
    
//   } else {
//     // User is signed out
//     console.log("User is signed out");
//   }
// });



export {  auth, onAuthStateChanged, firestore, GoogleAuthProvider, analytics  };