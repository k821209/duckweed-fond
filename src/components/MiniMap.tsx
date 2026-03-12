import 'leaflet/dist/leaflet.css';
import './leafletSetup';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  label?: string;
}

export default function MiniMap({ lat, lng, zoom = 11 }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      className="w-full h-[250px] rounded-xl z-0"
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
