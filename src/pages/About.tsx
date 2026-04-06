import { LuLeaf, LuUsers, LuMail, LuGlobe } from 'react-icons/lu';

const teamMembers = [
  { name: 'Principal Investigator', role: 'PI / Genomics', placeholder: true },
  { name: 'Researcher 1', role: 'Bioinformatics', placeholder: true },
  { name: 'Researcher 2', role: 'Molecular Biology', placeholder: true },
  { name: 'Researcher 3', role: 'Web Development', placeholder: true },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-duckweed-50 to-green-50 rounded-2xl p-8 md:p-12 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-duckweed-100 flex items-center justify-center">
            <LuLeaf className="text-2xl text-duckweed-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Duckweed Genomics Database</h1>
        </div>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          A web platform for the integrated management and sharing of duckweed genomic information.
          The Lemnaceae family consists of 36 species across 5 genera of aquatic plants, attracting
          attention as a bioenergy and food resource due to their rapid growth rate and high protein content.
        </p>
      </div>

      {/* About sections */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Project Goals</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              Collection and sharing of genomic data for duckweed accessions
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              Geographic distribution visualization using GPS data from collection sites
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              Public download of genomic sequence data (FASTA, VCF, GFF3)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              Integration with existing research publications and external databases
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Data Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">5</p>
              <p className="text-xs text-gray-500 mt-1">Genera</p>
            </div>
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">36</p>
              <p className="text-xs text-gray-500 mt-1">Species</p>
            </div>
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">6+</p>
              <p className="text-xs text-gray-500 mt-1">Sequenced</p>
            </div>
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">9+</p>
              <p className="text-xs text-gray-500 mt-1">Key Publications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <LuUsers className="text-xl text-duckweed-600" />
          <h2 className="text-xl font-bold text-gray-900">Research Team</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center text-gray-400 text-2xl">
                {m.placeholder ? '?' : m.name[0]}
              </div>
              <p className="font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-500 mt-1">{m.role}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">* Team information will be updated later.</p>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-3">
            <LuMail className="text-lg text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-500">contact@duckweed-genomics.org</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuGlobe className="text-lg text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">GitHub</p>
              <p className="text-sm text-gray-500">github.com/duckweed-genomics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
