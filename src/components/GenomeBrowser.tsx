import '@fontsource/roboto';
import { useMemo } from 'react';
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view';

interface GenomeBrowserProps {
  assemblyName: string;
  fastaUrl: string;
  faiUrl: string;
  gziUrl: string;
  gffUrl: string;
  gffIndexUrl: string;
  initialLocation?: string;
}

export default function GenomeBrowser({
  assemblyName,
  fastaUrl,
  faiUrl,
  gziUrl,
  gffUrl,
  gffIndexUrl,
  initialLocation,
}: GenomeBrowserProps) {
  const state = useMemo(
    () =>
      createViewState({
        assembly: {
          name: assemblyName,
          sequence: {
            type: 'ReferenceSequenceTrack',
            trackId: `${assemblyName}-refseq`,
            adapter: {
              type: 'BgzipFastaAdapter',
              fastaLocation: { uri: fastaUrl },
              faiLocation: { uri: faiUrl },
              gziLocation: { uri: gziUrl },
            },
          },
        },
        tracks: [
          {
            type: 'FeatureTrack',
            trackId: `${assemblyName}-genes`,
            name: 'Gene Annotations',
            assemblyNames: [assemblyName],
            adapter: {
              type: 'Gff3TabixAdapter',
              gffGzLocation: { uri: gffUrl },
              index: { location: { uri: gffIndexUrl } },
            },
          },
        ],
        defaultSession: {
          name: 'Default Session',
          view: {
            id: 'linearGenomeView',
            type: 'LinearGenomeView',
            tracks: [
              {
                type: 'ReferenceSequenceTrack',
                configuration: `${assemblyName}-refseq`,
                displays: [
                  {
                    type: 'LinearReferenceSequenceDisplay',
                    configuration: `${assemblyName}-refseq-LinearReferenceSequenceDisplay`,
                  },
                ],
              },
              {
                type: 'FeatureTrack',
                configuration: `${assemblyName}-genes`,
                displays: [
                  {
                    type: 'LinearBasicDisplay',
                    configuration: `${assemblyName}-genes-LinearBasicDisplay`,
                  },
                ],
              },
            ],
          },
        },
        location: initialLocation,
      }),
    [assemblyName, fastaUrl, faiUrl, gziUrl, gffUrl, gffIndexUrl, initialLocation],
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}
