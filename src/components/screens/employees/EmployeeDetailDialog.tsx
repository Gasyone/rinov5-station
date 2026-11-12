'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Building2,
  MapPin,
  Phone,
  Mail,
  Cake,
} from 'lucide-react'
import type { Employee } from '@/mocks/employees'
import { getBirthdayInfo } from './employeesHelpers'

interface EmployeeDetailDialogProps {
  open: boolean
  employee: Employee | null
  onOpenChange: (open: boolean) => void
}

export function EmployeeDetailDialog({
  open,
  employee,
  onOpenChange,
}: EmployeeDetailDialogProps) {
  if (!employee) return null

  const bday = getBirthdayInfo(employee.dob)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 text-xs">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {employee.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold leading-tight">
                {employee.name}
              </DialogTitle>
              <p className="text-xs text-sky-700 dark:text-sky-300 font-medium mt-0.5">
                {employee.position}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-3">
          {/* Thông tin phòng ban & chức vụ */}
          <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              Vị trí & Phòng ban
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-muted-foreground">Phòng ban: </span>
                <span className="font-medium text-foreground">{employee.department}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Chức danh chính: </span>
                <span className="font-medium text-foreground">{employee.position}</span>
              </div>
              {employee.secondaryPosition && (
                <div>
                  <span className="text-muted-foreground">Kiêm nhiệm: </span>
                  <span className="font-medium text-foreground">{employee.secondaryPosition}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cơ sở làm việc */}
          <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Cơ sở công tác
            </h4>
            <p>
              Cơ sở chính: <strong className="text-foreground">{employee.branch}</strong>
            </p>
            {employee.branches && employee.branches.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {employee.branches.map((b) => (
                  <Badge key={b} variant="secondary" className="text-[11px] font-normal">
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Liên hệ công vụ */}
          <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <Phone className="h-3.5 w-3.5 text-primary" />
              Thông tin liên hệ công vụ
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono font-medium text-foreground">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-foreground">{employee.email}</span>
              </div>
              {bday && (
                <div className="flex items-center gap-2">
                  <Cake className="h-3 w-3 text-pink-500 shrink-0" />
                  <span className="text-foreground">
                    Sinh nhật: {bday.fullDob} {bday.isThisMonth ? '(trong tháng này)' : ''}
                  </span>
                </div>
              )}
              {employee.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{employee.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
