'use client'

import React from 'react'
import { Phone, MessageSquare, User, Calendar, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CareInteraction } from './crmLeadDetailTypes'
import { EmptyState } from '@/components/shared'

interface CrmLeadTimelineTabProps {
  interactions: CareInteraction[]
  activeCycleId: string
  activeCycleTitle?: string
}

export function CrmLeadTimelineTab({
  interactions,
  activeCycleId,
  activeCycleTitle,
}: CrmLeadTimelineTabProps) {
  const filteredInteractions = interactions.filter((i) => i.cycleId === activeCycleId)

  const getChannelIcon = (channel: CareInteraction['channel']) => {
    switch (channel) {
      case 'call':
        return <Phone className="h-3 w-3 text-sky-600" />
      case 'zalo':
        return <MessageSquare className="h-3 w-3 text-emerald-600" />
      case 'direct':
        return <User className="h-3 w-3 text-violet-600" />
    }
  }

  const getOutcomeBadgeClass = (outcome: CareInteraction['outcome']) => {
    switch (outcome) {
      case 'interested':
      case 'booked_test':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
      case 'callback':
        return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
      case 'no_answer':
      case 'wrong_number':
        return 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  if (filteredInteractions.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="Chưa có nhật ký tương tác trong chu kỳ này"
          description="Sử dụng form phía trên để ghi nhận cuộc gọi, tin nhắn Zalo hoặc lịch hẹn tiếp xúc đầu tiên."
        />
      </div>
    )
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
        <span>
          Hiển thị <strong>{filteredInteractions.length}</strong> lần tương tác thuộc{' '}
          <strong className="text-foreground">{activeCycleTitle || 'Chu kỳ hiện tại'}</strong>
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/80">
        {filteredInteractions.map((item, index) => {
          const isLatest = index === 0

          return (
            <div key={item.id} className="relative group">
              {/* Bullet icon */}
              <div
                className={cn(
                  'absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 transition-transform',
                  isLatest
                    ? 'border-primary text-primary ring-2 ring-primary/20 scale-110'
                    : 'border-muted-foreground/40 text-muted-foreground'
                )}
              >
                {getChannelIcon(item.channel)}
              </div>

              {/* Card content */}
              <div className="bg-card border border-border/70 hover:border-border rounded-xl p-3 text-xs space-y-1.5 transition-colors shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground">{item.staffName}</span>
                    <span className="text-muted-foreground">•</span>
                    <Badge
                      variant="outline"
                      className={cn('text-[10.5px] px-1.5 py-0 h-4.5', getOutcomeBadgeClass(item.outcome))}
                    >
                      {item.outcomeLabel}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-foreground leading-relaxed pt-0.5">{item.note}</p>

                {item.nextAppointment && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-700 dark:text-violet-300 pt-1 border-t border-border/40">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Hẹn tương tác tiếp: {item.nextAppointment}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
