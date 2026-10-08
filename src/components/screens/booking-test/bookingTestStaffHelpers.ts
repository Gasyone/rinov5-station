import { mockEmployees, type Employee } from '@/mocks/employees'
import type { BookingTest } from '@/mocks/bookingTests'
import {
  DUTY_SECTIONS,
  WEEKDAYS,
  findDutyEmployeeById,
  getMasterShiftRoster,
  getDayIndexFromDateStr,
  getSectionFromTime,
  checkStaffConflict,
} from '@/mocks/shiftRoster'

export function resolveBookingBranch(school: string) {
  if (school === 'Rino Online') return 'Toàn hệ thống'
  return school
}

/**
 * Phân tích chuỗi ngày giờ booking để lấy ngày và giờ
 */
export function parseBookingDateTime(bookingTime?: string): { dateStr: string; timeStr: string } | null {
  if (!bookingTime) return null
  const cleaned = bookingTime.trim().replace('T', ' ')
  const [dateStr, timeStr] = cleaned.split(' ')
  if (!dateStr || !timeStr) return null
  return { dateStr, timeStr }
}

/**
 * Lấy tất cả nhân sự được phân bổ trên Lịch trực test (/app/work_registration) của chi nhánh
 */
export function getDutyRosterEmployees(school: string): Employee[] {
  const branch = resolveBookingBranch(school)
  const effectiveBranch = branch === 'Toàn hệ thống' ? undefined : branch
  const roster = getMasterShiftRoster(effectiveBranch)
  const allocatedIds = new Set<string>()

  roster.forEach((item) => {
    item.assignedEmployeeIds.forEach((id) => allocatedIds.add(id))
  })

  return Array.from(allocatedIds)
    .map((id) => mockEmployees.find((emp) => emp.id === id))
    .filter((emp): emp is Employee => Boolean(emp && emp.status === 'active'))
}

/**
 * Lấy thông tin ca trực và danh sách nhân sự được phân bổ cho ca trực cụ thể (dựa vào bookingTime)
 */
export function getBookingShiftInfo(school: string, bookingTime?: string) {
  const branch = resolveBookingBranch(school)
  const parsed = parseBookingDateTime(bookingTime)
  if (!parsed) {
    return { shiftLabel: '', sectionLabel: '', dayLabel: '', slotEmployees: [] }
  }

  const dayIndex = getDayIndexFromDateStr(parsed.dateStr)
  const section = getSectionFromTime(parsed.timeStr)
  const dayObj = WEEKDAYS.find((d) => d.index === dayIndex)
  const secObj = DUTY_SECTIONS.find((s) => s.id === section)

  const dayLabel = dayObj?.label || ''
  const sectionLabel = secObj?.label || ''
  const shiftLabel = [dayObj?.short || dayLabel, sectionLabel].filter(Boolean).join(' · ')

  const effectiveBranch = branch === 'Toàn hệ thống' ? 'RinoEdu Nguyễn Tuân' : branch
  const roster = getMasterShiftRoster(effectiveBranch)
  const slotAssignment = roster.find(
    (item) => item.branch === effectiveBranch && item.dayIndex === dayIndex && item.section === section
  )

  const slotEmployees = (slotAssignment?.assignedEmployeeIds || [])
    .map((id) => mockEmployees.find((emp) => emp.id === id))
    .filter((emp): emp is Employee => Boolean(emp && emp.status === 'active'))

  return {
    shiftLabel,
    sectionLabel,
    dayLabel,
    slotEmployees,
  }
}

/**
 * Lấy danh sách nhân sự trực cho chi nhánh và ca test:
 * - Chỉ lấy nhân sự được phân bổ trên Lịch trực test (/app/work_registration - tab Lịch trực test)
 * - Nếu có bookingTime và ca đó có nhân sự phân bổ, ưu tiên trả về danh sách ca đó
 * - Nếu không có bookingTime, trả về toàn bộ nhân sự được phân bổ trên Lịch trực test của cơ sở
 */
export function getActiveEmployeesBySchool(school: string, bookingTime?: string): Employee[] {
  const branch = resolveBookingBranch(school)
  const allRosterEmployees = getDutyRosterEmployees(branch)

  if (bookingTime) {
    const { slotEmployees } = getBookingShiftInfo(branch, bookingTime)
    if (slotEmployees.length > 0) {
      return slotEmployees
    }
  }

  return allRosterEmployees
}

export function findEmployeeByName(name?: string) {
  if (!name) return null
  const normalizedName = name.trim().toLowerCase()
  return mockEmployees.find((employee) => employee.name.toLowerCase() === normalizedName) ?? null
}

export function getPersonTitle(employee: Employee | null) {
  if (!employee) return ''
  return [employee.position, employee.department].filter(Boolean).join(' · ')
}

export function isTeacherLikeEmployee(employee: Employee): boolean {
  const duty = findDutyEmployeeById(employee.id)
  if (duty) {
    return duty.role === 'Giáo viên'
  }
  const haystack = `${employee.position} ${employee.department}`.toLowerCase()
  if (haystack.includes('teaching assistant') || haystack.includes('trợ giảng')) {
    return false
  }
  return ['teacher', 'giáo viên', 'tutor', 'academic', 'ielts'].some((token) =>
    haystack.includes(token)
  )
}

export interface StaffAvailabilityInfo {
  isBusy: boolean
  statusLabel: 'Rảnh' | 'Bận'
  statusSemantic: 'success' | 'error'
  conflictDetail?: string
}

export function getEmployeeAvailability(
  employeeName: string,
  bookingTime?: string,
  currentBookingId?: string,
  bookings?: BookingTest[]
): StaffAvailabilityInfo {
  if (!bookingTime) {
    return {
      isBusy: false,
      statusLabel: 'Rảnh',
      statusSemantic: 'success',
    }
  }

  const parsed = parseBookingDateTime(bookingTime)
  if (!parsed) {
    return {
      isBusy: false,
      statusLabel: 'Rảnh',
      statusSemantic: 'success',
    }
  }

  const conflict = checkStaffConflict(
    employeeName,
    parsed.dateStr,
    parsed.timeStr,
    currentBookingId,
    bookings
  )

  if (conflict.isConflicted) {
    return {
      isBusy: true,
      statusLabel: 'Bận',
      statusSemantic: 'error',
      conflictDetail: conflict.conflictDetail || 'Đang bận lịch khác',
    }
  }

  return {
    isBusy: false,
    statusLabel: 'Rảnh',
    statusSemantic: 'success',
  }
}
