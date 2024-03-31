import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext';
import VendorSignOut from './VendorSignOut';

const VendorDashboard = () => {
	const { currentUser } = useAuth();
	return (
		<>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">
							Welcome{' '}
							{currentUser.displayName
								? currentUser.displayName
								: currentUser.email}
						</h2>
						<div className="d-grid gap-2">
							<Link to="/vendormapview">
								<Button className="w-100" variant="primary" size="lg" active>
									Start My Route
								</Button>
							</Link>
							<div className="d-flex align-center">
								<Link to="/vendorcatering">
									<Button className="w-20" variant="secondary" size="sm">
										Inbound Catering Requests
									</Button>
									<br />
								</Link>
								<Button className="w-50" variant="secondary" size="sm">
									Chat Support
								</Button>
							</div>
						</div>
					</Card.Body>
				</Card>
				<br />
				<div className="mr-10">
					<VendorSignOut />
				</div>
			</div>
		</>
	);
};

export default VendorDashboard;
