export type ClassCategory = 'nhap' | 'mo_chieu_sinh' | 'cho_khai_giang' | 'dang_hoc' | 'tam_dung' | 'huy'
export const CLASS_CATEGORIES: ClassCategory[] = ['nhap', 'mo_chieu_sinh', 'cho_khai_giang', 'dang_hoc', 'tam_dung', 'huy']

export const CLASS_LEVELS = ['IELTS', 'TOEIC', 'Beginner', 'English', 'Japanese', 'Movers', 'Flyers', 'KET Prep', 'PET Prep', 'Math Kindi', 'Math Primary']
export const CLASS_SUBJECTS = ['Toán', 'Tiếng Anh', 'Tiếng Việt']


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
  teacherName?: string
  isLeave?: boolean
  leaveReason?: string
}


export interface SubstituteTeacher {
  name: string
  date: string
  reason?: string
}

export interface TeacherHistoryEntry {
  name: string
  role: string
  startDate: string
  endDate?: string
  phone?: string
  reason?: string
  isCurrent: boolean
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
  lastSession?: NextSessionInfo
  learningPath?: string
  syllabus?: string
  trialStudents?: number
  classType?: 'Chính thức' | 'Workshop'
  classRatio?: string
  teacherType?: string
  assistant?: string
  assistantPhone?: string
  grade?: string
  attendanceRate?: number
  homeworkRate?: number
  avgTestScore?: number
  specialCareCount?: number
  newStudents?: number
  teacherHistory?: TeacherHistoryEntry[]
}

