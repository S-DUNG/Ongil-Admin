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

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest<DashboardResponse>('/manage/dashboard')
      .then(setDashboard)
      .catch(() => setError('대시보드 데이터를 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [])

  // TODO: smartPadStatusCounts 항목의 status 값이 실제로 스마트패드가 등록된 뒤에
  // 어떤 문자열로 오는지(예: '정상' 또는 'NORMAL') 확인 후 아래 매칭 조건을 맞춰주세요.
  const normalCount =
    dashboard?.smartPadStatusCounts.find(
      (item) => item.status === '정상' || item.status === 'NORMAL',
    )?.count ?? 0
  const issueCount = dashboard ? dashboard.totalSmartPadCount - normalCount : 0

  const stats = [
    { label: '전체 정류장', value: dashboard?.totalStationCount, Icon: PinIcon, valueClassName: 'text-slate-900' },
    { label: '전체 스마트패드', value: dashboard?.totalSmartPadCount, Icon: TabletIcon, valueClassName: 'text-slate-900' },
    { label: '정상 작동 (NORMAL)', value: dashboard ? normalCount : undefined, Icon: CheckCircleIcon, valueClassName: 'text-emerald-600' },
    { label: '점검/고장', value: dashboard ? issueCount : undefined, Icon: WarningIcon, valueClassName: 'text-red-500' },
  ]
  const recentStations = dashboard?.recentStations ?? []
  const recentPads = dashboard?.recentSmartPads ?? []

  return (
    <>
      {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <stat.Icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className={`mt-2 text-2xl font-bold ${stat.valueClassName}`}>
              {isLoading ? '-' : stat.value}
            </p>
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
              {isLoading && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    불러오는 중...
                  </td>
                </tr>
              )}

              {!isLoading && recentStations.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    등록된 정류장이 없습니다.
                  </td>
                </tr>
              )}

              {!isLoading && recentStations.map((row) => (
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
              {isLoading && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    불러오는 중...
                  </td>
                </tr>
              )}

              {!isLoading && recentPads.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    등록된 스마트패드가 없습니다.
                  </td>
                </tr>
              )}

              {!isLoading && recentPads.map((row) => (
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
