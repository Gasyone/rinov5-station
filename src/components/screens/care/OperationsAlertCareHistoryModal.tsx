'use client'

import React, { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'operational' | 'renewal'>(defaultTab)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  const isCompleted = isCared(cls)
  const inProgress = isInProgress(cls)
  const isUncared = !isCompleted && !inProgress

  // Logs
  const allLogs = useMemo(() => getHistoryLogsForStudent(cls.studentId), [cls.studentId])

  // Split logs for operational vs renewal
  // Nếu Chưa chăm sóc (isUncared), danh sách log vận hành sẽ TRỐNG
  const operationalLogs = useMemo(() => {
    if (isUncared) return []
    return allLogs.filter((log) => log.tag !== 'CSTP' && !log.action.toLowerCase().includes('tái phí'))
  }, [allLogs, isUncared])

  const renewalLogs = useMemo(
    () => allLogs.filter((log) => log.tag === 'CSTP' || log.action.toLowerCase().includes('tái phí')),
    [allLogs]
  )

  // Check if renewal fee tab is required
  const hasRenewal = useMemo(() => {
    return (
      cls.careAlert === 'CSTP' ||
      cls.status === 'Hết buổi' ||
      renewalLogs.length > 0 ||
      Boolean(cls.expectedEndDate)
    )
  }, [cls, renewalLogs.length])

  // Appointment info
  const rescheduleInfo = getRescheduleInfo(cls)
  const currentLogs = activeTab === 'renewal' ? renewalLogs : operationalLogs

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

    return (
      <div
        key={indexInCurrentLogs}
        className="bg-muted/30 hover:bg-muted/50 border border-border/60 rounded-md p-2.5 text-xs space-y-1.5 transition-colors text-left"
      >
        {/* Hàng tiêu đề: Lần XX · Tên CS/GV · Kênh  ---  Ngày */}
        <div className="flex items-center justify-between gap-1 text-[10px]">
          <div className="font-bold text-foreground">
            Lần {attemptNum} · {log.staff} · {channelLabel}
          </div>
          <span className="text-muted-foreground font-mono">{log.date}</span>
        </div>

        {/* Nội dung note & Ý kiến phản hồi phụ huynh */}
        <div className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal space-y-0.5">
          {showReschedule && (
            <div className="font-semibold text-violet-600 dark:text-violet-400">
              Hẹn: {rescheduleInfo.rescheduleDate} {rescheduleInfo.rescheduleTime}
            </div>
          )}
          <div>{noteContent}</div>
          {isCompleted && indexInCurrentLogs === 0 && (
            <div className="text-emerald-700 dark:text-emerald-400 font-medium italic pt-0.5">
              • Phụ huynh phản hồi: &ldquo;{parentFeedback.replace(/^(Phụ huynh phản hồi:\s*|")/gi, '').replace(/"$/g, '')}&rdquo;
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (val) {
          setActiveTab(defaultTab)
          setIsHistoryExpanded(false)
        }
      }}
    >
      <PopoverTrigger asChild>
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            setActiveTab(defaultTab)
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
            Lịch sử CS: {cls.studentName}
          </span>
          {!isUncared && (
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] font-semibold px-1.5 py-0 h-4.5 shrink-0',
                isCompleted ? getStatusBadgeClass('completed') : getStatusBadgeClass('in_progress')
              )}
            >
              {isCompleted ? 'Đã hoàn thành' : 'Đang xử lý'}
            </Badge>
          )}
        </div>

        {/* Lịch hẹn gần nhất nếu có */}
        {rescheduleInfo.isRescheduled && (
          <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-md p-1.5 flex items-center justify-between text-[11px]">
            <span className="text-violet-800 dark:text-violet-300 font-medium">
              Hẹn gọi lại: <strong>{rescheduleInfo.rescheduleDate} ({rescheduleInfo.rescheduleTime})</strong>
            </span>
          </div>
        )}

        {/* 2 Tab nếu có tái phí */}
        {hasRenewal && (
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('operational')
                setIsHistoryExpanded(false)
              }}
              className={cn(
                'flex-1 py-1 px-2 rounded-md transition-colors flex items-center justify-center gap-1',
                activeTab === 'operational'
                  ? 'bg-background text-foreground shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>Vận hành ({operationalLogs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('renewal')
                setIsHistoryExpanded(false)
              }}
              className={cn(
                'flex-1 py-1 px-2 rounded-md transition-colors flex items-center justify-center gap-1',
                activeTab === 'renewal'
                  ? 'bg-background text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>Tái phí ({renewalLogs.length})</span>
            </button>
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
                    className="flex items-center justify-between w-full text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/80 rounded-md px-2.5 py-1.5 hover:bg-rose-100/80 transition-colors"
                  >
                    <span>
                      ⚠️ Lịch sử ({previousLogs.length}) lần gọi nhỡ / tương tác trước đó
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
                    <div className="space-y-2 pl-1 border-l-2 border-rose-200 dark:border-rose-900/50">
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
