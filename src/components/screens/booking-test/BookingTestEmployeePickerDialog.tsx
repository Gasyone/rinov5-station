'use client'

import { useMemo, useState } from 'react'
import { Check, Clock, Search, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState, AppAvatar, PersonnelHoverCard } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import type { Employee } from '@/mocks/employees'
import type { BookingTest } from '@/mocks/bookingTests'
import {
  getBookingShiftInfo,
  getDutyRosterEmployees,
  getEmployeeAvailability,
  getPersonTitle,
  isTeacherLikeEmployee,
} from './bookingTestStaffHelpers'

type StaffTab = 'all' | 'teacher' | 'other'

interface BookingTestEmployeePickerDialogProps {
  open: boolean
  employees: Employee[]
  allRosterEmployees?: Employee[]
  branchName: string
  selectedName?: string
  bookings?: BookingTest[]
  bookingTime?: string
  currentBookingId?: string
  onOpenChange: (open: boolean) => void
  onSelect: (employee: Employee) => void
}

const STAFF_TABS: Array<{ value: StaffTab; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'other', label: 'Khác' },
]

function employeeMatchesTab(employee: Employee, tab: StaffTab) {
  if (tab === 'all') return true
  if (tab === 'teacher') return isTeacherLikeEmployee(employee)
  return !isTeacherLikeEmployee(employee)
}

