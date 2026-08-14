'use client'

import React, { useState } from 'react'
import { AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFullStaffName } from './operationsAlertHelpers'
import { AudioPlayButton } from './AudioPlayButton'

export interface MilestoneHistoryLog {
  date: string
  staffName: string
  channel: string
  note: string
  quote?: string
}

export interface RoadmapMilestoneItem {
  id: string
  code: string
  title: string
  roleOwner: 'CS PHỤ TRÁCH' | 'GV PHỤ TRÁCH' | 'SALE PHỤ TRÁCH'
  status: 'completed' | 'overdue' | 'future' | 'in_progress'
  date: string
  subtext: string
  historyLogs?: MilestoneHistoryLog[]
}

interface CareJourneyMilestoneCardProps {
  item: RoadmapMilestoneItem
  index: number
}

export const CareJourneyMilestoneCard: React.FC<CareJourneyMilestoneCardProps> = ({
  item,
  index,
}) => {
  // Tab nội dung luôn THƯỜNG ĐÓNG by default (empty initial state)
  const [openCardKeys, setOpenCardKeys] = useState<Record<number, boolean>>({})
  const [openMissedCalls, setOpenMissedCalls] = useState<Record<number, boolean>>({})

  const toggleLogCard = (hIdx: number) => {
    setOpenCardKeys((prev) => ({
      ...prev,
      [hIdx]: !prev[hIdx],
    }))
  }

  const toggleMissedCall = (hIdx: number) => {
    setOpenMissedCalls((prev) => ({
      ...prev,
      [hIdx]: !prev[hIdx],
    }))
  }

  return (
    <div className="relative group pt-1">
      {/* Left Timeline Node Icon - Perfectly centered on vertical line */}
      <div className="absolute -left-[18.5px] top-3.5 -translate-x-1/2 flex items-center justify-center z-10">
        {item.status === 'completed' ? (
          <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
            <Check className="h-3 w-3" />
          </div>
        ) : item.status === 'overdue' ? (
          <div className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold animate-pulse shadow-2xs">
            !
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center text-[10px] font-semibold shadow-2xs">
            {index + 1}
          </div>
        )}
      </div>

      {/* Main Milestone Container */}
      <div
        className={cn(
          'rounded-xl border p-3 space-y-1.5 transition-colors bg-card text-left shadow-none',
          item.status === 'completed' && 'border-border/60 hover:border-emerald-300 dark:hover:border-emerald-800',
          item.status === 'overdue' && 'border-rose-200 dark:border-rose-900/60 bg-rose-50/10 dark:bg-rose-950/10',
          item.status === 'future' && 'border-border/50 bg-muted/10'
        )}
      >
        {/* Row 1: Unified Title + Description & Date (at end) + Status Badge */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
            <h4 className="font-normal text-zinc-900 dark:text-zinc-100 text-xs shrink-0">
              {item.title}
            </h4>
            <span className="text-[11px] text-muted-foreground font-normal truncate">
              • {item.subtext}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.date && (
              <span className="text-[10.5px] font-mono font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
                Hạn: {item.date}
              </span>
            )}

            {item.status === 'completed' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Hoàn thành
              </span>
            )}

            {item.status === 'overdue' && (
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                Quá hạn
              </span>
            )}

            {item.status === 'future' && (
              <span className="text-[11px] text-muted-foreground/70">
                Mốc tương lai
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Phụ trách (Bên dưới là phụ trách) */}
        {(!item.historyLogs || item.historyLogs.length === 0) && (
          <div className="pt-0.5 flex items-center justify-between flex-wrap gap-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded text-[9.5px] font-semibold border',
                  item.roleOwner.includes('GV')
                    ? 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                )}
              >
                {item.roleOwner.includes('GV') ? 'GV' : 'CS'}
              </span>
              <span className="font-medium text-foreground text-[11px]">
                {item.roleOwner.includes('GV') ? 'Hoàng Thị Mai' : 'Lê Thị Lan'}
              </span>
              <span className="text-muted-foreground/70 italic">• Chưa thực hiện chăm sóc</span>
            </div>
          </div>
        )}

        {/* Row 4: History Logs List */}
        {item.historyLogs && item.historyLogs.length > 0 && (
          <div className="pt-1 space-y-1">
            {item.historyLogs.map((logItem, hIdx) => {
              const isTeacher =
                logItem.staffName.toLowerCase().includes('gv') ||
                logItem.staffName.toLowerCase().includes('giáo viên')
              const cleanStaff = formatFullStaffName(logItem.staffName)
                .replace(/^(GV\.|GV|CS)\s*/i, '')
                .replace(/\s*\((GV|CS)\)$/i, '')
              const isCall =
                logItem.channel.toLowerCase().includes('gọi') ||
                logItem.channel.toLowerCase().includes('cuộc gọi')
              const isOpen = Boolean(openCardKeys[hIdx])

              return (
                <div key={hIdx} className="space-y-1 text-xs text-left">
                  {/* Log Header Row */}
                  <div
                    className="flex items-center justify-between gap-1.5 py-0.5 px-1 rounded-md hover:bg-muted/50 transition-colors cursor-pointer select-none"
                    onClick={() => toggleLogCard(hIdx)}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[9.5px] font-semibold border shrink-0',
                          isTeacher
                            ? 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                        )}
                      >
                        {isTeacher ? 'GV' : 'CS'}
                      </span>
                      <span className="font-medium text-foreground text-[11px] shrink-0">{cleanStaff}</span>
                      <span className="text-muted-foreground text-[11px] font-normal truncate">
                        • {logItem.channel}
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-muted-foreground bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded-md shrink-0">
                        • {logItem.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLogCard(hIdx)
                        }}
                        className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title={isOpen ? 'Thu gọn nội dung' : 'Mở rộng nội dung'}
                      >
                        {isOpen ? (
                          <ChevronUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Inner Card (CLOSED BY DEFAULT) */}
                  {isOpen && (
                    <div className="rounded-lg border border-border bg-background p-1.5 space-y-1 text-xs text-left shadow-2xs animate-in fade-in-50 duration-150">

                      {/* Continuous Stream: Audio + Note + Parent Feedback Label & Text */}
                      <div className="text-xs text-foreground/90 leading-relaxed font-normal">
                        {isCall && (
                          <span className="inline-flex items-center align-middle mr-2">
                            <AudioPlayButton duration={hIdx % 2 === 0 ? '02:45' : '01:50'} />
                          </span>
                        )}
                        <span className="align-middle">{logItem.note}</span>
                        {logItem.quote && (
                          <span className="align-middle">
                            {' '}
                            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                              • Phụ huynh phản hồi:
                            </span>{' '}
                            <span className="italic font-medium text-emerald-700 dark:text-emerald-400">
                              {logItem.quote}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Missed Call History Accordion (Borderless link) */}
                      {isCall && (
                        <div className="pt-0.5 select-none">
                          <button
                            type="button"
                            onClick={() => toggleMissedCall(hIdx)}
                            className="w-full text-left text-[11px] font-normal italic text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
                          >
                            <span className="flex items-center gap-1.5 underline decoration-rose-300">
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 no-underline" />
                              <span>Lịch sử (1) lần gọi nhỡ / không liên hệ được trước đó</span>
                            </span>
                            {openMissedCalls[hIdx] ? (
                              <ChevronUp className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            )}
                          </button>

                          {openMissedCalls[hIdx] && (
                            <div className="mt-1.5 pl-3 border-l-2 border-rose-200 dark:border-rose-800 space-y-1 text-[10.5px] text-muted-foreground font-normal animate-in fade-in-50 duration-150">
                              <div className="p-1.5 rounded-md hover:bg-rose-50/40 transition-colors space-y-0.5">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="font-semibold text-foreground text-[11px]">
                                    • {logItem.date.split(' ')[0]} 09:15: Gọi KNM (Không nghe máy)
                                  </span>
                                  <span className="text-[9.5px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded border border-sky-200/60 dark:border-sky-800 shrink-0">
                                    📅 Hẹn gọi lại: {logItem.date.split(' ')[0]} 14:00
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-muted-foreground/90 italic pl-2 leading-relaxed w-full">
                                  * Ghi chú: Chuông reo 5 tiếng phụ huynh không nghe máy
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
