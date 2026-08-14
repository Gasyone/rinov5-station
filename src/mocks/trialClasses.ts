export type TrialClassStatus =
  | 'pending_approval'
  | 'rejected'
  | 'confirmed'
  | 'reschedule'
  | 'cancelled'
  | 'no_show'
  | 'completed'

export interface TrialClassTeacherFeedback {
  rating: number
  strengths: string[]
  weaknesses: string[]
  comment: string
  recommendedLevel: string
  resultLink?: string
}

export interface TrialClassAuditLog {
  timestamp: string
  author: string
  action: string
  detail?: string
}

export interface ClassSessionInfo {
  sessionId: string
  sessionName: string
  date: string
  time: string
  currentAttendees: number
  maxCapacity: number
  isFull: boolean
}

export interface TrialClassNote {
  text: string
  author: string
  timestamp: string
}

export interface TrialClassFamilyMember {
  name: string
  phone: string
  isPrimary?: boolean
}

export interface TrialClass {
  id: string
  trialName: string
  customerId: string
  studentName: string
  parentName: string
  familyName: string
  familyPhone: string
  familyMembers?: TrialClassFamilyMember[]
  attempt: string
  school: string
  program: string
  subject: string
  classType?: string
  sessions: Array<{ className: string; classId: string; sessionName: string; sessionId: string; trialDate: string }>
  creator: string
  owner: string
  status: TrialClassStatus
  branch: string
  notes: string
  auditLog: TrialClassAuditLog[]
  feedback?: TrialClassTeacherFeedback
  internalNotes?: TrialClassNote[]
  cancelReason?: string
  previousSession?: { className: string; classId: string; sessionName: string; sessionId: string; trialDate: string }
}

