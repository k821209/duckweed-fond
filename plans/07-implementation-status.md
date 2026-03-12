# 구현 진행 현황

- **날짜**: 2026-03-12
- **프로젝트**: duckweed-fond (개구리밥 유전체 정보 공유 플랫폼)

---

## 요약

> Vite + React + TypeScript + Tailwind CSS + Firebase 기반 개구리밥 유전체 정보 공유 웹 플랫폼의 전체 프론트엔드 구현 및 Firebase 연동을 완료하고, Firebase Hosting에 배포함.

---

## Phase별 구현 상태

### Phase 1: 프로젝트 셋업 ✅ 완료
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] Tailwind CSS v4 설정 (`@tailwindcss/vite` 플러그인)
- [x] Firebase 프로젝트 연동 (Auth, Firestore, Storage)
- [x] React Router 라우팅 설정
- [x] 기본 레이아웃 (Header, Footer, Layout with Outlet)
- [x] 커스텀 테마 색상 (duckweed-green, water-blue)
- [x] Pretendard 폰트 적용

### Phase 2: 공개 페이지 ✅ 완료
- [x] 홈페이지 - Hero, 검색, StatCards, 최근 품종 테이블, 지도 미리보기
- [x] 품종 목록 - DataTable + 사이드 맵 (hover/click 연동), 필터, 반응형
- [x] 품종 상세 - 브레드크럼, 이미지, 정보, MiniMap, 탭 (info/genomic/files)
- [x] 전체 지도 - 전체화면 Leaflet + 사이드 패널 + 종별 체크박스 필터
- [x] 연구현황 - 3탭: 종별 게놈 테이블 + recharts 차트, 논문 카드, 외부 DB 카드
- [x] 다운로드 - 파일 테이블 + 탭 필터 + 일괄 다운로드
- [x] About - 프로젝트 소개 + 팀 + 연락처

### Phase 3: 관리자 기능 ✅ 완료
- [x] 로그인 페이지 - 이메일/비밀번호 + **Google 로그인** 버튼
- [x] ProtectedRoute 인증 가드
- [x] 데이터 업로드 - 메타데이터 폼 + 지도 클릭 GPS + Dropzone 파일 업로드
- [x] 업로드 Firebase 연동 (Storage 업로드 → Firestore 저장)
- [x] 데이터 관리 - 품종 테이블 + 삭제 모달

### Phase 4: 배포 및 개선 🔧 진행 중
- [x] Firebase Hosting 배포 설정 (SPA rewrite)
- [x] Firebase Hosting 배포 완료 (https://duckweed-fond.web.app)
- [x] GitHub 저장소 연동 (https://github.com/k821209/duckweed-fond)
- [ ] Firebase Security Rules 적용
- [ ] 코드 스플리팅 (번들 크기 1.3MB 경고)
- [ ] 반응형 디자인 최종 점검

### Phase 5: 게놈 브라우저 📋 계획 수립됨
- [ ] JBrowse 2 (`@jbrowse/react-linear-genome-view`) 설치
- [ ] GenomeBrowser 컴포넌트 구현
- [ ] /genomics, /genomics/:species 라우팅 추가
- [ ] Spirodela polyrhiza 데이터 1종 먼저 탑재
- [ ] Firebase Storage에 전처리 파일 업로드

---

## 미해결 사항

| 항목 | 상태 | 우선순위 |
|------|------|---------|
| Firestore Security Rules 설정 | 미적용 | 높음 |
| Storage Security Rules 설정 | 미적용 | 높음 |
| 번들 크기 최적화 (code splitting) | 미적용 | 중간 |
| JBrowse 2 게놈 브라우저 통합 | 계획만 수립 | 중간 |
| 더미 데이터 → 실제 데이터 전환 | 일부 완료 | 중간 |
| Firestore 인덱스 설정 | 미확인 | 낮음 |

---

*이 문서는 Claude Code doc-writer 스킬로 자동 생성되었습니다.*
