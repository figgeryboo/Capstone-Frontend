import React from 'react';
import { Form, Card, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/authContext';
import	 { Link } from 'react-router-dom';

const CateringForm = () => {
	const { currentUser } = useAuth();
	return (
		<>
        <Link to="/userdashboard">
				<button type="button" class="btn-close" aria-label="Close"></button>
			</Link>
			<Card>
				<Card.Body>
					<img src="/altcolors5.png" class="img-fluid" alt="WMIC Logo"></img>
					<div className="d-grid gap-2">
						<h2 className="text-center mb-2">Catering Request</h2>
						<p className="text-center font-big">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</p>
						<Form>
							<Form.Group className="mb-4" controlId="name">
								<Form.Label>Coordinator Name</Form.Label>
								<Form.Control type="text" required />
							</Form.Group>

							<Form.Group className="mb-4" controlId="contactInfo">
								<Form.Label>Coordinator Contact</Form.Label>
								<Form.Control type="text" required />
							</Form.Group>
							<Row>
								<Col>
									<Form.Group className="mb-4" controlId="date">
										<Form.Label>Date of the Event</Form.Label>
										<Form.Control type="date" required />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-4" controlId="time">
										<Form.Label>Time of Event</Form.Label>
										<Form.Control type="time" required />
									</Form.Group>
								</Col>
							</Row>

							<Form.Group className="mb-4" controlId="location">
								<Form.Label>Location of Event</Form.Label>
								<Form.Control type="text" required />
							</Form.Group>

							<Form.Group className="mb-4" controlId="eventSize">
								<Form.Label>Event Size</Form.Label>
								<Form.Control type="number" min="20" max="50" required />
							</Form.Group>

							<Form.Group className="mb-4"controlId="dietaryOptions">
								<Form.Label>Dietary Options</Form.Label>
								<Form.Check type="checkbox" label="Dairy" />
								<Form.Check type="checkbox" label="Non-Dairy" />
							</Form.Group>

							<Form.Group className="mb-4" controlId="budget">
								<Form.Label>Budget per Person</Form.Label>
								<Form.Control type="text" required />
							</Form.Group>

							<Form.Group className="mb-4"  controlId="needUtensils">
								<Form.Label>Will You Need Additional Utensils?</Form.Label>
								<Form.Check type="radio" label="Yes" name="needUtensils" />
								<Form.Check type="radio" label="No" name="needUtensils" />
							</Form.Group>

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

                            <Form.Group className="mb-4" controlId="comments">
								<Form.Label>Additional Comments:</Form.Label>
								<Form.Control as="textarea" rows={3} maxLength={250} />
							</Form.Group>

							<Button
								type="submit"
								className={`mx-auto d-block text-white font-medium rounded-lg mt-2 $`} 
                            >
                                <div>Submit Your Request</div>
                            </Button>
						</Form>
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

export default CateringForm;
