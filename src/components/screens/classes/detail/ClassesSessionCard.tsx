'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowRight,
  CalendarX,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DoorClosed,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Share2,
  Upload,
  UserCheck,
  UserCog,
  UserPlus,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { AtSign } from 'lucide-react'

import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import { getLessonsForRoadmapSession, stableHash, formatDateWithDay } from './classesSessionDetailHelpers'
import { cleanTeacherName, cleanAssistantName } from './classesDetailHelpers'
import { PersonnelHoverCard } from '@/components/shared/PersonnelHoverCard'
import type { PersonnelItem } from '@/components/shared/PersonnelCell'
import { ClassesSessionCardMediaModal } from './ClassesSessionCardMediaModal'

interface ClassesSessionCardProps {
  session: RoadmapSession
  roster?: RosterStudent[]
  onView: (session: RoadmapSession) => void
  onCancel: (sessionId: string) => void
  onEditTeacher: (sessionId: string) => void
  onEditRoom: (sessionId: string) => void
  onUpload: (sessionId: string) => void
  onDeleteMaterial: (sessionId: string, materialName: string, isSlide: boolean) => void
}

export interface SessionMetrics {
  attendance: { present: number; total: number }
  homework: { submitted: number; total: number }
  rating: number
  testScore?: { graded: number; total: number; avgScore: number }
}

export function getSessionMetrics(sessionId: string, isTest: boolean): SessionMetrics {
  const hash = stableHash(sessionId)
  const total = 15 + (hash % 6)
  const present = Math.max(1, total - (hash % 3))
  const submitted = Math.max(0, present - ((hash >> 2) % 3))
  const rating = Number((4.3 + ((hash % 7) * 0.1)).toFixed(1))
  const avgScore = Number((7.6 + ((hash % 18) * 0.1)).toFixed(1))

  return {
    attendance: { present, total },
    homework: { submitted, total },
    rating,
    testScore: isTest ? { graded: present, total, avgScore } : undefined,
  }
}

function getTeacherPersonnel(teacherName: string): PersonnelItem {
  const cleanName = cleanTeacherName(teacherName)
  const nameParts = cleanName.split(' ').filter(Boolean)
  const codeSuffix = nameParts.map((n) => n[0]).join('').toUpperCase() || 'CL'

  return {
    id: `EMP-${codeSuffix}`,
    name: cleanName,
    role: 'Giáo viên chính',
    phone: '0901234567',
    email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/gi, '')}@rinoedu.com`,
  }
}

function getSessionTone(session: RoadmapSession) {
  const isCancelled = session.status === 'cancelled' || session.status === 'absent'
  const isOpeningDay = session.sessionNumber === 1
  const hasSubstitute = !!session.substituteTeacherName

  if (isCancelled) {
    return 'border-dashed border-border/60 bg-muted/15 opacity-60 hover:opacity-100'
  }
  if (isOpeningDay) {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-rose-500 hover:border-border/80 shadow-2xs'
  }
  if (hasSubstitute) {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-amber-500 hover:border-border/80 shadow-2xs'
  }
  if (session.status === 'completed') {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-zinc-300 dark:border-l-zinc-700 hover:border-border/80 shadow-2xs'
  }
  if (session.status === 'upcoming') {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-emerald-500 hover:border-border/80 shadow-2xs'
  }
  return 'bg-card text-card-foreground border-border border-l-4 border-l-primary/60 hover:border-primary/80 shadow-2xs'
}

function getMaterialMeta(name: string) {
  const lowered = name.toLowerCase()
  const isSlide = lowered.includes('slide') || lowered.includes('bài giảng')
  const isVideo = lowered.includes('.mp4') || lowered.includes('video')
  const isImage = lowered.includes('.jpg') || lowered.includes('.png') || lowered.includes('ảnh') || isSlide

  let thumbnailUrl = 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&auto=format&fit=crop&q=80'
  if (lowered.includes('slide') || lowered.includes('unit')) {
    thumbnailUrl = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&auto=format&fit=crop&q=80'
  } else if (lowered.includes('btvn') || lowered.includes('bài tập')) {
    thumbnailUrl = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80'
  }

  return { isSlide, isVideo, isImage, thumbnailUrl }
}

function getAssistantPersonnel(name: string): PersonnelItem {
  const cleanName = cleanAssistantName(name)
  const codeSuffix = cleanName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase() || 'TA'

  return {
    id: `EMP-TA-${codeSuffix}`,
    name: cleanName,
    role: 'Trợ giảng (TA)',
    phone: '0934567890',
    email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/gi, '')}@rinoedu.com`,
  }
}

