import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  Polyline,
  MarkerClusterer,
} from "@react-google-maps/api";
import truckIcon from "/truckIcon.png";
import axios from "axios";
import "../App.css";
import LocationTracker from "./LocationTracker";

const containerStyle = {
  width: "75vw",
  height: "70vh",
  border: "2px solid teal",
};

const center = {
  lat: 40.846688,
  lng: -73.910008,
};
const apiKey = import.meta.env.VITE_MAP_API_KEY;
const url = import.meta.env.VITE_BACKEND_URL;

function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [paths, setPath] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const truckMarkerRef = useRef(null);

  // useEffect(() => {
  //   const fetchTruckLocations = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:4444/vendors`);
  //       const geolocales = response.data.map(
  //         (location) => location.coordinates
  //       );
  //       setPath(geolocales);
  //     } catch (error) {
  //       console.error("Error fetching truck locations:", error);
  //       alert("No locations Available");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchTruckLocations();
  // }, []);

  // useEffect(() => {
  //   const animateTruck = (paths, index = 0) => {
  //     // console.log(Object.values(truckMarkerRef));
  //     const marker = truckMarkerRef;

  //     if (!truckMarkerRef.current) {
  //       console.error("Truck marker ref is not set.");
  //       return;
  //     }

  //     console.log("mark", marker);
  //     if (marker === null) {
  //       console.error(
  //         "setPosition method is not available on truck marker ref."
  //       );
  //       return;
  //     }

  //     if (index < paths.length) {
  //       const newPosition = paths[index];
  //       console.log(index);
  //       if (newPosition && newPosition.latitude && newPosition.longitude) {
  //         console.log("Moving truck to:", newPosition);
  //         // Update state that's used for the Marker's position prop
  //         // setPath((prevPath) => [...prevPath.slice(0, index), newPosition, ...prevPath.slice(index + 1)]);

  //         setTimeout(() => {
  //           animateTruck(paths, index + 1);
  //         }, 3000); //delay for animation speed
  //       } else {
  //         console.error("Invalid newPosition:", newPosition);
  //       }
  //     } else {
  //       console.log("Animation completed.");
  //     }
  //   };

  //   if (paths.length > 0) {
  //     animateTruck(paths);
  //   }
  // }, [paths]);

  // useEffect(() => {
  //   const createClusters = (locations, radius) => {
  //     const clusters = [];
  //     const visited = new Set();

  //     locations.forEach((location) => {
  //       if (visited.has(location)) {
  //         return;
  //       }

  //       const cluster = [location];
  //       visited.add(location);

  //       locations.forEach((otherLocation) => {
  //         if (
  //           !visited.has(otherLocation) &&
  //           calculateDistance(location, otherLocation) <= radius
  //         ) {
  //           cluster.push(otherLocation);
  //           visited.add(otherLocation);
  //         }
  //       });

  //       clusters.push(cluster);
  //     });

  //     return clusters;
  //   };

  //   const calculateDistance = (location1, location2) => {
  //     const lat1 = location1.latitude;
  //     const lng1 = location1.longitude;
  //     const lat2 = location2.latitude;
  //     const lng2 = location2.longitude;

  //     return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
  //   };

  //   const radius = 0.003;
  //   const clusters = createClusters(path, radius);
  //   setClusters(clusters);
  // }, [path]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/vendors`);
        const geolocales = response.data.map((location) => ({
          vendorName: location.vendor_name,
          coordinates: location.coordinates,
        }));
        geolocales.forEach((vendor) => {
          console.log(
            `name ${vendor.vendorName} coordinates:`,
            vendor.coordinates
          );
          setTrucks(vendor.vendorName);
        });
        setPath(geolocales);
      } catch (error) {
        console.error("Error fetching truck locations:", error);
        alert("No locations Available");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkerClick = (vendorName) => {
    const selectedTruck = paths.find(
      (truck) => truck.vendorName === vendorName
    );
    if (selectedTruck) {
      console.log(selectedTruck);
      setSelectedTruck(selectedTruck);
    } else {
      console.error("Truck not found for vendorName:", vendorName);
    }
  };

  // useEffect(() => {
  //   if (truckMarkerRef.current && clusters.length > 0) {
  //     let currentIndex = 0;
  //     const interval = setInterval(() => {
  //       truckMarkerRef.current.setPosition({
  //         lat: clusters[currentIndex][0].latitude,
  //         lng: clusters[currentIndex][0].longitude
  //       });
  //       currentIndex = (currentIndex + 1) % clusters.length;
  //     }, 1000); // Adjust the interval based on your needs

  //     return () => clearInterval(interval);
  //   }
  // }, [clusters]);

  const handleInfoWindowClose = () => {
    console.log("Info window closed");
    setSelectedTruck(null);
  };

  // const handleLocationChange = (location) => {
  //   setUserLocation(location);
  // };
  /* ws connection
  useEffect(() => {
    // initializ connection
    const ws = new WebSocket("ws://localhost:4444");
    //listen for server messages 
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Update path or clusters based on the message received
      setPath(message.locations); // updated locations message
    };
    // Cleanup WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

*/
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="locations_container"
        center={userLocation ? userLocation : center}
        zoom={13}
      >
        {/* <LocationTracker
        onLocationChange={(location) => {
          handleLocationChange(location);
          setPath((prevPath) => [...prevPath, location]);
        }}
      /> */}
        {/* {!isLoading &&  ( */}
        <>
          {paths.map((path, index) => (
            <Polyline
              key={`polyline-${index}`}
              path={path.coordinates}
              options={{
                strokeColor: "rgb(114, 55, 231)",
                strokeOpacity: 1.0,
                strokeWeight: 3,
              }}
            />
          ))}
          {paths.map((path, index) => (
            <Marker
              key={`marker-${index}`}
              position={{
                lat: path.coordinates[0].lat,
                lng: path.coordinates[0].lng,
              }}
              icon={{
                url: truckIcon,
              }}
              onClick={() => {
                console.log("these are the coordinates:", path);
                handleMarkerClick(path.vendorName);
              }}
            />
          ))}
        </>
        {/* )}  */}
        {selectedTruck && (
          <InfoWindow
            position={{
              lat: selectedTruck.coordinates[0].lat,
              lng: selectedTruck.coordinates[0].lng,
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              <h2>{selectedTruck.vendor_name}</h2>
              <p>Contact Info: {selectedTruck.contact_info}</p>
              <p>Rating: {selectedTruck.rating_average}</p>
              <p>Dietary Offering: {selectedTruck.dietary_offering}</p>
              <p>Menu: {selectedTruck.menu}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;

/**
 * 
 * 
  return (
      

        {selectedTruck && (
          <InfoWindow
            position={{ lat: selectedTruck.latitude, lng: selectedTruck.longitude }}
            onCloseClick={() => setSelectedTruck(null)}
          >
            <div>
              <h2>Truck Info</h2>
              <p>Details about the truck</p>
            </div>
          </InfoWindow>
        )}

    
 
  );
}

 */
