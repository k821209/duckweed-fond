import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { LuFilter, LuX, LuMapPin, LuLoader } from 'react-icons/lu';
import { getAccessions } from '../services/accessionService';
import type { Accession } from '../types/accession';
import 'leaflet/dist/leaflet.css';

// Leaflet marker icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const genusList = ['Spirodela', 'Landoltia', 'Lemna', 'Wolffiella', 'Wolffia'] as const;

function FitBounds({ accessions }: { accessions: Accession[] }) {
  const map = useMap();
  useEffect(() => {
    const pts = accessions
      .filter((a) => a.location)
      .map((a) => [a.location!.lat, a.location!.lng] as [number, number]);
    if (pts.length > 0) {
      map.fitBounds(pts, { padding: [40, 40] });
    }
  }, [accessions, map]);
  return null;
}

export default function MapPage() {
  const [accessions, setAccessions] = useState<Accession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenera, setSelectedGenera] = useState<Set<string>>(new Set(genusList));
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => {
    getAccessions()
      .then(setAccessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => accessions.filter((a) => selectedGenera.has(a.genus) && a.location),
    [selectedGenera, accessions],
  );

  const toggleGenus = (g: string) => {
    setSelectedGenera((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative">
      {/* Mobile toggle */}
      <button
        className="md:hidden absolute top-3 left-3 z-[1000] bg-white rounded-lg shadow-lg p-2"
        onClick={() => setSideOpen(!sideOpen)}
      >
        {sideOpen ? <LuX className="text-lg" /> : <LuFilter className="text-lg" />}
      </button>

      {/* Side panel */}
      <div
        className={`${
          sideOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform absolute md:relative z-[999] md:z-auto
        w-72 md:w-80 h-full bg-white border-r border-gray-200 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Filter</h2>
          <div className="space-y-2">
            {genusList.map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGenera.has(g)}
                  onChange={() => toggleGenus(g)}
                  className="rounded border-gray-300 text-duckweed-600 focus:ring-duckweed-500"
                />
                <span className="italic">{g}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">{filtered.length} results</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <LuLoader className="animate-spin inline-block mr-1" /> Loading...
            </div>
          ) : (
            <>
              {filtered.map((acc) => (
                <Link
                  key={acc.id}
                  to={`/accessions/${acc.id}`}
                  className="block p-4 border-b border-gray-100 hover:bg-duckweed-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{acc.name_en || acc.name_kr}</p>
                  <p className="text-xs text-gray-500 italic">{acc.species}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <LuMapPin className="text-xs" />
                    {acc.origin}
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <p className="p-4 text-sm text-gray-400 text-center">No accessions found.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[36.0, 127.5]}
          zoom={7}
          className="h-full w-full"
          style={{ zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds accessions={filtered} />
          {filtered.map((acc) =>
            acc.location ? (
              <Marker key={acc.id} position={[acc.location.lat, acc.location.lng]}>
                <Popup>
                  <div className="min-w-[160px]">
                    <p className="font-bold text-sm">{acc.name_en || acc.name_kr}</p>
                    <p className="text-xs italic text-gray-500">{acc.species}</p>
                    <p className="text-xs text-gray-400 mt-1">{acc.origin}</p>
                    <Link
                      to={`/accessions/${acc.id}`}
                      className="mt-2 inline-block text-xs text-duckweed-600 hover:underline font-medium"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ) : null,
          )}
        </MapContainer>
      </div>
    </div>
  );
}
