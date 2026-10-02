import type { ClassSession } from '@/mocks/calendarSchedule'

export type ViewMode = 'day' | 'week'

export interface FilterState {
  branchFilters: string[]
  levelFilters: string[]
  sessionTypeFilters: string[]
  statusFilters?: string[]
  conditionFilters: string[]
  subjectFilters: string[]
  teacherFilters: string[]
  periodFilters: string[]
  roomFilters: string[]
  trialFilters: string[]
  attendanceFilters: string[]
  capacityFilters: string[]
  branchRoomFilters?: Record<string, string[]>
  subjectLevelFilters?: Record<string, string[]>
}

export const DEFAULT_FILTER_STATE: FilterState = {
  branchFilters: [],
  levelFilters: [],
  sessionTypeFilters: [],
  statusFilters: [],
  conditionFilters: [],
  subjectFilters: [],
  teacherFilters: [],
  periodFilters: [],
  roomFilters: [],
  trialFilters: [],
  attendanceFilters: [],
  capacityFilters: [],
  branchRoomFilters: {},
  subjectLevelFilters: {},
}

export type { ClassSession }