export const MOCK_TRIAL_CLASSES: TrialClass[] = [
  {
    id: 'TR-2605-006',
    trialName: 'Học thử Cambridge Movers',
    customerId: 'KH-10318',
    studentName: 'Bùi Hoàng Phúc',
    parentName: 'Bùi Văn Đức',
    familyName: 'Gia đình Bùi',
    familyPhone: '0866 789 012',
    attempt: 'Lần 1',
    school: 'RinoEdu Smart City',
    program: 'Cambridge Movers',
    subject: 'Tiếng Anh',
    sessions: [],
    creator: 'Minh Quân',
    owner: 'Ms. Sarah',
    status: 'pending_approval',
    branch: 'RinoEdu Smart City',
    notes: 'Chưa chọn lớp, cần giáo vụ ghép',
    auditLog: [
      { timestamp: '2026-05-18 09:30', author: 'Minh Quân', action: 'Tạo booking', detail: 'Chưa chọn lớp dự kiến' },
    ],
  },
  {
    id: 'TR-2605-001',
    trialName: 'Học thử Cambridge Starter - Ca tối',
    customerId: 'KH-10248',
    studentName: 'Nguyễn Minh Anh',
    parentName: 'Nguyễn Thị Lan',
    familyName: 'Gia đình Nguyễn',
    familyPhone: '0912 345 678',
    familyMembers: [
      { name: 'Nguyễn Thị Lan (Mẹ)', phone: '0912 345 678', isPrimary: true },
      { name: 'Nguyễn Văn Hòa (Bố)', phone: '0988 111 222' },
    ],
    attempt: 'Lần 1',
    school: 'RinoEdu Nguyễn Tuân',
    program: 'Cambridge Starter',
    subject: 'Tiếng Anh',
    sessions: [
      { className: 'Cambridge Starter A1', classId: 'CLS-001', sessionName: 'Starter S1', sessionId: 'SESS-9901', trialDate: '2026-05-20 18:00' },
    ],
    creator: 'Lan Anh',
    owner: 'Ms. Sarah',
    status: 'pending_approval',
    branch: 'RinoEdu Nguyễn Tuân',
    notes: 'Bé nhút nhát, cần GV kiên nhẫn',
    auditLog: [
      { timestamp: '2026-05-17 10:00', author: 'Lan Anh', action: 'Tạo booking', detail: 'Ghi nhận nhu cầu học thử' },
    ],
  },
  {
    id: 'TR-2605-008',
    trialName: 'Học thử Communication Kids',
    customerId: 'KH-10335',
    studentName: 'Hoàng Gia Bảo',
    parentName: 'Hoàng Thị Nga',
    familyName: 'Gia đình Hoàng',
    familyPhone: '0901 567 890',
    attempt: 'Lần 1',
    school: 'RinoEdu Nguyễn Tuân',
    program: 'Communication Kids',
    subject: 'Tiếng Anh',
    sessions: [{ className: 'Communication Kids C1', classId: 'CLS-009', sessionName: 'Comm C1', sessionId: 'SESS-9008', trialDate: '2026-05-28 18:00' }],
    creator: 'Lan Anh',
    owner: 'Ms. Anna',
    status: 'pending_approval',
    branch: 'RinoEdu Nguyễn Tuân',
    notes: 'Phụ huynh muốn con thử trước khi đăng ký khóa dài hạn',
    auditLog: [
      { timestamp: '2026-05-22 10:00', author: 'Lan Anh', action: 'Tạo booking' },
      { timestamp: '2026-05-22 15:00', author: 'Lan Anh', action: 'Chọn buổi học', detail: 'Comm C1 - 28/05/2026 18:00' },
    ],
  },
  {
    id: 'TR-2605-009',
    trialName: 'Học thử STEM Coding',
    customerId: 'KH-10342',
    studentName: 'Trương Minh Khang',
    parentName: 'Trương Văn Dũng',
    familyName: 'Gia đình Trương',
    familyPhone: '0978 234 567',
    attempt: 'Lần 1',
    school: 'RinoEdu Smart City',
    program: 'STEM Coding',
    subject: 'STEM',
    sessions: [{ className: 'STEM Coding C1', classId: 'CLS-010', sessionName: 'Coding C1', sessionId: 'SESS-9009', trialDate: '2026-05-29 19:15' }],
    creator: 'Minh Quân',
    owner: 'Mr. David',
    status: 'pending_approval',
    branch: 'RinoEdu Smart City',
    notes: '',
    auditLog: [
      { timestamp: '2026-05-23 09:00', author: 'Minh Quân', action: 'Tạo booking' },
      { timestamp: '2026-05-23 14:30', author: 'Minh Quân', action: 'Chọn buổi học', detail: 'Coding C1 - 29/05/2026 19:15' },
    ],
  },
  {
    id: 'TR-2605-010',
    trialName: 'Học thử IELTS Starter',
    customerId: 'KH-10355',
    studentName: 'Lê Chi',
    parentName: 'Lê Văn C',
    familyName: 'Gia đình Lê Chi',
    familyPhone: '0955555555',
    familyMembers: [
      { name: 'Lê Văn C (Bố)', phone: '0955555555', isPrimary: true },
      { name: 'Nguyễn Thị D (Mẹ)', phone: '0955667788' }
    ],
    attempt: 'Lần 1',
    school: 'RinoEdu Nguyễn Tuân',
    program: 'IELTS Starter',
    subject: 'Tiếng Anh',
    sessions: [{ className: 'IELTS Starter A1', classId: 'CLS-011', sessionName: 'Flyers F1', sessionId: 'SESS-11001', trialDate: '2026-05-28 18:30' }],
    creator: 'Lan Anh',
    owner: 'Ms. Sarah',
    status: 'pending_approval',
    branch: 'RinoEdu Nguyễn Tuân',
    notes: 'Học viên bảo lưu muốn học thử lại để đánh giá xếp lớp mới',
    auditLog: [
      { timestamp: '2026-05-24 10:00', author: 'Lan Anh', action: 'Tạo booking' }
    ],
  },
  {
    id: 'TR-2605-002',
    trialName: 'Học thử STEM Robotics',
    customerId: 'KH-10261',
    studentName: 'Trần Bảo Nam',
    parentName: 'Trần Văn Hùng',
    familyName: 'Gia đình Trần',
    familyPhone: '0987 654 321',
    familyMembers: [
      { name: 'Trần Văn Hùng (Bố)', phone: '0987 654 321', isPrimary: true },
      { name: 'Lê Thị Mai (Mẹ)', phone: '0938 222 333' },
      { name: 'Bà ngoại', phone: '0903 456 789' },
    ],
    attempt: 'Lần 1',
    school: 'RinoEdu Smart City',
    program: 'STEM Robotics',
    subject: 'STEM',
    sessions: [{ className: 'STEM Robotics S1', classId: 'CLS-002', sessionName: 'Robo Level 1', sessionId: 'SESS-9902', trialDate: '2026-05-21 19:30' }],
    creator: 'Minh Quân',
    owner: 'Mr. David',
    status: 'confirmed',
    branch: 'RinoEdu Smart City',
    notes: '',
    auditLog: [
      { timestamp: '2026-05-16 09:00', author: 'Minh Quân', action: 'Tạo booking' },
      { timestamp: '2026-05-16 14:30', author: 'Mr. David', action: 'Ghép lớp', detail: 'Ghép vào STEM Robotics S1 - Session Robo Level 1' },
    ],
  },
  {
    id: 'TR-2605-005',
    trialName: 'Học thử IELTS Junior',
    customerId: 'KH-10304',
    studentName: 'Đỗ Khánh Linh',
    parentName: 'Đỗ Thị Mai',
    familyName: 'Gia đình Đỗ',
    familyPhone: '0977 321 654',
    attempt: 'Lần 1',
    school: 'RinoEdu Linh Đàm',
    program: 'IELTS Junior',
    subject: 'Tiếng Anh',
    sessions: [{ className: 'IELTS Junior J1', classId: 'CLS-005', sessionName: 'IELTS J1', sessionId: 'SESS-9905', trialDate: '2026-05-18 09:00' }],
    creator: 'Thanh Vân',
    owner: 'Ms. Anna',
    status: 'confirmed',
    branch: 'RinoEdu Linh Đàm',
    notes: '',
    auditLog: [
      { timestamp: '2026-05-10 11:00', author: 'Thanh Vân', action: 'Tạo booking' },
    ],
  },
  {
    id: 'TR-2605-004',
    trialName: 'Học thử Math Thinking',
    customerId: 'KH-10289',
    studentName: 'Phạm Đức Minh',
    parentName: 'Phạm Văn Thanh',
    familyName: 'Gia đình Phạm',
    familyPhone: '0933 456 789',
    attempt: 'Lần 1',
    school: 'RinoEdu Nguyễn Tuân',
    program: 'Math Thinking',
    subject: 'Toán',
    sessions: [{ className: 'Math Thinking M1', classId: 'CLS-004', sessionName: 'Thinking M1', sessionId: 'SESS-9904', trialDate: '2026-05-22 18:45' }],
    creator: 'Lan Anh',
    owner: 'Mr. Robert',
    status: 'reschedule',
    branch: 'RinoEdu Nguyễn Tuân',
    notes: 'Phụ huynh xin đổi lịch do bận việc gia đình',
    auditLog: [
      { timestamp: '2026-05-15 08:00', author: 'Lan Anh', action: 'Tạo booking' },
      { timestamp: '2026-05-15 14:00', author: 'Mr. Robert', action: 'Ghép lớp' },
      { timestamp: '2026-05-19 10:00', author: 'Lan Anh', action: 'Yêu cầu đổi lịch', detail: 'Phụ huynh báo bận' },
    ],
  },
  {
    id: 'TR-2605-003',
    trialName: 'Học thử English Foundation',
    customerId: 'KH-10273',
    studentName: 'Nguyễn An',
    parentName: 'Nguyễn Văn A',
    familyName: 'Gia đình Nguyễn',
    familyPhone: '0922222222',
    attempt: 'Lần 2',
    school: 'RinoEdu Linh Đàm',
    program: 'English Foundation',
    subject: 'Tiếng Anh',
    sessions: [{ className: 'English Foundation A1', classId: 'CLS-003', sessionName: 'Foundation A1', sessionId: 'SESS-9903', trialDate: '2026-05-14 17:15' }],
    creator: 'Hoàng Yến',
    owner: 'Ms. Emily',
    status: 'completed',
    branch: 'RinoEdu Linh Đàm',
    notes: '',
    auditLog: [
      { timestamp: '2026-05-10 10:00', author: 'Hoàng Yến', action: 'Tạo booking' },
      { timestamp: '2026-05-10 15:00', author: 'Ms. Emily', action: 'Ghép lớp' },
      { timestamp: '2026-05-14 19:00', author: 'Ms. Emily', action: 'GV nhận xét', detail: 'Hoàn thành buổi học thử' },
    ],
    feedback: {
      rating: 4,
      strengths: ['Giao tiếp tự nhiên', 'Phát âm tốt'],
      weaknesses: ['Ngữ pháp còn yếu'],
      comment: 'Bé nói tiếng Anh rất tự nhiên, phát âm chuẩn. Cần củng cố thêm ngữ pháp cơ bản.',
      recommendedLevel: 'Level 2A',
      resultLink: 'mock://trial-results/TR-2605-003',
    },
  },
  {
    id: 'TR-2605-007',
    trialName: 'Học thử Phonics - Lớp P2',
    customerId: 'KH-10327',
    studentName: 'Vũ Tue Nhi',
    parentName: 'Vũ Thị Hoa',
    familyName: 'Gia đình Vũ',
    familyPhone: '0355 234 567',
    attempt: 'Lần 3',
    school: 'RinoEdu Linh Đàm',
    program: 'Phonics',
    subject: 'Tiếng Anh',
    sessions: [{ className: 'Phonics P2', classId: 'CLS-007', sessionName: 'Phonics P2', sessionId: 'SESS-9907', trialDate: '2026-05-12 17:30' }],
    creator: 'Hoàng Yến',
    owner: 'Ms. Emily',
    status: 'no_show',
    branch: 'RinoEdu Linh Đàm',
    notes: '',
    auditLog: [
      { timestamp: '2026-05-08 10:00', author: 'Hoàng Yến', action: 'Tạo booking' },
      { timestamp: '2026-05-08 14:00', author: 'Ms. Emily', action: 'Ghép lớp' },
      { timestamp: '2026-05-12 19:00', author: 'Ms. Emily', action: 'Đánh dấu No-show', detail: 'Học viên không đến không báo trước' },
    ],
  },
]

