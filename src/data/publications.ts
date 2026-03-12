export interface Publication {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi: string;
  category: 'genome' | 'review' | 'chloroplast';
}

export const publications: Publication[] = [
  {
    id: 'pub-1',
    authors: 'Wang et al.',
    year: 2014,
    title: 'The Spirodela polyrhiza genome reveals evolution of gene structures and adaptive evolution',
    journal: 'Nature Communications 5:3311',
    doi: '10.1038/ncomms4311',
    category: 'genome',
  },
  {
    id: 'pub-2',
    authors: 'Van Hoeck et al.',
    year: 2015,
    title: 'The first draft genome of the aquatic model plant Lemna minor',
    journal: 'Biotechnology for Biofuels 8:188',
    doi: '10.1186/s13068-015-0381-1',
    category: 'genome',
  },
  {
    id: 'pub-3',
    authors: 'Michael et al.',
    year: 2017,
    title: 'Comprehensive definition of genome features in Spirodela polyrhiza',
    journal: 'PNAS',
    doi: '10.1073/pnas.1614407114',
    category: 'genome',
  },
  {
    id: 'pub-4',
    authors: 'An et al.',
    year: 2018,
    title: 'Genomes and Transcriptomes of Duckweeds',
    journal: 'Frontiers in Chemistry 6:230',
    doi: '10.3389/fchem.2018.00230',
    category: 'review',
  },
  {
    id: 'pub-5',
    authors: 'Hoang et al.',
    year: 2020,
    title: 'Chromosome-scale genome assembly for Spirodela intermedia',
    journal: 'Scientific Reports 10:19230',
    doi: '10.1038/s41598-020-75728-9',
    category: 'genome',
  },
  {
    id: 'pub-6',
    authors: 'Acosta et al.',
    year: 2021,
    title: 'Return of the Lemnaceae: duckweed as a model plant system in the genomics and postgenomics era',
    journal: 'The Plant Cell 33(10):3207-3234',
    doi: '10.1093/plcell/koab189',
    category: 'review',
  },
  {
    id: 'pub-7',
    authors: 'Abramson et al.',
    year: 2022,
    title: 'The genome and preliminary single-nuclei transcriptome of Lemna minuta',
    journal: 'iScience 25(3):103936',
    doi: '10.1016/j.isci.2022.103936',
    category: 'genome',
  },
  {
    id: 'pub-8',
    authors: 'Hoang et al.',
    year: 2022,
    title: 'Chromosome Numbers and Genome Sizes of All 36 Duckweed Species',
    journal: 'Plants 11(20):2674',
    doi: '10.3390/plants11202674',
    category: 'review',
  },
  {
    id: 'pub-9',
    authors: 'Mardanov et al.',
    year: 2008,
    title: 'Complete chloroplast genomes of Lemna minor and Spirodela polyrhiza',
    journal: 'PMC: PMC3170387',
    doi: '',
    category: 'chloroplast',
  },
];

export const externalDatabases = [
  {
    name: 'NCBI GenBank',
    url: 'https://www.ncbi.nlm.nih.gov/',
    description: '유전체 서열, SRA 데이터',
  },
  {
    name: 'Phytozome (JGI)',
    url: 'https://phytozome-next.jgi.doe.gov/',
    description: 'Spirodela polyrhiza 유전체',
  },
  {
    name: 'Ensembl Plants',
    url: 'https://plants.ensembl.org/',
    description: '식물 유전체 브라우저',
  },
  {
    name: 'The Charm of Duckweed',
    url: 'http://www.thecharmofduckweed.org/',
    description: '개구리밥 커뮤니티',
  },
  {
    name: 'DDBJ',
    url: 'https://www.ddbj.nig.ac.jp/',
    description: '일본 DNA 데이터뱅크',
  },
];
