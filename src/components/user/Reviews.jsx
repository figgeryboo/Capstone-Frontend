import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Card, Button } from "react-bootstrap";

const VendorRatings = () => {
  const [vendorId, setVendorId] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerImages, setCustomerImages] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [isVendorSelected, setIsVendorSelected] = useState(false);
  const api = import.meta.env.VITE_URL;

  useEffect(() => {
    axios
      .get(`${api}/vendors`)
      .then((response) => {
        setVendorOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
        setVendorOptions([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${api}/customers`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
        setCustomers([]);
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
          console.error("Error fetching ratings:", error);
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
        console.log("Review added successfully:", response.data);
        setReviewText("");
        setRating(1);
        axios
          .get(`${api}/reviews/vendor/${vendorId}`)
          .then((res) => {
            console.log("Updated reviews:", res.data);
            setRatings(res.data);
          })
          .catch((error) => {
            console.error("Error fetching updated reviews:", error);
          });
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  };

  const ratingEmojis = ["✰", "✰✰", "✰✰✰", "✰✰✰✰", "✰✰✰✰✰"];

  return (
    <div className="w-100" style={{ maxWidth: "450px" }}>
      <Card>
        <Card.Body>
          <h3>Ratings for Vendor {vendorId}</h3>

          <Form.Group controlId="vendorId">
            <Form.Label style={{marginLeft:"29px"}}> See what other customers are saying ⬇️</Form.Label>
            <Form.Select value={vendorId} onChange={handleVendorChange}>
              <option style={{ color: "#aaa" }} value="" disabled>
                Select a vendor...
              </option>
              {vendorOptions.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.vendor_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {ratings.length === 0 && isVendorSelected ? (
            <p>
              <br></br> No ratings available for this vendor.
            </p>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto"}}>
              <ul style={{ listStyle: "none"}}>
                <br />
                {ratings.map((rating, index) => (
                  <li
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {/* <i id="menu-image" className="bi bi-person-bounding-box"> </i>
                     */}
                    {customers.find(
                      (customer) => customer.customer_id === rating.user_id
                    ) && (
                      <img
                        id="customer_image"
                        src={
                          customers.find(
                            (customer) =>
                              customer.customer_id === rating.user_id
                          ).customer_image_url
                        }
                        alt={`Customer ${rating.user_id}`}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                         marginBottom: "27px",
                          borderRadius: "60px",
                          border: "2px solid #EB428F",
                          borderColor: "#EB428F"
                        }}
                      />
                    )}
                    <br />
                    {/* <strong>User Says:</strong> {rating.review_text} */}
                    <div style={{ marginLeft: "10px" }}>
                    <strong>
                      {
                        customers
                          .find(
                            (customer) =>
                              customer.customer_id === rating.user_id
                          )
                          ?.customer_name.split(" ")[0]
                      }{" "}
                      says:
                    </strong>{" "}
                    {rating.review_text}
                    <br />
                    <strong>Rating:</strong>{" "}
                    {ratingEmojis[Math.floor(rating.rating) - 1]}
                    {rating.rating % 1 !== 0 && "✰"} <br />
                    <br />
                    </div>
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
                  style={{ color: "#ea3689"}}
                >
                  <option value={1}>✰</option>
                  <option value={2}>✰✰</option>
                  <option value={3}>✰✰✰</option>
                  <option value={4}>✰✰✰✰</option>
                  <option value={5}>✰✰✰✰✰</option>
                </Form.Control>
              </Form.Group>
              <br />
              <Button type="submit">Add New Review</Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default VendorRatings;
