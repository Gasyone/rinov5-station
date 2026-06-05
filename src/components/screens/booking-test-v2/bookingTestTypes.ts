import type { BookingStatus } from '@/mocks/bookingTests'

export type StatusTileId = 'all' | BookingStatus | 'interviewed' | 'tested' | 'unassigned_teacher' | 'checkin'
export type ConditionFilter = 'interviewed' | 'tested' | 'failed' | 'checkin'

export interface FilterState {
  schools: string[]
  statuses: BookingStatus[]
  conditions: ConditionFilter[]
  teachers: string[]
  weekdays: string[]
  programs: string[]
  subjects: string[]
  sales: string[]
}

export interface CreateBookingForm {
  studentId: string
  childName: string
  program: string
  level: string
  school: string
  room: string
  teacher: string
  notes: string
  scheduleDate: string
  scheduleTime: string
  testDuration: string
}

export type AssessmentTab = 'form2025' | 'oldForm'

export type FeedbackAnswer = '' | 'positive' | 'negative'

export type ScoreValue = '' | 0 | 0.5 | 1

export interface AssessmentOldFormDraft {
  scoreSelections: Record<string, ScoreValue>
  isSkipped: boolean
  vocabLevel: 'limited' | 'basic' | 'rich' | ''
  vocabRemembered: string
  vocabForgotten: string
  grammarRemembered: string
  grammarForgotten: string
  grammarErrors: string[]
  grammarDetail: string
  openQuestion: 'cannotAnswer' | 'needsSupport' | 'fluentExpanded' | ''
  pronunciationErrors: string[]
  pronunciationDetail: string
  fluencyAnswers: Record<string, 'positive' | 'negative' | ''>
  generalComment: string
}

export interface AssessmentDraft {
  evaluatorId: string
  testType: 'preStarters' | 'starters' | 'movers' | 'flyers'
  selectedTab: AssessmentTab
  isSkipped2025: boolean
  weaknesses: string[]
  feedbackAnswers: Record<string, FeedbackAnswer>
  scoreSelections: Record<string, ScoreValue>
  oldForm: AssessmentOldFormDraft
  level: string
  subLevel: string
  speaking: string
  lwr: string
  path: string
}

export interface StatusConfigItem {
  id: Exclude<StatusTileId, 'all'>
  label: string
  /** Status string to resolve via @/lib/statusColors */
  status: string
}
