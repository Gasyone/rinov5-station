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
  assignedClass?: string
}

export interface WorkRegistrationEmployee extends Employee {
  code: string
  subjects: string[]
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
  const subjectsPool = ['IELTS', 'Giao tiếp', 'TOEIC', 'Kids', 'Ngữ pháp']
  return mockEmployees
    .filter((employee) => employee.status !== 'resigned')
    .map((employee, index) => ({
      ...employee,
      code: `EMP-${String(index + 1).padStart(3, '0')}`,
      subjects: index % 2 === 0 ? ['IELTS', 'TOEIC'] : ['Giao tiếp', 'Kids'],
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
  assignedClass?: string
}> = [
  // Smart City & Nguyễn Tuân & Linh Đàm records
  // Thứ 2 (dayOffset: 0)
  { employeeId: 'e4', dayOffset: 0, slotIds: slotRange('morning-0800', 8), status: 'registered' }, // Cả ca sáng
  { employeeId: 'e5', dayOffset: 0, slotIds: slotRange('morning-0800', 8), status: 'registered' }, // Cả ca sáng
  { employeeId: 't6', dayOffset: 0, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e5', dayOffset: 0, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 'e4', dayOffset: 0, slotIds: slotRange('evening-1800', 8), status: 'registered' }, // Cả ca tối
  { employeeId: 't6', dayOffset: 0, slotIds: slotRange('evening-1800', 8), status: 'registered' }, // Cả ca tối
  { employeeId: 'tg_sc1', dayOffset: 0, slotIds: slotRange('evening-1800', 7), status: 'registered' }, // Cả ca Digi
  { employeeId: 'e1', dayOffset: 0, slotIds: slotRange('morning-0800', 8), status: 'registered', assignedClass: 'IELTS Intensive' },
  { employeeId: 'e2', dayOffset: 0, slotIds: slotRange('morning-0800', 3), status: 'registered' }, // Giờ lẻ
  { employeeId: 'e3', dayOffset: 0, slotIds: slotRange('morning-0800', 2), status: 'registered', assignedClass: 'TOEIC 500+' }, // Giờ lẻ
  { employeeId: 'e6', dayOffset: 0, slotIds: ['morning-0830', 'morning-0900'], status: 'registered', assignedClass: 'Giao tiếp nâng cao' }, // Giờ lẻ
  { employeeId: 'e7', dayOffset: 0, slotIds: slotRange('morning-0800', 1), status: 'registered' },
  { employeeId: 't1', dayOffset: 0, slotIds: slotRange('morning-0800', 8), status: 'registered' }, // Cả ca sáng
  { employeeId: 't3', dayOffset: 0, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't2', dayOffset: 0, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 'tg_nt1', dayOffset: 0, slotIds: slotRange('evening-1800', 8), status: 'registered' }, // Cả ca tối
  { employeeId: 'tg_nt2', dayOffset: 0, slotIds: slotRange('evening-1800', 7), status: 'registered' }, // Cả ca Digi
  { employeeId: 't4', dayOffset: 0, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't5', dayOffset: 0, slotIds: slotRange('afternoon-1330', 9), status: 'registered' },
  { employeeId: 'tg_ld1', dayOffset: 0, slotIds: slotRange('evening-1800', 7), status: 'registered' },

  // Thứ 3 (dayOffset: 1)
  { employeeId: 't6', dayOffset: 1, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 1, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e4', dayOffset: 1, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e5', dayOffset: 1, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 'e4', dayOffset: 1, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 1, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'tg_sc2', dayOffset: 1, slotIds: slotRange('evening-1800', 7), status: 'registered' },
  { employeeId: 'e2', dayOffset: 1, slotIds: slotRange('afternoon-1500', 3), status: 'registered', assignedClass: 'TOEIC 600+' },
  { employeeId: 'e8', dayOffset: 1, slotIds: slotRange('morning-0930', 3), status: 'registered', assignedClass: 'IELTS Advanced' },
  { employeeId: 't2', dayOffset: 1, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't3', dayOffset: 1, slotIds: slotRange('afternoon-1330', 9), status: 'registered' },

  // Thứ 4 (dayOffset: 2)
  { employeeId: 'e4', dayOffset: 2, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 2, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 2, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 't6', dayOffset: 2, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e4', dayOffset: 2, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 2, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'tg_sc1', dayOffset: 2, slotIds: slotRange('evening-1800', 7), status: 'registered' },
  { employeeId: 'e1', dayOffset: 2, slotIds: slotRange('afternoon-1330', 3), status: 'registered', assignedClass: 'Kids Level 1' },
  { employeeId: 'e8', dayOffset: 2, slotIds: slotRange('afternoon-1330', 3), status: 'registered' },
  { employeeId: 'e9', dayOffset: 2, slotIds: slotRange('afternoon-1330', 3), status: 'registered', assignedClass: 'IELTS Basic' },
  { employeeId: 'e3', dayOffset: 2, slotIds: slotRange('evening-1930', 3), status: 'registered', assignedClass: 'IELTS 02' },
  { employeeId: 'e6', dayOffset: 2, slotIds: slotRange('morning-0800', 3), status: 'registered', assignedClass: 'Ngữ pháp cơ bản' },
  { employeeId: 't1', dayOffset: 2, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'tg_nt1', dayOffset: 2, slotIds: slotRange('evening-1800', 8), status: 'registered' },

  // Thứ 5 (dayOffset: 3)
  { employeeId: 'e4', dayOffset: 3, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 3, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 3, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e4', dayOffset: 3, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 'e4', dayOffset: 3, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 3, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'tg_sc2', dayOffset: 3, slotIds: slotRange('evening-1800', 7), status: 'registered' },
  { employeeId: 'e2', dayOffset: 3, slotIds: slotRange('evening-1800', 3), status: 'registered' },

  // Thứ 6 (dayOffset: 4)
  { employeeId: 't6', dayOffset: 4, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 4, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e4', dayOffset: 4, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e5', dayOffset: 4, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 'e5', dayOffset: 4, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 4, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'tg_sc1', dayOffset: 4, slotIds: slotRange('evening-1800', 7), status: 'registered' },
  { employeeId: 'e3', dayOffset: 4, slotIds: slotRange('morning-0930', 3), status: 'registered' },

  // Thứ 7 & CN (dayOffset: 5 & 6)
  { employeeId: 'e4', dayOffset: 5, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 5, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 5, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 5, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e5', dayOffset: 5, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 'e4', dayOffset: 5, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 5, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'tg_sc1', dayOffset: 5, slotIds: slotRange('evening-1800', 7), status: 'registered' },
  { employeeId: 'tg_sc2', dayOffset: 5, slotIds: slotRange('evening-1800', 7), status: 'registered' },
  { employeeId: 'e7', dayOffset: 5, slotIds: slotRange('morning-0930', 3), status: 'registered' },
  { employeeId: 'e10', dayOffset: 5, slotIds: slotRange('evening-1800', 3), status: 'registered' },

  { employeeId: 'e4', dayOffset: 6, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e5', dayOffset: 6, slotIds: slotRange('morning-0800', 8), status: 'registered' },
  { employeeId: 'e4', dayOffset: 6, slotIds: slotRange('afternoon-1330', 8), status: 'registered' }, // 13:30 - 17:00
  { employeeId: 'e5', dayOffset: 6, slotIds: slotRange('afternoon-1330', 9), status: 'registered' }, // Cả ca chiều
  { employeeId: 't6', dayOffset: 6, slotIds: slotRange('afternoon-1330', 8), status: 'registered' },
  { employeeId: 'e4', dayOffset: 6, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 't6', dayOffset: 6, slotIds: slotRange('evening-1800', 8), status: 'registered' },
  { employeeId: 'tg_sc2', dayOffset: 6, slotIds: slotRange('evening-1800', 7), status: 'registered' },
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
        assignedClass: template.assignedClass,
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
