'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronLeft,
  Printer,
  Send,
  Share2,
  Sparkles,
  Trophy,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { MonthlyReportReviewItemsSection } from '../classes/detail/MonthlyReportReviewItemsSection'
import {
  getMonthlyReportById,
  MONTH_OPTIONS,
} from '@/mocks/monthlyReports'

interface MonthlyReportLandingScreenProps {
  reportIdOrStudentId: string
  initialMonthOption?: string
}

export function MonthlyReportLandingScreen({
  reportIdOrStudentId,
  initialMonthOption,
}: MonthlyReportLandingScreenProps) {
  const [selectedMonthOption, setSelectedMonthOption] = useState<string>(
    initialMonthOption || '4_5_2026'
  )
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [copiedLink, setCopiedLink] = useState(false)

  // Truy xuất báo cáo qua useMemo, tự động re-calculate khi đổi tháng hoặc có sự kiện cập nhật
  const report = useMemo(() => {
    void refreshKey
    return getMonthlyReportById(reportIdOrStudentId, selectedMonthOption)
  }, [reportIdOrStudentId, selectedMonthOption, refreshKey])

  // Lắng nghe sự kiện cập nhật báo cáo từ modal hoặc các màn hình khác
  useEffect(() => {
    const handleReportUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ studentId?: string }>
      if (
        !customEvent.detail?.studentId ||
        customEvent.detail.studentId === report.studentId ||
        reportIdOrStudentId.includes(customEvent.detail.studentId)
      ) {
        setRefreshKey((prev) => prev + 1)
      }
    }

    window.addEventListener('rinov5-monthly-reports-updated', handleReportUpdate)
    return () => {
      window.removeEventListener('rinov5-monthly-reports-updated', handleReportUpdate)
    }
  }, [reportIdOrStudentId, report.studentId])

  const activeMonthConfig =
    MONTH_OPTIONS.find((m) => m.value === selectedMonthOption) ||
    MONTH_OPTIONS.find((m) => m.value === report.monthOptionValue) ||
    MONTH_OPTIONS[0]

  const handleMonthChange = (val: string) => {
    setSelectedMonthOption(val)
  }

  const handleSendToParent = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopiedLink(true)
          toast.success(
            `Đã sao chép liên kết Landing Page báo cáo ${activeMonthConfig.current} gửi phụ huynh học viên ${report.studentName}!`
          )
          setTimeout(() => setCopiedLink(false), 2500)
        })
        .catch(() => {
          toast.error('Không thể sao chép liên kết.')
        })
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const currentWeeks =
    report.sectionB2Weeks && report.sectionB2Weeks.length > 0
      ? report.sectionB2Weeks
      : []

  const sInitials = report.studentName
    .trim()
    .split(' ')
    .slice(-2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-zinc-950 text-foreground font-sans pb-16 overflow-y-auto selection:bg-primary selection:text-primary-foreground print:bg-white print:pb-0">
      {/* ── TOP NAV BAR (Sticky Brand Navbar) ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-border/80 shadow-2xs print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/app/classes"
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
              title="Quay lại danh sách lớp học"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-orange-50 dark:bg-zinc-800 p-1 border border-orange-200/80 dark:border-zinc-700">
                <Image
                  src="/rinoedu-logo.png"
                  alt="RinoEdu Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="relative h-5 w-24">
                  <Image
                    src="/rinoedu-name.png"
                    alt="RinoEdu"
                    fill
                    sizes="100px"
                    className="object-contain object-left"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                  Hệ thống Báo Cáo Học Tập
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions: Kỳ báo cáo Dropdown & In & Chia sẻ */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Select value={selectedMonthOption} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-8.5 text-xs font-bold w-[220px] sm:w-[260px] bg-background border-border/80 rounded-xl shadow-3xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs font-medium">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8.5 text-xs font-semibold rounded-xl gap-1.5 hidden sm:inline-flex cursor-pointer"
              title="In báo cáo học tập hoặc lưu file PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In báo cáo</span>
            </Button>

            <Button
              size="sm"
              onClick={handleSendToParent}
              className="h-8.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ── PHẦN THÔNG TIN HỌC VIÊN (GIỮ NGUYÊN HERO BANNER NHƯ BẢN TRƯỚC ĐÓ) ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-100/40 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-zinc-900 border border-amber-300/60 dark:border-amber-700/50 p-6 sm:p-8 shadow-sm">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Student Info Left */}
            <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
              {/* Avatar với chữ cái đầu viết tắt + Icon Trophy */}
              <div className="relative shrink-0">
                <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md flex items-center justify-center">
                  <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-2xl text-amber-600 dark:text-amber-400">
                    {sInitials}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-2xs border-2 border-white dark:border-zinc-900">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Tên học viên, Mã HV & Thời gian */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[11px] font-bold border border-amber-400/40">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span>Kỳ báo cáo {activeMonthConfig.current}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {report.studentName}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  <span>
                    Mã HV:{' '}
                    <strong className="font-mono text-slate-700 dark:text-zinc-300">
                      {report.studentCode || 'HV-CODE'}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Thời gian:{' '}
                    <strong className="text-slate-700 dark:text-zinc-300">
                      {activeMonthConfig.dateStr}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Award Badge Pill Right */}
            <div className="shrink-0 flex flex-col items-center sm:items-end w-full md:w-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-black text-sm uppercase tracking-wide shadow-md border-2 border-amber-300">
                <Award className="h-5 w-5 fill-amber-950/20" />
                <span>🏆 {report.awardBadge || 'CHIẾN BINH BỨT PHÁ'}</span>
              </div>
              <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-semibold mt-1.5 text-center sm:text-right">
                Danh hiệu vinh danh tháng {activeMonthConfig.current}
              </span>
            </div>
          </div>

          {/* Lời chúc từ Giáo viên phụ trách */}
          <div className="mt-6 pt-5 border-t border-amber-400/30 text-sm sm:text-[14.5px] leading-relaxed text-slate-800 dark:text-zinc-200">
            <p>
              Rino Edu xin chúc mừng con{' '}
              <strong className="text-primary font-bold">{report.studentName}</strong> đã
              hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết
              và định hướng bứt phá từ giáo viên phụ trách{' '}
              <strong className="text-primary font-bold">
                {report.teacherName || 'Ms.Chloe'}
              </strong>
              .
            </p>
          </div>
        </div>

        {/* ── PHẦN NỘI DUNG BÁO CÁO (CHUẨN BẢN MODAL DETAIL VIEW MODE) ── */}
        <div className="bg-background rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col">
          {/* Header Bar của khung báo cáo */}
          <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-muted/20">
            <h2 className="text-base font-extrabold text-foreground tracking-tight">
              BÁO CÁO HỌC TẬP CHUYÊN SÂU & KẾ HOẠCH HỌC TẬP
            </h2>
            <span className="text-xs text-muted-foreground font-semibold">
              Kỳ: <strong className="text-foreground">{activeMonthConfig.current}</strong>
            </span>
          </div>

          {/* Thân báo cáo */}
          <div className="p-6 space-y-6 bg-background">
            {/* SECTION A: BÁO CÁO HỌC TẬP CHUYÊN SÂU */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                A - BÁO CÁO HỌC TẬP CHUYÊN SÂU {activeMonthConfig.current.toUpperCase()}
              </h4>

              {/* Sub-section A1: 1. Nhận xét chung */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                    1. Nhận xét chung
                  </label>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-normal">
                    <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                    Nội dung được AI tổng hợp từ các buổi học trong tháng của học viên.
                  </span>
                </div>
                <div className="w-full text-sm p-4 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                  {report.sectionA1Content || (
                    <span className="italic text-muted-foreground/60">
                      Chưa có nhận xét chung.
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    2. Nhận xét về kết quả học tập
                  </label>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-normal">
                    <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                    Nội dung được AI tổng hợp từ các buổi học trong tháng của học viên.
                  </span>
                </div>
                <div className="w-full text-sm p-4 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                  {report.sectionA2Content || (
                    <span className="italic text-muted-foreground/60">
                      Chưa có nhận xét kết quả học tập.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION B: KẾ HOẠCH HỌC TẬP CẢI THIỆN */}
            <div className="space-y-4 pt-3 border-t border-border/70">
              <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
              </h4>

              {/* Sub-section 1: Nội dung bài học tháng tới */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                  1. Nội dung bài học tháng tới
                </label>
                <div className="w-full text-sm p-4 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                  {report.sectionB1Content || (
                    <span className="italic text-muted-foreground/60">
                      Chưa có nội dung bài học tháng tới.
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-section 2: Nội dung ôn tập riêng (dùng MonthlyReportReviewItemsSection readOnly chuẩn) */}
              <MonthlyReportReviewItemsSection
                items={currentWeeks}
                onChange={() => {}}
                readOnly={true}
              />
            </div>
          </div>

          {/* Footer Bar của khung báo cáo (Giống Footer Bar của Modal Detail) */}
          <div className="px-6 py-3.5 border-t bg-muted/10 flex items-center justify-between shrink-0">
            {/* Trạng thái bên trái */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Báo cáo tự động hàng tháng</span>
              </div>
            </div>

            {/* Nhóm nút hành động bên phải */}
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs font-semibold px-3.5 rounded-lg border-border cursor-pointer gap-1.5"
                title="In báo cáo học tập hoặc xuất file PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">In báo cáo</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSendToParent}
                className="text-xs font-semibold px-3.5 rounded-lg border-primary/30 text-primary hover:bg-primary/5 cursor-pointer gap-1.5"
                title="Gửi báo cáo và sao chép liên kết cho phụ huynh"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{copiedLink ? 'Đã sao chép link!' : 'Gửi phụ huynh'}</span>
              </Button>

              <Link href="/app/classes">
                <Button
                  type="button"
                  size="sm"
                  className="text-xs font-bold px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Đóng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
