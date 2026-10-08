'use client'

import Image from 'next/image'
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
import { calculateStudentAge } from './bookingTestHelpers'
import type { AssessmentDraft } from './bookingTestTypes'

function getBookingExpectedLevel(booking?: BookingTest | null): string {
  if (!booking) return 'Mover (>8 và <=10)'
  const raw = booking.expectedLevel?.trim()
  if (raw) {
    if (raw.includes('Pre-Starters') || raw === 'preStarters') return 'Pre-Starters (<=6)'
    if (raw.includes('Starters') || raw === 'starters') return 'Starters (>6 và <=8)'
    if (raw.includes('Mover') || raw === 'movers') return 'Mover (>8 và <=10)'
    if (raw.includes('Flyers') || raw === 'flyers') return 'Flyers (>10)'
    if (['Pre-Kindie', 'Kindie 1'].includes(raw)) return 'Pre-Starters (<=6)'
    if (['Kindie 2', 'Kindie 3', 'Level 1A', 'Level 1B'].includes(raw)) return 'Starters (>6 và <=8)'
    if (['Level 2A', 'Level 2B', 'Level 3A'].includes(raw)) return 'Mover (>8 và <=10)'
    if (['Level 3B', 'IELTS', 'IELTS Foundation'].includes(raw)) return 'Flyers (>10)'
    return raw
  }
  const age = calculateStudentAge(booking.dob)
  if (age !== null) {
    if (age <= 6) return 'Pre-Starters (<=6)'
    if (age <= 8) return 'Starters (>6 và <=8)'
    if (age <= 10) return 'Mover (>8 và <=10)'
    return 'Flyers (>10)'
  }
  return 'Mover (>8 và <=10)'
}

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
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
  const editBaselineRef = useRef<AssessmentDraft | null>(null)
  const hasResult = Boolean(booking && hasBookingAssessmentResult(booking))
  const resultHref = booking && hasResult ? getBookingResultHref(booking.id) : undefined
  const isEditMode = Boolean(booking && editBookingId === booking.id)
  const isReadOnly = hasResult && !isEditMode
  const expectedLevel = getBookingExpectedLevel(booking)

  const startEditMode = () => {
    if (!booking) return
    editBaselineRef.current = cloneAssessmentDraft(draft)
    setEditBookingId(booking.id)
  }

  const handleEditClick = () => {
    startEditMode()
  }

  const cancelEditMode = () => {
    if (editBaselineRef.current) {
      onDraftChange(cloneAssessmentDraft(editBaselineRef.current))
    }
    editBaselineRef.current = null
    setEditBookingId(null)
  }

  const handleSaveClick = () => {
    if (!booking) return
    if (isEditMode && hasResult) {
      setIsSaveConfirmOpen(true)
      return
    }
    executeSave()
  }

  const executeSave = () => {
    setIsSaveConfirmOpen(false)
    editBaselineRef.current = null
    setEditBookingId(null)
    onSave()
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditBookingId(null)
      setIsSaveConfirmOpen(false)
      editBaselineRef.current = null
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85vh] w-[92vw] sm:max-w-3xl flex-col overflow-hidden rounded-xl border p-0 shadow-xl"
      >
        {booking && (
          <>
            {/* Compact Header */}
            <div className="shrink-0 border-b bg-muted/30 px-4 py-2">
              {/* Row 1: Avatar + Title/Name + Meta + Close */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {booking.avatar ? (
                    <Image
                      src={booking.avatar}
                      alt={booking.childName}
                      width={32}
                      height={32}
                      unoptimized
                      className="h-8 w-8 shrink-0 rounded-lg object-cover shadow-xs border border-border"
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shadow-xs border border-primary/20">
                      {booking.childName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <DialogTitle className="text-sm font-bold text-foreground truncate leading-tight">
                      {booking.childName}
                    </DialogTitle>
                    <DialogDescription className="text-xs font-normal text-muted-foreground leading-tight mt-0.5 truncate">
                      English Assessment Form
                      {booking.dob ? ` · Ngày sinh: ${booking.dob}` : ''}
                    </DialogDescription>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="min-w-0 text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 leading-none">Người đánh giá</p>
                      <p className="text-xs font-medium truncate mt-0.5">{booking.teacher || 'N/A'}</p>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div className="min-w-0 text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 leading-none">
                        Trình độ dự kiến
                      </p>
                      <p className="text-xs font-medium truncate mt-0.5 text-foreground">
                        {expectedLevel}
                      </p>
                    </div>
                  </div>
                  <DialogClose
                    aria-label="Đóng form đánh giá"
                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                  >
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-2.5">
              <Form2025Section
                draft={draft}
                resultHref={resultHref}
                readOnly={isReadOnly}
                onDraftChange={onDraftChange}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="shrink-0 flex flex-col sm:flex-row items-center justify-between border-t bg-muted/20 px-4 py-2 gap-2 sm:justify-between">
              <div className="text-xs text-muted-foreground mr-auto sm:mr-0">
                {isReadOnly ? (
                  <span>
                    Kết quả hiện ở chế độ chỉ xem. Bấm <span className="font-medium text-foreground">Chỉnh sửa đánh giá</span> để cập nhật lại.
                  </span>
                ) : isEditMode && hasResult ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    Bạn đang cập nhật lại kết quả hiện có. Hãy lưu khi chắc chắn thay đổi là đúng.
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {isReadOnly ? (
                  <>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => onOpenChange(false)}>
                      Đóng
                    </Button>
                    <Button size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={handleEditClick}>
                      <Pencil className="h-3.5 w-3.5" />
                      Chỉnh sửa đánh giá
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={isEditMode ? cancelEditMode : () => onOpenChange(false)}
                    >
                      {isEditMode ? 'Hủy chỉnh sửa' : 'Hủy'}
                    </Button>
                    <Button size="sm" className="h-8 px-3 text-xs" onClick={handleSaveClick}>
                      {isEditMode ? 'Lưu cập nhật' : 'Cập nhật đánh giá'}
                    </Button>
                  </>
                )}
              </div>
            </DialogFooter>
            <ConfirmDialog
              open={isSaveConfirmOpen}
              onOpenChange={setIsSaveConfirmOpen}
              title="Xác nhận lưu thay đổi đánh giá?"
              description="Kết quả đánh giá và nhận xét của học viên sẽ được lưu và cập nhật. Bạn có chắc chắn muốn lưu lại các thay đổi này?"
              confirmLabel="Lưu thay đổi"
              cancelLabel="Kiểm tra lại"
              onConfirm={executeSave}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