function PersonRoomText({ session }: { session: RoadmapSession }) {
  const hasRoomChange = !!session.defaultRoom && session.room !== session.defaultRoom
  const hash = stableHash(session.id)
  const assistantName = session.assistantName || (hash % 3 === 0 ? 'Hoàng Anh' : null)

  return (
    <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
      {/* Giáo viên (GV) */}
      <span className="flex items-center gap-1">
        <span>GV:</span>
        <span className="font-medium text-foreground">
          {session.substituteTeacherName ? (
            <span className="inline-flex items-center gap-1">
              <PersonnelHoverCard person={getTeacherPersonnel(session.teacherName)}>
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground/60 line-through hover:text-primary hover:underline cursor-pointer transition-colors"
                >
                  {cleanTeacherName(session.teacherName)}
                </span>
              </PersonnelHoverCard>

              <ArrowRight className="h-3 w-3 text-muted-foreground/50" />

              <PersonnelHoverCard person={getTeacherPersonnel(session.substituteTeacherName)}>
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer transition-colors"
                >
                  {cleanTeacherName(session.substituteTeacherName)}
                </span>
              </PersonnelHoverCard>
            </span>
          ) : (
            <PersonnelHoverCard person={getTeacherPersonnel(session.teacherName)}>
              <span
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary hover:underline cursor-pointer transition-colors"
              >
                {cleanTeacherName(session.teacherName)}
              </span>
            </PersonnelHoverCard>
          )}
        </span>
      </span>

      {/* Trợ giảng (TG) */}
      <span className="text-muted-foreground/40">•</span>

      <span className="inline-flex items-center gap-1">
        <span>TG:</span>
        {assistantName ? (
          <PersonnelHoverCard person={getAssistantPersonnel(assistantName)}>
            <span
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
            >
              {cleanAssistantName(assistantName)}
            </span>
          </PersonnelHoverCard>
        ) : (
          <span className="text-muted-foreground/50 text-[11px]">Chưa có</span>
        )}
      </span>

      {/* Phòng học */}
      <span className="text-muted-foreground/40">•</span>

      <span className="flex items-center gap-1">
        <span>Phòng:</span>
        <span className="font-medium text-foreground">
          {hasRoomChange ? (
            <span className="inline-flex items-center gap-1">
              <span className="text-muted-foreground/60 line-through">{session.defaultRoom}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              <span className="font-semibold text-amber-600 dark:text-amber-400">{session.room}</span>
            </span>
          ) : (
            session.room
          )}
        </span>
      </span>
    </div>
  )
}

function renderFormattedNote(text: string) {
  if (!text) return null
  const parts = text.split(/(@[A-ZÀ-Ỹa-zà-ỹ0-9_\s]+?(?=\s[a-z0-9]|\s[A-ZÀ-Ỹ][a-z0-9]|$|[\.,!\?]))/g)

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          return (
            <span
              key={i}
              className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary mr-1"
            >
              {part}
            </span>
          )
        }
        return part
      })}
    </span>
  )
}

