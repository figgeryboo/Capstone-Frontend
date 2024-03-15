import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/authContext';
import UserSignOut from './UserSignOut';
import NavigationFooter from './testing/NavigationFooter';

const UserDashboard = () => {
	const { currentUser } = useAuth();
	return (
		<>
			<UserSignOut className="mb-5" />
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">
						Welcome{' '}
						{currentUser.displayName
							? currentUser.displayName
							: currentUser.email}
					</h2>
					<img src="/altcolors5.png" class="img-fluid" alt="WMIC Logo"></img>
					<div className="d-grid gap-2">
					<Link to="/usersettings">
						<Button className="w-100" variant="primary" size="lg" active>
							Profile Settings
						</Button>
						</Link>
						<Link to="/userrewards">
							<Button className="w-100" variant="primary" type="link" size="lg" active>
							Rewards
							</Button>
						</Link>
						<Link to="usersupport">
						<Button className="w-100"variant="primary" size="lg" disabled>
							Support
						</Button>
						</Link>
					</div>
				</Card.Body>
			</Card>
			<NavigationFooter />
		</>
	);
};

export default UserDashboard;
