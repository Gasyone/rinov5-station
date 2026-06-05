'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Calendar,
  FileText,
  Users,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  BookOpenCheck,
  MessageSquarePlus,
  ExternalLink,
  MessageSquare,
  Clock,
  SendHorizontal,
  CalendarX,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { InfoField } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RosterStudent, RoadmapSession } from './classesDetailTypes'
import { ClassesBulkFeedbackDialog } from './ClassesBulkFeedbackDialog'

interface ClassesSessionDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  session: RoadmapSession
  sessions: RoadmapSession[]
  cls: ClassRecord
  roster: RosterStudent[]
}

// ── Types ───────────────────────────────────────────────────────────────
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

// ── Pure helpers ────────────────────────────────────────────────────────

function stableHash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h)
  }
  return Math.abs(h)
}

function getInitials(name: string): string {
  const parts = name.replace(/\s*\(.*\)\s*$/, '').trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
]

function getAvatarColor(id: string): string {
  return AVATAR_COLORS[stableHash(id) % AVATAR_COLORS.length]
}

/** Only for active students (inactive are filtered out upstream). */
function deriveAttendance(studentId: string, sessionId: string): AttendanceStatus {
  const mod = stableHash(studentId + sessionId) % 10
  if (mod === 0) return 'absent'
  if (mod === 1) return 'late'
  if (mod === 2) return 'excused'
  return 'present'
}

/** Returns a mock homework link, or null if not submitted. */
function deriveHomeworkLink(studentId: string, sessionId: string): string | null {
  const mod = stableHash(sessionId + studentId + 'hw') % 10
  if (mod <= 2) return null // ~30% not submitted
  return `#btvn-${studentId.slice(-4)}`
}

/** Auto-generated feedback text. */
function deriveFeedback(studentId: string, sessionId: string): string {
  const bank = [
    'Tiếp thu bài nhanh, phát âm tốt. Cần luyện thêm ngữ pháp.',
    'Cần chú ý tập trung hơn trong giờ học. Hay nói chuyện riêng.',
    'Hoàn thành bài tập đầy đủ, rất tích cực tham gia phát biểu.',
    'Nghe hiểu tốt, cần cải thiện kỹ năng viết đoạn văn.',
    'Tiến bộ rõ rệt so với buổi trước. Tự tin hơn khi giao tiếp.',
    'Tham gia hoạt động nhóm tốt. Cần ôn lại từ vựng chủ đề.',
  ]
  return bank[stableHash(sessionId + studentId + 'fb') % bank.length]
}

// ── Attendance config ───────────────────────────────────────────────────

const ATTENDANCE_OPTIONS: {
  value: AttendanceStatus
  label: string
  activeClass: string
  iconNode: React.ReactNode
}[] = [
  {
    value: 'present',
    label: 'Có',
    activeClass: 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200',
    iconNode: <CheckCircle2 className="h-3 w-3" />,
  },
  {
    value: 'late',
    label: 'Trễ',
    activeClass: 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200',
    iconNode: <AlertCircle className="h-3 w-3" />,
  },
  {
    value: 'excused',
    label: 'Phép',
    activeClass: 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200',
    iconNode: <HelpCircle className="h-3 w-3" />,
  },
  {
    value: 'absent',
    label: 'Vắng',
    activeClass: 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200',
    iconNode: <XCircle className="h-3 w-3" />,
  },
]

// ── Session status helpers ──────────────────────────────────────────────

function getSessionStatusLabel(status: RoadmapSession['status']) {
  switch (status) {
    case 'completed': return 'Đã học'
    case 'ongoing': return 'Đang học'
    case 'upcoming': return 'Chờ diễn ra'
    case 'rescheduled': return 'Đổi lịch'
    case 'cancelled': return 'Đã hủy'
    default: return status
  }
}

