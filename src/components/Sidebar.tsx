import ongilLogo from '../assets/ongil-logo.png'

export type PageKey =
  | '운영 대시보드'
  | '정류장 관리'
  | '스마트 패드 관리'
  | '버스 데이터 관리'
  | '서비스 이용 통계'

const NAV_ITEMS: { key: PageKey; icon: string; enabled: boolean }[] = [
  { key: '운영 대시보드', icon: '🖥️', enabled: true },
  { key: '정류장 관리', icon: '📍', enabled: true },
  { key: '스마트 패드 관리', icon: '📱', enabled: true },
  { key: '버스 데이터 관리', icon: '🚌', enabled: true },
  { key: '서비스 이용 통계', icon: '📊', enabled: true },
]

function Sidebar({
  active,
  onNavigate,
}: {
  active: PageKey
  onNavigate: (page: PageKey) => void
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => onNavigate('운영 대시보드')}
        className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <img src={ongilLogo} alt="온길" className="h-8 w-8 object-contain" />
        <div>
          <p className="text-sm font-bold text-slate-900">온길</p>
          <p className="text-[10px] tracking-wide text-slate-400">ONGIL SMART STATION</p>
        </div>
      </button>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={!item.enabled}
            onClick={() => onNavigate(item.key)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
              item.key === active
                ? 'bg-amber-50 font-semibold text-amber-700'
                : item.enabled
                  ? 'text-slate-600 hover:bg-slate-50'
                  : 'cursor-not-allowed text-slate-300'
            }`}
          >
            <span>{item.icon}</span>
            {item.key}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
