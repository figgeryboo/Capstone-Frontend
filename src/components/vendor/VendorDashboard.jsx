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
						<h3 className="text-center mb-3"> <i id="menu-image" className="bi bi-person-bounding-box"></i>
							 Welcome{' '}
							{currentUser.displayName
								? currentUser.displayName
								: currentUser.email}
						</h3>
						<div className="d-grid gap-2">
							<Link to="/vendormapview">
								<Button className="w-100" variant="primary" size="lg" active style={{ backgroundColor: "#EA3689", borderColor: "#EA3689"}}>
									Start My Route
								</Button>
							</Link>
							<div className="d-grid gap-2">
								<Link to="/vendorcatering">
								<Button className="w-100" variant="primary" size="lg" active style={{ backgroundColor: "#59E0C8", borderColor: "#59E0C8", color: "black"}}>
										Inbound Catering Requests
									</Button>
									<br />
								</Link>
								<Button className="w-100" variant="primary" size="lg" active style={{ backgroundColor: "#59E0C8", borderColor: "#59E0C8", color: "black"}}>
									See My Reviews
								</Button>
								<VendorSignOut />
							</div>
						</div>
					</Card.Body>
				</Card>
				<br />
			</div>
		</>
	);
};

export default VendorDashboard;
