import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import LocationTracker from "./LocationTracker";

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
// const customMapStyle = import.meta.env.VITE_GOOGLE_MAPID;

function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [showRoute, setShowRoute] = useState(true);

  const handleLocationChange = (location) => {
    setUserLocation(location);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <LocationTracker
        onLocationChange={(location) => {
          handleLocationChange(location);
          setPath((prevPath) => [...prevPath, location]);
        }}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="map"
        center={userLocation ? userLocation : center}
        zoom={userLocation ? 15 : 10}
        // mapId= {customMapStyle.mapId}
      >
        {userLocation && (
          <Marker position={{ lat: userLocation.lat, lng: userLocation.lng }} />
        )}
        {showRoute && (
          <Polyline
            path={path.map((location) => ({
              lat: location.lat,
              lng: location.lng,
            }))}
            options={{
              strokeColor: "#690aa0e6",
              strokeOpacity: 1.0,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
