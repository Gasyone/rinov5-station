'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
  Printer,
  Share2,
  Sparkles,
  Trophy,
  Award,
  Check,
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
import { MonthlyReportStatsCards } from '../classes/detail/MonthlyReportStatsCards'
import { FormattedEvaluationContent } from '../classes/detail/FormattedEvaluationContent'
import { StudentPhotoGallerySection } from './StudentPhotoGallerySection'
import { mockCareAlerts } from '@/mocks/careAlerts'
import {
  getMonthlyReportById,
  MONTH_OPTIONS,
} from '@/mocks/monthlyReports'
import { normalizeAwardBadge } from '../classes/detail/monthlyReportHelpers'

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

  const studentMetrics = useMemo(() => {
    const alert = mockCareAlerts.find(
      (a) =>
        a.studentId === report.studentId ||
        (a.studentName &&
          report.studentName &&
          a.studentName.toLowerCase().includes(report.studentName.toLowerCase())) ||
        (a.classCode && report.studentCode && a.classCode === report.studentCode)
    )

    if (alert) {
      return {
        attendanceRatio: alert.attendanceRatio || '5/7',
        lateCount: alert.attendanceRatio?.includes('5/7') ? 1 : 0,
        homeworkRatio: `${Math.round(7 * ((alert.homeworkCompletion || 90) / 100))}/7`,
        homeworkAvg: '7.5',
        testScore: alert.lastTestScore ?? 8.0,
        priorTestScore: alert.priorTestScore ?? 5.5,
      }
    }

    return {
      attendanceRatio: '5/7',
      lateCount: 1,
      homeworkRatio: '7/7',
      homeworkAvg: '7.5',
      testScore: 8.0,
      priorTestScore: 5.5,
    }
  }, [report.studentId, report.studentName, report.studentCode])

  const handleMonthChange = (val: string) => {
    setSelectedMonthOption(val)
  }

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopiedLink(true)
          toast.success('Đã sao chép liên kết báo cáo học tập!')
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Brand Info (Đã xóa nút Back nội bộ) */}
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
                Báo Cáo Học Tập Định Kỳ
              </p>
            </div>
          </div>

          {/* Top Actions: Kỳ báo cáo Dropdown & In & Chia sẻ */}
          <div className="flex items-center gap-2">
            <Select value={selectedMonthOption} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-8.5 text-xs font-bold w-[200px] sm:w-[260px] bg-background border-border/80 rounded-xl shadow-3xs">
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
              onClick={handleCopyShareLink}
              className="h-8.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (2-COLUMN MODERN LAYOUT) ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── CỘT TRÁI: THÔNG TIN HỌC VIÊN (STICKY TRÊN DESKTOP) ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-16 space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-100/40 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-zinc-900 border border-amber-300/60 dark:border-amber-700/50 p-6 shadow-sm">
              {/* Subtle decorative glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl -z-10 pointer-events-none" />

              {/* Avatar + Tên + Thời gian (Đã xóa Mã HV) */}
              <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-amber-300/40 dark:border-amber-700/40">
                <div className="relative shrink-0">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md flex items-center justify-center">
                    <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-2xl text-amber-600 dark:text-amber-400">
                      {sInitials}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-2xs border-2 border-white dark:border-zinc-900">
                    <Trophy className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[11px] font-bold border border-amber-400/40">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    <span>Kỳ báo cáo {activeMonthConfig.current}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {report.studentName}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Thời gian:{' '}
                    <strong className="text-slate-700 dark:text-zinc-300">
                      {activeMonthConfig.dateStr}
                    </strong>
                  </p>
                </div>

                {/* Danh hiệu vinh danh tháng */}
                {report.awardBadge ? (
                  <div className="w-full pt-1">
                    <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wide shadow-sm border border-amber-300">
                      <Award className="h-4 w-4 fill-amber-950/20 shrink-0" />
                      <span className="truncate">{normalizeAwardBadge(report.awardBadge)}</span>
                    </div>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium mt-1.5">
                      Danh hiệu vinh danh tháng {activeMonthConfig.current}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Lời chúc & Ghi nhận từ Giáo viên phụ trách */}
              <div className="pt-4 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-zinc-200">
                <p>
                  Rino Edu xin chúc mừng con{' '}
                  <strong className="text-primary font-bold">{report.studentName}</strong> đã
                  hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết
                  và định hướng rèn luyện từ giáo viên phụ trách{' '}
                  <strong className="text-primary font-bold">
                    {report.teacherName || 'Ms.Chloe'}
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* Thư viện ảnh học viên bên dưới thông tin con */}
            <StudentPhotoGallerySection
              studentId={report.studentId}
              studentName={report.studentName}
            />
          </aside>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── CỘT PHẢI: BÁO CÁO HỌC TẬP (LÊN SÁT TRÊN CÙNG DƯỚI HEADER) ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <section className="lg:col-span-8 space-y-6">
            {/* 1. Smartcard Section (Chuyên cần, BTVN, Kiểm tra) đặt ngay đầu */}
            <MonthlyReportStatsCards
              currentMonth={activeMonthConfig.current}
              attendanceRatio={studentMetrics.attendanceRatio}
              lateCount={studentMetrics.lateCount}
              homeworkRatio={studentMetrics.homeworkRatio}
              homeworkAvg={studentMetrics.homeworkAvg}
              testScore={studentMetrics.testScore}
              priorTestScore={studentMetrics.priorTestScore}
              onScrollToEvaluation={() => {
                document.getElementById('landing-section-a')?.scrollIntoView({ behavior: 'smooth' })
              }}
            />

            {/* 2. Khung Báo Cáo Chi Tiết (Không còn thanh Header xám thừa thãi) */}
            <div className="bg-background rounded-3xl border border-border shadow-md overflow-hidden p-6 sm:p-7 space-y-6">
              {/* SECTION A: ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP */}
              <div id="landing-section-a" className="space-y-5">
                <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                  <span className="h-3 w-1.5 rounded-full bg-primary inline-block" />
                  <span>A - ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP {activeMonthConfig.current.toUpperCase()}</span>
                </h3>

                {/* Sub-section A1: 1. Nhận xét chung */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                    1. Nhận xét chung
                  </label>
                  <div className="w-full text-sm p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/20 text-foreground leading-relaxed font-sans shadow-3xs">
                    <FormattedEvaluationContent
                      content={report.sectionA1Content}
                      type="general"
                    />
                  </div>
                </div>

                {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    2. Nhận xét về kết quả học tập
                  </label>
                  <div className="w-full text-sm p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/20 text-foreground leading-relaxed font-sans shadow-3xs">
                    <FormattedEvaluationContent
                      content={report.sectionA2Content}
                      type="academic"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: KẾ HOẠCH HỌC TẬP THÁNG TỚI */}
              <div className="space-y-5 pt-4 border-t border-border/70">
                <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                  <span className="h-3 w-1.5 rounded-full bg-amber-500 inline-block" />
                  <span>B - KẾ HOẠCH HỌC TẬP THÁNG TỚI {activeMonthConfig.next.toUpperCase()}</span>
                </h3>

                {/* Sub-section 1: Nội dung bài học tháng tới */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                    1. Nội dung bài học tháng tới
                  </label>
                  <div className="w-full text-sm p-4 rounded-2xl border border-border/60 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line shadow-3xs">
                    {report.sectionB1Content || (
                      <span className="italic text-muted-foreground/60">
                        Chưa có nội dung bài học tháng tới.
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-section 2: Nội dung ôn tập riêng */}
                <MonthlyReportReviewItemsSection
                  items={currentWeeks}
                  onChange={() => {}}
                  readOnly={true}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── FOOTER TRANG NHÃ CHO LANDING PAGE BÁO CÁO ── */}
        <footer className="mt-12 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground space-y-1 print:hidden">
          <p className="font-semibold text-foreground">
            Hệ Thống Giáo Dục RinoEdu • Trung Tâm Đào Tạo & Phát Triển Năng Lực
          </p>
          <p className="text-[11px]">
            Báo cáo tiến trình học tập định kỳ được lưu trữ và cập nhật liên tục cho học viên.
          </p>
        </footer>
      </main>
    </div>
  )
}
