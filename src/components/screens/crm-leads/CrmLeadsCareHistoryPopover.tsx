'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Calendar, Phone, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Lead } from '@/mocks/crmLeads'
import { LeadCareInfo, LeadCareLog } from './crmLeadsHelpers'
import { STATUS_LABEL_MAP } from './crmLeadsTypes'
import { getStatusBadgeClass } from '@/lib/statusColors'

interface CrmLeadsCareHistoryPopoverProps {
  trigger: React.ReactNode
  lead: Lead
  careInfo: LeadCareInfo
}

export function CrmLeadsCareHistoryPopover({
  trigger,
  lead,
  careInfo,
}: CrmLeadsCareHistoryPopoverProps) {
  const [open, setOpen] = useState(false)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  const { isUncared, logs, isRescheduled, rescheduleDate, rescheduleTime } = careInfo
  const latestLog = logs[0]
  const previousLogs = logs.slice(1)

  const getChannelInfo = (channel: LeadCareLog['channel']) => {
    switch (channel) {
      case 'telephone':
        return { label: 'Cuộc gọi', icon: <Phone className="h-3 w-3 text-sky-600" /> }
      case 'zalo':
        return { label: 'Zalo', icon: <MessageSquare className="h-3 w-3 text-emerald-600" /> }
      case 'direct':
        return { label: 'Trực tiếp', icon: <User className="h-3 w-3 text-violet-600" /> }
    }
  }

  const formatLogItem = (log: LeadCareLog, index: number) => {
    const attemptNum = logs.length - index
    const channelInfo = getChannelInfo(log.channel)
    const showReschedule = index === 0 && isRescheduled

    return (
      <div
        key={index}
        className="bg-muted/30 hover:bg-muted/50 border border-border/60 rounded-md p-2.5 text-xs space-y-1.5 transition-colors text-left"
      >
        {/* Hàng tiêu đề: Lần XX · Tên Sale · Kênh  ---  Ngày */}
        <div className="flex items-center justify-between gap-1 text-xs">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <span>Lần {attemptNum}</span>
            <span className="text-muted-foreground">•</span>
            <span>{log.staff}</span>
            <span className="text-muted-foreground">•</span>
            <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
              {channelInfo.icon}
              {channelInfo.label}
            </span>
          </div>
          <span className="text-muted-foreground font-mono text-xs">{log.date}</span>
        </div>

        {/* Nội dung ghi chú */}
        <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal space-y-0.5">
          {showReschedule && rescheduleDate && (
            <div className="font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1 pb-0.5">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>Hẹn gọi lại: {rescheduleDate} ({rescheduleTime || '19:00'})</span>
            </div>
          )}
          <div>{log.note}</div>
          {log.parentFeedback && (
            <div className="text-emerald-700 dark:text-emerald-400 font-medium italic pt-0.5">
              • Phụ huynh phản hồi: &ldquo;{log.parentFeedback}&rdquo;
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isUncared || logs.length === 0) {
    return <>{trigger}</>
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
          onMouseEnter={() => setOpen(true)}
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
        {/* Header Popover */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
          <span className="font-bold text-xs truncate text-foreground">
            Lịch sử CS: {lead.studentName}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-semibold px-1.5 py-0 h-4.5 shrink-0',
              getStatusBadgeClass(lead.status)
            )}
          >
            {STATUS_LABEL_MAP[lead.status] ?? lead.status}
          </Badge>
        </div>

        {/* Lịch hẹn gần nhất nếu có */}
        {isRescheduled && rescheduleDate && (
          <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-md p-1.5 flex items-center justify-between text-xs">
            <span className="text-violet-800 dark:text-violet-300 font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
              <span>
                Hẹn chăm sóc / gọi lại: <strong>{rescheduleDate} ({rescheduleTime || '19:00'})</strong>
              </span>
            </span>
          </div>
        )}

        {/* Danh sách log */}
        <div className="flex-1 overflow-y-auto max-h-[340px] space-y-2 pr-0.5">
          <div className="space-y-2">
            {/* Lần chăm sóc mới nhất (Mở mặc định) */}
            {latestLog && formatLogItem(latestLog, 0)}

            {/* Nút gom các lần chăm sóc trước đó */}
            {previousLogs.length > 0 && (
              <div className="space-y-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="flex items-center justify-between w-full text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/80 rounded-md px-2.5 py-1.5 hover:bg-rose-100/80 transition-colors cursor-pointer"
                >
                  <span>
                    ⚠️ Lịch sử ({previousLogs.length}) lần tương tác trước đó
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
        </div>
      </PopoverContent>
    </Popover>
  )
}
