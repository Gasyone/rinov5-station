import type { ShiftSection } from '@/mocks/shiftRoster'
import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'

export interface WorkRegistrationGridSection {
  id: ShiftSection
  label: string
  icon: string
  slots: string[]
}

export const WORK_REGISTRATION_GRID_SECTIONS: WorkRegistrationGridSection[] = [
  {
    id: 'morning',
    label: 'Buổi sáng',
    icon: '☀️',
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  },
  {
    id: 'afternoon',
    label: 'Buổi chiều',
    icon: '🌤',
    slots: ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  },
  {
    id: 'evening',
    label: 'Buổi tối',
    icon: '🌙',
    slots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
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
  { value: 'roster', label: 'Quản lý lịch trực' },
  { value: 'staff', label: 'Quản lý lịch học' },
  { value: 'center', label: 'Trường' },
  { value: 'holidays', label: 'Lịch nghỉ lễ' },
]


export const WORK_VIEW_OPTIONS: Array<{ value: WorkRegistrationViewMode; label: string }> = [
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
]
