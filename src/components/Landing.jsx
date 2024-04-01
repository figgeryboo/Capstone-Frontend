import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function Landing() {
	return (
		<>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				<div className="landing">
					<img
						src="./altcolors5.png"
						className="img-fluid"
						alt="WMIC Logo"
					></img>
				</div>
				<div className="mt-2 text-center">
					<Link to="/userlogin">
						<Button
							variant="primary"
							type="link"
							size="lg"
							className="text-white font-medium rounded-lg mt-3 ms-3 me-4"
							style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}
							active
						>
							User Login
						</Button>
					</Link>
					<Link to="/vendorlogin">
						<Button
							variant="primary"
							type="link"
							size="lg"
							className="text-white font-medium rounded-lg mt-3 ms-4 me-3"
							style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}
							active
						>
							Vendor Login
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
