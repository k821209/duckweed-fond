# 개발 로그

- **날짜**: 2026-03-12
- **프로젝트**: duckweed-fond (개구리밥 유전체 정보 공유 플랫폼)
- **작업자**: k821209

---

## 요약

> 개구리밥 유전체 정보 공유 웹 플랫폼을 처음부터 설계, 구현, 배포까지 완료함. 6개 계획 문서 작성 → 전체 프론트엔드 구현 → Firebase 연동 → 배포 → GitHub 푸시.

---

## 작업 내용

### 수행한 것

**계획 수립 (plans/ 01~06)**
- 프로젝트 계획서: 기술 스택, 데이터 구조, 페이지 구조, 구현 단계
- UX 리서치: Phytozome, TAIR, Ensembl Plants, GBIF 벤치마킹
- 와이어프레임: 8개 이상 페이지 ASCII 목업
- 디자인 시스템: duckweed-green/water-blue 색상 팔레트, 14개 컴포넌트 스펙
- 연구 데이터: 36종 개구리밥 게놈 정보, 9개 논문, 5개 외부 DB
- 게놈 브라우저: JBrowse 2 통합 계획 (React 컴포넌트, 데이터 전처리, 호스팅)

**프론트엔드 구현 (src/)**
- 공개 7개 페이지: Home, Accessions, AccessionDetail, MapPage, Literature, Download, About
- 관리자 3개 페이지: AdminLogin, AdminUpload, AdminManage
- 공통 컴포넌트: Layout, Header (모바일 햄버거), Footer, ProtectedRoute, StatCard
- 지도 컴포넌트: MapPreview, MapView (highlightedId 연동), MiniMap
- 데이터: 더미 품종 6개, 종 데이터 24종, 논문 9개

**Firebase 연동**
- Auth: 이메일/비밀번호 + Google 로그인
- Firestore: accessions 컬렉션 CRUD (createAccession, getAccessions 등)
- Storage: 이미지/유전체 파일 업로드 (진행률 콜백)
- AdminUpload에서 실제 Firebase 업로드 동작하도록 연동 완료

**배포**
- Firebase Hosting 배포: https://duckweed-fond.web.app
- GitHub 저장소 초기 커밋 및 푸시: https://github.com/k821209/duckweed-fond

### 의사결정 및 이유

| 결정 | 이유 |
|------|------|
| Vite + React + TypeScript | 빠른 HMR, 풍부한 라이브러리 생태계 |
| Tailwind CSS v4 (Vite 플러그인) | 빠른 UI 개발, 별도 설정 파일 불필요 |
| Firebase 올인원 | Hosting + Auth + Firestore + Storage를 한 곳에서 관리 |
| Leaflet (not Google Maps) | 무료, OpenStreetMap 기반, react-leaflet 통합 용이 |
| JBrowse 2 (not IGV.js) | React 네이티브 컴포넌트, 식물 유전체 분야 표준 |
| Google 로그인 추가 | 사용자 편의성, Firebase Console에서 이미 활성화됨 |
| 서비스 레이어 분리 | authService, accessionService, storageService로 관심사 분리 |

---

## 이슈 & 트러블슈팅

| 이슈 | 원인 | 해결 |
|------|------|------|
| CSS import order 경고 | `@import` 규칙이 다른 규칙 뒤에 위치 | Pretendard 폰트 import를 `@import "tailwindcss"` 앞으로 이동 |
| Firebase Auth CONFIGURATION_NOT_FOUND | Firebase Console에서 Auth 미활성화 | Auth, Firestore, Storage 수동 활성화 |
| Agent 팀 화면 분할 실패 | 터미널 80x24 크기 부족 | 일반 Agent + `run_in_background` 사용 |
| Vite 프로젝트 생성 실패 (비어있지 않은 디렉토리) | `npm create vite@latest .` 거부 | 임시 디렉토리에 생성 후 파일 복사 |
| Firebase deploy 인증 만료 | 세션 만료 | `firebase login` 재실행 |
| git push 인증 실패 | HTTPS 인증 정보 없음 | `gh auth login` + `gh auth setup-git` |
| 업로드 기능 TODO 상태 | handleSubmit에 alert만 있었음 | Firebase Storage/Firestore 실제 연동 코드 구현 |
| 번들 크기 경고 (1.3MB) | 단일 청크에 모든 코드 포함 | 미해결 — code splitting 필요 |

---

## 배운 것 / 인사이트

- Tailwind CSS v4는 `@tailwindcss/vite` 플러그인으로 설정이 매우 간단해짐 (tailwind.config.js 불필요)
- Firebase Storage는 CORS 설정이 JBrowse 같은 범위 요청(Range request)에 필수
- `react-leaflet` v5는 React 19와 호환되며, 마커 아이콘은 별도 import 필요
- Firestore의 `serverTimestamp()`는 클라이언트에서 직접 Date를 넣는 것보다 안전
- `gh auth setup-git`으로 GitHub CLI 인증을 git credential에 연결 가능

---

## 다음 단계

- [ ] Firestore Security Rules 작성 및 적용 (읽기: 공개, 쓰기: 인증 필요)
- [ ] Firebase Storage Rules 작성 및 적용
- [ ] 번들 크기 최적화 (React.lazy + dynamic import)
- [ ] JBrowse 2 게놈 브라우저 통합 구현 (plans/06-genome-browser.md 참고)
- [ ] Spirodela polyrhiza 유전체 데이터 전처리 및 업로드
- [ ] 반응형 디자인 최종 QA
- [ ] Firestore 인덱스 확인 (orderBy 쿼리용)
- [ ] AdminManage 페이지에 수정 기능 추가 (현재 삭제만 가능)

---

*이 문서는 Claude Code doc-writer 스킬로 자동 생성되었습니다.*
