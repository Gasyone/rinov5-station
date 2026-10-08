'use client'

import React, { useState, useMemo } from 'react'
import {
  Eye,
  Calendar,
  Award,
  GraduationCap,
  Star,
  Sparkles,
  UserCheck,
  MessageSquare,
  AlertTriangle,
  CreditCard,
  ChevronRight,
} from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Button } from '@/components/ui/button'
import { AppAvatar } from './AppAvatar'
import { toast } from 'sonner'

// Existing Enterprise Dialogs (Tái sử dụng các modal đã có sẵn của hệ thống)
import { SessionDetailDialog } from '@/components/screens/calendar/SessionDetailDialog'
import { FeedbackFormDialog } from '@/components/screens/session-feedback/FeedbackFormDialog'
import { ClassesTestScoreDialog } from '@/components/screens/classes/detail/ClassesTestScoreDialog'
import { StudentCareDetailDialog } from '@/components/screens/care/StudentCareDetailDialog'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'

import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { mockCareAlerts } from '@/mocks/careAlerts'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import type { SessionFeedback } from '@/mocks/sessionFeedback'
import type { RosterStudent, TestScoreData } from '@/components/screens/classes/detail/classesDetailTypes'

export type StudentTaskType =
  | 'attendance'
  | 'feedback'
  | 'grading'
  | 'care'
  | 'renewal'
  | 'leave_reserve'

export interface StudentTaskItem {
  id: string
  type: StudentTaskType
  title: string
  subtitle: string
  statusLabel: string
  statusColor: 'amber' | 'blue' | 'purple' | 'red' | 'emerald' | 'orange'
  dateOrDue?: string
  extraData?: Record<string, any>
}

export interface StudentProfileItem {
  id: string
  name: string
  code?: string
  avatar?: string
  status?: string
  birthDate?: string
  gender?: string
  branch?: string
  classCode?: string
  className?: string
  parentName?: string
  parentPhone?: string
  parentRelation?: string
  attendanceRate?: string
  homeworkRate?: string
  avgScore?: string
  rating?: number
  isTrial?: boolean
  trialNotice?: string
  note?: string
  tasks?: StudentTaskItem[]
}

export interface StudentProfileHoverCardProps {
  student: StudentProfileItem
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  onOpenDetail?: (studentId: string) => void
}

