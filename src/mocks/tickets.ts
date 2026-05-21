export interface TicketInteractionLog {
  id: string
  date: string
  staffName: string
  channel: 'phone' | 'zalo' | 'face_to_face' | 'email'
  notes: string
}

export interface SupportTicket {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  title: string
  category: 'academic' | 'billing' | 'attendance' | 'general'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'new'
  assignee: string
  createdDate: string
  description: string
  interactionLogs: TicketInteractionLog[]
}

export let mockTickets: SupportTicket[] = [
  {
    id: "TCK-001",
    studentId: "s1",
    studentName: "Nguyễn An",
    studentCode: "STU-001",
    title: "Nghỉ học liên tiếp 3 buổi không phép",
    category: "attendance",
    priority: "high",
    status: "new",
    assignee: "Nguyễn Thị Cầm (CSM)",
    createdDate: "2025-05-18",
    description: "Hệ thống tự động ghi nhận học viên nghỉ liên tiếp 3 buổi của lớp IELTS A1. Cần CSM gọi điện xác nhận lý do và hỗ trợ ôn bài.",
    interactionLogs: [
      {
        id: "log-1",
        date: "2025-05-18",
        staffName: "Nguyễn Thị Cầm (CSM)",
        channel: "phone",
        notes: "Đã liên hệ phụ huynh, thuê bao bận không nhấc máy. Đã nhắn zalo cho phụ huynh.",
      }
    ]
  },
  {
    id: "TCK-002",
    studentId: "s3",
    studentName: "Lê Chi",
    studentCode: "STU-003",
    title: "Phản hồi bài tập về nhà quá khó",
    category: "academic",
    priority: "medium",
    status: "in_progress",
    assignee: "Trần Thế Vinh (CSM)",
    createdDate: "2025-05-16",
    description: "Phụ huynh gọi điện báo con làm bài tập về nhà môn Tiếng Anh A1 mất quá nhiều thời gian, đề nghị giáo viên hướng dẫn thêm.",
    interactionLogs: [
      {
        id: "log-2",
        date: "2025-05-16",
        staffName: "Trần Thế Vinh (CSM)",
        channel: "phone",
        notes: "Ghi nhận ý kiến. Đã phản hồi cho giáo viên phụ trách lớp Tiếng Anh A1 để điều chỉnh dung lượng bài tập về nhà.",
      },
      {
        id: "log-3",
        date: "2025-05-17",
        staffName: "Trần Thế Vinh (CSM)",
        channel: "zalo",
        notes: "Giáo viên đã gửi file hướng dẫn giải chi tiết cho con. Đã gửi qua Zalo cho phụ huynh.",
      }
    ]
  },
  {
    id: "TCK-003",
    studentId: "s4",
    studentName: "Đinh Dũng",
    studentCode: "STU-004",
    title: "Yêu cầu xuất hóa đơn đỏ (VAT)",
    category: "billing",
    priority: "low",
    status: "completed",
    assignee: "Phạm Hồng Ngọc (CSM)",
    createdDate: "2025-05-10",
    description: "Khách hàng yêu cầu xuất hóa đơn GTGT cho đơn hàng đóng phí khóa học IELTS B1 trị giá 15.000.000đ.",
    interactionLogs: [
      {
        id: "log-4",
        date: "2025-05-12",
        staffName: "Phạm Hồng Ngọc (CSM)",
        channel: "email",
        notes: "Đã chuyển thông tin sang phòng kế toán và gửi hóa đơn điện tử thành công tới email của phụ huynh.",
      }
    ]
  },
  {
    id: "TCK-004",
    studentId: "s8",
    studentName: "Lê Thị Khánh",
    studentCode: "STU-008",
    title: "Đề xuất chuyển lớp sang buổi tối",
    category: "general",
    priority: "medium",
    status: "pending",
    assignee: "Nguyễn Thị Cầm (CSM)",
    createdDate: "2025-05-19",
    description: "Do trùng lịch học thêm toán ở trường phổ thông, học viên mong muốn được chuyển từ lớp Tiếng Anh B1 (Chiều Thứ 7) sang lớp tối ngày thường.",
    interactionLogs: []
  }
]

export function getTickets(filters?: {
  search?: string
  category?: string
  priority?: string
  status?: string
  studentId?: string
}): SupportTicket[] {
  return mockTickets.filter((t) => {
    if (filters?.studentId && t.studentId !== filters.studentId) return false
    if (filters?.category && t.category !== filters.category) return false
    if (filters?.priority && t.priority !== filters.priority) return false
    if (filters?.status && t.status !== filters.status) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        t.studentName.toLowerCase().includes(q) ||
        t.studentCode.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}

export function addTicketInteraction(
  ticketId: string,
  log: Omit<TicketInteractionLog, 'id' | 'date'>
): boolean {
  const ticket = mockTickets.find((t) => t.id === ticketId)
  if (ticket) {
    const newLog: TicketInteractionLog = {
      ...log,
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    }
    ticket.interactionLogs = [...ticket.interactionLogs, newLog]
    return true
  }
  return false
}

export function updateTicketStatus(
  ticketId: string,
  status: SupportTicket['status']
): boolean {
  const ticket = mockTickets.find((t) => t.id === ticketId)
  if (ticket) {
    ticket.status = status
    return true
  }
  return false
}

export function createTicket(ticket: Omit<SupportTicket, 'id' | 'createdDate' | 'interactionLogs'>): SupportTicket {
  const newTicket: SupportTicket = {
    ...ticket,
    id: `TCK-0${mockTickets.length + 1}`,
    createdDate: new Date().toISOString().split('T')[0],
    interactionLogs: []
  }
  mockTickets = [newTicket, ...mockTickets]
  return newTicket
}
