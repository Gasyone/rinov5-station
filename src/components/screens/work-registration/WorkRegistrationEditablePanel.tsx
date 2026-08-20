'use client'

import { DataTableFrame } from '@/components/data-table'
import {
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'
import { WorkRegistrationStaffSectionGrid } from './WorkRegistrationStaffSectionGrid'
import { WorkRegistrationTimeRangePicker } from './WorkRegistrationTimeRangePicker'

interface WorkRegistrationEditablePanelProps {
  weekDays: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  activeEmployeeId: string
  activeEmployeeName?: string
  todayKey: string
  totalMinutes: number
  priorityMinutes?: number
  readonlyWeek: boolean
  priorityRules?: WorkPrioritySlotRule[]
  canMutate: boolean
  primaryActionLabel: string
  actionHelperText?: string
  onAddRange: (
    dates: string[],
    startTime: string,
    endTime: string,
    multipleRanges?: Array<{ startTime: string; endTime: string }>
  ) => void
  onRemoveSlots: (date: string, slotIds: string[]) => void
  onToggleSection?: (date: string, section: ShiftSection) => void
  onClear?: () => void
  onSubmit: () => void
}

export function WorkRegistrationEditablePanel({
  weekDays,
  records,
  employees,
  activeEmployeeId,
  todayKey,
  totalMinutes,
  readonlyWeek,
  priorityRules = [],
  canMutate,
  primaryActionLabel,
  onAddRange,
  onRemoveSlots,
  onToggleSection,
  onSubmit,
}: WorkRegistrationEditablePanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      {/* THANH THÊM KHUNG GIỜ LÀM VIỆC THEO NGÀY + THỐNG KÊ & CẬP NHẬT */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
        <WorkRegistrationTimeRangePicker
          days={weekDays}
          disabled={readonlyWeek || !canMutate}
          totalMinutes={totalMinutes}
          canMutate={canMutate}
          primaryActionLabel={primaryActionLabel}
          onSubmit={onSubmit}
          onAddRange={onAddRange}
        />
      </div>

      {/* MA TRẬN CA LÀM VIỆC */}
      <DataTableFrame className="flex-1 min-h-0">
        <WorkRegistrationStaffSectionGrid
          days={weekDays}
          records={records}
          employees={employees}
          todayKey={todayKey}
          editableEmployeeId={activeEmployeeId}
          readonlyWeek={readonlyWeek}
          priorityRules={priorityRules}
          onToggleSection={onToggleSection}
          onRemoveSlots={onRemoveSlots}
        />
      </DataTableFrame>
    </div>
  )
}
