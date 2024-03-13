import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Polyline,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import "../App.css";

const containerStyle = {
  width: "77vw",
  height: "72vh",
};
const center = {
  lat: 40.857185,
  lng: -73.9016228,
};



const StaticLocations = () => {
  // const [truckRoute, setTruckRoute] = useState({});
  const [truckMarkers, setTruckMarkers] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      animateTrucks();
    }, 4800); // Update truck positions every 2 seconds

    return () => clearInterval(interval);
  }, []);


  // const truckMarkers = Object.keys(truckCos).map((vendorKey) => (
  //   <Marker
  //     key={vendorKey}
  //     position={truckCos[vendorKey].coordinates[0]} // Display the first coordinate as the truck position
  //     icon={{
  //       url: truckIcon,
  //       scaledSize: new window.google.maps.Size(70, 70)
  //     }}
  //   />

  // ));

  return (
    <div className="locations_container">
      <h2>Routes</h2>
      {}
      {/* <LoadScript googleMapsApiKey={import.meta.env.VITE_MAP_API_KEY} async>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onClick={(e) => console.log(e.latLng)}
          async
        >
          {truckMarkers}
          {Object.keys(truckCos).map((vendorKey) => (
            <Polyline
              key={vendorKey}
              path={truckCos[vendorKey].coordinates}
              options={{
                strokeColor: "#5c0fa4",
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript> */}
    </div>
  );
};

export default StaticLocations;
