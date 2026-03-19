# TODO

## 긴급
- [ ] Admin 페이지 접속 불가 - Firestore 권한 오류 (`Missing or insufficient permissions`)
  - firestore.rules 배포 완료했으나 여전히 안 됨
  - 원인 조사 필요: Firestore 인덱스 미생성, Auth 상태, 또는 rules 문법 문제 가능성
  - 현재 rules: accessions 컬렉션 공개 읽기 + 인증 쓰기

## 진행 중
- [x] 게놈 업로드 프로그레스 바 추가
- [x] AdminManage 수정 버튼 (Firestore 연동)
- [x] JBrowse 2 게놈 브라우저 구현
- [x] Cloud Function 게놈 파일 인덱싱 (Python + pysam)

## 다음 작업
- [ ] 게놈 브라우저에 실제 데이터 업로드 테스트 (NCBI에서 좀개구리밥 파일 다운로드)
- [ ] Cloud Function 배포 및 동작 확인
