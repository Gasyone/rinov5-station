export type AttendanceStatusId = 'all' | 'pending_review' | 'approved' | 'rejected' | 'no_attendance'

export const ATTENDANCE_STATUS_CONFIG: Array<{ id: AttendanceStatusId; label: string; statusKey: string }> = [
  { id: 'pending_review', label: 'Chờ duyệt', statusKey: 'pending_review' },
  { id: 'approved', label: 'Đã duyệt', statusKey: 'approved' },
  { id: 'rejected', label: 'Từ chối', statusKey: 'rejected' },
  { id: 'no_attendance', label: 'Chưa điểm danh', statusKey: 'no_attendance' },
]

export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  pending_review: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  no_attendance: 'Chưa điểm danh',
}
