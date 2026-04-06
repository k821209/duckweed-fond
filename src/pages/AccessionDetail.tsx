import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronRight, LuDownload, LuFileText, LuMapPin, LuFlaskConical, LuCalendar } from 'react-icons/lu';
import MiniMap from '../components/MiniMap';
import { dummyAccessions } from '../data/dummyAccessions';

type TabKey = 'info' | 'genomic' | 'files';

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

function fileTypeColor(type: string): string {
  switch (type) {
    case 'fasta':
      return 'bg-blue-100 text-blue-700';
    case 'vcf':
      return 'bg-purple-100 text-purple-700';
    case 'gff':
      return 'bg-amber-100 text-amber-700';
    case 'bam':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function AccessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  const accession = dummyAccessions.find((a) => a.id === id);

  if (!accession) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accession not found</h1>
        <p className="text-gray-500 mb-4">The requested accession does not exist.</p>
        <Link to="/accessions" className="text-duckweed-600 hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: 'Basic Info' },
    { key: 'genomic', label: 'Genomic Data' },
    { key: 'files', label: 'Files' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-duckweed-600">
          Home
        </Link>
        <LuChevronRight className="text-xs" />
        <Link to="/accessions" className="hover:text-duckweed-600">
          Accessions
        </Link>
        <LuChevronRight className="text-xs" />
        <span className="text-gray-900 font-medium">{accession.name_kr}</span>
      </nav>

      {/* Header section: Info + MiniMap */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Left: Image + Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image placeholder */}
            <div className="w-full sm:w-48 h-48 bg-duckweed-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-duckweed-100">
              {accession.imageUrl ? (
                <img
                  src={accession.imageUrl}
                  alt={accession.name_kr}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <LuFlaskConical className="text-4xl text-duckweed-300" />
              )}
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{accession.name_kr}</h1>
                <p className="text-gray-500">{accession.name_en}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <LuFlaskConical className="text-duckweed-500 flex-shrink-0" />
                  <span>
                    Species: <span className="italic">{accession.species}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <LuMapPin className="text-duckweed-500 flex-shrink-0" />
                  <span>Origin: {accession.origin}</span>
                </div>
                {accession.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <LuMapPin className="text-water-500 flex-shrink-0" />
                    <span>
                      GPS: {accession.location.lat.toFixed(4)}°N, {accession.location.lng.toFixed(4)}°E
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <LuCalendar className="text-duckweed-500 flex-shrink-0" />
                  <span>
                    Date:{' '}
                    {accession.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <span className="inline-block px-2.5 py-1 text-xs font-medium bg-duckweed-100 text-duckweed-700 rounded-full">
                {accession.genus}
              </span>
            </div>
          </div>
        </div>

        {/* Right: MiniMap */}
        {accession.location && (
          <div className="w-full md:w-80 flex-shrink-0">
            <MiniMap lat={accession.location.lat} lng={accession.location.lng} label={accession.name_kr} />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-duckweed-600 text-duckweed-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{accession.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Genus</p>
                <p className="font-medium text-gray-900">{accession.genus}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Species</p>
                <p className="font-medium text-gray-900 italic">{accession.species}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Collection Site</p>
                <p className="font-medium text-gray-900">{accession.origin}</p>
                {accession.location?.address && (
                  <p className="text-xs text-gray-400 mt-0.5">{accession.location.address}</p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Genomic Files</p>
                <p className="font-medium text-gray-900">{accession.genomicFiles.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'genomic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Genomic Data Files</h3>
            {accession.genomicFiles.length === 0 ? (
              <p className="text-gray-400 text-sm">No genomic data available.</p>
            ) : (
              <div className="space-y-3">
                {accession.genomicFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <LuFileText className="text-lg text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{file.fileName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${fileTypeColor(file.fileType)}`}
                          >
                            {file.fileType.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatFileSize(file.fileSize)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {file.uploadedAt.toLocaleDateString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-duckweed-600 border border-duckweed-200 rounded-lg hover:bg-duckweed-50 transition-colors">
                      <LuDownload className="text-sm" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">All Files</h3>
            {accession.genomicFiles.length === 0 ? (
              <p className="text-gray-400 text-sm">No files available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">File Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Format</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Size</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Upload Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accession.genomicFiles.map((file, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <LuFileText className="text-gray-400 flex-shrink-0" />
                            {file.fileName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${fileTypeColor(file.fileType)}`}
                          >
                            {file.fileType.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatFileSize(file.fileSize)}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {file.uploadedAt.toLocaleDateString('en-US')}
                        </td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-duckweed-600 border border-duckweed-200 rounded-lg hover:bg-duckweed-50 transition-colors">
                            <LuDownload className="text-sm" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
