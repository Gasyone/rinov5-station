import {
  WORK_TIME_SLOTS,
  getPriorityRequirement,
  getWorkWeekDays,
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { ALL_DUTY_EMPLOYEES } from '@/mocks/shiftRoster'
import type {
  BranchWeekSummary,
  EmployeeWeekSummary,
  WorkRegistrationActionState,
  WorkRegistrationStatusFilter,
} from './workRegistrationTypes'

export function getEmployeeRoleLabel(employeeId: string, position?: string, department?: string): string {
  const dutyEmp = ALL_DUTY_EMPLOYEES.find((e) => e.id === employeeId)
  if (dutyEmp) {
    if (dutyEmp.role === 'Khác') {
      if (position?.toLowerCase().includes('manager') || department === 'Management') return 'Quản lý'
      if (position?.toLowerCase().includes('it') || department === 'IT') return 'IT Support'
      if (position?.toLowerCase().includes('accounting') || department === 'Finance') return 'Kế toán'
      if (position?.toLowerCase().includes('reception') || department === 'Admin') return 'Lễ tân'
      return 'Khác'
    }
    return dutyEmp.role
  }
  if (position?.toLowerCase().includes('manager') || department === 'Management') return 'Quản lý'
  if (position?.toLowerCase().includes('teacher')) return 'Giáo viên'
  if (position?.toLowerCase().includes('assistant')) return 'Trợ giảng'
  if (position?.toLowerCase().includes('csm') || position?.toLowerCase().includes('cs') || position?.toLowerCase().includes('sale')) return 'CS'
  return position || 'Nhân viên'
}

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
    }
  })
}

export function filterEmployeeSummaries(
  summaries: EmployeeWeekSummary[],
  options: {
    branch: string
    jobTitles: string[]
    subject: string
    status: WorkRegistrationStatusFilter
    search: string
  }
) {
  const query = options.search.trim().toLowerCase()
  return summaries.filter(({ employee, status }) => {
    if (options.branch !== 'all' && employee.branch !== options.branch) return false
    if (options.subject !== 'all' && (!employee.subjects || !employee.subjects.includes(options.subject))) return false
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
    const wd = weekdays[day.getDay()]

    return {
      date: dateKey,
      label: wd,
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

export function resolveWeekActionState(
  records: WorkRegistrationRecord[],
  weekStart: Date,
  currentWeekStart: Date
): WorkRegistrationActionState {
  const weekStartKey = toWorkDateKey(weekStart)
  const currentWeekStartKey = toWorkDateKey(currentWeekStart)
  const isPastWeek = weekStartKey < currentWeekStartKey
  const hasRegistered = records.some((record) => record.status === 'registered')
  const hasDraft = records.some((record) => record.status === 'draft')
  const readonlyWeek = isPastWeek

  if (isPastWeek) {
    return {
      readonlyWeek,
      canMutate: false,
      primaryActionLabel: 'Cập nhật đăng ký',
      actionHelperText: 'Tuần đã qua chỉ được xem',
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

export function resolveClassSessionHoverData(
  record: WorkRegistrationRecord,
  employeeName: string,
  slotLabel: string,
  branchName: string = 'RinoEdu Linh Đàm'
) {
  const className = record.assignedClass || 'Tiếng Anh Trial Level 2'
  const classCode = className.includes('SA1')
    ? 'SA1_TA_T03'
    : className.includes('IELTS')
    ? 'IELTS_INT_01'
    : 'SA1_TA_T03'

  return {
    id: `session-${record.id}`,
    title: className,
    className: className,
    classCode: classCode,
    subject: className.includes('Toán')
      ? 'Toán tư duy'
      : className.includes('STEM')
      ? 'STEM Robotics'
      : 'Tiếng Anh',
    level: className.includes('Level')
      ? className.split('Level')[1]?.trim() || 'Level 2'
      : 'Kindie 1',
    subtitle: 'Story time: My Family Adventure',
    lessonSubtitle: 'Story time: My Family Adventure',
    timeSlot: slotLabel || '15:30 - 17:30',
    timeLabel: slotLabel?.split('-')[0]?.trim() || '15:30',
    endTimeLabel: slotLabel?.split('-')[1]?.trim() || '17:30',
    schoolRoom: 'Phòng 1',
    roomName: 'Phòng 1',
    branch: branchName || record.branch || 'RinoEdu Linh Đàm',
    teacher: employeeName || 'Thu Hà',
    teacherName: employeeName || 'Thu Hà',
    assistantTeacher: 'Đức Anh',
    taName: 'Đức Anh',
    totalStudents: 16,
    officialStudents: 14,
    trialStudents: 2,
    studentCount: 16,
    capacity: 18,
    status: 'happening',
  }
}

export interface SlotInterval {
  start: string
  end: string
  slotIds: string[]
  isLocked: boolean
}

export function groupConsecutiveSlots(
  records: WorkRegistrationRecord[],
  employeeId: string,
  date: string,
  section: string
): SlotInterval[] {
  const sectionSlots = WORK_TIME_SLOTS.filter((s) => s.section === section)
  const employeeSlotIds = new Set(
    records
      .filter((r) => r.employeeId === employeeId && r.date === date && r.slotId.startsWith(section) && !r.assignedClass)
      .map((r) => r.slotId)
  )

  const intervals: SlotInterval[] = []
  let currentInterval: { start: string; end: string; slotIds: string[] } | null = null

  for (const slot of sectionSlots) {
    if (employeeSlotIds.has(slot.id)) {
      if (!currentInterval) {
        currentInterval = {
          start: slot.start,
          end: slot.end,
          slotIds: [slot.id],
        }
      } else {
        currentInterval.end = slot.end
        currentInterval.slotIds.push(slot.id)
      }
    } else {
      if (currentInterval) {
        intervals.push({ ...currentInterval, isLocked: false })
        currentInterval = null
      }
    }
  }

  if (currentInterval) {
    intervals.push({ ...currentInterval, isLocked: false })
  }

  return intervals
}
