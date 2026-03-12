# 게놈 브라우저 통합 계획

## 1. 게놈 브라우저 선택

### 후보 비교

| 항목 | JBrowse 2 | IGV.js |
|------|-----------|--------|
| 아키텍처 | React 기반 | Vanilla JS |
| React 통합 | **네이티브 React 컴포넌트** | iframe 또는 wrapper 필요 |
| NPM 패키지 | `@jbrowse/react-linear-genome-view` | `igv` |
| 지원 포맷 | FASTA, GFF3, VCF, BAM, CRAM, BigWig, BED | FASTA, GFF3, VCF, BAM, BED, BigWig |
| 커스터마이징 | 플러그인 시스템, 테마 | 제한적 |
| 식물 유전체 사례 | Phytozome, Ensembl Plants | 일부 |
| 번들 크기 | 무거움 (~5MB) | 가벼움 (~1MB) |

### 선택: **JBrowse 2 (React Linear Genome View)**

이유:
- 우리 프로젝트가 React + TypeScript 기반이므로 네이티브 React 컴포넌트가 이상적
- `createViewState` API로 동적 설정 변경 가능
- 식물 유전체 분야 표준 (Phytozome이 JBrowse 기반)
- GFF3 + FASTA 조합으로 유전자 구조 시각화 가능

---

## 2. 사용 가능한 개구리밥 유전체 데이터

### 서열화 완료 종 (게놈 브라우저 탑재 가능)

| 종 | 게놈 크기 | NCBI Accession | 데이터 소스 | 비고 |
|----|----------|---------------|------------|------|
| **Spirodela polyrhiza 7498** | 158 Mb | GCA_000504445 | Phytozome, NCBI | 가장 완성도 높음, v2 |
| **Spirodela polyrhiza 9509** | 160 Mb | GCA_001981405 | NCBI | v3, chromosome-scale |
| **Spirodela intermedia** | 160 Mb | NCBI | Scientific Reports | PacBio + ONT |
| **Lemna minor 5500** | 481 Mb | NCBI | Biotechnol Biofuels | Draft assembly |
| **Lemna minuta** | 360 Mb | NCBI | iScience | 21 chromosomes resolved |
| **Wolffia australiana** | 357 Mb | NCBI | Nature Comms Biology | 15,000 genes |

### 데이터 파일 구성 (종당)

```
{species}/
├── genome.fa.gz          # bgzip 압축 FASTA
├── genome.fa.gz.fai      # samtools faidx 인덱스
├── genome.fa.gz.gzi      # bgzip 인덱스
├── genes.sorted.gff3.gz  # bgzip 압축 정렬된 GFF3
├── genes.sorted.gff3.gz.tbi  # tabix 인덱스
└── variants.vcf.gz       # (있는 경우) VCF
    variants.vcf.gz.tbi
```

---

## 3. 기술 구현 방안

### 3.1 NPM 패키지 설치

```bash
npm install @jbrowse/react-linear-genome-view @fontsource/roboto
npm install -g @jbrowse/cli  # 데이터 전처리용
```

### 3.2 데이터 전처리 (서버 또는 로컬)

```bash
# FASTA 준비
bgzip genome.fasta
samtools faidx genome.fasta.gz

# GFF3 준비
jbrowse sort-gff genes.gff3 > genes.sorted.gff3
bgzip genes.sorted.gff3
tabix genes.sorted.gff3.gz

# (선택) 텍스트 검색 인덱스
jbrowse text-index --file genes.sorted.gff3.gz --fileId genes_track
```

### 3.3 데이터 호스팅

**Firebase Storage 활용:**
- 전처리된 파일(.fa.gz, .gff3.gz, .tbi 등)을 Firebase Storage에 업로드
- 공개 다운로드 URL로 JBrowse에 제공
- CORS 설정 필요 (Firebase Storage 기본 지원)

```
Firebase Storage 구조:
/genome-browser/
├── spirodela-polyrhiza/
│   ├── genome.fa.gz
│   ├── genome.fa.gz.fai
│   ├── genome.fa.gz.gzi
│   ├── genes.sorted.gff3.gz
│   └── genes.sorted.gff3.gz.tbi
├── lemna-minor/
│   └── ...
└── wolffia-australiana/
    └── ...
```

