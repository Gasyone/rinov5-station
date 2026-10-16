'use client'

import { useState, useMemo } from 'react'
import { History, ChevronDown, ChevronUp, ShoppingBag, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AudioPlayButton } from './AudioPlayButton'
import { CareTagHoverCard, PersonnelHoverCard, StatusBadge } from '@/components/shared'
import { formatFullStaffName, getCareNatureAbbrev } from './operationsAlertHelpers'
import { formatCareHistoryTime } from './studentCareDetailHelpers'
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
  subject?: string
  showSubjectBadge?: boolean
  linkedOrder?: {
    orderCode: string
    packageName: string
    totalPaidAmount?: number
    amountText?: string
    paymentStatus?: 'paid' | 'partial' | 'unpaid' | 'pending_payment'
    paymentStatusText?: string
  }
}

function getStaffPerson(name: string, isGV: boolean) {
  const isHTM = name.toLowerCase().includes('hoàng thị mai')
  const isHH = name.toLowerCase().includes('nguyễn huy hoàng')
  return {
    id: isHTM ? 'EMP-HTM' : isHH ? 'EMP-NHH' : `EMP-${name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
    name: name,
    role: isGV ? 'Giáo viên chính' : 'Chuyên viên CSKH',
    phone: isHTM ? '0901234567' : isHH ? '0987654321' : '0912345678',
    email: isHTM ? 'hongthmai@rinoedu.com' : isHH ? 'huyhoang@rinoedu.com' : 'cskh@rinoedu.com',
    avatar: isHTM 
      ? 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangThiMai' 
      : isHH 
      ? 'https://api.dicebear.com/7.x/adventurer/svg?seed=HuyHoang'
      : 'https://api.dicebear.com/7.x/adventurer/svg?seed=NgocMai'
  }
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
  linkedOrder,
}: HistoryLogCardItemProps) {
  const [showMissedCalls, setShowMissedCalls] = useState(false)
  const [prevLogId, setPrevLogId] = useState(log.id)

  if (log.id !== prevLogId) {
    setPrevLogId(log.id)
    setShowMissedCalls(false)
  }

  const effectiveStaffName = formatFullStaffName(staffName || log.staffName || 'Ngọc Mai')
  const effectiveDate = date || log.date || '2026-07-04'
  const effectiveLinkedOrder = linkedOrder || log.linkedOrder
  const effectiveParentOpinion =
    log.parentOpinion ||
    (() => {
      const m = (log.notes || '').match(/\[Ý kiến PH:\s*([^\]]+)\]/i)
      return m ? m[1].trim() : undefined
    })()
  const isGV =
    staffRole === 'GV' ||
    effectiveStaffName.toLowerCase().includes('hoàng thị mai') ||
    effectiveStaffName.toLowerCase().includes('nguyễn huy hoàng') ||
    effectiveStaffName.toLowerCase().includes('gv')

  // Parse outcome from notes if logged as unsuccessful
  const outcomeMatch = (log.notes || '').match(/\[Kết quả:\s*([^\]]+)\]/i)
  const loggedOutcome = outcomeMatch ? outcomeMatch[1].trim() : ''
  const isKnM = log.callConfirmation === 'KNM' || loggedOutcome.includes('Không nghe')
  const isMayBan = loggedOutcome.includes('Máy bận')
  const isVangMat = loggedOutcome.includes('Vắng mặt')
  const isChuaPhanHoi = loggedOutcome.includes('Chưa phản hồi') || (log.notes || '').includes('Chưa phản hồi')

  // Resolve action text (kênh + kết quả) nối liền với người nhận (Đề xuất 3)
  let actionText = 'Đã gọi'
  if (isKnM) {
    actionText = 'Gọi KNM'
  } else if (isMayBan) {
    actionText = 'Gọi máy bận'
  } else if (isVangMat) {
    actionText = 'Vắng mặt'
  } else if (isChuaPhanHoi) {
    actionText = 'Chưa phản hồi'
  } else if (
    log.callConfirmation === 'Đã nhắn Zalo' ||
    channel === 'Nhắn tin Zalo' ||
    cleanNotes.toLowerCase().includes('zalo')
  ) {
    actionText = 'Đã nhắn Zalo'
  } else if (
    log.callConfirmation === 'Đã gặp trực tiếp' ||
    channel === 'Gặp trực tiếp' ||
    cleanNotes.toLowerCase().includes('trực tiếp') ||
    cleanNotes.toLowerCase().includes('lớp') ||
    cleanNotes.toLowerCase().includes('bổ trợ') ||
    cleanNotes.toLowerCase().includes('kèm') ||
    isGV
  ) {
    actionText = 'Đã gặp trực tiếp'
  } else if (log.callConfirmation === 'Chưa gọi') {
    actionText = 'Chưa gọi'
  } else if (channel) {
    if (channel === 'Cuộc gọi' || channel === 'Đã gọi') actionText = 'Đã gọi'
    else if (channel.toLowerCase().includes('zalo')) actionText = 'Đã nhắn Zalo'
    else if (channel.toLowerCase().includes('trực tiếp')) actionText = 'Đã gặp trực tiếp'
    else actionText = channel
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

  const timeInfo = formatCareHistoryTime(effectiveDate)

  const logReason = useMemo(() => {
    const rawNotes = log.notes || ''
    const match = rawNotes.match(/\[Lý do:\s*([^\]]+)\]/i)
    if (match) return match[1].trim()
    const prefixMatch = rawNotes.match(/Lý do:\s*([^.\n]+)/i)
    if (prefixMatch) return prefixMatch[1].trim()
    return null
  }, [log.notes])

  const isFailedLog = useMemo(() => {
    const rawNotes = (log.notes || '').toLowerCase()
    return Boolean(logReason) || rawNotes.includes('thất bại') || rawNotes.includes('dừng học')
  }, [log.notes, logReason])

  return (
    <div className="flex items-start gap-2.5 text-xs 2xl:text-[13px] text-left">
      {/* Đề xuất 2: GV / CS ở ngoài (bên trái) dạng bo tròn, bỏ in đậm */}
      <div className="shrink-0 pt-0.5">
        <span
          className={cn(
            'inline-flex items-center justify-center h-5.5 w-5.5 2xl:h-6 2xl:w-6 rounded-full text-xs 2xl:text-[12.5px] font-medium select-none',
            isGV
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
              : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
          )}
        >
          {isGV ? 'GV' : 'CS'}
        </span>
      </div>

      {/* Cột chính: Bắt đầu từ Tên người chăm sóc, và Nội dung chăm sóc thụt lùi vào thẳng hàng với Tên người chăm sóc */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Header row: Tên người gọi • Kênh/kết quả + Tên người nhận • Thời gian */}
        <div className="flex items-center justify-between gap-1.5 min-w-0 overflow-hidden py-0.5 select-none">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <PersonnelHoverCard person={getStaffPerson(effectiveStaffName, isGV)}>
              <span className="font-medium text-foreground text-xs 2xl:text-[13px] cursor-pointer hover:underline hover:text-primary transition-colors shrink-0 whitespace-nowrap">
                {effectiveStaffName}
              </span>
            </PersonnelHoverCard>

            <span
              className="text-xs 2xl:text-[13px] text-muted-foreground font-normal truncate min-w-0 shrink"
              title={`${actionText} ${effectiveRecipient}`}
            >
              • {actionText} <span className="text-foreground font-normal">{effectiveRecipient}</span>
            </span>

            {isKnM && (
              <span className="px-1.5 py-0.2 rounded text-[10.5px] 2xl:text-[11.5px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 shrink-0 whitespace-nowrap">
                Không nghe máy
              </span>
            )}
            {isMayBan && (
              <span className="px-1.5 py-0.2 rounded text-[10.5px] 2xl:text-[11.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60 shrink-0 whitespace-nowrap">
                Máy bận
              </span>
            )}
            {isVangMat && (
              <span className="px-1.5 py-0.2 rounded text-[10.5px] 2xl:text-[11.5px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 shrink-0 whitespace-nowrap">
                Vắng mặt
              </span>
            )}

            <span
              className="text-xs 2xl:text-[13px] text-muted-foreground font-normal shrink-0 whitespace-nowrap cursor-default"
              title={timeInfo.full}
            >
              • {timeInfo.display}
            </span>
          </div>

          {/* Care Tag Badge on Far Right of Header Row - CGH đứng độc lập */}
          {topic && (
            <div className="shrink-0 whitespace-nowrap">
              {topic === 'CGH' || topic === 'CSTP' || topic === 'CTP' || topic.includes('CGH') || topic.includes('CSTP') || topic.includes('CTP') ? (
                isFailedLog ? (
                  <span className="inline-flex items-center gap-1 text-xs 2xl:text-[12.5px] font-medium px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 whitespace-nowrap">
                    <XCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                    <span>CGH</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs 2xl:text-[12.5px] font-medium px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                    <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>CGH • Tái phí</span>
                  </span>
                )
              ) : (
                <CareTagHoverCard code={topic} label={getCareNatureAbbrev(topic)} description="Thẻ tương tác chăm sóc" />
              )}
            </div>
          )}
        </div>

        {/* Khung nội dung chăm sóc (Đóng khung, bỏ đường line) */}
        <div className="rounded-lg border border-border/60 bg-muted/20 dark:bg-zinc-900/30 p-2 space-y-1 text-xs 2xl:text-[13px] text-left">
          {/* Dòng lý do (nếu có) */}
          {logReason && (
            <div className="text-xs 2xl:text-[13px] leading-relaxed text-foreground/90 font-normal">
              <span className="text-muted-foreground font-medium">Lý do: </span>
              <span className="text-foreground font-medium">{logReason}</span>
            </div>
          )}

          {/* Continuous Stream: Audio (nếu có) + Ghi chú + Phụ huynh phản hồi trên cùng 1 dòng */}
          <div className="text-xs 2xl:text-[13px] text-foreground/90 font-normal leading-relaxed">
            {log.audioDuration && (
              <span className="inline-flex items-center align-middle mr-2">
                <AudioPlayButton duration={log.audioDuration} />
              </span>
            )}
            <span className="align-middle">{cleanNotes}</span>
            {effectiveParentOpinion && (
              <span className="align-middle">
                {' '}
                <span className="text-muted-foreground font-normal">
                  • Phụ huynh phản hồi:
                </span>{' '}
                <span className="italic font-normal text-foreground/80">
                  “{effectiveParentOpinion}”
                </span>
              </span>
            )}
          </div>

          {/* Đơn hàng liên kết trong Lịch sử chăm sóc */}
          {effectiveLinkedOrder ? (
            <div className="mt-1 flex items-center gap-1.5 text-xs flex-wrap text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium text-muted-foreground">Đơn hàng liên kết:</span>
              <a
                href={`/quote/${effectiveLinkedOrder.orderCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                title="Xem chi tiết đơn hàng báo giá"
              >
                {effectiveLinkedOrder.orderCode}
              </a>
              <span>•</span>
              <span className="font-medium text-foreground truncate max-w-[220px]" title={effectiveLinkedOrder.packageName}>
                {effectiveLinkedOrder.packageName}
              </span>
              {(effectiveLinkedOrder.paymentStatusText || effectiveLinkedOrder.amountText) && (
                <>
                  <span>•</span>
                  <StatusBadge
                    status={effectiveLinkedOrder.paymentStatus || 'paid'}
                    label={effectiveLinkedOrder.paymentStatusText || 'Đã thanh toán'}
                    className="text-xs px-1.5 py-0 h-4 font-semibold shrink-0"
                  />
                </>
              )}
            </div>
          ) : (topic === 'CSTP' || topic === 'CTP' || (log.notes || '').includes('[CSTP]')) && log.notes?.toLowerCase().includes('thất bại') ? (
            <div className="mt-1 flex items-center gap-1.5 text-xs flex-wrap text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <span className="font-medium text-muted-foreground">Đơn hàng liên kết:</span>
              <span className="text-muted-foreground/80 italic font-medium">Không liên kết</span>
            </div>
          ) : null}

          {/* Lịch sử ghi nhận chăm sóc trước đó (Accordion) */}
          {log.missedCallsList && log.missedCallsList.length > 0 && (
            <div className="pt-0.5 select-none">
              <button
                type="button"
                onClick={() => setShowMissedCalls(!showMissedCalls)}
                className="w-full text-left text-xs font-normal italic text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
              >
                <span className="flex items-center gap-1.5 underline decoration-sky-300">
                  <History className="h-3.5 w-3.5 text-sky-500 shrink-0 no-underline" />
                  <span>
                    Lịch sử ({log.missedCallsList.length}) lần ghi nhận chăm sóc trước đó
                  </span>
                </span>
                {showMissedCalls ? (
                  <ChevronUp className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                )}
              </button>

              {showMissedCalls && (
                <div className="mt-1.5 space-y-2 text-xs text-muted-foreground font-normal animate-in fade-in-50 duration-150 pl-1">
                  {log.missedCallsList.map((mCall, mIdx) => (
                    <div key={mIdx} className="space-y-1 pt-1 border-t border-border/40 first:border-t-0 first:pt-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <PersonnelHoverCard person={getStaffPerson(effectiveStaffName, isGV)}>
                            <span className="font-normal text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
                              {effectiveStaffName}
                            </span>
                          </PersonnelHoverCard>

                          <span className="text-xs text-muted-foreground font-normal truncate">
                            • {mCall.status} - <span className="text-foreground font-normal">{effectiveRecipient}</span>
                          </span>
                          <span className="text-xs text-muted-foreground font-normal shrink-0">
                            • {mCall.time}
                          </span>
                        </div>
                        {mCall.nextCallback && (
                          <span className="text-xs font-normal text-muted-foreground shrink-0">
                            📅 Hẹn gọi lại: {mCall.nextCallback}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-foreground/90 leading-relaxed font-normal pl-2">
                        {mCall.audioDuration && (
                          <span className="inline-flex items-center align-middle mr-2">
                            <AudioPlayButton duration={mCall.audioDuration} />
                          </span>
                        )}
                        <span className="align-middle text-muted-foreground/90">
                          {mCall.note}
                        </span>
                        {mCall.parentOpinion && (
                          <span>
                            {' '}
                            <span className="align-middle text-emerald-800 dark:text-emerald-300 font-normal">
                              • Phụ huynh phản hồi:
                            </span>{' '}
                            <span className="align-middle italic font-normal text-emerald-700 dark:text-emerald-400">
                              “{mCall.parentOpinion}”
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
