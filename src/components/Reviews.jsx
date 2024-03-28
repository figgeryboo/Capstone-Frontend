import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Card } from 'react-bootstrap';

const VendorRatings = () => {
    const [vendorId, setVendorId] = useState('');
    const [vendorOptions, setVendorOptions] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        // Fetch vendor options from backend
        axios
            .get('http://localhost:4444/vendors')
            .then((response) => {
                setVendorOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching vendors:', error);
                setVendorOptions([]);
            });
    }, []);

    useEffect(() => {
        if (vendorId) {
            axios
                .get(`http://localhost:4444/rating/vendor/${vendorId}`)
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
                        <option style={{ color: '#aaa' }} value="" disabled>
                            Select a vendor...
                        </option>
                        {vendorOptions.map((vendor) => (
                            <option key={vendor.vendor_id} value={vendor.vendor_id}>
                                {vendor.vendor_name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <br />
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
};

export default VendorRatings;
