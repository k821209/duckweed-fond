import { Suspense, lazy } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { LuChevronRight, LuDna, LuExternalLink } from 'react-icons/lu';
import { genomeBrowserConfigs, genusColors } from '../data/genomeBrowserConfigs';

const GenomeBrowser = lazy(() => import('../components/GenomeBrowser'));

export default function GenomicsDetail() {
  const { species } = useParams<{ species: string }>();
  const config = genomeBrowserConfigs.find((c) => c.species === species);

  if (!config) {
    return <Navigate to="/genomics" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-duckweed-600">홈</Link>
        <LuChevronRight className="text-xs" />
        <Link to="/genomics" className="hover:text-duckweed-600">게놈 브라우저</Link>
        <LuChevronRight className="text-xs" />
        <span className="text-gray-900 font-medium">{config.displayName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: genusColors[config.genus] || '#6b7280' }}
            >
              {config.genus}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LuDna className="text-duckweed-600" />
            <em>{config.displayName}</em>
          </h1>
          <p className="mt-1 text-gray-600">{config.description}</p>
        </div>

        {/* Species selector */}
        <div className="flex-shrink-0">
          <label className="block text-xs text-gray-500 mb-1">종 변경</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            value={config.species}
            onChange={(e) => {
              window.location.href = `/genomics/${e.target.value}`;
            }}
          >
            {genomeBrowserConfigs.map((c) => (
              <option key={c.species} value={c.species}>
                {c.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* JBrowse viewer */}
      <Suspense
        fallback={
          <div className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-duckweed-600 mx-auto mb-3" />
              <p className="text-gray-600">게놈 브라우저 로딩 중...</p>
              <p className="text-sm text-gray-400 mt-1">JBrowse 2 초기화 중입니다</p>
            </div>
          </div>
        }
      >
        <GenomeBrowser
          assemblyName={config.displayName}
          fastaUrl={config.fastaUrl}
          faiUrl={config.faiUrl}
          gziUrl={config.gziUrl}
          gffUrl={config.gffUrl}
          gffIndexUrl={config.gffIndexUrl}
          initialLocation={config.defaultLocation}
        />
      </Suspense>

      {/* Genome stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{config.genomeSizeMb} Mb</div>
          <div className="text-sm text-gray-500">게놈 크기</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {config.geneCount ? config.geneCount.toLocaleString() : '-'}
          </div>
          <div className="text-sm text-gray-500">유전자 수</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{config.chromosomeCount}</div>
          <div className="text-sm text-gray-500">염색체 수</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{config.ncbiAccession}</div>
          <div className="text-sm text-gray-500">NCBI Accession</div>
        </div>
      </div>

      {/* Reference & links */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">데이터 출처</h3>
        <p className="text-gray-700 mb-4">
          {config.reference} · <em>{config.journal}</em>
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={config.ncbiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            NCBI <LuExternalLink className="text-xs" />
          </a>
          <a
            href={config.doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
          >
            논문 DOI <LuExternalLink className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
}
