export type ClassCategory = 'nhap' | 'mo_chieu_sinh' | 'dang_hoc' | 'dong_lop' | 'huy'
export const CLASS_CATEGORIES: ClassCategory[] = ['nhap', 'mo_chieu_sinh', 'dang_hoc', 'dong_lop', 'huy']

export const CLASS_LEVELS = ['IELTS', 'TOEIC', 'Beginner', 'English', 'Japanese', 'Movers', 'Flyers', 'KET Prep', 'PET Prep']

export const CLASS_STATUS_LABELS: Record<ClassCategory, string> = {
  nhap: 'Nháp',
  mo_chieu_sinh: 'Mở chiêu sinh',
  dang_hoc: 'Đang học',
  dong_lop: 'Đóng lớp',
  huy: 'Hủy',
}

export interface ScheduleSlot {
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface SubstituteTeacher {
  name: string
  date: string
  reason?: string
}

export interface ClassRecord {
  id: string
  code: string
  name: string
  level: string
  branch: string
  teacher: string
  teacherPhone: string
  room: string
  schedule: string          // human-readable summary (legacy)
  scheduleSlots: ScheduleSlot[]  // structured schedule for display
  startDate: string
  endDate: string
  maxStudents: number
  enrolledStudents: number
  status: ClassCategory
  tuitionFee: number
  notes?: string
  substituteTeachers?: SubstituteTeacher[]
}

export const mockClassRecords: ClassRecord[] = [
  { id: 'cls-001', code: 'CLS-IELTS-001', name: 'IELTS Junior 1A', level: 'IELTS', branch: 'RinoEdu Linh Đàm', teacher: 'Cô Lan', teacherPhone: '0901234567', room: 'A101', schedule: 'T2/4/6 18:00–19:30', startDate: '2026-05-01', endDate: '2026-08-01', maxStudents: 20, enrolledStudents: 15, status: 'dang_hoc', tuitionFee: 3500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 2', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 4', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 6', startTime: '18:00', endTime: '19:30' },
  ], substituteTeachers: [{ name: 'Cô Mai', date: '2026-05-13', reason: 'Cô Lan nghỉ ốm' }] },

