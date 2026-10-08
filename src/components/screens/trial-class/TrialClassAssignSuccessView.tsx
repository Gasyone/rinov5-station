'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Sparkles,
  School,
  FileText,
  Phone,
  Layers,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { TrialClass } from '@/mocks/trialClasses'
import type { TrialSessionSelection } from './trialClassTypes'
import { CENTER_DATA } from './trialClassConstants'

interface TrialClassAssignSuccessViewProps {
  trial: TrialClass
  session?: TrialSessionSelection | null
  branch: string
  program: string
  subject: string
  notes?: string
  isReschedule?: boolean
  onClose: () => void
  onReassign?: () => void
}

export function TrialClassAssignSuccessView({
  trial,
  session,
  branch,
  program,
  subject,
  notes,
  isReschedule = false,
  onClose,
  onReassign,
}: TrialClassAssignSuccessViewProps) {
  const [isCopied, setIsCopied] = useState(false)

  const schoolAddress =
    CENTER_DATA.find((c) => c.name === branch || c.name === trial.school)?.address ||
    'Tòa nhà RinoEdu'

  const displayPhone = trial.familyPhone || '---'

  const resolvedRole =
    trial.parentRole ||
    (trial.parentName?.toLowerCase().includes('văn') ||
    trial.parentName?.toLowerCase().includes('nam') ||
    trial.parentName?.toLowerCase().includes('tuấn') ||
    trial.parentName?.toLowerCase().includes('dũng')
      ? 'Bố'
      : 'Mẹ')

  const rawParentName = trial.parentName || trial.familyName?.replace(/^Gia đình\s+/, '') || 'Chưa gán'
  const displayParentName =
    rawParentName !== 'Chưa gán'
      ? rawParentName.includes('(')
        ? rawParentName
        : `${rawParentName} (${resolvedRole})`
      : 'Chưa gán'

  const displayClassName = session?.className || trial.sessions[0]?.className || trial.trialName
  const displaySessionName = session?.sessionName || trial.sessions[0]?.sessionName || 'Buổi học thử'
  const displayTrialDate = session?.trialDate || trial.sessions[0]?.trialDate || 'Chưa xếp'
  const displayTeacher = session?.teacher || trial.owner || 'Bộ phận chuyên môn phân công'
  const displayRoom = session?.room || 'Phòng 204'

  // Biên soạn tin nhắn Zalo gửi phụ huynh
  const zaloMessage = [
    `🌟 XÁC NHẬN LỊCH HỌC THỬ TRẢI NGHIỆM - RINOEDU 🌟`,
    `Kính gửi Quý phụ huynh ${displayParentName !== 'Chưa gán' ? displayParentName : trial.studentName},`,
    `Hệ thống RinoEdu xin gửi xác nhận thông tin lịch học thử trải nghiệm của con:`,
    `👤 Học viên: ${trial.studentName}`,
    `📚 Chương trình: ${program || trial.program}${subject || trial.subject ? ` (${(subject || trial.subject).trim()})` : ''}`,
    `🏫 Lớp học: ${displayClassName}`,
    `⏰ Thời gian: ${displayTrialDate} (${displaySessionName})`,
    `📍 Cơ sở: ${branch || trial.school}`,
    ...(schoolAddress ? [`🏢 Địa chỉ: ${schoolAddress}`] : []),
    `🚪 Phòng học: ${displayRoom}`,
    `👩‍🏫 Giáo viên: ${displayTeacher}${session?.assistantTeacher ? ` - Trợ giảng: ${session.assistantTeacher}` : ''}`,
    ...(session?.lessonTopic ? [`📖 Bài học: ${session.lessonTopic}`] : []),
    ...(session?.lessonWords ? [`   • Từ vựng: ${session.lessonWords}`] : []),
    ...(session?.lessonSentences ? [`   • Mẫu câu: ${session.lessonSentences}`] : []),
    ...(notes ? [`📝 Ghi chú: ${notes}`] : []),
    ``,
    `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ học 10 phút để bé nhận tài liệu học thử và làm quen lớp nhé ạ.`,
    `RinoEdu trân trọng cảm ơn Ba/Mẹ! ❤️`,
  ].join('\n')

  const handleCopyZalo = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(zaloMessage)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = zaloMessage
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
      toast.success('Đã sao chép nội dung tin nhắn Zalo gửi phụ huynh!')
    } catch {
      toast.error('Không thể sao chép tự động. Vui lòng thử lại!')
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* 1. Header Banner xác nhận ghép lớp thành công */}
      <div className="shrink-0 bg-emerald-50/80 dark:bg-emerald-950/30 border-b border-emerald-200/80 dark:border-emerald-900/60 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                {isReschedule ? 'Đổi ca học thử thành công!' : 'Ghép lớp học thử thành công!'}
              </h2>
              <Badge
                variant="outline"
                className={cn('text-xs font-semibold h-5 px-1.5', getStatusBadgeClass('confirmed'))}
              >
                Đã chốt lịch học
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phiếu <strong className="font-mono text-foreground font-semibold">#{trial.id}</strong> &bull; Học viên{' '}
              <strong className="text-foreground">{trial.studentName}</strong>
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCopyZalo}
          className="h-7 px-2.5 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs shrink-0"
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Đã sao chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Sao chép Zalo</span>
            </>
          )}
        </Button>
      </div>

      {/* 2. Body: 2 Cột thông tin chi tiết & Mẫu tin nhắn Zalo */}
      <div className="flex-1 overflow-y-auto px-5 py-3.5 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
          {/* CỘT TRÁI (5 cols): Chi tiết ca học & Học viên/Phụ huynh */}
          <div className="md:col-span-5 space-y-3 flex flex-col min-w-0">
            {/* Thẻ 1: Chi tiết ca học ghép */}
            <div className="rounded-lg border border-border/80 bg-card p-3 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5">
                <Calendar className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                <h3 className="font-bold text-xs text-foreground">
                  Chi tiết Lớp ghép & Ca học
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Layers className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                  <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                    <span className="font-bold text-foreground text-xs sm:text-sm">
                      {displayClassName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({displaySessionName})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span className="font-semibold text-foreground text-xs truncate">
                      {displayTrialDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-xs">
                    <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-foreground text-xs truncate max-w-[120px]">
                      {displayTeacher}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-start gap-1.5 min-w-0 flex-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-foreground text-xs block truncate">
                        {branch || trial.school}
                      </span>
                      {schoolAddress && (
                        <span className="text-muted-foreground text-xs block truncate leading-tight">
                          {schoolAddress}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-xs mt-0.5">
                    <School className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                    <span className="font-medium text-foreground text-xs">{displayRoom}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-semibold text-foreground text-xs">
                      {program || trial.program}
                    </span>
                    {(subject || trial.subject) && (
                      <Badge variant="secondary" className="text-xs font-normal h-4.5 px-1.5">
                        {subject || trial.subject}
                      </Badge>
                    )}
                  </div>
                </div>

                {session?.lessonTopic && (
                  <div className="pt-1.5 border-t border-border/40 text-xs">
                    <span className="font-semibold text-foreground">Bài học: </span>
                    <span className="text-foreground">{session.lessonTopic}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thẻ 2: Thông tin Học viên & Phụ huynh */}
            <div className="rounded-lg border border-border/80 bg-card p-3 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5">
                <User className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <h3 className="font-bold text-xs text-foreground">
                  Thông tin Học viên & Phụ huynh
                </h3>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span className="font-bold text-foreground text-xs truncate">
                      {trial.studentName}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {trial.attempt || 'Lần 1'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-foreground text-xs truncate">
                      {displayParentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                    <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span>{displayPhone}</span>
                  </div>
                </div>

                {notes && (
                  <div className="pt-1.5 border-t border-border/40 text-xs text-muted-foreground italic flex items-start gap-1">
                    <FileText className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">&ldquo;{notes}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7 cols): Mẫu tin nhắn Zalo gửi Phụ huynh */}
          <div className="md:col-span-7 flex flex-col min-w-0">
            <div className="rounded-lg border border-border/80 bg-card p-3.5 space-y-2 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <h3 className="font-bold text-xs text-foreground">
                    Nội dung tin nhắn Zalo gửi Phụ huynh
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyZalo}
                  className="h-6 px-2 text-xs font-semibold gap-1 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-300 dark:text-emerald-300 dark:hover:bg-emerald-950/40 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-muted-foreground" />
                      <span>Sao chép toàn bộ</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="relative rounded-lg bg-muted/40 border border-border/60 p-3 font-mono text-xs sm:text-xs text-foreground leading-relaxed whitespace-pre-line select-all max-h-[300px] overflow-y-auto">
                {zaloMessage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer hoàn tất */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-border/60 bg-muted/20">
        <div>
          {onReassign && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReassign}
              className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Ghép lại / Đổi buổi khác</span>
            </Button>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onClose}
          className="h-8 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          <span>Hoàn tất & Đóng</span>
        </Button>
      </div>
    </div>
  )
}
