import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { LuUpload, LuX, LuFileText, LuImage, LuLoader } from 'react-icons/lu';
import { createAccession } from '../../services/accessionService';
import { uploadImage, uploadGenomicFile } from '../../services/storageService';
import type { GenomicFile } from '../../types/accession';
import 'leaflet/dist/leaflet.css';

// Leaflet marker icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const genusOptions = ['Spirodela', 'Landoltia', 'Lemna', 'Wolffiella', 'Wolffia'] as const;

function getFileType(fileName: string): GenomicFile['fileType'] {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (['fasta', 'fa', 'fna'].includes(ext)) return 'fasta';
  if (ext === 'vcf') return 'vcf';
  if (['gff', 'gff3'].includes(ext)) return 'gff';
  if (ext === 'bam') return 'bam';
  return 'other';
}

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AdminUpload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name_kr: '',
    name_en: '',
    genus: 'Lemna' as string,
    species: '',
    origin: '',
    lat: '',
    lng: '',
    address: '',
    description: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [genomicFiles, setGenomicFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
  };

  const imageDropzone = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    onDrop: useCallback((accepted: File[]) => setImages((prev) => [...prev, ...accepted]), []),
  });

  const genomicDropzone = useDropzone({
    accept: {
      'application/octet-stream': ['.fasta', '.fa', '.vcf', '.gff', '.gff3', '.bam'],
    },
    onDrop: useCallback((accepted: File[]) => setGenomicFiles((prev) => [...prev, ...accepted]), []),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name_kr) {
      toast.error('한글명을 입력해주세요.');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload image
      let imageUrl = '';
      if (images.length > 0) {
        setProgress('이미지 업로드 중...');
        imageUrl = await uploadImage(images[0]);
      }

      // 2. Upload genomic files
      const uploadedGenomicFiles: GenomicFile[] = [];
      for (let i = 0; i < genomicFiles.length; i++) {
        const file = genomicFiles[i];
        const fileType = getFileType(file.name);
        setProgress(`유전체 파일 업로드 중... (${i + 1}/${genomicFiles.length})`);
        const storageUrl = await uploadGenomicFile(file, fileType);
        uploadedGenomicFiles.push({
          fileName: file.name,
          storageUrl,
          fileType,
          fileSize: file.size,
          uploadedAt: new Date(),
        });
      }

      // 3. Create Firestore document
      setProgress('데이터 저장 중...');
      await createAccession({
        name_kr: form.name_kr,
        name_en: form.name_en,
        species: form.species || `${form.genus} sp.`,
        genus: form.genus as typeof genusOptions[number],
        origin: form.origin,
        location: form.lat && form.lng
          ? { lat: parseFloat(form.lat), lng: parseFloat(form.lng), address: form.address || undefined }
          : null,
        description: form.description,
        imageUrl,
        genomicFiles: uploadedGenomicFiles,
      });

      toast.success('품종이 성공적으로 등록되었습니다!');
      navigate('/admin/manage');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">데이터 업로드</h1>
      <p className="text-gray-500 text-sm mb-6">새로운 개구리밥 품종 정보를 등록합니다</p>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Metadata Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">품종 정보</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">한글명</label>
                  <input
                    name="name_kr"
                    value={form.name_kr}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">영문명</label>
                  <input
                    name="name_en"
                    value={form.name_en}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">속명(Genus)</label>
                  <select
                    name="genus"
                    value={form.genus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  >
                    {genusOptions.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종명(Species)</label>
                  <input
                    name="species"
                    value={form.species}
                    onChange={handleChange}
                    placeholder="예: Lemna minor"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">수집지</label>
                <input
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위도</label>
                  <input
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    placeholder="37.2636"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경도</label>
                  <input
                    name="lng"
                    value={form.lng}
                    onChange={handleChange}
                    placeholder="127.0286"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">수집 위치</h2>
            <p className="text-xs text-gray-500 mb-4">지도를 클릭하면 좌표가 자동 입력됩니다</p>
            <div className="h-80 lg:h-[400px] rounded-lg overflow-hidden border border-gray-200">
              <MapContainer center={[36.0, 127.5]} zoom={7} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {form.lat && form.lng && (
                  <Marker position={[parseFloat(form.lat), parseFloat(form.lng)]} />
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* File Upload Zones */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">품종 이미지</h2>
            <div
              {...imageDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                imageDropzone.isDragActive
                  ? 'border-duckweed-400 bg-duckweed-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input {...imageDropzone.getInputProps()} />
              <LuImage className="text-3xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">이미지 파일을 드래그하거나 클릭하여 선택</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (최대 5MB)</p>
            </div>
            {images.length > 0 && (
              <div className="mt-3 space-y-2">
                {images.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-700 truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <LuX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Genomic File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">유전체 파일</h2>
            <div
              {...genomicDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                genomicDropzone.isDragActive
                  ? 'border-duckweed-400 bg-duckweed-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input {...genomicDropzone.getInputProps()} />
              <LuFileText className="text-3xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">유전체 파일을 드래그하거나 클릭하여 선택</p>
              <p className="text-xs text-gray-400 mt-1">FASTA, VCF, GFF3, BAM</p>
            </div>
            {genomicFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {genomicFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-700 truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setGenomicFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <LuX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        {uploading && progress && (
          <div className="mb-4 flex items-center gap-2 text-sm text-duckweed-700 bg-duckweed-50 border border-duckweed-200 rounded-lg px-4 py-3">
            <LuLoader className="animate-spin" />
            {progress}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 bg-duckweed-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-duckweed-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuUpload />
            {uploading ? '업로드 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
