'use client'

import { useMemo, type ReactNode } from 'react'
import { BookOpen, Clock, Info, MapPin, Users, AlertTriangle, ExternalLink, FolderGit2, GraduationCap, CheckCircle2 } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AppAvatar } from '@/components/shared'
import { StaffProfilePopover, getStaffPersonnel } from './StaffProfilePopover'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { GenericSessionData } from './SessionHoverCard'

interface ClassSessionHoverCardProps {
  session: GenericSessionData
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  hideRoom?: boolean
  hideStudents?: boolean
  hideBranch?: boolean
}

export function ClassSessionHoverCard({
  session,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
  hideRoom = false,
  hideStudents = false,
  hideBranch = false,
}: ClassSessionHoverCardProps) {
  const isCancelled = session.status === 'cancelled'
  const isDigi = session.type === 'digi_session'

  // Standardize Lesson Title (Tên Bài học trên đầu, tối đa 2 dòng)
  const lessonTitle = isDigi
    ? 'Ca tự học Digi tại trạm'
    : session.title && session.className && session.title.trim().toLowerCase() !== session.className.trim().toLowerCase()
    ? session.title
    : session.lessonSubtitle ||
      (typeof session.lessonContent === 'string' && session.lessonContent ? session.lessonContent : '') ||
      session.subtitle ||
      session.title ||
      session.className ||
      'Buổi học'

  // Standardize Class Code
  const classCode = session.classCode

  // Math vs other subject detection
  const isMath = Boolean(
    session.subject?.toLowerCase().includes('toán') ||
    session.subject?.toLowerCase().includes('math') ||
    session.className?.toLowerCase().includes('toán') ||
    session.classCode?.toLowerCase().includes('toan')
  )

  // Standardize Level Display (Math: Lớp 1, 2, 3...; English/Other: Trình độ • Trình độ phụ)
  const levelDisplay = useMemo(() => {
    if (isMath) {
      const matchNum = (session.level || session.className || '').match(/\d+/)
      if (matchNum) {
        return `Lớp ${matchNum[0]}`
      }
      return session.level || 'Lớp 1'
    }

    const mainLevel = session.level || 'Pre-K'
    let subLevel = session.subLevel
    if (!subLevel && classCode) {
      const parts = classCode.split('_')
      if (parts.length > 1 && parts[0].length <= 4) {
        subLevel = parts[0]
      }
    }

    if (subLevel && subLevel.toLowerCase() !== mainLevel.toLowerCase()) {
      return `${mainLevel} • ${subLevel}`
    }

    return mainLevel
  }, [isMath, session.level, session.className, session.subLevel, classCode])

  // Session Type Detection (Project / Kiểm tra / Buổi thường)
  const isProjectSession = Boolean(
    session.type === 'project' ||
      session.type === 'project_session' ||
      session.typeLabel?.toLowerCase().includes('project') ||
      session.typeLabel?.toLowerCase().includes('dự án') ||
      session.title?.toLowerCase().includes('project') ||
      session.title?.toLowerCase().includes('dự án') ||
      session.lessonSubtitle?.toLowerCase().includes('project') ||
      session.lessonSubtitle?.toLowerCase().includes('dự án')
  )

  const isTestSession = Boolean(
    session.type === 'test_session' ||
      session.type === 'placement_test' ||
      session.type === 'test' ||
      session.typeLabel?.toLowerCase().includes('kiểm tra') ||
      session.typeLabel?.toLowerCase().includes('test') ||
      session.title?.toLowerCase().includes('kiểm tra') ||
      session.title?.toLowerCase().includes('unit test') ||
      session.lessonSubtitle?.toLowerCase().includes('kiểm tra') ||
      session.lessonSubtitle?.toLowerCase().includes('unit test')
  )

  const kctName = session.kctName
  const room = hideRoom ? undefined : (session.schoolRoom || session.roomName || session.location)
  const branch = hideBranch ? undefined : session.branch

  // Time & Duration
  const timeDisplay = session.timeSlot
    ? session.timeSlot
    : session.timeLabel && session.endTimeLabel
    ? `${session.timeLabel} - ${session.endTimeLabel}`
    : session.timeLabel || 'N/A'

  // Teaching Staff
  const primaryTeacher = session.teacher || session.teacherName || session.organizer || session.personLabel
  const subTeacher = session.substituteTeacher
  const taTeacher = session.assistantTeacher || session.taName
  const subAssistant = session.assistantSubstitute || session.taSubstituteName

  // Headcount calculation (Đưa sĩ số lên trên cùng, góc phải, nếu có thêm thì hiển thị + phía sau, sĩ số ở trước +)
  const baseStudents = isDigi
    ? session.totalStudents
    : session.totalStudents !== undefined
    ? session.totalStudents
    : session.studentCount !== undefined
    ? session.studentCount
    : session.officialStudents
  const extraStudents = ((session.trialStudents || 0) + (session.makeUpStudents || 0)) || 0
  const hasStudents = baseStudents !== undefined

  // Standardize Lesson Content (Nội dung bài học)
  const lessonContentDisplay = useMemo(() => {
    if (typeof session.lessonContent === 'string' && session.lessonContent.trim()) {
      return session.lessonContent.trim()
    }
    if (typeof session.lessonContent === 'object' && session.lessonContent) {
      const c = session.lessonContent
      if (c.rawText && c.rawText.trim()) return c.rawText.trim()
      const parts = [c.sentences, c.words, c.phonics].filter(Boolean)
      if (parts.length > 0) return parts.join(' • ')
    }
    if (session.subtitle && session.subtitle.trim().toLowerCase() !== lessonTitle.trim().toLowerCase()) {
      return session.subtitle.trim()
    }
    if (session.lessonSubtitle && session.lessonSubtitle.trim().toLowerCase() !== lessonTitle.trim().toLowerCase()) {
      return session.lessonSubtitle.trim()
    }
    if (session.note && session.note.trim()) {
      return session.note.trim()
    }
    return 'Luyện tập kỹ năng và hoàn thành bài tập trên lớp theo kế hoạch đào tạo.'
  }, [session, lessonTitle])

  // Location formatting: avoid repeating branch if room already contains branch
  let locationDisplay = ''
  if (room && branch) {
    if (room.toLowerCase().includes(branch.toLowerCase()) || branch.toLowerCase().includes(room.toLowerCase())) {
      locationDisplay = room
    } else {
      locationDisplay = `${room} • ${branch}`
    }
  } else {
    locationDisplay = room || branch || ''
  }

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align="start"
        sideOffset={8}
        className="w-[290px] sm:w-[320px] p-0 overflow-hidden rounded-xl shadow-lg border border-border/80 bg-popover z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Top Header Ribbon */}
        <div
          className={cn(
            'px-3 py-1.5 flex items-center justify-between border-b text-xs font-semibold gap-2',
            isCancelled
              ? 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              : session.isOpeningDay
              ? 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60'
              : subTeacher
              ? 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60'
              : session.dateBucket === 'past'
              ? 'bg-zinc-100/80 text-zinc-700 border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300'
              : session.dateBucket === 'today'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
              : 'bg-card text-foreground border-border dark:bg-zinc-900'
          )}
        >
          {/* Time & Slot */}
          <div className="flex items-center gap-1.5 font-bold shrink-0">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{timeDisplay}</span>
          </div>

          {/* Sĩ số lên trên cùng, góc phải; Nếu có thêm thì hiển thị + phía sau, sĩ số ở trước + */}
          <div className="flex items-center gap-1.5 shrink-0 min-w-0">
            {hasStudents && !hideStudents && (
              <div
                className="flex items-center gap-1 text-xs font-medium"
                title={
                  extraStudents > 0
                    ? `${baseStudents} học viên (+${extraStudents} học viên mới / học thử / học bù)`
                    : `${baseStudents} học viên`
                }
              >
                {session.attendedStudents !== undefined && (
                  <span title="Buổi học đã hoàn thành điểm danh" className="inline-flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </span>
                )}
                <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-foreground">
                  <strong
                    className={cn(
                      'font-bold',
                      isDigi && session.capacity && (session.totalStudents || 0) >= session.capacity
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-foreground'
                    )}
                  >
                    {isDigi
                      ? `${session.totalStudents}/${session.capacity || 10}`
                      : session.attendedStudents !== undefined
                      ? `${session.attendedStudents}/${baseStudents}`
                      : session.capacity !== undefined
                      ? `${baseStudents}/${session.capacity}`
                      : baseStudents}
                  </strong>
                  {extraStudents > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-bold ml-1">
                      (+{extraStudents})
                    </span>
                  )}
                  <span className="ml-0.5 text-xs text-muted-foreground font-semibold">HV</span>
                </span>
                {isDigi && session.capacity && (session.totalStudents || 0) >= session.capacity && (
                  <span className="text-rose-600 dark:text-rose-400 font-bold text-xs ml-0.5 flex items-center gap-0.5">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    Hết
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 space-y-2 text-xs">
          {/* 1. Tên Bài học trên đầu, tối đa 2 dòng */}
          <div>
            <h4
              className="text-xs sm:text-[13px] font-bold text-foreground leading-snug line-clamp-2"
              title={lessonTitle}
            >
              {lessonTitle}
            </h4>
          </div>

          {/* 2. Mã lớp ở dưới (Textlink mở tab mới) + Nhãn loại buổi (Project / Kiểm tra) */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {classCode && !isDigi && (
              <a
                href={`/app/classes?id=${encodeURIComponent(classCode)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 font-mono text-xs font-normal text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:underline group/classlink shrink-0 cursor-pointer"
                title={`Mở chi tiết lớp học ${classCode} trong tab mới`}
              >
                <span>{classCode}</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover/classlink:opacity-100 transition-opacity ml-0.5" />
              </a>
            )}

            {session.subject && (
              <span className="text-xs font-normal text-muted-foreground">
                • {session.subject}
              </span>
            )}

            {isProjectSession && (
              <span
                className={cn(
                  'inline-flex items-center rounded border px-1.5 py-0.2 text-xs font-bold shrink-0',
                  getStatusBadgeClass('project')
                )}
              >
                Project
              </span>
            )}

            {!isProjectSession && isTestSession && (
              <span
                className={cn(
                  'inline-flex items-center rounded border px-1.5 py-0.2 text-xs font-bold shrink-0',
                  getStatusBadgeClass('test_session')
                )}
              >
                Kiểm tra
              </span>
            )}
          </div>

          {/* 3. KCT & Trình độ */}
          {!isDigi && (
            <div className="space-y-1.5 text-xs text-muted-foreground">
              {/* 1. KCT (Khung chương trình) */}
              <div className="flex items-center gap-1.5 truncate" title={`Khung chương trình: ${kctName || session.className || 'Khung chương trình chuẩn'}`}>
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
                <div className="truncate flex items-center gap-1 min-w-0">
                  <span className="text-muted-foreground font-medium shrink-0">KCT:</span>
                  <a
                    href={`/app/classes?id=${encodeURIComponent(classCode || '')}&tab=syllabus`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5 truncate group/kctlink cursor-pointer"
                    title={`Mở chi tiết Khung chương trình ${kctName || session.className || 'chuẩn'} trong tab mới`}
                  >
                    <span className="truncate">{kctName || session.className || 'Khung chương trình chuẩn'}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover/kctlink:opacity-100 transition-opacity ml-0.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* 2. Trình độ (Toán: Lớp 1, 2, 3...; Tiếng Anh: Trình độ • Trình độ phụ) */}
              <div className="flex items-center gap-1.5 truncate" title={`Trình độ: ${levelDisplay}`}>
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                <span className="truncate">
                  <span className="text-muted-foreground font-medium">Trình độ: </span>
                  <span className="text-foreground font-semibold">{levelDisplay}</span>
                </span>
              </div>
            </div>
          )}

          {/* 4. Địa điểm & Nhân sự: Cơ sở, phòng + Tách dòng GV & Trợ giảng */}
          <div className="border-t border-border/40 pt-1.5 space-y-1.5 text-xs">
            {locationDisplay && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 truncate" title={locationDisplay}>
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                <span className="truncate text-foreground/90 font-medium">{locationDisplay}</span>
              </div>
            )}

            {isDigi ? (
              /* Ca tự học Digi */
              <div className="flex items-center gap-1.5 text-xs min-w-0">
                <span className="text-muted-foreground font-medium shrink-0">Trực:</span>
                {subAssistant ? (
                  <div className="flex items-center gap-1 min-w-0 flex-wrap">
                    {/* Người cũ bị gạch ngang */}
                    <StaffProfilePopover person={getStaffPersonnel(taTeacher || session.teacher || 'Thu Hà', 'Trợ giảng')}>
                      <div className="flex items-center gap-1 min-w-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                        <AppAvatar name={taTeacher || session.teacher || 'Thu Hà'} size="xs" />
                        <span className="line-through text-muted-foreground font-normal truncate max-w-[85px]">
                          {taTeacher || session.teacher || 'Thu Hà'}
                        </span>
                      </div>
                    </StaffProfilePopover>
                    <span className="text-muted-foreground/60 text-xs shrink-0 font-medium">→</span>
                    {/* Người trực thay */}
                    <StaffProfilePopover person={getStaffPersonnel(subAssistant, 'Trợ giảng trực thay', true)}>
                      <div className="flex items-center gap-1 min-w-0 cursor-pointer hover:opacity-85 transition-opacity">
                        <AppAvatar name={subAssistant} size="xs" isSubstitute={true} />
                        <span className="font-semibold text-foreground truncate max-w-[95px]">
                          {subAssistant}
                        </span>
                        <span className="text-[9.5px] px-1 py-0.2 rounded font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                          Trực thay
                        </span>
                      </div>
                    </StaffProfilePopover>
                  </div>
                ) : (
                  <StaffProfilePopover person={getStaffPersonnel(taTeacher || session.teacher || 'Thu Hà', 'Trợ giảng')}>
                    <div className="flex items-center gap-1.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity">
                      <AppAvatar name={taTeacher || session.teacher || 'Thu Hà'} size="xs" />
                      <span className="font-semibold text-foreground truncate max-w-[150px]">
                        {taTeacher || session.teacher || 'Thu Hà'}
                      </span>
                    </div>
                  </StaffProfilePopover>
                )}
              </div>
            ) : (
              <>
                {/* Dòng 1: Giáo viên (GV) */}
                <div className="flex items-center gap-1.5 text-xs min-w-0">
                  <span className="text-muted-foreground font-medium shrink-0">GV:</span>
                  {!primaryTeacher || primaryTeacher === 'Chưa gán' ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium text-xs">Chưa gán</span>
                  ) : subTeacher ? (
                    /* Có dạy thay: Gạch người cũ + Hiển thị người mới */
                    <div className="flex items-center gap-1 min-w-0 flex-wrap">
                      <StaffProfilePopover person={getStaffPersonnel(primaryTeacher, 'Giáo viên Tiếng Anh')}>
                        <div
                          className="flex items-center gap-1 min-w-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                          title={`Giáo viên phân công: ${primaryTeacher}`}
                        >
                          <AppAvatar name={primaryTeacher} size="xs" />
                          <span className="line-through text-muted-foreground font-normal truncate max-w-[85px]">
                            {primaryTeacher}
                          </span>
                        </div>
                      </StaffProfilePopover>
                      <span className="text-muted-foreground/60 text-xs shrink-0 font-medium">→</span>
                      <StaffProfilePopover person={getStaffPersonnel(subTeacher, 'Giáo viên dạy thay', true)}>
                        <div
                          className="flex items-center gap-1 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
                          title={`Dạy thay: ${subTeacher}`}
                        >
                          <AppAvatar name={subTeacher} size="xs" isSubstitute={true} />
                          <span className="font-semibold text-foreground truncate max-w-[95px]">
                            {subTeacher}
                          </span>
                          <span className="text-[9.5px] px-1 py-0.2 rounded font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                            Dạy thay
                          </span>
                        </div>
                      </StaffProfilePopover>
                    </div>
                  ) : (
                    /* Giáo viên chính bình thường */
                    <StaffProfilePopover person={getStaffPersonnel(primaryTeacher, 'Giáo viên Tiếng Anh')}>
                      <div className="flex items-center gap-1.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity">
                        <AppAvatar name={primaryTeacher} size="xs" />
                        <span className="font-semibold text-foreground truncate max-w-[150px]" title={primaryTeacher}>
                          {primaryTeacher}
                        </span>
                      </div>
                    </StaffProfilePopover>
                  )}
                </div>

                {/* Dòng 2: Trợ giảng (TG) - Tách dòng riêng */}
                {taTeacher && (
                  <div className="flex items-center gap-1.5 text-xs min-w-0">
                    <span className="text-muted-foreground font-medium shrink-0">TG:</span>
                    {subAssistant ? (
                      /* Có trợ giảng thay: Gạch người cũ + Hiển thị người mới */
                      <div className="flex items-center gap-1 min-w-0 flex-wrap">
                        <StaffProfilePopover person={getStaffPersonnel(taTeacher, 'Trợ giảng')}>
                          <div
                            className="flex items-center gap-1 min-w-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            title={`Trợ giảng phân công: ${taTeacher}`}
                          >
                            <AppAvatar name={taTeacher} size="xs" />
                            <span className="line-through text-muted-foreground font-normal truncate max-w-[85px]">
                              {taTeacher}
                            </span>
                          </div>
                        </StaffProfilePopover>
                        <span className="text-muted-foreground/60 text-xs shrink-0 font-medium">→</span>
                        <StaffProfilePopover person={getStaffPersonnel(subAssistant, 'Trợ giảng trực thay', true)}>
                          <div
                            className="flex items-center gap-1 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
                            title={`Trực thay: ${subAssistant}`}
                          >
                            <AppAvatar name={subAssistant} size="xs" isSubstitute={true} />
                            <span className="font-semibold text-foreground truncate max-w-[95px]">
                              {subAssistant}
                            </span>
                            <span className="text-[9.5px] px-1 py-0.2 rounded font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                              Trực thay
                            </span>
                          </div>
                        </StaffProfilePopover>
                      </div>
                    ) : (
                      /* Trợ giảng chính bình thường */
                      <StaffProfilePopover person={getStaffPersonnel(taTeacher, 'Trợ giảng')}>
                        <div className="flex items-center gap-1.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity">
                          <AppAvatar name={taTeacher} size="xs" />
                          <span className="font-semibold text-foreground truncate max-w-[150px]" title={taTeacher}>
                            {taTeacher}
                          </span>
                        </div>
                      </StaffProfilePopover>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* 5. Nội dung bài học */}
          {!isDigi && lessonContentDisplay && (
            <div className="border-t border-border/40 pt-1.5 text-xs text-muted-foreground">
              <p className="line-clamp-2 leading-relaxed break-words" title={lessonContentDisplay}>
                <span className="font-semibold text-foreground/80 not-italic">Nội dung: </span>
                <span className="italic">{lessonContentDisplay}</span>
              </p>
            </div>
          )}

          {/* 6. Project link if applicable */}
          {session.type === 'project' && session.projectUrl && (
            <div className="border-t border-border/40 pt-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-1">
                <FolderGit2 className="h-3 w-3" />
                Project:
              </span>
              <a
                href={session.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 underline inline-flex items-center gap-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Mở mini project
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-muted/30 border-t border-border/50 px-3 py-1 text-xs text-muted-foreground/80 flex items-center">
          <span className="flex items-center gap-1">
            <Info className="h-2.5 w-2.5 text-muted-foreground/60 shrink-0" />
            <span>Nhấp để mở chi tiết buổi học</span>
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
