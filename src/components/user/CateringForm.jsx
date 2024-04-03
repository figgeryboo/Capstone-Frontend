import React, { useState } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from '../../contexts/authContext';
import axios from "axios";

const CateringForm = () => {
  const api = import.meta.env.VITE_LOCAL_HOST;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customer_name: "",
    eventDate: "",
    eventTime: "",
    delivery_address: "",
    budget: "",
    menu_items: "",
    eventSize: "",
    dietary_options: "",
    special_instructions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [id]: type === "checkbox" ? checked : value,
  }));
  };

  const submitCateringForm = async () => {
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(`${api}/events`, formData);
      console.log(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getTime() + 6 * 7 * 24 * 60 * 60 * 1000); // 6 weeks in milliseconds
    return minDate.toISOString().split("T")[0];
  };

  return (
    <>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <div className="d-grid gap-2">
              {/* Step 1: Catering Intro Page */}
              {currentStep === 1 && (
                <>
                  <h2 className="text-center mb-2">Catering Request</h2>
                  <p className="text-center font-big">
                    Want to hire one of our vendors to cater your event? Fill
                    out the requested information and submit the form. Estimated
                    response time is 7-10 business days.
                  </p>
                </>
              )}
              {/* Step 2: Person Details Section */}
              {currentStep === 2 && (
                <>
                  <h2 className="text-center mb-2">Coordinator Details</h2>
                  <Form>
                    <Form.Group className="mb-4" controlId="customer_name">
                      <Form.Label>Coordinator Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contactInfo">
                      <Form.Label>Coordinator Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="example@example.com"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contactInfo">
                      <Form.Label>Coordinator Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="1234567890"
                        maxLength="10"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 3: Event Details */}
              {currentStep === 3 && (
                <>
                  <h2 className="text-center mb-2">Event Details</h2>
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group className="mb-4" controlId="eventDate">
                          <Form.Label>
                            Event Time (min 6 weeks advance)
                          </Form.Label>
                          <Form.Control
                            type="date"
                            required
                            min={getMinDate()}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-4" controlId="eventTime">
                          <Form.Label>Event Time</Form.Label>
                          <Form.Control
                            type="time"
                            required
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4" controlId="delivery_address">
                      <Form.Label>Event Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: 222 Maiden Lane StonyBook, AZ 70834"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="eventSize">
                      <Form.Label>Event Size</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="20"
                        min="20"
                        max="50"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 4: Group Details */}
              {currentStep === 4 && (
                <>
                  <h2 className="text-center mb-2">Group Details</h2>
                  <Form>
                    <Form.Group className="mb-4" controlId="budget">
                      <Form.Label>Max Budget </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Budget"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="dietary_options">
                      <Form.Label>Dietary Options</Form.Label>
                      <Form.Check type="checkbox" label="Dairy" onChange={handleChange}/>
                      <Form.Check type="checkbox" label="Non-Dairy" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="needUtensils">
                      <Form.Label>
                        Will You Need Additional Utensils?
                      </Form.Label>
                      <Form.Check
                        type="radio"
                        label="Yes"
                        name="needUtensils"
						onChange={handleChange}
                      />
                      <Form.Check type="radio" label="No" name="needUtensils" />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 5: Final Details/Submit */}
              {currentStep === 5 && (
                <>
                  <h2 className="text-center mb-2">Final Steps</h2>
                  <Form>
                    <Form.Group className="mb-4" controlId="howDidYouHear">
                      <Form.Label>How Did You Hear About Us?</Form.Label>
                      <Form.Control as="select">
                        <option value="">Select</option>
                        <option value="friend">Friend</option>
                        <option value="event">Event</option>
                        <option value="internet">Internet</option>
                        <option value="other">Other</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="special_instructions">
                      <Form.Label>Additional Comments:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={250}
                        placeholder="Comments"
						onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 6: Confirmation of Submission */}
              {currentStep === 6 && (
                <>
                  <h2 className="text-center mb-2">
                    Confirmation of Submission
                  </h2>
                  <p className="text-center font-big">
                    Thank you for submitting your request. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                </>
              )}
              {/* Navigation buttons */}
              {currentStep !== 1 && (
                <Button
                  onClick={handlePrevStep}
                  className="mx-2"
                  variant="secondary"
                  style={{ backgroundColor: "#ff5ea6", borderColor: "#ff5ea6" }}
                >
                  Previous
                </Button>
              )}
              {currentStep !== 6 ? (
                <Button
                  onClick={handleNextStep}
                  className="mx-2"
                  variant="primary"
                  style={{ backgroundColor: "#EA3187", borderColor: "#EA3187" }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={submitCateringForm}
                  className="mx-2"
                  variant="success"
                  style={{ backgroundColor: "#EA3187", borderColor: "#EA3187" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Your Request"}
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default CateringForm;