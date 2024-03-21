import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = ({reviews}) => {
  const [vendorId, setVendorId] = useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (vendorId) {
      axios.get(`http://localhost:4444/rating/vendor/${vendorId}`)
        .then(response => {
          setRatings(response.data);
        })
        .catch(error => {
          console.error('Error fetching ratings:', error);
        });
    }
  }, [vendorId]);

  const handleVendorChange = (event) => {
    setVendorId(event.target.value);
  };

  return (
    <div>
      <label htmlFor="vendorId">Select a vendor:</label>
      <select id="vendorId" value={vendorId} onChange={handleVendorChange}>
        <option value="">Select a vendor</option>
        <option value="1">Vendor 1</option>
        <option value="2">Vendor 2</option>
        <option value="3">Vendor 3</option>
      </select>

      <h2>Ratings for Vendor {vendorId}</h2>
      <ul>
        {ratings.map(rating => (
          <li key={rating.rating_id}>
            <strong>Rating:</strong> {rating.rating} - <strong>Review:</strong> {rating.review_text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
