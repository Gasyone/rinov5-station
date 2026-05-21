import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'

export type WorkRegistrationTab = 'mine' | 'staff' | 'center'
export type WorkRegistrationViewMode = 'week' | 'month'
export type WorkRegistrationStaffLayout = 'split' | 'list' | 'grid'
export type WorkRegistrationStatusFilter =
  | 'all'
  | 'not_registered'
  | 'registered'
  | 'locked'

export interface EmployeeWeekSummary {
  employee: WorkRegistrationEmployee
  records: WorkRegistrationRecord[]
  totalMinutes: number
  status: WorkRegistrationStatusFilter
  lockedCount: number
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
  locked: 'Đã khóa',
}

export const WORK_TAB_OPTIONS: Array<{ value: WorkRegistrationTab; label: string }> = [
  { value: 'mine', label: 'Lịch của tôi' },
  { value: 'staff', label: 'Nhân viên' },
  { value: 'center', label: 'Trung tâm' },
]

export const WORK_STAFF_LAYOUT_OPTIONS: Array<{ value: WorkRegistrationStaffLayout; label: string }> = [
  { value: 'split', label: 'Cả hai' },
  { value: 'list', label: 'Danh sách' },
  { value: 'grid', label: 'Lịch' },
]

export const WORK_VIEW_OPTIONS: Array<{ value: WorkRegistrationViewMode; label: string }> = [
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
]
