'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
  Share2,
  Trophy,
  Check,
  GraduationCap,
  Sparkles,
  Download,
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
import { downloadMonthlyReportImage } from '../classes/detail/monthlyReportImageHelper'
import { StudentPhotoGallerySection } from './StudentPhotoGallerySection'
import { mockCareAlerts } from '@/mocks/careAlerts'
import {
  getMonthlyReportById,
  MONTH_OPTIONS,
} from '@/mocks/monthlyReports'
import { normalizeAwardBadge, DEFAULT_SECTION_B2_WEEKS } from '../classes/detail/monthlyReportHelpers'

export interface CourseDisplayOption {
  id: string
  subject: string
  program: string
  roadmap: string
  level: string
  classType: string
  teacherType: string
  teacherName: string
  dropdownLabel: string
}

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
  const [isExportingImage, setIsExportingImage] = useState(false)

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

  // Danh sách các khóa học / lớp học của học viên (không hiển thị mã lớp)
  const courseOptions = useMemo<CourseDisplayOption[]>(() => {
    const matchedAlerts = mockCareAlerts.filter(
      (a) =>
        a.studentId === report.studentId ||
        (a.studentName &&
          report.studentName &&
          a.studentName.toLowerCase().includes(report.studentName.toLowerCase()))
    )

    const resolveMathLevel = (raw?: string): string => {
      if (!raw) return 'Lớp 4'
      if (raw.toLowerCase().includes('lớp')) return raw
      if (raw.includes('1:6') || raw.includes('1:10') || raw.includes('1:15') || raw.includes('1:1')) {
        return 'Lớp 4'
      }
      if (raw.toLowerCase().includes('einstein')) return 'Lớp 1'
      if (raw === 'M1') return 'Lớp 4'
      if (raw === 'M2') return 'Lớp 5'
      return raw
    }

    if (matchedAlerts.length > 0) {
      const options: CourseDisplayOption[] = matchedAlerts.map((alert, idx) => {
        const isMath = alert.subject === 'Toán tư duy' || alert.subject?.toLowerCase().includes('toán')
        const subject = isMath ? 'Toán tư duy' : 'Tiếng Anh'
        const program = isMath ? 'Toán tư duy' : 'Tiếng Anh Station'
        const roadmap = isMath
          ? (alert.level?.toLowerCase().includes('einstein') ? 'Toán Tư Duy Einstein' : 'Toán Tư Duy Archimedes')
          : 'Cambridge Standard'
        const level = isMath ? resolveMathLevel(alert.level) : (alert.level || 'Level 4')
        const classType = (alert.level?.includes('1:6') || alert.schedule?.includes('1:6'))
          ? 'Lớp nhóm 1:6'
          : alert.level?.includes('1:1')
            ? 'Gia sư 1:1'
            : 'Lớp tiêu chuẩn 1:10'
        const isNative = alert.teacherCode?.includes('F') || alert.teacherCode?.toLowerCase().includes('native')
        const teacherType = isNative ? 'Mix' : 'VN'
        const teacherName = report.teacherName || (isMath ? 'Thầy Nguyễn Huy Hoàng' : 'Cô Ms.Chloe')

        return {
          id: alert.id || `course-${idx}`,
          subject,
          program,
          roadmap,
          level,
          classType,
          teacherType,
          teacherName,
          dropdownLabel: `${subject} • ${level} (${classType.replace('Lớp tiêu chuẩn ', '').replace('Lớp nhóm ', '')} - ${teacherType})`,
        }
      })

      // Nếu học sinh mới chỉ có 1 môn/lớp trong mock, bổ sung thêm khóa học song song để phụ huynh có thể chuyển xem
      if (options.length === 1) {
        const first = options[0]
        if (first.subject === 'Toán tư duy') {
          options.push({
            id: 'course-second-eng',
            subject: 'Tiếng Anh',
            program: 'Tiếng Anh Station',
            roadmap: 'Cambridge Standard',
            level: 'Level 4',
            classType: 'Lớp tiêu chuẩn 1:10',
            teacherType: 'VN',
            teacherName: 'Cô Ms.Chloe',
            dropdownLabel: 'Tiếng Anh • Level 4 (1:10 - VN)',
          })
        } else {
          options.push({
            id: 'course-second-math',
            subject: 'Toán tư duy',
            program: 'Toán tư duy',
            roadmap: 'Toán Tư Duy Archimedes',
            level: 'Lớp 4',
            classType: 'Lớp nhóm 1:6',
            teacherType: 'VN',
            teacherName: 'Thầy Nguyễn Huy Hoàng',
            dropdownLabel: 'Toán tư duy • Lớp 4 (1:6 - VN)',
          })
        }
      }

      return options
    }

    // Fallback mặc định nếu không tìm thấy alert
    return [
      {
        id: 'course-default-1',
        subject: 'Toán tư duy',
        program: 'Toán tư duy',
        roadmap: 'Toán Tư Duy Archimedes',
        level: 'Lớp 4',
        classType: 'Lớp nhóm 1:6',
        teacherType: 'VN',
        teacherName: report.teacherName || 'Thầy Nguyễn Huy Hoàng',
        dropdownLabel: 'Toán tư duy • Lớp 4 (1:6 - VN)',
      },
      {
        id: 'course-default-2',
        subject: 'Tiếng Anh',
        program: 'Tiếng Anh Station',
        roadmap: 'Cambridge Standard',
        level: 'Level 4',
        classType: 'Lớp tiêu chuẩn 1:10',
        teacherType: 'Mix',
        teacherName: 'Cô Ms.Chloe',
        dropdownLabel: 'Tiếng Anh • Level 4 (1:10 - Mix)',
      },
    ]
  }, [report.studentId, report.studentName, report.teacherName])

  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

  const activeCourseId = useMemo(() => {
    if (selectedCourseId && courseOptions.some((c) => c.id === selectedCourseId)) {
      return selectedCourseId
    }
    return courseOptions[0]?.id || ''
  }, [courseOptions, selectedCourseId])

  const currentCourse = useMemo(() => {
    return courseOptions.find((c) => c.id === activeCourseId) || courseOptions[0]
  }, [courseOptions, activeCourseId])

  const activeMonthConfig =
    MONTH_OPTIONS.find((m) => m.value === selectedMonthOption) ||
    MONTH_OPTIONS.find((m) => m.value === report.monthOptionValue) ||
    MONTH_OPTIONS[0]

  const studentMetrics = useMemo(() => {
    const isMath = currentCourse.subject === 'Toán tư duy'
    const alert = mockCareAlerts.find(
      (a) =>
        (a.studentId === report.studentId ||
          (a.studentName &&
            report.studentName &&
            a.studentName.toLowerCase().includes(report.studentName.toLowerCase()))) &&
        (isMath ? a.subject === 'Toán tư duy' : a.subject === 'Tiếng Anh')
    )

    if (alert) {
      return {
        attendanceRatio: alert.attendanceRatio || '6/7',
        lateCount: alert.attendanceRatio?.includes('5/7') ? 1 : 0,
        homeworkRatio: `${Math.round(7 * ((alert.homeworkCompletion || 90) / 100))}/7`,
        homeworkAvg: isMath ? '7.5' : '8.0',
        testScore: alert.lastTestScore ?? (isMath ? 8.5 : 8.0),
        priorTestScore: alert.priorTestScore ?? (isMath ? 8.0 : 7.5),
      }
    }

    return {
      attendanceRatio: isMath ? '6/7' : '7/7',
      lateCount: isMath ? 0 : 0,
      homeworkRatio: isMath ? '6/7' : '7/7',
      homeworkAvg: isMath ? '7.5' : '8.5',
      testScore: isMath ? 8.5 : 8.2,
      priorTestScore: isMath ? 8.0 : 7.8,
    }
  }, [report.studentId, report.studentName, currentCourse.subject])

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

  const handleDownloadImage = async () => {
    try {
      setIsExportingImage(true)
      toast.loading('Đang khởi tạo và tải ảnh báo cáo...', { id: 'download-landing-img' })
      await downloadMonthlyReportImage({
        student: {
          id: report.studentId,
          name: report.studentName,
          code: report.studentCode || '',
        },
        monthTitle: activeMonthConfig.current,
        nextMonthTitle: activeMonthConfig.next,
        dateStr: activeMonthConfig.dateStr,
        awardBadge: report.awardBadge,
        teacherName: currentCourse.teacherName || report.teacherName,
        subject: currentCourse.subject,
        roadmap: currentCourse.roadmap,
        level: currentCourse.level,
        metrics: studentMetrics,
        sectionA1Content: report.sectionA1Content,
        sectionA2Content: report.sectionA2Content,
        sectionB1Content: report.sectionB1Content,
        sectionB2Weeks: report.sectionB2Weeks && report.sectionB2Weeks.length > 0 ? report.sectionB2Weeks : DEFAULT_SECTION_B2_WEEKS,
      })
      toast.success(`Đã tải ảnh báo cáo tháng cho học viên ${report.studentName}!`, { id: 'download-landing-img' })
    } catch (err) {
      console.error(err)
      toast.error('Không thể tạo file ảnh. Vui lòng thử lại!', { id: 'download-landing-img' })
    } finally {
      setIsExportingImage(false)
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
    <div className="min-h-screen bg-muted/20 dark:bg-zinc-950 text-foreground font-sans pb-6 overflow-y-auto selection:bg-primary selection:text-primary-foreground print:bg-white print:pb-0">
      {/* ── TOP NAV BAR (Sticky Brand Navbar) ── */}
      <header className="sticky top-0 z-40 bg-background/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-border shadow-2xs print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-orange-50 dark:bg-zinc-800 p-0.5 border border-orange-200/80 dark:border-zinc-700">
              <Image
                src="/rinoedu-logo.png"
                alt="RinoEdu Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="relative h-4.5 w-20">
                <Image
                  src="/rinoedu-name.png"
                  alt="RinoEdu"
                  fill
                  sizes="80px"
                  className="object-contain object-left"
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-none">
                Báo Cáo Học Tập Định Kỳ
              </p>
            </div>
          </div>

          {/* Top Actions: Droplist chọn Khóa học & Droplist chọn Tháng & Chia sẻ */}
          <div className="flex items-center gap-2">
            {/* 1. Droplist chọn Môn học & Khóa học */}
            {courseOptions.length > 0 && (
              <Select value={activeCourseId} onValueChange={(val) => {
                setSelectedCourseId(val)
                const c = courseOptions.find(item => item.id === val)
                if (c) {
                  toast.success(`Đang xem báo cáo môn: ${c.subject} (${c.roadmap})`)
                }
              }}>
                <SelectTrigger className="h-8 text-xs font-medium w-[175px] sm:w-[195px] md:w-[205px] bg-background border-border rounded-lg shadow-3xs truncate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courseOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs font-normal">
                      {c.dropdownLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* 2. Droplist chọn Kỳ báo cáo Tháng */}
            <Select value={selectedMonthOption} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-8 text-xs font-medium w-[215px] sm:w-[245px] md:w-[255px] bg-background border-border rounded-lg shadow-3xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-xs font-normal">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 3. Nút Lưu ảnh */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="h-8 text-xs font-semibold rounded-lg border-primary/30 text-primary hover:bg-primary/5 hover:text-primary shadow-2xs gap-1.5 transition-all active:scale-95 cursor-pointer px-3"
              title="Tải trực tiếp ảnh báo cáo học tập rút gọn"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExportingImage ? 'Đang lưu...' : 'Lưu ảnh'}</span>
            </Button>

            {/* 4. Nút Chia sẻ */}
            <Button
              size="sm"
              onClick={handleCopyShareLink}
              className="h-8 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs gap-1.5 transition-all active:scale-95 cursor-pointer px-3"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (2-COLUMN BALANCED LAYOUT) ── */}
      <main className="max-w-5xl mx-auto px-3.5 sm:px-5 pt-3 sm:pt-3.5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── CỘT TRÁI: THÔNG TIN HỌC VIÊN (STICKY TRÊN DESKTOP) ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-12 space-y-3">
            <div className="rounded-xl bg-card border border-border/80 border-t-2 border-t-amber-500/80 shadow-2xs p-3 sm:p-3.5 space-y-2.5">
              {/* Avatar + Tên + Thời gian */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative shrink-0">
                  <div className="h-13 w-13 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-bold text-lg text-amber-700 dark:text-amber-400">
                    {sInitials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-0.5 rounded-full shadow-2xs border border-background">
                    <Trophy className="h-3 w-3" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {report.studentName}
                  </h1>
                  <p className="text-xs text-muted-foreground font-normal">
                    Thời gian:{' '}
                    <span className="text-foreground font-medium">
                      {activeMonthConfig.dateStr}
                    </span>
                  </p>
                </div>

                {/* Danh hiệu vinh danh tháng */}
                {report.awardBadge ? (
                  <div className="w-full pt-0.5">
                    <div className="inline-flex items-center justify-center w-full px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold text-xs border border-amber-300/60 shadow-3xs">
                      <span className="truncate">{normalizeAwardBadge(report.awardBadge)}</span>
                    </div>
                  </div>
                ) : null}

                {/* Khối Thông tin Khóa học & Lộ trình sư phạm */}
                <div className="w-full pt-0.5 text-left">
                  <div className="rounded-lg bg-muted/30 border border-border/50 p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground pb-0.5">
                      <GraduationCap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Thông tin khóa học</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground font-normal">Chương trình:</span>
                        <span className="font-medium text-foreground text-right">{currentCourse.program}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground font-normal">Lộ trình:</span>
                        <span className="font-medium text-amber-800 dark:text-amber-300 text-right">{currentCourse.roadmap}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground font-normal">Trình độ (Level):</span>
                        <span className="font-medium px-1.5 py-0.5 rounded bg-background border border-border/60 text-foreground text-xs">
                          {currentCourse.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thư viện ảnh học viên bên dưới thông tin con */}
            <StudentPhotoGallerySection
              studentId={report.studentId}
              studentName={report.studentName}
              initialPhotos={report.galleryPhotos}
            />
          </aside>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── CỘT PHẢI: BÁO CÁO HỌC TẬP (LÊN SÁT TRÊN CÙNG DƯỚI HEADER) ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <section className="lg:col-span-8 space-y-3">
            {/* Lời chúc & Ghi nhận từ Giáo viên phụ trách */}
            <div className="rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50/20 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-zinc-900 shadow-3xs p-3 sm:p-3.5 flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-xs leading-relaxed text-amber-950/90 dark:text-amber-100/90 flex-1 min-w-0">
                <p>
                  <span className="font-semibold text-amber-900 dark:text-amber-300">Rino Edu chúc mừng con </span>
                  <span className="font-bold text-foreground bg-amber-200/70 dark:bg-amber-900/60 px-1 py-0.2 rounded border border-amber-300/40">
                    {report.studentName}
                  </span>{' '}
                  đã hoàn thành tốt kỳ học vừa qua tại môn{' '}
                  <span className="font-semibold text-amber-900 dark:text-amber-300">
                    {currentCourse.subject}
                  </span>{' '}
                  ({currentCourse.roadmap})! Dưới đây là phần đánh giá năng lực chi tiết và định hướng rèn luyện từ giáo viên phụ trách{' '}
                  <span className="font-semibold text-foreground underline decoration-amber-400 decoration-2 underline-offset-2">
                    {currentCourse.teacherName || report.teacherName || 'Ms.Chloe'}
                  </span>
                  .
                </p>
              </div>
            </div>

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

            {/* 2. Khung Báo Cáo Chi Tiết */}
            <div className="bg-card rounded-xl border border-border/80 shadow-2xs p-3.5 sm:p-4 space-y-3.5">
              {/* SECTION A: ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP */}
              <div id="landing-section-a" className="space-y-2.5">
                <div className="flex items-center gap-2 pb-0.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                    A
                  </span>
                  <h3 className="text-xs font-semibold text-foreground tracking-tight uppercase">
                    Đánh giá quá trình học tập {activeMonthConfig.current}
                  </h3>
                </div>

                {/* Sub-section A1: 1. Nhận xét chung */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">
                    1. Nhận xét chung
                  </h4>
                  <div className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground/90 leading-relaxed font-sans">
                    <FormattedEvaluationContent
                      content={report.sectionA1Content}
                      type="general"
                    />
                  </div>
                </div>

                {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
                <div className="space-y-1 pt-0.5">
                  <h4 className="text-xs font-semibold text-foreground">
                    2. Nhận xét về kết quả học tập
                  </h4>
                  <div className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground/90 leading-relaxed font-sans">
                    <FormattedEvaluationContent
                      content={report.sectionA2Content}
                      type="academic"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: KẾ HOẠCH HỌC TẬP THÁNG TỚI */}
              <div className="space-y-2 pt-1.5">
                <div className="flex items-center gap-2 pb-0.5">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                    B
                  </span>
                  <h3 className="text-xs font-semibold text-foreground tracking-tight uppercase">
                    Kế hoạch học tập tháng tới {activeMonthConfig.next}
                  </h3>
                </div>

                {/* Sub-section 1: Nội dung bài học tháng tới */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">
                    1. Nội dung bài học tháng tới
                  </h4>
                  <div className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground/90 leading-relaxed font-sans whitespace-pre-line">
                    {report.sectionB1Content || (
                      <span className="italic text-muted-foreground/60 text-xs">
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
        <footer className="mt-5 pt-3 border-t border-border/50 text-center text-xs text-muted-foreground space-y-0.5 print:hidden">
          <p className="font-medium text-foreground">
            Hệ Thống Giáo Dục RinoEdu • Trung Tâm Đào Tạo & Phát Triển Năng Lực
          </p>
          <p className="text-xs text-muted-foreground/80">
            Báo cáo tiến trình học tập định kỳ được lưu trữ và cập nhật liên tục cho học viên.
          </p>
        </footer>
      </main>
    </div>
  )
}
