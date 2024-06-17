import { Form } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { messaging } from "../../firebase/firebase";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

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
    appUseDuration: "",
    favoriteFeature: "",
    leastFavoriteFeature: "",
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
      axios.post(`${url}/feedback/`, form)
        .then((res) => {
          console.log("Feedback submitted successfully", res);
          // sendMessage(form.email);
          setOpenSnackbar(true);
        })
        .catch((err) => console.error("Error submitting feedback", err));
    }
    setForm({
      email: email,
      firebase_uid: uid,
      rating: "",
      appUseDuration: "",
      favoriteFeature: "",
      leastFavoriteFeature: "",
      suggestions: "",
    });
    setValidated(true);
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
    <div
      className="container mt-5"
      style={{
        minWidth: "65vw",
        maxWidth: "90vw",
        maxHeight: "85vh",
      }}
    >
      <h2>Feedback Form</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">
            Please enter a valid email address.
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="rating">
            How would you rate your overall experience using our app?
          </label>
          <select
            className="form-control"
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
          </select>
          <div className="invalid-feedback">Please rate your experience.</div>
        </div>
        <div className="form-group">
          <label htmlFor="favoriteFeature">
            What is your favorite feature?
          </label>
          <input
            type="text"
            className="form-control"
            id="favoriteFeature"
            name="favoriteFeature"
            value={form.favoriteFeature}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">
            Please enter your favorite feature.
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="appUseDuration">
            What is your least favorite feature?
          </label>
          <input
            type="text"
            className="form-control"
            id="leastFavoriteFeature"
            name="leastFavoriteFeature"
            value={form.leastFavoriteFeature}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">
            Please enter your least favorite feature.
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="suggestions">
            Do you have any suggestions for improvement?
          </label>
          <textarea
            className="form-control"
            id="suggestions"
            name="suggestions"
            rows="5"
            value={form.suggestions}
            onChange={handleChange}
            required
          ></textarea>
          <div className="invalid-feedback">Please enter your suggestions.</div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
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
  );
};

export default UserSupport;
