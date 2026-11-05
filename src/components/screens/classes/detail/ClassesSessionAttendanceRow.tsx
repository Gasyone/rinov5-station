'use client'

import React, { useState, useMemo } from 'react'
import {
  MessageSquarePlus,
  ExternalLink,
  Star,
  Check,
  PenSquare,
  PhoneCall,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { StatusBadge, ConfirmDialog } from '@/components/shared'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { RosterStudent, TestScoreData } from './classesDetailTypes'
import {
  getInitials,
  getAvatarColor,
  deriveHomeworkLink,
  AttendanceStatus,
  stableHash,
  isSessionInFuture,
} from './classesSessionDetailHelpers'
import { getStudentNameParts, maskPhone } from './classesDetailHelpers'
import { useCallStore } from '@/stores/useCallStore'

interface ClassesSessionAttendanceRowProps {
  student: RosterStudent
  sessionId: string
  sessionDate?: string
  isTestSession: boolean
  isMath: boolean
  isProjectSession?: boolean
  projectUrl?: string
  isAttendanceDisabled: boolean
  isScoreDisabled: boolean
  att: AttendanceStatus
  fb: string
  rating: number
  isExcused: boolean
  hasLeave: boolean
  testScores?: Record<string, Record<string, TestScoreData>>
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void
  onOpenTestScoreDialog?: (studentId: string, skill: string) => void
  onOpenCareDetail?: (student: RosterStudent) => void
  setIsBulkFeedbackOpen: (open: boolean) => void
  handleOpenLeaveDialog: (student: RosterStudent) => void
  isSessionInactive?: boolean
  sessionStatus?: string
}

export function ClassesSessionAttendanceRow({
  student,
  sessionId,
  sessionDate,
  isTestSession,
  isMath,
  isProjectSession = false,
  projectUrl,
  isAttendanceDisabled: _isAttendanceDisabled,
  isScoreDisabled,
  att,
  fb,
  rating,
  isExcused,
  hasLeave,
  testScores = {},
  onAttendanceChange,
  onOpenTestScoreDialog,
  onOpenCareDetail: _onOpenCareDetail,
  setIsBulkFeedbackOpen,
  handleOpenLeaveDialog,
  isSessionInactive = false,
  sessionStatus = '',
}: ClassesSessionAttendanceRowProps) {
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false)
  const [confirmAbsentOpen, setConfirmAbsentOpen] = useState(false)
  const hwLink = deriveHomeworkLink(student.id, sessionId)
  const nameParts = getStudentNameParts(student)

  const callStatus = useCallStore((s) => s.status)
  const callStudentId = useCallStore((s) => s.studentId)
  const isCurrentCalling = callStatus !== 'idle' && callStudentId === student.id
  const studentLogs = useCallStore((s) => s.callLogs[student.id])
  const latestCallLog = studentLogs && studentLogs.length > 0 ? studentLogs[0] : null
  const hasCallLog = Boolean(latestCallLog)

  const handleOpenStudentCareTab = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`/app/renewal?studentId=${student.id}`, '_blank')
    toast.info(`Đang mở chi tiết chăm sóc của học viên ${nameParts.englishName || student.name} trên Tab mới...`)
  }

  const handleStartCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    const targetPhone = student.parentPhone || '090161294'
    const targetParent = student.parentName || 'Phụ huynh'
    const studentStatusLabel = student.status === 'trial' ? 'Học thử' : student.status === 'new' ? 'Học viên mới' : 'Chính thức'
    const attLabel = att === 'present' ? 'Có mặt' : att === 'late' ? 'Đi muộn' : att === 'excused' ? 'Nghỉ phép' : att === 'absent' ? 'Vắng không phép' : 'Chưa điểm danh'

    useCallStore.getState().startCall({
      studentId: student.id,
      studentName: nameParts.englishName ? `${nameParts.englishName} (${nameParts.vietnameseName})` : student.name,
      parentPhone: targetPhone,
      parentName: targetParent,
      studentCode: student.code,
      studentStatus: studentStatusLabel,
      attendanceStatus: attLabel,
      className: 'Kindle SA1 Pre-K',
    })

    toast.info(`Đang kết nối cuộc gọi tới ${targetParent} (${nameParts.englishName || student.name})...`)
  }

  const isFutureSession = useMemo(
    () => isSessionInFuture(sessionDate, sessionStatus),
    [sessionDate, sessionStatus]
  )

  const handleOpenMenuChange = (nextOpen: boolean) => {
    if (nextOpen && isFutureSession) {
      toast.info('Lớp học chưa diễn ra. Chỉ các lớp diễn ra trong ngày mới được điểm danh.')
      setIsAttendanceMenuOpen(false)
      return
    }
    setIsAttendanceMenuOpen(nextOpen)
  }

  const handleStatusSelect = (status: AttendanceStatus) => {
    onAttendanceChange(student.id, status)
    const statusLabels: Record<string, string> = {
      present: 'Đã đến',
      late: 'Đến muộn',
      absent: 'Vắng',
    }
    if (status === 'absent' && hasExistingFeedback) {
      toast.success(`Đã chuyển học viên ${nameParts.englishName || student.name} sang Vắng và xóa nhận xét, đánh giá`)
    } else {
      toast.success(`Đã cập nhật điểm danh học viên ${nameParts.englishName || student.name}: ${statusLabels[status] || status}`)
    }
  }

  const hasExistingFeedback = Boolean((fb && fb.trim().length > 0) || (rating && rating > 0))

  const handleSelectAbsent = () => {
    setIsAttendanceMenuOpen(false)
    if (hasExistingFeedback) {
      setConfirmAbsentOpen(true)
    } else {
      handleStatusSelect('absent')
    }
  }

  return (
    <tr
      className={cn(
        "group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors",
        hasLeave && "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/20"
      )}
    >
      {/* Avatar + Name + Level */}
      <td className={cn(
        "py-1.5 px-2",
        (isTestSession && !isMath) ? "w-[190px]" : "w-[35%] min-w-[240px]",
        hasLeave && "border-l-4 border-l-amber-500 pl-1.5"
      )}>
        <div className="flex items-center justify-between w-full gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={handleOpenStudentCareTab}
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95",
                  getAvatarColor(student.id)
                )}
                title="Nhấn để mở Tab mới chi tiết chăm sóc học viên"
              >
                {getInitials(nameParts.hasEnglishName ? nameParts.englishName! : student.name)}
              </button>
            </div>
            <div className="min-w-0 flex flex-col justify-center leading-tight">
              {/* Dòng 1: Tên tiếng Anh / Tên tiếng Việt - click mở Tab mới */}
              <div className="flex items-center gap-1.5 min-w-0 leading-tight">
                <button
                  type="button"
                  onClick={handleOpenStudentCareTab}
                  className="font-bold text-foreground text-xs truncate hover:underline hover:text-primary text-left cursor-pointer transition-colors"
                  title="Nhấn để mở Tab mới chi tiết chăm sóc học viên"
                >
                  {nameParts.hasEnglishName ? nameParts.englishName : nameParts.vietnameseName}
                </button>
                {isExcused && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" title="Có đơn xin phép" />
                )}
                {isCurrentCalling && (
                  <span className="flex h-2 w-2 relative shrink-0" title="Đang trong cuộc gọi">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </div>

              {/* Dòng 2: Tên tiếng Việt */}
              {nameParts.hasEnglishName && (
                <div className="flex items-center gap-1.5 min-w-0 leading-tight mt-0.5">
                  <span className="text-xs text-muted-foreground truncate font-normal">
                    {nameParts.vietnameseName}
                  </span>
                </div>
              )}

              {/* Dòng 3: Trình độ học viên + Nhãn Mới / Học thử cùng dòng */}
              {(student.level || student.status === 'new' || student.status === 'trial') && (
                <div className="flex items-center gap-1.5 mt-0.5 leading-none">
                  {student.level && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {student.level}
                    </span>
                  )}

                  {student.status === 'trial' && (
                    <StatusBadge
                      status="trial"
                      label="Học thử"
                      className="rounded text-[9.5px] px-1 py-0 font-normal shrink-0 leading-none h-3.5"
                    />
                  )}

                  {student.status === 'new' && (
                    <StatusBadge
                      status="new"
                      label="Mới"
                      className="rounded text-[9.5px] px-1 py-0 font-normal shrink-0 leading-none h-3.5"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action icon: Calling only */}
          <div
            className={cn(
              "shrink-0 transition-opacity duration-150 flex items-center gap-0.5",
              isCurrentCalling || hasCallLog
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto"
            )}
          >
            {/* Nút Calling (Click-to-Call) */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleStartCall}
              className={cn(
                "h-6 w-6 rounded-md transition-all shrink-0 cursor-pointer relative",
                isCurrentCalling
                  ? "text-emerald-600 bg-emerald-100/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500 animate-pulse"
                  : hasCallLog
                  ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/80"
                  : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              )}
              title={
                isCurrentCalling
                  ? `Đang trong cuộc gọi: ${maskPhone(student.parentPhone || '090161294')}`
                  : latestCallLog
                  ? `Lịch sử cuộc gọi (${latestCallLog.timestamp}):\n${latestCallLog.note}`
                  : `Gọi điện cho phụ huynh (${student.parentName || 'Phụ huynh'}: ${maskPhone(student.parentPhone || '090161294')})`
              }
            >
              <PhoneCall className={cn("h-3.5 w-3.5", (isCurrentCalling || hasCallLog) && "text-emerald-600 fill-emerald-600/20")} />
              {hasCallLog && !isCurrentCalling && (
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
              )}
            </Button>
          </div>
        </div>
      </td>

      {/* Attendance buttons column */}
      <td className={cn(
        "py-1.5 px-2",
        (isTestSession && !isMath) ? "w-[85px] text-center" : "w-[15%] min-w-[100px]"
      )}>
        <div className="flex flex-col items-center justify-center">
          {/* Click trực tiếp vào badge điểm danh để sửa */}
          <DropdownMenu open={isAttendanceMenuOpen} onOpenChange={handleOpenMenuChange}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isSessionInactive}
                onClick={(e) => {
                  if (isFutureSession) {
                    e.preventDefault()
                    e.stopPropagation()
                    toast.info('Lớp học chưa diễn ra. Chỉ các lớp diễn ra trong ngày mới được điểm danh.')
                  }
                }}
                className={cn(
                  "inline-flex items-center rounded-md bg-transparent border-none p-0 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isFutureSession
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isAttendanceMenuOpen && "ring-2 ring-primary/40"
                )}
                title={
                  isSessionInactive
                    ? "Buổi học không hoạt động"
                    : isFutureSession
                    ? "Lớp học chưa diễn ra (Chỉ điểm danh các lớp trong ngày)"
                    : "Nhấn để sửa điểm danh"
                }
              >
                {(() => {
                  if (att === 'present') {
                    return (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 font-semibold text-xs h-5.5 px-2 rounded-md shadow-2xs flex items-center gap-1 select-none">
                        <Check className="h-2.5 w-2.5 stroke-[3px]" />
                        <span>Đã đến</span>
                        <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                      </span>
                    )
                  }
                  if (att === 'late') {
                    return (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400 font-semibold text-xs h-5.5 px-2 rounded-md shadow-2xs flex items-center gap-1 select-none">
                        <span>Đến muộn</span>
                        <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                      </span>
                    )
                  }
                  if (att === 'absent' || att === 'excused') {
                    return (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400 font-semibold text-xs h-5.5 px-2 rounded-md shadow-2xs flex items-center gap-1 select-none">
                        <span>Vắng</span>
                        <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                      </span>
                    )
                  }
                  return (
                    <span className="bg-zinc-50 border border-zinc-200 text-zinc-400 font-semibold text-xs h-5.5 px-2 rounded-md shadow-2xs flex items-center gap-1 select-none">
                      <span>+ Điểm danh</span>
                    </span>
                  )
                })()}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[125px] rounded-lg shadow-xl p-1">
              <DropdownMenuItem
                disabled={att === 'present'}
                onClick={() => handleStatusSelect('present')}
                className={cn(
                  "flex items-center justify-between text-xs font-semibold cursor-pointer",
                  att === 'present'
                    ? "text-emerald-700/60 dark:text-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20 cursor-not-allowed pointer-events-none"
                    : "text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 focus:text-emerald-700 dark:focus:text-emerald-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 stroke-[3px]" />
                  <span>Đã đến</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={att === 'late'}
                onClick={() => handleStatusSelect('late')}
                className={cn(
                  "flex items-center justify-between text-xs font-semibold cursor-pointer",
                  att === 'late'
                    ? "text-amber-700/60 dark:text-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 cursor-not-allowed pointer-events-none"
                    : "text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20 focus:text-amber-700 dark:focus:text-amber-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Đến muộn</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={att === 'absent'}
                onClick={handleSelectAbsent}
                className={cn(
                  "flex items-center justify-between text-xs font-semibold cursor-pointer",
                  att === 'absent'
                    ? "text-rose-700/60 dark:text-rose-400/60 bg-rose-50/50 dark:bg-rose-950/20 cursor-not-allowed pointer-events-none"
                    : "text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 focus:text-rose-700 dark:focus:text-rose-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>Vắng</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hộp thoại xác nhận xóa nhận xét & rating khi chuyển sang Vắng */}
          <ConfirmDialog
            open={confirmAbsentOpen}
            onOpenChange={setConfirmAbsentOpen}
            title="Xác nhận chuyển trạng thái Vắng"
            description={
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  Học viên <strong className="text-foreground">{nameParts.englishName || student.name}</strong> hiện đã có nhận xét và đánh giá thái độ.
                </p>
                <p>
                  Khi chuyển sang trạng thái <strong className="text-rose-600 font-semibold">Vắng</strong>, toàn bộ nhận xét và điểm đánh giá của học viên này trong buổi học sẽ bị xóa để tránh gửi nhầm thông tin đến phụ huynh.
                </p>
                <p className="font-medium text-foreground pt-1">
                  Bạn có chắc chắn muốn tiếp tục?
                </p>
              </div>
            }
            confirmLabel="Xác nhận xóa & chuyển Vắng"
            cancelLabel="Giữ lại"
            variant="destructive"
            onConfirm={() => {
              handleStatusSelect('absent')
            }}
          />

          {/* Leave indicator */}
          {isExcused && (
            <button
              type="button"
              onClick={() => handleOpenLeaveDialog(student)}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5 mt-0.5 shrink-0"
            >
              <span>Nghỉ phép</span>
              <ExternalLink className="h-2 w-2 shrink-0" />
            </button>
          )}
        </div>
      </td>

      {/* Normal / Test session columns */}
      {isTestSession && !isMath ? (
        <>
          {['Listening', 'Reading', 'Writing', 'Speaking'].map((sk) => {
            const skScore = testScores[student.id]?.[sk]
            
            return (
              <td key={sk} className="py-1.5 px-2 text-center w-[68px]">
                {skScore?.status === 'graded' && skScore.score !== null ? (
                  sk === 'Speaking' ? (
                    <button
                      type="button"
                      disabled={isScoreDisabled}
                      onClick={() => {
                        if (isScoreDisabled) return
                        onOpenTestScoreDialog?.(student.id, sk)
                      }}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-sky-600 dark:text-sky-400 hover:underline hover:text-sky-700 font-mono bg-transparent border-none p-0 cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline disabled:hover:scale-100"
                      title="Chấm điểm / Đánh giá kỹ năng Nói"
                    >
                      <span>{skScore.score}/10</span>
                      <PenSquare className="h-2.5 w-2.5 opacity-70 shrink-0" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isScoreDisabled}
                      onClick={() => {
                        if (isScoreDisabled) return
                        if (typeof window !== 'undefined') {
                          window.open(`/app/booking_test/results/e0001?skill=${sk.toLowerCase()}&student=${encodeURIComponent(student.name)}`, '_blank')
                        }
                        toast.info(`Đang mở bài làm ${sk} của học viên ${student.name} trong tab mới`)
                      }}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-sky-600 dark:text-sky-400 hover:underline hover:text-sky-700 font-mono bg-transparent border-none p-0 cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline disabled:hover:scale-100"
                      title={`Mở tab xem chi tiết bài thi ${sk} của học viên ${student.name}`}
                    >
                      <span>{skScore.score}/10</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-70 shrink-0" />
                    </button>
                  )
                ) : skScore?.status === 'score_button' ? (
                  sk === 'Speaking' ? (
                    <Button
                      type="button"
                      size="xs"
                      disabled={isScoreDisabled}
                      onClick={() => onOpenTestScoreDialog?.(student.id, sk)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase h-5 px-1.5 rounded-md border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Score
                    </Button>
                  ) : (
                    <button
                      type="button"
                      disabled={isScoreDisabled}
                      onClick={() => {
                        if (isScoreDisabled) return
                        if (typeof window !== 'undefined') {
                          window.open(`/app/booking_test/results/e0001?skill=${sk.toLowerCase()}&student=${encodeURIComponent(student.name)}`, '_blank')
                        }
                        toast.info(`Đang mở bài thi ${sk} của học viên ${student.name} trong tab mới`)
                      }}
                      className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 hover:underline font-extrabold text-xs uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0"
                      title={`Mở tab làm bài thi ${sk}`}
                    >
                      <span>Score</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-70 shrink-0" />
                    </button>
                  )
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500 font-bold text-xs uppercase select-none tracking-wide">
                    Not Start
                  </span>
                )}
              </td>
            )
          })}
          
          {/* Overall Score */}
          <td className="py-1.5 px-2 text-center w-[60px]">
            {(() => {
              const skills = ['Listening', 'Reading', 'Writing', 'Speaking']
              const gradedSkills = skills.map(sk => testScores[student.id]?.[sk]).filter(s => s?.status === 'graded' && s.score !== null)
              
              if (gradedSkills.length === 0) {
                return <span className="text-zinc-300 text-xs font-mono font-bold">- -</span>
              }
              
              const sum = gradedSkills.reduce((acc, curr) => acc + (curr.score ?? 0), 0)
              const avg = sum / gradedSkills.length
              const rounded = Math.round(avg * 10) / 10
              
              return (
                <span className="font-extrabold text-xs text-foreground font-mono">
                  {rounded}/10
                </span>
              )
            })()}
          </td>
        </>
      ) : (
        <>
          {/* Homework link / KTĐK score / Mini project link */}
          <td className="py-1.5 px-2 w-[14%] min-w-[90px]">
            {isProjectSession ? (
              <a
                href={projectUrl || 'https://scratch.mit.edu/projects/612048882'}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1 text-sky-600 dark:text-sky-400"
                onClick={(e) => {
                  e.stopPropagation()
                  toast.info(`Đang mở bài mini project của học viên ${student.name}`)
                }}
                title="Mở bài mini project"
              >
                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                <span>Project: Link</span>
              </a>
            ) : isTestSession && isMath ? (
              <button
                type="button"
                className="text-primary hover:underline text-xs font-extrabold inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer font-mono"
                onClick={() => {
                  if (onOpenTestScoreDialog) {
                    onOpenTestScoreDialog(student.id, 'KTĐK')
                  } else {
                    toast.info(`Cập nhật điểm KTĐK cho học viên ${student.name}`)
                  }
                }}
              >
                {(() => {
                  const score = testScores[student.id]?.['KTĐK']?.score ?? ((stableHash(student.id + sessionId) % 4) + 6.0)
                  return `${score.toFixed(1)}/10`
                })()}
              </button>
            ) : hwLink ? (
              <a
                href={hwLink}
                className="text-primary hover:underline text-xs font-medium inline-flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  toast.info(`Mở bài tập về nhà của học viên ${student.name}`)
                }}
              >
                <ExternalLink className="h-2.5 w-2.5" />
                BT1 - 6/6
              </a>
            ) : (
              <span className="text-zinc-300 text-xs">—</span>
            )}
          </td>

          {/* Feedback column (always show comments) */}
          <td className="py-1.5 px-2 w-[36%] min-w-[220px]">
            {(() => {
              const isCommentDisabled = isSessionInactive || sessionStatus === 'upcoming'
              
              if (isTestSession && isMath) {
                return fb ? (
                  <div className="flex flex-col min-w-0 w-full gap-0.5">
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">Nhận xét bài kiểm tra</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isCommentDisabled}
                        className="h-5 w-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-primary transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setIsBulkFeedbackOpen(true)}
                        title="Nhận xét học viên"
                      >
                        <MessageSquarePlus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2 w-full" title={fb}>
                      {fb}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">KTĐK:</span>
                      <span className="text-zinc-400 dark:text-zinc-500 italic text-[10.5px] truncate">Chưa nhận xét</span>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={isCommentDisabled}
                      className="h-5 px-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400 font-semibold text-[10.5px] cursor-pointer shrink-0 transition-all flex items-center gap-1 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setIsBulkFeedbackOpen(true)}
                      title="Nhận xét học viên"
                    >
                      <MessageSquarePlus className="h-2.5 w-2.5" />
                      <span>Nhận xét</span>
                    </Button>
                  </div>
                )
              }

              return fb ? (
                <div className="flex flex-col min-w-0 w-full gap-0.5">
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground shrink-0">Thái độ:</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isCommentDisabled}
                      className="h-5 w-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-primary transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setIsBulkFeedbackOpen(true)}
                      title="Nhận xét học viên"
                    >
                      <MessageSquarePlus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-2 w-full" title={fb}>
                    {fb}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-medium text-muted-foreground shrink-0">Thái độ:</span>
                    <div className="flex items-center gap-0.5 text-zinc-200 dark:text-zinc-700 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-zinc-200 dark:text-zinc-800"
                        />
                      ))}
                    </div>
                    <span className="text-zinc-400 dark:text-zinc-500 italic text-[10.5px] truncate ml-1">Chưa nhận xét</span>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={isCommentDisabled}
                    className="h-5 px-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400 font-semibold text-[10.5px] cursor-pointer shrink-0 transition-all flex items-center gap-1 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setIsBulkFeedbackOpen(true)}
                    title="Nhận xét học viên"
                  >
                    <MessageSquarePlus className="h-2.5 w-2.5" />
                    <span>Nhận xét</span>
                  </Button>
                </div>
              )
            })()}
          </td>
        </>
      )}
    </tr>
  )
}
