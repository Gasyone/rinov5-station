'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCog,
  DoorClosed,
  Calendar,
  CalendarX,
  UserPlus,
  HelpCircle,
  Sparkles,
  HeartHandshake,
  CheckSquare,
  MessageSquarePlus,
  Notebook,
  ClipboardCheck,
  Camera,
  SlidersHorizontal,
  Info,
  UserCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import {
  formatDateWithDay,
  getAvatarColor,
  stableHash,
  type AttendanceStatus,
} from './classesSessionDetailHelpers'
import { cleanTeacherName, cleanAssistantName, getStudentNameParts } from './classesDetailHelpers'
import { StudentProfileHoverCard, type StudentProfileItem } from '@/components/shared'
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import { QcCheckDetailDialog } from '@/components/screens/qc-check/QcCheckDetailDialog'
import { mockQcCheckEvents } from '@/mocks/qcChecks'

export interface ClassesSessionOverviewTabProps {
  session: RoadmapSession
  activeRoster: RosterStudent[]
  getAttendance?: (studentId: string) => AttendanceStatus
  onSwitchTab: (tab: 'roster' | 'media') => void
  setIsBulkFeedbackOpen?: (open: boolean) => void
}

export interface CareBadgeInfo {
  code: string
  label: string
  fullLabel: string
  colorClass: string
  issueText: string
  configRule: string
  occurredDate: string
  slaText: string
  isOverdue?: boolean
  assigneeText?: string
}

export function getStudentCareBadges(student: RosterStudent): CareBadgeInfo[] {
  const hash = stableHash(student.id || student.name)
  const badges: CareBadgeInfo[] = []

  if (hash % 2 === 0 || student.tags?.some((t) => t.tagType === 'vip' || t.tagType === 'attention')) {
    badges.push({
      code: 'CSĐB',
      label: 'CSĐB',
      fullLabel: 'Cảnh báo C90B, BTVN < 70%',
      colorClass: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800',
      issueText: 'Điểm TB 5.7 | Vắng 2/20 buổi',
      configRule: 'Chuyên cần < 85% hoặc Điểm kiểm tra < 5.5',
      occurredDate: '20/07/2026',
      slaText: '21/07/2026',
      isOverdue: true,
      assigneeText: 'CS Nguyễn Thị Ngọc Anh · GV GV_F010',
    })
  }

  if (hash % 3 === 0 || student.status === 'trial') {
    badges.push({
      code: 'CSBH',
      label: 'CSBH',
      fullLabel: 'Thiếu BTVN 2 buổi liên tiếp',
      colorClass: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800',
      issueText: 'Thiếu bài tập về nhà từ 2 buổi liên tiếp',
      configRule: 'Thiếu bài tập về nhà từ 2 buổi liên tiếp',
      occurredDate: '22/07/2026',
      slaText: '27/07/2026',
      isOverdue: false,
      assigneeText: 'CS Nguyễn Thị Ngọc Anh · GV GV_F010',
    })
  }

  if (hash % 4 === 0) {
    badges.push({
      code: 'ĐK',
      label: 'ĐK',
      fullLabel: 'Cận hạn học phí / nợ phí',
      colorClass: 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800',
      issueText: 'Hạn đóng phí: 25/07/2026',
      configRule: 'Cảnh báo hạn gia hạn và đóng học phí khóa mới',
      occurredDate: '18/07/2026',
      slaText: '25/07/2026',
      isOverdue: false,
      assigneeText: 'CS Nguyễn Thị Ngọc Anh',
    })
  }

  if (badges.length === 0) {
    badges.push({
      code: 'ĐK',
      label: 'ĐK',
      fullLabel: 'Tương tác định kỳ hàng tháng (tháng 7)',
      colorClass: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-800',
      issueText: 'Cập nhật nhận xét học tập định kỳ',
      configRule: 'Điểm chạm kiểm tra tiến độ học tập hàng tháng',
      occurredDate: '22/07/2026',
      slaText: '24/07/2026',
      isOverdue: false,
      assigneeText: 'CS Nguyễn Thị Ngọc Anh',
    })
  }

  return badges
}

