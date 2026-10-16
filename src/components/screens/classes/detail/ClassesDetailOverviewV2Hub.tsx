'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Calendar,
  CalendarX,
  ClipboardCheck,
  Clock,
  DoorClosed,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Heart,
  MoreHorizontal,
  Play,
  Plus,
  Star,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent, ClassAuditLog } from './classesDetailTypes'
import { ClassesDetailHeaderV2 } from './ClassesDetailHeaderV2'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'
import { computeStudentProgress, getCareTagsForRosterStudent } from './ClassesDetailRoster'
import { ClassesTeacherHistoryDialog } from './ClassesTeacherHistoryDialog'
import { ClassesSessionDetailDialog } from './ClassesSessionDetailDialog'
import { ClassesDetailOverviewV2MetaPanel } from './ClassesDetailOverviewV2MetaPanel'

export interface ClassesDetailOverviewV2HubProps {
  cls: ClassRecord
  sessions: RoadmapSession[]
  roster: RosterStudent[]
  logs: ClassAuditLog[]
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onStatusChange: (newStatus: ClassRecord['status'], actionText: string) => void
  onRequestStatusChange: (request: ClassesStatusChangeRequest) => void
  onToggleViewMode: () => void
  onNavigateToSubject: (subject: 'students' | 'sessions' | 'media' | 'logs') => void
  onAddStudent: () => void
  onRescheduleClick: () => void
  onEditRoadmap?: () => void
}

