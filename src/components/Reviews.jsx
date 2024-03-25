import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';

const VendorRatings = () => {
    const [vendorId, setVendorId] = useState(''); 
    const [ratings, setRatings] = useState([]);
const Reviews = ({reviews}) => {
  const [vendorId, setVendorId] = useState(null);
  const [ratings, setRatings] = useState([]);

    useEffect(() => {
        if (vendorId) {
            axios
                .get(`http://localhost:3003/rating/vendor/${vendorId}`)
                .then((response) => {
                    setRatings(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching ratings:', error);
                    setRatings([]); 
                });
        } else {
            setRatings([]); 
        }
    }, [vendorId]);

    const handleVendorChange = (event) => {
        setVendorId(event.target.value);
    };

    return (
        <Card>
            <Card.Body>
                <h2>Ratings for Vendor {vendorId}</h2>

                <Form.Group controlId="vendorId">
                    <Form.Label>Select from one of Our Vendors below: </Form.Label>
                    <Form.Select value={vendorId} onChange={handleVendorChange}>
                    <option style={{ color: '#aaa' }} value="" disabled>Select a vendor...</option>
                        <option value="1">Vendor 1</option>
                        <option value="2">Vendor 2</option>
                        <option value="3">Vendor 3</option>
                    </Form.Select>
                </Form.Group>
                <br/>
                <ul>
                    {ratings.map((rating) => (
                        <li key={rating.rating_id}>
                            <strong>Rating:</strong> {rating.rating} - <strong>Review:</strong>{' '}
                            {rating.review_text}
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
}
};

export default VendorRatings;
