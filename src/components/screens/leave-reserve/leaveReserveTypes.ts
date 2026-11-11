import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

export interface LeaveReserveFilterState {
  types: Array<LeaveReserveRequest['type']>
  dateRanges: Array<'this-week' | 'this-month' | 'last-month' | 'custom'>
  schools: string[]
  packages: string[]
  staff: string[]
  classes: string[]
}

export const TYPE_LABELS: Record<LeaveReserveRequest['type'], string> = {
  off: 'Nghỉ phép',
  reservation: 'Bảo lưu',
  learn_again: 'Đi học lại',
}

export const DATE_RANGE_LABELS: Record<LeaveReserveFilterState['dateRanges'][number], string> = {
  'this-week': 'Tuần này',
  'this-month': 'Tháng này',
  'last-month': 'Tháng trước',
  custom: 'Tùy chọn',
}

export const STATUS_LABELS: Record<LeaveReserveRequest['status'], string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  not_approved: 'Không duyệt',
  cancel: 'Hủy duyệt',
}

export interface StudentClassSession {
  id: string
  classCode: string
  className: string
  sessionIndex: number
  sessionName: string
  date: string
  formattedDate: string
  dayOfWeek: string
  time: string
  teacherName?: string
  room?: string
  topic?: string
  lessonContent?: {
    words?: string
    sentences?: string
    phonics?: string
  }
  alreadyRequested?: boolean
  existingRequestCode?: string
  existingRequestStatus?: LeaveReserveRequest['status']
}

export interface LeaveReservePackageItem {
  id: string
  packageName: string
  subject: string
  classCode: string
  className: string
  remainingSessions: number
  totalSessions: number
  schedule?: string
}

export interface StudentEnrolledClassTree {
  classCode: string
  className: string
  type: string
  scheduleText: string
  teacherName: string
  room?: string
  progress?: string
  enrolledStudents: number
  maxStudents: number
  isOmo: boolean
  packageName?: string
  subject?: string
  remainingSessions?: number
  totalSessions?: number
  sessions: StudentClassSession[]
}

