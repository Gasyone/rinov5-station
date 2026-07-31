'use client'

import type { ReactNode } from 'react'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import type { UnifiedSlot } from './myScheduleTypes'

interface MyScheduleHoverCardProps {
  slot: UnifiedSlot
  children: ReactNode
  openDelay?: number
  closeDelay?: number
}

export function MyScheduleHoverCard({
  slot,
  children,
  openDelay = 150,
  closeDelay = 100,
}: MyScheduleHoverCardProps) {
  return (
    <SessionHoverCard
      session={slot}
      openDelay={openDelay}
      closeDelay={closeDelay}
      side="right"
    >
      {children}
    </SessionHoverCard>
  )
}
