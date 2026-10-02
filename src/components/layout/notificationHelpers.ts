export type NotificationCategory =
  | 'student_care' // Học vụ & Chăm sóc học viên (Vắng học, Bảo lưu, Xếp lớp)
  | 'schedule' // Lịch học & Buổi học (Lịch mới, Hủy buổi, Đổi phòng)
  | 'commercial' // Đơn hàng & Tài chính (Đơn mới, Thu phí, Tái phí)
  | 'ticket' // Khiếu nại & Chất lượng (Ticket phản ánh phụ huynh/học viên)
  | 'operations' // Vận hành lớp học (Điểm danh, Báo cáo buổi học)
  // Legacy aliases
  | 'workflow'
  | 'system'
  | 'reminder'
  | 'alert'

export type NotificationPriority = 'high' | 'medium' | 'low'

export interface NotificationItem {
  id: string
  title: string
  message: string
  category: NotificationCategory
  priority: NotificationPriority
  read: boolean
  timestamp: Date | string
  targetRoute: string
  entityType?: 'student' | 'class' | 'session' | 'order' | 'ticket' | 'lead'
  entityId?: string
}

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  student_care: 'Chăm sóc học viên',
  schedule: 'Lịch học',
  commercial: 'Đơn hàng & Thu phí',
  ticket: 'Ticket & Khiếu nại',
  operations: 'Vận hành lớp học',
  workflow: 'Luồng nghiệp vụ',
  system: 'Hệ thống',
  reminder: 'Nhắc nhở',
  alert: 'Cảnh báo',
}

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  high: 'bg-destructive',
  medium: 'bg-amber-400',
  low: 'bg-muted-foreground',
}

export function getPriorityColor(priority: NotificationPriority): string {
  return PRIORITY_COLORS[priority]
}

export function getCategoryLabel(category: NotificationCategory): string {
  return CATEGORY_LABELS[category] || 'Thông báo'
}

/**
 * Format relative time for notifications:
 * - < 1 phút: "Vừa xong"
 * - < 60 phút: "X phút trước"
 * - < 24 giờ: "X giờ trước"
 * - < 7 ngày: "X ngày trước"
 * - Từ 7 ngày trở lên (từ tuần trước đó): đổi sang ngày cụ thể dạng "DD/MM/YYYY"
 */
