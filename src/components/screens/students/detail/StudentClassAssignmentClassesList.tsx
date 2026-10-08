'use client'

import React, { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Users,
  CheckCircle,
  BookOpen,
  AlertTriangle,
  AlertCircle,
  Check,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EmptyState, StatusBadge } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import type { GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'
import { generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import { ExpandableSearch } from '@/components/controls'
import type { ClassRecord } from '@/mocks/classRecords'
import {
  isClassSuitable,
  sortClassesWithSuitableFirst,
  getSessionLessonDetails,
} from './studentClassAssignmentHelpers'
import { cn } from '@/lib/utils'

const CLASS_STATUS_LABELS: Record<string, string> = {
  nhap: 'Nháp',
  cho_khai_giang: 'Chờ khai giảng',
  dang_hoc: 'Đang học',
  tam_dung: 'Tạm nghỉ',
  huy: 'Đã kết thúc',
}

interface StudentClassAssignmentClassesListProps {
  classes: ClassRecord[]
  allAvailableClasses: ClassRecord[]
  selectedClassId: string | null
  onSelectClass: (id: string) => void
  startSessionDate: string
  onSelectSession: (clsId: string, sessionDateString: string) => void
  expandedClassIds: Set<string>
  onToggleExpandClass: (id: string) => void
  studentBranch: string
  studentLevel?: string
  activeTab: 'all' | 'dang_hoc' | 'cho_khai_giang'
  onTabChange: (tab: 'all' | 'dang_hoc' | 'cho_khai_giang') => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  internalNotes: string
  onNotesChange: (val: string) => void
  conflictingClasses?: { className: string; dayOfWeek: string; timeSlot: string }[]
}

function getClassSessions(cls: ClassRecord) {
  const clsWithSyllabus = {
    ...cls,
    syllabus:
      cls.syllabus && cls.syllabus !== '—' && cls.syllabus !== ''
        ? cls.syllabus
        : 'Lộ trình chuẩn',
  }
  const allSessions = generateRoadmapSessions(clsWithSyllabus)
  if (allSessions.length === 0) return []

  const activeIndex = allSessions.findIndex(
    (s) => s.status === 'ongoing' || s.status === 'upcoming'
  )
  const startIdx =
    activeIndex === -1
      ? Math.max(0, allSessions.length - 5)
      : Math.max(0, activeIndex - 1)

  return allSessions.slice(startIdx, startIdx + 5)
}

function getDayOfWeekFromDateStr(dateStr: string): string {
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    const dayOfWeek = d.getDay()
    const days = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ]
    return days[dayOfWeek] || ''
  }
  return ''
}

