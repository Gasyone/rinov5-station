export interface SessionGroup {
  classId: string
  className: string
  classCode: string
  teacher: string
  branch: string
  sessions: import('@/mocks/classSessions').ClassSession[]
}

export interface StatusTab {
  key: string
  label: string
  count: number
}

export const STATUS_TABS: StatusTab[] = [
  { key: 'all', label: 'Tất cả', count: 0 },
  { key: 'scheduled', label: 'Đã lên lịch', count: 0 },
  { key: 'in_progress', label: 'Đang diễn ra', count: 0 },
  { key: 'completed', label: 'Hoàn thành', count: 0 },
  { key: 'audited', label: 'Đã duyệt', count: 0 },
  { key: 'rescheduled', label: 'Đã dời lịch', count: 0 },
  { key: 'makeup', label: 'Học bù', count: 0 },
  { key: 'cancelled', label: 'Đã hủy', count: 0 },
]

export const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Đã lên lịch',
  in_progress: 'Đang diễn ra',
  completed: 'Hoàn thành',
  audited: 'Đã duyệt',
  cancelled: 'Đã hủy',
  rescheduled: 'Đã dời lịch',
  makeup: 'Học bù',
}
