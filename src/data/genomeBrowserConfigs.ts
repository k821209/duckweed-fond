export interface GenomeBrowserConfig {
  species: string;
  displayName: string;
  genus: string;
  genomeSizeMb: number;
  geneCount: number | null;
  chromosomeCount: number;
  description: string;
  reference: string;
  journal: string;
  ncbiAccession: string;
  ncbiUrl: string;
  doiUrl: string;
  fastaUrl: string;
  faiUrl: string;
  gziUrl: string;
  gffUrl: string;
  gffIndexUrl: string;
  defaultLocation: string;
}

// Firebase Storage base URL - update after uploading files
const STORAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/duckweed-fond.firebasestorage.app/o/genome-browser';

function storageUrl(species: string, file: string): string {
  return `${STORAGE_BASE}%2F${species}%2F${encodeURIComponent(file)}?alt=media`;
}

export const genomeBrowserConfigs: GenomeBrowserConfig[] = [
  {
    species: 'spirodela-polyrhiza-7498',
    displayName: 'Spirodela polyrhiza 7498',
    genus: 'Spirodela',
    genomeSizeMb: 158,
    geneCount: 19623,
    chromosomeCount: 20,
    description: '최초 서열 분석된 개구리밥. 가장 작은 단자엽 게놈 중 하나.',
    reference: 'Wang et al. (2014)',
    journal: 'Nature Communications',
    ncbiAccession: 'GCA_000504445',
    ncbiUrl: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_000504445.1/',
    doiUrl: 'https://doi.org/10.1038/ncomms4311',
    fastaUrl: storageUrl('spirodela-polyrhiza-7498', 'genome.fa.gz'),
    faiUrl: storageUrl('spirodela-polyrhiza-7498', 'genome.fa.gz.fai'),
    gziUrl: storageUrl('spirodela-polyrhiza-7498', 'genome.fa.gz.gzi'),
    gffUrl: storageUrl('spirodela-polyrhiza-7498', 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl('spirodela-polyrhiza-7498', 'genes.sorted.gff3.gz.tbi'),
    defaultLocation: 'pseudo0:1..100000',
  },
  {
    species: 'spirodela-polyrhiza-9509',
    displayName: 'Spirodela polyrhiza 9509 v3',
    genus: 'Spirodela',
    genomeSizeMb: 160,
    geneCount: 18507,
    chromosomeCount: 20,
    description: 'Chromosome-scale assembly. 가장 완성도 높은 개구리밥 유전체.',
    reference: 'Michael et al. (2017)',
    journal: 'PNAS',
    ncbiAccession: 'GCA_001981405',
    ncbiUrl: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_001981405.1/',
    doiUrl: 'https://doi.org/10.1073/pnas.1614407114',
    fastaUrl: storageUrl('spirodela-polyrhiza-9509', 'genome.fa.gz'),
    faiUrl: storageUrl('spirodela-polyrhiza-9509', 'genome.fa.gz.fai'),
    gziUrl: storageUrl('spirodela-polyrhiza-9509', 'genome.fa.gz.gzi'),
    gffUrl: storageUrl('spirodela-polyrhiza-9509', 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl('spirodela-polyrhiza-9509', 'genes.sorted.gff3.gz.tbi'),
    defaultLocation: 'Chr01:1..100000',
  },
  {
    species: 'spirodela-intermedia',
    displayName: 'Spirodela intermedia',
    genus: 'Spirodela',
    genomeSizeMb: 160,
    geneCount: null,
    chromosomeCount: 18,
    description: 'PacBio + ONT 기반 chromosome-scale assembly.',
    reference: 'Hoang et al. (2020)',
    journal: 'Scientific Reports',
    ncbiAccession: 'GCA_900492545',
    ncbiUrl: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_900492545.1/',
    doiUrl: 'https://doi.org/10.1038/s41598-020-75728-9',
    fastaUrl: storageUrl('spirodela-intermedia', 'genome.fa.gz'),
    faiUrl: storageUrl('spirodela-intermedia', 'genome.fa.gz.fai'),
    gziUrl: storageUrl('spirodela-intermedia', 'genome.fa.gz.gzi'),
    gffUrl: storageUrl('spirodela-intermedia', 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl('spirodela-intermedia', 'genes.sorted.gff3.gz.tbi'),
    defaultLocation: 'Chr1:1..100000',
  },
  {
    species: 'lemna-minor',
    displayName: 'Lemna minor 5500',
    genus: 'Lemna',
    genomeSizeMb: 481,
    geneCount: 22382,
    chromosomeCount: 21,
    description: '좀개구리밥 draft assembly. 반복서열 61.5%.',
    reference: 'Van Hoeck et al. (2015)',
    journal: 'Biotechnology for Biofuels',
    ncbiAccession: 'GCA_001185985',
    ncbiUrl: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_001185985.1/',
    doiUrl: 'https://doi.org/10.1186/s13068-015-0381-1',
    fastaUrl: storageUrl('lemna-minor', 'genome.fa.gz'),
    faiUrl: storageUrl('lemna-minor', 'genome.fa.gz.fai'),
    gziUrl: storageUrl('lemna-minor', 'genome.fa.gz.gzi'),
    gffUrl: storageUrl('lemna-minor', 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl('lemna-minor', 'genes.sorted.gff3.gz.tbi'),
    defaultLocation: 'scaffold_1:1..100000',
  },
  {
    species: 'lemna-minuta',
    displayName: 'Lemna minuta',
    genus: 'Lemna',
    genomeSizeMb: 360,
    geneCount: null,
    chromosomeCount: 21,
    description: '침입성 개구리밥. 21개 염색체 resolved.',
    reference: 'Abramson et al. (2022)',
    journal: 'iScience',
    ncbiAccession: 'GCA_022379635',
    ncbiUrl: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_022379635.1/',
    doiUrl: 'https://doi.org/10.1016/j.isci.2022.103936',
    fastaUrl: storageUrl('lemna-minuta', 'genome.fa.gz'),
    faiUrl: storageUrl('lemna-minuta', 'genome.fa.gz.fai'),
    gziUrl: storageUrl('lemna-minuta', 'genome.fa.gz.gzi'),
    gffUrl: storageUrl('lemna-minuta', 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl('lemna-minuta', 'genes.sorted.gff3.gz.tbi'),
    defaultLocation: 'Chr1:1..100000',
  },
  {
    species: 'wolffia-australiana',
    displayName: 'Wolffia australiana',
    genus: 'Wolffia',
    genomeSizeMb: 357,
    geneCount: 15000,
    chromosomeCount: 20,
    description: '가장 작은 현화식물 중 하나. 빠른 성장 속도.',
    reference: 'Michael et al. (2020)',
    journal: 'Communications Biology',
    ncbiAccession: 'GCA_012280075',
    ncbiUrl: 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_012280075.1/',
    doiUrl: 'https://doi.org/10.1038/s42003-020-01329-3',
    fastaUrl: storageUrl('wolffia-australiana', 'genome.fa.gz'),
    faiUrl: storageUrl('wolffia-australiana', 'genome.fa.gz.fai'),
    gziUrl: storageUrl('wolffia-australiana', 'genome.fa.gz.gzi'),
    gffUrl: storageUrl('wolffia-australiana', 'genes.sorted.gff3.gz'),
    gffIndexUrl: storageUrl('wolffia-australiana', 'genes.sorted.gff3.gz.tbi'),
    defaultLocation: 'Chr1:1..100000',
  },
];

export const genusColors: Record<string, string> = {
  Spirodela: '#22c55e',
  Lemna: '#f59e0b',
  Wolffia: '#ef4444',
};