export function StudentClassAssignmentClassesList({
  classes,
  allAvailableClasses,
  selectedClassId,
  onSelectClass,
  startSessionDate,
  onSelectSession,
  expandedClassIds,
  onToggleExpandClass,
  studentBranch,
  studentLevel = '',
  activeTab,
  onTabChange,
  searchQuery,
  onSearchQueryChange,
  internalNotes,
  onNotesChange,
  conflictingClasses = [],
}: StudentClassAssignmentClassesListProps) {
  // Sort classes putting suitable classes at the very top
  const sortedClasses = useMemo(() => {
    return sortClassesWithSuitableFirst(classes, studentBranch, studentLevel)
  }, [classes, studentBranch, studentLevel])

  // Expanded session content state
  const [expandedSessionIds, setExpandedSessionIds] = useState<Set<string>>(
    () => new Set()
  )

  // Note input visibility and draft state (default hidden)
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false)
  const [draftNotes, setDraftNotes] = useState<string>(internalNotes)

  const handleSaveNote = () => {
    onNotesChange(draftNotes.trim())
    setIsNoteExpanded(false)
  }

  const handleCancelNote = () => {
    setDraftNotes(internalNotes)
    setIsNoteExpanded(false)
  }

  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessionIds((prev) => {
      const next = new Set(prev)
      if (next.has(sessionId)) {
        next.delete(sessionId)
      } else {
        next.add(sessionId)
      }
      return next
    })
  }

  // Tab definitions with counts (Bỏ tab Lớp phù hợp per user request)
  const tabDefs = useMemo(() => {
    const allCount = allAvailableClasses.length
    const dangHocCount = allAvailableClasses.filter(
      (c) => c.status === 'dang_hoc'
    ).length
    const choKhaiGiangCount = allAvailableClasses.filter(
      (c) => c.status === 'cho_khai_giang'
    ).length

    return [
      { id: 'all' as const, label: 'Tất cả lớp', count: allCount },
      { id: 'dang_hoc' as const, label: 'Đang học', count: dangHocCount },
      { id: 'cho_khai_giang' as const, label: 'Chờ khai giảng', count: choKhaiGiangCount },
    ]
  }, [allAvailableClasses])

  return (
    <div className="flex flex-col space-y-1.5 flex-1 min-h-0">
      {/* 1. TABS + SEARCH TRÊN CÙNG 1 HÀNG */}
      <div className="flex items-center justify-between gap-2 pb-0.5 flex-wrap">
        {/* Tabs lọc dạng Segmented Control mỏng nhẹ, êm mắt */}
        <div className="inline-flex p-0.5 rounded-lg bg-muted/60 border border-border/40 gap-0.5 shrink-0">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-normal transition-all cursor-pointer select-none whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Ô Tìm kiếm đưa xuống cùng hàng tabs */}
        <ExpandableSearch
          value={searchQuery}
          onValueChange={onSearchQueryChange}
          placeholder="Tìm tên lớp, GV, phòng..."
          inputClassName="h-7 text-xs sm:w-44"
          className="shrink-0"
        />
      </div>

      {/* 2. FLAT CARDS / ACCORDION LIST */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0 pr-0.5">
        {sortedClasses.length === 0 ? (
          <EmptyState
            title="Không tìm thấy lớp học phù hợp"
            description="Thử đổi bộ lọc khối lớp, thứ trong tuần hoặc tìm kiếm bằng từ khóa khác."
            className="py-10 border border-dashed rounded-xl bg-card"
          />
        ) : (
          sortedClasses.map((cls) => {
            const isSuitable = isClassSuitable(cls, studentBranch, studentLevel)
            const isExpanded = expandedClassIds.has(cls.id)
            const isSelected = selectedClassId === cls.id
            const isClassFull = cls.enrolledStudents >= cls.maxStudents
            const isLevelMismatch = Boolean(
              studentLevel &&
              cls.level &&
              !cls.level.toLowerCase().includes(studentLevel.toLowerCase()) &&
              !studentLevel.toLowerCase().includes(cls.level.toLowerCase())
            )
            const sessions = getClassSessions(cls)

            return (
              <section
                key={cls.id}
                className={cn(
                  'rounded-xl border bg-card shadow-2xs overflow-hidden transition-all',
                  isSuitable
                    ? 'border-emerald-300/80 dark:border-emerald-700/60'
                    : 'border-border/70',
                  isSelected
                    ? 'ring-1 ring-primary/40'
                    : 'hover:border-border'
                )}
              >
                {/* Accordion Header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onSelectClass(cls.id)
                    onToggleExpandClass(cls.id)
                  }}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 text-left cursor-pointer transition-colors select-none gap-2',
                    isSelected
                      ? 'bg-primary/5 dark:bg-primary/10'
                      : 'hover:bg-muted/20',
                    isSuitable && !isSelected && 'bg-emerald-500/5'
                  )}
                >
                  {/* Left: Expand icon + Class Code + Badges */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <div className="text-muted-foreground shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </div>

                    {/* Class Code with Hover Popover */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <ClassCodeHoverCell
                        classCode={cls.code}
                        subject={cls.name}
                        level={cls.level}
                        subLevel={cls.subLevel}
                        teacherCode={cls.teacher}
                        schedule={cls.schedule}
                        openInNewTab={true}
                        className="font-normal text-xs text-primary hover:underline"
                      />
                    </div>

                    {/* NHÃN LỚP PHÙ HỢP */}
                    {isSuitable && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-4.5 px-1.5 text-[10.5px] font-normal shrink-0 shadow-2xs',
                          getStatusBadgeClass('lop_phu_hop')
                        )}
                      >
                        Lớp phù hợp
                      </Badge>
                    )}

                    {/* Level Badge */}
                    <Badge
                      variant="outline"
                      className="h-4.5 px-1.5 text-[10.5px] border-border/70 bg-muted/40 text-foreground font-normal shrink-0"
                    >
                      {cls.level}
                    </Badge>
                  </div>

                  {/* Right: Trạng thái lớp + Sĩ số */}
                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <StatusBadge
                      status={cls.status}
                      label={CLASS_STATUS_LABELS[cls.status] || cls.status}
                    />
                    <div className="flex items-center gap-1 font-normal text-[11px] text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className={isClassFull ? 'text-destructive font-normal' : ''}>
                        {cls.enrolledStudents}/{cls.maxStudents} HS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Body: Roadmap Sessions Selection */}
                {isExpanded && (
                  <div className="border-t border-border/50 bg-muted/5 animate-in fade-in slide-in-from-top-1">
                    {/* Cảnh báo trùng lịch với lớp học viên đang học (tinh gọn mỏng nhẹ) */}
                    {isSelected && conflictingClasses.length > 0 && (
                      <div className="mx-2.5 my-1.5 p-1.5 px-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5 font-normal">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>Trùng lịch:</span>
                          {conflictingClasses.map((conflict, idx) => (
                            <span key={idx} className="font-normal text-foreground">
                              {conflict.className} ({conflict.dayOfWeek} • {conflict.timeSlot})
                              {idx < conflictingClasses.length - 1 ? '; ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cảnh báo lệch trình độ */}
                    {isSelected && isLevelMismatch && (
                      <div className="mx-2.5 my-1.5 p-1.5 px-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-1.5 font-normal">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Trình độ lớp ({cls.level}) chưa khớp với trình độ học viên ({studentLevel})</span>
                      </div>
                    )}

                    {/* Cảnh báo đầy sĩ số */}
                    {isSelected && isClassFull && (
                      <div className="mx-2.5 my-1.5 p-1.5 px-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-1.5 font-normal">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Lớp đã đủ hoặc vượt sĩ số tối đa ({cls.enrolledStudents}/{cls.maxStudents} HS)</span>
                      </div>
                    )}

                    {sessions.length === 0 ? (
                      <div className="p-2.5 text-center text-xs text-muted-foreground">
                        Chưa có dữ liệu lộ trình buổi học cho lớp này.
                      </div>
                    ) : (
                      <div className="divide-y divide-border/30">
                        {sessions.map((session) => {
                          const dayName = getDayOfWeekFromDateStr(session.date)
                          const sessionLabel = `${dayName ? `${dayName}, ` : ''}${session.date} (Buổi ${session.sessionNumber}: ${session.topic})`
                          const isSessionSelected =
                            isSelected && startSessionDate.includes(session.date)
                          const sessionId = `${cls.id}-${session.sessionNumber}`
                          const isSessionExpanded = expandedSessionIds.has(sessionId)

                          const matchingConflict =
                            isSelected &&
                            conflictingClasses.find(
                              (c) =>
                                c.dayOfWeek === dayName ||
                                dayName.includes(c.dayOfWeek) ||
                                c.dayOfWeek.includes(dayName)
                            )

                          const lessonDetails = getSessionLessonDetails(
                            session.sessionNumber,
                            session.topic,
                            cls.name
                          )

                          const hoverSessionData: GenericSessionData = {
                            id: sessionId,
                            title: session.topic || `Buổi ${session.sessionNumber}`,
                            lessonSubtitle: `Buổi ${session.sessionNumber}: ${session.topic}`,
                            lessonNumber: session.sessionNumber,
                            classCode: cls.code,
                            className: cls.name,
                            subject: cls.name?.includes('Toán') ? 'Toán' : 'Tiếng Anh',
                            level: cls.level,
                            subLevel: cls.subLevel,
                            schoolRoom: session.room || cls.room || 'Phòng 201',
                            branch: cls.branch || studentBranch || 'RinoEdu',
                            timeSlot: `${session.startTime} - ${session.endTime}`,
                            timeLabel: `${session.startTime} - ${session.endTime}`,
                            date: session.date,
                            teacher: session.teacherName || cls.teacher,
                            teacherName: session.teacherName || cls.teacher,
                            assistantTeacher: session.assistantName || 'Trợ giảng',
                            taName: session.assistantName || 'Trợ giảng',
                            totalStudents: cls.enrolledStudents,
                            capacity: cls.maxStudents,
                            type: 'class_session',
                            typeLabel: 'Buổi học chính thức',
                            status: session.status,
                            lessonContent: [
                              lessonDetails.words ? `Từ vựng: ${lessonDetails.words}` : null,
                              lessonDetails.sentences ? `Mẫu câu: ${lessonDetails.sentences}` : null,
                              lessonDetails.phonics ? `Hoạt động: ${lessonDetails.phonics}` : null,
                            ]
                              .filter(Boolean)
                              .join(' • '),
                          }

                          return (
                            <div
                              key={session.sessionNumber}
                              className="border-b border-border/20 last:border-b-0"
                            >
                              {/* Main Session Row: Compact padding & soft highlight */}
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  onSelectClass(cls.id)
                                  onSelectSession(cls.id, sessionLabel)
                                }}
                                className={cn(
                                  'flex items-center justify-between px-2.5 sm:px-3 py-1.5 text-xs cursor-pointer select-none transition-colors gap-2',
                                  isSessionSelected
                                    ? 'bg-primary/5 dark:bg-primary/10 border-l-2 border-primary'
                                    : 'hover:bg-muted/30'
                                )}
                              >
                                {/* Left: Radio Indicator + Session Info with HoverCard */}
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className={cn(
                                      'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                                      isSessionSelected
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/40 bg-background'
                                    )}
                                  >
                                    {isSessionSelected && (
                                      <CheckCircle className="h-3 w-3" />
                                    )}
                                  </div>
                                  <div
                                    className="min-w-0 flex items-center gap-1.5 flex-wrap"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ClassSessionHoverCard session={hoverSessionData} side="right">
                                      <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                          onSelectClass(cls.id)
                                          onSelectSession(cls.id, sessionLabel)
                                        }}
                                        className={cn(
                                          'font-normal truncate hover:underline hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1',
                                          isSessionSelected ? 'text-foreground font-medium' : 'text-foreground/80'
                                        )}
                                        title="Rê chuột để xem thông tin chi tiết buổi học"
                                      >
                                        <span className="truncate">
                                          Buổi {session.sessionNumber}: {session.topic}
                                        </span>
                                      </span>
                                    </ClassSessionHoverCard>

                                    {/* Cảnh báo trùng lịch ngay tại buổi học đang chọn */}
                                    {matchingConflict && (
                                      <span
                                        className="inline-flex items-center gap-1 text-[10px] font-normal text-amber-700 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-950/70 px-1 py-0.2 rounded border border-amber-300 dark:border-amber-800 shrink-0 select-none"
                                        title={`Buổi học này trùng lịch với lớp ${matchingConflict.className} (${matchingConflict.dayOfWeek} • ${matchingConflict.timeSlot})`}
                                      >
                                        <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                                        <span>Trùng lịch</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Lịch & Thời gian + Icon nội dung */}
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 font-normal">
                                  <span>{dayName ? `${dayName}, ` : ''}{session.date}</span>
                                  <span>•</span>
                                  <span className="tabular-nums">{session.startTime} - {session.endTime}</span>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleSessionExpand(sessionId)
                                    }}
                                    className={cn(
                                      'inline-flex items-center gap-0.5 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 shadow-none ml-1',
                                      isSessionExpanded && 'text-primary'
                                    )}
                                    title={isSessionExpanded ? 'Thu gọn nội dung buổi học' : 'Xem nội dung chi tiết buổi học'}
                                  >
                                    <BookOpen className="h-3 w-3 shrink-0" />
                                    {isSessionExpanded ? (
                                      <ChevronUp className="h-3 w-3 shrink-0" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 shrink-0" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Khung nội dung chi tiết bài học khi mở rộng */}
                              {isSessionExpanded && (
                                <div className="px-3 py-2 bg-muted/15 border-t border-border/30 text-[11px] space-y-1.5 animate-in fade-in slide-in-from-top-1">
                                  {/* Chủ đề bài học */}
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span className="font-medium text-foreground text-xs">
                                      Chủ đề: {lessonDetails.topic}
                                    </span>
                                  </div>

                                  {/* Chi tiết nội dung: Từ vựng, Mẫu câu, Ngữ âm / Hoạt động */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5 text-[11.5px] leading-relaxed">
                                    {lessonDetails.words && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-muted-foreground shrink-0 font-normal">• Từ vựng:</span>
                                        <span className="text-foreground">{lessonDetails.words}</span>
                                      </div>
                                    )}
                                    {lessonDetails.sentences && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-muted-foreground shrink-0 font-normal">• Mẫu câu:</span>
                                        <span className="text-foreground italic">{lessonDetails.sentences}</span>
                                      </div>
                                    )}
                                    {lessonDetails.phonics && (
                                      <div className="flex items-start gap-1.5 sm:col-span-2">
                                        <span className="text-muted-foreground shrink-0 font-normal">• Ngữ âm / Hoạt động:</span>
                                        <span className="text-foreground">{lessonDetails.phonics}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })
        )}
      </div>

      {/* 3. GHI CHÚ XẾP LỚP NỘI BỘ */}
      <div className="pt-1 shrink-0">
        {!isNoteExpanded && !internalNotes.trim() ? (
          <div>
            <button
              type="button"
              onClick={() => {
                setDraftNotes('')
                setIsNoteExpanded(true)
              }}
              className="text-xs font-normal text-primary hover:underline hover:text-primary/80 transition-colors cursor-pointer select-none p-0 bg-transparent border-0"
            >
              + Thêm ghi chú
            </button>
          </div>
        ) : !isNoteExpanded && internalNotes.trim() ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDraftNotes(internalNotes)
                setIsNoteExpanded(true)
              }}
              className="text-xs font-normal text-primary hover:underline hover:text-primary/80 transition-colors cursor-pointer select-none p-0 bg-transparent border-0 text-left truncate max-w-full"
              title="Click để chỉnh sửa ghi chú"
            >
              <span>Ghi chú: {internalNotes}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNotesChange('')
                setDraftNotes('')
              }}
              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer p-0.5 rounded shrink-0"
              title="Xóa ghi chú"
              aria-label="Xóa ghi chú"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 w-full animate-in fade-in duration-150">
            <textarea
              autoFocus
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancelNote()
                } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  handleSaveNote()
                }
              }}
              placeholder="Nhập ghi chú xếp lớp nội bộ (yêu cầu của phụ huynh, lưu ý cho giáo viên, thỏa thuận đặc biệt...)"
              rows={2}
              className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[44px] resize-y shadow-2xs transition-colors"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleSaveNote}
                title="Lưu ghi chú"
                aria-label="Lưu ghi chú"
                className="flex h-7 w-7 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCancelNote}
                title="Hủy"
                aria-label="Hủy"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
