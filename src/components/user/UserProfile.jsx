import React, { useState, useEffect } from "react";
import axios from "axios";
//import { Form, Button } from "react-bootstrap";
import { useAuth } from '../../contexts/authContext';

const UserProfile = () => {
  const api = import.meta.env.VITE_URL;

const { currentUser } = useAuth();

  const [customer, setCustomer] = useState({
    customer_id: "",
    name: "",
    contact_info: "",
    customer_image_url: "",
    location: "",
    loyalty_points: "",
    dietary_preferences: "",
  });

  useEffect(() => {
    if (currentUser) {
        setCustomer({ ...customer, customer_id: currentUser.uid });
    }
}, [currentUser]);

  useEffect(() => {
    axios
      .get(`${api}/customers/${customer.customer_id}`)
      .then((response) => {
        const user = response.data;
        console.log(user);

        setCustomer(user);
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  }, [customer.customer_id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`${api}/customers/${customer.customer_id}`, customer)
      .then((response) => console.log("Profile updated successfully"))
      .catch((error) => console.error("Error updating user profile:", error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <>
    <div>
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Contact Info:</strong> {customer.contact_info}</p>
            <p><strong>Customer Image URL:</strong> {customer.customer_image_url}</p>
            <p><strong>Location:</strong> {customer.location}</p>
            <p><strong>Loyalty Points:</strong> {customer.loyalty_points}</p>
            <p><strong>Dietary Preferences:</strong> {customer.dietary_preferences}</p>
            </div>
    </>
  );
};

export default UserProfile;
