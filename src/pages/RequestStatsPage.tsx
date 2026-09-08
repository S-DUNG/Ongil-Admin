import { useState } from 'react'

type Period = '오늘' | '최근 7일' | '최근 30일'
type RequestType = '도움 요청' | '탑승 지원 요청'
type RequestStatus = '처리완료' | '처리중' | '미처리'

const PERIODS: Period[] = ['오늘', '최근 7일', '최근 30일']

const STATUS_STYLE: Record<RequestStatus, string> = {
  처리완료: 'bg-emerald-50 text-emerald-600',
  처리중: 'bg-amber-50 text-amber-600',
  미처리: 'bg-red-50 text-red-500',
}

const STATUS_BAR_COLOR: Record<RequestStatus, string> = {
  처리완료: 'bg-emerald-400',
  처리중: 'bg-amber-400',
  미처리: 'bg-red-400',
}

// 백엔드 연동 전이라 기간별로 다른 mock 데이터를 미리 넣어뒀습니다.
const SUMMARY: Record<
  Period,
  { total: number; helpCount: number; boardingCount: number; pendingCount: number }
> = {
  오늘: { total: 18, helpCount: 11, boardingCount: 7, pendingCount: 2 },
  '최근 7일': { total: 126, helpCount: 74, boardingCount: 52, pendingCount: 5 },
  '최근 30일': { total: 512, helpCount: 298, boardingCount: 214, pendingCount: 9 },
}

const STATUS_BREAKDOWN: Record<Period, Record<RequestStatus, number>> = {
  오늘: { 처리완료: 14, 처리중: 2, 미처리: 2 },
  '최근 7일': { 처리완료: 108, 처리중: 13, 미처리: 5 },
  '최근 30일': { 처리완료: 470, 처리중: 33, 미처리: 9 },
}

const RECENT_REQUESTS: Record<
  Period,
  { id: string; type: RequestType; station: string; status: RequestStatus; requestedAt: string }[]
> = {
  오늘: [
    { id: 'REQ-101', type: '도움 요청', station: '광주송정역', status: '처리완료', requestedAt: '2026-09-08 08:42' },
    { id: 'REQ-102', type: '탑승 지원 요청', station: '상무역', status: '처리완료', requestedAt: '2026-09-08 09:05' },
    { id: 'REQ-103', type: '도움 요청', station: '송정역', status: '처리중', requestedAt: '2026-09-08 09:20' },
    { id: 'REQ-104', type: '탑승 지원 요청', station: '금남로역', status: '미처리', requestedAt: '2026-09-08 09:31' },
    { id: 'REQ-105', type: '도움 요청', station: '양동시장역', status: '처리완료', requestedAt: '2026-09-08 09:40' },
  ],
  '최근 7일': [
    { id: 'REQ-081', type: '도움 요청', station: '광주송정역', status: '처리완료', requestedAt: '2026-09-07 08:12' },
    { id: 'REQ-082', type: '탑승 지원 요청', station: '상무역', status: '처리완료', requestedAt: '2026-09-07 10:30' },
    { id: 'REQ-083', type: '탑승 지원 요청', station: '송정역', status: '미처리', requestedAt: '2026-09-06 14:02' },
    { id: 'REQ-084', type: '도움 요청', station: '금남로역', status: '처리중', requestedAt: '2026-09-06 17:45' },
    { id: 'REQ-085', type: '도움 요청', station: '양동시장역', status: '처리완료', requestedAt: '2026-09-05 11:15' },
  ],
  '최근 30일': [
    { id: 'REQ-001', type: '도움 요청', station: '광주송정역', status: '처리완료', requestedAt: '2026-08-15 08:12' },
    { id: 'REQ-018', type: '탑승 지원 요청', station: '상무역', status: '처리완료', requestedAt: '2026-08-20 10:30' },
    { id: 'REQ-033', type: '탑승 지원 요청', station: '송정역', status: '미처리', requestedAt: '2026-08-27 14:02' },
    { id: 'REQ-047', type: '도움 요청', station: '금남로역', status: '처리중', requestedAt: '2026-09-02 17:45' },
    { id: 'REQ-052', type: '도움 요청', station: '양동시장역', status: '처리완료', requestedAt: '2026-09-06 11:15' },
  ],
}

function RequestStatsPage() {
  const [period, setPeriod] = useState<Period>('오늘')

  const summary = SUMMARY[period]
  const breakdown = STATUS_BREAKDOWN[period]
  const recentRequests = RECENT_REQUESTS[period]
  const breakdownTotal = breakdown.처리완료 + breakdown.처리중 + breakdown.미처리

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
                ? 'bg-amber-400 text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">총 요청 건수</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">도움 요청</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.helpCount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">탑승 지원 요청</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.boardingCount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">미처리 건수</p>
          <p className="mt-2 text-2xl font-bold text-red-500">{summary.pendingCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">처리 현황</h2>
        <p className="mt-0.5 text-xs text-slate-400">요청 처리 상태별 비율입니다.</p>

        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {(Object.keys(breakdown) as RequestStatus[]).map((status) => (
            <div
              key={status}
              className={STATUS_BAR_COLOR[status]}
              style={{ width: `${(breakdown[status] / breakdownTotal) * 100}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex gap-6 text-sm">
          {(Object.keys(breakdown) as RequestStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
                {status}
              </span>
              <span className="text-slate-600">{breakdown[status]}건</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5 pb-0">
          <h2 className="text-sm font-bold text-slate-900">최근 요청 목록</h2>
          <p className="mt-0.5 text-xs text-slate-400">최신 발생한 요청입니다.</p>
        </div>

        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-5 py-2 font-medium">ID</th>
              <th className="px-5 py-2 font-medium">유형</th>
              <th className="px-5 py-2 font-medium">정류장</th>
              <th className="px-5 py-2 font-medium">상태</th>
              <th className="px-5 py-2 font-medium">요청일시</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((request) => (
              <tr key={request.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 text-slate-500">{request.id}</td>
                <td className="px-5 py-3 font-medium text-slate-800">{request.type}</td>
                <td className="px-5 py-3 text-slate-500">{request.station}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[request.status]}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400">{request.requestedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequestStatsPage
