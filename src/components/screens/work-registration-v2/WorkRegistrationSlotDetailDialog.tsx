'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
  WorkRegistrationStatus,
} from '@/mocks/workRegistrations'
import { formatMinutes, getInitials, getSlot } from './workRegistrationHelpers'

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
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {summaries.length > 0 ? (
            summaries.map(({ employee, totalMinutes, status }) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{employee.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {employee.position} · {employee.branch} · {formatMinutes(totalMinutes)}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusBadgeClass(status)}>
                  {workRegistrationStatusLabel(status)}
                </Badge>
              </div>
            ))
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

function buildEmployeeRegistrationSummaries(
  records: WorkRegistrationRecord[],
  employeeById: Map<string, WorkRegistrationEmployee>
): EmployeeRegistrationSummary[] {
  const summaryByEmployee = new Map<string, EmployeeRegistrationSummary>()

  records.forEach((record) => {
    const employee = employeeById.get(record.employeeId)
    if (!employee) return

    const current = summaryByEmployee.get(employee.id) ?? {
      employee,
      records: [],
      totalMinutes: 0,
      status: record.status,
    }

    current.records.push(record)
    current.totalMinutes += getSlot(record.slotId)?.minutes ?? 0
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

function workRegistrationStatusLabel(status: WorkRegistrationStatus) {
  if (status === 'draft') return 'Đã chọn'
  if (status === 'locked') return 'Đã khóa'
  return 'Đã đăng ký'
}
