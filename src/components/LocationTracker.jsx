import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom";
// import { WebSocket } from "ws";

function LocationTracker({onLocationChange}) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [initialLocation, setInitialLocation] = useState(null);
  const [socket, setSocket] = useState(null);


  // useEffect(() => {
  //   const ws = new WebSocket("ws://https://testtrackback.onrender.com/locations");

  //   ws.onopen = () => {
  //     console.log("WebSocket connected");
// ws.send(https://testtrackback.onrender.com/locations");

  //   };

  //   ws.onmessage = (event) => {
  //     console.log("Received message from server:", event.data);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket disconnected");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (socket && latitude !== null && longitude !== null) {
  //     const data = { latitude, longitude };
  //     socket.send(JSON.stringify(data));
  //   }
  // }, [socket, latitude, longitude]);




  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        if (!initialLocation) {
          setInitialLocation({ latitude: lat, longitude: lng });
        }
      });
    } else {
      console.log("This browser does not support geolocation.");
    }
  }, [initialLocation]);

  useEffect(() => {
    if (latitude && longitude && !time) {
      setTime(new Date()); // set time when user logs location
    }
  }, [latitude, longitude, time]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);
      if (!time) {
        setTime(new Date()); // set time when user logs location
      }
      onLocationChange({ lat, lng }); // set new coord
      // send to server
      sendLocationData(lat, lng);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId); // Stop watching the location when component unmounts
    };
  }, [onLocationChange, time]);
// how often to send location
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (time) {
  //       setDuration(Math.round((new Date() - time) / 10000)); 
  //     }
  //   }, 10000);
  //   return () => clearInterval(interval); // cleanup interval on unmount
  // }, [time]);

  const sendLocationData = (lat, lng) => {
    const url = import.meta.env.VITE_BASE_URL;

    const data = {
      latitude: lat,
      longitude: lng,
      duration: duration,
    };

    // axios.post(`${url}/location`, data)
    //   .then((res) => {
    //     console.log("Location data sent successfully!", res.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error sending location data:", error);
    //   });
  };

  return (
  <>
      <div>
      {latitude && longitude ? (
        <p>
          Your exact location: <span>Latitude: {latitude}, Longitude: {longitude}</span>
          <br />
          Starting location: <span>Latitude: {initialLocation?.latitude}, Longitude: {initialLocation?.longitude}</span>
          <br />
          Time at location: {duration} seconds
        </p>
      ) : (
        <p>Loading location...</p>
    
      )}
    </div>
  <br />

    </>
   
  );
}

export default LocationTracker;
