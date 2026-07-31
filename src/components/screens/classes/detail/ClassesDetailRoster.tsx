'use client'

import { useState, useMemo } from 'react'
import { 
  Users, 
  Plus,
  Phone,
  Check,
  Copy,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  ChevronDown,
  Heart,
  ExternalLink,
  FileBarChart,
  Pencil,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import type { RosterStudent } from './classesDetailTypes'
import { maskPhone as maskPhoneUtil } from './classesDetailHelpers'
import { stableHash } from './classesSessionDetailHelpers'
import { ConfirmDialog, EmptyState, StatusBadge, CareTagHoverCard } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { StudentCareDetailDialog } from '@/components/screens/care/StudentCareDetailDialog'
import { StudentMonthlyReportDialog } from './StudentMonthlyReportDialog'
import { mockCareAlerts } from '@/mocks/careAlerts'

interface ClassesDetailRosterProps {
  students: RosterStudent[]
  onAddStudent?: () => void
  onRemoveStudent?: (studentId: string) => void
  onStudentClick?: (studentId: string) => void
  onCareClick?: (student: RosterStudent) => void
  onMonthlyReportOverlayClick?: (student: RosterStudent) => void
  isReadOnly?: boolean
  rosterError?: string
}

type TrendType = 'up' | 'stable' | 'down'

const COMMENTS = [
  'Học tập chăm chỉ, cần cải thiện phát âm',
  'Tiến bộ rõ rệt trong tháng qua',
  'Cần tập trung hơn trong giờ học',
  'Hoàn thành bài tập đầy đủ, tích cực phát biểu',
  'Năng lực tốt, cần thử thách thêm',
  'Hay nghỉ học, cần theo dõi sát',
  'Tương tác tốt với bạn cùng lớp',
  null,
]

function getTrendIcon(trend: TrendType) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
    case 'down':
      return <TrendingDown className="h-3 w-3 text-red-500 dark:text-red-400" />
    default:
      return <Minus className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
  }
}

function computeStudentProgress(student: RosterStudent) {
  const hash = stableHash(student.id)
  const totalSessions = 20
  const attended = totalSessions - (hash % 4)
  const attendanceRate = Math.round((attended / totalSessions) * 100)
  const hwTotal = 20
  const hwDone = hwTotal - (hash % 5)
  const hwRate = Math.round((hwDone / hwTotal) * 100)
  const avgScore = parseFloat((5.5 + (hash % 30) / 10).toFixed(1))
  const avgRating = parseFloat((3.0 + (hash % 20) / 10).toFixed(1))
  const trends: TrendType[] = ['up', 'stable', 'down']
  const trend = trends[hash % 3]

  let prevScore = avgScore
  if (trend === 'up') {
    prevScore = parseFloat(Math.max(4.0, avgScore - 0.8).toFixed(1))
  } else if (trend === 'down') {
    prevScore = parseFloat(Math.min(9.5, avgScore + 0.7).toFixed(1))
  } else {
    prevScore = avgScore
  }

  const latestComment = COMMENTS[hash % COMMENTS.length]

  return { attendanceRate, attended, totalSessions, hwRate, hwDone, hwTotal, avgScore, prevScore, avgRating, trend, latestComment }
}

interface CareTagItem {
  code: string
  label: string
  fullLabel: string
  colorClass: string
  description: string
  configRule: string
  realDataIssue: string
  occurredDate: string
  slaText: string
}

