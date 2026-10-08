'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Calendar,
  CalendarX,
  ChevronDown,
  ChevronUp,
  Clock,
  DoorClosed,
  ExternalLink,
  FileText,
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
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
import { SessionCardAssistantDialog } from './session-card/SessionCardAssistantDialog'
import { SessionCardLessonsExpand } from './session-card/SessionCardLessonsExpand'
import { SessionCardRemark } from './session-card/SessionCardRemark'
import { SessionCardMaterials } from './session-card/SessionCardMaterials'

export type { ClassesSessionCardProps }
export { getSessionMetrics }

export function ClassesSessionCard({
  session,
  isNextSession,
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

  const isTestSession = (
    session.sessionNumber % 3 === 0 ||
    (session.topic || '').toLowerCase().includes('test') ||
    (session.topic || '').toLowerCase().includes('kiểm tra') ||
    (session.topic || '').toLowerCase().includes('evaluation')
  )

  const metrics = getSessionMetrics(session.id, isTestSession)
  const [isEditingRemark, setIsEditingRemark] = useState(false)
  const defaultTA = session.defaultAssistantName || session.assistantName || 'Hoàng Anh'

  const hasBottomContent = Boolean(
    session.description ||
    isEditingRemark ||
    isExpanded ||
    (isCompleted && session.materials && session.materials.length > 0)
  )

  return (
    <article
      onClick={() => onView(session)}
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border px-2.5 py-1.5 shadow-2xs transition-all cursor-pointer',
        getSessionTone(session, isNextSession)
      )}
    >
      {/* Top Header: Topic Title on Left; Date/Time + Chevron + Menu [...] on Right */}
      <div className={cn(
        'flex flex-wrap items-center justify-between gap-1.5',
        hasBottomContent && 'border-b border-border/40 pb-1.5'
      )}>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <HoverCard openDelay={150} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(session)
                }}
                className={cn(
                  'text-xs md:text-sm font-semibold leading-snug text-left hover:text-primary hover:underline transition-colors cursor-pointer truncate max-w-full',
                  isInactive ? 'text-muted-foreground line-through' : 'text-foreground'
                )}
                title="Nhấp để mở chi tiết buổi học"
              >
                Buổi {session.sessionNumber}: {session.topic}
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              side="bottom"
              sideOffset={6}
              className="w-72 sm:w-80 p-3 rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-xl space-y-2.5 text-xs z-50 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popover Header */}
              <div className="border-b border-border/50 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-[13px] text-foreground leading-snug">
                    Buổi {session.sessionNumber}: {session.topic}
                  </h4>
                  {isCompleted ? (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 shrink-0">
                      Đã điểm danh
                    </Badge>
                  ) : isInactive ? (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold text-destructive border-destructive/30 bg-destructive/10 shrink-0">
                      Đã hủy
                    </Badge>
                  ) : isNextSession ? (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                      Buổi tiếp theo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-300 shrink-0">
                      Sắp tới
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                  <span>
                    {formatDateWithDay(session.rescheduleDate || session.date)} ({session.startTime} - {session.endTime})
                  </span>
                </div>
              </div>

              {/* Personnel & Room Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground text-xs font-medium shrink-0">Giáo viên:</span>
                  <div className="text-right truncate font-medium">
                    {session.substituteTeacherName ? (
                      <span>
                        <span className="line-through text-muted-foreground/70 mr-1">{cleanTeacherName(session.teacherName)}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {cleanTeacherName(session.substituteTeacherName)} (Dạy thay)
                        </span>
                      </span>
                    ) : (
                      <span className="text-foreground font-semibold">{cleanTeacherName(session.teacherName)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground text-xs font-medium shrink-0">Trợ giảng:</span>
                  <div className="text-right truncate font-medium">
                    {session.substituteAssistantName ? (
                      <span>
                        <span className="line-through text-muted-foreground/70 mr-1">
                          {cleanAssistantName(defaultTA)}
                        </span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {cleanAssistantName(session.substituteAssistantName)} (Cover)
                        </span>
                      </span>
                    ) : (
                      <span className="text-foreground font-semibold">
                        {cleanAssistantName(defaultTA)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground text-xs font-medium shrink-0">Phòng học:</span>
                  <span className="text-foreground font-semibold">{session.room || 'A101'}</span>
                </div>

                {isCompleted && (
                  <div className="border-t border-border/40 pt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>ĐD: <strong className="text-emerald-600 font-bold">{metrics.attendance.present}/{metrics.attendance.total}</strong></span>
                    <span>BTVN: <strong className="text-emerald-600 font-bold">{metrics.homework.submitted}/{metrics.homework.total}</strong></span>
                    <span>ĐG: <strong className="text-amber-600 font-bold">{metrics.rating}/5★</strong></span>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="border-t border-border/40 pt-2 flex items-center justify-between">
                <span className="text-[10.5px] text-muted-foreground italic">
                  Nhấp để mở chi tiết buổi học
                </span>
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onView(session)
                  }}
                  className="h-6 px-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-md cursor-pointer gap-1"
                >
                  <span>Mở chi tiết</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>

          {isNextSession && (
            <Badge variant="outline" className="rounded-md text-[10.5px] px-1.5 py-0 font-bold border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
              Buổi tiếp theo
            </Badge>
          )}

          {isTestSession && (
            <Badge variant="outline" className="rounded-md text-xs px-1.5 py-0 font-medium border-border bg-muted/40 text-muted-foreground">
              Buổi kiểm tra
            </Badge>
          )}

          {isCompleted && (
            <Badge variant="outline" className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shrink-0">
              Đã điểm danh
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
                    className="inline-flex items-center gap-0.5 ml-1 px-1 py-0.5 rounded text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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

          {!isInactive && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                  title="Tùy chọn thao tác buổi học"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
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

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditingRemark(true)
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{session.description ? 'Sửa ghi chú' : 'Thêm ghi chú'}</span>
                </DropdownMenuItem>

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
      </div>

      {/* Remark / Session Notes Section */}
      <SessionCardRemark
        session={session}
        onUpdateSession={onUpdateSession}
        isEditing={isEditingRemark}
        onEditChange={setIsEditingRemark}
      />

      {/* Attached Media / Photos list (only for completed sessions) */}
      {isCompleted && (
        <SessionCardMaterials
          session={session}
          onDeleteMaterial={onDeleteMaterial}
          onPreviewMedia={(media) => setPreviewMedia(media)}
        />
      )}

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
