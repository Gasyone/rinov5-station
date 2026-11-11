'use client'

import { type ReactNode, useState } from 'react'
import {
  Award,
  BookOpen,
  Check,
  Clock,
  Copy,
  HeartHandshake,
  Layers,
  Mail,
  Phone,
  Star,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/format'
import type { PersonnelItem } from './PersonnelCell'
import { getPersonnelOperationalMetrics } from './personnelMetrics'

interface PersonnelHoverCardProps {
  person: PersonnelItem
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function PersonnelHoverCard({
  person,
  children,
  align = 'start',
  side,
  className,
}: PersonnelHoverCardProps) {
  const [copied, setCopied] = useState(false)
  const initials = getInitials(person.name)
  const staffCode = person.id || `EMP-${person.name.split(' ').map((n) => n[0]).join('').toUpperCase()}`
  const staffAvatar = person.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${person.name}`
  const metrics = getPersonnelOperationalMetrics(person)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.phone) return
    try {
      await navigator.clipboard.writeText(person.phone)
      setCopied(true)
      toast.success('Đã sao chép số điện thoại!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép số điện thoại!')
    }
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.phone) return
    toast.success(`Đang thực hiện cuộc gọi CS tới nhân viên: ${person.name} (${person.phone})`)
  }

  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className={cn(
          "w-[350px] p-3.5 rounded-xl shadow-lg border bg-popover text-popover-foreground z-[100]",
          className
        )}
      >
        <div className="space-y-3">
          {/* Header row: Avatar + Name + StaffCode + Role */}
          <div className="flex items-center gap-3 pb-2.5 border-b border-border/60">
            <Avatar className="h-10 w-10 shrink-0 border border-primary/10">
              <AvatarImage src={staffAvatar} alt={person.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-foreground truncate">{person.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.2 bg-muted text-muted-foreground rounded text-[10.5px] font-mono font-semibold uppercase tracking-wider">
                  {staffCode}
                </span>
                <span className="px-1.5 py-0.2 bg-primary/10 text-primary rounded text-[10.5px] font-medium">
                  {person.role || 'Giáo viên'}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ nhanh: SĐT + Email */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-mono text-foreground font-medium truncate">{person.phone || '—'}</span>
              </div>
              {person.phone && (
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCall}
                    className="h-6 w-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Gọi điện"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopy}
                    className="h-6 w-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Sao chép số điện thoại"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            {person.email && (
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate" title={person.email}>
                  {person.email}
                </span>
              </div>
            )}
          </div>

          {/* Section 1: VẬN HÀNH & CHĂM SÓC */}
          <div className="border-t border-border/50 pt-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                Vận hành & Chăm sóc
              </span>
            </div>

            <div className="space-y-1.5 text-xs bg-muted/30 p-2 rounded-lg border border-border/40">
              {metrics.isTeacher ? (
                <>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-muted-foreground">Lớp đang dạy: </span>
                      <span className="font-medium text-foreground">{metrics.operations.activeClassesText}</span>
                    </div>
                  </div>

                  {metrics.operations.nextScheduleText && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1 truncate">
                        <span className="text-muted-foreground">Lịch gần nhất: </span>
                        <span className="font-medium text-foreground">{metrics.operations.nextScheduleText}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <HeartHandshake className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-muted-foreground">Học viên chăm sóc: </span>
                      <span className="font-medium text-foreground">{metrics.operations.caredStudentsText}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-muted-foreground">Học viên chăm sóc: </span>
                      <span className="font-medium text-foreground">{metrics.operations.caredStudentsText}</span>
                    </div>
                  </div>

                  {metrics.operations.pendingFollowUpCount && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-muted-foreground">Cần tương tác hôm nay: </span>
                        <span className="font-medium text-foreground">{metrics.operations.pendingFollowUpCount} học viên</span>
                      </div>
                    </div>
                  )}

                  {metrics.operations.shiftLabel && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1 truncate">
                        <span className="text-muted-foreground">Ca trực: </span>
                        <span className="font-medium text-foreground">{metrics.operations.shiftLabel}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Section 2: CHẤT LƯỢNG & QC (Cả Giáo viên và CS đều có) */}
          <div className="border-t border-border/50 pt-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                Chất lượng & QC
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Tuân thủ {metrics.quality.complianceRate}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/30 p-2 rounded-lg border border-border/40">
                <span className="text-[10.5px] text-muted-foreground block font-medium">Điểm chất lượng</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                  <span className="font-bold text-foreground text-sm">{metrics.quality.qualityScore}</span>
                  <span className="text-muted-foreground text-[11px]">/ 5.0</span>
                </div>
              </div>

              <div className="bg-muted/30 p-2 rounded-lg border border-border/40">
                <span className="text-[10.5px] text-muted-foreground block font-medium">Chỉ số lỗi QC</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={cn(
                      'font-semibold text-xs',
                      metrics.quality.qcErrorsMonth === 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {metrics.quality.qcErrorsMonth} lỗi tháng này
                  </span>
                </div>
                <span className="text-[10.5px] text-muted-foreground block mt-0.5">
                  {metrics.quality.qcErrorsAllTime} lỗi all-time
                </span>
              </div>
            </div>
          </div>

          {person.isLeave && (
            <div className="pt-2 border-t border-dashed border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-950/10 p-2 rounded-lg">
              <p className="font-bold flex items-center gap-1">
                ⚠️ Đang tạm nghỉ (Nghỉ)
              </p>
            </div>
          )}

          {person.isSubstitute && (
            <div className="pt-2 border-t border-dashed border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-950/10 p-2 rounded-lg">
              <p className="font-bold flex items-center gap-1">
                ⚠️ Dạy thay {person.date ? `(${person.date})` : ''}
              </p>
              {person.reason && <p className="mt-0.5 italic">Lý do: {person.reason}</p>}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
