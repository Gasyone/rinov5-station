'use client'

import { useMemo } from 'react'
import {
  Calendar,
  MapPin,
  RefreshCw,
  ExternalLink,
  Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentProgram } from './studentDetailTypes'
import { StudentPackageHistoryPopover } from './StudentPackageHistoryPopover'

export interface StudentProgramQuotaSummaryCardProps {
  program: StudentProgram
  studentBranch?: string
  isExpanded?: boolean
  onOpenRenewalDetail?: () => void
  onEditSessions?: () => void
  className?: string
}

export function StudentProgramQuotaSummaryCard({
  program,
  studentBranch,
  isExpanded = true,
  onOpenRenewalDetail,
  onEditSessions,
  className,
}: StudentProgramQuotaSummaryCardProps) {
  // Thống kê số buổi của từng gói/chương trình đang chọn
  const totalSessions = program.totalSessions || 24
  const remainingSessions = program.remainingSessions ?? 0
  const studiedSessions = program.studiedSessions ?? Math.max(0, totalSessions - remainingSessions)

  // Quota nghỉ phép: Tổng, Đã dùng, Còn lại
  const { totalLeaveQuota, usedLeaveQuota, remainingLeaveQuota } = useMemo(() => {
    let total = 8
    if (program.id === 'track-math-1-6') {
      total = 8
    } else if (program.id === 'track-math-arch') {
      total = 4
    } else if (program.id.startsWith('track-') && program.remainingSessions === 0) {
      total = 0
    } else {
      const sum = program.packages.reduce((acc, p) => acc + (p.leaveQuota ?? 0), 0)
      total = sum > 0 ? sum : 2
    }

    // Tính số buổi nghỉ có phép đã dùng từ lớp hiện tại + các lớp đã học trong quá khứ
    const currentExcused = program.currentClass?.excusedAbsences ?? 0
    const pastExcused = (program.pastClasses || []).reduce(
      (acc, cls) => acc + (cls.excusedAbsences ?? 0),
      0
    )
    let used = currentExcused + pastExcused

    // Đảm bảo dữ liệu demo hợp lý nếu chưa có số liệu lớp
    if (used === 0 && total > 0) {
      if (program.id === 'track-math-1-6') used = 2
      else if (program.id === 'track-math-arch') used = 1
    }
    if (used > total) used = total

    const remaining = Math.max(0, total - used)

    return {
      totalLeaveQuota: total,
      usedLeaveQuota: used,
      remainingLeaveQuota: remaining,
    }
  }, [program])

  // Hạn dự kiến & Ngày còn lại
  const expiryInfo = useMemo(() => {
    if (program.id === 'track-math-1-6') {
      // Dưới 90 ngày (còn 85 ngày) để hiển thị nhãn Tái phí
      return { dateStr: '30/12/2026', remainingDaysText: 'Còn 85 ngày', diffDays: 85 }
    }
    if (program.id === 'track-math-arch') {
      // Trên 90 ngày (còn 260 ngày) -> KHÔNG hiển thị nhãn Tái phí
      return { dateStr: '30/06/2027', remainingDaysText: 'Còn 260 ngày', diffDays: 260 }
    }
    if (program.remainingSessions === 0) {
      return { dateStr: program.endDate || '10/07/2023', remainingDaysText: 'Đã hết buổi', diffDays: 0 }
    }

    const dates = program.packages
      .map((p) => p.endDate)
      .filter((d): d is string => Boolean(d))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    if (dates.length === 0) return { dateStr: program.endDate || '—', remainingDaysText: 'Còn 118 ngày', diffDays: 118 }
    const latestDateStr = dates[dates.length - 1]
    const d = new Date(latestDateStr)
    if (isNaN(d.getTime())) return { dateStr: latestDateStr, remainingDaysText: 'Còn 118 ngày', diffDays: 118 }

    const formattedDate = d.toLocaleDateString('vi-VN')
    const now = new Date()
    let diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays <= 0 && remainingSessions > 0) {
      diffDays = Math.max(30, remainingSessions * 7)
    }

    let remainingDaysText = ''
    if (diffDays > 0) {
      remainingDaysText = `Còn ${diffDays} ngày`
    } else if (diffDays === 0) {
      remainingDaysText = 'Hết hạn hôm nay'
    } else {
      remainingDaysText = `Đã quá hạn ${Math.abs(diffDays)} ngày`
    }

    return {
      dateStr: formattedDate,
      remainingDaysText,
      diffDays,
    }
  }, [program, remainingSessions])

  // Xác định tên gói và phân cấp thông tin khớp 100% mẫu ảnh
  const packageDisplayName = useMemo(() => {
    if (program.packages && program.packages.length > 0 && program.packages[0].packageName) {
      return program.packages[0].packageName
    }
    const cleanName = program.name.replace(/^\[.*?\]\s*/, '')
    return `Gói ${cleanName} (${totalSessions} buổi)`
  }, [program, totalSessions])

  const packageSubInfo = useMemo(() => {
    const isEng = program.subject === 'english' || program.name.toLowerCase().includes('tiếng anh')
    const subjectTitle = isEng ? 'Tiếng Anh IELTS' : 'Toán tư duy'
    const classModel = isEng ? 'Lớp bổ trợ' : 'Lớp 1:6'
    const teacherOrBranch = isEng ? 'Giáo viên Việt Nam' : (program.level || 'Khối 5 Archimedes')
    return `${subjectTitle} • ${classModel} • ${teacherOrBranch}`
  }, [program])

  return (
    <div
      className={cn(
        'space-y-1 text-left animate-in fade-in duration-150',
        className
      )}
    >
      {/* ── DÒNG 1: TÊN GÓI HỌC (TRÁI) & SỐ BUỔI HỌC (PHẢI) - LUÔN HIỂN THỊ CẢ KHI THU GỌN ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Tên gói học */}
        <h4
          className="text-xs sm:text-[13px] font-bold text-foreground truncate leading-tight flex-1 min-w-0"
          title={packageDisplayName}
        >
          {packageDisplayName}
        </h4>

        {/* Số buổi học */}
        <div className="flex items-center gap-1.5 text-xs shrink-0 text-right ml-auto">
          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-foreground font-bold text-xs sm:text-[12.5px] leading-tight">
            {studiedSessions}/{totalSessions} buổi
          </span>
          <span className="text-muted-foreground font-normal text-[11px]">
            (còn {remainingSessions})
          </span>
          {onEditSessions && (
            <button
              type="button"
              onClick={onEditSessions}
              className="p-0.5 rounded hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors cursor-pointer inline-flex items-center justify-center ml-0.5"
              title="Chỉnh sửa số buổi học"
              aria-label="Chỉnh sửa số buổi học"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── NỘI DUNG MỞ RỘNG: DÒNG 2 (MÔ TẢ, CƠ SỞ) & DÒNG 3 (QUOTA, TÁI PHÍ, HẠN DÙNG) ── */}
      {isExpanded && (
        <div className="space-y-1 pt-0.5 animate-in fade-in duration-150">
          {/* Dòng 2: Phân cấp/mô tả (trái) & Cơ sở (phải) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span>{packageSubInfo}</span>
              {program.packages && program.packages.length > 1 && (
                <>
                  <span className="text-border/60">•</span>
                  <StudentPackageHistoryPopover program={program} />
                </>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-auto">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span>{program.branch || studentBranch || 'RinoEdu Nguyễn Tuân'}</span>
            </div>
          </div>

          {/* Dòng 3 (Footer): Quota nghỉ (trái) & Nhãn tái phí, Hạn dự kiến (phải) */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
            {/* Cạnh trái: Quota nghỉ */}
            <div className="flex items-center gap-1">
              <span>Quota nghỉ:</span>
              <strong className="text-foreground font-semibold">
                {usedLeaveQuota}/{totalLeaveQuota} buổi
              </strong>
              <span className="text-muted-foreground font-normal">
                (còn {remainingLeaveQuota} buổi)
              </span>
            </div>

            {/* Cạnh phải: Nhãn tái phí + Hạn dự kiến */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto flex-wrap">
              {expiryInfo.diffDays < 90 && expiryInfo.diffDays > 0 && (
                onOpenRenewalDetail ? (
                  <button
                    type="button"
                    onClick={onOpenRenewalDetail}
                    className="h-4.5 px-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/40 inline-flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer shadow-3xs"
                    title="Hạn dùng gói học còn dưới 90 ngày - Mở màn Tái phí"
                  >
                    <RefreshCw className="h-2 w-2 shrink-0" />
                    <span>Tái phí</span>
                    <ExternalLink className="h-2 w-2 opacity-60" />
                  </button>
                ) : (
                  <span className="h-4.5 px-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 inline-flex items-center gap-1 text-[10px] font-semibold">
                    <RefreshCw className="h-2 w-2 shrink-0" />
                    <span>Tái phí</span>
                  </span>
                )
              )}

              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Hạn dự kiến:</span>
                <strong className="text-foreground font-semibold">{expiryInfo.dateStr}</strong>
                <span
                  className={cn(
                    'font-normal',
                    expiryInfo.diffDays < 90 && expiryInfo.diffDays > 0
                      ? 'text-amber-700/80 dark:text-amber-400/80'
                      : 'text-muted-foreground'
                  )}
                >
                  ({expiryInfo.remainingDaysText.toLowerCase().startsWith('còn')
                    ? expiryInfo.remainingDaysText.toLowerCase()
                    : `còn ${expiryInfo.remainingDaysText.toLowerCase()}`})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
