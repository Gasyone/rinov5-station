'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp, History, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFullStaffName, getCareNatureAbbrev } from './operationsAlertHelpers'
import { formatCareHistoryTime } from './studentCareDetailHelpers'
import { AudioPlayButton } from './AudioPlayButton'
import { StatusBadge } from '@/components/shared'

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
  status: 'completed' | 'overdue' | 'future' | 'in_progress' | 'failed'
  statusLabel?: string
  date: string
  subtext: string
  failureReason?: string
  linkedOrder?: {
    orderCode: string
    packageName: string
    totalPaidAmount?: number
    amountText?: string
    paymentStatus?: 'paid' | 'partial' | 'unpaid' | 'pending_payment'
    paymentStatusText?: string
  }
  historyLogs?: MilestoneHistoryLog[]
}

interface CareJourneyMilestoneCardProps {
  item: RoadmapMilestoneItem
  index: number
}

export function getMilestoneTagAbbrev(code: string): { label: string; badgeClass: string; textColor: string } {
  const nature = getCareNatureAbbrev(code)
  switch (nature) {
    case 'CĐB':
      return {
        label: 'CĐB',
        badgeClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
        textColor: 'text-red-700 dark:text-red-400',
      }
    case 'CGH':
      return {
        label: 'CGH',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
        textColor: 'text-purple-700 dark:text-purple-400',
      }
    case 'CĐK':
      return {
        label: 'CĐK',
        badgeClass: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900',
        textColor: 'text-violet-700 dark:text-violet-400',
      }
    case 'CBH':
      return {
        label: 'CBH',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900',
        textColor: 'text-sky-700 dark:text-sky-400',
      }
    case 'CYC':
    default:
      return {
        label: 'CYC',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
        textColor: 'text-amber-700 dark:text-amber-400',
      }
  }
}

