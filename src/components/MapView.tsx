import 'leaflet/dist/leaflet.css';
import './leafletSetup';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import type { Accession } from '../types/accession';

// highlighted marker icon (green)
const highlightedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  accessions: Accession[];
  highlightedId?: string | null;
  onMarkerClick?: (id: string) => void;
}

function FitBounds({ accessions }: { accessions: Accession[] }) {
  const map = useMap();
  const bounds = useMemo(() => {
    const pts = accessions
      .filter((a) => a.location)
      .map((a) => [a.location!.lat, a.location!.lng] as [number, number]);
    if (pts.length === 0) return null;
    return L.latLngBounds(pts);
  }, [accessions]);

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, bounds]);

  return null;
}

export default function MapView({ accessions, highlightedId, onMarkerClick }: Props) {
  const markers = accessions.filter((a) => a.location);

  return (
    <MapContainer
      center={[35.9, 127.8]}
      zoom={7}
      className="w-full h-full min-h-[300px] rounded-xl z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds accessions={markers} />
      {markers.map((acc) => (
        <Marker
          key={acc.id}
          position={[acc.location!.lat, acc.location!.lng]}
          icon={acc.id === highlightedId ? highlightedIcon : new L.Icon.Default()}
          eventHandlers={{
            click: () => onMarkerClick?.(acc.id),
          }}
        >
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
