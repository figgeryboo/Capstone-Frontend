import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';

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
        <Button onClick={handleSignOut} className="w-100" variant="primary" size="lg" style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}>
          Sign Out
        </Button>
      ) : (
        <>
          <Link className="text-sm text-blue-600 underline" to={'/userlogin'}>
            User Login
          </Link>
          <Link className="text-sm text-blue-600 underline" to={'/usersignup'}>
            Register New Account
          </Link>
        </>
      )}
    </>
  );
};

export default UserSignOut;
