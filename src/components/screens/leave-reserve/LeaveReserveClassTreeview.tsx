'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Users,
  BookOpen,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { StudentEnrolledClassTree, StudentClassSession } from './leaveReserveTypes'
import { ClassCodeHoverCell } from '../care/ClassCodeHoverCell'
import { ClassSessionHoverCard } from '../calendar/ClassSessionHoverCard'
import { cn } from '@/lib/utils'

interface LeaveReserveClassTreeviewProps {
  classTrees: StudentEnrolledClassTree[]
  selectedSessionIds: Set<string>
  onToggleSession: (session: StudentClassSession) => void
  onToggleClassAll?: (classCode: string) => void
}

export function LeaveReserveClassTreeview({
  classTrees,
  selectedSessionIds,
  onToggleSession,
}: LeaveReserveClassTreeviewProps) {
  // By default all classes are expanded. We track explicitly collapsed classes without needing an effect.
  const [collapsedClasses, setCollapsedClasses] = useState<Set<string>>(new Set())

  // Track sessions expanded to show lesson topic and content inline (Ấn icon mở nội dung buổi học)
  const [expandedSessionIds, setExpandedSessionIds] = useState<Set<string>>(new Set())

  const toggleExpand = (classCode: string) => {
    setCollapsedClasses((prev) => {
      const next = new Set(prev)
      if (next.has(classCode)) {
        next.delete(classCode)
      } else {
        next.add(classCode)
      }
      return next
    })
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

  const hasOmoClass = classTrees.some((c) => c.isOmo)

  return (
    <div className="space-y-2.5 w-full">
      {/* 1. OMO Warning Banner (nếu có lớp OMO) */}
      {hasOmoClass && (
        <div className="rounded-lg border border-rose-300/80 bg-rose-50/70 dark:bg-rose-950/30 dark:border-rose-900/60 p-2.5 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2 shadow-2xs font-normal">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-medium text-rose-900 dark:text-rose-100">Lưu ý: </span>
            Đối với chương trình OMO thì phải tạo 2 phiếu nghỉ riêng cho lớp học với GV tại trung tâm & lớp học với GV online.
          </div>
        </div>
      )}

      {/* 2. Treeview List of Enrolled Classes */}
      <div className="space-y-2">
        {classTrees.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed font-normal">
            Học viên hiện chưa được xếp vào lớp học nào.
          </div>
        ) : (
          classTrees.map((tree) => {
            const isExpanded = !collapsedClasses.has(tree.classCode)
            const selectedInThisClass = tree.sessions.filter(
              (s) => !s.alreadyRequested && selectedSessionIds.has(s.id)
            )
            const hasSelection = selectedInThisClass.length > 0

            return (
              <section
                key={tree.classCode}
                className={cn(
                  'rounded-xl border transition-all overflow-hidden bg-card',
                  hasSelection
                    ? 'border-sky-300/90 dark:border-sky-800 shadow-2xs'
                    : 'border-border/80'
                )}
              >
                {/* Class Accordion Header - Chevron + Mã lớp (Hover popover) + Level + Đã chọn + Sĩ số */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(tree.classCode)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors cursor-pointer select-none',
                    isExpanded ? 'bg-muted/15' : 'hover:bg-muted/15'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="text-muted-foreground shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      {/* Mã lớp dạng text link kèm HoverCard ClassCodeHoverCell chuẩn hệ thống */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <ClassCodeHoverCell
                          classCode={tree.classCode}
                          subject={tree.className.includes('Toán') ? 'Toán tư duy' : 'Tiếng Anh'}
                          level={tree.type}
                          teacherCode={tree.teacherName || 'GV Phụ trách'}
                          schedule={tree.scheduleText || 'T2/4/6 18:00–19:30'}
                          openInNewTab={true}
                        />
                      </div>

                      {/* Level / Loại lớp badge */}
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-xs border-amber-300/80 bg-amber-500/10 text-amber-800 dark:text-amber-400 font-medium"
                      >
                        {tree.type}
                      </Badge>

                      {/* Badge số buổi đã chọn trong lớp */}
                      {hasSelection && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-2 text-xs bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-medium border border-sky-300/60"
                        >
                          Đã chọn: {selectedInThisClass.length} buổi
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Sĩ số kèm số buổi: 10/15 HS (4 buổi) */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 pl-2">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium text-xs">
                      {tree.enrolledStudents}/{tree.maxStudents} HS ({tree.sessions.length} buổi)
                    </span>
                  </div>
                </div>

                {/* Danh sách buổi học */}
                {isExpanded && (
                  <div className="border-t border-border/70 divide-y divide-border/60 bg-background">
                    {tree.sessions.map((session) => {
                      const isChecked = selectedSessionIds.has(session.id)
                      const isAlreadyRequested = Boolean(session.alreadyRequested)
                      const isSessionExpanded = expandedSessionIds.has(session.id)
                      const timePart = session.time ? session.time.split('-')[0].trim() : '17:30'
                      const isMath = tree.className.toLowerCase().includes('toán') || session.classCode.toLowerCase().includes('toan')

                      return (
                        <div key={session.id} className="transition-colors">
                          {/* Dòng ca học chính */}
                          <div
                            className={cn(
                              'flex w-full items-center justify-between px-3 py-2.5 text-left select-none text-xs transition-colors',
                              isAlreadyRequested
                                ? 'bg-muted/30 opacity-70 cursor-not-allowed'
                                : isChecked
                                ? 'bg-sky-50/70 dark:bg-sky-950/30 cursor-pointer'
                                : 'hover:bg-muted/30 cursor-pointer'
                            )}
                            onClick={() => {
                              if (!isAlreadyRequested) {
                                onToggleSession(session)
                              }
                            }}
                          >
                            {/* Đầu dòng: Checkbox + Tên buổi kèm HoverCard xem nhanh thông tin buổi */}
                            <div className="flex items-center gap-2.5 min-w-0 mr-3">
                              <Checkbox
                                checked={isAlreadyRequested ? false : isChecked}
                                disabled={isAlreadyRequested}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={() => {
                                  if (!isAlreadyRequested) {
                                    onToggleSession(session)
                                  }
                                }}
                                className={cn(
                                  'h-4 w-4 shrink-0',
                                  isAlreadyRequested && 'opacity-40 cursor-not-allowed'
                                )}
                              />

                              {/* Hover vào tên buổi học gọi Popover ClassSessionHoverCard */}
                              <div onClick={(e) => e.stopPropagation()} className="min-w-0">
                                <ClassSessionHoverCard
                                  session={{
                                    id: session.id,
                                    title: session.topic || session.sessionName,
                                    lessonSubtitle: session.sessionName,
                                    classCode: tree.classCode,
                                    className: tree.className,
                                    kctName: tree.className,
                                    subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
                                    level: tree.type,
                                    schoolRoom: session.room || tree.room || 'Phòng 301',
                                    branch: 'RinoEdu Linh Đàm',
                                    timeSlot: `${timePart} (90p)`,
                                    timeLabel: timePart,
                                    date: session.date,
                                    teacher: session.teacherName || tree.teacherName || 'Cô Thanh Mai',
                                    teacherName: session.teacherName || tree.teacherName || 'Cô Thanh Mai',
                                    assistantTeacher: 'Mr. Alex',
                                    taName: 'Mr. Alex',
                                    totalStudents: tree.enrolledStudents || 9,
                                    capacity: tree.maxStudents || 15,
                                    type: 'class_session',
                                    typeLabel: isMath ? 'Lớp Toán tư duy' : 'Lớp tiếng Anh',
                                    lessonContent: session.lessonContent
                                      ? [
                                          session.lessonContent.words
                                            ? (isMath ? `Khái niệm: ${session.lessonContent.words}` : `Từ vựng: ${session.lessonContent.words}`)
                                            : null,
                                          session.lessonContent.sentences
                                            ? (isMath ? `Dạng bài: ${session.lessonContent.sentences}` : `Mẫu câu: ${session.lessonContent.sentences}`)
                                            : null,
                                          session.lessonContent.phonics
                                            ? (isMath ? `Hoạt động: ${session.lessonContent.phonics}` : `Ngữ âm: ${session.lessonContent.phonics}`)
                                            : null,
                                        ]
                                          .filter(Boolean)
                                          .join(' • ')
                                      : (session.topic ? `Nội dung: ${session.topic}` : 'Nội dung: Ôn tập và thực hành theo lộ trình khóa học'),
                                  }}
                                  side="right"
                                >
                                  <button
                                    type="button"
                                    className={cn(
                                      'inline-flex items-center gap-1 text-xs font-semibold hover:underline transition-colors cursor-pointer text-left truncate',
                                      isChecked
                                        ? 'text-sky-900 dark:text-sky-100 font-bold'
                                        : 'text-foreground hover:text-sky-600',
                                      isAlreadyRequested && 'line-through text-muted-foreground'
                                    )}
                                    title="Rê chuột để xem thông tin chi tiết buổi học"
                                  >
                                    <span className="truncate">{session.sessionName}</span>
                                    <ExternalLink className="h-3 w-3 opacity-60 hover:opacity-100 shrink-0" />
                                  </button>
                                </ClassSessionHoverCard>
                              </div>

                              {/* Báo nghỉ (mã): Đưa vào giữa dòng, dạng textlink */}
                              {isAlreadyRequested && (
                                <div onClick={(e) => e.stopPropagation()} className="shrink-0 ml-1">
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                      toast.info(`Buổi học đã có đơn báo nghỉ: ${session.existingRequestCode}`)
                                    }}
                                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-normal whitespace-nowrap"
                                    title={`Xem đơn nghỉ phép ${session.existingRequestCode}`}
                                  >
                                    Báo nghỉ ({session.existingRequestCode})
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Cuối dòng: Thứ, Ngày · Giờ + Nút xem nội dung (BookOpen) + Nút Chevron */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="text-xs text-muted-foreground text-right mr-1">
                                <span className={cn(isChecked ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                                  {session.dayOfWeek}, {session.date.split('-').reverse().join('/')}
                                </span>
                                <span className="mx-1 opacity-50">&middot;</span>
                                <span className="font-mono font-medium text-sky-700 dark:text-sky-300">
                                  {timePart}
                                </span>
                              </div>

                              {/* Nút BookOpen: Click để mở nội dung buổi học */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSessionExpand(session.id)
                                }}
                                className={cn(
                                  'p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center rounded-sm hover:bg-muted/50',
                                  isSessionExpanded && 'text-sky-600 dark:text-sky-400'
                                )}
                                title={isSessionExpanded ? 'Thu gọn nội dung buổi học' : 'Xem nội dung chi tiết buổi học'}
                              >
                                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                              </button>

                              {/* Nút Chevron: Click để mở rộng/thu gọn nội dung */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSessionExpand(session.id)
                                }}
                                className={cn(
                                  'p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center rounded-sm hover:bg-muted/50',
                                  isSessionExpanded && 'text-sky-600 dark:text-sky-400'
                                )}
                                title={isSessionExpanded ? 'Thu gọn nội dung buổi học' : 'Mở rộng xem nội dung buổi học'}
                              >
                                {isSessionExpanded ? (
                                  <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Khung nội dung chi tiết buổi học khi mở rộng (Chuẩn screenshot 4) */}
                          {isSessionExpanded && (
                            <div className="px-4 py-3 bg-muted/20 dark:bg-muted/10 border-t border-border/50 text-xs space-y-2 animate-in fade-in slide-in-from-top-1">
                              {/* Chủ đề bài học */}
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                                <span className="font-semibold text-foreground text-xs">
                                  Chủ đề: {session.topic || session.sessionName}
                                </span>
                              </div>

                              {/* Chi tiết nội dung: Từ vựng/khái niệm, mẫu câu/dạng bài, phonics/hoạt động */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5 text-[11.5px] leading-relaxed">
                                {session.lessonContent?.words && (
                                  <div className="flex items-start gap-1.5">
                                    <span className="text-muted-foreground shrink-0 font-medium">
                                      • {isMath ? 'Khái niệm / Từ khóa:' : 'Từ vựng:'}
                                    </span>
                                    <span className="text-foreground">{session.lessonContent.words}</span>
                                  </div>
                                )}
                                {session.lessonContent?.sentences && (
                                  <div className="flex items-start gap-1.5">
                                    <span className="text-muted-foreground shrink-0 font-medium">
                                      • {isMath ? 'Dạng bài / Mẫu câu:' : 'Mẫu câu:'}
                                    </span>
                                    <span className="text-foreground italic">{session.lessonContent.sentences}</span>
                                  </div>
                                )}
                                {session.lessonContent?.phonics && (
                                  <div className="flex items-start gap-1.5 sm:col-span-2">
                                    <span className="text-muted-foreground shrink-0 font-medium">
                                      • {isMath ? 'Hoạt động tư duy:' : 'Ngữ âm / Hoạt động:'}
                                    </span>
                                    <span className="text-foreground">{session.lessonContent.phonics}</span>
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
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}