export const CareJourneyMilestoneCard: React.FC<CareJourneyMilestoneCardProps> = ({
  item,
  index,
}) => {
  // Tab nội dung luôn THƯỜNG ĐÓNG by default (empty initial state)
  const [openCardKeys, setOpenCardKeys] = useState<Record<number, boolean>>({})
  const [openMissedCalls, setOpenMissedCalls] = useState<Record<number, boolean>>({})
  const milestoneTag = getMilestoneTagAbbrev(item.code)

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
        {item.status === 'completed' || item.status === 'failed' ? (
          <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            <Check className="h-3 w-3" />
          </div>
        ) : item.status === 'overdue' ? (
          <div className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold animate-pulse shadow-2xs">
            !
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center text-xs font-semibold shadow-2xs">
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
          item.status === 'failed' && 'border-border/60 hover:border-rose-300 dark:hover:border-rose-800',
          item.status === 'future' && 'border-border/50 bg-muted/10'
        )}
      >
        {/* Row 1: Unified Title + Description & Date (at end) + Status Badge */}
        <div className="flex items-center justify-between gap-2 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <span
              className={cn(
                'text-xs 2xl:text-[12.5px] font-bold font-mono px-1.5 py-0.5 rounded border shrink-0 whitespace-nowrap',
                milestoneTag.badgeClass
              )}
            >
              {milestoneTag.label}
            </span>
            <h4
              className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs 2xl:text-[13.5px] truncate min-w-0 shrink"
              title={item.title}
            >
              {item.title}
            </h4>
            {item.subtext && (
              <span
                className="text-xs 2xl:text-[13px] text-muted-foreground font-normal truncate min-w-0 shrink"
                title={item.subtext}
              >
                • {item.subtext}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap text-xs 2xl:text-[13px]">
            {item.date && (
              <span className="text-xs 2xl:text-[13px] text-muted-foreground font-normal whitespace-nowrap">
                Hạn: {item.date}
              </span>
            )}

            {item.status === 'completed' && (
              <span className="text-xs 2xl:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                ✓ Hoàn thành
              </span>
            )}

            {item.status === 'overdue' && (
              <span className="text-xs 2xl:text-[13px] font-semibold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                Quá hạn
              </span>
            )}

            {item.status === 'failed' && (
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <span className="text-xs 2xl:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  ✓ Hoàn thành
                </span>
                <StatusBadge
                  status="that_bai"
                  label={item.statusLabel || 'Thất bại'}
                  className="text-xs 2xl:text-[12.5px] px-2 py-0 h-5 2xl:h-5.5 font-semibold shrink-0 whitespace-nowrap"
                />
              </div>
            )}

            {item.status === 'future' && (
              <span className="text-xs 2xl:text-[13px] text-muted-foreground/70 whitespace-nowrap">
                Mốc tương lai
              </span>
            )}
          </div>
        </div>

        {/* Thẻ tái phí liên kết (Đơn hàng liên kết) */}
        {item.linkedOrder && item.linkedOrder.orderCode && (
          <div className="mt-1 flex items-center gap-1.5 text-xs 2xl:text-[13px] flex-wrap bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 rounded-md px-2 py-1 select-none">
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-foreground">Đơn hàng liên kết:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {item.linkedOrder.orderCode}
            </span>
            <span>-</span>
            <span className="text-muted-foreground">{item.linkedOrder.packageName}</span>
            {item.linkedOrder.amountText && (
              <>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {item.linkedOrder.amountText}
                </span>
              </>
            )}
            {item.linkedOrder.paymentStatusText && (
              <>
                <span>•</span>
                <StatusBadge
                  status={item.linkedOrder.paymentStatus || 'paid'}
                  label={item.linkedOrder.paymentStatusText || 'Đã thanh toán'}
                  className="text-xs 2xl:text-[12px] px-1.5 py-0 h-4 2xl:h-4.5 font-semibold shrink-0"
                />
              </>
            )}
          </div>
        )}

        {/* Row 3: Phụ trách (Bên dưới là phụ trách) */}
        {(!item.historyLogs || item.historyLogs.length === 0) && (
          <div className="pt-0.5 flex items-center justify-between gap-1 text-xs 2xl:text-[13px] text-muted-foreground min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-xs font-semibold border shrink-0',
                  item.roleOwner.includes('GV')
                    ? 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                )}
              >
                {item.roleOwner.includes('GV') ? 'GV' : 'CS'}
              </span>
              <span className="font-medium text-foreground text-xs 2xl:text-[13px] shrink-0 whitespace-nowrap">
                {item.roleOwner.includes('GV') ? 'Hoàng Thị Mai' : 'Lê Thị Lan'}
              </span>
              <span className="text-muted-foreground/70 italic truncate min-w-0">• Chưa thực hiện chăm sóc</span>
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

              const timeInfo = formatCareHistoryTime(logItem.date)

              return (
                <div key={hIdx} className="flex items-start gap-1.5 text-xs 2xl:text-[13px] text-left">
                  {/* GV / CS ở ngoài (bên trái) dạng bo tròn, không in đậm */}
                  <div className="shrink-0 pt-0.5">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center h-5 w-5 2xl:h-5.5 2xl:w-5.5 rounded-full text-xs 2xl:text-[12.5px] font-medium select-none',
                        isTeacher
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                      )}
                    >
                      {isTeacher ? 'GV' : 'CS'}
                    </span>
                  </div>

                  {/* Cột chính: Bắt đầu từ Tên người chăm sóc, và Nội dung chăm sóc thụt lùi vào thẳng hàng */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Log Header Row */}
                    <div
                      className="flex items-center justify-between gap-1.5 py-0.5 px-0.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer select-none min-w-0 overflow-hidden"
                      onClick={() => toggleLogCard(hIdx)}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                        <span className="font-normal text-foreground text-xs 2xl:text-[13px] shrink-0 whitespace-nowrap">{cleanStaff}</span>
                        <span
                          className="text-muted-foreground text-xs 2xl:text-[13px] font-normal truncate min-w-0 shrink"
                          title={`${logItem.channel} ${isTeacher ? 'Châu Nguyễn Gia Bảo (Học viên)' : 'Châu Mẹ Nguyễn Thị Mai (Mẹ)'}`}
                        >
                          • {logItem.channel.startsWith('Cuộc gọi') ? 'Đã gọi' : logItem.channel.startsWith('Zalo') ? 'Đã nhắn Zalo' : logItem.channel} <span className="text-foreground font-normal">{isTeacher ? 'Châu Nguyễn Gia Bảo (Học viên)' : 'Châu Mẹ Nguyễn Thị Mai (Mẹ)'}</span>
                        </span>
                        <span
                          className="text-xs 2xl:text-[12.5px] text-muted-foreground font-normal shrink-0 whitespace-nowrap cursor-default"
                          title={timeInfo.full}
                        >
                          • {timeInfo.display}
                        </span>
                      </div>

                    <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
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

                  {/* Collapsible Inner Card (CLOSED BY DEFAULT) - Đóng khung */}
                  {isOpen && (
                    <div className="rounded-lg border border-border/70 bg-muted/20 p-2 space-y-1 text-xs 2xl:text-[13px] text-left animate-in fade-in-50 duration-150">

                      {/* Continuous Stream: Audio + Note + Parent Feedback Label & Text */}
                      <div className="text-xs 2xl:text-[13px] text-foreground/90 leading-relaxed font-normal">
                        {isCall && (
                          <span className="inline-flex items-center align-middle mr-2">
                            <AudioPlayButton duration={hIdx % 2 === 0 ? '02:45' : '01:50'} />
                          </span>
                        )}
                        <span className="align-middle">{logItem.note}</span>
                        {logItem.quote && (
                          <span className="align-middle">
                            {' '}
                            <span className="text-emerald-800 dark:text-emerald-300 font-normal">
                              • Phụ huynh phản hồi:
                            </span>{' '}
                            <span className="italic font-normal text-emerald-700 dark:text-emerald-400">
                              {logItem.quote}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Previous Care History Accordion */}
                      {isCall && (
                        <div className="pt-0.5 select-none">
                          <button
                            type="button"
                            onClick={() => toggleMissedCall(hIdx)}
                            className="w-full text-left text-xs 2xl:text-[12.5px] font-normal italic text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
                          >
                            <span className="flex items-center gap-1.5 underline decoration-sky-300">
                              <History className="h-3.5 w-3.5 text-sky-500 shrink-0 no-underline" />
                              <span>Lịch sử (1) lần ghi nhận chăm sóc trước đó</span>
                            </span>
                            {openMissedCalls[hIdx] ? (
                              <ChevronUp className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                            )}
                          </button>

                          {openMissedCalls[hIdx] && (
                            <div className="mt-1.5 space-y-2 text-xs 2xl:text-[12.5px] text-muted-foreground font-normal animate-in fade-in-50 duration-150 pl-1">
                              <div className="space-y-1 pt-1 border-t border-border/40 first:border-t-0 first:pt-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                    <span className="font-normal text-foreground text-xs 2xl:text-[12.5px] shrink-0">
                                      {cleanStaff}
                                    </span>
                                    <span className="text-xs 2xl:text-[12.5px] text-muted-foreground font-normal truncate">
                                      • Gọi KNM - <span className="text-foreground font-normal">Châu Mẹ Nguyễn Thị Mai (Mẹ)</span>
                                    </span>
                                    <span className="text-xs 2xl:text-[12.5px] text-muted-foreground font-normal shrink-0">
                                      • {logItem.date.split(' ')[0]} 09:15
                                    </span>
                                  </div>
                                  <span className="text-xs 2xl:text-[12.5px] font-normal text-muted-foreground shrink-0">
                                    📅 Hẹn gọi lại: {logItem.date.split(' ')[0]} 14:00
                                  </span>
                                </div>
                                <div className="text-xs 2xl:text-[12.5px] text-foreground/90 leading-relaxed font-normal pl-2">
                                  <span className="inline-flex items-center align-middle mr-2">
                                    <AudioPlayButton duration="01:10" />
                                  </span>
                                  <span className="align-middle text-muted-foreground/90">
                                    Chuông reo 5 tiếng phụ huynh không nghe máy
                                  </span>
                                  {' '}
                                  <span className="align-middle text-emerald-800 dark:text-emerald-300 font-normal">
                                    • Phụ huynh phản hồi:
                                  </span>{' '}
                                  <span className="align-middle italic font-normal text-emerald-700 dark:text-emerald-400">
                                    “Chưa nghe máy (thuê bao bận cuộc gọi khác)”
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
