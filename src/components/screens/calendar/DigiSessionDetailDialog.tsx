'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Building2,
  Calendar,
  BookOpen,
  User,
  Users,
  PenSquare,
  Laptop,
  Check,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Clock,
  AlertCircle,
  Repeat,
  ArrowLeftRight,
  Plus,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { PersonnelHoverCard, type PersonnelItem } from '@/components/shared'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DigiChangeAssistantDialog } from './DigiChangeAssistantDialog'
import {
  INITIAL_DIGI_BOOKINGS,
  type DigiStudentBooking,
} from '@/mocks/digiSchedule'
import type { ClassSession } from '@/mocks/calendarSchedule'
import { cn } from '@/lib/utils'

interface DigiSessionDetailDialogProps {
  session: ClassSession | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenCreateDialog?: () => void
}

const AVATAR_COLORS = [
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-rose-100 text-rose-700 border-rose-200',
]

export function DigiSessionDetailDialog({
  session,
  open,
  onOpenChange,
}: DigiSessionDetailDialogProps) {
  const [bookings, setBookings] = useState<DigiStudentBooking[]>(INITIAL_DIGI_BOOKINGS)
  const [commentText, setCommentText] = useState('Luyện tập bài học Digi theo lộ trình cá nhân hóa')
  const [mainAssistant, setMainAssistant] = useState(
    session?.assistantTeacher || (typeof session?.teacher === 'string' && session.teacher.includes('Thu Hà') ? 'Nguyễn Thu Hà' : 'Nguyễn Thu Hà')
  )
  const [substituteAssistant, setSubstituteAssistant] = useState<string | null>(null)
  const [isChangeAssistantOpen, setIsChangeAssistantOpen] = useState(false)
  const [changeAssistantScope, setChangeAssistantScope] = useState<'today_only' | 'all_future'>('today_only')

  if (!session) return null

  const getStatusPriority = (status: string) => {
    if (status === 'da_xep_lich') return 0 // Chưa học (lên trên đầu)
    if (status === 'dang_hoc') return 1    // Đang học (ở giữa)
    if (status === 'completed') return 2   // Đã học (xuống cuối)
    return 3                               // Vắng mặt / huỷ (dưới cùng)
  }

  const currentBookings = [...bookings]
    .filter(
      (b) => b.roomName === session.schoolRoom || session.digiBookingIds?.includes(b.id)
    )
    .sort((a, b) => {
      const pA = getStatusPriority(a.status)
      const pB = getStatusPriority(b.status)
      if (pA !== pB) return pA - pB
      return a.startTime.localeCompare(b.startTime)
    })

  const activeCount = currentBookings.filter((b) => b.status === 'dang_hoc').length
  const waitingCount = currentBookings.filter((b) => b.status === 'da_xep_lich').length
  const completedCount = currentBookings.filter((b) => b.status === 'completed').length
  const absentCount = currentBookings.filter((b) => b.status === 'da_vang' || b.status === 'cancelled').length
  const deviceCount = currentBookings.filter((b) => Boolean(b.deviceCode)).length

  const currentActiveAssistantName = substituteAssistant || mainAssistant
  const assistantPerson: PersonnelItem = {
    id: substituteAssistant ? 'EMP-SUB-TG' : 'EMP-TG04',
    name: currentActiveAssistantName,
    role: substituteAssistant ? 'Trợ giảng (Trực thay buổi hôm nay)' : 'Trợ giảng phụ trách Trạm Digi',
    phone: '0988 123 456',
    email: `${currentActiveAssistantName.toLowerCase().replace(/\s+/g, '')}@rinoedu.vn`,
    avatar: substituteAssistant
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  }

  const handleChangeAssistantConfirm = (data: {
    assistantName: string
    isTemporaryOneDay: boolean
    reason: string
  }) => {
    if (data.isTemporaryOneDay) {
      setSubstituteAssistant(data.assistantName)
      toast.success(`Đã phân công ${data.assistantName} trực thay cho ${mainAssistant} ca hôm nay!`)
    } else {
      setMainAssistant(data.assistantName)
      setSubstituteAssistant(null)
      toast.success(`Đã đổi trợ giảng chính thành ${data.assistantName} cố định cho toàn bộ các ca!`)
    }
  }

  const handleResetSubstitute = () => {
    setSubstituteAssistant(null)
    toast.info(`Đã khôi phục trợ giảng chính: ${mainAssistant}`)
  }

  const handleAttendanceChange = (
    bookingId: string,
    newStatus: 'present' | 'late' | 'absent' | 'excused'
  ) => {
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b
        if (newStatus === 'present') {
          const updatedLessons = b.selectedLessons.map((l, idx) =>
            idx === 0 && (!l.status || l.status === 'pending')
              ? { ...l, status: 'in_progress' as const }
              : l
          )
          return {
            ...b,
            status: 'dang_hoc',
            notes: undefined,
            checkInAt: b.checkInAt || timeNow,
            selectedLessons: updatedLessons,
          }
        }
        if (newStatus === 'late') {
          return {
            ...b,
            status: 'dang_hoc',
            notes: 'Đến muộn',
            checkInAt: b.checkInAt || timeNow,
          }
        }
        if (newStatus === 'absent') {
          return { ...b, status: 'da_vang', notes: 'Vắng mặt' }
        }
        if (newStatus === 'excused') {
          return { ...b, status: 'cancelled', notes: 'Nghỉ có phép' }
        }
        return b
      })
    )
    toast.success('Đã cập nhật trạng thái điểm danh!')
  }

  const handleReturnDevice = (bookingId: string, studentName: string, deviceCode?: string) => {
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b
        return {
          ...b,
          status: 'completed',
          completedAt: timeNow,
        }
      })
    )
    toast.success(`Đã thu máy ${deviceCode ? `${deviceCode} ` : ''}của học viên ${studentName}!`)
  }

  const handleAssignDevice = (bookingId: string, studentName: string, deviceCode: string) => {
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b
        return {
          ...b,
          deviceCode,
          status: b.status === 'da_xep_lich' ? 'dang_hoc' : b.status,
          checkInAt: b.checkInAt || timeNow,
        }
      })
    )
    toast.success(`Đã cấp máy ${deviceCode} & tự động đăng nhập tài khoản cho ${studentName}!`)
  }

  const handleToggleLessonStatus = (bookingId: string, lessonId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b
        const updatedLessons = b.selectedLessons.map((l) => {
          if (l.lessonId !== lessonId) return l
          const nextStatus: 'completed' | 'skipped' | 'in_progress' | 'pending' =
            l.status === 'completed'
              ? 'skipped'
              : l.status === 'skipped'
              ? 'pending'
              : l.status === 'pending'
              ? 'in_progress'
              : 'completed'
          return { ...l, status: nextStatus }
        })
        return { ...b, selectedLessons: updatedLessons }
      })
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[96vw] max-w-[1360px] sm:max-w-[1360px] h-[92vh] max-h-[92vh] flex flex-col p-4 gap-3.5 bg-zinc-100 dark:bg-zinc-950 overflow-hidden shadow-2xl border-border select-none"
      >
        <div className="flex items-center justify-between w-full shrink-0">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              title="Trở lại"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="hover:text-foreground cursor-pointer font-bold text-foreground">
                Ca tự học Digi
              </span>
              <span className="text-zinc-400">/</span>
              <span>Chi tiết buổi học</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Đang chuyển đến ca tự học trước')}
              className="h-8 px-2.5 text-xs font-semibold text-foreground hover:bg-accent gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Buổi trước
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-bold text-foreground hover:bg-accent px-2.5 py-1.5 rounded-md border border-border/80 transition-colors"
                >
                  <span className="font-mono">{session.dateDisplay || '19/08/2026'}</span>
                  <span className="text-purple-700 dark:text-purple-300 font-mono font-bold">
                    ({session.timeLabel}–{session.endTimeLabel})
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => toast.info('Đang xem ca hiện tại')}>
                  Ca tối hôm nay (18:00–21:00)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Chuyển ca ngày mai')}>
                  Ca tối ngày mai (18:00–21:00)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Đang chuyển đến ca tự học sau')}
              className="h-8 px-2.5 text-xs font-semibold text-foreground hover:bg-accent gap-1"
            >
              Buổi sau
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground ml-1"
              title="Đóng (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden gap-3.5">
          <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden gap-2.5">
            <div className="shrink-0 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 space-y-2 shadow-2xs">
              <div>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
                  <span>Ca tự học Digi: {session.schoolRoom}</span>
                  <Badge variant="outline" className="rounded-full text-[9px] font-bold px-1.5 py-0 border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {session.statusLabel || 'Đang diễn ra'}
                  </Badge>
                </DialogTitle>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <PenSquare className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Luyện tập bài học Digi theo lộ trình cá nhân hóa..."
                  className="w-full bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden font-normal"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse table-auto">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-xs text-muted-foreground text-[11px] font-semibold border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-3 w-[22%]">Học viên</th>
                      <th className="py-2.5 px-2.5 w-[14%]">Điểm danh</th>
                      <th className="py-2.5 px-3 w-[36%]">Bài học & Tiến độ</th>
                      <th className="py-2.5 px-2.5 w-[13%]">Thiết bị</th>
                      <th className="py-2.5 px-3 w-[15%]">Giờ vào — ra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {currentBookings.map((booking, idx) => {
                      const isWaiting = booking.status === 'da_xep_lich'
                      const isInSession = booking.status === 'dang_hoc'
                      const isDone = booking.status === 'completed'
                      const isCancelled = booking.status === 'cancelled' || booking.status === 'da_vang'
                      const avatarClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                      const initialLetter = (booking.studentEnglishName?.charAt(0) || booking.studentName.charAt(0)).toUpperCase()
                      const cleanDevice = booking.deviceCode?.replace(/\s*\(.*?\)/g, '')

                      const completedLessonsCount = booking.selectedLessons.filter((l) => l.status === 'completed').length
                      const skippedLessonsCount = booking.selectedLessons.filter((l) => l.status === 'skipped').length
                      const inProgressLessonsCount = booking.selectedLessons.filter((l) => l.status === 'in_progress').length

                      return (
                        <tr key={booking.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                          {/* 1. Cột Học viên: Tên tiếng Anh (in đậm, màu đen) + Tên tiếng Việt (text thường, không in đậm, màu đen) */}
                          <td className="py-2.5 px-3 align-middle">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border', avatarClass)}>
                                {initialLetter}
                              </div>
                              <div className="min-w-0 leading-tight">
                                {booking.studentEnglishName ? (
                                  <>
                                    <span className="font-bold text-xs text-foreground block leading-tight truncate">
                                      {booking.studentEnglishName}
                                    </span>
                                    <span className="font-normal text-[11px] text-foreground/80 block leading-tight truncate mt-0.5">
                                      {booking.studentName}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-bold text-xs text-foreground block leading-tight truncate">
                                    {booking.studentName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. Cột Điểm danh (Icon + vòng tròn khi chưa điểm danh) */}
                          <td className="py-2.5 px-2.5 align-middle">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {booking.status === 'da_vang' ? (
                                  <Button
                                    type="button"
                                    size="xs"
                                    className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900 font-medium text-[10px] h-6 px-2 rounded-md cursor-pointer transition-all shadow-2xs"
                                  >
                                    <span>Vắng mặt</span>
                                    <ChevronDown className="h-2.5 w-2.5 ml-1 opacity-60" />
                                  </Button>
                                ) : booking.status === 'cancelled' ? (
                                  <Button
                                    type="button"
                                    size="xs"
                                    className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900 font-medium text-[10px] h-6 px-2 rounded-md cursor-pointer transition-all shadow-2xs"
                                  >
                                    <span>Nghỉ phép</span>
                                    <ChevronDown className="h-2.5 w-2.5 ml-1 opacity-60" />
                                  </Button>
                                ) : booking.notes === 'Đến muộn' ? (
                                  <Button
                                    type="button"
                                    size="xs"
                                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 font-medium text-[10px] h-6 px-2 rounded-md cursor-pointer transition-all shadow-2xs flex items-center gap-1"
                                  >
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>Đến muộn</span>
                                    <ChevronDown className="h-2.5 w-2.5 ml-0.5 opacity-60" />
                                  </Button>
                                ) : (booking.status === 'dang_hoc' || booking.status === 'completed') ? (
                                  <Button
                                    type="button"
                                    size="xs"
                                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 font-medium text-[10px] h-6 px-2 rounded-md cursor-pointer transition-all shadow-2xs flex items-center gap-1"
                                  >
                                    <Check className="h-2.5 w-2.5 stroke-[2.5px]" />
                                    <span>Có mặt</span>
                                    <ChevronDown className="h-2.5 w-2.5 ml-0.5 opacity-60" />
                                  </Button>
                                ) : (
                                  <button
                                    type="button"
                                    className="h-6 w-6 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary flex items-center justify-center cursor-pointer transition-all shadow-2xs"
                                    title="Bấm để điểm danh"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                )}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="w-[140px] rounded-xl shadow-xl p-1 z-50">
                                <DropdownMenuItem
                                  onClick={() => handleAttendanceChange(booking.id, 'present')}
                                  className="flex items-center gap-2 text-[11px] font-medium text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 cursor-pointer"
                                >
                                  <Check className="h-3 w-3 stroke-[2.5px]" />
                                  <span>Đã đến</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleAttendanceChange(booking.id, 'late')}
                                  className="flex items-center gap-2 text-[11px] font-medium text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20 cursor-pointer"
                                >
                                  <Clock className="h-3 w-3" />
                                  <span>Đến muộn</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleAttendanceChange(booking.id, 'absent')}
                                  className="flex items-center gap-2 text-[11px] font-medium text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 cursor-pointer"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  <span>Vắng</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>

                          {/* 3. Cột Bài học & Tiến độ */}
                          <td className="py-2.5 px-3 align-middle">
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                              <span className="font-medium text-foreground text-xs">
                                {booking.totalLessons} bài ({booking.totalMinutes}p)
                              </span>
                              {isCancelled ? (
                                <span className="inline-flex items-center text-[10px] font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded-md">
                                  Không đến (0/{booking.totalLessons})
                                </span>
                              ) : completedLessonsCount === booking.totalLessons && booking.totalLessons > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 rounded-md">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                  Xong {completedLessonsCount}/{booking.totalLessons} bài
                                </span>
                              ) : skippedLessonsCount > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-orange-700 bg-orange-100 dark:bg-orange-950/60 dark:text-orange-300 px-1.5 py-0.2 rounded-md">
                                  <AlertCircle className="h-3 w-3 text-orange-600" />
                                  Xong {completedLessonsCount}/{booking.totalLessons} (Bỏ dở {skippedLessonsCount})
                                </span>
                              ) : inProgressLessonsCount > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 rounded-md">
                                  <Clock className="h-3 w-3 text-amber-600 animate-pulse" />
                                  Đang học ({completedLessonsCount}/{booking.totalLessons})
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  Chờ bắt đầu
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              {booking.selectedLessons.map((l) => {
                                const isLessonDone = l.status === 'completed'
                                const isLessonInProgress = l.status === 'in_progress'
                                const isLessonSkipped = l.status === 'skipped'
                                const isLessonPending = !l.status || l.status === 'pending'

                                return (
                                  <div
                                    key={l.lessonId}
                                    onClick={() => handleToggleLessonStatus(booking.id, l.lessonId)}
                                    className={cn(
                                      'flex items-center gap-1.5 text-xs py-0.5 px-1.5 rounded-md transition-colors cursor-pointer group select-none',
                                      isLessonDone && 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium',
                                      isLessonInProgress && 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-normal',
                                      isLessonSkipped && 'bg-orange-50/80 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 line-through font-normal',
                                      isLessonPending && 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 font-normal'
                                    )}
                                    title="Bấm để chuyển trạng thái bài học (Đã học / Bỏ dở / Đang học / Chưa học)"
                                  >
                                    {isLessonDone && (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    )}
                                    {isLessonInProgress && (
                                      <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 animate-spin" />
                                    )}
                                    {isLessonSkipped && (
                                      <AlertCircle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                                    )}
                                    {isLessonPending && (
                                      <Circle className="h-3 w-3 text-zinc-300 dark:text-zinc-600 shrink-0" />
                                    )}

                                    <span className="truncate">{l.lessonName}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </td>

                          {/* 4. Cột Thiết bị: Hiển thị phẳng, quản lý cấp máy & thu máy */}
                          <td className="py-2.5 px-2.5 align-middle">
                            {cleanDevice ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                                  <Laptop className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                  {cleanDevice}
                                </span>
                                {isDone ? (
                                  <span className="text-[9.5px] text-zinc-500 font-normal block">
                                    ✓ Đã thu máy
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleReturnDevice(booking.id, booking.studentName, cleanDevice)}
                                    className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded cursor-pointer transition-all shadow-2xs"
                                    title="Thu hồi máy của học viên"
                                  >
                                    <Check className="h-2.5 w-2.5" />
                                    Thu máy
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center text-[10px] font-medium text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded cursor-pointer transition-all shadow-2xs"
                                      title="Cấp máy cho học viên"
                                    >
                                      + Cấp máy
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start" className="w-36">
                                    <div className="px-2 py-1 text-[9px] font-medium text-muted-foreground uppercase tracking-wider border-b">
                                      Chọn máy cấp:
                                    </div>
                                    {['PC-01', 'PC-02', 'PC-03', 'PC-04', 'iPad-01', 'iPad-02', 'iPad-03'].map((dev) => (
                                      <DropdownMenuItem key={dev} onClick={() => handleAssignDevice(booking.id, booking.studentName, dev)} className="text-xs">
                                        {dev}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </td>

                          {/* 5. Cột Giờ vào — ra */}
                          <td className="py-2.5 px-3 align-middle">
                            <div className="flex items-center gap-1.5 text-xs font-medium font-mono text-foreground">
                              <span className="text-purple-700 dark:text-purple-300">{booking.startTime}</span>
                              <span className="text-muted-foreground font-normal">→</span>
                              <span>{booking.endTime}</span>
                            </div>
                            <div className="text-[9.5px] mt-0.5 leading-tight">
                              {isDone && booking.completedAt && (
                                <span className="text-zinc-500 font-normal block">
                                  Vào: {booking.checkInAt || booking.startTime} • Ra: {booking.completedAt}
                                </span>
                              )}
                              {isInSession && booking.checkInAt && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-normal block">
                                  Đã vào: {booking.checkInAt}
                                </span>
                              )}
                              {isWaiting && (
                                <span className="text-sky-600 dark:text-sky-400 font-normal block">
                                  Chờ vào {booking.startTime}
                                </span>
                              )}
                              {isCancelled && (
                                <span className="text-rose-500 font-normal block">
                                  Không đến
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 👉 RIGHT PANEL (Sidebar cố định 340px) */}
          <div className="w-[340px] shrink-0 flex flex-col min-h-0 overflow-y-auto gap-3 pt-0.5 px-1 pr-1.5 custom-scrollbar">
            {/* ── 5 SMART CARDS THỐNG KÊ (HÀNG 5 THẺ RỰC RỠ TRÊN CÙNG) ── */}
            <div className="shrink-0 grid grid-cols-5 gap-1.5">
              <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-1.5 text-center shadow-2xs">
                <p className="text-[9px] text-muted-foreground font-medium leading-none">Sĩ số</p>
                <p className="text-xs font-bold font-mono text-foreground leading-tight mt-1">{currentBookings.length}</p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-1.5 text-center shadow-2xs">
                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium leading-none">Có mặt</p>
                <p className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300 leading-tight mt-1">
                  {activeCount + completedCount}/{currentBookings.length}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/20 p-1.5 text-center shadow-2xs">
                <p className="text-[9px] text-red-600 dark:text-red-400 font-medium leading-none">Phép/Vắng</p>
                <p className="text-xs font-bold font-mono text-red-700 dark:text-red-300 leading-tight mt-1">
                  {absentCount}·0
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20 p-1.5 text-center shadow-2xs">
                <p className="text-[9px] text-amber-600 dark:text-amber-400 font-medium leading-none">Chờ vào</p>
                <p className="text-xs font-bold font-mono text-amber-700 dark:text-amber-300 leading-tight mt-1">{waitingCount}</p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-violet-200 bg-violet-50/60 dark:border-violet-900/50 dark:bg-violet-950/20 p-1.5 text-center shadow-2xs">
                <p className="text-[9px] text-violet-600 dark:text-violet-400 font-medium leading-none">Thiết bị</p>
                <p className="text-xs font-bold font-mono text-violet-700 dark:text-violet-300 leading-tight mt-1">{deviceCount}</p>
              </div>
            </div>

            {/* ── KHUNG THÔNG TIN BUỔI HỌC (2 CỘT: LỊCH HỌC BÊN TRÁI, GIỜ HỌC BÊN PHẢI) ── */}
            <div className="shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Thông tin buổi học
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-6 w-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer border-none bg-transparent"
                      title="Chỉnh sửa ca trực / nhân sự"
                    >
                      <PenSquare className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl p-1 shadow-xl z-50">
                    <DropdownMenuItem
                      onClick={() => {
                        setChangeAssistantScope('all_future')
                        setIsChangeAssistantOpen(true)
                      }}
                      className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 cursor-pointer"
                    >
                      <Repeat className="h-3.5 w-3.5 text-purple-600" />
                      <span>Đổi Trợ giảng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setChangeAssistantScope('today_only')
                        setIsChangeAssistantOpen(true)
                      }}
                      className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer"
                    >
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>Dạy thay</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 text-xs pt-0.5">
                {/* 1. Lịch học & Giờ học (Lặp lại hàng ngày) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="leading-tight min-w-0">
                      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Lịch học</p>
                      <span className="font-semibold text-foreground font-mono block">
                        {session.dateDisplay || session.date}
                      </span>
                      <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1 mt-0.5">
                        <Repeat className="h-2.5 w-2.5 shrink-0" />
                        Hàng ngày (18h–21h)
                      </span>
                    </div>
                  </div>

                  <div className="leading-tight">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Giờ ca trực</p>
                    <span className="font-semibold text-foreground font-mono block text-purple-700 dark:text-purple-300 font-bold">
                      {session.timeLabel}–{session.endTimeLabel}
                    </span>
                  </div>
                </div>

                {/* 2. Cơ sở & Phòng học */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="leading-tight min-w-0">
                      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Cơ sở</p>
                      <span className="font-semibold text-foreground truncate block">
                        {session.branch || 'RinoEdu Linh Đàm'}
                      </span>
                    </div>
                  </div>

                  <div className="leading-tight">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Phòng học</p>
                    <span className="font-semibold text-foreground flex items-center gap-1 flex-wrap">
                      <span>{session.schoolRoom}</span>
                      <button
                        onClick={() => toast.info('Phòng học vận hành bình thường')}
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-rose-50 text-rose-500 cursor-pointer border-none p-0 shrink-0"
                        title="Báo cáo sự cố phòng học"
                      >
                        <AlertTriangle className="h-3 w-3 fill-rose-100/50" />
                      </button>
                    </span>
                  </div>
                </div>

                {/* 3. Tên lớp & Mã lớp (Mã lớp để trống —) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="leading-tight min-w-0">
                      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Tên lớp</p>
                      <span className="font-semibold text-foreground truncate block">
                        Ca tự học Digi
                      </span>
                    </div>
                  </div>

                  <div className="leading-tight">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Mã lớp</p>
                    <span className="font-semibold text-muted-foreground font-mono">
                      —
                    </span>
                  </div>
                </div>

                {/* 4. Người trực là Trợ giảng & Trợ giảng trực ca (có icon Đổi / Dạy thay) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <User className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="leading-tight min-w-0">
                      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Người trực</p>
                      <span className="font-semibold text-foreground truncate block">
                        Trợ giảng
                      </span>
                    </div>
                  </div>

                  <div className="leading-tight min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-[10px] text-muted-foreground font-medium">Trợ giảng trực ca</p>
                      <button
                        type="button"
                        onClick={() => {
                          setChangeAssistantScope('today_only')
                          setIsChangeAssistantOpen(true)
                        }}
                        className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-0.5 cursor-pointer hover:underline p-0 border-none bg-transparent"
                        title="Đổi trợ giảng hoặc phân công trực thay"
                      >
                        <ArrowLeftRight className="h-2.5 w-2.5" />
                        Đổi
                      </button>
                    </div>

                    {substituteAssistant ? (
                      <div className="space-y-0.5">
                        <PersonnelHoverCard person={assistantPerson} align="end">
                          <div className="flex items-center gap-1.5 cursor-pointer group hover:opacity-85 transition-opacity">
                            <Avatar className="h-4.5 w-4.5 border border-amber-300 shrink-0">
                              <AvatarImage src={assistantPerson.avatar || ''} alt={assistantPerson.name} />
                              <AvatarFallback className="bg-amber-100 text-amber-800 text-[8px] font-bold">
                                {assistantPerson.name.slice(-2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-amber-700 dark:text-amber-300 group-hover:underline truncate text-xs">
                              {substituteAssistant}
                            </span>
                          </div>
                        </PersonnelHoverCard>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-none text-[8.5px] px-1 py-0 font-bold">
                            Trực thay 1 buổi
                          </Badge>
                          <button
                            type="button"
                            onClick={handleResetSubstitute}
                            className="text-[9px] text-muted-foreground hover:text-rose-600 cursor-pointer underline"
                            title="Khôi phục trợ giảng chính"
                          >
                            Hủy thay
                          </button>
                        </div>
                      </div>
                    ) : (
                      <PersonnelHoverCard person={assistantPerson} align="end">
                        <div className="flex items-center gap-1.5 cursor-pointer group hover:opacity-85 transition-opacity pt-0.5">
                          <Avatar className="h-4.5 w-4.5 border border-purple-200 shrink-0">
                            <AvatarImage src={assistantPerson.avatar || ''} alt={assistantPerson.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-[8px] font-bold">
                              TH
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-foreground group-hover:text-primary group-hover:underline truncate text-xs">
                            {mainAssistant}
                          </span>
                        </div>
                      </PersonnelHoverCard>
                    )}
                  </div>
                </div>

                {/* 5. Quy mô & Trình độ (Trình độ để trống —) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <Users className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Quy mô</p>
                      <span className="font-semibold text-foreground">
                        1:8 (Chỗ)
                      </span>
                    </div>
                  </div>

                  <div className="leading-tight">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Trình độ</p>
                    <span className="font-semibold text-muted-foreground">
                      —
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal thay đổi trợ giảng / phân công trực thay */}
        <DigiChangeAssistantDialog
          open={isChangeAssistantOpen}
          onOpenChange={setIsChangeAssistantOpen}
          currentAssistantName={mainAssistant}
          substituteAssistantName={substituteAssistant || undefined}
          initialScope={changeAssistantScope}
          onConfirm={handleChangeAssistantConfirm}
        />
      </DialogContent>
    </Dialog>
  )
}
