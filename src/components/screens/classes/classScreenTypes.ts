export type StatusTabId = 'all' | 'active' | 'upcoming' | 'completed' | 'cancelled' | 'on_hold'

export const STATUS_CONFIG: Array<{ id: StatusTabId; label: string; statusKey: string }> = [
  { id: 'active', label: 'Đang học', statusKey: 'active' },
  { id: 'upcoming', label: 'Chờ khai giảng', statusKey: 'upcoming' },
  { id: 'completed', label: 'Đã kết thúc', statusKey: 'completed' },
  { id: 'cancelled', label: 'Đã hủy', statusKey: 'cancelled' },
  { id: 'on_hold', label: 'Tạm dừng', statusKey: 'on_hold' },
]
