import { mockEmployees, type Employee } from './employees'

export type WorkRegistrationStatus =
  | 'draft'
  | 'registered'
  | 'locked'

export type WorkRegistrationSection = 'morning' | 'afternoon' | 'evening'

export interface WorkTimeSlot {
  id: string
  section: WorkRegistrationSection
  label: string
  start: string
  end: string
  minutes: number
}

export interface WorkPrioritySlotRule {
  id: string
  label: string
  enabled: boolean
  startDate?: string
  dayIndexes: number[]
  slotIds: string[]
  minEmployees: number
}

export interface WorkRegistrationRecord {
  id: string
  employeeId: string
  branch: string
  date: string
  weekStart: string
  slotId: string
  status: WorkRegistrationStatus
  updatedAt: string
  note?: string
  lockedReason?: string
}

export interface WorkRegistrationEmployee extends Employee {
  code: string
}

const pad = (value: number) => String(value).padStart(2, '0')

export const WORK_WEEKDAYS = [
  { index: 0, label: 'T2' },
  { index: 1, label: 'T3' },
  { index: 2, label: 'T4' },
  { index: 3, label: 'T5' },
  { index: 4, label: 'T6' },
  { index: 5, label: 'T7' },
  { index: 6, label: 'CN' },
]

const minutesToTime = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

