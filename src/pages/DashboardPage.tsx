import { useEffect, useState } from 'react'
import { PinIcon, TabletIcon, CheckCircleIcon, WarningIcon } from '../components/icons'
import { apiRequest } from '../api/client'

type DashboardResponse = {
  totalStationCount: number
  totalSmartPadCount: number
  smartPadStatusCounts: { status: string; count: number }[]
  recentStations: { id: number; name: string; createdAt: string }[] | null
  recentSmartPads: { id: number; serial: string; createdAt: string }[]
}

// 백엔드 연동 전이라 화면 확인용 mock 데이터입니다.
const STATS = [
  { label: '전체 정류장', value: 142, Icon: PinIcon, valueClassName: 'text-slate-900' },
  { label: '전체 스마트패드', value: 128, Icon: TabletIcon, valueClassName: 'text-slate-900' },
  { label: '정상 작동 (NORMAL)', value: 120, Icon: CheckCircleIcon, valueClassName: 'text-emerald-600' },
  { label: '점검/고장', value: 8, Icon: WarningIcon, valueClassName: 'text-red-500' },
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

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)

  useEffect(() => {
    apiRequest<DashboardResponse>('/manage/dashboard')
      .then(setDashboard)
      .catch(() => setDashboard(null)) // 실패하면 아래 mock 값을 그대로 보여줍니다.
  }, [])

  // TODO: smartPadStatusCounts 항목의 status 값이 실제로 스마트패드가 등록된 뒤에
  // 어떤 문자열로 오는지(예: '정상' 또는 'NORMAL') 확인 후 아래 매칭 조건을 맞춰주세요.
  const normalCount =
    dashboard?.smartPadStatusCounts.find(
      (item) => item.status === '정상' || item.status === 'NORMAL',
    )?.count ?? 0
  const issueCount = dashboard ? dashboard.totalSmartPadCount - normalCount : 0

  const stats = dashboard
    ? [
        { label: '전체 정류장', value: dashboard.totalStationCount, Icon: PinIcon, valueClassName: 'text-slate-900' },
        { label: '전체 스마트패드', value: dashboard.totalSmartPadCount, Icon: TabletIcon, valueClassName: 'text-slate-900' },
        { label: '정상 작동 (NORMAL)', value: normalCount, Icon: CheckCircleIcon, valueClassName: 'text-emerald-600' },
        { label: '점검/고장', value: issueCount, Icon: WarningIcon, valueClassName: 'text-red-500' },
      ]
    : STATS
  const recentStations = dashboard ? (dashboard.recentStations ?? []) : RECENT_STATIONS
  const recentPads = dashboard ? dashboard.recentSmartPads : RECENT_PADS

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <stat.Icon className="h-4 w-4 text-slate-400" />
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
              {recentStations.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    등록된 정류장이 없습니다.
                  </td>
                </tr>
              )}

              {recentStations.map((row) => (
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
              {recentPads.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    등록된 스마트패드가 없습니다.
                  </td>
                </tr>
              )}

              {recentPads.map((row) => (
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
    </>
  )
}

export default DashboardPage
