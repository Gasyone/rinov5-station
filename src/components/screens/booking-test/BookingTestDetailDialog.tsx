'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Clock, ExternalLink, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppAvatar, StatusBadge, StudentHeaderInfoCard } from '@/components/shared'
import {
  PROGRAM_LEVELS,
  SUB_LEVELS,
  type BookingTest,
} from '@/mocks/bookingTests'
import { InlineSelect } from '@/components/controls'
import {
  canSelectPlacementLevel,
  formatTestTimeWithDay,
  getStatusLabel,
  getSubjectLabel,
  isBookingCheckedIn,
} from './bookingTestHelpers'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'
import { BookingTestDetailActions } from './BookingTestDetailActions'
import { BookingTestDetailSidePanel } from './BookingTestDetailSidePanel'
import { BookingTestEmployeePickerDialog } from './BookingTestEmployeePickerDialog'
import { getBookingResultHref, hasBookingAssessmentResult } from './bookingTestAssessmentStorage'
import { getActiveEmployeesBySchool, resolveBookingBranch } from './bookingTestStaffHelpers'
import { cn } from '@/lib/utils'

interface BookingTestDetailDialogProps {
  booking: BookingTest | null
  bookings?: BookingTest[]
  detailNote: string
  copiedKey: string
  onOpenChange: (open: boolean) => void
  onUpdateBooking: (bookingId: string, updater: (booking: BookingTest) => BookingTest) => void
  onOpenAssessment: (bookingId: string) => void
  onCall: (phone?: string) => void
  onCopy: (text: string, key: string) => Promise<void>
  onDetailNoteChange: (value: string) => void
  onAddNote: () => void
  onViewStudentDetail?: (studentId: string) => void
}

/** Field item with non-uppercase, sentence-case label */
function DetailField({
  label,
  value,
  supporting,
  className,
}: {
  label: string
  value: React.ReactNode
  supporting?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</div>
      {supporting ? <div className="mt-0.5 truncate text-xs text-muted-foreground">{supporting}</div> : null}
    </div>
  )
}

