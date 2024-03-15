import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';

const UserSignOut = () => {
	const navigate = useNavigate();
	const { userLoggedIn } = useAuth();
	return (
		<>
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
					<Link className="text-sm text-blue-600 underline" to={'/userlogin'}>
						User Login
					</Link>
					<Link className="text-sm text-blue-600 underline" to={'/usersignup'}>
						Register New Account
					</Link>
				</>
			)}
		</>
	);
};

export default UserSignOut;
