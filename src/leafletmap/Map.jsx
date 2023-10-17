import React, { useState, useEffect } from "react";
import LocationMarker from "./LocationMarker";
import "./map.css";
import { MapContainer, TileLayer, Popup, Marker, Polyline, useMapEvents } from "react-leaflet";
import axios from "axios";

const Map = () => {
  const kutusCoordinates = [-0.679887, 37.171047]; // Coordinates for Kutus, Kenya
  const [userLocation, setUserLocation] = useState(null);
  const [desiredLocation, setDesiredLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [directions, setDirections] = useState(null);

  // Function to get the user's current location
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []); // Get user's location when the component mounts

  const handleMapClick = (e) => {
    const newDesiredLocation = [e.latlng.lat, e.latlng.lng];
    setDesiredLocation(newDesiredLocation);
    setPathCoordinates([userLocation, newDesiredLocation]);

    // Call the function to get directions
    getDirections(userLocation, newDesiredLocation);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const desiredLocationName = e.target.locationName.value;

    if (desiredLocationName) {
      try {
        const apiKey = "ccf28dc93d7c4692b54a12d2cdbe6ab2"; // Replace with your OpenCage Geocoding API key
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${desiredLocationName}&key=${apiKey}`);
        const result = response.data.results[0];

        if (result) {
          const desiredLocationCoordinates = [result.geometry.lat, result.geometry.lng];
          setDesiredLocation(desiredLocationCoordinates);
          setPathCoordinates([userLocation, desiredLocationCoordinates]);

          // Call the function to get directions
          getDirections(userLocation, desiredLocationCoordinates);
        } else {
          alert("Location not found. Please try a different location name.");
        }
      } catch (error) {
        console.error("Error while geocoding:", error);
        alert("An error occurred. Please try again later.");
      }
    } else {
      alert("Please enter a location name.");
    }
  };

  const getDirections = async (origin, destination) => {
    // Replace "YOUR_MAPBOX_API_KEY" with your actual Mapbox API key
    const mapboxApiKey = "YOUR_MAPBOX_API_KEY";

    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?steps=true&geometries=geojson&access_token=${mapboxApiKey}`
      );

      setDirections(response.data);
    } catch (error) {
      console.error("Error while getting directions:", error);
      alert("An error occurred while getting directions.");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const userEmail = e.target.email.value;

    if (userEmail) {
      try {
        const response = await axios.post("http://localhost:3001/send-location", {
          email: userEmail,
          location: userLocation, // Include the user's location
        });

        if (response.status === 200) {
          alert("Location sent to your email.");
        } else {
          alert("Email sending failed. Please try again.");
        }
      } catch (error) {
        console.error("Error while sending email:", error);
        alert("An error occurred. Please try again later.");
      }
    } else {
      alert("Please enter your email address.");
    }
  };

  return (
    <>
      <MapContainer
        className="map"
        center={userLocation || kutusCoordinates}
        zoom={13}
        scrollWheelZoom={false}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        {desiredLocation && (
          <Marker position={desiredLocation}>
            <Popup>Your desired location</Popup>
          </Marker>
        )}
        {pathCoordinates.length === 2 && (
          <Polyline positions={pathCoordinates} color="blue" />
        )}
        {directions && (
          <Popup>
            <h2>Directions</h2>
            <p>Distance: {directions.routes[0].distance} meters</p>
            <p>Estimated Time: {directions.routes[0].duration} seconds</p>
          </Popup>
        )}
        <LocationMarker />
      </MapContainer>
      <div>
        <h2>Desired Location</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Enter the name of the desired location:
            <input type="text" name="locationName" placeholder="e.g., Nairobi" />
          </label>
          <button type="submit">Set Desired Location</button>
        </form>
      </div>
      <div>
        <h2>Send Location to Email</h2>
        <form onSubmit={handleEmailSubmit}>
          <label>
            Enter your email address:
            <input type="email" name="email" placeholder="youremail@example.com" />
          </label>
          <button type="submit">Send Location</button>
        </form>
      </div>
    </>
  );
};

export default Map;
