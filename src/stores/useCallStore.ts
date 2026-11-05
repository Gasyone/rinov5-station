import { create } from 'zustand'
import { mockCareAlerts, updateCareAlertInteraction, type StudentCareAlert } from '@/mocks/careAlerts'

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
  studentCode: string
  studentStatus: string
  attendanceStatus: string
  className: string
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
    studentCode?: string
    studentStatus?: string
    attendanceStatus?: string
    className?: string
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
  studentCode: '',
  studentStatus: '',
  attendanceStatus: '',
  className: '',
  parentPhone: '',
  parentName: '',
  duration: 0,
  activeTimer: null,
  callLogs: {},
  scheduleItemId: null,

  startCall: ({
    studentId,
    studentName,
    parentPhone,
    parentName,
    studentCode = '',
    studentStatus = '',
    attendanceStatus = '',
    className = '',
    scheduleItemId = null
  }) => {
    // Clear old timer if any
    const currentTimer = get().activeTimer
    if (currentTimer) clearInterval(currentTimer)

    set({
      status: 'dialing',
      studentId,
      studentName,
      studentCode,
      studentStatus,
      attendanceStatus,
      className,
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
    const { studentId, studentName, className, duration, callLogs, scheduleItemId } = get()
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

    // Đồng bộ trực tiếp vào Hồ sơ Chăm sóc / CRM của Học viên & Phụ huynh (mockCareAlerts)
    let alertRecord = mockCareAlerts.find(
      (a) =>
        a.id === studentId ||
        a.studentId === studentId ||
        (studentName && a.studentName.toLowerCase().trim() === studentName.toLowerCase().trim())
    )

    if (!alertRecord) {
      alertRecord = {
        id: studentId,
        studentId: studentId,
        customerCode: `1080${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: studentName || 'Học viên',
        englishName: studentName.includes('(') ? studentName.split('(')[0].trim() : '',
        startDate: '01/09/2024',
        subject: 'Tiếng Anh',
        status: 'Đang học',
        level: 'Level 1',
        subLevel: 'A',
        classCode: className || 'Kindle SA1 Pre-K',
        teacherCode: 'GV_Sarah',
        schedule: 'T3, T5 (17:45 - 19:15)',
        totalSessions: 36,
        remainingSessions: 24,
        expectedEndDate: '31/12/2026',
        attendanceRatio: '100%',
        homeworkCompletion: 90,
        lastTestScore: 8.5,
        priorTestScore: 8.0,
        studentFolderLink: '',
        realtimeStatus: 'Đang học',
        learningResultsLink: '',
        csStaff: 'CS Phụ trách',
        callConfirmation: duration > 0 ? 'Đã gọi' : 'KNM',
        completedCareTags: [],
        studentNote: note,
        interactionLogs: [],
      }
      mockCareAlerts.unshift(alertRecord)
    }

    const careLogPayload = {
      staffName: 'CS / GV Điểm danh',
      callConfirmation: (duration > 0 ? 'Đã gọi' : 'KNM') as 'Đã gọi' | 'KNM',
      notes: note,
      parentOpinion: note.includes('Ý kiến PH:') ? note.split('Ý kiến PH:')[1].trim() : '',
      audioDuration: `${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`,
    }

    updateCareAlertInteraction(alertRecord.id, careLogPayload)

    // Bắn sự kiện CustomEvent thông báo cuộc gọi đã được lưu thành công
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rinov5:call-log-saved', {
          detail: {
            studentId,
            studentName,
            status,
            note,
            newLog,
          },
        })
      )
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
      studentCode: '',
      studentStatus: '',
      attendanceStatus: '',
      className: '',
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
      studentCode: '',
      studentStatus: '',
      attendanceStatus: '',
      className: '',
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
