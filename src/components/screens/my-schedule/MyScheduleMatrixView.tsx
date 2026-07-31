'use client'

import { ScheduleTimeGrid } from '@/components/screens/schedule/ScheduleTimeGrid'
import { MyScheduleCard } from './MyScheduleCard'
import type { UnifiedSlot } from './myScheduleTypes'

interface MyScheduleMatrixViewProps {
  slots: UnifiedSlot[]
  days: Date[]
  today: Date
  viewMode: 'day' | 'week'
  activeBranch: string
  onSlotClick: (slot: UnifiedSlot) => void
}

export function MyScheduleMatrixView({
  slots,
  days,
  today,
  viewMode,
  activeBranch,
  onSlotClick,
}: MyScheduleMatrixViewProps) {
  return (
    <ScheduleTimeGrid
      items={slots}
      days={days}
      today={today}
      overlapLayout="columns"
      fixedWidthItems={viewMode === 'day'}
      renderItem={(slot, context) => (
        <MyScheduleCard
          slot={slot}
          compact
          activeBranch={activeBranch}
          isOverlapped={context.isOverlapped}
          showTime={false}
          onClick={() => onSlotClick(slot)}
        />
      )}
    />
  )
}