export function ClassesSessionOverviewTab({
  session,
  activeRoster,
  getAttendance,
  onSwitchTab,
  setIsBulkFeedbackOpen,
}: ClassesSessionOverviewTabProps) {
  const absentStudentsList: RosterStudent[] = []
  const excusedStudentsList: RosterStudent[] = []
  const trialStudentsList: RosterStudent[] = []
  const newStudentsList: RosterStudent[] = []
  const careStudentsList: RosterStudent[] = []

  // Leave request detail dialog state
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [selectedLeaveStudent, setSelectedLeaveStudent] = useState<RosterStudent | null>(null)

  // Student profile detail dialog state
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  // QC check detail dialog state
  const [qcDialogOpen, setQcDialogOpen] = useState(false)
  const qcEvent = useMemo(() => mockQcCheckEvents[0] || null, [])

  // Find leave request in mocks, or fallback to a dynamically generated one
  const leaveRequest = useMemo(() => {
    if (!selectedLeaveStudent) return null
    const found = mockLeaveReserveRequests.find(
      (r) => r.studentId === selectedLeaveStudent.id || r.studentCode === selectedLeaveStudent.code
    )
    if (found) return found

    return {
      id: `LR-GEN-${selectedLeaveStudent.id}`,
      studentId: selectedLeaveStudent.id,
      studentName: selectedLeaveStudent.name,
      studentCode: selectedLeaveStudent.code,
      branch: 'RinoEdu Nguyễn Tuân',
      type: 'off' as const,
      startDate: session.date || '2026-06-25',
      endDate: session.date || '2026-06-25',
      reason: 'Nghỉ ốm có phép (Phụ huynh xin nghỉ qua ứng dụng)',
      status: 'approved' as const,
      requestedDate: session.date || '2026-06-25',
      approvedBy: 'Trần Văn A (Quản lý)',
      approvedDate: session.date || '2026-06-25',
      title: 'Đơn xin nghỉ phép học viên',
      phone: selectedLeaveStudent.parentPhone || '0912345678',
      email: `${selectedLeaveStudent.code.toLowerCase()}@rinoedu.vn`,
      className: 'Lớp học hiện tại',
      classCode: 'CLASS-01',
      productPackage: 'Gói Tiếng Anh chuẩn Cambridge',
      parentName: selectedLeaveStudent.parentName || 'Phụ huynh',
      additionalContacts: []
    }
  }, [selectedLeaveStudent, session.date])

  activeRoster.forEach((student) => {
    const status = getAttendance ? getAttendance(student.id) : 'present'
    if (status === 'absent') absentStudentsList.push(student)
    else if (status === 'excused') excusedStudentsList.push(student)

    if (student.status === 'trial') trialStudentsList.push(student)
    if (student.status === 'new') newStudentsList.push(student)

    const isCareStudent = student.status === 'trial' || student.status === 'new' || !!student.sessionLabel
    if (isCareStudent) {
      careStudentsList.push(student)
    }
  })

  // Ensure rich care list for demo UI
  if (careStudentsList.length < 3 && activeRoster.length >= 3) {
    activeRoster.slice(0, 4).forEach((st) => {
      if (!careStudentsList.some((c) => c.id === st.id)) {
        careStudentsList.push(st)
      }
    })
  }

  // Ensure demo excused list has at least 1 student for testing if empty
  if (excusedStudentsList.length === 0 && activeRoster.length >= 2) {
    excusedStudentsList.push(activeRoster[1])
  }

  // Ensure demo trial list has at least 1 student for testing if empty
  if (trialStudentsList.length === 0 && activeRoster.length >= 4) {
    trialStudentsList.push(activeRoster[2], activeRoster[3])
  }

  // Operational flags
  const isCompleted = session.status === 'completed'
  const isCancelled = session.status === 'cancelled'

  const hasTeacherCover = !!session.substituteTeacherName
  const hasTACover = !!session.substituteAssistantName
  const hasRoomChange = !!session.defaultRoom && session.room !== session.defaultRoom
  const hasScheduleChange = !!session.rescheduleDate || !!session.originalDate

  const isTestSession = (
    session.sessionNumber % 3 === 0 ||
    (session.topic || '').toLowerCase().includes('test') ||
    (session.topic || '').toLowerCase().includes('kiểm tra')
  )

  const hasJournal = !!(session.description || session.coverNote)
  const hasOperationalAdjustments = hasTeacherCover || hasTACover || hasRoomChange || hasScheduleChange || isCancelled || isTestSession

  return (
    <div className="h-full flex flex-col space-y-2.5 text-xs overflow-y-auto pr-1">
      {/* ── HÀNG TRÊN: CHIA ĐÔI 50/50 (Bên trái: Thông tin nhanh | Bên phải: Nhiệm vụ) ── */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 gap-2.5 items-stretch">
        {/* THẺ BÊN TRÁI (50%): Thông tin nhanh */}
        <div className="rounded-xl border border-border/80 bg-card p-2.5 space-y-2.5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            {/* Header Title Bar with Soft Grey Fill */}
            <div className="flex items-center justify-between bg-zinc-100/80 dark:bg-zinc-800/60 p-2 px-2.5 rounded-lg border-none">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Thông tin nhanh</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">Đầu buổi</span>
            </div>

            {/* 4 Nhóm thông tin nhanh (2x2 Grid: HV mới, Xin phép, Học thử, Vận hành) */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs px-1">
              {/* Category 1: HV Mới */}
              <div className="flex items-start gap-1 min-w-0">
                <span className="text-muted-foreground font-normal shrink-0">HV mới:</span>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
                  {newStudentsList.length > 0 ? (
                    newStudentsList.map((st) => {
                      const np = getStudentNameParts(st)
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSelectedStudentId(st.id)}
                          className="text-foreground hover:text-primary hover:underline font-normal cursor-pointer text-left truncate w-full block text-xs"
                          title={np.formattedName}
                        >
                          {np.formattedName}
                        </button>
                      )
                    })
                  ) : (
                    <span className="text-muted-foreground/70 italic font-normal">Không</span>
                  )}
                </div>
              </div>

              {/* Category 2: Xin phép -> Mở đơn xin phép học viên */}
              <div className="flex items-start gap-1 min-w-0">
                <span className="text-muted-foreground font-normal shrink-0">Xin phép:</span>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
                  {excusedStudentsList.length > 0 ? (
                    excusedStudentsList.map((st) => {
                      const np = getStudentNameParts(st)
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedLeaveStudent(st)
                            setLeaveDialogOpen(true)
                          }}
                          className="text-foreground hover:text-primary hover:underline font-normal cursor-pointer text-left truncate w-full block text-xs"
                          title={np.formattedName}
                        >
                          {np.formattedName}
                        </button>
                      )
                    })
                  ) : (
                    <span className="text-muted-foreground/70 italic font-normal">Không</span>
                  )}
                </div>
              </div>

              {/* Category 3: Học thử -> Mở Profile modal học viên */}
              <div className="flex items-start gap-1 min-w-0">
                <span className="text-muted-foreground font-normal shrink-0">Học thử:</span>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
                  {trialStudentsList.length > 0 ? (
                    trialStudentsList.map((st) => {
                      const np = getStudentNameParts(st)
                      const studentProfileItem: StudentProfileItem = {
                        id: st.id,
                        name: st.name,
                        code: st.code,
                        avatar: st.avatar,
                        status: 'Học thử',
                        parentName: st.parentName,
                        parentPhone: st.parentPhone,
                        isTrial: true,
                        trialNotice: 'Học viên vừa gia nhập lớp học thử (Buổi 1/2).'
                      }
                      return (
                        <StudentProfileHoverCard
                          key={st.id}
                          student={studentProfileItem}
                          onOpenDetail={(id) => setSelectedStudentId(id)}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedStudentId(st.id)}
                            className="text-foreground hover:text-primary hover:underline font-normal cursor-pointer text-left truncate w-full block text-xs"
                            title={np.formattedName}
                          >
                            {np.formattedName}
                          </button>
                        </StudentProfileHoverCard>
                      )
                    })
                  ) : (
                    <span className="text-muted-foreground/70 italic font-normal">Không</span>
                  )}
                </div>
              </div>

              {/* Category 4: Vận hành (Plain text, no badges/pills) */}
              <div className="flex items-start gap-1 min-w-0">
                <span className="text-muted-foreground font-normal shrink-0">Vận hành:</span>
                <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 min-w-0">
                  {hasRoomChange && (
                    <span className="text-foreground font-normal truncate">
                      Đổi {session.room} (gốc {session.defaultRoom})
                    </span>
                  )}
                  {hasTeacherCover && (
                    <span className="text-foreground font-normal truncate">
                      GV: {cleanTeacherName(session.substituteTeacherName!)}
                    </span>
                  )}
                  {hasTACover && (
                    <span className="text-foreground font-normal truncate">
                      TG: {cleanAssistantName(session.substituteAssistantName!)}
                    </span>
                  )}
                  {hasScheduleChange && (
                    <span className="text-foreground font-normal truncate">
                      Dời: {formatDateWithDay(session.rescheduleDate || session.date)}
                    </span>
                  )}
                  {isTestSession && (
                    <span className="text-foreground font-normal truncate">
                      Unit Test
                    </span>
                  )}
                  {isCancelled && (
                    <span className="text-rose-600 dark:text-rose-400 font-normal truncate">
                      Hủy: {session.cancelReason || 'Dời lịch'}
                    </span>
                  )}
                  {!hasOperationalAdjustments && (
                    <span className="text-muted-foreground/70 italic font-normal">Lịch chuẩn</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THẺ BÊN PHẢI (50%): Nhiệm vụ */}
        <div className="rounded-xl border border-border/80 bg-card p-2.5 space-y-2.5 shadow-2xs flex flex-col justify-start">
          {/* Header Title Bar with Soft Grey Fill */}
          <div className="flex items-center justify-between bg-zinc-100/80 dark:bg-zinc-800/60 p-2 px-2.5 rounded-lg border-none">
            <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Nhiệm vụ</span>
            </span>
            <Badge variant="outline" className="text-[9.5px] font-normal border-emerald-300 text-emerald-700 bg-emerald-50 py-0">
              Kiểm tra cuối buổi
            </Badge>
          </div>

          {/* Task Grid starting immediately under header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-0.5">
            {/* Task 1: Student Feedbacks */}
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <MessageSquarePlus className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-normal text-foreground text-[10.5px] truncate">Nhận xét học viên</p>
                  <p className="text-[9.5px] text-muted-foreground truncate font-normal">Thái độ & kết quả</p>
                </div>
              </div>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setIsBulkFeedbackOpen?.(true)}
                className="h-5 text-[9.5px] font-normal px-1.5 cursor-pointer border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 shrink-0 ml-1"
              >
                Nhận xét ngay
              </Button>
            </div>

            {/* Task 2: Session Journal */}
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <Notebook className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-normal text-foreground text-[10.5px] truncate">Nhật ký buổi học</p>
                  <p className="text-[9.5px] text-muted-foreground truncate font-normal">{hasJournal ? 'Đã nhập nhận xét' : 'Chưa ghi nhật ký'}</p>
                </div>
              </div>
              <Badge variant="outline" className={cn('text-[9px] font-normal py-0 shrink-0 ml-1', hasJournal ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-amber-300 text-amber-700 bg-amber-50')}>
                {hasJournal ? 'Đã xong' : 'Chưa xong'}
              </Badge>
            </div>

            {/* Task 3: Test Scores / Semester Eval */}
            {isTestSession && (
              <div className="flex items-center justify-between p-1.5 rounded-lg border border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ClipboardCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-normal text-foreground text-[10.5px] truncate">Chấm điểm & Eval</p>
                    <p className="text-[9.5px] text-muted-foreground truncate font-normal">Đánh giá Unit Test</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[9px] font-normal border-amber-300 text-amber-700 bg-amber-50 py-0 shrink-0 ml-1">
                  Cần chấm điểm
                </Badge>
              </div>
            )}

            {/* Task 4: Media Upload */}
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <Camera className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-normal text-foreground text-[10.5px] truncate">Hình ảnh & Media</p>
                  <p className="text-[9.5px] text-muted-foreground truncate font-normal">Tải ảnh lớp học</p>
                </div>
              </div>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => onSwitchTab('media')}
                className="h-5 text-[9.5px] font-normal text-primary hover:underline cursor-pointer px-1 shrink-0 ml-1"
              >
                Tải tệp <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>

            {/* Task 5: QC cần đóng/hoàn thành */}
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-normal text-foreground text-[10.5px] truncate">QC cần đóng/hoàn thành</p>
                  <p className="text-[9.5px] text-muted-foreground truncate font-normal">Xử lý đợt kiểm tra QC</p>
                </div>
              </div>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setQcDialogOpen(true)}
                className="h-5 text-[9.5px] font-normal px-1.5 cursor-pointer border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 shrink-0 ml-1"
              >
                Cần xử lý
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HÀNG DƯỚI: KHUNG CHĂM SÓC HỌC VIÊN (Care Code in Bold Colored Text, No Box/Border) ── */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 space-y-2.5 shadow-2xs shrink-0">
        {/* Header Title Bar with Soft Grey Fill */}
        <div className="flex items-center justify-between bg-zinc-100/80 dark:bg-zinc-800/60 p-2 px-2.5 rounded-lg border-none">
          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
            <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
            <span>Chăm sóc học viên ({careStudentsList.length})</span>
          </span>
          <button
            type="button"
            onClick={() => onSwitchTab('roster')}
            className="text-[11px] font-normal text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Chuyển tab Học viên
          </button>
        </div>

        {/* Flat list of Care Students */}
        <div className="space-y-3 px-1 pt-0.5">
          {careStudentsList.map((student) => {
            const avatarColor = getAvatarColor(student.id)
            const initials = student.name
              ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              : 'HV'
            const careBadges = getStudentCareBadges(student)
            const nameParts = getStudentNameParts(student)

            return (
              <div
                key={student.id}
                className="flex items-start gap-3"
              >
                {/* Left: Avatar (Enlarged h-10 w-10, spanning from name line down to end of first badge) */}
                <div className={cn('h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border border-white dark:border-zinc-800 shadow-2xs mt-0.5', avatarColor)}>
                  {initials}
                </div>

                {/* Right: Student Name Header + Care Badges stacked underneath aligned straight with the name */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Line 1: Student Name + Code */}
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentId(student.id)}
                      className="font-bold text-foreground text-xs truncate hover:text-primary hover:underline text-left cursor-pointer"
                      title={nameParts.formattedName}
                    >
                      {nameParts.formattedName}
                    </button>
                    <span className="text-[11px] text-muted-foreground font-mono font-normal shrink-0">({student.code})</span>
                  </div>

                  {/* Line 2+: Care Badge cards left-aligned straight under the student name */}
                  <div className="space-y-1">
                    {careBadges.map((badge, bIdx) => (
                      <div
                        key={bIdx}
                        className={cn(
                          'flex items-center justify-between p-1.5 px-2 rounded-lg border text-xs leading-tight min-w-0',
                          badge.code === 'CSĐB' || badge.code === 'CSKH'
                            ? 'border-rose-200 bg-rose-50/80 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
                            : badge.code === 'CSBH'
                            ? 'border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200'
                            : 'border-indigo-200 bg-indigo-50/80 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200'
                        )}
                      >
                        {/* Left: Bold Colored Code Text (No box, no border) + Full Reason & Assigned Person */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 me-2">
                          <span className={cn(
                            'font-bold text-[11px] shrink-0 me-0.5',
                            badge.code === 'CSĐB' || badge.code === 'CSKH'
                              ? 'text-rose-700 dark:text-rose-400'
                              : badge.code === 'CSBH'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-purple-700 dark:text-purple-400'
                          )}>
                            {badge.code}
                          </span>

                          <div className="min-w-0 flex-1 text-[11px] truncate">
                            <span className="font-semibold text-foreground me-1.5">{badge.fullLabel}</span>
                            <span className="text-muted-foreground font-normal">
                              · Phụ trách: <strong className="font-normal text-foreground">{badge.assigneeText || 'CS Nguyễn Thị Ngọc Anh'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Right: Plain Text SLA */}
                        <span className={cn(
                          'text-[11px] font-normal shrink-0',
                          badge.isOverdue ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-amber-600 dark:text-amber-400 font-medium'
                        )}>
                          {badge.isOverdue ? `Quá hạn: ${badge.slaText}` : `Đến hạn: ${badge.slaText}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leave Request Detail Dialog */}
      <LeaveReserveDetailDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        request={leaveRequest}
        readOnly={true}
      />

      {/* Student Profile Detail Dialog */}
      <StudentDetailDialog
        studentId={selectedStudentId}
        open={!!selectedStudentId}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null)
        }}
      />

      {/* QC Check Detail Dialog */}
      <QcCheckDetailDialog
        event={qcEvent}
        open={qcDialogOpen}
        onOpenChange={setQcDialogOpen}
        onAddError={() => {}}
        onUpdateError={() => {}}
        onPublish={() => {}}
        onCloseEvent={() => setQcDialogOpen(false)}
        onCancelEvent={() => setQcDialogOpen(false)}
        onNotMet={() => {}}
        currentUserId="usr-001"
        onEditError={() => {}}
        onAddComment={() => {}}
      />
    </div>
  )
}
