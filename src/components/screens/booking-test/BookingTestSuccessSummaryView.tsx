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
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockLeads } from '@/mocks/crmLeads'
import type { BookingTest } from '@/mocks/bookingTests'

interface BookingTestSuccessSummaryViewProps {
  booking: BookingTest
  leadId?: string | null
  schoolAddress?: string
  dateLabel?: string
  timeRange?: string
  onCreateAnother?: () => void
}

export function BookingTestSuccessSummaryView({
  booking,
  leadId,
  schoolAddress,
  dateLabel,
  timeRange,
  onCreateAnother,
}: BookingTestSuccessSummaryViewProps) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const displayPhone = booking.phone || '---'

  // Xác định vai trò phụ huynh (Bố / Mẹ / Phụ huynh)
  const resolvedRole =
    booking.parentRole ||
    (leadId ? mockLeads.find((l) => l.id === leadId)?.parentRole : undefined) ||
    mockLeads.find((l) => l.studentName === booking.childName || l.phone === booking.phone)?.parentRole ||
    (booking.parentName?.toLowerCase().includes('văn') ||
     booking.parentName?.toLowerCase().includes('nam') ||
     booking.parentName?.toLowerCase().includes('tuấn') ||
     booking.parentName?.toLowerCase().includes('dũng')
      ? 'Bố'
      : 'Mẹ')

  const rawParentName =
    booking.parentName ||
    booking.familyMembers?.[0]?.name?.replace(/\s*\([^)]*\)/, '') ||
    booking.familyName?.replace(/^Gia đình\s+/, '') ||
    'Chưa gán'

  const displayParentName = rawParentName !== 'Chưa gán'
    ? (rawParentName.includes('(') ? rawParentName : `${rawParentName} (${resolvedRole})`)
    : 'Chưa gán'

  const displayTime = timeRange || booking.testTime.split(' ')[1] || '09:00 - 09:30'
  const displayDate = dateLabel || booking.testTime.split(' ')[0] || 'Hôm nay'
  const displayTeacher = booking.teacher || booking.tester || 'Bộ phận chuyên môn phân công'
  const displayLevel = booking.testResult?.level || booking.expectedLevel || 'Chưa phân cấp'

  // Biên soạn nội dung tin nhắn Zalo chuẩn bị gửi cho phụ huynh (gọn gàng, dễ đọc)
  const zaloMessage = [
    `🌟 XÁC NHẬN LỊCH ĐÁNH GIÁ NĂNG LỰC - RINOEDU 🌟`,
    `Kính gửi Quý phụ huynh ${displayParentName !== 'Chưa gán' ? displayParentName : (booking.familyName || booking.familyMembers?.[0]?.name || '')},`,
    `Hệ thống RinoEdu xin gửi xác nhận thông tin lịch hẹn đánh giá năng lực của con:`,
    `👤 Học viên: ${booking.childName}`,
    `📚 Chương trình: ${booking.program}${displayLevel ? ` (${displayLevel})` : ''}`,
    `⏰ Thời gian: ${displayTime}, ${displayDate}`,
    `📍 Cơ sở: ${booking.school}`,
    ...(schoolAddress ? [`🏢 Địa chỉ: ${schoolAddress}`] : []),
    `🚪 Phòng: ${booking.room || 'Phòng A1'}`,
    `👩‍🏫 Phụ trách: ${displayTeacher}`,
    ``,
    `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ hẹn 10 - 15 phút để bé làm quen phòng học và chuẩn bị tâm lý thoải mái nhất nhé ạ.`,
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
                Đặt lịch Đánh giá Năng lực thành công!
              </h2>
              <Badge
                variant="outline"
                className={cn('text-[10.5px] font-semibold h-5 px-1.5', getStatusBadgeClass('booked_assessment'))}
              >
                Đã lên lịch test
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-none hidden sm:block mt-0.5">
              Lịch hẹn đã được hệ thống ghi nhận và tự động cập nhật vào hồ sơ học viên trên CRM/Station.
            </p>
          </div>
        </div>

        {/* Mã phiếu & Action copy Zalo nhanh */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-1.5 sm:pt-0 border-emerald-200/60 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground block font-medium leading-none">
              Mã lịch test
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground tabular-nums">
              #{booking.id}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/app/booking_test')}
            className="h-7 px-2.5 text-xs font-medium border-emerald-300 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950 cursor-pointer shadow-xs shrink-0"
          >
            Về danh sách
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCopyZalo}
            className="h-7 px-2.5 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs shrink-0"
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

      {/* 2. LAYOUT 2 CỘT: TRÁI (LỊCH & THÔNG TIN PHỤ HUYNH) & PHẢI (MẪU TIN NHẮN ZALO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* CỘT TRÁI: GOM CHI TIẾT LỊCH HẸN & THÔNG TIN HỌC VIÊN / PHỤ HUYNH (THU HẸP) */}
        <div className="lg:col-span-5 space-y-2.5 flex flex-col">
          {/* KHỐI 1: CHI TIẾT LỊCH HẸN & ĐỊA ĐIỂM */}
          <div className="rounded-lg border border-border/80 bg-card p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              <h3 className="font-bold text-xs text-foreground">
                Chi tiết Lịch hẹn & Địa điểm
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {/* Dòng 1: Lịch hẹn & Người phụ trách đánh giá (cạnh phải) */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                    <span className="font-bold text-foreground text-xs">
                      {displayTime}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({displayDate})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-xs">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-foreground text-xs">
                    {displayTeacher}
                  </span>
                </div>
              </div>

              {/* Dòng 2: Cơ sở & Phòng test (cạnh phải) */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-foreground text-xs block truncate">
                      {booking.school}
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
                    {booking.room || 'Phòng A1'}
                  </span>
                </div>
              </div>

              {/* Dòng 3: Chương trình & Level */}
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-semibold text-foreground text-xs">
                    {booking.program}
                  </span>
                  {displayLevel && (
                    <Badge variant="secondary" className="text-xs font-normal h-4.5 px-1.5">
                      {displayLevel}
                    </Badge>
                  )}
                </div>
              </div>

              {booking.notes && booking.notes.length > 0 && (
                <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground italic text-xs flex-1 line-clamp-2">
                    &ldquo;{booking.notes[0].text}&rdquo;
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
                  onClick={() => router.push('/app/booking_test')}
                  className="h-6 px-2 text-xs font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10 border-primary/30 cursor-pointer shadow-2xs"
                >
                  <span>Xem danh sách lịch test</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {/* Dòng 1: Học viên */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                    <span className="font-bold text-foreground text-xs sm:text-sm">
                      {booking.childName}
                    </span>
                    {booking.dob && (
                      <span className="text-muted-foreground text-xs">
                        (Sinh năm {booking.dob})
                      </span>
                    )}
                  </div>
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
                  Người tạo: <strong className="font-medium text-foreground">{booking.createdBy || 'Người dùng hiện tại'}</strong>
                </span>
                <span className="font-medium text-amber-600 dark:text-amber-400 shrink-0">
                  Chờ đến hẹn
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
