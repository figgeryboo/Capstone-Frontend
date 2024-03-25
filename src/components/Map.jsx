import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import Reviews from "./Reviews";

const center = {
  lat: 40.846688,
  lng: -73.910008,
};

function Map() {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
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

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h4>${vendor.vendor_name}</h4>
                <p>Contact Info: ${vendor.contact_info}</p>
                <p>Dietary Offering: ${vendor.dietary_offering}</p>
                <p>Rating: ${vendor.rating_average}</p>
                <p>Menu: ${vendor.menu}</p>
                <p>
                <a href="#" onclick="setSelectedVendor(${vendor.vendor_id}); setShowReviews(true);">Click here to see reviews</a></p>
              </div>
            `,
            maxWidth: 180,
            ariaLabel: 'vendor details in black text on white background'
          });

          infoWindows[vendor.vendor_id] = infoWindow;

          marker.addListener("click", () => {
            // Close any previously open info windows
            Object.values(infoWindows).forEach((iw) => iw.close());

            // Open the info window for the clicked marker
             infoWindow.open(map, marker);
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

            setTimeout(animateMarker, 3730);
          };

          animateMarker();
        });

        setInfoWindows(infoWindows);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        alert("Vendor data currently available. Refresh to try again");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="locations_container">
      <div
        id="map-container"
        style={{ width: "70vw", height: "70vh", border: "2px solid #E62C7C", borderRadius: '10px'}}
      ></div>
      {selectedVendor && showReviews && (
        <Reviews vendorId={selectedVendor.vendor_id} />
      )}
    </div>
  );
}

export default Map;
