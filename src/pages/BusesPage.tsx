type BusStatus = '운행중' | '운행종료' | '점검'

type Bus = {
  id: string
  busNumber: string
  destination: string
  lowFloor: boolean
  status: BusStatus
  createdAt: string
}

const STATUS_STYLE: Record<BusStatus, string> = {
  운행중: 'bg-emerald-50 text-emerald-600',
  운행종료: 'bg-slate-100 text-slate-500',
  점검: 'bg-amber-50 text-amber-600',
}

// 팀 논의에 따라 버스 데이터 관리 기능은 없어졌습니다(백엔드 API도 없습니다).
// 메뉴/페이지는 남겨두기로 해서, 빈 목록만 보여주는 화면으로 둡니다.
const buses: Bus[] = []

function BusesPage() {
  return (
    <div>
      <p className="text-sm text-slate-500">등록된 버스 {buses.length}개</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">버스 번호</th>
              <th className="px-4 py-3 font-medium">방면</th>
              <th className="px-4 py-3 font-medium">저상버스</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">등록일</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500">{bus.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{bus.busNumber}</td>
                <td className="px-4 py-3 text-slate-500">{bus.destination}</td>
                <td className="px-4 py-3">
                  {bus.lowFloor ? (
                    <span className="text-emerald-600">저상</span>
                  ) : (
                    <span className="text-slate-400">일반</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[bus.status]}`}
                  >
                    {bus.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{bus.createdAt}</td>
              </tr>
            ))}

            {buses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  등록된 버스가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BusesPage
