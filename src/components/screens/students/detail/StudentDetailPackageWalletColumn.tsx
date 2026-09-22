'use client'

import { useState } from 'react'
import {
  Wallet,
  Calendar,
  AlertTriangle,
  ChevronDown,
  History,
  MoreVertical,
  Snowflake,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  CalendarPlus,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'

export interface StudentDetailPackageWalletColumnProps {
  program: StudentProgram
  activeDeductingPackage?: StudentPackage | null
  nextQueuedPackage?: StudentPackage | null
  otherActivePackages?: StudentPackage[]
  historicalPackages?: StudentPackage[]
  onReservePackage?: (packageId: string) => void
  onOpenAssignClass: (packageId?: string) => void
}

export function StudentDetailPackageWalletColumn({
  program,
  activeDeductingPackage,
  nextQueuedPackage,
  otherActivePackages = [],
  historicalPackages = [],
  onReservePackage,
  onOpenAssignClass,
}: StudentDetailPackageWalletColumnProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  // Program-level quota statistics
  const totalSessions = program.totalSessions || program.packages.reduce((acc, p) => acc + p.totalSessions, 0)
  const remainingSessions = program.remainingSessions ?? program.packages.reduce((acc, p) => acc + p.remainingSessions, 0)
  const studiedSessions = Math.max(0, totalSessions - remainingSessions)
  const overallPercent = totalSessions > 0 ? Math.min(100, Math.round((studiedSessions / totalSessions) * 100)) : 0

  // Target level & assessment data
  const activeLevel = program.level || 'Chưa phân cấp'
  const activeSubLevel = program.subLevel
  const activeEntryScore = program.entryScore || '8.5 / 10'
  const activeScoreEvaluation = program.entryScoreEvaluation || 'Khá giỏi (Tư duy tốt)'
  const activeAssessment = program.assessmentNote || 'Học viên tích cực, phản xạ tốt, hoàn thành đầy đủ bài kiểm tra chẩn đoán đầu vào.'

  // Available schedule slots
  const availableSlots = program.availableSlots && program.availableSlots.length > 0 ? program.availableSlots : [
    { id: 'slot-1', dayOfWeek: 'Thứ 3 & Thứ 6', timeRange: '17:30 - 19:00', isPreferred: true, note: 'Ưu tiên ca tối' },
    { id: 'slot-2', dayOfWeek: 'Thứ 7', timeRange: '09:00 - 10:30', isPreferred: false, note: 'Lịch bổ trợ cuối tuần' },
  ]

  const handleExtendExpiry = (pkg: StudentPackage) => {
    toast.success(`Đã gia hạn thêm 30 ngày cho gói ${pkg.packageName}!`, {
      description: `Hạn dùng mới: 30 ngày kể từ hạn hiện tại.`,
    })
  }

  return (
    <div className="flex flex-col space-y-3.5 min-h-0">
      {/* ── 1. TRÌNH ĐỘ & MỤC TIÊU ĐÀO TẠO (Trình độ mục tiêu trên gói học) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2 shadow-3xs text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="uppercase tracking-wider text-[11px]">Trình độ & Mục tiêu</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
            Chương trình {program.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
            <span className="text-muted-foreground block text-[10.5px]">Trình độ môn học:</span>
            <strong className="text-foreground font-semibold text-xs">{activeLevel} {activeSubLevel ? `(${activeSubLevel})` : ''}</strong>
          </div>
          <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
            <span className="text-muted-foreground block text-[10.5px]">Điểm test đầu vào:</span>
            <div className="flex items-center gap-1.5">
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">{activeEntryScore}</strong>
              {activeScoreEvaluation && <span className="text-[10px] text-muted-foreground font-normal">({activeScoreEvaluation})</span>}
            </div>
          </div>
        </div>

        {activeAssessment && (
          <p className="text-[11px] text-foreground/80 leading-relaxed bg-muted/30 p-2 rounded-lg border border-border/30 italic">
            &ldquo;{activeAssessment}&rdquo;
          </p>
        )}
      </div>

      {/* ── 2. KHUNG GIỜ HỌC VIÊN RẢNH (Khung giờ để mặc định ở trên gói học) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-3xs text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="uppercase tracking-wider text-[11px]">Khung giờ học viên rảnh</span>
          </div>
          <span className="text-[10.5px] text-muted-foreground">
            Mặc định theo tuần
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-2 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 dark:text-amber-200 text-[11.5px]">
                  {slot.dayOfWeek}
                </span>
                {slot.isPreferred && (
                  <span className="text-[8.5px] px-1 py-0.2 rounded bg-amber-200/80 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold">
                    Ưu tiên
                  </span>
                )}
              </div>
              <span className="font-mono text-muted-foreground text-[11px] block">
                {slot.timeRange}
              </span>
              {slot.note && (
                <span className="text-[10px] text-muted-foreground italic block truncate">
                  {slot.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. TIÊU ĐỀ KHỐI VÍ GÓI HỌC & THỐNG KÊ QUOTA ── */}
      <div className="flex items-center justify-between px-0.5 pt-1 border-t border-border/30">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Ví Gói Học & Quota Số Buổi
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Thứ tự cấn trừ FIFO
        </span>
      </div>

      {/* ── 2. CARD TỔNG QUOTA TOÀN CHƯƠNG TRÌNH ── */}
      <div className="rounded-xl border border-border/80 bg-gradient-to-r from-emerald-50/40 via-background to-transparent dark:from-emerald-950/20 p-3 space-y-2 shadow-3xs">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 font-semibold">
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Tổng: </span>
              <strong className="text-foreground font-bold">{totalSessions}b</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Đã học: </span>
              <strong className="text-primary font-bold">{studiedSessions}b</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Còn lại: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{remainingSessions}b</strong>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {overallPercent}%
          </span>
        </div>

        {/* Progress bar tổng */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              overallPercent >= 100
                ? "bg-muted-foreground"
                : overallPercent > 80
                ? "bg-amber-500"
                : "bg-emerald-500"
            )}
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* ── 3. DANH SÁCH GÓI HỌC XẾP THEO THỨ TỰ CẤN TRỪ ── */}
      <div className="space-y-3">
        {/* ── A. GÓI ĐANG CẤN TRỪ (ACTIVE / DEDUCTING) ── */}
        {activeDeductingPackage ? (
          <div className="rounded-xl border-2 border-primary/40 bg-card p-3.5 space-y-3 shadow-2xs relative overflow-hidden">
            {/* Tag Đang cấn trừ */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-foreground">
                    {activeDeductingPackage.packageName}
                  </span>
                  <span className="font-mono text-[10.5px] text-muted-foreground bg-muted/70 px-1.5 py-0.2 rounded">
                    {activeDeductingPackage.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    🟢 Đang cấn trừ
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 opacity-70" />
                    Hạn dùng: {activeDeductingPackage.purchaseDate || '15/01/2025'} ➔ {activeDeductingPackage.endDate || '28/08/2025'}
                  </span>
                </div>
              </div>

              {/* Thao tác gói */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 text-xs">
                  <DropdownMenuItem
                    onClick={() => handleExtendExpiry(activeDeductingPackage)}
                    className="cursor-pointer gap-2"
                  >
                    <CalendarPlus className="h-4 w-4 text-primary shrink-0" />
                    <span>Gia hạn thêm 30 ngày</span>
                  </DropdownMenuItem>
                  {onReservePackage && (
                    <DropdownMenuItem
                      onClick={() => onReservePackage(activeDeductingPackage.id)}
                      className="cursor-pointer gap-2 text-sky-700 dark:text-sky-400"
                    >
                      <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
                      <span>Bảo lưu gói này</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onOpenAssignClass(activeDeductingPackage.id)}
                    className="cursor-pointer gap-2 text-indigo-700 dark:text-indigo-400"
                  >
                    <ArrowRightLeft className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>Chuyển sang lớp khác</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quota buổi & Progress bar của gói */}
            <div className="rounded-lg bg-muted/40 p-2.5 space-y-1.5 border border-border/40 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>
                    Đã học: <strong className="text-primary font-bold">{Math.max(0, activeDeductingPackage.totalSessions - activeDeductingPackage.remainingSessions)}</strong>/{activeDeductingPackage.totalSessions} buổi
                  </span>
                  <span className="text-border">•</span>
                  <span>
                    Còn lại: <strong className={cn(
                      activeDeductingPackage.remainingSessions <= 3 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"
                    )}>
                      {activeDeductingPackage.remainingSessions} buổi
                    </strong>
                  </span>
                </div>
                {activeDeductingPackage.remainingSessions <= 3 && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    Sắp hết phí
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    activeDeductingPackage.remainingSessions <= 3 ? "bg-amber-500" : "bg-primary"
                  )}
                  style={{
                    width: `${Math.min(100, Math.round(((activeDeductingPackage.totalSessions - activeDeductingPackage.remainingSessions) / activeDeductingPackage.totalSessions) * 100))}%`
                  }}
                />
              </div>

              {/* Ghi chú cấn trừ */}
              <div className="text-[11px] text-muted-foreground pt-0.5 flex items-center justify-between">
                <span>🎯 Đang cấp buổi cho: <strong className="text-foreground">{program.currentClass?.className || 'Lớp học hiện tại'}</strong></span>
                <span className="font-mono text-[10px]">Ưu tiên #1</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/70">
            Chưa có gói học nào đang ở trạng thái kích hoạt cấn trừ.
          </div>
        )}

        {/* ── B. GÓI CHỜ GỐI ĐẦU (QUEUED / NEXT IN LINE) ── */}
        {nextQueuedPackage && (
          <div className="rounded-xl border border-dashed border-border/80 bg-card p-3 space-y-2.5 shadow-3xs">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-foreground">
                    {nextQueuedPackage.packageName}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted/70 px-1.5 py-0.2 rounded">
                    {nextQueuedPackage.id}
                  </span>
                  <span className="text-[9.5px] font-semibold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none">
                    🟡 Chờ gối đầu
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 opacity-70" />
                  <span>Hạn dùng: {nextQueuedPackage.purchaseDate || '01/04/2025'} ➔ {nextQueuedPackage.endDate || '29/06/2026'}</span>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                {nextQueuedPackage.remainingSessions} buổi
              </span>
            </div>

            <div className="p-2 rounded-lg bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200/50 text-[11px] text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Sẽ tự động chuyển tiếp trừ quota khi gói <strong>{activeDeductingPackage?.packageName || 'hiện tại'}</strong> hết buổi.</span>
            </div>
          </div>
        )}

        {/* ── C. CÁC GÓI HOẠT ĐỘNG KHÁC (NẾU CÓ) ── */}
        {otherActivePackages.map((pkg) => (
          <div key={pkg.id} className="rounded-xl border border-border/70 bg-card p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground">{pkg.packageName}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{pkg.id}</span>
              </div>
              <StatusBadge status={pkg.status} className="text-[9.5px] py-0 px-1.5" />
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span>Hạn dùng: {pkg.endDate || '—'}</span>
              <span>Khả dụng: <strong className="text-foreground">{pkg.remainingSessions}/{pkg.totalSessions} buổi</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. GÓI LỊCH SỬ / ĐÃ KẾT THÚC / HẾT HẠN (COLLAPSIBLE) ── */}
      {historicalPackages.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsHistoryExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Gói đã dùng hết / Kết thúc ({historicalPackages.length})</span>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isHistoryExpanded && "rotate-180")} />
          </button>

          {isHistoryExpanded && (
            <div className="p-2.5 pt-0 space-y-2 border-t border-border/40 divide-y divide-border/30 text-xs animate-in fade-in duration-200">
              {historicalPackages.map((hp) => (
                <div key={hp.id} className="pt-2 first:pt-1 space-y-0.5 text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{hp.packageName}</span>
                    <span className="font-mono text-[10.5px]">{hp.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Đã hoàn thành {hp.totalSessions}/{hp.totalSessions} buổi
                    </span>
                    <span>Hạn: {hp.endDate || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