const resolveWorkSection = (minutes: number): WorkRegistrationSection => {
  const hour = Math.floor(minutes / 60)
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

const buildWorkTimeSlots = (): WorkTimeSlot[] => {
  const startMinutes = 7 * 60
  const endMinutes = 23 * 60
  return Array.from({ length: (endMinutes - startMinutes) / 30 }, (_, index) => {
    const start = startMinutes + index * 30
    const end = start + 30
    const section = resolveWorkSection(start)
    const startLabel = minutesToTime(start)
    const endLabel = minutesToTime(end)
    return {
      id: `${section}-${startLabel.replace(':', '')}`,
      section,
      label: `${startLabel} - ${endLabel}`,
      start: startLabel,
      end: endLabel,
      minutes: 30,
    }
  })
}

export const WORK_TIME_SLOTS: WorkTimeSlot[] = buildWorkTimeSlots()

export const DEFAULT_WORK_PRIORITY_RULES: WorkPrioritySlotRule[] = [
  {
    id: 'weekday-morning',
    label: 'Giờ vàng sáng Thứ 2/Thứ 4',
    enabled: true,
    startDate: '2026-05-14',
    dayIndexes: [1, 3],
    slotIds: ['morning-0800'],
    minEmployees: 2,
  },
  {
    id: 'evening-peak',
    label: 'Giờ vàng tối Thứ 3/Thứ 5/Thứ 7',
    enabled: true,
    startDate: '2026-05-14',
    dayIndexes: [2, 4, 6],
    slotIds: ['evening-1800', 'evening-1930'],
    minEmployees: 2,
  },
]

export const WORK_SECTIONS: Array<{
  id: WorkRegistrationSection
  label: string
  slots: WorkTimeSlot[]
}> = [
  {
    id: 'morning',
    label: 'Ca sáng',
    slots: WORK_TIME_SLOTS.filter((slot) => slot.section === 'morning'),
  },
  {
    id: 'afternoon',
    label: 'Ca chiều',
    slots: WORK_TIME_SLOTS.filter((slot) => slot.section === 'afternoon'),
  },
  {
    id: 'evening',
    label: 'Ca tối',
    slots: WORK_TIME_SLOTS.filter((slot) => slot.section === 'evening'),
  },
]

export function toWorkDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function getWorkWeekStart(input: Date): Date {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

export function addWorkDays(input: Date, days: number): Date {
  const date = new Date(input)
  date.setDate(date.getDate() + days)
  date.setHours(0, 0, 0, 0)
  return date
}

export function getWorkWeekDays(weekStart: Date): Date[] {
  return WORK_WEEKDAYS.map((day) => addWorkDays(weekStart, day.index))
}

export function getWorkRegistrationEmployees(): WorkRegistrationEmployee[] {
  return mockEmployees
    .filter((employee) => employee.status !== 'resigned')
    .map((employee, index) => ({
      ...employee,
      code: `EMP-${String(index + 1).padStart(3, '0')}`,
    }))
}

const employeeBranch = (employeeId: string) =>
  mockEmployees.find((employee) => employee.id === employeeId)?.branch ?? 'Chưa phân bổ'

const recordTemplates: Array<{
  employeeId: string
  dayOffset: number
  slotIds: string[]
  status: WorkRegistrationStatus
  note?: string
  lockedReason?: string
}> = [
  // Nhiều nhân viên đăng ký trùng khung giờ sáng Thứ 2 (dayOffset: 0)
  { employeeId: 'e1', dayOffset: 0, slotIds: slotRange('morning-0800', 3), status: 'registered' },
  { employeeId: 'e2', dayOffset: 0, slotIds: slotRange('morning-0800', 3), status: 'registered' },
  { employeeId: 'e3', dayOffset: 0, slotIds: slotRange('morning-0800', 2), status: 'registered' },
  { employeeId: 'e4', dayOffset: 0, slotIds: slotRange('morning-0800', 4), status: 'registered' },
  { employeeId: 'e5', dayOffset: 0, slotIds: ['morning-0800', 'morning-0830'], status: 'registered' },
  { employeeId: 'e6', dayOffset: 0, slotIds: ['morning-0830', 'morning-0900'], status: 'registered' },
  { employeeId: 'e7', dayOffset: 0, slotIds: slotRange('morning-0800', 1), status: 'registered' },
  
  // Nhiều nhân viên đăng ký trùng khung giờ chiều Thứ 4 (dayOffset: 2)
  { employeeId: 'e1', dayOffset: 2, slotIds: slotRange('afternoon-1330', 3), status: 'registered' },
  { employeeId: 'e8', dayOffset: 2, slotIds: slotRange('afternoon-1330', 3), status: 'registered' },
  { employeeId: 'e9', dayOffset: 2, slotIds: slotRange('afternoon-1330', 3), status: 'registered' },

  { employeeId: 'e2', dayOffset: 1, slotIds: slotRange('afternoon-1500', 3), status: 'registered' },
  { employeeId: 'e2', dayOffset: 3, slotIds: slotRange('evening-1800', 3), status: 'registered' },
  { employeeId: 'e3', dayOffset: 0, slotIds: slotRange('evening-1800', 3), status: 'locked', lockedReason: 'Đã xếp lớp IELTS 01' },
  { employeeId: 'e3', dayOffset: 2, slotIds: slotRange('evening-1930', 3), status: 'registered' },
  { employeeId: 'e3', dayOffset: 4, slotIds: slotRange('morning-0930', 3), status: 'registered' },
  { employeeId: 'e4', dayOffset: 1, slotIds: slotRange('morning-0800', 3), status: 'registered' },
  { employeeId: 'e4', dayOffset: 3, slotIds: slotRange('afternoon-1500', 3), status: 'locked', lockedReason: 'Đã sinh lịch lớp' },
  { employeeId: 'e5', dayOffset: 0, slotIds: slotRange('afternoon-1330', 3), status: 'registered' },
  { employeeId: 'e5', dayOffset: 4, slotIds: slotRange('afternoon-1500', 3), status: 'registered' },
  { employeeId: 'e6', dayOffset: 2, slotIds: slotRange('morning-0800', 3), status: 'registered' },
  { employeeId: 'e7', dayOffset: 5, slotIds: slotRange('morning-0930', 3), status: 'registered' },
  { employeeId: 'e8', dayOffset: 1, slotIds: slotRange('morning-0930', 3), status: 'registered' },
  { employeeId: 'e9', dayOffset: 2, slotIds: slotRange('evening-1800', 3), status: 'registered' },
  { employeeId: 'e10', dayOffset: 0, slotIds: slotRange('evening-1930', 3), status: 'registered' },
  { employeeId: 'e10', dayOffset: 5, slotIds: slotRange('evening-1800', 3), status: 'registered' },
]

function slotRange(startSlotId: string, count: number): string[] {
  const startIndex = WORK_TIME_SLOTS.findIndex((slot) => slot.id === startSlotId)
  if (startIndex < 0) return [startSlotId]
  return WORK_TIME_SLOTS.slice(startIndex, startIndex + count).map((slot) => slot.id)
}

export function getMockWorkRegistrations(anchor = new Date()): WorkRegistrationRecord[] {
  const baseWeek = getWorkWeekStart(anchor)
  const weekOffsets = [-7, 0, 7]

  return weekOffsets.flatMap((weekOffset) => {
    const weekStart = addWorkDays(baseWeek, weekOffset)
    const weekStartKey = toWorkDateKey(weekStart)

    return recordTemplates.flatMap((template, templateIndex) => {
      const date = addWorkDays(weekStart, template.dayOffset)
      const dateKey = toWorkDateKey(date)
      const branch = employeeBranch(template.employeeId)

      return template.slotIds.map((slotId, slotIndex) => ({
        id: `wr-${weekStartKey}-${templateIndex + 1}-${slotIndex + 1}`,
        employeeId: template.employeeId,
        branch,
        date: dateKey,
        weekStart: weekStartKey,
        slotId,
        status: template.status,
        note: template.note,
        lockedReason: template.lockedReason,
        updatedAt: `${dateKey}T09:00:00`,
      }))
    })
  })
}

export function getPriorityRequirement(
  dateKey: string,
  slotId: string,
  rules: WorkPrioritySlotRule[] = DEFAULT_WORK_PRIORITY_RULES
): number {
  const targetDate = new Date(`${dateKey}T00:00:00`)
  const day = targetDate.getDay()
  const dayOffset = day === 0 ? 6 : day - 1
  return rules.reduce((requirement, rule) => {
    if (!rule.enabled) return requirement
    if (rule.startDate) {
      const ruleStartDate = new Date(`${rule.startDate}T00:00:00`)
      if (targetDate < ruleStartDate) return requirement
    }
    if (!rule.dayIndexes.includes(dayOffset)) return requirement
    if (!rule.slotIds.includes(slotId)) return requirement
    return Math.max(requirement, rule.minEmployees)
  }, 0)
}

export function isPriorityWorkSlot(
  dateKey: string,
  slotId: string,
  rules: WorkPrioritySlotRule[] = DEFAULT_WORK_PRIORITY_RULES
): boolean {
  return getPriorityRequirement(dateKey, slotId, rules) > 0
}
