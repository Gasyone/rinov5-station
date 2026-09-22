'use client'

import React from 'react'
import {
  ExternalLink,
  BookOpen,
  Calendar,
  GraduationCap,
  AlertTriangle,
  Gift,
  User,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { StudentEnrolledPackage } from './studentPackagesTypes'

interface StudentPackageCardItemProps {
  pkg: StudentEnrolledPackage
  onViewOrder?: (orderNo: string) => void
  onNavigateToLearning?: (pkg: StudentEnrolledPackage) => void
  onRenewalClick?: (pkg: StudentEnrolledPackage) => void
  onOpenLeaveReserve?: () => void
}

export function StudentPackageCardItem({
  pkg,
  onViewOrder,
  onNavigateToLearning,
  onRenewalClick,
  onOpenLeaveReserve,
}: StudentPackageCardItemProps) {
  const isExpired = pkg.status === 'expired' || pkg.remainingSessions <= 0
  const isLowSessions = pkg.remainingSessions > 0 && pkg.remainingSessions <= 8
  const isWarningSessions = pkg.remainingSessions > 8 && pkg.remainingSessions <= 15
  const percentAttended = pkg.totalSessions > 0 ? Math.min(100, Math.round((pkg.attendedSessions / pkg.totalSessions) * 100)) : 0

  const getStatusBadge = () => {
    switch (pkg.status) {
      case 'active':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] font-bold shadow-none">
            Đang học
          </Badge>
        )
      case 'pending_placement':
        return (
          <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[11px] font-bold shadow-none">
            Chờ xếp lớp
          </Badge>
        )
      case 'reserved':
        return (
          <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800 text-[11px] font-bold shadow-none">
            Đang bảo lưu
          </Badge>
        )
      case 'expired':
        return (
          <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 text-[11px] font-bold shadow-none">
            Hết buổi
          </Badge>
        )
      case 'transferred':
        return (
          <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800 text-[11px] font-bold shadow-none">
            Đã chuyển phí
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'bg-card dark:bg-zinc-900 border rounded-2xl p-3 shadow-2xs space-y-2.5 text-left transition-all group overflow-hidden',
        isExpired
          ? 'border-border/60 bg-muted/20 opacity-90'
          : isLowSessions
            ? 'border-amber-300/80 dark:border-amber-800/60 bg-amber-50/10 dark:bg-amber-950/10'
            : 'border-border/80'
      )}
    >
      {/* ── HEADER: TÊN GÓI & TRẠNG THÁI GÓI ── */}
      <div className="-mx-3 -mt-3 px-3.5 py-2.5 bg-muted/40 dark:bg-zinc-800/40 border-b border-border/40 rounded-t-2xl space-y-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={cn(
                'px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider shrink-0',
                pkg.subject === 'Toán tư duy'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
              )}
            >
              {pkg.subject}
            </span>
            <h4
              className="font-bold text-xs sm:text-sm text-foreground truncate"
              title={pkg.packageName}
            >
              {pkg.packageName}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {getStatusBadge()}
          </div>
        </div>

        {/* ── DÒNG LIÊN KẾT ĐƠN HÀNG GỐC ── */}
        <div className="flex items-center justify-between gap-2 text-xs flex-wrap pt-0.5 border-t border-border/20">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground font-medium text-[11.5px]">Thuộc Đơn hàng:</span>
            {pkg.linkedOrderNo ? (
              <button
                type="button"
                onClick={() => onViewOrder?.(pkg.linkedOrderNo!)}
                className="font-bold font-mono text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer select-none bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60"
                title={`Nhấp để mở chi tiết đơn hàng ${pkg.linkedOrderNo}`}
              >
                <span>{pkg.linkedOrderNo}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </button>
            ) : (
              <span className="font-mono text-muted-foreground italic">Gói chuyển giao</span>
            )}
            {pkg.purchaseDate && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground text-[11px]">Mua ngày {pkg.purchaseDate}</span>
              </>
            )}
            {pkg.saleRep && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground text-[11px]">Tư vấn: {pkg.saleRep}</span>
              </>
            )}
            {pkg.orderType && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {pkg.orderType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── TIẾN ĐỘ BUỔI HỌC TRỰC QUAN (PROGRESS BAR) ── */}
      <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-2.5 border border-border/40 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-foreground">
              Đã học: <strong className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{pkg.attendedSessions}</strong> / <span className="font-mono">{pkg.totalSessions}</span> buổi
            </span>
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px]">
              {percentAttended}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isLowSessions && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 animate-pulse">
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                <span>Sắp hết buổi</span>
              </span>
            )}
            <span
              className={cn(
                'text-xs font-bold font-mono px-2 py-0.5 rounded-full border',
                isExpired
                  ? 'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400'
                  : isLowSessions
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
              )}
            >
              Còn lại: {pkg.remainingSessions} buổi
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden flex">
          <div
            className={cn(
              'h-full transition-all duration-300',
              isExpired
                ? 'bg-zinc-400 dark:bg-zinc-500'
                : 'bg-emerald-500 dark:bg-emerald-400'
            )}
            style={{ width: `${percentAttended}%` }}
          />
        </div>

        {/* Bonus / Gift info note */}
        {pkg.bonusText && pkg.bonusText !== '--' && (
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 pt-0.5">
            <Gift className="h-3 w-3 text-indigo-600 shrink-0" />
            <span className="font-medium truncate">{pkg.bonusText}</span>
          </div>
        )}
      </div>

      {/* ── CỤM THÔNG TIN VẬN HÀNH: LỚP, LỊCH, GIÁO VIÊN ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        {/* Cột 1: Lớp & Lịch học */}
        <div className="p-2 rounded-lg bg-background border border-border/50 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{pkg.className || 'Chưa ghép lớp'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate">{pkg.schedule || 'Lịch linh hoạt'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{pkg.branchName || 'RinoEdu Nguyễn Tuân'}</span>
          </div>
        </div>

        {/* Cột 2: Giáo viên & CS phụ trách */}
        <div className="p-2 rounded-lg bg-background border border-border/50 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{pkg.primaryTeacher?.name || 'GV. Sarah Smith'}</span>
          </div>
          {pkg.assistantTeacher?.name && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">TA: {pkg.assistantTeacher.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80">
            <User className="h-3 w-3 shrink-0 text-sky-600" />
            <span className="truncate">CS: {pkg.csStaff || 'CSM Minh Phương'}</span>
          </div>
        </div>

        {/* Cột 3: Thời hạn & Hiệu lực */}
        <div className="p-2 rounded-lg bg-background border border-border/50 space-y-1">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-muted-foreground">Bắt đầu:</span>
            <span className="font-semibold text-foreground font-mono">{pkg.startDate || '25/07/2026'}</span>
          </div>
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-muted-foreground">Dự kiến hết:</span>
            <span className="font-semibold text-foreground font-mono">{pkg.expectedEndDate || '16/10/2026'}</span>
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-muted-foreground/80 pt-0.5 border-t border-border/30">
            <span>Hạn dùng:</span>
            <span className="font-mono">{pkg.expiryDate || '25/07/2027'}</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ACTIONS (BỎ NÚT ĐƠN HÀNG Ở FOOTER, CHỈ GIỮ NÚT NGHIỆP VỤ) ── */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigateToLearning?.(pkg)}
            className="h-7 px-2.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer gap-1"
            title="Đồng bộ sang tab Học tập để xem nhật ký buổi học và lộ trình"
          >
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span>Chi tiết học tập</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* Nút Tái phí khi gói còn ít buổi */}
          {!isExpired && (isLowSessions || isWarningSessions) && (
            <Button
              type="button"
              size="sm"
              onClick={() => onRenewalClick?.(pkg)}
              className="h-7 px-3 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
              title="Gia hạn hoặc kích hoạt ca chăm sóc tái phí cho gói học này"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Tái phí gói</span>
            </Button>
          )}

          {/* Nút Đơn bảo lưu */}
          {pkg.status === 'active' && onOpenLeaveReserve && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenLeaveReserve}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              title="Tạo đơn bảo lưu hoặc xin nghỉ phép cho gói học này"
            >
              <span>Bảo lưu</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
