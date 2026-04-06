# TODO

## Done
- [x] Admin page redirect (`/admin` → `/admin/manage`)
- [x] Firestore undefined error fix (`address: undefined`)
- [x] Cloud Function bgzip binary → pysam Python API
- [x] Storage CORS configuration
- [x] Genome upload progress bar
- [x] AdminManage edit button (Firestore integration)
- [x] JBrowse 2 genome browser
- [x] Cloud Function genome indexing (pysam Python API)
- [x] Cloud Function deploy & verify (Wolffia australiana indexed)
- [x] Header Admin menu (auth-gated)
- [x] Reindex HTTP callable function + AdminManage button
- [x] genomeBrowserConfigs refactoring → Firestore `genomes` collection
- [x] MapPage: dummy data → Firestore `getAccessions()`
- [x] All UI text: Korean → English
- [x] Remove all form placeholders

## Next
- [ ] **Accessions page uses dummy data** — Accessions list page and AccessionDetail still reference `dummyAccessions` instead of Firestore. Need to switch to `getAccessions()`/`getAccession()` so they match admin data. This also fixes the Map page "Accession not found" issue (detail page can't find Firestore IDs in dummy data).
- [ ] **Admin edit modal: add map picker** — when editing an accession, include a Leaflet map to pick/update lat/lng (like AdminUpload already has)
- [ ] Upload remaining species genome data (NCBI download)
- [ ] Genome browser live test (Wolffia australiana)