export function getRelativeTime(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  if (!parsedDate || isNaN(parsedDate.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - parsedDate.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`

  // Từ tuần trước đó (từ 7 ngày trở lên): chuyển sang ngày cụ thể DD/MM/YYYY
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = parsedDate.getFullYear()
  return `${day}/${month}/${year}`
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  // --- 6 UNREAD NOTIFICATIONS ---
  {
    id: 'n1',
    title: 'HV Nguyễn Văn A vắng buổi học CLASS-001',
    message: 'Học viên vắng mặt buổi học thứ 2 liên tiếp',
    category: 'student_care',
    priority: 'high',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60000),
    targetRoute: '/app/student_operations_alert',
    entityType: 'student',
    entityId: 'HV-001',
  },
  {
    id: 'n2',
    title: 'Đơn hàng ORD-2026-001 mới tạo',
    message: 'Đơn hàng khóa học IELTS Premium vừa được tạo',
    category: 'commercial',
    priority: 'medium',
    read: false,
    timestamp: new Date(Date.now() - 15 * 60000),
    targetRoute: '/app/orders',
    entityType: 'order',
    entityId: 'ORD-2026-001',
  },
  {
    id: 'n3',
    title: 'Buổi học SESSION-012 đã bị hủy',
    message: 'Lý do: Giáo viên nghỉ ốm đột xuất',
    category: 'schedule',
    priority: 'high',
    read: false,
    timestamp: new Date(Date.now() - 45 * 60000),
    targetRoute: '/app/calendar_class_schedule',
    entityType: 'session',
    entityId: 'SESSION-012',
  },
  {
    id: 'n4',
    title: 'Ticket "HV phàn nàn học phí" mới tạo',
    message: 'Cần xử lý trước 17h hôm nay',
    category: 'ticket',
    priority: 'high',
    read: false,
    timestamp: new Date(Date.now() - 90 * 60000),
    targetRoute: '/app/support_tickets',
    entityType: 'ticket',
    entityId: 'TCK-2026-089',
  },
  {
    id: 'n5',
    title: 'Đến kỳ tái phí: HV Lê Văn C (Lớp IELTS-02)',
    message: 'Gói học phí còn 3 buổi, cần liên hệ tái tục',
    category: 'commercial',
    priority: 'medium',
    read: false,
    timestamp: new Date(Date.now() - 3 * 3600000),
    targetRoute: '/app/renewal',
    entityType: 'student',
    entityId: 'HV-003',
  },
  {
    id: 'n6',
    title: 'Học viên Trần Quốc B đăng ký học bù',
    message: 'Buổi bù lớp TOEIC-02 vào 19h30 thứ 6',
    category: 'student_care',
    priority: 'medium',
    read: false,
    timestamp: new Date(Date.now() - 5 * 3600000),
    targetRoute: '/app/makeup_class',
    entityType: 'student',
    entityId: 'HV-007',
  },

  // --- READ NOTIFICATIONS (< 7 ngày) ---
  {
    id: 'n7',
    title: 'GV Trần Thị B đã điểm danh lớp IELTS-05',
    message: 'Điểm danh hoàn tất 12/15 học viên',
    category: 'operations',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 8 * 3600000),
    targetRoute: '/app/classes',
    entityType: 'class',
    entityId: 'IELTS-05',
  },
  {
    id: 'n8',
    title: 'Lịch học mới cho lớp TOEIC-03',
    message: 'Thứ 3, Thứ 5 hàng tuần từ 18:00 - 19:30',
    category: 'schedule',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 14 * 3600000),
    targetRoute: '/app/calendar_class_schedule',
    entityType: 'class',
    entityId: 'TOEIC-03',
  },
  {
    id: 'n9',
    title: 'Đơn bảo lưu mới: HV Hoàng Kim E',
    message: 'Xin bảo lưu 2 tháng từ 15/10 do công tác',
    category: 'student_care',
    priority: 'medium',
    read: true,
    timestamp: new Date(Date.now() - 24 * 3600000),
    targetRoute: '/app/leave_reserve',
    entityType: 'student',
    entityId: 'HV-005',
  },
  {
    id: 'n10',
    title: 'Phiếu thu học phí PT-2026-102 đã xác nhận',
    message: 'Đã nhận 8.500.000đ qua chuyển khoản VNPAY',
    category: 'commercial',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 28 * 3600000),
    targetRoute: '/app/payment_receipts',
    entityType: 'order',
    entityId: 'PT-2026-102',
  },
  {
    id: 'n11',
    title: 'Lịch test trải nghiệm cho 3 học viên mới',
    message: 'Ca test 15h30 ngày mai tại Phòng Test 01',
    category: 'schedule',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 36 * 3600000),
    targetRoute: '/app/booking_test',
    entityType: 'class',
    entityId: 'TEST-01',
  },
  {
    id: 'n12',
    title: 'Lớp học thử hôm nay tại cơ sở Cầu Giấy',
    message: 'Lớp Trải nghiệm Robotics - Sĩ số dự kiến: 8',
    category: 'student_care',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 48 * 3600000),
    targetRoute: '/app/trial_class',
    entityType: 'class',
    entityId: 'TRIAL-CG',
  },
  {
    id: 'n13',
    title: 'Yêu cầu đổi phòng học cho lớp IELTS-08',
    message: 'Chuyển từ Phòng 201 sang Hội trường A',
    category: 'schedule',
    priority: 'medium',
    read: true,
    timestamp: new Date(Date.now() - 54 * 3600000),
    targetRoute: '/app/calendar_class_schedule',
    entityType: 'session',
    entityId: 'SESSION-IELTS-08',
  },
  {
    id: 'n14',
    title: 'Báo cáo buổi học lớp IELTS-01 đã nộp',
    message: 'Giáo viên John Doe đã nộp nhận xét chi tiết',
    category: 'operations',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 60 * 3600000),
    targetRoute: '/app/classes',
    entityType: 'class',
    entityId: 'IELTS-01',
  },
  {
    id: 'n15',
    title: 'Phòng Lab 201 hoàn thành bảo trì thiết bị',
    message: 'Hệ thống máy tính và âm thanh đã sẵn sàng',
    category: 'operations',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 72 * 3600000),
    targetRoute: '/app/classes',
  },
  {
    id: 'n16',
    title: 'Học viên Vũ Thùy D đạt chứng chỉ TOEIC 850',
    message: 'Vượt mục tiêu đầu ra 800 điểm của khóa học',
    category: 'student_care',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 96 * 3600000),
    targetRoute: '/app/student_operations_alert',
    entityType: 'student',
    entityId: 'HV-012',
  },

  // --- READ NOTIFICATIONS (>= 7 ngày trước -> hiển thị định dạng ngày DD/MM/YYYY) ---
  {
    id: 'n17',
    title: 'Biên bản nghiệm thu sửa chữa cơ sở Cầu Giấy',
    message: 'Đã hoàn thành kiểm tra phòng học và trang thiết bị',
    category: 'operations',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 9 * 86400000), // 9 ngày trước -> DD/MM/YYYY
    targetRoute: '/app/branches',
  },
  {
    id: 'n18',
    title: 'Hội thảo giới thiệu khóa học IELTS 2026',
    message: 'Sự kiện đã kết thúc với 45 khách tham dự',
    category: 'schedule',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 15 * 86400000), // 15 ngày trước -> DD/MM/YYYY
    targetRoute: '/app/event_management_new',
  },
]

export function generateMockNotifications(): NotificationItem[] {
  return MOCK_NOTIFICATIONS
}
