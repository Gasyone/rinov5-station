export type ClassCategory = 'nhap' | 'mo_chieu_sinh' | 'cho_khai_giang' | 'dang_hoc' | 'tam_dung' | 'huy'
export const CLASS_CATEGORIES: ClassCategory[] = ['nhap', 'mo_chieu_sinh', 'cho_khai_giang', 'dang_hoc', 'tam_dung', 'huy']

export const CLASS_LEVELS = ['IELTS', 'TOEIC', 'Beginner', 'English', 'Japanese', 'Movers', 'Flyers', 'KET Prep', 'PET Prep']

export const CLASS_STATUS_LABELS: Record<ClassCategory, string> = {
  nhap: 'Nháp',
  mo_chieu_sinh: 'Mở chiêu sinh',
  cho_khai_giang: 'Chờ khai giảng',
  dang_hoc: 'Đang học',
  tam_dung: 'Tạm nghỉ',
  huy: 'Đã kết thúc',
}

export interface ScheduleSlot {
  dayOfWeek: string
  date: string
  startTime: string
  endTime: string
  teachers?: string[]
  room?: string
}


export interface SubstituteTeacher {
  name: string
  date: string
  reason?: string
}

export interface NextSessionInfo {
  date: string
  time: string
  topic?: string
  room?: string
  status: 'upcoming' | 'in_progress'
}

export interface ClassRecord {
  id: string
  code: string
  name: string
  level: string
  subLevel?: string
  branch: string
  teacher: string
  teacherPhone: string
  room: string
  schedule: string
  scheduleSlots: ScheduleSlot[]
  startDate: string
  endDate: string
  maxStudents: number
  enrolledStudents: number
  status: ClassCategory
  tuitionFee: number
  notes?: string
  substituteTeachers?: SubstituteTeacher[]
  nextSession?: NextSessionInfo
  learningPath?: string
  syllabus?: string
  trialStudents?: number
  classType?: 'Chính thức' | 'Workshop'
  classRatio?: string
  teacherType?: string
  assistant?: string
  assistantPhone?: string
}

