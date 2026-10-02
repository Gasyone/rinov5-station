'use client'

import { useState, useMemo, useEffect } from 'react'
import { X, Loader2, BookOpen, Pencil, Copy, Check, ExternalLink, Lock, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RosterStudent } from './classesDetailTypes'
import { toast } from 'sonner'
import { MonthlyReportReviewItemsSection } from './MonthlyReportReviewItemsSection'
import { MonthlyAwardCriteriaPopover } from './MonthlyAwardCriteriaPopover'
import { MonthlyReportAcademicSection } from './MonthlyReportAcademicSection'
import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'
import {
  getAiSynthesizedNextMonthPlan,
  getDirectLessonPlanForRange,
  getLessonsReviewBySubject,
  WeekReviewItem,
  AWARD_BADGES,
  ENGLISH_AWARD_BADGES,
  normalizeAwardBadge,
  getMonthlyReportEditStatus,
} from './monthlyReportHelpers'
import { getStudentMonthlyReports, saveStudentMonthlyReport } from '@/mocks/monthlyReports'
import { MonthlyReportStatsCards } from './MonthlyReportStatsCards'
import { mockCareAlerts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'

interface ClassesStudentMonthlyReportOverlayPanelProps {
  student: RosterStudent
  onClose: () => void
  subject?: string
}

const MONTH_OPTIONS = [
  { value: '4_5_2026', label: 'Báo cáo Tháng 4 & Kế hoạch Tháng 5/2026', current: 'Tháng 4', next: 'Tháng 5', dateStr: '01/04/2026 đến 30/04/2026' },
  { value: '5_6_2026', label: 'Báo cáo Tháng 5 & Kế hoạch Tháng 6/2026', current: 'Tháng 5', next: 'Tháng 6', dateStr: '01/05/2026 đến 31/05/2026' },
  { value: '6_7_2026', label: 'Báo cáo Tháng 6 & Kế hoạch Tháng 7/2026', current: 'Tháng 6', next: 'Tháng 7', dateStr: '01/06/2026 đến 30/06/2026' },
  { value: '7_8_2026', label: 'Báo cáo Tháng 7 & Kế hoạch Tháng 8/2026', current: 'Tháng 7', next: 'Tháng 8', dateStr: '01/07/2026 đến 31/07/2026' },
]

export function ClassesStudentMonthlyReportOverlayPanel({
  student,
  onClose,
  subject,
}: ClassesStudentMonthlyReportOverlayPanelProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState('4_5_2026')
  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  // Xác định môn học (Toán thì chọn, Tiếng Anh thì nhập)
  const isMath = useMemo(() => {
    const rep = getStudentMonthlyReports(student.id || student.name).find(
      (r) => r.monthOptionValue === selectedMonthKey || r.monthKey.includes('Tháng 4')
    )
    const textToCheck = (rep?.sectionA2Content || '').toLowerCase()
    if (textToCheck.includes('từ vựng') || textToCheck.includes('phonics') || textToCheck.includes('letter') || textToCheck.includes('mẫu câu')) {
      return false
    }
    if (textToCheck.includes('toán') || textToCheck.includes('hình học') || textToCheck.includes('không gian') || textToCheck.includes('giải toán')) {
      return true
    }
    if (subject) {
      const s = subject.toLowerCase()
      if (s.includes('toán') || s.includes('math')) return true
      if (s.includes('anh') || s.includes('english')) return false
    }
    const mockSt = mockStudents.find((s) => s.id === student.id)
    if (mockSt) {
      const pkg = (mockSt.packageName || '').toLowerCase()
      const path = (mockSt.learningPath || '').toLowerCase()
      const lev = (mockSt.level || '').toLowerCase()
      if (pkg.includes('toán') || pkg.includes('math') || path.includes('toán') || path.includes('math') || lev.includes('toán') || lev.includes('math')) return true
      if (pkg.includes('anh') || pkg.includes('english') || path.includes('anh') || path.includes('english') || lev.includes('english')) return false
    }
    if (student.level) {
      const l = student.level.toLowerCase()
      if (l.includes('toán') || l.includes('math')) return true
      if (l.includes('anh') || l.includes('english')) return false
    }
    return false
  }, [subject, student, selectedMonthKey])

  const activeLessons = useMemo(() => {
    return getLessonsReviewBySubject(subject, isMath)
  }, [subject, isMath])

  const initialReport = useMemo(() => {
    return getStudentMonthlyReports(student.id || student.name).find(
      (r) => r.monthOptionValue === '4_5_2026' || r.monthKey.includes('Tháng 4')
    )
  }, [student])

  const [awardBadge, setAwardBadge] = useState(() => normalizeAwardBadge(initialReport?.awardBadge) || '')
  const [teacherName, setTeacherName] = useState(() => initialReport?.teacherName || 'Ms.Chloe')
  const [sectionA1Content, setSectionA1Content] = useState(() => initialReport?.sectionA1Content || '')
  const [sectionA2Content, setSectionA2Content] = useState(() => initialReport?.sectionA2Content || '')
  const [galleryPhotos, setGalleryPhotos] = useState<StudentGalleryPhoto[]>(
    () => initialReport?.galleryPhotos || []
  )
  const [sectionB1Content, setSectionB1Content] = useState(() => initialReport?.sectionB1Content || '')
  const [sectionB2StartLesson, setSectionB2StartLesson] = useState(() => initialReport?.sectionB2StartLesson || (isMath ? 1 : 8))
  const [sectionB2EndLesson, setSectionB2EndLesson] = useState(() => initialReport?.sectionB2EndLesson || (isMath ? 4 : 10))
  const [sectionB2Weeks, setSectionB2Weeks] = useState<WeekReviewItem[]>(() => initialReport?.sectionB2Weeks || [])
  const [isSynthesizingAi, setIsSynthesizingAi] = useState(false)
  const [isSaved, setIsSaved] = useState(() => Boolean(initialReport))
  const [isEditing, setIsEditing] = useState(() => !initialReport)
  const editStatus = useMemo(() => getMonthlyReportEditStatus(selectedMonthKey), [selectedMonthKey])

  const startLessonObj = activeLessons.find(
    (l) => l.lessonNumber === sectionB2StartLesson
  )
  const endLessonObj = activeLessons.find(
    (l) => l.lessonNumber === sectionB2EndLesson
  )

  const studentMetrics = useMemo(() => {
    const alert = mockCareAlerts.find(
      (a) =>
        a.studentId === student.id ||
        (a.studentName && student.name && a.studentName.toLowerCase().includes(student.name.toLowerCase())) ||
        (a.classCode && student.code && a.classCode === student.code)
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
  }, [student])

  const handleMonthChange = (newKey: string) => {
    setSelectedMonthKey(newKey)
    const status = getMonthlyReportEditStatus(newKey)
    if (status.isLocked) {
      setIsEditing(false)
    }
    const monthConfig = MONTH_OPTIONS.find((m) => m.value === newKey) || MONTH_OPTIONS[0]
    const report = getStudentMonthlyReports(student.id || student.name).find(
      (r) => r.monthOptionValue === newKey || r.monthKey.includes(monthConfig.current)
    )
    if (report) {
      setIsSaved(true)
      setIsEditing(false)
      setAwardBadge(normalizeAwardBadge(report.awardBadge) || '')
      setTeacherName(report.teacherName)
      setSectionA1Content(report.sectionA1Content)
      setSectionA2Content(report.sectionA2Content)
      setSectionB1Content(report.sectionB1Content)
      setSectionB2StartLesson(report.sectionB2StartLesson)
      setSectionB2EndLesson(report.sectionB2EndLesson)
      setSectionB2Weeks(report.sectionB2Weeks)
    } else {
      setIsSaved(false)
      setIsEditing(true)
      setAwardBadge('')
      setTeacherName('Ms.Chloe')
      setSectionA1Content('')
      setSectionA2Content('')
      setGalleryPhotos([])
      setSectionB1Content('')
      setSectionB2StartLesson(isMath ? 1 : 8)
      setSectionB2EndLesson(isMath ? 4 : 10)
      setSectionB2Weeks([
        { weekNum: 1, title: 'Tuần 1', content: '', docLink: '', thumbnailUrl: '' },
        { weekNum: 2, title: 'Tuần 2', content: '', docLink: '', thumbnailUrl: '' },
        { weekNum: 3, title: 'Tuần 3', content: '', docLink: '', thumbnailUrl: '' },
        { weekNum: 4, title: 'Tuần 4', content: '', docLink: '', thumbnailUrl: '' },
      ])
    }
  }

  const handleCancelEdit = () => {
    handleMonthChange(selectedMonthKey)
    setIsEditing(false)
    toast.info('Đã hủy các chỉnh sửa chưa lưu.')
  }

  // Lắng nghe sự kiện đồng bộ từ các màn hình khác
  useEffect(() => {
    const handleUpdate = () => {
      const monthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]
      const report = getStudentMonthlyReports(student.id || student.name).find(
        (r) => r.monthOptionValue === selectedMonthKey || r.monthKey.includes(monthConfig.current)
      )
      if (report) {
        setAwardBadge(report.awardBadge)
        setTeacherName(report.teacherName)
        setSectionA1Content(report.sectionA1Content)
        setSectionA2Content(report.sectionA2Content)
        setSectionB1Content(report.sectionB1Content)
        setSectionB2StartLesson(report.sectionB2StartLesson)
        setSectionB2EndLesson(report.sectionB2EndLesson)
        setSectionB2Weeks(report.sectionB2Weeks)
      }
    }
    window.addEventListener('rinov5-monthly-reports-updated', handleUpdate)
    return () => window.removeEventListener('rinov5-monthly-reports-updated', handleUpdate)
  }, [student, selectedMonthKey])

  // Step 1: Start lesson change
  const handleStartLessonChange = (startNum: number) => {
    setSectionB2StartLesson(startNum)
    const newB1Content = getDirectLessonPlanForRange(startNum, sectionB2EndLesson, isMath)
    setSectionB1Content(newB1Content)
  }

  // Step 1: End lesson change
  const handleEndLessonChange = (endNum: number) => {
    setSectionB2EndLesson(endNum)
    const newB1Content = getDirectLessonPlanForRange(sectionB2StartLesson, endNum, isMath)
    setSectionB1Content(newB1Content)
  }

  // Load sample lesson plan for Section 1
  const handleLoadNextMonthPlan = () => {
    setIsSynthesizingAi(true)
    setTimeout(() => {
      setIsSynthesizingAi(false)
      const synthesizedText = getAiSynthesizedNextMonthPlan(sectionB2StartLesson, sectionB2EndLesson, isMath)
      setSectionB1Content(synthesizedText)
      toast.success(`Đã nạp nội dung bài học tháng tới (Buổi ${sectionB2StartLesson} đến Buổi ${sectionB2EndLesson})!`)
    }, 300)
  }

  const handleSave = () => {
    setIsSaved(true)
    setIsEditing(false)

    // Lưu đồng bộ vào CSDL mock chung
    saveStudentMonthlyReport({
      studentId: student.id,
      studentName: student.name,
      studentCode: student.code,
      monthKey: activeMonthConfig.current + '/2026',
      monthOptionValue: selectedMonthKey,
      monthTitle: `BÁO CÁO HỌC TẬP ${activeMonthConfig.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${activeMonthConfig.next.toUpperCase()}`,
      dateStr: activeMonthConfig.dateStr,
      awardBadge,
      teacherName,
      sectionA1Content,
      sectionA2Content,
      sectionAContent: `${sectionA1Content}\n\n${sectionA2Content}`,
      galleryPhotos,
      sectionB1Content,
      sectionB2StartLesson,
      sectionB2EndLesson,
      sectionB2Weeks,
      sectionBContent: `${sectionB1Content}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
      isCurrent: selectedMonthKey === '4_5_2026',
    })

    toast.success(`Đã lưu Báo cáo học tập ${activeMonthConfig.current} cho học viên ${student.name}`)
  }

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden w-full h-full bg-background relative z-10 animate-in fade-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-border/60 pb-2.5 pt-1 mb-2 pr-1">
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="text-xs md:text-sm font-extrabold text-foreground truncate">
              BÁO CÁO HỌC TẬP
            </h3>
            {isEditing ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                Sửa
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border/60">
                Xem
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-transform active:scale-95 shrink-0"
            title="Đóng panel báo cáo tháng"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-4 custom-scrollbar pr-0.5">
          {/* Month Selector */}
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="font-semibold text-muted-foreground shrink-0">Kỳ báo cáo:</span>
            <Select value={selectedMonthKey} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-8 text-xs font-bold w-full max-w-[260px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-xs">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Thông báo thời hạn chỉnh sửa khi đang sửa */}
          {isEditing && (
            <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-[11px] text-amber-950 dark:text-amber-200 flex items-center justify-between gap-2 shadow-3xs">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>Hạn sửa:</strong> Còn <strong>{editStatus.daysRemaining} ngày</strong> (hạn chót: {editStatus.deadlineText}). Sau 5 ngày hệ thống sẽ tự động khóa.
                </span>
              </div>
            </div>
          )}

          {/* Thông báo khi kỳ cũ đã khóa chỉnh sửa */}
          {!isEditing && editStatus.isLocked && (
            <div className="px-3 py-2 rounded-xl bg-muted/60 border border-border text-[11px] text-muted-foreground flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>
                  Báo cáo này đã khóa sau 5 ngày kể từ ngày phát hành tự động ({editStatus.issuedDateText}).
                </span>
              </div>
            </div>
          )}

          {/* Teacher Note Line with Pencil Icon */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Tuyên dương:</span>
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <Select value={awardBadge || ''} onValueChange={setAwardBadge}>
                    <SelectTrigger className="h-7 text-xs font-black bg-amber-400 text-amber-950 border-amber-500 rounded-lg">
                      <SelectValue placeholder="Chọn danh hiệu..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(isMath ? AWARD_BADGES : ENGLISH_AWARD_BADGES).map((b) => (
                        <SelectItem key={b} value={b} className="text-xs font-bold">
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <MonthlyAwardCriteriaPopover
                    selectedBadge={awardBadge}
                    onSelectBadge={setAwardBadge}
                    isEditing={true}
                    isMath={isMath}
                    className="h-7 w-7"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  {awardBadge ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase">
                      {awardBadge}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic px-2 py-0.5 rounded-full bg-muted/50 border border-dashed">
                      Chưa đặt danh hiệu
                    </span>
                  )}

                  <MonthlyAwardCriteriaPopover
                    selectedBadge={awardBadge}
                    isEditing={false}
                    isMath={isMath}
                    className="h-6 w-6"
                  />
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="pt-2 border-t border-amber-400/20 flex items-start gap-2 text-sm text-muted-foreground italic">
                <Pencil className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 not-italic stroke-[2.5] mt-0.5" />
                <span>
                  Rino Edu xin chúc mừng con{' '}
                  <strong className="text-primary font-bold not-italic">{student.name}</strong>{' '}
                  đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi
                  tiết và định hướng rèn luyện từ giáo viên phụ trách{' '}
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Tên Giáo viên"
                    className="inline-block w-28 text-center text-sm font-bold text-primary border-b border-primary/40 bg-transparent focus:outline-none not-italic"
                  />
                  .
                </span>
              </div>
            ) : (
              <div className="pt-2 border-t border-amber-400/20 text-xs text-foreground/90 leading-relaxed">
                Rino Edu xin chúc mừng con{' '}
                <strong className="text-primary font-bold">{student.name}</strong> đã hoàn thành
                xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết và định hướng
                rèn luyện từ giáo viên phụ trách{' '}
                <strong className="text-primary font-bold">{teacherName || 'Ms.Chloe'}</strong>.
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
              document.getElementById('overlay-section-a')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />

          {/* Section A: Báo cáo học tập & Khoảnh khắc */}
          <MonthlyReportAcademicSection
            isEditing={isEditing}
            isMath={isMath}
            monthTitle={activeMonthConfig.current}
            studentId={student.id}
            studentName={student.name}
            sectionA1Content={sectionA1Content}
            sectionA2Content={sectionA2Content}
            onUpdateA1={(content) => setSectionA1Content(content)}
            onUpdateA2={(content) => setSectionA2Content(content)}
            galleryPhotos={galleryPhotos}
            onChangePhotos={setGalleryPhotos}
            idPrefix="overlay"
          />

          {/* Section B */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
              B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
            </h4>

            {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-2 pb-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 shrink-0">
                  1. Nội dung bài học tháng tới
                </label>

                {/* Step 1 & Step 2 Controls chỉ hiện khi isEditing */}
                {isEditing && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <span className="text-xs font-bold text-muted-foreground shrink-0">Chọn bài:</span>
                    <Select value={String(sectionB2StartLesson)} onValueChange={(v) => handleStartLessonChange(Number(v))}>
                      <SelectTrigger
                        className="h-7.5 text-xs font-semibold w-24 sm:w-28 max-w-[120px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-2"
                        title={startLessonObj ? `Buổi ${startLessonObj.lessonNumber}: ${startLessonObj.title}` : undefined}
                      >
                        <SelectValue placeholder="Bắt đầu" />
                      </SelectTrigger>
                      <SelectContent className="max-w-[380px] w-[320px]">
                        {activeLessons.map((l) => (
                          <SelectItem key={l.lessonNumber} value={String(l.lessonNumber)} className="text-xs py-1.5 cursor-pointer">
                            <span className="truncate block" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                              Buổi {l.lessonNumber}: {l.title}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-xs font-bold text-muted-foreground shrink-0">→</span>

                    <Select value={String(sectionB2EndLesson)} onValueChange={(v) => handleEndLessonChange(Number(v))}>
                      <SelectTrigger
                        className="h-7.5 text-xs font-semibold w-24 sm:w-28 max-w-[120px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-2"
                        title={endLessonObj ? `Buổi ${endLessonObj.lessonNumber}: ${endLessonObj.title}` : undefined}
                      >
                        <SelectValue placeholder="Kết thúc" />
                      </SelectTrigger>
                      <SelectContent className="max-w-[380px] w-[320px]">
                        {activeLessons.map((l) => (
                          <SelectItem key={l.lessonNumber} value={String(l.lessonNumber)} className="text-xs py-1.5 cursor-pointer">
                            <span className="truncate block" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                              Buổi {l.lessonNumber}: {l.title}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Load sample lesson content button */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleLoadNextMonthPlan}
                      disabled={isSynthesizingAi}
                      className="h-7.5 text-xs font-bold px-2 sm:px-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md gap-1.5 shrink-0"
                      title="Nạp nội dung khung chương trình cho các buổi học đã chọn"
                    >
                      {isSynthesizingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <BookOpen className="h-3 w-3" />}
                      <span>Nạp bài học mẫu</span>
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <textarea
                  rows={6}
                  value={sectionB1Content}
                  onChange={(e) => setSectionB1Content(e.target.value)}
                  placeholder="Nhập hoặc chọn bài học rồi bấm 'Nạp bài học mẫu' để biên tập nội dung..."
                  className="w-full text-sm p-3.5 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y"
                />
              ) : (
                <div className="w-full text-sm p-3.5 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                  {sectionB1Content || <span className="italic text-muted-foreground/60">Chưa có kế hoạch.</span>}
                </div>
              )}
            </div>

            {/* Sub-section 2: Nội dung ôn tập riêng */}
            <MonthlyReportReviewItemsSection
              items={sectionB2Weeks}
              onChange={(updated) => setSectionB2Weeks(updated)}
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Overlay Bottom Footer */}
        <div className="pt-2.5 border-t mt-2 shrink-0 flex items-center justify-between gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="text-xs font-semibold px-3 rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="text-xs font-bold px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Lưu thay đổi</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-xs flex-wrap">
                {editStatus.isLocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border">
                    <Lock className="h-2.5 w-2.5" />
                    <span>Đã khóa</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <Clock className="h-2.5 w-2.5" />
                    <span>Còn {editStatus.daysRemaining} ngày sửa</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== 'undefined' ? window.location.origin : ''
                    const url = `${origin}/report/${student.id}?month=${encodeURIComponent(selectedMonthKey)}`
                    window.open(url, '_blank')
                  }}
                  className="flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-bold text-xs cursor-pointer"
                  title="Mở toàn màn hình dạng Landing Page trên tab mới"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Landing Page</span>
                </button>

                {isSaved ? (
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : ''
                      const link = `${origin}/report/${student.id}?month=${encodeURIComponent(selectedMonthKey)}`
                      navigator.clipboard
                        .writeText(link)
                        .then(() => toast.success(`Đã sao chép liên kết Landing Page báo cáo ${activeMonthConfig.current}!`))
                        .catch(() => toast.error('Không thể sao chép liên kết.'))
                    }}
                    className="flex items-center gap-1 text-primary hover:underline font-bold text-xs cursor-pointer"
                    title="Sao chép liên kết gửi phụ huynh"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Sao chép link</span>
                  </button>
                ) : null}
              </div>

              {editStatus.isLocked ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.warning(
                      'Báo cáo đã khóa sau 5 ngày kể từ ngày tạo tự động. Vui lòng liên hệ Quản lý cơ sở để mở khóa.'
                    )
                  }
                  className="text-xs font-semibold px-3 rounded-lg cursor-not-allowed opacity-60 gap-1 bg-muted/40 border-dashed"
                  title="Báo cáo đã khóa sau 5 ngày kể từ ngày tạo tự động."
                >
                  <Lock className="h-3 w-3" />
                  <span>Đã khóa</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Chỉnh sửa</span>
                </Button>
              )}
            </>
          )}
        </div>
      </aside>
  )
}
