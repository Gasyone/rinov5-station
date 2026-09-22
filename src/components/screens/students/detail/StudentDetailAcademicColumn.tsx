'use client'

import { useState } from 'react'
import {
  GraduationCap,
  Clock,
  User,
  MapPin,
  Users,
  AlertCircle,
  ArrowRightLeft,
  CalendarOff,
  Snowflake,
  LogOut,
  Plus,
  History,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Layers,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'
import type { EnrolledClass } from '@/mocks/students'

export interface StudentDetailAcademicColumnProps {
  program: StudentProgram
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  activeDeductingPackage?: StudentPackage | null
  nextQueuedPackage?: StudentPackage | null
  onOpenAssignClass: (packageId?: string) => void
  onLeaveClass?: () => void
  onReserveClass?: () => void
  onDropClass?: (classCode: string) => void
}

export function StudentDetailAcademicColumn({
  program,
  studentBranch,
  activeDeductingPackage,
  nextQueuedPackage,
  onOpenAssignClass,
  onLeaveClass,
  onReserveClass,
  onDropClass,
}: StudentDetailAcademicColumnProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true)

  const currentClass: EnrolledClass | null = program.currentClass
  const isEnrolled = Boolean(currentClass && program.programStatus === 'active')
  const isReserved = program.programStatus === 'reserved'

  const formatScheduleText = (cls: EnrolledClass) => {
    if (!cls.scheduleSlots || cls.scheduleSlots.length === 0) {
      return 'Thứ 2 & Thứ 4 (18:00 - 19:30)'
    }
    return cls.scheduleSlots
      .map((s) => `${s.dayOfWeek || ('date' in s ? (s as { date?: string }).date : '')} ${s.startTime}-${s.endTime}`)
      .join(' • ')
  }

  return (
    <div className="flex flex-col space-y-3.5 min-h-0">
      {/* ── 1. TIÊU ĐỀ KHỐI ĐÀO TẠO ── */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-primary/10 text-primary">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Tiến trình Học tập & Lớp học
          </span>
        </div>
        <StatusBadge
          status={isReserved ? 'reserved' : isEnrolled ? 'active' : 'wait_for_assignment'}
          label={isReserved ? 'Đang bảo lưu' : isEnrolled ? 'Đang học' : 'Chờ ghép lớp'}
          className="text-[10px] py-0 px-2 font-semibold"
        />
      </div>

      {/* ── 2. THẺ LỚP ĐANG HỌC HIỆN TẠI ── */}
      {isEnrolled && currentClass ? (
        <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-3.5 shadow-2xs hover:border-primary/40 transition-colors">
          {/* Header thẻ lớp */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/40 pb-2.5">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  📌 Lớp đang học
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  {currentClass.className}
                </span>
                <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                  {currentClass.classCode}
                </span>
              </div>
              <div className="text-[11.5px] text-muted-foreground flex items-center gap-2 pt-0.5">
                <span>Trình độ: <strong className="text-foreground font-semibold">{currentClass.level || program.level || 'Tiêu chuẩn'}</strong></span>
                {currentClass.subLevel && <span>({currentClass.subLevel})</span>}
                <span className="text-border">•</span>
                <span>Cơ sở: <strong className="text-foreground">{currentClass.branch || studentBranch}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0 bg-muted/40 px-2 py-1 rounded-md">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Sĩ số: <strong className="text-foreground font-bold">15/20</strong> (+2 mới)</span>
            </div>
          </div>

          {/* Lịch học & Giáo viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg border border-border/30">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate font-medium">{formatScheduleText(currentClass)}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg border border-border/30">
              <User className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">GV: <strong className="text-foreground font-medium">{currentClass.teacherName || 'Hoàng Thị Mai'}</strong></span>
              <span className="text-border">•</span>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{currentClass.room || 'Phòng A101'}</span>
            </div>
          </div>

          {/* Ngày bắt đầu & Số buổi đã học ở lớp này */}
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30 flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 opacity-70" />
              <span>Bắt đầu từ: <strong className="text-foreground">{currentClass.startDate || '01/07/2025'}</strong></span>
            </span>
            <span>
              Tiến độ tại lớp: <strong className="text-primary font-bold">{currentClass.progress || '16 / 24 buổi'}</strong>
            </span>
          </div>

          {/* Cơ sở & Nhân sự phụ trách theo lớp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/30">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">Cơ sở: <strong className="text-foreground font-semibold">{currentClass.branch || studentBranch}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="truncate">CSM: <strong className="text-foreground">{program.csmName || 'Minh Phương (CSM)'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Sales: <strong className="text-foreground">{program.saleName || 'Trần Thị Mai (Sales)'}</strong></span>
            </div>
          </div>

          {/* 🔗 DÒNG LIÊN KẾT NGUỒN TRỪ QUOTA (THE LINK) */}
          <div className="rounded-lg border border-indigo-200/80 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900/40 p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
              <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Nguồn cấp buổi học (Quota Sourcing):</span>
            </div>
            <div className="text-xs text-indigo-800/90 dark:text-indigo-300/90 flex items-center gap-1.5 flex-wrap">
              <span>Đang cấn trừ:</span>
              <strong className="font-semibold underline underline-offset-2">
                {activeDeductingPackage?.packageName || program.packages[0]?.packageName || 'Gói học hiện tại'}
              </strong>
              <span className="font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                (còn {activeDeductingPackage?.remainingSessions ?? program.remainingSessions} buổi)
              </span>

              {nextQueuedPackage && (
                <>
                  <span className="text-indigo-400">➔</span>
                  <span className="text-muted-foreground">Kế tiếp:</span>
                  <strong className="font-semibold text-foreground">
                    {nextQueuedPackage.packageName}
                  </strong>
                  <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    ({nextQueuedPackage.remainingSessions} buổi sẵn sàng)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Dòng nút thao tác lớp học */}
          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-border/30 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenAssignClass(activeDeductingPackage?.id)}
              className="h-7 px-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 hover:bg-indigo-100 dark:bg-indigo-950/30 cursor-pointer shadow-3xs"
              title="Chuyển học viên sang lớp học khác"
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
                className="h-7 px-2 text-xs font-semibold text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50/40 hover:bg-amber-100 dark:bg-amber-950/30 cursor-pointer shadow-3xs"
                title="Tạo đơn xin nghỉ phép buổi học"
              >
                <CalendarOff className="h-3.5 w-3.5 mr-1" />
                <span>Nghỉ phép</span>
              </Button>
            )}

            {onReserveClass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReserveClass}
                className="h-7 px-2 text-xs font-semibold text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 bg-sky-50/40 hover:bg-sky-100 dark:bg-sky-950/30 cursor-pointer shadow-3xs"
                title="Bảo lưu học phí / giữ lớp"
              >
                <Snowflake className="h-3.5 w-3.5 mr-1" />
                <span>Bảo lưu</span>
              </Button>
            )}

            {onDropClass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDropClass(currentClass.classCode)}
                className="h-7 px-2 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 bg-rose-50/40 hover:bg-rose-100 dark:bg-rose-950/30 cursor-pointer shadow-3xs"
                title="Rút học viên khỏi lớp này về trạng thái chờ ghép lớp"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                <span>Rút lớp</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* ── CASE CHƯA GHÉP LỚP HOẶC ĐANG BẢO LƯU ── */
        <div className="rounded-xl border border-amber-300/80 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                {isReserved ? 'Học viên đang trong thời gian bảo lưu' : 'Học viên chưa được phân bổ vào lớp học nào'}
              </div>
              <div className="text-xs text-amber-800/90 dark:text-amber-400/90">
                Học viên hiện còn <strong>{program.remainingSessions} buổi học</strong> khả dụng trong chương trình {program.name}.
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenAssignClass()}
            className="h-8 px-3.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Ghép lớp ngay</span>
          </Button>
        </div>
      )}

      {/* ── 3. DÒNG THỜI GIAN LỊCH SỬ CÁC LỚP TRƯỚC ĐÓ (TIMELINE) ── */}
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setIsHistoryExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <span>Lịch sử các lớp trước đó ({program.pastClasses.length})</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isHistoryExpanded && "rotate-180")} />
        </button>

        {isHistoryExpanded && (
          <div className="p-3 pt-0 space-y-3 border-t border-border/40 divide-y divide-border/40 animate-in fade-in duration-200">
            {program.pastClasses.length > 0 ? (
              program.pastClasses.map((cls, idx) => (
                <div key={cls.classCode || idx} className="pt-3 first:pt-1 space-y-1.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground">{cls.className}</span>
                      <span className="font-mono text-muted-foreground text-[11px]">({cls.classCode})</span>
                      <StatusBadge status="session_ended" label="Đã hoàn thành" className="text-[9.5px] py-0 px-1.5" />
                    </div>
                    <span className="text-muted-foreground text-[11.5px]">
                      Đã học: <strong className="text-foreground">{cls.usedSessions || 24}/{cls.totalSessions || 24} buổi</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{cls.scheduleSlots?.map((s) => `${s.dayOfWeek} ${s.startTime}-${s.endTime}`).join(' • ') || 'Thứ 2 & Thứ 5 (17:30 - 19:00)'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 shrink-0" />
                      <span>GV: {cls.teacherName || 'GV_HuiLT20'}</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{cls.room || 'Phòng B201'}</span>
                    </div>
                  </div>

                  {cls.finalOutcome && (
                    <div className="rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground space-y-0.5 border border-border/30">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Kết quả: {cls.finalOutcome}</span>
                      </div>
                      {cls.teacherFinalFeedback && (
                        <p className="italic pl-5">&ldquo;{cls.teacherFinalFeedback}&rdquo;</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground italic">
                Chưa có lịch sử lớp học trước đó trong chương trình này.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
