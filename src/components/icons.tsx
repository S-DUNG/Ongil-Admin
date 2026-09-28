type IconProps = { className?: string }

const BASE = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M10 18s6-5.686 6-10a6 6 0 1 0-12 0c0 4.314 6 10 6 10Z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  )
}

export function TabletIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <rect x="5" y="2" width="10" height="16" rx="2" />
      <path d="M9 15.5h2" />
    </svg>
  )
}

export function BusIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <rect x="3" y="5" width="14" height="9" rx="2" />
      <path d="M3 10h14" />
      <circle cx="6.5" cy="16" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="16" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M4 16V9M10 16V4M16 16v-6" />
    </svg>
  )
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <circle cx="10" cy="7" r="3" />
      <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
    </svg>
  )
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  )
}

export function WarningIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M10 3 2 17h16L10 3Z" />
      <path d="M10 8v4" />
      <circle cx="10" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}
