import type { ShiftSection } from '@/mocks/shiftRoster'
import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'

export interface WorkRegistrationGridSection {
  id: ShiftSection
  label: string
  icon: string
  start: string
  end: string
}

export const WORK_REGISTRATION_GRID_SECTIONS: WorkRegistrationGridSection[] = [
  {
    id: 'morning',
    label: 'Buổi sáng',
    icon: '☀️',
    start: '08:00',
    end: '12:00',
  },
  {
    id: 'afternoon',
    label: 'Buổi chiều',
    icon: '🌤',
    start: '13:00',
    end: '17:30',
  },
  {
    id: 'evening',
    label: 'Buổi tối',
    icon: '🌙',
    start: '17:30',
    end: '22:00',
  },
]

export type WorkRegistrationTab = 'mine' | 'roster' | 'staff' | 'center' | 'holidays'
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
  { value: 'mine', label: 'Đăng ký' },
  { value: 'staff', label: 'Lịch làm việc' },
  { value: 'roster', label: 'Lịch trực test' },
  { value: 'center', label: 'Trường' },
  { value: 'holidays', label: 'Lịch nghỉ lễ' },
]


export const WORK_VIEW_OPTIONS: Array<{ value: WorkRegistrationViewMode; label: string }> = [
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
]
