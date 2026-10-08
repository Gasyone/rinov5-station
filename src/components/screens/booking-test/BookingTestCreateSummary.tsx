'use client'

import React, { useState } from 'react'
import {
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSlotTimeRange } from './bookingTestCreateTypes'

interface BookingTestCreateSummaryProps {
  dateLabel: string
  selectedSlot: string
  school: string
  schoolAddress?: string
  program: string
  level: string
  studentName: string
  parentName: string
  phone: string
  teacherName: string
  teacherRole?: string
  className?: string
}

export function BookingTestCreateSummary({
  dateLabel,
  selectedSlot,
  school,
  schoolAddress,
  program,
  level,
  studentName,
  parentName,
  phone,
  teacherName,
  teacherRole = 'Giáo viên',
  className,
}: BookingTestCreateSummaryProps) {
  const [sendConfirmation, setSendConfirmation] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const timeRange = getSlotTimeRange(selectedSlot, 30)
  const isAssigned = Boolean(teacherName)

  // Masking phone on display to comply with security rules
  const maskedPhone =
    phone && phone.length >= 7
      ? `${phone.slice(0, 3)}****${phone.slice(-3)}`
      : phone || '---'

  const handleCopyZalo = async () => {
    const parentDisplay = parentName?.trim() || '[Tên Phụ huynh]'
    const studentDisplay = studentName?.trim() || '[Tên Học viên / Bé]'
    const schoolDisplay = school?.trim() || 'RinoEdu'
    const programDisplay = program?.trim() || 'Đánh giá năng lực'

    // 2. Biên soạn mẫu tin nhắn Zalo chuyên nghiệp, thân thiện gửi cho phụ huynh
    const messageLines = [
      `🌟 XÁC NHẬN LỊCH ĐÁNH GIÁ NĂNG LỰC - RINOEDU 🌟`,
      ``,
      `Kính gửi Quý phụ huynh ${parentDisplay},`,
      `Hệ thống RinoEdu xin gửi xác nhận thông tin lịch hẹn đánh giá năng lực của con như sau:`,
      ``,
      `👤 Học viên: ${studentDisplay}`,
      `📚 Chương trình: ${programDisplay}${level?.trim() ? ` (${level.trim()})` : ''}`,
      `⏰ Thời gian: ${timeRange || '[Khung giờ test]'}, ${dateLabel || '[Ngày test]'}`,
      `📍 Cơ sở: ${schoolDisplay}`,
      ...(schoolAddress?.trim() ? [`🏢 Địa chỉ: ${schoolAddress.trim()}`] : []),
      `👩‍🏫 Phụ trách: ${isAssigned ? `${teacherName} (${teacherRole})` : 'Bộ phận chuyên môn trung tâm phân công'}`,
      ``,
      `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ hẹn 10 - 15 phút để bé làm quen phòng học và chuẩn bị tâm lý thoải mái nhất nhé ạ.`,
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
          <span className="uppercase tracking-wider text-xs">Tóm tắt lịch hẹn</span>
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

      <div className="space-y-2 text-xs">
        {/* 1. Lịch test & giờ */}
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
          <p className="font-semibold text-foreground truncate flex-1 min-w-0 text-xs">
            {dateLabel && selectedSlot ? (
              <>
                {dateLabel} • <span className="text-primary font-bold">{timeRange}</span>
              </>
            ) : dateLabel ? (
              <span>{dateLabel} • <span className="text-muted-foreground font-normal">Chưa chọn ca</span></span>
            ) : selectedSlot ? (
              <span><span className="text-primary font-bold">{timeRange}</span> <span className="text-muted-foreground font-normal">(Chưa chọn ngày)</span></span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn ngày & ca test</span>
            )}
          </p>
        </div>

        {/* 2. Cơ sở / Trung tâm */}
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          <p className="font-medium text-foreground truncate flex-1 min-w-0 text-xs" title={school || 'Chưa chọn cơ sở'}>
            {school ? (
              <span>{school}</span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn cơ sở</span>
            )}
          </p>
        </div>

        {/* 3. Chương trình & Level dự kiến */}
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <p
            className="font-medium text-foreground truncate flex-1 min-w-0 text-xs"
            title={program ? (level ? `${program} • ${level}` : program) : 'Chưa chọn chương trình'}
          >
            {program ? (
              <span>
                {program}
                {level ? <span className="text-muted-foreground font-normal"> • {level}</span> : null}
              </span>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn chương trình</span>
            )}
          </p>
        </div>

        {/* 3. Học viên & Phụ huynh */}
        <div className="flex items-center gap-2 min-w-0">
          <User className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <p className="font-medium text-foreground truncate flex-1 min-w-0 text-xs" title={studentName ? `${studentName} (PH: ${parentName} - ${maskedPhone})` : 'Chưa gán học viên'}>
            {studentName ? (
              <>
                <span className="font-semibold text-foreground">{studentName}</span>{' '}
                <span className="font-normal text-muted-foreground">({parentName || 'PH'}{maskedPhone ? ` - ${maskedPhone}` : ''})</span>
              </>
            ) : (
              <span className="text-muted-foreground font-normal">Chưa chọn học viên & phụ huynh</span>
            )}
          </p>
        </div>

        {/* 4. Người phụ trách */}
        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0 flex items-center text-xs">
            {!selectedSlot ? (
              <span className="text-muted-foreground font-normal">Chưa chọn ca test</span>
            ) : isAssigned ? (
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-semibold text-foreground truncate">{teacherName}</span>
                <span
                  className={cn(
                    'text-xs px-1 py-0 rounded font-semibold border shrink-0',
                    teacherRole === 'CS'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      : teacherRole === 'Khác'
                      ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                  )}
                >
                  {teacherRole}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium truncate">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span className="truncate">Chưa gán (Phân công sau)</span>
              </div>
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

      {/* Nút Tạo lịch test chính */}
      <div className="pt-1">
        <Button
          type="submit"
          form="booking-create-form"
          className="w-full gap-1.5 cursor-pointer h-9 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo lịch test ngay</span>
        </Button>
      </div>
    </div>
  )
}
