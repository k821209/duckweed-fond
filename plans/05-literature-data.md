# 개구리밥(Duckweed) 유전체 기존 연구 데이터 정리

## 1. 개구리밥과(Lemnaceae) 분류 체계

5속 36종으로 구성:

| 속(Genus) | 종 수 | 게놈 크기 범위 | 특징 |
|-----------|-------|---------------|------|
| **Spirodela** | 2 | 150-160 Mb | 가장 작은 게놈, 모델 식물 |
| **Landoltia** | 1 | 350-370 Mb | 단일 종 (L. punctata) |
| **Lemna** | 13 | 400-800 Mb | 가장 많은 종, 전 세계 분포 |
| **Wolffiella** | 10 | 600-1,900 Mb | 아메리카/아프리카 분포 |
| **Wolffia** | 10 | 430-2,200 Mb | 가장 작은 현화식물, 큰 게놈 변이 |

---

## 2. 서열 분석 완료된 유전체

### 2.1 Spirodela polyrhiza (분개구리밥)
| 항목 | Clone 7498 | Clone 9509 |
|------|-----------|-----------|
| 게놈 크기 | 158 Mb | 160 Mb |
| 염색체 수 (2n) | 40 | 40 |
| 단백질 코딩 유전자 | ~19,623 | ~18,507 |
| 논문 | Wang et al. (2014) | Michael et al. (2017) |
| 저널 | Nature Communications | PNAS |
| NCBI | GCA_000504445 | GCA_001981405 |

### 2.2 Spirodela intermedia
| 항목 | 값 |
|------|-----|
| 게놈 크기 | ~160 Mb |
| 염색체 수 (2n) | 36 |
| 논문 | Hoang et al. (2020) |
| 저널 | Scientific Reports |
| 비고 | Chromosome-scale assembly, PacBio + ONT |

### 2.3 Lemna minor (좀개구리밥)
| 항목 | Clone 5500 | Clone 8627 |
|------|-----------|-----------|
| 게놈 크기 | 481 Mb | ~800 Mb |
| 단백질 코딩 유전자 | 22,382 | - |
| 반복서열 비율 | 61.5% | - |
| 논문 | Van Hoeck et al. (2015) | Ernst (2016) |
| 저널 | Biotechnol Biofuels | - |
| 비고 | Draft assembly | PacBio improved |

### 2.4 Lemna minuta
| 항목 | 값 |
|------|-----|
| 게놈 크기 | ~360 Mb |
| 염색체 수 (2n) | 42 (21 chromosomes resolved) |
| 논문 | Abramson et al. (2022) |
| 저널 | iScience |
| 비고 | 침입성 메커니즘 연구 |

### 2.5 Wolffia australiana
| 항목 | 값 |
|------|-----|
| 게놈 크기 | ~432 Mb |
| 염색체 수 (2n) | 40 |
| 비고 | 가장 작은 현화식물 중 하나 |

---

## 3. 전체 36종 염색체 수 및 게놈 크기

Hoang et al. (2022), Plants 11(20):2674

| 속 | 종 | 2n | 게놈 크기 (Mb) | 서열화 |
|----|----|----|---------------|--------|
| Spirodela | S. polyrhiza | 40 | 160 | O |
| Spirodela | S. intermedia | 36 | 160 | O |
| Landoltia | L. punctata | 46 | 360 | X |
| Lemna | L. minor | 42 | 481 | O |
| Lemna | L. minuta | 42 | 360 | O |
| Lemna | L. aequinoctialis | 42 | 450 | X |
| Lemna | L. perpusilla | 40 | 519 | X |
| Lemna | L. tenera | 40 | 526 | X |
| Lemna | L. turionifera | 40 | 475 | X |
| Lemna | L. japonica | 63 | >600 | X |
| Lemna | L. gibba | - | 450 | Draft |
| Wolffiella | W. caudata | 42 | 772 | X |
| Wolffiella | W. denticulata | 42 | 717 | X |
| Wolffiella | W. neotropica | 40 | 599 | X |
| Wolffiella | W. oblonga | 42 | 755 | X |
| Wolffiella | W. repanda | 40 | 1,190 | X |
| Wolffiella | W. welwitschii | 40 | 780 | X |
| Wolffiella | W. rotunda | 82 | 1,914 | X |
| Wolffia | W. australiana | 40 | 432 | O |
| Wolffia | W. arrhiza | 60 | 2,203 | X |
| Wolffia | W. cylindracea | 60 | 2,144 | X |
| Wolffia | W. elongata | 40 | 936 | X |
| Wolffia | W. neglecta | 40 | 1,354 | X |
| Wolffia | W. globosa | 40 | ~400 | X |

