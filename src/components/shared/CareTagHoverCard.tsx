'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

export interface CareTagHoverCardProps {
  code: string
  label?: string
  fullLabel?: string
  colorClass?: string
  description?: string
  configRule?: string
  realDataIssue?: string
  occurredDate?: string
  dueDate?: string
  isOverdue?: boolean
  isDueToday?: boolean
  slaText?: string
  children?: React.ReactNode
}

function resolveTagDefaults(
  code: string,
  fullLabel?: string,
  description?: string,
  configRule?: string,
  realDataIssue?: string,
  slaText?: string
) {
  const c = code.trim().toUpperCase()

  let resolvedFullLabel = fullLabel
  let resolvedConfigRule = configRule
  let resolvedRealDataIssue = realDataIssue
  let resolvedSla = slaText

  if (c.includes('ĐB') || c === 'CSĐB' || c === 'ĐB1') {
    resolvedFullLabel = resolvedFullLabel || 'CS Đặc biệt'
    resolvedConfigRule = resolvedConfigRule || 'Chuyên cần < 85% hoặc Điểm kiểm tra < 5.5'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Cần chăm sóc khẩn cấp do có cảnh báo vận hành hoặc học thuật'
    resolvedSla = resolvedSla || '23/07/2026'
  } else if (c.includes('ĐK1') || c === 'CSĐK1') {
    resolvedFullLabel = resolvedFullLabel || 'CS học tập Định kỳ'
    resolvedConfigRule = resolvedConfigRule || 'Điểm chạm kiểm tra tiến độ học tập hàng tháng'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Trao đổi học tập hàng tháng và cập nhật kết quả'
    resolvedSla = resolvedSla || '28/07/2026'
  } else if (c.includes('ĐK2') || c === 'CSĐK2') {
    resolvedFullLabel = resolvedFullLabel || 'CS học phí Định kỳ'
    resolvedConfigRule = resolvedConfigRule || 'Nhắc tái phí theo số buổi học còn lại'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Còn 2 buổi học trong khóa hiện tại'
    resolvedSla = resolvedSla || '30/07/2026'
  } else if (c.includes('TB') || c === 'CSBH') {
    resolvedFullLabel = resolvedFullLabel || 'CS chuyên cần & BTVN'
    resolvedConfigRule = resolvedConfigRule || 'Thiếu bài tập về nhà từ 2 buổi liên tiếp'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Nhắc nhở chuyên cần & nộp bổ sung BTVN'
    resolvedSla = resolvedSla || '26/07/2026'
  } else if (c === 'CSTP') {
    resolvedFullLabel = resolvedFullLabel || 'Chăm sóc Tái phí'
    resolvedConfigRule = resolvedConfigRule || 'Cảnh báo hạn gia hạn và đóng học phí khóa mới'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Hạn đóng phí dự kiến: 30/07/2026'
    resolvedSla = resolvedSla || '30/07/2026'
  } else if (c === 'CSCĐ') {
    resolvedFullLabel = resolvedFullLabel || 'Cảnh báo học thuật'
    resolvedConfigRule = resolvedConfigRule || 'Điểm kiểm tra định kỳ thấp hơn mức chuẩn 6.0'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Cần tư vấn hỗ trợ lộ trình phụ đạo bổ sung'
    resolvedSla = resolvedSla || '24/07/2026'
  } else {
    resolvedFullLabel = resolvedFullLabel || `${code}: ${description || 'CS'}`
    resolvedConfigRule = resolvedConfigRule || description || 'Cấu hình quy tắc cảnh báo tự động'
    resolvedRealDataIssue = resolvedRealDataIssue || 'Hệ thống ghi nhận tình trạng cần tương tác chăm sóc'
    resolvedSla = resolvedSla || '25/07/2026'
  }

  return {
    fullLabel: resolvedFullLabel,
    configRule: resolvedConfigRule,
    realDataIssue: resolvedRealDataIssue,
    slaText: resolvedSla,
  }
}

