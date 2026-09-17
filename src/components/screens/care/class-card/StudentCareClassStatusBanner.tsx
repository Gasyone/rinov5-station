'use client'

import React from 'react'
import {
  Snowflake,
  ArrowRightLeft,
  ArrowLeftRight,
  UserX,
  CreditCard,
  CalendarClock,
  Sparkles,
  GraduationCap,
  AlertCircle,
  FileEdit,
  FileText,
  RotateCcw,
  ExternalLink,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import type { StudentCareClassStatusBannerProps } from './studentCareClassCardTypes'

export function StudentCareClassStatusBanner({
  placementStatus,
  student,
  pkg,
  classCode,
  assignedTargetClass,
  isHoldingClass,
  onOpenLeaveReserveDialog,
  onOpenEarlyReturnDialog,
  onOpenPlacementTab,
}: StudentCareClassStatusBannerProps) {
  // 1. Trạng thái ĐANG BẢO LƯU
  if (placementStatus === 'reserve') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 text-left">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Snowflake className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide text-xs">
              Khóa học đang bảo lưu
            </span>
            {isHoldingClass && (
              <StatusBadge
                status="reserve"
                label="Bảo lưu giữ lớp"
                className="text-xs py-0 px-1.5"
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Ngày học lại dự kiến:{' '}
            <strong className="font-semibold text-foreground">
              {isHoldingClass ? '16/09/2026' : '01/08/2026'}
            </strong>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap pt-0.5">
          <span>
            Thời gian:{' '}
            <strong className="font-semibold text-foreground">
              {isHoldingClass ? '15/06/2026 ➔ 15/09/2026' : '01/06/2026 ➔ 31/07/2026'}
            </strong>{' '}
            ({isHoldingClass ? '3 tháng' : '2 tháng'})
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {onOpenLeaveReserveDialog && (
              <button
                type="button"
                onClick={onOpenLeaveReserveDialog}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Xem đơn bảo lưu</span>
              </button>
            )}
            {onOpenLeaveReserveDialog && <span className="text-muted-foreground/30">•</span>}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onOpenEarlyReturnDialog}
              className="h-6 px-2 text-xs font-semibold text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 cursor-pointer shadow-3xs"
            >
              <RotateCcw className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" />
              <span>Đi học lại</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 2. Trạng thái CHỜ CHUYỂN LỚP
  if (placementStatus === 'pending_transfer') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide text-xs">
            Tiến trình chuyển lớp đang diễn ra
          </span>
          <StatusBadge
            status={assignedTargetClass ? 'dang_hoc' : 'pending_transfer'}
            label={assignedTargetClass ? 'Đã xếp lớp đích' : 'Chờ chuyển lớp'}
            className="text-xs py-0 px-1.5"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5 text-center">
          <div>
            <span>Lớp nguồn: </span>
            <strong className="font-semibold text-foreground">{student?.classCode || classCode}</strong>
            <span className="mx-1.5 text-sky-500">➔</span>
            <span>Lớp đích: </span>
            <strong
              className={
                assignedTargetClass
                  ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                  : 'font-semibold text-foreground'
              }
            >
              {assignedTargetClass || student?.targetClass || student?.destinationClass || 'Chưa ghép lớp'}
            </strong>
          </div>
        </div>
      </div>
    )
  }

  // 3. Trạng thái CHỜ XẾP LỚP
  if (placementStatus === 'wait_for_assignment') {
    return (
      <div className="pt-0.5 space-y-1.5 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <UserX className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-xs">
            {assignedTargetClass ? 'Học viên đã được ghép lớp' : 'Học viên chưa ghép lớp'}
          </span>
          <StatusBadge
            status={assignedTargetClass ? 'active' : 'wait_for_assignment'}
            label={assignedTargetClass ? 'Đã xếp lớp' : 'Chờ xếp lớp'}
            className="text-xs py-0 px-1.5"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-0.5 text-center flex-wrap">
          <div>
            <span>{assignedTargetClass ? 'Lớp tiếp nhận: ' : 'Gói đăng ký: '}</span>
            <strong
              className={
                assignedTargetClass
                  ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                  : 'font-semibold text-foreground'
              }
            >
              {assignedTargetClass || pkg.packageName || 'Gói Tiếng Anh Standard 48 buổi'}
            </strong>
          </div>
          {!assignedTargetClass && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onOpenPlacementTab}
              className="h-6 px-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 hover:bg-indigo-100 ml-1 cursor-pointer"
            >
              <UserPlus className="h-3 w-3 mr-1 text-indigo-500" />
              <span>Ghép lớp ngay</span>
              <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // 4. Trạng thái LỚP NHÁP
  if (placementStatus === 'draft_class') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
            <FileEdit className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide text-xs">
            Học viên đang ghép vào lớp nháp
          </span>
          <StatusBadge status="draft_class" label="Lớp nháp" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Lớp học đang ở trạng thái Nháp (chưa chốt sổ mở lớp). Vui lòng hoàn tất phê duyệt trên phân hệ Xếp lớp.
        </p>
      </div>
    )
  }

  // 5. Trạng thái CHỜ THANH TOÁN
  if (placementStatus === 'pending_payment') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CreditCard className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide text-xs">
            Học viên chờ thanh toán học phí
          </span>
          <StatusBadge status="pending_payment" label="Chờ thanh toán" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Gói học: <strong className="font-semibold text-foreground">{pkg.packageName}</strong> • Cần xác nhận phiếu thu trước khi chính thức xếp lớp.
        </p>
      </div>
    )
  }

  // 6. Trạng thái XẾP LỚP SAU
  if (placementStatus === 'enroll_later') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <CalendarClock className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wide text-xs">
            Học viên xin xếp lớp sau (Lùi lịch học)
          </span>
          <StatusBadge status="enroll_later" label="Xếp lớp sau" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Phụ huynh hẹn liên hệ lại vào đợt học kế tiếp. Gói học:{' '}
          <strong className="font-semibold text-foreground">{pkg.packageName}</strong>
        </p>
      </div>
    )
  }

  // 7. Trạng thái CHUYỂN PHÍ
  if (placementStatus === 'fee_transfer') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide text-xs">
            Đang xử lý thủ tục chuyển phí
          </span>
          <StatusBadge status="fee_transfer" label="Chuyển phí" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Gói học đang được chuyển đổi số buổi / học phí sang khóa học khác hoặc học viên liên kết.
        </p>
      </div>
    )
  }

  // 8. Trạng thái CHỜ KHAI GIẢNG
  if (placementStatus === 'awaiting_opening') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center mb-1">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide text-xs">
            Lớp học chờ khai giảng
          </span>
          <StatusBadge status="awaiting_opening" label="Chờ khai giảng" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Ngày khai giảng dự kiến:{' '}
          <strong className="font-semibold text-foreground">
            {pkg.startDate || '01/10/2026'}
          </strong>{' '}
          • Học viên đã được xếp vào lớp thành công.
        </p>
      </div>
    )
  }

  // 9. Trạng thái HỌC THỬ (TRIAL)
  if (placementStatus === 'trial') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center mb-1">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wide text-xs">
            Học viên diện Học thử (Trial)
          </span>
          <StatusBadge status="trial" label="Học thử" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Trải nghiệm 1 - 2 buổi học thử. CSKH theo dõi kết quả đánh giá của GV sau buổi để tư vấn chính thức.
        </p>
      </div>
    )
  }

  // 10. Trạng thái HẾT BUỔI
  if (placementStatus === 'session_ended') {
    return (
      <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide text-xs">
            Khóa học đã hết buổi (Cần tái phí)
          </span>
          <StatusBadge status="session_ended" label="Hết buổi" className="text-xs py-0 px-1.5" />
        </div>
        <p className="text-xs text-muted-foreground pt-0.5">
          Đã hoàn thành <strong className="font-semibold text-foreground">{pkg.totalSessions}/{pkg.totalSessions}</strong> buổi • Số buổi còn lại: <strong className="text-rose-600 dark:text-rose-400 font-semibold">0 buổi</strong>
        </p>
      </div>
    )
  }

  return null
}
