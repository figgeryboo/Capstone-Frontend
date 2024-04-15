import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UserSignup from './user/UserSignup';
import UserLogin from './user/UserLogin';
import UserDashboard from './user/UserDashboard';
import Landing from './pages/Landing';
import CateringForm from './user/CateringForm';
import { AuthProvider } from '../contexts/authContext';
import Error404 from './pages/Error404';
import Map from './user/Map';
import VendorDashboard from './vendor/VendorDashboard';
import VendorSignup from './vendor/VendorSignup';
import VendorLogin from './vendor/VendorLogin';
import NavigationFooter from './pages/NavigationFooter';
import VendorNavFooter from './vendor/VendorNavFooter';
import UserReviewsFeed from './user/UserReviewsFeed';
import LocationTracker from './vendor/LocationTracker';
import HeaderWithConditionalRendering from './pages/Header';
import CateringRequests from './vendor/CateringRequests';
import PaymentForm from './pages/PaymentForm';
import VendorAnalytics from './vendor/VendorAnalytics';



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
              <Route path="/pay" element={<PaymentForm />} />
              <Route exact path="/vendormapview" element={<LocationTracker />} />
              <Route exact path="/usermapview" element={<Map />} />
              <Route exact path="/userdashboard" element={<UserDashboard />} />
              <Route path="/usersignup" element={<UserSignup />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route exact path="/vendordashboard" element={<VendorDashboard />} />
              <Route path="/vendorsignup" element={<VendorSignup />} />
              <Route path="/vendorlogin" element={<VendorLogin />} />
              <Route path="/vendoranalytics" element={<VendorAnalytics />} />
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
    '/vendoranalytics',
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
