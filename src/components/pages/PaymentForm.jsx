import { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";

const PaymentForm = () => {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handlePayment = async () => {
    const stripe = await stripePromise;

    try {
      setIsSubmitting(true);
      // const response = await axios.post(`${api}/create-payment-intent`, {
      //   amount: formData.budget * 100, //  cents
      //   vendorId: formData.vendorId, // Vendor ID
      // });
      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.customer_name,
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Payment successful, update UI or show success message
          console.log("Payment successful");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment({ cardName, cardNumber, cardExp, cardCvc });
  };

  return (
    <div>
      <h2 className="text-center mb-2">Payment Information</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="cardName">
          <Form.Label>Name on Card</Form.Label>
          <Form.Control
            type="text"
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="cardNumber">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="cardExp">
          <Form.Label>Expiration Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="MM/YY"
            value={cardExp}
            onChange={(e) => setCardExp(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="cardCvc">
          <Form.Label>CVC</Form.Label>
          <Form.Control
            type="text"
            placeholder="123"
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Submit Payment</Button>
      </Form>
    </div>
  );
};

export default PaymentForm;
