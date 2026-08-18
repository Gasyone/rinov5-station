'use client'

import { X } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'
import { WorkRegistrationActionBar } from './WorkRegistrationActionBar'
import { WorkRegistrationStaffSectionGrid } from './WorkRegistrationStaffSectionGrid'
import { WorkRegistrationTimeRangePicker } from './WorkRegistrationTimeRangePicker'
import { WorkRegistrationStaffTable } from './WorkRegistrationStaffTable'
import type {
  EmployeeWeekSummary,
  WorkRegistrationStatusFilter,
} from './workRegistrationTypes'
import { cn } from '@/lib/utils'

interface WorkRegistrationStaffPanelProps {
  statusTiles?: any[]
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
  priorityMinutes: number
  readonlyWeek: boolean
  priorityRules: WorkPrioritySlotRule[]
  canMutate: boolean
  primaryActionLabel: string
  actionHelperText: string
  onStatusChange?: (status: WorkRegistrationStatusFilter) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSetDelegateEmployee: (employeeId?: string) => void
  onToggleSection?: (date: string, section: ShiftSection) => void
  onRemoveSlots?: (date: string, slotIds: string[]) => void
  onSetSlot?: (date: string, slotId: string, selected: boolean) => void
  onAddRange?: (dates: string[], startTime: string, endTime: string) => void
  onOpenSlotDetail: (date: string, slotId: string) => void
  onClear: () => void
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
  priorityMinutes,
  readonlyWeek,
  priorityRules,
  canMutate,
  primaryActionLabel,
  actionHelperText,
  onPageChange,
  onPageSizeChange,
  onSetDelegateEmployee,
  onToggleSection,
  onRemoveSlots,
  onAddRange,
  onOpenSlotDetail,
  onClear,
  onSubmit,
}: WorkRegistrationStaffPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* THANH ĐĂNG KÝ THAY KHI CHỌN NHÂN VIÊN */}
      {delegateEmployeeId ? (
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium shrink-0">
              Đăng ký cho <span className="font-semibold text-primary">{activeEmployeeName}</span>
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Thoát đăng ký thay"
              onClick={() => onSetDelegateEmployee(undefined)}
              className="cursor-pointer shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {onAddRange && (
            <WorkRegistrationTimeRangePicker
              days={weekDays}
              disabled={readonlyWeek || !canMutate}
              onAddRange={onAddRange}
              inline
            />
          )}
        </div>
      ) : null}

      {/* DANH SÁCH NHÂN VIÊN (THU GỌN 280px) + LƯỚI LỊCH */}
      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className={cn('h-full min-h-0', delegateEmployeeId ? 'hidden xl:block' : 'block')}>
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

        <DataTableFrame
          className={cn(!delegateEmployeeId && 'hidden xl:flex')}
          footer={delegateEmployeeId ? (
            <WorkRegistrationActionBar
              totalMinutes={totalMinutes}
              priorityMinutes={priorityMinutes}
              subjectLabel={activeEmployeeName}
              canMutate={canMutate}
              primaryLabel={primaryActionLabel}
              helperText={actionHelperText}
              onClear={onClear}
              onSubmit={onSubmit}
            />
          ) : null}
        >
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
        </DataTableFrame>
      </div>
    </div>
  )
}
