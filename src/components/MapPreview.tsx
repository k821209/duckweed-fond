import 'leaflet/dist/leaflet.css';
import './leafletSetup';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { Accession } from '../types/accession';

interface Props {
  accessions: Accession[];
}

export default function MapPreview({ accessions }: Props) {
  const markers = accessions.filter((a) => a.location);

  return (
    <MapContainer
      center={[35.9, 127.8]}
      zoom={7}
      className="w-full h-[350px] rounded-xl z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((acc) => (
        <Marker key={acc.id} position={[acc.location!.lat, acc.location!.lng]}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{acc.name_kr}</p>
              <p className="text-gray-500 italic">{acc.species}</p>
              <p className="text-gray-500">{acc.origin}</p>
              <Link
                to={`/accessions/${acc.id}`}
                className="text-duckweed-600 hover:underline text-xs mt-1 inline-block"
              >
                상세보기 →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
