'use client'

import { useMemo, useState } from 'react'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  StatusBadge,
} from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'
import type { Employee } from '@/mocks/employees'
import {
  applyBookingCheckIn,
  formatStudentAgeDob,
  getParentDisplayName,
  getStatusLabel,
} from './bookingTestHelpers'
import { BookingTestEmployeePickerDialog } from './BookingTestEmployeePickerDialog'
import { StudentDetailLevelDialog } from '../students/detail/StudentDetailLevelDialog'
import {
  findEmployeeByName,
  getActiveEmployeesBySchool,
  getDutyRosterEmployees,
  getPersonTitle,
  resolveBookingBranch,
} from './bookingTestStaffHelpers'
import { toast } from 'sonner'
import {
  SessionSubjectFilterBar,
} from '../admissions/SessionSubjectFilterBar'
import {
  StudentUnifiedProfilePanel,
} from '../admissions/StudentUnifiedProfilePanel'
import {
  UnifiedAttemptResultCard,
} from '../admissions/UnifiedAttemptResultCard'
import {
  resolveStudentUnifiedSessions,
} from '../admissions/unifiedSessionHelpers'
import type { UnifiedSubject } from '../admissions/unifiedSessionTypes'

interface BookingTestDetailDialogProps {
  booking: BookingTest | null
  bookings?: BookingTest[]
  detailNote?: string
  copiedKey?: string
  onOpenChange: (open: boolean) => void
  onUpdateBooking: (bookingId: string, updater: (booking: BookingTest) => BookingTest) => void
  onOpenAssessment: (bookingId: string) => void
  onCall?: (phone?: string) => void
  onCopy?: (text: string, key: string) => Promise<void>
  onDetailNoteChange?: (value: string) => void
  onAddNote?: () => void
  onViewStudentDetail?: (studentId: string) => void
  onSelectBooking?: (booking: BookingTest) => void
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

  const defaultSubj: UnifiedSubject = initialBooking?.subject === 'math' ? 'math' : 'english'
  const [activeSubject, setActiveSubject] = useState<UnifiedSubject>(defaultSubj)

  if (initialBooking?.id !== prevPropId) {
    setPrevPropId(initialBooking?.id)
    setOverrideBooking(null)
    setActiveSubject(initialBooking?.subject === 'math' ? 'math' : 'english')
  }

  const booking = overrideBooking ?? initialBooking

  const handleSwitchBooking = (selected: BookingTest) => {
    setOverrideBooking(selected)
    onSelectBooking?.(selected)
  }

  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const [levelModalOpen, setLevelModalOpen] = useState(false)

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

  const teacherName = booking?.teacher || booking?.tester || ''

  // Lịch sử thao tác & ghi chú của ca booking
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

  // Trích xuất Dòng sự kiện đa chiều (Test + Học thử) của học viên này
  const { allSessions, placementLevels } = useMemo(() => {
    if (!booking) return { allSessions: [], placementLevels: {} }
    return resolveStudentUnifiedSessions({
      studentName: booking.childName,
      phone: booking.phone,
      currentBookingId: booking.id,
      allBookings: bookings,
    })
  }, [booking, bookings])

  // Đếm số lượng ca theo từng môn
  const subjectCounts = useMemo(() => {
    return {
      english: allSessions.filter((s) => s.subject === 'english').length,
      math: allSessions.filter((s) => s.subject === 'math').length,
    }
  }, [allSessions])

  // Lọc các ca thuộc MÔN ĐANG CHỌN (riêng rẽ, không gộp tất cả các môn)
  const currentSubjectSessions = useMemo(() => {
    return allSessions.filter((s) => s.subject === activeSubject)
  }, [allSessions, activeSubject])

  if (!booking) return null

