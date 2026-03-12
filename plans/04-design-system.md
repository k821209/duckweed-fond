# 디자인 시스템

## 1. 색상 팔레트

### Primary (개구리밥/수생식물 테마)
| 이름 | HEX | 용도 |
|------|-----|------|
| primary-50 | #f0fdf4 | 배경 하이라이트 |
| primary-100 | #dcfce7 | 카드 배경 |
| primary-200 | #bbf7d0 | 호버 상태 |
| primary-300 | #86efac | 보조 요소 |
| primary-400 | #4ade80 | 아이콘 |
| primary-500 | #22c55e | 메인 브랜드 색상 |
| primary-600 | #16a34a | 버튼, 링크 |
| primary-700 | #15803d | 버튼 호버 |
| primary-800 | #166534 | 헤더, 강조 텍스트 |
| primary-900 | #14532d | 다크 배경 |

### Secondary (물/수생 테마)
| 이름 | HEX | 용도 |
|------|-----|------|
| secondary-400 | #38bdf8 | 지도 마커 |
| secondary-500 | #0ea5e9 | 링크, 보조 버튼 |
| secondary-600 | #0284c7 | 호버 |

### Neutral
| 이름 | HEX | 용도 |
|------|-----|------|
| gray-50 | #f9fafb | 페이지 배경 |
| gray-100 | #f3f4f6 | 카드 배경 |
| gray-200 | #e5e7eb | 테두리 |
| gray-500 | #6b7280 | 보조 텍스트 |
| gray-700 | #374151 | 본문 텍스트 |
| gray-900 | #111827 | 제목 텍스트 |

### Semantic
| 이름 | HEX | 용도 |
|------|-----|------|
| success | #22c55e | 성공 메시지 |
| warning | #f59e0b | 경고 |
| error | #ef4444 | 오류 |
| info | #3b82f6 | 정보 |

### Tailwind 설정 예시
```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        duckweed: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        water: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
    },
  },
}
```

---

## 2. 타이포그래피

### 폰트
| 용도 | 폰트 | 이유 |
|------|------|------|
| 한글 본문 | **Pretendard** | 깔끔, 가독성, 무료, 한글 최적화 |
| 영문/학명 | **Inter** | 모던, 가독성, Google Fonts |
| 코드/데이터 | **JetBrains Mono** | 유전체 시퀀스 표시에 적합 |

### 크기 체계 (Tailwind 기본)
| 역할 | 클래스 | 크기 | 용도 |
|------|--------|------|------|
| Hero | text-4xl / text-3xl | 36px / 30px | 홈 타이틀 |
| 페이지 제목 | text-2xl | 24px | 각 페이지 제목 |
| 섹션 제목 | text-xl | 20px | 카드/섹션 제목 |
| 소제목 | text-lg | 18px | 서브 헤딩 |
| 본문 | text-base | 16px | 기본 텍스트 |
| 보조 텍스트 | text-sm | 14px | 메타 정보, 캡션 |
| 라벨 | text-xs | 12px | 태그, 뱃지 |

---

## 3. 공통 컴포넌트

### 3.1 Header
```
Props: currentPath, isLoggedIn, onLogout
역할: 네비게이션 바, 로고, 검색바, 로그인 상태 표시
반응형: 모바일에서 햄버거 메뉴
```

### 3.2 Footer
```
Props: -
역할: 저작권, 연락처, 관련 링크
```

### 3.3 DataTable
```
Props: columns, data, onRowClick, onSort, onFilter, pageSize
역할: 정렬, 페이지네이션, 검색, 행 클릭 이벤트
라이브러리: @tanstack/react-table
```

### 3.4 MapView
```
Props: markers[], center, zoom, onMarkerClick, highlightedId
역할: 전체 지도 페이지용 Leaflet 맵
기능: 마커 클러스터링, 팝업, 줌 컨트롤
라이브러리: react-leaflet
```

### 3.5 MiniMap
```
Props: lat, lng, zoom?, label
역할: 품종 상세 페이지 옆 작은 지도 (단일 마커)
크기: 300x200px 고정
```

### 3.6 FileUploader
```
Props: accept, maxSize, multiple, onUpload, onRemove
역할: 드래그앤드롭 파일 업로드, 프로그레스 바
라이브러리: react-dropzone
```

### 3.7 SearchBar
```
Props: placeholder, onSearch, suggestions[]
역할: 글로벌 검색, 자동완성 드롭다운
```

### 3.8 FilterPanel
```
Props: filters[], onFilterChange, onReset
역할: 종명, 수집지, 날짜 등 필터 UI
스타일: 사이드바 또는 상단 드롭다운
```

### 3.9 AccessionCard
```
Props: accession (이름, 종명, 이미지, 수집지)
역할: 모바일 목록에서 카드형 표시
```

### 3.10 FileDownloadCard
```
Props: fileName, fileType, fileSize, downloadUrl
역할: 다운로드 목록 각 항목
아이콘: 파일 형식별 다른 아이콘
```

### 3.11 LoginForm
```
Props: onLogin, error
역할: 이메일/비밀번호 입력, Firebase Auth 연동
```

### 3.12 ProtectedRoute
```
Props: children, redirectTo
역할: 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
```

### 3.13 StatCard
```
Props: icon, value, label
역할: 홈페이지 통계 카드 (품종 수, 종 수 등)
```

### 3.14 GPSInput
```
Props: lat, lng, address, onChange
역할: 좌표 직접 입력 또는 지도 클릭으로 입력
연동: MiniMap과 양방향 바인딩
```

---

## 4. 아이콘 라이브러리

**선택: `react-icons` (Lucide 아이콘셋)**

| 이유 | 설명 |
|------|------|
| 통합 패키지 | 여러 아이콘셋을 하나로 |
| Lucide | 심플하고 일관된 스타일, Tailwind와 조화 |
| Tree-shaking | 사용한 아이콘만 번들에 포함 |
| 크기 | 각 아이콘 ~1KB |

주요 아이콘 용도:
- `LuSearch` - 검색
- `LuDownload` - 다운로드
- `LuUpload` - 업로드
- `LuMapPin` - 위치
- `LuLeaf` - 식물/품종
- `LuFileText` - 파일
- `LuFilter` - 필터
- `LuUser` - 로그인
- `LuLogOut` - 로그아웃
- `LuChevronRight` - 네비게이션

---

## 5. 반응형 브레이크포인트

Tailwind CSS 기본 브레이크포인트 활용:

| 브레이크포인트 | 크기 | 레이아웃 |
|--------------|------|---------|
| 기본 (모바일) | < 640px | 단일 컬럼, 카드형 목록, 지도 상단 |
| `sm` | >= 640px | 2컬럼 그리드 시작 |
| `md` | >= 768px | 사이드바 필터 표시 |
| `lg` | >= 1024px | 테이블 + 사이드 맵 병렬 |
| `xl` | >= 1280px | 풀 레이아웃 |

### 주요 반응형 전환
- **품종 목록**: lg 이상 = 테이블+맵 병렬 / 미만 = 맵 상단 + 카드 목록
- **품종 상세**: md 이상 = 정보+미니맵 병렬 / 미만 = 세로 스택
- **전체 지도**: md 이상 = 사이드 패널+맵 / 미만 = 맵 전체 + 하단 시트
- **업로드 폼**: lg 이상 = 폼+맵 병렬 / 미만 = 세로 스택
