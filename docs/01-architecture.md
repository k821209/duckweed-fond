# 시스템 아키텍처

- **날짜**: 2026-03-12
- **프로젝트**: duckweed-fond

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 빌드 도구 | Vite | 7.3.1 |
| 프레임워크 | React | 19.2.0 |
| 언어 | TypeScript | 5.9.3 |
| 스타일링 | Tailwind CSS | 4.2.1 (Vite 플러그인) |
| 호스팅 | Firebase Hosting | - |
| 인증 | Firebase Auth | Email/Password + Google |
| 데이터베이스 | Cloud Firestore | - |
| 파일 저장소 | Firebase Storage | - |
| 지도 | Leaflet + react-leaflet | 1.9.4 / 5.0.0 |
| 데이터 테이블 | @tanstack/react-table | 8.21.3 |
| 차트 | recharts | 3.8.0 |
| 파일 업로드 UI | react-dropzone | 15.0.0 |
| 알림 | react-hot-toast | 2.6.0 |
| 아이콘 | react-icons (Lu, Fc) | 5.6.0 |
| 라우팅 | react-router-dom | 7.13.1 |

---

## 디렉토리 구조

```
duckweed-fond/
├── .env                    # Firebase 설정 (gitignore)
├── .env.example            # Firebase 설정 템플릿
├── .firebaserc             # Firebase 프로젝트 매핑
├── firebase.json           # Firebase Hosting 설정
├── vite.config.ts          # Vite + React + Tailwind 플러그인
├── index.html              # 엔트리 HTML
├── package.json            # 의존성
├── tsconfig.json           # TypeScript 설정
│
├── plans/                  # 계획 문서
│   ├── 01-project-plan.md
│   ├── 02-ux-research.md
│   ├── 03-wireframes.md
│   ├── 04-design-system.md
│   ├── 05-literature-data.md
│   ├── 06-genome-browser.md
│   └── 07-implementation-status.md
│
├── docs/                   # 기술 문서
│
├── public/                 # 정적 파일
│
└── src/
    ├── main.tsx            # React 루트 렌더
    ├── App.tsx             # BrowserRouter + Routes
    ├── index.css           # Tailwind CSS + 커스텀 테마
    │
    ├── types/
    │   └── accession.ts    # Accession, GeoLocation, GenomicFile 타입
    │
    ├── services/
    │   ├── firebase.ts     # Firebase 앱 초기화
    │   ├── authService.ts  # 인증 (email, Google, logout)
    │   ├── accessionService.ts  # Firestore CRUD
    │   └── storageService.ts    # Storage 업로드/삭제
    │
    ├── hooks/
    │   └── useAuth.ts      # 인증 상태 훅
    │
    ├── components/
    │   ├── Layout.tsx       # Header + Outlet + Footer
    │   ├── Header.tsx       # 네비게이션 (모바일 햄버거)
    │   ├── Footer.tsx       # 푸터
    │   ├── ProtectedRoute.tsx  # 인증 가드
    │   ├── StatCard.tsx     # 통계 카드
    │   ├── MapPreview.tsx   # 홈 지도 미리보기
    │   ├── MapView.tsx      # 품종 목록 사이드 맵
    │   ├── MiniMap.tsx      # 품종 상세 미니맵
    │   └── leafletSetup.ts  # Leaflet 마커 아이콘 픽스
    │
    ├── pages/
    │   ├── Home.tsx         # 홈페이지
    │   ├── Accessions.tsx   # 품종 목록
    │   ├── AccessionDetail.tsx  # 품종 상세
    │   ├── MapPage.tsx      # 전체 지도
    │   ├── Literature.tsx   # 연구현황
    │   ├── Download.tsx     # 다운로드
    │   ├── About.tsx        # 소개
    │   └── admin/
    │       ├── AdminLogin.tsx   # 관리자 로그인
    │       ├── AdminUpload.tsx  # 데이터 업로드
    │       └── AdminManage.tsx  # 데이터 관리
    │
    └── data/
        ├── dummyAccessions.ts  # 더미 품종 데이터 (6개)
        ├── speciesData.ts      # 개구리밥 종 데이터 (24종)
        └── publications.ts     # 논문 + 외부 DB 데이터
```

---

## 라우팅 구조

| 경로 | 페이지 | 접근 권한 |
|------|--------|----------|
| `/` | Home | 공개 |
| `/accessions` | Accessions | 공개 |
| `/accessions/:id` | AccessionDetail | 공개 |
| `/map` | MapPage | 공개 |
| `/literature` | Literature | 공개 |
| `/download` | Download | 공개 |
| `/about` | About | 공개 |
| `/admin/login` | AdminLogin | 공개 |
| `/admin/upload` | AdminUpload | 인증 필요 (ProtectedRoute) |
| `/admin/manage` | AdminManage | 인증 필요 (ProtectedRoute) |

---

## 데이터 흐름

```
[사용자 브라우저]
       │
       ├── 읽기 ──→ Firestore (accessions 컬렉션) ──→ 품종 목록/상세
       ├── 읽기 ──→ Firebase Storage ──→ 이미지/파일 다운로드
       │
       └── 관리자 (인증 후)
           ├── 쓰기 ──→ Firebase Storage (이미지, 유전체 파일 업로드)
           └── 쓰기 ──→ Firestore (품종 메타데이터 CRUD)
```

---

## 배포

- **호스팅**: Firebase Hosting (`dist/` 빌드 결과물)
- **URL**: https://duckweed-fond.web.app
- **SPA 리라이트**: 모든 경로 → `/index.html`
- **배포 명령**: `npm run build && firebase deploy --only hosting`
- **GitHub**: https://github.com/k821209/duckweed-fond

---

*이 문서는 Claude Code doc-writer 스킬로 자동 생성되었습니다.*
