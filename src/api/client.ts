const BASE_URL = import.meta.env.VITE_API_BASE_URL

function getToken() {
  return localStorage.getItem('accessToken')
}

export function setToken(token: string) {
  localStorage.setItem('accessToken', token)
}

export function clearToken() {
  localStorage.removeItem('accessToken')
}

export function isLoggedIn() {
  return Boolean(getToken())
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const message = await res.text().catch(() => '')
    throw new Error(message || `요청 실패 (${res.status})`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
