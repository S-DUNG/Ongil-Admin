import { useState, type FormEvent } from 'react'

type Station = {
  id: string
  name: string
  address: string
  padInstalled: boolean
  status: '정상' | '점검'
  createdAt: string
}

const INITIAL_STATIONS: Station[] = [
  {
    id: 'ST-01',
    name: '광주송정역',
    address: '광주 광산구 송정동 300',
    padInstalled: true,
    status: '정상',
    createdAt: '2026-09-08 09:30',
  },
  {
    id: 'ST-02',
    name: '양동시장역',
    address: '광주 서구 양동 20',
    padInstalled: true,
    status: '정상',
    createdAt: '2026-09-08 09:15',
  },
  {
    id: 'ST-03',
    name: '송정역',
    address: '광주 광산구 송정동 15',
    padInstalled: false,
    status: '점검',
    createdAt: '2026-09-07 14:20',
  },
  {
    id: 'ST-04',
    name: '상무역',
    address: '광주 서구 치평동 1200',
    padInstalled: true,
    status: '정상',
    createdAt: '2026-09-07 11:45',
  },
  {
    id: 'ST-05',
    name: '금남로역',
    address: '광주 동구 금남로 5가',
    padInstalled: true,
    status: '정상',
    createdAt: '2026-09-06 16:30',
  },
]

type FormState = {
  name: string
  address: string
  padInstalled: boolean
  status: '정상' | '점검'
}

const EMPTY_FORM: FormState = { name: '', address: '', padInstalled: false, status: '정상' }

function nowString() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ')
}

function StationsPage() {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

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

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId) {
      setStations((prev) =>
        prev.map((station) => (station.id === editingId ? { ...station, ...form } : station)),
      )
    } else {
      const nextId = `ST-${String(stations.length + 1).padStart(2, '0')}`
      setStations((prev) => [...prev, { id: nextId, createdAt: nowString(), ...form }])
    }

    setIsFormOpen(false)
  }

  function handleDelete(station: Station) {
    const confirmed = window.confirm(`'${station.name}' 정류장을 삭제할까요?`)
    if (!confirmed) return

    setStations((prev) => prev.filter((item) => item.id !== station.id))
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
            {stations.map((station) => (
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

            {stations.length === 0 && (
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
