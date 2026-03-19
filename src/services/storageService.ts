import {
  ref,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export async function getDownloadUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const path = `duckweed-genomics/images/${Date.now()}_${file.name}`;
  return uploadFile(path, file, onProgress);
}

export async function uploadGenomicFile(
  file: File,
  fileType: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const folder = ['fasta', 'vcf', 'gff', 'bam'].includes(fileType) ? fileType : 'other';
  const path = `duckweed-genomics/genomic-data/${folder}/${Date.now()}_${file.name}`;
  return uploadFile(path, file, onProgress);
}

/**
 * 게놈 브라우저용 파일 업로드
 * genome-browser/{species}/raw/ 경로에 업로드하면
 * Cloud Function이 자동으로 인덱싱 처리
 */
export async function uploadGenomeBrowserFile(
  file: File,
  species: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const path = `genome-browser/${species}/raw/${file.name}`;
  return uploadFile(path, file, onProgress);
}
