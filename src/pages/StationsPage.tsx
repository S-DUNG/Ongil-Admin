import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../api/client'

type Station = {
  id: number
  tagoStationId: string
  name: string
  latitude: number
  longitude: number
  address: string
  active: boolean
  createdAt: string
}

type StationsPageResponse = {
  content: Station[]
  totalElements: number
}

type FormState = {
  tagoStationId: string
  name: string
  address: string
  latitude: string
  longitude: string
}

const EMPTY_FORM: FormState = { tagoStationId: '', name: '', address: '', latitude: '', longitude: '' }

function StationsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  async function loadStations() {
    setIsLoading(true)
    setError('')
    try {
      const data = await apiRequest<StationsPageResponse>('/manage/stations')
      setStations(data.content)
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
      tagoStationId: station.tagoStationId,
      name: station.name,
      address: station.address,
      latitude: String(station.latitude),
      longitude: String(station.longitude),
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const body = {
      tagoStationId: form.tagoStationId,
      name: form.name,
      address: form.address,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    }

    try {
      if (editingId) {
        await apiRequest(`/manage/stations/${editingId}`, { method: 'PATCH', body })
      } else {
        await apiRequest('/manage/stations', { method: 'POST', body })
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
              <th className="px-4 py-3 font-medium">TAGO ID</th>
              <th className="px-4 py-3 font-medium">정류장명</th>
              <th className="px-4 py-3 font-medium">주소</th>
              <th className="px-4 py-3 font-medium">위도/경도</th>
              <th className="px-4 py-3 font-medium">운영상태</th>
              <th className="px-4 py-3 font-medium">등록일</th>
              <th className="px-4 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                  불러오는 중...
                </td>
              </tr>
            )}

            {!isLoading && stations.map((station) => (
              <tr key={station.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500">{station.id}</td>
                <td className="px-4 py-3 text-slate-500">{station.tagoStationId}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{station.name}</td>
                <td className="px-4 py-3 text-slate-500">{station.address}</td>
                <td className="px-4 py-3 text-slate-500">
                  {station.latitude}, {station.longitude}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      station.active
                        ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600'
                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'
                    }
                  >
                    {station.active ? '운영중' : '미운영'}
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
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
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
                <label className="mb-1 block text-xs font-medium text-slate-600">TAGO 정류장 ID</label>
                <input
                  required
                  value={form.tagoStationId}
                  onChange={(event) => setForm({ ...form, tagoStationId: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

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

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-600">위도</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(event) => setForm({ ...form, latitude: event.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-600">경도</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(event) => setForm({ ...form, longitude: event.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                  />
                </div>
              </div>
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
