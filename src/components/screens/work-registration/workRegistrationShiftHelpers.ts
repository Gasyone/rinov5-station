import {
  WORK_REGISTRATION_MATH_TEACHER_IDS,
  WORK_TIME_SLOTS,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
  type WorkTimeSlot,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'
import type { EmployeeDayShiftSummary } from './workRegistrationTypes'
import {
  formatCompactTimeLabel,
  formatDurationShort,
} from './workRegistrationHelpers'

/**
 * Lấy nhãn môn học cho nhân sự ở màn hình Lịch làm việc:
 * "Lịch này 100% của giáo viên, nên không cần, chỉ hiển thị môn ra thôi, thay giáo viên bằng môn"
 * "tab lịch làm việc, làm gì có CS, chỉ có giáo viên thôi, đổi hết CS sang môn đi, bố trí môn cho phù hợp"
 */
export function getEmployeeSubjectOrRoleLabel(employee: WorkRegistrationEmployee): string {
  if (employee.subjects && employee.subjects.length > 0) {
    return employee.subjects.join(', ')
  }
  // Màn hình Lịch làm việc 100% hiển thị môn học (Toán hoặc Tiếng Anh)
  return WORK_REGISTRATION_MATH_TEACHER_IDS.has(employee.id) ? 'Toán' : 'Tiếng Anh'
}

/**
 * Gộp các slots liên tục thành các dải giờ (ví dụ: 08:00 - 10:00)
 */
export function groupContinuousSlots(slots: WorkTimeSlot[]): Array<{ start: string; end: string }> {
  if (slots.length === 0) return []
  const sorted = [...slots].sort((a, b) => a.start.localeCompare(b.start))
  const ranges: Array<{ start: string; end: string }> = []
  let currentStart = sorted[0].start
  let currentEnd = sorted[0].end

  for (let i = 1; i < sorted.length; i++) {
    const slot = sorted[i]
    if (slot.start === currentEnd) {
      currentEnd = slot.end
    } else {
      ranges.push({ start: currentStart, end: currentEnd })
      currentStart = slot.start
      currentEnd = slot.end
    }
  }
  ranges.push({ start: currentStart, end: currentEnd })
  return ranges
}

/**
 * Định dạng các khung giờ làm việc trong ngày để đưa xuống dòng 2 (kể cả 1 hay nhiều khung lẻ)
 */
export function formatDayTimeIntervals(slots: WorkTimeSlot[]): string {
  const ranges = groupContinuousSlots(slots)
  if (ranges.length === 0) return '—'
  const formattedRanges = ranges.map((r) => formatCompactTimeLabel(`${r.start} - ${r.end}`))
  return formattedRanges.join(', ')
}

/**
 * Phân tích và gán nhãn chuyển đổi chuẩn cho nhân sự trong 1 ngày (Zero Duplication)
 * - Dòng 1: Luôn là Nhãn ca bao quát (All day, Sáng/Chiều, Ca sáng, Ca tối...) không viền/nền
 * - Dòng 2: Hiển thị trực tiếp các khung giờ thực tế (hỗ trợ nhiều khung giờ lẻ)
 */
export function resolveEmployeeDayShift(
  records: WorkRegistrationRecord[],
  employee: WorkRegistrationEmployee,
  dateKey: string
): EmployeeDayShiftSummary | null {
  const empDayRecords = records.filter(
    (r) => r.employeeId === employee.id && r.date === dateKey
  )
  if (empDayRecords.length === 0) return null

  const slotIds = new Set(empDayRecords.map((r) => r.slotId))
  const daySlots = WORK_TIME_SLOTS.filter((s) => slotIds.has(s.id))
  if (daySlots.length === 0) return null

  const morningSlots = daySlots.filter((s) => s.section === 'morning')
  const afternoonSlots = daySlots.filter((s) => s.section === 'afternoon')
  const eveningSlots = daySlots.filter((s) => s.section === 'evening')

  const totalMinutes = daySlots.reduce((sum, s) => sum + s.minutes, 0)

  const hasMorning = morningSlots.length > 0
  const hasAfternoon = afternoonSlots.length > 0
  const hasEvening = eveningSlots.length > 0

  const shifts: ShiftSection[] = []
  if (hasMorning) shifts.push('morning')
  if (hasAfternoon) shifts.push('afternoon')
  if (hasEvening) shifts.push('evening')

  const assignedClasses = Array.from(
    new Set(
      empDayRecords
        .map((r) => r.assignedClassCode || r.assignedClass)
        .filter(Boolean) as string[]
    )
  )

  let badgeLabel = ''
  let badgeVariant: EmployeeDayShiftSummary['badgeVariant'] = 'custom'
  let badgeClass = ''

  // 1. All day (Cả ngày): Có mặt cả 3 ca hoặc tổng thời lượng >= 11 tiếng
  if ((hasMorning && hasAfternoon && hasEvening) || totalMinutes >= 11 * 60) {
    badgeLabel = 'All day'
    badgeVariant = 'all_day'
    badgeClass = 'text-emerald-700 dark:text-emerald-400 font-semibold'
  }
  // 2. Ghép 2 ca (Double shift): Luôn là nhãn ca thanh thoát
  else if (hasMorning && hasAfternoon && !hasEvening) {
    badgeLabel = 'Sáng, Chiều'
    badgeVariant = 'double_shift'
    badgeClass = 'text-teal-700 dark:text-teal-400 font-semibold'
  } else if (!hasMorning && hasAfternoon && hasEvening) {
    badgeLabel = 'Chiều, Tối'
    badgeVariant = 'double_shift'
    badgeClass = 'text-indigo-700 dark:text-indigo-400 font-semibold'
  } else if (hasMorning && !hasAfternoon && hasEvening) {
    badgeLabel = 'Sáng, Tối'
    badgeVariant = 'double_shift'
    badgeClass = 'text-purple-700 dark:text-purple-400 font-semibold'
  }
  // 3. Đơn ca (kể cả full hay lẻ trong ca): Luôn giữ nhãn ca sạch ở dòng 1
  else if (hasMorning && !hasAfternoon && !hasEvening) {
    badgeLabel = 'Ca sáng'
    badgeVariant = 'morning'
    badgeClass = 'text-amber-700 dark:text-amber-400 font-semibold'
  } else if (!hasMorning && hasAfternoon && !hasEvening) {
    badgeLabel = 'Ca chiều'
    badgeVariant = 'afternoon'
    badgeClass = 'text-sky-700 dark:text-sky-400 font-semibold'
  } else if (!hasMorning && !hasAfternoon && hasEvening) {
    badgeLabel = 'Ca tối'
    badgeVariant = 'evening'
    badgeClass = 'text-purple-700 dark:text-purple-400 font-semibold'
  } else {
    badgeLabel = 'Linh hoạt'
    badgeVariant = 'custom'
    badgeClass = 'text-muted-foreground font-medium'
  }

  // Khung giờ chi tiết đưa xuống dòng 2 (hỗ trợ nhiều khung giờ lẻ như 8-10h, 18:30-20:30)
  const timeRangeLabel = formatDayTimeIntervals(daySlots)

  // Chuỗi chi tiết giờ cho Tooltip
  const continuousRanges = groupContinuousSlots(daySlots)
  const rangeStrings = continuousRanges.map((r) => `${r.start} - ${r.end}`).join(', ')
  const timeDetail = `${rangeStrings} (${formatDurationShort(totalMinutes)})`

  return {
    employee,
    records: empDayRecords,
    totalMinutes,
    badgeLabel,
    badgeVariant,
    badgeClass,
    timeDetail,
    timeRangeLabel,
    shifts,
    assignedClasses,
  }
}

/**
 * Lấy thông tin các khoảng thời gian đăng ký của nhân sự trong 1 buổi (hỗ trợ nhiều khoảng rời nhau VD: 8-9h, 10-11h)
 */
export function getEmployeeSectionShiftInfo(
  records: WorkRegistrationRecord[],
  employeeId: string,
  dateKey: string,
  section: ShiftSection
): {
  isFull: boolean
  isPartial: boolean
  notRegistered: boolean
  intervals: string[]
  compactLabel: string
  fullTooltipLabel: string
} {
  const sectionAllSlots = WORK_TIME_SLOTS.filter((s) => s.section === section)
  if (!dateKey || sectionAllSlots.length === 0 || !records || records.length === 0) {
    return {
      isFull: false,
      isPartial: false,
      notRegistered: true,
      intervals: [],
      compactLabel: '',
      fullTooltipLabel: 'Chưa đăng ký',
    }
  }

  const matchedSlotIds = new Set(
    records
      .filter((r) => r.employeeId === employeeId && r.date === dateKey && r.slotId.startsWith(section))
      .map((r) => r.slotId)
  )

  const empSlots = sectionAllSlots.filter((s) => matchedSlotIds.has(s.id))
  if (empSlots.length === 0) {
    return {
      isFull: false,
      isPartial: false,
      notRegistered: true,
      intervals: [],
      compactLabel: '',
      fullTooltipLabel: 'Chưa đăng ký',
    }
  }

  const isFull = empSlots.length >= sectionAllSlots.length
  if (isFull) {
    return {
      isFull: true,
      isPartial: false,
      notRegistered: false,
      intervals: [`${sectionAllSlots[0].start} - ${sectionAllSlots[sectionAllSlots.length - 1].end}`],
      compactLabel: 'Full',
      fullTooltipLabel: 'Full ca',
    }
  }

  const ranges = groupContinuousSlots(empSlots)
  const intervals = ranges.map((r) => `${r.start} - ${r.end}`)
  const compactLabel = ranges
    .map((r) => formatCompactTimeLabel(`${r.start} - ${r.end}`))
    .filter(Boolean)
    .join(', ')
  const fullTooltipLabel = intervals.join(', ')

  return {
    isFull: false,
    isPartial: true,
    notRegistered: false,
    intervals,
    compactLabel,
    fullTooltipLabel,
  }
}
