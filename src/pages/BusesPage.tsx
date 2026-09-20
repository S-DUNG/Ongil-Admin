import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../api/client'

type BusStatus = '운행중' | '운행종료' | '점검'

// TODO: 실제 응답 필드명이 다르면 여기 타입과 bus.xxx로 읽는 부분들을 맞춰서 고쳐야 합니다.
type Bus = {
  id: string
  busNumber: string
  destination: string
  lowFloor: boolean
  status: BusStatus
  createdAt: string
}

type FormState = {
  busNumber: string
  destination: string
  lowFloor: boolean
  status: BusStatus
}

const EMPTY_FORM: FormState = { busNumber: '', destination: '', lowFloor: false, status: '운행중' }

const STATUS_STYLE: Record<BusStatus, string> = {
  운행중: 'bg-emerald-50 text-emerald-600',
  운행종료: 'bg-slate-100 text-slate-500',
  점검: 'bg-amber-50 text-amber-600',
}

function nowString() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ')
}

function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  async function loadBuses() {
    setIsLoading(true)
    setError('')
    try {
      // TODO: 응답이 { data: [...] } 형태로 감싸져 있으면 apiRequest<{ data: Bus[] }>로 바꾸고 data.data를 쓰세요.
      const data = await apiRequest<Bus[]>('/manage/bus-data')
      setBuses(data)
    } catch {
      setError('버스 데이터를 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 최초 목록 조회
    loadBuses()
  }, [])

  function openAddForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setIsFormOpen(true)
  }

  function openEditForm(bus: Bus) {
    setEditingId(bus.id)
    setForm({
      busNumber: bus.busNumber,
      destination: bus.destination,
      lowFloor: bus.lowFloor,
      status: bus.status,
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
  }

  // API 명세에 버스 데이터 등록/수정/삭제 엔드포인트가 없어서(조회만 있음)
  // 일단 로컬 상태만 바꿉니다. 백엔드에 해당 엔드포인트가 추가되면
  // StationsPage.tsx / SmartPadsPage.tsx의 handleFormSubmit·handleDelete와
  // 같은 패턴(apiRequest 호출 후 loadBuses() 재조회)으로 바꾸면 됩니다.
  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId) {
      setBuses((prev) => prev.map((bus) => (bus.id === editingId ? { ...bus, ...form } : bus)))
    } else {
      const nextId = `BUS-${String(buses.length + 1).padStart(2, '0')}`
      setBuses((prev) => [...prev, { id: nextId, createdAt: nowString(), ...form }])
    }

    setIsFormOpen(false)
  }

  function handleDelete(bus: Bus) {
    const confirmed = window.confirm(`'${bus.busNumber}번' 버스를 삭제할까요?`)
    if (!confirmed) return

    setBuses((prev) => prev.filter((item) => item.id !== bus.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">등록된 버스 {buses.length}개</p>
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:brightness-95"
        >
          + 새 버스 추가
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">버스 번호</th>
              <th className="px-4 py-3 font-medium">방면</th>
              <th className="px-4 py-3 font-medium">저상버스</th>
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

            {!isLoading && buses.map((bus) => (
              <tr key={bus.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500">{bus.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{bus.busNumber}</td>
                <td className="px-4 py-3 text-slate-500">{bus.destination}</td>
                <td className="px-4 py-3">
                  {bus.lowFloor ? (
                    <span className="text-emerald-600">저상</span>
                  ) : (
                    <span className="text-slate-400">일반</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[bus.status]}`}
                  >
                    {bus.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{bus.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => openEditForm(bus)}
                      className="rounded border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(bus)}
                      className="rounded border border-red-200 px-2 py-1 text-red-500 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!isLoading && buses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  등록된 버스가 없습니다.
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
              {editingId ? '버스 수정' : '새 버스 추가'}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">버스 번호</label>
                <input
                  required
                  value={form.busNumber}
                  onChange={(event) => setForm({ ...form, busNumber: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">방면</label>
                <input
                  required
                  value={form.destination}
                  onChange={(event) => setForm({ ...form, destination: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">상태</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as BusStatus })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                >
                  <option value="운행중">운행중</option>
                  <option value="운행종료">운행종료</option>
                  <option value="점검">점검</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.lowFloor}
                  onChange={(event) => setForm({ ...form, lowFloor: event.target.checked })}
                />
                저상버스
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

export default BusesPage
