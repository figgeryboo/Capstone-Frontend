import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
// import FetchedLocations from "./FetchedLocations";

const containerStyle = {
  width: "600px",
  height: "500px",
  padding: "3px",
};

const center = {
  lat: 40.753742,
  lng: -73.983559,
};

const apiKey = import.meta.env.VITE_MAP_API_KEY;

function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [showRoute, setShowRoute] = useState(true);

  const handleLocationChange = (location) => {
    setUserLocation(location);
  };

  const handleLocationsFetched = (locations) => {
    // Set the fetched locations as the path
    const newPath = locations.map((location) => ({
      lat: parseFloat(location.latitude),
      lng: parseFloat(location.longitude),
    }));
    setPath(newPath);
    console.log("New path:", newPath);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      {/* <FetchedLocations onLocationsFetched={handleLocationsFetched} /> */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="map"
        center={userLocation ? userLocation : center}
        zoom={userLocation ? 15 : 10}
      >
        {userLocation && (
          <Marker position={{ lat: userLocation.lat, lng: userLocation.lng }} />
        )}
        {showRoute && path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#690aa0e6",
              strokeOpacity: 1.0,
              strokeWeight: 4,
            }}
          />
        )}
        <br />
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
