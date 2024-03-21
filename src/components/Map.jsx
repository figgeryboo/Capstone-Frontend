import { useEffect } from "react";
import axios from "axios";
import "../App.css";

const center = {
  lat: 40.846688,
  lng: -73.910008,
};

function Map() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/vendors`);
        const vendors = response.data;

        const map = new google.maps.Map(
          document.getElementById("map-container"),
          {
            zoom: 13,
            center: center,
          }
        );
// set vendor cordinates here 
        vendors.forEach((vendor) => {
          const pathCoordinates = vendor.coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          }));

          const polyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: "#1b8f81e6",
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
              </div>
            `,
            maxWidth: 180, 
        
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          const animateMarker = () => {
            marker.setPosition(pathCoordinates[index]);
            index = (index + 1) % pathCoordinates.length;
            setTimeout(animateMarker, 3730); 
          };

          animateMarker();
        });
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        alert("No vendor data available");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="locations_container">
      <div
        id="map-container"
        style={{ width: "75vw", height: "70vh", border: "2px solid teal" }}
      ></div>
    </div>
  );
}

export default Map;
