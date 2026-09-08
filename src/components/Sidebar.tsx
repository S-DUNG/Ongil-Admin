import ongilLogo from '../assets/ongil-logo.png'

const NAV_ITEMS = ['운영 대시보드', '정류장 관리', '스마트 패드 관리', '버스 데이터 관리', '서비스 이용 통계']

const NAV_ICONS: Record<string, string> = {
  '운영 대시보드': '🖥️',
  '정류장 관리': '📍',
  '스마트 패드 관리': '📱',
  '버스 데이터 관리': '🚌',
  '서비스 이용 통계': '📊',
}

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
        <img src={ongilLogo} alt="온길" className="h-8 w-8 object-contain" />
        <div>
          <p className="text-sm font-bold text-slate-900">온길</p>
          <p className="text-[10px] tracking-wide text-slate-400">ONGIL SMART STATION</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <div
            key={item}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              item === active ? 'bg-amber-50 font-semibold text-amber-700' : 'text-slate-600'
            }`}
          >
            <span>{NAV_ICONS[item]}</span>
            {item}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
