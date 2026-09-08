// 실제 디자인 파일(로고 원본) 받으면 이 컴포넌트를 이미지로 교체하면 됩니다.
function BusLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path
        d="M58 72 Q68 56 58 40 Q53 33 60 26"
        fill="none"
        stroke="#ffffff"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M58 72 Q68 56 58 40 Q53 33 60 26"
        fill="none"
        stroke="#111111"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      <rect
        x="8"
        y="20"
        width="104"
        height="48"
        rx="14"
        fill="#f5a623"
        stroke="#111111"
        strokeWidth="5"
      />

      <rect x="21" y="34" width="15" height="17" rx="2" fill="#ffffff" stroke="#111111" strokeWidth="4" />
      <rect x="40" y="34" width="15" height="17" rx="2" fill="#ffffff" stroke="#111111" strokeWidth="4" />
      <path
        d="M86 32 L103 34 L105 51 L88 51 Z"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <circle cx="30" cy="70" r="11" fill="#111111" />
      <circle cx="30" cy="70" r="4" fill="#f5a623" />
      <circle cx="90" cy="70" r="11" fill="#111111" />
      <circle cx="90" cy="70" r="4" fill="#f5a623" />
    </svg>
  )
}

export default BusLogo
