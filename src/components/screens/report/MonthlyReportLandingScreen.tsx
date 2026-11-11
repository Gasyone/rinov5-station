'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Sparkles, Lightbulb } from 'lucide-react'
import { MonthlyReportSectionB } from './MonthlyReportSectionB'
import { parseEvaluationContent } from '../classes/detail/FormattedEvaluationContent'
import { StudentPhotoGallerySection } from './StudentPhotoGallerySection'
import { MonthlyFeaturedVideoCard } from './MonthlyFeaturedVideoCard'
import { MonthlyReportFooter } from './MonthlyReportFooter'
import { MonthlyReportHeroBanner } from './MonthlyReportHeroBanner'
import { MonthlyReportCongratulationsCard } from './MonthlyReportCongratulationsCard'
import { MonthlyReportMetricsGrid, StudentMetricsData } from './MonthlyReportMetricsGrid'
import { mockCareAlerts } from '@/mocks/careAlerts'
import {
  getMonthlyReportById,
  MONTH_OPTIONS,
} from '@/mocks/monthlyReports'

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
  const [selectedMonthOption] = useState<string>(
    initialMonthOption || '4_5_2026'
  )
  const [refreshKey, setRefreshKey] = useState<number>(0)

  // Cấu hình hiển thị theo yêu cầu (Tạm thời ẩn Khoảnh khắc học tập và Media)
  const SHOW_KHOANH_KHAC_HOC_TAP = false
  const SHOW_MEDIA_VIDEO = false

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

  // Khóa học / môn học của học viên
  const currentCourse = useMemo<CourseDisplayOption>(() => {
    const matchedAlert = mockCareAlerts.find(
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

    if (matchedAlert) {
      const isMath = matchedAlert.subject === 'Toán tư duy' || matchedAlert.subject?.toLowerCase().includes('toán')
      const subject = isMath ? 'Toán tư duy' : 'Tiếng Anh'
      const program = isMath ? 'Toán tư duy' : 'Tiếng Anh Station'
      const roadmap = isMath
        ? (matchedAlert.level?.toLowerCase().includes('einstein') ? 'Toán Tư Duy Einstein' : 'Toán Tư Duy Archimedes')
        : 'Cambridge Standard'
      const level = isMath ? resolveMathLevel(matchedAlert.level) : (matchedAlert.level || 'Level 4')
      const classType = (matchedAlert.level?.includes('1:6') || matchedAlert.schedule?.includes('1:6'))
        ? 'Lớp nhóm 1:6'
        : matchedAlert.level?.includes('1:1')
          ? 'Gia sư 1:1'
          : 'Lớp tiêu chuẩn 1:10'
      const isNative = matchedAlert.teacherCode?.includes('F') || matchedAlert.teacherCode?.toLowerCase().includes('native')
      const teacherType = isNative ? 'Mix' : 'VN'
      const teacherName = report.teacherName || (isMath ? 'Thầy Nguyễn Huy Hoàng' : 'Cô Ms.Chloe')

      return {
        id: matchedAlert.id || 'course-main',
        subject,
        program,
        roadmap,
        level,
        classType,
        teacherType,
        teacherName,
        dropdownLabel: `${subject} • ${level} (${classType.replace('Lớp tiêu chuẩn ', '').replace('Lớp nhóm ', '')} - ${teacherType})`,
      }
    }

    // Fallback mặc định
    return {
      id: 'course-default',
      subject: 'Toán tư duy',
      program: 'Toán tư duy',
      roadmap: 'Toán Tư Duy Einstein',
      level: 'Lớp 1',
      classType: 'Lớp tiêu chuẩn 1:10',
      teacherType: 'VN',
      teacherName: report.teacherName || 'Ms.Chloe',
      dropdownLabel: 'Toán tư duy • Lớp 1 (1:10 - VN)',
    }
  }, [report.studentId, report.studentName, report.teacherName])

  const activeMonthConfig =
    MONTH_OPTIONS.find((m) => m.value === selectedMonthOption) ||
    MONTH_OPTIONS.find((m) => m.value === report.monthOptionValue) ||
    MONTH_OPTIONS[0]

  const studentMetrics = useMemo<StudentMetricsData>(() => {
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

  const currentWeeks =
    report.sectionB2Weeks && report.sectionB2Weeks.length > 0 ? report.sectionB2Weeks : []

  // Phân tách Section A1 (Nhận xét chung) thành 2 thẻ Điểm nổi bật & Điểm cần lưu ý
  const parsedA1Items = useMemo(() => {
    return parseEvaluationContent(report.sectionA1Content, 'general')
  }, [report.sectionA1Content])

  const highlightItem = useMemo(() => {
    return (
      parsedA1Items.find((it) => {
        const l = it.label.toLowerCase()
        return (
          l.includes('nổi bật') ||
          l.includes('mạnh') ||
          l.includes('ưu điểm') ||
          l.includes('tốt')
        )
      }) || parsedA1Items[0]
    )
  }, [parsedA1Items])

  const noteItem = useMemo(() => {
    return (
      parsedA1Items.find((it) => {
        const l = it.label.toLowerCase()
        return (
          l.includes('lưu ý') ||
          l.includes('cải thiện') ||
          l.includes('hạn chế') ||
          l.includes('nhược điểm')
        )
      }) || (parsedA1Items.length > 1 ? parsedA1Items[1] : undefined)
    )
  }, [parsedA1Items])

  // Phân tách Section A2 (Nhận xét kết quả học tập)
  const academicItems = useMemo(() => {
    const items = parseEvaluationContent(report.sectionA2Content, 'academic')
    if (items.length > 0) return items
    return [{ label: 'Kết quả học tập', body: report.sectionA2Content, colorClass: '' }]
  }, [report.sectionA2Content])

  return (
    <div className="layout-report min-h-screen relative bg-[#F3F3F3] text-foreground font-sans overflow-x-hidden selection:bg-[#EA2F2F] selection:text-white print:bg-white print:pb-0">
      {/* ── SIGNATURE RINOEDU HERO BANNER (ĐÃ TÍCH HỢP LOGO RINOEDU BÊN PHẢI) ── */}
      <MonthlyReportHeroBanner
        studentName={report.studentName}
        awardBadge={report.awardBadge}
        dateStr={activeMonthConfig.dateStr}
        currentCourse={currentCourse}
        teacherName={report.teacherName}
      />

      {/* ── MAIN CONTENT CONTAINER (GỌN GÀNG, BỎ TRÙNG LẶP HỌC VIÊN, VỪA VẶN MẮT NHÌN) ── */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-5 -mt-8 sm:-mt-10 z-10 relative space-y-3.5 sm:space-y-4 pb-4">
        {/* 1. LỜI CHÚC MỪNG TINH GỌN TỪ RINOEDU (KHÔNG LẶP LẠI THÔNG TIN HỌC VIÊN) */}
        <MonthlyReportCongratulationsCard
          studentName={report.studentName}
          currentCourse={currentCourse}
        />

        {/* 2. CHUYÊN CẦN, BTVN & ĐIỂM KIỂM TRA (3 TILES GỌN GÀNG) */}
        <MonthlyReportMetricsGrid
          metrics={studentMetrics}
          onScrollToEvaluation={() => {
            document.getElementById('landing-section-a')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* Video điểm nhấn học tập nổi bật theo tháng (khi bật) */}
        {SHOW_MEDIA_VIDEO && report.featuredVideo && (
          <MonthlyFeaturedVideoCard video={report.featuredVideo} />
        )}

        {/* 3. SECTION A: ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP */}
        <div id="landing-section-a" className="bg-white rounded-2xl box-shadow-report p-3.5 sm:p-4 border border-slate-100/90 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#EA2D2D] to-[#F98A3A] text-white text-xs font-bold shadow-2xs">
              A
            </span>
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Đánh giá quá trình học tập {activeMonthConfig.current}
            </h3>
          </div>

          {/* 1. Nhận xét thái độ & thói quen học tập (Điểm nổi bật & Điểm cần lưu ý) */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA2D2D]" />
              1. Nhận xét thái độ & thói quen học tập
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {/* Thẻ Điểm nổi bật */}
              <div className="rounded-xl p-3 border border-emerald-200/90 bg-emerald-50/40 shadow-3xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Điểm nổi bật & cần phát huy</span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal whitespace-pre-line">
                  {highlightItem?.body || report.sectionA1Content}
                </p>
              </div>

              {/* Thẻ Điểm cần lưu ý */}
              <div className="rounded-xl p-3 border border-amber-200/90 bg-amber-50/40 shadow-3xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Điểm cần lưu ý & rèn luyện thêm</span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal whitespace-pre-line">
                  {noteItem?.body ||
                    'Con tiếp tục duy trì nỗ lực học tập để đạt kết quả tốt nhất trong kỳ học tới.'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Nhận xét về năng lực & kết quả học tập chi tiết */}
          <div className="space-y-2 pt-0.5">
            <h4 className="text-xs sm:text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA2D2D]" />
              2. Nhận xét về năng lực & kết quả học tập chi tiết
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {academicItems.map((item, idx) => {
                const isVocab =
                  item.label.toLowerCase().includes('từ vựng') ||
                  item.label.toLowerCase().includes('phonics')
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-3 border shadow-3xs space-y-1 ${
                      isVocab
                        ? 'border-sky-200/90 bg-sky-50/30'
                        : 'border-purple-200/90 bg-purple-50/30'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isVocab ? 'bg-sky-500' : 'bg-purple-500'
                        }`}
                      />
                      <span>
                        {item.label ? item.label.replace(':', '') : `Năng lực ${idx + 1}`}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal whitespace-pre-line">
                      {item.body}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4. SECTION B: KẾ HOẠCH HỌC TẬP THÁNG TỚI */}
        <MonthlyReportSectionB
          monthName={activeMonthConfig.next}
          b1Content={report.sectionB1Content}
          weeks={currentWeeks}
        />

        {/* Thư viện ảnh học viên (khi bật) */}
        {SHOW_KHOANH_KHAC_HOC_TAP && (
          <StudentPhotoGallerySection
            studentId={report.studentId}
            studentName={report.studentName}
            initialPhotos={report.galleryPhotos}
          />
        )}

        {/* 5. LỜI DẶN DÒ PHỤ HUYNH TỪ GIÁO VIÊN PHỤ TRÁCH */}
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 p-4 sm:p-5 text-center space-y-1.5 box-shadow-report print:hidden">
          <p className="text-xs sm:text-[13px] font-normal text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Con sẽ phát phiếu và tranh học của phần ôn luyện riêng vào buổi tới. Con luyện tập phiếu
            bài tập, sau đó dựa trên tranh ảnh trên phiếu, con sẽ chỉ tranh trên phiếu, đọc to.{' '}
            <br className="hidden md:inline" />
            Ba mẹ hỗ trợ con quay và gửi video qua Zalo cho giáo viên hàng tuần. Ba mẹ có thể cho con
            đến sớm để giáo viên kiểm tra bài con mỗi buổi nhé.
          </p>
          <p className="text-xs sm:text-sm font-bold text-amber-900 pt-0.5">Trân trọng cảm ơn!</p>
        </div>
      </main>

      {/* ── OFFICIAL RINOEDU FOOTER (CHUẨN THIẾT KẾ RINOEDU.AI) ── */}
      <MonthlyReportFooter />
    </div>
  )
}
