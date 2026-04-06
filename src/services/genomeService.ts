import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const STORAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/duckweed-fond.firebasestorage.app/o/genome-browser';

function storageUrl(speciesSlug: string, file: string): string {
  return `${STORAGE_BASE}%2F${speciesSlug}%2F${encodeURIComponent(file)}?alt=media`;
}

export interface GenomeConfig {
  id: string; // Firestore document ID = species slug (e.g. "wolffia-australiana")
  displayName: string;
  genus: string;
  genomeSizeMb: number;
  geneCount: number | null;
  chromosomeCount: number;
  description: string;
  reference: string;
  journal: string;
  ncbiAccession: string;
  ncbiUrl: string;
  doiUrl: string;
  fastaUrl: string;
  faiUrl: string;
  gziUrl: string;
  gffUrl: string;
  gffIndexUrl: string;
  defaultLocation: string;
  indexed: boolean;
}

const COLLECTION = 'genomes';

interface FirestoreGenome {
  displayName: string;
  genus: string;
  genomeSizeMb: number;
  geneCount: number | null;
  chromosomeCount: number;
  description: string;
  reference: string;
  journal: string;
  ncbiAccession: string;
  ncbiUrl: string;
  doiUrl: string;
  defaultLocation: string;
  indexed: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

function fromFirestore(id: string, data: FirestoreGenome): GenomeConfig {
  return {
    id,
    displayName: data.displayName,
    genus: data.genus,
    genomeSizeMb: data.genomeSizeMb ?? 0,
    geneCount: data.geneCount ?? null,
    chromosomeCount: data.chromosomeCount ?? 0,
    description: data.description ?? '',
    reference: data.reference ?? '',
    journal: data.journal ?? '',
    ncbiAccession: data.ncbiAccession ?? '',
    ncbiUrl: data.ncbiUrl ?? '',
    doiUrl: data.doiUrl ?? '',
    defaultLocation: data.defaultLocation ?? '',
    indexed: data.indexed ?? false,
    // Storage URLs are derived from document ID (species slug)
    fastaUrl: storageUrl(id, 'genome.fa.gz'),
    faiUrl: storageUrl(id, 'genome.fa.gz.fai'),
    gziUrl: storageUrl(id, 'genome.fa.gz.gzi'),
    gffUrl: storageUrl(id, 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl(id, 'genes.sorted.gff3.gz.tbi'),
  };
}

export async function getGenomes(): Promise<GenomeConfig[]> {
  const q = query(collection(db, COLLECTION), orderBy('displayName'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data() as FirestoreGenome));
}

export async function getGenome(id: string): Promise<GenomeConfig | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data() as FirestoreGenome);
}

export async function upsertGenome(
  id: string,
  data: Omit<GenomeConfig, 'id' | 'fastaUrl' | 'faiUrl' | 'gziUrl' | 'gffUrl' | 'gffIndexUrl'>,
): Promise<void> {
  await setDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteGenome(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export const genusColors: Record<string, string> = {
  Spirodela: '#22c55e',
  Landoltia: '#10b981',
  Lemna: '#f59e0b',
  Wolffiella: '#f97316',
  Wolffia: '#ef4444',
};
