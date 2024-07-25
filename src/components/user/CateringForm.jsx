import React, { useEffect, useState } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

const VendorCard = ({ vendor, onClick, isSelected }) => {
  return (
    <Card
      style={{ cursor: "pointer", marginBottom: "1rem" }}
      onClick={() => onClick(vendor.vendor_id)}
      className={`p-3 ${isSelected ? "bg-light" : "bg-info"}`}
    >
      <Card.Body>
        <Card.Title>{vendor.vendor_name}</Card.Title>
        {isSelected && (
          <ul>
            {vendor.menu_items.map((item) => (
              <li key={item}>
                <Form.Check
                  type="checkbox"
                  id={item}
                  label={item}
                  onChange={(e) => onMenuItemChange(item, e.target.checked)}
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

const CateringForm = () => {
  const api = import.meta.env.VITE_URL;
  const { currentUser } = useAuth();
  const email = currentUser.email;

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
    menu_items: [],
    event_size: "",
    dietary_options: "",
    special_instructions: "",
    confirmed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deposit, setDeposit] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

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

  const handleVendorClick = (vendorId) => {
    setSelectedVendorId(vendorId);
    const vendor = menu.find((v) => v.vendor_id === vendorId);
    if (vendor) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        menu_items: vendor.menu_items,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        menu_items: [],
      }));
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
              vendor_name: vendor.vendor_name,
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
      <div className="w-100" style={{ maxWidth: "440px"}}>
        <Card>
          <Card.Body>
            <div className="d-grid gap-2">
              {/* Step 1: Catering Intro Page */}
              {currentStep === 1 && (
                <>
                  <h3 className="text-center mb-2">Catering Form</h3>
                  <p className="text-center mb-2">
                    <i>Want to add some deliciousness to your future event?</i>
                    <hr />
                    Our vendors are ready to lend a hand. Please provide <br />
                    the necessary details below to ensure we can craft the
                    perfect ice cream experience for your event.
                  </p>
                  <sub className="text-center mt-2">
                    <i>Estimated response time is 7 business days.</i>
                  </sub>
                  <br />
                </>
              )}
              {/* Step 2: Person Details Section */}
              {currentStep === 2 && (
                <>
                  <h3 className="text-center mb-2">Coordinator Details</h3>
                  <i>
                    Ensure your contact details are correct so we can reach out
                    to confirm your request and discuss any additional details
                  </i>
                  <Form>
                    <Form.Group className="mb-4" controlId="customer_name">
                      <Form.Label>
                        {" "}
                        <b>Coordinator Name</b>{" "}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        required
                        onChange={handleChange}
                        value={formData.customer_name}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="customer_email">
                      <Form.Label>
                        <b>Coordinator Email</b>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="example@example.com"
                        required
                        onChange={handleChange}
                        value={formData.customer_email}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contact_info">
                      <Form.Label>
                        <b>Coordinator Phone</b>
                      </Form.Label>
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
                          <Form.Label>
                            <b>Event Date</b>
                          </Form.Label>
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
                          <Form.Label>
                            <b>Event Time</b>
                          </Form.Label>
                          <Form.Control
                            type="time"
                            required
                            onChange={handleChange}
                            value={formData.event_time}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4" controlId="delivery_location">
                      <Form.Label>
                        <b>Event Address</b>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: 222 Maiden Lane StonyBook, AZ 70834"
                        required
                        onChange={handleChange}
                        value={formData.delivery_location}
                      />
                      <sub>
                        <p className="mt-2 text-muted">
                          We will deliver to this address
                        </p>
                      </sub>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="event_size">
                      <Form.Label>
                        <b>Event Size</b>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 15 - 100 people"
                        required
                        onChange={handleChange}
                        value={formData.event_size}
                      />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="dietary_options">
                      <Form.Label>
                        <b>Dietary Options</b>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Any dietary restrictions or preferences?"
                        row={3}
                        onChange={handleChange}
                        value={formData.dietary_options}
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-4"
                      controlId="special_instructions"
                    >
                      <Form.Label>
                        <b>Additional Comments:</b>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Additional instructions for vendors if applicable"
                        onChange={handleChange}
                        value={formData.special_instructions}
                      />
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 4: Budet & Deposit */}
              {currentStep === 4 && (
                <>
                  <h3 className="text-center mb-2">Budget and Deposit</h3>
                  <Form>
                    <Form.Group className="mb-4" controlId="budget">
                      <Form.Label>
                        <b>Estimated Budget</b>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter estimated budget USD"
                        min="0"
                        required
                        onChange={handleChange}
                        value={formData.budget}
                      />
                      {formData.budget && (
                        <p className="text-success mt-2">
                          Estimated Deposit (30%): ${deposit}
                        </p>
                      )}
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
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "440px",
                        overflowY: "auto",
                      }}
                    >
                      <Row>
                        {menu.map((vendor) => (
                          <Col key={vendor.vendor_id} sm={12} md={12} lg={12}>
                            <VendorCard
                              vendor={vendor}
                              onClick={() =>
                                handleVendorClick(vendor.vendor_id)
                              }
                              isSelected={selectedVendorId === vendor.vendor_id}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Form.Group>
                  </Form>
                </>
              )}
              {/* Step 6: Final Details/Submit */}
              {currentStep === 6 && (
                <>
                  <h3 className="text-center mb-2">Final Steps</h3>
                  <Form>
                    <Form.Group className="mb-4" controlId="dietary_options">
                      <Form.Label>
                        <b>Dietary Options</b>
                      </Form.Label>
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
                        <b>Will You Need Additional Utensils?</b>
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

                    <Form.Group className="mb-4" controlId="howDidYouHear">
                      <Form.Label>
                        <b>How Did You Hear About Us?</b>
                      </Form.Label>
                      <Form.Control as="select">
                        <option value="">Select</option>
                        <option value="friend">Friend</option>
                        <option value="event">Event</option>
                        <option value="internet">Internet</option>
                        <option value="other">Other</option>
                      </Form.Control>
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
                    You'll receive a payment request based on your event
                    criteria shortly.
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
