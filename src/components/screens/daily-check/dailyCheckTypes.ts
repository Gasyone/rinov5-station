import type {
  DailyCheckShift,
  DailyCheckStatus,
  DailyItemEvaluation,
  DailyClosingTaskStatus,
  DailyAreaResult,
  DailyClosingResult,
  DailyCheckSubmission,
  DailyCatalogItem,
  DailyClosingTask,
  DailyCatalogVersion,
  DailyCatalogProposal,
} from '@/mocks/dailyCheck'

export type {
  DailyCheckShift,
  DailyCheckStatus,
  DailyItemEvaluation,
  DailyClosingTaskStatus,
  DailyAreaResult,
  DailyClosingResult,
  DailyCheckSubmission,
  DailyCatalogItem,
  DailyClosingTask,
  DailyCatalogVersion,
  DailyCatalogProposal,
}

export type DailyViewMode = 'matrix_week' | 'matrix_month' | 'table'

export interface DailyCheckFilterState {
  branch: string
  shift: 'all' | DailyCheckShift
  status: 'all' | DailyCheckStatus
  search: string
  date: string
  viewMode: DailyViewMode
}

export const INITIAL_DAILY_FILTER_STATE: DailyCheckFilterState = {
  branch: 'all',
  shift: 'all',
  status: 'all',
  search: '',
  date: 'all',
  viewMode: 'matrix_week',
}

export type DailyTileId = 'all' | 'perfect' | 'has_issues' | 'missing_late'

export interface DailySummaryStats {
  total: number
  perfect: number
  hasIssues: number
  missingOrLate: number
}

export interface CalendarDayInfo {
  dateStr: string // YYYY-MM-DD
  dayOfWeek: string // T2, T3...
  dayOfMonth: number
  isToday: boolean
}
