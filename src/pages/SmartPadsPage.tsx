import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../api/client'

type PadStatus = '정상' | '점검' | '고장'

// TODO: 실제 응답 필드명이 다르면 여기 타입과 pad.xxx로 읽는 부분들을 맞춰서 고쳐야 합니다.
type SmartPad = {
  id: string
  serial: string
  stationName: string
  status: PadStatus
  batteryLevel: number
  createdAt: string
}

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

function SmartPadsPage() {
  const [pads, setPads] = useState<SmartPad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingOriginalStatus, setEditingOriginalStatus] = useState<PadStatus | null>(null)

  async function loadPads() {
    setIsLoading(true)
    setError('')
    try {
      const data = await apiRequest<SmartPad[]>('/manage/smart-pads')
      setPads(data)
    } catch {
      setError('스마트패드 목록을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 최초 목록 조회
    loadPads()
  }, [])

  function openAddForm() {
    setEditingId(null)
    setEditingOriginalStatus(null)
    setForm(EMPTY_FORM)
    setIsFormOpen(true)
  }

  function openEditForm(pad: SmartPad) {
    setEditingId(pad.id)
    setEditingOriginalStatus(pad.status)
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

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      if (editingId) {
        // 정보 수정과 상태 변경이 API 명세상 별도 엔드포인트라서 두 번 호출합니다.
        await apiRequest(`/manage/smart-pads/${editingId}`, {
          method: 'PATCH',
          body: { serial: form.serial, stationName: form.stationName, batteryLevel: form.batteryLevel },
        })
        if (form.status !== editingOriginalStatus) {
          await apiRequest(`/manage/smart-pads/${editingId}/status`, {
            method: 'PATCH',
            body: { status: form.status },
          })
        }
      } else {
        await apiRequest('/manage/smart-pads', { method: 'POST', body: form })
      }
      setIsFormOpen(false)
      await loadPads()
    } catch {
      window.alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  async function handleDelete(pad: SmartPad) {
    const confirmed = window.confirm(`'${pad.serial}' 스마트패드를 삭제할까요?`)
    if (!confirmed) return

    try {
      await apiRequest(`/manage/smart-pads/${pad.id}`, { method: 'DELETE' })
      await loadPads()
    } catch {
      window.alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">등록된 스마트패드 {pads.length}개</p>
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:brightness-95"
        >
          + 새 스마트패드 추가
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

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
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  불러오는 중...
                </td>
              </tr>
            )}

            {!isLoading && pads.map((pad) => (
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

            {!isLoading && pads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  등록된 스마트패드가 없습니다.
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
              {editingId ? '스마트패드 수정' : '새 스마트패드 추가'}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">시리얼번호</label>
                <input
                  required
                  value={form.serial}
                  onChange={(event) => setForm({ ...form, serial: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">설치 정류장</label>
                <input
                  required
                  value={form.stationName}
                  onChange={(event) => setForm({ ...form, stationName: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">상태</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as PadStatus })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
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

export default SmartPadsPage
