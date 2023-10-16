import LocationMarker from "./LocationMarker";
import "./map.css";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

const Map = () => {
  const position = [51.505, -0.09];

  return (
    <>
      <MapContainer
        className="map"
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <LocationMarker />
      </MapContainer>
    </>
  );
};

export default Map;
