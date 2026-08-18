import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'

export type WorkRegistrationTab = 'mine' | 'roster' | 'staff' | 'center'
export type WorkRegistrationViewMode = 'week' | 'month'
export type WorkRegistrationStatusFilter =
  | 'all'
  | 'not_registered'
  | 'registered'
export interface EmployeeWeekSummary {
  employee: WorkRegistrationEmployee
  records: WorkRegistrationRecord[]
  totalMinutes: number
  status: WorkRegistrationStatusFilter
}

export interface BranchWeekSummary {
  branch: string
  employeeCount: number
  registeredEmployeeCount: number
  totalMinutes: number
  coverageGapCount: number
  daySummaries: BranchDaySummary[]
  status: 'registered' | 'needs_attention' | 'not_registered'
}

export interface BranchDaySummary {
  date: string
  label: string
  registeredEmployeeCount: number
  totalMinutes: number
  coverageGapCount: number
}

export interface WorkRegistrationActionState {
  readonlyWeek: boolean
  canMutate: boolean
  primaryActionLabel: string
  actionHelperText: string
}

export interface SlotDetailTarget {
  date: string
  slotId: string
  branch?: string
}

export const WORK_STATUS_LABELS: Record<WorkRegistrationStatusFilter, string> = {
  all: 'Tất cả',
  not_registered: 'Chưa đăng ký',
  registered: 'Đã đăng ký',
}

export const WORK_TAB_OPTIONS: Array<{ value: WorkRegistrationTab; label: string }> = [
  { value: 'mine', label: 'Lịch của tôi' },
  { value: 'roster', label: 'Phân bổ ca trực' },
  { value: 'staff', label: 'Quản lý lịch' },
  { value: 'center', label: 'Trường' },
]


export const WORK_VIEW_OPTIONS: Array<{ value: WorkRegistrationViewMode; label: string }> = [
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
]
