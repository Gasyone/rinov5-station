export type TeacherStatusId = 'all' | 'active' | 'on_leave' | 'probation' | 'resigned'

export const TEACHER_STATUS_CONFIG: Array<{ id: TeacherStatusId; label: string; statusKey: string }> = [
  { id: 'active', label: 'Đang giảng dạy', statusKey: 'active' },
  { id: 'on_leave', label: 'Đang nghỉ', statusKey: 'on_leave' },
  { id: 'probation', label: 'Thử việc', statusKey: 'probation' },
  { id: 'resigned', label: 'Đã nghỉ việc', statusKey: 'resigned' },
]

export const TEACHER_STATUS_LABELS: Record<string, string> = {
  active: 'Đang giảng dạy',
  on_leave: 'Đang nghỉ',
  probation: 'Thử việc',
  resigned: 'Đã nghỉ việc',
}