export function ClassesDetailOverviewV2Hub({
  cls,
  sessions,
  roster,
  logs,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onStatusChange,
  onRequestStatusChange,
  onToggleViewMode,
  onNavigateToSubject,
  onAddStudent,
  onRescheduleClick,
  onEditRoadmap,
}: ClassesDetailOverviewV2HubProps) {
  // Modal state for viewing teacher change and assignment history
  const [isTeacherHistoryOpen, setIsTeacherHistoryOpen] = useState(false)
  // Active session for opening session detail dialog from spotlight card
  const [spotlightSessionDetail, setSpotlightSessionDetail] = useState<RoadmapSession | null>(null)

  // Compute session metrics directly from real mock schedule
  const completedCount = sessions.filter((s) => s.status === 'completed').length
  const totalSessions = sessions.length || 24
  const progressPercent = Math.round((completedCount / totalSessions) * 100)

  // Current or next upcoming session
  const nextSession = useMemo(() => {
    const ongoing = sessions.find((s) => s.status === 'ongoing')
    if (ongoing) return ongoing
    const upcoming = sessions.find((s) => s.status === 'upcoming')
    return upcoming || sessions[sessions.length - 1] || null
  }, [sessions])

  const sessionStatusType = useMemo<'ongoing' | 'off_day' | 'not_started' | 'completed'>(() => {
    if (cls.status === 'huy' || (completedCount === totalSessions && totalSessions > 0)) return 'completed'
    if (sessions.some((s) => s.status === 'ongoing')) return 'ongoing'
    if (cls.status === 'cho_khai_giang' || cls.status === 'mo_chieu_sinh' || cls.status === 'nhap' || completedCount === 0) return 'not_started'
    return 'off_day'
  }, [sessions, completedCount, totalSessions, cls.status])

  // Weekly schedule slots with both Teacher (GV) and Assistant (TG)
  const weeklySlots = useMemo(() => {
    if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
      return cls.scheduleSlots.map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        teacherName: slot.teacherName || slot.teachers?.[0] || cls.teacher || 'Chưa gán',
        assistantName: slot.assistantName || cls.assistant || 'Hoàng Anh',
      }))
    }

    return [
      { dayOfWeek: 'Thứ 2', startTime: '18:00', endTime: '19:30', teacherName: cls.teacher || 'Hoàng Thị Mai', assistantName: cls.assistant || 'Hoàng Anh' },
      { dayOfWeek: 'Thứ 4', startTime: '18:00', endTime: '19:30', teacherName: 'Phạm Mỹ Linh', assistantName: cls.assistant || 'Hoàng Anh' },
      { dayOfWeek: 'Thứ 6', startTime: '18:00', endTime: '19:30', teacherName: cls.teacher || 'David Wilson', assistantName: cls.assistant || 'Trần Thu Hà' },
    ]
  }, [cls])

  // Roster breakdown & care metrics
  const rosterWithMetrics = useMemo(() => {
    return roster.map((student) => {
      const progress = computeStudentProgress(student)
      const careTags = getCareTagsForRosterStudent(student, progress)
      return {
        ...student,
        progress,
        careTags,
        needsCare: careTags.length > 0,
      }
    })
  }, [roster])

  const careStudentsCount = useMemo(() => {
    return rosterWithMetrics.filter((s) => s.needsCare).length
  }, [rosterWithMetrics])

  // Preview 8 students to fit expanded flat layout without scrolling
  const previewStudents = useMemo(() => rosterWithMetrics.slice(0, 8), [rosterWithMetrics])


  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden p-2.5 lg:p-3 space-y-2 bg-background">
      {/* 1. Header with Version Switcher Icon */}
      <ClassesDetailHeaderV2
        cls={cls}
        isEditing={isEditing}
        rosterCount={roster.length}
        specialCareCount={careStudentsCount}
        onStartEdit={onStartEdit}
        onCancelEdit={onCancelEdit}
        onSave={onSave}
        onStatusChange={onStatusChange}
        onRequestStatusChange={onRequestStatusChange}
        viewMode="v2"
        onToggleViewMode={onToggleViewMode}
      />

      {/* 2. Main Single-Pane Dashboard Grid (No Scroll - Fits 1 screen) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
          {/* LEFT COLUMN: Core Academic Entities (Học viên & Buổi học) - 8 cols */}
          <div className="lg:col-span-8 flex flex-col space-y-2.5">
            {/* SUBJECT 1: BUỔI HỌC & TIẾN ĐỘ */}
            <section className="rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs hover:border-border transition-colors">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <div>
                    <h3 className="text-xs font-normal text-foreground">Buổi học & Tiến độ</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {completedCount}/{totalSessions} buổi ({progressPercent}%)
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateToSubject('sessions')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0088cc] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Next / Current Session Spotlight Box */}
              {nextSession && (
                <div
                  className={cn(
                    'mt-2 rounded-lg border p-2.5 transition-colors',
                    sessionStatusType === 'ongoing' && 'border-sky-200/80 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/25',
                    sessionStatusType === 'off_day' && 'border-amber-200/70 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/15',
                    sessionStatusType === 'not_started' && 'border-indigo-200/70 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/15',
                    sessionStatusType === 'completed' && 'border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/15'
                  )}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={cn(
                          'rounded text-white px-1.5 py-0.2 text-[10.5px] font-bold shrink-0',
                          sessionStatusType === 'ongoing' && 'bg-sky-600 dark:bg-sky-500',
                          sessionStatusType === 'off_day' && 'bg-amber-600 dark:bg-amber-500',
                          sessionStatusType === 'not_started' && 'bg-indigo-600 dark:bg-indigo-500',
                          sessionStatusType === 'completed' && 'bg-emerald-600 dark:bg-emerald-500'
                        )}
                      >
                        {sessionStatusType === 'not_started'
                          ? `Buổi ${nextSession.sessionNumber} (Khai giảng)`
                          : sessionStatusType === 'completed'
                          ? `Buổi ${nextSession.sessionNumber} (Tổng kết)`
                          : `Buổi ${nextSession.sessionNumber}`}
                      </span>

                      <span className="text-xs font-semibold text-foreground">
                        {nextSession.date} • {nextSession.startTime || '18:00'} - {nextSession.endTime || '19:30'}
                      </span>
                    </div>

                    {sessionStatusType === 'ongoing' && (
                      <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300 text-[10px] h-4.5 font-semibold gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                        <span>Đang học hôm nay</span>
                      </Badge>
                    )}

                    {sessionStatusType === 'off_day' && (
                      <Badge variant="outline" className="text-[10px] h-4.5 font-semibold text-amber-700 dark:text-amber-400 border-amber-300/80 bg-amber-500/10 gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        <span>Hôm nay không có lịch • Buổi tiếp theo</span>
                      </Badge>
                    )}

                    {sessionStatusType === 'not_started' && (
                      <Badge variant="outline" className="text-[10px] h-4.5 font-semibold text-indigo-700 dark:text-indigo-400 border-indigo-300/80 bg-indigo-500/10">
                        <span>Chưa bắt đầu học</span>
                      </Badge>
                    )}

                    {sessionStatusType === 'completed' && (
                      <Badge variant="outline" className="text-[10px] h-4.5 font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300/80 bg-emerald-500/10">
                        <span>Khóa học đã kết thúc</span>
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs font-medium text-foreground line-clamp-1 mb-1.5">
                    Chủ đề: <span className="font-semibold text-foreground">{nextSession.topic}</span>
                  </div>

                  {nextSession.description && (
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mb-1.5">
                      <span className="font-semibold text-foreground me-1">Ghi chú:</span>
                      {nextSession.description}
                    </div>
                  )}

                  {/* Spotlight Session Action Row */}
                  <div className="mt-1.5 pt-1.5 border-t border-border/30 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground min-w-0">
                      <span>GV: <strong className="text-foreground">{nextSession.teacherName}</strong></span>
                      <span>•</span>
                      <span>Trợ giảng: <strong className="text-foreground">{nextSession.assistantName || 'Hoàng Anh'}</strong></span>
                      <span>•</span>
                      <span>Phòng: <strong className="text-foreground">{nextSession.room || cls.room || 'A101'}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        size="xs"
                        onClick={() => setSpotlightSessionDetail(nextSession)}
                        className={cn(
                          'h-6 px-2 text-[11px] font-semibold gap-1 cursor-pointer shadow-2xs',
                          sessionStatusType === 'ongoing'
                            ? 'bg-sky-600 hover:bg-sky-700 text-white'
                            : 'border border-border/80 bg-background hover:bg-muted text-foreground'
                        )}
                        title="Mở chi tiết & Điểm danh buổi học này"
                      >
                        {sessionStatusType === 'ongoing' ? (
                          <>
                            <ClipboardCheck className="h-3 w-3" />
                            <span>Điểm danh</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-3 w-3" />
                            <span>Chi tiết buổi</span>
                          </>
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-xs"
                            className="h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            title="Tùy chọn thao tác buổi học"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 text-xs z-50">
                          <DropdownMenuItem
                            onClick={() => setSpotlightSessionDetail(nextSession)}
                            className="gap-2 cursor-pointer font-medium"
                          >
                            <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
                            <span>Mở chi tiết & Điểm danh</span>
                          </DropdownMenuItem>

                          {sessionStatusType === 'ongoing' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSpotlightSessionDetail(nextSession)
                                toast.info(`Bắt đầu buổi dạy trực tiếp: Buổi ${nextSession.sessionNumber}`)
                              }}
                              className="gap-2 cursor-pointer text-sky-600 dark:text-sky-400 font-medium"
                            >
                              <Play className="h-3.5 w-3.5" />
                              <span>Vào dạy trực tiếp (Live)</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => setIsTeacherHistoryOpen(true)}
                            className="gap-2 cursor-pointer"
                          >
                            <UserCog className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Đổi giáo viên / Báo dạy thay</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onRescheduleClick()}
                            className="gap-2 cursor-pointer"
                          >
                            <DoorClosed className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Đổi phòng học</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setIsTeacherHistoryOpen(true)}
                            className="gap-2 cursor-pointer"
                          >
                            <UserPlus className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Đổi Trợ giảng</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onRescheduleClick()}
                            className="gap-2 cursor-pointer"
                          >
                            <Calendar className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                            <span>Dời lịch buổi này</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onNavigateToSubject('media')}
                            className="gap-2 cursor-pointer"
                          >
                            <FolderOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Kho tài liệu & Media</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => {
                              toast.error(`Đã gửi yêu cầu báo hủy Buổi ${nextSession.sessionNumber}!`)
                            }}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer font-semibold"
                          >
                            <CalendarX className="h-3.5 w-3.5" />
                            <span>Báo hủy buổi học này</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )}

              {/* Action bar */}
              <div className="mt-2.5 flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-muted-foreground truncate">
                  Lộ trình: <strong className="font-medium text-foreground">{cls.learningPath || cls.syllabus || 'Chuẩn đầu ra'}</strong>
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onEditRoadmap && (
                    <Button variant="ghost" size="xs" onClick={onEditRoadmap} className="h-6 text-[11px] text-muted-foreground hover:text-foreground">
                      Đổi lộ trình
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onNavigateToSubject('sessions')}
                    className="h-6 px-2 text-[11px] font-semibold text-primary hover:bg-primary/5"
                  >
                    Xem toàn bộ {totalSessions} buổi học
                  </Button>
                </div>
              </div>
            </section>

            {/* SUBJECT 2: HỌC VIÊN LỚP */}
            <section className="rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs hover:border-border transition-colors">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-normal text-foreground">Học viên</h3>
                    <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 text-[10.5px] font-medium">
                      {roster.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={onAddStudent}
                    className="h-6 px-2 text-[11px] font-medium gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm</span>
                  </Button>
                  <button
                    type="button"
                    onClick={() => onNavigateToSubject('students')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Roster Preview Mini-list (Flat - no nested background or border) */}
              <div className="mt-1 divide-y divide-border/30">
                {previewStudents.map((st) => {
                  const p = st.progress
                  const primaryCareTag = st.careTags[0]
                  return (
                    <div
                      key={st.id}
                      onClick={() => onNavigateToSubject('students')}
                      className={cn(
                        'flex items-center justify-between py-1 px-1.5 hover:bg-muted/40 rounded-md cursor-pointer transition-colors text-xs gap-2',
                        st.needsCare && 'bg-rose-500/[0.03]'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                          {st.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-foreground truncate text-[11.5px]">{st.name}</span>
                            {st.needsCare && primaryCareTag && (
                              <span
                                className={cn(
                                  'inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9.5px] font-semibold border shrink-0',
                                  primaryCareTag.colorClass
                                )}
                                title={primaryCareTag.description}
                              >
                                <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500 shrink-0" />
                                <span>{primaryCareTag.label}</span>
                                {st.careTags.length > 1 && (
                                  <span className="opacity-75 text-[9px]">+{st.careTags.length - 1}</span>
                                )}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">{st.code || 'HV-001'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 lg:gap-2.5 shrink-0 text-[11px] font-mono">
                        {st.status === 'trial' ? (
                          <span className="rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 text-[10px] font-semibold">
                            Học thử
                          </span>
                        ) : (
                          <span className="text-muted-foreground hidden sm:inline" title={`Chuyên cần: ${p.attended}/${p.totalSessions} buổi`}>
                            CC: <strong className={p.attendanceRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{p.attendanceRate}%</strong>
                          </span>
                        )}

                        <span className="text-muted-foreground" title={`BTVN: ${p.hwDone}/${p.hwTotal} bài (${p.hwRate}%)`}>
                          BTVN: <strong className={p.hwRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{p.hwRate}%</strong>
                        </span>

                        <span className="text-muted-foreground" title="Điểm kiểm tra trung bình">
                          KT: <strong className="text-foreground">{p.avgScore}</strong>
                        </span>

                        <div className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold" title="Đánh giá sao trung bình">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span>{p.avgRating}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Info, Schedule, Media & Audit Logs - 4 cols (thu hẹp) */}
          <ClassesDetailOverviewV2MetaPanel
            cls={cls}
            logs={logs}
            weeklySlots={weeklySlots}
            onRescheduleClick={onRescheduleClick}
            onOpenTeacherHistory={() => setIsTeacherHistoryOpen(true)}
            onNavigateToSubject={onNavigateToSubject}
          />
        </div>
      </div>

      {/* 3. Modal Lịch sử đổi & phân công giáo viên */}
      <ClassesTeacherHistoryDialog
        open={isTeacherHistoryOpen}
        onOpenChange={setIsTeacherHistoryOpen}
        cls={cls}
      />

      {/* 4. Modal Chi tiết & Điểm danh buổi học */}
      {spotlightSessionDetail && (
        <ClassesSessionDetailDialog
          isOpen={!!spotlightSessionDetail}
          onClose={() => setSpotlightSessionDetail(null)}
          session={spotlightSessionDetail}
          sessions={sessions}
          cls={cls}
          roster={roster}
          classLogs={logs}
          isOpenedFromClassScreen={true}
        />
      )}
    </div>
  )
}
