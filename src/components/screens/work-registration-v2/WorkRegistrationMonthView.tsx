'use client'

import { Star } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import {
  WORK_TIME_SLOTS,
  isPriorityWorkSlot,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { formatMinutes, getMonthMatrix, sumRegistrationMinutes } from './workRegistrationHelpers'

interface WorkRegistrationMonthViewProps {
  anchor: Date
  records: WorkRegistrationRecord[]
  priorityRules: WorkPrioritySlotRule[]
}

export function WorkRegistrationMonthView({
  anchor,
  records,
  priorityRules,
}: WorkRegistrationMonthViewProps) {
  const matrix = getMonthMatrix(anchor)
  const warning = getStatusColors('warning')

  return (
    <DataTableFrame viewportClassName="overflow-auto">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 border-b border-border bg-muted/50">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
            <div
              key={day}
              className="border-r border-border p-2 text-center text-xs font-medium uppercase text-muted-foreground last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {matrix.flat().map((day) => {
            const dayRecords = records.filter((record) => record.date === day.dateKey)
            const priorityCount = dayRecords.filter((record) =>
              isPriorityWorkSlot(record.date, record.slotId, priorityRules)
            ).length
            const bySection = countBySection(dayRecords)

            return (
              <div
                key={day.dateKey}
                className={cn(
                  'min-h-32 border-b border-r border-border p-2 last:border-r-0',
                  day.inMonth ? 'bg-card' : 'bg-muted/30 text-muted-foreground'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full text-xs font-semibold">
                    {day.date.getDate()}
                  </span>
                  {dayRecords.length > 0 ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {formatMinutes(sumRegistrationMinutes(dayRecords))}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 space-y-1">
                  {bySection.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-md border border-border px-2 py-1 text-[10px] font-medium"
                    >
                      {item.label}: {item.count}
                    </div>
                  ))}
                  {priorityCount > 0 ? (
                    <div className={cn('flex items-center gap-1 text-[10px] font-semibold', warning.text)}>
                      <Star className="h-3 w-3" />
                      {priorityCount} giờ vàng
                    </div>
                  ) : null}
                  {dayRecords.length === 0 ? (
                    <p className="pt-2 text-[10px] text-muted-foreground">Chưa đăng ký</p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DataTableFrame>
  )
}

function countBySection(records: WorkRegistrationRecord[]) {
  const sectionLabels = {
    morning: 'Sáng',
    afternoon: 'Chiều',
    evening: 'Tối',
  } as const
  return ['morning', 'afternoon', 'evening']
    .map((section) => {
      const count = records.filter((record) => {
        const slot = WORK_TIME_SLOTS.find((item) => item.id === record.slotId)
        return slot?.section === section
      }).length
      return { label: sectionLabels[section as keyof typeof sectionLabels], count }
    })
    .filter((item) => item.count > 0)
}
