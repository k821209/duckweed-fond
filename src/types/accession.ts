export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface GenomicFile {
  fileName: string;
  storageUrl: string;
  fileType: 'fasta' | 'vcf' | 'gff' | 'bam' | 'other';
  fileSize: number;
  uploadedAt: Date;
}

export interface Accession {
  id: string;
  name_kr: string;
  name_en: string;
  species: string;
  genus: 'Spirodela' | 'Landoltia' | 'Lemna' | 'Wolffiella' | 'Wolffia';
  origin: string;
  location: GeoLocation | null;
  description: string;
  imageUrl: string;
  genomicFiles: GenomicFile[];
  createdAt: Date;
  updatedAt: Date;
}
