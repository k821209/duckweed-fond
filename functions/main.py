"""
게놈 파일 자동 인덱싱 Cloud Function

업로드 경로: genome-browser/{species}/raw/{filename}
처리 결과:   genome-browser/{species}/{processed files}

지원 파일:
- FASTA (.fa, .fasta) → bgzip → samtools faidx → .fa.gz, .fa.gz.fai, .fa.gz.gzi
- GFF3 (.gff3, .gff)  → sort → bgzip → tabix → .sorted.gff3.gz, .sorted.gff3.gz.tbi
"""

import os
import subprocess
import tempfile

from firebase_admin import initialize_app, storage as admin_storage
from firebase_functions import storage_fn, options
from google.cloud import storage

initialize_app()

# pysam 설치 경로에서 samtools/bgzip/tabix 바이너리 찾기
import pysam
PYSAM_DIR = os.path.dirname(pysam.__file__)
SAMTOOLS = os.path.join(PYSAM_DIR, "samtools")
BGZIP = os.path.join(PYSAM_DIR, "bgzip")
TABIX = os.path.join(PYSAM_DIR, "tabix")

# pysam 바이너리가 없으면 시스템 PATH에서 찾기
if not os.path.exists(SAMTOOLS):
    SAMTOOLS = "samtools"
if not os.path.exists(BGZIP):
    BGZIP = "bgzip"
if not os.path.exists(TABIX):
    TABIX = "tabix"


def run_cmd(cmd: list[str], cwd: str | None = None):
    """명령 실행 및 에러 처리"""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if result.returncode != 0:
        print(f"STDERR: {result.stderr}")
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{result.stderr}")
    if result.stdout:
        print(f"STDOUT: {result.stdout[:500]}")
    return result


def upload_file(bucket, local_path: str, remote_path: str):
    """로컬 파일을 Storage에 업로드"""
    blob = bucket.blob(remote_path)
    blob.upload_from_filename(local_path)
    print(f"Uploaded: {remote_path} ({os.path.getsize(local_path)} bytes)")


def process_fasta(local_path: str, bucket, species: str):
    """FASTA → bgzip + faidx 인덱싱"""
    tmpdir = os.path.dirname(local_path)
    basename = os.path.basename(local_path)

    # bgzip 압축
    run_cmd([BGZIP, "-f", local_path])
    gz_path = local_path + ".gz"

    # samtools faidx (bgzip된 FASTA에 대해 .fai + .gzi 생성)
    run_cmd([SAMTOOLS, "faidx", gz_path])

    fai_path = gz_path + ".fai"
    gzi_path = gz_path + ".gzi"

    # 결과 업로드
    base_remote = f"genome-browser/{species}"
    upload_file(bucket, gz_path, f"{base_remote}/genome.fa.gz")
    upload_file(bucket, fai_path, f"{base_remote}/genome.fa.gz.fai")
    upload_file(bucket, gzi_path, f"{base_remote}/genome.fa.gz.gzi")

    print(f"FASTA processing complete for {species}")


def process_gff(local_path: str, bucket, species: str):
    """GFF3 → sort + bgzip + tabix 인덱싱"""
    tmpdir = os.path.dirname(local_path)

    # GFF3 정렬 (chromosome, start position 기준)
    sorted_path = os.path.join(tmpdir, "genes.sorted.gff3")
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

    # bgzip 압축
    run_cmd([BGZIP, "-f", sorted_path])
    gz_path = sorted_path + ".gz"

    # tabix 인덱싱
    run_cmd([TABIX, "-p", "gff", gz_path])
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
