import type { ScheduleGridItem } from '@/components/screens/schedule/ScheduleTimeGrid'

export interface UnifiedSlot extends ScheduleGridItem {
  id: string
  scheduleType: 'class' | 'event'
  title: string
  subtitle: string
  date: string
  timeLabel: string
  endTimeLabel: string
  branch: string
  personLabel: string
  type: string
  typeLabel: string
  totalStudents?: number
  trialStudents?: number
  attendedStudents?: number
  isRecurring?: boolean
  substituteTeacher?: string
  status?: string
  dateBucket: 'past' | 'today' | 'upcoming'
  isOpeningDay?: boolean
  classCode?: string
  level?: string
  note?: string
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