function renderDeadlineBadge(
  dueDate?: string,
  isOverdue?: boolean,
  isDueToday?: boolean,
  defaultSla?: string
) {
  let dateStr = dueDate || defaultSla || '25/07/2026'
  // If dateStr is not in dd/mm/yyyy format (e.g. '24 giờ'), use default date
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr.trim())) {
    dateStr = '25/07/2026'
  } else {
    dateStr = dateStr.trim()
  }

  if (isOverdue) {
    return (
      <span className="font-bold text-red-600 dark:text-red-400 text-[10px] shrink-0 whitespace-nowrap">
        Quá hạn: {dateStr}
      </span>
    )
  }

  if (isDueToday) {
    return (
      <span className="font-semibold text-amber-600 dark:text-amber-400 text-[10px] shrink-0 whitespace-nowrap">
        Đến hạn: {dateStr}
      </span>
    )
  }

  return (
    <span className="font-medium text-foreground dark:text-zinc-300 text-[10px] shrink-0 whitespace-nowrap">
      Hạn: {dateStr}
    </span>
  )
}

export function CareTagHoverCard({
  code,
  label,
  fullLabel,
  colorClass = 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-400',
  description,
  configRule,
  realDataIssue,
  occurredDate = '10/07/2026',
  dueDate,
  isOverdue,
  isDueToday,
  slaText,
  children,
}: CareTagHoverCardProps) {
  const defaults = resolveTagDefaults(code, fullLabel, description, configRule, realDataIssue, slaText)
  const codeUpper = (code || label || '').trim().toUpperCase()
  const assignees: ('CS' | 'GV')[] = codeUpper.includes('CSCĐ')
    ? ['CS', 'GV']
    : codeUpper.includes('ĐK1') || codeUpper.includes('TB2')
    ? ['GV']
    : ['CS']

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children || (
          <Badge
            variant="outline"
            className={cn(
              'text-[11px] px-2 py-0.5 min-h-[22px] font-semibold cursor-help shadow-none border whitespace-nowrap leading-none rounded-md transition-opacity hover:opacity-90 inline-flex items-center gap-1.5',
              colorClass
            )}
          >
            <span>{label || code}</span>
            <div className="flex items-center gap-0.5 shrink-0">
              {assignees.includes('CS') && (
                <Avatar className="h-4.5 w-4.5 shrink-0 border border-emerald-500/30 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[8px] font-bold">
                  <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=CS" alt="CS" />
                  <AvatarFallback className="bg-emerald-600 text-white font-bold text-[7px]">CS</AvatarFallback>
                </Avatar>
              )}
              {assignees.includes('GV') && (
                <Avatar className="h-4.5 w-4.5 shrink-0 border border-purple-500/30 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[8px] font-bold">
                  <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=GV" alt="GV" />
                  <AvatarFallback className="bg-purple-600 text-white font-bold text-[7px]">GV</AvatarFallback>
                </Avatar>
              )}
            </div>
          </Badge>
        )}
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        side="top"
        className="w-80 p-3 bg-popover/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl text-xs z-50 space-y-2 whitespace-normal text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title on left, Deadline badge on top-right */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0', colorClass)}>
              {code}
            </span>
            <span className="font-bold text-foreground text-xs truncate">{defaults.fullLabel}</span>
          </div>
          {renderDeadlineBadge(dueDate, isOverdue, isDueToday, defaults.slaText)}
        </div>

        {/* Body: Normal flowing text lines without 2-column flex splits and with normal-case labels */}
        <div className="space-y-1.5 text-[11px] leading-snug">
          <p className="text-foreground/90">
            <span className="text-muted-foreground font-medium">Mô tả: </span>
            {defaults.configRule}
          </p>
          {defaults.realDataIssue && (
            <p className="text-foreground">
              <span className="text-muted-foreground font-medium">Nội dung: </span>
              <span className="font-semibold">{defaults.realDataIssue}</span>
            </p>
          )}
        </div>

        {/* Footer: Date created */}
        <div className="pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground">
          Phát sinh: <strong className="text-foreground font-medium">{occurredDate}</strong>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
