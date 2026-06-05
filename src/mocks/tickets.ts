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
  type: 'care' | 'support'  // Phân loại: chăm sóc chủ động hoặc hỗ trợ sự cố
  alertCode?: string        // Mã cảnh báo liên kết (như C90B, C100...)
}

export let mockTickets: SupportTicket[] = [
  {
    id: "TCK-001",
    studentId: "149231",
    studentName: "Nguyễn Mỹ Linh",
    studentCode: "STU-001",
    title: "Cảnh báo gia hạn số buổi học C90B",
    category: "billing",
    priority: "high",
    status: "new",
    assignee: "AnhNTN33",
    createdDate: "2026-05-24",
    description: "Học viên chỉ còn 54 buổi học, cảnh báo C90B kích hoạt. Cần liên hệ trao đổi với phụ huynh định hướng lên lớp 5 và làm thủ tục gia hạn học phí.",
    interactionLogs: [],
    type: "care",
    alertCode: "C90B"
  },
  {
    id: "TCK-002",
    studentId: "113838",
    studentName: "Nguyễn Hà Phương",
    studentCode: "STU-003",
    title: "Xác nhận chuyển lớp & Bài tập về nhà C90B",
    category: "academic",
    priority: "medium",
    status: "completed",
    assignee: "AnhNTN33",
    createdDate: "2026-05-20",
    description: "Học viên chuẩn bị chuyển lớp, còn lại 1 buổi. Cần gọi điện nhắc nhở hoàn thiện BTVN và hoàn tất thủ tục chuyển lớp.",
    interactionLogs: [
      {
        id: "log-1",
        date: "2026-05-25",
        staffName: "AnhNTN33",
        channel: "zalo",
        notes: "Đã nhắn tin Zalo trao đổi với mẹ nhắc con làm bài tập chuẩn bị chuyển lớp mới.",
      }
    ],
    type: "care",
    alertCode: "C90B"
  },
  {
    id: "TCK-003",
    studentId: "152149",
    studentName: "Phạm Đình Nguyên",
    studentCode: "STU-006",
    title: "Cảnh báo hoàn thành BTVN thấp dưới 70%",
    category: "academic",
    priority: "high",
    status: "in_progress",
    assignee: "AnhNTN33",
    createdDate: "2026-05-25",
    description: "Tỷ lệ làm bài tập về nhà trong tháng 5 chỉ đạt 66.7%. Cần CSKH gọi nhắc phụ huynh đôn đốc con.",
    interactionLogs: [
      {
        id: "log-2",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        channel: "phone",
        notes: "Đã gọi cho mẹ. Mẹ phản hồi đợt này cho con đi chơi nhiều, tối nay về sẽ nhắc con làm BTVN.",
      }
    ],
    type: "care",
    alertCode: "Cảnh báo BTVN"
  },
  {
    id: "TCK-004",
    studentId: "152292",
    studentName: "Minh Vy",
    studentCode: "STU-008",
    title: "Hỗ trợ phụ huynh - Phản hồi bài kiểm tra điểm kém",
    category: "academic",
    priority: "medium",
    status: "in_progress",
    assignee: "AnhNTN33",
    createdDate: "2026-05-25",
    description: "Điểm thi lần gần nhất của con giảm mạnh xuống 0.2. Phụ huynh băn khoăn về năng lực học tập của con.",
    interactionLogs: [
      {
        id: "log-3",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        channel: "zalo",
        notes: "Đã trao đổi zalo. Nhờ mẹ nhắc con làm lại bài kiểm tra và làm bài tập đầy đủ.",
      }
    ],
    type: "support"
  },
  {
    id: "TCK-005",
    studentId: "152940",
    studentName: "Nguyễn Hoàng Vũ",
    studentCode: "STU-013",
    title: "Yêu cầu tài liệu ôn thi học kỳ",
    category: "general",
    priority: "low",
    status: "completed",
    assignee: "AnhNTN33",
    createdDate: "2026-05-23",
    description: "Phụ huynh đề xuất trung tâm gửi thêm tài liệu ôn thi do con bận ôn tập học kỳ ở trường không đi học đều được.",
    interactionLogs: [
      {
        id: "log-4",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        channel: "zalo",
        notes: "Đã nhắn tin gửi link tài liệu và add phụ huynh vào Zalo nhóm lớp.",
      }
    ],
    type: "support"
  }
]

export function getTickets(filters?: {
  search?: string
  category?: string
  priority?: string
  status?: string
  studentId?: string
  type?: 'care' | 'support'
}): SupportTicket[] {
  return mockTickets.filter((t) => {
    if (filters?.studentId && t.studentId !== filters.studentId) return false
    if (filters?.category && t.category !== filters.category) return false
    if (filters?.priority && t.priority !== filters.priority) return false
    if (filters?.status && t.status !== filters.status) return false
    if (filters?.type && t.type !== filters.type) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        t.studentName.toLowerCase().includes(q) ||
        t.studentCode.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.alertCode && t.alertCode.toLowerCase().includes(q))
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
