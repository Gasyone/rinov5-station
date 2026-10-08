import React, { useState } from 'react'
import {
  Snowflake,
  ArrowRightLeft,
  ArrowLeftRight,
  UserX,
  CreditCard,
  CalendarClock,
  Sparkles,
  GraduationCap,
  FileText,
  RotateCcw,
  ExternalLink,
  UserPlus,
  Ticket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared'
import type { StudentProgram } from './studentDetailTypes'

export interface StudentDetailPlacementStatusBannerProps {
  program: StudentProgram
  onOpenAssignClass: () => void
  onOpenLeaveRequest?: () => void
  onOpenEarlyReturn?: () => void
  onOpenFeeTransfer?: (ticketCode: string) => void
  onOpenOrderDetail?: (orderNo: string) => void
}

export function StudentDetailPlacementStatusBanner({
  program,
  onOpenAssignClass,
  onOpenLeaveRequest,
  onOpenEarlyReturn,
  onOpenFeeTransfer,
  onOpenOrderDetail,
}: StudentDetailPlacementStatusBannerProps) {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const status = program.programStatus

  // 1. Trạng thái ĐANG BẢO LƯU (reserve / reserved)
  if (status === 'reserve' || status === 'reserved' || program.reservedInfo) {
    const isHoldingClass = Boolean(program.reservedInfo?.isHoldingClass)
    const expectedReturnDate =
      program.reservedInfo?.endDate ||
      program.reservedInfo?.expiryDate ||
      (isHoldingClass ? '16/09/2026' : '01/08/2026')
    const startDate = program.reservedInfo?.startDate || (isHoldingClass ? '15/06/2026' : '01/06/2026')
    const endDate = program.reservedInfo?.endDate || (isHoldingClass ? '15/09/2026' : '31/07/2026')
    const duration = program.reservedInfo?.duration || (isHoldingClass ? '3 tháng' : '2 tháng')
    const reservedSessions = program.reservedInfo?.reservedSessions || program.remainingSessions

    return (
      <div className="rounded-xl border border-amber-300/80 bg-amber-50/50 dark:bg-amber-950/25 dark:border-amber-800/60 p-2.5 sm:p-3 select-none animate-in fade-in-50 duration-200 space-y-1">
        <div className="flex items-center justify-center gap-2 flex-wrap text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Snowflake className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide text-xs">
              Khóa học đang bảo lưu
            </span>
            {isHoldingClass ? (
              <StatusBadge
                status="reserve"
                label="Bảo lưu giữ lớp"
                className="text-xs py-0 px-1.5 h-4"
              />
            ) : (
              <StatusBadge
                status="reserve"
                label="Bảo lưu"
                className="text-xs py-0 px-1.5 h-4"
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            • Ngày học lại dự kiến:{' '}
            <strong className="font-semibold text-foreground">
              {expectedReturnDate}
            </strong>
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5 text-center">
          <span>
            Thời gian:{' '}
            <strong className="font-semibold text-foreground">
              {startDate} ➔ {endDate}
            </strong>{' '}
            ({duration})
            {reservedSessions > 0 ? ` • ${reservedSessions} buổi bảo lưu` : ''}
          </span>
          <div className="flex items-center justify-center gap-2 ml-1">
            {onOpenLeaveRequest && (
              <button
                type="button"
                onClick={onOpenLeaveRequest}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Xem đơn bảo lưu</span>
              </button>
            )}
            {onOpenLeaveRequest && <span className="text-muted-foreground/30">•</span>}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onOpenEarlyReturn || onOpenAssignClass}
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

  // 2. Trạng thái CHỜ CHUYỂN LỚP (pending_transfer / dropped)
  if (status === 'pending_transfer' || status === 'dropped' || program.transferInfo || program.droppedClassInfo) {
    const sourceClassCode =
      program.transferInfo?.sourceClass ||
      program.droppedClassInfo?.classCode ||
      program.currentClass?.classCode ||
      'LD_TOAN_00010'

    return (
      <div className="rounded-xl border border-sky-300/80 bg-sky-50/50 dark:bg-sky-950/25 dark:border-sky-800/60 p-2 sm:p-2.5 select-none animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
          <div className="flex items-center justify-center gap-1.5 flex-wrap min-w-0">
            <span className="p-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
              <ArrowRightLeft className="h-3 w-3" />
            </span>
            <span className="font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide text-xs shrink-0">
              Tiến trình chuyển lớp đang diễn ra
            </span>
            <StatusBadge
              status="pending_transfer"
              label="Chờ chuyển lớp"
              className="text-xs py-0 px-1.5 h-4"
            />
            <span className="text-muted-foreground/40 hidden sm:inline">•</span>
            <span className="text-xs text-muted-foreground">
              Lớp cũ: <strong className="font-semibold text-foreground font-mono">{sourceClassCode}</strong>
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenAssignClass}
            className="h-6 px-2.5 text-xs font-semibold text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 bg-white dark:bg-sky-900/40 hover:bg-sky-100 dark:hover:bg-sky-900/70 cursor-pointer shrink-0 shadow-3xs"
          >
            <UserPlus className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" />
            <span>Ghép lớp ngay</span>
            <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
          </Button>
        </div>
      </div>
    )
  }

  // 3. Trạng thái LỚP NHÁP (draft_class): Bỏ section và nút ghép lớp theo yêu cầu
  if (status === 'draft_class') {
    return null
  }

  // 4. Trạng thái CHỜ THANH TOÁN (pending_payment)
  if (status === 'pending_payment') {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-2 sm:p-2.5 select-none animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-center gap-2 flex-wrap text-center">
          <span className="p-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <CreditCard className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide text-xs shrink-0">
            Học viên chờ thanh toán học phí
          </span>
          <StatusBadge status="pending_payment" label="Chờ thanh toán" className="text-xs py-0 px-1.5 h-4" />
          <span className="text-muted-foreground/40 hidden sm:inline">•</span>
          <span className="text-xs text-muted-foreground">
            Cần xác nhận phiếu thu trước khi chính thức xếp lớp.
          </span>
        </div>
      </div>
    )
  }

  // 5. Trạng thái XẾP LỚP SAU (enroll_later)
  if (status === 'enroll_later') {
    return (
      <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/40 dark:bg-violet-950/20 p-2 sm:p-2.5 select-none animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
          <div className="flex items-center justify-center gap-1.5 flex-wrap min-w-0">
            <span className="p-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
              <CalendarClock className="h-3 w-3" />
            </span>
            <span className="font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wide text-xs shrink-0">
              Học viên hẹn xếp lớp sau
            </span>
            <StatusBadge status="enroll_later" label="Hẹn xếp sau" className="text-xs py-0 px-1.5 h-4" />
            <span className="text-muted-foreground/40 hidden sm:inline">•</span>
            <span className="text-xs text-muted-foreground">
              Phụ huynh hẹn liên hệ lại vào đợt học kế tiếp.
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenAssignClass}
            className="h-6 px-2.5 text-xs font-semibold text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-800 bg-white dark:bg-violet-950/40 hover:bg-violet-100 cursor-pointer shrink-0 shadow-3xs"
          >
            <UserPlus className="h-3 w-3 mr-1 text-violet-600" />
            <span>Ghép lớp ngay</span>
            <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
          </Button>
        </div>
      </div>
    )
  }

  // 6. Trạng thái CHUYỂN PHÍ (fee_transfer)
  if (status === 'fee_transfer' || program.feeTransferInfo) {
    const tfInfo = program.feeTransferInfo || {
      ticketCode: 'CP00014156',
      transferDate: '15/01/2024',
      executorName: 'Trần Thảo Anh 20',
      transferredSessions: program.remainingSessions || 16,
      targetPackageName: 'Gói Tiếng Anh Giao Tiếp Cambridge (16 buổi)',
      recipientStudentName: 'Nguyễn Phương Vy',
      linkedOrderNo: 'OD803325',
      note: 'Đã hoàn tất thủ tục chuyển 16 buổi sang gói học mới.',
    }

    const packageName =
      program.packages?.[0]?.packageName ||
      program.name ||
      'Gói chuyển phí học tập Tiếng Anh'

    return (
      <>
        <div className="rounded-xl border border-sky-200/80 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/25 p-2.5 sm:p-3 select-none animate-in fade-in-50 duration-200 space-y-1.5 shadow-3xs">
          {/* DÒNG 1: TÊN GÓI + NÚT LINK TICKET CHUYỂN PHÍ */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
            <div className="flex items-center justify-center gap-1.5 min-w-0">
              <span className="p-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </span>
              <strong className="text-xs font-bold text-foreground truncate">
                {packageName}
              </strong>
              <span className="text-muted-foreground/60 text-xs shrink-0">•</span>
              <span className="text-[11px] text-muted-foreground shrink-0 font-normal">
                {tfInfo.transferredSessions} buổi chuyển đổi
              </span>
            </div>

            {/* Link với ticket chuyển phí ở tab đơn hàng */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onOpenFeeTransfer) {
                    onOpenFeeTransfer(tfInfo.ticketCode)
                  } else {
                    setIsTicketModalOpen(true)
                  }
                }}
                className="h-6 px-2 text-[11px] font-medium border-sky-300 dark:border-sky-700 bg-white dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 cursor-pointer shadow-3xs flex items-center gap-1"
                title={`Xem phiếu chuyển phí ${tfInfo.ticketCode} liên kết tab đơn hàng`}
              >
                <Ticket className="h-3 w-3 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Ticket: <strong className="font-mono font-semibold">{tfInfo.ticketCode}</strong></span>
                <ExternalLink className="h-2.5 w-2.5 opacity-70 ml-0.5" />
              </Button>
            </div>
          </div>

          {/* DÒNG 2: TRẠNG THÁI CHUYỂN PHÍ (Đã chuyển phí xong rồi, không có đang xử lý) */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap pt-1 border-t border-sky-200/50 dark:border-sky-900/30 text-center">
            <div className="flex items-center justify-center gap-1.5 flex-wrap min-w-0">
              <span className="text-[11px] font-normal text-muted-foreground shrink-0">
                Trạng thái:
              </span>
              <StatusBadge
                status="fee_transfer"
                label="Đã chuyển phí"
                className="text-xs py-0 px-1.5 h-4 font-semibold"
              />
              <span className="text-muted-foreground/60 text-xs shrink-0">•</span>
              <span className="text-[11px] text-foreground/85 font-normal">
                Đã hoàn tất chuyển phí ngày {tfInfo.transferDate}
                {tfInfo.executorName ? ` (${tfInfo.executorName})` : ''}
              </span>
            </div>

            {tfInfo.targetPackageName && (
              <div className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                <span className="hidden sm:inline">• Đích:</span>
                <span className="sm:hidden">Đích:</span>
                <strong className="text-foreground/90 font-medium">
                  {tfInfo.targetPackageName}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Modal chi tiết Ticket chuyển phí */}
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogContent className="sm:max-w-[480px] p-4 text-left">
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Ticket className="h-4 w-4 text-sky-600" />
                  <span>Phiếu chuyển phí {tfInfo.ticketCode}</span>
                </DialogTitle>
                <StatusBadge status="fee_transfer" label="Đã hoàn tất" className="text-xs py-0 px-1.5 h-4 font-semibold" />
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Thông tin phiếu chuyển phí liên kết tại tab Đơn hàng
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5 py-2 text-xs border-y border-border/50 my-1">
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/40 text-[11.5px]">
                <div>
                  <span className="text-muted-foreground block text-[10.5px]">Ngày thực hiện</span>
                  <strong className="font-semibold text-foreground">{tfInfo.transferDate}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10.5px]">Người thực hiện</span>
                  <strong className="font-semibold text-foreground">{tfInfo.executorName || 'CSKH'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10.5px]">Số buổi chuyển</span>
                  <strong className="font-semibold text-sky-600 dark:text-sky-400">{tfInfo.transferredSessions} buổi</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10.5px]">Hình thức chuyển</span>
                  <strong className="font-semibold text-foreground">Chuyển phí - Ngang tiền</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-muted-foreground">Gói nguồn chuyển đi:</div>
                <div className="p-2 rounded-md border border-border/60 bg-background text-[11.5px] space-y-0.5">
                  <strong className="text-foreground">{packageName}</strong>
                  <div className="text-[10.5px] text-muted-foreground">Tổng số: 32 buổi • Đã học: 16 buổi • Chuyển đi: 16 buổi</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-muted-foreground">Gói đích / Học viên nhận:</div>
                <div className="p-2 rounded-md border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 text-[11.5px] space-y-0.5">
                  <strong className="text-foreground">{tfInfo.targetPackageName}</strong>
                  <div className="text-[10.5px] text-muted-foreground">
                    Học viên: {tfInfo.recipientStudentName || 'Nguyễn Phương Vy'} • Đơn liên kết: <span className="font-mono text-foreground font-semibold">{tfInfo.linkedOrderNo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {onOpenOrderDetail && tfInfo.linkedOrderNo ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsTicketModalOpen(false)
                    onOpenOrderDetail(tfInfo.linkedOrderNo!)
                  }}
                  className="h-7 text-xs font-medium cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span>Xem đơn hàng liên kết ({tfInfo.linkedOrderNo})</span>
                </Button>
              ) : <div />}
              <Button
                type="button"
                size="sm"
                onClick={() => setIsTicketModalOpen(false)}
                className="h-7 px-3 text-xs font-medium cursor-pointer ml-auto"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // 7. Trạng thái CHỜ KHAI GIẢNG (awaiting_opening)
  if (status === 'awaiting_opening') {
    const openingDate = program.startDate || program.packages[0]?.startSessionDate || '01/10/2026'
    return (
      <div className="rounded-xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/40 dark:bg-cyan-950/20 p-2 sm:p-2.5 select-none animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-center gap-2 flex-wrap text-center">
          <span className="p-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide text-xs shrink-0">
            Lớp học chờ khai giảng
          </span>
          <StatusBadge status="awaiting_opening" label="Chờ khai giảng" className="text-xs py-0 px-1.5 h-4" />
          <span className="text-muted-foreground/40 hidden sm:inline">•</span>
          <span className="text-xs text-muted-foreground">
            Ngày khai giảng dự kiến: <strong className="font-semibold text-foreground">{openingDate}</strong>
          </span>
        </div>
      </div>
    )
  }

  // 8. Trạng thái HỌC THỬ (trial)
  if (status === 'trial') {
    return (
      <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/40 dark:bg-violet-950/20 p-2 sm:p-2.5 select-none animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-center gap-2 flex-wrap text-center">
          <span className="p-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wide text-xs shrink-0">
            Học viên diện Học thử (Trial)
          </span>
          <StatusBadge status="trial" label="Học thử" className="text-xs py-0 px-1.5 h-4" />
          <span className="text-muted-foreground/40 hidden sm:inline">•</span>
          <span className="text-xs text-muted-foreground">
            Trải nghiệm 1 - 2 buổi học thử. CSKH theo dõi kết quả sau buổi.
          </span>
        </div>
      </div>
    )
  }

  // 9. Mặc định: Trạng thái CHỜ XẾP LỚP / CHƯA GHÉP LỚP (wait_for_assignment)
  return (
    <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 p-2 sm:p-2.5 select-none animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
        <div className="flex items-center justify-center gap-1.5 flex-wrap min-w-0">
          <span className="p-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <UserX className="h-3 w-3" />
          </span>
          <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-xs shrink-0">
            Học viên chưa ghép lớp
          </span>
          <StatusBadge
            status="wait_for_assignment"
            label="Chờ xếp lớp"
            className="text-xs py-0 px-1.5 h-4"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onOpenAssignClass}
          className="h-6 px-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 cursor-pointer shrink-0 shadow-3xs"
        >
          <UserPlus className="h-3 w-3 mr-1 text-indigo-500" />
          <span>Ghép lớp ngay</span>
          <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
        </Button>
      </div>
    </div>
  )
}
