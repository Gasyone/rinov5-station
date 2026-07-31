'use client'

import { useState } from 'react'
import { Pencil, Sparkles, UserPlus, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { StatusBadge, PersonnelCell, LocationCell } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import { ScheduleSummary } from './ScheduleSummary'
import { SyllabusProfileHoverCard } from './SyllabusProfileHoverCard'
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
  isSelected: boolean
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onManageRoadmap?: (id: string) => void
  onAddStudent?: (id: string) => void
}

export function ClassesTableRow({
  cls,
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

  const substituteTeachers = (cls.substituteTeachers || []).map((t) => ({
    name: formatTeacherFullName(t.name),
    phone: '',
    role: '',
    isSubstitute: true,
    isLeave: false,
    date: t.date,
    reason: t.reason,
  }))

  const allTeachers = [
    ...primaryTeachers,
    ...substituteTeachers,
  ].filter((t) => t.name && t.name !== '—')

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

  return (
    <TooltipProvider delayDuration={300}>
      <TableRow className="group cursor-pointer border-b-0 hover:bg-muted/40" onClick={() => onRowClick(cls.id)}>
      {/* Checkbox */}
      <TableCell
        className="sticky left-0 z-30 w-10 min-w-10 max-w-10 bg-background text-center group-hover:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(cls.id, Boolean(checked))}
        />
      </TableCell>

      {/* Lớp học (PRIMARY FOCUS - STICKY) */}
      <TableCell
        className="sticky left-10 z-20 w-[280px] min-w-[280px] max-w-[280px] bg-background group-hover:bg-muted"
        onClick={() => onView(cls.id)}
      >
        <div className="relative z-10 max-w-full overflow-hidden pr-16">
          <div className="min-w-0 space-y-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate font-bold text-sm text-foreground group-hover:text-primary transition-colors cursor-pointer">{cls.name}</p>
              </TooltipTrigger>
              <TooltipContent>{cls.name}</TooltipContent>
            </Tooltip>
            <p className="font-mono text-[11px] text-muted-foreground">{cls.code}</p>
          </div>
          <div
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon-sm" title="Chỉnh sửa" onClick={() => onEdit(cls.id)} className="h-6 w-6 bg-transparent shadow-none hover:bg-muted">
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title={cls.syllabus && cls.syllabus !== '—' ? 'Đổi lộ trình' : 'Thêm lộ trình'}
              onClick={() => onManageRoadmap?.(cls.id)}
              className="h-6 w-6 bg-transparent shadow-none hover:bg-muted"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Thêm học viên"
              onClick={() => onAddStudent?.(cls.id)}
              className="h-6 w-6 bg-transparent shadow-none hover:bg-muted"
            >
              <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
            </Button>
          </div>
        </div>
      </TableCell>

      {/* Môn học - Trình độ */}
      <TableCell className="min-w-36 text-xs">
        <SyllabusProfileHoverCard cls={cls}>
          <div className="space-y-0.5 cursor-pointer group/syllabus inline-block max-w-full">
            <div className="font-medium text-foreground">{subjectDisplay}</div>
            <div className="text-[11px] text-primary truncate max-w-[130px] group-hover/syllabus:underline">
              {cls.syllabus && cls.syllabus !== '—' ? cls.syllabus : <span className="text-muted-foreground">Chưa gán</span>}
            </div>
          </div>
        </SyllabusProfileHoverCard>
      </TableCell>

      {/* Giáo viên (Compact Avatar xs size) */}
      <TableCell className="min-w-40">
        <div className="flex flex-col gap-1 py-0.5">
          {allTeachers.length === 0 || !cls.teacher || cls.teacher === 'Chưa gán' ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 text-[11px] font-bold shadow-2xs w-fit">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>Chưa gán GV</span>
            </div>
          ) : (
            <>
              {allTeachers.map((t, idx) => (
                <PersonnelCell
                  key={idx}
                  items={[t]}
                  size="xs"
                  mode="single"
                />
              ))}
            </>
          )}
        </div>
      </TableCell>

      {/* Sĩ số */}
      <TableCell className="min-w-28 text-xs">
        <div className="space-y-0.5">
          <div>
            <span className="font-normal text-foreground">{cls.enrolledStudents}/{cls.maxStudents}</span>
            <span className="ml-1 text-[11px] text-muted-foreground">({capacityPct}%)</span>
          </div>
          {(Boolean(cls.trialStudents) || getClassNewStudents(cls) > 0) && (
            <div className="text-[10px] flex items-center gap-1 flex-wrap pt-0.5">
              {typeof cls.trialStudents === 'number' && cls.trialStudents > 0 && (
                <span className="inline-flex items-center px-1 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 font-semibold leading-none">
                  Học thử: {cls.trialStudents}
                </span>
              )}
              {getClassNewStudents(cls) > 0 && (
                <span className="inline-flex items-center px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 font-semibold leading-none">
                  Mới: {getClassNewStudents(cls)}
                </span>
              )}
            </div>
          )}
        </div>
      </TableCell>

      {/* Lịch học */}
      <TableCell className="min-w-44 text-xs">
        <ScheduleSummary scheduleSlots={cls.scheduleSlots} className={cls.name} />
      </TableCell>

      {/* Trạng thái & Dòng ngày duy nhất — hover xem SessionProfileHoverCard, click mở ClassesSessionDetailDialog */}
      <TableCell className="min-w-32 py-2 text-xs">
        <div className="space-y-1">
          <div>
            <StatusBadge status={cls.status} label={CLASS_STATUS_LABELS[cls.status]} withDot className="bg-transparent dark:bg-transparent border-0 shadow-none px-0" />
          </div>
          <div className="text-[10px] text-muted-foreground leading-snug truncate">
            {isInactive ? (
              <span>
                Khai giảng:{' '}
                <SessionHoverCard session={sessionHoverData}>
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSessionDialogOpen(true)
                    }}
                  >
                    {formatDate(cls.startDate)}
                  </button>
                </SessionHoverCard>
              </span>
            ) : cls.nextSession ? (
              <span>
                Buổi tới:{' '}
                <SessionHoverCard session={sessionHoverData}>
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSessionDialogOpen(true)
                    }}
                  >
                    {cls.nextSession.date}
                  </button>
                </SessionHoverCard>
              </span>
            ) : cls.lastSession ? (
              <span>
                Buổi cuối:{' '}
                <SessionHoverCard session={sessionHoverData}>
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSessionDialogOpen(true)
                    }}
                  >
                    {cls.lastSession.date}
                  </button>
                </SessionHoverCard>
              </span>
            ) : (
              <span>
                Khai giảng:{' '}
                <SessionHoverCard session={sessionHoverData}>
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSessionDialogOpen(true)
                    }}
                  >
                    {formatDate(cls.startDate)}
                  </button>
                </SessionHoverCard>
              </span>
            )}
          </div>
        </div>
      </TableCell>

      {/* Chi nhánh (Trường) */}
      <TableCell className="min-w-40 text-xs">
        <LocationCell branch={cls.branch} room={cls.room} />
      </TableCell>

      {/* Thống kê Chuyên cần (Sticky right) */}
      <TableCell className="sticky right-[240px] z-20 w-[90px] min-w-[90px] max-w-[90px] bg-slate-50/90 dark:bg-slate-900/60 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/90 text-center text-xs shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]">
        {isInactive ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <span className="font-medium text-foreground">{attendanceRate}%</span>
        )}
      </TableCell>

      {/* Thống kê BTVN (Sticky right) */}
      <TableCell className="sticky right-[160px] z-20 w-[80px] min-w-[80px] max-w-[80px] bg-slate-50/90 dark:bg-slate-900/60 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/90 text-center text-xs">
        {isInactive ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <span className="font-medium text-foreground">{homeworkRate}%</span>
        )}
      </TableCell>

      {/* Kiểm tra (Sticky right) */}
      <TableCell className="sticky right-[80px] z-20 w-[80px] min-w-[80px] max-w-[80px] bg-slate-50/90 dark:bg-slate-900/60 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/90 text-center text-xs">
        {isInactive ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <div>
            <span className="font-medium text-foreground">{avgTestScore}</span>
            <span className="text-[10px] text-muted-foreground">/10</span>
          </div>
        )}
      </TableCell>

      {/* Cần CSĐB (Sticky right) */}
      <TableCell className="sticky right-0 z-20 w-[80px] min-w-[80px] max-w-[80px] bg-slate-50/90 dark:bg-slate-900/60 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/90 text-center text-xs">
        {isInactive || specialCareCount === 0 ? (
          <span className="text-muted-foreground">0</span>
        ) : (
          <span className="font-semibold text-rose-600 dark:text-rose-400">{specialCareCount} HV</span>
        )}
      </TableCell>
      </TableRow>

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