/** Section card container with rounded gray border and white background */
function DetailCard({
  title,
  icon,
  actions,
  children,
  className,
}: {
  title: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-background p-4 shadow-2xs', className)}>
      <div className="mb-3 flex items-center justify-between gap-3 shrink-0">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          {icon}
          {title}
        </h3>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}

export function BookingTestDetailDialog({
  booking,
  bookings = [],
  onOpenChange,
  onUpdateBooking,
  onOpenAssessment,
}: BookingTestDetailDialogProps) {
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const canEditPlacementLevel = Boolean(booking && canSelectPlacementLevel(booking))

  const branchName = booking ? resolveBookingBranch(booking.school) : ''
  const branchEmployees = useMemo(
    () => (booking ? getActiveEmployeesBySchool(booking.school) : []),
    [booking]
  )
  const creatorName = booking?.createdBy || booking?.ops || 'Sale Nguyễn Tuân'

  if (!booking) return null

  const familyMembers = (booking.familyMembers && booking.familyMembers.length > 0)
    ? booking.familyMembers.map((m) => ({
        name: m.name,
        relationship: m.isPrimary ? 'Phụ huynh' : 'Người thân',
        isPrimary: m.isPrimary ?? false,
        phone: m.phone,
      }))
    : [{
        name: booking.familyName,
        relationship: 'Phụ huynh',
        isPrimary: true,
        phone: booking.phone,
      }]

  const hasResult = hasBookingAssessmentResult(booking)
  const resultHref = booking.resultLink?.startsWith('/app/')
    ? booking.resultLink
    : getBookingResultHref(booking.id)

  return (
    <>
      <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
        <DialogContent className="grid max-h-[88vh] w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-4xl border-none shadow-xl bg-slate-100 dark:bg-slate-900">
          {/* Header */}
          <DialogHeader className="shrink-0 px-6 pb-0 pt-5">
            <div className="flex flex-col gap-3">
              {/* Title & Status */}
              <div className="flex items-center justify-between gap-4 pr-6">
                <DialogTitle className="text-xs font-normal text-muted-foreground">
                  Chi tiết Phiếu kiểm tra/Trải nghiệm
                  <Badge variant="outline" className="ml-1.5 rounded-md font-mono text-[11px] font-normal text-muted-foreground">
                    {booking.id}
                  </Badge>
                </DialogTitle>
                <div className="shrink-0">
                  <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
                </div>
              </div>

              {/* Student Header Info Card */}
              <StudentHeaderInfoCard
                studentName={booking.childName}
                status="Trải nghiệm"
                address={booking.school}
                parents={familyMembers}
                initialNote={booking.msg || (booking.notes && booking.notes[0]?.text)}
              />
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto px-6 py-2">
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-5">
              {/* CỘT TRÁI (60%): Buổi trải nghiệm & Kết quả đánh giá */}
              <div className="flex flex-col gap-4 min-w-0 md:col-span-3">
                {/* 1. Buổi kiểm tra / Trải nghiệm */}
                <DetailCard
                  title="Buổi kiểm tra / Trải nghiệm"
                  icon={<CalendarDays className="h-4 w-4 text-primary" />}
                >
                  <div className="space-y-3">
                    <DetailField
                      label="Cơ sở / Trường"
                      value={booking.school}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Chương trình" value={booking.program} />
                      <DetailField label="Môn học" value={getSubjectLabel(booking.subject)} />
                    </div>

                    <DetailField
                      label="Thời gian trải nghiệm"
                      value={formatTestTimeWithDay(booking.testTime)}
                      supporting={isBookingCheckedIn(booking) ? 'Đã check-in' : undefined}
                    />
                  </div>
                </DetailCard>

                {/* 2. Kết quả đánh giá trình độ */}
                <DetailCard
                  title="Kết quả đánh giá trình độ"
                  icon={<FileText className="h-4 w-4 text-primary" />}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Trình độ</p>
                        <InlineSelect
                          value={booking.testResult?.level ?? ''}
                          disabled={!canEditPlacementLevel}
                          ariaLabel={`Trình độ đầu vào của ${booking.childName}`}
                          options={[
                            { value: '', label: 'Chưa đặt' },
                            ...PROGRAM_LEVELS.map((level) => ({ value: level, label: level })),
                          ]}
                          onValueChange={(value) =>
                            onUpdateBooking(booking.id, (current) => ({
                              ...current,
                              testResult: { ...current.testResult, level: value },
                            }))
                          }
                          className="h-8 border-solid text-xs shadow-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Nhánh trình độ</p>
                        <InlineSelect
                          value={booking.testResult?.subLevel ?? ''}
                          disabled={!canEditPlacementLevel}
                          ariaLabel={`Nhánh trình độ đầu vào của ${booking.childName}`}
                          options={[
                            { value: '', label: '-' },
                            ...SUB_LEVELS.map((subLevel) => ({ value: subLevel, label: subLevel })),
                          ]}
                          onValueChange={(value) =>
                            onUpdateBooking(booking.id, (current) => ({
                              ...current,
                              testResult: { ...current.testResult, subLevel: value },
                            }))
                          }
                          className="h-8 border-solid text-xs shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-border/50">
                      {booking.subject === 'english' && <SpeakingScore result={booking.testResult} />}
                      <LwrScore result={booking.testResult} />
                    </div>

                    {(booking.resultLink || hasResult) && (
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
                        {booking.resultLink && (
                          <a
                            href={booking.resultLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Xem kết quả từ iPad
                          </a>
                        )}
                        {hasResult && (
                          <a
                            href={resultHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Xem trang đánh giá chi tiết
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </DetailCard>
              </div>

              {/* CỘT PHẢI (40%): Thời hạn & Phụ trách, Lịch sử & Ghi chú */}
              <div className="flex flex-col gap-4 min-w-0 md:col-span-2">
                {/* 1. Thời hạn & Phụ trách */}
                <DetailCard title="Thời hạn & Phụ trách" icon={<Clock className="h-4 w-4 text-primary" />}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 border-b border-border/60 pb-3">
                      <DetailField label="Ngày tạo phiếu" value="2026-08-05 09:30" />
                      <DetailField label="Phân loại" value={booking.eventType === 'demo' ? 'Học trải nghiệm' : 'Test đầu vào'} />
                    </div>

                    <div className="flex items-center gap-3">
                      <AppAvatar name={creatorName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground">Nguồn tạo (Sale)</p>
                        <p className="truncate text-sm font-semibold text-foreground">{creatorName}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <AppAvatar name={booking.teacher || 'Chưa gán'} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground">Người phụ trách (GV)</p>
                          <p className="truncate text-sm font-semibold text-foreground">{booking.teacher || 'Chưa gán giáo viên'}</p>
                          <p className="truncate text-xs text-muted-foreground">{booking.school}</p>
                        </div>
                      </div>
                      {booking.subject !== 'math' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs font-medium text-primary border-primary/30 hover:bg-primary/10 shrink-0"
                          onClick={() => setTeacherPickerOpen(true)}
                        >
                          {booking.teacher ? 'Đổi GV' : 'Gán GV'}
                        </Button>
                      )}
                    </div>
                  </div>
                </DetailCard>

                {/* 2. Lịch sử thao tác */}
                <DetailCard title="Lịch sử thao tác" icon={<Clock className="h-4 w-4 text-primary" />}>
                  <BookingTestDetailSidePanel booking={booking} />
                </DetailCard>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer — Uniform flat gray background without border line */}
          <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-1">
            <BookingTestDetailActions
              booking={booking}
              onOpenChange={onOpenChange}
              onUpdateBooking={onUpdateBooking}
              onOpenAssessment={onOpenAssessment}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Picker Dialog for assigning teacher */}
      {booking && (
        <BookingTestEmployeePickerDialog
          open={teacherPickerOpen}
          employees={branchEmployees}
          branchName={branchName}
          selectedName={booking.teacher}
          bookings={bookings}
          bookingTime={booking.testTime}
          currentBookingId={booking.id}
          onOpenChange={setTeacherPickerOpen}
          onSelect={(employee) => {
            onUpdateBooking(booking.id, (current) => ({
              ...current,
              teacher: employee.name,
              tester: employee.name,
            }))
            setTeacherPickerOpen(false)
          }}
        />
      )}
    </>
  )
}
