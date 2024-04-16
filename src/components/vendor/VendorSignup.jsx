import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { doCreateVendorWithEmailAndPassword } from "../../firebase/auth";

const VendorSignup = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vendorName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    foodVendorId: "",
    foodVendorIdExp: "",
    licenseId: "",
    licensePlate: "",
    iceCreamCompany: "",
    locationPermission: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
    setErrorMessage("");
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isOver21 = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const diff = today.getFullYear() - dobDate.getFullYear();
    if (diff < 21 || (diff === 21 && today.getMonth() < dobDate.getMonth())) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (!isOver21(formData.dob)) {
        alert("You must be 21 years or older to continue.");
        return;
      }
      if (
        !formData.vendorName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.dob
      ) {
        setErrorMessage("All fields are required.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      handleNextStep();
    } else if (currentStep === 2) {
      if (
        !formData.foodVendorId ||
        !formData.foodVendorIdExp ||
        !formData.licenseId ||
        !formData.licensePlate ||
        !formData.iceCreamCompany
      ) {
        setErrorMessage("All fields are required.");
        return;
      }
      handleNextStep();
    } else if (currentStep === 3) {
      if (!formData.locationPermission) {
        setErrorMessage("Location permission is required.");
        return;
      }
      if (!isRegistering) {
        setIsRegistering(true);
        try {
          await doCreateVendorWithEmailAndPassword(
            formData.email,
            formData.password,
            formData
          );

          navigate("/vendordashboard");
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
          setIsRegistering(false);
        }
      }
    }
  };

  return (
    <>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {userLoggedIn && <Navigate to={"/vendordashboard"} replace={true} />}
        <Link to="/">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            style={{
              color: "#FFFF",
              marginLeft: "21.5em",
              backgroundColor: "#5ae0c8",
              borderRadius: "15px",
              padding: "8px",
              marginBottom: "5px",
            }}
          ></button>
        </Link>

        <Card>
          <Card.Body>
            <h2 className="text-center mb-2">Vendor Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <>
                  <Form.Group id="vendorName">
                    <Form.Label>Vendor Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.vendorName}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorName: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group id="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group id="dob">
                    <Form.Label>Date of Birth</Form.Label>
                    {!isOver21(formData.dob) && (
                      <span className="text-danger">
                        You must be 21 years or older.
                      </span>
                    )}
                    <Form.Control
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      min="1900-01-01"
                    />
                  </Form.Group>

                  <Button
                    type="button"
                    className="d-block mx-auto mt-2"
                    onClick={handleNextStep}
                  >
                    Next →
                  </Button>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <Form.Group id="licensePlate">
                    <Form.Label>Ice Cream Truck License Plate #</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ABC1234" style={{ fontSize: ".9em" }}
                      pattern="[A-Za-z]{3}[0-9]{4}"
                      required
                      value={formData.licensePlate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          licensePlate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group id="foodVendorId">
                    <Form.Label>Food Vendor Permit #</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="EH01234" style={{ fontSize: ".9em" }}
                      value={formData.foodVendorId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          foodVendorId: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group id="foodVendorIdExp">
                    <Form.Label>Permit Expiration(MM/YYYY)</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
                      placeholder="MM/YYYY" style={{ fontSize: ".9em" }}
                      required
                      value={formData.foodVendorIdExp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          foodVendorId: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group id="licenseId">
                    <Form.Label>State License ID #</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="123456789" style={{ fontSize: ".9em" }}
                      value={formData.licenseId}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseId: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group id="iceCreamCompany">
                    <Form.Label>Truck Name/ Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.iceCreamCompany}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          iceCreamCompany: e.target.value,
                        })
                      }
                      placeholder="Enter Truck or Company Name"
                      style={{ fontSize: ".9em" }}
                    />
                  </Form.Group>
                  <Button
                    type="button"
                    className="mt-2 mx-2"
                    onClick={handlePrevStep}
                    variant="secondary"
                  >
                    ← Previous
                  </Button>
                  <Button
                    type="button"
                    className="mx-2 mt-2"
                    onClick={handleNextStep}
                  >
                    Next →
                  </Button>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h4 className="ml-5 mt-4">Location Permissions</h4>
                  <span className="medium mb-4 mt-2" style={{ fontSize: "14px" }}>
                    By checking this box, you agree to grant us permission to
                    access your device's location for providing location-based
                    services, personalizing content, and improving app
                    functionality. You can manage and revoke these permissions
                    at any time in your device settings or within the app
                    settings.
                  </span>
                  <Form.Group id="locationPermission">
                    <Form.Check
                      className="text-muted mb-3"
                      type="checkbox"
                      label="Agree and allow location access"
                      checked={formData.locationPermission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          locationPermission: e.target.checked,
                        })
                      }
                    />
                  </Form.Group>

                  <Button
                    type="button"
                    className="mx-2 mt-2"
                    onClick={handlePrevStep}
                    variant="secondary"
                  >
                    ← Previous
                  </Button>
                  <Button
                    type="submit"
                    className="mx-2 mt-2 justify-content-right ms-auto"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              {errorMessage && (
                <span className="text-red-600 font-bold">{errorMessage}</span>
              )}
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/vendorlogin">Log In</Link>
        </div>
      </div>
    </>
  );
};

export default VendorSignup;
