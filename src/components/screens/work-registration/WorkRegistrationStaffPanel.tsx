'use client'

import { X } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'
import { WorkRegistrationActionBar } from './WorkRegistrationActionBar'
import { WorkRegistrationStaffSectionGrid } from './WorkRegistrationStaffSectionGrid'
import { WorkRegistrationStaffTable } from './WorkRegistrationStaffTable'
import type {
  EmployeeWeekSummary,
  WorkRegistrationStatusFilter,
} from './workRegistrationTypes'
import { cn } from '@/lib/utils'

interface WorkRegistrationStaffPanelProps {
  statusTiles: StatusTile<WorkRegistrationStatusFilter>[]
  statusFilter: WorkRegistrationStatusFilter
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
  onStatusChange: (status: WorkRegistrationStatusFilter) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSetDelegateEmployee: (employeeId?: string) => void
  onToggleSection?: (date: string, section: ShiftSection) => void
  onSetSlot?: (date: string, slotId: string, selected: boolean) => void
  onOpenSlotDetail: (date: string, slotId: string) => void
  onClear: () => void
  onSubmit: () => void
}

export function WorkRegistrationStaffPanel({
  statusTiles,
  statusFilter,
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
  onStatusChange,
  onPageChange,
  onPageSizeChange,
  onSetDelegateEmployee,
  onToggleSection,
  onSetSlot,
  onOpenSlotDetail,
  onClear,
  onSubmit,
}: WorkRegistrationStaffPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <StatusTiles tiles={statusTiles} activeId={statusFilter} onSelect={onStatusChange} />

      {delegateEmployeeId ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <span className="font-medium">
            Đang đăng ký cho <span className="font-semibold text-primary">{activeEmployeeName}</span>
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Thoát đăng ký thay"
            onClick={() => onSetDelegateEmployee(undefined)}
            className="cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(420px,460px)_minmax(0,1fr)]">
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
            onOpenSlotDetail={onOpenSlotDetail}
          />
        </DataTableFrame>
      </div>
    </div>
  )
}
