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
import { BookOpen, Loader2, Check, Pencil, Send, ExternalLink, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { RosterStudent } from './classesDetailTypes'
import { MonthlyReportReviewItemsSection } from './MonthlyReportReviewItemsSection'
import { MonthlyReportStatsCards } from './MonthlyReportStatsCards'
import { MonthlyReportRosterSidebar } from './MonthlyReportRosterSidebar'
import { MonthlyAwardCriteriaPopover } from './MonthlyAwardCriteriaPopover'
import { MonthlyReportAcademicSection } from './MonthlyReportAcademicSection'
import { mockStudents } from '@/mocks/students'
import { getStudentPhotos } from '@/mocks/studentPhotos'
import {
  getReviewContentForRange,
  getAiSynthesizedNextMonthPlan,
  getDirectLessonPlanForRange,
  getLessonsReviewBySubject,
  getStudentReportMetrics,
  DetailedMonthlyReportForm,
  EMPTY_REPORT_FORM,
  AWARD_BADGES,
  ENGLISH_AWARD_BADGES,
  normalizeAwardBadge,
} from './monthlyReportHelpers'
import {
  getStudentMonthlyReports,
  saveStudentMonthlyReport,
  MONTH_OPTIONS,
} from '@/mocks/monthlyReports'

interface StudentMonthlyReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: RosterStudent[]
  initialStudentId?: string
  initialMonthKey?: string
  subject?: string
}

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
  subject,
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
      const targetMKey = initialMonthKey ? resolveMonthValue(initialMonthKey) : selectedMonthKey
      if (initialMonthKey) setSelectedMonthKey(targetMKey)
      const monthOpt = MONTH_OPTIONS.find((m) => m.value === targetMKey) || MONTH_OPTIONS[0]
      const hasReport = getStudentMonthlyReports(sId).some(
        (r) => r.monthOptionValue === targetMKey || r.monthKey.includes(monthOpt.current)
      )
      setIsEditing(!hasReport)
    }
  }

  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  const computeStatusMap = (mKey: string) => {
    const monthOpt = MONTH_OPTIONS.find((m) => m.value === mKey) || MONTH_OPTIONS[0]
    const map: Record<string, boolean> = {}
    students.forEach((s) => {
      const existing = getStudentMonthlyReports(s.id || s.name)
      map[s.id] = existing.some(
        (r) => r.monthOptionValue === mKey || r.monthKey.includes(monthOpt.current)
      )
    })
    return map
  }

  // Track created status per student ID for currently selected month
  const [reportStatusMap, setReportStatusMap] = useState<Record<string, boolean>>(() =>
    computeStatusMap(initialMonthKey ? resolveMonthValue(initialMonthKey) : '4_5_2026')
  )

  // Helper to load report form from mock database
  const getFormForStudentAndMonth = (sId: string, mKey: string): DetailedMonthlyReportForm => {
    const s = students.find((item) => item.id === sId) || students[0]
    if (!s) return { ...EMPTY_REPORT_FORM }
    const reports = getStudentMonthlyReports(s.id || s.name)
    const monthOpt = MONTH_OPTIONS.find((m) => m.value === mKey) || MONTH_OPTIONS[0]
    const existing = reports.find(
      (r) => r.monthOptionValue === mKey || r.monthKey.includes(monthOpt.current)
    )
    if (existing) {
      return {
        monthPeriod: existing.dateStr,
        awardBadge: normalizeAwardBadge(existing.awardBadge),
        teacherName: existing.teacherName,
        sectionAContent: existing.sectionAContent || `${existing.sectionA1Content}\n\n${existing.sectionA2Content}`,
        sectionA1Content: existing.sectionA1Content,
        sectionA2Content: existing.sectionA2Content,
        galleryPhotos: existing.galleryPhotos || [],
        sectionB1Content: existing.sectionB1Content,
        sectionB2StartLesson: existing.sectionB2StartLesson,
        sectionB2EndLesson: existing.sectionB2EndLesson,
        sectionB2Weeks: existing.sectionB2Weeks,
        sectionB2Content: existing.sectionB2Content || '',
      }
    }
    return {
      ...EMPTY_REPORT_FORM,
      monthPeriod: monthOpt.dateStr,
      galleryPhotos: [],
    }
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
    const monthOpt = MONTH_OPTIONS.find((m) => m.value === newMonthKey) || MONTH_OPTIONS[0]
    const hasReport = getStudentMonthlyReports(selectedStudentId).some(
      (r) => r.monthOptionValue === newMonthKey || r.monthKey.includes(monthOpt.current)
    )
    setIsEditing(!hasReport)
    setReportStatusMap(computeStatusMap(newMonthKey))
  }

  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId)
    const newForm = getFormForStudentAndMonth(sId, selectedMonthKey)
    setReportsMap((prev) => ({
      ...prev,
      [sId]: newForm,
    }))
    const monthOpt = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]
    const hasReport = getStudentMonthlyReports(sId).some(
      (r) => r.monthOptionValue === selectedMonthKey || r.monthKey.includes(monthOpt.current)
    )
    setIsEditing(!hasReport)
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

  const studentDetail = mockStudents.find(
    (s) => s.id === selectedStudentId || (selectedStudent && s.name === selectedStudent.name)
  )

  const isMath = useMemo(() => {
    const textToCheck = (currentForm.sectionA2Content || '').toLowerCase()
    if (textToCheck.includes('từ vựng') || textToCheck.includes('phonics') || textToCheck.includes('letter') || textToCheck.includes('mẫu câu')) {
      return false
    }
    if (textToCheck.includes('toán') || textToCheck.includes('hình học') || textToCheck.includes('không gian') || textToCheck.includes('giải toán')) {
      return true
    }
    if (subject) {
      const s = subject.toLowerCase()
      if (s.includes('toán') || s.includes('math')) return true
      if (s.includes('anh') || s.includes('english') || s.includes('ielts') || s.includes('toeic')) return false
    }
    if (studentDetail) {
      const pkg = (studentDetail.packageName || '').toLowerCase()
      const path = (studentDetail.learningPath || '').toLowerCase()
      const lev = (studentDetail.level || '').toLowerCase()
      if (
        pkg.includes('toán') ||
        pkg.includes('math') ||
        path.includes('toán') ||
        path.includes('math') ||
        lev.includes('toán') ||
        lev.includes('math')
      )
        return true
      if (
        pkg.includes('anh') ||
        pkg.includes('english') ||
        pkg.includes('ielts') ||
        path.includes('anh') ||
        path.includes('english') ||
        lev.includes('english')
      )
        return false
    }
    if (selectedStudent?.level) {
      const l = selectedStudent.level.toLowerCase()
      if (l.includes('toán') || l.includes('math')) return true
      if (l.includes('anh') || l.includes('english')) return false
    }
    return false
  }, [subject, studentDetail, selectedStudent, currentForm.sectionA2Content])

  const activeLessons = useMemo(() => {
    return getLessonsReviewBySubject(subject, isMath)
  }, [subject, isMath])

  const startLessonObj = activeLessons.find(
    (l) => l.lessonNumber === (currentForm.sectionB2StartLesson || (isMath ? 1 : 8))
  )
  const endLessonObj = activeLessons.find(
    (l) => l.lessonNumber === (currentForm.sectionB2EndLesson || (isMath ? 4 : 10))
  )

  const studentMetrics = useMemo(() => {
    return getStudentReportMetrics(selectedStudent?.id, selectedStudent?.name, selectedStudent?.code)
  }, [selectedStudent])

  // Step 1: Handle Start Lesson change
  const handleStartLessonChange = (startNum: number) => {
    const endNum = currentForm.sectionB2EndLesson || (isMath ? 4 : 10)
    const newReviewContent = getReviewContentForRange(startNum, endNum, isMath)
    const newB1Content = getDirectLessonPlanForRange(startNum, endNum, isMath)
    handleUpdateForm({
      sectionB2StartLesson: startNum,
      sectionB2Content: newReviewContent,
      sectionB1Content: newB1Content,
    })
  }

  // Step 1: Handle End Lesson change
  const handleEndLessonChange = (endNum: number) => {
    const startNum = currentForm.sectionB2StartLesson || (isMath ? 1 : 8)
    const newReviewContent = getReviewContentForRange(startNum, endNum, isMath)
    const newB1Content = getDirectLessonPlanForRange(startNum, endNum, isMath)
    handleUpdateForm({
      sectionB2EndLesson: endNum,
      sectionB2Content: newReviewContent,
      sectionB1Content: newB1Content,
    })
  }

  // Handle loading sample lesson plan for Section B1
  const handleLoadNextMonthPlan = () => {
    setIsSynthesizingAi(true)
    setTimeout(() => {
      setIsSynthesizingAi(false)
      const startNum = currentForm.sectionB2StartLesson || (isMath ? 1 : 8)
      const endNum = currentForm.sectionB2EndLesson || (isMath ? 4 : 10)
      const synthesizedText = getAiSynthesizedNextMonthPlan(startNum, endNum, isMath)
      handleUpdateForm({ sectionB1Content: synthesizedText })
      toast.success(`Đã nạp nội dung bài học tháng tới (Buổi ${startNum} đến Buổi ${endNum})!`)
    }, 300)
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
      monthTitle: `BÁO CÁO HỌC TẬP ${activeMonthConfig.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${activeMonthConfig.next.toUpperCase()}`,
      dateStr: activeMonthConfig.dateStr,
      awardBadge: currentForm.awardBadge,
      teacherName: currentForm.teacherName,
      sectionA1Content: currentForm.sectionA1Content,
      sectionA2Content: currentForm.sectionA2Content,
      sectionAContent: `${currentForm.sectionA1Content}\n\n${currentForm.sectionA2Content}`,
      galleryPhotos: currentForm.galleryPhotos || [],
      sectionB1Content: currentForm.sectionB1Content,
      sectionB2StartLesson: currentForm.sectionB2StartLesson,
      sectionB2EndLesson: currentForm.sectionB2EndLesson,
      sectionB2Weeks: currentForm.sectionB2Weeks,
      sectionB2Content: currentForm.sectionB2Content,
      sectionBContent: `${currentForm.sectionB1Content}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
      isCurrent: selectedMonthKey === '4_5_2026',
    })

    setIsEditing(false)
    toast.success(`Đã lưu báo cáo học tập & kế hoạch học tập cho học viên ${selectedStudent.name}!`)
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

  const currentWeeks = currentForm.sectionB2Weeks || []

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
                <span>BÁO CÁO HỌC TẬP</span>
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

                  {/* Award Badge: Select danh hiệu theo môn học, Pill tĩnh khi xem */}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Select
                        value={currentForm.awardBadge || ''}
                        onValueChange={(val) => handleUpdateForm({ awardBadge: val })}
                      >
                        <SelectTrigger className="h-8 text-xs font-black bg-amber-400 text-amber-950 border-amber-500 rounded-full px-4 uppercase tracking-wide">
                          <SelectValue placeholder="Chọn danh hiệu..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(isMath ? AWARD_BADGES : ENGLISH_AWARD_BADGES).map((badge) => (
                            <SelectItem key={badge} value={badge} className="text-xs font-bold">
                              {badge}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <MonthlyAwardCriteriaPopover
                        selectedBadge={currentForm.awardBadge}
                        onSelectBadge={(val) => handleUpdateForm({ awardBadge: val })}
                        isEditing={true}
                        isMath={isMath}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {currentForm.awardBadge ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wide shadow-2xs">
                          {currentForm.awardBadge}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-dashed border-amber-400/40 text-xs italic">
                          Chưa đặt danh hiệu
                        </div>
                      )}

                      <MonthlyAwardCriteriaPopover
                        selectedBadge={currentForm.awardBadge}
                        isEditing={false}
                        isMath={isMath}
                      />
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

              {/* SECTION A: BÁO CÁO HỌC TẬP (TÁCH THÀNH CÁC MỤC VÀ MEDIA) */}
              <MonthlyReportAcademicSection
                isEditing={isEditing}
                isMath={isMath}
                monthTitle={activeMonthConfig.current}
                studentId={selectedStudent.id}
                studentName={selectedStudent.name}
                sectionA1Content={currentForm.sectionA1Content}
                sectionA2Content={currentForm.sectionA2Content}
                onUpdateA1={(content, highlight, note) => {
                  handleUpdateForm({
                    sectionA1Highlight: highlight,
                    sectionA1Note: note,
                    sectionA1Content: content,
                  })
                }}
                onUpdateA2={(content, knowledge, skill) => {
                  handleUpdateForm({
                    sectionA2Knowledge: knowledge,
                    sectionA2Skill: skill,
                    sectionA2Content: content,
                  })
                }}
                galleryPhotos={currentForm.galleryPhotos || getStudentPhotos(selectedStudent.id).slice(0, 6)}
                onChangePhotos={(newPhotos) => handleUpdateForm({ galleryPhotos: newPhotos })}
                idPrefix="dialog-report"
              />

              {/* SECTION B: KẾ HOẠCH HỌC TẬP CẢI THIỆN */}
              <div className="space-y-4 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                    B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
                  </h4>
                  {isEditing && (
                    <span className="text-xs font-semibold text-muted-foreground">Chọn khoảng bài học để nạp nội dung mẫu</span>
                  )}
                </div>

                {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5 shrink-0">
                      1. Nội dung bài học tháng tới
                    </label>

                    {/* Step 1 & Step 2 Controls chỉ hiện khi đang ở chế độ chỉnh sửa (isEditing) */}
                    {isEditing && (
                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                        <span className="text-xs font-bold text-muted-foreground shrink-0">Chọn bài:</span>

                        {/* Start Lesson Select */}
                        <Select
                          value={String(currentForm.sectionB2StartLesson || (isMath ? 1 : 8))}
                          onValueChange={(val) => handleStartLessonChange(Number(val))}
                        >
                          <SelectTrigger
                            className="h-7.5 text-xs font-semibold w-28 sm:w-32 max-w-[130px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-2"
                            title={startLessonObj ? `Buổi ${startLessonObj.lessonNumber}: ${startLessonObj.title}` : undefined}
                          >
                            <SelectValue placeholder="Bắt đầu" />
                          </SelectTrigger>
                          <SelectContent className="max-w-[420px] w-[340px]">
                            {activeLessons.map((l) => (
                              <SelectItem
                                key={l.lessonNumber}
                                value={String(l.lessonNumber)}
                                className="text-xs py-1.5 cursor-pointer"
                              >
                                <span className="truncate block" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                                  Buổi {l.lessonNumber}: {l.title}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-xs font-bold text-muted-foreground shrink-0">→</span>

                        {/* End Lesson Select */}
                        <Select
                          value={String(currentForm.sectionB2EndLesson || (isMath ? 4 : 10))}
                          onValueChange={(val) => handleEndLessonChange(Number(val))}
                        >
                          <SelectTrigger
                            className="h-7.5 text-xs font-semibold w-28 sm:w-32 max-w-[130px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-2"
                            title={endLessonObj ? `Buổi ${endLessonObj.lessonNumber}: ${endLessonObj.title}` : undefined}
                          >
                            <SelectValue placeholder="Kết thúc" />
                          </SelectTrigger>
                          <SelectContent className="max-w-[420px] w-[340px]">
                            {activeLessons.map((l) => (
                              <SelectItem
                                key={l.lessonNumber}
                                value={String(l.lessonNumber)}
                                className="text-xs py-1.5 cursor-pointer"
                              >
                                <span className="truncate block" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                                  Buổi {l.lessonNumber}: {l.title}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Step 2: Load sample lesson content button */}
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleLoadNextMonthPlan}
                          disabled={isSynthesizingAi}
                          className="h-7.5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-2.5 sm:px-3 shadow-2xs cursor-pointer gap-1.5 shrink-0"
                          title="Nạp nội dung khung chương trình cho các buổi học đã chọn"
                        >
                          {isSynthesizingAi ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <BookOpen className="h-3.5 w-3.5" />
                          )}
                          <span>Nạp bài học mẫu</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={8}
                      value={currentForm.sectionB1Content}
                      onChange={(e) => handleUpdateForm({ sectionB1Content: e.target.value })}
                      placeholder="Nhập hoặc chọn bài học rồi bấm 'Nạp bài học mẫu' để tự động điền nhanh..."
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
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Báo cáo tự động hàng tháng</span>
                </div>
              )}
            </div>

            {/* Nhóm nút hành động bên phải */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleUpdateForm({
                        ...EMPTY_REPORT_FORM,
                        monthPeriod: activeMonthConfig.dateStr,
                        galleryPhotos: [],
                      })
                      toast.info('Đã xóa trắng form báo cáo để bạn tự điền nội dung mới.')
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground px-2.5 rounded-lg cursor-pointer gap-1.5"
                    title="Xóa trắng toàn bộ nội dung để tự điền báo cáo mới từ đầu"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Xóa trắng</span>
                  </Button>
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
