import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
  } from "@vis.gl/react-google-maps";
  import { useEffect, useState } from "react";
  import "../App.css";
  
  const MapVgi = () => {
    const position = { lat: 40.6868, lng: -73.9557 };
    return (
      <div
        className="map2-container"
        style={{ height: "100vh", width: "100%"}}
      >
        <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
          <Map
            center={position}
            zoom={12}
            mapId={import.meta.env.VITE_MAP_ID}
            fullscreenControl={false}
            interactive={true}
          >
            <Directions />
          </Map>
        </APIProvider>
      </div>
    );
  };
  
  function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
  
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
  
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
  
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];
  
    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService());
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);
  
    useEffect(() => {
      if (!directionsService || !directionsRenderer) return;
      directionsService
        .route({
          origin: "400 E Fordham Rd, Bronx NY",
          destination: "47-11 Austell Place, Lic Queens",
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        })
        .then((res) => {
          directionsRenderer.setDirections(res);
          setRoutes(res.routes);
        });
    }, [directionsService, directionsRenderer]);
    console.log(routes);
  
    useEffect(() => {
      if (!directionsRenderer) return;
      directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);
  
    if (!leg) return null;
    return (
      <div className="directions">
        <h2>{selected.summary}</h2>
        <p>
          {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
        </p>
        <p>Distance: {leg.distance?.text}</p>
        <p>Duration: {leg.duration?.text}</p>
        <h2>Other Routes Available</h2>
        <ul>
          {routes.map((route, index) => (
            <li key={route.summary}>
              <button onClick={() => setRouteIndex(index)}>
                {route.summary}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
export default MapVgi;




// // Initialize the map
// function initMap() {
//     const map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 14,
//       center: { lat: 40.761, lng: -73.997 }, // Centered at New York City
//     });
  
//     // Define the coordinates for the polyline
//     const polylineCoordinates = [
//       { lat: 40.760163, lng: -74.002428 }, // 42nd St & 12th Ave
//       { lat: 40.726, lng: -73.991 },       // 42 1st Ave
//     ];
  
//     // Create the polyline
//     const polyline = new google.maps.Polyline({
//       path: polylineCoordinates,
//       geodesic: true,
//       strokeColor: "#FF0000",
//       strokeOpacity: 1.0,
//       strokeWeight: 2,
//     });
  
//     // Set the polyline on the map
//     polyline.setMap(map);
//   }
  