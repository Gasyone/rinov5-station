'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { AppAvatar } from './AppAvatar'
import type { TeacherHistoryEntry } from '@/mocks/classRecords'

interface TeacherHistoryPopoverProps {
  /** Trigger element — defaults to a Users icon button if not provided */
  trigger: React.ReactNode
  /** Teacher history entries — current + past */
  history: TeacherHistoryEntry[]
  /** Current teacher name (fallback if history is empty) */
  currentTeacher?: string
  /** Current teacher phone (fallback if history is empty) */
  currentTeacherPhone?: string
  /** Popover alignment */
  align?: 'start' | 'center' | 'end'
  /** Popover side */
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Unified popover showing current teacher(s) + teacher assignment history.
 * Does NOT include substitute teachers (dạy thay).
 *
 * Used by:
 * - ClassesTableRow (teacher column, list view)
 * - ClassCodeHoverCell (CARE screens)
 * - ClassTeacherHistoryPopover (standalone wrapper)
 *
 * @see docs/DESIGN_SYSTEM.md §3.4
 */
export function TeacherHistoryPopover({
  trigger,
  history,
  currentTeacher,
  currentTeacherPhone,
  align = 'start',
  side,
}: TeacherHistoryPopoverProps) {
  // Build effective list: use provided history, or fallback to currentTeacher
  const entries: TeacherHistoryEntry[] = history.length > 0
    ? history
    : currentTeacher
      ? [{ name: currentTeacher, role: 'Chủ nhiệm', startDate: '', phone: currentTeacherPhone, isCurrent: true }]
      : []

  const currentEntries = entries.filter((e) => e.isCurrent)
  const pastEntries = entries.filter((e) => !e.isCurrent)
  const totalCount = entries.length

  if (totalCount === 0) return <>{trigger}</>

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 z-50 shadow-lg border bg-popover text-popover-foreground"
        align={align}
        side={side}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Phân công Giáo viên
          </h4>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold">
            {totalCount} giáo viên
          </Badge>
        </div>

        <div className="p-2 space-y-1.5 max-h-[320px] overflow-y-auto">
          {/* Current teachers */}
          {currentEntries.map((entry, idx) => (
            <div
              key={`current-${idx}`}
              className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 space-y-0.5"
            >
              <div className="flex items-center gap-2">
                <AppAvatar name={entry.name} size="xs" shape="circle" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 truncate">
                      {entry.name}
                    </span>
                    <Badge className="bg-emerald-600 text-[8px] px-1 py-0 text-white font-bold shrink-0">
                      Hiện tại
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {entry.role}
                    {entry.startDate && <span className="font-mono ml-1">• Từ {entry.startDate}</span>}
                  </div>
                </div>
              </div>
              {entry.phone && (
                <p className="text-[10px] text-muted-foreground font-mono pl-7">
                  SĐT: {entry.phone}
                </p>
              )}
            </div>
          ))}

          {/* Divider between current and past */}
          {currentEntries.length > 0 && pastEntries.length > 0 && (
            <div className="flex items-center gap-2 px-1 py-0.5">
              <div className="flex-1 border-t border-border/50" />
              <span className="text-[9px] text-muted-foreground font-semibold uppercase">Lịch sử</span>
              <div className="flex-1 border-t border-border/50" />
            </div>
          )}

          {/* Past teachers */}
          {pastEntries.map((entry, idx) => (
            <div
              key={`past-${idx}`}
              className="p-2 rounded-lg bg-muted/30 border border-border/40 space-y-0.5"
            >
              <div className="flex items-center gap-2">
                <AppAvatar name={entry.name} size="xs" shape="circle" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-medium text-foreground truncate">
                      {entry.name} ({entry.role})
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono shrink-0">
                      {entry.startDate} ➔ {entry.endDate || 'Nay'}
                    </span>
                  </div>
                </div>
              </div>
              {entry.reason && (
                <p className="text-[10px] text-muted-foreground italic pl-7">
                  Lý do: {entry.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
