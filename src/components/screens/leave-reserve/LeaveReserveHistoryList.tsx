'use client'

import { useMemo } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'
import { STATUS_LABELS } from './leaveReserveTypes'
import { cn } from '@/lib/utils'

interface LeaveReserveHistoryListProps {
  requests: LeaveReserveRequest[]
  studentId?: string
  studentName?: string
}

export function LeaveReserveHistoryList({
  requests,
  studentId,
  studentName,
}: LeaveReserveHistoryListProps) {
  const history = useMemo(() => {
    if (!studentId && !studentName) return []
    return requests
      .filter(
        (r) =>
          r.type === 'off' &&
          ((studentId && r.studentId === studentId) || (studentName && r.studentName === studentName))
      )
      .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
  }, [requests, studentId, studentName])

  // Helper format date display like CN, 16/11/2025
  const formatLeaveDateDisplay = (dateStr: string) => {
    if (!dateStr) return '---'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    const dayName = days[d.getDay()] || ''
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dayName}, ${dd}/${mm}/${yyyy}`
  }

  return (
    <div className="space-y-2 pt-2 border-t border-border/70">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <span>Lịch sử nghỉ phép</span>
          {history.length > 0 && (
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground border">
              {history.length}
            </span>
          )}
        </h4>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-4 bg-muted/20 rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
          Không có dữ liệu
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
          {history.map((item) => {
            const statusLabel = STATUS_LABELS[item.status] || item.status
            const dateDisplay = formatLeaveDateDisplay(item.startDate)

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted/30 transition-colors text-xs gap-2"
              >
                {/* Left: Code link + Date Badge + Time */}
                <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer text-xs">
                    {item.id}
                  </span>

                  {/* Date Pill (như ảnh: màu cam/đỏ nhạt) */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {dateDisplay}
                  </span>

                  {/* Time slot */}
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                    <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                    {item.className?.includes('19:30') ? '19:30 - 21:30' : '15:30 - 17:30'}
                  </span>
                </div>

                {/* Right: Status badge */}
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                      getStatusBadgeClass(item.status)
                    )}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
