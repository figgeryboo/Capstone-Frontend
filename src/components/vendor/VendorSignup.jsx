import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { doCreateVendorWithEmailAndPassword } from '../../firebase/auth';

const VendorSignup = () => {
  const navigate = useNavigate();

  const [vendorName, setVendorName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [foodVendorId, setFoodVendorId] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [iceCreamCompany, setIceCreamCompany] = useState('');
  const [locationPermission, setLocationPermission] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { userLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        // Perform validation and check for missing fields
        if (
          !vendorName ||
          !email ||
          !password ||
          !confirmPassword ||
          !dob ||
          !foodVendorId ||
          !licenseId ||
          !licensePlate
        ) {
          throw new Error('All fields are required.');
        }

        // Perform additional validation if needed

        // Call the authentication function
        await doCreateVendorWithEmailAndPassword(email, password, {
          vendorName,
          dob,
          foodVendorId,
          licenseId,
          licensePlate,
          locationPermission,
        });

        // Redirect to vendor dashboard on successful registration
        navigate('/vendordashboard');
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={'/vendordashboard'} replace={true} />}
      <Link to="/">
        <button type="button" class="btn-close" aria-label="Close"></button>
      </Link>

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Vendor Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            {/* Add form fields here */}
            {/* Vendor Name */}
            <Form.Group id="vendorName">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </Form.Group>

            {/* Email */}
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group id="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            {/* Date of Birth */}
            <Form.Group id="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>

            {/* Food Vendor ID number */}
            <Form.Group id="foodVendorId">
              <Form.Label>Food Vendor ID number</Form.Label>
              <Form.Control
                type="text"
                required
                value={foodVendorId}
                onChange={(e) => setFoodVendorId(e.target.value)}
              />
            </Form.Group>

            {/* License ID number */}
            <Form.Group id="licenseId">
              <Form.Label>License ID number</Form.Label>
              <Form.Control
                type="text"
                required
                value={licenseId}
                onChange={(e) => setLicenseId(e.target.value)}
              />
            </Form.Group>

            {/* Ice Cream Truck License Plate number */}
            <Form.Group id="licensePlate">
              <Form.Label>Ice Cream Truck License Plate number</Form.Label>
              <Form.Control
                type="text"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </Form.Group>

            {/* Checkbox for location permissions */}
            <Form.Group id="locationPermission" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Consent to app location permissions"
                checked={locationPermission}
                onChange={(e) => setLocationPermission(e.target.checked)}
              />
            </Form.Group>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}
            <Button
              type="submit"
              disabled={isRegistering}
              className={`mx-auto d-block text-white font-medium rounded-lg mt-2 ${
                isRegistering
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
              }`}
            >
              {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/vendorlogin">Log In</Link>
      </div>
    </>
  );
};

export default VendorSignup;
