import { useState } from 'react'

type Period = '오늘' | '최근 7일' | '최근 30일'

const PERIODS: Period[] = ['오늘', '최근 7일', '최근 30일']

// 백엔드 연동 전이라 기간별로 다른 mock 데이터를 미리 넣어뒀습니다.
const SUMMARY: Record<Period, { total: number; dailyAvg: number; topStation: string; topHour: string }> = {
  오늘: { total: 486, dailyAvg: 486, topStation: '광주송정역', topHour: '18시' },
  '최근 7일': { total: 3214, dailyAvg: 459, topStation: '상무역', topHour: '18시' },
  '최근 30일': { total: 13850, dailyAvg: 462, topStation: '상무역', topHour: '08시' },
}

const HOURLY_USAGE: Record<Period, { hour: string; count: number }[]> = {
  오늘: [
    { hour: '06', count: 22 },
    { hour: '08', count: 68 },
    { hour: '10', count: 34 },
    { hour: '12', count: 41 },
    { hour: '14', count: 30 },
    { hour: '16', count: 45 },
    { hour: '18', count: 82 },
    { hour: '20', count: 39 },
    { hour: '22', count: 18 },
  ],
  '최근 7일': [
    { hour: '06', count: 150 },
    { hour: '08', count: 480 },
    { hour: '10', count: 230 },
    { hour: '12', count: 280 },
    { hour: '14', count: 210 },
    { hour: '16', count: 300 },
    { hour: '18', count: 560 },
    { hour: '20', count: 260 },
    { hour: '22', count: 120 },
  ],
  '최근 30일': [
    { hour: '06', count: 640 },
    { hour: '08', count: 2100 },
    { hour: '10', count: 980 },
    { hour: '12', count: 1150 },
    { hour: '14', count: 900 },
    { hour: '16', count: 1280 },
    { hour: '18', count: 2380 },
    { hour: '20', count: 1100 },
    { hour: '22', count: 520 },
  ],
}

const STATION_USAGE: Record<Period, { name: string; count: number }[]> = {
  오늘: [
    { name: '광주송정역', count: 112 },
    { name: '상무역', count: 98 },
    { name: '금남로역', count: 76 },
    { name: '양동시장역', count: 64 },
    { name: '송정역', count: 41 },
  ],
  '최근 7일': [
    { name: '상무역', count: 720 },
    { name: '광주송정역', count: 690 },
    { name: '금남로역', count: 512 },
    { name: '양동시장역', count: 430 },
    { name: '송정역', count: 298 },
  ],
  '최근 30일': [
    { name: '상무역', count: 3120 },
    { name: '광주송정역', count: 2980 },
    { name: '금남로역', count: 2210 },
    { name: '양동시장역', count: 1840 },
    { name: '송정역', count: 1260 },
  ],
}

function UsageStatsPage() {
  const [period, setPeriod] = useState<Period>('오늘')

  const summary = SUMMARY[period]
  const hourly = HOURLY_USAGE[period]
  const stations = STATION_USAGE[period]
  const maxHourly = Math.max(...hourly.map((item) => item.count))
  const maxStation = Math.max(...stations.map((item) => item.count))

  return (
    <div>
      <div className="flex gap-2">
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

      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">총 이용 건수</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">일 평균 이용</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.dailyAvg.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">최다 이용 정류장</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.topStation}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">최다 이용 시간대</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.topHour}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">시간대별 이용 현황</h2>
          <p className="mt-0.5 text-xs text-slate-400">2시간 단위 이용 건수입니다.</p>

          <div className="mt-6 flex items-end gap-2">
            {hourly.map((item) => (
              <div key={item.hour} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] text-slate-500">{item.count}</span>
                <div className="flex h-28 w-full items-end">
                  <div
                    className="w-full rounded-t bg-amber-500"
                    style={{ height: `${(item.count / maxHourly) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400">{item.hour}시</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">정류장별 이용 현황 Top 5</h2>
          <p className="mt-0.5 text-xs text-slate-400">이용 건수가 많은 순서입니다.</p>

          <div className="mt-6 flex flex-col gap-3">
            {stations.map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.name}</span>
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
        </div>
      </div>
    </div>
  )
}

export default UsageStatsPage
