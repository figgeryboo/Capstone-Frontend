import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Card, Button } from 'react-bootstrap';


const VendorRatings = () => {
  const [vendorId, setVendorId] = useState('');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1); 
  const [isVendorSelected, setIsVendorSelected] = useState(false); 
  const api = import.meta.env.VITE_LOCAL_HOST;

  useEffect(() => {
    axios
      .get(`${api}/vendors`)
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
      setIsVendorSelected(true);
      axios
        .get(`${api}/reviews/vendor/${vendorId}`)
        .then(async (response) => {
          const vendorsObj = response.data;
          const vendorMap = {};
          vendorOptions.forEach((vendor) => {
            vendorMap[vendor.vendor_id] = vendor.vendor_name;
          });
          const reviewsWithVendorNames = vendorsObj.map((review) => ({
            ...review,
            vendor_name: vendorMap[review.vendor_id],
          }));
          setRatings(reviewsWithVendorNames);
        })
        .catch((error) => {
          console.error('Error fetching ratings:', error);
          setRatings([]);
        });
    } else {
      setIsVendorSelected(false); 
      setRatings([]);
    }
  }, [vendorId, vendorOptions]);

  const handleVendorChange = (event) => {
    setVendorId(event.target.value);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const userId = Math.floor(Math.random() * 7) + 1;
    axios
      .post(`${api}/reviews/vendor/${vendorId}`, {
        userId,
        vendorId,
        reviewText,
        rating: parseInt(rating),
        ratingDate: new Date().toISOString(),
      })
      .then((response) => {
        console.log('Review added successfully:', response.data); 
        setReviewText('');
        setRating(1);
        axios.get(`${api}/reviews/vendor/${vendorId}`)
          .then((res) => {
            console.log('Updated reviews:', res.data); 
            setRatings(res.data);
          })
          .catch((error) => {
            console.error('Error fetching updated reviews:', error); 
          });
      })
      .catch((error) => {
        console.error('Error adding review:', error); 
      });
  };
  

  const ratingEmojis = ['✰', '✰✰', '✰✰✰', '✰✰✰✰', '✰✰✰✰✰'];

  return (
    <div className="w-100" style={{ maxWidth: '450px' }}>
      <Card>
        <Card.Body>
          <h3>Ratings for Vendor {vendorId}</h3>

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

          {ratings.length === 0 ? (
            <p>
              <br></br> No ratings available for this vendor.
            </p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none' }}>
              <br />
              {ratings.map((rating) => (
                <li key={rating.rating_id}>
                  <i id="menu-image" className="bi bi-person-bounding-box"> </i>
                  <br />
                  <strong>User Says:</strong> {rating.review_text}
                  <br />
                  <strong>Rating:</strong>{' '}
                  {ratingEmojis[Math.floor(rating.rating) - 1]}
                  {rating.rating % 1 !== 0 && '✰'}{' '}
                  <br />
                  <br />
                </li>
              ))}
            </ul>
            </div>
          )}

          {isVendorSelected && (
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group controlId="reviewText">
                <Form.Label>Write your review:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="rating">
                <Form.Label>Rate this vendor:</Form.Label>
                <Form.Control
                  as="select"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  <option value={1}>✰</option>
                  <option value={2}>✰✰</option>
                  <option value={3}>✰✰✰</option>
                  <option value={4}>✰✰✰✰</option>
                  <option value={5}>✰✰✰✰✰</option>
                </Form.Control>
              </Form.Group>
              <br/>
              <Button type="submit">Add New Review</Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default VendorRatings;
