'use client'

import { AppAvatar } from '@/components/shared'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  WORK_TIME_SLOTS,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
  type WorkRegistrationStatus,
} from '@/mocks/workRegistrations'
import { formatMinutes, getEmployeeRoleLabel, getSlot } from './workRegistrationHelpers'

interface WorkRegistrationSlotDetailDialogProps {
  open: boolean
  title: string
  description?: string
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  onOpenChange: (open: boolean) => void
}

interface EmployeeRegistrationSummary {
  employee: WorkRegistrationEmployee
  records: WorkRegistrationRecord[]
  totalMinutes: number
  status: WorkRegistrationStatus
}

export function WorkRegistrationSlotDetailDialog({
  open,
  title,
  description,
  records,
  employees,
  onOpenChange,
}: WorkRegistrationSlotDetailDialogProps) {
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))
  const summaries = buildEmployeeRegistrationSummaries(records, employeeById)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-bold leading-normal">
            {title}
          </DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {summaries.length > 0 ? (
            summaries.map(({ employee, totalMinutes, records: empRecords }) => {
              const timeRange = resolveRegisteredTimeRange(empRecords)
              return (
                <div
                  key={employee.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-2.5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <AppAvatar src={employee.avatar} name={employee.name} size="default" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{employee.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {getEmployeeRoleLabel(employee.id, employee.position, employee.department)} · {employee.branch}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 tabular-nums">
                      {formatMinutes(totalMinutes)}
                    </span>
                    {timeRange && (
                      <span className="text-xs font-normal text-muted-foreground tabular-nums">
                        {timeRange}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Chưa có đăng ký phù hợp.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function resolveRegisteredTimeRange(records: WorkRegistrationRecord[]): string {
  const uniqueSlotIds = Array.from(new Set(records.map((r) => r.slotId)))
  const slots = uniqueSlotIds
    .map((slotId) => WORK_TIME_SLOTS.find((s) => s.id === slotId))
    .filter((s): s is (typeof WORK_TIME_SLOTS)[number] => Boolean(s))
    .sort((a, b) => a.start.localeCompare(b.start))

  if (slots.length === 0) return ''

  const intervals: Array<{ start: string; end: string }> = []
  let current: { start: string; end: string } | null = null

  for (const slot of slots) {
    if (!current) {
      current = { start: slot.start, end: slot.end }
    } else if (slot.start === current.end) {
      current.end = slot.end
    } else {
      intervals.push(current)
      current = { start: slot.start, end: slot.end }
    }
  }
  if (current) intervals.push(current)

  return intervals.map((i) => `${i.start} - ${i.end}`).join(', ')
}

function buildEmployeeRegistrationSummaries(
  records: WorkRegistrationRecord[],
  employeeById: Map<string, WorkRegistrationEmployee>
): EmployeeRegistrationSummary[] {
  const summaryByEmployee = new Map<string, EmployeeRegistrationSummary>()
  const employeeSlotSets = new Map<string, Set<string>>()

  records.forEach((record) => {
    const employee = employeeById.get(record.employeeId)
    if (!employee) return

    let slotSet = employeeSlotSets.get(employee.id)
    if (!slotSet) {
      slotSet = new Set<string>()
      employeeSlotSets.set(employee.id, slotSet)
    }

    const current = summaryByEmployee.get(employee.id) ?? {
      employee,
      records: [],
      totalMinutes: 0,
      status: record.status,
    }

    if (!slotSet.has(record.slotId)) {
      slotSet.add(record.slotId)
      current.totalMinutes += getSlot(record.slotId)?.minutes ?? 0
    }

    current.records.push(record)
    current.status = resolveSummaryStatus(current.records)
    summaryByEmployee.set(employee.id, current)
  })

  return Array.from(summaryByEmployee.values())
}

function resolveSummaryStatus(records: WorkRegistrationRecord[]): WorkRegistrationStatus {
  if (records.some((record) => record.status === 'registered')) return 'registered'
  if (records.some((record) => record.status === 'locked')) return 'locked'
  return 'draft'
}
