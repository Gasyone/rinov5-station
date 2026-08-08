'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarX,
  X,
  ClipboardCheck,
  Star,
  Notebook,
  HeartHandshake,
  Info,
  FolderOpen,
  LayoutDashboard,
} from 'lucide-react'
import { ClassesSessionOverviewTab } from './ClassesSessionOverviewTab'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RosterStudent, RoadmapSession, TestScoreData, ClassNote, ClassAuditLog } from './classesDetailTypes'
import { ClassesBulkFeedbackDialog } from './ClassesBulkFeedbackDialog'
import { ClassesSessionAttendanceTab } from './ClassesSessionAttendanceTab'
import { ClassesSemesterEvaluationDialog } from './ClassesSemesterEvaluationDialog'
import type { SemesterStudentEval } from './ClassesSemesterEvaluationDialog'
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'
import { StudentCareDetailDialog } from '@/components/screens/care/StudentCareDetailDialog'
import { mockCareAlerts } from '@/mocks/careAlerts'
import { ClassesDetailDialog } from './ClassesDetailDialog'
import { ClassesTestScoreDialog } from './ClassesTestScoreDialog'
import { ClassesSessionCommentWarningDialog } from './ClassesSessionCommentWarningDialog'
import { ClassesSessionUnitTestWarningDialog } from './ClassesSessionUnitTestWarningDialog'
import { ClassesSessionDetailSidebar } from './ClassesSessionDetailSidebar'
import { ClassesSessionMediaTab } from './ClassesSessionMediaTab'
import { ClassesSessionCommentBox } from './ClassesSessionCommentBox'
import {
  INACTIVE_STATUSES,
  getSessionStatusLabel,
  deriveAttendance,
  deriveFeedback,
  stableHash,
  getInitialSemesterEvals,
  getInitialTestScores,
} from './classesSessionDetailHelpers'
import type { AttendanceStatus } from './classesSessionDetailHelpers'

interface ClassesSessionDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  session: RoadmapSession
  sessions: RoadmapSession[]
  cls: ClassRecord
  roster: RosterStudent[]
  onCancel?: (sessionId: string) => void
  onEditTeacher?: (sessionId: string) => void
  onEditRoom?: (sessionId: string) => void
  onUpload?: (sessionId: string, student?: RosterStudent) => void
  classNotes?: ClassNote[]
  classLogs?: ClassAuditLog[]
  onAddClassNote?: (text: string) => void
  isOpenedFromClassScreen?: boolean
}

