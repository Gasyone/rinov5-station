export interface LeaveReserveRequest {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  branch: string
  type: 'leave' | 'reserve' | 'suspend'
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
  approvedBy?: string
  approvedDate?: string
}

export let mockLeaveReserveRequests: LeaveReserveRequest[] = [
  {
    id: "LR-001",
    studentId: "s1",
    studentName: "Nguyễn An",
    studentCode: "STU-001",
    branch: "Chi nhánh Hà Nội",
    type: "leave",
    startDate: "2025-06-01",
    endDate: "2025-06-07",
    reason: "Nghỉ hè du lịch cùng gia đình",
    status: "pending",
    requestedDate: "2025-05-15",
  },
  {
    id: "LR-002",
    studentId: "s3",
    studentName: "Lê Chi",
    studentCode: "STU-003",
    branch: "Chi nhánh Hà Nội",
    type: "reserve",
    startDate: "2025-06-10",
    endDate: "2025-09-10",
    reason: "Đi học quân sự tại trường Đại học",
    status: "approved",
    requestedDate: "2025-05-10",
    approvedBy: "Trần Văn A (Quản lý)",
    approvedDate: "2025-05-12",
  },
  {
    id: "LR-003",
    studentId: "s5",
    studentName: "Hoàng Văn Em",
    studentCode: "STU-005",
    branch: "Chi nhánh Hồ Chí Minh",
    type: "suspend",
    startDate: "2025-05-20",
    endDate: "2025-06-20",
    reason: "Trùng lịch thi học kỳ ở trường phổ thông",
    status: "pending",
    requestedDate: "2025-05-18",
  },
  {
    id: "LR-004",
    studentId: "s2",
    studentName: "Trần Thị Bình",
    studentCode: "STU-002",
    branch: "Chi nhánh Hồ Chí Minh",
    type: "leave",
    startDate: "2025-04-05",
    endDate: "2025-04-12",
    reason: "Phẫu thuật y tế điều trị cận thị",
    status: "approved",
    requestedDate: "2025-03-30",
    approvedBy: "Lê Thị B (Quản lý)",
    approvedDate: "2025-04-01",
  },
  {
    id: "LR-005",
    studentId: "s8",
    studentName: "Lê Thị Khánh",
    studentCode: "STU-008",
    branch: "Chi nhánh Hồ Chí Minh",
    type: "leave",
    startDate: "2025-05-25",
    endDate: "2025-05-28",
    reason: "Có việc gia đình đột xuất ở quê",
    status: "rejected",
    requestedDate: "2025-05-20",
    approvedBy: "Lê Thị B (Quản lý)",
    approvedDate: "2025-05-21",
  },
]

export function getLeaveReserveRequests(filters?: {
  search?: string
  branch?: string
  status?: string
  type?: string
}): LeaveReserveRequest[] {
  return mockLeaveReserveRequests.filter((r) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        r.studentName.toLowerCase().includes(q) ||
        r.studentCode.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (filters?.branch && r.branch !== filters.branch) return false
    if (filters?.status && r.status !== filters.status) return false
    if (filters?.type && r.type !== filters.type) return false
    return true
  })
}

export function updateLeaveReserveStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminName: string
): boolean {
  const req = mockLeaveReserveRequests.find((r) => r.id === id)
  if (req) {
    req.status = status
    req.approvedBy = adminName
    req.approvedDate = new Date().toISOString().split('T')[0]
    return true
  }
  return false
}

export function createLeaveReserveRequest(req: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>): LeaveReserveRequest {
  const newReq: LeaveReserveRequest = {
    ...req,
    id: `LR-0${mockLeaveReserveRequests.length + 1}`,
    status: 'pending',
    requestedDate: new Date().toISOString().split('T')[0]
  }
  mockLeaveReserveRequests = [newReq, ...mockLeaveReserveRequests]
  return newReq
}
