'use client'

import type { ReactNode } from 'react'
import { ShieldAlert, Sparkles, User } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { SpecialStudent, StudentCareTag } from './myClassesHelpers'

interface StudentCareHoverCardProps {
  student: SpecialStudent
  children: ReactNode
}

function getCareTagBadgeStyle(category: StudentCareTag['category']) {
  switch (category) {
    case 'risk':
      return 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
    case 'attendance':
      return 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900'
    case 'academic':
      return 'bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900'
    case 'excellent':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
    case 'vip':
      return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
    default:
      return 'bg-muted text-muted-foreground border-border/50'
  }
}

export function StudentCareHoverCard({ student, children }: StudentCareHoverCardProps) {
  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-72 p-3.5 rounded-xl shadow-lg border bg-popover text-popover-foreground z-50 space-y-2.5"
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section: Avatar + Name + Code */}
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
          <Avatar className="h-10 w-10 shrink-0 border border-primary/10 shadow-2xs">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {student.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-foreground truncate">{student.name}</h4>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-muted text-muted-foreground rounded text-[9px] font-mono font-semibold">
              {student.code}
            </span>
          </div>
        </div>

        {/* Thẻ Chăm sóc list (Care Badges) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1">
              {student.type === 'at_risk' ? (
                <ShieldAlert className="h-3 w-3 text-rose-500" />
              ) : (
                <Sparkles className="h-3 w-3 text-amber-500" />
              )}
              Thẻ chăm sóc học viên
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pt-0.5">
            {student.careTags.map((tag, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border font-medium transition-colors ${getCareTagBadgeStyle(
                  tag.category
                )}`}
              >
                <span className="font-bold mr-1">{tag.code}:</span>
                <span className="truncate">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
