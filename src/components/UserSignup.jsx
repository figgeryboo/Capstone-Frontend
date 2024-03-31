import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/authContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';

const UserSignup = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setconfirmPassword] = useState('');
	const [isRegistering, setIsRegistering] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const { userLoggedIn } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isRegistering) {
			setIsRegistering(true);
			await doCreateUserWithEmailAndPassword(email, password);
		}
	};

	return (
		<>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				{userLoggedIn && <Navigate to={'/userdashboard'} replace={true} />}
				<Link to="/">
					<button type="button" class="btn-close" aria-label="Close"></button>
				</Link>

				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">User Sign Up</h2>
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
									disabled={isRegistering}
									type="password"
									autoComplete="new-password"
									required
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
							</Form.Group>
							<Form.Group id="password">
								<Form.Label>Password Confirmation</Form.Label>
								<Form.Control
									disabled={isRegistering}
									type="password"
									autoComplete="off"
									required
									value={confirmPassword}
									onChange={(e) => {
										setconfirmPassword(e.target.value);
									}}
								/>
							</Form.Group>
							{errorMessage && (
								<span className="text-red-600 font-bold">{errorMessage}</span>
							)}
							<Button
								type="submit"
								disabled={isRegistering}
								className={`mx-auto d-block text-white font-medium rounded-lg mt-2 ${
									isRegistering
										? 'bg-gray-300 cursor-not-allowed'
										: 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
								}`}
							>
								{isRegistering ? 'Signing Up...' : 'Sign Up'}
							</Button>
						</Form>
					</Card.Body>
				</Card>
				<div className="w-100 text-center mt-2">
					Already have an account? <Link to="/userlogin">Log In</Link>
				</div>
			</div>
		</>
	);
};

export default UserSignup;
