'use client'

import { useMemo, useState } from 'react'
import {
  BookOpen,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  History,
  MapPin,
  School,
  User,
  UserCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AppAvatar,
  PersonnelHoverCard,
  StatusBadge,
  StudentProfileHoverCard,
  type StudentProfileItem,
} from '@/components/shared'
import {
  PROGRAM_LEVELS,
  SUB_LEVELS,
  mockBookingTests,
  type BookingTest,
} from '@/mocks/bookingTests'
import { InlineSelect } from '@/components/controls'
import {
  canSelectPlacementLevel,
  formatStudentAgeDob,
  formatTestTimeWithDay,
  getParentDisplayName,
  getStatusLabel,
  getSubjectLabel,
  isBookingCheckedIn,
} from './bookingTestHelpers'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'
import { BookingTestDetailActions } from './BookingTestDetailActions'
import { BookingTestEmployeePickerDialog } from './BookingTestEmployeePickerDialog'
import { BookingTestPreviousBookingsPopover } from './BookingTestPreviousBookingsPopover'
import { getBookingResultHref, hasBookingAssessmentResult } from './bookingTestAssessmentStorage'
import {
  findEmployeeByName,
  getActiveEmployeesBySchool,
  getDutyRosterEmployees,
  getPersonTitle,
  resolveBookingBranch,
} from './bookingTestStaffHelpers'
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
  onSelectBooking?: (booking: BookingTest) => void
}

/** Thẻ thông tin nhỏ gọn, không lạm dụng đường line */
function DetailCard({
  title,
  icon,
  badge,
  actions,
  children,
  className,
  titleClassName,
}: {
  title: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  titleClassName?: string
}) {
  return (
    <div className={cn('rounded-lg border border-border/70 bg-card overflow-hidden shadow-2xs', className)}>
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-muted/50 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className={cn('flex items-center gap-1.5 text-xs font-normal text-foreground', titleClassName)}>
            {icon}
            <span>{title}</span>
          </h3>
          {badge}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="p-3.5">
        {children}
      </div>
    </div>
  )
}

