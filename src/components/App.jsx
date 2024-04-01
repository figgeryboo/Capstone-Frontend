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
import HeaderWithConditionalRendering from './Header';
import CateringRequests from './vendor/CateringRequests';



function App() {
  return (
    <Router>
      <AuthProvider>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: '100vh', backgroundColor: '#bcf5ef'}}
        >
            <HeaderWithConditionalRendering />
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
              <Route path="/vendorcatering" element={<CateringRequests />} />
              <Route path="/usercatering" element={<CateringForm />} />
              <Route path="/userratings" element={<UserReviewsFeed />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
		  <FooterWithConditionalRendering />
        </Container>
      </AuthProvider>
    </Router>
  );
}

function FooterWithConditionalRendering() {
  const location = useLocation();

  const vendorPaths = [
    '/vendormapview',
    '/vendordashboard',
    '/vendorcatering',
    '/analytics',
  ];

  const isVendorPath = vendorPaths.some((path) => location.pathname.startsWith(path));

  const excludeFooterPaths = ['/', '/userlogin', '/usersignup', '/vendorlogin', '/vendorsignup'];
  const shouldRenderFooter = !excludeFooterPaths.includes(location.pathname);

  if (isVendorPath && shouldRenderFooter) {
    return <VendorNavFooter />;
  }

  if (excludeFooterPaths.includes(location.pathname)) {
    return null;
  }

  return <NavigationFooter />;
}



export default App;
