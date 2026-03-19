import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { LuDna, LuUpload, LuX, LuFileText, LuLoader, LuCheck } from 'react-icons/lu';
import { uploadGenomeBrowserFile } from '../../services/storageService';
import { genomeBrowserConfigs } from '../../data/genomeBrowserConfigs';

export default function AdminGenomeUpload() {
  const [species, setSpecies] = useState(genomeBrowserConfigs[0].species);
  const [customSpecies, setCustomSpecies] = useState('');
  const [fastaFile, setFastaFile] = useState<File | null>(null);
  const [gffFile, setGffFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [completed, setCompleted] = useState<string[]>([]);

  const targetSpecies = species === '__custom__' ? customSpecies : species;

  const fastaDropzone = useDropzone({
    accept: { 'application/octet-stream': ['.fa', '.fasta', '.fna'] },
    multiple: false,
    onDrop: useCallback((accepted: File[]) => {
      if (accepted.length > 0) setFastaFile(accepted[0]);
    }, []),
  });

  const gffDropzone = useDropzone({
    accept: { 'application/octet-stream': ['.gff', '.gff3'] },
    multiple: false,
    onDrop: useCallback((accepted: File[]) => {
      if (accepted.length > 0) setGffFile(accepted[0]);
    }, []),
  });

  const handleUpload = async () => {
    if (!targetSpecies) {
      toast.error('종 식별자를 입력해주세요.');
      return;
    }
    if (!fastaFile && !gffFile) {
      toast.error('최소 하나의 파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setCompleted([]);

    try {
      if (fastaFile) {
        setCurrentFile(`FASTA 업로드 중: ${fastaFile.name}`);
        setPercent(0);
        await uploadGenomeBrowserFile(fastaFile, targetSpecies, (p) => setPercent(Math.round(p)));
        setCompleted((prev) => [...prev, `FASTA: ${fastaFile.name}`]);
      }

      if (gffFile) {
        setCurrentFile(`GFF3 업로드 중: ${gffFile.name}`);
        setPercent(0);
        await uploadGenomeBrowserFile(gffFile, targetSpecies, (p) => setPercent(Math.round(p)));
        setCompleted((prev) => [...prev, `GFF3: ${gffFile.name}`]);
      }

      setCurrentFile('');
      toast.success(
        '업로드 완료! Cloud Function이 자동으로 인덱싱을 시작합니다. 처리에 수 분이 걸릴 수 있습니다.',
        { duration: 6000 },
      );
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setCurrentFile('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <LuDna className="text-duckweed-600" />
        게놈 브라우저 데이터 업로드
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        FASTA / GFF3 파일을 업로드하면 Cloud Function이 자동으로 bgzip 압축, faidx/tabix 인덱싱을 수행합니다.
      </p>

      {/* Species Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">종 선택</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">종</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
            >
              {genomeBrowserConfigs.map((c) => (
                <option key={c.species} value={c.species}>
                  {c.displayName}
                </option>
              ))}
              <option value="__custom__">직접 입력...</option>
            </select>
          </div>
          {species === '__custom__' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종 식별자 (영문, 하이픈)
              </label>
              <input
                value={customSpecies}
                onChange={(e) => setCustomSpecies(e.target.value)}
                placeholder="예: lemna-gibba"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
              />
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          업로드 경로: <code className="bg-gray-100 px-1 rounded">genome-browser/{targetSpecies || '...'}/raw/</code>
        </p>
      </div>

      {/* File Upload */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* FASTA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">게놈 서열 (FASTA)</h2>
          <p className="text-xs text-gray-500 mb-4">
            .fa 또는 .fasta 파일. bgzip + samtools faidx로 자동 인덱싱됩니다.
          </p>
          <div
            {...fastaDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              fastaDropzone.isDragActive
                ? 'border-duckweed-400 bg-duckweed-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input {...fastaDropzone.getInputProps()} />
            <LuFileText className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">FASTA 파일 선택</p>
            <p className="text-xs text-gray-400 mt-1">.fa, .fasta, .fna</p>
          </div>
          {fastaFile && (
            <div className="mt-3 flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
              <span className="text-sm text-green-800 truncate">
                {fastaFile.name} ({(fastaFile.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <button
                type="button"
                onClick={() => setFastaFile(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <LuX />
              </button>
            </div>
          )}
        </div>

        {/* GFF3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">유전자 주석 (GFF3)</h2>
          <p className="text-xs text-gray-500 mb-4">
            .gff3 또는 .gff 파일. 정렬 + bgzip + tabix로 자동 인덱싱됩니다.
          </p>
          <div
            {...gffDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              gffDropzone.isDragActive
                ? 'border-duckweed-400 bg-duckweed-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input {...gffDropzone.getInputProps()} />
            <LuFileText className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">GFF3 파일 선택</p>
            <p className="text-xs text-gray-400 mt-1">.gff3, .gff</p>
          </div>
          {gffFile && (
            <div className="mt-3 flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
              <span className="text-sm text-green-800 truncate">
                {gffFile.name} ({(gffFile.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <button
                type="button"
                onClick={() => setGffFile(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <LuX />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Status */}
      {uploading && currentFile && (
        <div className="mb-4 bg-duckweed-50 border border-duckweed-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-duckweed-700 mb-2">
            <LuLoader className="animate-spin" />
            {currentFile}
          </div>
          <div className="w-full bg-duckweed-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-duckweed-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-duckweed-600 mt-1 text-right">{percent}%</p>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <p className="text-sm font-medium text-green-800 mb-1">업로드 완료:</p>
          {completed.map((c, i) => (
            <div key={i} className="flex items-center gap-1 text-sm text-green-700">
              <LuCheck className="text-green-600" />
              {c}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={uploading || (!fastaFile && !gffFile)}
          className="flex items-center gap-2 bg-duckweed-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-duckweed-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuUpload />
          {uploading ? '업로드 중...' : '업로드 및 인덱싱 시작'}
        </button>
      </div>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">처리 과정</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>파일이 <code className="bg-blue-100 px-1 rounded">genome-browser/{'{species}'}/raw/</code>에 업로드됩니다</li>
          <li>Cloud Function이 자동으로 트리거되어 인덱싱을 시작합니다</li>
          <li>FASTA → bgzip 압축 + samtools faidx (.fa.gz, .fai, .gzi)</li>
          <li>GFF3 → 정렬 + bgzip 압축 + tabix 인덱싱 (.gff3.gz, .tbi)</li>
          <li>처리된 파일이 <code className="bg-blue-100 px-1 rounded">genome-browser/{'{species}'}/</code>에 저장됩니다</li>
          <li>게놈 브라우저 페이지에서 자동으로 사용 가능합니다</li>
        </ol>
      </div>
    </div>
  );
}
