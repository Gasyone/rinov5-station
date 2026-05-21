export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'audited' | 'cancelled' | 'rescheduled' | 'makeup'

export interface ClassSession {
  id: string
  code: string
  classId: string
  className: string
  classCode: string
  teacher: string
  substituteTeacher?: string
  date: string
  startTime: string
  endTime: string
  dayOfWeek: string
  room: string
  branch: string
  topic: string
  attended: number
  total: number
  status: SessionStatus
  notes?: string
  hasConflict: boolean
}

export const mockClassSessions: ClassSession[] = [
  { id: 'ses-001', code: 'SES-001', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-04', startTime: '18:00', endTime: '19:30', dayOfWeek: 'Thứ 2', room: 'A101', branch: 'RinoEdu Linh Đàm', topic: 'Reading: IELTS Format', attended: 12, total: 15, status: 'completed', hasConflict: false },
  { id: 'ses-002', code: 'SES-002', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-06', startTime: '18:00', endTime: '19:30', dayOfWeek: 'Thứ 4', room: 'A101', branch: 'RinoEdu Linh Đàm', topic: 'Writing: Task 1', attended: 10, total: 15, status: 'completed', notes: '5 HV vắng có phép', hasConflict: false },
  { id: 'ses-003', code: 'SES-003', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-08', startTime: '18:00', endTime: '19:30', dayOfWeek: 'Thứ 6', room: 'A101', branch: 'RinoEdu Linh Đàm', topic: 'Speaking: Part 1', attended: 0, total: 15, status: 'in_progress', hasConflict: false },
  { id: 'ses-004', code: 'SES-004', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-11', startTime: '18:00', endTime: '19:30', dayOfWeek: 'Thứ 2', room: 'A101', branch: 'RinoEdu Linh Đàm', topic: 'Listening: Section 3', attended: 0, total: 15, status: 'scheduled', hasConflict: false },
  { id: 'ses-005', code: 'SES-005', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Mai', substituteTeacher: 'Cô Mai', date: '2026-05-13', startTime: '18:00', endTime: '19:30', dayOfWeek: 'Thứ 4', room: 'A102', branch: 'RinoEdu Linh Đàm', topic: 'Reading: Matching', attended: 0, total: 15, status: 'scheduled', notes: 'Cô Lan nghỉ - dạy thay', hasConflict: false },
  { id: 'ses-006', code: 'SES-006', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-09', startTime: '15:00', endTime: '16:30', dayOfWeek: 'Thứ 7', room: 'A101', branch: 'RinoEdu Linh Đàm', topic: 'Ôn tập giữa kỳ', attended: 0, total: 15, status: 'makeup', hasConflict: false },
  { id: 'ses-007', code: 'SES-007', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-15', startTime: '18:00', endTime: '19:30', dayOfWeek: 'Thứ 6', room: 'A101', branch: 'RinoEdu Linh Đàm', topic: 'Writing: Task 2', attended: 0, total: 15, status: 'cancelled', notes: 'GV xin nghỉ ốm', hasConflict: false },

  { id: 'ses-010', code: 'SES-010', classId: 'c-ielts-b1', className: 'IELTS Junior 1B', classCode: 'IELTS-1B', teacher: 'Thầy Hùng', date: '2026-05-05', startTime: '17:00', endTime: '18:30', dayOfWeek: 'Thứ 3', room: 'B201', branch: 'RinoEdu Cầu Giấy', topic: 'Grammar: Conditionals', attended: 8, total: 12, status: 'audited', hasConflict: false },
  { id: 'ses-011', code: 'SES-011', classId: 'c-ielts-b1', className: 'IELTS Junior 1B', classCode: 'IELTS-1B', teacher: 'Thầy Hùng', date: '2026-05-07', startTime: '17:00', endTime: '18:30', dayOfWeek: 'Thứ 5', room: 'B201', branch: 'RinoEdu Cầu Giấy', topic: 'Vocabulary: Academic', attended: 0, total: 12, status: 'scheduled', hasConflict: false },
  { id: 'ses-012', code: 'SES-012', classId: 'c-ielts-b1', className: 'IELTS Junior 1B', classCode: 'IELTS-1B', teacher: 'Thầy Hùng', date: '2026-05-12', startTime: '17:00', endTime: '18:30', dayOfWeek: 'Thứ 3', room: 'B201', branch: 'RinoEdu Cầu Giấy', topic: 'Listening: Section 1', attended: 0, total: 12, status: 'scheduled', hasConflict: false },

  { id: 'ses-020', code: 'SES-020', classId: 'c-toeic-a2', className: 'TOEIC Foundation 2A', classCode: 'TOEIC-2A', teacher: 'Cô Hương', date: '2026-05-06', startTime: '19:00', endTime: '21:00', dayOfWeek: 'Thứ 4', room: 'C301', branch: 'RinoEdu Hà Đông', topic: 'Part 5: Incomplete Sentences', attended: 18, total: 20, status: 'completed', hasConflict: false },
  { id: 'ses-021', code: 'SES-021', classId: 'c-toeic-a2', className: 'TOEIC Foundation 2A', classCode: 'TOEIC-2A', teacher: 'Cô Hương', date: '2026-05-09', startTime: '19:00', endTime: '21:00', dayOfWeek: 'Thứ 7', room: 'C301', branch: 'RinoEdu Hà Đông', topic: 'Part 6: Text Completion', attended: 0, total: 20, status: 'rescheduled', notes: 'Phòng C301 bảo trì - dời sang T3', hasConflict: false },
  { id: 'ses-022', code: 'SES-022', classId: 'c-toeic-a2', className: 'TOEIC Foundation 2A', classCode: 'TOEIC-2A', teacher: 'Cô Hương', date: '2026-05-12', startTime: '19:00', endTime: '21:00', dayOfWeek: 'Thứ 3', room: 'C302', branch: 'RinoEdu Hà Đông', topic: 'Part 7: Reading', attended: 0, total: 20, status: 'scheduled', hasConflict: false },

  { id: 'ses-030', code: 'SES-030', classId: 'c-movers-2b', className: 'Movers 2B', classCode: 'MOV-2B', teacher: 'Cô Nga', date: '2026-05-04', startTime: '16:00', endTime: '17:30', dayOfWeek: 'Thứ 2', room: 'D401', branch: 'RinoEdu Thủ Đức', topic: 'Unit 5: Animals', attended: 9, total: 10, status: 'completed', hasConflict: false },
  { id: 'ses-031', code: 'SES-031', classId: 'c-movers-2b', className: 'Movers 2B', classCode: 'MOV-2B', teacher: 'Cô Nga', date: '2026-05-07', startTime: '16:00', endTime: '17:30', dayOfWeek: 'Thứ 5', room: 'D401', branch: 'RinoEdu Thủ Đức', topic: 'Unit 6: Food & Drinks', attended: 0, total: 10, status: 'in_progress', hasConflict: false },
  { id: 'ses-032', code: 'SES-032', classId: 'c-movers-2b', className: 'Movers 2B', classCode: 'MOV-2B', teacher: 'Cô Nga', date: '2026-05-11', startTime: '16:00', endTime: '17:30', dayOfWeek: 'Thứ 2', room: 'D401', branch: 'RinoEdu Thủ Đức', topic: 'Unit 7: Sports', attended: 0, total: 10, status: 'scheduled', hasConflict: false },

  { id: 'ses-040', code: 'SES-040', classId: 'c-ket-1c', className: 'KET Prep 1C', classCode: 'KET-1C', teacher: 'Thầy Quân', date: '2026-05-05', startTime: '18:30', endTime: '20:00', dayOfWeek: 'Thứ 3', room: 'E501', branch: 'RinoEdu Linh Đàm', topic: 'Reading: Multiple Choice', attended: 0, total: 12, status: 'scheduled', hasConflict: true },
  { id: 'ses-041', code: 'SES-041', classId: 'c-ket-1c', className: 'KET Prep 1C', classCode: 'KET-1C', teacher: 'Thầy Quân', date: '2026-05-08', startTime: '18:30', endTime: '20:00', dayOfWeek: 'Thứ 6', room: 'E501', branch: 'RinoEdu Linh Đàm', topic: 'Writing: Email', attended: 0, total: 12, status: 'scheduled', hasConflict: false },
]

export function getClassSessions(filters?: {
  search?: string
  branch?: string
  status?: string
  classId?: string
  teacher?: string
  dateFrom?: string
  dateTo?: string
}): ClassSession[] {
  return mockClassSessions.filter((s) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (
        !s.className.toLowerCase().includes(q) &&
        !s.code.toLowerCase().includes(q) &&
        !s.teacher.toLowerCase().includes(q) &&
        !s.topic.toLowerCase().includes(q) &&
        !s.room.toLowerCase().includes(q)
      ) return false
    }
    if (filters?.branch && s.branch !== filters.branch) return false
    if (filters?.status && filters.status !== 'all' && s.status !== filters.status) return false
    if (filters?.classId && s.classId !== filters.classId) return false
    if (filters?.teacher && !s.teacher.toLowerCase().includes(filters.teacher.toLowerCase())) return false
    if (filters?.dateFrom && s.date < filters.dateFrom) return false
    if (filters?.dateTo && s.date > filters.dateTo) return false
    return true
  })
}

export function getSessionCounts(sessions: ClassSession[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: sessions.length,
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    audited: 0,
    cancelled: 0,
    rescheduled: 0,
    makeup: 0,
  }
  for (const s of sessions) {
    if (counts[s.status] !== undefined) counts[s.status]++
  }
  return counts
}

export function getBranches(sessions: ClassSession[]): string[] {
  return [...new Set(sessions.map((s) => s.branch))].sort()
}

export function getTeachers(sessions: ClassSession[]): string[] {
  return [...new Set(sessions.map((s) => s.teacher))].sort()
}
