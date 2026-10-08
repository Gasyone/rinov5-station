'use client'

import { useState } from 'react'
import { Pencil, Sparkles, UserPlus, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import { ScheduleSummary } from './ScheduleSummary'
import { SyllabusProfileHoverCard } from './SyllabusProfileHoverCard'
import { TeacherProfileHoverCard } from './TeacherProfileHoverCard'
import { ClassesSessionDetailDialog } from './detail/ClassesSessionDetailDialog'
import { generateMockRoster, generateRoadmapSessions } from './detail/classesDetailHelpers'
import type { RoadmapSession } from './detail/classesDetailTypes'
import { SessionHoverCard, type GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'
import {
  getClassAttendanceRate,
  getClassHomeworkRate,
  getClassAvgTestScore,
  getClassSpecialCareCount,
  getClassNewStudents,
  getSubjectByLevel,
  hasTeacherLeave,
  formatTeacherFullName,
} from './classesHelpers'

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN')
}

interface ClassesTableRowProps {
  cls: ClassRecord
  index?: number
  isEven?: boolean
  isSelected: boolean
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete?: (id: string) => void
  onManageRoadmap?: (id: string) => void
  onAddStudent?: (id: string) => void
}

export function ClassesTableRow({
  cls,
  index = 0,
  isEven: propIsEven,
  isSelected,
  onToggle,
  onRowClick,
  onView,
  onEdit,
  onManageRoadmap,
  onAddStudent,
}: ClassesTableRowProps) {
  const capacityPct = cls.maxStudents > 0 ? Math.round((cls.enrolledStudents / cls.maxStudents) * 100) : 0

  const attendanceRate = getClassAttendanceRate(cls)
  const homeworkRate = getClassHomeworkRate(cls)
  const avgTestScore = getClassAvgTestScore(cls)
  const specialCareCount = getClassSpecialCareCount(cls)

  const isInactive = cls.status === 'nhap' || cls.status === 'cho_khai_giang'

  // Subject display: "Môn học - Trình độ"
  const subjectCategory = getSubjectByLevel(cls.level) === 'math' ? 'Toán học' : getSubjectByLevel(cls.level) === 'japanese' ? 'Tiếng Nhật' : 'Tiếng Anh'
  const subjectDisplay = `${subjectCategory} - ${cls.level}`

  // Split teachers if combined (e.g. "Cô Lan & Cô Nga") into distinct personnel items
  const rawTeachers = cls.teacher && cls.teacher !== '—' ? cls.teacher.split(/\s*&\s*|\s*,\s*|\s+và\s+/i) : []
  // Primary teachers from cls.teacher
  const primaryTeachers = rawTeachers.map((name) => {
    const trimmed = name.trim()
    const cleanName = formatTeacherFullName(trimmed)
    const isLeave = hasTeacherLeave(cls) || Boolean(cls.scheduleSlots?.some(s => s.isLeave && (!s.teacherName || s.teacherName.includes(trimmed))))
    return {
      name: cleanName,
      phone: cls.teacherPhone,
      role: '',
      isSubstitute: false,
      isLeave,
      date: '',
      reason: '',
    }
  })

  // Filter substitute teachers: exclude any who share the same name as a primary teacher
  const primaryNames = new Set(primaryTeachers.map((p) => p.name.toLowerCase()))
  const substituteTeachers = (cls.substituteTeachers || [])
    .map((t) => ({
      name: formatTeacherFullName(t.name),
      phone: '',
      role: '',
      isSubstitute: true,
      isLeave: false,
      date: t.date,
      reason: t.reason,
    }))
    .filter((t) => t.name && !primaryNames.has(t.name.toLowerCase()))

  // ── Session Detail Dialog state (reuses ClassesSessionDetailDialog) ──
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)

  const sessionRoster = generateMockRoster(cls)
  const sessionsList = generateRoadmapSessions(cls)

  // Build a RoadmapSession from nextSession info
  const ns = cls.nextSession
  const nextSessionRoadmap: RoadmapSession | null = ns
    ? {
        id: `next-${cls.id}`,
        sessionNumber: sessionsList.length > 0 ? sessionsList.findIndex(s => s.status === 'upcoming') + 1 || sessionsList.length : 1,
        date: ns.date,
        startTime: ns.time?.split('–')[0] || '',
        endTime: ns.time?.split('–')[1] || '',
        topic: ns.topic || cls.name,
        description: 'Nội dung chi tiết buổi học.',
        room: ns.room || cls.room,
        defaultRoom: cls.room,
        teacherName: cls.teacher,
        status: ns.status === 'in_progress' ? 'ongoing' : 'upcoming',
        materials: [
          { name: 'Slide bài giảng', url: '#' },
          { name: 'Bài tập về nhà', url: '#' },
        ],
        syllabusName: cls.syllabus || 'Lộ trình mặc định',
      }
    : null

  // Build data for SessionHoverCard (profile card shown on hover)
  const sessionHoverData: GenericSessionData = {
    id: `sess-${cls.id}`,
    className: cls.name,
    classCode: cls.code,
    subject: subjectCategory,
    level: cls.level,
    teacher: cls.teacher,
    substituteTeacher: cls.substituteTeachers?.[0]?.name,
    assistantTeacher: cls.assistant || 'Trần Văn Hoàng',
    schoolRoom: cls.nextSession?.room || cls.room,
    branch: cls.branch,
    timeLabel: cls.nextSession?.time?.split('–')[0] || cls.scheduleSlots?.[0]?.startTime || '18:00',
    endTimeLabel: cls.nextSession?.time?.split('–')[1] || cls.scheduleSlots?.[0]?.endTime || '19:30',
    date: cls.nextSession ? cls.nextSession.date : formatDate(cls.startDate),
    status: cls.status === 'dang_hoc' ? 'completed' : 'upcoming',
    typeLabel: 'Chính thức',
    totalStudents: cls.maxStudents,
    officialStudents: cls.enrolledStudents,
    trialStudents: cls.trialStudents || 2,
    capacity: cls.maxStudents,
    scheduleType: 'class',
  }

  const isEven = propIsEven ?? (index % 2 === 1)

  // Opaque solid background specifically for sticky fixed cells to prevent bleed-through when scrolling
  const stickyBgClass = isSelected
    ? 'bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))] dark:bg-[color-mix(in_srgb,var(--primary)_18%,var(--background))]'
    : isEven
      ? 'bg-[color-mix(in_srgb,var(--muted)_40%,var(--background))] dark:bg-[color-mix(in_srgb,var(--muted)_25%,var(--background))] group-hover:bg-[color-mix(in_srgb,var(--accent)_50%,var(--background))] dark:group-hover:bg-[color-mix(in_srgb,var(--accent)_30%,var(--background))]'
      : 'bg-background group-hover:bg-[color-mix(in_srgb,var(--accent)_50%,var(--background))] dark:group-hover:bg-[color-mix(in_srgb,var(--accent)_30%,var(--background))]'

  return (
    <TooltipProvider delayDuration={300}>
      <tr
        className={cn(
          "group cursor-pointer border-b-0 border-none transition-colors align-middle [&>td]:py-1 [&>td]:px-2.5",
          isSelected
            ? '!bg-primary/10 dark:!bg-primary/20'
            : isEven
              ? 'bg-zinc-100/45 dark:bg-zinc-800/30 hover:bg-muted/70 dark:hover:bg-muted/50'
              : 'bg-background hover:bg-muted/60 dark:hover:bg-muted/40'
        )}
        onClick={() => onRowClick(cls.id)}
      >
        {/* Checkbox: sticky left-0 */}
        <td
          className={cn(
            "sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center py-1 px-1 border-none transition-colors",
            stickyBgClass
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onToggle(cls.id, Boolean(checked))}
            className="h-3.5 w-3.5 translate-y-[1px]"
            aria-label={`Chọn lớp ${cls.name}`}
          />
        </td>

        {/* Lớp học (PRIMARY FOCUS - STICKY left-8) */}
        <td
          className={cn(
            "sticky left-8 z-30 w-[240px] min-w-[240px] max-w-[240px] overflow-hidden py-1 px-2.5 border-none transition-colors",
            stickyBgClass
          )}
          onClick={() => onView(cls.id)}
        >
          <div className="relative z-10 max-w-full overflow-hidden pr-14">
            <div className="min-w-0 space-y-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="truncate font-semibold text-xs text-foreground group-hover:text-primary transition-colors cursor-pointer">
                    {cls.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{cls.name}</TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground truncate leading-tight">
                <span className="font-mono">{cls.code}</span>
                {cls.room && (
                  <span className="ml-1.5 text-foreground/80 font-normal">
                    • {cls.room.trim().toLowerCase().startsWith('p.') ? cls.room.trim() : `P. ${cls.room.trim().replace(/^phòng\s*/i, '')}`}
                  </span>
                )}
              </p>
            </div>
            <div
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex bg-muted/90 rounded px-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon-xs"
                title="Chỉnh sửa"
                onClick={() => onEdit(cls.id)}
                className="h-5 w-5 p-0 bg-transparent shadow-none hover:bg-background"
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                title={cls.syllabus && cls.syllabus !== '—' ? 'Đổi lộ trình' : 'Thêm lộ trình'}
                onClick={() => onManageRoadmap?.(cls.id)}
                className="h-5 w-5 p-0 bg-transparent shadow-none hover:bg-background"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                title="Thêm học viên"
                onClick={() => onAddStudent?.(cls.id)}
                className="h-5 w-5 p-0 bg-transparent shadow-none hover:bg-background"
              >
                <UserPlus className="h-3 w-3 text-emerald-600" />
              </Button>
            </div>
          </div>
        </td>

        {/* Môn học - Trình độ */}
        <td className="min-w-[130px] max-w-[145px] py-1 px-2.5 text-xs">
          <SyllabusProfileHoverCard cls={cls}>
            <div className="cursor-pointer group/syllabus space-y-0.5 max-w-full leading-tight">
              <div className="font-normal text-foreground truncate max-w-[130px]">{subjectDisplay}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[130px] group-hover/syllabus:text-primary group-hover/syllabus:underline">
                {cls.syllabus && cls.syllabus !== '—' ? cls.syllabus : <span className="text-muted-foreground italic">Chưa gán</span>}
              </div>
            </div>
          </SyllabusProfileHoverCard>
        </td>

        {/* Giáo viên */}
        <td className="min-w-[135px] max-w-[150px] py-1 px-2.5 text-xs">
          {primaryTeachers.length === 0 || !cls.teacher || cls.teacher === 'Chưa gán' ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 text-xs font-normal w-fit">
              <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
              <span>Chưa gán GV</span>
            </div>
          ) : (
            <div className="space-y-0.5 leading-tight">
              <div className="flex items-center gap-1 min-w-0">
                <TeacherProfileHoverCard
                  teacherName={primaryTeachers[0].name}
                  cls={cls}
                  phone={primaryTeachers[0].phone}
                  isLeave={primaryTeachers[0].isLeave}
                >
                  <span
                    className="font-normal text-xs text-foreground truncate max-w-[110px] cursor-pointer hover:text-primary hover:underline transition-colors"
                    title="Rê chuột xem hồ sơ giáo viên"
                  >
                    {primaryTeachers[0].name}
                  </span>
                </TeacherProfileHoverCard>
                {primaryTeachers[0].isLeave && (
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-normal shrink-0">
                    (Nghỉ)
                  </span>
                )}
              </div>
              {substituteTeachers.length > 0 ? (
                <TeacherProfileHoverCard
                  teacherName={substituteTeachers[0].name}
                  cls={cls}
                  isSubstitute={true}
                  substituteDate={substituteTeachers[0].date}
                  substituteReason={substituteTeachers[0].reason}
                >
                  <div
                    className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1 truncate max-w-[135px] cursor-pointer hover:underline"
                    title={`Dạy thay: ${substituteTeachers[0].name}${substituteTeachers[0].date ? ` (${substituteTeachers[0].date})` : ''}${substituteTeachers[0].reason ? ` - ${substituteTeachers[0].reason}` : ''}`}
                  >
                    <span className="px-1 py-0 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 font-normal text-xs shrink-0">
                      Thay
                    </span>
                    <span className="truncate">{substituteTeachers[0].name}</span>
                  </div>
                </TeacherProfileHoverCard>
              ) : primaryTeachers.length > 1 ? (
                <TeacherProfileHoverCard
                  teacherName={primaryTeachers[1].name}
                  cls={cls}
                  phone={primaryTeachers[1].phone}
                  isLeave={primaryTeachers[1].isLeave}
                >
                  <div
                    className="text-xs text-muted-foreground truncate max-w-[135px] cursor-pointer hover:text-primary hover:underline"
                    title="Rê chuột xem hồ sơ giáo viên"
                  >
                    + {primaryTeachers[1].name}
                  </div>
                </TeacherProfileHoverCard>
              ) : null}
            </div>
          )}
        </td>

        {/* Sĩ số */}
        <td className="min-w-[90px] max-w-[105px] py-1 px-2.5 text-xs">
          <div className="space-y-0.5 leading-tight">
            <div className="flex items-center gap-1">
              <span className="font-normal text-foreground">{cls.enrolledStudents}/{cls.maxStudents}</span>
              <span className={cn('text-xs', capacityPct >= 80 ? 'text-emerald-600' : capacityPct < 50 ? 'text-amber-600' : 'text-muted-foreground')}>
                ({capacityPct}%)
              </span>
            </div>
            {(Boolean(cls.trialStudents) || getClassNewStudents(cls) > 0) && (
              <div className="flex items-center gap-1 flex-wrap">
                {typeof cls.trialStudents === 'number' && cls.trialStudents > 0 && (
                  <span className="inline-flex items-center px-1 py-0 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 font-normal text-xs leading-tight">
                    {cls.trialStudents} thử
                  </span>
                )}
                {getClassNewStudents(cls) > 0 && (
                  <span className="inline-flex items-center px-1 py-0 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 font-normal text-xs leading-tight">
                    {getClassNewStudents(cls)} mới
                  </span>
                )}
              </div>
            )}
          </div>
        </td>

        {/* Lịch học */}
        <td className="min-w-[130px] max-w-[145px] py-1 px-2.5 text-xs">
          <div className="space-y-0.5 leading-tight">
            <ScheduleSummary scheduleSlots={cls.scheduleSlots} className={cls.name} hideTime />
            <div className="text-xs text-muted-foreground truncate">
              {cls.status === 'dang_hoc' ? (
                <span>
                  Buổi tới:{' '}
                  <SessionHoverCard session={sessionHoverData}>
                    <button
                      type="button"
                      className="text-primary hover:underline cursor-pointer font-normal"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSessionDialogOpen(true)
                      }}
                    >
                      {cls.nextSession?.date ||
                        (cls.scheduleSlots?.find((s) => s.date)?.date ? `${cls.scheduleSlots.find((s) => s.date)?.date}/2026` : null) ||
                        'Tuần này'}
                    </button>
                  </SessionHoverCard>
                </span>
              ) : cls.status === 'cho_khai_giang' || cls.status === 'mo_chieu_sinh' ? (
                <span>
                  Khai giảng:{' '}
                  <SessionHoverCard session={sessionHoverData}>
                    <button
                      type="button"
                      className="text-primary hover:underline cursor-pointer font-normal"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSessionDialogOpen(true)
                      }}
                    >
                      {formatDate(cls.startDate)}
                    </button>
                  </SessionHoverCard>
                </span>
              ) : cls.status === 'tam_dung' ? (
                <span className="text-amber-700 dark:text-amber-400">
                  {cls.nextSession?.date ? (
                    <>
                      Học lại:{' '}
                      <SessionHoverCard session={sessionHoverData}>
                        <button
                          type="button"
                          className="text-primary hover:underline cursor-pointer font-normal"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSessionDialogOpen(true)
                          }}
                        >
                          {cls.nextSession.date}
                        </button>
                      </SessionHoverCard>
                    </>
                  ) : (
                    'Tạm dừng học'
                  )}
                </span>
              ) : cls.status === 'nhap' ? (
                <span>
                  Dự kiến:{' '}
                  <span className="font-normal text-muted-foreground">
                    {cls.startDate ? formatDate(cls.startDate) : 'Chưa xếp lịch'}
                  </span>
                </span>
              ) : cls.status === 'huy' ? (
                <span>
                  Kết thúc:{' '}
                  <span className="font-normal text-muted-foreground">
                    {cls.lastSession?.date || formatDate(cls.endDate) || 'Đã kết thúc'}
                  </span>
                </span>
              ) : (
                <span>
                  {cls.nextSession ? `Buổi tới: ${cls.nextSession.date}` : formatDate(cls.startDate)}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Trạng thái */}
        <td className="w-28 min-w-28 max-w-32 py-1 px-2.5 text-xs whitespace-nowrap">
          <StatusBadge
            status={cls.status}
            label={CLASS_STATUS_LABELS[cls.status]}
            className="text-xs font-medium px-1.5 py-0 h-5 leading-none rounded"
          />
        </td>

        {/* CC & BTVN */}
        <td className="min-w-[85px] max-w-[100px] py-1 px-2.5 text-xs">
          <div className="space-y-0.5 leading-tight">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-muted-foreground font-normal">CC:</span>
              {isInactive ? (
                <span className="text-muted-foreground font-normal">—</span>
              ) : (
                <span className={cn('font-normal text-xs', attendanceRate < 85 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-foreground')}>
                  {attendanceRate}%
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-muted-foreground font-normal">BTVN:</span>
              {isInactive ? (
                <span className="text-muted-foreground font-normal">—</span>
              ) : (
                <span className={cn('font-normal text-xs', homeworkRate < 80 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-foreground')}>
                  {homeworkRate}%
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Kiểm tra */}
        <td className="w-16 min-w-16 py-1 px-2 text-center text-xs">
          {isInactive ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <span className="font-normal text-foreground">
              {avgTestScore}<span className="text-xs text-muted-foreground font-normal">/10</span>
            </span>
          )}
        </td>

        {/* CSĐB */}
        <td className="w-16 min-w-16 py-1 px-2 text-center text-xs">
          {isInactive || specialCareCount === 0 ? (
            <span className="text-muted-foreground">0</span>
          ) : (
            <span className="inline-flex items-center justify-center px-1.5 py-0 h-4.5 rounded font-normal text-xs bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 leading-none">
              {specialCareCount} HV
            </span>
          )}
        </td>
      </tr>

      {/* Reuse ClassesSessionDetailDialog for next session profile */}
      {sessionDialogOpen && nextSessionRoadmap && (
        <ClassesSessionDetailDialog
          isOpen={sessionDialogOpen}
          onClose={() => setSessionDialogOpen(false)}
          session={nextSessionRoadmap}
          sessions={sessionsList}
          cls={cls}
          roster={sessionRoster}
          onCancel={() => toast.success('Đã hủy buổi học thành công (Demo).')}
          onEditTeacher={() => toast.success('Đã gửi yêu cầu đổi giáo viên (Demo).')}
          onEditRoom={() => toast.success('Đã gửi yêu cầu đổi phòng học (Demo).')}
          onUpload={() => toast.success('Đã tải tài liệu lên thành công (Demo).')}
        />
      )}
    </TooltipProvider>
  )
}
