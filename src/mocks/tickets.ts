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
  studentPhone?: string
  branch?: string
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
    id: "TCK-101",
    studentId: "s1",
    studentName: "Nguyễn An",
    studentCode: "STU-001",
    studentPhone: "0912345678",
    branch: "170 Nguyễn Tuân",
    title: "Yêu cầu thay đổi ca học thứ 4 sang tối thứ 6",
    category: "attendance",
    priority: "medium",
    status: "in_progress",
    assignee: "AnhNTN33",
    createdDate: "2026-06-10",
    description: "Phụ huynh gọi điện báo lịch thứ 4 con bận học thêm ở trường, muốn chuyển sang ca tối thứ 6 cùng khung giờ 18:00 - 19:30.",
    interactionLogs: [
      {
        id: "log-a1",
        date: "2026-06-11",
        staffName: "CSM Minh Phương",
        channel: "phone",
        notes: "Đã liên hệ với giáo viên chủ nhiệm xác nhận sĩ số lớp thứ 6 vẫn còn slot nhận thêm."
      }
    ],
    type: "support"
  },
  {
    id: "TCK-102",
    studentId: "s1",
    studentName: "Nguyễn An",
    studentCode: "STU-001",
    studentPhone: "0912345678",
    branch: "170 Nguyễn Tuân",
    title: "Cảnh báo kết quả học tập giữa kỳ giảm nhẹ",
    category: "academic",
    priority: "low",
    status: "new",
    assignee: "CSM Minh Phương",
    createdDate: "2026-06-15",
    description: "Điểm kiểm tra giữa kỳ 2 đạt 7.0/10, giảm nhẹ so với kỳ 1 (8.5/10). Giáo viên lưu ý cần hỗ trợ thêm phần phát âm và từ vựng nâng cao.",
    interactionLogs: [],
    type: "care"
  },
  {
    id: "TCK-001",
    studentId: "s17",
    studentName: "Nguyễn Mỹ Linh",
    studentCode: "STU-017",
    studentPhone: "0987654321",
    branch: "Linh Đàm",
    title: "Cảnh báo gia hạn số buổi học C90B",
    category: "billing",
    priority: "high",
    status: "new",
    assignee: "AnhNTN33",
    createdDate: "2026-05-24",
    description: "Học viên chỉ còn 54 buổi học, cảnh báo C90B kích hoạt. Cần liên hệ trao đổi với phụ huynh định hướng lên lớp 5 và làm thủ tục gia hạn học phí ưu đãi.",
    interactionLogs: [],
    type: "care",
    alertCode: "C90B"
  },
  {
    id: "TCK-002",
    studentId: "s15",
    studentName: "Nguyễn Hà Phương",
    studentCode: "STU-015",
    studentPhone: "0903456789",
    branch: "Vin SA1",
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
        notes: "Đã nhắn tin Zalo trao đổi với mẹ nhắc con làm bài tập chuẩn bị chuyển lớp mới."
      }
    ],
    type: "care",
    alertCode: "C90B"
  },
  {
    id: "TCK-003",
    studentId: "s18",
    studentName: "Phạm Đình Nguyên",
    studentCode: "STU-018",
    studentPhone: "0934567890",
    branch: "Tonkin",
    title: "Cảnh báo hoàn thành BTVN thấp dưới 70%",
    category: "academic",
    priority: "high",
    status: "in_progress",
    assignee: "CSM Hoàng Lan",
    createdDate: "2026-05-25",
    description: "Tỷ lệ làm bài tập về nhà trong tháng 5 chỉ đạt 66.7%. Cần CSKH gọi nhắc phụ huynh đôn đốc con hoàn thành bài trước khi lên lớp.",
    interactionLogs: [
      {
        id: "log-2",
        date: "2026-05-26",
        staffName: "CSM Hoàng Lan",
        channel: "phone",
        notes: "Đã gọi cho mẹ. Mẹ phản hồi đợt này cho con đi chơi nhiều, tối nay về sẽ nhắc con làm BTVN."
      }
    ],
    type: "care",
    alertCode: "Cảnh báo BTVN"
  },
  {
    id: "TCK-004",
    studentId: "s19",
    studentName: "Minh Vy",
    studentCode: "STU-019",
    studentPhone: "0945678901",
    branch: "170 Nguyễn Tuân",
    title: "Hỗ trợ phụ huynh - Phản hồi bài kiểm tra điểm kém",
    category: "academic",
    priority: "medium",
    status: "pending",
    assignee: "AnhNTN33",
    createdDate: "2026-05-25",
    description: "Điểm thi lần gần nhất của con giảm mạnh xuống 5.2. Phụ huynh băn khoăn về năng lực học tập và muốn xin giáo viên hỗ trợ kèm thêm 15 phút.",
    interactionLogs: [
      {
        id: "log-3",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        channel: "zalo",
        notes: "Đã trao đổi zalo. Nhờ mẹ nhắc con làm lại bài kiểm tra và làm bài tập đầy đủ."
      }
    ],
    type: "support"
  },
  {
    id: "TCK-005",
    studentId: "s12",
    studentName: "Nguyễn Hoàng Vũ",
    studentCode: "STU-012",
    studentPhone: "0956789012",
    branch: "KDV",
    title: "Yêu cầu tài liệu ôn thi học kỳ",
    category: "general",
    priority: "low",
    status: "completed",
    assignee: "CSM Thu Trang",
    createdDate: "2026-05-23",
    description: "Phụ huynh đề xuất trung tâm gửi thêm tài liệu ôn thi do con bận ôn tập học kỳ ở trường không đi học đều được.",
    interactionLogs: [
      {
        id: "log-4",
        date: "2026-05-26",
        staffName: "CSM Thu Trang",
        channel: "zalo",
        notes: "Đã nhắn tin gửi link tài liệu và add phụ huynh vào Zalo nhóm lớp."
      }
    ],
    type: "support"
  },
  {
    id: "TCK-006",
    studentId: "s20",
    studentName: "Trần Tuấn Kiệt",
    studentCode: "STU-020",
    studentPhone: "0967890123",
    branch: "Linh Đàm",
    title: "Phản ánh phòng học máy chiếu bị chập chờn",
    category: "general",
    priority: "high",
    status: "in_progress",
    assignee: "Giáo vụ Cơ sở",
    createdDate: "2026-06-01",
    description: "Phụ huynh và học sinh phản ánh phòng 302 máy chiếu bị mất tín hiệu liên tục trong buổi học hôm qua, ảnh hưởng giờ học tương tác.",
    interactionLogs: [
      {
        id: "log-5",
        date: "2026-06-01",
        staffName: "Giáo vụ Cơ sở",
        channel: "face_to_face",
        notes: "Đã báo bộ phận IT cơ sở kiểm tra dây HDMI và thay cáp mới phòng 302."
      }
    ],
    type: "support"
  },
  {
    id: "TCK-007",
    studentId: "s21",
    studentName: "Lê Bảo Trâm",
    studentCode: "STU-021",
    studentPhone: "0978901234",
    branch: "Vin SA1",
    title: "Thắc mắc hóa đơn học phí và xuất VAT",
    category: "billing",
    priority: "medium",
    status: "pending",
    assignee: "CSM Hoàng Lan",
    createdDate: "2026-06-02",
    description: "Phụ huynh cần xuất hóa đơn điện tử VAT tên công ty cho khóa học tiếng Anh hè của con, đã gửi mã số thuế qua Zalo.",
    interactionLogs: [],
    type: "support"
  },
  {
    id: "TCK-008",
    studentId: "s22",
    studentName: "Vũ Gia Hưng",
    studentCode: "STU-022",
    studentPhone: "0989012345",
    branch: "Tonkin",
    title: "Xin nghỉ phép 2 tuần đi thi đấu cờ vua",
    category: "attendance",
    priority: "low",
    status: "completed",
    assignee: "AnhNTN33",
    createdDate: "2026-05-18",
    description: "Học sinh xin phép vắng mặt 4 buổi từ ngày 20/05 đến 03/06. Đã hướng dẫn phụ huynh nộp đơn bảo lưu và đăng ký học bù sau khi về.",
    interactionLogs: [
      {
        id: "log-6",
        date: "2026-05-19",
        staffName: "AnhNTN33",
        channel: "phone",
        notes: "Đã xác nhận lịch học bù ca sáng Chủ nhật cùng tuần."
      }
    ],
    type: "support"
  },
  {
    id: "TCK-009",
    studentId: "s23",
    studentName: "Bùi Mai Chi",
    studentCode: "STU-023",
    studentPhone: "0911223344",
    branch: "170 Nguyễn Tuân",
    title: "Cảnh báo vắng học không phép 2 buổi liên tiếp",
    category: "attendance",
    priority: "high",
    status: "new",
    assignee: "CSM Minh Phương",
    createdDate: "2026-06-03",
    description: "Học viên vắng mặt ngày 30/05 và 02/06 không có đơn báo phép. Cần CSM gọi điện cho phụ huynh kiểm tra tình hình sức khỏe và lý do vắng.",
    interactionLogs: [],
    type: "care",
    alertCode: "VẮNG-2B"
  },
  {
    id: "TCK-010",
    studentId: "s24",
    studentName: "Đỗ Quang Vinh",
    studentCode: "STU-024",
    studentPhone: "0922334455",
    branch: "KDV",
    title: "Yêu cầu hủy phiếu đề xuất hỗ trợ (trùng lặp)",
    category: "general",
    priority: "low",
    status: "cancelled",
    assignee: "CSM Thu Trang",
    createdDate: "2026-05-10",
    description: "Phiếu tạo trùng với phiếu TCK-008 do 2 nhân viên cùng tiếp nhận yêu cầu từ phụ huynh qua kênh tổng đài.",
    interactionLogs: [],
    type: "support"
  },
  {
    id: "TCK-011",
    studentId: "s25",
    studentName: "Hoàng Ngọc Anh",
    studentCode: "STU-025",
    studentPhone: "0933445566",
    branch: "170 Nguyễn Tuân",
    title: "Đề xuất chuyển chi nhánh về gần nhà (Linh Đàm)",
    category: "attendance",
    priority: "medium",
    status: "in_progress",
    assignee: "AnhNTN33",
    createdDate: "2026-06-04",
    description: "Gia đình mới chuyển nhà sang khu vực Linh Đàm nên muốn chuyển cơ sở học của bé sang cơ sở Linh Đàm cùng trình độ Starter 2.",
    interactionLogs: [
      {
        id: "log-7",
        date: "2026-06-04",
        staffName: "AnhNTN33",
        channel: "phone",
        notes: "Đã liên hệ cơ sở Linh Đàm kiểm tra lớp ST-02, hiện còn 2 chỗ trống vào thứ 7."
      }
    ],
    type: "support"
  },
  {
    id: "TCK-012",
    studentId: "s26",
    studentName: "Phan Quốc Đạt",
    studentCode: "STU-026",
    studentPhone: "0944556677",
    branch: "Vin SA1",
    title: "Cảnh báo chỉ tiêu tái tục khóa học C100",
    category: "billing",
    priority: "high",
    status: "new",
    assignee: "CSM Hoàng Lan",
    createdDate: "2026-06-05",
    description: "Học viên sắp kết thúc lộ trình 72 buổi còn 8 buổi nữa. Kích hoạt cảnh báo tái tục sớm nhận ưu đãi 15% học phí toàn khóa mới.",
    interactionLogs: [],
    type: "care",
    alertCode: "C100"
  }
]

export function getTickets(filters?: {
  search?: string
  category?: string
  priority?: string
  status?: string
  studentId?: string
  branch?: string
  type?: 'care' | 'support' | 'all'
}): SupportTicket[] {
  return mockTickets.filter((t) => {
    if (filters?.studentId && t.studentId !== filters.studentId) return false
    if (filters?.branch && filters.branch !== 'all' && t.branch !== filters.branch) return false
    if (filters?.category && filters.category !== 'all' && t.category !== filters.category) return false
    if (filters?.priority && filters.priority !== 'all' && t.priority !== filters.priority) return false
    if (filters?.status && filters.status !== 'all' && t.status !== filters.status) return false
    if (filters?.type && filters.type !== 'all' && t.type !== filters.type) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        t.studentName.toLowerCase().includes(q) ||
        t.studentCode.toLowerCase().includes(q) ||
        (t.studentPhone && t.studentPhone.includes(q)) ||
        (t.branch && t.branch.toLowerCase().includes(q)) ||
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
    id: `TCK-${String(mockTickets.length + 101).padStart(3, '0')}`,
    createdDate: new Date().toISOString().split('T')[0],
    interactionLogs: []
  }
  mockTickets = [newTicket, ...mockTickets]
  return newTicket
}
