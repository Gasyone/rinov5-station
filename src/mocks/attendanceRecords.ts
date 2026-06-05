export type AttendanceStatus = 'pending_review' | 'approved' | 'rejected' | 'no_attendance'
export type SessionAttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface AttendanceRecord {
  id: string
  sessionId: string
  sessionCode: string
  className: string
  branch: string
  teacher: string
  date: string
  sessionTime: string
  topic: string
  totalStudents: number
  present: number
  absent: number
  late: number
  excused: number
  submittedBy: string
  submittedAt: string
  status: AttendanceStatus
  hasConflict: boolean
}

export interface StudentAttendanceDetail {
  studentId: string
  studentName: string
  studentCode: string
  className: string
  sessionDate: string
  status: SessionAttendanceStatus
  note?: string
}

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'att-001', sessionId: 'ses-001', sessionCode: 'SES-001', className: 'IELTS Junior 1A', branch: 'RinoEdu Linh Đàm', teacher: 'Cô Lan', date: '2026-05-04', sessionTime: '18:00-19:30', topic: 'Reading: IELTS Format', totalStudents: 15, present: 12, absent: 2, late: 1, excused: 0, submittedBy: 'Cô Lan', submittedAt: '2026-05-04 19:45', status: 'approved', hasConflict: false },
  { id: 'att-002', sessionId: 'ses-002', sessionCode: 'SES-002', className: 'IELTS Junior 1A', branch: 'RinoEdu Linh Đàm', teacher: 'Cô Lan', date: '2026-05-06', sessionTime: '18:00-19:30', topic: 'Writing: Task 1', totalStudents: 15, present: 10, absent: 4, late: 1, excused: 0, submittedBy: 'Cô Lan', submittedAt: '2026-05-06 19:50', status: 'approved', hasConflict: false },
  { id: 'att-003', sessionId: 'ses-010', sessionCode: 'SES-010', className: 'IELTS Junior 1B', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Thầy Hùng', date: '2026-05-05', sessionTime: '17:00-18:30', topic: 'Grammar: Conditionals', totalStudents: 12, present: 8, absent: 3, late: 1, excused: 0, submittedBy: 'Thầy Hùng', submittedAt: '2026-05-05 18:40', status: 'pending_review', hasConflict: false },
  { id: 'att-004', sessionId: 'ses-020', sessionCode: 'SES-020', className: 'TOEIC Foundation 2A', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Cô Hương', date: '2026-05-06', sessionTime: '19:00-21:00', topic: 'Part 5: Incomplete Sentences', totalStudents: 20, present: 18, absent: 1, late: 0, excused: 1, submittedBy: 'Cô Hương', submittedAt: '2026-05-06 21:15', status: 'approved', hasConflict: false },
  { id: 'att-005', sessionId: 'ses-030', sessionCode: 'SES-030', className: 'Movers 2B', branch: 'RinoEdu Smart City', teacher: 'Cô Nga', date: '2026-05-04', sessionTime: '16:00-17:30', topic: 'Unit 5: Animals', totalStudents: 10, present: 9, absent: 0, late: 1, excused: 0, submittedBy: 'Cô Nga', submittedAt: '2026-05-04 17:40', status: 'pending_review', hasConflict: false },
  { id: 'att-006', sessionId: 'ses-031', sessionCode: 'SES-031', className: 'Movers 2B', branch: 'RinoEdu Smart City', teacher: 'Cô Nga', date: '2026-05-07', sessionTime: '16:00-17:30', topic: 'Unit 6: Food & Drinks', totalStudents: 10, present: 0, absent: 0, late: 0, excused: 0, submittedBy: '', submittedAt: '', status: 'no_attendance', hasConflict: false },
  { id: 'att-007', sessionId: 'ses-040', sessionCode: 'SES-040', className: 'KET Prep 1C', branch: 'RinoEdu Linh Đàm', teacher: 'Thầy Quân', date: '2026-05-05', sessionTime: '18:30-20:00', topic: 'Reading: Multiple Choice', totalStudents: 12, present: 7, absent: 5, late: 0, excused: 0, submittedBy: 'Thầy Quân', submittedAt: '2026-05-05 20:10', status: 'rejected', hasConflict: true },
  { id: 'att-008', sessionId: 'ses-011', sessionCode: 'SES-011', className: 'IELTS Junior 1B', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Thầy Hùng', date: '2026-05-07', sessionTime: '17:00-18:30', topic: 'Vocabulary: Academic', totalStudents: 12, present: 0, absent: 0, late: 0, excused: 0, submittedBy: '', submittedAt: '', status: 'no_attendance', hasConflict: false },
]

export function getAttendanceRecords(filters?: {
  search?: string
  branch?: string
  status?: string
  teacher?: string
}): AttendanceRecord[] {
  return mockAttendanceRecords.filter((r) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (
        !r.className.toLowerCase().includes(q) &&
        !r.sessionCode.toLowerCase().includes(q) &&
        !r.teacher.toLowerCase().includes(q) &&
        !r.topic.toLowerCase().includes(q)
      ) return false
    }
    if (filters?.branch && r.branch !== filters.branch) return false
    if (filters?.status && filters.status !== 'all' && r.status !== filters.status) return false
    if (filters?.teacher && !r.teacher.toLowerCase().includes(filters.teacher.toLowerCase())) return false
    return true
  })
}

export function getAttendanceCounts(records: AttendanceRecord[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: records.length,
    pending_review: 0,
    approved: 0,
    rejected: 0,
    no_attendance: 0,
  }
  for (const r of records) {
    if (counts[r.status] !== undefined) counts[r.status]++
  }
  return counts
}

export function getAttendanceBranches(records: AttendanceRecord[]): string[] {
  return [...new Set(records.map((r) => r.branch))].sort()
}

export function getAttendanceTeachers(records: AttendanceRecord[]): string[] {
  return [...new Set(records.map((r) => r.teacher))].filter(Boolean).sort()
}