function getCareTagsForRosterStudent(student: RosterStudent, progress: ReturnType<typeof computeStudentProgress>): CareTagItem[] {
  const hash = stableHash(student.id || student.name)
  const tags: CareTagItem[] = []

  // 1. CS Học tập / Đột xuất (CSKH)
  if (progress.avgScore < 6.0 || hash % 7 === 0) {
    tags.push({
      code: 'CSKH',
      label: 'CSKH',
      fullLabel: 'Chăm sóc Đột xuất',
      colorClass: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
      description: 'Chăm sóc Đột xuất: Điểm kiểm tra dưới trung bình hoặc chuyên cần sút giảm',
      configRule: 'Chuyên cần < 85% hoặc Điểm kiểm tra < 5.5',
      realDataIssue: `Điểm TB ${progress.avgScore} | Vắng ${progress.totalSessions - progress.attended}/20 buổi học`,
      occurredDate: '20/07/2026',
      slaText: '24 giờ',
    })
  }

  // 2. CS Định kỳ (CSĐK1 / CSĐK2)
  if (hash % 3 === 0) {
    tags.push({
      code: 'CSĐK1',
      label: 'CSĐK1',
      fullLabel: 'CS học tập Định kỳ',
      colorClass: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
      description: 'Chăm sóc Định kỳ Kỳ 1: Trao đổi học tập hàng tháng',
      configRule: 'Điểm chạm kiểm tra tiến độ học tập hàng tháng',
      realDataIssue: `Chuyên cần ${progress.attendanceRate}% | Cần cập nhật học bạ tháng`,
      occurredDate: '15/07/2026',
      slaText: '5 ngày',
    })
  } else if (hash % 4 === 0) {
    tags.push({
      code: 'CSĐK2',
      label: 'CSĐK2',
      fullLabel: 'CS học phí Định kỳ',
      colorClass: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
      description: 'Chăm sóc Định kỳ Kỳ 2: Trao đổi tái phí & lộ trình khóa tới',
      configRule: 'Nhắc tái phí theo số buổi học còn lại',
      realDataIssue: `Còn ${progress.totalSessions - progress.attended} buổi học trong khóa hiện tại`,
      occurredDate: '10/07/2026',
      slaText: '5 ngày',
    })
  }

  // 3. CS Theo buổi / Chuyên cần (CSBH)
  if (progress.attendanceRate < 90 || hash % 5 === 0) {
    tags.push({
      code: 'CSBH',
      label: 'CSBH',
      fullLabel: 'CS chuyên cần & BTVN',
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
      description: 'Chăm sóc Theo buổi: Nhắc nhở chuyên cần & BTVN sau buổi học',
      configRule: 'Thiếu bài tập về nhà từ 2 buổi liên tiếp',
      realDataIssue: `Đã hoàn thành ${progress.hwDone}/${progress.hwTotal} bài (${progress.hwRate}%)`,
      occurredDate: '22/07/2026',
      slaText: '3 ngày',
    })
  }

  // 4. CS Tái phí (CSTP) - chỉ học viên đủ điều kiện tái phí mới có
  if (hash % 6 === 0 || (hash % 2 === 0 && progress.attended > 10)) {
    tags.push({
      code: 'CSTP',
      label: 'CSTP',
      fullLabel: 'Chăm sóc Tái phí',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
      description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới',
      configRule: 'Cảnh báo hạn gia hạn và đóng học phí khóa mới',
      realDataIssue: 'Hạn đóng phí dự kiến: 30/07/2026',
      occurredDate: '18/07/2026',
      slaText: '5 ngày',
    })
  }

  return tags.slice(0, 2)
}

interface StudentMilestoneTag {
  label: string
  colorClass: string
}

function getStudentMilestoneTag(student: RosterStudent, index: number): StudentMilestoneTag {
  const hash = stableHash(student.id + student.name)

  if (student.status === 'trial' || hash % 6 === 0) {
    return {
      label: 'Học thử',
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
    }
  }

  if (student.status === 'new' || hash % 6 === 1) {
    return {
      label: 'Mới ghi danh',
      colorClass: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50',
    }
  }

  if (hash % 6 === 2) {
    return {
      label: 'Buổi 1',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50',
    }
  }

  if (hash % 6 === 3) {
    return {
      label: 'Buổi 2',
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
    }
  }

  if (hash % 6 === 4) {
    return {
      label: 'Buổi cuối',
      colorClass: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
    }
  }

  return {
    label: index % 2 === 0 ? 'Mới ghi danh' : 'Buổi 1',
    colorClass: index % 2 === 0
      ? 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50',
  }
}