function MaterialChip({
  sessionId,
  material,
  disabled,
  onDeleteMaterial,
  onPreview,
}: {
  sessionId: string
  material: { name: string; url: string; type?: string }
  disabled: boolean
  onDeleteMaterial: (sessionId: string, materialName: string, isSlide: boolean) => void
  onPreview: (material: { name: string; url: string; type?: string; thumbnailUrl?: string }) => void
}) {
  const { isSlide, thumbnailUrl } = getMaterialMeta(material.name)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onPreview({ ...material, thumbnailUrl })
      }}
      className={cn(
        'group/material relative rounded-lg border overflow-hidden transition-all cursor-pointer hover:shadow-sm shrink-0',
        isSlide
          ? 'border-primary/30 hover:border-primary/50'
          : 'border-border/80 hover:border-border'
      )}
      title={`Bấm để xem "${material.name}"`}
    >
      <div className="relative h-[66px] w-[96px] overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={material.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover/material:scale-105"
        />
        {/* Hover Overlay with Download and Share Link (Copy link) Icons placed at top-left corner */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover/material:opacity-100 transition-opacity duration-150 flex items-start justify-start p-1 gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toast.success(`Đang tải về: ${material.name}`)
              if (typeof window !== 'undefined') {
                window.open(material.url || '#', '_blank')
              }
            }}
            className="h-5.5 w-5.5 rounded-md bg-black/60 hover:bg-black/80 active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 shadow-2xs"
            title="Tải về tệp"
          >
            <Download className="h-3 w-3 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(material.url || window.location.href)
              }
              toast.success(`Đã sao chép liên kết tệp "${material.name}"!`)
            }}
            className="h-5.5 w-5.5 rounded-md bg-black/60 hover:bg-black/80 active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 shadow-2xs"
            title="Sao chép liên kết (Share link)"
          >
            <Share2 className="h-3 w-3 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDeleteMaterial(sessionId, material.name, isSlide)
          }}
          className="absolute -top-1 -right-1 z-10 hidden h-4 w-4 rounded-full bg-destructive text-destructive-foreground transition-all hover:scale-110 group-hover/material:flex items-center justify-center shadow-xs"
          title="Xóa tài liệu"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  )
}

