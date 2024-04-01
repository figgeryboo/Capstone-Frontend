import React, { useState } from 'react';
import { Form, Card, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/authContext';
import { Link } from 'react-router-dom';

const CateringForm = () => {
	const { currentUser } = useAuth();
	const [currentStep, setCurrentStep] = useState(1);

	const handleNextStep = () => {
		setCurrentStep((prevStep) => prevStep + 1);
	};

	const handlePrevStep = () => {
		setCurrentStep((prevStep) => prevStep - 1);
	};

	const submitCateringForm = () => {};

	return (
		<>
			<div className="w-100" style={{ maxWidth: '400px' }}>
				<Card>
					<Card.Body>
						<div className="d-grid gap-2">
							{/* Step 1: Catering Request */}
							{currentStep === 1 && (
								<>
									<h2 className="text-center mb-2">Catering Request</h2>
									<p className="text-center font-big">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua.
									</p>
								</>
							)}
							{/* Step 2: Person Details Section */}
							{currentStep === 2 && (
								<>
									<h2 className="text-center mb-2">Coordinator Details</h2>
									<Form>
										<Form.Group className="mb-4" controlId="name">
											<Form.Label>Coordinator Name</Form.Label>
											<Form.Control
												type="text"
												placeholder="John Doe"
												required
											/>
										</Form.Group>

										<Form.Group className="mb-4" controlId="contactInfo">
											<Form.Label>Coordinator Email</Form.Label>
											<Form.Control
												type="email"
												placeholder="example@example.com"
												required
											/>
										</Form.Group>

										<Form.Group className="mb-4" controlId="contactInfo">
											<Form.Label>Coordinator Phone</Form.Label>
											<Form.Control
												type="tel"
												placeholder="1234567890"
												maxLength="10"
												required
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
											<Form.Control
												type="text"
												placeholder="Event Location"
												required
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
											<Form.Label>Budget per Person</Form.Label>
											<Form.Control type="text" placeholder="Budget" required />
										</Form.Group>

										<Form.Group className="mb-4" controlId="dietaryOptions">
											<Form.Label>Dietary Options</Form.Label>
											<Form.Check type="checkbox" label="Dairy" />
											<Form.Check type="checkbox" label="Non-Dairy" />
										</Form.Group>

										<Form.Group className="mb-4" controlId="needUtensils">
											<Form.Label>
												Will You Need Additional Utensils?
											</Form.Label>
											<Form.Check
												type="radio"
												label="Yes"
												name="needUtensils"
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

										<Form.Group className="mb-4" controlId="comments">
											<Form.Label>Additional Comments:</Form.Label>
											<Form.Control
												as="textarea"
												rows={3}
												maxLength={250}
												placeholder="Comments"
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
                                    style={{ backgroundColor: '#ff5ea6', borderColor: '#ff5ea6' }}
								>
									Previous
								</Button>
							)}
							{currentStep !== 6 ? (
								<Button
									onClick={handleNextStep}
									className="mx-2"
									variant="primary"
                                    style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}
								>
									Next
								</Button>
							) : (
								<Button
									onClick={submitCateringForm}
									className="mx-2"
									variant="success"
                                    style={{ backgroundColor: '#EA3187', borderColor: '#EA3187' }}
								>
									Submit Your Request
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
