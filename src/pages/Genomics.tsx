import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuDna, LuExternalLink, LuLoader } from 'react-icons/lu';
import { getGenomes, genusColors, type GenomeConfig } from '../services/genomeService';

export default function Genomics() {
  const [genomes, setGenomes] = useState<GenomeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenomes()
      .then(setGenomes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LuLoader className="animate-spin text-2xl text-duckweed-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LuDna className="text-duckweed-600" />
          Genome Browser
        </h1>
        <p className="mt-2 text-gray-600">
          Explore sequenced duckweed genomes using JBrowse 2.
        </p>
      </div>

      {genomes.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No genomes available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genomes.map((config) => (
            <Link
              key={config.id}
              to={`/genomics/${config.id}`}
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
                  <div className="text-xs text-gray-500">Genome Size</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {config.geneCount ? config.geneCount.toLocaleString() : '-'}
                  </div>
                  <div className="text-xs text-gray-500">Genes</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {config.chromosomeCount}
                  </div>
                  <div className="text-xs text-gray-500">Chromosomes</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                {config.reference} · {config.journal}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
