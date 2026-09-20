import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../api/client'

// TODO: 실제 응답 필드명이 다르면(예: stationId, isPadInstalled) 여기 타입과
// 아래에서 station.xxx로 읽는 부분들을 맞춰서 고쳐야 합니다.
type Station = {
  id: string
  name: string
  address: string
  padInstalled: boolean
  status: '정상' | '점검'
  createdAt: string
}

type FormState = {
  name: string
  address: string
  padInstalled: boolean
  status: '정상' | '점검'
}

const EMPTY_FORM: FormState = { name: '', address: '', padInstalled: false, status: '정상' }

function StationsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  async function loadStations() {
    setIsLoading(true)
    setError('')
    try {
      // TODO: 응답이 { data: [...] } 형태로 감싸져 있으면 apiRequest<{ data: Station[] }>로 바꾸고 data.data를 쓰세요.
      const data = await apiRequest<Station[]>('/manage/stations')
      setStations(data)
    } catch {
      setError('정류장 목록을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 최초 목록 조회
    loadStations()
  }, [])

  function openAddForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setIsFormOpen(true)
  }

  function openEditForm(station: Station) {
    setEditingId(station.id)
    setForm({
      name: station.name,
      address: station.address,
      padInstalled: station.padInstalled,
      status: station.status,
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      if (editingId) {
        await apiRequest(`/manage/stations/${editingId}`, { method: 'PATCH', body: form })
      } else {
        await apiRequest('/manage/stations', { method: 'POST', body: form })
      }
      setIsFormOpen(false)
      await loadStations()
    } catch {
      window.alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  async function handleDelete(station: Station) {
    const confirmed = window.confirm(`'${station.name}' 정류장을 삭제할까요?`)
    if (!confirmed) return

    try {
      await apiRequest(`/manage/stations/${station.id}`, { method: 'DELETE' })
      await loadStations()
    } catch {
      window.alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">등록된 정류장 {stations.length}개</p>
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:brightness-95"
        >
          + 새 정류장 추가
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">정류장명</th>
              <th className="px-4 py-3 font-medium">주소</th>
              <th className="px-4 py-3 font-medium">스마트패드</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">등록일</th>
              <th className="px-4 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  불러오는 중...
                </td>
              </tr>
            )}

            {!isLoading && stations.map((station) => (
              <tr key={station.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500">{station.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{station.name}</td>
                <td className="px-4 py-3 text-slate-500">{station.address}</td>
                <td className="px-4 py-3">
                  {station.padInstalled ? (
                    <span className="text-emerald-600">설치됨</span>
                  ) : (
                    <span className="text-slate-400">미설치</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      station.status === '정상'
                        ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600'
                        : 'rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500'
                    }
                  >
                    {station.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{station.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => openEditForm(station)}
                      className="rounded border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(station)}
                      className="rounded border border-red-200 px-2 py-1 text-red-500 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!isLoading && stations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  등록된 정류장이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? '정류장 수정' : '새 정류장 추가'}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">정류장명</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">주소</label>
                <input
                  required
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">상태</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as '정상' | '점검' })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                >
                  <option value="정상">정상</option>
                  <option value="점검">점검</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.padInstalled}
                  onChange={(event) => setForm({ ...form, padInstalled: event.target.checked })}
                />
                스마트패드 설치됨
              </label>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-accent py-2 text-sm font-semibold text-slate-900 hover:brightness-95"
              >
                {editingId ? '수정 완료' : '추가'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default StationsPage
