import type { SupportTicket, TicketInteractionLog } from '@/mocks/tickets'

export type TicketStatusFilter = 'all' | 'new' | 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface SupportTicketFilterState {
  search: string
  status: TicketStatusFilter
  category: string
  priority: string
  type: string
  assignee: string
}

export interface StatusTileItem {
  id: TicketStatusFilter
  label: string
  count: number
  variant: 'default' | 'info' | 'warning' | 'success' | 'destructive' | 'neutral'
}

export const CATEGORY_LABELS: Record<string, string> = {
  academic: 'Học thuật & Đào tạo',
  billing: 'Học phí & Thu chi',
  attendance: 'Điểm danh & Lịch học',
  general: 'Yêu cầu & Góp ý chung',
}

export const PRIORITY_LABELS: Record<string, string> = {
  high: 'Ưu tiên cao',
  medium: 'Trung bình',
  low: 'Thấp',
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'Mới tạo',
  pending: 'Chờ xử lý',
  in_progress: 'Đang xử lý',
  completed: 'Đã giải quyết',
  cancelled: 'Đã đóng / Hủy',
}

export const TYPE_LABELS: Record<string, string> = {
  care: 'Chăm sóc chủ động',
  support: 'Hỗ trợ sự cố',
}

export const CHANNEL_LABELS: Record<string, string> = {
  phone: 'Gọi điện',
  zalo: 'Nhắn Zalo',
  face_to_face: 'Gặp trực tiếp',
  email: 'Gửi Email',
}

export type { SupportTicket, TicketInteractionLog }
