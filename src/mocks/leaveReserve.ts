export interface AdditionalContact {
  name: string
  phone: string
  email?: string
}

export interface LeaveReserveRequest {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  branch: string
  type: 'off' | 'reservation' | 'learn_again'
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'not_approved' | 'cancel'
  requestedDate: string
  approvedBy?: string
  approvedDate?: string
  requestedBy?: string
  title: string
  phone: string
  email: string
  className: string
  classCode: string
  productPackage: string
  parentName?: string
  additionalContacts?: AdditionalContact[]
  cancelReason?: string
  rejectReason?: string
  quota?: number
  usedAbsences?: number
}

export let mockLeaveReserveRequests: LeaveReserveRequest[] = [
  {
    id: "NP001",
    studentId: "s1",
    studentName: "Nguyễn An",
    studentCode: "STU-001",
    branch: "RinoEdu Nguyễn Tuân",
    type: "off",
    startDate: "2025-06-01",
    endDate: "2025-06-07",
    reason: "Nghỉ hè du lịch cùng gia đình",
    status: "pending",
    requestedDate: "2025-05-15",
    title: "Đơn xin nghỉ học kỳ hè",
    phone: "0911111111",
    email: "an@email.com",
    className: "IELTS A1",
    classCode: "CLS-IELTS-01",
    productPackage: "Gói IELTS cam kết 7.0",
    parentName: "Phụ huynh: Nguyễn Văn A",
    requestedBy: "Nguyễn Văn C",
    quota: 12,
    usedAbsences: 3,
    additionalContacts: [
      { name: "Mẹ: Trần Thị B", phone: "0911223344", email: "mother.an@email.com" },
      { name: "Anh trai: Nguyễn Bình", phone: "0911556677" }
    ]
  },
  {
    id: "BL002",
    studentId: "s3",
    studentName: "Lê Chi",
    studentCode: "STU-003",
    branch: "RinoEdu Nguyễn Tuân",
    type: "reservation",
    startDate: "2025-06-10",
    endDate: "2025-09-10",
    reason: "Đi học quân sự tại trường Đại học",
    status: "approved",
    requestedDate: "2025-05-10",
    approvedBy: "Trần Văn A (Quản lý)",
    approvedDate: "2025-05-12",
    title: "Đơn xin bảo lưu học tập",
    phone: "0955555555",
    email: "chi@email.com",
    className: "Tiếng Anh A1",
    classCode: "CLS-ENG-01",
    productPackage: "Gói Giao tiếp cơ bản",
    parentName: "Phụ huynh: Lê Văn C",
    requestedBy: "Lê Văn D",
    quota: 12,
    usedAbsences: 0,
    additionalContacts: [
      { name: "Mẹ: Nguyễn Thị D", phone: "0955667788" }
    ]
  },

  {
    id: "NP004",
    studentId: "s2",
    studentName: "Trần Thị Bình",
    studentCode: "STU-002",
    branch: "RinoEdu Smart City",
    type: "off",
    startDate: "2025-04-05",
    endDate: "2025-04-12",
    reason: "Phẫu thuật y tế điều trị cận thị",
    status: "approved",
    requestedDate: "2025-03-30",
    approvedBy: "Lê Thị B (Quản lý)",
    approvedDate: "2025-04-01",
    title: "Đơn xin nghỉ điều trị bệnh",
    phone: "0933333333",
    email: "binh@email.com",
    className: "TOEIC B2",
    classCode: "CLS-TOEIC-B2",
    productPackage: "Gói TOEIC 4 kỹ năng",
    parentName: "Phụ huynh: Trần Thị B",
    requestedBy: "Trần Thị F",
    quota: 12,
    usedAbsences: 1,
    additionalContacts: [
      { name: "Bố: Trần Văn A", phone: "0944444445" }
    ]
  },
  {
    id: "NP005",
    studentId: "s8",
    studentName: "Trương Bảo An",
    studentCode: "STU-008",
    branch: "RinoEdu Smart City",
    type: "off",
    startDate: "2025-05-25",
    endDate: "2025-05-28",
    reason: "Có việc gia đình đột xuất ở quê",
    status: "not_approved",
    requestedDate: "2025-05-20",
    approvedBy: "Lê Thị B (Quản lý)",
    approvedDate: "2025-05-21",
    title: "Đơn xin nghỉ phép về quê",
    phone: "0916161616",
    email: "khanh@email.com",
    className: "STEM Junior 01",
    classCode: "CLS-STEM-08",
    productPackage: "Gói STEM Robotics cơ bản",
    parentName: "Phụ huynh: Lê Thị K",
    requestedBy: "Nguyễn Văn G",
    quota: 12,
    usedAbsences: 0,
    rejectReason: "Học viên đã nghỉ quá nhiều buổi trong tháng này",
    additionalContacts: [
      { name: "Bố: Lê Văn L", phone: "0917171718" }
    ]
  },
  {
    id: "HL006",
    studentId: "s3",
    studentName: "Lê Chi",
    studentCode: "STU-003",
    branch: "RinoEdu Nguyễn Tuân",
    type: "learn_again",
    startDate: "2025-09-11",
    endDate: "2025-09-11",
    reason: "Hoàn thành khóa học quân sự ở trường Đại học, đăng ký đi học lại",
    status: "pending",
    requestedDate: "2025-09-01",
    title: "Đề xuất đi học lại sau bảo lưu",
    phone: "0955555555",
    email: "chi@email.com",
    className: "Tiếng Anh A1",
    classCode: "CLS-ENG-01",
    productPackage: "Gói Giao tiếp cơ bản",
    parentName: "Phụ huynh: Lê Văn C",
    requestedBy: "Lê Văn D",
    quota: 12,
    usedAbsences: 0,
    additionalContacts: [
      { name: "Mẹ: Nguyễn Thị D", phone: "0955667788" }
    ]
  },
  {
    id: "HL007",
    studentId: "s1",
    studentName: "Nguyễn An",
    studentCode: "STU-001",
    branch: "RinoEdu Nguyễn Tuân",
    type: "learn_again",
    startDate: "2025-06-08",
    endDate: "2025-06-08",
    reason: "Hoàn thành chuyến du lịch gia đình, xin đi học lại",
    status: "approved",
    requestedDate: "2025-06-05",
    approvedBy: "Trần Văn A (Quản lý)",
    approvedDate: "2025-06-06",
    title: "Yêu cầu đi học lại sau nghỉ phép",
    phone: "0911111111",
    email: "an@email.com",
    className: "IELTS A1",
    classCode: "CLS-IELTS-01",
    productPackage: "Gói IELTS cam kết 7.0",
    parentName: "Phụ huynh: Nguyễn Văn A",
    requestedBy: "Nguyễn Văn C",
    quota: 12,
    usedAbsences: 3,
    additionalContacts: [
      { name: "Mẹ: Trần Thị B", phone: "0911223344", email: "mother.an@email.com" }
    ]
  },
  {
    id: "BL008",
    studentId: "s3",
    studentName: "Lê Chi",
    studentCode: "STU-003",
    branch: "RinoEdu Nguyễn Tuân",
    type: "reservation",
    startDate: "2025-10-15",
    endDate: "2025-12-15",
    reason: "Đi học trao đổi ngắn hạn tại nước ngoài",
    status: "pending",
    requestedDate: "2025-10-01",
    title: "Đơn xin bảo lưu học tập ngắn hạn",
    phone: "0955555555",
    email: "chi@email.com",
    className: "Tiếng Anh A1",
    classCode: "CLS-ENG-01",
    productPackage: "Gói Giao tiếp cơ bản",
    parentName: "Phụ huynh: Lê Văn C",
    requestedBy: "Lê Văn D",
    quota: 12,
    usedAbsences: 0,
    additionalContacts: [
      { name: "Mẹ: Nguyễn Thị D", phone: "0955667788" }
    ]
  },
]

