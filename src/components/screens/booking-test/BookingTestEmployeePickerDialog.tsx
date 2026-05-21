'use client'

import { useMemo, useState } from 'react'
import { Check, Search, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmptyState, StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getInitials, maskPhone } from '@/lib/format'
import type { Employee } from '@/mocks/employees'
import { getPersonTitle, isTeacherLikeEmployee } from './bookingTestStaffHelpers'

type StaffTab = 'all' | 'teacher' | 'sales' | 'care' | 'management'

interface BookingTestEmployeePickerDialogProps {
  open: boolean
  employees: Employee[]
  branchName: string
  selectedName?: string
  onOpenChange: (open: boolean) => void
  onSelect: (employee: Employee) => void
}

const STAFF_TABS: Array<{ value: StaffTab; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'sales', label: 'Sales' },
  { value: 'care', label: 'CSM' },
  { value: 'management', label: 'Quản lý' },
]

function employeeMatchesTab(employee: Employee, tab: StaffTab) {
  const haystack = `${employee.position} ${employee.department}`.toLowerCase()
  if (tab === 'all') return true
  if (tab === 'teacher') return isTeacherLikeEmployee(employee)
  if (tab === 'sales') return haystack.includes('sale')
  if (tab === 'care') return haystack.includes('care') || haystack.includes('csm')
  return haystack.includes('manager') || haystack.includes('management')
}

export function BookingTestEmployeePickerDialog({
  open,
  employees,
  branchName,
  selectedName,
  onOpenChange,
  onSelect,
}: BookingTestEmployeePickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<StaffTab>('all')
  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return employees.filter((employee) => {
      if (!employeeMatchesTab(employee, activeTab)) return false
      if (!query) return true
      const haystack = [
        employee.name,
        employee.email,
        employee.phone,
        employee.position,
        employee.department,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [activeTab, employees, searchTerm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid h-[680px] max-h-[calc(100vh-4rem)] grid-rows-[auto_auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:w-[680px] sm:max-w-2xl">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>Chọn giáo viên</DialogTitle>
          <DialogDescription>
            Danh sách nhân sự active tại {branchName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 border-b px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, chức danh, email, số điện thoại..."
              className="pl-9"
            />
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StaffTab)}>
            <TabsList className="h-auto flex-wrap justify-start">
              {STAFF_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="min-h-0 overflow-y-auto px-5 py-4">
          {filteredEmployees.length > 0 ? (
            <div className="space-y-2">
              {filteredEmployees.map((employee) => {
                const selected = employee.name === selectedName
                return (
                  <Button
                    key={employee.id}
                    type="button"
                    variant="ghost"
                    onClick={() => onSelect(employee)}
                    className={cn(
                      'flex h-auto w-full items-center justify-start gap-3 whitespace-normal rounded-lg border bg-background p-3 text-left transition',
                      'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selected && 'border-primary bg-primary/5'
                    )}
                  >
                    <Avatar className="h-11 w-11 rounded-lg">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-semibold">{employee.name}</p>
                        {selected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {getPersonTitle(employee)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {employee.email} · {maskPhone(employee.phone)}
                      </p>
                    </div>
                    <StatusBadge status={employee.status} />
                  </Button>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-7 w-7 text-muted-foreground" />}
              title="Không có nhân sự phù hợp."
              description="Thử đổi tab hoặc từ khóa tìm kiếm."
              className="py-12"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