export function ClassesSessionCard({
  session,
  roster,
  onView,
  onCancel,
  onEditTeacher,
  onEditRoom,
  onUpload,
  onDeleteMaterial,
}: ClassesSessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentDescription, setCurrentDescription] = useState(session.description || '')
  const [isEditingRemark, setIsEditingRemark] = useState(false)
  const [remarkInput, setRemarkInput] = useState(session.description || '')
  const [isAddingAssistant, setIsAddingAssistant] = useState(false)
  const [, setAssistantNameState] = useState<string | null>(session.assistantName || null)
  const [previewMedia, setPreviewMedia] = useState<{ name: string; url: string; type?: string; thumbnailUrl?: string } | null>(null)

  const isInactive = session.status === 'cancelled' || session.status === 'absent'
  const isCompleted = session.status === 'completed'
  const canManage = session.status === 'upcoming' || session.status === 'ongoing'
  const materials = session.materials || []
  const lessons = getLessonsForRoadmapSession(session)

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
          {isCompleted && (
            <Badge variant="outline" className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shrink-0">
              Đã điểm danh
            </Badge>
          )}
          <span className="text-xs font-semibold text-foreground">
            {formatDateWithDay(session.date)} ({session.startTime} - {session.endTime})
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
        <PersonRoomText session={session} />

        {/* Header Statistics Text - Abbreviated labels (ĐD, BTVN, ĐG) */}
        {isCompleted && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground ml-auto">
            {/* Attendance Stat */}
            <span className="inline-flex items-center gap-0.5">
              <span>ĐD:</span>
              <span className="font-semibold text-foreground">
                {metrics.attendance.present}/{metrics.attendance.total}
              </span>
            </span>

            <span className="text-muted-foreground/40">•</span>

            {isTestSession ? (
              /* Test Scores Stat */
              <span className="inline-flex items-center gap-0.5">
                <span>Điểm:</span>
                <span className="font-semibold text-foreground">
                  {metrics.testScore
                    ? `${metrics.testScore.graded}/${metrics.testScore.total} (TB: ${metrics.testScore.avgScore})`
                    : '—'}
                </span>
              </span>
            ) : (
              /* Homework & Rating Stats */
              <>
                <span className="inline-flex items-center gap-0.5">
                  <span>BTVN:</span>
                  <span className="font-semibold text-foreground">
                    {metrics.homework.submitted}/{metrics.homework.total}
                  </span>
                </span>

                <span className="text-muted-foreground/40">•</span>

                <span className="inline-flex items-center gap-0.5">
                  <span>ĐG:</span>
                  <span className="font-semibold text-foreground">
                    {metrics.rating}/5.0
                  </span>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Inline Session Remark Section with @Mention Support */}
      <div className="pt-0.5">
        {isEditingRemark ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-1.5 pt-0.5"
          >
            <Textarea
              value={remarkInput}
              onChange={(e) => setRemarkInput(e.target.value)}
              placeholder="Nhật ký buổi học: Giáo viên nhận xét chung vè buổi học tại đây... (Gõ @ để tag học viên)"
              className="min-h-[64px] text-xs leading-relaxed italic placeholder:italic focus-visible:ring-primary"
              autoFocus
            />
            <div className="flex items-center justify-between gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-6 px-2 text-xs font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 gap-1 rounded-md"
                  >
                    <AtSign className="h-3 w-3" />
                    <span>Tag học viên</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-1.5 z-50 bg-background border border-border shadow-md rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-muted-foreground px-2 py-1 border-b border-border/40">
                    Chọn học viên để tag
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1 scrollbar-none">
                    {(roster && roster.length > 0 ? roster.map((s) => s.name) : [
                      'Nguyễn Hoàng Vũ', 'Bảo Ngọc', 'Trần Đức Anh', 'Hoàng Anh Tuấn', 'Phạm Minh Khoa', 'Lê Thanh Hằng', 'Đặng Quốc Huy'
                    ]).map((stName) => (
                      <button
                        key={stName}
                        type="button"
                        onClick={() => {
                          setRemarkInput((prev) => (prev ? `${prev.trim()} @${stName} ` : `@${stName} `))
                          toast.success(`Đã tag @${stName}`)
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs rounded-md hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between font-medium text-foreground"
                      >
                        <span>{stName}</span>
                        <span className="text-[10px] text-primary/70 font-semibold">@tag</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    setRemarkInput(currentDescription)
                    setIsEditingRemark(false)
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  size="xs"
                  className="h-6 px-2.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    const trimmed = remarkInput.trim()
                    setCurrentDescription(trimmed)
                    setIsEditingRemark(false)
                    toast.success('Đã lưu nhận xét buổi học!')
                  }}
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        ) : currentDescription ? (
          <div
            onClick={(e) => {
              e.stopPropagation()
              setRemarkInput(currentDescription)
              setIsEditingRemark(true)
            }}
            className="group/remark flex items-start gap-1.5 pt-0.5 cursor-pointer"
            title="Nhận xét buổi học (Bấm vào đây để chỉnh sửa)"
          >
            <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover/remark:text-primary mt-0.5 transition-colors" />
            <div
              className={cn(
                'text-xs leading-relaxed text-muted-foreground font-normal group-hover/remark:text-primary transition-colors',
                !isExpanded && 'line-clamp-2'
              )}
            >
              {renderFormattedNote(currentDescription)}
            </div>
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation()
              setRemarkInput('')
              setIsEditingRemark(true)
            }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary cursor-pointer font-normal pt-0.5 group/suggest"
            title="Bấm vào đây để nhập nhận xét buổi học"
          >
            <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover/suggest:text-primary transition-colors" />
            <span className="font-normal italic text-muted-foreground/70 group-hover/suggest:text-primary transition-colors">
              Nhật ký buổi học: Giáo viên nhận xét chung vè buổi học tại đây... (Gõ @ để tag học viên)
            </span>
          </div>
        )}
      </div>

      {/* Bottom Bar: Materials Thumbnails (Left) + Action Icon Buttons (Right) - Cùng dòng */}
      <div className="mt-1 pt-1.5 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 w-full">
        {/* Left: Materials list */}
        <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1 py-0.5">
          {materials.length > 0 ? (
            materials.map((material) => (
              <MaterialChip
                key={`${session.id}-${material.name}`}
                sessionId={session.id}
                material={material}
                disabled={isCompleted || isInactive}
                onDeleteMaterial={onDeleteMaterial}
                onPreview={(mat) => setPreviewMedia(mat)}
              />
            ))
          ) : (
            <span className="text-[10px] italic text-muted-foreground/70">
              {isInactive ? 'Buổi học đã hủy' : 'Chưa có bài giảng'}
            </span>
          )}
        </div>

        {/* Right: Action Buttons Row (Đổi giáo viên, Tải lên, 3-Dots menu) - Cùng dòng ở góc phải */}
        {(canManage || isCompleted) && (
          <div className="flex items-center gap-1 shrink-0 ml-auto self-end">
            {/* Đổi giáo viên icon button (for upcoming/ongoing) */}
            {canManage && (
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditTeacher(session.id)
                }}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/70 transition-colors"
                title="Đổi giáo viên"
              >
                <UserCog className="h-4 w-4" />
              </Button>
            )}

            {/* Tải lên icon button (for upcoming, ongoing, and completed sessions) */}
            {(canManage || isCompleted) && (
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpload(session.id)
                }}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-muted/70 transition-colors"
                title="Tải lên bài giảng / BTVN"
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}

            {/* 3-Dots Menu for extra actions */}
            {canManage && (
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
                <DropdownMenuContent align="end" className="w-48 text-xs z-50">
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

      {/* Assistant selection modal dialog */}
      <Dialog open={isAddingAssistant} onOpenChange={setIsAddingAssistant}>
        <DialogContent className="max-w-xs rounded-xl p-4 z-50" onClick={(e) => e.stopPropagation()}>
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <UserPlus className="h-4 w-4 text-purple-600" />
              <span>Đổi Trợ giảng cho Buổi {session.sessionNumber}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-1">
            {['Hoàng Anh', 'Thu Hà', 'Minh Đức', 'Bảo Ngọc'].map((taName) => (
              <button
                key={taName}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  session.assistantName = taName
                  setAssistantNameState(taName)
                  setIsAddingAssistant(false)
                  toast.success(`Đã gán ${taName} làm trợ giảng cho Buổi ${session.sessionNumber}`)
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border border-border/60 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-foreground flex items-center justify-between transition-colors"
              >
                <span>{taName}</span>
                <UserCheck className="h-3.5 w-3.5 text-purple-600 opacity-60" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Expanded Lessons Content from Roadmap */}
      {isExpanded && (
        <div
          className="mt-1 space-y-2.5 pt-2.5 border-t border-border/40"
          onClick={(e) => e.stopPropagation()}
        >
          {lessons.flatMap((l) => l.components).map((c, cIdx) => {
            let iconColor = 'text-rose-600 dark:text-rose-400'
            let iconBg = 'bg-rose-50 dark:bg-rose-950/20'

            if (c.type === 'homework') {
              iconColor = 'text-emerald-600 dark:text-emerald-400'
              iconBg = 'bg-emerald-50 dark:bg-emerald-950/20'
            } else if (c.type === 'quiz') {
              iconColor = 'text-amber-600 dark:text-amber-400'
              iconBg = 'bg-amber-50 dark:bg-amber-950/20'
            }

            const isHomework = c.type === 'homework' || c.type === 'quiz'
            const line2 = isHomework ? 'Bài luyện tập' : 'File tài liệu tham khảo cho học sinh'
            const line3 = isHomework ? 'Nhiệm vụ phải làm' : 'Tài liệu tham khảo'

            return (
              <div key={cIdx} className="flex items-start gap-3 text-xs py-1 px-1.5 hover:bg-muted/30 rounded-md transition-colors">
                <div className={cn('h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5', iconBg, iconColor)}>
                  {isHomework ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="font-bold text-foreground text-xs leading-snug">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-normal">{line2}</p>
                  <p className={cn(
                    'text-[10px] flex items-center gap-1.5 leading-normal font-medium',
                    isHomework ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                  )}>
                    {isHomework ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-amber-500" />
                    ) : (
                      <FileText className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    )}
                    <span>{line3}</span>
                    {c.url && (
                      <>
                        <span>•</span>
                        <a
                          href={c.url !== '#' ? c.url : undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Link bài tập
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox / Media Preview Dialog */}
      <ClassesSessionCardMediaModal
        previewMedia={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />
    </article>
  )
}
