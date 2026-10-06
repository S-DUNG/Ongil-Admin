import { useState } from 'react'
import Sidebar, { type PageKey } from '../components/Sidebar'
import DashboardPage from './DashboardPage'
import StationsPage from './StationsPage'
import SmartPadsPage from './SmartPadsPage'
import UsageStatsPage from './UsageStatsPage'

function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<PageKey>('운영 대시보드')

  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      <Sidebar active={page} onNavigate={setPage} />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-8 md:py-4">
          <h1 className="text-base font-bold text-ink md:text-lg">{page}</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              로그아웃
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {page === '운영 대시보드' && <DashboardPage />}
          {page === '정류장 관리' && <StationsPage />}
          {page === '스마트 패드 관리' && <SmartPadsPage />}
          {page === '서비스 이용 통계' && <UsageStatsPage />}
        </main>
      </div>
    </div>
  )
}

export default AdminApp
