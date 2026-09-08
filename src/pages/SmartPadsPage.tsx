import { useState, type FormEvent } from 'react'

type PadStatus = '정상' | '점검' | '고장'

type SmartPad = {
  id: string
  serial: string
  stationName: string
  status: PadStatus
  batteryLevel: number
  createdAt: string
}

const INITIAL_PADS: SmartPad[] = [
  {
    id: 'PAD-01',
    serial: 'SN-2026-0092',
    stationName: '광주송정역',
    status: '정상',
    batteryLevel: 92,
    createdAt: '2026-09-08 09:35',
  },
  {
    id: 'PAD-02',
    serial: 'SN-2026-0091',
    stationName: '양동시장역',
    status: '정상',
    batteryLevel: 88,
    createdAt: '2026-09-08 08:50',
  },
  {
    id: 'PAD-03',
    serial: 'SN-2026-0090',
    stationName: '송정역',
    status: '고장',
    batteryLevel: 12,
    createdAt: '2026-09-07 15:10',
  },
  {
    id: 'PAD-04',
    serial: 'SN-2026-0089',
    stationName: '상무역',
    status: '점검',
    batteryLevel: 54,
    createdAt: '2026-09-07 13:25',
  },
  {
    id: 'PAD-05',
    serial: 'SN-2026-0088',
    stationName: '금남로역',
    status: '정상',
    batteryLevel: 97,
    createdAt: '2026-09-06 17:00',
  },
]

type FormState = {
  serial: string
  stationName: string
  status: PadStatus
  batteryLevel: number
}

const EMPTY_FORM: FormState = { serial: '', stationName: '', status: '정상', batteryLevel: 100 }

const STATUS_STYLE: Record<PadStatus, string> = {
  정상: 'bg-emerald-50 text-emerald-600',
  점검: 'bg-amber-50 text-amber-600',
  고장: 'bg-red-50 text-red-500',
}

function nowString() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ')
}

function SmartPadsPage() {
  const [pads, setPads] = useState<SmartPad[]>(INITIAL_PADS)
  const [detailPad, setDetailPad] = useState<SmartPad | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  function openAddForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setIsFormOpen(true)
  }

  function openEditForm(pad: SmartPad) {
    setEditingId(pad.id)
    setForm({
      serial: pad.serial,
      stationName: pad.stationName,
      status: pad.status,
      batteryLevel: pad.batteryLevel,
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId) {
      setPads((prev) => prev.map((pad) => (pad.id === editingId ? { ...pad, ...form } : pad)))
    } else {
      const nextId = `PAD-${String(pads.length + 1).padStart(2, '0')}`
      setPads((prev) => [...prev, { id: nextId, createdAt: nowString(), ...form }])
    }

    setIsFormOpen(false)
  }

  function handleDelete(pad: SmartPad) {
    const confirmed = window.confirm(`'${pad.serial}' 스마트패드를 삭제할까요?`)
    if (!confirmed) return

    setPads((prev) => prev.filter((item) => item.id !== pad.id))
    if (detailPad?.id === pad.id) {
      setDetailPad(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">등록된 스마트패드 {pads.length}개</p>
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
        >
          + 새 스마트패드 추가
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">시리얼번호</th>
              <th className="px-4 py-3 font-medium">설치 정류장</th>
              <th className="px-4 py-3 font-medium">배터리</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">등록일</th>
              <th className="px-4 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {pads.map((pad) => (
              <tr key={pad.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500">{pad.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{pad.serial}</td>
                <td className="px-4 py-3 text-slate-500">{pad.stationName}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      pad.batteryLevel <= 20 ? 'font-medium text-red-500' : 'text-slate-600'
                    }
                  >
                    {pad.batteryLevel}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[pad.status]}`}
                  >
                    {pad.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{pad.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDetailPad(pad)}
                      className="rounded border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      상세
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditForm(pad)}
                      className="rounded border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pad)}
                      className="rounded border border-red-200 px-2 py-1 text-red-500 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  등록된 스마트패드가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailPad && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">{detailPad.serial}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">ID</dt>
                <dd className="text-slate-700">{detailPad.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">설치 정류장</dt>
                <dd className="text-slate-700">{detailPad.stationName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">배터리</dt>
                <dd className="text-slate-700">{detailPad.batteryLevel}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">상태</dt>
                <dd className="text-slate-700">{detailPad.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">등록일</dt>
                <dd className="text-slate-700">{detailPad.createdAt}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setDetailPad(null)}
              className="mt-6 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? '스마트패드 수정' : '새 스마트패드 추가'}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">시리얼번호</label>
                <input
                  required
                  value={form.serial}
                  onChange={(event) => setForm({ ...form, serial: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">설치 정류장</label>
                <input
                  required
                  value={form.stationName}
                  onChange={(event) => setForm({ ...form, stationName: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">배터리 (%)</label>
                <input
                  required
                  type="number"
                  min={0}
                  max={100}
                  value={form.batteryLevel}
                  onChange={(event) =>
                    setForm({ ...form, batteryLevel: Number(event.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">상태</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as PadStatus })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/30"
                >
                  <option value="정상">정상</option>
                  <option value="점검">점검</option>
                  <option value="고장">고장</option>
                </select>
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
                className="flex-1 rounded-lg bg-amber-400 py-2 text-sm font-semibold text-white hover:bg-amber-500"
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

export default SmartPadsPage
