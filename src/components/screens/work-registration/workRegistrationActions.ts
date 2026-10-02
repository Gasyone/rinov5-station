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

  const targetSections = new Set(targetSlots.map((s) => s.section))

  // Khi thêm/sửa khoảng giờ mới trong ca, chỉ thay thế các slot nháp cũ thuộc ca này
  // Tuyệt đối không xóa/đè lên ca dạy (assignedClass) hoặc ca đăng ký trực (status === 'registered' | 'locked')
  const filtered = records.filter((r) => {
    if (r.employeeId !== employee.id || !dates.includes(r.date)) return true
    if (r.assignedClass || r.status === 'locked' || r.status === 'registered') return true
    const sec = WORK_TIME_SLOTS.find((s) => s.id === r.slotId)?.section
    return !(sec && targetSections.has(sec))
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
