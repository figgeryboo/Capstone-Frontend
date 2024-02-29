import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/WMICLOGO.png";

const OtherMap = () => {
  const apiKey = import.meta.env.VITE_MAP_API_KEY;
  const [truckMarker, setTruckMarker] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [userPings, setUserPings] = useState([]);
  const scriptRef = useRef(null);

  // load the map once on site
  useEffect(() => {
    async function loadGoogleMapsScript() {
      if (!document.getElementById("google-maps-script")) {
        // set up the gscript 
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = initMap;
        scriptRef.current = script;
        document.body.appendChild(script);
      } else {
        initMap(); // Initialize map if script is already loaded
      }
    }

    loadGoogleMapsScript();

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      clearInterval(intervalId);
    };
  }, []);

  function initMap() {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.7506, lng: -73.9935 },
      zoom: 10,
    });
    directionsRenderer.setMap(map);

    const truckIcon = {
      url: logo,
      scaledSize: new window.google.maps.Size(50, 50),
    };

    const truckMarker = new window.google.maps.Marker({
      position: { lat: 40.7506, lng: -73.99105 },
      map,
      icon: truckIcon,
    });

    setTruckMarker(truckMarker);

    const request = {
      origin: "Madison Square Garden New York, NY",
      destination: "Grand Central Terminal New York, NY",
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);

        animateTruck(result.routes[0].overview_path);
        console.log(result.routes[0].overview_path);
      } else {
        console.error("Directions request failed due to " + status);
      }
    });

    function animateTruck(path) {
      let index = 0;
      let firstMove = true;

      setIntervalId(
        setInterval(() => {
          index = (index + 1) % path.length;
          const newPosition = path[index];
          truckMarker.setPosition(newPosition);

          if (firstMove) {
            alert(`The truck is now on route`);
            firstMove = false; // avoid further alerts
          }
        }, 5940) // position update every x sec
      );
    }
    map.addListener("click", (event) => {
      handleUserPing(event.latLng, map);
    });

    // TODO: Fix this !!!! so that they can work in tandem
    function getUserLocation() {
      const infoWindow = new google.maps.InfoWindow();
  
      const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
          browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
        );
      };
      const locationButton = document.createElement("button");
  
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
      locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
  
              infoWindow.setPosition(pos);
              infoWindow.setContent("Location found.");
              infoWindow.open(map);
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });
      infoWindow.open(map);
    }
  }
  // TODO: this works IF the above function is removed
  function handleUserPing(location, map) {
    const userPingMarker = new window.google.maps.Marker({
      position: location,
      map,
      title: "User Ping",
    });

    setUserPings([...userPings, userPingMarker]);
  }
  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default OtherMap;
