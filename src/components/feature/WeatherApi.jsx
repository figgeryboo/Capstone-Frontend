import { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const WeatherApi = () => {
  const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("New York City");
  const [isWeatherVisible, setIsWeatherVisible] = useState(false);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json`,
        {
          params: {
            key: apiKey,
            q: location,
          },
        }
      );

      setWeather(response.data.current);
      setError("");
      setIsWeatherVisible(true)
    } catch (err) {
      setError("Could not fetch weather data. Please try again.");
      console.error("Error fetching weather data:", err);
    }
  };

const handleWeatherToggle = () => {
    if (!isWeatherVisible) {
      fetchWeather();
    } else {
      setIsWeatherVisible(false);
    }
  };

  const handleMoreInfoClick = () => {
    const locationQuery = encodeURIComponent(location); // Encode the location for the URL

    // Determine user mobile device (Android, iPhone, or iPad)
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile) {
      // open weather app if mobile device
      window.open(`weather://?q=${locationQuery}`, "_blank");
    } else {
        // desktop opens link
      window.open(
        `https://www.accuweather.com/en/search-locations?query=${locationQuery}`,
        "_blank"
      );
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "rgba(234, 49, 135, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        position: "absolute",
        top: "75px",
        left: "9px",
        zIndex: 1,
        width: "220px",
      }}
    >
      <input
        type="text"
        value={location}
        onChange={handleLocationChange}
        placeholder="Enter location"
        style={{
          width: "100%",
          padding: "7px",
          borderRadius: "5px",
          backgroundColor: '#bcf5ef',
          border: "1px solid rgb(234, 49, 135)",
          marginBottom: "7px",
        }}
      />
      <Button
        className="btn btn-md"
        style={{
          backgroundColor: "rgb(234, 49, 135)",
          borderColor: "rgb(234, 49, 135)",
          width: "100%",
        }}
        onClick={handleWeatherToggle}
      >
       {isWeatherVisible ? "Close Weather Info" : "Check Weather"}
       </Button>
      {isWeatherVisible && weather && (
        <div
          style={{
            background: "#bcf5ef",
            padding: "7px",
            borderRadius: "5px",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <section style={{ margin: "2px" }}>
            <h3>Current Weather in {location}</h3>
            <p>Temperature: {weather.temp_c}°C</p>
            <p>Condition: {weather.condition.text}</p>
          </section>
          <Button
            className="btn btn-md"
            style={{
              backgroundColor: "rgb(234, 49, 135)",
              borderColor: "rgb(103, 7, 52)",
              width: "100%",
            }}
            onClick={handleMoreInfoClick}
          >
            More Info
          </Button>
        </div>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default WeatherApi;
