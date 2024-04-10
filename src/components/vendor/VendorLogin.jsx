import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import {
	doSignInVendorWithEmailAndPassword,
	doSignInWithGoogle,
} from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext/';

const VendorLogin = () => {
	const { userLoggedIn } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isSigningIn) {
			setIsSigningIn(true);
			await doSignInVendorWithEmailAndPassword(email, password);
		}
	};

	const onGoogleSignIn = (e) => {
		e.preventDefault();
		if (!isSigningIn) {
			setIsSigningIn(true);
			doSignInWithGoogle().catch((err) => {
				setIsSigningIn(false);
			});
		}
	};

	return (
		<>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				{userLoggedIn && <Navigate to={'/vendordashboard'} replace={true} />}
				<Link to="/">
					<button
						type="button"
						className="btn-close "
						aria-label="Close"
						style={{
							color: '#FFFF',
							marginLeft: '22em',
							backgroundColor: '#5ae0c8',
							borderRadius: '15px',
							padding: '8px',
							marginBottom: '5px',
						}}
					></button>
				</Link>
				<Card>
					<Card.Body>
						<h2 className="text-center mb-2">Vendor Log In</h2>
						<Form onSubmit={handleSubmit}>
							<Form.Group id="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									required
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
							</Form.Group>
							<Form.Group id="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									required
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
							</Form.Group>

							{errorMessage && (
								<span className="text-red-600 font-bold">{errorMessage}</span>
							)}
							<Button
								type="submit"
								disabled={isSigningIn}
								className={`mx-auto d-block text-white font-medium rounded-lg mt-2 ${
									isSigningIn
										? 'bg-gray-300 cursor-not-allowed'
										: 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
								}`}
							>
								{isSigningIn ? 'Signing In...' : 'Sign In'}
							</Button>
						</Form>
					</Card.Body>
				</Card>
				<Button
					disabled={isSigningIn}
					onClick={(e) => {
						onGoogleSignIn(e);
					}}
					className={`w-100 text-center mt-3 ${
						isSigningIn
							? 'cursor-not-allowed'
							: 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'
					}`}
				>
					<div>{isSigningIn ? 'Signing In...' : 'Sign in with Google'}</div>
				</Button>
				<div className="w-100 text-center mt-5">
					Need an account? <Link to="/vendorsignup">Sign Up</Link>
				</div>
			</div>
		</>
	);
};

export default VendorLogin;
