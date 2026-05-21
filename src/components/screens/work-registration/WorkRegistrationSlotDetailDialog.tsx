'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getInitials, getSlot } from './workRegistrationHelpers'
import { WORK_STATUS_LABELS } from './workRegistrationTypes'

interface WorkRegistrationSlotDetailDialogProps {
  open: boolean
  title: string
  description?: string
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  onOpenChange: (open: boolean) => void
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {records.length > 0 ? (
            records.map((record) => {
              const employee = employeeById.get(record.employeeId)
              const slot = getSlot(record.slotId)
              if (!employee) return null

              return (
                <div
                  key={record.id}
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
                        {employee.position} · {employee.branch} · {slot?.label ?? record.slotId}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass(record.status === 'draft' ? 'draft' : record.status)}>
                    {record.status === 'draft' ? 'Nháp' : WORK_STATUS_LABELS[record.status as keyof typeof WORK_STATUS_LABELS]}
                  </Badge>
                </div>
              )
            })
          ) : (
            <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Chưa có đăng ký cho khung giờ này.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
