import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { Button } from 'react-bootstrap';


const UserSignOut = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const handleSignOut = () => {
    doSignOut().then(() => {
      navigate('/');
    });
  };

  return (
    <>
      {userLoggedIn ? (
        <Button onClick={handleSignOut} to="#" className="w-100" variant="primary" size="lg" style={{ backgroundColor: "#EA3689", borderColor: "#EA3689", opacity: .25}}>
          Sign Out
        </Button>
      ) : (
        <>
          <Link className="text-sm text-blue-600 underline" to={'/vendorlogin'}>
        	Vendor Login
          </Link>
          <Link className="text-sm text-blue-600 underline" to={'/vendorsignup'}>
            Register New Account
          </Link>
        </>
      )}
    </>
  );
};

export default UserSignOut;
