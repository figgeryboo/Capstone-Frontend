import { collection } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  // sendPasswordResetEmail,
  // updatePassword,
  // sendEmailVerification,
} from "firebase/auth";
import axios  from "axios";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  // return createUserWithEmailAndPassword(auth, email, password);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("user:", user);

    await axios.post("https://capstone-backend-vi3e.onrender.com/firebase/sendUserToPostgres", {
      uid: user.uid,
      email: user.email,
    });

    await firestore.collection("users").doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      token: token,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const doSignInUserWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doCreateVendorWithEmailAndPassword = async (
  email,
  password,
  vendorData
) => {
  try {
    const 
    vendorCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const vendor = vendorCredential.user;
    console.log("Posting vendor data:", {
      uid: vendor.uid,
      email: vendor.email,
      displayName: vendor.displayName
  
    });
    
    await axios.post("https://capstone-backend-vi3e.onrender.com/firebase/sendAllVendorsToPostgres", {
      uid: vendor.uid,
      email: vendor.email,
      displayName: vendor.displayName
     
    }).catch(error => {
      console.error("Error posting vendor data:", error);
      throw error;
    });
    // Update user profile (display name, etc.)
    await firestore.collection("vendors").doc(vendor.uid).set({
      email: vendor.email,
      displayName: vendor.displayName,
      token: token,
    });
    await updateProfile(vendor, { displayName: vendorData.vendorName });

    // Store additional vendor data in Firestore
    await updateVendorData(user.uid, vendorData);

    // Set the initial verification status (e.g., 'pending')
    await updateVerificationStatus(user.uid, "pending");

    return user;
  } catch (error) {
    throw error;
  }
};

export const updateVendorData = async (uid, vendorData) => {
  try {
    // Create a new document for the vendor in the 'vendors' collection
    await firestore.collection("vendors").doc(uid).set(vendorData);
  } catch (error) {
    throw error;
  }
};

export const updateVerificationStatus = async (uid, status) => {
  try {
    // Update the verification status in the vendor's document
    await firestore
      .collection("vendors")
      .doc(uid)
      .update({ verificationStatus: status });
  } catch (error) {
    throw error;
  }
};

export const doSignInVendorWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
};

export const doSignOut = () => {
  return auth.signOut();
};

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// }
// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password)
// }

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     })
// }