export function getLeaveReserveRequests(filters?: {
  search?: string
  branch?: string
  status?: string
  types?: Array<'off' | 'reservation' | 'learn_again'>
  dateRanges?: Array<'this-week' | 'this-month' | 'last-month' | 'custom'>
}): LeaveReserveRequest[] {
  const now = new Date()
  
  return mockLeaveReserveRequests.filter((r) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        r.studentName.toLowerCase().includes(q) ||
        r.studentCode.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (filters?.branch && r.branch !== filters.branch) return false
    if (filters?.status && r.status !== filters.status) return false
    if (filters?.types && filters.types.length > 0 && !filters.types.includes(r.type)) return false
    
    if (filters?.dateRanges && filters.dateRanges.length > 0) {
      const startDate = new Date(r.startDate)
      let matchesDate = false
      
      for (const range of filters.dateRanges) {
        const rangeStart = new Date(now)
        const rangeEnd = new Date(now)
        
        switch (range) {
          case 'this-week': {
            const dayOfWeek = now.getDay()
            rangeStart.setDate(now.getDate() - dayOfWeek)
            rangeStart.setHours(0, 0, 0, 0)
            rangeEnd.setDate(rangeStart.getDate() + 6)
            rangeEnd.setHours(23, 59, 59, 999)
            break
          }
          case 'this-month':
            rangeStart.setDate(1)
            rangeStart.setHours(0, 0, 0, 0)
            rangeEnd.setMonth(rangeStart.getMonth() + 1)
            rangeEnd.setDate(0)
            rangeEnd.setHours(23, 59, 59, 999)
            break
          case 'last-month':
            rangeStart.setMonth(rangeStart.getMonth() - 1)
            rangeStart.setDate(1)
            rangeStart.setHours(0, 0, 0, 0)
            rangeEnd.setDate(0)
            rangeEnd.setHours(23, 59, 59, 999)
            break
        }
        
        if (startDate >= rangeStart && startDate <= rangeEnd) {
          matchesDate = true
          break
        }
      }
      
      if (!matchesDate) return false
    }
    
    return true
  })
}

export function updateLeaveReserveStatus(
  id: string,
  status: 'approved' | 'not_approved' | 'cancel',
  adminName: string,
  reason?: string
): boolean {
  const req = mockLeaveReserveRequests.find((r) => r.id === id)
  if (req) {
    req.status = status
    req.approvedBy = adminName
    req.approvedDate = new Date().toISOString().split('T')[0]
    if (status === 'cancel' && reason) {
      req.cancelReason = reason
    } else if (status === 'not_approved' && reason) {
      req.rejectReason = reason
    }
    return true
  }
  return false
}

export function createLeaveReserveRequest(req: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>): LeaveReserveRequest {
  const count = mockLeaveReserveRequests.length + 1
  const paddedNum = String(count).padStart(3, '0')
  const prefix = req.type === 'off' ? 'NP' : req.type === 'reservation' ? 'BL' : 'HL'
  const newReq: LeaveReserveRequest = {
    ...req,
    id: `${prefix}${paddedNum}`,
    status: 'pending',
    requestedDate: new Date().toISOString().split('T')[0],
    requestedBy: 'Nguyễn Văn C'
  }
  mockLeaveReserveRequests = [newReq, ...mockLeaveReserveRequests]
  return newReq
}
