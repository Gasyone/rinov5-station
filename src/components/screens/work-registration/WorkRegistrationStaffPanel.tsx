'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'
import {
  sumDraftMinutes,
  sumRegisteredMinutes,
} from './workRegistrationHelpers'
import { WorkRegistrationStaffSectionGrid } from './WorkRegistrationStaffSectionGrid'
import { WorkRegistrationTimeRangePicker } from './WorkRegistrationTimeRangePicker'
import { WorkRegistrationStaffTable } from './WorkRegistrationStaffTable'
import type {
  EmployeeWeekSummary,
  WorkRegistrationStatusFilter,
} from './workRegistrationTypes'
import { cn } from '@/lib/utils'

interface WorkRegistrationStaffPanelProps {
  statusTiles?: unknown[]
  statusFilter?: WorkRegistrationStatusFilter
  filteredSummaries: EmployeeWeekSummary[]
  delegateEmployeeId?: string
  activeEmployeeName: string
  weekDays: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  todayKey: string
  page: number
  pageSize: number
  totalMinutes: number
  priorityMinutes?: number
  readonlyWeek: boolean
  priorityRules: WorkPrioritySlotRule[]
  canMutate: boolean
  primaryActionLabel: string
  actionHelperText?: string
  onStatusChange?: (status: WorkRegistrationStatusFilter) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSetDelegateEmployee: (employeeId?: string) => void
  onToggleSection?: (date: string, section: ShiftSection) => void
  onRemoveSlots?: (date: string, slotIds: string[]) => void
  onSetSlot?: (date: string, slotId: string, selected: boolean) => void
  onAddRange?: (
    dates: string[],
    startTime: string,
    endTime: string,
    multipleRanges?: Array<{ startTime: string; endTime: string }>
  ) => void
  onOpenSlotDetail: (date: string, slotId?: string, section?: string) => void
  onSubmit: () => void
}

export function WorkRegistrationStaffPanel({
  filteredSummaries,
  delegateEmployeeId,
  activeEmployeeName,
  weekDays,
  records,
  employees,
  todayKey,
  page,
  pageSize,
  totalMinutes,
  readonlyWeek,
  priorityRules,
  canMutate,
  primaryActionLabel,
  onPageChange,
  onPageSizeChange,
  onSetDelegateEmployee,
  onToggleSection,
  onRemoveSlots,
  onAddRange,
  onOpenSlotDetail,
  onSubmit,
}: WorkRegistrationStaffPanelProps) {
  const registeredMinutes = sumRegisteredMinutes(records)
  const draftMinutes = sumDraftMinutes(records)

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {/* THANH ĐĂNG KÝ THAY KHI CHỌN NHÂN VIÊN (ĐÓNG KHUNG) */}
      {delegateEmployeeId && onAddRange ? (
        <div className="rounded-xl border border-border/80 bg-card px-3 py-2.5 shadow-2xs">
          <WorkRegistrationTimeRangePicker
            days={weekDays}
            disabled={readonlyWeek || !canMutate}
            totalMinutes={totalMinutes}
            registeredMinutes={registeredMinutes}
            draftMinutes={draftMinutes}
            canMutate={canMutate}
            primaryActionLabel={primaryActionLabel}
            onSubmit={onSubmit}
            onAddRange={onAddRange}
            headerPrefix={
              <div className="flex flex-col justify-center min-w-[120px] max-w-[180px]">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Đăng ký cho
                </span>
                <span className="text-xs sm:text-sm font-bold text-primary truncate" title={activeEmployeeName}>
                  {activeEmployeeName}
                </span>
              </div>
            }
            headerSuffix={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Thoát đăng ký thay"
                onClick={() => onSetDelegateEmployee(undefined)}
                className="h-7 w-7 cursor-pointer shrink-0 text-muted-foreground hover:text-foreground"
                title="Đóng đăng ký thay"
              >
                <X className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ) : null}

      {/* DANH SÁCH NHÂN VIÊN (GIẢM BỀ RỘNG GỌN GÀNG) + LƯỚI LỊCH (PHẲNG FULL) */}
      <div className="grid min-h-0 flex-1 gap-2 md:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)]">
        <div className={cn('h-full min-h-0', delegateEmployeeId ? 'hidden md:block' : 'block')}>
          <WorkRegistrationStaffTable
            summaries={filteredSummaries}
            page={page}
            pageSize={pageSize}
            selectedEmployeeId={delegateEmployeeId}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onViewEmployee={onSetDelegateEmployee}
          />
        </div>

        <div className={cn('flex-1 min-h-0 flex flex-col', !delegateEmployeeId ? 'hidden md:flex' : 'flex')}>
          <WorkRegistrationStaffSectionGrid
            days={weekDays}
            records={records}
            employees={employees}
            todayKey={todayKey}
            editableEmployeeId={delegateEmployeeId}
            readonlyWeek={readonlyWeek}
            priorityRules={priorityRules}
            onToggleSection={onToggleSection}
            onRemoveSlots={onRemoveSlots}
            onOpenSlotDetail={onOpenSlotDetail}
          />
        </div>
      </div>
    </div>
  )
}
