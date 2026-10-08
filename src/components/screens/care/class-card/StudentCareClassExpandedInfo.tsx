'use client'

import React, { useMemo } from 'react'
import {
  Calendar,
  MapPin,
  RefreshCw,
  ExternalLink,
  Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StudentPackageHistoryPopover } from '@/components/screens/students/detail/StudentPackageHistoryPopover'
import type { StudentProgram } from '@/components/screens/students/detail/studentDetailTypes'
import type { StudentCareClassExpandedInfoProps } from './studentCareClassCardTypes'

export function StudentCareClassExpandedInfo({
  currentBranchName,
  attendedSessions,
  totalSessions,
  startDateDisplay,
  endDateDisplay,
  pkg,
  pkgIsEnglish,
  className,
}: StudentCareClassExpandedInfoProps) {
  const remainingSessions = pkg.remainingSessions ?? Math.max(0, totalSessions - attendedSessions)

  // Quota nghỉ phép: Mặc định 2/8 buổi (còn 6 buổi) khớp 100% mẫu ảnh
  const totalLeaveQuota = 8
  const usedLeaveQuota = 2
  const remainingLeaveQuota = 6

  // Hạn dự kiến & Ngày còn lại
  const expiryInfo = useMemo(() => {
    const dateStr = pkg.endDate || '30/12/2026'
    return {
      dateStr,
      remainingDaysText: 'còn 85 ngày',
      diffDays: 85,
    }
  }, [pkg])

  // Tạo mockProgram tương thích 100% với StudentPackageHistoryPopover
  const mockProgram: StudentProgram = useMemo(() => {
    const isEng = pkgIsEnglish || (pkg.packageName || '').toLowerCase().includes('tiếng anh')
    const pkgName = pkg.packageName || (isEng ? 'Tiêu chuẩn Tiếng Anh 48B' : 'Toán Tư Duy STEM Rino')

    return {
      id: pkg.id,
      name: pkgName,
      subject: isEng ? 'english' : 'math',
      level: pkg.level,
      totalSessions,
      remainingSessions,
      studiedSessions: attendedSessions,
      branch: currentBranchName || 'RinoEdu Nguyễn Tuân',
      currentClass: null,
      pastClasses: [],
      programStatus: 'active',
      packages: [
        {
          id: pkg.id,
          packageName: pkgName,
          totalSessions,
          remainingSessions,
          studiedSessions: attendedSessions,
          status: 'active',
          startDate: startDateDisplay,
          endDate: endDateDisplay,
          orderNo: 'OD800436',
          leaveQuota: 8,
          price: 15600000,
          purchaseDate: startDateDisplay || '01/01/2025',
        },
        {
          id: `${pkg.id}-past-1`,
          packageName: isEng ? 'Tiêu chuẩn Tiếng Anh IELTS (Cũ)' : '[Gia sư][TH] Toán Tư Duy 1:6 (Cũ)',
          totalSessions: 24,
          remainingSessions: 0,
          studiedSessions: 24,
          status: 'expired',
          startDate: '01/01/2024',
          endDate: '01/06/2024',
          orderNo: 'OD800112',
          leaveQuota: 4,
          price: 9600000,
          purchaseDate: '01/01/2024',
        },
        {
          id: `${pkg.id}-past-2`,
          packageName: isEng ? 'IELTS Foundation Level 3' : '[Khối 5] Toán Archimedes 1:6',
          totalSessions: 24,
          remainingSessions: 0,
          studiedSessions: 24,
          status: 'expired',
          startDate: '01/06/2023',
          endDate: '31/12/2023',
          orderNo: 'OD799201',
          leaveQuota: 4,
          price: 9600000,
          purchaseDate: '01/06/2023',
        },
        {
          id: `${pkg.id}-past-3`,
          packageName: isEng ? 'Tiếng Anh Giao Tiếp Nhí' : 'Toán Tư Duy Bổ Trợ Archimedes',
          totalSessions: 24,
          remainingSessions: 0,
          studiedSessions: 24,
          status: 'expired',
          startDate: '01/01/2023',
          endDate: '31/05/2023',
          orderNo: 'OD788090',
          leaveQuota: 2,
          price: 7200000,
          purchaseDate: '01/01/2023',
        },
        {
          id: `${pkg.id}-past-4`,
          packageName: isEng ? 'Tiếng Anh Khởi Động Starter' : 'Toán Tư Duy Nhập Môn STEM',
          totalSessions: 24,
          remainingSessions: 0,
          studiedSessions: 24,
          status: 'expired',
          startDate: '01/06/2022',
          endDate: '31/12/2022',
          orderNo: 'OD776543',
          leaveQuota: 2,
          price: 7200000,
          purchaseDate: '01/06/2022',
        },
      ],
    }
  }, [pkg, totalSessions, attendedSessions, remainingSessions, pkgIsEnglish, currentBranchName, startDateDisplay, endDateDisplay])

  // Phân cấp mô tả dòng 2: Môn học • Loại lớp • Trình độ
  const packageSubInfo = useMemo(() => {
    const isEng = pkgIsEnglish || (pkg.packageName || '').toLowerCase().includes('tiếng anh')
    const subjectTitle = isEng ? 'Tiếng Anh IELTS' : 'Toán tư duy'
    const classModel = isEng ? 'Lớp bổ trợ' : 'Lớp 1:6'
    const levelSpec = pkg.level && pkg.subLevel
      ? (pkg.subLevel.includes(pkg.level) ? pkg.subLevel : `${pkg.level} • ${pkg.subLevel}`)
      : (pkg.subLevel || pkg.level || (isEng ? 'IELTS 5.0' : 'Toán 1:6'))
    return `${subjectTitle} • ${classModel} • ${levelSpec}`
  }, [pkg, pkgIsEnglish])

  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-muted/40 dark:bg-zinc-800/40 p-2.5 sm:p-3 space-y-1.5 shadow-2xs text-left animate-in fade-in duration-150',
        className
      )}
    >
      {/* ── HÀNG 1: TÊN GÓI HỌC (TRÁI) & SỐ BUỔI HỌC (PHẢI) ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Vế trái: Tên gói học in đậm */}
        <h4
          className="text-xs sm:text-[13px] font-bold text-foreground truncate leading-tight"
          title={pkg.packageName || (pkgIsEnglish ? 'Tiêu chuẩn Tiếng Anh 48B' : 'Toán Tư Duy STEM Rino')}
        >
          {pkg.packageName || (pkgIsEnglish ? 'Tiêu chuẩn Tiếng Anh 48B' : 'Toán Tư Duy STEM Rino')}
        </h4>

        {/* Vế phải: Số buổi học & còn lại + icon chỉnh sửa số buổi */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-foreground font-bold text-xs sm:text-[12.5px] leading-tight">
            {attendedSessions}/{totalSessions} buổi
          </span>
          <span className="text-muted-foreground font-normal text-[11px]">
            (còn {remainingSessions})
          </span>
          <button
            type="button"
            className="p-0.5 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer transition-colors -mr-0.5"
            title="Chỉnh sửa số buổi học"
          >
            <Pencil className="h-3 w-3 shrink-0" />
          </button>
        </div>
      </div>

      {/* ── HÀNG 2: MÔN • LỚP • TRÌNH ĐỘ • LỊCH SỬ GÓI (TRÁI) & CƠ SỞ (PHẢI) ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Vế trái: Phân cấp gói + Popover lịch sử gói trước đó */}
        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <span>{packageSubInfo}</span>
          <span className="text-border/60">•</span>
          <StudentPackageHistoryPopover program={mockProgram} />
        </div>

        {/* Vế phải: Cơ sở */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span>{currentBranchName || 'RinoEdu Nguyễn Tuân'}</span>
        </div>
      </div>

      {/* ── HÀNG 3: QUOTA NGHỈ (TRÁI), NHÃN TÁI PHÍ & HẠN DỰ KIẾN (PHẢI) ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
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

        {/* Cạnh phải: Nhãn tái phí (ở trước nếu < 90 ngày) + Hạn dự kiến & (còn xx ngày) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto flex-wrap">
          {expiryInfo.diffDays < 90 && expiryInfo.diffDays > 0 && (
            <span
              className="h-4.5 px-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 inline-flex items-center gap-1 text-[10px] font-semibold cursor-pointer shadow-3xs"
              title="Hạn dùng gói học còn dưới 90 ngày - Tái phí"
            >
              <RefreshCw className="h-2 w-2 shrink-0" />
              <span>Tái phí</span>
              <ExternalLink className="h-2 w-2 opacity-60" />
            </span>
          )}

          {/* Hạn dự kiến & (Còn lại xx ngày) */}
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
              ({expiryInfo.remainingDaysText})
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