export const mockClassRecords: ClassRecord[] = [
  { id: 'cls-001', code: 'CLS-IELTS-001', name: 'IELTS Junior 1A', level: 'IELTS', subLevel: '5.0–5.5', learningPath: 'IELTS Foundation → Academic', syllabus: 'IELTS Junior v2.1', branch: 'RinoEdu Linh Đàm', teacher: 'Hoàng Thị Mai', teacherPhone: '0912 345 678', room: 'A101', schedule: 'T2/4/6 18:00–19:30', startDate: '2026-05-01', endDate: '2026-08-01', maxStudents: 20, enrolledStudents: 15, trialStudents: 2, status: 'dang_hoc', tuitionFee: 3500000, classType: 'Chính thức', classRatio: '1:7', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '02/06', startTime: '18:00', endTime: '19:30', room: 'A101' },
    { dayOfWeek: 'Thứ 4', date: '04/06', startTime: '18:00', endTime: '19:30', room: 'A101', teacherName: 'Phạm Mỹ Linh', isLeave: true, leaveReason: 'Xin nghỉ phép cá nhân từ 15/07' },
    { dayOfWeek: 'Thứ 6', date: '06/06', startTime: '18:00', endTime: '19:30', room: 'A101' },
  ], substituteTeachers: [{ name: 'Hoàng Thị Mai', date: '04/06', reason: 'Lê Thị Lan nghỉ ốm' }, { name: 'Trịnh Minh Đức', date: '06/06', reason: 'Lê Thị Lan có việc bận' }], nextSession: { date: '02/06/2026', time: '18:00–19:30', topic: 'Reading: IELTS Format', room: 'A101', status: 'upcoming' }, teacherHistory: [
    { name: 'Hoàng Thị Mai', role: 'Chủ nhiệm', startDate: '15/07/2026', phone: '0912 345 678', isCurrent: true },
    { name: 'Nguyễn Thị Hoa', role: 'GV Tiếng Anh', startDate: '01/01/2026', endDate: '15/07/2026', reason: 'Học viên dời sang lớp mới LD_TA_00019', isCurrent: false },
    { name: 'David Wilson', role: 'GV Bản ngữ', startDate: '01/01/2026', endDate: '30/04/2026', reason: 'Hoàn thành kỳ giảng dạy bản ngữ 4 tháng', isCurrent: false },
  ] },

  { id: 'cls-002', code: 'CLS-IELTS-002', name: 'IELTS Junior 1B', level: 'IELTS', subLevel: '5.5–6.0', learningPath: 'IELTS Foundation → Academic', syllabus: 'IELTS Junior v2.1', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Mạnh Hùng & Hoàng Thị Mai', teacherPhone: '0901234568', room: 'B201', schedule: 'T3/5 17:00–18:30', startDate: '2026-05-05', endDate: '2026-08-05', maxStudents: 15, enrolledStudents: 12, status: 'dang_hoc', tuitionFee: 3500000, classRatio: '1:7', teacherType: 'Native', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '03/06', startTime: '17:00', endTime: '18:30' },
    { dayOfWeek: 'Thứ 5', date: '05/06', startTime: '17:00', endTime: '18:30' },
  ], nextSession: { date: '03/06/2026', time: '17:00–18:30', topic: 'Writing: Task 1', room: 'B201', status: 'upcoming' }, teacherHistory: [
    { name: 'Nguyễn Mạnh Hùng', role: 'Chủ nhiệm', startDate: '05/05/2026', phone: '0901234568', isCurrent: true },
    { name: 'Hoàng Thị Mai', role: 'Trợ giảng', startDate: '05/05/2026', phone: '0901234580', isCurrent: true },
    { name: 'David Wilson', role: 'GV Bản ngữ', startDate: '01/01/2026', endDate: '04/05/2026', reason: 'Hoàn thành kỳ giảng dạy bản ngữ', isCurrent: false },
  ] },

  { id: 'cls-003', code: 'CLS-TOEIC-001', name: 'TOEIC Foundation 2A', level: 'TOEIC', subLevel: '450–550', learningPath: 'TOEIC Foundation → Advanced', syllabus: 'TOEIC Prep v3.0', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Thu Hương', teacherPhone: '0901234569', room: 'C301', schedule: 'T4/7 19:00–21:00', startDate: '2026-05-06', endDate: '2026-08-06', maxStudents: 25, enrolledStudents: 18, trialStudents: 1, status: 'tam_dung', tuitionFee: 2500000, classRatio: '1:10', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 4', date: '04/06', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 7', date: '07/06', startTime: '19:00', endTime: '21:00' },
  ], nextSession: { date: '04/06/2026', time: '19:00–21:00', topic: 'Part 5: Sentences', room: 'C301', status: 'in_progress' } },

  { id: 'cls-004', code: 'CLS-MOV-001', name: 'Movers 2B', level: 'Movers', subLevel: 'A1–A2', learningPath: 'Cambridge YLE Pathway', syllabus: 'Movers Starter v1.5', branch: 'RinoEdu Smart City', teacher: 'Trịnh Thúy Nga', teacherPhone: '0901234570', room: 'D401', schedule: 'T2/5 16:00–17:30', startDate: '2026-04-01', endDate: '2026-06-01', maxStudents: 12, enrolledStudents: 10, status: 'huy', tuitionFee: 2000000, classType: 'Workshop', classRatio: '1:12', teacherType: 'Native', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '01/06', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 5', date: '04/06', startTime: '16:00', endTime: '17:30' },
  ] },

  { id: 'cls-005', code: 'CLS-KET-001', name: 'KET Prep 1C', level: 'KET Prep', subLevel: 'A2', learningPath: 'Cambridge KET Pathway', syllabus: 'KET Preparation v2.0', branch: 'RinoEdu Linh Đàm', teacher: 'Trần Minh Quân', teacherPhone: '0901234571', room: 'Online', schedule: 'T3/6 18:30–20:00', startDate: '2026-06-01', endDate: '2026-09-01', maxStudents: 15, enrolledStudents: 5, status: 'mo_chieu_sinh', tuitionFee: 3000000, classRatio: '1:10', teacherType: 'Philippin', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '02/06', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 6', date: '05/06', startTime: '18:30', endTime: '20:00' },
  ], nextSession: { date: '02/06/2026', time: '18:30–20:00', topic: 'Reading: Practice', room: 'Online', status: 'upcoming' } },

  { id: 'cls-006', code: 'CLS-BEG-001', name: 'Tiếng Anh A1', level: 'Beginner', subLevel: 'A1', learningPath: 'General English Pathway', syllabus: '—', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Hoàng Thị Mai', teacherPhone: '0901234572', room: 'A102', schedule: 'T4/7 18:00–19:30', startDate: '2026-07-01', endDate: '2026-10-01', maxStudents: 25, enrolledStudents: 0, status: 'nhap', tuitionFee: 2000000, classRatio: '1:15', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 4', date: '01/07', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 7', date: '04/07', startTime: '18:00', endTime: '19:30' },
  ] },

  { id: 'cls-007', code: 'CLS-IELTS-003', name: 'IELTS 6.5 Advanced', level: 'IELTS', subLevel: '6.5–7.0', learningPath: 'IELTS Advanced → 8.0+', syllabus: 'IELTS Advance v4.0', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Trịnh Minh Đức', teacherPhone: '0901234573', room: 'C302', schedule: 'T2/4/6 20:00–21:30', startDate: '2026-03-01', endDate: '2026-05-01', maxStudents: 15, enrolledStudents: 14, status: 'huy', tuitionFee: 4500000, classRatio: '1:8', teacherType: 'Native', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '01/06', startTime: '20:00', endTime: '21:30' },
    { dayOfWeek: 'Thứ 4', date: '03/06', startTime: '20:00', endTime: '21:30' },
    { dayOfWeek: 'Thứ 6', date: '05/06', startTime: '20:00', endTime: '21:30' },
  ], lastSession: { date: '05/06/2026', time: '20:00–21:30', topic: 'Final Exam & Feedback', room: 'C302', status: 'in_progress' } },

  { id: 'cls-008', code: 'CLS-TOEIC-002', name: 'TOEIC B2', level: 'TOEIC', subLevel: '550–650', learningPath: 'TOEIC Foundation → Advanced', syllabus: 'TOEIC Prep v3.0', branch: 'RinoEdu Smart City', teacher: 'Lê Thị Lan', teacherPhone: '0901234567', room: 'D402', schedule: 'T3/5 19:00–21:00', startDate: '2026-06-15', endDate: '2026-09-15', maxStudents: 20, enrolledStudents: 3, status: 'huy', tuitionFee: 3000000, notes: 'Không đủ học viên', classRatio: '1:10', teacherType: 'Mix', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '16/06', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '19:00', endTime: '21:00' },
  ], lastSession: { date: '18/06/2026', time: '19:00–21:00', topic: 'Buổi tổng kết', room: 'D402', status: 'in_progress' } },

  { id: 'cls-009', code: 'CLS-FLY-001', name: 'Flyers 3A', level: 'Flyers', subLevel: 'A2–B1', learningPath: 'Cambridge YLE Pathway', syllabus: 'Flyers Complete v1.2', branch: 'RinoEdu Linh Đàm', teacher: 'Trịnh Thúy Nga', teacherPhone: '0901234570', room: 'A103', schedule: 'T2/4 16:00–17:30', startDate: '2026-06-10', endDate: '2026-09-10', maxStudents: 15, enrolledStudents: 8, status: 'mo_chieu_sinh', tuitionFee: 2200000, classRatio: '1:12', teacherType: 'Digital', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '08/06', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 4', date: '10/06', startTime: '16:00', endTime: '17:30' },
  ], substituteTeachers: [{ name: 'Lê Thị Lan', date: '10/06', reason: 'Trịnh Thúy Nga đi công tác' }], nextSession: { date: '08/06/2026', time: '16:00–17:30', topic: 'Unit 8: Animals', room: 'A103', status: 'upcoming' } },

  { id: 'cls-010', code: 'CLS-PET-001', name: 'PET Prep 1A', level: 'PET Prep', subLevel: 'B1', learningPath: 'Cambridge PET Pathway', syllabus: '—', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Mạnh Hùng', teacherPhone: '0901234568', room: 'B202', schedule: 'T5/7 18:00–19:30', startDate: '2026-07-15', endDate: '2026-10-15', maxStudents: 15, enrolledStudents: 0, status: 'cho_khai_giang', tuitionFee: 3200000, classRatio: '1:10', teacherType: 'Philippin', scheduleSlots: [
    { dayOfWeek: 'Thứ 5', date: '16/07', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 7', date: '18/07', startTime: '18:00', endTime: '19:30' },
  ] },

  // ── Nháp (đã điền dữ liệu cơ bản) ──
  { id: 'cls-011', code: 'CLS-IELTS-011', name: 'IELTS Writing Focus 1A', level: 'IELTS', subLevel: '5.5–6.0', branch: 'RinoEdu Linh Đàm', teacher: 'Trần Minh Quân', teacherPhone: '0901234571', room: 'A104', schedule: 'T3/5 18:30–20:00', startDate: '2026-09-01', endDate: '2026-12-01', maxStudents: 15, enrolledStudents: 0, status: 'nhap', tuitionFee: 3500000, syllabus: 'IELTS Junior v2.1', learningPath: 'IELTS Foundation → Academic', classRatio: '1:10', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '01/09', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 5', date: '03/09', startTime: '18:30', endTime: '20:00' },
  ] },
  { id: 'cls-012', code: 'CLS-TOEIC-012', name: 'TOEIC Listening 2A', level: 'TOEIC', subLevel: '450–550', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Thu Hương', teacherPhone: '0901234569', room: 'C302', schedule: 'T4/7 19:00–21:00', startDate: '2026-09-05', endDate: '2026-12-05', maxStudents: 20, enrolledStudents: 0, status: 'nhap', tuitionFee: 2500000, syllabus: 'TOEIC Prep v3.0', learningPath: 'TOEIC Foundation → Advanced', classRatio: '1:10', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 4', date: '05/09', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 7', date: '08/09', startTime: '19:00', endTime: '21:00' },
  ] },
  { id: 'cls-013', code: 'CLS-BEG-013', name: 'Tiếng Anh Giao Tiếp A2', level: 'Beginner', subLevel: 'A2', branch: 'RinoEdu Smart City', teacher: 'Hoàng Thị Mai', teacherPhone: '0901234580', room: 'D403', schedule: 'T2/4 16:00–17:30', startDate: '2026-09-10', endDate: '2026-12-10', maxStudents: 18, enrolledStudents: 0, status: 'nhap', tuitionFee: 2000000, syllabus: '—', learningPath: 'General English Pathway', classRatio: '1:12', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '10/09', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 4', date: '12/09', startTime: '16:00', endTime: '17:30' },
  ] },

  // ── Chờ khai giảng (thêm) ──
  { id: 'cls-014', code: 'CLS-KET-014', name: 'KET Prep 2A', level: 'KET Prep', subLevel: 'A2', branch: 'RinoEdu Linh Đàm', teacher: 'Lê Thị Lan', teacherPhone: '0901234567', room: 'A105', schedule: 'T3/6 18:30–20:00', startDate: '2026-08-05', endDate: '2026-11-05', maxStudents: 15, enrolledStudents: 10, trialStudents: 2, status: 'cho_khai_giang', tuitionFee: 3000000, syllabus: 'KET Preparation v2.0', learningPath: 'Cambridge KET Pathway', classRatio: '1:10', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '05/08', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 6', date: '08/08', startTime: '18:30', endTime: '20:00' },
  ] },
  { id: 'cls-015', code: 'CLS-MATH-015', name: 'Math Kindi 3A', level: 'Math Kindi', subLevel: 'Kindi', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Hoàng Nam', teacherPhone: '0912345678', room: 'M202', schedule: 'T7/CN 09:00–10:30', startDate: '2026-08-08', endDate: '2026-11-08', maxStudents: 15, enrolledStudents: 7, status: 'cho_khai_giang', tuitionFee: 2500000, grade: 'Lớp 1', syllabus: 'Station_Toán tư duy (Col 4 tuổi)', learningPath: 'Math Kindi → Primary 1', classRatio: '1:6', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 7', date: '08/08', startTime: '09:00', endTime: '10:30' },
    { dayOfWeek: 'Chủ nhật', date: '09/08', startTime: '09:00', endTime: '10:30' },
  ] },

  // ── Tạm nghỉ (thêm) ──
  { id: 'cls-016', code: 'CLS-TOEIC-016', name: 'TOEIC Reading 1B', level: 'TOEIC', subLevel: '550–650', branch: 'RinoEdu Smart City', teacher: 'Nguyễn Thu Hương', teacherPhone: '0901234569', room: 'D404', schedule: 'T3/5 19:00–21:00', startDate: '2026-03-01', endDate: '2026-08-01', maxStudents: 20, enrolledStudents: 14, trialStudents: 1, status: 'tam_dung', tuitionFee: 2500000, syllabus: 'TOEIC Prep v3.0', learningPath: 'TOEIC Foundation → Advanced', classRatio: '1:10', teacherType: 'Việt Nam', notes: 'Tạm nghỉ – GV chuyển cơ sở', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '16/06', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '19:00', endTime: '21:00' },
  ] },
  { id: 'cls-017', code: 'CLS-MOV-017', name: 'Movers 1C', level: 'Movers', subLevel: 'A1–A2', branch: 'RinoEdu Linh Đàm', teacher: 'Trịnh Thúy Nga', teacherPhone: '0901234570', room: 'A106', schedule: 'T2/5 16:00–17:30', startDate: '2026-02-15', endDate: '2026-07-15', maxStudents: 12, enrolledStudents: 8, status: 'tam_dung', tuitionFee: 2000000, syllabus: 'Movers Starter v1.5', learningPath: 'Cambridge YLE Pathway', classRatio: '1:12', teacherType: 'Việt Nam', notes: 'Tạm nghỉ – lịch thi học kỳ', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '15/06', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '16:00', endTime: '17:30' },
  ] },
  { id: 'cls-018', code: 'CLS-IELTS-018', name: 'IELTS Speaking Club 1A', level: 'IELTS', subLevel: '5.0–5.5', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Trịnh Minh Đức', teacherPhone: '0901234573', room: 'B205', schedule: 'T6 18:00–20:00', startDate: '2026-04-01', endDate: '2026-09-01', maxStudents: 10, enrolledStudents: 6, status: 'tam_dung', tuitionFee: 2000000, syllabus: 'IELTS Junior v2.1', learningPath: 'IELTS Foundation → Academic', classRatio: '1:5', teacherType: 'Native', notes: 'Tạm nghỉ – GV Native về nước', scheduleSlots: [
    { dayOfWeek: 'Thứ 6', date: '19/06', startTime: '18:00', endTime: '20:00' },
  ] },

  { id: 'cls-019', code: 'CLS-MATH-019', name: 'Math Kindi 1A', level: 'Math Kindi', subLevel: 'Kindi', branch: 'RinoEdu Linh Đàm', teacher: 'Nguyễn Hoàng Nam', teacherPhone: '0912345678', room: 'M101', schedule: 'T2/4 17:30–19:00', startDate: '2026-05-01', endDate: '2026-08-01', maxStudents: 15, enrolledStudents: 12, status: 'dang_hoc', tuitionFee: 2500000, grade: 'Lớp 1', syllabus: 'Station_Toán tư duy (Col 4 tuổi)', learningPath: 'Math Kindi → Primary 1', classRatio: '1:6', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '15/06', startTime: '17:30', endTime: '19:00' },
    { dayOfWeek: 'Thứ 4', date: '17/06', startTime: '17:30', endTime: '19:00' }
  ] },
  { id: 'cls-020', code: 'CLS-MATH-020', name: 'Math Kindi 1B', level: 'Math Kindi', subLevel: 'Kindi', branch: 'RinoEdu Linh Đàm', teacher: 'Nguyễn Hoàng Nam', teacherPhone: '0912345678', room: 'M102', schedule: 'T3/5 17:30–19:00', startDate: '2026-05-02', endDate: '2026-08-02', maxStudents: 15, enrolledStudents: 10, status: 'dang_hoc', tuitionFee: 2500000, grade: 'Lớp 1', syllabus: 'Station_Toán tư duy (Col 4 tuổi)', learningPath: 'Math Kindi → Primary 1', classRatio: '1:6', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '16/06', startTime: '17:30', endTime: '19:00' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '17:30', endTime: '19:00' }
  ] },
  { id: 'cls-021', code: 'CLS-MATH-021', name: 'Math Kindi 1C', level: 'Math Kindi', subLevel: 'Kindi', branch: 'RinoEdu Linh Đàm', teacher: 'Nguyễn Hoàng Nam', teacherPhone: '0912345678', room: 'M103', schedule: 'T6/CN 17:30–19:00', startDate: '2026-05-03', endDate: '2026-08-03', maxStudents: 15, enrolledStudents: 14, status: 'dang_hoc', tuitionFee: 2500000, grade: 'Lớp 1', syllabus: 'Station_Toán tư duy (Col 4 tuổi)', learningPath: 'Math Kindi → Primary 1', classRatio: '1:6', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 6', date: '19/06', startTime: '17:30', endTime: '19:00' },
    { dayOfWeek: 'Chủ nhật', date: '21/06', startTime: '17:30', endTime: '19:00' }
  ] },
  { id: 'cls-022', code: 'CLS-MATH-022', name: 'Math Primary 2A', level: 'Math Primary', subLevel: 'Primary', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Thị Hoa', teacherPhone: '0912345679', room: 'M201', schedule: 'T7 08:30–10:30', startDate: '2026-05-10', endDate: '2026-08-10', maxStudents: 20, enrolledStudents: 18, status: 'dang_hoc', tuitionFee: 2800000, grade: 'Lớp 2', syllabus: 'Toán tư duy (Eins 8 tuổi)', learningPath: 'Math Primary 1 → Primary 5', classRatio: '1:8', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 7', date: '20/06', startTime: '08:30', endTime: '10:30' }
  ] },
  { id: 'cls-023', code: 'CLS-MATH-023', name: 'Math Primary 3A', level: 'Math Primary', subLevel: 'Primary', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Nguyễn Mạnh Hùng', teacherPhone: '0901234568', room: 'M301', schedule: 'T3/5 18:30–20:00', startDate: '2026-05-15', endDate: '2026-08-15', maxStudents: 20, enrolledStudents: 15, status: 'dang_hoc', tuitionFee: 2800000, grade: 'Lớp 3', syllabus: 'Toán tư duy (Eins 8 tuổi)', learningPath: 'Math Primary 1 → Primary 5', classRatio: '1:8', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '16/06', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '18:30', endTime: '20:00' }
  ] },
  { id: 'cls-024', code: 'CLS-MATH-024', name: 'Math Primary 4A', level: 'Math Primary', subLevel: 'Primary', branch: 'RinoEdu Linh Đàm', teacher: 'Trịnh Thúy Nga', teacherPhone: '0901234570', room: 'M401', schedule: 'T2/6 18:30–20:00', startDate: '2026-05-20', endDate: '2026-08-20', maxStudents: 20, enrolledStudents: 10, status: 'dang_hoc', tuitionFee: 2800000, grade: 'Lớp 4', syllabus: 'Toán tư duy (Eins 8 tuổi)', learningPath: 'Math Primary 1 → Primary 5', classRatio: '1:8', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '15/06', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 6', date: '19/06', startTime: '18:30', endTime: '20:00' }
  ] },

  // ── Chờ khai giảng ──
  { id: 'cls-025', code: 'CLS-IELTS-025', name: 'IELTS Foundation 3A', level: 'IELTS', subLevel: '4.0–4.5', learningPath: 'IELTS Foundation → Academic', syllabus: 'IELTS Junior v2.1', branch: 'RinoEdu Linh Đàm', teacher: 'Lê Thị Lan', teacherPhone: '0901234567', room: 'A201', schedule: 'T2/4 18:00–19:30', startDate: '2026-08-15', endDate: '2026-11-15', maxStudents: 18, enrolledStudents: 6, trialStudents: 1, status: 'cho_khai_giang', tuitionFee: 3500000, classRatio: '1:7', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '15/08', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 4', date: '17/08', startTime: '18:00', endTime: '19:30' },
  ] },
  { id: 'cls-026', code: 'CLS-TOEIC-026', name: 'TOEIC Speaking 1A', level: 'TOEIC', subLevel: '550–650', learningPath: 'TOEIC Foundation → Advanced', syllabus: 'TOEIC Prep v3.0', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Trịnh Minh Đức', teacherPhone: '0901234573', room: 'C303', schedule: 'T3/5 19:00–21:00', startDate: '2026-08-01', endDate: '2026-11-01', maxStudents: 20, enrolledStudents: 8, status: 'cho_khai_giang', tuitionFee: 3000000, classRatio: '1:10', teacherType: 'Native', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '01/08', startTime: '19:00', endTime: '21:00' },
    { dayOfWeek: 'Thứ 5', date: '03/08', startTime: '19:00', endTime: '21:00' },
  ] },
  { id: 'cls-027', code: 'CLS-MATH-027', name: 'Math Primary 5A', level: 'Math Primary', subLevel: 'Primary', branch: 'RinoEdu Smart City', teacher: 'Nguyễn Thị Hoa', teacherPhone: '0912345679', room: 'M501', schedule: 'T7 09:00–11:00', startDate: '2026-08-10', endDate: '2026-11-10', maxStudents: 20, enrolledStudents: 5, status: 'cho_khai_giang', tuitionFee: 2800000, grade: 'Lớp 5', syllabus: 'Toán tư duy (Eins 8 tuổi)', learningPath: 'Math Primary 1 → Primary 5', classRatio: '1:8', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 7', date: '10/08', startTime: '09:00', endTime: '11:00' },
  ] },

  // ── Tạm nghỉ ──
  { id: 'cls-028', code: 'CLS-IELTS-028', name: 'IELTS Academic 2B', level: 'IELTS', subLevel: '6.0–6.5', learningPath: 'IELTS Advanced → 8.0+', syllabus: 'IELTS Advance v4.0', branch: 'RinoEdu Linh Đàm', teacher: 'Nguyễn Mạnh Hùng & Hoàng Thị Mai', teacherPhone: '0901234568', room: 'A102', schedule: 'T3/5 18:30–20:00', startDate: '2026-04-01', endDate: '2026-09-01', maxStudents: 15, enrolledStudents: 11, trialStudents: 1, status: 'tam_dung', tuitionFee: 4000000, classRatio: '1:8', teacherType: 'Việt Nam', notes: 'Tạm nghỉ do GV nghỉ phép dài hạn', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '16/06', startTime: '18:30', endTime: '20:00' },
    { dayOfWeek: 'Thứ 5', date: '18/06', startTime: '18:30', endTime: '20:00' },
  ] },
  { id: 'cls-029', code: 'CLS-FLY-029', name: 'Flyers 2B', level: 'Flyers', subLevel: 'A2–B1', learningPath: 'Cambridge YLE Pathway', syllabus: 'Flyers Complete v1.2', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Trịnh Thúy Nga', teacherPhone: '0901234570', room: 'B203', schedule: 'T2/4 16:00–17:30', startDate: '2026-03-15', endDate: '2026-08-15', maxStudents: 12, enrolledStudents: 9, status: 'tam_dung', tuitionFee: 2200000, classRatio: '1:12', teacherType: 'Native', notes: 'Tạm nghỉ hè – học viên đi du lịch', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '15/06', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 4', date: '17/06', startTime: '16:00', endTime: '17:30' },
  ] },
  { id: 'cls-030', code: 'CLS-MATH-030', name: 'Math Kindi 2A', level: 'Math Kindi', subLevel: 'Kindi', branch: 'RinoEdu Smart City', teacher: 'Nguyễn Hoàng Nam', teacherPhone: '0912345678', room: 'M104', schedule: 'T6/CN 09:00–10:30', startDate: '2026-04-10', endDate: '2026-09-10', maxStudents: 15, enrolledStudents: 7, status: 'tam_dung', tuitionFee: 2500000, grade: 'Lớp 1', syllabus: 'Station_Toán tư duy (Col 4 tuổi)', learningPath: 'Math Kindi → Primary 1', classRatio: '1:6', teacherType: 'Việt Nam', notes: 'Tạm nghỉ do sửa phòng học', scheduleSlots: [
    { dayOfWeek: 'Thứ 6', date: '19/06', startTime: '09:00', endTime: '10:30' },
    { dayOfWeek: 'Chủ nhật', date: '21/06', startTime: '09:00', endTime: '10:30' },
  ] },

  // ── Nháp (dữ liệu thực tế hơn) ──
  { id: 'cls-031', code: 'CLS-IELTS-031', name: 'IELTS Intensive 4A', level: 'IELTS', subLevel: '5.0–5.5', branch: 'RinoEdu Linh Đàm', teacher: 'Lê Thị Lan', teacherPhone: '0901234567', room: 'A103', schedule: 'T2/4/6 18:00–19:30', startDate: '2026-09-01', endDate: '2026-12-01', maxStudents: 18, enrolledStudents: 0, status: 'nhap', tuitionFee: 3500000, syllabus: 'IELTS Junior v2.1', learningPath: 'IELTS Foundation → Academic', classRatio: '1:7', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 2', date: '01/09', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 4', date: '03/09', startTime: '18:00', endTime: '19:30' },
    { dayOfWeek: 'Thứ 6', date: '05/09', startTime: '18:00', endTime: '19:30' },
  ] },
  { id: 'cls-032', code: 'CLS-MOV-032', name: 'Movers 3A', level: 'Movers', subLevel: 'A1–A2', branch: 'RinoEdu Nguyễn Tuân', teacher: 'Hoàng Thị Mai', teacherPhone: '0901234580', room: 'B204', schedule: 'T3/5 16:00–17:30', startDate: '2026-09-10', endDate: '2026-12-10', maxStudents: 12, enrolledStudents: 0, status: 'nhap', tuitionFee: 2000000, syllabus: 'Movers Starter v1.5', learningPath: 'Cambridge YLE Pathway', classRatio: '1:12', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 3', date: '10/09', startTime: '16:00', endTime: '17:30' },
    { dayOfWeek: 'Thứ 5', date: '12/09', startTime: '16:00', endTime: '17:30' },
  ] },
  { id: 'cls-033', code: 'CLS-MATH-033', name: 'Math Primary 1B', level: 'Math Primary', subLevel: 'Primary', branch: 'RinoEdu Smart City', teacher: 'Nguyễn Hoàng Nam', teacherPhone: '0912345678', room: 'M105', schedule: 'T7 14:00–16:00', startDate: '2026-09-15', endDate: '2026-12-15', maxStudents: 20, enrolledStudents: 0, status: 'nhap', tuitionFee: 2800000, grade: 'Lớp 1', syllabus: 'Station_Toán tư duy (Col 4 tuổi)', learningPath: 'Math Kindi → Primary 1', classRatio: '1:8', teacherType: 'Việt Nam', scheduleSlots: [
    { dayOfWeek: 'Thứ 7', date: '15/09', startTime: '14:00', endTime: '16:00' },
  ] },
]

