'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, Loader2, Check, Pencil, Send, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { RosterStudent } from './classesDetailTypes'
import { MonthlyReportReviewItemsSection } from './MonthlyReportReviewItemsSection'
import { MonthlyReportStatsCards } from './MonthlyReportStatsCards'
import { MonthlyReportRosterSidebar } from './MonthlyReportRosterSidebar'
import { mockCareAlerts } from '@/mocks/careAlerts'
import {
  MOCK_LESSONS_REVIEW,
  getReviewContentForRange,
  getAiSynthesizedNextMonthPlan,
  getDirectLessonPlanForRange,
  WeekReviewItem,
  DEFAULT_SECTION_B2_WEEKS,
  DetailedMonthlyReportForm,
  DEFAULT_FILLED_REPORT_FORM,
  EMPTY_REPORT_FORM,
} from './monthlyReportHelpers'
import {
  getStudentMonthlyReports,
  saveStudentMonthlyReport,
  MONTH_OPTIONS,
  DEFAULT_SECTION_A1_TEXT,
  DEFAULT_SECTION_A2_TEXT,
} from '@/mocks/monthlyReports'

interface StudentMonthlyReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: RosterStudent[]
  initialStudentId?: string
  initialMonthKey?: string
}

const AWARD_BADGES = [
  'CHIẾN BINH BỨT PHÁ',
  'HỌC VIÊN XUẤT SẮC',
  'NGÔI SAO CHĂM NGOAN',
  'CHIẾN BINH TIẾN BỘ',
  'NGÔI SAO SÁNG TẠO',
]

function resolveMonthValue(key?: string): string {
  if (!key) return '4_5_2026'
  const match = MONTH_OPTIONS.find(
    (m) => m.value === key || m.monthKey === key || m.label.includes(key) || key.includes(m.current)
  )
  return match ? match.value : '4_5_2026'
}