> 참고: 전체 36종 중 주요 종만 기재. 게놈 크기는 약 14배 차이 (160 Mb ~ 2,203 Mb)

---

## 4. 주요 논문 목록

### 게놈 서열 분석
1. **Wang et al. (2014)** - The Spirodela polyrhiza genome reveals evolution of gene structures and adaptive evolution
   - Nature Communications 5:3311
   - DOI: 10.1038/ncomms4311

2. **Van Hoeck et al. (2015)** - The first draft genome of the aquatic model plant Lemna minor
   - Biotechnology for Biofuels 8:188
   - DOI: 10.1186/s13068-015-0381-1

3. **Michael et al. (2017)** - Comprehensive definition of genome features in Spirodela polyrhiza
   - PNAS
   - DOI: 10.1073/pnas.1614407114

4. **Hoang et al. (2020)** - Chromosome-scale genome assembly for Spirodela intermedia
   - Scientific Reports 10:19230
   - DOI: 10.1038/s41598-020-75728-9

5. **Abramson et al. (2022)** - The genome and preliminary single-nuclei transcriptome of Lemna minuta
   - iScience 25(3):103936

### 종합 리뷰
6. **An et al. (2018)** - Genomes and Transcriptomes of Duckweeds
   - Frontiers in Chemistry 6:230
   - DOI: 10.3389/fchem.2018.00230

7. **Acosta et al. (2021)** - Return of the Lemnaceae: duckweed as a model plant system in the genomics and postgenomics era
   - The Plant Cell 33(10):3207-3234
   - DOI: 10.1093/plcell/koab189

8. **Hoang et al. (2022)** - Chromosome Numbers and Genome Sizes of All 36 Duckweed Species
   - Plants 11(20):2674
   - DOI: 10.3390/plants11202674

### 엽록체 게놈
9. **Mardanov et al. (2008)** - Complete chloroplast genomes of Lemna minor and Spirodela polyrhiza
   - PMC: PMC3170387

---

## 5. 외부 데이터베이스 링크

| DB | URL | 내용 |
|----|-----|------|
| NCBI GenBank | ncbi.nlm.nih.gov | 유전체 서열, SRA 데이터 |
| Phytozome (JGI) | phytozome-next.jgi.doe.gov | Spirodela polyrhiza 유전체 |
| Ensembl Plants | plants.ensembl.org | 식물 유전체 브라우저 |
| The Charm of Duckweed | thecharmofduckweed.org | 개구리밥 커뮤니티 |
| DDBJ | ddbj.nig.ac.jp | 일본 DNA 데이터뱅크 |

---

## 6. 전사체(Transcriptome) 데이터

서열 분석된 전사체:
- **Spirodela polyrhiza**: ABA 처리, 방사선, 중금속, 기아 조건
- **Landoltia punctata**: 다양한 스트레스 처리
- **Lemna minor**: 스트레스 생리학 연구
- **Lemna aequinoctialis**: 기본 전사체

> 미서열 전사체: Wolffiella, Wolffia 대부분 종

---

## 7. 웹 페이지 표시 계획

### 탭 1: 종별 유전체 정보
- 36종 전체 테이블 (속, 종, 2n, 게놈 크기, 서열화 여부)
- 게놈 크기 비교 bar chart (속별 색상 구분)
- 서열화된 종은 클릭 시 상세 정보 확장

### 탭 2: 주요 논문
- 논문 카드 목록 (제목, 저자, 저널, 연도)
- DOI 링크 + PubMed 링크
- 카테고리 필터 (게놈/전사체/리뷰/엽록체)

### 탭 3: 외부 DB 링크
- 로고 + 설명 카드 형태
- 직접 링크 버튼
