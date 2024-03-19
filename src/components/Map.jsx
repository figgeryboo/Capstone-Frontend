import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline
} from "@react-google-maps/api";
import LocationTracker from "./LocationTracker";
import truckIcon from "/truckIcon.png";
import axios from "axios";
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
const url = import.meta.env.VITE_BACKEND_URL
const truckCos = {
  vendorA: {
    coordinates: [
      { lat: 40.847347, lng: -73.908841 },
      { lat: 40.848049, lng: -73.908601 },
      { lat: 40.849344, lng: -73.908158 },
      { lat: 40.849679, lng: -73.908028 },
      { lat: 40.850652, lng: -73.907697 },
      { lat: 40.850901, lng: -73.907615 },
      { lat: 40.851063, lng: -73.907915 },
      { lat: 40.851364, lng: -73.908382 },
      { lat: 40.851008, lng: -73.908722 },
      { lat: 40.850793, lng: -73.90888 },
      { lat: 40.850309, lng: -73.909035 },
      { lat: 40.849784, lng: -73.909221 },
      { lat: 40.848936, lng: -73.909514 },
      { lat: 40.848149, lng: -73.90983 },
      { lat: 40.847652, lng: -73.91018 },
      { lat: 40.847319, lng: -73.910406 },
      { lat: 40.847096, lng: -73.910577 },
      { lat: 40.84696, lng: -73.910674 },
      { lat: 40.846909, lng: -73.910555 },
      { lat: 40.846827, lng: -73.91036 },
      { lat: 40.846762, lng: -73.910202 },
      { lat: 40.846688, lng: -73.910008 },
    ],
    currentIndex: 0,
    info: [],
      menu: []
  },
  vendorB: {
    coordinates: [
      { lat: 40.845158, lng: -73.905727 },
      { lat: 40.846569, lng: -73.905614 },
      { lat: 40.847133, lng: -73.905558 },
      { lat: 40.847468, lng: -73.905496 },
      { lat: 40.847445, lng: -73.905202 },
      { lat: 40.847404, lng: -73.904814 },
      { lat: 40.847296, lng: -73.904658 },
      { lat: 40.847036, lng: -73.904688 },
      { lat: 40.846759, lng: -73.904707 },
      { lat: 40.846624, lng: -73.904725 },
      { lat: 40.84662, lng: -73.904534 },
      { lat: 40.846598, lng: -73.904012 },
      { lat: 40.846587, lng: -73.903811 },
      { lat: 40.846961, lng: -73.903781 },
      { lat: 40.84724, lng: -73.903756 },
      { lat: 40.847602, lng: -73.903674 },
      { lat: 40.847793, lng: -73.90361 },
      { lat: 40.847892, lng: -73.903583 },
      { lat: 40.84794, lng: -73.903694 },
      { lat: 40.848009, lng: -73.904024 },
    ],
    currentIndex: 0,
    info: [],
    menu: []
  },
};

function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [truckImage, setTruckImage] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [clusters, setClusters] = useState([]);
  const truckMarkerRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      const trucksIcon = {
        url: truckIcon,
        scaledSize: new window.google.maps.Size(25, 25),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(12.5, 12.5),
      };

      setTruckImage(trucksIcon);
    }
  }, [isScriptLoaded]);

  useEffect(() => {
    const fetchTruckLocations = async () => {
      try {
        const response = await axios.get(`${url}/locations`);
        setPath(response.data);
      
      } catch (error) {
        console.error("Error fetching truck locations:", error);
      }
    };

    const interval = setInterval(() => {
      fetchTruckLocations();
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (path.length > 0) {
      const createClusters = (locations, radius) => {
        const clusters = [];
        const visited = new Set();

        locations.forEach(location => {
          if (visited.has(location)) {
            return;
          }

          const cluster = [location];
          visited.add(location);

          locations.forEach(otherLocation => {
            if (!visited.has(otherLocation) && calculateDistance(location, otherLocation) <= radius) {
              cluster.push(otherLocation);
              visited.add(otherLocation);
            }
          });

          clusters.push(cluster);
        });

        return clusters;
      };

      const calculateDistance = (location1, location2) => {
        const lat1 = location1.latitude;
        const lng1 = location1.longitude;
        const lat2 = location2.latitude;
        const lng2 = location2.longitude;

        // Using a simple distance formula here, you can use a more accurate method for production
        return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
      };

      const radius = 0.003; // Adjust this value based on your needs
      const clusters = createClusters(path, radius);
      setClusters(clusters);
    }
  }, [path]);

  useEffect(() => {
    if (truckMarkerRef.current && clusters.length > 0) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        truckMarkerRef.current.setPosition({
          lat: clusters[currentIndex][0].latitude,
          lng: clusters[currentIndex][0].longitude
        });
        currentIndex = (currentIndex + 1) % clusters.length;
      }, 1000); // Adjust the interval based on your needs

      return () => clearInterval(interval);
    }
  }, [clusters]);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="locations_container"
        center={userLocation ? userLocation : center}
        zoom={13}
      >
         {clusters.map((cluster, index) => (
          <Polyline
            key={`polyline-${index}`}
            path={cluster.map(location => ({ lat: location.latitude, lng: location.longitude }))}
            options={{
              strokeColor: "#5c0fa4",
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
        ))}

        {path.map((location, index) => (
          <Marker
            key={`marker-${index}`}
            position={{ lat: location.latitude, lng: location.longitude }}
            
          />
        ))}
{/* {clusters.map((cluster, index) => (
  <Marker
    key={`truck-${index}`}
    position={{ lat: cluster[0].latitude, lng: cluster[0].longitude }}
    
    ref={(ref) => (truckMarkerRef.current[index] = ref)}
  />
))} */}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;