export function ClassesDetailRoster({ 
  students, 
  onAddStudent,
  onRemoveStudent,
  onStudentClick,
  onCareClick,
  onMonthlyReportOverlayClick,
  isReadOnly = false,
  rosterError
}: ClassesDetailRosterProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [removeConfirmStudent, setRemoveConfirmStudent] = useState<RosterStudent | null>(null)
  const [showInactiveStudents, setShowInactiveStudents] = useState(false)
  const [careStudentId, setCareStudentId] = useState<string | null>(null)
  const [isMonthlyReportModalOpen, setIsMonthlyReportModalOpen] = useState(false)

  const studentsWithProgress = useMemo(() => {
    return students.map((s) => ({ ...s, progress: computeStudentProgress(s) }))
  }, [students])

  const visibleStudents = useMemo(() => {
    if (showInactiveStudents) return studentsWithProgress
    return studentsWithProgress.filter(
      (s) => s.status !== 'reserve' && s.status !== 'transferred' && s.status !== 'dropout' && s.status !== 'session_ended'
    )
  }, [studentsWithProgress, showInactiveStudents])

  const inactiveCount = useMemo(() => {
    return studentsWithProgress.filter(
      (s) => s.status === 'reserve' || s.status === 'transferred' || s.status === 'dropout' || s.status === 'session_ended'
    ).length
  }, [studentsWithProgress])

  const handleCopyPhone = async (phone: string, id: string) => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Không thể sao chép số điện thoại:', err)
    }
  }

  const handleCallPhone = (phone: string, name: string) => {
    toast.info(`Đang kết nối cuộc gọi tới phụ huynh: ${name} (${phone})`)
  }

  const handleRemoveConfirm = () => {
    if (removeConfirmStudent && onRemoveStudent) {
      onRemoveStudent(removeConfirmStudent.id)
    }
    setRemoveConfirmStudent(null)
  }

  return (
    <div className="space-y-3">
      {rosterError && (
        <div className="p-3 rounded-xl border border-destructive bg-destructive/5 text-xs text-destructive font-semibold">
          {rosterError}
        </div>
      )}

      {/* Top Toolbar above Roster Table */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-0.5">
        {/* Left Side: Stats Badge ("Đang học: 19 học viên") + "Thêm học viên" button */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 font-semibold text-foreground">
            <span>Đang học:</span>
            <span className="font-mono font-bold text-primary">{visibleStudents.length} học viên</span>
          </div>

          {onAddStudent && !isReadOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddStudent}
              className="h-8 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary rounded-lg cursor-pointer bg-transparent border-none shadow-none"
            >
              <span>Thêm học viên</span>
            </Button>
          )}
        </div>

      </div>

      {/* Roster Table */}
      {visibleStudents.length > 0 ? (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
          <div className="overflow-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-10">
                <tr>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 w-[175px] min-w-[165px] whitespace-nowrap">Học viên</th>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 text-center w-[90px] whitespace-nowrap">Chuyên cần</th>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 text-center w-[80px] whitespace-nowrap">BTVN</th>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 text-center w-[80px] whitespace-nowrap">Kiểm tra</th>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 text-center w-[80px] whitespace-nowrap">Thái độ</th>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 text-left w-[200px] min-w-[180px] whitespace-nowrap">Thẻ chăm sóc</th>
                  <th className="py-2 px-3 font-bold text-zinc-500 dark:text-zinc-400 text-center w-[100px] min-w-[90px] whitespace-nowrap">Báo cáo tháng</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student, index) => {
                  const isMutedRosterStatus = student.status === 'reserve'
                    || student.status === 'transferred'
                    || student.status === 'dropout'
                    || student.status === 'session_ended'

                  const initials = student.name
                    .trim()
                    .split(' ')
                    .map((part) => part[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase()

                  const { attendanceRate, attended, totalSessions, hwRate, hwDone, hwTotal, avgScore, prevScore, avgRating, trend } = student.progress
                  const careTags = getCareTagsForRosterStudent(student, student.progress)
                  const milestoneTag = getStudentMilestoneTag(student, index)

                  return (
                    <tr
                      key={`${student.id}-${student.status}-${index}`}
                      className={cn(
                        'group transition-colors hover:bg-muted/30',
                        isMutedRosterStatus && 'opacity-50'
                      )}
                    >
                      {/* Student name + avatar */}
                      <td className="py-3 px-2.5 w-[175px] min-w-[165px]">
                        <div className="relative flex items-center gap-2 min-w-0">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="flex h-7 w-7 shrink-0 cursor-help items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-[9px] font-bold text-primary">
                                {initials}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-72 p-3" align="start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 border-b border-muted pb-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                                    {initials}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-foreground">{student.name}</h4>
                                    <p className="font-mono text-[9px] text-muted-foreground">{student.code}</p>
                                  </div>
                                </div>
                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                  <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                                    LIÊN HỆ GIA ĐÌNH
                                  </p>
                                  {(student.parents?.length ? student.parents : [{ name: student.parentName, phone: student.parentPhone, relationship: 'Phụ huynh' }]).map((parent, pi) => (
                                    <div key={`${student.id}-hover-${pi}`} className="flex items-center justify-between py-1">
                                      <div>
                                        <div className="text-xs font-semibold text-foreground">{parent.name} ({parent.relationship})</div>
                                        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{maskPhoneUtil(parent.phone)}</div>
                                      </div>
                                      <div className="flex shrink-0 items-center gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon-xs"
                                          onClick={(e) => { e.stopPropagation(); handleCallPhone(parent.phone, parent.name) }}
                                          className="h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                          title="Gọi điện"
                                        >
                                          <Phone className="h-3 w-3 text-primary" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon-xs"
                                          onClick={(e) => { e.stopPropagation(); handleCopyPhone(parent.phone, `${student.id}-${pi}`) }}
                                          className="h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                          title="Sao chép số điện thoại"
                                        >
                                          {copiedId === `${student.id}-${pi}` ? (
                                            <Check className="h-3 w-3 text-primary" />
                                          ) : (
                                            <Copy className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <div className="min-w-0 flex-1 truncate">
                            <button
                              type="button"
                              className="block max-w-full truncate text-left text-xs font-bold text-foreground hover:text-primary hover:underline"
                              onClick={(e) => { e.stopPropagation(); onStudentClick?.(student.id) }}
                            >
                              {student.name}
                            </button>
                            <div className="mt-0.5 flex items-center gap-1 min-w-0">
                              <span className="font-mono text-[10px] text-muted-foreground truncate">{student.code}</span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[9px] px-1 py-0 font-bold shrink-0 shadow-none border leading-tight h-4 rounded-md truncate max-w-[65px]',
                                  milestoneTag.colorClass
                                )}
                              >
                                {milestoneTag.label}
                              </Badge>
                            </div>
                          </div>

                          {/* Action icons (Heart for Overlay Care, FileText for Overlay Monthly Report, ExternalLink for Full Care Dialog, Trash for Remove) - Hover overlay */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 bg-background/95 backdrop-blur-xs px-1 py-0.5 rounded-md shadow-xs z-10">
                            {onMonthlyReportOverlayClick && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onMonthlyReportOverlayClick(student)
                                }}
                                className="h-6 w-6 shrink-0 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-transform active:scale-95"
                                title="Báo cáo tháng - Mở panel báo cáo tháng đè bên phải"
                              >
                                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                              </Button>
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCareStudentId(student.id)
                              }}
                              className="h-6 w-6 shrink-0 rounded-md text-primary hover:bg-primary/10 transition-transform active:scale-95"
                              title="Mở trang chi tiết chăm sóc học viên (Student Care)"
                            >
                              <ExternalLink className="h-3 w-3 text-primary" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onCareClick) {
                                  onCareClick(student)
                                } else {
                                  setCareStudentId(student.id)
                                }
                              }}
                              className="h-6 w-6 shrink-0 rounded-md text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition-transform active:scale-95"
                              title="Thực hiện chăm sóc - Mở panel chăm sóc đè"
                            >
                              <Heart className="h-3.5 w-3.5 fill-rose-500/20 text-rose-500 hover:fill-rose-500" />
                            </Button>

                            {!isReadOnly && onRemoveStudent && !isMutedRosterStatus && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setRemoveConfirmStudent(student)}
                                className="h-6 w-6 shrink-0 rounded-md text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-transform active:scale-95"
                                title="Xóa khỏi lớp"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-3.5 text-center">
                        <div className="flex flex-col items-center leading-tight">
                          <span className={cn(
                            "text-xs font-bold",
                            attendanceRate >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                            attendanceRate >= 80 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {attendanceRate}%
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono leading-none">
                            {attended}/{totalSessions}
                          </span>
                        </div>
                      </td>

                      {/* Homework */}
                      <td className="py-3.5 px-3.5 text-center">
                        <div className="flex flex-col items-center leading-tight">
                          <span className={cn(
                            "text-xs font-bold",
                            hwRate >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                            hwRate >= 75 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {hwRate}%
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono leading-none">
                            {hwDone}/{hwTotal}
                          </span>
                        </div>
                      </td>

                      {/* Kiểm tra */}
                      <td className="py-3.5 px-3.5 text-center">
                        <div className="flex flex-col items-center justify-center leading-tight">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs font-bold text-foreground font-mono">
                              {avgScore}
                            </span>
                            {getTrendIcon(trend)}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {prevScore}
                          </span>
                        </div>
                      </td>

                      {/* Thái độ (Rating sao) */}
                      <td className="py-3.5 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 leading-none">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span className="text-xs font-bold text-foreground font-mono">{avgRating}</span>
                        </div>
                      </td>

                      {/* Thẻ chăm sóc: Shared CareTagHoverCard */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {careTags.map((tag, tIdx) => (
                            <div
                              key={tIdx}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onCareClick) {
                                  onCareClick(student)
                                } else {
                                  setCareStudentId(student.id)
                                }
                              }}
                              className="cursor-pointer transition-transform active:scale-95 me-0"
                              title="Bấm để mở panel chăm sóc học viên này"
                            >
                              <CareTagHoverCard
                                code={tag.code}
                                fullLabel={tag.fullLabel}
                                colorClass={tag.colorClass}
                                description={tag.description}
                                configRule={tag.configRule}
                                realDataIssue={tag.realDataIssue}
                                occurredDate={tag.occurredDate}
                                slaText={tag.slaText}
                              />
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Báo cáo tháng (Ở sau cùng) */}
                      <td className="py-3.5 px-2 text-center w-[100px] min-w-[90px]">
                        {stableHash(student.id) % 2 === 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsMonthlyReportModalOpen(true)
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0088cc] hover:underline cursor-pointer group/report"
                            title="Bấm để xem/chỉnh sửa báo cáo tháng"
                          >
                            <span>Tháng {new Date().getMonth() + 1}</span>
                            <Pencil className="h-3.5 w-3.5 text-amber-500 group-hover/report:text-amber-600 transition-colors shrink-0" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsMonthlyReportModalOpen(true)
                              }}
                              className="h-6 px-2 text-[11px] font-semibold text-primary border-primary/40 hover:bg-primary/10 hover:text-primary rounded-md cursor-pointer"
                              title="Tạo mới báo cáo tháng (Tự động làm mới từ 25 hàng tháng)"
                            >
                              <span>Tạo mới</span>
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Users className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy học viên"
          description="Không có học viên nào đang học trong roster của lớp học này."
          className="rounded-xl border border-dashed bg-muted/5"
        />
      )}

      {/* Expand / Collapse Inactive Students Toggle */}
      {inactiveCount > 0 && (
        <div className="pt-1 text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowInactiveStudents((prev) => !prev)}
            className="h-8 px-4 text-xs font-semibold border-dashed border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg gap-1.5"
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", showInactiveStudents && "rotate-180")} />
            <span>
              {showInactiveStudents
                ? "Thu gọn danh sách học viên bảo lưu / đã nghỉ"
                : `Xem thêm ${inactiveCount} học viên (Bảo lưu, chuyển, đã nghỉ)`}
            </span>
          </Button>
        </div>
      )}

      {/* Confirm dialog for student removal */}
      <ConfirmDialog
        open={!!removeConfirmStudent}
        onOpenChange={(open) => { if (!open) setRemoveConfirmStudent(null) }}
        title="Xóa học viên khỏi lớp"
        description={removeConfirmStudent ? `Bạn có chắc chắn muốn xóa học viên "${removeConfirmStudent.name}" khỏi lớp học này? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={handleRemoveConfirm}
      />

      {/* Student Care Detail Modal (Triggered by Heart icon) */}
      {careStudentId && (
        <StudentCareDetailDialog
          studentId={careStudentId}
          open={!!careStudentId}
          onOpenChange={(open: boolean) => { if (!open) setCareStudentId(null) }}
          alerts={mockCareAlerts}
        />
      )}

      {/* Student Monthly Report Modal */}
      {isMonthlyReportModalOpen && (
        <StudentMonthlyReportDialog
          open={isMonthlyReportModalOpen}
          onOpenChange={setIsMonthlyReportModalOpen}
          students={visibleStudents}
        />
      )}
    </div>
  )
}
