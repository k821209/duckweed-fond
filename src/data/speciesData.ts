export interface SpeciesInfo {
  genus: string;
  species: string;
  chromosome2n: number | null;
  genomeSizeMb: number;
  sequenced: 'O' | 'X' | 'Draft';
}

export const speciesData: SpeciesInfo[] = [
  { genus: 'Spirodela', species: 'S. polyrhiza', chromosome2n: 40, genomeSizeMb: 160, sequenced: 'O' },
  { genus: 'Spirodela', species: 'S. intermedia', chromosome2n: 36, genomeSizeMb: 160, sequenced: 'O' },
  { genus: 'Landoltia', species: 'L. punctata', chromosome2n: 46, genomeSizeMb: 360, sequenced: 'X' },
  { genus: 'Lemna', species: 'L. minor', chromosome2n: 42, genomeSizeMb: 481, sequenced: 'O' },
  { genus: 'Lemna', species: 'L. minuta', chromosome2n: 42, genomeSizeMb: 360, sequenced: 'O' },
  { genus: 'Lemna', species: 'L. aequinoctialis', chromosome2n: 42, genomeSizeMb: 450, sequenced: 'X' },
  { genus: 'Lemna', species: 'L. perpusilla', chromosome2n: 40, genomeSizeMb: 519, sequenced: 'X' },
  { genus: 'Lemna', species: 'L. tenera', chromosome2n: 40, genomeSizeMb: 526, sequenced: 'X' },
  { genus: 'Lemna', species: 'L. turionifera', chromosome2n: 40, genomeSizeMb: 475, sequenced: 'X' },
  { genus: 'Lemna', species: 'L. japonica', chromosome2n: 63, genomeSizeMb: 600, sequenced: 'X' },
  { genus: 'Lemna', species: 'L. gibba', chromosome2n: null, genomeSizeMb: 450, sequenced: 'Draft' },
  { genus: 'Wolffiella', species: 'W. caudata', chromosome2n: 42, genomeSizeMb: 772, sequenced: 'X' },
  { genus: 'Wolffiella', species: 'W. denticulata', chromosome2n: 42, genomeSizeMb: 717, sequenced: 'X' },
  { genus: 'Wolffiella', species: 'W. neotropica', chromosome2n: 40, genomeSizeMb: 599, sequenced: 'X' },
  { genus: 'Wolffiella', species: 'W. oblonga', chromosome2n: 42, genomeSizeMb: 755, sequenced: 'X' },
  { genus: 'Wolffiella', species: 'W. repanda', chromosome2n: 40, genomeSizeMb: 1190, sequenced: 'X' },
  { genus: 'Wolffiella', species: 'W. welwitschii', chromosome2n: 40, genomeSizeMb: 780, sequenced: 'X' },
  { genus: 'Wolffiella', species: 'W. rotunda', chromosome2n: 82, genomeSizeMb: 1914, sequenced: 'X' },
  { genus: 'Wolffia', species: 'W. australiana', chromosome2n: 40, genomeSizeMb: 432, sequenced: 'O' },
  { genus: 'Wolffia', species: 'W. arrhiza', chromosome2n: 60, genomeSizeMb: 2203, sequenced: 'X' },
  { genus: 'Wolffia', species: 'W. cylindracea', chromosome2n: 60, genomeSizeMb: 2144, sequenced: 'X' },
  { genus: 'Wolffia', species: 'W. elongata', chromosome2n: 40, genomeSizeMb: 936, sequenced: 'X' },
  { genus: 'Wolffia', species: 'W. neglecta', chromosome2n: 40, genomeSizeMb: 1354, sequenced: 'X' },
  { genus: 'Wolffia', species: 'W. globosa', chromosome2n: 40, genomeSizeMb: 400, sequenced: 'X' },
];

export const genusColors: Record<string, string> = {
  Spirodela: '#22c55e',
  Landoltia: '#0ea5e9',
  Lemna: '#f59e0b',
  Wolffiella: '#8b5cf6',
  Wolffia: '#ef4444',
};
