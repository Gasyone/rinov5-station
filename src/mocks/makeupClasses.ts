export type MakeupClassStatus =
  | 'cho_duyet'
  | 'da_xep_lich'
  | 'completed'
  | 'da_vang'
  | 'tu_choi'
  | 'cancelled'
  | 'het_han'

export interface MakeupClassAuditLog {
  timestamp: string
  author: string
  action: string
  detail?: string
}

export interface MakeupClassRequest {
  id: string
  studentName: string
  customerId: string
  familyName: string
  familyPhone: string
  school: string
  branch: string
  subject: string
  program: string
  originalClassName: string
  originalClassId: string
  originalSessionName: string
  originalSessionDate: string
  absenceReason: string
  makeupClassName?: string
  makeupClassId?: string
  makeupSessionName?: string
  makeupSessionDate?: string
  leaveRequestId?: string
  attendanceStatus?: string
  teacherComment?: string
  exchangeNotes?: string
  status: MakeupClassStatus
  expiryDate: string
  notes: string
  creator: string
  owner: string
  auditLog: MakeupClassAuditLog[]
  createdAt: string
}

export const MOCK_MAKEUP_CLASSES: MakeupClassRequest[] = [
  {
    id: 'HB-2607-001',
    studentName: 'Nguyễn Minh Anh',
    customerId: 'KH-10248',
    familyName: 'Gia đình Nguyễn',
    familyPhone: '0912 345 678',
    school: 'RinoEdu Nguyễn Tuân',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Tiếng Anh',
    program: 'Cambridge Starter',
    originalClassName: 'Cambridge Starter A1',
    originalClassId: 'CLS-001',
    originalSessionName: 'Starter S2',
    originalSessionDate: '2026-07-18 18:00',
    absenceReason: 'Ốm sốt',
    leaveRequestId: 'NP-2607-001',
    attendanceStatus: 'Chưa điểm danh',
    teacherComment: 'Chưa có nhận xét buổi bù',
    exchangeNotes: 'Phụ huynh xin dời buổi bù sang cuối tuần do trùng lịch học văn hóa',
    status: 'cho_duyet',
    expiryDate: '2026-08-18',
    notes: 'Phụ huynh gọi báo nghỉ trước 2 tiếng',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Sarah',
    auditLog: [
      { timestamp: '2026-07-18 19:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù', detail: 'Học viên vắng buổi Starter S2' },
    ],
    createdAt: '2026-07-18',
  },
  {
    id: 'HB-2607-002',
    studentName: 'Trần Bảo Nam',
    customerId: 'KH-10261',
    familyName: 'Gia đình Trần',
    familyPhone: '0987 654 321',
    school: 'RinoEdu Smart City',
    branch: 'RinoEdu Smart City',
    subject: 'STEM',
    program: 'STEM Robotics',
    originalClassName: 'STEM Robotics S1',
    originalClassId: 'CLS-002',
    originalSessionName: 'Robo Level 1',
    originalSessionDate: '2026-07-21 19:30',
    absenceReason: 'Gia đình có việc',
    leaveRequestId: 'NP-2607-002',
    makeupClassName: 'STEM Robotics S2',
    makeupClassId: 'CLS-016',
    makeupSessionName: 'Robo S2',
    makeupSessionDate: '2026-07-29 10:00',
    attendanceStatus: 'Đã điểm danh',
    teacherComment: 'Bé làm sản phẩm Robot sáng tạo, tích cực thảo luận nhóm',
    exchangeNotes: 'Đã duyệt xếp bù vào lớp STEM Robotics S2 ngày 29/07',
    status: 'da_xep_lich',
    expiryDate: '2026-08-21',
    notes: '',
    creator: 'Hệ thống CARE',
    owner: 'Mr. David',
    auditLog: [
      { timestamp: '2026-07-21 20:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-22 09:00', author: 'Mr. David', action: 'Duyệt và xếp lịch bù', detail: 'Xếp vào STEM Robotics S2 - 29/07' },
    ],
    createdAt: '2026-07-21',
  },
  {
    id: 'HB-2607-003',
    studentName: 'Phạm Đức Minh',
    customerId: 'KH-10289',
    familyName: 'Gia đình Phạm',
    familyPhone: '0933 456 789',
    school: 'RinoEdu Nguyễn Tuân',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Toán',
    program: 'Math Thinking',
    originalClassName: 'Math Thinking M1',
    originalClassId: 'CLS-004',
    originalSessionName: 'Thinking M1',
    originalSessionDate: '2026-07-15 18:45',
    absenceReason: 'Đi thi học kỳ',
    leaveRequestId: 'NP-2607-003',
    makeupClassName: 'Math Thinking M3',
    makeupClassId: 'CLS-014',
    makeupSessionName: 'Thinking M3',
    makeupSessionDate: '2026-07-23 09:30',
    attendanceStatus: 'Có mặt',
    teacherComment: 'Học viên hoàn thành 100% bài tập trên lớp, tiếp thu bài tốt',
    exchangeNotes: 'Phụ huynh đã xác nhận đưa học viên đến lớp bù đúng giờ',
    status: 'completed',
    expiryDate: '2026-08-15',
    notes: 'Học viên đã tham gia buổi bù đầy đủ',
    creator: 'Hệ thống CARE',
    owner: 'Mr. Robert',
    auditLog: [
      { timestamp: '2026-07-15 19:30', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-16 08:00', author: 'Mr. Robert', action: 'Duyệt và xếp lịch bù' },
      { timestamp: '2026-07-23 11:00', author: 'Mr. Robert', action: 'Đánh dấu hoàn thành' },
    ],
    createdAt: '2026-07-15',
  },
  {
    id: 'HB-2607-004',
    studentName: 'Đỗ Khánh Linh',
    customerId: 'KH-10304',
    familyName: 'Gia đình Đỗ',
    familyPhone: '0977 321 654',
    school: 'RinoEdu Linh Đàm',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Tiếng Anh',
    program: 'IELTS Junior',
    originalClassName: 'IELTS Junior J1',
    originalClassId: 'CLS-005',
    originalSessionName: 'IELTS J2',
    originalSessionDate: '2026-07-20 09:00',
    absenceReason: 'Nghỉ hè đi du lịch',
    leaveRequestId: 'NP-2607-004',
    attendanceStatus: 'Chưa điểm danh',
    teacherComment: '—',
    exchangeNotes: 'Từ chối dời buổi bù do lý do nghỉ không đủ điều kiện theo quy định',
    status: 'tu_choi',
    expiryDate: '2026-08-20',
    notes: 'Từ chối — lý do vắng không hợp lệ (nghỉ hè không báo trước)',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Anna',
    auditLog: [
      { timestamp: '2026-07-20 10:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-21 08:30', author: 'Ms. Anna', action: 'Từ chối phiếu', detail: 'Lý do vắng không hợp lệ' },
    ],
    createdAt: '2026-07-20',
  },
  {
    id: 'HB-2607-005',
    studentName: 'Bùi Hoàng Phúc',
    customerId: 'KH-10318',
    familyName: 'Gia đình Bùi',
    familyPhone: '0866 789 012',
    school: 'RinoEdu Smart City',
    branch: 'RinoEdu Smart City',
    subject: 'Tiếng Anh',
    program: 'Cambridge Movers',
    originalClassName: 'Cambridge Movers M1',
    originalClassId: 'CLS-011',
    originalSessionName: 'Flyers F1',
    originalSessionDate: '2026-07-22 18:30',
    absenceReason: 'Bé bị sốt',
    makeupClassName: 'Cambridge Movers M1',
    makeupClassId: 'CLS-011',
    makeupSessionName: 'Flyers F2',
    makeupSessionDate: '2026-07-31 18:30',
    status: 'da_vang',
    expiryDate: '2026-08-22',
    notes: 'Học viên không đến buổi bù, không liên lạc được',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Sarah',
    auditLog: [
      { timestamp: '2026-07-22 19:30', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-23 09:00', author: 'Ms. Sarah', action: 'Duyệt và xếp lịch bù' },
      { timestamp: '2026-07-31 20:00', author: 'Ms. Sarah', action: 'Đánh dấu vắng mặt', detail: 'Không đến, không liên lạc được' },
    ],
    createdAt: '2026-07-22',
  },
  {
    id: 'HB-2607-006',
    studentName: 'Hoàng Gia Bảo',
    customerId: 'KH-10335',
    familyName: 'Gia đình Hoàng',
    familyPhone: '0901 567 890',
    school: 'RinoEdu Nguyễn Tuân',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Tiếng Anh',
    program: 'Communication Kids',
    originalClassName: 'Communication Kids C1',
    originalClassId: 'CLS-009',
    originalSessionName: 'Comm C1',
    originalSessionDate: '2026-07-25 18:00',
    absenceReason: 'Bé mệt',
    status: 'cho_duyet',
    expiryDate: '2026-08-25',
    notes: '',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Anna',
    auditLog: [
      { timestamp: '2026-07-25 19:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù', detail: 'Phụ huynh báo nghỉ qua app' },
    ],
    createdAt: '2026-07-25',
  },
  {
    id: 'HB-2607-007',
    studentName: 'Vũ Tue Nhi',
    customerId: 'KH-10327',
    familyName: 'Gia đình Vũ',
    familyPhone: '0355 234 567',
    school: 'RinoEdu Linh Đàm',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Tiếng Anh',
    program: 'Phonics',
    originalClassName: 'Phonics P2',
    originalClassId: 'CLS-007',
    originalSessionName: 'Phonics P2',
    originalSessionDate: '2026-06-20 17:30',
    absenceReason: 'Bé bị cảm',
    status: 'het_han',
    expiryDate: '2026-07-20',
    notes: 'Phiếu hết hạn do không đăng ký bù trong 30 ngày',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Emily',
    auditLog: [
      { timestamp: '2026-06-20 18:30', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-20 00:00', author: 'Hệ thống', action: 'Tự động hết hạn', detail: 'Quá 30 ngày chưa xếp lịch bù' },
    ],
    createdAt: '2026-06-20',
  },
  {
    id: 'HB-2607-008',
    studentName: 'Trương Minh Khang',
    customerId: 'KH-10342',
    familyName: 'Gia đình Trương',
    familyPhone: '0978 234 567',
    school: 'RinoEdu Smart City',
    branch: 'RinoEdu Smart City',
    subject: 'STEM',
    program: 'STEM Coding',
    originalClassName: 'STEM Coding C1',
    originalClassId: 'CLS-010',
    originalSessionName: 'Coding C1',
    originalSessionDate: '2026-07-24 19:15',
    absenceReason: 'Phụ huynh bận không đưa đi được',
    status: 'cho_duyet',
    expiryDate: '2026-08-24',
    notes: 'Phụ huynh muốn chuyển buổi bù sang cuối tuần',
    creator: 'Hệ thống CARE',
    owner: 'Mr. David',
    auditLog: [
      { timestamp: '2026-07-24 20:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
    ],
    createdAt: '2026-07-24',
  },
  {
    id: 'HB-2607-009',
    studentName: 'Lê Chi',
    customerId: 'KH-10355',
    familyName: 'Gia đình Lê Chi',
    familyPhone: '0955555555',
    school: 'RinoEdu Nguyễn Tuân',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Tiếng Anh',
    program: 'IELTS Starter',
    originalClassName: 'Cambridge Flyers F1',
    originalClassId: 'CLS-011',
    originalSessionName: 'Flyers F1',
    originalSessionDate: '2026-07-28 18:30',
    absenceReason: 'Học sinh bị đau bụng',
    makeupClassName: 'Cambridge Flyers F1',
    makeupClassId: 'CLS-011',
    makeupSessionName: 'Flyers F2',
    makeupSessionDate: '2026-08-04 18:30',
    status: 'da_xep_lich',
    expiryDate: '2026-08-28',
    notes: '',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Sarah',
    auditLog: [
      { timestamp: '2026-07-28 19:30', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-29 08:00', author: 'Ms. Sarah', action: 'Duyệt và xếp lịch bù', detail: 'Xếp vào Flyers F2 - 04/08' },
    ],
    createdAt: '2026-07-28',
  },
  {
    id: 'HB-2607-010',
    studentName: 'Nguyễn An',
    customerId: 'KH-10273',
    familyName: 'Gia đình Nguyễn',
    familyPhone: '0922222222',
    school: 'RinoEdu Linh Đàm',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Tiếng Anh',
    program: 'English Foundation',
    originalClassName: 'English Foundation A1',
    originalClassId: 'CLS-003',
    originalSessionName: 'Foundation A2',
    originalSessionDate: '2026-07-26 17:15',
    absenceReason: 'Đi khám bệnh',
    status: 'cancelled',
    expiryDate: '2026-08-26',
    notes: 'Phụ huynh yêu cầu hủy phiếu bù',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Emily',
    auditLog: [
      { timestamp: '2026-07-26 18:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-27 10:00', author: 'Ms. Emily', action: 'Hủy phiếu', detail: 'Theo yêu cầu phụ huynh' },
    ],
    createdAt: '2026-07-26',
  },
  {
    id: 'HB-2607-011',
    studentName: 'Phạm Đức Minh',
    customerId: 'KH-10289',
    familyName: 'Gia đình Phạm',
    familyPhone: '0933 456 789',
    school: 'RinoEdu Nguyễn Tuân',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Toán',
    program: 'Math Thinking',
    originalClassName: 'Math Thinking M1',
    originalClassId: 'CLS-004',
    originalSessionName: 'Thinking M2',
    originalSessionDate: '2026-07-28 18:45',
    absenceReason: 'Bận việc gia đình',
    status: 'cho_duyet',
    expiryDate: '2026-08-28',
    notes: '',
    creator: 'Hệ thống CARE',
    owner: 'Mr. Robert',
    auditLog: [
      { timestamp: '2026-07-28 19:30', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
    ],
    createdAt: '2026-07-28',
  },
  {
    id: 'HB-2607-012',
    studentName: 'Hoàng Gia Bảo',
    customerId: 'KH-10335',
    familyName: 'Gia đình Hoàng',
    familyPhone: '0901 567 890',
    school: 'RinoEdu Nguyễn Tuân',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Tiếng Anh',
    program: 'Communication Kids',
    originalClassName: 'Communication Kids C1',
    originalClassId: 'CLS-009',
    originalSessionName: 'Comm C2',
    originalSessionDate: '2026-07-30 18:00',
    absenceReason: 'Bé sốt cao',
    makeupClassName: 'Communication Junior J2',
    makeupClassId: 'CLS-019',
    makeupSessionName: 'Comm J2',
    makeupSessionDate: '2026-08-05 18:30',
    status: 'da_xep_lich',
    expiryDate: '2026-08-30',
    notes: 'Xếp sang lớp Communication Junior do lịch trùng lớp gốc',
    creator: 'Hệ thống CARE',
    owner: 'Ms. Anna',
    auditLog: [
      { timestamp: '2026-07-30 19:00', author: 'Hệ thống CARE', action: 'Tạo phiếu học bù' },
      { timestamp: '2026-07-31 09:00', author: 'Ms. Anna', action: 'Duyệt và xếp lịch bù', detail: 'Xếp vào Comm J2 - 05/08' },
    ],
    createdAt: '2026-07-30',
  },
]

export function getMakeupClasses(filters?: {
  search?: string
  branch?: string
  status?: MakeupClassStatus
}): MakeupClassRequest[] {
  return MOCK_MAKEUP_CLASSES.filter((req) => {
    if (filters?.branch && req.branch !== filters.branch) return false
    if (filters?.status && req.status !== filters.status) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const haystack = [
        req.id,
        req.studentName,
        req.customerId,
        req.familyPhone,
        req.program,
        req.originalClassName,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function countMakeupByStatus(requests: MakeupClassRequest[], status: MakeupClassStatus | 'all'): number {
  if (status === 'all') return requests.length
  return requests.filter((r) => r.status === status).length
}

export function nextMakeupId(requests: MakeupClassRequest[]): string {
  const maxNum = requests.reduce((max, r) => {
    const match = r.id.match(/HB-\d+-(\\d+)/)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  const year = new Date().getFullYear().toString().slice(-2)
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  return `HB-${year}${month}-${String(maxNum + 1).padStart(3, '0')}`
}