export function StudentMonthlyReportDialog({
  open,
  onOpenChange,
  students,
  initialStudentId,
  initialMonthKey,
}: StudentMonthlyReportDialogProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => resolveMonthValue(initialMonthKey))
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id ?? '')
  )
  const [isSynthesizingAi, setIsSynthesizingAi] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Track prevOpen to sync initial props on open
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      const sId = initialStudentId || students[0]?.id || ''
      if (sId) {
        setSelectedStudentId(sId)
      }
      setIsEditing(false)
      if (initialMonthKey) setSelectedMonthKey(resolveMonthValue(initialMonthKey))
    }
  }

  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  // Track created status per student ID
  const [reportStatusMap, setReportStatusMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    students.forEach((s) => {
      const existing = getStudentMonthlyReports(s.id || s.name)
      map[s.id] = existing.length > 0
    })
    return map
  })

  // Helper to load report form from mock database
  const getFormForStudentAndMonth = (sId: string, mKey: string): DetailedMonthlyReportForm => {
    const s = students.find((item) => item.id === sId) || students[0]
    if (!s) return { ...DEFAULT_FILLED_REPORT_FORM }
    const reports = getStudentMonthlyReports(s.id || s.name)
    const monthOpt = MONTH_OPTIONS.find((m) => m.value === mKey) || MONTH_OPTIONS[0]
    const existing = reports.find(
      (r) => r.monthOptionValue === mKey || r.monthKey.includes(monthOpt.current)
    )
    if (existing) {
      return {
        monthPeriod: existing.dateStr,
        awardBadge: existing.awardBadge,
        teacherName: existing.teacherName,
        sectionAContent: existing.sectionAContent || `${existing.sectionA1Content}\n\n${existing.sectionA2Content}`,
        sectionA1Content: existing.sectionA1Content,
        sectionA2Content: existing.sectionA2Content,
        sectionB1Content: existing.sectionB1Content,
        sectionB2StartLesson: existing.sectionB2StartLesson,
        sectionB2EndLesson: existing.sectionB2EndLesson,
        sectionB2Weeks: existing.sectionB2Weeks,
        sectionB2Content: existing.sectionB2Content || '',
      }
    }
    return { ...DEFAULT_FILLED_REPORT_FORM }
  }

  // Report forms per student
  const [reportsMap, setReportsMap] = useState<Record<string, DetailedMonthlyReportForm>>({})

  const currentForm = reportsMap[selectedStudentId] || getFormForStudentAndMonth(selectedStudentId, selectedMonthKey)

  const handleUpdateForm = (fields: Partial<DetailedMonthlyReportForm>) => {
    setReportsMap((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...(prev[selectedStudentId] || getFormForStudentAndMonth(selectedStudentId, selectedMonthKey)),
        ...fields,
      },
    }))
  }

  const handleMonthChange = (newMonthKey: string) => {
    setSelectedMonthKey(newMonthKey)
    const newForm = getFormForStudentAndMonth(selectedStudentId, newMonthKey)
    setReportsMap((prev) => ({
      ...prev,
      [selectedStudentId]: newForm,
    }))
  }

  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId)
    const newForm = getFormForStudentAndMonth(sId, selectedMonthKey)
    setReportsMap((prev) => ({
      ...prev,
      [sId]: newForm,
    }))
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    const freshForm = getFormForStudentAndMonth(selectedStudentId, selectedMonthKey)
    setReportsMap((prev) => ({
      ...prev,
      [selectedStudentId]: freshForm,
    }))
    setIsEditing(false)
    toast.info('Đã hủy các chỉnh sửa chưa lưu.')
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0]

  const studentMetrics = useMemo(() => {
    if (!selectedStudent) {
      return {
        attendanceRatio: '5/7',
        lateCount: 1,
        homeworkRatio: '7/7',
        homeworkAvg: '7.5',
        testScore: 8.0,
        priorTestScore: 5.5,
      }
    }

    const alert = mockCareAlerts.find(
      (a) =>
        a.studentId === selectedStudent.id ||
        (a.studentName &&
          selectedStudent.name &&
          a.studentName.toLowerCase().includes(selectedStudent.name.toLowerCase())) ||
        (a.classCode && selectedStudent.code && a.classCode === selectedStudent.code)
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
  }, [selectedStudent])

  // Step 1: Handle Start Lesson change
  const handleStartLessonChange = (startNum: number) => {
    const endNum = currentForm.sectionB2EndLesson || 10
    const newReviewContent = getReviewContentForRange(startNum, endNum)
    const newB1Content = getDirectLessonPlanForRange(startNum, endNum)
    handleUpdateForm({
      sectionB2StartLesson: startNum,
      sectionB2Content: newReviewContent,
      sectionB1Content: newB1Content,
    })
  }

  // Step 1: Handle End Lesson change
  const handleEndLessonChange = (endNum: number) => {
    const startNum = currentForm.sectionB2StartLesson || 8
    const newReviewContent = getReviewContentForRange(startNum, endNum)
    const newB1Content = getDirectLessonPlanForRange(startNum, endNum)
    handleUpdateForm({
      sectionB2EndLesson: endNum,
      sectionB2Content: newReviewContent,
      sectionB1Content: newB1Content,
    })
  }

  // Step 2: Handle AI Synthesis button click for Section 1
  const handleAiSynthesizeNextMonthPlan = () => {
    setIsSynthesizingAi(true)
    setTimeout(() => {
      setIsSynthesizingAi(false)
      const startNum = currentForm.sectionB2StartLesson || 8
      const endNum = currentForm.sectionB2EndLesson || 10
      const synthesizedText = getAiSynthesizedNextMonthPlan(startNum, endNum)
      handleUpdateForm({ sectionB1Content: synthesizedText })
      toast.success(`✨ AI đã tổng hợp thành công nội dung bài học tháng tới (Bài ${startNum} đến Bài ${endNum})!`)
    }, 400)
  }

  const handleSave = () => {
    setReportStatusMap((prev) => ({
      ...prev,
      [selectedStudentId]: true,
    }))

    // Lưu đồng bộ vào CSDL mock dùng chung
    saveStudentMonthlyReport({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentCode: selectedStudent.code,
      monthKey: activeMonthConfig.current + '/2026',
      monthOptionValue: selectedMonthKey,
      monthTitle: `BÁO CÁO HỌC TẬP CHUYÊN SÂU ${activeMonthConfig.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${activeMonthConfig.next.toUpperCase()}`,
      dateStr: activeMonthConfig.dateStr,
      awardBadge: currentForm.awardBadge,
      teacherName: currentForm.teacherName,
      sectionA1Content: currentForm.sectionA1Content,
      sectionA2Content: currentForm.sectionA2Content,
      sectionAContent: `${currentForm.sectionA1Content}\n\n${currentForm.sectionA2Content}`,
      sectionB1Content: currentForm.sectionB1Content,
      sectionB2StartLesson: currentForm.sectionB2StartLesson,
      sectionB2EndLesson: currentForm.sectionB2EndLesson,
      sectionB2Weeks: currentForm.sectionB2Weeks,
      sectionB2Content: currentForm.sectionB2Content,
      sectionBContent: `${currentForm.sectionB1Content}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
      isCurrent: selectedMonthKey === '4_5_2026',
    })

    setIsEditing(false)
    toast.success(`Đã lưu báo cáo chuyên sâu & kế hoạch học tập cho học viên ${selectedStudent.name}!`)
  }

  const getLandingPageUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/report/${selectedStudent.id}?month=${encodeURIComponent(selectedMonthKey)}`
  }

  const handleSendToParent = () => {
    const link = getLandingPageUrl()
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success(`Đã sao chép liên kết Landing Page báo cáo ${activeMonthConfig.current} gửi phụ huynh học viên ${selectedStudent.name}!`))
      .catch(() => toast.error('Không thể sao chép liên kết.'))
  }

  const currentWeeks = currentForm.sectionB2Weeks && currentForm.sectionB2Weeks.length > 0
    ? currentForm.sectionB2Weeks
    : EMPTY_REPORT_FORM.sectionB2Weeks

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            'max-w-[95vw] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-3xl border bg-background shadow-2xl transition-all',
            students.length > 1 ? 'lg:max-w-[1020px]' : 'md:max-w-[840px] lg:max-w-[860px]'
          )}
        >
          {/* Top Header Bar (Xóa subtitle ở header modal) */}
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between shrink-0 bg-muted/20">
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <span>BÁO CÁO HỌC TẬP CHUYÊN SÂU & KẾ HOẠCH HỌC TẬP</span>
              </DialogTitle>
            </div>

            {/* Select Reporting Month Dropdown */}
            <div className="flex items-center gap-2 me-6">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Kỳ báo cáo:</span>
              <Select value={selectedMonthKey} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-8 text-xs font-bold w-[280px] bg-background border-border/80 rounded-xl">
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
          </DialogHeader>

          {/* Main Content Area (Sidebar Left + Form Right) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Roster Student Sidebar (Only displayed when there are multiple students) */}
            {students.length > 1 && (
              <MonthlyReportRosterSidebar
                students={students}
                selectedStudentId={selectedStudentId}
                reportStatusMap={reportStatusMap}
                onSelectStudent={handleSelectStudent}
              />
            )}

            {/* Right Report Detail Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-background">
              {/* Top Banner Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                  <div className="text-muted-foreground font-medium">
                    Kết quả học tập từ <strong className="text-foreground font-bold">{activeMonthConfig.dateStr}</strong>
                  </div>

                  {/* Award Badge: Select khi sửa, Pill tĩnh khi xem */}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Select
                        value={currentForm.awardBadge}
                        onValueChange={(val) => handleUpdateForm({ awardBadge: val })}
                      >
                        <SelectTrigger className="h-8 text-xs font-black bg-amber-400 text-amber-950 border-amber-500 rounded-full px-4 uppercase tracking-wide">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AWARD_BADGES.map((badge) => (
                            <SelectItem key={badge} value={badge} className="text-xs font-bold">
                              🏆 {badge}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wide shadow-2xs">
                      🏆 {currentForm.awardBadge || 'Học viên Chăm chỉ'}
                    </div>
                  )}
                </div>

                {/* Teacher Note Row */}
                {isEditing ? (
                  <div className="pt-2 border-t border-amber-400/20 flex items-start gap-2 text-sm text-muted-foreground italic">
                    <Pencil className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 not-italic stroke-[2.5] mt-0.5" />
                    <span>
                      Rino Edu xin chúc mừng con <strong className="text-primary font-bold not-italic">{selectedStudent.name}</strong> đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết và định hướng bứt phá từ giáo viên phụ trách{' '}
                      <input
                        type="text"
                        value={currentForm.teacherName}
                        onChange={(e) => handleUpdateForm({ teacherName: e.target.value })}
                        placeholder="Tên Giáo viên"
                        className="inline-block w-32 text-center text-sm font-bold text-primary border-b border-primary/40 bg-transparent focus:outline-none not-italic"
                      />.
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-amber-400/20 text-sm text-foreground/90 leading-relaxed">
                    Rino Edu xin chúc mừng con <strong className="text-primary font-bold">{selectedStudent.name}</strong> đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết và định hướng bứt phá từ giáo viên phụ trách <strong className="text-primary font-bold">{currentForm.teacherName || 'Nguyễn Thu Thảo'}</strong>.
                  </div>
                )}
              </div>

              {/* Smartcard Section (Chuyên cần, BTVN, Điểm kiểm tra) đưa lên trên mục A */}
              <MonthlyReportStatsCards
                currentMonth={activeMonthConfig.current}
                attendanceRatio={studentMetrics.attendanceRatio}
                lateCount={studentMetrics.lateCount}
                homeworkRatio={studentMetrics.homeworkRatio}
                homeworkAvg={studentMetrics.homeworkAvg}
                testScore={studentMetrics.testScore}
                priorTestScore={studentMetrics.priorTestScore}
                onScrollToEvaluation={() => {
                  document.getElementById('dialog-report-section-a')?.scrollIntoView({ behavior: 'smooth' })
                }}
              />

              {/* SECTION A: BÁO CÁO HỌC TẬP CHUYÊN SÂU (TÁCH THÀNH 2 MỤC) */}
              <div id="dialog-report-section-a" className="space-y-4 pt-2 border-t">
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
                  {isEditing ? (
                    <textarea
                      rows={6}
                      value={currentForm.sectionA1Content}
                      onChange={(e) => handleUpdateForm({ sectionA1Content: e.target.value })}
                      placeholder="Nhập 'Điểm nổi bật: ...' và 'Điểm cần lưu ý: ...'"
                      className="w-full text-sm p-3.5 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y"
                    />
                  ) : (
                    <div className="w-full text-sm p-4 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                      {currentForm.sectionA1Content || (
                        <span className="italic text-muted-foreground/60">Chưa có nhận xét chung.</span>
                      )}
                    </div>
                  )}
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
                      Nội dung AI được tổng hợp từ các BTVN trong tháng của học viên.
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={5}
                      value={currentForm.sectionA2Content}
                      onChange={(e) => handleUpdateForm({ sectionA2Content: e.target.value })}
                      placeholder="Nhập 'Từ vựng & Phonics: ...' và 'Cấu trúc & Mẫu câu: ...'"
                      className="w-full text-sm p-3.5 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y"
                    />
                  ) : (
                    <div className="w-full text-sm p-4 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                      {currentForm.sectionA2Content || (
                        <span className="italic text-muted-foreground/60">Chưa có nhận xét kết quả học tập.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION B: KẾ HOẠCH HỌC TẬP CẢI THIỆN */}
              <div className="space-y-4 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                    B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
                  </h4>
                  {isEditing && (
                    <span className="text-xs font-semibold text-primary">Quy trình 2 bước: Step 1 Chọn bài → Step 2 AI Tổng hợp</span>
                  )}
                </div>

                {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                      1. Nội dung bài học tháng tới
                    </label>

                    {/* Step 1 & Step 2 Controls chỉ hiện khi đang ở chế độ chỉnh sửa (isEditing) */}
                    {isEditing && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Chọn bài:</span>

                        {/* Start Lesson Select */}
                        <Select
                          value={String(currentForm.sectionB2StartLesson || 8)}
                          onValueChange={(val) => handleStartLessonChange(Number(val))}
                        >
                          <SelectTrigger className="h-8 text-xs font-semibold w-24 bg-background border-border/80 shadow-2xs">
                            <SelectValue placeholder="Bài bắt đầu" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_LESSONS_REVIEW.map((l) => (
                              <SelectItem key={l.lessonNumber} value={String(l.lessonNumber)} className="text-xs">
                                Bài {l.lessonNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-xs font-bold text-muted-foreground">→</span>

                        {/* End Lesson Select */}
                        <Select
                          value={String(currentForm.sectionB2EndLesson || 10)}
                          onValueChange={(val) => handleEndLessonChange(Number(val))}
                        >
                          <SelectTrigger className="h-8 text-xs font-semibold w-24 bg-background border-border/80 shadow-2xs">
                            <SelectValue placeholder="Bài kết thúc" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_LESSONS_REVIEW.map((l) => (
                              <SelectItem key={l.lessonNumber} value={String(l.lessonNumber)} className="text-xs">
                                Bài {l.lessonNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Step 2: AI Synthesize Button */}
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAiSynthesizeNextMonthPlan}
                          disabled={isSynthesizingAi}
                          className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-3.5 shadow-2xs cursor-pointer gap-1.5"
                          title="Tự động biên tập ngôn ngữ tự nhiên cho bài học tháng tới"
                        >
                          {isSynthesizingAi ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                          )}
                          <span>AI Tổng hợp</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={8}
                      value={currentForm.sectionB1Content}
                      onChange={(e) => handleUpdateForm({ sectionB1Content: e.target.value })}
                      placeholder="Nhập hoặc bấm 'Cập nhật' / 'AI Tổng hợp' để tự động cập nhật nội dung bài học..."
                      className="w-full text-sm p-3.5 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y"
                    />
                  ) : (
                    <div className="w-full text-sm p-4 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                      {currentForm.sectionB1Content || (
                        <span className="italic text-muted-foreground/60">Chưa có nội dung bài học tháng tới.</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-section 2: Nội dung ôn tập riêng */}
                <MonthlyReportReviewItemsSection
                  items={currentWeeks}
                  onChange={(updated) => handleUpdateForm({ sectionB2Weeks: updated })}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Footer Bar - Tách biệt rõ ràng giữa Chế độ xem (View mode) và Chế độ sửa (Edit mode) */}
          <div className="px-6 py-3 border-t bg-muted/10 flex items-center justify-between shrink-0">
            {/* Trạng thái bên trái */}
            <div className="flex items-center gap-3 text-xs">
              {isEditing ? (
                <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Chế độ chỉnh sửa báo cáo</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Báo cáo tự động hàng tháng</span>
                </div>
              )}
            </div>

            {/* Nhóm nút hành động bên phải */}
            <div className="flex items-center gap-2.5">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-xs font-semibold px-4 rounded-lg cursor-pointer"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    className="text-xs font-bold px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs cursor-pointer transition-all active:scale-95 gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Lưu thay đổi</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = getLandingPageUrl()
                      window.open(link, '_blank')
                    }}
                    className="text-xs font-bold px-3.5 rounded-lg border-sky-500/40 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer gap-1.5 shadow-3xs"
                    title="Mở toàn màn hình dạng Landing Page trên tab mới"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Xem Landing Page</span>
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
                    <span>Gửi phụ huynh</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="text-xs font-semibold px-4 rounded-lg cursor-pointer"
                  >
                    Đóng
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs cursor-pointer transition-all active:scale-95 gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Chỉnh sửa</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}
