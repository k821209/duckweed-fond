# 서비스 및 API 문서

- **날짜**: 2026-03-12
- **프로젝트**: duckweed-fond

---

## 1. 인증 서비스 (`src/services/authService.ts`)

Firebase Auth 기반 인증. 슈퍼유저 전용.

| 함수 | 인자 | 반환 | 설명 |
|------|------|------|------|
| `login(email, password)` | string, string | `Promise<User>` | 이메일/비밀번호 로그인 |
| `loginWithGoogle()` | - | `Promise<User>` | Google 팝업 로그인 |
| `logout()` | - | `Promise<void>` | 로그아웃 |
| `getCurrentUser()` | - | `User \| null` | 현재 로그인 사용자 |
| `onAuthStateChanged(cb)` | callback | `() => void` | 인증 상태 변경 구독 (해제 함수 반환) |

### useAuth 훅 (`src/hooks/useAuth.ts`)

```ts
const { user, loading, isAuthenticated, login, loginWithGoogle, logout } = useAuth();
```

- `user`: 현재 Firebase User 객체 또는 null
- `loading`: 인증 상태 확인 중 여부
- `isAuthenticated`: 로그인 여부 boolean

---

## 2. 품종 서비스 (`src/services/accessionService.ts`)

Firestore `accessions` 컬렉션 CRUD.

| 함수 | 인자 | 반환 | 설명 |
|------|------|------|------|
| `getAccessions()` | - | `Promise<Accession[]>` | 전체 목록 (createdAt 역순) |
| `getAccession(id)` | string | `Promise<Accession \| null>` | 단일 조회 |
| `createAccession(data)` | Omit<Accession, 'id'\|'createdAt'\|'updatedAt'> | `Promise<string>` | 생성 (문서 ID 반환) |
| `updateAccession(id, data)` | string, Partial | `Promise<void>` | 부분 업데이트 |
| `deleteAccession(id)` | string | `Promise<void>` | 삭제 |
| `getRecentAccessions(count?)` | number (기본 5) | `Promise<Accession[]>` | 최근 N개 |
| `getAccessionStats()` | - | `Promise<{total, speciesCount, fileCount}>` | 통계 |

### Accession 타입 (`src/types/accession.ts`)

```ts
interface Accession {
  id: string;
  name_kr: string;           // 한글명
  name_en: string;           // 영문명
  species: string;           // 종명
  genus: 'Spirodela' | 'Landoltia' | 'Lemna' | 'Wolffiella' | 'Wolffia';
  origin: string;            // 수집지
  location: GeoLocation | null;  // GPS 좌표
  description: string;
  imageUrl: string;
  genomicFiles: GenomicFile[];
  createdAt: Date;
  updatedAt: Date;
}

interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface GenomicFile {
  fileName: string;
  storageUrl: string;
  fileType: 'fasta' | 'vcf' | 'gff' | 'bam' | 'other';
  fileSize: number;
  uploadedAt: Date;
}
```

---

## 3. 스토리지 서비스 (`src/services/storageService.ts`)

Firebase Storage 파일 관리.

| 함수 | 인자 | 반환 | 설명 |
|------|------|------|------|
| `uploadFile(path, file, onProgress?)` | string, File, callback? | `Promise<string>` | 파일 업로드 (다운로드 URL 반환) |
| `deleteFile(path)` | string | `Promise<void>` | 파일 삭제 |
| `getDownloadUrl(path)` | string | `Promise<string>` | 다운로드 URL 조회 |
| `uploadImage(file, onProgress?)` | File, callback? | `Promise<string>` | 이미지 업로드 (`duckweed-genomics/images/`) |
| `uploadGenomicFile(file, fileType, onProgress?)` | File, string, callback? | `Promise<string>` | 유전체 파일 업로드 (타입별 폴더) |

### Storage 경로 규칙

```
duckweed-genomics/
├── images/{timestamp}_{filename}
└── genomic-data/
    ├── fasta/{timestamp}_{filename}
    ├── vcf/{timestamp}_{filename}
    ├── gff/{timestamp}_{filename}
    ├── bam/{timestamp}_{filename}
    └── other/{timestamp}_{filename}
```

---

## 4. 정적 데이터

### speciesData.ts
- 24종 개구리밥 데이터 (속, 종, 2n 수, 게놈 크기, 시퀀싱 상태)
- Literature 페이지 게놈 테이블 및 차트에 사용

### publications.ts
- 9개 주요 논문 (제목, 저자, DOI, 요약)
- 5개 외부 데이터베이스 링크 (NCBI, Phytozome 등)

### dummyAccessions.ts
- 6개 샘플 품종 데이터 (한국 도시 GPS 좌표 포함)
- Firestore 연동 전 초기 UI 테스트용

---

## 5. Firebase 설정

### 환경 변수 (`.env`)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=duckweed-fond
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Firebase Hosting (`firebase.json`)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

---

*이 문서는 Claude Code doc-writer 스킬로 자동 생성되었습니다.*
