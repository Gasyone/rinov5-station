'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Calendar,
  CalendarX,
  ChevronDown,
  ChevronUp,
  DoorClosed,
  MoreHorizontal,
  RotateCcw,
  Upload,
  UserCog,
  UserPlus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { formatDateWithDay, splitDateWithDay } from './classesSessionDetailHelpers'
import { cleanTeacherName, cleanAssistantName } from './classesDetailHelpers'
import { ConfirmDialog } from '@/components/shared'
import { ClassesSessionCardMediaModal } from './ClassesSessionCardMediaModal'

import type { ClassesSessionCardProps } from './session-card/sessionCardTypes'
import { getSessionMetrics, getSessionTone } from './session-card/sessionCardTypes'
import { SessionCardPersonRoomText } from './session-card/SessionCardPersonRoomText'
import { SessionCardAssistantDialog } from './session-card/SessionCardAssistantDialog'
import { SessionCardLessonsExpand } from './session-card/SessionCardLessonsExpand'
import { SessionCardRemark } from './session-card/SessionCardRemark'
import { SessionCardMaterials } from './session-card/SessionCardMaterials'

export type { ClassesSessionCardProps }
export { getSessionMetrics }

export function ClassesSessionCard({
  session,
  roster,
  onView,
  onCancel,
  onEditTeacher,
  onEditRoom,
  onUpload,
  onReschedule,
  onDeleteMaterial,
  onUpdateSession,
}: ClassesSessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddingAssistant, setIsAddingAssistant] = useState(false)
  const [, setAssistantNameState] = useState<string | null>(session.assistantName || null)
  const [previewMedia, setPreviewMedia] = useState<{ name: string; url: string; type?: string; thumbnailUrl?: string } | null>(null)

  const [revertConfirm, setRevertConfirm] = useState<{
    open: boolean
    title: string
    description: string
    confirmLabel: string
    onConfirm: () => void
  }>({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Xác nhận',
    onConfirm: () => {},
  })

  const handleRequestRevertTeacher = () => {
    setRevertConfirm({
      open: true,
      title: 'Xác nhận hoàn dạy thay giáo viên',
      description: `Bạn có chắc chắn muốn hủy giáo viên dạy thay (${cleanTeacherName(session.substituteTeacherName || '')}) và khôi phục giáo viên chính (${cleanTeacherName(session.teacherName)}) cho Buổi ${session.sessionNumber}?`,
      confirmLabel: 'Khôi phục GV chính',
      onConfirm: () => {
        onUpdateSession?.(session.id, {
          substituteTeacherName: undefined,
          coverType: undefined,
          coverNote: undefined,
        })
        toast.success('Đã xóa giáo viên cover, khôi phục giáo viên chính!')
      },
    })
  }

  const handleRequestRevertAssistant = () => {
    const defaultTA = session.defaultAssistantName || session.assistantName || 'Hoàng Anh'
    const activeTA = session.substituteAssistantName || session.assistantName || 'Hoàng Anh'
    setRevertConfirm({
      open: true,
      title: 'Xác nhận hoàn trợ giảng cover',
      description: `Bạn có chắc chắn muốn hủy trợ giảng cover (${cleanAssistantName(activeTA)}) và khôi phục trợ giảng chính (${cleanAssistantName(defaultTA)}) cho Buổi ${session.sessionNumber}?`,
      confirmLabel: 'Khôi phục TA chính',
      onConfirm: () => {
        onUpdateSession?.(session.id, {
          substituteAssistantName: undefined,
        })
        toast.success('Đã xóa trợ giảng cover, khôi phục trợ giảng chính!')
      },
    })
  }

  const handleRequestRevertRoom = () => {
    setRevertConfirm({
      open: true,
      title: 'Xác nhận hoàn đổi phòng / cơ sở',
      description: `Bạn có chắc chắn muốn hủy phòng học đã đổi (${session.room}) và khôi phục về phòng gốc (${session.defaultRoom || 'gốc'}) cho Buổi ${session.sessionNumber}?`,
      confirmLabel: 'Khôi phục phòng gốc',
      onConfirm: () => {
        onUpdateSession?.(session.id, {
          room: session.defaultRoom!,
        })
        toast.success('Đã hủy đổi phòng, khôi phục phòng học gốc!')
      },
    })
  }

  const handleRequestRevertSchedule = () => {
    setRevertConfirm({
      open: true,
      title: 'Xác nhận hoàn đổi lịch học',
      description: `Bạn có chắc chắn muốn hủy ngày học đã đổi và khôi phục về ngày học ban đầu cho Buổi ${session.sessionNumber}?`,
      confirmLabel: 'Khôi phục lịch ban đầu',
      onConfirm: () => {
        onUpdateSession?.(session.id, {
          date: session.originalDate || session.date,
          rescheduleDate: undefined,
          originalDate: undefined,
          rescheduleNote: undefined,
        })
        toast.success('Đã hủy đổi giờ, khôi phục ngày học ban đầu!')
      },
    })
  }

  const handleRequestRevertCancelledSession = () => {
    setRevertConfirm({
      open: true,
      title: 'Xác nhận khôi phục buổi học',
      description: `Bạn có chắc chắn muốn hoàn lại Buổi ${session.sessionNumber} từ trạng thái Hủy về trạng thái Sắp tới?`,
      confirmLabel: 'Khôi phục buổi học',
      onConfirm: () => {
        onUpdateSession?.(session.id, {
          status: 'upcoming',
          cancelBy: undefined,
          cancelReason: undefined,
          cancelDescription: undefined,
        })
        toast.success('Đã hoàn lại buổi học thành công!')
      },
    })
  }

  const isInactive = session.status === 'cancelled' || session.status === 'absent'
  const isCompleted = session.status === 'completed'
  const canManage = session.status === 'upcoming' || session.status === 'ongoing'

  const isTestSession = (
    session.sessionNumber % 3 === 0 ||
    (session.topic || '').toLowerCase().includes('test') ||
    (session.topic || '').toLowerCase().includes('kiểm tra') ||
    (session.topic || '').toLowerCase().includes('evaluation')
  )

  const metrics = getSessionMetrics(session.id, isTestSession)

  return (
    <article
      onClick={() => onView(session)}
      className={cn(
        'flex flex-col gap-2 rounded-xl border px-3 py-2.5 shadow-2xs transition-all cursor-pointer',
        getSessionTone(session)
      )}
    >
      {/* Top Header: Topic Title on Left; Date/Time + Chevron on Right */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-1.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <h5 className={cn(
            'text-xs md:text-sm font-semibold leading-snug',
            isInactive ? 'text-muted-foreground line-through' : 'text-foreground'
          )}>
            Buổi {session.sessionNumber}: {session.topic}
          </h5>

          {isTestSession && (
            <Badge variant="outline" className="rounded-md text-[9px] px-1.5 py-0 font-medium border-border bg-muted/40 text-muted-foreground">
              Buổi kiểm tra
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {session.status === 'cancelled' && !isCompleted && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                handleRequestRevertCancelledSession()
              }}
              className="h-6 px-2.5 rounded-md border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-xs gap-1 shadow-2xs cursor-pointer"
              title="Khôi phục buổi học bị hủy về trạng thái sắp tới"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Hoàn buổi</span>
            </Button>
          )}

          {isCompleted && (
            <Badge variant="outline" className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shrink-0">
              Đã điểm danh
            </Badge>
          )}
          <span className="text-xs font-normal text-muted-foreground">
            {session.rescheduleDate || session.originalDate ? (
              <>
                <span className="line-through opacity-60 me-1">
                  {formatDateWithDay(session.originalDate || session.date)}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold me-1">
                  → {formatDateWithDay(session.rescheduleDate || session.date)}
                </span>
                {!isCompleted && onUpdateSession && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRequestRevertSchedule()
                    }}
                    className="inline-flex items-center gap-0.5 ml-1 px-1 py-0.5 rounded text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Hủy đổi giờ, khôi phục ngày học gốc"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Hủy đổi giờ</span>
                  </button>
                )}
              </>
            ) : (() => {
              const dInfo = splitDateWithDay(session.date)
              return dInfo ? (
                <>
                  {dInfo.dayOfWeek && <strong className="font-bold text-foreground me-1">{dInfo.dayOfWeek},</strong>}
                  {dInfo.dateRest}
                </>
              ) : (
                formatDateWithDay(session.date)
              )
            })()}{' '}
            ({session.startTime} - {session.endTime})
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded((prev) => !prev)
            }}
            title={isExpanded ? 'Thu gọn bài học' : 'Mở rộng nội dung bài học từ Lộ trình'}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Sub-header Metadata Row: Left = Teacher (GV), Assistant (TG), Room; Right = Abbreviated Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-0.5">
        <SessionCardPersonRoomText
          session={session}
          onUpdateSession={onUpdateSession}
          onRevertTeacher={handleRequestRevertTeacher}
          onRevertAssistant={handleRequestRevertAssistant}
          onRevertRoom={handleRequestRevertRoom}
        />

        {/* Header Statistics Text - Abbreviated labels (ĐD, BTVN, ĐG) */}
        {isCompleted && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground ml-auto">
            <span>
              ĐD: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{metrics.attendance.present}/{metrics.attendance.total}</span>
            </span>
            <span>•</span>
            <span>
              BTVN: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{metrics.homework.submitted}/{metrics.homework.total}</span>
            </span>
            <span>•</span>
            <span>
              ĐG: <span className="font-semibold text-amber-600 dark:text-amber-400">{metrics.rating}/5</span>
            </span>
          </div>
        )}

        {/* Action button menu (Dropdown icon ...) */}
        {canManage && (
          <div className="ml-auto flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                onView(session)
              }}
              className="h-6 px-2 text-[11px] font-semibold text-primary border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-md cursor-pointer"
            >
              Chi tiết
            </Button>

            {!isInactive && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                    title="Tùy chọn thao tác buổi học"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs z-50">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditTeacher(session.id)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <UserCog className="h-3.5 w-3.5 text-primary" />
                    <span>Đổi giáo viên</span>
                  </DropdownMenuItem>

                  {session.substituteTeacherName && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRequestRevertTeacher()
                      }}
                      className="gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer font-medium"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Xóa giáo viên cover</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditRoom(session.id)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <DoorClosed className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Đổi phòng học</span>
                  </DropdownMenuItem>

                  {session.defaultRoom && session.room !== session.defaultRoom && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRequestRevertRoom()
                      }}
                      className="gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer font-medium"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Hủy đổi phòng</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsAddingAssistant(true)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Đổi Trợ giảng</span>
                  </DropdownMenuItem>

                  {session.substituteAssistantName && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRequestRevertAssistant()
                      }}
                      className="gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer font-medium"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Xóa trợ giảng cover</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpload(session.id)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Tải lên</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onReschedule?.(session.id)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Đổi lịch</span>
                  </DropdownMenuItem>

                  {(session.rescheduleDate || session.originalDate) && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRequestRevertSchedule()
                      }}
                      className="gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer font-medium"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Hủy đổi giờ</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onCancel(session.id)
                    }}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer font-semibold"
                  >
                    <CalendarX className="h-3.5 w-3.5" />
                    <span>Hủy buổi học này</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Remark / Session Notes Section */}
      <SessionCardRemark
        session={session}
        onUpdateSession={onUpdateSession}
      />

      {/* Attached Media / Photos list (for completed sessions or sessions with uploaded files) */}
      <SessionCardMaterials
        session={session}
        onDeleteMaterial={onDeleteMaterial}
        onPreviewMedia={(media) => setPreviewMedia(media)}
      />

      {/* Assistant selection modal dialog */}
      <SessionCardAssistantDialog
        isOpen={isAddingAssistant}
        onOpenChange={setIsAddingAssistant}
        session={session}
        onUpdateSession={onUpdateSession}
        onRequestRevertAssistant={handleRequestRevertAssistant}
        setAssistantNameState={(name) => setAssistantNameState(name)}
      />

      {/* Expanded Lessons Content from Roadmap */}
      {isExpanded && <SessionCardLessonsExpand session={session} />}

      {/* Lightbox / Media Preview Dialog */}
      <ClassesSessionCardMediaModal
        previewMedia={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />

      {/* Confirmation Dialog for Reverting/Restoring Session changes */}
      <ConfirmDialog
        open={revertConfirm.open}
        onOpenChange={(open) => setRevertConfirm((prev) => ({ ...prev, open }))}
        title={revertConfirm.title}
        description={revertConfirm.description}
        confirmLabel={revertConfirm.confirmLabel}
        variant="destructive"
        onConfirm={revertConfirm.onConfirm}
      />
    </article>
  )
}
