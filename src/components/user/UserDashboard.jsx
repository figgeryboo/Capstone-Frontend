import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext';
import UserSignOut from './UserSignOut';
import './UserDashboard.css';

const UserDashboard = () => {
	const { currentUser } = useAuth();
	return (
		<>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				<Card>
					<Card.Body>
						<h3 className="text-center mb-4"> <i id="menu-image" className="bi bi-person-bounding-box"></i>
						 Welcome {' '}
							{currentUser.displayName
								? currentUser.displayName
								: currentUser.email}!
						</h3>
						<div className="d-grid gap-2">
							<Link to="/usersettings">
								<Button className="w-100" variant="primary" size="lg" disabled style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}>
									Profile Settings
								</Button>
							</Link>
							<Link to="/events">
								<Button className="w-100" variant="primary" size="lg" disabled style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}>
									Event Requests
								</Button>
							</Link>
							<Link to="/usersupport">
								<Button
								className="w-100" variant="primary" size="lg" active style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}>
								 
								{/* // 	className="w-100"
								// 	variant="primary"
								// 	type="link"
								// 	size="lg"
								// 	disable
								// 	style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}
								 */}
									Support
								</Button>
							</Link>
							<UserSignOut />
						</div>
					</Card.Body>
				</Card>
			</div>
		</>
	);
};

export default UserDashboard;
