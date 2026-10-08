'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { GraduationCap } from 'lucide-react'
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
 * Styled compact and clean matching HistoricalPackagesPopover.
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
        className="w-[280px] p-2 rounded-xl border border-border/80 bg-popover shadow-xl space-y-1.5 z-50 text-left"
        align={align}
        side={side}
        sideOffset={6}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: text thường, không in hoa, không in đậm */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/50 px-1">
          <div className="flex items-center gap-1.5 text-xs font-normal text-foreground">
            <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Phân công giáo viên ({totalCount})</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-normal shrink-0">
            Lịch sử phân công
          </span>
        </div>

        {/* Danh sách giáo viên: 2 dòng (Tên trên, chi tiết dưới, nhãn bên phải) - style giống gói cũ, hết hạn */}
        <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
          {/* Giáo viên hiện tại */}
          {currentEntries.map((entry, idx) => (
            <div
              key={`current-${idx}`}
              className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-muted/50 border border-transparent"
              title={`${entry.name} - ${entry.role}${entry.phone ? ` • SĐT: ${entry.phone}` : ''}`}
            >
              {/* Cột trái: 2 dòng */}
              <div className="flex flex-col min-w-0 flex-1 pr-1">
                {/* Dòng 1: Tên giáo viên (text thường màu đen) */}
                <span className="text-xs font-normal text-foreground truncate leading-tight">
                  {entry.name}
                </span>
                {/* Dòng 2: Chi tiết vai trò, thời gian, SĐT (text thường màu nhạt) */}
                <span className="text-[11px] font-normal text-muted-foreground truncate leading-tight mt-0.5">
                  {entry.role}
                  {entry.startDate && ` • Từ ${entry.startDate}`}
                  {entry.phone && ` • ${entry.phone}`}
                </span>
              </div>

              {/* Cột phải: Nhãn Hiện tại viền thanh mảnh */}
              <div className="shrink-0 flex items-center gap-1">
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40">
                  Hiện tại
                </span>
              </div>
            </div>
          ))}

          {/* Dải phân cách nhẹ khi có cả hiện tại và quá khứ */}
          {currentEntries.length > 0 && pastEntries.length > 0 && (
            <div className="pt-1 pb-0.5 px-2 text-[10px] font-normal text-muted-foreground border-t border-border/40">
              Giáo viên trước đây
            </div>
          )}

          {/* Giáo viên trước đây */}
          {pastEntries.map((entry, idx) => (
            <div
              key={`past-${idx}`}
              className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-muted/50 border border-transparent"
              title={`${entry.name} (${entry.role})${entry.reason ? ` • Lý do: ${entry.reason}` : ''}`}
            >
              {/* Cột trái: 2 dòng */}
              <div className="flex flex-col min-w-0 flex-1 pr-1">
                {/* Dòng 1: Tên giáo viên */}
                <span className="text-xs font-normal text-foreground truncate leading-tight">
                  {entry.name}
                </span>
                {/* Dòng 2: Vai trò / Lý do */}
                <span className="text-[11px] font-normal text-muted-foreground truncate leading-tight mt-0.5">
                  {entry.role}
                  {entry.reason ? ` • ${entry.reason}` : ''}
                </span>
              </div>

              {/* Cột phải: Khoảng thời gian */}
              <div className="shrink-0 flex items-center gap-1">
                <span className="text-[9.5px] font-normal px-1.5 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-background font-mono">
                  {entry.startDate} ➔ {entry.endDate || 'Nay'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
