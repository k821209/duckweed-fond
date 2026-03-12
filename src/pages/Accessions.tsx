import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { LuSearch, LuChevronUp, LuChevronDown, LuFilter, LuX } from 'react-icons/lu';
import MapView from '../components/MapView';
import { dummyAccessions } from '../data/dummyAccessions';
import type { Accession } from '../types/accession';

const columnHelper = createColumnHelper<Accession>();

const columns = [
  columnHelper.accessor('name_kr', {
    header: '이름',
    cell: (info) => (
      <div>
        <p className="font-medium text-gray-900">{info.getValue()}</p>
        <p className="text-xs text-gray-400">{info.row.original.name_en}</p>
      </div>
    ),
  }),
  columnHelper.accessor('species', {
    header: '종명',
    cell: (info) => <span className="italic text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('origin', {
    header: '수집지',
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('genomicFiles', {
    header: '파일',
    cell: (info) => <span className="text-gray-600">{info.getValue().length}개</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: '등록일',
    cell: (info) =>
      info.getValue().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  }),
];

export default function Accessions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(initialQuery);
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allAccessions = dummyAccessions;
  const speciesList = useMemo(
    () => [...new Set(allAccessions.map((a) => a.species))].sort(),
    [allAccessions],
  );
  const originList = useMemo(
    () => [...new Set(allAccessions.map((a) => a.origin))].sort(),
    [allAccessions],
  );

  const filteredData = useMemo(() => {
    let data = allAccessions;
    if (speciesFilter) data = data.filter((a) => a.species === speciesFilter);
    if (originFilter) data = data.filter((a) => a.origin === originFilter);
    return data;
  }, [allAccessions, speciesFilter, originFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const resetFilters = () => {
    setSpeciesFilter('');
    setOriginFilter('');
    setGlobalFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">품종/계통 목록</h1>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 종명, 수집지 검색..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-duckweed-300 text-sm"
            />
          </div>

          {/* Desktop filters */}
          <div className="hidden sm:flex gap-3">
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-300"
            >
              <option value="">종 전체</option>
              {speciesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-300"
            >
              <option value="">수집지 전체</option>
              {originList.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {(speciesFilter || originFilter || globalFilter) && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-white flex items-center gap-1"
              >
                <LuX className="text-xs" /> 초기화
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            className="sm:hidden px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <LuFilter /> 필터
          </button>
        </div>

        {/* Mobile filters expanded */}
        {showFilters && (
          <div className="sm:hidden flex flex-col gap-2">
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">종 전체</option>
              {speciesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">수집지 전체</option>
              {originList.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {(speciesFilter || originFilter || globalFilter) && (
              <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-700">
                초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* Layout: Table + Map */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile: Map on top */}
        <div className="lg:hidden h-[250px] bg-white rounded-xl border border-gray-200 overflow-hidden">
          <MapView
            accessions={filteredData}
            highlightedId={highlightedId}
            onMarkerClick={(id) => {
              setHighlightedId(id);
              navigate(`/accessions/${id}`);
            }}
          />
        </div>

        {/* Mobile: Card list */}
        <div className="lg:hidden space-y-3">
          {table.getRowModel().rows.map((row) => {
            const acc = row.original;
            return (
              <div
                key={acc.id}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-colors ${
                  highlightedId === acc.id ? 'border-duckweed-400 bg-duckweed-50' : 'border-gray-200'
                }`}
                onClick={() => navigate(`/accessions/${acc.id}`)}
                onMouseEnter={() => setHighlightedId(acc.id)}
                onMouseLeave={() => setHighlightedId(null)}
              >
                <p className="font-medium text-gray-900">{acc.name_kr}</p>
                <p className="text-sm text-gray-500 italic">{acc.species}</p>
                <p className="text-sm text-gray-400">{acc.origin}</p>
              </div>
            );
          })}
        </div>

        {/* Desktop: Table */}
        <div className="hidden lg:block flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left px-4 py-3 font-medium text-gray-600 select-none"
                          onClick={header.column.getToggleSortingHandler()}
                          style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' && <LuChevronUp className="text-xs" />}
                            {header.column.getIsSorted() === 'desc' && <LuChevronDown className="text-xs" />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`cursor-pointer transition-colors ${
                        highlightedId === row.original.id
                          ? 'bg-duckweed-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => navigate(`/accessions/${row.original.id}`)}
                      onMouseEnter={() => setHighlightedId(row.original.id)}
                      onMouseLeave={() => setHighlightedId(null)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
              <span>
                {table.getFilteredRowModel().rows.length}건 중{' '}
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Side Map */}
        <div className="hidden lg:block w-[400px] flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-200 overflow-hidden">
            <MapView
              accessions={filteredData}
              highlightedId={highlightedId}
              onMarkerClick={(id) => {
                setHighlightedId(id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
