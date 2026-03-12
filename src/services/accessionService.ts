import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  type Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Accession, GenomicFile } from '../types/accession';

const COLLECTION = 'accessions';

// ---------- helpers ----------

function toDate(ts: Timestamp | Date | undefined): Date {
  if (!ts) return new Date();
  if (ts instanceof Date) return ts;
  return (ts as Timestamp).toDate();
}

interface FirestoreGenomicFile {
  fileName: string;
  storageUrl: string;
  fileType: 'fasta' | 'vcf' | 'gff' | 'bam' | 'other';
  fileSize: number;
  uploadedAt: Timestamp | Date;
}

interface FirestoreAccession {
  name_kr: string;
  name_en: string;
  species: string;
  genus: 'Spirodela' | 'Landoltia' | 'Lemna' | 'Wolffiella' | 'Wolffia';
  origin: string;
  location: { lat: number; lng: number; address?: string } | null;
  description: string;
  imageUrl: string;
  genomicFiles: FirestoreGenomicFile[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

function fromFirestore(id: string, data: FirestoreAccession): Accession {
  return {
    id,
    name_kr: data.name_kr,
    name_en: data.name_en,
    species: data.species,
    genus: data.genus,
    origin: data.origin,
    location: data.location ?? null,
    description: data.description,
    imageUrl: data.imageUrl,
    genomicFiles: (data.genomicFiles ?? []).map((f: FirestoreGenomicFile): GenomicFile => ({
      ...f,
      uploadedAt: toDate(f.uploadedAt),
    })),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function toFirestore(acc: Omit<Accession, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    ...acc,
    genomicFiles: acc.genomicFiles.map((f) => ({
      ...f,
      uploadedAt: f.uploadedAt,
    })),
    updatedAt: serverTimestamp(),
  };
}

// ---------- CRUD ----------

export async function getAccessions(): Promise<Accession[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data() as FirestoreAccession));
}

export async function getAccession(id: string): Promise<Accession | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data() as FirestoreAccession);
}

export async function createAccession(
  data: Omit<Accession, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...toFirestore(data),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAccession(
  id: string,
  data: Partial<Omit<Accession, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const payload: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  if (data.genomicFiles) {
    payload.genomicFiles = data.genomicFiles.map((f) => ({
      ...f,
      uploadedAt: f.uploadedAt,
    }));
  }
  await updateDoc(doc(db, COLLECTION, id), payload);
}

export async function deleteAccession(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function getRecentAccessions(count = 5): Promise<Accession[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data() as FirestoreAccession));
}

export async function getAccessionStats(): Promise<{
  total: number;
  speciesCount: number;
  fileCount: number;
}> {
  const all = await getAccessions();
  const species = new Set(all.map((a) => a.species));
  const fileCount = all.reduce((sum, a) => sum + a.genomicFiles.length, 0);
  return { total: all.length, speciesCount: species.size, fileCount };
}
