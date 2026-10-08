'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  ExternalLink,
  MessageSquare,
  Sparkles,
  School,
  FileText,
  Phone,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockLeads } from '@/mocks/crmLeads'
import type { TrialClass } from '@/mocks/trialClasses'
import type { TrialSessionSelection } from './trialClassTypes'

interface TrialClassSuccessSummaryViewProps {
  trial: TrialClass
  session?: TrialSessionSelection | null
  leadId?: string | null
  schoolAddress?: string
  onCreateAnother?: () => void
}

export function TrialClassSuccessSummaryView({
  trial,
  session,
  leadId,
  schoolAddress,
  onCreateAnother,
}: TrialClassSuccessSummaryViewProps) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const displayPhone = trial.familyPhone || '---'

  // Xác định vai trò phụ huynh (Bố / Mẹ / Phụ huynh)
  const resolvedRole =
    trial.parentRole ||
    (leadId ? mockLeads.find((l) => l.id === leadId)?.parentRole : undefined) ||
    mockLeads.find((l) => l.parentName === trial.parentName || l.studentName === trial.studentName)?.parentRole ||
    (trial.parentName?.toLowerCase().includes('văn') ||
     trial.parentName?.toLowerCase().includes('nam') ||
     trial.parentName?.toLowerCase().includes('tuấn') ||
     trial.parentName?.toLowerCase().includes('dũng')
      ? 'Bố'
      : 'Mẹ')

  const rawParentName = trial.parentName || trial.familyName?.replace(/^Gia đình\s+/, '') || 'Chưa gán'
  const displayParentName = rawParentName !== 'Chưa gán'
    ? (rawParentName.includes('(') ? rawParentName : `${rawParentName} (${resolvedRole})`)
    : 'Chưa gán'

  const displayClassName = session?.className || trial.sessions[0]?.className || trial.trialName
  const displaySessionName = session?.sessionName || trial.sessions[0]?.sessionName || 'Buổi học thử'
  const displayTrialDate = session?.trialDate || trial.sessions[0]?.trialDate || 'Chưa xếp'
  const displayTeacher = session?.teacher || trial.owner || 'Bộ phận chuyên môn phân công'
  const displayRoom = session?.room || 'Phòng 204'

  // Biên soạn tin nhắn Zalo gửi phụ huynh (gọn gàng, chuẩn format)
  const zaloMessage = [
    `🌟 XÁC NHẬN LỊCH HỌC THỬ TRẢI NGHIỆM - RINOEDU 🌟`,
    `Kính gửi Quý phụ huynh ${displayParentName !== 'Chưa gán' ? displayParentName : (trial.parentName || trial.familyName || '')},`,
    `Hệ thống RinoEdu xin gửi xác nhận thông tin lịch học thử trải nghiệm của con:`,
    `👤 Học viên: ${trial.studentName}`,
    `📚 Chương trình: ${trial.program}${trial.subject ? ` (${trial.subject})` : ''}`,
    `🏫 Lớp học: ${displayClassName}`,
    `⏰ Thời gian: ${displayTrialDate} (${displaySessionName})`,
    `📍 Cơ sở: ${trial.school}`,
    ...(schoolAddress ? [`🏢 Địa chỉ: ${schoolAddress}`] : []),
    `🚪 Phòng học: ${displayRoom}`,
    `👩‍🏫 Giáo viên: ${displayTeacher}${session?.assistantTeacher ? ` - Trợ giảng: ${session.assistantTeacher}` : ''}`,
    ...(session?.lessonTopic ? [`📖 Bài học: ${session.lessonTopic}`] : []),
    ...(session?.lessonWords ? [`   • Từ vựng: ${session.lessonWords}`] : []),
    ...(session?.lessonSentences ? [`   • Mẫu câu: ${session.lessonSentences}`] : []),
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
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-2 sm:py-3 space-y-2.5 sm:space-y-3">
      {/* 1. HERO BANNER: THÔNG BÁO TẠO THÀNH CÔNG (COMPACT) */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20 px-3.5 py-2 sm:px-4 sm:py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-100 dark:ring-emerald-900/40">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Đăng ký Lớp học thử thành công!
              </h2>
              <Badge
                variant="outline"
                className={cn('text-[10.5px] font-semibold h-5 px-1.5 whitespace-nowrap', getStatusBadgeClass('confirmed'))}
              >
                Đã xếp ca học thử
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-none hidden sm:block mt-0.5">
              Lịch học thử đã được hệ thống ghi nhận và tự động cập nhật vào hồ sơ học viên trên CRM/Station.
            </p>
          </div>
        </div>

        {/* Mã học thử & Action copy Zalo nhanh */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-1.5 sm:pt-0 border-emerald-200/60 shrink-0">
          <div className="text-left sm:text-right shrink-0 whitespace-nowrap">
            <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground block font-medium leading-none">
              Mã học thử
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground whitespace-nowrap tabular-nums">
              #{trial.id}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/app/trial_class')}
            className="h-7 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
          >
            Về danh sách
          </Button>
          {onCreateAnother && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateAnother}
              className="h-7 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
            >
              Tạo tiếp
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleCopyZalo}
            className="h-7 px-2.5 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
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
      </div>

      {/* 2. LAYOUT 2 CỘT: TRÁI (CA HỌC & THÔNG TIN PHỤ HUYNH) & PHẢI (MẪU TIN NHẮN ZALO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* CỘT TRÁI: GOM CHI TIẾT LỚP HỌC THỬ & THÔNG TIN HỌC VIÊN / PHỤ HUYNH (THU HẸP) */}
        <div className="lg:col-span-5 space-y-2.5 flex flex-col">
          {/* KHỐI 1: CHI TIẾT LỚP HỌC THỬ */}
          <div className="rounded-lg border border-border/80 bg-card p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5">
              <Calendar className="h-3.5 w-3.5 text-violet-600 shrink-0" />
              <h3 className="font-bold text-xs text-foreground">
                Chi tiết Ca học thử & Lớp học
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

              {/* Dòng 2: Lịch học & Giáo viên (cạnh phải) */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground text-xs truncate">
                    {displayTrialDate}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-xs">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-foreground text-xs">
                    {displayTeacher}
                  </span>
                  {session?.assistantTeacher && (
                    <span className="text-muted-foreground text-[10.5px]">
                      (TG: {session.assistantTeacher})
                    </span>
                  )}
                </div>
              </div>

              {/* Dòng 3: Cơ sở & Phòng (cạnh phải) */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-foreground text-xs block truncate">
                      {trial.school}
                    </span>
                    {schoolAddress && (
                      <span className="text-muted-foreground text-xs block truncate leading-tight">
                        {schoolAddress}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-xs mt-0.5">
                  <School className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                  <span className="font-medium text-foreground text-xs">
                    {displayRoom}
                  </span>
                </div>
              </div>

              {/* Dòng 4: Chương trình & Môn */}
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-semibold text-foreground text-xs">
                    {trial.program}
                  </span>
                  {trial.subject && (
                    <Badge variant="secondary" className="text-xs font-normal h-4.5 px-1.5">
                      {trial.subject}
                    </Badge>
                  )}
                </div>
              </div>

              {session?.lessonTopic && (
                <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                  <FileText className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="text-foreground font-medium text-xs">
                      {session.lessonTopic}
                    </p>
                    {session?.lessonWords && (
                      <span className="text-muted-foreground text-[10.5px] block truncate">
                        • Từ vựng: {session.lessonWords}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {trial.notes && (
                <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground italic text-xs flex-1 line-clamp-2">
                    &ldquo;{trial.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* KHỐI 2: THÔNG TIN HỌC VIÊN & PHỤ HUYNH */}
          <div className="rounded-lg border border-border/80 bg-card p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <h3 className="font-bold text-xs text-foreground">
                  Thông tin Học viên & Phụ huynh
                </h3>
              </div>

              {leadId ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/app/crm_leads/${leadId}`)}
                  className="h-6 px-2 text-xs font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10 border-primary/30 cursor-pointer shadow-2xs"
                >
                  <span>Xem chi tiết hồ sơ Lead</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/app/trial_class')}
                  className="h-6 px-2 text-xs font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10 border-primary/30 cursor-pointer shadow-2xs"
                >
                  <span>Xem danh sách lớp học thử</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {/* Dòng 1: Học viên & Lần học thử (cạnh phải) */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                    <span className="font-bold text-foreground text-xs sm:text-sm">
                      {trial.studentName}
                    </span>
                    {trial.studentBirthYear && (
                      <span className="text-muted-foreground text-xs">
                        (Sinh năm {trial.studentBirthYear})
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-xs">
                  <span className="text-muted-foreground text-xs">Lần: </span>
                  <span className="font-semibold text-foreground text-xs">{trial.attempt || 'Lần 1'}</span>
                </div>
              </div>

              {/* Dòng 2: Phụ huynh & Số điện thoại (cùng 1 dòng) */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-xs truncate">
                    {displayParentName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-mono font-medium text-foreground text-xs">
                    {displayPhone}
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between gap-2">
                <span className="truncate">
                  Người tạo: <strong className="font-medium text-foreground">{trial.creator || 'Người dùng hiện tại'}</strong>
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                  Đã chốt ca học thử
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: MẪU TIN NHẮN ZALO GỬI PHỤ HUYNH (MỞ RỘNG) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-lg border border-border/80 bg-card p-3.5 space-y-2.5 shadow-2xs flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <h3 className="font-bold text-xs text-foreground">
                  Mẫu tin nhắn Zalo gửi Phụ huynh
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

            <div className="relative rounded-lg bg-muted/40 border border-border/60 p-3 sm:p-3.5 font-mono text-[11.5px] sm:text-xs text-foreground leading-relaxed whitespace-pre-line select-all flex-1 min-h-[320px] sm:min-h-[340px]">
              {zaloMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
