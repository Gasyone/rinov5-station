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
import { BookOpen, Loader2, Check, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { RosterStudent } from './classesDetailTypes'
import { MonthlyReportReviewItemsSection } from './MonthlyReportReviewItemsSection'
import { MonthlyReportStatsCards } from './MonthlyReportStatsCards'
import { MonthlyReportRosterSidebar } from './MonthlyReportRosterSidebar'
import { MonthlyAwardCriteriaPopover } from './MonthlyAwardCriteriaPopover'
import { MonthlyReportAcademicSection } from './MonthlyReportAcademicSection'
import { MonthlyReportActivityPhotosSection } from './MonthlyReportActivityPhotosSection'
import { MonthlyReportSummaryCard } from './MonthlyReportSummaryCard'
import { downloadMonthlyReportImage } from './monthlyReportImageHelper'
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
  DEFAULT_SECTION_B2_WEEKS,
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

interface StudentSubjectInfo {
  packageName?: string
  learningPath?: string
  level?: string
}

function getIsMathSubject(
  subject?: string,
  studentDetail?: StudentSubjectInfo,
  studentLevel?: string
): boolean {
  const combined = `${subject || ''} ${studentDetail?.packageName || ''} ${studentDetail?.learningPath || ''} ${studentDetail?.level || ''} ${studentLevel || ''}`.toLowerCase()
  if (combined.includes('toán') || combined.includes('math')) return true
  if (combined.includes('anh') || combined.includes('english') || combined.includes('ielts') || combined.includes('toeic') || combined.includes('cambridge')) return false
  return false
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
      if (sId) setSelectedStudentId(sId)
      const targetMKey = initialMonthKey ? resolveMonthValue(initialMonthKey) : selectedMonthKey
      if (initialMonthKey) setSelectedMonthKey(targetMKey)
      setIsEditing(false)
    }
  }

  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  const computeStatusMap = (mKey: string) => {
    const monthOpt = MONTH_OPTIONS.find((m) => m.value === mKey) || MONTH_OPTIONS[0]
    const map: Record<string, boolean> = {}
    students.forEach((s) => {
      const existing = getStudentMonthlyReports(s.id, s.name, s.code)
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
    const reports = getStudentMonthlyReports(s.id, s.name, s.code)
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

    // Với các kỳ quá khứ (Tháng 3, Tháng 2, Tháng 1) nếu chưa có báo cáo thủ công:
    // Tự động nạp báo cáo học bạ mẫu sinh động, có đầy đủ đánh giá thực tế theo môn học
    if (mKey !== '4_5_2026') {
      const sDetail = mockStudents.find((item) => item.id === s.id || item.name === s.name)
      const isMathForStudent = getIsMathSubject(subject, sDetail, s.level)
      const fallbackA1 = isMathForStudent
        ? `Điểm nổi bật: Con có thái độ học tập tích cực, tập trung nghe giảng và chủ động hoàn thành bài tập trên lớp.\n\nĐiểm cần lưu ý: Khi gặp bài toán suy luận nhiều bước, con cần rèn thêm tính kiên nhẫn và cẩn thận kiểm tra lại đáp án.`
        : `Điểm nổi bật: Con tự tin phát biểu, ngữ điệu nói tự nhiên và phát âm rõ ràng trong các hoạt động giao tiếp.\n\nĐiểm cần lưu ý: Cần chú ý phát âm các âm đuôi /s/, /t/ và rèn thêm tính kiên nhẫn khi đọc hiểu đoạn văn dài.`

      const fallbackA2 = isMathForStudent
        ? `Kiến thức & Tư duy: Nắm chắc các phép toán số học nền tảng, nhận biết tốt các dạng hình học và quy luật dãy số.\n\nKỹ năng giải toán: Cần rèn luyện thêm kỹ năng tính nhẩm nhanh và giải toán có lời văn ngắn.`
        : `Từ vựng & Phonics: Ghi nhớ tốt các từ vựng chủ đề trong tháng, phát âm chuẩn các nguyên âm cơ bản.\n\nCấu trúc & Mẫu câu: Phản xạ nhanh với các mẫu câu giao tiếp quen thuộc, trả lời tròn câu.`

      const fallbackB1 = isMathForStudent
        ? `Tháng tới, con tiếp tục nâng cao kỹ năng tư duy hình học không gian, làm quen với các phép toán mở rộng và bài toán đố logic.`
        : `Tháng tới, các con sẽ tiếp tục rèn luyện kỹ năng thuyết trình tự tin trước lớp, mở rộng vốn từ vựng và tham gia dự án nhóm.`

      return {
        monthPeriod: monthOpt.dateStr,
        awardBadge: isMathForStudent ? '⭐️ NGÔI SAO CHĂM CHỈ' : '🌟 SIÊU SAO TIẾNG ANH',
        teacherName: 'Ms.Chloe',
        sectionAContent: `${fallbackA1}\n\n${fallbackA2}`,
        sectionA1Content: fallbackA1,
        sectionA2Content: fallbackA2,
        galleryPhotos: getStudentPhotos(s.id).slice(0, 4),
        sectionB1Content: fallbackB1,
        sectionB2StartLesson: undefined,
        sectionB2EndLesson: undefined,
        sectionB2Weeks: DEFAULT_SECTION_B2_WEEKS,
        sectionB2Content: 'Kế hoạch ôn tập 4 tuần theo bài học trọng tâm',
      }
    }

    return {
      ...EMPTY_REPORT_FORM,
      monthPeriod: monthOpt.dateStr,
      galleryPhotos: [],
      sectionB2StartLesson: undefined,
      sectionB2EndLesson: undefined,
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
    setIsEditing(false)
    setReportStatusMap(computeStatusMap(newMonthKey))
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

  const studentDetail = mockStudents.find(
    (s) => s.id === selectedStudentId || (selectedStudent && s.name === selectedStudent.name)
  )

  const isMath = getIsMathSubject(subject, studentDetail, selectedStudent?.level)

  const activeLessons = useMemo(() => {
    return getLessonsReviewBySubject(subject, isMath)
  }, [subject, isMath])

  const startLessonObj = activeLessons.find(
    (l) => l.lessonNumber === currentForm.sectionB2StartLesson
  )
  const endLessonObj = activeLessons.find(
    (l) => l.lessonNumber === currentForm.sectionB2EndLesson
  )

  const studentMetrics = getStudentReportMetrics(selectedStudent?.id, selectedStudent?.name, selectedStudent?.code)

  // Step 1: Handle Start Lesson change
  const handleStartLessonChange = (startNum: number) => {
    const endNum = currentForm.sectionB2EndLesson
    const updates: Partial<DetailedMonthlyReportForm> = {
      sectionB2StartLesson: startNum,
    }
    if (endNum) {
      updates.sectionB2Content = getReviewContentForRange(startNum, endNum, isMath)
      updates.sectionB1Content = getDirectLessonPlanForRange(startNum, endNum, isMath)
    }
    handleUpdateForm(updates)
  }

  // Step 1: Handle End Lesson change
  const handleEndLessonChange = (endNum: number) => {
    const startNum = currentForm.sectionB2StartLesson
    const updates: Partial<DetailedMonthlyReportForm> = {
      sectionB2EndLesson: endNum,
    }
    if (startNum) {
      updates.sectionB2Content = getReviewContentForRange(startNum, endNum, isMath)
      updates.sectionB1Content = getDirectLessonPlanForRange(startNum, endNum, isMath)
    }
    handleUpdateForm(updates)
  }

  // Handle loading sample lesson plan for Section B1
  const handleLoadNextMonthPlan = () => {
    const startNum = currentForm.sectionB2StartLesson
    const endNum = currentForm.sectionB2EndLesson
    if (!startNum || !endNum) {
      toast.info('Vui lòng chọn bài bắt đầu và kết thúc!')
      return
    }
    setIsSynthesizingAi(true)
    setTimeout(() => {
      setIsSynthesizingAi(false)
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

  const handleCopySummary = () => {
    const badgeStr = currentForm.awardBadge ? `\n🏆 Danh hiệu: ${currentForm.awardBadge}` : ''
    const generalStr = currentForm.sectionA1Content ? `\n📌 Nhận xét chung: ${currentForm.sectionA1Content}` : ''
    const academicStr = currentForm.sectionA2Content ? `\n📚 Đánh giá học tập: ${currentForm.sectionA2Content}` : ''
    const planStr = currentForm.sectionB1Content ? `\n🎯 Kế hoạch tháng tới: ${currentForm.sectionB1Content}` : ''
    const teacherStr = currentForm.teacherName ? `\n👨‍🏫 Giáo viên: ${currentForm.teacherName}` : ''

    const summaryText = `[RINO EDU] Báo cáo học tập - ${activeMonthConfig.current}/2026
Học viên: ${selectedStudent.name} (${selectedStudent.code || 'HV'})
Thời gian: ${activeMonthConfig.dateStr}${badgeStr}${generalStr}${academicStr}${planStr}${teacherStr}
Link xem chi tiết: ${getLandingPageUrl()}`

    navigator.clipboard
      .writeText(summaryText)
      .then(() => toast.success(`Đã sao chép tóm tắt báo cáo của học viên ${selectedStudent.name}!`))
      .catch(() => toast.error('Không thể sao chép tóm tắt.'))
  }

  const handleDownloadImage = async () => {
    try {
      toast.loading('Đang khởi tạo và tải ảnh báo cáo...', { id: 'download-report-dialog' })
      await downloadMonthlyReportImage({
        student: selectedStudent,
        monthTitle: activeMonthConfig.current,
        nextMonthTitle: activeMonthConfig.next,
        dateStr: activeMonthConfig.dateStr,
        awardBadge: currentForm.awardBadge,
        teacherName: currentForm.teacherName,
        subject: subject || (isMath ? 'Toán tư duy' : 'Tiếng Anh'),
        roadmap: isMath ? 'Toán Tư Duy Archimedes' : 'Cambridge Standard',
        level: selectedStudent?.level || 'Lớp 4',
        metrics: studentMetrics,
        sectionA1Content: currentForm.sectionA1Content,
        sectionA2Content: currentForm.sectionA2Content,
        sectionB1Content: currentForm.sectionB1Content,
        sectionB2Weeks: currentForm.sectionB2Weeks || DEFAULT_SECTION_B2_WEEKS,
      })
      toast.success(`Đã tải ảnh báo cáo tháng cho học viên ${selectedStudent.name}!`, { id: 'download-report-dialog' })
    } catch (err) {
      console.error(err)
      toast.error('Không thể tạo file ảnh. Vui lòng thử lại!', { id: 'download-report-dialog' })
    }
  }

  const currentWeeks = currentForm.sectionB2Weeks || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[96vw] max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all',
          students.length > 1 ? 'lg:max-w-[1060px]' : 'lg:max-w-[920px]'
        )}
      >
        {/* Top Header Bar: Gọn gàng, giảm chiều cao, phân cấp nút rõ ràng */}
        <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between shrink-0 bg-background border-b border-border/40">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-sm font-semibold text-foreground tracking-tight">
              Báo cáo học tập
            </DialogTitle>
            {isEditing ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-700/60">
                <Pencil className="h-3 w-3" />
                <span>Chỉnh sửa</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>Tự động</span>
              </span>
            )}
          </div>

          {/* Action button & Select Reporting Month Dropdown */}
          <div className="flex items-center gap-2 me-6">
            <Select value={selectedMonthKey} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-7 text-xs font-normal w-[180px] sm:w-[210px] bg-background border-border/70 rounded-md">
                <SelectValue placeholder="Chọn kỳ báo cáo" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-xs font-normal">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 text-xs font-medium px-2.5 rounded-md border-border text-foreground hover:bg-muted cursor-pointer gap-1.5"
                title="Chỉnh sửa nội dung báo cáo"
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
                <span>Chỉnh sửa</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-7 text-xs font-normal px-2.5 rounded-md cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="h-7 text-xs font-medium px-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-3xs cursor-pointer gap-1"
                >
                  <Check className="h-3 w-3" />
                  <span>Lưu thay đổi</span>
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Main Content Area (Sidebar Left + Split 2 Panels: Trái lớn, Phải nhỏ - Không line giữa) */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Roster Student Sidebar (Only displayed when there are multiple students) */}
          {students.length > 1 && (
            <MonthlyReportRosterSidebar
              students={students}
              selectedStudentId={selectedStudentId}
              reportStatusMap={reportStatusMap}
              onSelectStudent={handleSelectStudent}
            />
          )}

          {/* 2-Panel Layout: Trái lớn (Thống kê + A + B có viền) | Phải nhỏ gọn (Kết quả + Khoảnh khắc + Tóm tắt) */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0 gap-3 px-3.5 sm:px-4 pb-3 pt-1">
            {/* PANEL TRÁI (LỚN): SECTION THỐNG KÊ TRÊN CÙNG + SECTION A, B CÓ VIỀN */}
            <div className="flex-1 min-w-0 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar bg-background">
              {/* SECTION THỐNG KÊ: CHUYÊN CẦN, BTVN, ĐIỂM KIỂM TRA ĐƯA LÊN TRÊN CÙNG */}
              <MonthlyReportStatsCards
                currentMonth={activeMonthConfig.current}
                attendanceRatio={studentMetrics.attendanceRatio}
                lateCount={studentMetrics.lateCount}
                homeworkRatio={studentMetrics.homeworkRatio}
                homeworkAvg={studentMetrics.homeworkAvg}
                testScore={studentMetrics.testScore}
                priorTestScore={studentMetrics.priorTestScore}
                onOpenTestRemark={() => {
                  const link = `${getLandingPageUrl()}#test-evaluation`
                  window.open(link, '_blank')
                  toast.success(`Đang mở nhận xét bài kiểm tra gần nhất của học viên ${selectedStudent.name} trong tab mới!`)
                }}
                onScrollToEvaluation={() => {
                  const el = document.getElementById('monthly-report-evaluation-section')
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              />

              {/* SECTION A: BÁO CÁO HỌC TẬP (CÓ VIỀN RIÊNG) */}
              <div
                id="monthly-report-evaluation-section"
                className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 space-y-2 shadow-3xs scroll-mt-2"
              >
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
                  showPhotosSection={false}
                />
              </div>

              {/* SECTION B: KẾ HOẠCH HỌC TẬP CẢI THIỆN (CÓ VIỀN RIÊNG) */}
              <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 space-y-2 shadow-3xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                    B. Kế hoạch học tập cải thiện {activeMonthConfig.next}
                  </h4>
                  {isEditing && (
                    <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                      Chọn khoảng bài học để nạp nội dung mẫu
                    </span>
                  )}
                </div>

                {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <label className="text-xs font-normal text-muted-foreground flex items-center gap-1.5 shrink-0">
                      1. Nội dung bài học tháng tới
                    </label>

                    {/* Step 1 & Step 2 Controls chỉ hiện khi đang ở chế độ chỉnh sửa (isEditing) */}
                    {isEditing && (
                      <div className="flex items-center gap-1 shrink-0 ml-auto">
                        {/* Start Lesson Select (Không in đậm, placeholder: Chọn bài) */}
                        <Select
                          value={currentForm.sectionB2StartLesson ? String(currentForm.sectionB2StartLesson) : undefined}
                          onValueChange={(val) => handleStartLessonChange(Number(val))}
                        >
                          <SelectTrigger
                            className="h-6.5 text-[11px] font-normal w-[88px] sm:w-[98px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-1.5 rounded-md text-foreground"
                            title={startLessonObj ? `Buổi ${startLessonObj.lessonNumber}: ${startLessonObj.title}` : undefined}
                          >
                            <SelectValue placeholder="Chọn bài" />
                          </SelectTrigger>
                          <SelectContent className="max-w-[360px] w-[320px]">
                            {activeLessons.map((l) => (
                              <SelectItem
                                key={l.lessonNumber}
                                value={String(l.lessonNumber)}
                                className="text-xs font-normal py-1.5 cursor-pointer"
                              >
                                <span className="truncate block font-normal text-xs" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                                  Buổi {l.lessonNumber}: {l.title}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-[11px] text-muted-foreground shrink-0 select-none">→</span>

                        {/* End Lesson Select (Không in đậm, placeholder: Chọn bài) */}
                        <Select
                          value={currentForm.sectionB2EndLesson ? String(currentForm.sectionB2EndLesson) : undefined}
                          onValueChange={(val) => handleEndLessonChange(Number(val))}
                        >
                          <SelectTrigger
                            className="h-6.5 text-[11px] font-normal w-[88px] sm:w-[98px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-1.5 rounded-md text-foreground"
                            title={endLessonObj ? `Buổi ${endLessonObj.lessonNumber}: ${endLessonObj.title}` : undefined}
                          >
                            <SelectValue placeholder="Chọn bài" />
                          </SelectTrigger>
                          <SelectContent className="max-w-[360px] w-[320px]">
                            {activeLessons.map((l) => (
                              <SelectItem
                                key={l.lessonNumber}
                                value={String(l.lessonNumber)}
                                className="text-xs font-normal py-1.5 cursor-pointer"
                              >
                                <span className="truncate block font-normal text-xs" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
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
                          className="h-6.5 text-[11px] font-normal bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-2 shadow-2xs cursor-pointer gap-1 shrink-0"
                          title="Thêm nội dung khung chương trình cho các buổi học đã chọn"
                        >
                          {isSynthesizingAi ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <BookOpen className="h-3 w-3" />
                          )}
                          <span>Thêm bài</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={currentForm.sectionB1Content}
                      onChange={(e) => handleUpdateForm({ sectionB1Content: e.target.value })}
                      placeholder="Nhập hoặc chọn bài học rồi bấm 'Thêm bài' để tự động điền nhanh..."
                      className="w-full text-xs p-2 rounded-lg border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y min-h-[56px]"
                    />
                  ) : (
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground/90 leading-relaxed font-sans whitespace-pre-line">
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

            {/* PANEL PHẢI (GỌN GÀNG, CÂN ĐỐI): KẾT QUẢ HỌC TẬP + KHOẢNH KHẮC + TÓM TẮT BÁO CÁO (KHÔNG ĐƯỜNG LINE GIỮA) */}
            <div className="w-full lg:w-[310px] xl:w-[325px] shrink-0 overflow-y-auto space-y-2.5 custom-scrollbar bg-background">
              {/* 1. SECTION THÔNG TIN: KẾT QUẢ HỌC TẬP TỪ... */}
              <div className="p-2.5 rounded-xl bg-card border border-border/80 space-y-1.5 shadow-2xs">
                <div className="flex flex-col gap-1 text-xs">
                  <div className="text-muted-foreground font-normal flex items-center justify-between">
                    <span>Kết quả học tập:</span>
                    <span className="text-foreground font-medium">{activeMonthConfig.dateStr}</span>
                  </div>

                  {/* Award Badge: Select danh hiệu theo môn học, Pill tĩnh khi xem */}
                  {isEditing ? (
                    <div className="flex items-center justify-between gap-1.5">
                      <Select
                        value={currentForm.awardBadge || ''}
                        onValueChange={(val) => handleUpdateForm({ awardBadge: val })}
                      >
                        <SelectTrigger className="h-7 text-xs font-medium bg-amber-50/70 text-amber-900 border-amber-200/80 rounded-full px-3 flex-1 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                          <SelectValue placeholder="Chọn danh hiệu..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(isMath ? AWARD_BADGES : ENGLISH_AWARD_BADGES).map((badge) => (
                            <SelectItem key={badge} value={badge} className="text-xs font-normal">
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
                    <div className="flex items-center justify-between gap-1.5">
                      {currentForm.awardBadge ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 font-medium text-xs">
                          {currentForm.awardBadge}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-dashed border-border text-xs">
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
                  <div className="pt-1.5 border-t border-border/50 flex items-start gap-1.5 text-xs text-muted-foreground italic">
                    <Pencil className="h-3 w-3 text-muted-foreground shrink-0 not-italic mt-0.5" />
                    <span>
                      Rino Edu chúc mừng con <strong className="text-foreground font-medium not-italic">{selectedStudent.name}</strong> đã hoàn thành kỳ học! GV:{' '}
                      <input
                        type="text"
                        value={currentForm.teacherName}
                        onChange={(e) => handleUpdateForm({ teacherName: e.target.value })}
                        placeholder="Tên GV"
                        className="inline-block w-24 text-center text-xs font-medium text-foreground border-b border-border bg-transparent focus:outline-none not-italic"
                      />.
                    </span>
                  </div>
                ) : (
                  <div className="pt-1.5 border-t border-border/50 text-xs text-muted-foreground leading-relaxed">
                    Rino Edu chúc mừng con <span className="text-foreground font-medium">{selectedStudent.name}</span> đã hoàn thành kỳ học! Giáo viên phụ trách:{' '}
                    <span className="text-foreground font-medium">{currentForm.teacherName || 'Nguyễn Thu Thảo'}</span>.
                  </div>
                )}
              </div>

              {/* 2. KHOẢNH KHẮC HỌC TẬP (ẢNH & VIDEO TRONG THÁNG) - Phẳng hoàn toàn, không viền, không nền */}
              <MonthlyReportActivityPhotosSection
                photos={currentForm.galleryPhotos || []}
                onChange={(newPhotos) => handleUpdateForm({ galleryPhotos: newPhotos })}
                readOnly={!isEditing}
                studentId={selectedStudent.id}
                studentName={selectedStudent.name}
                monthName={activeMonthConfig.current}
                className="space-y-1.5 px-0.5"
              />

              {/* 3. TÓM TẮT BÁO CÁO (CÓ NÚT SAO CHÉP MÀU XANH KHÔNG VIỀN & GỘP TOÀN BỘ NÚT HÀNH ĐỘNG VÀO ĐÂY) */}
              <MonthlyReportSummaryCard
                selectedStudent={selectedStudent}
                monthTitle={activeMonthConfig.current}
                awardBadge={currentForm.awardBadge}
                summaryPreview={currentForm.sectionA1Content || currentForm.sectionA2Content || ''}
                onCopySummary={handleCopySummary}
                isEditing={isEditing}
                onSaveReport={handleSave}
                onCancelEdit={handleCancelEdit}
                onResetForm={() => {
                  handleUpdateForm({
                    ...EMPTY_REPORT_FORM,
                    monthPeriod: activeMonthConfig.dateStr,
                    galleryPhotos: [],
                  })
                  toast.info('Đã xóa trắng form báo cáo để bạn tự điền nội dung mới.')
                }}
                onOpenLandingPage={() => {
                  const link = getLandingPageUrl()
                  window.open(link, '_blank')
                }}
                onDownloadImage={handleDownloadImage}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
