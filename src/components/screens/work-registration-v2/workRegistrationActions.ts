import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
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
