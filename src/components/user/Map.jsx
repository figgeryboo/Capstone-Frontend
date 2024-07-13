import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Map.css';
import { Button } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';

const center = {
  lat: 40.750797,
  lng: -73.989578,
};

const Map = () => {
  const mapRef = useRef(null);
  const url = import.meta.env.VITE_URL;
  const [trucksOffline, setTrucksOffline] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [infoWindows, setInfoWindows] = useState({});
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [userMarker, setUserMarker] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isUserLocationEnabled, setIsUserLocationEnabled] = useState(false);

  const isWithinBusinessHours = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 9 && currentHour < 21;
  };

  useEffect(() => {
    const map = new google.maps.Map(document.getElementById('map-container'), {
      zoom: 14,
      center: center,
      mapId: import.meta.env.VITE_GOOGLE_MAPID,
      disableDefaultUI: true,
    });

    mapRef.current = map;

    if (!isWithinBusinessHours()) {
      setTrucksOffline(true);
      setSnackbarOpen(true);
      return;
    }

    const fetchData = async () => {
      try {
        const vendorsResponse = await axios.get(`${url}/vendors`);
        const vendors = vendorsResponse.data;

        const infoWindows = {};

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

          const marker = new google.maps.Marker({
            position: pathCoordinates[0],
            map: map,
            icon: {
              url: '/truckIcon.png',
              scaledSize: new google.maps.Size(50, 50),
              anchor: new google.maps.Point(20, 20),
            },
          });

          polyline.setMap(map);

          const infoWindowContent = `
            <div style="max-width: 600px; display: flex; flex-direction: column;">
              <h3 style="margin-bottom: 3px; margin-left:3px"><i class="bi bi-person-bounding-box" style="color: #ea3689"></i>  ${vendor.vendor_name}</h3>
              <hr style="width: 100%; margin-top: 4px; margin-bottom: 10px;">
              <h5 style="margin-left: 3px;"><b>Rating:</b> ${vendor.rating_average} <i class="bi bi-star-fill"></i></h5>
              <p style="margin-top: 5px;"><b>Accepts:</b> ${vendor.payment_types.join(' ')}</p>
              <p style=""><b>Offers:</b> ${vendor.dietary_offering}</p>
              <p style=""><b>Hours:</b> 12pm - 9pm</p>
              <p style=""><b>Accessible ♿️:</b> ${vendor.accessible ? 'Yes' : 'No'}</p>
              <button style="margin-top: auto; padding: 4px 10px; background-color: #ea3689; color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="handleVendorClick(${vendor.vendor_id})">See Vendor Menu</button>
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
            setSelectedVendor(null);
            setSelectedVendorDetails(null);
            setMenuExpanded(false);
          });
        });

        setInfoWindows(infoWindows);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        alert('No vendors available. Refresh or try again at a later time.');
      }
    };

    fetchData();
  }, []);

  window.handleVendorClick = async (vendorId) => {
    try {
      setSelectedVendor(vendorId);
      const response = await axios.get(`${url}/vendors/${vendorId}`);
      setSelectedVendorDetails(response.data);
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
      if (userMarker) {
        userMarker.setMap(null);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

      {selectedVendor && selectedVendorDetails && (
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
            <i id="menu-image" className="bi bi-person-bounding-box"></i>
            <h3>{selectedVendorDetails.vendor_name}'s Menu</h3>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setSelectedVendor(null)}
              id="menu-button"
            >
              {window.innerWidth > 768 ? 'Close Menu' : '×'}
            </Button>
          </div>
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
                      default:
                        return emoji;
                    }
                  })
                  .join(', ')}{' '}
                payments.
              </b>
            </sub>
            <ul style={{ paddingLeft: '15px' }}>
              {selectedVendorDetails.menu_items.map((item) => (
                <li key={item.item_id}>
                  <b>{item.item_name}:</b> ${item.item_price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={8000}
        onClose={handleSnackbarClose}
		anchorOrigin={{vertical: "top", horizontal: "center"}}
		>
		<Alert
		onClose={handleSnackbarClose}
		severity="info"
		variant="filled"

	  >
       Trucks are currently offline. <br></br>Check back between opening hours tomorrow or browse the app

      </Alert>
	  </Snackbar>
    </div>
  );
};

export default Map