### 3.4 React 컴포넌트 구현

```tsx
// src/components/GenomeBrowser.tsx
import '@fontsource/roboto';
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view';

interface GenomeBrowserProps {
  species: string;        // 종 식별자
  assemblyName: string;   // 표시 이름
  fastaUrl: string;       // .fa.gz URL
  faiUrl: string;         // .fa.gz.fai URL
  gziUrl: string;         // .fa.gz.gzi URL
  gffUrl: string;         // .gff3.gz URL
  gffIndexUrl: string;    // .gff3.gz.tbi URL
  initialLocation?: string; // 예: "Chr1:1-100000"
}

export default function GenomeBrowser({
  assemblyName, fastaUrl, faiUrl, gziUrl,
  gffUrl, gffIndexUrl, initialLocation,
}: GenomeBrowserProps) {
  const state = createViewState({
    assembly: {
      name: assemblyName,
      sequence: {
        type: 'ReferenceSequenceTrack',
        trackId: `${assemblyName}-refseq`,
        adapter: {
          type: 'BgzipFastaAdapter',
          fastaLocation: { uri: fastaUrl },
          faiLocation: { uri: faiUrl },
          gziLocation: { uri: gziUrl },
        },
      },
    },
    tracks: [
      {
        type: 'FeatureTrack',
        trackId: `${assemblyName}-genes`,
        name: 'Gene Annotations',
        assemblyNames: [assemblyName],
        adapter: {
          type: 'Gff3TabixAdapter',
          gffGzLocation: { uri: gffUrl },
          index: { location: { uri: gffIndexUrl } },
        },
      },
    ],
    defaultSession: {
      name: 'Default',
      view: {
        id: 'linearGenomeView',
        type: 'LinearGenomeView',
        ...(initialLocation && {
          displayedRegions: [],  // JBrowse가 location string으로 자동 이동
        }),
      },
    },
    location: initialLocation,
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}
```

### 3.5 종별 설정 데이터

```ts
// src/data/genomeBrowserConfigs.ts
export interface GenomeBrowserConfig {
  species: string;
  displayName: string;
  fastaUrl: string;
  faiUrl: string;
  gziUrl: string;
  gffUrl: string;
  gffIndexUrl: string;
  defaultLocation: string;
  description: string;
}

export const genomeBrowserConfigs: GenomeBrowserConfig[] = [
  {
    species: 'spirodela-polyrhiza',
    displayName: 'Spirodela polyrhiza 7498',
    fastaUrl: 'https://firebasestorage.googleapis.com/.../genome.fa.gz',
    faiUrl: 'https://firebasestorage.googleapis.com/.../genome.fa.gz.fai',
    gziUrl: 'https://firebasestorage.googleapis.com/.../genome.fa.gz.gzi',
    gffUrl: 'https://firebasestorage.googleapis.com/.../genes.sorted.gff3.gz',
    gffIndexUrl: 'https://firebasestorage.googleapis.com/.../genes.sorted.gff3.gz.tbi',
    defaultLocation: 'Chr1:1-100000',
    description: '최초 서열 분석된 개구리밥, 158 Mb, 19,623 유전자',
  },
  // ... 다른 종 추가
];
```

---

## 4. 페이지 구조

### 4.1 라우팅 추가

```
/genomics                    - 게놈 브라우저 메인 (종 선택)
/genomics/:species           - 특정 종 게놈 브라우저
```

