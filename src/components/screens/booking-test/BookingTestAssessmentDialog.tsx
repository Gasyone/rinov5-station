'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/shared'
import { Form2025Section } from './Form2025Section'
import { type BookingTest } from '@/mocks/bookingTests'
import {
  getBookingResultHref,
  hasBookingAssessmentResult,
} from './bookingTestAssessmentStorage'
import type { AssessmentDraft } from './bookingTestTypes'

interface BookingTestAssessmentDialogProps {
  booking: BookingTest | null
  draft: AssessmentDraft
  onOpenChange: (open: boolean) => void
  onDraftChange: (draft: AssessmentDraft | ((current: AssessmentDraft) => AssessmentDraft)) => void
  onSave: () => void
}

function cloneAssessmentDraft(draft: AssessmentDraft) {
  return JSON.parse(JSON.stringify(draft)) as AssessmentDraft
}

export function BookingTestAssessmentDialog({
  booking,
  draft,
  onOpenChange,
  onDraftChange,
  onSave,
}: BookingTestAssessmentDialogProps) {
  const [editBookingId, setEditBookingId] = useState<string | null>(null)
  const [editConfirmBookingId, setEditConfirmBookingId] = useState<string | null>(null)
  const editBaselineRef = useRef<AssessmentDraft | null>(null)
  const hasResult = Boolean(booking && hasBookingAssessmentResult(booking))
  const resultHref = booking && hasResult ? getBookingResultHref(booking.id) : undefined
  const isEditMode = Boolean(booking && editBookingId === booking.id)
  const isEditConfirmOpen = Boolean(booking && editConfirmBookingId === booking.id)
  const isReadOnly = hasResult && !isEditMode

  const startEditMode = () => {
    if (!booking) return
    editBaselineRef.current = cloneAssessmentDraft(draft)
    setEditBookingId(booking.id)
    setEditConfirmBookingId(null)
  }

  const handleEditClick = () => {
    if (!booking) return
    if (booking?.status === 'completed') {
      setEditConfirmBookingId(booking.id)
      return
    }
    startEditMode()
  }

  const cancelEditMode = () => {
    if (editBaselineRef.current) {
      onDraftChange(cloneAssessmentDraft(editBaselineRef.current))
    }
    editBaselineRef.current = null
    setEditBookingId(null)
  }

  const handleSave = () => {
    editBaselineRef.current = null
    setEditBookingId(null)
    onSave()
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditBookingId(null)
      setEditConfirmBookingId(null)
      editBaselineRef.current = null
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="grid h-[92vh] w-[96vw] max-h-[850px] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-6xl"
      >
        {booking && (
          <>
            {/* Compact Header */}
            <div className="shrink-0 border-b bg-muted/30 px-6 py-3">
              {/* Row 1: Avatar + Title/Name + Meta + Close */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {booking.avatar ? (
                    <img
                      src={booking.avatar}
                      alt={booking.childName}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm border border-border"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary shadow-sm border border-primary/20">
                      {booking.childName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <DialogTitle className="text-base font-bold leading-tight">English Assessment Form</DialogTitle>
                    <DialogDescription className="text-sm truncate">
                      {booking.childName}
                      <span className="ml-2 text-muted-foreground">· {booking.dob ? `Ngày sinh: ${booking.dob}` : 'N/A'}</span>
                    </DialogDescription>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-4 shrink-0">
                  <div className="hidden md:flex items-center gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Người đánh giá</p>
                      <p className="text-sm font-semibold truncate">{booking.teacher || 'N/A'}</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Thời gian test</p>
                      <p className="text-sm font-semibold truncate">{booking.testTime || 'N/A'}</p>
                    </div>
                  </div>
                  <DialogClose
                    aria-label="Đóng form đánh giá"
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {isReadOnly ? (
                <div className="mb-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  Kết quả hiện ở chế độ chỉ xem. Bấm Chỉnh sửa đánh giá để cập nhật lại.
                </div>
              ) : null}
              {isEditMode && hasResult ? (
                <div className="mb-4 rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground">
                  Bạn đang cập nhật lại kết quả hiện có. Hãy lưu khi chắc chắn thay đổi là đúng.
                </div>
              ) : null}
              <Form2025Section
                draft={draft}
                resultHref={resultHref}
                readOnly={isReadOnly}
                onDraftChange={onDraftChange}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="shrink-0 border-t bg-muted/30 px-6 py-4">
              {isReadOnly ? (
                <>
                  <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                    Đóng
                  </Button>
                  <Button size="lg" onClick={handleEditClick}>
                    <Pencil className="h-4 w-4" />
                    Chỉnh sửa đánh giá
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={isEditMode ? cancelEditMode : () => onOpenChange(false)}
                  >
                    {isEditMode ? 'Hủy chỉnh sửa' : 'Hủy'}
                  </Button>
                  <Button size="lg" onClick={handleSave}>
                    {isEditMode ? 'Lưu cập nhật' : 'Cập nhật đánh giá'}
                  </Button>
                </>
              )}
            </DialogFooter>
            <ConfirmDialog
              open={isEditConfirmOpen}
              onOpenChange={(open) => setEditConfirmBookingId(open ? booking.id : null)}
              title="Chỉnh sửa kết quả đã hoàn tất?"
              description="Kết quả đã hoàn tất sẽ được mở lại để cập nhật. Chỉ tiếp tục khi cần sửa điểm hoặc nhận xét đã công bố."
              confirmLabel="Mở chỉnh sửa"
              cancelLabel="Giữ chỉ xem"
              onConfirm={startEditMode}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
