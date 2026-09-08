import { useState } from 'react'
import Sidebar, { type PageKey } from '../components/Sidebar'
import DashboardPage from './DashboardPage'
import StationsPage from './StationsPage'
import SmartPadsPage from './SmartPadsPage'

function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<PageKey>('운영 대시보드')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={page} onNavigate={setPage} />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <h1 className="text-lg font-bold text-slate-900">{page}</h1>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            <span>👤</span> 관리자
          </button>
        </header>

        <main className="p-8">
          {page === '운영 대시보드' && <DashboardPage />}
          {page === '정류장 관리' && <StationsPage />}
          {page === '스마트 패드 관리' && <SmartPadsPage />}
        </main>
      </div>
    </div>
  )
}

export default AdminApp
