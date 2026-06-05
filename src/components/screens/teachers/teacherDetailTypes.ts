export type TeacherDetailTabId = 'overview' | 'classes' | 'schedule' | 'sub_history' | 'quality' | 'stats' | 'notes' | 'activity_log'

export const TEACHER_TABS: Array<{ id: TeacherDetailTabId; label: string }> = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'classes', label: 'Lớp phụ trách' },
  { id: 'schedule', label: 'Lịch dạy' },
  { id: 'sub_history', label: 'Dạy thay' },
  { id: 'quality', label: 'Chất lượng' },
  { id: 'stats', label: 'Thống kê' },
  { id: 'notes', label: 'Ghi chú' },
  { id: 'activity_log', label: 'Nhật ký' },
]
