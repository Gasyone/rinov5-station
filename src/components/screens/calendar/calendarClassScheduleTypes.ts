import type { ClassSession } from '@/mocks/calendarSchedule'

export type ViewMode = 'day' | 'week'

export interface FilterState {
  branchFilters: string[]
  levelFilters: string[]
  conditionFilters: string[]
  subjectFilters: string[]
  teacherFilters: string[]
  periodFilters: string[]
  roomFilters: string[]
  trialFilters: string[]
  attendanceFilters: string[]
  capacityFilters: string[]
}

export type { ClassSession }
