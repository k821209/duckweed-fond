"""
게놈 파일 자동 인덱싱 Cloud Function

업로드 경로: genome-browser/{species}/raw/{filename}
처리 결과:   genome-browser/{species}/{processed files}

지원 파일:
- FASTA (.fa, .fasta) → bgzip → faidx → .fa.gz, .fa.gz.fai, .fa.gz.gzi
- GFF3 (.gff3, .gff)  → sort → bgzip → tabix → .sorted.gff3.gz, .sorted.gff3.gz.tbi

pysam Python API 사용 (CLI 바이너리 불필요)
"""

import os
import subprocess
import tempfile

import pysam

from firebase_admin import initialize_app
from firebase_functions import storage_fn, https_fn, options
from google.cloud import storage

initialize_app()


def upload_file(bucket, local_path: str, remote_path: str):
    """로컬 파일을 Storage에 업로드"""
    blob = bucket.blob(remote_path)
    blob.upload_from_filename(local_path)
    print(f"Uploaded: {remote_path} ({os.path.getsize(local_path)} bytes)")


def process_fasta(local_path: str, bucket, species: str):
    """FASTA → bgzip + faidx 인덱싱 (pysam Python API)"""
    gz_path = local_path + ".gz"

    # bgzip 압축
    print(f"bgzip compressing: {local_path}")
    pysam.tabix_compress(local_path, gz_path, force=True)
    print(f"bgzip done: {gz_path}")

    # faidx 인덱싱 (.fai + .gzi 생성)
    print(f"faidx indexing: {gz_path}")
    pysam.faidx(gz_path)
    print("faidx done")

    fai_path = gz_path + ".fai"
    gzi_path = gz_path + ".gzi"

    # 결과 업로드
    base_remote = f"genome-browser/{species}"
    upload_file(bucket, gz_path, f"{base_remote}/genome.fa.gz")
    upload_file(bucket, fai_path, f"{base_remote}/genome.fa.gz.fai")
    upload_file(bucket, gzi_path, f"{base_remote}/genome.fa.gz.gzi")

    print(f"FASTA processing complete for {species}")


def process_gff(local_path: str, bucket, species: str):
    """GFF3 → sort + bgzip + tabix 인덱싱 (pysam Python API)"""
    tmpdir = os.path.dirname(local_path)

    # GFF3 정렬 (chromosome, start position 기준)
    sorted_path = os.path.join(tmpdir, "genes.sorted.gff3")
    print(f"Sorting GFF3: {local_path}")

    with open(sorted_path, "w") as out:
        # 헤더 추출
        with open(local_path) as f:
            for line in f:
                if line.startswith("#"):
                    out.write(line)
                else:
                    break

    # grep + sort로 데이터 라인 정렬
    result = subprocess.run(
        f"grep -v '^#' '{local_path}' | sort -t'\t' -k1,1 -k4,4n >> '{sorted_path}'",
        shell=True,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Sort warning: {result.stderr}")
    print("Sort done")

    # bgzip 압축
    gz_path = sorted_path + ".gz"
    print(f"bgzip compressing: {sorted_path}")
    pysam.tabix_compress(sorted_path, gz_path, force=True)
    print(f"bgzip done: {gz_path}")

    # tabix 인덱싱
    print(f"tabix indexing: {gz_path}")
    pysam.tabix_index(gz_path, preset="gff")
    print("tabix done")

    tbi_path = gz_path + ".tbi"

    # 결과 업로드
    base_remote = f"genome-browser/{species}"
    upload_file(bucket, gz_path, f"{base_remote}/genes.sorted.gff3.gz")
    upload_file(bucket, tbi_path, f"{base_remote}/genes.sorted.gff3.gz.tbi")

    print(f"GFF3 processing complete for {species}")


@storage_fn.on_object_finalized(
    region="us-central1",
    memory=options.MemoryOption.GB_2,
    timeout_sec=540,
    cpu=2,
)
def process_genome_upload(event: storage_fn.CloudEvent[storage_fn.StorageObjectData]):
    """Storage 업로드 트리거: genome-browser/{species}/raw/ 경로의 파일 처리"""

    file_path = event.data.name
    bucket_name = event.data.bucket

    # genome-browser/{species}/raw/ 경로만 처리
    if not file_path or "genome-browser/" not in file_path or "/raw/" not in file_path:
        print(f"Skipping: {file_path} (not in genome-browser/*/raw/)")
        return

    # species 추출: genome-browser/{species}/raw/{filename}
    parts = file_path.split("/")
    try:
        gb_idx = parts.index("genome-browser")
        species = parts[gb_idx + 1]
        filename = parts[-1]
    except (ValueError, IndexError):
        print(f"Invalid path structure: {file_path}")
        return

    print(f"Processing: {filename} for species: {species}")

    # 파일 다운로드
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(file_path)

    with tempfile.TemporaryDirectory() as tmpdir:
        local_path = os.path.join(tmpdir, filename)
        blob.download_to_filename(local_path)
        print(f"Downloaded: {local_path} ({os.path.getsize(local_path)} bytes)")

        # 파일 타입별 처리
        lower_name = filename.lower()
        if lower_name.endswith((".fa", ".fasta")):
            process_fasta(local_path, bucket, species)
        elif lower_name.endswith((".gff3", ".gff")):
            process_gff(local_path, bucket, species)
        else:
            print(f"Unsupported file type: {filename}")
            return

    print(f"Done processing {filename}")


def _reindex_species(species: str, bucket_name: str):
    """주어진 종의 raw 파일들을 재인덱싱"""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    prefix = f"genome-browser/{species}/raw/"

    blobs = list(bucket.list_blobs(prefix=prefix))
    if not blobs:
        raise ValueError(f"No raw files found for species: {species}")

    processed = []
    with tempfile.TemporaryDirectory() as tmpdir:
        for blob in blobs:
            filename = blob.name.split("/")[-1]
            if not filename:
                continue

            local_path = os.path.join(tmpdir, filename)
            blob.download_to_filename(local_path)
            print(f"Downloaded: {local_path} ({os.path.getsize(local_path)} bytes)")

            lower_name = filename.lower()
            if lower_name.endswith((".fa", ".fasta")):
                process_fasta(local_path, bucket, species)
                processed.append(f"FASTA: {filename}")
            elif lower_name.endswith((".gff3", ".gff")):
                process_gff(local_path, bucket, species)
                processed.append(f"GFF3: {filename}")

    return processed


@https_fn.on_call(
    region="us-central1",
    memory=options.MemoryOption.GB_2,
    timeout_sec=540,
    cpu=2,
)
def reindex_genome(req: https_fn.CallableRequest):
    """HTTP callable: 기존 업로드된 게놈 파일 재인덱싱"""

    # 인증 확인
    if not req.auth:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            message="Authentication required",
        )

    species = req.data.get("species") if req.data else None
    if not species:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="species is required",
        )

    print(f"Reindex requested for species: {species} by user: {req.auth.uid}")

    bucket_name = os.environ.get("STORAGE_BUCKET", "duckweed-fond.firebasestorage.app")

    try:
        processed = _reindex_species(species, bucket_name)
        return {"success": True, "processed": processed}
    except Exception as e:
        print(f"Reindex error: {e}")
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL,
            message=str(e),
        )
