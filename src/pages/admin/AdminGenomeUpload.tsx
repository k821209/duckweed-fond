import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { LuDna, LuUpload, LuX, LuFileText, LuLoader, LuCheck } from 'react-icons/lu';
import { uploadGenomeBrowserFile } from '../../services/storageService';
import { getGenomes, upsertGenome, type GenomeConfig } from '../../services/genomeService';

export default function AdminGenomeUpload() {
  const [genomes, setGenomes] = useState<GenomeConfig[]>([]);
  const [selectedId, setSelectedId] = useState('__new__');
  const [form, setForm] = useState({
    speciesSlug: '',
    displayName: '',
    genus: 'Lemna',
    genomeSizeMb: 0,
    geneCount: '' as string,
    chromosomeCount: 0,
    description: '',
    reference: '',
    journal: '',
    ncbiAccession: '',
    ncbiUrl: '',
    doiUrl: '',
    defaultLocation: '',
  });
  const [fastaFile, setFastaFile] = useState<File | null>(null);
  const [gffFile, setGffFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    getGenomes().then(setGenomes).catch(console.error);
  }, []);

  const handleSelectExisting = (id: string) => {
    setSelectedId(id);
    if (id === '__new__') {
      setForm({ speciesSlug: '', displayName: '', genus: 'Lemna', genomeSizeMb: 0, geneCount: '', chromosomeCount: 0, description: '', reference: '', journal: '', ncbiAccession: '', ncbiUrl: '', doiUrl: '', defaultLocation: '' });
      return;
    }
    const g = genomes.find((x) => x.id === id);
    if (g) {
      setForm({
        speciesSlug: g.id,
        displayName: g.displayName,
        genus: g.genus,
        genomeSizeMb: g.genomeSizeMb,
        geneCount: g.geneCount?.toString() ?? '',
        chromosomeCount: g.chromosomeCount,
        description: g.description,
        reference: g.reference,
        journal: g.journal,
        ncbiAccession: g.ncbiAccession,
        ncbiUrl: g.ncbiUrl,
        doiUrl: g.doiUrl,
        defaultLocation: g.defaultLocation,
      });
    }
  };

  const speciesSlug = selectedId === '__new__' ? form.speciesSlug : selectedId;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!speciesSlug) {
      toast.error('Please enter a species slug.');
      return;
    }
    if (!form.displayName) {
      toast.error('Please enter a display name.');
      return;
    }
    if (!fastaFile && !gffFile) {
      toast.error('Please select at least one file.');
      return;
    }

    setUploading(true);
    setCompleted([]);

    try {
      if (fastaFile) {
        setCurrentFile(`Uploading FASTA: ${fastaFile.name}`);
        setPercent(0);
        await uploadGenomeBrowserFile(fastaFile, speciesSlug, (p) => setPercent(Math.round(p)));
        setCompleted((prev) => [...prev, `FASTA: ${fastaFile.name}`]);
      }

      if (gffFile) {
        setCurrentFile(`Uploading GFF3: ${gffFile.name}`);
        setPercent(0);
        await uploadGenomeBrowserFile(gffFile, speciesSlug, (p) => setPercent(Math.round(p)));
        setCompleted((prev) => [...prev, `GFF3: ${gffFile.name}`]);
      }

      // Upsert to Firestore genomes collection
      await upsertGenome(speciesSlug, {
        displayName: form.displayName,
        genus: form.genus,
        genomeSizeMb: Number(form.genomeSizeMb) || 0,
        geneCount: form.geneCount ? Number(form.geneCount) : null,
        chromosomeCount: Number(form.chromosomeCount) || 0,
        description: form.description,
        reference: form.reference,
        journal: form.journal,
        ncbiAccession: form.ncbiAccession,
        ncbiUrl: form.ncbiUrl,
        doiUrl: form.doiUrl,
        defaultLocation: form.defaultLocation,
        indexed: false,
      });

      setCurrentFile('');
      toast.success(
        'Upload complete! Cloud Function will automatically start indexing.',
        { duration: 6000 },
      );
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('An error occurred during upload.');
    } finally {
      setUploading(false);
      setCurrentFile('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <LuDna className="text-duckweed-600" />
        Genome Browser Data Upload
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Upload FASTA / GFF3 files. Cloud Function will automatically perform bgzip compression and faidx/tabix indexing.
      </p>

      {/* Existing genome selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Genome</h2>
        <select
          value={selectedId}
          onChange={(e) => handleSelectExisting(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500 mb-4"
        >
          <option value="__new__">+ Register New Genome</option>
          {genomes.map((g) => (
            <option key={g.id} value={g.id}>
              {g.displayName} ({g.id})
            </option>
          ))}
        </select>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species Slug</label>
            <input
              name="speciesSlug"
              value={speciesSlug}
              onChange={handleChange}
              disabled={selectedId !== '__new__'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genus</label>
            <select name="genus" value={form.genus} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500">
              {['Spirodela', 'Landoltia', 'Lemna', 'Wolffiella', 'Wolffia'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genome Size (Mb)</label>
            <input name="genomeSizeMb" type="number" value={form.genomeSizeMb} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chromosome Count</label>
            <input name="chromosomeCount" type="number" value={form.chromosomeCount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gene Count</label>
            <input name="geneCount" value={form.geneCount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Location</label>
            <input name="defaultLocation" value={form.defaultLocation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NCBI Accession</label>
            <input name="ncbiAccession" value={form.ncbiAccession} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500 resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <input name="reference" value={form.reference} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Journal</label>
            <input name="journal" value={form.journal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duckweed-500" />
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Upload path: <code className="bg-gray-100 px-1 rounded">genome-browser/{speciesSlug || '...'}/raw/</code>
        </p>
      </div>

      {/* File Upload */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* FASTA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Genome Sequence (FASTA)</h2>
          <p className="text-xs text-gray-500 mb-4">
            .fa or .fasta file. Automatically indexed with bgzip + samtools faidx.
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
            <p className="text-sm text-gray-600">Select FASTA file</p>
            <p className="text-xs text-gray-400 mt-1">.fa, .fasta, .fna</p>
          </div>
          {fastaFile && (
            <div className="mt-3 flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
              <span className="text-sm text-green-800 truncate">
                {fastaFile.name} ({(fastaFile.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <button type="button" onClick={() => setFastaFile(null)} className="text-gray-400 hover:text-red-500">
                <LuX />
              </button>
            </div>
          )}
        </div>

        {/* GFF3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Gene Annotation (GFF3)</h2>
          <p className="text-xs text-gray-500 mb-4">
            .gff3 or .gff file. Automatically sorted, compressed with bgzip, and indexed with tabix.
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
            <p className="text-sm text-gray-600">Select GFF3 file</p>
            <p className="text-xs text-gray-400 mt-1">.gff3, .gff</p>
          </div>
          {gffFile && (
            <div className="mt-3 flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
              <span className="text-sm text-green-800 truncate">
                {gffFile.name} ({(gffFile.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <button type="button" onClick={() => setGffFile(null)} className="text-gray-400 hover:text-red-500">
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
          <p className="text-sm font-medium text-green-800 mb-1">Upload complete:</p>
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
          {uploading ? 'Uploading...' : 'Upload & Start Indexing'}
        </button>
      </div>
    </div>
  );
}
