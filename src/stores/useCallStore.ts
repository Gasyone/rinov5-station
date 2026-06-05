import { create } from 'zustand'

export type CallStatus = 'idle' | 'dialing' | 'connected' | 'ended'

export interface CallLog {
  id: string
  timestamp: string
  duration: number
  status: string
  note: string
}

interface CallState {
  status: CallStatus
  studentId: string | null
  studentName: string
  parentPhone: string
  parentName: string
  duration: number
  activeTimer: NodeJS.Timeout | null
  callLogs: Record<string, CallLog[]>
  scheduleItemId: string | null // Để cập nhật trạng thái lịch chăm sóc

  startCall: (params: {
    studentId: string
    studentName: string
    parentPhone: string
    parentName: string
    scheduleItemId?: string | null
  }) => void
  connectCall: () => void
  endCall: () => void
  saveCallLog: (status: string, note: string) => void
  resetCall: () => void
  getNotesForStudent: (studentId: string) => CallLog[]
}

export const useCallStore = create<CallState>((set, get) => ({
  status: 'idle',
  studentId: null,
  studentName: '',
  parentPhone: '',
  parentName: '',
  duration: 0,
  activeTimer: null,
  callLogs: {},
  scheduleItemId: null,

  startCall: ({ studentId, studentName, parentPhone, parentName, scheduleItemId = null }) => {
    // Clear old timer if any
    const currentTimer = get().activeTimer
    if (currentTimer) clearInterval(currentTimer)

    set({
      status: 'dialing',
      studentId,
      studentName,
      parentPhone,
      parentName,
      duration: 0,
      scheduleItemId,
      activeTimer: null,
    })
  },

  connectCall: () => {
    const currentTimer = get().activeTimer
    if (currentTimer) clearInterval(currentTimer)

    // Bắt đầu đếm giây cuộc gọi
    const timer = setInterval(() => {
      set((state) => ({ duration: state.duration + 1 }))
    }, 1000)

    set({
      status: 'connected',
      activeTimer: timer,
    })
  },

  endCall: () => {
    const timer = get().activeTimer
    if (timer) clearInterval(timer)

    set({
      status: 'ended',
      activeTimer: null,
    })
  },

  saveCallLog: (status, note) => {
    const { studentId, duration, callLogs, scheduleItemId } = get()
    if (!studentId) return

    const newLog: CallLog = {
      id: `call-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay',
      duration,
      status,
      note,
    }

    const updatedLogs = {
      ...callLogs,
      [studentId]: [newLog, ...(callLogs[studentId] || [])],
    }

    // Nếu cuộc gọi xuất phát từ Lịch hẹn chăm sóc, chúng ta có thể cập nhật trạng thái trong bộ nhớ
    if (scheduleItemId) {
      // Sẽ được xử lý bởi component hoặc cập nhật trực tiếp tại đây nếu cần
      // Ví dụ: Bắn sự kiện CustomEvent để thông báo cho CareScheduleScreen cập nhật state
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('careCallSaved', {
          detail: {
            scheduleItemId,
            status,
            note,
          },
        })
        window.dispatchEvent(event)
      }
    }

    set({
      callLogs: updatedLogs,
      status: 'idle',
      studentId: null,
      studentName: '',
      parentPhone: '',
      parentName: '',
      duration: 0,
      scheduleItemId: null,
    })
  },

  resetCall: () => {
    const timer = get().activeTimer
    if (timer) clearInterval(timer)

    set({
      status: 'idle',
      studentId: null,
      studentName: '',
      parentPhone: '',
      parentName: '',
      duration: 0,
      scheduleItemId: null,
      activeTimer: null,
    })
  },

  getNotesForStudent: (studentId) => {
    return get().callLogs[studentId] || []
  },
}))
