'use client'

import { useEffect, useMemo, useState } from 'react'
import { Lock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  WORK_TIME_SLOTS,
  isPriorityWorkSlot,
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { AggregateCell, cellClass } from './WorkRegistrationGridCell'
import { WORK_STATUS_LABELS } from './workRegistrationTypes'

interface WorkRegistrationGridProps {
  days: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  todayKey: string
  editableEmployeeId?: string
  readonlyWeek?: boolean
  priorityRules: WorkPrioritySlotRule[]
  onSetSlot?: (date: string, slotId: string, selected: boolean) => void
  onOpenSlotDetail?: (date: string, slotId: string) => void
}

export function WorkRegistrationGrid({
  days,
  records,
  employees,
  todayKey,
  editableEmployeeId,
  readonlyWeek,
  priorityRules,
  onSetSlot,
  onOpenSlotDetail,
}: WorkRegistrationGridProps) {
  const [dragIntent, setDragIntent] = useState<boolean | null>(null)
  const warningColors = getStatusColors('warning')
  const employeeById = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee])),
    [employees]
  )
  const aggregateMode = !editableEmployeeId

  const allCells = useMemo(() => {
    return days.flatMap((day) =>
      WORK_TIME_SLOTS.map((slot) => ({ dateKey: toWorkDateKey(day), slotId: slot.id }))
    )
  }, [days])

  useEffect(() => {
    const stopDrag = () => setDragIntent(null)
    window.addEventListener('pointerup', stopDrag)
    return () => window.removeEventListener('pointerup', stopDrag)
  }, [])

  const getEditableRecord = (dateKey: string, slotId: string) =>
    records.find(
      (record) =>
        record.employeeId === editableEmployeeId &&
        record.date === dateKey &&
        record.slotId === slotId
    )

  const getSlotRecords = (dateKey: string, slotId: string) =>
    records.filter((record) => record.date === dateKey && record.slotId === slotId)

  const isDisabledCell = (dateKey: string, slotId: string) => {
    const record = getEditableRecord(dateKey, slotId)
    return (
      aggregateMode ||
      Boolean(readonlyWeek) ||
      dateKey < todayKey ||
      record?.status === 'locked'
    )
  }

  const isSelectedCell = (dateKey: string, slotId: string) =>
    Boolean(getEditableRecord(dateKey, slotId))

  const applySelection = (dateKey: string, slotId: string, selected: boolean) => {
    if (isDisabledCell(dateKey, slotId)) return
    onSetSlot?.(dateKey, slotId, selected)
  }

  const selectableCells = (items: Array<{ dateKey: string; slotId: string }>) =>
    items.filter((item) => !isDisabledCell(item.dateKey, item.slotId))

  const selectionState = (items: Array<{ dateKey: string; slotId: string }>) => {
    const selectable = selectableCells(items)
    const selectedCount = selectable.filter((item) => isSelectedCell(item.dateKey, item.slotId)).length
    if (selectedCount === 0) return false
    return selectedCount === selectable.length ? true : 'indeterminate'
  }

  const applySelectionGroup = (items: Array<{ dateKey: string; slotId: string }>) => {
    const selectable = selectableCells(items)
    const allSelected = selectable.length > 0 && selectable.every((item) => isSelectedCell(item.dateKey, item.slotId))
    selectable.forEach((item) => applySelection(item.dateKey, item.slotId, !allSelected))
  }

  const gridTemplateColumns = `5.25rem repeat(${days.length}, minmax(8.5rem, 1fr))`
  const gridTemplateRows = `repeat(${WORK_TIME_SLOTS.length}, minmax(44px, 1fr))`

  return (
    <div className="flex flex-col min-w-max text-sm">
      <div
        className="sticky top-0 z-20 grid min-w-max border-b border-border/40 bg-background/95 backdrop-blur-sm"
        style={{ gridTemplateColumns }}
      >
        <div className="flex items-center gap-2 border-r border-border/40 px-2 py-3 text-xs font-medium uppercase text-muted-foreground">
          {!aggregateMode ? (
            <Checkbox
              checked={selectionState(allCells)}
              disabled={selectableCells(allCells).length === 0}
              aria-label="Chọn tất cả dòng và cột"
              onCheckedChange={() => applySelectionGroup(allCells)}
            />
          ) : null}
          <span>Giờ</span>
        </div>
        {days.map((day) => {
          const dateKey = toWorkDateKey(day)
          const isToday = dateKey === todayKey
          const dayCells = WORK_TIME_SLOTS.map((slot) => ({ dateKey, slotId: slot.id }))
          const hasSelectable = selectableCells(dayCells).length > 0
          return (
            <div
              key={dateKey}
              className="flex min-w-0 flex-col items-center border-r border-border/40 py-2 last:border-r-0"
            >
              {!aggregateMode ? (
                <Checkbox
                  checked={selectionState(dayCells)}
                  disabled={!hasSelectable}
                  aria-label={`Chọn cả ngày ${day.toLocaleDateString('vi-VN')}`}
                  onCheckedChange={() => applySelectionGroup(dayCells)}
                  className="mb-1"
                />
              ) : null}
              <span className={cn('text-[11px] font-medium uppercase', isToday ? 'text-primary' : 'text-muted-foreground')}>
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][day.getDay()]}
              </span>
              <div
                className={cn(
                  'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                  isToday ? 'bg-primary text-primary-foreground' : ''
                )}
              >
                {day.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="grid min-h-0 min-w-max divide-y divide-border/10"
        style={{ gridTemplateRows }}
      >
        {WORK_TIME_SLOTS.map((slot) => {
          const rowCells = days.map((day) => ({ dateKey: toWorkDateKey(day), slotId: slot.id }))
          const hasSelectable = selectableCells(rowCells).length > 0
          return (
            <div key={slot.id} className="grid min-h-11" style={{ gridTemplateColumns }}>
              <div className="flex items-center justify-between gap-2 border-r border-border/40 px-2 py-1.5">
                {!aggregateMode ? (
                  <Checkbox
                    checked={selectionState(rowCells)}
                    disabled={!hasSelectable}
                    aria-label={`Chọn khung ${slot.label}`}
                    onCheckedChange={() => applySelectionGroup(rowCells)}
                  />
                ) : null}
                <div className="min-w-0 text-right">
                  <p className="text-xs font-medium text-muted-foreground">{slot.start}</p>
                  <p className="text-[10px] text-muted-foreground/70">{slot.end}</p>
                </div>
              </div>
            {days.map((day) => {
              const dateKey = toWorkDateKey(day)
              const priority = isPriorityWorkSlot(dateKey, slot.id, priorityRules)
              const record = getEditableRecord(dateKey, slot.id)
              const slotRecords = getSlotRecords(dateKey, slot.id)
              const disabled = isDisabledCell(dateKey, slot.id)

              return (
                <div
                  key={`${dateKey}-${slot.id}`}
                  className="min-w-0 border-r border-border/30 px-1.5 py-1.5 last:border-r-0"
                >
                  {aggregateMode ? (
                    <AggregateCell
                      records={slotRecords}
                      employeeById={employeeById}
                      priority={priority}
                      warningTextClass={warningColors.text}
                      onOpen={() => onOpenSlotDetail?.(dateKey, slot.id)}
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={disabled}
                      onPointerDown={(event) => {
                        event.preventDefault()
                        const selected = !record
                        setDragIntent(selected)
                        applySelection(dateKey, slot.id, selected)
                      }}
                      onPointerEnter={() => {
                        if (dragIntent !== null) applySelection(dateKey, slot.id, dragIntent)
                      }}
                      className={cn(
                        'flex h-full min-h-8 w-full items-center justify-center gap-1 rounded-md border px-2 text-xs font-semibold transition-colors',
                        cellClass(record, disabled, priority)
                      )}
                    >
                      {record?.status === 'locked' ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : null}
                      {record ? (record.status === 'draft' ? 'Nháp' : WORK_STATUS_LABELS[record.status as keyof typeof WORK_STATUS_LABELS]) : ''}
                      {priority ? <Star className={cn('h-3.5 w-3.5', warningColors.text)} /> : null}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
          )
        })}
      </div>
    </div>
  )
}