export function BookingTestDetailDialog({
  booking: initialBooking,
  bookings = [],
  onOpenChange,
  onUpdateBooking,
  onOpenAssessment,
  onSelectBooking,
}: BookingTestDetailDialogProps) {
  const [overrideBooking, setOverrideBooking] = useState<BookingTest | null>(null)
  const [prevPropId, setPrevPropId] = useState(initialBooking?.id)

  if (initialBooking?.id !== prevPropId) {
    setPrevPropId(initialBooking?.id)
    setOverrideBooking(null)
  }

  const booking = overrideBooking ?? initialBooking

  const handleSwitchBooking = (selected: BookingTest) => {
    setOverrideBooking(selected)
    onSelectBooking?.(selected)
  }

  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const canEditPlacementLevel = Boolean(booking && canSelectPlacementLevel(booking))

  const branchName = booking ? resolveBookingBranch(booking.school) : ''
  const branchEmployees = useMemo(
    () => (booking ? getActiveEmployeesBySchool(booking.school, booking.testTime) : []),
    [booking]
  )
  const allRosterEmployees = useMemo(
    () => (booking ? getDutyRosterEmployees(booking.school) : []),
    [booking]
  )
  const creatorName = booking?.createdBy || booking?.ops || 'Sale Nguyễn Tuân'
  const parentDisplayName = booking ? getParentDisplayName(booking) : 'Phụ huynh'

  const studentSchool = booking?.schoolName || 'Tiểu học Chu Văn An (Hà Nội)'
  const studentAbility = booking?.academicAbility || 'Khá - Giỏi / Tiếp thu nhanh'
  const parentAddress = booking?.address || 'Thanh Xuân, Hà Nội'

  const creatorEmployee = useMemo(() => findEmployeeByName(creatorName), [creatorName])
  const creatorPersonnelItem = useMemo(() => {
    return {
      id: creatorEmployee?.id || 'EMP-HD',
      name: creatorName,
      role: creatorEmployee ? getPersonTitle(creatorEmployee) : 'Tư vấn viên · Tuyển sinh',
      avatar: creatorEmployee?.avatar,
      phone: creatorEmployee?.phone || '0912345678',
      email: creatorEmployee?.email || 'hung.dao@rinoedu.vn',
    }
  }, [creatorEmployee, creatorName])

  const teacherName = booking?.teacher || booking?.tester || ''
  const teacherEmployee = useMemo(() => findEmployeeByName(teacherName), [teacherName])
  const teacherPersonnelItem = useMemo(() => {
    if (!teacherName) return null
    return {
      id: teacherEmployee?.id || 'EMP-GV',
      name: teacherName,
      role: teacherEmployee ? getPersonTitle(teacherEmployee) : 'Giáo viên phụ trách test',
      avatar: teacherEmployee?.avatar,
      phone: teacherEmployee?.phone || '0987654321',
      email: teacherEmployee?.email || `${teacherName.toLowerCase().replace(/\s+/g, '.')}@rinoedu.vn`,
    }
  }, [teacherEmployee, teacherName])

  const studentProfileItem = useMemo<StudentProfileItem | null>(() => {
    if (!booking) return null
    const speakingScoreNum = typeof booking.testResult?.speakingScore === 'number'
      ? booking.testResult.speakingScore
      : parseFloat(String(booking.testResult?.speakingScore ?? ''))
    return {
      id: (booking as { studentId?: string }).studentId || booking.id,
      name: booking.childName,
      code: (booking as { studentId?: string }).studentId || `HV-${booking.id}`,
      birthDate: booking.dob,
      status: getStatusLabel(booking.status),
      branch: booking.school,
      className: booking.program,
      parentName: parentDisplayName,
      parentPhone: booking.phone,
      rating: isNaN(speakingScoreNum) ? 4.5 : speakingScoreNum,
      note: booking.notes?.at(-1)?.text || booking.msg,
    }
  }, [booking, parentDisplayName])

  // Tìm các lần test khác của học viên này
  const previousBookings = useMemo(() => {
    if (!booking) return []
    const source = bookings && bookings.length > 0 ? bookings : mockBookingTests
    const cleanName = booking.childName?.trim().toLowerCase()
    const cleanPhone = booking.phone?.trim()
    return source.filter(
      (b) =>
        b.id !== booking.id &&
        ((cleanName && b.childName?.trim().toLowerCase() === cleanName) ||
          (cleanPhone && b.phone?.trim() === cleanPhone))
    )
  }, [booking, bookings])

  // Lịch sử thao tác & ghi chú
  const historyItems = useMemo(() => {
    if (!booking) return []
    if (booking.notes && booking.notes.length > 0) {
      return booking.notes
    }
    if (booking.msg) {
      return [{ text: booking.msg, author: booking.createdBy || 'Hệ thống', timestamp: '2026-08-05 09:30' }]
    }
    return []
  }, [booking])

  if (!booking) return null

  const hasResult = hasBookingAssessmentResult(booking)
  const resultHref = booking.resultLink?.startsWith('/app/')
    ? booking.resultLink
    : getBookingResultHref(booking.id)

  return (
    <>
      <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
        <DialogContent className="grid max-h-[85vh] w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-4xl border border-border shadow-2xl bg-background">
          {/* Header gọn gàng - Bỏ đường line, phẳng, giản lược khoảng cách */}
          <DialogHeader className="shrink-0 px-4 pt-3 pb-0.5 bg-background">
            <div className="flex items-center justify-between gap-4 pr-6">
              <DialogTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>Chi tiết Phiếu kiểm tra/Trải nghiệm</span>
                <Badge variant="outline" className="font-mono text-xs font-semibold text-foreground bg-muted/60">
                  #{booking.id}
                </Badge>
              </DialogTitle>
              <div className="shrink-0">
                <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
              </div>
            </div>
          </DialogHeader>

          {/* Body: 2 Cột với tỷ lệ 6:4 (Trái 60%, Phải 40%) - Giản lược khoảng cách với Header */}
          <div className="min-h-0 overflow-y-auto px-4 pt-1 pb-3 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
              {/* CỘT TRÁI (60%): Kết quả ở trên, Lịch test ở dưới */}
              <div className="flex flex-col gap-3 min-w-0 md:col-span-3">
                {/* 1. KẾT QUẢ ĐÁNH GIÁ (Ở TRÊN) */}
                <DetailCard
                  title="Kết quả đánh giá trình độ"
                  badge={
                    hasResult ? (
                      <Badge variant="outline" className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 h-5 px-1.5">
                        Đã có kết quả
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground h-5 px-1.5">
                        Chưa có kết quả
                      </Badge>
                    )
                  }
                  actions={
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenAssessment(booking.id)}
                      className="h-5 px-1.5 text-xs font-normal gap-1 text-primary hover:text-primary/80 hover:bg-primary/10 shrink-0 cursor-pointer"
                      title="Mở modal nhận xét & đánh giá"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>{hasResult ? 'Sửa nhận xét' : 'Nhập nhận xét'}</span>
                    </Button>
                  }
                >
                  {hasResult ? (
                    <div className="space-y-2.5 text-xs">
                      {/* Trình độ đầu vào & Nhánh */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">Trình độ</span>
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
                            className="h-7 border-solid text-xs shadow-2xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">Nhánh trình độ</span>
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
                            className="h-7 border-solid text-xs shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Điểm số Speaking & LWR */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        {booking.subject === 'english' ? (
                          <SpeakingScore result={booking.testResult} />
                        ) : (
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                              Điểm số
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-1">-</p>
                          </div>
                        )}
                        <LwrScore result={booking.testResult} />
                      </div>

                      {/* Link kết quả */}
                      {(booking.resultLink || hasResult) && (
                        <div className="flex flex-wrap items-center gap-3 pt-1.5 border-t border-border/40">
                          {booking.resultLink && (
                            <a
                              href={booking.resultLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Xem kết quả từ iPad
                            </a>
                          )}
                          {hasResult && (
                            <a
                              href={resultHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Xem trang đánh giá chi tiết
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-5 px-3 text-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-1.5">
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Chưa có kết quả đánh giá</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                        {booking.status === 'checkin' || booking.status === 'assessing'
                          ? 'Học viên đã check-in / đang đánh giá. Giáo viên có thể tiến hành đánh giá và nhập nhận xét.'
                          : 'Học viên chưa tham gia kiểm tra hoặc chưa có kết quả chấm điểm từ giáo viên.'}
                      </p>
                      {booking.expectedLevel?.trim() && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Trình độ dự kiến:</span>
                          <strong className="text-foreground font-medium">{booking.expectedLevel.trim()}</strong>
                        </div>
                      )}
                      <Button
                        size="sm"
                        onClick={() => onOpenAssessment(booking.id)}
                        className="mt-3 h-7.5 px-3.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Mở modal nhận xét & đánh giá</span>
                      </Button>
                    </div>
                  )}
                </DetailCard>

                {/* 2. LỊCH HẸN & ĐỊA ĐIỂM (Ở DƯỚI) */}
                <DetailCard
                  title="Chi tiết Lịch hẹn & Địa điểm"
                  badge={
                    isBookingCheckedIn(booking) ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/70 text-xs h-5 px-1.5 font-medium">
                        Đã check-in
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground bg-background h-5 px-1.5">
                        Chờ check-in
                      </Badge>
                    )
                  }
                  actions={
                    (booking.subject !== 'math' || Boolean(booking.teacher)) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1.5 text-xs font-normal gap-1 text-primary hover:text-primary/80 hover:bg-primary/10 shrink-0 cursor-pointer"
                        onClick={() => setTeacherPickerOpen(true)}
                        title="Thay đổi người phụ trách kiểm tra"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        <span>{booking.teacher ? 'Đổi phụ trách' : 'Gán phụ trách'}</span>
                      </Button>
                    )
                  }
                >
                  <div className="space-y-2.5 text-xs">
                    {/* Dòng 1: Thời gian test & Người phụ trách GV */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <button
                          type="button"
                          onClick={() => {
                            window.open(
                              `/app/calendar_event_schedule?search=${encodeURIComponent(booking.childName)}&bookingId=${encodeURIComponent(booking.id)}`,
                              '_blank'
                            )
                          }}
                          className="font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline text-xs inline-flex items-center gap-1 text-left cursor-pointer"
                          title="Xem trên Lịch test (mở tab mới)"
                        >
                          <span>{formatTestTimeWithDay(booking.testTime)}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                        </button>
                      </div>
                      {teacherPersonnelItem ? (
                        <PersonnelHoverCard person={teacherPersonnelItem} align="end">
                          <div className="flex items-center gap-1 shrink-0 text-xs cursor-pointer group">
                            <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span className="font-semibold text-foreground truncate max-w-[130px] group-hover:text-primary group-hover:underline transition-colors">
                              {teacherName}
                            </span>
                          </div>
                        </PersonnelHoverCard>
                      ) : (
                        <div className="flex items-center gap-1 shrink-0 text-xs">
                          <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="font-semibold text-foreground truncate max-w-[130px]">
                            {booking.teacher || booking.tester || 'Chưa gán GV'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dòng 2: Cơ sở & Phòng test */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="font-semibold text-foreground text-xs truncate">
                          {booking.school}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-xs">
                        <School className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                        <span className="font-medium text-foreground">
                          {booking.classroom || booking.room || 'Phòng A1'}
                        </span>
                      </div>
                    </div>

                    {/* Dòng 3: Chương trình & Môn học & Level dự kiến */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="font-semibold text-foreground text-xs truncate">
                          {booking.program}
                        </span>
                        <Badge variant="secondary" className="text-xs font-normal h-4.5 px-1.5">
                          {getSubjectLabel(booking.subject)}
                        </Badge>
                      </div>
                      {booking.expectedLevel?.trim() && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          Dự kiến: <strong className="font-medium text-foreground">{booking.expectedLevel.trim()}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </DetailCard>
              </div>

              {/* CỘT PHẢI (40%): Thông tin học viên & Thời gian tạo */}
              <div className="flex flex-col gap-3 min-w-0 md:col-span-2">
                {/* 1. THÔNG TIN HỌC VIÊN */}
                <DetailCard
                  title="Thông tin Học viên"
                  titleClassName="font-normal text-muted-foreground"
                  actions={
                    <BookingTestPreviousBookingsPopover
                      booking={booking}
                      previousBookings={previousBookings}
                      onSwitchBooking={handleSwitchBooking}
                    />
                  }
                >
                  <div className="space-y-2 text-xs">
                    {/* Dòng 1: Học viên & Ngày sinh / Tuổi */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      {studentProfileItem ? (
                        <StudentProfileHoverCard student={studentProfileItem} align="start" side="bottom">
                          <span className="font-semibold text-foreground text-xs truncate cursor-pointer hover:text-primary hover:underline transition-colors">
                            {booking.childName}
                          </span>
                        </StudentProfileHoverCard>
                      ) : (
                        <span className="font-semibold text-foreground text-xs truncate">
                          {booking.childName}
                        </span>
                      )}
                      {booking.dob && (
                        <span className="text-muted-foreground text-xs shrink-0 text-right">
                          {formatStudentAgeDob(booking.dob)}
                        </span>
                      )}
                    </div>

                    {/* Dòng 2: Trường học của học viên */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="text-muted-foreground shrink-0">Trường:</span>
                      <span className="font-normal text-muted-foreground truncate text-right" title={studentSchool}>
                        {studentSchool}
                      </span>
                    </div>

                    {/* Dòng 3: Học lực của học viên */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="text-muted-foreground shrink-0">Học lực:</span>
                      <span className="font-normal text-muted-foreground truncate text-right" title={studentAbility}>
                        {studentAbility}
                      </span>
                    </div>

                    {/* Đường phân cách tách thông tin Phụ huynh */}
                    <div className="border-t border-border/50 my-1" />

                    {/* Dòng 4: Phụ huynh & Số điện thoại */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="font-semibold text-foreground truncate">
                        {parentDisplayName}
                      </span>
                      <span className="font-mono font-normal text-muted-foreground shrink-0">
                        {booking.phone}
                      </span>
                    </div>

                    {/* Dòng 5: Địa chỉ phụ huynh */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="text-muted-foreground shrink-0">Địa chỉ:</span>
                      <span className="font-normal text-muted-foreground truncate text-right" title={parentAddress}>
                        {parentAddress}
                      </span>
                    </div>

                    {/* Thành viên phụ (nếu có) */}
                    {booking.familyMembers && booking.familyMembers.length > 1 && (
                      <div className="space-y-0.5">
                        {booking.familyMembers.filter(m => !m.isPrimary).map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{m.name}</span>
                            <span className="font-mono">{m.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ghi chú */}
                    {(() => {
                      const noteText = booking.notes?.at(-1)?.text ?? booking.msg
                      const hasValidNote = Boolean(
                        noteText &&
                          noteText.trim() &&
                          noteText.trim() !== '-' &&
                          noteText.trim() !== '""'
                      )
                      if (!hasValidNote) return null
                      return (
                        <div className="rounded bg-muted/30 px-2 py-1 text-xs">
                          <p className="italic text-muted-foreground line-clamp-2">
                            &ldquo;{noteText}&rdquo;
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                </DetailCard>

                {/* 2. THỜI HẠN & PHỤ TRÁCH (Thời gian tạo, Nguồn tạo) */}
                <DetailCard
                  title="Thời hạn & Phụ trách"
                  titleClassName="font-normal text-muted-foreground"
                  actions={
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-xs font-normal gap-1 text-primary hover:text-primary/80 hover:bg-primary/10 shrink-0 cursor-pointer"
                          title="Xem lịch sử thao tác & ghi chú"
                        >
                          <History className="h-3.5 w-3.5 text-primary" />
                          <span>Lịch sử ({historyItems.length})</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-80 p-3 shadow-lg bg-popover">
                        <div className="flex items-center gap-1.5 border-b pb-2 mb-2">
                          <History className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            Lịch sử thao tác & ghi chú
                          </span>
                        </div>
                        {historyItems.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic py-1">
                            Chưa có lịch sử thao tác nào.
                          </p>
                        ) : (
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {historyItems.map((item, idx) => (
                              <div key={idx} className="relative pl-3 border-l-2 border-primary/40 text-xs">
                                <div className="flex items-center justify-between text-muted-foreground text-xs">
                                  <span className="font-semibold text-foreground">{item.author}</span>
                                  <span className="font-mono">{item.timestamp}</span>
                                </div>
                                <p className="font-normal text-foreground mt-0.5 leading-snug">{item.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  }
                >
                  <div className="space-y-2 text-xs">
                    {/* Dòng 1: Ngày tạo phiếu & Phân loại */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground block leading-tight">Ngày tạo phiếu</span>
                        <span className="font-normal text-muted-foreground text-xs">2026-08-05 09:30</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block leading-tight">Phân loại</span>
                        <span className="font-normal text-muted-foreground text-xs">
                          {booking.eventType === 'demo' ? 'Học trải nghiệm' : 'Test đầu vào'}
                        </span>
                      </div>
                    </div>

                    {/* Dòng 2: Người tạo phiếu */}
                    <div className="flex items-center justify-between gap-2 min-w-0 pt-0.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs shrink-0">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Người tạo:</span>
                      </div>
                      <PersonnelHoverCard person={creatorPersonnelItem} align="end">
                        <div className="flex items-center gap-1.5 min-w-0 cursor-pointer group">
                          <AppAvatar name={creatorName} size="xs" />
                          <span className="font-normal text-muted-foreground text-xs truncate group-hover:text-primary group-hover:underline transition-colors" title={creatorName}>
                            {creatorName}
                          </span>
                        </div>
                      </PersonnelHoverCard>
                    </div>
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex shrink-0 items-center justify-between px-4 py-1.5 border-t border-border/60 bg-background">
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
    </>
  )
}
