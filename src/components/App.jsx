import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UserSignup from './UserSignup';
import UserLogin from './UserLogin';
import UserDashboard from './UserDashboard';
import Landing from './Landing';
import CateringForm from './CateringForm';
import { AuthProvider } from '../contexts/authContext';
import Error404 from '../pages/Error404';
import Map from './Map';
import VendorDashboard from './vendor/VendorDashboard';
import VendorSignup from './vendor/VendorSignup';
import VendorLogin from './vendor/VendorLogin';
import NavigationFooter from './testing/NavigationFooter';
import StaticLocations from './StaticLocations';
import UserReviewsFeed from './testing/UserReviewsFeed';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: '100vh', backgroundColor: '#bcf5ef'}}
        >
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route exact path="/vendormapview" element={<Map />} />
              <Route exact path="/mapview" element={<Map />} />
              <Route exact path="/userdashboard" element={<UserDashboard />} />
              <Route path="/usersignup" element={<UserSignup />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route exact path="/vendordashboard" element={<VendorDashboard />} />
              <Route path="/vendorsignup" element={<VendorSignup />} />
              <Route path="/vendorlogin" element={<VendorLogin />} />
              <Route path="/usercatering" element={<CateringForm />} />
              <Route path="/userreviews" element={<UserReviewsFeed />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
		  <FooterWithConditionalRendering />
        </Container>
      </AuthProvider>
    </Router>
  );
}

function FooterWithConditionalRendering() {
  const location = useLocation();

  // Check if the current location matches any of the specified paths
  const shouldRenderFooter =
    ![
      '/',
      '/userlogin',
      '/usersignup',
      '/vendorlogin',
      '/vendorsignup'
    ].includes(location.pathname);

  // If the current location matches any of the paths, don't render the footer
  if (!shouldRenderFooter) {
    return null;
  }

  // Otherwise, render the NavigationFooter component
  return <NavigationFooter />;
}

export default App;
