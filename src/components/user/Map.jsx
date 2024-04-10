import { useEffect, useState } from "react";
import axios from "axios";
import "./Map.css";
import { Button, Card, Collapse } from "react-bootstrap";

const center = {
  lat: 40.750797,
  lng: -73.989578,
};

const Map = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isUserLocationEnabled, setIsUserLocationEnabled] = useState(false);
  const [showExpandedDetails, setShowExpandedDetails] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [infoWindows, setInfoWindows] = useState({});
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [userMarker, setUserMarker] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/vendors`);
        const vendors = response.data;

        const map = new google.maps.Map(
          document.getElementById("map-container"),
          {
            zoom: 14,
            center: center,
            mapId: import.meta.env.VITE_GOOGLE_MAPID,
            disableDefaultUI: true,
          }
        );

        if (isUserLocationEnabled) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              const userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                  url: "/image.png",
                  scaledSize: new google.maps.Size(50, 50),
                  anchor: new google.maps.Point(20, 20),
                },
              });

              setUserMarker(userMarker);

              map.setCenter(userLocation);
            },
            (error) => {
              console.error("Error getting user location:", error);
              alert("Error getting user location. Please try again.");
            }
          );
        }

        vendors.forEach((vendor) => {
          const pathCoordinates = vendor.coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          }));

          const polyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: "#0870c4",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });

          polyline.setMap(map);

          let index = 0;
          const marker = new google.maps.Marker({
            position: pathCoordinates[index],
            map: map,
            icon: {
              url: "/truckIcon.png",
              scaledSize: new google.maps.Size(50, 50),
              anchor: new google.maps.Point(20, 20),
            },
          });

          const infoWindowContent = `
          <div style="max-width: 600px; display: flex; flex-direction: column; align-items: center;">
            <h3 style="margin-bottom: 3px;"><i class="bi bi-person-bounding-box" style="color: #ea3689"></i>  ${vendor.vendor_name}</h3>
            <hr style="width: 100%; margin-top: 4px; margin-bottom: 10px;">
            <h5 style="margin-top: 2px;"><b>Rating:</b> ${vendor.rating_average} <i class="bi bi-star-fill"></i></h5>
            <p style="margin-top: 5px;"><b>Payment Types:</b> ${vendor.payment_types}</p>
            <p style="margin-top: 5px;"><b>Dietary Offering:</b> ${vendor.dietary_offering}</p>
            <button style="margin-top: auto; padding: 4px 10px; background-color: #ea3689; color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="handleVendorClick(${vendor.vendor_id})">See Vendor Menu</button>
          </div>
        `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
            maxWidth: 180,
            ariaLabel: "vendor details in black text on white background",
          });

          infoWindows[vendor.vendor_id] = infoWindow;

          marker.addListener("click", () => {
            Object.values(infoWindows).forEach((iw) => iw.close());
            infoWindow.open(map, marker);
          });

          google.maps.event.addListener(infoWindow, "closeclick", () => {
            setShowExpandedDetails(false);
            setSelectedVendor(null);
            setSelectedVendorDetails(null);
          });

          let traveledPath = [];

          const animateMarker = () => {
            if (index > 0) {
              traveledPath.push(pathCoordinates[index - 1]);
              const traveledPolyline = new google.maps.Polyline({
                path: traveledPath,
                geodesic: true,
                strokeColor: "#59E0C8",
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
            setTimeout(animateMarker, 3730);
          };
          animateMarker();
        });

        setInfoWindows(infoWindows);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        alert("Vendor data currently unavailable. Refresh to try again.");
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
      console.error("Error fetching vendor data:", error);
    }
  };

  const handleToggleUserLocation = () => {
	setIsUserLocationEnabled(!isUserLocationEnabled);
	setUserMarker(!userMarker)
  };
  

  const handleCloseDetails = () => {
    setShowExpandedDetails(false);
    setSelectedVendor(null);
    setSelectedVendorDetails(null);
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div
        id="map-container"
        style={{
          width: "100vw",
          height: "100vh",
          border: "2px solid #59E0C8",
          borderRadius: "10px",
        }}
      ></div>

      <div>
      <Button
  variant="primary"
  onClick={() => setIsUserLocationEnabled(!isUserLocationEnabled)}
>
  {isUserLocationEnabled ? 'Disable Location' : 'Enable Location'}
</Button>
      </div>
	  
      {showExpandedDetails && selectedVendor && selectedVendorDetails && (
        <div
          className="menu-container"
          style={{
            position: "absolute",
            width: "30%",
            height: "30vh",
            background: "#ffffff",
            padding: "15px",
            border: "2px solid #59E0C8",
            borderRadius: "10px",
            bottom: "85px",
            right: "10px",
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
              {window.innerWidth > 768 ? "Close Menu" : "×"}
            </Button>
          </div>
          <Collapse in={menuExpanded}>
            <div id="menu-content" className="menu-content">
              <ul>
                {selectedVendorDetails.menu.map((item, index) => (
                  <li key={index}>
                    <sub>
                      <i className="fa-solid fa-ice-cream"></i> {item.name} -{" "}
                      <b>${item.price}</b>
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
