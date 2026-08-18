'use client'

import { DataTableFrame } from '@/components/data-table'
import {
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import type { ShiftSection } from '@/mocks/shiftRoster'
import { WorkRegistrationActionBar } from './WorkRegistrationActionBar'
import { WorkRegistrationStaffSectionGrid } from './WorkRegistrationStaffSectionGrid'
import { WorkRegistrationTimeRangePicker } from './WorkRegistrationTimeRangePicker'

interface WorkRegistrationEditablePanelProps {
  weekDays: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  activeEmployeeId: string
  activeEmployeeName: string
  todayKey: string
  totalMinutes: number
  priorityMinutes: number
  readonlyWeek: boolean
  priorityRules: WorkPrioritySlotRule[]
  canMutate: boolean
  primaryActionLabel: string
  actionHelperText: string
  onAddRange: (dates: string[], startTime: string, endTime: string) => void
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
  activeEmployeeName,
  todayKey,
  totalMinutes,
  priorityMinutes,
  readonlyWeek,
  priorityRules,
  canMutate,
  primaryActionLabel,
  actionHelperText,
  onAddRange,
  onRemoveSlots,
  onToggleSection,
  onSubmit,
}: WorkRegistrationEditablePanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      {/* THANH THÊM KHUNG GIỜ LÀM VIỆC THEO NGÀY */}
      <WorkRegistrationTimeRangePicker
        days={weekDays}
        disabled={readonlyWeek || !canMutate}
        onAddRange={onAddRange}
      />

      {/* MA TRẬN CA LÀM VIỆC */}
      <DataTableFrame
        className="flex-1 min-h-0"
        footer={
          <WorkRegistrationActionBar
            totalMinutes={totalMinutes}
            priorityMinutes={priorityMinutes}
            subjectLabel={activeEmployeeName}
            canMutate={canMutate}
            primaryLabel={primaryActionLabel}
            helperText={actionHelperText}
            onSubmit={onSubmit}
          />
        }
      >
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
