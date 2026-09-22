'use client'

import {
  BookOpen,
  Calendar,
  Clock,
  User,
  MapPin,
  Users,
  AlertCircle,
  Plus,
  ArrowRightLeft,
  CalendarOff,
  LogOut,
  MoreVertical,
  ChevronDown,
  Snowflake,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { StudentPackage } from './studentDetailTypes'
import type { EnrolledClass } from '@/mocks/students'

export interface StudentProgramPackageCardProps {
  packageItem: StudentPackage
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  enrolledClass?: EnrolledClass | null
  onOpenAssignClass: (packageId: string) => void
  onLeaveClass?: () => void
  onReservePackage?: (packageId: string) => void
  onDropClass?: (classCode: string) => void
}

export function StudentProgramPackageCard({
  packageItem,
  studentBranch,
  enrolledClass,
  onOpenAssignClass,
  onLeaveClass,
  onReservePackage,
  onDropClass,
}: StudentProgramPackageCardProps) {
  const isLinked = Boolean(packageItem.linkedClassCode || enrolledClass?.classCode)
  const total = packageItem.totalSessions || 24
  const remaining = packageItem.remainingSessions ?? total
  const studied = Math.max(0, total - remaining)
  const progressPercent = Math.min(100, Math.round((studied / total) * 100))

  const isExpired = remaining === 0 || packageItem.status === 'expired'
  const isReserved = packageItem.status === 'reserved' || packageItem.status === 'suspended'

  const effectiveClass = enrolledClass || (packageItem.linkedClassCode ? {
    classCode: packageItem.linkedClassCode,
    className: packageItem.linkedClassName || 'Lớp ghép tiêu chuẩn',
    type: 'offline' as const,
    scheduleSlots: [
      { dayOfWeek: 'Thứ 2', startTime: '18:00', endTime: '19:30' },
      { dayOfWeek: 'Thứ 4', startTime: '18:00', endTime: '19:30' },
      { dayOfWeek: 'Thứ 6', startTime: '18:00', endTime: '19:30' },
    ],
    teacherName: 'Hoàng Thị Mai',
    status: 'active' as const,
    progress: `${studied} / ${total} buổi`,
    branch: studentBranch,
    room: 'Phòng A101',
  } : null)

  const formatScheduleText = () => {
    if (!effectiveClass?.scheduleSlots || effectiveClass.scheduleSlots.length === 0) {
      return 'T2 18:00-19:30 • T4 18:00-19:30 • T6 18:00-19:30'
    }
    return effectiveClass.scheduleSlots
      .map((s) => `${s.dayOfWeek || ('date' in s ? (s as { date?: string }).date : '')} ${s.startTime}-${s.endTime}`)
      .join(' • ')
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs transition-all hover:border-border">
      {/* 1. Header: Thông tin gói & Quản lý */}
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground tracking-tight">
                {packageItem.packageName}
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {packageItem.id}
              </span>
              {isExpired ? (
                <StatusBadge status="expired" label="Hết hạn" className="text-[10.5px] py-0.2 px-2" />
              ) : isReserved ? (
                <StatusBadge status="reserved" label="Bảo lưu" className="text-[10.5px] py-0.2 px-2" />
              ) : isLinked ? (
                <StatusBadge status="active" label="Đang học" className="text-[10.5px] py-0.2 px-2" />
              ) : (
                <StatusBadge status="wait_for_assignment" label="Chờ ghép lớp" className="text-[10.5px] py-0.2 px-2" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 opacity-70" />
                Hạn dùng: {packageItem.purchaseDate || '15/01/2025'} → {packageItem.endDate || '15/10/2025'}
              </span>
            </div>
          </div>
        </div>

        {/* Thao tác gói */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground rounded-md bg-background hover:bg-muted/60 border-border/70 cursor-pointer shadow-3xs"
                title="Thao tác gói học"
              >
                <MoreVertical className="h-3.5 w-3.5" />
                <span>Thao tác gói</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onReservePackage && (
                <DropdownMenuItem
                  onClick={() => onReservePackage(packageItem.id)}
                  className="cursor-pointer gap-2 font-medium text-sky-700 dark:text-sky-400 focus:text-sky-800"
                >
                  <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Bảo lưu gói học</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onOpenAssignClass(packageItem.id)}
                className="cursor-pointer gap-2 font-medium text-indigo-700 dark:text-indigo-400 focus:text-indigo-800"
              >
                <ArrowRightLeft className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{isLinked ? 'Đổi lớp ghép khác' : 'Ghép lớp mới'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {}}
                className="cursor-pointer gap-2 text-xs text-muted-foreground"
              >
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Chuyển phí sang gói khác</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. Quota buổi học & Progress Bar */}
      <div className="rounded-lg bg-muted/40 dark:bg-zinc-900/40 p-2.5 space-y-1.5 border border-border/40">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              Đã học: <strong className="text-primary font-bold">{studied}</strong>/{total} buổi
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold text-foreground">
              Còn lại: <strong className={cn(remaining > 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground")}>{remaining}</strong> buổi
            </span>
          </div>
          <span className="font-mono font-bold text-xs text-muted-foreground">
            Tiến độ: {progressPercent}%
          </span>
        </div>
        {/* Progress bar track */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              progressPercent >= 100
                ? "bg-muted-foreground"
                : progressPercent > 75
                ? "bg-amber-500"
                : "bg-primary"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Khối Lớp ghép của Gói học */}
      {isLinked && effectiveClass ? (
        <div className="rounded-lg border border-border/70 bg-card/80 p-3 space-y-2.5">
          {/* Lớp Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                📌 Lớp ghép:
              </span>
              <span className="text-xs font-extrabold text-foreground">
                {effectiveClass.className}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ({effectiveClass.classCode})
              </span>
              <StatusBadge
                status={effectiveClass.status || 'active'}
                label={effectiveClass.status === 'active' ? 'Đang học' : 'Chờ khai giảng'}
                className="text-[10px] py-0 px-2"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Sĩ số: <strong className="text-foreground">15/20</strong> (+2 mới)</span>
            </div>
          </div>

          {/* Chi tiết Lịch học & Giáo viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{formatScheduleText()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>GV: <strong className="text-foreground font-medium">{effectiveClass.teacherName || 'Hoàng Thị Mai'}</strong></span>
              <span className="text-muted-foreground">•</span>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{effectiveClass.room || 'Phòng A101'}</span>
            </div>
          </div>

          {/* Dòng thao tác lớp */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30 flex-wrap">
            <span className="text-[11px] text-muted-foreground italic">
              Buổi bắt đầu: {packageItem.startSessionDate || 'Buổi 01 (15/01/2025)'}
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenAssignClass(packageItem.id)}
                className="h-7 px-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 hover:bg-indigo-100 dark:bg-indigo-950/30 cursor-pointer shadow-3xs"
                title="Chọn lớp khác để chuyển sang"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
                <span>Đổi lớp ghép</span>
              </Button>

              {onLeaveClass && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onLeaveClass}
                  className="h-7 px-2 text-xs font-semibold text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50/50 hover:bg-amber-100 dark:bg-amber-950/30 cursor-pointer shadow-3xs"
                  title="Tạo đơn xin nghỉ phép buổi học"
                >
                  <CalendarOff className="h-3.5 w-3.5 mr-1" />
                  <span>Nghỉ phép</span>
                </Button>
              )}

              {onDropClass && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDropClass(effectiveClass.classCode)}
                  className="h-7 px-2 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 bg-rose-50/50 hover:bg-rose-100 dark:bg-rose-950/30 cursor-pointer shadow-3xs"
                  title="Rút học viên khỏi lớp này"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  <span>Rút lớp</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Chưa ghép lớp -> Thẻ cảnh báo + Nút Ghép lớp */
        <div className="rounded-lg border border-amber-300/80 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900/50 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Gói học chưa được ghép vào lớp nào
              </div>
              <div className="text-xs text-amber-700/90 dark:text-amber-400/90">
                Học viên còn nguyên <strong>{remaining} buổi</strong> chưa phân bổ. Hãy chọn lớp phù hợp để bắt đầu học.
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenAssignClass(packageItem.id)}
            className="h-8 px-3.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Ghép lớp ngay</span>
          </Button>
        </div>
      )}
    </div>
  )
}