export function ClassesSessionDetailDialog({
  isOpen,
  onClose,
  session: initialSession,
  sessions,
  cls,
  roster,
  onUpload: _onUpload,
  isOpenedFromClassScreen,
}: ClassesSessionDetailDialogProps) {
  const [currentSessionId, setCurrentSessionId] = useState(initialSession.id)
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<string, AttendanceStatus>>({})
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({})
  const [ratingMap] = useState<Record<string, number>>({})
  const [isBulkFeedbackOpen, setIsBulkFeedbackOpen] = useState(false)
  const [isSemesterEvalOpen, setIsSemesterEvalOpen] = useState(false)
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [isBannerDismissed, setIsBannerDismissed] = useState(false)
  const initialSemesterEvals = useMemo(() => getInitialSemesterEvals(roster), [roster])

  const [semesterEvalMap, setSemesterEvalMap] = useState<Record<string, SemesterStudentEval>>(initialSemesterEvals)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedCareStudentId, setSelectedCareStudentId] = useState<string | null>(null)
  const [isCareOnlyFilter, setIsCareOnlyFilter] = useState(false)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)
  const [leftPanelTab, setLeftPanelTab] = useState<'overview' | 'roster' | 'media'>('overview')

  // ── Missing comments check for closing warning ──
  const [showWarning, setShowWarning] = useState(false)


  // ── Test Scores State for Test Sessions ──
  const initialTestScores = useMemo(() => getInitialTestScores(roster), [roster])

  const [testScores, setTestScores] = useState<Record<string, Record<string, TestScoreData>>>(initialTestScores)
  const [isTestScoreOpen, setIsTestScoreOpen] = useState(false)
  const [testScoreStudentId, setTestScoreStudentId] = useState<string | null>(null)
  const [activeTestScoreSkill, setActiveTestScoreSkill] = useState<string>('Speaking')

  const handleSaveTestScore = (studentId: string, skill: string, scoreData: TestScoreData) => {
    setTestScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [skill]: scoreData,
      },
    }))
  }

  const completedEvalCount = useMemo(() => {
    return roster.filter(s => !INACTIVE_STATUSES.includes(s.status)).filter(s => semesterEvalMap[s.id]?.isSubmitted).length
  }, [roster, semesterEvalMap])

  const session = sessions.find((s) => s.id === currentSessionId) ?? initialSession
  const currentIndex = sessions.findIndex((s) => s.id === currentSessionId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < sessions.length - 1

  const initialComment = useMemo(() => {
    if (session.status === 'upcoming' || session.status === 'ongoing') {
      return ''
    }
    return session.description || session.coverNote || ''
  }, [session.status, session.description, session.coverNote])

  const [commentText, setCommentText] = useState(initialComment)
  const [prevInitialComment, setPrevInitialComment] = useState(initialComment)

  if (prevInitialComment !== initialComment) {
    setPrevInitialComment(initialComment)
    setCommentText(initialComment)
  }

  const isMath = cls.level.toLowerCase().includes('math') || cls.level.toLowerCase().includes('toán')


  const isTestSession = (
    session.sessionNumber % 3 === 0 ||
    (session.topic || '').toLowerCase().includes('test') ||
    (session.topic || '').toLowerCase().includes('kiểm tra') ||
    (session.topic || '').toLowerCase().includes('evaluation')
  )

  const navigateTo = (index: number) => {
    if (index >= 0 && index < sessions.length) {
      setCurrentSessionId(sessions[index].id)
      setIsBannerDismissed(false)
    }
  }

  // ── Filter and map roster dynamically per session (Trial/New only in specific sessions) ──
  const sessionRoster = useMemo(() => {
    const isEvenSession = session.sessionNumber % 2 === 0
    return roster
      .map((student) => {
        // Rule: A new student is only "new" on session 1. For session > 1, they are "active".
        if (student.status === 'new') {
          if (session.sessionNumber === 1) {
            return student
          } else {
            return { ...student, status: 'active' as const }
          }
        }
        return student
      })
      .filter((student) => {
        // Rule: Trial students only attend sessions with odd numbers.
        // For even sessions, they are excluded from the roster.
        if (student.status === 'trial') {
          return !isEvenSession
        }
        return true
      })
  }, [roster, session.sessionNumber])

  // ── Only active students (exclude nghỉ / hết buổi / bảo lưu / chuyển) ──
  const activeRoster = useMemo(
    () => sessionRoster.filter((s) => !INACTIVE_STATUSES.includes(s.status)),
    [sessionRoster]
  )

  const sessionTrialCount = useMemo(() => {
    return activeRoster.filter((s) => s.status === 'trial').length
  }, [activeRoster])

  const careStudentsCount = useMemo(() => {
    return activeRoster.filter(
      (s) => s.status === 'trial' || s.status === 'new' || !!s.sessionLabel
    ).length
  }, [activeRoster])

  // ── Attendance helpers ──
  const getAttendance = useCallback((studentId: string): AttendanceStatus => {
    const key = `${studentId}:${session.id}`
    if (attendanceOverrides[key]) return attendanceOverrides[key]

    // Default to 'absent' (unmarked Plus button) for future/upcoming sessions
    if (session.status === 'upcoming') return 'absent'

    return deriveAttendance(studentId, session.id)
  }, [session.id, session.status, attendanceOverrides])

  const setAttendance = (studentId: string, status: AttendanceStatus) => {
    const key = `${studentId}:${session.id}`
    setAttendanceOverrides((prev) => ({ ...prev, [key]: status }))
  }

  // ── Feedback helper ──
  const getFeedback = useCallback((studentId: string): string =>
    feedbackMap[studentId] ?? deriveFeedback(studentId, session.id),
  [feedbackMap, session.id])

  const getRating = useCallback((studentId: string): number =>
    ratingMap[studentId] ?? ((stableHash(studentId + session.id) % 2) + 4),
  [ratingMap, session.id])

  // No derived notes and logs needed

  // ── Stats ──
  const presentCount = activeRoster.filter((s) => getAttendance(s.id) === 'present').length
  const lateCount = activeRoster.filter((s) => getAttendance(s.id) === 'late').length
  const absentCount = activeRoster.filter((s) => getAttendance(s.id) === 'absent').length
  const excusedCount = activeRoster.filter((s) => getAttendance(s.id) === 'excused').length
  const isEnglish = useMemo(() => {
    const l = (cls.level || '').toLowerCase()
    return (
      l.includes('ielts') ||
      l.includes('toeic') ||
      l.includes('beginner') ||
      l.includes('english') ||
      l.includes('prep') ||
      l.includes('movers') ||
      l.includes('flyers') ||
      l.includes('tiếng anh') ||
      l.includes('cambridge') ||
      l.includes('starter') ||
      l.includes('mover') ||
      l.includes('flyer')
    )
  }, [cls.level])

  const hasMissingComments = useMemo(() => {
    const isCompleted = session.status === 'completed'
    if (!isCompleted) return false

    // Comments are required for Math (all sessions) and English normal sessions (not test)
    const commentsRequired = isMath || (isEnglish && !isTestSession)
    if (!commentsRequired) return false

    // Check if any active student who is present/late has empty comment
    return activeRoster.some((student) => {
      const att = getAttendance(student.id)
      const isAttending = att === 'present' || att === 'late'
      if (!isAttending) return false

      const fb = getFeedback(student.id)
      return !fb || fb.trim() === ''
    })
  }, [isTestSession, session.status, isMath, isEnglish, activeRoster, getAttendance, getFeedback])

  const handleCloseAttempt = () => {
    if (hasMissingComments) {
      setShowWarning(true)
    } else {
      onClose()
    }
  }

  // ── English Unit Test Warning Modal state ──
  const [showUnitTestWarning, setShowUnitTestWarning] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
      <DialogContent showCloseButton={false} className="flex flex-col min-h-0 h-[90vh] max-h-[900px] overflow-hidden p-4 gap-3 sm:max-w-[95vw] lg:max-w-[1380px] rounded-2xl border bg-zinc-100 dark:bg-zinc-950 shadow-xl">
        {/* ── TOP HEADER BAR: BREADCRUMB (LEFT) + SESSION NAV & CLOSE BUTTON (RIGHT) (NO BORDER LINE) ── */}
        <div className="flex items-center justify-between w-full shrink-0">
          {/* Left: Icon trở lại + Tên lớp học / Chi tiết buổi học */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCloseAttempt}
              className="h-7 w-7 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 cursor-pointer"
              title="Trở lại"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-foreground">{cls.name || 'IELTS Junior 1A'}</span>
              <span className="text-muted-foreground font-normal">/</span>
              <span className="text-muted-foreground font-medium">Chi tiết buổi học</span>
            </div>
          </div>

          {/* Right: Semester Eval + Buổi trước / Selection buổi / Buổi sau + Icon X */}
          <div className="flex items-center gap-1.5">
            {isTestSession && !isMath && (
              <Button
                type="button"
                size="xs"
                onClick={() => setIsSemesterEvalOpen(true)}
                disabled={session.status === 'cancelled' || session.status === 'absent'}
                className="gap-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold border-none shadow-xs transition-all px-2.5 h-7 text-[10px] rounded-md cursor-pointer mr-1"
              >
                <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
                Semester Eval ({completedEvalCount}/{activeRoster.length})
              </Button>
            )}

            <Button variant="ghost" size="sm" disabled={!hasPrev} onClick={() => navigateTo(currentIndex - 1)} className="h-7 rounded-lg text-xs gap-1 px-2">
              <ChevronLeft className="h-3.5 w-3.5" /> Buổi trước
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 rounded-lg text-xs gap-1.5 px-2 font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer">
                  <span>{session.date} ({session.startTime}–{session.endTime})</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[360px] rounded-xl p-1 z-[9999]" align="start">
                {sessions.map((s, idx) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => navigateTo(idx)}
                    className={cn(
                      'flex flex-col items-start gap-1 p-2 rounded-lg cursor-pointer transition-all my-0.5 group',
                      s.id === currentSessionId
                        ? 'bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700 shadow-2xs'
                        : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 border border-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className={cn(
                        'truncate me-1.5 transition-all',
                        s.id === currentSessionId
                          ? 'text-primary dark:text-sky-400 font-bold'
                          : 'text-foreground font-normal group-hover:font-semibold'
                      )}>
                        Buổi {s.sessionNumber}: {s.topic}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {s.id === currentSessionId && (
                          <Badge className="bg-primary text-primary-foreground font-bold text-[9px] px-1.5 py-0 rounded-md border-none shrink-0">
                            Đang xem
                          </Badge>
                        )}
                        <Badge variant="outline" className={`rounded-full text-[9px] font-bold px-1.5 py-0 scale-90 shrink-0 ${
                          s.status === 'ongoing' ? 'border-sky-300 bg-sky-100 text-sky-800' : getStatusBadgeClass(s.status)
                        }`}>
                          {getSessionStatusLabel(s.status)}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono font-normal">
                      {s.date} ({s.startTime}–{s.endTime})
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" disabled={!hasNext} onClick={() => navigateTo(currentIndex + 1)} className="h-7 rounded-lg text-xs gap-1 px-2">
              Buổi sau <ChevronRight className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCloseAttempt}
              className="h-7 w-7 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer ml-1"
              title="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── MAIN MODAL BODY: LEFT PANEL (70%) + RIGHT PANEL (30%) ── */}
        <div className="flex-1 flex min-h-0 overflow-hidden gap-4">
          {/* Left Panel: Header + Attendance Table (70%) */}
          <div className="flex-[7] flex flex-col min-h-0 overflow-hidden gap-3">
            {/* Header Card in Left Panel */}
            <div className="shrink-0 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 space-y-2 shadow-2xs">
              {/* Row 1: Title & Status */}
              <div>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
                  <span>{session.topic}</span>
                  <Badge variant="outline" className={`rounded-full text-[9px] font-bold px-1.5 py-0 ${
                    session.status === 'ongoing' ? 'border-sky-300 bg-sky-100 text-sky-800' : getStatusBadgeClass(session.status)
                  }`}>
                    {getSessionStatusLabel(session.status)}
                  </Badge>
                  {isTestSession && (
                    <Badge variant="outline" className="rounded-full text-[9px] font-bold px-1.5 py-0 border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      Buổi kiểm tra
                    </Badge>
                  )}
                </DialogTitle>
              </div>

              {/* Row 2: Full-width Session Log input box directly under session title */}
              <div className="w-full pt-1">
                <ClassesSessionCommentBox
                  value={commentText}
                  onChange={setCommentText}
                  students={activeRoster}
                  rows={1}
                  minHeight="min-h-[28px]"
                  placeholder="Nhật ký buổi học: Giáo viên nhập nhận xét chung về buổi học tại đây... (Gõ @ để tag học viên)"
                />
              </div>
            </div>

            {/* Status Banners */}
            {!isBannerDismissed && (session.status === 'cancelled' || session.status === 'absent') && (
              <div className="p-3 rounded-xl border border-red-100 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 flex items-center gap-2.5 text-xs animate-fade-in shrink-0">
                <CalendarX className="h-5 w-5 shrink-0 text-red-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold">Buổi học đã hủy</p>
                  <p className="mt-0.5 text-[11px] opacity-90">Lý do hủy: {session.cancelReason || session.cancelDescription || 'Giáo viên xin nghỉ hoặc trung tâm chủ động dời lịch.'}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-5 w-5 rounded-full text-current hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer shrink-0"
                  onClick={() => setIsBannerDismissed(true)}
                  title="Đóng thông báo"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {isEnglish && isTestSession && (
              <div className="p-2 rounded-xl border border-sky-100 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/20 text-sky-850 dark:text-sky-300 flex items-center gap-2 text-xs animate-fade-in shrink-0 select-none">
                <span className="text-base text-amber-500">🔔</span>
                <button
                  type="button"
                  onClick={() => setShowUnitTestWarning(true)}
                  className="font-bold text-sky-700 hover:text-sky-800 hover:underline dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer bg-transparent border-none p-0 text-left"
                >
                  Important notes for the Unit Test
                </button>
              </div>
            )}

            {/* ── LEFT PANEL TABS: TỔNG QUAN, HỌC VIÊN & TÀI LIỆU & MEDIA ── */}
            <div className="shrink-0 flex items-center justify-start gap-1 bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60 w-fit">
              <button
                type="button"
                onClick={() => setLeftPanelTab('overview')}
                className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  leftPanelTab === 'overview'
                    ? 'bg-white dark:bg-zinc-900 text-foreground font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Tổng quan</span>
              </button>

              <button
                type="button"
                onClick={() => setLeftPanelTab('roster')}
                className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  leftPanelTab === 'roster'
                    ? 'bg-white dark:bg-zinc-900 text-foreground font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                <Users className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                <span>Học viên</span>
                <span className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  leftPanelTab === 'roster'
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground'
                    : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {activeRoster.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLeftPanelTab('media')}
                className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  leftPanelTab === 'media'
                    ? 'bg-white dark:bg-zinc-900 text-foreground font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                <span>Tài liệu & Media</span>
              </button>
            </div>

            {/* Tab Content Container */}
            {leftPanelTab === 'overview' ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden pt-1">
                <ClassesSessionOverviewTab
                  session={session}
                  activeRoster={activeRoster}
                  getAttendance={getAttendance}
                  onSwitchTab={(tab) => setLeftPanelTab(tab)}
                  setIsBulkFeedbackOpen={setIsBulkFeedbackOpen}
                />
              </div>
            ) : leftPanelTab === 'roster' ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ClassesSessionAttendanceTab
                  activeRoster={activeRoster}
                  setIsBulkFeedbackOpen={setIsBulkFeedbackOpen}
                  getAttendance={getAttendance}
                  onAttendanceChange={setAttendance}
                  getFeedback={getFeedback}
                  getRating={getRating}
                  sessionId={session.id}
                  sessionDate={session.date}
                  sessionStartTime={session.startTime}
                  sessionStatus={session.status}
                  isTestSession={isTestSession}
                  isMath={isMath}
                  onOpenCareDetail={(student) => {
                    setSelectedCareStudentId(student.id)
                  }}
                  isCareOnlyFilter={isCareOnlyFilter}
                  semesterEvalMap={semesterEvalMap}
                  testScores={testScores}
                  onOpenTestScoreDialog={(studentId, skill) => {
                    setTestScoreStudentId(studentId)
                    setActiveTestScoreSkill(skill)
                    setIsTestScoreOpen(true)
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pt-1">
                <ClassesSessionMediaTab
                  singleSessionMode={true}
                  sessionId={session.id}
                  sessionNumber={session.sessionNumber}
                  className={cls.name}
                  rosterStudents={activeRoster.map((s) => ({
                    id: s.id,
                    name: s.name,
                    code: s.code,
                    initials: s.name ? s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'HV',
                  }))}
                />
              </div>
            )}
          </div>

          {/* Right Panel: Bài học & Chương trình (30%) */}
          <ClassesSessionDetailSidebar
            session={session}
            sessions={sessions}
            cls={cls}
            roster={activeRoster}
            isOpenedFromClassScreen={isOpenedFromClassScreen}
            onOpenClassDetail={() => setIsClassDetailOpen(true)}
            activeRosterCount={activeRoster.length}
            presentCount={presentCount}
            excusedCount={excusedCount}
            absentCount={absentCount}
            lateCount={lateCount}
            sessionTrialCount={sessionTrialCount}
            careStudentsCount={careStudentsCount}
            isCareOnlyFilter={isCareOnlyFilter}
            onToggleCareOnlyFilter={() => setIsCareOnlyFilter((prev) => !prev)}
          />
        </div>
      </DialogContent>

      {/* Bulk Feedback Dialog */}
      <ClassesBulkFeedbackDialog
        isOpen={isBulkFeedbackOpen}
        onClose={() => setIsBulkFeedbackOpen(false)}
        students={activeRoster.map((s) => ({
          student: s,
          feedback: getFeedback(s.id),
        }))}
        onSave={(map) => setFeedbackMap(map)}
        sessionTopic={session.topic}
        classLevel={cls.level}
        isTestSession={isTestSession}
      />

      {/* Semester Evaluation Dialog */}
      {isSemesterEvalOpen && (
        <ClassesSemesterEvaluationDialog
          isOpen={isSemesterEvalOpen}
          onClose={() => setIsSemesterEvalOpen(false)}
          students={activeRoster}
          fullRoster={roster}
          evalMap={semesterEvalMap}
          onSaveEval={(studentId, evalData) => {
            setSemesterEvalMap((prev) => ({
              ...prev,
              [studentId]: evalData,
            }))
          }}
          sessionTopic={session.topic}
        />
      )}

      <StudentDetailDialog
        studentId={selectedStudentId}
        open={!!selectedStudentId}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null)
        }}
        fromClassName={cls.name}
      />

      <StudentCareDetailDialog
        studentId={selectedCareStudentId}
        open={!!selectedCareStudentId}
        onOpenChange={(open) => {
          if (!open) setSelectedCareStudentId(null)
        }}
        alerts={mockCareAlerts}
      />

      <ClassesDetailDialog
        cls={cls}
        open={isClassDetailOpen}
        onOpenChange={setIsClassDetailOpen}
      />

      {isTestScoreOpen && (
        <ClassesTestScoreDialog
          isOpen={isTestScoreOpen}
          onClose={() => setIsTestScoreOpen(false)}
          students={activeRoster}
          initialStudentId={testScoreStudentId}
          skill={activeTestScoreSkill}
          scores={testScores}
          onSaveScore={handleSaveTestScore}
          classLevel={cls.level}
        />
      )}

      <ClassesSessionCommentWarningDialog
        isOpen={showWarning}
        onClose={(action) => {
          setShowWarning(false)
          if (action === 'comment') {
            setIsBulkFeedbackOpen(true)
          } else if (action === 'later') {
            onClose()
          }
        }}
      />

      <ClassesSessionUnitTestWarningDialog
        isOpen={showUnitTestWarning}
        onClose={() => setShowUnitTestWarning(false)}
      />
    </Dialog>
  )
}
