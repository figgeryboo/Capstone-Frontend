import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { Snackbar } from "@mui/material";
import axios from "axios";
import vendorMarker from "/vendorscone.png";
import userMarker from "/image.gif";
import "../../App.css";

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
  const [activeVendors, setActiveVendors] = useState([]);
  const [liveVendors, setLiveVendors] = useState([]);
  const [snackBarOpen, setSnackbarOpen] = useState(false)
  const url = import.meta.env.VITE_URL;
  const websocketURL = import.meta.env.VITE_WEBSOCKET_URL;

  const { currentUser } = useAuth();
  const isWithinBusinessHours = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 9 && currentHour < 21;
  };
  // ws setup
  useEffect(() => {
    const newWs = new WebSocket(websocketURL);

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

  const center = {
    lat: 40.750797,
    lng: -73.989578,
  };

  // map instance
  let map;

  useEffect(() => {
    map = new google.maps.Map(document.getElementById("vendormap"), {
      center: center,
      zoom: 13,
      disableDefaultUI: true,
    });

    
    if (!isWithinBusinessHours() && !watchingLocation) {
      setSnackbarOpen(true);
      return;
    }

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
    if (isWithinBusinessHours()) {
    seeVendors.forEach((vendor, index) => {
      if (vendor.coordinates && vendor.coordinates.length > 0) {
        new google.maps.Marker({
          position: {
            lat: vendor.coordinates[0].lat,
            lng: vendor.coordinates[0].lng,
          },
          map,
          title: `${vendor.vendor_name} `,
          icon: {
            url: vendorMarker,
            scaledSize: new google.maps.Size(49, 49),
          },
        });
      }
    });
  }
    activeVendors.forEach((vendor, index) => {
      if (vendor.coordinates && vendor.coordinates.length > 0) {
        new google.maps.Marker({
          position: {
            lat: vendor.coordinates[0].lat,
            lng: vendor.coordinates[0].lng,
          },
          map: mapRef.current,
          title: vendor.vendor_name,
          icon: {
            url: { src: "/truckIcon.png" },
          },
          scaledSize: new google.maps.Size(49, 49),
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

        // setLatitude(lat);
        // setLongitude(lng);
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
    if (watchingLocation) {
      saveRoute();
    }
  };

  const saveRoute = () => {
    if (routeCoordinates.length === 0) {
      console.log("No route to save");
      return;
    }
    const uid = currentUser.uid;

    axios
      .get(`${url}/vendors/locations`)
      .then((res) => {
        const vendorLocations = res.data;

        const existingVendor = vendorLocations.find(
          (vendor) => vendor.uid === uid
        );
        if (!existingVendor) {
          // If vendor not found, add them
          axios
            .post(`${url}/vendors/locations`, {
              uid: uid,
              locations: routeCoordinates,
            })
            .then((res) => {
              console.log("Vendor locations added:", res.data);
            })
            .catch((error) => {
              console.error(
                "Error adding vendor locations:",
                error.response.data
              );
            });
        } else {
          const existingLocations = existingVendor.locations || [];
          // Filter out duplicate coordinates
          const newCoordinates = routeCoordinates.filter(
            (coord) =>
              !existingLocations.some(
                (loc) => loc.lat === coord.lat && loc.lng === coord.lng
              )
          );

          const updatedLocations = [...existingLocations, ...newCoordinates];

          axios
            .put(`${url}/vendors/locations/${uid}`, {
              locations: updatedLocations,
            })
            .then((res) => {
              setSnackbarMessage("Route saved successfully!");
              setOpenSnackbar(true);
              // setRouteCoordinates([]);
            })
            .catch((error) => {
              console.error("Error saving route:", error.response.data);
              setSnackbarMessage(
                "Failed to save route! Oops, that's a mistake on our end. Don't worry, we're on it & will fix it shortly."
              );
              setOpenSnackbar(true);
            });
        }
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

  useEffect(() => {
    axios
      .get(`${url}/firebase/getFirebaseVendors`)
      .then((response) => {
        setActiveVendors(response.data);

        response.data.forEach((vendor, index) => {
          if (vendor.coordinates && vendor.coordinates.length > 0) {
            new google.maps.Marker({
              position: {
                lat: vendor.coordinates[0].lat,
                lng: vendor.coordinates[0].lng,
              },
              map,
              title: vendor.vendor_name,
              icon: {
                url: vendorMarker,
                scaledSize: new google.maps.Size(29, 29),
              },
            });
          }
        });
      })
      .catch((err) => console.error(err));
  }, []);

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
      {/* <Button
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
      </Button> */}
    </div>
  );
}

export default LocationTracker;
