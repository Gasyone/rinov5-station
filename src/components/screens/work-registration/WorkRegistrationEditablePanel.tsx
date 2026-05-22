'use client'

import { DataTableFrame } from '@/components/data-table'
import {
  getWorkRegistrationEmployees,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { WorkRegistrationActionBar } from './WorkRegistrationActionBar'
import { WorkRegistrationGrid } from './WorkRegistrationGrid'

interface WorkRegistrationEditablePanelProps {
  weekDays: Date[]
  records: WorkRegistrationRecord[]
  employees: ReturnType<typeof getWorkRegistrationEmployees>
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
  onSetSlot: (date: string, slotId: string, selected: boolean) => void
  onClear: () => void
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
  onSetSlot,
  onClear,
  onSubmit,
}: WorkRegistrationEditablePanelProps) {
  return (
    <DataTableFrame
      footer={
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
      }
    >
      <WorkRegistrationGrid
        days={weekDays}
        records={records}
        employees={employees}
        todayKey={todayKey}
        editableEmployeeId={activeEmployeeId}
        readonlyWeek={readonlyWeek}
        priorityRules={priorityRules}
        onSetSlot={onSetSlot}
      />
    </DataTableFrame>
  )
}