export const mockClassRecords: ClassRecord[] = [
  { id: 'cls-001', code: 'CLS-IELTS-001', name: 'IELTS Junior 1A', level: 'IELTS', subLevel: '5.0–5.5', learningPath: 'IELTS Foundation → Academic', syllabus: 'IELTS Junior v2.1', branch: 'RinoEdu Linh Đàm', teacher: 'Cô Lan', teacherPhone: '0901234567', room: 'A101', schedule: 'T2/4/6 18:00–19:30', startDate: '2026-05-01', endDate: '2026-08-01', maxStudents: 20, enrolledStudents: 15, trialStudents: 2, status: 'dang_hoc', tuitionFee: 3500000, classType: 'Chính thức', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '02/06', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 4', date: '04/06', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 6', date: '06/06', startTime: '18:00', endTime: '19:30' },
  ], substituteTeachers: [{ name: 'Cô Mai', date: '04/06', reason: 'Cô Lan nghỉ ốm' }], nextSession: { date: '02/06/2026', time: '18:00–19:30', topic: 'Reading: IELTS Format', room: 'A101', status: 'upcoming' } },

  { id: 'cls-002', code: 'CLS-IELTS-002', name: 'IELTS Junior 1B', level: 'IELTS', subLevel: '5.5–6.0', learningPath: 'IELTS Foundation → Academic', syllabus: 'IELTS Junior v2.1', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Thầy Hùng', teacherPhone: '0901234568', room: 'B201', schedule: 'T3/5 17:00–18:30', startDate: '2026-05-05', endDate: '2026-08-05', maxStudents: 15, enrolledStudents: 12, status: 'dang_hoc', tuitionFee: 3500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '03/06', startTime: '17:00', endTime: '18:30' },
    { dayOfWeek: 'Thứ 5', date: '05/06', startTime: '17:00', endTime: '18:30' },
  ], nextSession: { date: '03/06/2026', time: '17:00–18:30', topic: 'Writing: Task 1', room: 'B201', status: 'upcoming' } },

  { id: 'cls-003', code: 'CLS-TOEIC-001', name: 'TOEIC Foundation 2A', level: 'TOEIC', subLevel: '450–550', learningPath: 'TOEIC Foundation → Advanced', syllabus: 'TOEIC Prep v3.0', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Cô Hương', teacherPhone: '0901234569', room: 'C301', schedule: 'T4/7 19:00–21:00', startDate: '2026-05-06', endDate: '2026-08-06', maxStudents: 25, enrolledStudents: 18, trialStudents: 1, status: 'tam_dung', tuitionFee: 2500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 4', date: '04/06', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 7', date: '07/06', startTime: '19:00', endTime: '21:00' },
  ], nextSession: { date: '04/06/2026', time: '19:00–21:00', topic: 'Part 5: Sentences', room: 'C301', status: 'in_progress' } },

  { id: 'cls-004', code: 'CLS-MOV-001', name: 'Movers 2B', level: 'Movers', subLevel: 'A1–A2', learningPath: 'Cambridge YLE Pathway', syllabus: 'Movers Starter v1.5', branch: 'RinoEdu Smart City', teacher: 'Cô Nga', teacherPhone: '0901234570', room: 'D401', schedule: 'T2/5 16:00–17:30', startDate: '2026-04-01', endDate: '2026-06-01', maxStudents: 12, enrolledStudents: 10, status: 'huy', tuitionFee: 2000000, classType: 'Workshop', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '01/06', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 5', date: '04/06', startTime: '16:00', endTime: '17:30' },
  ] },

  { id: 'cls-005', code: 'CLS-KET-001', name: 'KET Prep 1C', level: 'KET Prep', subLevel: 'A2', learningPath: 'Cambridge KET Pathway', syllabus: 'KET Preparation v2.0', branch: 'RinoEdu Linh Đàm', teacher: 'Thầy Quân', teacherPhone: '0901234571', room: 'E501', schedule: 'T3/6 18:30–20:00', startDate: '2026-06-01', endDate: '2026-09-01', maxStudents: 15, enrolledStudents: 5, status: 'mo_chieu_sinh', tuitionFee: 3000000, scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '02/06', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 6', date: '05/06', startTime: '18:30', endTime: '20:00' },
  ], nextSession: { date: '02/06/2026', time: '18:30–20:00', topic: 'Reading: Practice', room: 'E501', status: 'upcoming' } },

  { id: 'cls-006', code: 'CLS-BEG-001', name: 'Tiếng Anh A1', level: 'Beginner', subLevel: 'A1', learningPath: 'General English Pathway', syllabus: '—', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Cô Mai', teacherPhone: '0901234572', room: 'A102', schedule: 'T4/7 18:00–19:30', startDate: '2026-07-01', endDate: '2026-10-01', maxStudents: 25, enrolledStudents: 0, status: 'nhap', tuitionFee: 2000000, scheduleSlots: [
    { dayOfWeek: 'Thứ 4', date: '01/07', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 7', date: '04/07', startTime: '18:00', endTime: '19:30' },
  ] },

  { id: 'cls-007', code: 'CLS-IELTS-003', name: 'IELTS 6.5 Advanced', level: 'IELTS', subLevel: '6.5–7.0', learningPath: 'IELTS Advanced → 8.0+', syllabus: 'IELTS Advance v4.0', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Thầy Đức', teacherPhone: '0901234573', room: 'C302', schedule: 'T2/4/6 20:00–21:30', startDate: '2026-03-01', endDate: '2026-05-01', maxStudents: 15, enrolledStudents: 14, status: 'huy', tuitionFee: 4500000, scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '01/06', startTime: '20:00', endTime: '21:30' },
    { dayOfWeek: 'Thứ 4', date: '03/06', startTime: '20:00', endTime: '21:30' },
    { dayOfWeek: 'Thứ 6', date: '05/06', startTime: '20:00', endTime: '21:30' },
  ] },

  { id: 'cls-008', code: 'CLS-TOEIC-002', name: 'TOEIC B2', level: 'TOEIC', subLevel: '550–650', learningPath: 'TOEIC Foundation → Advanced', syllabus: 'TOEIC Prep v3.0', branch: 'RinoEdu Smart City', teacher: 'Cô Lan', teacherPhone: '0901234567', room: 'D402', schedule: 'T3/5 19:00–21:00', startDate: '2026-06-15', endDate: '2026-09-15', maxStudents: 20, enrolledStudents: 3, status: 'huy', tuitionFee: 3000000, notes: 'Không đủ học viên', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '16/06', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '19:00', endTime: '21:00' },
  ] },

  { id: 'cls-009', code: 'CLS-FLY-001', name: 'Flyers 3A', level: 'Flyers', subLevel: 'A2–B1', learningPath: 'Cambridge YLE Pathway', syllabus: 'Flyers Complete v1.2', branch: 'RinoEdu Linh Đàm', teacher: 'Cô Nga', teacherPhone: '0901234570', room: 'A103', schedule: 'T2/4 16:00–17:30', startDate: '2026-06-10', endDate: '2026-09-10', maxStudents: 15, enrolledStudents: 8, status: 'mo_chieu_sinh', tuitionFee: 2200000, scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '08/06', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 4', date: '10/06', startTime: '16:00', endTime: '17:30' },
  ], substituteTeachers: [{ name: 'Cô Lan', date: '10/06', reason: 'Cô Nga đi công tác' }], nextSession: { date: '08/06/2026', time: '16:00–17:30', topic: 'Unit 8: Animals', room: 'A103', status: 'upcoming' } },

  { id: 'cls-010', code: 'CLS-PET-001', name: 'PET Prep 1A', level: 'PET Prep', subLevel: 'B1', learningPath: 'Cambridge PET Pathway', syllabus: '—', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Thầy Hùng', teacherPhone: '0901234568', room: 'B202', schedule: 'T5/7 18:00–19:30', startDate: '2026-07-15', endDate: '2026-10-15', maxStudents: 15, enrolledStudents: 0, status: 'cho_khai_giang', tuitionFee: 3200000, scheduleSlots: [
    { dayOfWeek: 'Thứ 5', date: '16/07', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 7', date: '18/07', startTime: '18:00', endTime: '19:30' },
  ] },

  { id: 'cls-011', code: 'CLS-DRAFT-011', name: 'Lớp Nháp Chưa Có Lộ Trình', level: 'Beginner', subLevel: 'A1', branch: 'RinoEdu Linh Đàm', teacher: 'Thầy Quân', teacherPhone: '0901234571', room: '—', schedule: 'Chưa gán lịch', startDate: '2026-06-05', endDate: '2026-09-05', maxStudents: 15, enrolledStudents: 0, status: 'nhap', tuitionFee: 0, syllabus: '', learningPath: '', trialStudents: 0, scheduleSlots: [] },
]
