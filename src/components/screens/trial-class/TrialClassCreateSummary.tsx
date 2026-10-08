'use client'

import React, { useState } from 'react'
import {
  Calendar,
  MapPin,
  GraduationCap,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Copy,
  Check,
  BookOpen,
  Layers,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TrialSessionSelection } from './trialClassTypes'

interface TrialClassCreateSummaryProps {
  selectedSession?: TrialSessionSelection | null
  school: string
  schoolAddress?: string
  program: string
  subject: string
  studentName: string
  parentName: string
  phone: string
  isSubmitting?: boolean
  onCancel?: () => void
  className?: string
}

export function TrialClassCreateSummary({
  selectedSession,
  school,
  schoolAddress,
  program,
  subject,
  studentName,
  parentName,
  phone,
  isSubmitting = false,
  onCancel,
  className,
}: TrialClassCreateSummaryProps) {
  const [sendConfirmation, setSendConfirmation] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Masking phone on display to comply with security rules (e.g. 098****321)
  const formatPhoneMask = (p?: string) => {
    if (!p) return '---'
    const clean = p.replace(/\s+/g, '')
    if (clean.length >= 7) {
      return `${clean.slice(0, 3)}****${clean.slice(-3)}`
    }
    return p
  }

  const maskedPhone = formatPhoneMask(phone)

  const handleCopyZalo = async () => {
    const parentDisplay = parentName?.trim() || '[Tên Phụ huynh]'
    const studentDisplay = studentName?.trim() || '[Tên Học viên / Bé]'
    const schoolDisplay = school?.trim() || 'RinoEdu'
    const programDisplay = program?.trim() || 'Lớp học thử'

    const messageLines = [
      `🌟 XÁC NHẬN LỊCH HỌC THỬ TRẢI NGHIỆM - RINOEDU 🌟`,
      ``,
      `Kính gửi Quý phụ huynh ${parentDisplay},`,
      `Hệ thống RinoEdu xin gửi xác nhận thông tin lịch học thử trải nghiệm của con như sau:`,
      ``,
      `👤 Học viên: ${studentDisplay}`,
      `📚 Chương trình: ${programDisplay}${subject ? ` (${subject.trim()})` : ''}`,
      ...(selectedSession
        ? [
            `🏫 Lớp học: ${selectedSession.className}`,
            `⏰ Thời gian: ${selectedSession.trialDate}`,
            ...(selectedSession.room ? [`🚪 Phòng học: ${selectedSession.room}`] : []),
            ...(selectedSession.teacher
              ? [
                  `👩‍🏫 Giáo viên: ${selectedSession.teacher}${
                    selectedSession.assistantTeacher ? ` - Trợ giảng: ${selectedSession.assistantTeacher}` : ''
                  }`,
                ]
              : []),
            ...(selectedSession.lessonTopic
              ? [
                  `📖 Nội dung bài học: ${selectedSession.lessonTopic}`,
                  ...(selectedSession.lessonWords
                    ? [`   • Từ vựng trọng tâm: ${selectedSession.lessonWords}`]
                    : []),
                  ...(selectedSession.lessonSentences
                    ? [`   • Mẫu câu thực hành: ${selectedSession.lessonSentences}`]
                    : []),
                  ...(selectedSession.lessonPhonics
                    ? [`   • Hoạt động / Phát âm: ${selectedSession.lessonPhonics}`]
                    : []),
                ]
              : []),
          ]
        : [`⏰ Thời gian: Giáo vụ liên hệ sắp xếp ca học cụ thể sau khi xác nhận`]),
      `📍 Cơ sở: ${schoolDisplay}`,
      ...(schoolAddress?.trim() ? [`🏢 Địa chỉ: ${schoolAddress.trim()}`] : []),
      ``,
      `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ học 10 - 15 phút để bé làm quen phòng học và chuẩn bị tâm lý thoải mái nhất nhé ạ.`,
      ``,
      `Nếu cần hỗ trợ đổi lịch hoặc có câu hỏi thêm, Ba/Mẹ cứ nhắn tin trực tiếp cho em qua Zalo này nhé ạ!`,
      `RinoEdu trân trọng cảm ơn Ba/Mẹ! ❤️`,
    ]

    const fullMessage = messageLines.join('\n')

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullMessage)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = fullMessage
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
      try {
        const textArea = document.createElement('textarea')
        textArea.value = fullMessage
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (successful) {
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2500)
          toast.success('Đã sao chép nội dung tin nhắn Zalo gửi phụ huynh!')
          return
        }
      } catch {}
      toast.error('Không thể tự động sao chép. Vui lòng thử lại!')
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-background p-2.5 space-y-2 transition-all',
        className
      )}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="uppercase tracking-wider text-xs">Tóm tắt lịch học thử</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyZalo}
          className="h-6 px-2 text-xs gap-1 cursor-pointer font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors shadow-2xs"
          title="Sao chép nội dung tin nhắn gửi Zalo cho phụ huynh"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Đã chép
              </span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-muted-foreground" />
              <span>Sao chép</span>
            </>
          )}
        </Button>
      </div>

      {/* Danh sách tóm tắt: Chỉ icon và nội dung, bỏ nhãn thừa */}
      <div className="space-y-2 text-xs">
        {/* 1. Lịch học thử */}
        <div className="flex items-start gap-2.5 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1 truncate">
            {selectedSession ? (
              <span className="font-semibold text-primary">{selectedSession.trialDate}</span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn ca học cụ thể</span>
            )}
          </div>
        </div>

        {/* 2. Lớp học & Phòng */}
        <div className="flex items-start gap-2.5 min-w-0">
          <BookOpen className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1 truncate">
            {selectedSession ? (
              <span className="font-semibold text-foreground">
                {selectedSession.className}
                {selectedSession.room ? ` • ${selectedSession.room}` : ''}
              </span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa gán lớp (ghép sau)</span>
            )}
          </div>
        </div>

        {/* 3. Cơ sở (Tách dòng riêng) */}
        <div className="flex items-start gap-2.5 min-w-0">
          <MapPin className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1 truncate" title={school || 'Chưa chọn cơ sở'}>
            {school ? (
              <span className="font-semibold text-foreground">{school}</span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn cơ sở</span>
            )}
          </div>
        </div>

        {/* 4. Chương trình (Tách dòng riêng) */}
        <div className="flex items-start gap-2.5 min-w-0">
          <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div
            className="min-w-0 flex-1 truncate"
            title={program ? `${program}${subject ? ` (${subject})` : ''}` : 'Chưa chọn chương trình'}
          >
            {program ? (
              <span className="font-semibold text-foreground">
                {program}
                {subject ? ` (${subject})` : ''}
              </span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn chương trình</span>
            )}
          </div>
        </div>

        {/* 5. Giáo viên phụ trách */}
        <div className="flex items-start gap-2.5 min-w-0">
          <GraduationCap className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1 truncate">
            {selectedSession?.teacher ? (
              <span className="font-semibold text-foreground">
                {selectedSession.teacher}
                {selectedSession.assistantTeacher ? (
                  <span className="text-muted-foreground font-normal">
                    {' '}(TG: {selectedSession.assistantTeacher})
                  </span>
                ) : null}
              </span>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground font-normal">
                <AlertCircle className="h-3 w-3 shrink-0 text-amber-500/80" />
                <span className="truncate">Bộ phận chuyên môn phân công</span>
              </div>
            )}
          </div>
        </div>

        {/* 6. Bài học / Nội dung buổi học (khi đã chọn ca học có chủ đề) */}
        {selectedSession?.lessonTopic && (
          <div className="flex items-start gap-2.5 min-w-0">
            <FileText className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 truncate" title={`Chủ đề: ${selectedSession.lessonTopic}`}>
              <span className="font-semibold text-foreground">Bài học: </span>
              <span className="text-foreground">{selectedSession.lessonTopic}</span>
            </div>
          </div>
        )}

        {/* 7. Học viên & Phụ huynh */}
        <div className="flex items-start gap-2.5 min-w-0">
          <User className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
          <div
            className="min-w-0 flex-1 truncate"
            title={studentName ? `${studentName} (PH: ${parentName} - ${maskedPhone})` : 'Chưa gán học viên'}
          >
            {studentName ? (
              <span className="font-semibold text-foreground">
                {studentName}{' '}
                <span className="font-normal text-muted-foreground">
                  ({parentName || 'PH'}{maskedPhone ? ` - ${maskedPhone}` : ''})
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn học viên & phụ huynh</span>
            )}
          </div>
        </div>
      </div>

      {/* Checkbox gửi xác nhận */}
      <div className="pt-1.5 border-t border-border/60">
        <label className="flex items-center gap-2 cursor-pointer text-[11.5px] text-muted-foreground hover:text-foreground transition-colors">
          <input
            type="checkbox"
            checked={sendConfirmation}
            onChange={(e) => setSendConfirmation(e.target.checked)}
            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
          />
          <span>Tự động gửi SMS / Zalo ZNS xác nhận</span>
        </label>
      </div>

      {/* Nút Tạo booking học thử chính */}
      <div className="pt-1 space-y-1.5">
        <Button
          type="submit"
          form="trial-create-form"
          disabled={isSubmitting}
          className="w-full gap-1.5 cursor-pointer h-9 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{isSubmitting ? 'Đang tạo booking...' : 'Tạo booking học thử ngay'}</span>
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="w-full h-7 text-[11.5px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Quay lại danh sách
          </Button>
        )}
      </div>
    </div>
  )
}
