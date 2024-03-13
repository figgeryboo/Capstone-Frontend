import  { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

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

function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [path, setPath] = useState({});
  const [showRoute, setShowRoute] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPath(truckCos)
    }, 1000); 
    return () => clearInterval(interval);
  }, []);


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
    },
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="map"
        center={userLocation ? userLocation : center}
        zoom={userLocation ? 15 : 10}
      >
        {/* {userLocation && (
          <Marker position={{ lat: userLocation.lat, lng: userLocation.lng }} />
        )} */}
        {Object.keys(path).map((vendorKey) => (
        <Polyline
          key={vendorKey}
          path={path[vendorKey].coordinates}
          options={{
            strokeColor: "#5c0fa4",
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
       ))} 
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;


