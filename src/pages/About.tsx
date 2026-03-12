import { LuLeaf, LuUsers, LuMail, LuGlobe } from 'react-icons/lu';

const teamMembers = [
  { name: '연구책임자', role: 'PI / 유전체학', placeholder: true },
  { name: '연구원 1', role: '생물정보학', placeholder: true },
  { name: '연구원 2', role: '분자생물학', placeholder: true },
  { name: '연구원 3', role: '웹 개발', placeholder: true },
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
          개구리밥(Duckweed) 유전체 정보를 통합적으로 관리하고 공유하기 위한 웹 플랫폼입니다.
          개구리밥과(Lemnaceae)는 5속 36종으로 구성된 수생식물로, 빠른 성장 속도와 높은 단백질
          함량으로 바이오에너지 및 식량 자원으로 주목받고 있습니다.
        </p>
      </div>

      {/* About sections */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">프로젝트 목표</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              국내 개구리밥 품종/계통의 유전체 데이터 수집 및 공유
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              수집지 GPS 정보를 활용한 지리적 분포 시각화
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              유전체 서열 데이터(FASTA, VCF, GFF3) 공개 다운로드 제공
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-duckweed-500 mt-1.5 shrink-0" />
              기존 연구 논문 및 외부 데이터베이스 연계
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">데이터 현황</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">5</p>
              <p className="text-xs text-gray-500 mt-1">속(Genus)</p>
            </div>
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">36</p>
              <p className="text-xs text-gray-500 mt-1">종(Species)</p>
            </div>
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">6+</p>
              <p className="text-xs text-gray-500 mt-1">서열화 완료</p>
            </div>
            <div className="bg-duckweed-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-duckweed-700">9+</p>
              <p className="text-xs text-gray-500 mt-1">주요 논문</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <LuUsers className="text-xl text-duckweed-600" />
          <h2 className="text-xl font-bold text-gray-900">연구팀</h2>
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
        <p className="text-xs text-gray-400 mt-3 text-center">* 연구팀 정보는 추후 업데이트 예정입니다.</p>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">연락처</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-3">
            <LuMail className="text-lg text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">이메일</p>
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
