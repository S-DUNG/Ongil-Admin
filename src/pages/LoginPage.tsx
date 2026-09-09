import { useState, type FormEvent } from 'react'
import ongilLogo from '../assets/ongil-logo.png'
import ongilLetterLogo from '../assets/ongil-letter-logo.png'
import AdminApp from './AdminApp'

// 백엔드가 없어서 일단 이 비밀번호로만 로그인되게 해뒀습니다.
const ADMIN_PASSWORD = 'admin1234'

function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    return <AdminApp onLogout={handleLogout} />
  }

    return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-sm">
        <img src={ongilLogo} alt="온길 로고" className="h-24 w-24 object-contain" />
        <img src={ongilLetterLogo} alt="온길" className="h-8 object-contain" />

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full flex-col items-center gap-2"
        >
          <div className="flex w-full items-center gap-3 rounded-full border border-accent bg-accent/40 px-5 py-3">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-slate-500"
              fill="none"
              stroke="currentColor"
            >
              <rect x="4" y="9" width="12" height="8" rx="2" strokeWidth="1.6" />
              <path d="M7 9V6a3 3 0 0 1 6 0v3" strokeWidth="1.6" />
            </svg>

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="관리자 비밀번호를 입력하시오."
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              className="shrink-0 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor">
                  <path
                    d="M2.5 10s2.917-5.417 7.5-5.417S17.5 10 17.5 10s-2.917 5.417-7.5 5.417S2.5 10 2.5 10Z"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="10" r="2" strokeWidth="1.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor">
                  <path
                    d="M2.5 10s2.917-5.417 7.5-5.417S17.5 10 17.5 10s-2.917 5.417-7.5 5.417S2.5 10 2.5 10Z"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="10" r="2" strokeWidth="1.4" />
                  <path d="M3.5 3.5l13 13" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="shrink-0 rounded-full bg-accent px-5 py-1.5 text-sm font-semibold text-slate-900 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? '확인 중...' : '로그인'}
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </form>
      </div>
    </main>
  )
}

export default LoginPage
