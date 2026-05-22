'use client'

import { X } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import { BackButton, StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { WorkRegistrationActionBar } from './WorkRegistrationActionBar'
import { WorkRegistrationGrid } from './WorkRegistrationGrid'
import { WorkRegistrationStaffTable } from './WorkRegistrationStaffTable'
import type {
  EmployeeWeekSummary,
  WorkRegistrationStatusFilter,
  WorkRegistrationStaffLayout,
} from './workRegistrationTypes'
import { ToolbarSelect } from '@/components/controls'
import { cn } from '@/lib/utils'

interface WorkRegistrationStaffPanelProps {
  layout: WorkRegistrationStaffLayout
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
  onSetSlot: (date: string, slotId: string, selected: boolean) => void
  onOpenSlotDetail: (date: string, slotId: string) => void
  onClear: () => void
  onSubmit: () => void
  onBackToList: () => void
}

export function WorkRegistrationStaffPanel({
  layout,
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
  onSetSlot,
  onOpenSlotDetail,
  onClear,
  onSubmit,
  onBackToList,
}: WorkRegistrationStaffPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <StatusTiles tiles={statusTiles} activeId={statusFilter} onSelect={onStatusChange} />

      {delegateEmployeeId ? (
        <div className={cn("flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm", layout === 'grid' ? "gap-3" : "justify-between")}>
          {layout === 'grid' ? (
            <BackButton label="Danh sách" onClick={onBackToList} />
          ) : null}
          <span className="font-medium">
            Đang đăng ký cho <span className="font-semibold text-primary">{activeEmployeeName}</span>
          </span>
          {layout !== 'grid' ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Thoát đăng ký thay"
              onClick={() => onSetDelegateEmployee(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className={cn(
        "grid min-h-0 flex-1 gap-3",
        layout === 'split' ? "xl:grid-cols-[minmax(460px,520px)_minmax(0,1fr)]" : "grid-cols-1"
      )}>
        {layout !== 'grid' ? (
          <WorkRegistrationStaffTable
            summaries={filteredSummaries}
            page={page}
            pageSize={pageSize}
            selectedEmployeeId={delegateEmployeeId}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onRegisterFor={onSetDelegateEmployee}
            onViewEmployee={onSetDelegateEmployee}
          />
        ) : null}

        {layout !== 'list' ? (
          <DataTableFrame
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
            <WorkRegistrationGrid
              days={weekDays}
              records={records}
              employees={employees}
              todayKey={todayKey}
              editableEmployeeId={delegateEmployeeId}
              readonlyWeek={readonlyWeek}
              priorityRules={priorityRules}
              onSetSlot={onSetSlot}
              onOpenSlotDetail={onOpenSlotDetail}
            />
          </DataTableFrame>
        ) : null}
      </div>
    </div>
  )
}
