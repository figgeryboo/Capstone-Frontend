import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

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
        <Link onClick={handleSignOut} className="text-sm text-blue-600 underline" to="#">
          Sign Out
        </Link>
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
