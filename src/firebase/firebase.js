import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {   
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  vapidKey: import.meta.env.VITE_VAPID_KEY
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app);
const messaging = getMessaging(app)
const vapidKey = firebaseConfig.vapidKey; 
// const analytics = getAnalytics(app);

// Notification.requestPermission().then((permission) => {
//   if (permission === 'granted') {
//     console.log('Notification permission granted.');
//     // Get the token
//     getToken(messaging, { vapidKey }).then((currentToken) => {
//       if (currentToken) {
//         console.log('Current token for client:', currentToken);
//         // Send the token to your server and save it for later use
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//       }
//     }).catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//     });
//   } else {
//     console.log('Unable to get permission to notify.');
//   }
// });



export {  auth, onAuthStateChanged, firestore, GoogleAuthProvider, messaging, onMessage};