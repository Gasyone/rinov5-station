'use client'

import React from 'react'
import {
  MessageSquarePlus,
  ExternalLink,
  Star,
  Check,
  PenSquare,
  HeartHandshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/shared'
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
} from './classesSessionDetailHelpers'
import { getStudentNameParts } from './classesDetailHelpers'

interface ClassesSessionAttendanceRowProps {
  student: RosterStudent
  sessionId: string
  isTestSession: boolean
  isMath: boolean
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
  isTestSession,
  isMath,
  isAttendanceDisabled,
  isScoreDisabled,
  att,
  fb,
  rating,
  isExcused,
  hasLeave,
  testScores = {},
  onAttendanceChange,
  onOpenTestScoreDialog,
  setIsBulkFeedbackOpen,
  onOpenCareDetail,
  handleOpenLeaveDialog,
  isSessionInactive = false,
  sessionStatus = '',
}: ClassesSessionAttendanceRowProps) {
  const hwLink = deriveHomeworkLink(student.id, sessionId)
  const isCareStudent = student.status === 'trial' || student.status === 'new' || !!student.sessionLabel
  const nameParts = getStudentNameParts(student)

  return (
    <tr
      className={cn(
        "group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors",
        hasLeave && "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/20"
      )}
    >
      {/* Avatar + Name + Hover action icons */}
      <td className={cn(
        "py-2 px-2.5",
        (isTestSession && !isMath) ? "w-[180px]" : "w-[35%] min-w-[280px]",
        hasLeave && "border-l-4 border-l-amber-500 pl-1.5"
      )}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold",
                getAvatarColor(student.id)
              )}>
                {getInitials(nameParts.hasEnglishName ? nameParts.englishName! : student.name)}
              </div>
              {isCareStudent && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-900 animate-pulse" title="Cần chăm sóc" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                {nameParts.hasEnglishName ? (
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="font-bold text-foreground text-xs truncate">{nameParts.englishName}</span>
                    <span className="text-[11px] text-muted-foreground font-normal truncate">{nameParts.vietnameseName}</span>
                  </div>
                ) : (
                  <span className="font-normal text-foreground text-xs truncate">{nameParts.vietnameseName}</span>
                )}
                {student.sessionLabel && (
                  <StatusBadge
                    status={student.sessionLabel}
                    label={
                      student.sessionLabel === 'buoi_1' ? 'Buổi 1' :
                      student.sessionLabel === 'buoi_2' ? 'Buổi 2' :
                      student.sessionLabel === 'buoi_3' ? 'Buổi 3' : 'Buổi cuối'
                    }
                    className="rounded-md text-[9px] px-1 py-0 font-semibold shrink-0"
                  />
                )}
                {isExcused && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" title="Có đơn xin phép" />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-[10px] text-muted-foreground font-mono">{student.code}</span>
                {student.level && (
                  <span className="text-[10px] text-muted-foreground font-medium bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-sm border border-zinc-200/60 dark:border-zinc-700/60 font-sans leading-none">
                    {student.level}
                  </span>
                )}
                {student.status === 'trial' && (
                  <StatusBadge status="trial" label="Học thử" className="rounded-md text-[9px] px-1 py-0 font-semibold" />
                )}
                {student.status === 'new' && (
                  <StatusBadge status="new" label="Mới" className="rounded-md text-[9px] px-1 py-0 font-semibold" />
                )}
                {isCareStudent && onOpenCareDetail && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenCareDetail(student)
                    }}
                    className="inline-flex items-center gap-0.5 rounded-md text-[9px] px-1.5 py-0.5 font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-950/50 cursor-pointer transition-colors leading-none shrink-0"
                    title="Mở chi tiết chăm sóc học viên"
                  >
                    <HeartHandshake className="h-2.5 w-2.5" />
                    <span>Cần CS</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* Attendance buttons column */}
      <td className={cn(
        "py-2 px-2.5",
        (isTestSession && !isMath) ? "w-[85px] text-center" : "w-[15%] min-w-[110px]"
      )}>
        <div className="flex flex-col items-center gap-1.5 justify-center">
          <div className="inline-flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {(() => {
                  if (att === 'present') {
                    return (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isAttendanceDisabled}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:border-emerald-900 dark:text-emerald-400 font-semibold text-[10px] h-6 px-2.5 rounded-md cursor-pointer transition-all shadow-2xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="h-3 w-3 stroke-[3px]" />
                        <span>Đã đến</span>
                      </Button>
                    )
                  }
                  if (att === 'late') {
                    return (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isAttendanceDisabled}
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400 font-semibold text-[10px] h-6 px-2.5 rounded-md cursor-pointer transition-all shadow-2xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Đến muộn</span>
                      </Button>
                    )
                  }
                  if (att === 'absent') {
                    return (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isAttendanceDisabled}
                        className="bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:border-rose-900 dark:text-rose-400 font-semibold text-[10px] h-6 px-2.5 rounded-md cursor-pointer transition-all shadow-2xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Vắng</span>
                      </Button>
                    )
                  }
                  if (att === 'excused') {
                    return (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isAttendanceDisabled}
                        className="bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:border-rose-900 dark:text-rose-400 font-semibold text-[10px] h-6 px-2.5 rounded-md cursor-pointer transition-all shadow-2xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Vắng</span>
                      </Button>
                    )
                  }
                  return (
                    <Button
                      type="button"
                      size="xs"
                      disabled={isAttendanceDisabled}
                      className="bg-zinc-50 border border-zinc-200 text-zinc-400 hover:bg-zinc-100 font-semibold text-[10px] h-6 px-2.5 rounded-md cursor-pointer transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>+ Điểm danh</span>
                    </Button>
                  )
                })()}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[120px] rounded-lg shadow-xl">
                <DropdownMenuItem
                  onClick={() => onAttendanceChange(student.id, 'present')}
                  className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 focus:text-emerald-700 dark:focus:text-emerald-400 cursor-pointer"
                >
                  <Check className="h-3 w-3 stroke-[3px]" />
                  <span>Đã đến</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAttendanceChange(student.id, 'late')}
                  className="flex items-center gap-2 text-[11px] font-semibold text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20 focus:text-amber-700 dark:focus:text-amber-400 cursor-pointer"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Đến muộn</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAttendanceChange(student.id, 'absent')}
                  className="flex items-center gap-2 text-[11px] font-semibold text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 focus:text-rose-700 dark:focus:text-rose-400 cursor-pointer"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>Vắng</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAttendanceChange(student.id, 'excused')}
                  className="flex items-center gap-2 text-[11px] font-semibold text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 focus:text-rose-700 dark:focus:text-rose-400 cursor-pointer"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>Vắng (Có phép)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Leave indicator */}
          {isExcused && (
            <button
              onClick={() => handleOpenLeaveDialog(student)}
              className="text-[10px] font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5 mt-1 shrink-0"
            >
              <span>Nghỉ phép</span>
              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
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
              <td key={sk} className="py-2 px-2.5 text-center w-[68px]">
                {skScore?.status === 'graded' && skScore.score !== null ? (
                  sk === 'Speaking' ? (
                    <button
                      disabled={isScoreDisabled}
                      onClick={() => {
                        if (isScoreDisabled) return
                        onOpenTestScoreDialog?.(student.id, sk)
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-600 dark:text-sky-400 hover:underline hover:text-sky-700 font-mono bg-transparent border-none p-0 cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline disabled:hover:scale-100"
                    >
                      <span>{skScore.score}/10</span>
                      <PenSquare className="h-2.5 w-2.5 opacity-70 shrink-0" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-extrabold text-sky-600 dark:text-sky-400 font-mono select-none">
                      {skScore.score}/10
                    </span>
                  )
                ) : skScore?.status === 'score_button' ? (
                  sk === 'Speaking' ? (
                    <Button
                      type="button"
                      size="xs"
                      disabled={isScoreDisabled}
                      onClick={() => onOpenTestScoreDialog?.(student.id, sk)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] uppercase h-5 px-1.5 rounded-md border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Score
                    </Button>
                  ) : (
                    <button
                      disabled={isScoreDisabled}
                      onClick={() => onOpenTestScoreDialog?.(student.id, sk)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-extrabold text-[10px] uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0"
                    >
                      Score
                    </button>
                  )
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500 font-bold text-[9px] uppercase select-none tracking-wide">
                    Not Start
                  </span>
                )}
              </td>
            )
          })}
          
          {/* Overall Score */}
          <td className="py-2 px-2.5 text-center w-[60px]">
            {(() => {
              const skills = ['Listening', 'Reading', 'Writing', 'Speaking']
              const gradedSkills = skills.map(sk => testScores[student.id]?.[sk]).filter(s => s?.status === 'graded' && s.score !== null)
              
              if (gradedSkills.length === 0) {
                return <span className="text-zinc-300 text-[11px] font-mono font-bold">- -</span>
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
          {/* Homework link / KTĐK score */}
          <td className="py-2.5 px-3 w-[15%] min-w-[100px]">
            {isTestSession && isMath ? (
              <button
                type="button"
                className="text-primary hover:underline text-[11px] font-extrabold inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer font-mono"
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
                className="text-primary hover:underline text-[11px] font-medium inline-flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  toast.info(`Mở bài tập về nhà của học viên ${student.name}`)
                }}
              >
                <ExternalLink className="h-3 w-3" />
                BT1 - 6/6
              </a>
            ) : (
              <span className="text-zinc-300 text-[11px]">—</span>
            )}
          </td>

          {/* Feedback column (always show comments) */}
          <td className="py-2.5 px-3 w-[35%] min-w-[300px]">
            {(() => {
              const isCommentDisabled = isSessionInactive || sessionStatus === 'upcoming'
              
              if (isTestSession && isMath) {
                return fb ? (
                  <div className="flex flex-col min-w-0 w-full">
                    <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">Nhận xét bài kiểm tra</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isCommentDisabled}
                        className="h-6 w-6 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-primary transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setIsBulkFeedbackOpen(true)}
                        title="Nhận xét học viên"
                      >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal line-clamp-3 w-full" title={fb}>
                      {fb}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col min-w-0 w-full">
                    <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">Nhận xét bài kiểm tra</span>
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={isCommentDisabled}
                        className="h-6 px-2 rounded-md bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400 font-semibold text-[10px] cursor-pointer shrink-0 transition-all flex items-center gap-1 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setIsBulkFeedbackOpen(true)}
                        title="Nhận xét học viên"
                      >
                        <MessageSquarePlus className="h-3 w-3" />
                        <span>Nhận xét</span>
                      </Button>
                    </div>
                    <span className="text-zinc-400 dark:text-zinc-600 italic text-[11px]">Chưa nhận xét</span>
                  </div>
                )
              }

              return fb ? (
                <div className="flex flex-col min-w-0 w-full">
                  <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground shrink-0">Thái độ học tập:</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
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
                      className="h-6 w-6 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-primary transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setIsBulkFeedbackOpen(true)}
                      title="Nhận xét hàng loạt"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal line-clamp-3 w-full" title={fb}>
                    {fb}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col min-w-0 w-full">
                  <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground shrink-0">Thái độ học tập:</span>
                      <div className="flex items-center gap-0.5 text-zinc-200 dark:text-zinc-700">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-zinc-200 dark:text-zinc-800"
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={isCommentDisabled}
                      className="h-6 px-2 rounded-md bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400 font-semibold text-[10px] cursor-pointer shrink-0 transition-all flex items-center gap-1 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setIsBulkFeedbackOpen(true)}
                      title="Nhận xét học viên"
                    >
                      <MessageSquarePlus className="h-3 w-3" />
                      <span>Nhận xét</span>
                    </Button>
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-600 italic text-[11px]">Chưa nhận xét</span>
                </div>
              )
            })()}
          </td>
        </>
      )}
    </tr>
  )
}