  return (
    <>
      <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col max-h-[88vh] w-full gap-0 overflow-hidden p-0 sm:max-w-5xl border border-border shadow-2xl bg-background">
          {/* Header gọn gàng - Không đường kẻ dưới, không mã booking, không trạng thái thừa */}
          <DialogHeader className="shrink-0 px-4 pt-3 pb-0.5 bg-background">
            <div className="flex items-center justify-between gap-4 pr-6">
              <DialogTitle className="text-xs font-medium text-foreground">
                Chi tiết Phiếu kiểm tra đầu vào
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Body: 2 Cột - Cột trái tăng bề rộng, Cột phải giữ nguyên */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 bg-background">
            <div className="flex flex-col md:flex-row gap-3.5 items-start">
              {/* ==================== CỘT TRÁI: TĂNG BỀ RỘNG ==================== */}
              <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
                {/* 1. BỘ LỌC MÔN RIÊNG RẼ DẠNG NÚT BẤM NỔI BẬT */}
                <SessionSubjectFilterBar
                  activeSubject={activeSubject}
                  onSubjectChange={setActiveSubject}
                  counts={subjectCounts}
                />

                {/* 2. DANH SÁCH CÁC LẦN CỦA MÔN NÀY (CA HIỆN TẠI + PHÂN VÙNG LỊCH SỬ) */}
                <div className="space-y-3">
                  {currentSubjectSessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                      <p className="font-medium text-foreground text-xs sm:text-sm">
                        Chưa có lịch {activeSubject === 'math' ? 'Toán tư duy' : 'Tiếng Anh'}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Học viên chưa phát sinh buổi kiểm tra đầu vào hoặc lớp học thử nào cho môn này.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* CA HIỆN TẠI / GẦN NHẤT */}
                      {currentSubjectSessions[0] && (
                        <UnifiedAttemptResultCard
                          key={currentSubjectSessions[0].id}
                          session={currentSubjectSessions[0]}
                          attemptNumber={currentSubjectSessions.length}
                          isFocused={currentSubjectSessions[0].id === booking.id}
                          canEditPlacement={currentSubjectSessions[0].id === booking.id}
                          collapsible={false}
                          onOpenAssessment={() => onOpenAssessment(currentSubjectSessions[0].id)}
                          onOpenTeacherPicker={() => setTeacherPickerOpen(true)}
                          onCancelBooking={(bookingId) => {
                            onUpdateBooking(bookingId, (current) => ({ ...current, status: 'cancelled' }))
                            setOverrideBooking((curr) => curr?.id === bookingId ? { ...curr, status: 'cancelled' } : curr)
                            toast.success(`Đã hủy ca kiểm tra #${bookingId}`)
                          }}
                          onCheckInBooking={(bookingId) => {
                            onUpdateBooking(bookingId, (current) => applyBookingCheckIn(current))
                            setOverrideBooking((curr) => curr?.id === bookingId ? applyBookingCheckIn(curr) : curr)
                            toast.success(`Đã check-in học viên cho ca #${bookingId}`)
                          }}
                          onCompleteBooking={(bookingId) => {
                            onUpdateBooking(bookingId, (current) => ({ ...current, status: 'completed' }))
                            setOverrideBooking((curr) => curr?.id === bookingId ? { ...curr, status: 'completed' } : curr)
                            toast.success(`Đã hoàn tất ca kiểm tra #${bookingId}`)
                          }}
                          onUpdateBookingLevel={(level, subLevel) => {
                            onUpdateBooking(currentSubjectSessions[0].id, (current) => ({
                              ...current,
                              testResult: {
                                ...current.testResult,
                                level,
                                subLevel: subLevel ?? current.testResult?.subLevel,
                              },
                            }))
                            toast.success(`Đã cập nhật trình độ môn ${activeSubject === 'math' ? 'Toán' : 'Tiếng Anh'}: ${level}`)
                          }}
                          onSelectAsFocus={() => {
                            if (currentSubjectSessions[0].type === 'test' && currentSubjectSessions[0].sourceBooking) {
                              handleSwitchBooking(currentSubjectSessions[0].sourceBooking)
                            }
                          }}
                        />
                      )}

                      {/* NHÃN LỊCH SỬ Ở GIỮA PANEL TRÁI */}
                      {currentSubjectSessions.length > 1 && (
                        <div className="relative flex items-center justify-center my-2 select-none">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/70" />
                          </div>
                          <div className="relative flex items-center gap-1.5 bg-background px-3 text-xs font-normal text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Lịch sử</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded-full font-mono text-muted-foreground">
                              {currentSubjectSessions.length - 1}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* CÁC LẦN KIỂM TRA TRƯỚC ĐÓ (CHO HẾT VÀO LỊCH SỬ) */}
                      {currentSubjectSessions.slice(1).map((item, index) => {
                        const isCurrentSession = item.id === booking.id
                        const attemptNumber = currentSubjectSessions.length - 1 - index

                        return (
                          <UnifiedAttemptResultCard
                            key={item.id}
                            session={item}
                            attemptNumber={attemptNumber}
                            isFocused={isCurrentSession}
                            canEditPlacement={isCurrentSession}
                            collapsible={true}
                            defaultCollapsed={true}
                            onOpenAssessment={() => onOpenAssessment(item.id)}
                            onOpenTeacherPicker={() => setTeacherPickerOpen(true)}
                            onCancelBooking={(bookingId) => {
                              onUpdateBooking(bookingId, (current) => ({ ...current, status: 'cancelled' }))
                              setOverrideBooking((curr) => curr?.id === bookingId ? { ...curr, status: 'cancelled' } : curr)
                              toast.success(`Đã hủy ca kiểm tra #${bookingId}`)
                            }}
                            onCheckInBooking={(bookingId) => {
                              onUpdateBooking(bookingId, (current) => applyBookingCheckIn(current))
                              setOverrideBooking((curr) => curr?.id === bookingId ? applyBookingCheckIn(curr) : curr)
                              toast.success(`Đã check-in học viên cho ca #${bookingId}`)
                            }}
                            onCompleteBooking={(bookingId) => {
                              onUpdateBooking(bookingId, (current) => ({ ...current, status: 'completed' }))
                              setOverrideBooking((curr) => curr?.id === bookingId ? { ...curr, status: 'completed' } : curr)
                              toast.success(`Đã hoàn tất ca kiểm tra #${bookingId}`)
                            }}
                            onUpdateBookingLevel={(level, subLevel) => {
                              onUpdateBooking(item.id, (current) => ({
                                ...current,
                                testResult: {
                                  ...current.testResult,
                                  level,
                                  subLevel: subLevel ?? current.testResult?.subLevel,
                                },
                              }))
                              toast.success(`Đã cập nhật trình độ môn ${activeSubject === 'math' ? 'Toán' : 'Tiếng Anh'}: ${level}`)
                            }}
                            onSelectAsFocus={() => {
                              if (item.type === 'test' && item.sourceBooking) {
                                handleSwitchBooking(item.sourceBooking)
                              }
                            }}
                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* ==================== CỘT PHẢI: GIỮ NGUYÊN BỀ RỘNG (~330px) ==================== */}
              <div className="w-full md:w-[330px] shrink-0 flex flex-col gap-3 min-w-0">
                <StudentUnifiedProfilePanel
                  studentName={booking.childName}
                  studentAgeDob={booking.dob ? formatStudentAgeDob(booking.dob) : '11 tuổi, 18/04/2015'}
                  studentSchool={studentSchool}
                  studentAbility={studentAbility}
                  placementLevels={placementLevels}
                  activeSubject={activeSubject}
                  parentName={parentDisplayName}
                  parentPhone={booking.phone}
                  parentAddress={parentAddress}
                  notes={booking.notes?.at(-1)?.text ?? booking.msg}
                  createdDate="2026-08-05 09:30"
                  creatorName={creatorName}
                  creatorRole={creatorEmployee ? getPersonTitle(creatorEmployee) : 'Tư vấn viên · Tuyển sinh'}
                  creatorPhone={creatorEmployee?.phone}
                  creatorEmail={creatorEmployee?.email}
                  creatorAvatar={creatorEmployee?.avatar}
                  auditLogs={historyItems.map((h) => ({
                    timestamp: h.timestamp || '2026-08-05 09:30',
                    author: h.author || creatorName,
                    action: h.text,
                  }))}
                  onEditLevel={() => setLevelModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Tái sử dụng: Cập nhật thông tin trình độ học viên (Lấy theo trình độ mới nhất) */}
      {booking && (
        <StudentDetailLevelDialog
          open={levelModalOpen}
          onOpenChange={setLevelModalOpen}
          initialLevel={
            (activeSubject === 'math' ? placementLevels.math?.level : placementLevels.english?.level) ||
            booking.testResult?.level ||
            booking.expectedLevel ||
            ''
          }
          initialSubLevel={
            (activeSubject === 'math' ? placementLevels.math?.subLevel : placementLevels.english?.subLevel) ||
            booking.testResult?.subLevel ||
            ''
          }
          initialSchoolClass={studentSchool}
          isEnglish={activeSubject === 'english'}
          onSave={(newLevel, newSubLevel) => {
            // Cập nhật ca test mới nhất của môn này (lấy theo trình độ mới nhất)
            const latestTestSession = currentSubjectSessions.find((s) => s.type === 'test' && s.sourceBooking)
            const targetBookingId = latestTestSession?.id || booking.id

            onUpdateBooking(targetBookingId, (current) => ({
              ...current,
              testResult: {
                ...current.testResult,
                level: newLevel,
                subLevel: newSubLevel,
              },
              expectedLevel: newLevel,
            }))

            if (overrideBooking && (overrideBooking.id === targetBookingId || targetBookingId === booking.id)) {
              setOverrideBooking((curr) =>
                curr
                  ? {
                      ...curr,
                      testResult: {
                        ...curr.testResult,
                        level: newLevel,
                        subLevel: newSubLevel,
                      },
                      expectedLevel: newLevel,
                    }
                  : curr
              )
            }

            toast.success(
              `Đã cập nhật trình độ môn ${activeSubject === 'math' ? 'Toán tư duy' : 'Tiếng Anh'}: ${newLevel}${
                newSubLevel ? ` - ${newSubLevel}` : ''
              }`
            )
          }}
        />
      )}

      {/* Dialog Gán / Đổi giáo viên khảo thí */}
      {booking && (
        <BookingTestEmployeePickerDialog
          open={teacherPickerOpen}
          onOpenChange={setTeacherPickerOpen}
          branchName={branchName}
          selectedName={teacherName}
          bookingTime={booking.testTime}
          currentBookingId={booking.id}
          employees={branchEmployees}
          allRosterEmployees={allRosterEmployees}
          onSelect={(emp: Employee) => {
            onUpdateBooking(booking.id, (current) => ({
              ...current,
              teacher: emp.name,
              tester: emp.name,
              notes: [
                ...(current.notes || []),
                {
                  text: `Đổi người phụ trách test thành: ${emp.name}`,
                  author: 'Hệ thống',
                  timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
                },
              ],
            }))
            toast.success(`Đã phân công ${emp.name} phụ trách bài test #${booking.id}`)
          }}
        />
      )}
    </>
  )
}
