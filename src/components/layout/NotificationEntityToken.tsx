'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'

export type EntityKind = 'student' | 'teacher' | 'class' | 'session' | 'order' | 'ticket'

export interface EntityInfo {
  kind: EntityKind
  code: string
  name: string
  route: string
}

export function parseNotificationEntities(text: string): Array<{ text: string; entity?: EntityInfo }> {
  // Regex nhận diện học viên, giáo viên, lớp, buổi học, đơn hàng, ticket (hỗ trợ Unicode tiếng Việt đầy đủ)
  const regex =
    /(?:HV|Học viên|GV|Giáo viên)\s+[\p{Lu}][\p{Ll}]*(?:\s+[\p{Lu}][\p{Ll}]*)+|CLASS-\d+|SESSION-[A-Z0-9-]+|ORD-[A-Z0-9-]+|PT-[A-Z0-9-]+|TCK-[A-Z0-9-]+|IELTS-\d+|TOEIC-\d+|TEST-\d+|TRIAL-[A-Z]+/gu

  const parts: Array<{ text: string; entity?: EntityInfo }> = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) })
    }
    const token = match[0].trim()
    let kind: EntityKind = 'class'
    let route = '/app/classes'

    if (token.startsWith('HV ') || token.startsWith('Học viên ')) {
      kind = 'student'
      route = '/app/students'
    } else if (token.startsWith('GV ') || token.startsWith('Giáo viên ')) {
      kind = 'teacher'
      route = '/app/hr_employees'
    } else if (token.startsWith('SESSION-')) {
      kind = 'session'
      route = '/app/calendar_class_schedule'
    } else if (token.startsWith('ORD-') || token.startsWith('PT-')) {
      kind = 'order'
      route = '/app/orders'
    } else if (token.startsWith('TCK-')) {
      kind = 'ticket'
      route = '/app/support_tickets'
    } else {
      kind = 'class'
      route = '/app/classes'
    }

    parts.push({
      text: token,
      entity: {
        kind,
        code: token,
        name: token,
        route,
      },
    })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) })
  }

  return parts
}

export function NotificationEntityToken({ entity }: { entity: EntityInfo }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(entity.route, '_blank')
  }

  return (
    <HoverCard openDelay={120} closeDelay={150}>
      <HoverCardTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleClick(e as unknown as React.MouseEvent)
          }}
          className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors inline cursor-pointer select-text decoration-primary/40 underline-offset-2"
          title={`Nhấp để mở ${entity.name} trong tab mới`}
        >
          {entity.name}
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        sideOffset={6}
        className="w-72 p-3 shadow-xl border border-border/80 bg-popover text-popover-foreground rounded-xl z-50 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {entity.kind === 'student' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-xs">
                HV
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{entity.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Hồ sơ Học viên 360°</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Đang học
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
              <div className="flex items-center justify-between">
                <span>Chuyên cần:</span>
                <span className="font-medium text-foreground">95% (Đạt chuẩn)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Khóa học:</span>
                <span className="font-medium text-foreground">IELTS Intensive 6.5</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Mở hồ sơ học viên (tab mới)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}

        {entity.kind === 'teacher' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 font-bold text-xs">
                GV
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{entity.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Giáo viên Chuyên môn</p>
              </div>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                4.9 ⭐
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
              <div className="flex items-center justify-between">
                <span>Điện thoại:</span>
                <span className="font-medium text-foreground">091****888</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lớp phụ trách:</span>
                <span className="font-medium text-foreground">5 lớp đang hoạt động</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Xem lịch giảng dạy (tab mới)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}

        {entity.kind === 'class' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                Lớp
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{entity.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Lớp học tiêu chuẩn</p>
              </div>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                12/15 HV
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
              <div className="flex items-center justify-between">
                <span>Lịch học:</span>
                <span className="font-medium text-foreground">T2-T4-T6 (18:00 - 19:30)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phòng học:</span>
                <span className="font-medium text-foreground">Phòng Lab 201</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Xem chi tiết lớp (tab mới)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}

        {entity.kind === 'session' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 font-bold text-xs">
                Buổi
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{entity.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Buổi học trong kỳ</p>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
              <div className="flex items-center justify-between">
                <span>Thời gian:</span>
                <span className="font-medium text-foreground">18:00 - 19:30</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Trạng thái:</span>
                <span className="font-medium text-rose-500">Đã khai báo hủy</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Xem lịch buổi học (tab mới)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}

        {entity.kind === 'order' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                ĐH
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{entity.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Đơn hàng & Thu phí</p>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
              <div className="flex items-center justify-between">
                <span>Khoản thu:</span>
                <span className="font-medium text-foreground">18.500.000đ</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kênh thanh toán:</span>
                <span className="font-medium text-emerald-600">VNPAY QR</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Xem đơn hàng (tab mới)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}
        {entity.kind === 'ticket' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 font-bold text-xs">
                TCK
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{entity.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Ticket & Khiếu nại phụ huynh</p>
              </div>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                SLA: 2h
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
              <div className="flex items-center justify-between">
                <span>Mức độ:</span>
                <span className="font-medium text-destructive">Khẩn cấp</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phụ trách:</span>
                <span className="font-medium text-foreground">CSM Học vụ</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Xem chi tiết ticket (tab mới)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

export function RenderNotificationText({ text }: { text: string }) {
  const parts = parseNotificationEntities(text)
  return (
    <>
      {parts.map((p, i) =>
        p.entity ? (
          <NotificationEntityToken key={i} entity={p.entity} />
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  )
}
