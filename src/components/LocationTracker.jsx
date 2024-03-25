import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import '../App.css'
function LocationTracker() {
  const [ws, setWs] = useState(null);
  const [wsState, setWsState] = useState("disconnected");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [receivedLocations, setReceivedLocations] = useState([]);

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

  const sendLocation = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude); // Update the latitude state
        setLongitude(longitude);
        const data = { latitude, longitude };
        ws.send(JSON.stringify(data));
      });
    } else {
      console.error("WebSocket connection not open.");
    }
  };

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
      });
    });
  }, [receivedLocations]);

  return (
    <div className="vendormap_container">
      <h1>Location Tracker</h1>
      <p>WebSocket state: {wsState}</p>
      <p>
        Your current location: Latitude {latitude}, Longitude {longitude}
      </p>
      <Button onClick={sendLocation}>Start Route</Button>

      <h2>Received Locations:</h2>
      <ul>
        {receivedLocations.map((location, index) => (
          <li key={index}>
            {console.log(location.latitude)}
            Latitude: {location.latitude}, Longitude {location.longitude}
          </li>
        ))}
      </ul>
      <div id="vendormap" style={{ height: "80vh", width: "75vw" }}></div>
    </div>
  );
}

export default LocationTracker;
