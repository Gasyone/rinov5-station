import {
  WORK_TIME_SLOTS,
  getPriorityRequirement,
  getWorkWeekDays,
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
  type WorkRegistrationStatus,
} from '@/mocks/workRegistrations'
import type {
  BranchWeekSummary,
  EmployeeWeekSummary,
  WorkRegistrationActionState,
  WorkRegistrationStatusFilter,
} from './workRegistrationTypes'

export const formatWorkWeekRange = (weekStart: Date) => {
  const days = getWorkWeekDays(weekStart)
  const startDay = days[0].getDate().toString().padStart(2, '0')
  const startMonth = (days[0].getMonth() + 1).toString().padStart(2, '0')
  
  const endDay = days[6].getDate().toString().padStart(2, '0')
  const endMonth = (days[6].getMonth() + 1).toString().padStart(2, '0')
  const endYear = days[6].getFullYear()
  
  return `${startDay}/${startMonth} - ${endDay}/${endMonth}/${endYear}`
}

export const formatWorkMonth = (date: Date) => {
  return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
}

export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} phút`
  if (rest === 0) return `${hours} giờ`
  return `${hours} giờ ${rest} phút`
}

/** Compact format: "5:00", "1:30", "0:00" */
export const formatMinutesShort = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `${hours}:${rest.toString().padStart(2, '0')}`
}

export const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export const getSlot = (slotId: string) =>
  WORK_TIME_SLOTS.find((slot) => slot.id === slotId)

export const sumRegistrationMinutes = (records: WorkRegistrationRecord[]) =>
  records.reduce((total, record) => total + (getSlot(record.slotId)?.minutes ?? 0), 0)

export const getRecordsForWeek = (records: WorkRegistrationRecord[], weekStart: Date) => {
  const weekStartKey = toWorkDateKey(weekStart)
  return records.filter((record) => record.weekStart === weekStartKey)
}

export const getEmployeeWeekRecords = (
  records: WorkRegistrationRecord[],
  employeeId: string,
  weekStart: Date
) => getRecordsForWeek(records, weekStart).filter((record) => record.employeeId === employeeId)

export function resolveEmployeeWeekStatus(records: WorkRegistrationRecord[]): WorkRegistrationStatusFilter {
  // Bỏ qua các record đang nháp (chưa lưu) khi tính trạng thái của nhân viên
  const savedRecords = records.filter((record) => record.status !== 'draft')
  if (savedRecords.length === 0) return 'not_registered'
  if (savedRecords.some((record) => record.status === 'locked')) return 'locked'
  return 'registered'
}

export function buildEmployeeSummaries(
  employees: WorkRegistrationEmployee[],
  records: WorkRegistrationRecord[],
  weekStart: Date
): EmployeeWeekSummary[] {
  return employees.map((employee) => {
    const employeeRecords = getEmployeeWeekRecords(records, employee.id, weekStart)
    return {
      employee,
      records: employeeRecords,
      totalMinutes: sumRegistrationMinutes(employeeRecords),
      status: resolveEmployeeWeekStatus(employeeRecords),
      lockedCount: employeeRecords.filter((record) => record.status === 'locked').length,
    }
  })
}

export function filterEmployeeSummaries(
  summaries: EmployeeWeekSummary[],
  options: {
    branch: string
    jobTitles: string[]
    status: WorkRegistrationStatusFilter
    search: string
  }
) {
  const query = options.search.trim().toLowerCase()
  return summaries.filter(({ employee, status }) => {
    if (options.branch !== 'all' && employee.branch !== options.branch) return false
    if (options.jobTitles.length > 0 && !options.jobTitles.includes(employee.position)) return false
    if (options.status !== 'all' && status !== options.status) return false
    if (!query) return true
    return [employee.name, employee.email, employee.phone, employee.code, employee.position]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
}

export function buildBranchSummaries(
  employees: WorkRegistrationEmployee[],
  records: WorkRegistrationRecord[],
  weekStart: Date,
  branchFilter: string,
  priorityRules: WorkPrioritySlotRule[]
): BranchWeekSummary[] {
  const weekRecords = getRecordsForWeek(records, weekStart)
  const weekDays = getWorkWeekDays(weekStart)
  const branches = Array.from(new Set(employees.map((employee) => employee.branch))).sort()

  return branches
    .filter((branch) => branchFilter === 'all' || branch === branchFilter)
    .map((branch) => {
      const branchEmployees = employees.filter((employee) => employee.branch === branch)
      const branchRecords = weekRecords.filter((record) => record.branch === branch)
      const availableRecords = branchRecords.filter((record) => record.status !== 'draft')
      const registeredEmployeeCount = new Set(availableRecords.map((record) => record.employeeId)).size
      const daySummaries = buildBranchDaySummaries(availableRecords, weekDays, priorityRules)
      const coverageGapCount = daySummaries.reduce((total, day) => total + day.coverageGapCount, 0)
      const status = registeredEmployeeCount === 0
        ? 'not_registered'
        : coverageGapCount > 0
          ? 'needs_attention'
          : 'registered'

      return {
        branch,
        employeeCount: branchEmployees.length,
        registeredEmployeeCount,
        totalMinutes: sumRegistrationMinutes(availableRecords),
        coverageGapCount,
        daySummaries,
        status,
      }
    })
}

export function buildBranchDaySummaries(
  records: WorkRegistrationRecord[],
  weekDays: Date[],
  priorityRules: WorkPrioritySlotRule[]
) {
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  return weekDays.map((day) => {
    const dateKey = toWorkDateKey(day)
    const dayRecords = records.filter((record) => record.date === dateKey)
    const d = day.getDate().toString().padStart(2, '0')
    const wd = weekdays[day.getDay()]

    return {
      date: dateKey,
      label: `${wd} ${d}`,
      registeredEmployeeCount: new Set(dayRecords.map((record) => record.employeeId)).size,
      totalMinutes: sumRegistrationMinutes(dayRecords),
      coverageGapCount: countCoverageGaps(dayRecords, dateKey, priorityRules),
    }
  })
}

export function countCoverageGaps(
  dayRecords: WorkRegistrationRecord[],
  dateKey: string,
  priorityRules: WorkPrioritySlotRule[]
) {
  return WORK_TIME_SLOTS.reduce((total, slot) => {
    const required = getPriorityRequirement(dateKey, slot.id, priorityRules)
    if (required === 0) return total
    const coveredEmployees = new Set(
      dayRecords
        .filter((record) => record.slotId === slot.id && record.status !== 'draft')
        .map((record) => record.employeeId)
    )
    return coveredEmployees.size < required ? total + 1 : total
  }, 0)
}

export function getMonthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const firstMonday = new Date(first)
  const day = firstMonday.getDay()
  firstMonday.setDate(firstMonday.getDate() - (day === 0 ? 6 : day - 1))
  firstMonday.setHours(0, 0, 0, 0)

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date(firstMonday)
      date.setDate(date.getDate() + week * 7 + index)
      date.setHours(0, 0, 0, 0)
      return {
        date,
        dateKey: toWorkDateKey(date),
        inMonth: date.getMonth() === anchor.getMonth(),
      }
    })
  )
}

export const isReadonlyStatus = (status: WorkRegistrationStatus) =>
  status === 'locked'

export function resolveWeekActionState(
  records: WorkRegistrationRecord[],
  weekStart: Date,
  currentWeekStart: Date
): WorkRegistrationActionState {
  const weekStartKey = toWorkDateKey(weekStart)
  const currentWeekStartKey = toWorkDateKey(currentWeekStart)
  const isPastWeek = weekStartKey < currentWeekStartKey
  const hasRecords = records.length > 0
  const hasRegistered = records.some((record) => record.status === 'registered')
  const hasDraft = records.some((record) => record.status === 'draft')
  const allReadonly = hasRecords && records.every((record) => isReadonlyStatus(record.status))
  const readonlyWeek = isPastWeek || allReadonly

  if (isPastWeek) {
    return {
      readonlyWeek,
      canMutate: false,
      primaryActionLabel: 'Cập nhật đăng ký',
      actionHelperText: 'Tuần đã qua chỉ được xem',
    }
  }

  if (allReadonly) {
    return {
      readonlyWeek,
      canMutate: false,
      primaryActionLabel: 'Cập nhật đăng ký',
      actionHelperText: 'Tất cả khung giờ đã bị khóa bởi lịch lớp',
    }
  }

  if (hasRegistered) {
    return {
      readonlyWeek,
      canMutate: true,
      primaryActionLabel: 'Cập nhật đăng ký',
      actionHelperText: 'Tuần đã đăng ký; thay đổi sẽ cập nhật khả dụng',
    }
  }

  if (hasDraft) {
    return {
      readonlyWeek,
      canMutate: true,
      primaryActionLabel: 'Lưu đăng ký',
      actionHelperText: 'Bản nháp chưa đưa vào vận hành',
    }
  }

  return {
    readonlyWeek,
    canMutate: true,
    primaryActionLabel: 'Lưu đăng ký',
    actionHelperText: 'Tuần mới; lưu để tạo lịch khả dụng',
  }
}
