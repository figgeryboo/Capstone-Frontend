import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import userMarker from "/image.gif";
import vendorMarker from "/vendorscone.png";
import "../../App.css";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
import { Snackbar } from "@mui/material";

function LocationTracker() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [ws, setWs] = useState(null);
  const [wsState, setWsState] = useState("disconnected");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [receivedLocations, setReceivedLocations] = useState([]);
  const [watchingLocation, setWatchingLocation] = useState(false);
  const [polyline, setPolyline] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [seeVendors, setSeeVendors] = useState([]);
  const url = import.meta.env.VITE_LOCAL_HOST;
  const { currentUser } = useAuth();

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
        setRouteCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          { lat: data.latitude, lng: data.longitude },
        ]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  // map instance
  let map;

  useEffect(() => {
    map = new google.maps.Map(document.getElementById("vendormap"), {
      center: { lat: 40.750797, lng: -73.989578 },
      zoom: 13,
      disableDefaultUI: true,
    });

    receivedLocations.forEach((location, index) => {
      new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map,
        title: `Location ${index + 1}`,
        icon: {
          url: userMarker,
          scaledSize: new google.maps.Size(47, 47),
        },
      });
    });

    axios.get(`${url}/vendors`).then((res) => {
      setSeeVendors(res.data);
    });

    seeVendors.forEach((vendor, index) => {
      if (vendor.coordinates && vendor.coordinates.length > 0) {
        // console.log(vendor)
        new google.maps.Marker({
          position: {
            lat: vendor.coordinates[0].lat,
            lng: vendor.coordinates[0].lng,
          },
          map,
          title: vendor.vendor_name,
          icon: {
            url: vendorMarker,
            scaledSize: new google.maps.Size(49, 49),
          },
        });
      }
    });
    const path = receivedLocations.map((location) => ({
      lat: location.latitude,
      lng: location.longitude,
    }));

    const newPolyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#75E3C7",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    newPolyline.setMap(map);
    setPolyline(newPolyline);
  }, [receivedLocations, location]);

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

  // TODO post to /locations
  const saveRoute = () => {
    if (routeCoordinates.length === 0) {
      console.log("No route to save");
      return;
    }
    const uid = currentUser.uid;

    axios
      .get(`${url}/vendors/locations/${uid}`)
      .then((res) => {
        const existingLocations = res.data.locations || [];
        const updatedLocations = [...existingLocations, ...routeCoordinates];

        axios
          .put(`${url}/vendors/locations/${uid}`, {
            locations: updatedLocations,
          })
          .then((res) => {
            console.log("Route saved:", routeCoordinates);
            console.log("Response status code:", res.status);
            console.log(res.data);
            setSnackbarMessage("Route saved successfully!"); 
            setOpenSnackbar(true);
            setRouteCoordinates([]);
          })
          .catch((error) => {
            console.error("Error saving route:", error.response.data);
            setSnackbarMessage("Failed to save route. Please try again."); 
            setOpenSnackbar(true);
          });
      })
      .catch((error) => {
        console.error(
          "Error fetching existing locations:",
          error.response.data
        );
        setSnackbarMessage("Failed to save route. Please try again.");
        setOpenSnackbar(true);
      });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div
        id="vendormap"
        style={{ height: "100vh", width: "100vw", border: "3px solid #59E0C8" }}
      ></div>
      <div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5500}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "10px",
          zIndex: 1,
        }}
      >
        <Button
          className="btn btn-md"
          style={{
            backgroundColor: "rgb(234, 49, 135)",
            borderColor: "rgb(234, 49, 135)",
            position: "absolute",
            bottom: "70px",
            left: "0px",
            zIndex: 1,
            width: "120px",
          }}
          onClick={toggleWatchLocation}
        >
          {watchingLocation ? "Stop Route" : "Start Route"}
        </Button>
      </div>
      <Button
        className="btn btn-md"
        style={{
          backgroundColor: "rgb(234, 49, 135)",
          borderColor: "rgb(234, 49, 135)",
          position: "absolute",
          bottom: "84px",
          right: "5px",
          zIndex: 1,
          width: "120px",
        }}
        onClick={saveRoute}
        disabled={!watchingLocation || routeCoordinates.length === 0}
      >
        Save Route
      </Button>
      {/* <p>WebSocket state: {wsState}</p>
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
      </ul> */}
    </div>
  );
}

export default LocationTracker;
