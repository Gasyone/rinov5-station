'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  Phone,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { StatusBadge, ContactCell, PersonnelCell, LocationCell } from '@/components/shared'
import { type BookingTest } from '@/mocks/bookingTests'
import {
  resolveBookingBranch,
  getActiveEmployeesBySchool,
} from './bookingTestStaffHelpers'
import { BookingTestEmployeePickerDialog } from './BookingTestEmployeePickerDialog'
import { BookingTestLevelPopover } from './BookingTestLevelPopover'
import {
  applyBookingCheckIn,
  formatTestTimeWithDay,
  getStatusLabel,
  getSubjectLabel,
  isBookingCheckedIn,
  shouldShowCheckInAction,
} from './bookingTestHelpers'
import {
  getBookingResultHref,
  hasBookingAssessmentResult,
} from './bookingTestAssessmentStorage'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'

interface BookingTestTableRowProps {
  booking: BookingTest
  bookings: BookingTest[]
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onOpenAssessment: (id: string) => void
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
  onCopy: (text: string, key: string) => Promise<void>
  onCall: (phone?: string) => void
}

export function BookingTestTableRow({
  booking,
  bookings,
  isSelected,
  onToggle,
  onRowClick,
  onOpenAssessment,
  onUpdateBooking,
  onCall,
}: BookingTestTableRowProps) {
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const branchName = resolveBookingBranch(booking.school)
  const branchEmployees = useMemo(
    () => getActiveEmployeesBySchool(booking.school),
    [booking.school]
  )

  const hasResult = hasBookingAssessmentResult(booking)
  const resultHref = booking.resultLink?.startsWith('/app/')
    ? booking.resultLink
    : getBookingResultHref(booking.id)

  const isCheckedIn = isBookingCheckedIn(booking)
  const canCheckIn = shouldShowCheckInAction(booking)
  const rowHighlightClass = "bg-background group-hover:bg-muted"

  return (
    <TableRow
      className={cn("group cursor-pointer border-b-0 transition-colors", isCheckedIn && "bg-muted/20")}
      onClick={() => onRowClick(booking.id)}
    >
      <TableCell
        className={cn("sticky left-0 z-30 w-12 min-w-12 max-w-12 overflow-hidden text-center transition-colors", rowHighlightClass)}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(booking.id, Boolean(checked))}
        />
      </TableCell>
      <TableCell className={cn("sticky left-12 z-20 w-[280px] min-w-[280px] max-w-[280px] overflow-hidden transition-colors", rowHighlightClass)}>
        <div className="relative z-10 max-w-full overflow-hidden pr-16">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground">
              {booking.childName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-semibold text-foreground" title={booking.childName}>
                  {booking.childName}
                </p>
                {isCheckedIn && (
                  <span title="Đã đến" className="inline-flex shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                  </span>
                )}
              </div>
              <div className="flex min-w-0 items-center gap-2 mt-0.5">
                <Badge variant="outline" className="rounded-md text-[10px] font-bold">
                  {getSubjectLabel(booking.subject)}
                </Badge>
              </div>
            </div>
          </div>

          <div
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
            onClick={(event) => event.stopPropagation()}
          >
            {canCheckIn && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Check-in (Xác nhận đến)"
                aria-label="Check-in học viên"
                onClick={() =>
                  onUpdateBooking(booking.id, (current) => applyBookingCheckIn(current))
                }
                className="rounded-full"
              >
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            {booking.subject === 'english' && booking.teacher?.trim() && booking.status === 'checkin' && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Mở đánh giá"
                aria-label={`Mở đánh giá cho ${booking.childName}`}
                onClick={() => onOpenAssessment(booking.id)}
                className="rounded-full"
              >
                <FileText className="h-4 w-4 text-primary" />
              </Button>
            )}
            {booking.subject !== 'math' && !booking.teacher?.trim() && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Gán giáo viên"
                aria-label={`Gán giáo viên cho ${booking.childName}`}
                onClick={() => setTeacherPickerOpen(true)}
                className="rounded-full text-amber-500 hover:text-amber-600"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              title="Gọi điện"
              aria-label={`Gọi ${booking.familyName}`}
              onClick={() => onCall(booking.phone)}
              className="rounded-full"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <ContactCell
          name={booking.familyName}
          phone={booking.phone}
          studentName={booking.childName}
          masked={true}
          additionalContacts={
            booking.familyMembers && booking.familyMembers.length > 1
              ? booking.familyMembers.map((m) => ({ name: m.name, phone: m.phone }))
              : undefined
          }
        />
      </TableCell>
      <TableCell>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-xs font-normal text-foreground" title={booking.program}>
            {booking.program}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span>{formatTestTimeWithDay(booking.testTime)}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <PersonnelCell
            items={booking.teacher ? [{ name: booking.teacher, role: 'Giáo viên' }] : []}
            size="sm"
            mode="single"
            showRole={false}
          />
          <LocationCell branch={booking.school} />
        </div>
      </TableCell>
      <TableCell>
        {booking.subject === 'english' ? (
          <SpeakingScore result={booking.testResult} compact />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <LwrScore result={booking.testResult} compact />
      </TableCell>
      <TableCell>
        <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <BookingTestLevelPopover
          booking={booking}
          onUpdateBooking={onUpdateBooking}
        />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        {hasResult ? (
          <Link
            href={resultHref}
            target="_blank"
            rel="noreferrer"
            title="Mở trang kết quả nhận xét"
            aria-label={`Mở trang kết quả nhận xét của ${booking.childName}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            Nhận xét
          </Link>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <div className="flex max-w-44 items-center gap-2">
          <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p
            className="truncate text-xs italic text-muted-foreground"
            title={booking.notes?.at(-1)?.text ?? booking.msg}
          >
            {booking.notes?.at(-1)?.text ?? booking.msg ?? '-'}
          </p>
        </div>

        {booking.subject !== 'math' && (
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
      </TableCell>
    </TableRow>
  )
}