### 4.2 게놈 브라우저 메인 페이지 (/genomics)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header / Nav                            │
├─────────────────────────────────────────────────────────────────┤
│ 게놈 브라우저                                                    │
│                                                                 │
│ 종 선택:                                                        │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ 📗           │ │ 📗           │ │ 📗           │             │
│ │ S. polyrhiza │ │ L. minor     │ │ W.australiana│             │
│ │ 158 Mb       │ │ 481 Mb       │ │ 357 Mb       │             │
│ │ [브라우저 →]  │ │ [브라우저 →]  │ │ [브라우저 →]  │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ S. intermedia│ │ L. minuta    │ │ (추가 예정)   │             │
│ │ 160 Mb       │ │ 360 Mb       │ │              │             │
│ │ [브라우저 →]  │ │ [브라우저 →]  │ │              │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                           Footer                                │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 종별 게놈 브라우저 페이지 (/genomics/:species)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header / Nav                            │
├─────────────────────────────────────────────────────────────────┤
│ 게놈 브라우저 > Spirodela polyrhiza                    (브레드크럼)│
│                                                                 │
│ 종 선택: [S. polyrhiza ▼]   위치 이동: [Chr1:1-100000] [이동]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │                                                          │    │
│ │              JBrowse Linear Genome View                  │    │
│ │                                                          │    │
│ │  Reference Sequence  ──────────────────────────          │    │
│ │  Gene Annotations    ═══╗  ═══╗   ═══════╗              │    │
│ │                         ║    ║           ║              │    │
│ │                         ╚════╝           ╚══════        │    │
│ │                                                          │    │
│ │  [줌인] [줌아웃] [← →]                                   │    │
│ │                                                          │    │
│ └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│ 게놈 정보                                                       │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│ │ 게놈 크기    │ 유전자 수    │ 염색체 수    │ GC 함량      │      │
│ │ 158 Mb      │ 19,623      │ 20          │ 34.5%       │      │
│ └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                 │
│ 데이터 출처: Wang et al. (2014) Nature Communications          │
│ [NCBI] [Phytozome] [논문 DOI]                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                           Footer                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 구현 단계

### Phase 1: 기본 구조 (MVP)
- [ ] `@jbrowse/react-linear-genome-view` 설치
- [ ] GenomeBrowser 컴포넌트 구현
- [ ] /genomics, /genomics/:species 라우팅 추가
- [ ] Spirodela polyrhiza 데이터 1종만 먼저 탑재
- [ ] Firebase Storage에 전처리 파일 업로드

### Phase 2: 확장
- [ ] 나머지 5종 데이터 추가
- [ ] 종 선택 드롭다운 + 카드형 목록
- [ ] 유전자 검색 기능 (text-index 활용)
- [ ] VCF 변이 트랙 추가 (데이터 있는 경우)
- [ ] 품종 상세 페이지에서 해당 종 게놈 브라우저 링크

### Phase 3: 고도화
- [ ] 슈퍼유저의 커스텀 트랙 업로드 기능
- [ ] 북마크/공유 URL (location 파라미터)
- [ ] 비교 게놈 뷰 (Synteny View, 추후)

---

## 6. 주의사항

### 성능
- 게놈 파일은 반드시 bgzip + tabix 인덱싱 필요
- Firebase Storage CORS 설정 필수
- JBrowse 번들이 크므로 lazy loading (React.lazy) 적용

### CORS 설정 (Firebase Storage)
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Range", "Content-Range"]
  }
]
```

```bash
# gsutil로 CORS 적용
gsutil cors set cors.json gs://duckweed-fond.firebasestorage.app
```

### 데이터 준비 도구
```bash
# 필수 도구 설치
sudo apt install samtools tabix
npm install -g @jbrowse/cli

# 또는 conda
conda install -c bioconda samtools htslib
```

---

## 7. 참고 자료

- [JBrowse 2 공식 문서](https://jbrowse.org/jb2/)
- [JBrowse React 컴포넌트](https://jbrowse.org/jb2/docs/embedded_components/)
- [JBrowse 임베딩 튜토리얼](https://jbrowse.org/jb2/docs/tutorials/embed_linear_genome_view/)
- [NPM: @jbrowse/react-linear-genome-view](https://www.npmjs.com/package/@jbrowse/react-linear-genome-view)
- [Phytozome - S. polyrhiza](https://phytozome-next.jgi.doe.gov/info/Spolyrhiza_v2)
- [NCBI S. polyrhiza 9509 v3](https://www.ncbi.nlm.nih.gov/assembly/2184171)
- [awesome-genome-visualization](https://github.com/cmdcolin/awesome-genome-visualization)
