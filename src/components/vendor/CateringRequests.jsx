import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { Button, Card, Collapse } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import icon from '/image.gif';

const CateringRequests = () => {
	const { currentUser } = useAuth();
	const url = import.meta.env.VITE_URL;
	const [requests, setRequests] = useState([]);
	const [expanded, setExpanded] = useState(null);
	const [sortOption, setSortOption] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [showMap, setShowMap] = useState(null);
	const [map, setMap] = useState(null);
	const fetchCustomerData = async () => {
		try {
			const response = await axios.get(`${url}/customers`);
			return response.data.reduce((acc, customer) => {
				acc[customer.customer_id] = customer; // Map customer_id to customer object
				return acc;
			}, {});
		} catch (error) {
			console.error('Error fetching customer data:', error);
			return {};
		}
	};
	const fetchCateringRequests = async () => {
		try {
			const [eventsResponse, customersData] = await Promise.all([
				axios.get(`${url}/events`),
				fetchCustomerData(),
			]);
			const eventsData = eventsResponse.data;
			// Combine events data with customer names
			const combinedData = eventsData.map((event) => ({
				...event,
				customer_name:
					customersData[event.customer_id]?.customer_name || 'Unknown Customer',
			}));
			const unconfirmedData = combinedData.filter((event) => !event.confirmed);
			let sortedData;
			switch (sortOption) {
				case 'eventDate':
					sortedData = unconfirmedData.sort(
						(a, b) => new Date(a.event_date) - new Date(b.event_date)
					);
					break;
				case 'lastName':
					sortedData = unconfirmedData.sort((a, b) =>
						a.customer_name
							.split(' ')[1]
							.localeCompare(b.customer_name.split(' ')[1])
					);
					break;
				case 'firstName':
					sortedData = unconfirmedData.sort((a, b) =>
						a.customer_name
							.split(' ')[0]
							.localeCompare(b.customer_name.split(' ')[0])
					);
					break;
				case 'eventSize':
					sortedData = unconfirmedData.sort(
						(a, b) => a.event_size - b.event_size
					);
					break;
				default:
					sortedData = unconfirmedData;
			}
			setRequests(sortedData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	useEffect(() => {
		fetchCateringRequests();
	}, [sortOption]);
	const handleEventConfirmation = async (orderId, currentStatus, vendorUid) => {
		try {
			const response = await axios.put(`${url}/events/${orderId}`, {
				confirmed: !currentStatus,
				vendor_uid: vendorUid,
			});
			console.log(response.data);
			setRequests((prevRequests) =>
				prevRequests.map((request) =>
					request.order_id === orderId
						? { ...request, status: !currentStatus ? 'confirmed' : null }
						: request
				)
			);
		} catch (error) {
			console.error('Error toggling event confirmation:', error);
		}
	};
	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};
	const handleMouseOver = () => {
		setShowMap(true);
	};
	const handleMouseLeave = () => {
		setShowMap(false);
	};
	const handleExpand = (orderId) => {
		setExpanded(orderId === expanded ? null : orderId);
	};
	const formatEventTime = (time) => {
		const [hours, minutes] = time.split(':');
		const formattedHours = parseInt(hours, 10) % 12 || 12;
		const period = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
		return `${formattedHours}:${minutes} ${period}`;
	};
	useEffect(() => {
		if (showMap !== null && requests.length > 0) {
			const google = window.google;
			const geocoder = new google.maps.Geocoder();
			const expandedRequest = requests.find(
				(request, index) => index === expanded
			);
			const deliveryLocation = expandedRequest?.delivery_location;
			// Geocode the address to get its coordinates
			geocoder.geocode({ address: deliveryLocation }, (results, status) => {
				if (status === 'OK' && results[0]) {
					const { lat, lng } = results[0].geometry.location;
					const mapOptions = {
						center: { lat: lat(), lng: lng() },
						zoom: 12,
					};
					const newMap = new google.maps.Map(
						document.getElementById(`map-container-${showMap}`),
						mapOptions
					);
					new google.maps.Marker({
						position: { lat: lat(), lng: lng() },
						map: newMap,
						title: 'Delivery Location',
						icon: {
							url: icon,
							scaledSize: new google.maps.Size(50, 50),
							anchor: new google.maps.Point(25, 25),
						},
					});
					setMap(newMap);
				} else {
					console.error(
						'Geocode was not successful for the following reason:',
						status
					);
				}
			});
		}
	}, [showMap, requests]);
	return (
		<div
			className="catering_container"
			style={{
				minWidth: '100vw',
				maxWidth: '500px',
				maxHeight: '85vh',
				overflowX: 'auto',
				overflowY: 'auto',
			}}
		>
			<div>
				<div
					className="header-container"
					style={{
						display: 'flex',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						minWidth: '100vw',
						maxWidth: '100%',
						position: 'sticky',
						zIndex: 100,
						padding: '10px',
						borderRadius: '10px',
					}}
				>
					<h3
						style={{
							fontWeight: 'bolder',
							textAlign: 'center',
							margin: '0px 0px 5px 10px',
						}}
					>
						Catering Requests
					</h3>
					<select
						value={sortOption}
						onChange={(e) => setSortOption(e.target.value)}
						aria-label="Sort By"
					>
						<option value="">Filter By</option>
						<option value="eventDate">Date of Event</option>
						<option value="lastName">Last Name</option>
						<option value="firstName">First Name</option>
						<option value="eventSize">Event Size</option>
					</select>
				</div>
				<div
					className="card-container"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '10px 0',
						gap: '11px',
					}}
				>
					{requests.map((request, index) => (
						<Card
							key={request.order_id}
							style={{ width: '90%', maxWidth: '500px' }}
						>
							<Card.Header
								onClick={() => setExpanded(expanded === index ? null : index)}
								aria-expanded={expanded === index}
								style={{
									cursor: 'pointer',
									backgroundColor: '#59E0C8',
									padding: '5px 10px',
									minHeight: 'auto',
								}}
							>
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<b>Customer Name: {request.customer_name}</b> <br />
										Event Date:{' '}
										{new Date(request.event_date).toLocaleDateString()} | Event
										Size: {request.event_size}
									</div>
									<i
										className={
											expanded === index
												? 'bi bi-chevron-contract'
												: 'bi bi-chevron-expand'
										}
										aria-expanded={expanded === index}
										aria-controls={`collapse-${index}`}
									></i>
								</div>
							</Card.Header>
							<Collapse in={expanded === index}>
								<div
									style={{ backgroundColor: '#D0F2EF' }}
									aria-hidden={expanded !== index}
									aria-labelledby={`card-header-${index}`}
								>
									<Card.Body
										style={{
											padding: '10px',
											display: 'flex',
											flexDirection: 'column',
											textAlign: 'left',
										}}
									>
										<Card.Title>
											<span style={{ fontSize: '10px' }}>
												Delivery Location:{' '}
											</span>
											{request.delivery_location}
										</Card.Title>
										<p>
											<span style={{ fontSize: '12px' }}>
												{' '}
												Contact Details:
											</span>{' '}
											{request.contact_info}
										</p>
										<p>
											<span style={{ fontSize: '12px' }}>
												{' '}
												Event Start Time:
											</span>{' '}
											{formatEventTime(request.event_time)}
										</p>
										<p>
											<span style={{ fontSize: '12px' }}>
												{' '}
												Requested Menu Items:
											</span>{' '}
											{request.menu_items}
										</p>
										<p>
											<span style={{ fontSize: '12px' }}>Dietary Options:</span>{' '}
											{request.dietary_options}
										</p>
										<p>
											<span style={{ fontSize: '12px' }}>
												Special Instructions:
											</span>{' '}
											{request.special_instructions}
										</p>
										<div>
											<Button
												onClick={() => setShowMap(index)}
												className="btn btn-sm"
											>
												Show Map
											</Button>
											{showMap === index && (
												<div
													id={`map-container-${index}`}
													style={{
														width: '333px',
														height: '30vh',
														border: '2px solid #59E0C8',
														borderRadius: '8px',
													}}
												></div>
											)}
										</div>
										{request.status !== 'confirmed' && (
											<Button
												variant="light"
												onClick={() => {
													setSnackbarOpen(true);
													handleEventConfirmation(
														request.order_id,
														false,
														currentUser.uid
													);
												}}
												aria-label="Confirm Event"
											>
												Confirm
											</Button>
										)}
										{request.status === 'confirmed' && (
											<Button
												variant="info"
												onClick={() =>
													handleEventConfirmation(request.order_id, true)
												}
												aria-label="unConfirm Event"
											>
												Unconfirm
											</Button>
										)}
									</Card.Body>
								</div>
							</Collapse>
						</Card>
					))}
					<Snackbar
						open={snackbarOpen}
						autoHideDuration={10000}
						onClose={handleCloseSnackbar}
						anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<MuiAlert
							elevation={6}
							variant="filled"
							onClose={handleCloseSnackbar}
							severity="info"
						>
							Pressing anywhere besides "Unconfirm" will officially confirm this
							request. If you confirmed accidentally, press "Unconfirm".
						</MuiAlert>
					</Snackbar>
				</div>
			</div>
		</div>
	);
};
export default CateringRequests;
