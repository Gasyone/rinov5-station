'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { CareTagHoverCard } from '@/components/shared'
import { formatFullStaffName } from './operationsAlertHelpers'
import type { CareInteractionLog } from '@/mocks/careAlerts'

interface HistoryLogCardItemProps {
  log: CareInteractionLog
  topic?: string
  recipient?: string
  cleanNotes: string
  staffRole?: 'CS' | 'GV'
  staffName?: string
  date?: string
  channel?: string
}

export function HistoryLogCardItem({
  log,
  topic,
  recipient,
  cleanNotes,
  staffRole = 'CS',
  staffName,
  date,
  channel,
}: HistoryLogCardItemProps) {
  const [showMissedCalls, setShowMissedCalls] = useState(false)

  const effectiveStaffName = formatFullStaffName(staffName || log.staffName || 'Ngọc Mai')
  const effectiveDate = date || log.date || '2026-07-04'
  const isGV =
    staffRole === 'GV' ||
    effectiveStaffName.toLowerCase().includes('hoàng thị mai') ||
    effectiveStaffName.toLowerCase().includes('nguyễn huy hoàng') ||
    effectiveStaffName.toLowerCase().includes('gv')

  // Resolve contact channel
  let effectiveChannel = channel || ''
  if (!effectiveChannel) {
    if (log.audioDuration || log.callConfirmation === 'Đã gọi' || log.callConfirmation === 'KNM') {
      effectiveChannel = 'Cuộc gọi'
    } else if (log.callConfirmation === 'Đã nhắn Zalo' || cleanNotes.toLowerCase().includes('zalo')) {
      effectiveChannel = 'Nhắn tin Zalo'
    } else if (
      log.callConfirmation === 'Đã gặp trực tiếp' ||
      cleanNotes.toLowerCase().includes('trực tiếp') ||
      cleanNotes.toLowerCase().includes('lớp') ||
      cleanNotes.toLowerCase().includes('bổ trợ') ||
      cleanNotes.toLowerCase().includes('kèm') ||
      isGV
    ) {
      effectiveChannel = 'Gặp trực tiếp'
    } else {
      effectiveChannel = 'Cuộc gọi'
    }
  }

  // Resolve full recipient name with relationship
  let effectiveRecipient = recipient || ''
  if (
    !effectiveRecipient ||
    effectiveRecipient === 'Phụ huynh' ||
    effectiveRecipient === 'Mẹ' ||
    effectiveRecipient === 'Bố'
  ) {
    effectiveRecipient = isGV ? 'Châu Nguyễn Gia Bảo (Học viên)' : 'Châu Mẹ Nguyễn Thị Mai (Mẹ)'
  } else if (
    effectiveRecipient === 'Học viên' ||
    effectiveRecipient === 'Học sinh' ||
    effectiveRecipient === 'Con'
  ) {
    effectiveRecipient = 'Châu Nguyễn Gia Bảo (Học viên)'
  }

  return (
    <div className="space-y-1 text-xs text-left">
      {/* Header Row: CS/GV badge + Staff Name + Channel: Recipient + Date (left) & Care Tag Pill (right) */}
      <div className="flex items-center justify-between gap-2 flex-wrap py-0.5 px-0.5 select-none">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span
            className={
              isGV
                ? 'px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-950 dark:text-purple-300'
                : 'px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950 dark:text-sky-300'
            }
          >
            {isGV ? 'GV' : 'CS'}
          </span>
          <span className="font-bold text-foreground text-xs">{effectiveStaffName}</span>
          <span className="text-[11px] text-muted-foreground font-normal truncate">
            • {effectiveChannel}: {effectiveRecipient}
          </span>
          <span className="font-mono text-[10.5px] font-semibold text-muted-foreground bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded-md shrink-0">
            {effectiveDate}
          </span>
        </div>

        {/* Care Tag Badge on Far Right of Header Row */}
        {topic && (
          <div className="shrink-0">
            <CareTagHoverCard code={topic} label={topic} description="Thẻ tương tác chăm sóc" />
          </div>
        )}
      </div>

      {/* Card Content Box */}
      <div className="rounded-lg border border-sky-200/70 dark:border-sky-900/50 bg-sky-50/30 dark:bg-sky-950/20 p-1.5 space-y-1 text-xs text-left shadow-2xs">
        {/* Continuous Stream: Audio (if any) + Notes + Parent Feedback Label & Text */}
        <div className="text-xs text-foreground/90 font-normal leading-relaxed">
          {log.audioDuration && (
            <span className="inline-flex items-center align-middle mr-2">
              <AudioPlayButton duration={log.audioDuration} />
            </span>
          )}
          <span className="align-middle">{cleanNotes}</span>
          {log.parentOpinion && (
            <span className="align-middle">
              {' '}
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                • Phụ huynh phản hồi:
              </span>{' '}
              <span className="italic font-medium text-emerald-700 dark:text-emerald-400">
                “{log.parentOpinion}”
              </span>
            </span>
          )}
        </div>

        {/* Missed Calls Accordion (No border/bg, light red, italic, underline) */}
        {log.missedCallsList && log.missedCallsList.length > 0 && (
          <div className="pt-0.5 select-none">
            <button
              type="button"
              onClick={() => setShowMissedCalls(!showMissedCalls)}
              className="w-full text-left text-[11px] font-normal italic text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
            >
              <span className="flex items-center gap-1.5 underline decoration-rose-300">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 no-underline" />
                <span>
                  Lịch sử ({log.missedCallsList.length}) lần gọi nhỡ / không liên hệ được trước đó
                </span>
              </span>
              {showMissedCalls ? (
                <ChevronUp className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              )}
            </button>

            {showMissedCalls && (
              <div className="mt-1.5 pl-2.5 border-l-2 border-rose-200 dark:border-rose-800 space-y-1 text-[10.5px] text-muted-foreground font-medium animate-in fade-in-50 duration-150">
                {log.missedCallsList.map((mCall, mIdx) => (
                  <div key={mIdx} className="p-1 rounded-md hover:bg-rose-50/50 space-y-0.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-[11px]">
                        • {mCall.time}: {mCall.status}
                      </span>
                      {mCall.nextCallback && (
                        <span className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-800 shrink-0">
                          📅 Hẹn gọi lại: {mCall.nextCallback}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/90 italic pl-2 leading-relaxed w-full">
                      * Ghi chú: {mCall.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
