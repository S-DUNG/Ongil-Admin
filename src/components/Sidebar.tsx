import ongilLogo from '../assets/ongil-logo.png'
import { DashboardIcon, PinIcon, TabletIcon, ChartIcon } from './icons'

export type PageKey =
  | '운영 대시보드'
  | '정류장 관리'
  | '스마트 패드 관리'
  | '서비스 이용 통계'

const NAV_ITEMS: { key: PageKey; Icon: typeof DashboardIcon; enabled: boolean }[] = [
  { key: '운영 대시보드', Icon: DashboardIcon, enabled: true },
  { key: '정류장 관리', Icon: PinIcon, enabled: true },
  { key: '스마트 패드 관리', Icon: TabletIcon, enabled: true },
  { key: '서비스 이용 통계', Icon: ChartIcon, enabled: true },
]

function Sidebar({
  active,
  onNavigate,
}: {
  active: PageKey
  onNavigate: (page: PageKey) => void
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:w-56 md:border-b-0 md:border-r">
      <button
        type="button"
        onClick={() => onNavigate('운영 대시보드')}
        className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 md:px-5 md:py-4"
      >
        <img src={ongilLogo} alt="온길" className="h-7 w-7 shrink-0 object-contain md:h-8 md:w-8" />
        <div>
          <p className="text-sm font-bold text-ink">온길</p>
          <p className="hidden text-[10px] tracking-wide text-slate-400 md:block">ONGIL SMART STATION</p>
        </div>
      </button>

      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible md:p-3">
        {NAV_ITEMS.map(({ key, Icon, enabled }) => (
          <button
            key={key}
            type="button"
            disabled={!enabled}
            onClick={() => onNavigate(key)}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition ${
              key === active
                ? 'bg-accent/40 font-semibold text-slate-900'
                : enabled
                  ? 'text-slate-600 hover:bg-slate-50'
                  : 'cursor-not-allowed text-slate-300'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {key}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