  { id: 'cls-002', code: 'CLS-IELTS-002', name: 'IELTS Junior 1B', level: 'IELTS', branch: 'RinoEdu Cầu Giấy', teacher: 'Thầy Hùng', teacherPhone: '0901234568', room: 'B201', schedule: 'T3/5 17:00–18:30', startDate: '2026-05-05', endDate: '2026-08-05', maxStudents: 15, enrolledStudents: 12, status: 'dang_hoc', tuitionFee: 3500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 3', startTime: '17:00', endTime: '18:30' },
    { dayOfWeek: 'Thứ 5', startTime: '17:00', endTime: '18:30' },
  ] },

  { id: 'cls-003', code: 'CLS-TOEIC-001', name: 'TOEIC Foundation 2A', level: 'TOEIC', branch: 'RinoEdu Hà Đông', teacher: 'Cô Hương', teacherPhone: '0901234569', room: 'C301', schedule: 'T4/7 19:00–21:00', startDate: '2026-05-06', endDate: '2026-08-06', maxStudents: 25, enrolledStudents: 18, status: 'dang_hoc', tuitionFee: 2500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 4', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 7', startTime: '19:00', endTime: '21:00' },
  ] },

  { id: 'cls-004', code: 'CLS-MOV-001', name: 'Movers 2B', level: 'Movers', branch: 'RinoEdu Thủ Đức', teacher: 'Cô Nga', teacherPhone: '0901234570', room: 'D401', schedule: 'T2/5 16:00–17:30', startDate: '2026-04-01', endDate: '2026-06-01', maxStudents: 12, enrolledStudents: 10, status: 'dong_lop', tuitionFee: 2000000, scheduleSlots: [
    { dayOfWeek: 'Thứ 2', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 5', startTime: '16:00', endTime: '17:30' },
  ] },

  { id: 'cls-005', code: 'CLS-KET-001', name: 'KET Prep 1C', level: 'KET Prep', branch: 'RinoEdu Linh Đàm', teacher: 'Thầy Quân', teacherPhone: '0901234571', room: 'E501', schedule: 'T3/6 18:30–20:00', startDate: '2026-06-01', endDate: '2026-09-01', maxStudents: 15, enrolledStudents: 5, status: 'mo_chieu_sinh', tuitionFee: 3000000, scheduleSlots: [
    { dayOfWeek: 'Thứ 3', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 6', startTime: '18:30', endTime: '20:00' },
  ] },

  { id: 'cls-006', code: 'CLS-BEG-001', name: 'Tiếng Anh A1', level: 'Beginner', branch: 'RinoEdu Cầu Giấy', teacher: 'Cô Mai', teacherPhone: '0901234572', room: 'A102', schedule: 'T4/7 18:00–19:30', startDate: '2026-07-01', endDate: '2026-10-01', maxStudents: 25, enrolledStudents: 0, status: 'nhap', tuitionFee: 2000000, scheduleSlots: [
    { dayOfWeek: 'Thứ 4', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 7', startTime: '18:00', endTime: '19:30' },
  ] },

  { id: 'cls-007', code: 'CLS-IELTS-003', name: 'IELTS 6.5 Advanced', level: 'IELTS', branch: 'RinoEdu Hà Đông', teacher: 'Thầy Đức', teacherPhone: '0901234573', room: 'C302', schedule: 'T2/4/6 20:00–21:30', startDate: '2026-03-01', endDate: '2026-05-01', maxStudents: 15, enrolledStudents: 14, status: 'dong_lop', tuitionFee: 4500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 2', startTime: '20:00', endTime: '21:30' },
    { dayOfWeek: 'Thứ 4', startTime: '20:00', endTime: '21:30' },
    { dayOfWeek: 'Thứ 6', startTime: '20:00', endTime: '21:30' },
  ] },

  { id: 'cls-008', code: 'CLS-TOEIC-002', name: 'TOEIC B2', level: 'TOEIC', branch: 'RinoEdu Thủ Đức', teacher: 'Cô Lan', teacherPhone: '0901234567', room: 'D402', schedule: 'T3/5 19:00–21:00', startDate: '2026-06-15', endDate: '2026-09-15', maxStudents: 20, enrolledStudents: 3, status: 'huy', tuitionFee: 3000000, notes: 'Không đủ học viên', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 5', startTime: '19:00', endTime: '21:00' },
  ] },

  { id: 'cls-009', code: 'CLS-FLY-001', name: 'Flyers 3A', level: 'Flyers', branch: 'RinoEdu Linh Đàm', teacher: 'Cô Nga', teacherPhone: '0901234570', room: 'A103', schedule: 'T2/4 16:00–17:30', startDate: '2026-06-10', endDate: '2026-09-10', maxStudents: 15, enrolledStudents: 8, status: 'mo_chieu_sinh', tuitionFee: 2200000, scheduleSlots: [
    { dayOfWeek: 'Thứ 2', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 4', startTime: '16:00', endTime: '17:30' },
  ], substituteTeachers: [{ name: 'Cô Lan', date: '2026-06-16', reason: 'Cô Nga đi công tác' }] },

  { id: 'cls-010', code: 'CLS-PET-001', name: 'PET Prep 1A', level: 'PET Prep', branch: 'RinoEdu Cầu Giấy', teacher: 'Thầy Hùng', teacherPhone: '0901234568', room: 'B202', schedule: 'T5/7 18:00–19:30', startDate: '2026-07-15', endDate: '2026-10-15', maxStudents: 15, enrolledStudents: 0, status: 'nhap', tuitionFee: 3200000, scheduleSlots: [
    { dayOfWeek: 'Thứ 5', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 7', startTime: '18:00', endTime: '19:30' },
  ] },
]
