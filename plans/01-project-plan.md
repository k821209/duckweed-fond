# Duckweed Genomics Web Platform - Project Plan

## 1. 프로젝트 개요

개구리밥(Duckweed) 유전체 정보를 공유하는 웹 플랫폼.
- 기본적으로 **비로그인** 사용자가 열람 가능
- **슈퍼유저(관리자)**만 로그인하여 데이터 업로드/관리
- Firebase 기반 인프라

---

## 2. 기술 스택

| 영역 | 기술 | 이유 |
|------|------|------|
| 빌드 도구 | **Vite** | 빠른 HMR, 간결한 설정 |
| 프레임워크 | **React + TypeScript** | 생태계, 테이블/차트 라이브러리 풍부 |
| 스타일링 | **Tailwind CSS** | 빠른 UI 개발, 반응형 |
| 호스팅 | **Firebase Hosting** | SPA 배포, CDN |
| 인증 | **Firebase Auth** | 슈퍼유저 로그인 (Email/Password) |
| 저장소 | **Firebase Storage** | 유전체 파일 업로드/다운로드 |
| DB (선택) | **Firestore** | 메타데이터, 품종 정보 저장 |

---

## 3. 사용자 역할

### 3.1 일반 사용자 (비로그인)
- 개구리밥 품종/계통 목록 열람
- 유전체 데이터 검색 및 조회
- 수집지 지도 보기 (Leaflet 맵)
- 파일 다운로드 (공개 데이터)
- 시각화 차트 열람

### 3.2 슈퍼유저 (로그인 필요)
- Firebase Auth (Email/Password) 로그인
- 데이터 업로드 (유전체 파일, 메타데이터)
- 데이터 수정/삭제
- 사용자 관리 (필요시)
- 슈퍼유저 계정은 직접 생성 (회원가입 페이지 없음, Firebase Console에서 생성)

---

## 4. 주요 페이지 구조

```
/ (홈)
├── /accessions          - 품종/계통 목록 (테이블 + 지도)
│   └── /accessions/:id  - 품종 상세 정보 (옆에 미니맵)
├── /map                 - 전체 수집지 지도 (전체보기)
├── /genomics            - 유전체 데이터 브라우저
├── /literature          - 기존 논문/공개 데이터 정리
├── /download            - 데이터 다운로드
├── /about               - 프로젝트 소개
├── /admin (로그인 필요)
│   ├── /admin/upload     - 데이터 업로드
│   ├── /admin/manage     - 데이터 관리 (CRUD)
│   └── /admin/login      - 로그인 페이지
```

---

## 5. 데이터 구조 (Firestore)

### accessions (컬렉션)
```
{
  id: string,
  name_kr: string,          // 한글명
  name_en: string,          // 영문명
  species: string,          // 종명 (Lemna, Spirodela, Wolffia 등)
  origin: string,           // 출처/수집지
  location: {               // GPS 수집 위치
    lat: number,            // 위도
    lng: number,            // 경도
    address: string         // 주소/지명 (선택)
  } | null,
  description: string,      // 설명
  imageUrl: string,         // 이미지 (Storage 경로)
  genomicFiles: [{          // 관련 파일 목록
    fileName: string,
    storageUrl: string,
    fileType: string,       // fasta, vcf, gff 등
    uploadedAt: timestamp
  }],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Firebase Storage 구조
```
/duckweed-genomics/
├── images/                 - 품종 이미지
├── genomic-data/           - 유전체 데이터 파일
│   ├── fasta/
│   ├── vcf/
│   ├── gff/
│   └── other/
└── documents/              - 기타 문서
```

---

## 6. Firebase Security Rules

### Firestore Rules
```
- 읽기: 모든 사용자 허용 (공개)
- 쓰기: 인증된 슈퍼유저만 허용
```

### Storage Rules
```
- 다운로드: 모든 사용자 허용
- 업로드/삭제: 인증된 슈퍼유저만 허용
```

---

## 7. 구현 단계

### Phase 1: 프로젝트 셋업
- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] Firebase 프로젝트 생성 및 SDK 설정
- [ ] 라우팅 설정 (React Router)
- [ ] 기본 레이아웃 (Header, Footer, Sidebar)

### Phase 2: 공개 페이지
- [ ] 홈페이지 (프로젝트 소개, 요약 통계)
- [ ] 품종/계통 목록 페이지 (검색, 필터, 테이블 + 사이드 맵)
- [ ] 품종 상세 페이지 (상세 정보 + 미니맵)
- [ ] 전체 수집지 지도 페이지 (마커 클러스터링)
- [ ] 다운로드 페이지
- [ ] About 페이지

### Phase 3: 관리자 기능
- [ ] Firebase Auth 로그인 페이지
- [ ] 인증 Guard (ProtectedRoute)
- [ ] 데이터 업로드 페이지 (파일 + 메타데이터)
- [ ] 데이터 관리 페이지 (수정/삭제)

### Phase 4: 배포 및 개선
- [ ] Firebase Hosting 배포 설정
- [ ] Firebase Security Rules 적용
- [ ] 반응형 디자인 점검
- [ ] 성능 최적화 (lazy loading, 이미지 최적화)

---

## 8. 핵심 라이브러리

| 라이브러리 | 용도 |
|-----------|------|
| `react-router-dom` | 라우팅 |
| `firebase` | Firebase SDK |
| `@tanstack/react-table` | 데이터 테이블 |
| `react-dropzone` | 파일 업로드 UI |
| `recharts` 또는 `chart.js` | 차트/시각화 |
| `react-hot-toast` | 알림 |
| `react-leaflet` + `leaflet` | 수집지 지도 표시 (무료, OpenStreetMap) |

---

## 9. 참고 사항

- 개구리밥 주요 종: Lemna minor, Spirodela polyrhiza, Wolffia globosa 등
- 유전체 파일 형식: FASTA, VCF, GFF3, BAM 등
- 대용량 파일은 Firebase Storage에 저장, 메타데이터만 Firestore에
- 슈퍼유저 계정은 Firebase Console에서 수동 생성 (보안)
