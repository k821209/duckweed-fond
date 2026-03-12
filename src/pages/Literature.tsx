import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { LuFileText, LuExternalLink, LuDatabase } from 'react-icons/lu';
import { speciesData, genusColors } from '../data/speciesData';
import { publications, externalDatabases } from '../data/publications';

type TabId = 'species' | 'papers' | 'databases';

const tabs: { id: TabId; label: string }[] = [
  { id: 'species', label: '종별 유전체 정보' },
  { id: 'papers', label: '주요 논문' },
  { id: 'databases', label: '외부 DB' },
];

export default function Literature() {
  const [activeTab, setActiveTab] = useState<TabId>('species');

  const chartData = useMemo(() => {
    const grouped: Record<string, { genus: string; avg: number; min: number; max: number; count: number }> = {};
    speciesData.forEach((s) => {
      if (!grouped[s.genus]) grouped[s.genus] = { genus: s.genus, avg: 0, min: Infinity, max: 0, count: 0 };
      const g = grouped[s.genus];
      g.min = Math.min(g.min, s.genomeSizeMb);
      g.max = Math.max(g.max, s.genomeSizeMb);
      g.avg += s.genomeSizeMb;
      g.count++;
    });
    return Object.values(grouped).map((g) => ({ ...g, avg: Math.round(g.avg / g.count) }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">개구리밥 유전체 연구 현황</h1>
      <p className="text-gray-500 text-sm mb-6">5속 36종의 유전체 정보, 주요 논문, 외부 데이터베이스</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-duckweed-600 text-duckweed-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Species Table + Chart */}
      {activeTab === 'species' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">속(Genus)</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">종(Species)</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">2n</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">게놈 크기 (Mb)</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">서열화</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {speciesData.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 italic font-medium" style={{ color: genusColors[s.genus] }}>
                        {s.genus}
                      </td>
                      <td className="px-4 py-2.5 italic text-gray-700">{s.species}</td>
                      <td className="px-4 py-2.5 text-center text-gray-600">{s.chromosome2n ?? '-'}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{s.genomeSizeMb.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            s.sequenced === 'O'
                              ? 'bg-green-100 text-green-700'
                              : s.sequenced === 'Draft'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {s.sequenced === 'O' ? 'Complete' : s.sequenced === 'Draft' ? 'Draft' : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">속별 평균 게놈 크기 비교</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: 'Mb', position: 'insideBottomRight', offset: -5 }} />
                <YAxis type="category" dataKey="genus" width={90} tick={{ fontStyle: 'italic', fontSize: 13 }} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} Mb`, '평균 게놈 크기']}
                  contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
                />
                <Bar dataKey="avg" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.genus} fill={genusColors[entry.genus] || '#9ca3af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 2: Papers */}
      {activeTab === 'papers' && (
        <div className="space-y-4">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-duckweed-500">
                  <LuFileText className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {pub.authors} ({pub.year})
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        pub.category === 'genome'
                          ? 'bg-green-100 text-green-700'
                          : pub.category === 'review'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {pub.category === 'genome' ? 'Genome' : pub.category === 'review' ? 'Review' : 'Chloroplast'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{pub.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{pub.journal}</p>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-duckweed-600 hover:underline"
                    >
                      <LuExternalLink className="text-xs" />
                      DOI: {pub.doi}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: External Databases */}
      {activeTab === 'databases' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {externalDatabases.map((db) => (
            <a
              key={db.name}
              href={db.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-duckweed-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-duckweed-50 flex items-center justify-center text-duckweed-600 group-hover:bg-duckweed-100 transition-colors">
                  <LuDatabase className="text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900">{db.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{db.description}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-duckweed-600 font-medium">
                <LuExternalLink className="text-xs" />
                방문하기
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
