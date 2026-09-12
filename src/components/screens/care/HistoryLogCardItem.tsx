'use client'

import { useState } from 'react'
import { History, ChevronDown, ChevronUp, ShoppingBag, CheckCircle } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { CareTagHoverCard, PersonnelHoverCard } from '@/components/shared'
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
  subject?: string
  showSubjectBadge?: boolean
  linkedOrder?: {
    orderCode: string
    packageName: string
    totalPaidAmount?: number
    amountText?: string
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
  subject: _subject,
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
      {/* Header Row: CS/GV badge + Subject (TA/TO/CH if enabled) + Staff Name + Channel: Recipient + Date (left) & Care Tag Pill (right) */}
      <div className="flex items-center justify-between gap-2 flex-wrap py-0.5 px-0.5 select-none">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span
            className={
              isGV
                ? 'text-xs font-extrabold text-purple-700 dark:text-purple-400 shrink-0'
                : 'text-xs font-extrabold text-sky-700 dark:text-sky-400 shrink-0'
            }
          >
            {isGV ? 'GV' : 'CS'}
          </span>
          
          <PersonnelHoverCard person={getStaffPerson(effectiveStaffName, isGV)}>
            <span className="font-bold text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
              {effectiveStaffName}
            </span>
          </PersonnelHoverCard>

          <span className="text-xs text-muted-foreground font-normal truncate">
            • {effectiveChannel} · Người nhận: <span className="text-foreground font-medium">{effectiveRecipient}</span>
          </span>
          <span className="font-mono text-[10.5px] font-semibold text-muted-foreground bg-zinc-100/70 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded-md shrink-0">
            {effectiveDate}
          </span>
        </div>

        {/* Care Tag Badge on Far Right of Header Row - CSTP đứng độc lập */}
        {topic && (
          <div className="shrink-0">
            {topic === 'CSTP' || topic.includes('CSTP') ? (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 shadow-3xs">
                <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>CSTP • Tái phí</span>
              </span>
            ) : (
              <CareTagHoverCard code={topic} label={topic} description="Thẻ tương tác chăm sóc" />
            )}
          </div>
        )}
      </div>

      {/* Card Content Box */}
      <div className="rounded-lg border border-slate-200/60 dark:border-zinc-800/60 bg-slate-50/30 dark:bg-zinc-900/20 p-2 space-y-1 text-xs text-left">
        {/* Continuous Stream: Audio (if any) + Notes + Parent Feedback Label & Text */}
        <div className="text-xs text-foreground/90 font-normal leading-relaxed">
          {log.audioDuration && (
            <span className="inline-flex items-center align-middle mr-2">
              <AudioPlayButton duration={log.audioDuration} />
            </span>
          )}
          <span className="align-middle">{cleanNotes}</span>
          {effectiveParentOpinion && (
            <span className="align-middle">
              {' '}
              <span className="text-emerald-800 dark:text-emerald-300 font-normal">
                • Phụ huynh phản hồi:
              </span>{' '}
              <span className="italic font-normal text-emerald-700 dark:text-emerald-400">
                “{effectiveParentOpinion}”
              </span>
            </span>
          )}
        </div>

        {/* Đơn hàng liên kết trong Lịch sử chăm sóc: chỉ để icon và text, không viền, không nền xanh */}
        {effectiveLinkedOrder && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs flex-wrap text-muted-foreground">
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
            {effectiveLinkedOrder.amountText && (
              <>
                <span>•</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  TT: {effectiveLinkedOrder.amountText}
                </span>
              </>
            )}
          </div>
        )}

        {/* Previous Care Records Accordion */}
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
              <div className="mt-1.5 pl-2.5 border-l-2 border-sky-200 dark:border-sky-800 space-y-1.5 text-[10.5px] text-muted-foreground font-medium animate-in fade-in-50 duration-150">
                {log.missedCallsList.map((mCall, mIdx) => (
                  <div key={mIdx} className="p-1 rounded-md hover:bg-sky-50/50 dark:hover:bg-sky-950/30 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-normal text-foreground text-xs">
                          • {mCall.time}: {mCall.status}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs font-medium text-foreground">
                          {isGV ? 'GV' : 'CS'}: <span className="font-semibold">{effectiveStaffName}</span>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          Người nhận: <span className="text-foreground font-medium">{effectiveRecipient}</span>
                        </span>
                      </div>
                      {mCall.nextCallback && (
                        <span className="text-xs font-medium text-sky-700 dark:text-sky-400 shrink-0">
                          📅 Hẹn gọi lại: {mCall.nextCallback}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-foreground/90 leading-relaxed font-normal pl-2">
                      <span className="inline-flex items-center align-middle mr-2">
                        <AudioPlayButton duration={mCall.audioDuration || '01:15'} />
                      </span>
                      <span className="align-middle text-muted-foreground/90">
                        {mCall.note}
                      </span>
                      {' '}
                      <span className="align-middle text-emerald-800 dark:text-emerald-300 font-normal">
                        • Phụ huynh phản hồi:
                      </span>{' '}
                      <span className="align-middle italic font-normal text-emerald-700 dark:text-emerald-400">
                        “{mCall.parentOpinion || 'Phụ huynh chưa tiện nghe máy, hẹn gọi lại sau.'}”
                      </span>
                    </div>
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
