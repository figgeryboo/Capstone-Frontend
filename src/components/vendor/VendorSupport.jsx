import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { messaging } from "../../firebase/firebase";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const UserSupport = () => {
  let user = useAuth();
  let email = user.currentUser.email;
  let uid = user.currentUser.uid;

  const [validated, setValidated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const url = import.meta.env.VITE_URL;
  const vapidKey = import.meta.env.VITE_VAPID_KEY;

  const [form, setForm] = useState({
    email: email,
    firebase_uid: uid,
    rating: "",
    favorite_feature: "",
    least_favorite_feature: "",
    suggestions: "",
  });

  // useEffect(() => {
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       console.log("Notification permission granted.");
  //     } else if (permission === "denied") {
  //       console.error("Notification permission denied.");
  //     } else {
  //       console.log("Notification permission not granted.");
  //     }
  //   });
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    if (formElement.checkValidity() === false) {
      e.stopPropagation();
    } else {
      axios
        .post(`${url}/feedback/`, form)
        .then((res) => {
          console.log("Feedback submitted", res.data);
          // sendMessage(form.email);
          setOpenSnackbar(true);
        })
        .catch((err) => console.error("Error submitting feedback", err));
    }
   
    setValidated(true);
    setForm({
      email: email,
      firebase_uid: uid,
      rating: "",
      favorite_feature: "",
      least_favorite_feature: "",
      suggestions: "",
    });
  };
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('./firebase/firebase.js')
  //     .then((registration) => {
  //       console.log('ServiceWorker registration successful with scope: ', registration.scope);
  //     })
  //     .catch((err) => {
  //       console.error('ServiceWorker registration failed: ', err);
  //     });
  // }
  // const sendMessage = (email) => {
  //   messaging.getToken({ vapidKey: vapidKey })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         console.log("Current client token", currentToken, email );
  //         // const messagePayload = {
  //         //   notification: {
  //         //     title: "Feedback Received",
  //         //     body: `Thank you for providing your feedback, ${email}`,
  //         //   },
  //         //   token: currentToken,
  //         // };

  //         // axios.post(`${url}/send-message`, messagePayload)
  //         //   .then((res) => console.log("Message sent successfully", res.data))
  //         //   .catch((err) => console.error("Error sending message", err));
  //       } else {
  //         console.log("No registration token available. Request permission to generate one.");
  //       }
  //     })

  // };
  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <h2>Vendor Feedback Form</h2>
      <Form noValidate onSubmit={handleSubmit} style={{height: "80vh"}}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>How would you rate your overall experience using our app?</Form.Label>
          <Form.Select
            id="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            required
          >
            <option value="">Choose...</option>
            <option value="1">1 - Very Unsatisfied</option>
            <option value="2">2 - Unsatisfied</option>
            <option value="3">3 - Neutral</option>
            <option value="4">4 - Satisfied</option>
            <option value="5">5 - Very Satisfied</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">Please rate your experience.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>What is your favorite feature?</Form.Label>
          <Form.Control
            type="text"
            id="favorite_feature"
            name="favorite_feature"
            value={form.favorite_feature}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter your favorite feature.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>What is your least favorite feature?</Form.Label>
          <Form.Control
            type="text"
            id="least_favorite_feature"
            name="least_favorite_feature"
            value={form.least_favorite_feature}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter your least favorite feature.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Do you have any suggestions for improvement?</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            id="suggestions"
            name="suggestions"
            value={form.suggestions}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter your suggestions.</Form.Control.Feedback>
        </Form.Group>
        <Button className="w-100" variant="primary" size="lg" active style={{ backgroundColor: "#0d6efd", borderColor: "#0d6efd"}} type="submit">Submit</Button>
      </Form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6100}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          elevation={10}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity="success"
        >
          Thanks for your submission! Your form was submitted successfully!
        </MuiAlert>
      </Snackbar>
    </div>
  )
};

export default UserSupport;
