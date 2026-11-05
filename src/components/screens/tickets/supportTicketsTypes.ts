import type { SupportTicket, TicketInteractionLog } from '@/mocks/tickets'
import type { StatusSemantic } from '@/lib/statusColors'
import type { SegmentedControlOption } from '@/components/controls'

export type TicketStatusFilter =
  | 'all'
  | 'new'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export const BRANCH_OPTIONS = [
  '170 Nguyễn Tuân',
  'Linh Đàm',
  'Vin SA1',
  'Tonkin',
  'KDV',
]

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
  support: 'Hỗ trợ sự cố',
  care: 'Chăm sóc chủ động',
}

export const CHANNEL_LABELS: Record<string, string> = {
  phone: 'Gọi điện',
  zalo: 'Nhắn Zalo',
  face_to_face: 'Gặp trực tiếp',
  email: 'Gửi Email',
}

export interface StatusTileConfigItem {
  id: TicketStatusFilter
  label: string
  semantic?: StatusSemantic
}

export const STATUS_TILE_CONFIG: StatusTileConfigItem[] = [
  { id: 'all', label: 'Tất cả ticket', semantic: 'neutral' },
  { id: 'new', label: 'Mới tạo', semantic: 'info' },
  { id: 'pending', label: 'Chờ xử lý', semantic: 'warning' },
  { id: 'in_progress', label: 'Đang xử lý', semantic: 'warning' },
  { id: 'completed', label: 'Đã giải quyết', semantic: 'completed' },
  { id: 'cancelled', label: 'Đã đóng / Hủy', semantic: 'neutral' },
]

export const TYPE_SEGMENT_OPTIONS: SegmentedControlOption<string>[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'support', label: '🎧 Hỗ trợ sự cố' },
  { value: 'care', label: '💙 Chăm sóc' },
]

export const CATEGORY_SELECT_OPTIONS = [
  { value: 'all', label: 'Tất cả phân loại' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
]

export const STATUS_FILTER_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export const BRANCH_FILTER_OPTIONS = BRANCH_OPTIONS.map((b) => ({
  value: b,
  label: b,
}))

export const CATEGORY_FILTER_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export const PRIORITY_FILTER_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export const TYPE_FILTER_OPTIONS = Object.entries(TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export const ASSIGNEE_FILTER_OPTIONS = [
  { value: 'AnhNTN33', label: 'AnhNTN33 (CSM Trưởng)' },
  { value: 'CSM Minh Phương', label: 'CSM Minh Phương' },
  { value: 'CSM Hoàng Lan', label: 'CSM Hoàng Lan' },
  { value: 'CSM Thu Trang', label: 'CSM Thu Trang' },
  { value: 'Giáo vụ Cơ sở', label: 'Giáo vụ Cơ sở' },
]

export interface AdvancedFilterState {
  branches: string[]
  statuses: SupportTicket['status'][]
  categories: SupportTicket['category'][]
  priorities: SupportTicket['priority'][]
  types: SupportTicket['type'][]
  assignees: string[]
}

export const INITIAL_ADVANCED_FILTER_STATE: AdvancedFilterState = {
  branches: [],
  statuses: [],
  categories: [],
  priorities: [],
  types: [],
  assignees: [],
}

export type { SupportTicket, TicketInteractionLog }
