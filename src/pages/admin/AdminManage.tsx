import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2, LuPlus, LuX, LuTriangleAlert, LuLoader, LuDna, LuSave } from 'react-icons/lu';
import { getAccessions, deleteAccession, updateAccession } from '../../services/accessionService';
import type { Accession } from '../../types/accession';
import toast from 'react-hot-toast';

const genusOptions = ['Spirodela', 'Landoltia', 'Lemna', 'Wolffiella', 'Wolffia'] as const;

export default function AdminManage() {
  const [accessions, setAccessions] = useState<Accession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Accession | null>(null);
  const [editTarget, setEditTarget] = useState<Accession | null>(null);
  const [editForm, setEditForm] = useState({
    name_kr: '',
    name_en: '',
    genus: '' as string,
    species: '',
    origin: '',
    description: '',
    lat: '',
    lng: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAccessions();
      setAccessions(data);
    } catch (err) {
      console.error(err);
      toast.error('데이터 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAccession(id);
      setAccessions((prev) => prev.filter((a) => a.id !== id));
      toast.success('삭제 완료');
    } catch (err) {
      console.error(err);
      toast.error('삭제 실패');
    }
    setDeleteTarget(null);
  };

  const openEdit = (acc: Accession) => {
    setEditTarget(acc);
    setEditForm({
      name_kr: acc.name_kr,
      name_en: acc.name_en,
      genus: acc.genus,
      species: acc.species,
      origin: acc.origin,
      description: acc.description,
      lat: acc.location?.lat?.toString() ?? '',
      lng: acc.location?.lng?.toString() ?? '',
      address: acc.location?.address ?? '',
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await updateAccession(editTarget.id, {
        name_kr: editForm.name_kr,
        name_en: editForm.name_en,
        genus: editForm.genus as Accession['genus'],
        species: editForm.species,
        origin: editForm.origin,
        description: editForm.description,
        location: editForm.lat && editForm.lng
          ? { lat: parseFloat(editForm.lat), lng: parseFloat(editForm.lng), address: editForm.address || undefined }
          : null,
      });
      toast.success('수정 완료');
      setEditTarget(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('수정 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">데이터 관리</h1>
          <p className="text-gray-500 text-sm mt-1">등록된 품종 정보를 관리합니다</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/genome-upload"
            className="flex items-center gap-2 border border-duckweed-600 text-duckweed-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-duckweed-50 transition-colors"
          >
            <LuDna />
            게놈 업로드
          </Link>
          <Link
            to="/admin/upload"
            className="flex items-center gap-2 bg-duckweed-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-duckweed-700 transition-colors"
          >
            <LuPlus />
            새로 등록
          </Link>
        </div>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <LuLoader className="animate-spin inline-block mr-2" />
                    불러오는 중...
                  </td>
                </tr>
              ) : accessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    등록된 품종이 없습니다.
                  </td>
                </tr>
              ) : (
                accessions.map((acc, i) => (
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
                          onClick={() => openEdit(acc)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditTarget(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <LuX className="text-lg" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">품종 수정</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">한글명</label>
                  <input
                    name="name_kr"
                    value={editForm.name_kr}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">영문명</label>
                  <input
                    name="name_en"
                    value={editForm.name_en}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">속명</label>
                  <select
                    name="genus"
                    value={editForm.genus}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  >
                    {genusOptions.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">종명</label>
                  <input
                    name="species"
                    value={editForm.species}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">수집지</label>
                <input
                  name="origin"
                  value={editForm.origin}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">위도</label>
                  <input
                    name="lat"
                    value={editForm.lat}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">경도</label>
                  <input
                    name="lng"
                    value={editForm.lng}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">주소</label>
                  <input
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">설명</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-duckweed-600 text-white rounded-lg text-sm font-medium hover:bg-duckweed-700 transition-colors disabled:opacity-50"
              >
                {saving ? <LuLoader className="animate-spin" /> : <LuSave />}
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

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
