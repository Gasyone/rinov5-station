import {
  WORK_TIME_SLOTS,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'

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
  section: 'morning' | 'afternoon' | 'evening'
): WorkRegistrationRecord[] {
  const isCurrentlySelected = records.some(
    (r) => r.employeeId === employee.id && r.date === date && r.slotId.startsWith(section)
  )

  if (isCurrentlySelected) {
    return records.filter(
      (r) => !(r.employeeId === employee.id && r.date === date && r.slotId.startsWith(section) && r.status !== 'locked')
    )
  } else {
    const sectionSlots = WORK_TIME_SLOTS.filter((s) => s.section === section)
    const newRecords: WorkRegistrationRecord[] = sectionSlots.map((slot) => ({
      id: `wr-local-${employee.id}-${date}-${slot.id}`,
      employeeId: employee.id,
      branch: employee.branch,
      date,
      weekStart,
      slotId: slot.id,
      status: 'draft' as const,
      updatedAt: new Date().toISOString(),
    }))
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

export function clearWorkRegistrationWeek(
  records: WorkRegistrationRecord[],
  employeeId: string,
  weekStart: string
) {
  return records.filter((record) => {
    if (record.employeeId !== employeeId || record.weekStart !== weekStart) return true
    return record.status === 'locked'
  })
}
