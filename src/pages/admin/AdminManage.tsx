import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2, LuPlus, LuX, LuTriangleAlert } from 'react-icons/lu';
import { dummyAccessions } from '../../data/dummyAccessions';
import type { Accession } from '../../types/accession';

export default function AdminManage() {
  const [accessions, setAccessions] = useState<Accession[]>(dummyAccessions);
  const [deleteTarget, setDeleteTarget] = useState<Accession | null>(null);

  const handleDelete = (id: string) => {
    setAccessions((prev) => prev.filter((a) => a.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">데이터 관리</h1>
          <p className="text-gray-500 text-sm mt-1">등록된 품종 정보를 관리합니다</p>
        </div>
        <Link
          to="/admin/upload"
          className="flex items-center gap-2 bg-duckweed-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-duckweed-700 transition-colors"
        >
          <LuPlus />
          새로 등록
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">한글명</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">종명</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">수집지</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">파일</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">등록일</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accessions.map((acc, i) => (
                <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{acc.name_kr}</td>
                  <td className="px-4 py-3 italic text-gray-600">{acc.species}</td>
                  <td className="px-4 py-3 text-gray-600">{acc.origin}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{acc.genomicFiles.length}개</td>
                  <td className="px-4 py-3 text-center text-gray-500 text-xs">
                    {acc.createdAt.toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-1.5 rounded-lg text-gray-400 hover:text-duckweed-600 hover:bg-duckweed-50 transition-colors"
                        title="수정"
                      >
                        <LuPencil className="text-base" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(acc)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="삭제"
                      >
                        <LuTrash2 className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    등록된 품종이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <LuX className="text-lg" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <LuTriangleAlert className="text-red-600 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">품종 삭제</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              <span className="font-medium text-gray-900">{deleteTarget.name_kr}</span>을(를) 정말 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