export function getTrialClasses(filters?: {
  search?: string
  branch?: string
  status?: TrialClassStatus
  program?: string
  creator?: string
}): TrialClass[] {
  return MOCK_TRIAL_CLASSES.filter((trial) => {
    if (filters?.branch && trial.branch !== filters.branch) return false
    if (filters?.status && trial.status !== filters.status) return false
    if (filters?.program && trial.program !== filters.program) return false
    if (filters?.creator && trial.creator !== filters.creator) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const haystack = [
        trial.id,
        trial.trialName,
        trial.studentName,
        trial.customerId,
        trial.familyPhone,
        trial.program,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function countByStatus(trials: TrialClass[], status: TrialClassStatus | 'all'): number {
  if (status === 'all') return trials.length
  return trials.filter((t) => t.status === status).length
}

export function nextTrialId(trials: TrialClass[]): string {
  const maxNum = trials.reduce((max, t) => {
    const match = t.id.match(/TR-\d+-(\d+)/)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  const year = new Date().getFullYear().toString().slice(-2)
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  return `TR-${year}${month}-${String(maxNum + 1).padStart(3, '0')}`
}

export function getMockSessionsForClass(classId: string) {
  const sessions: Record<string, Array<{ id: string; name: string; date: string; time: string; attendees: number; capacity: number }>> = {
    'CLS-001': [
      { id: 'SESS-1001', name: 'Starter S1', date: '2026-05-20', time: '18:00', attendees: 12, capacity: 15 },
      { id: 'SESS-1002', name: 'Starter S2', date: '2026-05-22', time: '18:00', attendees: 14, capacity: 15 },
      { id: 'SESS-1003', name: 'Starter S3', date: '2026-05-25', time: '18:00', attendees: 10, capacity: 15 },
    ],
    'CLS-002': [
      { id: 'SESS-2001', name: 'Robo Level 1', date: '2026-05-21', time: '19:30', attendees: 8, capacity: 12 },
      { id: 'SESS-2002', name: 'Robo Level 2', date: '2026-05-24', time: '19:30', attendees: 12, capacity: 12 },
    ],
    'CLS-003': [
      { id: 'SESS-3001', name: 'Foundation A1', date: '2026-05-22', time: '17:15', attendees: 10, capacity: 15 },
      { id: 'SESS-3002', name: 'Foundation A2', date: '2026-05-25', time: '17:15', attendees: 9, capacity: 15 },
    ],
    'CLS-004': [
      { id: 'SESS-4001', name: 'Thinking M1', date: '2026-05-23', time: '18:45', attendees: 11, capacity: 15 },
      { id: 'SESS-4002', name: 'Thinking M2', date: '2026-05-26', time: '18:45', attendees: 7, capacity: 15 },
    ],
    'CLS-005': [
      { id: 'SESS-5001', name: 'IELTS J1', date: '2026-05-23', time: '09:00', attendees: 10, capacity: 12 },
      { id: 'SESS-5002', name: 'IELTS J2', date: '2026-05-26', time: '09:00', attendees: 8, capacity: 12 },
    ],
    'CLS-007': [
      { id: 'SESS-7001', name: 'Phonics P2', date: '2026-05-22', time: '17:30', attendees: 10, capacity: 15 },
      { id: 'SESS-7002', name: 'Phonics P3', date: '2026-05-25', time: '17:30', attendees: 12, capacity: 15 },
    ],
    'CLS-009': [
      { id: 'SESS-9001', name: 'Comm C1', date: '2026-05-25', time: '18:00', attendees: 8, capacity: 15 },
      { id: 'SESS-9002', name: 'Comm C2', date: '2026-05-28', time: '18:00', attendees: 9, capacity: 15 },
    ],
    'CLS-010': [
      { id: 'SESS-10001', name: 'Coding C1', date: '2026-05-24', time: '19:15', attendees: 10, capacity: 12 },
      { id: 'SESS-10002', name: 'Coding C2', date: '2026-05-27', time: '19:15', attendees: 6, capacity: 12 },
    ],
    'CLS-011': [
      { id: 'SESS-11001', name: 'Flyers F1', date: '2026-05-28', time: '18:30', attendees: 9, capacity: 15 },
      { id: 'SESS-11002', name: 'Flyers F2', date: '2026-05-31', time: '18:30', attendees: 11, capacity: 15 },
    ],
    'CLS-014': [
      { id: 'SESS-14001', name: 'Thinking M3', date: '2026-05-23', time: '09:30', attendees: 8, capacity: 15 },
      { id: 'SESS-14002', name: 'Thinking M4', date: '2026-05-26', time: '09:30', attendees: 7, capacity: 15 },
    ],
    'CLS-015': [
      { id: 'SESS-15001', name: 'IELTS IP1', date: '2026-05-23', time: '17:45', attendees: 10, capacity: 12 },
      { id: 'SESS-15002', name: 'IELTS IP2', date: '2026-05-26', time: '17:45', attendees: 12, capacity: 12 },
    ],
    'CLS-016': [
      { id: 'SESS-16001', name: 'Robo S2', date: '2026-05-26', time: '10:00', attendees: 8, capacity: 12 },
      { id: 'SESS-16002', name: 'Robo S3', date: '2026-05-29', time: '10:00', attendees: 6, capacity: 12 },
    ],
    'CLS-019': [
      { id: 'SESS-19001', name: 'Comm J2', date: '2026-05-30', time: '18:30', attendees: 9, capacity: 15 },
      { id: 'SESS-19002', name: 'Comm J3', date: '2026-06-02', time: '18:30', attendees: 7, capacity: 15 },
    ],
  }
  return sessions[classId] ?? []
}
