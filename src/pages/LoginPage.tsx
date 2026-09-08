import { useState, type FormEvent } from 'react'
import BusLogo from '../components/BusLogo'

// 백엔드가 없어서, 일단 이 비밀번호로만 로그인되게 해둔 거예요.
const ADMIN_PASSWORD = 'admin1234'

function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = password.trim()
    if (!trimmed) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setError('')
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (trimmed !== ADMIN_PASSWORD) {
      setError('비밀번호가 올바르지 않습니다.')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setIsLoggedIn(true)
  }

  function handleLogout() {
    setPassword('')
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white">
        <BusLogo className="h-20 w-20" />
        <h1 className="text-xl font-bold text-slate-900">관리자 대시보드</h1>
        <p className="text-sm text-slate-500">로그인 성공!</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-amber-100"
        >
          로그아웃
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4">
      <BusLogo className="h-24 w-24" />
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">온길</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex w-full max-w-md flex-col items-center gap-2"
      >
        <div className="flex w-full items-center gap-3 rounded-full border border-amber-200 bg-amber-50/70 px-5 py-3">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-amber-700/60"
            fill="none"
            stroke="currentColor"
          >
            <rect x="4" y="9" width="12" height="8" rx="2" strokeWidth="1.6" />
            <path d="M7 9V6a3 3 0 0 1 6 0v3" strokeWidth="1.6" />
          </svg>

          <input
            id="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="관리자 비밀번호를 입력하시오."
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-amber-700/50"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 rounded-full bg-amber-400 px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '확인 중...' : '로그인'}
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>
    </main>
  )
}

export default LoginPage
