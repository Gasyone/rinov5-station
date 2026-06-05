export interface SessionFeedbackGroup {
  sessionId: string
  sessionCode: string
  className: string
  classCode: string
  teacher: string
  date: string
  topic?: string
  feedbacks: import('@/mocks/sessionFeedback').SessionFeedback[]
}

export type FeedbackStatusId = 'all' | 'completed' | 'pending' | 'needs_follow_up'
export type HomeworkStatusId = 'all' | 'done' | 'missing' | 'late' | 'partial'
export type AttendanceStatusId = 'all' | 'present' | 'absent' | 'late' | 'excused'

export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  all: 'Tất cả',
  completed: 'Đã nhận xét',
  pending: 'Chưa nhận xét',
  needs_follow_up: 'Cần theo dõi',
}

export const HOMEWORK_STATUS_LABELS: Record<string, string> = {
  all: 'Tất cả',
  done: 'Đã nộp',
  missing: 'Chưa nộp',
  late: 'Nộp muộn',
  partial: 'Nộp một phần',
}

export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  all: 'Tất cả',
  present: 'Có mặt',
  absent: 'Vắng',
  late: 'Đến muộn',
  excused: 'Có phép',
}