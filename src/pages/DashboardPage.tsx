import Sidebar from '../components/Sidebar'

// 백엔드 연동 전이라 화면 확인용 mock 데이터입니다.
const STATS = [
  { label: '전체 정류장', value: 142, icon: '🚏', valueClassName: 'text-slate-900' },
  { label: '전체 스마트패드', value: 128, icon: '📱', valueClassName: 'text-slate-900' },
  { label: '정상 작동 (NORMAL)', value: 120, icon: '✅', valueClassName: 'text-emerald-600' },
  { label: '점검/고장', value: 8, icon: '⚠️', valueClassName: 'text-red-500' },
]

const RECENT_STATIONS = [
  { id: 'ST-01', name: '광주송정역', createdAt: '2026-09-08 09:30' },
  { id: 'ST-02', name: '양동시장역', createdAt: '2026-09-08 09:15' },
  { id: 'ST-03', name: '송정역', createdAt: '2026-09-07 14:20' },
  { id: 'ST-04', name: '상무역', createdAt: '2026-09-07 11:45' },
  { id: 'ST-05', name: '금남로역', createdAt: '2026-09-06 16:30' },
]

const RECENT_PADS = [
  { id: 'PAD-01', serial: 'SN-2026-0092', createdAt: '2026-09-08 09:35' },
  { id: 'PAD-02', serial: 'SN-2026-0091', createdAt: '2026-09-08 08:50' },
  { id: 'PAD-03', serial: 'SN-2026-0090', createdAt: '2026-09-07 15:10' },
  { id: 'PAD-04', serial: 'SN-2026-0089', createdAt: '2026-09-07 13:25' },
  { id: 'PAD-05', serial: 'SN-2026-0088', createdAt: '2026-09-06 17:00' },
]

function DashboardPage({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active="운영 대시보드" />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <h1 className="text-lg font-bold text-slate-900">운영 대시보드</h1>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            <span>👤</span> 관리자
          </button>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <span>{stat.icon}</span>
                </div>
                <p className={`mt-2 text-2xl font-bold ${stat.valueClassName}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">최근 등록 정류장 Top 5</h2>
              <p className="mt-0.5 text-xs text-slate-400">최신 등록된 정류장 목록입니다.</p>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-400">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">정류장명</th>
                    <th className="pb-2 font-medium">생성일시</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_STATIONS.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="py-2 text-slate-500">{row.id}</td>
                      <td className="py-2 font-medium text-slate-800">{row.name}</td>
                      <td className="py-2 text-slate-400">{row.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">최근 등록 스마트패드 Top 5</h2>
              <p className="mt-0.5 text-xs text-slate-400">최신 등록된 스마트패드 목록입니다.</p>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-400">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">시리얼번호</th>
                    <th className="pb-2 font-medium">생성일시</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PADS.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="py-2 text-slate-500">{row.id}</td>
                      <td className="py-2 font-medium text-slate-800">{row.serial}</td>
                      <td className="py-2 text-slate-400">{row.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
