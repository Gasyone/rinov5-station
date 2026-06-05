export type NotificationCategory = 'system' | 'workflow' | 'reminder' | 'alert'
export type NotificationPriority = 'high' | 'medium' | 'low'

export interface NotificationItem {
  id: string
  title: string
  message: string
  category: NotificationCategory
  priority: NotificationPriority
  read: boolean
  timestamp: Date
  targetRoute: string
}

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  system: 'Hệ thống',
  workflow: 'Luồng nghiệp vụ',
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
  return CATEGORY_LABELS[category]
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'HV Nguyễn Văn A vắng buổi học CLASS-001',
    message: 'Học viên vắng mặt buổi học thứ 2 liên tiếp',
    category: 'workflow',
    priority: 'high',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60000),
    targetRoute: '/app/students/HV-A',
  },
  {
    id: 'n2',
    title: 'Đơn hàng ORD-2026-001 mới tạo',
    message: 'Đơn hàng khóa học IELTS Premium vừa được tạo',
    category: 'workflow',
    priority: 'medium',
    read: false,
    timestamp: new Date(Date.now() - 15 * 60000),
    targetRoute: '/app/orders/ORD-2026-001',
  },
  {
    id: 'n3',
    title: 'GV Trần Thị B đã điểm danh lớp IELTS-05',
    message: 'Điểm danh 12/15 học viên',
    category: 'system',
    priority: 'low',
    read: false,
    timestamp: new Date(Date.now() - 2 * 3600000),
    targetRoute: '/app/classes/IELTS-05',
  },
  {
    id: 'n4',
    title: 'Buổi học SESSION-012 đã bị hủy',
    message: 'Lý do: Giáo viên nghỉ ốm',
    category: 'alert',
    priority: 'high',
    read: false,
    timestamp: new Date(Date.now() - 3 * 3600000),
    targetRoute: '/app/calendar_class_schedule',
  },
  {
    id: 'n5',
    title: 'Ticket "HV phàn nàn học phí" mới tạo',
    message: 'Cần xử lý trước 17h hôm nay',
    category: 'alert',
    priority: 'high',
    read: false,
    timestamp: new Date(Date.now() - 24 * 3600000),
    targetRoute: '/app/support_tickets',
  },
  {
    id: 'n6',
    title: 'Lịch học mới cho lớp TOEIC-03',
    message: 'Thứ 3, Thứ 5 hàng tuần từ 18:00',
    category: 'reminder',
    priority: 'medium',
    read: false,
    timestamp: new Date(Date.now() - 2 * 86400000),
    targetRoute: '/app/calendar_class_schedule',
  },
]

export function generateMockNotifications(): NotificationItem[] {
  return MOCK_NOTIFICATIONS
}
