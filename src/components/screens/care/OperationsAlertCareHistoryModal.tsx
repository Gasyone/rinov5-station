'use client'

import React, { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, History, ShoppingBag } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { cn } from '@/lib/utils'
import { type StudentCareAlert } from '@/mocks/careAlerts'
import {
  getHistoryLogsForStudent,
  getRescheduleInfo,
  isInProgress,
  isCared,
  type HistoryLog,
} from './operationsAlertHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { getStudentOrderInfo } from './renewal/renewalHelpers'

interface OperationsAlertCareHistoryModalProps {
  trigger: React.ReactNode
  cls: StudentCareAlert
  onRefresh?: () => void
  defaultTab?: 'operational' | 'renewal'
}

export function OperationsAlertCareHistoryModal({
  trigger,
  cls,
  defaultTab = 'operational',
}: OperationsAlertCareHistoryModalProps) {
  const [open, setOpen] = useState(false)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  const isCompleted = isCared(cls)
  const inProgress = isInProgress(cls)
  const isUncared = !isCompleted && !inProgress

  const parseLogDate = (d: string) => {
    if (!d) return 0
    if (d.includes('-')) {
      return new Date(d).getTime() || 0
    }
    const parts = d.split('/')
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime()
    }
    return 0
  }

  // Logs
  const allLogs = useMemo(() => {
    const list = getHistoryLogsForStudent(cls.studentId)
    const clsLogs: HistoryLog[] = (cls.interactionLogs || []).map((l) => {
      let formattedDate = l.date
      if (l.date.includes('-')) {
        const parts = l.date.split('-')
        if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
      }
      return {
        action: l.callConfirmation === 'Đã gọi' ? 'Cuộc gọi chăm sóc' : l.callConfirmation,
        staff: l.staffName,
        date: formattedDate,
        note: l.notes,
        channel: (l.callConfirmation === 'Đã nhắn Zalo' ? 'zalo' : 'telephone') as 'zalo' | 'telephone',
        duration: l.audioDuration,
        tag: l.notes.includes('[CSTP]') ? 'CSTP' : 'T1',
        semantic: 'success' as const,
      }
    })
    const combined = [...clsLogs, ...list]
    return combined.sort((a, b) => parseLogDate(b.date) - parseLogDate(a.date))
  }, [cls.studentId, cls.interactionLogs])

  // Lọc riêng lịch sử theo màn hình: Vận hành hoặc Tái phí
  const operationalLogs = useMemo(() => {
    if (isUncared) return []
    return allLogs.filter(
      (log) => log.tag !== 'CSTP' && !log.action.toLowerCase().includes('tái phí') && !log.note.toLowerCase().includes('tái phí') && !log.note.includes('[CSTP]')
    )
  }, [allLogs, isUncared])

  const renewalLogs = useMemo(() => {
    return allLogs.filter(
      (log) => log.tag === 'CSTP' || log.action.toLowerCase().includes('tái phí') || log.note.toLowerCase().includes('tái phí') || log.note.includes('[CSTP]')
    )
  }, [allLogs])

  // Appointment info
  const rescheduleInfo = getRescheduleInfo(cls)
  const currentLogs = defaultTab === 'renewal' ? renewalLogs : operationalLogs

  // Lần chăm sóc cuối cùng (mới nhất - index 0)
  const latestLog = currentLogs[0]
  // Các lần chăm sóc trước đó (index 1 trở đi)
  const previousLogs = currentLogs.slice(1)

  const formatLogItem = (log: HistoryLog, indexInCurrentLogs: number) => {
    const attemptNum = currentLogs.length - indexInCurrentLogs
    const channelLabel = log.channel === 'telephone' ? 'Cuộc gọi' : log.channel === 'zalo' ? 'Zalo' : 'Trực tiếp'
    const showReschedule = indexInCurrentLogs === 0 && rescheduleInfo.isRescheduled

    // Trích xuất hoặc định dạng câu phản hồi phụ huynh
    const noteContent = log.note
    let parentFeedback = ''

    if (noteContent.includes('phụ huynh') || noteContent.includes('mẹ') || noteContent.includes('bố')) {
      if (noteContent.includes('phụ huynh hẹn') || noteContent.includes('phản hồi')) {
        parentFeedback = noteContent.substring(noteContent.indexOf('phụ huynh'))
      } else {
        parentFeedback = `Phụ huynh phản hồi: "${noteContent}"`
      }
    } else {
      parentFeedback = `Phụ huynh phản hồi: "${noteContent}"`
    }

    const isRenewalItem = defaultTab === 'renewal' || log.tag === 'CSTP' || log.action.toLowerCase().includes('tái phí')
    const orderInfo = isRenewalItem ? getStudentOrderInfo(cls) : null

    const isLatest = indexInCurrentLogs === 0

    return (
      <div
        key={indexInCurrentLogs}
        className={cn(
          "text-xs space-y-1.5 transition-colors text-left",
          isLatest
            ? "px-0.5 py-1 bg-transparent border-0 shadow-none"
            : "bg-muted/30 hover:bg-muted/50 border border-border/60 rounded-md p-2.5"
        )}
      >
        {/* Hàng tiêu đề: Lần XX · Tên CS/GV · Kênh · Người nhận  ---  Ngày */}
        <div className="flex items-center justify-between gap-1 text-xs flex-wrap">
          <div className="font-bold text-foreground flex items-center gap-1.5 flex-wrap">
            <span>Lần {attemptNum}</span>
            <span className="text-muted-foreground font-normal">·</span>
            <span className="text-sky-700 dark:text-sky-400 font-semibold">
              {log.staff.includes('GV') ? 'GV' : 'CS'}: {log.staff}
            </span>
            <span className="text-muted-foreground font-normal">·</span>
            <span className="font-medium text-foreground">{channelLabel}</span>
            <span className="text-muted-foreground font-normal">·</span>
            <span className="text-muted-foreground font-normal">
              Người nhận: <span className="text-foreground font-medium">{log.staff.includes('GV') ? `${cls.studentName} (Học viên)` : `Phụ huynh ${cls.studentName}`}</span>
            </span>
          </div>
          <span className="text-muted-foreground font-mono shrink-0">{log.date}</span>
        </div>

        {/* Nội dung note & Ý kiến phản hồi phụ huynh trên cùng dòng */}
        <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          {showReschedule && (
            <div className="font-semibold text-violet-600 dark:text-violet-400 mb-0.5">
              Hẹn: {rescheduleInfo.rescheduleDate} {rescheduleInfo.rescheduleTime}
            </div>
          )}
          {log.channel === 'telephone' && (
            <span className="inline-flex items-center align-middle mr-2">
              <AudioPlayButton duration={indexInCurrentLogs === 0 ? '01:45' : '01:15'} />
            </span>
          )}
          <span className="align-middle">{noteContent}</span>
          {' '}
          <span className="align-middle text-emerald-800 dark:text-emerald-300 font-normal">
            • Phụ huynh phản hồi:
          </span>{' '}
          <span className="align-middle italic font-normal text-emerald-700 dark:text-emerald-400">
            &ldquo;{parentFeedback.replace(/^(Phụ huynh phản hồi:\s*|["“])/gi, '').replace(/["”]$/g, '').trim() || 'Phụ huynh đã tiếp nhận thông tin và hẹn trao đổi thêm.'}&rdquo;
          </span>
        </div>

        {/* Đơn hàng liên kết trong lịch sử chăm sóc tái phí: chỉ icon và text, không viền, không nền xanh */}
        {isRenewalItem && orderInfo?.orderCode && (
          <div className="mt-1 flex items-center gap-1.5 text-xs flex-wrap text-muted-foreground">
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-muted-foreground text-[11px]">Đơn hàng liên kết:</span>
            <a
              href={`/quote/${orderInfo.orderCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {orderInfo.orderCode}
            </a>
            <span>•</span>
            <span className="font-medium text-foreground truncate max-w-[180px]" title={orderInfo.packageName}>
              {orderInfo.packageName}
            </span>
            {orderInfo.packageAmount && (
              <>
                <span>•</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  TT: {orderInfo.packageAmount}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (val) {
          setIsHistoryExpanded(false)
        }
      }}
    >
      <PopoverTrigger asChild>
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            setOpen(true)
          }}
        >
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-[380px] max-h-[480px] p-3 rounded-xl shadow-lg border border-border bg-popover text-popover-foreground z-50 flex flex-col gap-2.5 overflow-hidden"
      >
        {/* Header bong bóng popup */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
          <span className="font-bold text-xs truncate text-foreground">
            Lịch sử CS {defaultTab === 'renewal' ? 'tái phí' : 'vận hành'}: {cls.studentName}
          </span>
          {!isUncared && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-semibold px-1.5 py-0 h-4.5 shrink-0',
                isCompleted ? getStatusBadgeClass('completed') : getStatusBadgeClass('in_progress')
              )}
            >
              {isCompleted ? 'Đã hoàn thành' : 'Đang xử lý'}
            </Badge>
          )}
        </div>

        {/* Lịch hẹn gần nhất nếu có */}
        {rescheduleInfo.isRescheduled && (
          <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-md p-1.5 flex items-center justify-between text-xs">
            <span className="text-violet-800 dark:text-violet-300 font-medium">
              Hẹn gọi lại: <strong>{rescheduleInfo.rescheduleDate} ({rescheduleInfo.rescheduleTime})</strong>
            </span>
          </div>
        )}

        {/* Danh sách log: Mở sẵn Lần cuối (mới nhất), Gom các lần trước đó vào Toggle */}
        <div className="flex-1 overflow-y-auto max-h-[340px] space-y-2 pr-0.5">
          {currentLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground italic">
              Chưa có lịch sử chăm sóc.
            </div>
          ) : (
            <div className="space-y-2">
              {/* 1. Lần chăm sóc mới nhất (Mở mặc định) */}
              {latestLog && formatLogItem(latestLog, 0)}

              {/* 2. Nút gom các lần chăm sóc trước đó */}
              {previousLogs.length > 0 && (
                <div className="space-y-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="flex items-center justify-between w-full text-[10.5px] font-semibold text-sky-700 dark:text-sky-400 bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/80 rounded-md px-2.5 py-1.5 hover:bg-sky-100/80 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <History className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>
                        Lịch sử ({previousLogs.length}) lần ghi nhận chăm sóc trước đó
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200 shrink-0',
                        isHistoryExpanded ? 'rotate-180' : ''
                      )}
                    />
                  </button>

                  {/* Danh sách các lần chăm sóc trước đó (Mở ra khi click toggle) */}
                  {isHistoryExpanded && (
                    <div className="space-y-2 pl-1 border-l-2 border-sky-200 dark:border-sky-900/50">
                      {previousLogs.map((log, prevIdx) => formatLogItem(log, prevIdx + 1))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
