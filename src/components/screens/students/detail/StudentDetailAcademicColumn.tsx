'use client'

import { useState } from 'react'
import {
  GraduationCap,
  Clock,
  User,
  MapPin,
  Users,
  AlertCircle,
  ArrowRightLeft,
  CalendarOff,
  Snowflake,
  LogOut,
  Plus,
  History,
  ChevronDown,
  Calendar,
  Building2,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'
import type { EnrolledClass } from '@/mocks/students'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import { SessionDetailDialog } from '@/components/screens/calendar/SessionDetailDialog'
import type { ClassSession } from '@/mocks/calendarSchedule'

export interface StudentDetailAcademicColumnProps {
  program: StudentProgram
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  activeDeductingPackage?: StudentPackage | null
  nextQueuedPackage?: StudentPackage | null
  onOpenAssignClass: (packageId?: string) => void
  onLeaveClass?: () => void
  onReserveClass?: () => void
  onDropClass?: (classCode: string) => void
}

export function StudentDetailAcademicColumn({
  program,
  studentName,
  studentCode,
  studentBranch,
  activeDeductingPackage,
  onOpenAssignClass,
  onLeaveClass,
  onReserveClass,
  onDropClass,
}: StudentDetailAcademicColumnProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true)
  const [selectedClassRecord, setSelectedClassRecord] = useState<ClassRecord | null>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveReserveRequest | null>(null)
  const [isLeaveReserveOpen, setIsLeaveReserveOpen] = useState(false)
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<ClassSession | null>(null)

  const buildClassSessionPayload = (classItem: {
    classCode?: string
    className?: string
    teacherName?: string
    assistantName?: string
    room?: string
    branch?: string
    startSessionDate?: string
  }, fallbackText: string): ClassSession => {
    const text = classItem.startSessionDate || fallbackText
    const dateMatch = text.match(/\((.*?)\)/)
    const sessionNumMatch = text.match(/Buổi\s*(\d+)/i)
    const sessionNum = sessionNumMatch ? parseInt(sessionNumMatch[1], 10) : 1
    const dateDisplay = dateMatch ? dateMatch[1] : '14/08/2024'

    return {
      id: `sess-${classItem.classCode || 'cls'}-${sessionNum}`,
      classCode: classItem.classCode || 'LD_TOAN_00032',
      className: classItem.className || program.name || 'Toán Tư Duy 1:6',
      title: `Buổi ${sessionNum < 10 ? '0' + sessionNum : sessionNum}: Khởi động & Nền tảng tư duy`,
      lessonSubtitle: 'Khái niệm tập hợp và các quy luật logic trực quan',
      subject: (classItem.className || program.name || '').toLowerCase().includes('tiếng anh') ? 'Tiếng Anh' : 'Toán Tư Duy',
      teacher: classItem.teacherName || 'GV_HuiLT20',
      assistantTeacher: classItem.assistantName || 'Nguyễn Thu Trang',
      branch: classItem.branch || studentBranch || 'RinoEdu Nguyễn Tuân',
      schoolRoom: classItem.room || 'B202',
      level: 'Khối 5 Archimedes',
      date: dateDisplay,
      dateDisplay: dateDisplay,
      dateBucket: 'past',
      timeLabel: '17:30',
      endTimeLabel: '19:00',
      statusLabel: 'Đã diễn ra',
      type: 'class_session',
      typeLabel: 'Chính thức',
      lessonNumber: sessionNum,
      totalStudents: 6,
      officialStudents: 5,
      trialStudents: 1,
      attendedStudents: 6,
      status: 'completed',
    }
  }

  const currentClass: EnrolledClass | null = program.currentClass
  const isEnrolled = Boolean(currentClass && program.programStatus === 'active')
  const isReserved = program.programStatus === 'reserved'
  const isDropped = program.programStatus === 'dropped'

  const currentClassRecord: ClassRecord | null = currentClass
    ? mockClassRecords.find((c) => c.code.toLowerCase() === currentClass.classCode.toLowerCase()) || null
    : null

  const handleOpenClassDetail = (classCode: string) => {
    const found =
      mockClassRecords.find((c) => c.code.toLowerCase() === classCode.toLowerCase()) ||
      (currentClass?.classCode.toLowerCase() === classCode.toLowerCase() && currentClassRecord
        ? currentClassRecord
        : null)

    if (found) {
      setSelectedClassRecord(found)
      setIsClassDetailOpen(true)
      return
    }

    const pastMatch = program.pastClasses.find((c) => c.classCode.toLowerCase() === classCode.toLowerCase())
    if (pastMatch) {
      const scheduleSlots = pastMatch.scheduleSlots?.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        date: s.date || '15/01',
        startTime: s.startTime,
        endTime: s.endTime,
        room: pastMatch.room || 'B201',
        teacherName: pastMatch.teacherName || 'GV_HuiLT20',
      })) || []
      const scheduleStr = scheduleSlots.map((s) => `${s.dayOfWeek}: ${s.startTime}-${s.endTime}`).join(', ') || 'Thứ 2, Thứ 5: 17:30 - 19:00'

      setSelectedClassRecord({
        id: pastMatch.classCode,
        code: pastMatch.classCode,
        name: pastMatch.className,
        level: pastMatch.level || 'Toán 1:6',
        subLevel: pastMatch.subLevel,
        branch: pastMatch.branch || studentBranch,
        status: 'huy',
        teacher: pastMatch.teacherName || 'GV_HuiLT20',
        teacherPhone: '0988776655',
        room: pastMatch.room || 'B201',
        schedule: scheduleStr,
        scheduleSlots,
        startDate: pastMatch.startDate || '2024-01-15',
        endDate: pastMatch.endDate || '2024-04-15',
        maxStudents: 6,
        enrolledStudents: 6,
        classRatio: '1:6',
        tuitionFee: 3600000,
      })
      setIsClassDetailOpen(true)
    }
  }

  const handleOpenLeaveRequest = () => {
    const req =
      mockLeaveReserveRequests.find(
        (r) =>
          r.studentCode === studentCode ||
          r.studentName.toLowerCase() === studentName.toLowerCase()
      ) || mockLeaveReserveRequests[0]
    setSelectedLeaveRequest(req)
    setIsLeaveReserveOpen(true)
  }

  const formatScheduleText = (cls: EnrolledClass) => {
    if (!cls.scheduleSlots || cls.scheduleSlots.length === 0) {
      return 'Thứ 2 & Thứ 4 (18:00 - 19:30)'
    }
    return cls.scheduleSlots
      .map((s) => `${s.dayOfWeek || ('date' in s ? (s as { date?: string }).date : '')} ${s.startTime}-${s.endTime}`)
      .join(' • ')
  }

  return (
    <div className="flex flex-col space-y-3.5 min-h-0">
      {/* ── 1. TIÊU ĐỀ KHỐI XẾP LỚP & TRẠNG THÁI THEO HỌC MÔN NÀY ── */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-primary/10 text-primary">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Chi tiết xếp lớp & Điều phối
          </span>
        </div>
        <StatusBadge
          status={
            isReserved
              ? 'reserved'
              : isDropped
              ? 'wait_for_assignment'
              : isEnrolled
              ? 'active'
              : 'wait_for_assignment'
          }
          label={
            isReserved
              ? 'Đang bảo lưu'
              : isDropped
              ? 'Chờ chuyển lớp'
              : isEnrolled
              ? 'Đang học'
              : 'Chờ ghép lớp'
          }
          className="text-[10px] py-0 px-2 font-semibold"
        />
      </div>

      {/* ── 2. THẺ LỚP ĐANG HỌC HIỆN TẠI (KHI HỌC VIÊN ĐANG THEO HỌC) ── */}
      {isEnrolled && currentClass ? (
        <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-3.5 shadow-2xs hover:border-primary/40 transition-colors text-left">
          {/* Header thẻ lớp */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/40 pb-2.5">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  📌 Lớp đang học
                </span>
                <span className="text-sm sm:text-base font-extrabold text-foreground">
                  {currentClass.className}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenClassDetail(currentClass.classCode)}
                  className="font-mono text-xs text-muted-foreground bg-muted/60 hover:bg-muted/90 px-1.5 py-0.5 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                  title="Nhấn để xem chi tiết hồ sơ lớp học"
                >
                  <span>{currentClass.classCode}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </button>
              </div>
              <div className="text-[11.5px] text-muted-foreground flex items-center gap-2 pt-0.5 flex-wrap">
                <span>
                  Trình độ: <strong className="text-foreground font-semibold">{currentClass.level || program.level || 'Tiêu chuẩn'}</strong>
                  {currentClass.subLevel && <span> ({currentClass.subLevel})</span>}
                </span>
                <span className="text-border">•</span>
                <span>
                  Mô hình: <strong className="text-foreground">{currentClassRecord?.classRatio || '1:6'}</strong>
                </span>
                <span className="text-border">•</span>
                <span>
                  Cơ sở: <strong className="text-foreground">{currentClass.branch || studentBranch}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0 bg-muted/40 px-2 py-1 rounded-md">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                Sĩ số: <strong className="text-foreground font-bold">{currentClassRecord?.enrolledStudents || 15}/{currentClassRecord?.maxStudents || 20}</strong>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1">(+{currentClassRecord?.trialStudents || 2} mới)</span>
              </span>
            </div>
          </div>

          {/* Thông tin lớp học: Thiết kế phẳng, liền mạch, thống nhất thành 1 khối, KHÔNG tách hộp/dòng rời rạc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 py-1 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-foreground font-medium">{formatScheduleText(currentClass)}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
              <User className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                GV: <strong className="text-foreground font-medium">{currentClass.teacherName || 'GV_HuiLT20'}</strong>
              </span>
              <span className="text-border/60">•</span>
              <span>
                TG: <strong className="text-foreground font-medium">{currentClass.assistantName || 'Nguyễn Thu Trang'}</strong>
              </span>
              <span className="text-border/60">•</span>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{currentClass.room || 'Phòng B202'}</span>
            </div>

            {(() => {
              const activeSessionData = buildClassSessionPayload(
                currentClass,
                'Buổi 01 (14/08/2024)'
              )
              const sessionLabel = currentClass.startSessionDate || 'Buổi 01 (14/08/2024)'
              return (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>Ghép từ:</span>
                  <ClassSessionHoverCard session={activeSessionData} side="top">
                    <button
                      type="button"
                      onClick={() => setSelectedSessionForModal(activeSessionData)}
                      className="font-medium text-foreground hover:text-primary underline decoration-dotted decoration-foreground/40 hover:decoration-primary cursor-pointer transition-colors"
                      title="Hover để xem tóm tắt, nhấp để mở chi tiết buổi học"
                    >
                      {sessionLabel}
                    </button>
                  </ClassSessionHoverCard>
                </div>
              )
            })()}

            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                Tiến độ tại lớp: <strong className="text-primary font-bold">{currentClass.progress || '84 / 96 buổi'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground sm:col-span-2 pt-2 border-t border-border/30 text-[11.5px] flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Cơ sở: <strong className="text-foreground font-medium">{currentClass.branch || studentBranch}</strong></span>
              </span>
              <span className="text-border/60">•</span>
              <span>CSM: <strong className="text-foreground font-medium">{program.csmName || 'Minh Phương (CSM Toán)'}</strong></span>
            </div>
          </div>

          {/* Dòng nút thao tác lớp học (Hành động điều phối lớp) */}
          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-border/30 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenAssignClass(activeDeductingPackage?.id)}
              className="h-7 px-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 hover:bg-indigo-100 dark:bg-indigo-950/30 cursor-pointer shadow-3xs"
              title="Chuyển học viên sang lớp học khác"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
              <span>Đổi lớp ghép</span>
            </Button>

            {onLeaveClass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onLeaveClass}
                className="h-7 px-2.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50/40 hover:bg-amber-100 dark:bg-amber-950/30 cursor-pointer shadow-3xs"
                title="Tạo đơn xin nghỉ phép buổi học"
              >
                <CalendarOff className="h-3.5 w-3.5 mr-1" />
                <span>Nghỉ phép</span>
              </Button>
            )}

            {onReserveClass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReserveClass}
                className="h-7 px-2.5 text-xs font-semibold text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 bg-sky-50/40 hover:bg-sky-100 dark:bg-sky-950/30 cursor-pointer shadow-3xs"
                title="Bảo lưu học phí / giữ lớp"
              >
                <Snowflake className="h-3.5 w-3.5 mr-1" />
                <span>Bảo lưu</span>
              </Button>
            )}

            {onDropClass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDropClass(currentClass.classCode)}
                className="h-7 px-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 bg-rose-50/40 hover:bg-rose-100 dark:bg-rose-950/30 cursor-pointer shadow-3xs"
                title="Rút học viên khỏi lớp này về trạng thái chờ ghép lớp"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                <span>Rút lớp</span>
              </Button>
            )}
          </div>
        </div>
      ) : isDropped ? (
        /* ── CASE TIẾN TRÌNH CHUYỂN LỚP ĐANG DIỄN RA ── */
        <div className="rounded-xl border border-sky-300/80 bg-sky-50/60 dark:bg-sky-950/20 dark:border-sky-900/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
              <ArrowRightLeft className="h-5 w-5" />
            </span>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                  Tiến trình chuyển lớp đang diễn ra
                </span>
                <StatusBadge status="pending_transfer" label="Chờ chuyển lớp" className="text-[9.5px] py-0 px-1.5" />
              </div>
              <div className="text-xs text-sky-800/90 dark:text-sky-400/90">
                Lớp cũ: <strong>{program.transferInfo?.sourceClass || program.droppedClassInfo?.classCode || 'Lớp cũ'}</strong> (Còn <strong>{program.remainingSessions} buổi</strong> kết chuyển).
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenAssignClass()}
            className="h-8 px-3.5 text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Ghép lớp ngay</span>
          </Button>
        </div>
      ) : isReserved ? (
        /* ── CASE ĐANG BẢO LƯU ── */
        <div className="rounded-xl border border-amber-300/80 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900/50 p-4 space-y-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Snowflake className="h-4 w-4" />
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Khóa học đang bảo lưu
                  </span>
                  <StatusBadge
                    status="reserve"
                    label={program.reservedInfo?.isHoldingClass ? 'Bảo lưu giữ lớp' : 'Bảo lưu'}
                    className="text-[9.5px] py-0 px-1.5"
                  />
                </div>
                <div className="text-xs text-amber-800/90 dark:text-amber-400/90">
                  Thời gian: {program.reservedInfo?.startDate || '15/06/2026'} ➔ {program.reservedInfo?.endDate || '15/09/2026'} ({program.reservedInfo?.duration || '3 tháng'}) • Số buổi bảo lưu: <strong>{program.reservedInfo?.reservedSessions || program.remainingSessions} buổi</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenLeaveRequest}
                className="h-7 px-2.5 text-xs border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
              >
                <FileText className="h-3 w-3 mr-1" />
                <span>Xem đơn</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => onOpenAssignClass()}
                className="h-7 px-2.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs cursor-pointer"
              >
                <ArrowRightLeft className="h-3 w-3 mr-1" />
                <span>Quay lại học / Ghép lớp</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ── CASE CHƯA GHÉP LỚP (MATCH SCREENSHOT media_1790129034184.png) ── */
        <div className="rounded-xl border border-amber-300/80 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Học viên chưa được phân bổ vào lớp học nào
              </div>
              <div className="text-xs text-amber-800/90 dark:text-amber-400/90">
                Học viên hiện còn <strong>{program.remainingSessions} buổi học</strong> khả dụng trong chương trình {program.name}.
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenAssignClass()}
            className="h-8 px-3.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Ghép lớp ngay</span>
          </Button>
        </div>
      )}

      {/* ── 3. DÒNG THỜI GIAN LỊCH SỬ CÁC LỚP TRƯỚC ĐÓ (CLASS PLACEMENT HISTORY) ── */}
      <div className="space-y-2.5 pt-1 text-left">
        {/* Nhãn phân khu Lịch sử tách riêng biệt bên ngoài */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">
              Lịch sử các lớp trước đó ({program.pastClasses.length})
            </span>
          </div>
          {program.pastClasses.length > 0 && (
            <button
              type="button"
              onClick={() => setIsHistoryExpanded((prev) => !prev)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors select-none"
            >
              <span>{isHistoryExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isHistoryExpanded && "rotate-180")} />
            </button>
          )}
        </div>

        {/* Danh sách các cụm lớp riêng biệt */}
        {isHistoryExpanded && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {program.pastClasses.length > 0 ? (
              program.pastClasses.map((cls, idx) => (
                <div
                  key={cls.classCode || idx}
                  className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 text-xs shadow-2xs hover:border-primary/40 transition-colors text-left"
                >
                  {/* Hàng 1: Tên lớp, Mã lớp & Số buổi đã học */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border/30 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenClassDetail(cls.classCode)}
                        className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                        title="Xem chi tiết lớp học"
                      >
                        {cls.className}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenClassDetail(cls.classCode)}
                        className="font-mono text-muted-foreground text-[11px] hover:underline cursor-pointer"
                      >
                        ({cls.classCode})
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-muted-foreground text-[11.5px]">
                        Đã học: <strong className="text-foreground">{cls.usedSessions || 24}/{cls.totalSessions || 24} buổi</strong>
                      </span>
                    </div>
                  </div>

                  {/* Hàng 2: Ca học & Giáo viên / Trợ giảng / Phòng học */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-muted-foreground text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>
                        {cls.scheduleSlots?.map((s) => `${s.dayOfWeek} ${s.startTime}-${s.endTime}`).join(' • ') || 'Thứ 2 17:30-19:00 • Thứ 5 17:30-19:00'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>GV: {cls.teacherName || 'GV_HuiLT20'}</span>
                      <span className="text-border/60">•</span>
                      <span>TG: {cls.assistantName || 'Lê Mai Anh'}</span>
                      <span className="text-border/60">•</span>
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{cls.room || 'B201'}</span>
                    </div>
                  </div>

                  {/* Hàng 3: Buổi ghép vào lớp (Hover xem tóm tắt, Click mở modal buổi học) */}
                  {(() => {
                    const pastSessionData = buildClassSessionPayload(
                      cls,
                      cls.startSessionDate || 'Buổi 01 (15/01/2024)'
                    )
                    const sessionLabel = cls.startSessionDate || 'Buổi 01 (15/01/2024)'
                    return (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
                        <Calendar className="h-3 w-3 opacity-70 shrink-0" />
                        <span>Ghép từ:</span>
                        <ClassSessionHoverCard session={pastSessionData} side="top">
                          <button
                            type="button"
                            onClick={() => setSelectedSessionForModal(pastSessionData)}
                            className="font-medium text-foreground hover:text-primary underline decoration-dotted decoration-foreground/40 hover:decoration-primary cursor-pointer transition-colors"
                            title="Hover để xem tóm tắt, nhấp để mở chi tiết buổi học"
                          >
                            {sessionLabel}
                          </button>
                        </ClassSessionHoverCard>
                      </div>
                    )
                  })()}

                  {/* Hàng 4: Nhận xét học tập (Lấy từ chi tiết học viên / Màn chăm sóc) */}
                  {(cls.teacherFinalFeedback || cls.finalOutcome) && (
                    <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground space-y-1 border border-border/30">
                      <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Nhận xét:</span>
                        {cls.finalOutcome && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            ({cls.finalOutcome})
                          </span>
                        )}
                      </div>
                      <p className="italic pl-5 text-muted-foreground">
                        &ldquo;{cls.teacherFinalFeedback || 'Học viên có tư duy logic sắc bén, chủ động tương tác và hoàn thành tốt tất cả các bài toán dự án.'}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-4 text-center text-xs text-muted-foreground italic">
                Chưa có lịch sử lớp học trước đó trong lộ trình này.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog: Chi tiết lớp học */}
      <ClassesDetailDialog
        cls={selectedClassRecord}
        open={isClassDetailOpen}
        onOpenChange={setIsClassDetailOpen}
        initialTab="overview"
      />

      {/* Dialog: Xem đơn bảo lưu */}
      {selectedLeaveRequest && (
        <LeaveReserveDetailDialog
          open={isLeaveReserveOpen}
          onOpenChange={setIsLeaveReserveOpen}
          request={selectedLeaveRequest}
          readOnly={true}
        />
      )}

      {/* Dialog: Chi tiết buổi học (Tái sử dụng modal buổi học đã có) */}
      <SessionDetailDialog
        open={Boolean(selectedSessionForModal)}
        onOpenChange={(open) => !open && setSelectedSessionForModal(null)}
        session={selectedSessionForModal}
      />
    </div>
  )
}
