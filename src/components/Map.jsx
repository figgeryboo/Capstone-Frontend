import { useEffect, useState } from "react";
import axios from "axios";
import './Map.css'
//import { Button } from 'react-bootstrap';

const center = {
  lat: 40.846688,
  lng: -73.910008,
};

const Map = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showExpandedDetails, setShowExpandedDetails] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [infoWindows, setInfoWindows] = useState({});

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
            strokeColor: "#a048f8e6",
            strokeOpacity: 1.0,
            strokeWeight: 2.8,
          });

          polyline.setMap(map);

          let index = 0;
          const marker = new google.maps.Marker({
            position: pathCoordinates[index],
            map: map,
            icon: {
              url: "/truckIcon.png",
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            },
          });

          const infoWindowContent = `
            <div>
              <h3>${vendor.vendor_name}</h3>
              <h4><b>Rating: ${vendor.rating_average}</b></h4>
              <p>${vendor.payment_types}</p>
              <p>${vendor.dietary_offering}</p>
              <Button variant="primary" size="small" onclick="handleVendorClick(${vendor.vendor_id})">See more about vendor</Button>
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
            maxWidth: 180,
            ariaLabel: 'vendor details in black text on white background'
          });

          infoWindows[vendor.vendor_id] = infoWindow;

          marker.addListener("click", () => {
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
            if (index > 0) {
              traveledPath.push(pathCoordinates[index - 1]);
              const traveledPolyline = new google.maps.Polyline({
                path: traveledPath,
                geodesic: true,
                strokeColor: "#e8340ce6",
                strokeOpacity: 1.0,
                strokeWeight: 3,
              });
              traveledPolyline.setMap(map);
            }
            marker.setPosition(pathCoordinates[index]);
            index = (index + 1) % pathCoordinates.length;

            if (index === 0) {
              // marker reached the end of the path
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
    setSelectedVendor(vendorId);
    const response = await axios.get(`${url}/vendors/${vendorId}`);
    setSelectedVendorDetails(response.data);
    setShowExpandedDetails(true);
  };

  const handleCloseDetails = () => {
    setShowExpandedDetails(false);
    setSelectedVendor(null);
    setSelectedVendorDetails(null);
  };

  return (
    <div className="map-container" 
    style={{ maxWidth: 'unset !important', display: "flex", position: 'relative'}}>
      <div
      
        id="map-container"
        style={{ width: "100vw", height: "80vh", border: "2px solid #59E0C8", borderRadius: '10px'}}
      ></div>
      {showExpandedDetails && selectedVendor && selectedVendorDetails && (
        <div style={{ position: 'absolute', width: "100%", height: "20vh", background: "#ffffff", padding: "15px", border: "2px solid #59E0C8", borderRadius: '10px', overflowY: "auto", bottom: '0'}}>
          <div>
            <h4>{selectedVendorDetails.vendor_name}'s Menu</h4>
            <ul>
              {selectedVendorDetails.menu.map((item, index) => (
                <li key={index}>
                  <sub>{item.name} - ${item.price}</sub>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
