import { Link } from 'react-router-dom';
import { LuDna, LuExternalLink } from 'react-icons/lu';
import { genomeBrowserConfigs, genusColors } from '../data/genomeBrowserConfigs';

export default function Genomics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LuDna className="text-duckweed-600" />
          게놈 브라우저
        </h1>
        <p className="mt-2 text-gray-600">
          서열 분석이 완료된 개구리밥 종의 유전체를 JBrowse 2로 탐색할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {genomeBrowserConfigs.map((config) => (
          <Link
            key={config.species}
            to={`/genomics/${config.species}`}
            className="group block bg-white rounded-lg border border-gray-200 hover:border-duckweed-400 hover:shadow-md transition-all p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: genusColors[config.genus] || '#6b7280' }}
              >
                {config.genus}
              </span>
              <LuExternalLink className="text-gray-400 group-hover:text-duckweed-600 transition-colors" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-duckweed-700 transition-colors">
              <em>{config.displayName}</em>
            </h3>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {config.description}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-semibold text-gray-900">
                  {config.genomeSizeMb} Mb
                </div>
                <div className="text-xs text-gray-500">게놈 크기</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-semibold text-gray-900">
                  {config.geneCount ? config.geneCount.toLocaleString() : '-'}
                </div>
                <div className="text-xs text-gray-500">유전자</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-semibold text-gray-900">
                  {config.chromosomeCount}
                </div>
                <div className="text-xs text-gray-500">염색체</div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              {config.reference} · {config.journal}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
