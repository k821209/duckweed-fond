import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuLeaf, LuSearch, LuMapPin, LuFileText, LuFlaskConical } from 'react-icons/lu';
import StatCard from '../components/StatCard';
import MapPreview from '../components/MapPreview';
import { dummyAccessions } from '../data/dummyAccessions';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const accessions = dummyAccessions;
  const speciesSet = new Set(accessions.map((a) => a.species));
  const fileCount = accessions.reduce((sum, a) => sum + a.genomicFiles.length, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/accessions?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-duckweed-800 to-duckweed-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <LuLeaf className="text-5xl text-duckweed-200" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Duckweed Genomics Database
          </h1>
          <p className="text-lg sm:text-xl text-duckweed-100 mb-8 max-w-2xl mx-auto">
            Duckweed genomic information sharing platform
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by accession, species, or origin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-duckweed-300"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-duckweed-500 hover:bg-duckweed-400 text-white font-medium rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<LuLeaf />} value={accessions.length} label="Accessions" />
          <StatCard icon={<LuFlaskConical />} value={speciesSet.size} label="Species" />
          <StatCard icon={<LuMapPin />} value={accessions.filter((a) => a.location).length} label="Collection Sites" />
          <StatCard icon={<LuFileText />} value={fileCount} label="Genomic Files" />
        </section>

        {/* Recent Accessions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recently Added Accessions</h2>
            <Link to="/accessions" className="text-sm text-duckweed-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Species</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Origin</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Files</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accessions.slice(0, 5).map((acc) => (
                    <tr
                      key={acc.id}
                      className="hover:bg-duckweed-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/accessions/${acc.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{acc.name_kr}</p>
                          <p className="text-xs text-gray-400">{acc.name_en}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 italic">{acc.species}</td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{acc.origin}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {acc.genomicFiles.length}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {acc.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Map Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Collection Sites Preview</h2>
            <Link to="/map" className="text-sm text-duckweed-600 hover:underline">
              Full map →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-2">
            <MapPreview accessions={accessions} />
          </div>
        </section>
      </div>
    </div>
  );
}