export function BookingTestEmployeePickerDialog({
  open,
  employees,
  allRosterEmployees,
  branchName,
  selectedName,
  bookings = [],
  bookingTime = '',
  currentBookingId = '',
  onOpenChange,
  onSelect,
}: BookingTestEmployeePickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<StaffTab>('all')
  const [showAllShifts, setShowAllShifts] = useState(false)

  const shiftInfo = useMemo(
    () => getBookingShiftInfo(branchName, bookingTime),
    [branchName, bookingTime]
  )

  const dutyRosterStaff = useMemo(() => {
    if (allRosterEmployees && allRosterEmployees.length > 0) {
      return allRosterEmployees
    }
    return getDutyRosterEmployees(branchName)
  }, [allRosterEmployees, branchName])

  const baseEmployees = useMemo(() => {
    // Khi người dùng tìm kiếm -> tìm kiếm trên toàn bộ danh sách trực của cơ sở
    if (searchTerm.trim()) {
      return dutyRosterStaff
    }
    // Khi người dùng bấm chuyển sang xem toàn bộ ca trực
    if (showAllShifts) {
      return dutyRosterStaff
    }
    // Ưu tiên hiển thị danh sách nhân sự được phân bổ cho ca trực này
    if (shiftInfo.slotEmployees.length > 0) {
      return shiftInfo.slotEmployees
    }
    return employees.length > 0 ? employees : dutyRosterStaff
  }, [dutyRosterStaff, employees, searchTerm, showAllShifts, shiftInfo.slotEmployees])

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return baseEmployees.filter((employee) => {
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
  }, [activeTab, baseEmployees, searchTerm])

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const aAvail = getEmployeeAvailability(a.name, bookingTime, currentBookingId, bookings)
      const bAvail = getEmployeeAvailability(b.name, bookingTime, currentBookingId, bookings)
      if (aAvail.isBusy !== bAvail.isBusy) {
        return aAvail.isBusy ? 1 : -1
      }
      return 0
    })
  }, [filteredEmployees, bookingTime, currentBookingId, bookings])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid h-[520px] max-h-[85vh] grid-rows-[auto_auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:w-[460px] sm:max-w-md">
        <DialogHeader className="pl-4 pr-10 pt-3 pb-1">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-sm font-bold text-foreground">Chọn giáo viên</DialogTitle>
            {shiftInfo.shiftLabel ? (
              <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                Ca trực {shiftInfo.shiftLabel}
              </span>
            ) : null}
          </div>
          <DialogDescription className="sr-only">
            Danh sách nhân sự tại {branchName}.
          </DialogDescription>
        </DialogHeader>

        {/* Ô tìm kiếm cùng hàng với tab lọc - Không nền, không đường line */}
        <div className="flex items-center gap-2 px-3.5 py-1.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm tên, chức danh..."
              className="h-7.5 pl-8 pr-2.5 text-xs bg-background shadow-2xs"
            />
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StaffTab)} className="shrink-0">
            <TabsList className="h-7.5 p-0.5 gap-0.5 bg-muted/50 border-0">
              {STAFF_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="h-6.5 px-2 text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Danh sách giáo viên tinh gọn (mỗi người 2-3 dòng, trạng thái bận/rảnh, lịch bận, hover profile) */}
        <div className="min-h-0 overflow-y-auto px-3 py-1.5">
          {sortedEmployees.length > 0 ? (
            <div className="space-y-1">
              {sortedEmployees.map((employee) => {
                const selected = employee.name === selectedName
                const availability = getEmployeeAvailability(
                  employee.name,
                  bookingTime,
                  currentBookingId,
                  bookings
                )
                const statusColorSet = getStatusColors(availability.statusSemantic)

                return (
                  <div
                    key={employee.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (availability.isBusy && availability.conflictDetail) {
                        toast.warning(
                          `Giáo viên ${employee.name} hiện đang bận: ${availability.conflictDetail}. Đã gán theo chỉ định.`
                        )
                      }
                      onSelect(employee)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (availability.isBusy && availability.conflictDetail) {
                          toast.warning(
                            `Giáo viên ${employee.name} hiện đang bận: ${availability.conflictDetail}. Đã gán theo chỉ định.`
                          )
                        }
                        onSelect(employee)
                      }
                    }}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-1.5 text-left transition-all duration-150 cursor-pointer',
                      'hover:border-border/80 hover:bg-muted/40',
                      selected ? 'border-primary/50 bg-primary/5 shadow-2xs font-medium' : '',
                      availability.isBusy ? 'hover:bg-rose-500/5' : ''
                    )}
                  >
                    <PersonnelHoverCard
                      person={{
                        id: employee.id,
                        name: employee.name,
                        role: getPersonTitle(employee),
                        avatar: employee.avatar,
                        phone: employee.phone,
                        email: employee.email,
                      }}
                      align="start"
                    >
                      <div
                        className="shrink-0 transition-transform group-hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <AppAvatar
                          src={employee.avatar}
                          name={employee.name}
                          size="default"
                          shape="circle"
                          userId={employee.id}
                          userType="teacher"
                        />
                      </div>
                    </PersonnelHoverCard>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                            {employee.name}
                          </p>
                          <span
                            className={cn(
                              'text-[10.5px] font-medium shrink-0',
                              statusColorSet.text
                            )}
                          >
                            {availability.statusLabel}
                          </span>
                        </div>
                        {selected ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> : null}
                      </div>

                      <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                        {getPersonTitle(employee)}
                      </p>

                      {availability.isBusy && availability.conflictDetail ? (
                        <div
                          className="flex items-center gap-1 text-[10.5px] font-medium text-rose-600 dark:text-rose-400 leading-tight mt-0.5 truncate"
                          title={availability.conflictDetail}
                        >
                          <Clock className="h-3 w-3 shrink-0 text-rose-500" />
                          <span className="truncate">{availability.conflictDetail}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}

              {!searchTerm.trim() && shiftInfo.slotEmployees.length > 0 && dutyRosterStaff.length > shiftInfo.slotEmployees.length ? (
                <div className="pt-2 pb-1 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllShifts((prev) => !prev)}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {showAllShifts
                      ? `← Chỉ xem nhân sự ca này (${shiftInfo.slotEmployees.length})`
                      : `Xem tất cả nhân sự trực (${dutyRosterStaff.length})`}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              title="Không có nhân sự phù hợp."
              description="Thử đổi tab hoặc từ khóa tìm kiếm."
              className="py-8"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
