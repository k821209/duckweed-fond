import { useState, useMemo } from 'react';
import { LuDownload, LuSearch, LuFileText } from 'react-icons/lu';
import { dummyAccessions } from '../data/dummyAccessions';
import type { GenomicFile } from '../types/accession';

interface FileRow {
  accessionId: string;
  accessionName: string;
  file: GenomicFile;
}

const fileTypeTabs = ['전체', 'FASTA', 'VCF', 'GFF', 'BAM'] as const;

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function Download() {
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allFiles: FileRow[] = useMemo(
    () =>
      dummyAccessions.flatMap((acc) =>
        acc.genomicFiles.map((f) => ({
          accessionId: acc.id,
          accessionName: acc.name_kr,
          file: f,
        })),
      ),
    [],
  );

  const filtered = useMemo(() => {
    let list = allFiles;
    if (activeTab !== '전체') {
      const ft = activeTab.toLowerCase();
      list = list.filter((r) => r.file.fileType === ft);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.file.fileName.toLowerCase().includes(q) || r.accessionName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allFiles, activeTab, search]);

  const toggleSelect = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => `${r.accessionId}-${r.file.fileName}`)));
    }
  };

  const selectedSize = useMemo(() => {
    return filtered
      .filter((r) => selected.has(`${r.accessionId}-${r.file.fileName}`))
      .reduce((sum, r) => sum + r.file.fileSize, 0);
  }, [filtered, selected]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">데이터 다운로드</h1>
      <p className="text-gray-500 text-sm mb-6">유전체 데이터 파일을 검색하고 다운로드하세요</p>

      {/* Search */}
      <div className="relative mb-4">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="파일명 또는 품종명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {fileTypeTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-duckweed-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-duckweed-600 focus:ring-duckweed-500"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">파일명</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">품종</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">형식</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">크기</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">날짜</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => {
                const key = `${row.accessionId}-${row.file.fileName}`;
                return (
                  <tr key={key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => toggleSelect(key)}
                        className="rounded border-gray-300 text-duckweed-600 focus:ring-duckweed-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <LuFileText className="text-gray-400 shrink-0" />
                        <span className="text-gray-700 font-mono text-xs">{row.file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.accessionName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium uppercase">
                        {row.file.fileType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {formatSize(row.file.fileSize)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">
                      {row.file.uploadedAt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-duckweed-600 hover:text-duckweed-700 transition-colors">
                        <LuDownload className="text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk download bar */}
      {selected.size > 0 && (
        <div className="mt-4 flex items-center justify-between bg-duckweed-50 border border-duckweed-200 rounded-xl px-6 py-4">
          <p className="text-sm text-duckweed-800">
            <span className="font-semibold">{selected.size}건</span> 선택됨 (총 {formatSize(selectedSize)})
          </p>
          <button className="flex items-center gap-2 bg-duckweed-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-duckweed-700 transition-colors">
            <LuDownload />
            선택 다운로드
          </button>
        </div>
      )}
    </div>
  );
}
