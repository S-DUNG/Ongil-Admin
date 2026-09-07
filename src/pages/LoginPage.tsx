import { useState, type FormEvent } from 'react'

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
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">관리자 대시보드</h1>
          <p className="mt-2 text-sm text-slate-500">로그인 성공! (아직 껍데기만 있어요)</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            로그아웃
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-slate-900">관리자 로그인</h1>

        <div className="mt-6">
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력하세요"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-slate-900/10 ${
              error ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </main>
  )
}

export default LoginPage
