import type { ScheduleGridItem } from '@/components/screens/schedule/ScheduleTimeGrid'
import type { LessonContent } from '@/mocks/calendarSchedule'

export interface UnifiedSlot extends ScheduleGridItem {
  id: string
  scheduleType: 'class' | 'event'
  title: string
  subtitle: string
  className?: string
  kctName?: string
  date: string
  timeLabel: string
  endTimeLabel: string
  branch: string
  personLabel: string
  teacher?: string
  type: string
  typeLabel: string
  totalStudents?: number
  officialStudents?: number
  trialStudents?: number
  attendedStudents?: number
  isRecurring?: boolean
  substituteTeacher?: string
  assistantTeacher?: string
  assistantSubstitute?: string
  status?: string
  dateBucket: 'past' | 'today' | 'upcoming'
  isOpeningDay?: boolean
  classCode?: string
  level?: string
  note?: string
  lessonSubtitle?: string
  lessonNumber?: number | string
  lessonContent?: LessonContent | string
  schoolRoom?: string
  subject?: string
}

export interface MyScheduleFilters {
  activeBranch: string
  bucketFilters: string[]
  sourceFilters: string[]
  statusFilters: string[]
  typeFilters: string[]
  search: string
  today: Date
  subjectFilters: string[]
  roomFilters: string[]
  conditionFilters: string[]
}

export type ScheduleLayoutType = 'matrix' | 'schedule_1d'
