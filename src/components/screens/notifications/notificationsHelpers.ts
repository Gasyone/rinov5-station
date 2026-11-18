import {
  GraduationCap,
  CalendarDays,
  CreditCard,
  MessageSquareWarning,
  UserCheck,
  ShieldCheck,
} from 'lucide-react'
import type {
  NotificationItem,
  NotificationPriority,
  NotificationFilterState,
  CategoryOptionConfig,
  PriorityOptionConfig,
} from './notificationsTypes'

export const CATEGORY_FILTER_OPTIONS: CategoryOptionConfig[] = [
  { value: 'all', label: 'Tất cả danh mục' },
  { value: 'operations', label: 'Vận hành & Lịch học', icon: CalendarDays },
  { value: 'student_care', label: 'Chăm sóc học viên', icon: GraduationCap },
  { value: 'admissions', label: 'Tuyển sinh & Ghi danh', icon: UserCheck },
  { value: 'commercial', label: 'Đơn hàng & Học phí', icon: CreditCard },
  { value: 'ticket', label: 'Ticket & Khiếu nại', icon: MessageSquareWarning },
  { value: 'system', label: 'Hệ thống & Tài khoản', icon: ShieldCheck },
]

export const PRIORITY_FILTER_OPTIONS: PriorityOptionConfig[] = [
  { value: 'all', label: 'Tất cả mức độ' },
  { value: 'high', label: 'Khẩn cấp / Cao' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'low', label: 'Thấp' },
]

export const TIME_FILTER_OPTIONS = [
  { value: 'all', label: 'Mọi thời gian' },
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
]

export function getPriorityLabel(priority: NotificationPriority): string {
  switch (priority) {
    case 'high':
      return 'Khẩn cấp'
    case 'medium':
      return 'Trung bình'
    case 'low':
      return 'Thấp'
    default:
      return 'Bình thường'
  }
}

export function formatExactTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (!d || isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const hours = pad(d.getHours())
  const mins = pad(d.getMinutes())
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  return `${hours}:${mins} - ${day}/${month}/${year}`
}

export function filterNotifications(
  notifications: NotificationItem[],
  filters: NotificationFilterState
): NotificationItem[] {
  const now = new Date().getTime()

  return notifications.filter((notif) => {
    // 1. Status Filter
    if (filters.status === 'unread' && notif.read) return false
    if (filters.status === 'read' && !notif.read) return false

    // 2. Category Filter
    if (filters.category !== 'all' && notif.category !== filters.category) return false

    // 3. Priority Filter
    if (filters.priority !== 'all' && notif.priority !== filters.priority) return false

    // 4. Time Filter
    if (filters.timeRange !== 'all') {
      const notifTime = new Date(notif.timestamp).getTime()
      const diffMs = Math.max(0, now - notifTime)
      const diffDays = diffMs / (1000 * 60 * 60 * 24)

      if (filters.timeRange === 'today' && diffDays > 1) return false
      if (filters.timeRange === '7days' && diffDays > 7) return false
      if (filters.timeRange === '30days' && diffDays > 30) return false
    }

    // 5. Search Filter
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      const title = notif.title.toLowerCase()
      const msg = notif.message.toLowerCase()
      const entityId = (notif.entityId || '').toLowerCase()
      if (!title.includes(q) && !msg.includes(q) && !entityId.includes(q)) {
        return false
      }
    }

    return true
  })
}

export interface NotificationMetrics {
  total: number
  unread: number
  highPriority: number
  studentCare: number
  schedule: number
  commercial: number
}

export function calculateNotificationMetrics(notifications: NotificationItem[]): NotificationMetrics {
  let unread = 0
  let highPriority = 0
  let studentCare = 0
  let schedule = 0
  let commercial = 0

  for (const notif of notifications) {
    if (!notif.read) unread++
    if (notif.priority === 'high') highPriority++
    if (notif.category === 'student_care') studentCare++
    if (notif.category === 'schedule') schedule++
    if (notif.category === 'commercial') commercial++
  }

  return {
    total: notifications.length,
    unread,
    highPriority,
    studentCare,
    schedule,
    commercial,
  }
}
