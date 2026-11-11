'use client'

import { CalendarClock, ExternalLink, Info, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'
import {
  formatTestTimeWithDay,
  getStatusLabel,
  maskPhone,
  getParentDisplayName,
} from './bookingTestHelpers'
import { BookingTestScheduleHoverCard } from './BookingTestScheduleHoverCard'

interface BookingTestDuplicateAlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: BookingTest | null
  onCloseAndReset?: () => void
}

export function BookingTestDuplicateAlertModal({
  open,
  onOpenChange,
  booking,
  onCloseAndReset,
}: BookingTestDuplicateAlertModalProps) {
  if (!booking) return null

  const handleClose = () => {
    onOpenChange(false)
    onCloseAndReset?.()
  }

  const handleViewExisting = () => {
    onOpenChange(false)
    window.open(`/app/booking_test?search=${encodeURIComponent(booking.childName)}`, '_blank')
  }

  const parentName = getParentDisplayName(booking) || booking.parentName
  const phoneMasked = maskPhone(booking.phone)
  const teacherName = booking.teacher?.trim() || booking.tester?.trim() || booking.ops?.trim() || 'Chưa phân công'

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) onCloseAndReset?.()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] p-0 overflow-hidden rounded-xl border border-border/80 shadow-xl"
      >
        <div className="p-3.5 sm:p-4 space-y-2.5">
          {/* Header gọn gàng, giảm padding/gap */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-7 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CalendarClock className="size-4" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm font-bold text-foreground leading-tight">
                  HS đã có lịch trải nghiệm
                </DialogTitle>
                <DialogDescription className="text-[11.5px] text-muted-foreground leading-tight mt-0.5">
                  Hiện <strong className="text-foreground font-semibold">không thể đặt lịch mới</strong> do đã có lịch với thông tin sau:
                </DialogDescription>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Info Card - Chuẩn hóa theo Tóm tắt lịch hẹn & Hover Profile Popover */}
          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5 sm:p-3 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {/* Cột 1: Học viên */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Học viên:</span>
                <span className="font-semibold text-foreground text-xs block mt-0.5">
                  {booking.childName}
                </span>
              </div>

              {/* Cột 2: Phụ huynh & SĐT */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Phụ huynh:</span>
                <span
                  className="font-semibold text-foreground text-xs block mt-0.5 truncate"
                  title={`${parentName} - ${phoneMasked}`}
                >
                  {parentName} {phoneMasked ? `(${phoneMasked})` : ''}
                </span>
              </div>

              {/* Cột 1: Thời gian & Hover Popover Profile */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Thời gian:</span>
                <BookingTestScheduleHoverCard booking={booking} side="right" align="start">
                  <div
                    className="inline-flex items-center gap-1 font-semibold text-primary text-xs hover:underline decoration-dotted underline-offset-2 transition-colors cursor-pointer group mt-0.5"
                    title="Hover để xem toàn bộ hồ sơ chi tiết ca test"
                  >
                    <span>{formatTestTimeWithDay(booking.testTime) || booking.testTime}</span>
                    <Info className="size-3 text-primary/70 group-hover:text-primary shrink-0" />
                  </div>
                </BookingTestScheduleHoverCard>
              </div>

              {/* Cột 2: Cơ sở */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Cơ sở:</span>
                <span
                  className="font-semibold text-foreground text-xs block mt-0.5 truncate"
                  title={booking.school}
                >
                  {booking.school || 'Trường Tech Test'}
                </span>
              </div>

              {/* Cột 1: Chương trình & Level */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Chương trình:</span>
                <span className="font-semibold text-foreground text-xs block mt-0.5 truncate" title={booking.program}>
                  {booking.program || 'Chương trình Toán tư duy'}
                </span>
              </div>

              {/* Cột 2: Level dự kiến */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Level:</span>
                <span className="font-semibold text-foreground text-xs block mt-0.5">
                  {booking.expectedLevel || booking.testResult?.level || 'Lớp 1'}
                </span>
              </div>

              {/* Cột 1: Nhân sự phụ trách */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Phụ trách ca:</span>
                <span className="font-semibold text-foreground text-xs block mt-0.5 truncate">
                  {teacherName}
                </span>
              </div>

              {/* Cột 2: Trạng thái */}
              <div>
                <span className="text-muted-foreground block text-[11px]">Trạng thái:</span>
                <div className="mt-0.5">
                  <StatusBadge
                    status={booking.status}
                    label={getStatusLabel(booking.status)}
                    className="text-[11px] px-2 py-0.5 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Hướng dẫn bên trái, Nút xem ca test bên phải, BỎ NÚT ĐÓNG */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-border/60">
            <p className="text-[11px] text-muted-foreground leading-normal flex-1">
              Nếu muốn đặt lại lịch, vui lòng <strong className="text-foreground font-semibold">hủy lịch hiện tại</strong>.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewExisting}
              className="text-xs h-7 px-2.5 gap-1.5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
              <span>Xem ca test hiện tại</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
