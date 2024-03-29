import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';

const VendorSignOut = () => {
	const navigate = useNavigate();
	const { userLoggedIn } = useAuth();
	return (
		<nav className="flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200">
			{userLoggedIn ? (
				<>
					<button
						onClick={() => {
							doSignOut().then(() => {
								navigate('/');
							});
						}}
						className="text-sm text-blue-600 underline"
					>
						Logout
					</button>
				</>
			) : (
				<>
					<Link className="text-sm text-blue-600 underline" to={'/vendorlogin'}>
						Vendor Login
					</Link>
					<Link className="text-sm text-blue-600 underline" to={'/vendorsignup'}>
						Register New Account
					</Link>
				</>
			)}
		</nav>
	);
};

export default VendorSignOut;
