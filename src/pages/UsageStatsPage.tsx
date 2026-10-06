import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

type Period = '오늘' | '최근 7일' | '최근 30일'

const PERIODS: Period[] = ['오늘', '최근 7일', '최근 30일']

const PERIOD_PARAM: Record<Period, string> = {
  오늘: 'TODAY',
  '최근 7일': 'WEEK',
  '최근 30일': 'MONTH',
}

type UsageResponse = {
  totalCount: number
  dailyAverage: number
  mostUsedStation: string
  mostUsedTimeSlot: string
  hourlyUsage: { timeSlot: string; count: number }[]
  topStations: { stationName: string; count: number }[]
}

function UsageStatsPage() {
  const [period, setPeriod] = useState<Period>('오늘')
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 기간 변경 시 재조회
    setIsLoading(true)
    setError('')
    apiRequest<UsageResponse>(`/manage/usage-stats?period=${PERIOD_PARAM[period]}`)
      .then(setUsage)
      .catch(() => setError('이용 통계를 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [period])

  const hourly = usage?.hourlyUsage ?? []
  const stations = usage?.topStations ?? []
  const maxHourly = Math.max(1, ...hourly.map((item) => item.count))
  const maxStation = Math.max(1, ...stations.map((item) => item.count))

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPeriod(item)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              item === period
                ? 'bg-accent text-slate-900'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">총 이용 건수</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {isLoading ? '-' : (usage?.totalCount ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">일 평균 이용</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {isLoading ? '-' : (usage?.dailyAverage ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">최다 이용 정류장</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {isLoading ? '-' : (usage?.mostUsedStation ?? '-')}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">최다 이용 시간대</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {isLoading ? '-' : (usage?.mostUsedTimeSlot ?? '-')}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">시간대별 이용 현황</h2>
          <p className="mt-0.5 text-xs text-slate-400">시간대별 이용 건수입니다.</p>

          {isLoading && <p className="mt-6 text-center text-sm text-slate-400">불러오는 중...</p>}

          {!isLoading && hourly.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-400">이용 데이터가 없습니다.</p>
          )}

          {!isLoading && hourly.length > 0 && (
            <div className="mt-6 flex items-end gap-2">
              {hourly.map((item) => (
                <div key={item.timeSlot} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[11px] text-slate-500">{item.count}</span>
                  <div className="flex h-28 w-full items-end">
                    <div
                      className="w-full rounded-t bg-amber-500"
                      style={{ height: `${(item.count / maxHourly) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">{item.timeSlot}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">정류장별 이용 현황 Top 5</h2>
          <p className="mt-0.5 text-xs text-slate-400">이용 건수가 많은 순서입니다.</p>

          {isLoading && <p className="mt-6 text-center text-sm text-slate-400">불러오는 중...</p>}

          {!isLoading && stations.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-400">이용 데이터가 없습니다.</p>
          )}

          {!isLoading && stations.length > 0 && (
            <div className="mt-6 flex flex-col gap-3">
              {stations.map((item) => (
                <div key={item.stationName}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.stationName}</span>
                    <span className="text-slate-500">{item.count.toLocaleString()}건</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: `${(item.count / maxStation) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsageStatsPage