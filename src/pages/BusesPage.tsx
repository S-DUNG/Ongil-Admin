import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

type BusStatus = '운행중' | '운행종료' | '점검'

// TODO: 실제 응답 필드명이 다르면 여기 타입과 bus.xxx로 읽는 부분들을 맞춰서 고쳐야 합니다.
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

// 버스 데이터는 TAGO/오디세이 외부 API에서 가져오는 값이라 관리자가 등록·수정·삭제할
// 수 없습니다. 그래서 이 페이지는 조회 전용이고, 팀 논의에 따라 등록/수정/삭제 UI는
// 두지 않습니다.
function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBuses() {
      setError('')
      try {
        // TODO: 응답이 { data: [...] } 형태로 감싸져 있으면 apiRequest<{ data: Bus[] }>로 바꾸고 data.data를 쓰세요.
        const data = await apiRequest<Bus[]>('/manage/bus-data')
        setBuses(data)
      } catch {
        setError('버스 데이터를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBuses()
  }, [])

  return (
    <div>
      <p className="text-sm text-slate-500">등록된 버스 {buses.length}개</p>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

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
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  불러오는 중...
                </td>
              </tr>
            )}

            {!isLoading && buses.map((bus) => (
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

            {!isLoading && buses.length === 0 && (
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
