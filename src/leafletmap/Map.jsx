import React from "react";
import LocationMarker from "./LocationMarker";
import "./map.css";
import { MapContainer, TileLayer } from "react-leaflet";

const Map = () => {
  const kutusCoordinates = [-0.679887, 37.171047]; // Latitude and Longitude for Kutus, Kenya

  return (
    <MapContainer
      className="map"
      center={kutusCoordinates}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