function getHeaderTheme(status: RoadmapSession['status']) {
  switch (status) {
    case 'completed': return 'bg-emerald-50 border-b-emerald-200'
    case 'ongoing': return 'bg-sky-50 border-b-sky-200'
    case 'upcoming': return 'bg-amber-50/70 border-b-amber-200'
    case 'rescheduled': return 'bg-orange-50/70 border-b-orange-200'
    case 'cancelled': return 'bg-zinc-100/60 border-b-zinc-200'
    default: return 'bg-white border-b-zinc-200'
  }
}

function getParticipationBadge(status: RosterStudent['status']): { label: string; cls: string } | null {
  switch (status) {
    case 'trial': return { label: 'Học thử', cls: 'border-violet-200 bg-violet-50 text-violet-700' }
    case 'new': return { label: 'Mới', cls: 'border-sky-200 bg-sky-50 text-sky-700' }
    default: return null // active → "Chính thức" handled below
  }
}

// Exclude these from attendance list
const INACTIVE_STATUSES: RosterStudent['status'][] = ['dropout', 'session_ended', 'reserve', 'transferred']

// ── Component ───────────────────────────────────────────────────────────

export function ClassesSessionDetailDialog({
  isOpen,
  onClose,
  session: initialSession,
  sessions,
  cls,
  roster,
}: ClassesSessionDetailDialogProps) {
  const [currentSessionId, setCurrentSessionId] = useState(initialSession.id)
  const [activeTab, setActiveTab] = useState('attendance')
  const [studentSearch, setStudentSearch] = useState('')
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<string, AttendanceStatus>>({})
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({})
  const [isBulkFeedbackOpen, setIsBulkFeedbackOpen] = useState(false)

  // Side Panel state (Notes & Logs)
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'logs'>('notes')
  const [noteInput, setNoteInput] = useState('')
  const [sessionNotes, setSessionNotes] = useState<Record<string, { id: string; text: string; author: string; timestamp: string }[]>>({})
  const [sessionLogs, setSessionLogs] = useState<Record<string, { id: string; action: string; operator: string; timestamp: string }[]>>({})

  const session = sessions.find((s) => s.id === currentSessionId) ?? initialSession
  const currentIndex = sessions.findIndex((s) => s.id === currentSessionId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < sessions.length - 1

  const navigateTo = (index: number) => {
    if (index >= 0 && index < sessions.length) {
      setCurrentSessionId(sessions[index].id)
      setStudentSearch('')
    }
  }

  // ── Only active students (exclude nghỉ / hết buổi / bảo lưu / chuyển) ──
  const activeRoster = useMemo(
    () => roster.filter((s) => !INACTIVE_STATUSES.includes(s.status)),
    [roster],
  )

  const filteredRoster = useMemo(() => {
    if (!studentSearch.trim()) return activeRoster
    const q = studentSearch.toLowerCase()
    return activeRoster.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    )
  }, [activeRoster, studentSearch])

  // ── Attendance helpers ──
  const getAttendance = (studentId: string): AttendanceStatus => {
    const key = `${studentId}:${session.id}`
    return attendanceOverrides[key] ?? deriveAttendance(studentId, session.id)
  }

  const setAttendance = (studentId: string, status: AttendanceStatus) => {
    const key = `${studentId}:${session.id}`
    setAttendanceOverrides((prev) => ({ ...prev, [key]: status }))

    // Log the change in the audit trail
    const student = roster.find((s) => s.id === studentId)
    if (!student) return

    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    let statusLabel = ''
    if (status === 'present') statusLabel = 'Có mặt'
    else if (status === 'late') statusLabel = 'Đi trễ'
    else if (status === 'absent') statusLabel = 'Vắng mặt'
    else if (status === 'excused') statusLabel = 'Nghỉ phép'

    const newLog = {
      // eslint-disable-next-line react-hooks/purity
      id: Math.random().toString(),
      action: `Điểm danh học viên ${student.name}: ${statusLabel}`,
      operator: 'Giáo vụ Lan',
      timestamp: timestampStr
    }

    const currentLogs = sessionLogs[session.id] ?? [
      { id: 'l1', action: `Bắt đầu điểm danh cho buổi học số ${session.sessionNumber}.`, operator: 'Hệ thống', timestamp: '17:30 02/06/2026' },
      { id: 'l2', action: `Cập nhật thông tin giảng viên dạy thay.`, operator: 'Giáo vụ Lan', timestamp: '10:15 02/06/2026' },
      { id: 'l3', action: `Tạo lịch học buổi ${session.sessionNumber}.`, operator: 'Hệ thống', timestamp: '08:00 01/06/2026' }
    ]

    setSessionLogs((prev) => ({
      ...prev,
      [session.id]: [newLog, ...currentLogs]
    }))
  }

  // ── Feedback helper ──
  const getFeedback = (studentId: string): string =>
    feedbackMap[studentId] ?? deriveFeedback(studentId, session.id)

  // ── Derived Notes & Logs for current session ──
  const notes = useMemo(() => {
    return sessionNotes[session.id] ?? [
      { id: '1', text: `Buổi học diễn ra bình thường. Sĩ số lớp ổn định.`, author: 'Giáo vụ Lan', timestamp: '10:00 02/06/2026' },
      { id: '2', text: `Đã chuẩn bị đầy đủ giáo cụ học tập trước giờ lên lớp.`, author: 'Giáo viên phụ trách', timestamp: '13:45 02/06/2026' }
    ]
  }, [sessionNotes, session.id])

  const logs = useMemo(() => {
    return sessionLogs[session.id] ?? [
      { id: 'l1', action: `Bắt đầu điểm danh cho buổi học số ${session.sessionNumber}.`, operator: 'Hệ thống', timestamp: '17:30 02/06/2026' },
      { id: 'l2', action: `Cập nhật thông tin giảng viên dạy thay.`, operator: 'Giáo vụ Lan', timestamp: '10:15 02/06/2026' },
      { id: 'l3', action: `Tạo lịch học buổi ${session.sessionNumber}.`, operator: 'Hệ thống', timestamp: '08:00 01/06/2026' }
    ]
  }, [sessionLogs, session.id])

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    const newNote = {
      // eslint-disable-next-line react-hooks/purity
      id: Math.random().toString(),
      text: noteInput.trim(),
      author: 'Giáo vụ Lan',
      timestamp: timestampStr
    }
    
    const currentNotes = sessionNotes[session.id] ?? [
      { id: '1', text: `Buổi học diễn ra bình thường. Sĩ số lớp ổn định.`, author: 'Giáo vụ Lan', timestamp: '10:00 02/06/2026' },
      { id: '2', text: `Đã chuẩn bị đầy đủ giáo cụ học tập trước giờ lên lớp.`, author: 'Giáo viên phụ trách', timestamp: '13:45 02/06/2026' }
    ]

    setSessionNotes((prev) => ({
      ...prev,
      [session.id]: [newNote, ...currentNotes]
    }))
    setNoteInput('')

    const newLog = {
      // eslint-disable-next-line react-hooks/purity
      id: Math.random().toString(),
      action: `Thêm ghi chú tương tác mới: "${newNote.text.slice(0, 30)}..."`,
      operator: 'Giáo vụ Lan',
      timestamp: timestampStr
    }
    const currentLogs = sessionLogs[session.id] ?? [
      { id: 'l1', action: `Bắt đầu điểm danh cho buổi học số ${session.sessionNumber}.`, operator: 'Hệ thống', timestamp: '17:30 02/06/2026' },
      { id: 'l2', action: `Cập nhật thông tin giảng viên dạy thay.`, operator: 'Giáo vụ Lan', timestamp: '10:15 02/06/2026' },
      { id: 'l3', action: `Tạo lịch học buổi ${session.sessionNumber}.`, operator: 'Hệ thống', timestamp: '08:00 01/06/2026' }
    ]
    setSessionLogs((prev) => ({
      ...prev,
      [session.id]: [newLog, ...currentLogs]
    }))
  }

  // ── Stats ──
  const presentCount = activeRoster.filter((s) => getAttendance(s.id) === 'present').length
  const lateCount = activeRoster.filter((s) => getAttendance(s.id) === 'late').length
  const absentCount = activeRoster.filter((s) => getAttendance(s.id) === 'absent').length
  const excusedCount = activeRoster.filter((s) => getAttendance(s.id) === 'excused').length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="grid h-[88vh] max-h-[860px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[92vw] lg:max-w-[1200px] rounded-2xl border bg-white dark:bg-zinc-950 shadow-xl">

        {/* ── Header ─────────────────────────────────────── */}
        <DialogHeader className={`shrink-0 border-b px-6 pr-12 pb-4 pt-5 ${getHeaderTheme(session.status)}`}>
          {/* Navigation */}
          <div className="flex items-center gap-1.5 mb-2">
            <Button variant="ghost" size="sm" disabled={!hasPrev} onClick={() => navigateTo(currentIndex - 1)} className="h-7 rounded-lg text-xs gap-1 px-2">
              <ChevronLeft className="h-3.5 w-3.5" /> Buổi trước
            </Button>
            <span className="text-[10px] font-mono text-muted-foreground px-1">{currentIndex + 1} / {sessions.length}</span>
            <Button variant="ghost" size="sm" disabled={!hasNext} onClick={() => navigateTo(currentIndex + 1)} className="h-7 rounded-lg text-xs gap-1 px-2">
              Buổi sau <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Title & Info */}
          <div className="flex flex-col gap-2.5">
            <DialogTitle className="flex flex-wrap items-center gap-2 text-base font-bold text-foreground">
              <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-0.5 rounded-md font-black">Buổi {session.sessionNumber}</span>
              <span>{session.topic}</span>
              <Badge variant="outline" className={`rounded-full text-[10px] font-bold px-2 py-0.5 ${
                session.status === 'ongoing' ? 'border-sky-300 bg-sky-100 text-sky-800' : getStatusBadgeClass(session.status)
              }`}>
                {getSessionStatusLabel(session.status)}
              </Badge>
            </DialogTitle>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-semibold text-foreground font-mono">{session.date} ({session.startTime}–{session.endTime})</span>
              </span>
              <span className="text-zinc-300">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Phòng: <span className="font-semibold text-foreground">{session.room}</span>
              </span>
              <span className="text-zinc-300">|</span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                GV:
                {session.substituteTeacherName ? (
                  <span className="inline-flex items-center gap-0.5 font-semibold">
                    <span className="line-through text-muted-foreground/50">{session.teacherName}</span>
                    <ArrowRight className="h-2.5 w-2.5 mx-0.5 text-muted-foreground/40" />
                    <span className="text-amber-600 font-bold">{session.substituteTeacherName}</span>
                    <Badge variant="outline" className="text-[8px] px-1 py-0 ml-0.5 border-amber-200 bg-amber-50 text-amber-700 font-bold">Dạy thay</Badge>
                  </span>
                ) : (
                  <span className="font-semibold text-foreground">{session.teacherName}</span>
                )}
              </span>
            </div>

            {/* Metric tiles */}
            <div className="grid grid-cols-4 gap-2.5 mt-1">
              <div className="rounded-xl border border-zinc-200 bg-white p-2.5 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground">Sĩ số</p>
                  <p className="text-sm font-bold font-mono text-foreground">{activeRoster.length}</p>
                </div>
                <Users className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-emerald-600">Có mặt</p>
                  <p className="text-sm font-bold font-mono text-emerald-700">{presentCount + lateCount}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-amber-600">Trễ / Phép</p>
                  <p className="text-sm font-bold font-mono text-amber-700">{lateCount} · {excusedCount}</p>
                </div>
                <AlertCircle className="h-4 w-4 text-amber-400" />
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-2.5 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-red-600">Vắng</p>
                  <p className="text-sm font-bold font-mono text-red-700">{absentCount}</p>
                </div>
                <XCircle className="h-4 w-4 text-red-400" />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-5 pt-3 bg-zinc-50/30 dark:bg-zinc-950/30">
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_320px]">
            
            {/* Left: 70% Content Area */}
            <main className="flex min-h-0 flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
                <TabsList variant="line" className="shrink-0 justify-start border-none p-0 gap-6 h-9 w-full">
                  <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs gap-1.5 focus:outline-none shadow-none border-none">
                    <ClipboardCheck className="h-3.5 w-3.5" /> Điểm danh & Học viên
                  </TabsTrigger>
                  <TabsTrigger value="syllabus" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs gap-1.5 focus:outline-none shadow-none border-none">
                    <BookOpen className="h-3.5 w-3.5" /> Bài học & Chương trình
                  </TabsTrigger>
                  <TabsTrigger value="classInfo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs gap-1.5 focus:outline-none shadow-none border-none">
                    <BookOpenCheck className="h-3.5 w-3.5" /> Lớp học mẹ
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-3">
                  {/* ── Tab 1: Attendance ────────────────────── */}
                  <TabsContent value="attendance" className="m-0 h-full flex flex-col focus-visible:outline-none">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Tìm học viên..." className="pl-8 text-xs rounded-xl h-8" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{filteredRoster.length} học viên</span>
                      <div className="ml-auto">
                        <Button variant="default" size="sm" className="gap-1.5 text-xs h-8 rounded-lg" onClick={() => setIsBulkFeedbackOpen(true)}>
                          <MessageSquarePlus className="h-3.5 w-3.5" />
                          Nhận xét hàng loạt
                        </Button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 border border-zinc-200 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900 dark:border-zinc-800">
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-10">
                            <tr>
                              <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[200px]">Học viên</th>
                              <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[80px]">Phân loại</th>
                              <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[170px]">Điểm danh</th>
                              <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[80px]">BTVN</th>
                              <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400">Nhận xét GV</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                            {filteredRoster.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-10 text-center text-muted-foreground italic">
                                  Không tìm thấy học viên.
                                </td>
                              </tr>
                            ) : (
                              filteredRoster.map((student) => {
                                const att = getAttendance(student.id)
                                const hwLink = deriveHomeworkLink(student.id, session.id)
                                const fb = getFeedback(student.id)
                                const partBadge = getParticipationBadge(student.status)
                                const isExcused = att === 'excused'

                                return (
                                  <tr
                                    key={student.id}
                                    className={cn(
                                      "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors",
                                      isExcused && "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/20"
                                    )}
                                  >
                                    {/* Avatar + Name */}
                                    <td className={cn("py-2.5 px-3", isExcused && "border-l-4 border-l-amber-500 pl-2")}>
                                      <div className="flex items-center gap-2.5">
                                        <div className={cn(
                                          "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                                          getAvatarColor(student.id)
                                        )}>
                                          {getInitials(student.name)}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-semibold text-foreground truncate leading-tight flex items-center gap-1.5">
                                            {student.name}
                                            {isExcused && (
                                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" title="Có đơn xin phép" />
                                            )}
                                          </p>
                                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{student.code}</p>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Label */}
                                    <td className="py-2.5 px-3">
                                      {partBadge ? (
                                        <Badge variant="outline" className={cn("rounded-md text-[9px] font-bold px-1.5 py-0", partBadge.cls)}>
                                          {partBadge.label}
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="rounded-md text-[9px] font-bold px-1.5 py-0 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                                          Chính thức
                                        </Badge>
                                      )}
                                    </td>

                                    {/* Attendance – Có and Trễ only */}
                                    <td className="py-2.5 px-3">
                                      {isExcused ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50 shadow-2xs">
                                          <CalendarX className="h-3 w-3" /> Nghỉ phép
                                        </span>
                                      ) : (
                                        <div className="flex gap-1.5">
                                          {/* Pill Có mặt */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const current = getAttendance(student.id)
                                              if (current === 'present' || current === 'late') {
                                                setAttendance(student.id, 'absent')
                                              } else {
                                                setAttendance(student.id, 'present')
                                              }
                                            }}
                                            className={cn(
                                              "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer shadow-2xs",
                                              (att === 'present' || att === 'late')
                                                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200 dark:shadow-none"
                                                : "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-500 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                                            )}
                                            title="Có mặt"
                                          >
                                            <CheckCircle2 className="h-3 w-3" />
                                            <span>Có</span>
                                          </button>

                                          {/* Pill Đi trễ */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const current = getAttendance(student.id)
                                              if (current === 'late') {
                                                setAttendance(student.id, 'present')
                                              } else {
                                                setAttendance(student.id, 'late')
                                              }
                                            }}
                                            className={cn(
                                              "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer shadow-2xs",
                                              att === 'late'
                                                ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200 dark:shadow-none"
                                                : "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-500 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                                            )}
                                            title="Đi trễ"
                                          >
                                            <AlertCircle className="h-3 w-3" />
                                            <span>Trễ</span>
                                          </button>
                                        </div>
                                      )}
                                    </td>

                                    {/* Homework link */}
                                    <td className="py-2.5 px-3">
                                      {hwLink ? (
                                        <a
                                          href={hwLink}
                                          className="text-primary hover:underline text-[11px] font-medium inline-flex items-center gap-1"
                                          onClick={(e) => e.preventDefault()}
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                          Xem bài
                                        </a>
                                      ) : (
                                        <span className="text-zinc-300 text-[11px]">—</span>
                                      )}
                                    </td>

                                    {/* Feedback (read-only preview) */}
                                    <td className="py-2.5 px-3">
                                      <p className="text-[11px] text-muted-foreground leading-snug truncate max-w-[220px]">{fb}</p>
                                    </td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── Tab 2: Syllabus ──────────────────────── */}
                  <TabsContent value="syllabus" className="m-0 focus-visible:outline-none">
                    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                      <div className="space-y-4">
                        <div className="rounded-xl border border-zinc-200 p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xs">
                          <h4 className="font-bold text-xs text-primary uppercase font-mono tracking-wider flex items-center gap-1.5 mb-2">
                            <BookOpen className="h-4 w-4" /> Nội dung bài học
                          </h4>
                          <h3 className="font-bold text-base text-foreground">{session.topic}</h3>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {session.description || 'Không có mô tả chi tiết.'}
                          </p>
                        </div>

                        <div className="rounded-xl border border-zinc-200 p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xs space-y-3">
                          <h4 className="font-semibold text-xs text-foreground">Cấu trúc bài học dự kiến</h4>
                          {[
                            { n: 1, title: 'Khởi động & Ôn tập (Warm-up)', desc: '15 phút — Phản xạ tiếng Anh, giải đáp thắc mắc bài tập cũ.' },
                            { n: 2, title: 'Kiến thức cốt lõi (Core Concepts)', desc: '45 phút — Từ vựng chuyên đề và cấu trúc ngữ pháp theo giáo trình.' },
                            { n: 3, title: 'Thực hành & Tương tác (Practice)', desc: '30 phút — Hoạt động cặp/nhóm, bài tập viết trực tiếp.' },
                          ].map((item, i) => (
                            <div key={i} className={cn("flex items-start gap-3", i > 0 && "border-t border-zinc-100 dark:border-zinc-800 pt-3")}>
                              <span className="text-[10px] font-bold text-primary bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.n}</span>
                              <div>
                                <p className="text-xs font-bold text-foreground">{item.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-4">
                        <div className="rounded-xl border border-zinc-200 p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xs space-y-3">
                          <h4 className="text-[11px] font-bold text-muted-foreground uppercase font-mono tracking-wider">Khung chương trình</h4>
                          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <BookOpenCheck className="h-3.5 w-3.5 text-primary" />
                            {cls.syllabus || 'Chưa gán'}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1 border-t dark:border-zinc-800 pt-2">
                            <div className="flex justify-between"><span>Môn học:</span><span className="font-semibold text-foreground">{cls.level}</span></div>
                            <div className="flex justify-between"><span>Trình độ:</span><span className="font-semibold text-foreground">{cls.subLevel ?? '—'}</span></div>
                            <div className="flex justify-between"><span>Tiến độ:</span><span className="font-semibold text-foreground">Buổi {session.sessionNumber}/{sessions.length}</span></div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xs space-y-2">
                          <h4 className="text-[11px] font-bold text-muted-foreground uppercase font-mono tracking-wider">Tài liệu buổi học</h4>
                          {session.materials && session.materials.length > 0 ? (
                            session.materials.map((mat, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 text-[11px]">
                                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="font-medium text-foreground truncate flex-1">{mat.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Chưa có tài liệu.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── Tab 3: Class info ────────────────────── */}
                  <TabsContent value="classInfo" className="m-0 focus-visible:outline-none">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-primary uppercase font-mono tracking-wider">Thông tin lớp</h4>
                        <div className="grid gap-4 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-xs">
                          <InfoField label="Tên lớp" value={cls.name} />
                          <InfoField label="Mã lớp" value={cls.code} />
                          <InfoField label="Chi nhánh" value={cls.branch} />
                          <InfoField label="Chương trình" value={`${cls.level} (${cls.subLevel ?? '—'})`} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-primary uppercase font-mono tracking-wider">Giảng dạy</h4>
                        <div className="grid gap-4 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-xs">
                          <InfoField label="Giáo viên chủ nhiệm" value={cls.teacher} supporting={`SĐT: ${cls.teacherPhone}`} />
                          <InfoField label="Lịch cố định" value={cls.schedule} supporting={`Phòng: ${cls.room}`} />
                          <InfoField label="Khai giảng" value={new Date(cls.startDate).toLocaleDateString('vi-VN')} supporting={`Bế giảng: ${new Date(cls.endDate).toLocaleDateString('vi-VN')}`} />
                          <InfoField label="Sĩ số" value={`${cls.enrolledStudents} / ${cls.maxStudents} (${Math.round((cls.enrolledStudents / cls.maxStudents) * 100)}%)`} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </main>

            {/* Right: 30% Notes & Logs Side Panel */}
            <aside className="flex min-h-0 flex-col overflow-hidden border-l dark:border-zinc-800 pl-6">
              <Tabs
                value={activeSideTab}
                onValueChange={(value) => setActiveSideTab(value as 'notes' | 'logs')}
                className="flex min-h-0 flex-1 flex-col"
              >
                <TabsList variant="line" className="shrink-0 w-full border-none p-0 gap-6 h-9 flex justify-start">
                  <TabsTrigger 
                    value="notes" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Tương tác ({notes.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="logs" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Nhật ký ({logs.length})
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content notes */}
                <TabsContent value="notes" className="min-h-0 flex-1 flex flex-col overflow-hidden m-0 pt-3 focus-visible:outline-none">
                  <div className="flex h-full min-h-0 flex-col justify-between">
                    <div className="min-h-0 flex-1 overflow-y-auto space-y-3 pr-1">
                      {notes.map((note) => (
                        <div key={note.id} className="rounded-xl border bg-muted/25 p-3 shadow-xs border-muted dark:border-zinc-800">
                          <p className="text-xs text-foreground leading-relaxed">{note.text}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="font-semibold text-primary">{note.author}</span>
                            <span className="font-mono">{note.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add note text input */}
                    <div className="relative shrink-0 border-none pt-3 mt-3 bg-background">
                      <Textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Ghi chú tương tác..."
                        rows={2}
                        className="min-h-16 resize-none pr-11 text-xs rounded-xl shadow-xs border-muted dark:border-zinc-800 focus-visible:ring-primary"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute bottom-2 right-2 rounded-lg"
                        disabled={!noteInput.trim()}
                        onClick={handleAddNote}
                      >
                        <SendHorizontal className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Content Audit Logs */}
                <TabsContent value="logs" className="min-h-0 flex-1 overflow-y-auto m-0 pt-3 pr-1 focus-visible:outline-none">
                  <div className="relative border-l border-border dark:border-zinc-800 pl-4 ml-2 space-y-4 pt-1">
                    {logs.map((log) => (
                      <div key={log.id} className="relative text-xs">
                        {/* Dot indicator */}
                        <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background dark:ring-zinc-950" />
                        <div className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</div>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{log.action}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Người thực hiện: {log.operator}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </aside>
          </div>
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
      />
    </Dialog>
  )
}
