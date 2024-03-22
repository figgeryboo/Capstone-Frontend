import React, { useContext, useState, useEffect } from "react"
import { auth, onAuthStateChanged, GoogleAuthProvider } from "../../firebase/firebase"


const AuthContext = React.createContext()

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({ children }){
	const [currentUser, setCurrentUser] = useState(null)
	const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [isEmailUser, setIsEmailUser] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
	const [loading, setLoading] = useState(true)

	useEffect(()=>{
		const unsubscribe = onAuthStateChanged(auth, initializeUser)
		return unsubscribe
	}, [])

	async function initializeUser(user) {
		if (user) {
		  setCurrentUser({ ...user });
	
		  const isEmail = user.providerData.some(
			(provider) => provider.providerId === "password"
		  );
		  setIsEmailUser(isEmail);
	
		  const isGoogle = user.providerData.some(
			(provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
		  );
		  setIsGoogleUser(isGoogle);
	
		  // Check if the user is a vendor (you might have a better way to identify vendors)
		  const isVendor = user.providerData.some(
			(provider) => provider.providerId === "vendor-specific-provider-id"
		  );
	
		  setUserLoggedIn(true);
		} else {
		  setCurrentUser(null);
		  setUserLoggedIn(false);
		}
		setLoading(false);
	  }
	
	  const value = {
		userLoggedIn,
		isEmailUser,
		isGoogleUser,
		currentUser,
		setCurrentUser,
	  };
	
	  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
	}