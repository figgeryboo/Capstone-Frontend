import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Map.css';
import { Button, Collapse } from 'react-bootstrap';

const center = {
	lat: 40.750797,
	lng: -73.989578,
};

const Map = () => {
	const mapRef = useRef(null);
	const url = import.meta.env.VITE_URL;
	const [selectedVendor, setSelectedVendor] = useState(null);
	const [liveVendors, setLiveVendors] = useState(null);
	const [isUserLocationEnabled, setIsUserLocationEnabled] = useState(false);
	const [showExpandedDetails, setShowExpandedDetails] = useState(false);
	const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
	const [infoWindows, setInfoWindows] = useState({});
	const [menuExpanded, setMenuExpanded] = useState(false);
	const [userMarker, setUserMarker] = useState(null);

	useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const response = await axios.get(`${url}/vendors`);
	// 			const vendors = response.data;


	// axios
	// .get(`${url}/vendors/locations`)
	// .then((res) => {
	// 	const vendorLocations = res.data;

	// })
	// 			const map = new google.maps.Map(
	// 				document.getElementById('map-container'),
	// 				{
	// 					zoom: 14,
	// 					center: center,
	// 					mapId: import.meta.env.VITE_GOOGLE_MAPID,
	// 					disableDefaultUI: true,
	// 				}
	// 			);

	// 			vendors.forEach((vendor) => {
	// 				const pathCoordinates = vendor.coordinates.map((coord) => ({
	// 					lat: coord.lat,
	// 					lng: coord.lng,
	// 				}));

	// 				const polyline = new google.maps.Polyline({
	// 					path: pathCoordinates,
	// 					geodesic: true,
	// 					strokeColor: '#0870c4',
	// 					strokeOpacity: 1.0,
	// 					strokeWeight: 3,
	// 				});

	// 				polyline.setMap(map);

	// 				let index = 0;
	// 				const marker = new google.maps.Marker({
	// 					position: pathCoordinates[index],
	// 					map: map,
	// 					icon: {
	// 						url: '/truckIcon.png',
	// 						scaledSize: new google.maps.Size(50, 50),
	// 						anchor: new google.maps.Point(20, 20),
	// 					},
	// 				});
	// 				console.log(typeof vendor.payment_types, vendor.payment_types);

	// 				const infoWindowContent = `
    //       <div style="max-width: 600px; display: flex; flex-direction: column;">
    //         <h3 style="margin-bottom: 3px; margin-left:3px"><i class="bi bi-person-bounding-box" style="color: #ea3689"></i>  ${
	// 						vendor.vendor_name
	// 					}</h3>
    //         <hr style="width: 100%; margin-top: 4px; margin-bottom: 10px;">
    //         <h5 style="margin-left: 3px;"><b>Rating:</b> ${
	// 						vendor.rating_average
	// 					} <i class="bi bi-star-fill"></i></h5>
    //         <p style="margin-top: 5px;"><b>Accepts:</b> ${vendor.payment_types.join(
	// 						' '
	// 					)}</p>
    //         <p style=""><b>Offers:</b> ${vendor.dietary_offering}</p>
    //         <p style=""><b>Accessible ♿️:</b> ${
	// 						vendor.accessible ? 'Yes' : 'No'
	// 					}</p>
    //         <button style="margin-top: auto; padding: 4px 10px; background-color: #ea3689; color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="handleVendorClick(${
	// 						vendor.vendor_id
	// 					})">See Vendor Menu</button>
    //       </div>
    //     `;

	// 				const infoWindow = new google.maps.InfoWindow({
	// 					content: infoWindowContent,
	// 					maxWidth: 180,
	// 					ariaLabel: 'vendor details in black text on white background',
	// 				});

	// 				infoWindows[vendor.vendor_id] = infoWindow;

	// 				marker.addListener('click', () => {
	// 					Object.values(infoWindows).forEach((iw) => iw.close());
	// 					infoWindow.open(map, marker);
	// 				});

	// 				google.maps.event.addListener(infoWindow, 'closeclick', () => {
	// 					setShowExpandedDetails(false);
	// 					setSelectedVendor(null);
	// 					setSelectedVendorDetails(null);
	// 				});

	// 				let traveledPath = [];

	// 				const animateMarker = () => {
	// 					if (index > 0) {
	// 						traveledPath.push(pathCoordinates[index - 1]);
	// 						const traveledPolyline = new google.maps.Polyline({
	// 							path: traveledPath,
	// 							geodesic: true,
	// 							strokeColor: '#59E0C8',
	// 							strokeOpacity: 1.0,
	// 							strokeWeight: 3,
	// 						});
	// 						traveledPolyline.setMap(map);
	// 					}
	// 					marker.setPosition(pathCoordinates[index]);
	// 					index = (index + 1) % pathCoordinates.length;

	// 					if (index === 0) {
	// 						return;
	// 					}
	// 					setTimeout(animateMarker, 3730);
	// 				};
	// 				animateMarker();
	// 			});
	// 			mapRef.current = map;
	// 			setInfoWindows(infoWindows);
	// 		} catch (error) {
	// 			console.error('Error fetching vendor data:', error);
	// 			alert('Vendor data currently unavailable. Refresh to try again.');
	// 		}
	// 	};

	const fetchData = async () => {
		try {
			const vendorsResponse = await axios.get(`${url}/vendors`);
			const vendors = vendorsResponse.data;
	
			const locationsResponse = await axios.get(`${url}/vendors/locations`);
			const vendorLocations = locationsResponse.data;
	
			const map = new google.maps.Map(
				document.getElementById('map-container'),
				{
					zoom: 14,
					center: center,
					mapId: import.meta.env.VITE_GOOGLE_MAPID,
					disableDefaultUI: true,
				}
			);

		
	
			vendors.forEach((vendor) => {
				const pathCoordinates = vendor.coordinates.map((coord) => ({
					lat: coord.lat,
					lng: coord.lng,
				}));
	
				const polyline = new google.maps.Polyline({
					path: pathCoordinates,
					geodesic: true,
					strokeColor: '#0870c4',
					strokeOpacity: 1.0,
					strokeWeight: 3,
				});
	
				polyline.setMap(map);
	
				let index = 0;
				const marker = new google.maps.Marker({
					position: pathCoordinates[index],
					map: map,
					icon: {
						url: '/truckIcon.png',
						scaledSize: new google.maps.Size(50, 50),
						anchor: new google.maps.Point(20, 20),
					},
				});
	
				const infoWindowContent = `
				<div style="max-width: 600px; display: flex; flex-direction: column;">
					<h3 style="margin-bottom: 3px; margin-left:3px"><i class="bi bi-person-bounding-box" style="color: #ea3689"></i>  ${
						vendor.vendor_name
					}</h3>
					<hr style="width: 100%; margin-top: 4px; margin-bottom: 10px;">
					<h5 style="margin-left: 3px;"><b>Rating:</b> ${
						vendor.rating_average
					} <i class="bi bi-star-fill"></i></h5>
					<p style="margin-top: 5px;"><b>Accepts:</b> ${vendor.payment_types.join(
						' '
					)}</p>
					<p style=""><b>Offers:</b> ${vendor.dietary_offering}</p>
					<p style=""><b>Hours:</b> ${"12pm -8pm"}</p>
					<p style=""><b>Accessible ♿️:</b> ${
						vendor.accessible ? 'Yes' : 'No'
					}</p>
					<button style="margin-top: auto; padding: 4px 10px; background-color: #ea3689; color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="handleVendorClick(${
						vendor.vendor_id
					})">See Vendor Menu</button>
				</div>
				`;
	
				const infoWindow = new google.maps.InfoWindow({
					content: infoWindowContent,
					maxWidth: 180,
					ariaLabel: 'vendor details in black text on white background',
				});
	
				infoWindows[vendor.vendor_id] = infoWindow;
	
				marker.addListener('click', () => {
					Object.values(infoWindows).forEach((iw) => iw.close());
					infoWindow.open(map, marker);
				});
	
				google.maps.event.addListener(infoWindow, 'closeclick', () => {
					setShowExpandedDetails(false);
					setSelectedVendor(null);
					setSelectedVendorDetails(null);
				});
	
				let traveledPath = [];
	
				const animateMarker = () => {

					const randomizer = Math.random() < 0.7
					if (randomizer) {
					if (index > 0) {
						traveledPath.push(pathCoordinates[index - 1]);
						const traveledPolyline = new google.maps.Polyline({
							path: traveledPath,
							geodesic: true,
							strokeColor: '#59E0C8',
							strokeOpacity: 1.0,
							strokeWeight: 3,
						});
						traveledPolyline.setMap(map);
					}
					marker.setPosition(pathCoordinates[index]);
					index = (index + 1) % pathCoordinates.length;
	
					if (index === 0) {
						return;
					}
				}
					setTimeout(animateMarker, 3730);
				};
				animateMarker();
			});

			// vendorLocations.forEach((vendor) => {
			// 	vendor.locations.forEach((location) => {
			// 	  const marker = new google.maps.Marker({
			// 		position: { lat: location.lat, lng: location.lng },
			// 		map: map,
			// 		icon: {
			// 		  url: '/image.gif',
			// 		  scaledSize: new google.maps.Size(60, 60),
			// 		  anchor: new google.maps.Point(30, 30),
			// 		},
			// 	  });
			  
			// 	  const infoWindow = new google.maps.InfoWindow({
			// 		content: 'Vendor Location',
			// 		maxWidth: 180,
			// 		ariaLabel: 'vendor location marker',
			// 	  });
			  
			// 	  marker.addListener('click', () => {
			// 		Object.values(infoWindows).forEach((iw) => iw.close());
			// 		infoWindow.open(map, marker);
			// 	  });
			  
			// 	  google.maps.event.addListener(infoWindow, 'closeclick', () => {
			// 		setShowExpandedDetails(false);
			// 		setSelectedVendor(null);
			// 		setSelectedVendorDetails(null);
			// 	  });
			// 	});
			//   });
			  
	
			mapRef.current = map;
			setInfoWindows(infoWindows);
		} catch (error) {
			console.error('Error fetching vendor data:', error);
			alert('Vendor data currently unavailable. Refresh to try again.');
		}
	};
	
		fetchData();
	}, []);

	

	
	window.handleVendorClick = async (vendorId) => {
		try {
			setSelectedVendor(vendorId);
			const response = await axios.get(`${url}/vendors/${vendorId}`);
			setSelectedVendorDetails(response.data);
			setShowExpandedDetails(true);
			setMenuExpanded(true);
		} catch (error) {
			console.error('Error fetching vendor data:', error);
		}
	};

	const handleToggleUserLocation = () => {
		if (!isUserLocationEnabled) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};

					const userMarker = new google.maps.Marker({
						position: userLocation,
						map: mapRef.current,
						icon: {
							url: '/image.gif',
							scaledSize: new google.maps.Size(50, 50),
							anchor: new google.maps.Point(20, 20),
						},
					});

					setUserMarker(userMarker);
					setIsUserLocationEnabled(true);
					mapRef.current.setCenter(userLocation);
				},
				(error) => {
					console.error('Error getting user location:', error);
					alert('Error getting user location. Please try again.');
				}
			);
		} else {
			setIsUserLocationEnabled(false);
		}
	};

	const handleCloseDetails = () => {
		setShowExpandedDetails(false);
		setSelectedVendor(null);
		setSelectedVendorDetails(null);
	};

	return (
		<div style={{ display: 'flex', position: 'relative' }}>
			<div
				id="map-container"
				style={{
					width: '100vw',
					height: '100vh',
					border: '2px solid #59E0C8',
					borderRadius: '10px',
          overflowY: 'auto',
				}}
			></div>

			<div>
				<Button
					className="btn btn-md"
					style={{
						backgroundColor: 'rgb(234, 49, 135)',
						borderColor: 'rgb(234, 49, 135)',
						position: 'absolute',
						top: '20px',
						right: '9px',
						zIndex: 1,
						width: '200px',
					}}
					onClick={handleToggleUserLocation}
				>
					{isUserLocationEnabled ? 'Disable Location' : 'Enable Location'}
				</Button>
			</div>

			{showExpandedDetails && selectedVendor && selectedVendorDetails && (
				<div
					className="menu-container"
					style={{
						position: 'absolute',
						width: '40%',
						height: '50vh',
						background: '#ffffff',
						padding: '15px',
						border: '2px solid #59E0C8',
						borderRadius: '10px',
						bottom: '85px',
						right: '10px',
					}}
				>
					<div className="menu-header">
						<i id="menu-image" class="bi bi-person-bounding-box"></i>
						<h3>{selectedVendorDetails.vendor_name}'s Menu</h3>
						<Button
							variant="outline-secondary"
							size="sm"
							onClick={() => setShowExpandedDetails(false)}
							id="menu-button"
						>
							{window.innerWidth > 768 ? 'Close Menu' : '×'}
						</Button>
					</div>
					<Collapse in={menuExpanded}>
						<div
							id="menu-content"
							className="menu-content"
							style={{ maxHeight: '200px', overflowY: 'auto' }}
						>
							<sub>
								<b>
									Accepts{' '}
									{selectedVendorDetails.payment_types
										.map((emoji) => {
											switch (emoji) {
												case '💲':
													return 'Cash';
												case '💳':
													return 'Card';
												case '₿':
													return 'Bitcoin';
												case '🧾':
													return 'Online Ordering';
												default:
													return emoji; // Return the emoji itself if no match
											}
										})
										.join(', ')}{' '}
								</b>
							</sub>
              <hr />
							<ul>
								{selectedVendorDetails.menu.map((item, index) => (
									<li key={index}>
										<sub>
											<i className="fa-solid fa-ice-cream"></i>{' '}
											<b>{item.name} - </b>
											<b>
												<i>${item.price}</i>
											</b>
										</sub>
									</li>
								))}
							</ul>
						</div>
					</Collapse>
				</div>
			)}
		</div>
	);
};

export default Map;
