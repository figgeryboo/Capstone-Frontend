import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSignup from './UserSignup';
import UserLogin from './UserLogin';
import UserDashboard from './UserDashboard';
import Landing from './Landing';
import CateringForm from './CateringForm';
import { AuthProvider } from '../contexts/authContext';
import Error404 from '../pages/Error404';
import Map from './Map';
import StaticLocations from './StaticLocations';


function App() {
	return (
		<Container
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: '100vh' }}
		>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				<Router>
					<AuthProvider>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route exact path="/mapview" element={<Map/>} />
							<Route exact path="/userdashboard" element={<UserDashboard />} />
							<Route path="/usersignup" element={<UserSignup />} />
							<Route path="/userlogin" element={<UserLogin />} />
							<Route path="/usercatering" element={<CateringForm />} />
							<Route path="*" element={<Error404 />} />
						</Routes>
					</AuthProvider>
				</Router>
			</div>
		</Container>
	);
}

export default App;
