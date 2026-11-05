import {
  WORK_TIME_SLOTS,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'

export function upsertWorkSlot(
  records: WorkRegistrationRecord[],
  employee: WorkRegistrationEmployee,
  weekStart: string,
  date: string,
  slotId: string,
  selected: boolean
) {
  const existing = records.find(
    (record) =>
      record.employeeId === employee.id &&
      record.date === date &&
      record.slotId === slotId
  )
  if (!selected) return records.filter((record) => record.id !== existing?.id)
  if (existing) return records

  return [
    ...records,
    {
      id: `wr-local-${employee.id}-${date}-${slotId}`,
      employeeId: employee.id,
      branch: employee.branch,
      date,
      weekStart,
      slotId,
      status: 'draft' as const,
      updatedAt: new Date().toISOString(),
    },
  ]
}

export function toggleWorkSection(
  records: WorkRegistrationRecord[],
  employee: WorkRegistrationEmployee,
  weekStart: string,
  date: string,
  section: ShiftSection
): WorkRegistrationRecord[] {
  const nonClassRecords = records.filter(
    (r) => r.employeeId === employee.id && r.date === date && r.slotId.startsWith(section) && !r.assignedClass
  )
  const isCurrentlySelected = nonClassRecords.length > 0

  if (isCurrentlySelected) {
    return records.filter(
      (r) => !(r.employeeId === employee.id && r.date === date && r.slotId.startsWith(section) && r.status !== 'locked' && !r.assignedClass)
    )
  } else {
    const sectionSlots = WORK_TIME_SLOTS.filter((s) => s.section === section)
    const newRecords: WorkRegistrationRecord[] = []
    for (const slot of sectionSlots) {
      const alreadyExists = records.some(
        (r) => r.employeeId === employee.id && r.date === date && r.slotId === slot.id
      )
      if (!alreadyExists) {
        newRecords.push({
          id: `wr-local-${employee.id}-${date}-${slot.id}`,
          employeeId: employee.id,
          branch: employee.branch,
          date,
          weekStart,
          slotId: slot.id,
          status: 'draft' as const,
          updatedAt: new Date().toISOString(),
        })
      }
    }
    return [...records, ...newRecords]
  }
}

export function submitWorkRegistration(
  records: WorkRegistrationRecord[],
  employeeId: string,
  weekStart: string
) {
  return records.map((record) =>
    record.employeeId === employeeId &&
    record.weekStart === weekStart &&
    record.status !== 'locked'
      ? { ...record, status: 'registered' as const, updatedAt: new Date().toISOString() }
      : record
  )
}

/**
 * Gom các slot hiện có thành các ca làm việc trọn vẹn (Continuous Shifts)
 */
function findExistingShifts(
  records: WorkRegistrationRecord[],
  employeeId: string,
  date: string
): Array<{ start: string; end: string; slotIds: string[] }> {
  const empSlots = records
    .filter(
      (r) =>
        r.employeeId === employeeId &&
        r.date === date &&
        !r.assignedClass &&
        r.status !== 'locked'
    )
    .map((r) => WORK_TIME_SLOTS.find((s) => s.id === r.slotId))
    .filter(Boolean) as typeof WORK_TIME_SLOTS

  if (empSlots.length === 0) return []

  const sorted = [...empSlots].sort((a, b) => a.start.localeCompare(b.start))
  const shifts: Array<{ start: string; end: string; slotIds: string[] }> = []

  let currentStart = sorted[0].start
  let currentEnd = sorted[0].end
  let currentSlotIds = [sorted[0].id]

  for (let i = 1; i < sorted.length; i++) {
    const s = sorted[i]
    if (s.start === currentEnd) {
      currentEnd = s.end
      currentSlotIds.push(s.id)
    } else {
      shifts.push({ start: currentStart, end: currentEnd, slotIds: currentSlotIds })
      currentStart = s.start
      currentEnd = s.end
      currentSlotIds = [s.id]
    }
  }
  shifts.push({ start: currentStart, end: currentEnd, slotIds: currentSlotIds })
  return shifts
}

export function addWorkTimeRange(
  records: WorkRegistrationRecord[],
  employee: WorkRegistrationEmployee,
  weekStart: string,
  dates: string[],
  startTime: string,
  endTime: string
): WorkRegistrationRecord[] {
  const targetSlots = WORK_TIME_SLOTS.filter(
    (slot) => slot.start >= startTime && slot.end <= endTime
  )

  if (targetSlots.length === 0) return records

  // Xác định các slotId cần loại bỏ:
  // NGUYÊN TẮC: Bỏ toàn bộ ca cũ nếu trùng. Nếu giờ thêm mới không trùng thì giữ nguyên giờ cũ.
  const discardedSlotIdsByDate = new Map<string, Set<string>>()

  for (const date of dates) {
    const existingShifts = findExistingShifts(records, employee.id, date)
    const discardedSlotIds = new Set<string>()

    for (const shift of existingShifts) {
      // Kiểm tra trùng lặp khoảng thời gian:
      // Hai khoảng thời gian giao nhau khi: shift.start < endTime && shift.end > startTime
      const isOverlapping = shift.start < endTime && shift.end > startTime
      if (isOverlapping) {
        // Bỏ toàn bộ ca cũ nếu có bất kỳ khoảng nào trùng với giờ nạp mới
        for (const sid of shift.slotIds) {
          discardedSlotIds.add(sid)
        }
      }
    }
    discardedSlotIdsByDate.set(date, discardedSlotIds)
  }

  // Lọc bỏ tất cả các bản ghi thuộc các ca cũ bị trùng (trừ ca dạy chính khóa và ca đã khóa sổ)
  const filtered = records.filter((r) => {
    if (r.employeeId !== employee.id || !dates.includes(r.date)) return true
    if (r.assignedClass || r.status === 'locked') return true
    const discarded = discardedSlotIdsByDate.get(r.date)
    return !discarded?.has(r.slotId)
  })

  const newRecords: WorkRegistrationRecord[] = []

  for (const date of dates) {
    for (const slot of targetSlots) {
      newRecords.push({
        id: `wr-local-${employee.id}-${date}-${slot.id}`,
        employeeId: employee.id,
        branch: employee.branch,
        date,
        weekStart,
        slotId: slot.id,
        status: 'draft' as const,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  return [...filtered, ...newRecords]
}

export function removeWorkSlots(
  records: WorkRegistrationRecord[],
  employeeId: string,
  date: string,
  slotIds: string[]
): WorkRegistrationRecord[] {
  const slotIdSet = new Set(slotIds)
  const hasDraft = records.some(
    (r) =>
      r.employeeId === employeeId &&
      r.date === date &&
      slotIdSet.has(r.slotId) &&
      r.status === 'draft'
  )

  // Nếu thao tác hủy trên ca nháp chờ lưu (draft):
  // Chỉ xóa các bản ghi nháp để hoàn tác khung giờ vừa thêm, giữ nguyên các bản ghi đã lưu trước đó!
  if (hasDraft) {
    return records.filter(
      (r) =>
        !(
          r.employeeId === employeeId &&
          r.date === date &&
          slotIdSet.has(r.slotId) &&
          r.status === 'draft'
        )
    )
  }

  return records.filter(
    (r) =>
      !(
        r.employeeId === employeeId &&
        r.date === date &&
        slotIdSet.has(r.slotId) &&
        !r.assignedClass && // Giữ nguyên ca dạy (lớp dạy), không được xóa ca dạy
        r.status !== 'locked'
      )
  )
}

export function clearWorkRegistrationWeek(
  records: WorkRegistrationRecord[],
  employeeId: string,
  weekStart: string
) {
  return records.filter((record) => {
    if (record.employeeId !== employeeId || record.weekStart !== weekStart) return true
    // Giữ nguyên ca dạy và ca đăng ký trực, chỉ xóa các slot nháp chờ lưu
    return record.status === 'locked' || record.status === 'registered' || Boolean(record.assignedClass)
  })
}
