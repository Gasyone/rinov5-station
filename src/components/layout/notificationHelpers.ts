import {
  CalendarDays,
  CalendarX,
  CreditCard,
  ClipboardCheck,
  MessageSquareWarning,
  CircleDollarSign,
  FileText,
  AlertTriangle,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

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
 * Resolver mapping exact business notification events to semantic Lucide icons & colors
 * Directly grounded in Rinov5 Station modules (Classes, Students, Orders, Schedule, Tickets).
 */
export function getBusinessIconConfig(notif: NotificationItem): { icon: LucideIcon; color: string } {
  const title = notif.title.toLowerCase()
  const msg = notif.message.toLowerCase()

  // 1. Buổi học bị hủy / Thay đổi lịch đột xuất (Lịch biểu)
  if (title.includes('hủy') || msg.includes('hủy')) {
    return { icon: CalendarX, color: 'text-rose-500 dark:text-rose-400' }
  }

  // 2. Điểm danh lớp học (Vận hành lớp học)
  if (title.includes('điểm danh') || msg.includes('điểm danh')) {
    return { icon: ClipboardCheck, color: 'text-blue-500 dark:text-blue-400' }
  }

  // 3. Đơn hàng mới / Thanh toán học phí (CRM & Thương mại)
  if (notif.category === 'commercial' && (title.includes('đơn hàng') || title.includes('ord-') || title.includes('phiếu thu'))) {
    return { icon: CreditCard, color: 'text-emerald-500 dark:text-emerald-400' }
  }

  // 4. Tái phí học viên (Tái phí & Công nợ)
  if (title.includes('tái phí') || msg.includes('tái phí')) {
    return { icon: CircleDollarSign, color: 'text-amber-500 dark:text-amber-400' }
  }

  // 5. Đơn bảo lưu / Nghỉ phép (Bảo lưu & Nghỉ phép)
  if (title.includes('bảo lưu') || title.includes('nghỉ phép') || msg.includes('bảo lưu')) {
    return { icon: FileText, color: 'text-indigo-500 dark:text-indigo-400' }
  }

  // 6. Ticket phản ánh & Khiếu nại (Ticket & Chất lượng)
  if (notif.category === 'ticket' || title.includes('ticket') || title.includes('phàn nàn') || title.includes('khiếu nại')) {
    return { icon: MessageSquareWarning, color: 'text-amber-500 dark:text-amber-400' }
  }

  // 7. Học vụ & Chăm sóc học viên (Vắng học, Điểm thi, Xếp lớp)
  if (notif.category === 'student_care' || title.includes('vắng') || title.startsWith('hv')) {
    return { icon: GraduationCap, color: 'text-indigo-500 dark:text-indigo-400' }
  }

  // 8. Lịch học mới / Lịch test (Lịch biểu trung tâm)
  if (notif.category === 'schedule' || title.includes('lịch')) {
    return { icon: CalendarDays, color: 'text-sky-500 dark:text-sky-400' }
  }

  // Fallbacks
  return { icon: AlertTriangle, color: 'text-zinc-500 dark:text-zinc-400' }
}

/**
 * Format relative time for notifications theo chuẩn gọn gàng:
 * - < 60s: s (ví dụ: "30s")
 * - < 60 phút: m (ví dụ: "5m", "15m")
 * - < 24 giờ: h (ví dụ: "1h", "3h")
 * - < 7 ngày: d (ví dụ: "1d", "3d")
 * - Từ 1 tuần đến dưới 8 tuần: tuần (ví dụ: "1 tuần", "2 tuần", "5 tuần")
 * - Quá 8 tuần (> 2 tháng): date DD/MM/YYYY
 */
export function getRelativeTime(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  if (!parsedDate || isNaN(parsedDate.getTime())) return ''

  const now = new Date()
  const diffMs = Math.max(0, now.getTime() - parsedDate.getTime())
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)
  const diffWeek = Math.floor(diffDay / 7)

  if (diffSec < 60) return `${Math.max(1, diffSec)}s`
  if (diffMin < 60) return `${diffMin}m`
  if (diffHour < 24) return `${diffHour}h`
  if (diffDay < 7) return `${diffDay}d`
  if (diffWeek < 8) return `${diffWeek} tuần`

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = parsedDate.getFullYear()
  return `${day}/${month}/${year}`
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  // --- 6 UNREAD NOTIFICATIONS ---
  {
    id: 'n1',
    title: 'HV Nguyễn Văn A vắng mặt không phép tại lớp CLASS-001',
    message:
      'Học viên vắng mặt buổi thứ 2 liên tiếp (Phòng Lab 201 - GV Trần Thị B). Hệ thống đã tự động kích hoạt ticket chăm sóc, vui lòng liên hệ phụ huynh để xác nhận lý do và xếp lịch học bù.',
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
    title: 'Đơn hàng ORD-2026-001 khóa học IELTS Intensive 6.5 mới tạo',
    message:
      'Đơn hàng giá trị 18.500.000đ vừa được tạo bởi bộ phận Tuyển sinh cho học viên mới. Vui lòng kiểm tra biểu phí, xác nhận thông tin hóa đơn và hướng dẫn phụ huynh thanh toán trước 17h00.',
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
    title: 'Buổi học SESSION-012 lớp IELTS-02 thông báo hủy đột xuất',
    message:
      'Lý do: GV Phạm Văn K báo ốm đột xuất. 14 học viên trong lớp đã được hệ thống gửi tin ZNS thông báo dời lịch, nhân sự vận hành cần phối hợp xếp lịch dạy bù vào cuối tuần.',
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
    title: 'Ticket TCK-2026-089: Phụ huynh HV Lê Văn C phản hồi học phí',
    message:
      'Phụ huynh thắc mắc về chính sách hoàn phí và yêu cầu chuyển ca học sang tối thứ Sáu. SLA xử lý khiếu nại khẩn cấp trong vòng 2 giờ, phụ trách bởi nhân sự Chăm sóc học vụ.',
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
    title: 'Đến kỳ tái phí: HV Đặng Thị H (Lớp IELTS-02) còn 3 buổi',
    message:
      'Gói học phí 36 buổi của học viên sẽ kết thúc vào ngày 15/10/2026. Chuyên viên CSM cần liên hệ trao đổi lộ trình học tiếp theo và áp dụng voucher ưu đãi tái ký sớm 10%.',
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
    title: 'Học viên Trần Quốc B đăng ký ca học bù lớp TOEIC-02',
    message:
      'Đăng ký học bù chuyên đề Listening Unit 4 vào ca 19h30 thứ Sáu tại Phòng 302. Sĩ số lớp hiện tại 11/15, hệ thống tự động kiểm tra đủ chỗ và ghi nhận vào danh sách dự thính.',
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
    title: 'GV Trần Thị B đã hoàn tất điểm danh lớp IELTS-05',
    message:
      'Báo cáo điểm danh buổi học 12/24: 13 học viên có mặt, 1 học viên có phép, 1 vắng không phép. Sổ theo dõi chuyên cần và đánh giá buổi học đã được lưu vào hệ thống.',
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
    title: 'Thời khóa biểu mới lớp TOEIC-03 đã được duyệt xếp phòng',
    message:
      'Lịch học cố định vào Thứ 3 - Thứ 5 hàng tuần (18:00 - 19:30) tại Phòng Lab 204. Phòng Đào tạo đã phân công GV Vũ Hoàng L phụ trách và hoàn tất cấp phát giáo trình.',
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
    title: 'Đơn xin bảo lưu mới: HV Hoàng Kim E lớp IELTS-01',
    message:
      'Học viên nộp đơn xin tạm hoãn đào tạo trong thời hạn 2 tháng (từ 15/10 đến 15/12/2026) vì lý do công tác. Hồ sơ kèm minh chứng đã chuyển Quản lý chi nhánh xét duyệt.',
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
    title: 'Phiếu thu học phí PT-2026-102 đã xác nhận hoàn tất',
    message:
      'Hệ thống đối soát thành công số tiền 8.500.000đ qua cổng thanh toán VNPAY QR cho đơn hàng ORD-2026-004. Hóa đơn điện tử hợp lệ đã được gửi tự động qua email phụ huynh.',
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
    title: 'Lịch kiểm tra trải nghiệm đầu vào cho 3 học viên mới',
    message:
      'Ca kiểm tra xếp lớp lúc 15h30 ngày mai tại Phòng Test 01. Đã phân công giám thị và chuẩn bị sẵn đề thi 4 kỹ năng trên hệ thống máy tính trung tâm.',
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
    title: 'Lớp trải nghiệm Robotics chiều nay tại cơ sở Cầu Giấy',
    message:
      'Sĩ số ghi nhận: 8/10 học viên đã xác nhận tham dự. Bộ phận Lễ tân và Trợ giảng đã chuẩn bị đầy đủ bộ kit lắp ráp và quà tặng chào mừng cho các bạn nhỏ.',
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
    title: 'Yêu cầu điều chuyển phòng học cho lớp IELTS-08 đã duyệt',
    message:
      'Do nhu cầu bổ sung thêm máy chiếu và loa ngoài, lớp được chuyển từ Phòng 201 sang Hội trường A. Học viên và giáo viên đã nhận được tin nhắn cập nhật phòng học mới.',
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
    title: 'Báo cáo buổi học lớp IELTS-01 đã được giáo viên nộp',
    message:
      'GV John Doe đã hoàn tất ghi chú đánh giá học tập từng học viên và bài tập về nhà Unit 6. Phụ huynh có thể tra cứu kết quả buổi học trực tiếp trên ứng dụng phụ huynh.',
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
    title: 'Phòng Lab 201 đã hoàn thành kiểm định và bảo trì thiết bị',
    message:
      'Đội ngũ kỹ thuật IT đã kiểm tra toàn bộ 25 máy tính trạm, đường truyền mạng cáp quang và tai nghe chuyên dụng. Phòng học đã đủ điều kiện bàn giao cho các ca thi chính thức.',
    category: 'operations',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 72 * 3600000),
    targetRoute: '/app/classes',
  },
  {
    id: 'n16',
    title: 'Học viên Vũ Thùy D đạt chứng chỉ TOEIC 850 vượt kỳ vọng',
    message:
      'Kết quả thi chính thức tại IIG vượt chuẩn đầu ra 800 điểm của lộ trình đào tạo. Phòng Đào tạo đã ghi nhận thành tích xuất sắc và làm thủ tục trao học bổng vinh danh.',
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
    title: 'Biên bản kiểm tra chất lượng cơ sở Daily Check đạt 98/100',
    message:
      'Chi nhánh Cầu Giấy đã hoàn thành khắc phục các tồn đọng về vệ sinh và biển bảng phòng học. Ban Giám đốc đã nghiệm thu và xếp hạng loại A trong tuần đánh giá.',
    category: 'operations',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 9 * 86400000),
    targetRoute: '/app/branches',
  },
  {
    id: 'n18',
    title: 'Tổng kết Hội thảo chiến lược học tiếng Anh học thuật 2026',
    message:
      'Sự kiện workshop chuyên môn đã diễn ra thành công với sự tham dự của 45 phụ huynh và học viên. Đã có 12 phụ huynh đăng ký kiểm tra năng lực đầu vào tại chỗ.',
    category: 'schedule',
    priority: 'low',
    read: true,
    timestamp: new Date(Date.now() - 15 * 86400000),
    targetRoute: '/app/event_management_new',
  },
]

export function generateMockNotifications(): NotificationItem[] {
  return MOCK_NOTIFICATIONS
}