export function StudentProfileHoverCard({
  student,
  children,
  align = 'start',
  side = 'bottom',
  onOpenDetail,
}: StudentProfileHoverCardProps) {
  // Modal visibility states for existing enterprise dialogs
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [isTestScoreDialogOpen, setIsTestScoreDialogOpen] = useState(false)
  const [isCareDialogOpen, setIsCareDialogOpen] = useState(false)
  const [isLeaveReserveDialogOpen, setIsLeaveReserveDialogOpen] = useState(false)
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false)

  // Local state for test scores when grading
  const [testScores, setTestScores] = useState<Record<string, Record<string, TestScoreData>>>({})

  // Contextual tasks for this student
  const tasks: StudentTaskItem[] = useMemo(() => {
    if (student.tasks && student.tasks.length > 0) return student.tasks

    return [
      {
        id: `task-att-${student.id}`,
        type: 'attendance',
        title: 'Điểm danh ca học',
        subtitle: `${student.className || 'IELTS Junior 1A'} • Ca 10:30`,
        statusLabel: 'Chờ điểm danh',
        statusColor: 'amber',
      },
      {
        id: `task-fb-${student.id}`,
        type: 'feedback',
        title: 'Nhận xét buổi học',
        subtitle: 'Buổi 12: Phát âm & Tư duy giao tiếp',
        statusLabel: 'Chưa nhận xét',
        statusColor: 'blue',
      },
      {
        id: `task-gr-${student.id}`,
        type: 'grading',
        title: 'Chấm điểm dự án / test',
        subtitle: 'Mini Project Scratch Kỳ 1',
        statusLabel: 'Chờ chấm',
        statusColor: 'purple',
      },
      {
        id: `task-care-${student.id}`,
        type: 'care',
        title: 'Thẻ chăm sóc học viên',
        subtitle: student.note || 'Vắng 2 buổi liên tiếp • Cảnh báo C90B',
        statusLabel: 'Cần liên hệ',
        statusColor: 'red',
      },
      {
        id: `task-renew-${student.id}`,
        type: 'renewal',
        title: 'Tái phí & Hạn tái phí',
        subtitle: 'Còn 2 / 48 buổi • Hạn: 15/10/2026',
        statusLabel: 'Sắp hết phí',
        statusColor: 'emerald',
      },
      {
        id: `task-leave-${student.id}`,
        type: 'leave_reserve',
        title: 'Đơn xin nghỉ & Bảo lưu',
        subtitle: 'Đơn xin nghỉ phép ca 10:30 (08/10)',
        statusLabel: 'Chờ duyệt',
        statusColor: 'orange',
      },
    ]
  }, [student])

  const studentCode = student.code || `STU-${student.id.replace(/\D/g, '') || '001'}`
  const birthDate = student.birthDate || '15/03/2005'
  const gender = student.gender || 'Nam'
  const statusLabel = student.status || 'Đang học'
  const branch = student.branch || 'RinoEdu Nguyễn Tuân'
  const rating = student.rating ?? 4.8
  const isTrial = student.isTrial ?? (student.name.includes('An') || student.name.includes('Chi'))

  // Synthesize or resolve realistic class session for SessionDetailDialog
  const classSession: ClassSession = useMemo(() => {
    const allSessions = getMockClassSessions()
    const matched = allSessions.find(
      (s) => s.classCode === student.classCode || s.className === student.className
    )
    if (matched) return matched

    return {
      id: `sess-${student.id}`,
      classCode: student.classCode || 'CLS-IELTS-001',
      className: student.className || 'IELTS Junior 1A',
      subject: 'Tiếng Anh',
      teacher: 'Sarah J.',
      branch: student.branch || 'RinoEdu Nguyễn Tuân',
      schoolRoom: 'P.A101',
      level: 'Junior 1A',
      date: new Date().toISOString().split('T')[0],
      dateDisplay: 'Hôm nay',
      dateBucket: 'today',
      timeLabel: '10:30',
      endTimeLabel: '12:00',
      statusLabel: 'Chờ điểm danh',
      type: 'class_session',
      typeLabel: 'Lớp chính khóa',
      title: 'Buổi 12: Phát âm & Tư duy giao tiếp',
      lessonSubtitle: '',
      totalStudents: 15,
      officialStudents: 14,
      trialStudents: 1,
      makeUpStudents: 0,
      status: 'confirmed',
    }
  }, [student])

  // Synthesize or resolve feedback data for FeedbackFormDialog
  const sessionFeedback: SessionFeedback = useMemo(() => {
    return {
      id: `fb-${student.id}`,
      sessionId: classSession.id,
      sessionCode: 'SES-012',
      classId: classSession.classCode || 'CLS-IELTS-001',
      className: student.className || classSession.className,
      classCode: student.classCode || classSession.classCode,
      branch: student.branch || classSession.branch,
      studentId: student.id,
      studentName: student.name,
      attendance: 'present',
      progress: 'stable',
      status: 'pending',
      teacher: classSession.teacher || 'Sarah J.',
      date: new Date().toISOString().split('T')[0],
      homeworkTitle: 'Bài tập phát âm âm /θ/ và /ð/',
      homeworkStatus: 'done',
      homeworkScore: 8,
      feedback: 'Học sinh tích cực tham gia thảo luận trên lớp, phát âm tròn vành rõ chữ. Cần chú ý tốc độ nói tự nhiên hơn.',
      recommendation: 'Luyện tập thêm bài tập số 3 trong giáo trình.',
    }
  }, [student, classSession])

  // Roster student format for ClassesTestScoreDialog
  const rosterStudents: RosterStudent[] = useMemo(() => [
    {
      id: student.id,
      name: student.name,
      code: studentCode,
      avatar: student.avatar,
      status: 'active',
      dob: birthDate,
      parentName: student.parentName || 'Phụ huynh',
      parentPhone: student.parentPhone || '0912345678',
      enrollmentDate: '01/01/2026',
    }
  ], [student, studentCode, birthDate])

  // Leave request for LeaveReserveDetailDialog
  const leaveRequest = useMemo(() => {
    return (
      mockLeaveReserveRequests.find(
        (r) => r.studentId === student.id || r.studentName === student.name
      ) || mockLeaveReserveRequests[0]
    )
  }, [student])

  // Task click dispatcher to existing enterprise modals
  const handleTaskClick = (task: StudentTaskItem) => {
    if (task.type === 'attendance') {
      setIsSessionDetailOpen(true)
    } else if (task.type === 'feedback') {
      setIsFeedbackDialogOpen(true)
    } else if (task.type === 'grading') {
      setIsTestScoreDialogOpen(true)
    } else if (task.type === 'care' || task.type === 'renewal') {
      setIsCareDialogOpen(true)
    } else if (task.type === 'leave_reserve') {
      setIsLeaveReserveDialogOpen(true)
    }
  }

  return (
    <>
      <HoverCard openDelay={150} closeDelay={150}>
        <HoverCardTrigger asChild>
          {children}
        </HoverCardTrigger>
        <HoverCardContent
          side={side}
          align={align}
          className="w-96 sm:w-[410px] p-4 rounded-2xl shadow-xl border border-border/80 bg-popover text-popover-foreground z-50 text-left space-y-3 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header Row: Student Avatar, Name, Tab-style Status, Rating Star */}
          <div className="flex items-start gap-3 pb-2.5 border-b border-border/60">
            <div className="relative shrink-0">
              <AppAvatar
                src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`}
                name={student.name}
                size="lg"
                className="h-13 w-13 border-2 border-primary/30 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-2xs" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              {/* Name + Status Tab Badge + Star Rating */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-bold text-foreground truncate leading-tight">
                  {student.name}
                </h4>

                {/* Status Badge in Tab style */}
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 shrink-0 shadow-3xs">
                  {statusLabel}
                </span>

                {/* Rating Star Average Badge */}
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 shrink-0 shadow-3xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500 shrink-0" />
                  <span className="font-mono font-bold">{rating}</span>
                </span>
              </div>

              {/* Sub-info: Student Code, Birthdate, Gender */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.2 rounded text-xs">
                  {studentCode}
                </span>
                <span>•</span>
                <span>{birthDate}</span>
                <span>({gender})</span>
              </div>

              {/* Branch / School */}
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 truncate">
                <GraduationCap className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{branch}</span>
              </div>
            </div>
          </div>

          {/* Trial / New Student Alert Banner Notice */}
          {isTrial && (
            <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-sky-500/10 border border-cyan-300/80 dark:border-cyan-800/60 p-2.5 flex items-start gap-2 text-xs shadow-2xs">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-extrabold text-cyan-900 dark:text-cyan-200 text-xs uppercase tracking-wide">
                    HỌC VIÊN MỚI (TRIAL / HỌC THỬ)
                  </span>
                  <span className="text-xs font-extrabold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 px-1.5 py-0.2 rounded-full border border-cyan-300/60">
                    Buổi 1/2
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">
                  {student.trialNotice || 'Học viên vừa gia nhập lớp học thử. Cần ưu tiên chú ý hỗ trợ & hỏi thăm hòa nhập 2 buổi đầu.'}
                </p>
              </div>
            </div>
          )}

          {/* ================= PHẦN DƯỚI: TỪNG TASK CẦN XỬ LÝ (TÁCH THÀNH TỪNG DÒNG) ================= */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground px-0.5">
              <span className="flex items-center gap-1.5">
                <span>Nghiệp vụ cần xử lý</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {tasks.length}
                </span>
              </span>
              <span className="text-xs text-muted-foreground font-normal">Click dòng để mở modal</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 custom-scrollbar">
              {tasks.map((task) => {
                const Icon =
                  task.type === 'attendance'
                    ? UserCheck
                    : task.type === 'feedback'
                    ? MessageSquare
                    : task.type === 'grading'
                    ? Award
                    : task.type === 'care'
                    ? AlertTriangle
                    : task.type === 'renewal'
                    ? CreditCard
                    : Calendar

                const iconColor =
                  task.type === 'attendance'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : task.type === 'feedback'
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                    : task.type === 'grading'
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                    : task.type === 'care'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    : task.type === 'renewal'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-orange-500/15 text-orange-600 dark:text-orange-400'

                const badgeColor =
                  task.statusColor === 'amber'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                    : task.statusColor === 'blue'
                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                    : task.statusColor === 'purple'
                    ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
                    : task.statusColor === 'red'
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                    : task.statusColor === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                    : 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20'

                return (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTaskClick(task)
                    }}
                    className="p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/60 transition-all flex items-center justify-between gap-2 cursor-pointer group hover:border-primary/40 shadow-3xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`p-1.5 rounded-md shrink-0 ${iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {task.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded font-normal border ${badgeColor}`}>
                        {task.statusLabel}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Footer Button: Xem chi tiết học viên */}
          <div className="pt-0.5 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                if (onOpenDetail) {
                  onOpenDetail(student.id)
                } else {
                  setIsStudentDetailOpen(true)
                }
              }}
              className="w-full h-8 text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" /> Xem chi tiết học viên
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* 1. Detail Buổi học (Điểm danh ca học) -> Mở detail buổi học chuẩn đã có */}
      <SessionDetailDialog
        session={classSession}
        open={isSessionDetailOpen}
        onOpenChange={setIsSessionDetailOpen}
      />

      {/* 2. Detail Form Nhận xét của buổi học -> Mở detail form nhận xét đã có */}
      <FeedbackFormDialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        feedback={sessionFeedback}
        onSave={(saved) => {
          toast.success(`Đã lưu nhận xét cho học viên: ${saved.studentName}`)
        }}
      />

      {/* 3. Detail Chấm điểm test / dự án -> Mở modal chấm điểm bài test / rubric đã có */}
      <ClassesTestScoreDialog
        isOpen={isTestScoreDialogOpen}
        onClose={() => setIsTestScoreDialogOpen(false)}
        students={rosterStudents}
        initialStudentId={student.id}
        skill="Speaking"
        scores={testScores}
        onSaveScore={(sId, skill, data) => {
          setTestScores((prev) => ({
            ...prev,
            [sId]: { ...prev[sId], [skill]: data },
          }))
          toast.success(`Đã lưu kết quả đánh giá môn ${skill} cho học viên`)
        }}
        classLevel={student.className || 'Junior 1A'}
      />

      {/* 4. Thẻ chăm sóc & Tái phí học viên -> Mở modal chi tiết CSKH & Tái phí đã có */}
      <StudentCareDetailDialog
        studentId={student.id}
        open={isCareDialogOpen}
        onOpenChange={setIsCareDialogOpen}
        alerts={mockCareAlerts}
      />

      {/* 5. Đơn xin nghỉ phép & Bảo lưu -> Mở modal chi tiết duyệt đơn đã có */}
      <LeaveReserveDetailDialog
        open={isLeaveReserveDialogOpen}
        onOpenChange={setIsLeaveReserveDialogOpen}
        request={leaveRequest}
        onAction={(id, action) => {
          toast.success(`Đã xử lý đơn ${id}: ${action === 'approved' ? 'Duyệt thành công' : 'Đã từ chối'}`)
        }}
      />

      {/* 6. Chi tiết hồ sơ học viên -> Mở modal chi tiết học viên đa tab chuẩn đã có */}
      <StudentDetailDialog
        studentId={student.id}
        open={isStudentDetailOpen}
        onOpenChange={setIsStudentDetailOpen}
      />
    </>
  )
}
