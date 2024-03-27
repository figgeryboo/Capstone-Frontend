import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import vendorMarker from "/truckIcon.png";
import "../App.css";

function LocationTracker() {
  const [ws, setWs] = useState(null);
  const [wsState, setWsState] = useState("disconnected");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [receivedLocations, setReceivedLocations] = useState([]);
  const [watchingLocation, setWatchingLocation] = useState(false);
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    const newWs = new WebSocket("ws://localhost:4444");

    newWs.onopen = () => {
      console.log("WebSocket connected");
      setWsState("connected");
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected");
      setWsState("disconnected");
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("parsed", data);
        setReceivedLocations((prevLocations) => [...prevLocations, data]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  // Create a map instance
  let map;

  useEffect(() => {
    map = new google.maps.Map(document.getElementById("vendormap"), {
      center: { lat: 40.8571627, lng: -73.9015161 },
      zoom: 12,
    });

    receivedLocations.forEach((location, index) => {
      new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map,
        title: `Location ${index + 1}`,
        icon: {
          url: vendorMarker,
          scaledSize: new google.maps.Size(45, 45),
        },
      });
    });

    const path = receivedLocations.map((location) => ({
      lat: location.latitude,
      lng: location.longitude,
    }));

    // Create a Polyline and set it on the map
    const newPolyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#75E3C7",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    newPolyline.setMap(map);
    setPolyline(newPolyline);
  }, [receivedLocations]);

  useEffect(() => {
    if (watchingLocation) {
      const watchId = navigator.geolocation.watchPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);
        if (ws && ws.readyState === WebSocket.OPEN) {
          const data = { latitude: lat, longitude: lng };
          ws.send(JSON.stringify(data));
        } else {
          console.error("WebSocket connection not open.");
        }
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [watchingLocation, ws]);

  const toggleWatchLocation = () => {
    setWatchingLocation((prev) => !prev);
  };

  return (
    <div className="vendormap_container">
      <h1>
      <Button onClick={toggleWatchLocation}>
        {watchingLocation
          ? "Stop Watching Location"
          : "Start Watching Location"}
      </Button>
      </h1>
      <div id="vendormap" style={{ height: "80vh", width: "75vw" }}></div>
      <p>WebSocket state: {wsState}</p>
      <p>
        Your current location: Latitude {latitude}, Longitude {longitude}
      </p>
  
      <h2>Received Locations:</h2>
      <ul>
        {receivedLocations.map((location, index) => (
          <li key={index}>
            {console.log(location.latitude)}
            Latitude: {location.latitude}, Longitude {location.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationTracker;
