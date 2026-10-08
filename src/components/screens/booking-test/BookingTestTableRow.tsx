'use client'

import { useState, useMemo } from 'react'
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { StatusBadge, ContactCell, PersonnelCell } from '@/components/shared'
import { type BookingTest } from '@/mocks/bookingTests'
import {
  resolveBookingBranch,
  getActiveEmployeesBySchool,
  getDutyRosterEmployees,
} from './bookingTestStaffHelpers'
import { BookingTestEmployeePickerDialog } from './BookingTestEmployeePickerDialog'
import { BookingTestLevelPopover } from './BookingTestLevelPopover'
import { BookingTestScheduleHoverCard } from './BookingTestScheduleHoverCard'
import {
  applyBookingCheckIn,
  formatStudentAgeDob,
  formatStudentMetaLine,
  formatTestTimeWithDay,
  getParentDisplayName,
  getStatusLabel,
  isBookingCheckedIn,
  shouldShowCheckInAction,
} from './bookingTestHelpers'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'

interface BookingTestTableRowProps {
  booking: BookingTest
  bookings: BookingTest[]
  index?: number
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onOpenAssessment: (id: string) => void
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
  onCopy: (text: string, key: string) => Promise<void>
  onCall?: (phone?: string) => void
}

export function BookingTestTableRow({
  booking,
  bookings,
  index = 0,
  isSelected,
  onToggle,
  onRowClick,
  onOpenAssessment,
  onUpdateBooking,
}: BookingTestTableRowProps) {
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const branchName = resolveBookingBranch(booking.school)
  const branchEmployees = useMemo(
    () => getActiveEmployeesBySchool(booking.school, booking.testTime),
    [booking.school, booking.testTime]
  )
  const allRosterEmployees = useMemo(
    () => getDutyRosterEmployees(booking.school),
    [booking.school]
  )

  const isCheckedIn = isBookingCheckedIn(booking)
  const canCheckIn = shouldShowCheckInAction(booking)
  const parentDisplayName = getParentDisplayName(booking)

  const isEven = index % 2 === 1
  const rowBgClass = isEven ? 'bg-muted/30 dark:bg-muted/15' : 'bg-background'
  const hoverBgClass = 'group-hover:bg-accent/40 dark:group-hover:bg-accent/30'

  // Opaque solid background specifically for sticky fixed cells to prevent bleed-through when scrolling
  const stickyBgClass = isEven
    ? 'bg-[color-mix(in_srgb,var(--muted)_40%,var(--background))] dark:bg-[color-mix(in_srgb,var(--muted)_25%,var(--background))]'
    : 'bg-background'
  const stickyHoverClass = 'group-hover:bg-[color-mix(in_srgb,var(--accent)_50%,var(--background))] dark:group-hover:bg-[color-mix(in_srgb,var(--accent)_30%,var(--background))]'

  const selectedBgClass = isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
  const stickySelectedClass = isSelected
    ? 'bg-[color-mix(in_srgb,var(--primary)_8%,var(--background))]'
    : stickyBgClass

  return (
    <TableRow
      className={cn(
        "group cursor-pointer border-b border-border/60 transition-colors h-[48px] [&>td]:py-1.5 [&>td]:px-2.5",
        rowBgClass,
        hoverBgClass,
        selectedBgClass
      )}
      onClick={() => onRowClick(booking.id)}
    >
      <TableCell
        className={cn(
          "sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center px-1 transition-colors",
          stickySelectedClass,
          stickyHoverClass
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(booking.id, Boolean(checked))}
        />
      </TableCell>
      <TableCell
        className={cn(
          "sticky left-8 z-30 w-[240px] min-w-[240px] max-w-[240px] overflow-hidden transition-colors",
          stickySelectedClass,
          stickyHoverClass
        )}
      >
        <div className="relative z-10 max-w-full overflow-hidden pr-2 group-hover:pr-14">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-foreground">
              {booking.childName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-semibold text-foreground leading-tight" title={booking.childName}>
                  {booking.childName}
                </p>
                {isCheckedIn && (
                  <span title="Đã đến" className="inline-flex shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100" />
                  </span>
                )}
              </div>
              <div className="flex min-w-0 items-center gap-1.5 mt-0.5">
                <span
                  className="truncate text-xs text-muted-foreground leading-tight"
                  title={`Thông tin học viên: ${formatStudentMetaLine(booking)}`}
                >
                  {formatStudentMetaLine(booking)}
                </span>
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
                size="icon-xs"
                title="Check-in (Xác nhận đến)"
                aria-label="Check-in học viên"
                onClick={() =>
                  onUpdateBooking(booking.id, (current) => applyBookingCheckIn(current))
                }
                className="h-6 w-6 p-0 rounded-md"
              >
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            )}
            {booking.subject === 'english' && booking.teacher?.trim() && (booking.status === 'checkin' || booking.status === 'assessing') && (
              <Button
                variant="ghost"
                size="icon-xs"
                title="Mở đánh giá"
                aria-label={`Mở đánh giá cho ${booking.childName}`}
                onClick={() => onOpenAssessment(booking.id)}
                className="h-6 w-6 p-0 rounded-md"
              >
                <FileText className="h-3.5 w-3.5 text-primary" />
              </Button>
            )}
            {booking.subject !== 'math' && !booking.teacher?.trim() && (
              <Button
                variant="ghost"
                size="icon-xs"
                title="Gán giáo viên"
                aria-label={`Gán giáo viên cho ${booking.childName}`}
                onClick={() => setTeacherPickerOpen(true)}
                className="h-6 w-6 p-0 rounded-md text-amber-500 hover:text-amber-600"
              >
                <UserPlus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <ContactCell
          name={parentDisplayName}
          phone={booking.phone}
          studentName={booking.childName}
          masked={true}
          className="gap-0"
          showPhoneIcon={false}
          showCallButton={false}
          showFamilyIcon={false}
          additionalContacts={
            booking.familyMembers && booking.familyMembers.length > 1
              ? booking.familyMembers.map((m) => ({ name: m.name, phone: m.phone }))
              : undefined
          }
        />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <BookingTestScheduleHoverCard booking={booking} side="right" align="start">
          <div
            onClick={() => {
              window.open(
                `/app/calendar_event_schedule?search=${encodeURIComponent(booking.childName)}&bookingId=${encodeURIComponent(booking.id)}`,
                '_blank'
              )
            }}
            className="group/sch min-w-0 space-y-0.5 cursor-pointer text-left"
          >
            <p
              className="truncate text-xs font-normal text-sky-600 dark:text-sky-400 group-hover/sch:text-sky-700 dark:group-hover/sch:text-sky-300 group-hover/sch:underline leading-tight flex items-center gap-1"
              title={`${formatTestTimeWithDay(booking.testTime)} - Nhấp để mở Lịch test`}
            >
              <span>{formatTestTimeWithDay(booking.testTime)}</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/sch:opacity-80 transition-opacity" />
            </p>
            <p
              className="truncate text-xs text-muted-foreground leading-tight"
              title={
                booking.expectedLevel?.trim()
                  ? `${booking.program} • Level dự kiến: ${booking.expectedLevel.trim()}`
                  : booking.program
              }
            >
              <span>{booking.program}</span>
              {booking.expectedLevel?.trim() && (
                <span> • {booking.expectedLevel.trim()}</span>
              )}
            </p>
          </div>
        </BookingTestScheduleHoverCard>
      </TableCell>
      <TableCell>
        {booking.subject === 'english' ? (
          <div className="min-w-0 space-y-1">
            <SpeakingScore result={booking.testResult} compact />
            <LwrScore result={booking.testResult} compact />
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <BookingTestLevelPopover
          booking={booking}
          onUpdateBooking={onUpdateBooking}
        />
      </TableCell>
      <TableCell className="w-28 min-w-28 max-w-32">
        <StatusBadge
          status={booking.status}
          label={getStatusLabel(booking.status)}
          className="font-normal whitespace-nowrap"
        />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <div className="space-y-0.5 min-w-0">
          <PersonnelCell
            items={booking.teacher ? [{ name: booking.teacher, role: 'Giáo viên' }] : []}
            size="xs"
            mode="single"
            showRole={false}
          />
          <p
            className="truncate text-xs italic text-muted-foreground leading-tight max-w-[180px]"
            title={booking.notes?.at(-1)?.text ?? booking.msg ?? undefined}
          >
            {booking.notes?.at(-1)?.text ?? booking.msg ?? '-'}
          </p>
        </div>

        {booking.subject !== 'math' && (
          <BookingTestEmployeePickerDialog
            open={teacherPickerOpen}
            employees={branchEmployees}
            allRosterEmployees={allRosterEmployees}
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
