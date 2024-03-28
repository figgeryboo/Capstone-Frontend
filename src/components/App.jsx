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
import VendorNavFooter from './testing/VendorNavFooter';
import UserReviewsFeed from './testing/UserReviewsFeed';
import LocationTracker from './LocationTracker';



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
              <Route exact path="/vendormapview" element={<LocationTracker />} />
              <Route exact path="/usermapview" element={<Map />} />
              <Route exact path="/userdashboard" element={<UserDashboard />} />
              <Route path="/usersignup" element={<UserSignup />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route exact path="/vendordashboard" element={<VendorDashboard />} />
              <Route path="/vendorsignup" element={<VendorSignup />} />
              <Route path="/vendorlogin" element={<VendorLogin />} />
              <Route path="/usercatering" element={<CateringForm />} />
              <Route path="/userratings" element={<UserReviewsFeed />} />
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

  // Define paths that should render the VendorNavFooter
  const vendorPaths = [
    '/vendormapview',
    '/vendordashboard',
    '/vendorcatering',
    '/analytics',
    // Add other vendor-specific paths here if needed
  ];

  // Check if the current location is a vendor path
  const isVendorPath = vendorPaths.some((path) => location.pathname.startsWith(path));

  // Check if the current location is one of the specified pages where footer should not be rendered
  const excludeFooterPaths = ['/', '/userlogin', '/usersignup', '/vendorlogin', '/vendorsignup'];
  const shouldRenderFooter = !excludeFooterPaths.includes(location.pathname);

  // If the current location is a vendor path and should render the footer, render the VendorNavFooter
  if (isVendorPath && shouldRenderFooter) {
    return <VendorNavFooter />;
  }

  // If the current location is one of the specified pages, do not render any footer
  if (excludeFooterPaths.includes(location.pathname)) {
    return null;
  }

  // Render the NavigationFooter component for all other pages
  return <NavigationFooter />;
}



export default App;
