import React, { useEffect, useState } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

const CateringForm = () => {
  const api = import.meta.env.VITE_URL;
  const { currentUser } = useAuth();
  const email = currentUser.email

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customer_id: currentUser.uid,
    customer_name: "",
    customer_email: email,
    contact_info: "",
    event_date: "",
    event_time: "",
    delivery_location: "",
    budget: "",
    menu_items: "",
    event_size: "",
    dietary_options: "",
    special_instructions: "",
    confirmed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deposit, setDeposit] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menu, setMenu] = useState([]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === "menu_items") {
      if (checked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          menu_items: [...prevFormData.menu_items, value],
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          menu_items: prevFormData.menu_items.filter((item) => item !== value),
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
    if (id === "budget" && !isNaN(value) && value !== "") {
      const depositValue = parseFloat(value) * 0.3;
      setDeposit(depositValue.toFixed(2));
    }
  };

  useEffect(() => {
    if (currentStep === 3) {
      const input = document.getElementById("delivery_location");
      if (!input) {
        console.error("Input element not found.");
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ["geocode"],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.error("No address selected");
          return;
        }
        const address = place.formatted_address;
        setFormData((prevFormData) => ({
          ...prevFormData,
          delivery_location: address,
        }));
      });
    }
  }, [currentStep]);

  useEffect(() => {
    const menuFetch = async () => {
      try {
        const vendorsResponse = await axios.get(`${api}/vendors`);
        const menus = await Promise.all(
          vendorsResponse.data.map(async (vendor) => {
            const menuResponse = await axios.get(
              `${api}/vendors/${vendor.vendor_id}`
            );
            return {
              vendor_id: vendor.vendor_id,
              menu_items: menuResponse.data.menu.map((item) => item.name),
            };
          })
        );
        setMenu(menus);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    menuFetch();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const submitCateringForm = async () => {
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(`${api}/events`, formData);
      console.log(response.data);

      setFormData(formData);
      setSnackbarOpen(true);
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
                  <h3 className="text-center mb-2">Catering Request</h3>
                  <p className="text-center mb-2">
                    <b>Excited to add some flavor to your event? </b>
                    <hr />
                    Our vendors are ready to impress!
                    <br />
                    Fill in all the requested information to get started & we'll
                    whip up a customized proposal just for you.
                  </p>
                  <sub className="text-center mt-2">
                    <i>Estimated response times are 7-14 business days.</i>
                  </sub>
                  <br />
                </>
              )}
              {/* Step 2: Person Details Section */}
              {currentStep === 2 && (
                <>
                  <h3 className="text-center mb-2">Coordinator Details</h3>
                  <Form>
                    <Form.Group className="mb-4" controlId="customer_name">
                      <Form.Label>Coordinator Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        required
                        onChange={handleChange}
                        value={formData.customer_name}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="customer_email">
                      <Form.Label>Coordinator Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="example@example.com"
                        required
                        onChange={handleChange}
                        value={formData.customer_email}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contact_info">
                      <Form.Label>Coordinator Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="1234567890"
                        maxLength="10"
                        required
                        onChange={handleChange}
                        value={formData.contact_info}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 3: Event Details */}
              {currentStep === 3 && (
                <>
                  <h3 className="text-center mb-2">Event Details</h3>
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group className="mb-4" controlId="event_date">
                          <Form.Label>Event Date</Form.Label>
                          <Form.Control
                            type="date"
                            required
                            min={getMinDate()}
                            onChange={handleChange}
                            value={formData.event_date}
                          />
                          <sub>
                            <p className=" mt-2 text-muted">
                              Min. 6 weeks advance
                            </p>
                          </sub>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-4" controlId="event_time">
                          <Form.Label>Event Time</Form.Label>
                          <Form.Control
                            type="time"
                            required
                            onChange={handleChange}
                            value={formData.event_time}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group
                      className="mt-2 mb-4"
                      controlId="delivery_location"
                    >
                      <Form.Label>Event Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: 222 Maiden Lane StonyBook, AZ 70834"
                        required
                        onChange={handleChange}
                        value={formData.delivery_location}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="event_size">
                      <Form.Label>Event Size</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="20"
                        min="20"
                        max="50"
                        required
                        onChange={handleChange}
                        value={formData.event_size}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 4: Group Details */}
              {currentStep === 4 && (
                <>
                  <h3 className="text-center mb-2">Group Details</h3>
                  <Form>
                    <Form.Group className="mb-4" controlId="budget">
                      <Form.Label>Max Budget USD</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Budget"
                        required
                        onChange={handleChange}
                        value={formData.budget}
                      />
                      {deposit && (
                        <div style={{ color: "green" }}>
                          Required 30% Deposit: ${deposit}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="dietary_options">
                      <Form.Label>Dietary Options</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label="Dairy"
                        onChange={handleChange}
                        value={formData.dietary_options}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Non-Dairy"
                        onChange={handleChange}
                      />
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
                        value="true"
                        checked={formData.needUtensils === "true"}
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        name="needUtensils"
                        onChange={handleChange}
                        value="false"
                        checked={formData.needUtensils === "false"}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {currentStep === 5 && (
                <>
                  <h3 className="text-center mb-2"> Choose Menu Items </h3>
                  <Form>
                    <Form.Group
                      className="mb-4"
                      controlId="menu_items"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {menu.map((vendor) => (
                        <div key={vendor.vendor_id}>
                          <h5>{vendor.vendor_name}</h5>
                          {vendor.menu_items.map((item) => (
                            <Form.Check
                              key={item}
                              type="checkbox"
                              id={item}
                              label={item}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    menu_items: [...prev.menu_items, item],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    menu_items: prev.menu_items.filter(
                                      (i) => i !== item
                                    ),
                                  }));
                                }
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 6: Final Details/Submit */}
              {currentStep === 6 && (
                <>
                  <h3 className="text-center mb-2">Final Steps</h3>
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

                    <Form.Group
                      className="mb-4"
                      controlId="special_instructions"
                    >
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
              {/* Step 7: Confirmation of Submission */}

              {currentStep === 7 && (
                <>
                  <h3 className="text-center mt-2"> You're almost there!</h3>
                  <p className="text-center">
                    <b>Does everything look good so far?</b>
                    <hr className="mt-2" />
                    Please ensure all requested fields are accurately filled out
                    before proceeding.
                    <br />
                    <i
                      className="fa-solid fa-ice-cream mb-2 mt-2"
                      style={{ color: "#E93287" }}
                    ></i>
                    <br />
                    <i>
                      <sub>
                        If you wish to continue, click 'Next' to finish! <br />
                        Otherwise, click 'Previous' to go back.
                      </sub>
                    </i>
                  </p>
                </>
              )}
              {currentStep === 8 && (
                <>
                  <h3 className="text-center mt-2">
                    Thank you for your submission!
                  </h3>
                  <p className="text-center font-big">
                    <hr className="mt-2" />
                    Our team has received your request and is excited to add
                    some flavor to your event. Our vendors are ready to impress!
                    <br />
                    <i
                      className="fa-solid fa-ice-cream mb-2 mt-2"
                      style={{ color: "#E93287" }}
                    ></i>
                    <br />
                    You'll receive a payment request based on your
                    event criteria shortly.
                    <br />
                    <sub>
                      <i>Estimated response times is 7 business days.</i>
                    </sub>
                  </p>
                </>
              )}
              {/* Navigation buttons */}
              {currentStep !== 1 && currentStep !== 8 && (
                <Button
                  onClick={handlePrevStep}
                  className="mx-2"
                  variant="secondary"
                  style={{ backgroundColor: "#ff5ea6", borderColor: "#ff5ea6" }}
                >
                  Previous
                </Button>
              )}
              {currentStep !== 8 ? (
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
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={10500}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleCloseSnackbar}
                severity="info"
              >
                We appreciate your business! Look out for an email from our
                vendors @ WMIC.
              </MuiAlert>
            </Snackbar>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default CateringForm;
