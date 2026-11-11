'use client'

import { useState, useMemo } from 'react'
import {
  ArrowLeftRight,
  CheckCircle2,
  ExternalLink,
  MapPin,
  UserCheck,
  UserPlus,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge, ContactCell, PersonnelHoverCard, ConfirmDialog } from '@/components/shared'
import { useAuthStore } from '@/stores/useAuthStore'
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
  formatStudentMetaLine,
  formatTestTimeWithDay,
  getAvatarColor,
  getInitials,
  getParentDisplayName,
  getStatusLabel,
  isBookingCheckedIn,
  isBookingDeclined,
  shouldShowCheckInAction,
} from './bookingTestHelpers'
import { SpeakingScore, LwrScore, MathLwrScore } from './BookingTestScoreDisplay'

interface BookingTestTableRowProps {
  booking: BookingTest
  bookings: BookingTest[]
  index?: number
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onOpenAssessment: (id: string) => void
  onOpenManualUpload?: (id: string) => void
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
  onOpenManualUpload,
  onUpdateBooking,
}: BookingTestTableRowProps) {
  const user = useAuthStore((state) => state.user)
  const authorName = user?.name ?? 'Người dùng hiện tại'
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
  const isDeclined = isBookingDeclined(booking)
  const canCheckIn = shouldShowCheckInAction(booking)
  const canCancel =
    booking.status !== 'cancelled' &&
    booking.status !== 'completed' &&
    !isDeclined
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const parentDisplayName = getParentDisplayName(booking)

  // Zebra striping synchronized with OperationsAlert / StudentsTable standard
  const isEvenRow = typeof index === 'number' ? index % 2 === 1 : false
  const stickyBgClass = isSelected
    ? '!bg-sky-100 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
  const rowBgClass = isSelected
    ? '!bg-sky-50 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800'

  const isMyTeacher = booking.teacher?.trim() === authorName

  return (
    <tr
      onClick={() => onRowClick(booking.id)}
      className={cn(
        'group cursor-pointer transition-colors align-middle [&>td]:py-1 [&>td]:px-2 xl:[&>td]:px-2.5 2xl:[&>td]:py-2 border-b-0',
        rowBgClass
      )}
    >
      {/* 1. Checkbox */}
      <td
        className={cn(
          'sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center px-1 transition-colors',
          stickyBgClass
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(booking.id, Boolean(checked))}
          aria-label={`Chọn ${booking.childName}`}
        />
      </td>

      {/* 2. Học viên: Avatar đa sắc + Tên + Check-in icon + Tuổi/DOB */}
      <td
        onClick={() => onRowClick(booking.id)}
        className={cn(
          'sticky left-8 z-30 w-[270px] min-w-[250px] xl:w-[285px] 2xl:w-[300px] px-2 xl:px-2.5 transition-colors cursor-pointer',
          stickyBgClass
        )}
      >
        <div
          className={cn(
            'relative flex items-center justify-between gap-2 min-w-0 pr-1',
            canCheckIn && canCancel
              ? 'pr-[124px]'
              : canCheckIn
                ? 'pr-[92px]'
                : canCancel
                  ? 'group-hover:pr-8'
                  : ''
          )}
        >
          <div className="flex items-center gap-2 2xl:gap-2.5 min-w-0 flex-1">
            <div
              className={cn(
                'h-6.5 w-6.5 2xl:h-8 2xl:w-8 rounded flex items-center justify-center text-xs 2xl:text-sm font-medium shrink-0 hover:opacity-80 transition-opacity',
                getAvatarColor(booking.id)
              )}
            >
              {getInitials(booking.childName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p
                  className="font-medium text-foreground text-xs 2xl:text-sm truncate hover:underline hover:text-primary leading-tight cursor-pointer"
                  title={booking.childName}
                >
                  {booking.childName}
                </p>
                {isCheckedIn ? (
                  <span title="Đã check-in" className="inline-flex shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  </span>
                ) : isDeclined ? (
                  <span title="Từ chối đến" className="inline-flex shrink-0">
                    <XCircle className="h-4 w-4 text-rose-500 fill-rose-100 dark:fill-rose-950" />
                  </span>
                ) : null}
              </div>
              <p
                className="text-xs text-muted-foreground font-normal leading-none mt-0.5 2xl:mt-1 truncate"
                title={`Thông tin học viên: ${formatStudentMetaLine(booking)}`}
              >
                {formatStudentMetaLine(booking)}
              </p>
            </div>
          </div>

          {/* Quick row actions: Hủy khi hover (nằm trước), Check-in luôn hiển thị (nằm sau) để Check-in giữ cố định vị trí mép phải không bị nhảy giao diện */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pl-1 bg-inherit"
            onClick={(event) => event.stopPropagation()}
          >
            {canCancel && (
              <Button
                type="button"
                variant="ghost"
                title="Hủy ca test / Báo vắng"
                aria-label={`Hủy ca test cho ${booking.childName}`}
                onClick={() => setConfirmCancelOpen(true)}
                className="size-7 p-0 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-100/80 dark:hover:bg-rose-950/60 cursor-pointer hidden group-hover:inline-flex items-center justify-center shrink-0 [&_svg]:!size-4.5"
              >
                <XCircle className="size-4.5 text-rose-500" />
              </Button>
            )}
            {canCheckIn && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                title="Check-in (Xác nhận đến)"
                aria-label={`Check-in cho ${booking.childName}`}
                onClick={() => {
                  onUpdateBooking(booking.id, (current) => applyBookingCheckIn(current))
                  toast.success(`Đã check-in cho học viên ${booking.childName}`)
                }}
                className="h-6.5 px-2 text-xs font-normal border-emerald-500/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 cursor-pointer shadow-none gap-1.5 rounded shrink-0 [&_svg]:!size-4"
              >
                <UserCheck className="size-4 shrink-0 text-emerald-600" />
                <span>Check-in</span>
              </Button>
            )}
          </div>
        </div>
      </td>

      {/* 3. Liên hệ: Phụ huynh + SĐT đã che */}
      <td
        className="w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2 xl:px-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <ContactCell
          name={parentDisplayName}
          phone={booking.phone}
          studentName={booking.childName}
          masked={true}
          showPhoneIcon={false}
          showCallButton={false}
          showFamilyIcon={false}
          nameClassName="text-xs 2xl:text-sm font-normal text-foreground"
          phoneClassName="text-xs 2xl:text-xs font-mono text-muted-foreground"
          additionalContacts={
            booking.familyMembers && booking.familyMembers.length > 1
              ? booking.familyMembers.map((m) => ({ name: m.name, phone: m.phone }))
              : undefined
          }
        />
      </td>

      {/* 4. Lịch test: Ngày giờ & Chương trình */}
      <td
        className="w-[175px] min-w-[160px] xl:w-[190px] 2xl:w-[210px] px-2 xl:px-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <BookingTestScheduleHoverCard booking={booking} side="bottom" align="start">
          <div
            onClick={() => {
              window.open(
                `/app/calendar_event_schedule?search=${encodeURIComponent(booking.childName)}&bookingId=${encodeURIComponent(booking.id)}`,
                '_blank'
              )
            }}
            className="group/sch min-w-0 flex flex-col gap-0.5 2xl:gap-1 cursor-pointer text-left w-fit max-w-full"
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
      </td>

      {/* 5. Speaking & LWR (hoặc LWR Level cho môn Toán): Điểm số */}
      <td className="w-[195px] min-w-[180px] xl:w-[210px] 2xl:w-[230px] px-2 xl:px-2.5">
        {booking.subject === 'english' ? (
          <div className="min-w-0 space-y-1">
            <SpeakingScore
              result={booking.testResult}
              compact
              onOpenAssessment={() => onOpenAssessment(booking.id)}
            />
            <LwrScore result={booking.testResult} compact />
          </div>
        ) : (
          <div className="min-w-0">
            <MathLwrScore
              result={booking.testResult}
              compact
              status={booking.status}
              resultLink={booking.resultLink || booking.testResult?.uploadedFileUrl}
              expectedLevel={booking.expectedLevel}
            />
          </div>
        )}
      </td>

      {/* 6. Kết quả: Level đặt & Nhận xét / Upload */}
      <td
        className="w-[125px] min-w-[115px] xl:w-[135px] 2xl:w-[145px] px-2"
        onClick={(event) => event.stopPropagation()}
      >
        <BookingTestLevelPopover
          booking={booking}
          onUpdateBooking={onUpdateBooking}
          onOpenManualUpload={onOpenManualUpload}
        />
      </td>

      {/* 7. Trạng thái: Badge duy nhất */}
      <td className="w-[130px] min-w-[120px] xl:w-[140px] 2xl:w-[155px] px-2 xl:px-2.5 whitespace-nowrap">
        <StatusBadge
          status={booking.status}
          label={getStatusLabel(booking.status)}
          className="text-xs px-2 py-0.5 h-5 font-normal shrink-0 whitespace-nowrap leading-none"
        />
      </td>

      {/* 8. Phụ trách: Người phụ trách + Cơ sở */}
      <td
        className="w-[170px] min-w-[155px] xl:w-[190px] 2xl:w-[210px] px-2 xl:px-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-0.5 2xl:gap-1 text-left">
          {/* Người phụ trách */}
          {booking.teacher?.trim() ? (
            <PersonnelHoverCard
              person={{
                name: booking.teacher,
                role: 'Phụ trách đánh giá',
                phone: '0987 654 321',
                email: `${booking.teacher.toLowerCase().replace(/\s+/g, '')}@rinoedu.vn`,
              }}
            >
              <div
                onClick={() => setTeacherPickerOpen(true)}
                className="group/assignee inline-flex items-center gap-1 cursor-pointer hover:text-primary transition-colors w-fit leading-tight text-xs 2xl:text-sm text-foreground font-normal truncate max-w-[155px] xl:max-w-[175px] 2xl:max-w-[195px]"
                title={`Người phụ trách: ${booking.teacher} (Bấm để đổi)`}
              >
                <span className="truncate">{booking.teacher}</span>
                {isMyTeacher && (
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal shrink-0">
                    (bạn)
                  </span>
                )}
                <ArrowLeftRight className="size-3 text-primary shrink-0 transition-colors" />
              </div>
            </PersonnelHoverCard>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setTeacherPickerOpen(true)}
              className="h-5.5 px-2 text-xs font-normal border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/60 cursor-pointer shadow-3xs gap-1 rounded w-fit"
              title="Gán người phụ trách"
            >
              <UserPlus className="h-3 w-3 shrink-0" />
              <span>Gán phụ trách</span>
            </Button>
          )}

          {/* Thông tin cơ sở */}
          <div
            className="flex items-center gap-1 text-xs text-muted-foreground leading-tight truncate"
            title={booking.school || 'Cơ sở'}
          >
            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{booking.school || 'Cơ sở'}</span>
          </div>
        </div>

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

          <ConfirmDialog
            open={confirmCancelOpen}
            onOpenChange={setConfirmCancelOpen}
            title={`Hủy ca kiểm tra của ${booking.childName}?`}
            description="Ca kiểm tra này sẽ chuyển sang trạng thái Đã hủy và học viên được ghi nhận vắng/từ chối đến."
            confirmLabel="Hủy ca test"
            variant="destructive"
            onConfirm={() => {
              onUpdateBooking(booking.id, (current) => ({
                ...current,
                status: 'cancelled',
                attendance: 'declined',
              }))
              toast.success(`Đã hủy ca test cho ${booking.childName}`)
            }}
          />
        </td>
    </tr>
  )
}
