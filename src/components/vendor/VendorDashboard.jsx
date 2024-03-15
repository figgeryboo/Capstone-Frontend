import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext';
import UserSignOut from '../UserSignOut';

const VendorDashboard = () => {
	const { currentUser } = useAuth();
	return (
		<>
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
					<Link to="/vendormapview">
						<Button className="w-100" variant="primary" size="lg" active>
							Start My Route
						</Button>
						</Link>
							<Button className="w-100" variant="primary" type="link" size="lg" active>
								Incoming Catering Requests
							</Button>
						<Button className="w-100"variant="primary" size="lg" disabled>
							Support
						</Button>
						<Button className="w-100"variant="primary" size="lg" disabled>
						<UserSignOut />
						</Button>
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

export default VendorDashboard;
