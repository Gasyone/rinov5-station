'use client'

import { CheckCircle, Copy, FileText, Phone, Users, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldLabel, InfoField, Panel, StatusBadge } from '@/components/shared'
import {
  PROGRAM_LEVELS,
  SUB_LEVELS,
  type BookingTest,
} from '@/mocks/bookingTests'
import { InlineSelect } from '@/components/controls'
import {
  canSelectPlacementLevel,
  formatDateTime,
  getStatusLabel,
  getSubjectLabel,
  isBookingCheckedIn,
  maskPhone,
} from './bookingTestHelpers'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'
import { BookingTestDetailActions } from './BookingTestDetailActions'
import { BookingTestDetailSidePanel } from './BookingTestDetailSidePanel'
import { BookingTestResponsiblePanel } from './BookingTestResponsiblePanel'
import { getBookingResultHref, hasBookingAssessmentResult } from './bookingTestAssessmentStorage'

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

export function BookingTestDetailDialog({
  booking,
  bookings = [],
  detailNote,
  copiedKey,
  onOpenChange,
  onUpdateBooking,
  onOpenAssessment,
  onCall,
  onCopy,
  onDetailNoteChange,
  onAddNote,
  onViewStudentDetail,
}: BookingTestDetailDialogProps) {
  const canEditPlacementLevel = Boolean(booking && canSelectPlacementLevel(booking))

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  if (!booking) {
    return (
      <Dialog open={false} onOpenChange={handleOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

  const handleStudentClick = () => {
    if (onViewStudentDetail) {
      onViewStudentDetail(booking.id || 's1')
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="grid h-[82vh] max-h-[760px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="shrink-0 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex items-start gap-3 min-w-0 flex-1 ${onViewStudentDetail ? 'cursor-pointer group' : ''}`}
              onClick={handleStudentClick}
              title={onViewStudentDetail ? 'Bấm để xem chi tiết học viên' : undefined}
            >
              {booking.avatar ? (
                <img
                  src={booking.avatar}
                  alt={booking.childName}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm border border-border group-hover:border-primary transition-all"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary shadow-sm border border-primary/20 group-hover:bg-primary/20 transition-all">
                  {booking.childName?.charAt(0) || '?'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="flex flex-wrap items-center gap-2 group-hover:text-primary transition-colors">
                  {booking.childName}
                  <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
                  <Badge variant="outline" className="rounded-md font-mono">
                    {booking.id}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {booking.program} - {formatDateTime(booking.testTime)}
                </DialogDescription>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-center">
              <BookingTestDetailActions
                booking={booking}
                onUpdateBooking={onUpdateBooking}
                onOpenAssessment={onOpenAssessment}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-6 overflow-hidden px-6 pb-6">
          <section className="grid gap-x-8 gap-y-4 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-5">
            <InfoField label="Học viên" value={booking.childName} supporting={booking.id} />
            <InfoField label="Chương trình" value={booking.program} />
            <InfoField
              label="Lịch hẹn"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-primary">{formatDateTime(booking.testTime)}</span>
                  {isBookingCheckedIn(booking) && (
                    <StatusBadge
                      status="checkin"
                      label="Đã đến"
                      withDot
                      className="rounded-md px-2 py-0.5 text-[11px]"
                    />
                  )}
                </span>
              }
            />
            <InfoField label="Trường" value={booking.school} supporting={booking.room || 'Sảnh tư vấn'} />
            <InfoField label="Môn học" value={getSubjectLabel(booking.subject)} />
          </section>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_320px]">
            <main className="min-h-0 space-y-6 overflow-y-auto pr-2">
              <Panel title="Gia đình" icon={<Users className="h-4 w-4" />}>
                <div className="space-y-2">
                  {(booking.familyMembers.length
                    ? booking.familyMembers
                    : [{ name: booking.familyName, phone: booking.phone }]
                  ).map((member) => (
                    <div
                      key={member.phone}
                      className="flex items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{member.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {maskPhone(member.phone)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Gọi ${member.name}`}
                          onClick={() => onCall(member.phone)}
                        >
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Sao chép số điện thoại của ${member.name}`}
                          onClick={() => void onCopy(member.phone, `detail-${member.phone}`)}
                        >
                          {copiedKey === `detail-${member.phone}` ? (
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Kết quả đánh giá" icon={<FileText className="h-4 w-4" />}>
                <div className="space-y-4">
                  <div className="grid max-w-md gap-3 sm:grid-cols-2">
                    <FieldLabel label="Trình độ">
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
                        className="h-9 border-solid text-sm shadow-xs"
                      />
                    </FieldLabel>
                    <FieldLabel label="Nhánh trình độ">
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
                        className="h-9 border-solid text-sm shadow-xs"
                      />
                    </FieldLabel>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {booking.subject === 'english' && <SpeakingScore result={booking.testResult} />}
                    <LwrScore result={booking.testResult} />
                  </div>
                </div>
              </Panel>

              <BookingTestResponsiblePanel
                booking={booking}
                bookings={bookings}
                onUpdateBooking={onUpdateBooking}
              />

              {(booking.resultLink || hasBookingAssessmentResult(booking)) && (
                <Panel title="Kết quả" icon={<LinkIcon className="h-4 w-4" />}>
                  <div className="space-y-2 flex flex-col items-start">
                    {booking.resultLink && (
                      <Button asChild variant="link" className="h-auto p-0 justify-start">
                        <a href={booking.resultLink} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Kết quả từ iPad
                        </a>
                      </Button>
                    )}
                    {Boolean(
                      booking.teacher?.trim() && (
                        booking.isInterviewed ||
                        booking.status === 'completed' ||
                        (booking.testResult?.speaking && booking.testResult.speaking !== '-') ||
                        (booking.testResult?.lwr && booking.testResult.lwr !== '-')
                      )
                    ) && (
                      <Button asChild variant="link" className="h-auto p-0 justify-start">
                        <a href={getBookingResultHref(booking.id)} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Kết quả đánh giá
                        </a>
                      </Button>
                    )}
                  </div>
                </Panel>
              )}
            </main>

            <BookingTestDetailSidePanel
              booking={booking}
              detailNote={detailNote}
              onDetailNoteChange={onDetailNoteChange}
              onAddNote={onAddNote}
            />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
