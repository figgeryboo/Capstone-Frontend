import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from '../../contexts/authContext';


const UserProfile = () => {
  const api = import.meta.env.VITE_LOCAL_HOST;

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
      {/* <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={customer.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="contactInfo">
                <Form.Label>Contact Info</Form.Label>
                <Form.Control type="text" name="contact_info" value={customer.contact_info} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="customerImageUrl">
                <Form.Label>Customer Image URL</Form.Label>
                <Form.Control type="text" name="customer_image_url" value={customer.customer_image_url} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={customer.location} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="loyaltyPoints">
                <Form.Label>Loyalty Points</Form.Label>
                <Form.Control type="number" name="loyalty_points" value={customer.loyalty_points} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="dietaryPreferences">
                <Form.Label>Dietary Preferences</Form.Label>
                <Form.Control type="text" name="dietary_preferences" value={customer.dietary_preferences} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Update Profile
            </Button>
        </Form> */}
    </>
  );
};

export default UserProfile;
