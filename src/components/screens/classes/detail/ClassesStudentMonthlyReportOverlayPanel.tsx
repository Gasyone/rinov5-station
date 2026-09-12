'use client'

import { useState, useMemo, useEffect } from 'react'
import { X, Loader2, Sparkles, Pencil, Copy, Check, ExternalLink } from 'lucide-react'
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
import {
  MOCK_LESSONS_REVIEW,
  getAiSynthesizedNextMonthPlan,
  getDirectLessonPlanForRange,
  WeekReviewItem,
  DEFAULT_SECTION_B2_WEEKS,
} from './monthlyReportHelpers'
import { getStudentMonthlyReports, saveStudentMonthlyReport } from '@/mocks/monthlyReports'

interface ClassesStudentMonthlyReportOverlayPanelProps {
  student: RosterStudent
  onClose: () => void
}

const AWARD_BADGES = [
  'CHIẾN BINH BỨT PHÁ',
  'HỌC VIÊN XUẤT SẮC',
  'NGÔI SAO CHĂM NGOAN',
  'CHIẾN BINH TIẾN BỘ',
  'NGÔI SAO SÁNG TẠO',
]

const DEFAULT_SECTION_A1_TEXT = `Điểm nổi bật: Con có thái độ học tập tích cực và hợp tác tốt trong lớp. Khi đã hiểu yêu cầu, con vẫn cố gắng hoàn thành task và theo kịp hoạt động của lớp. Con có xu hướng quan sát khá kỹ trước khi tham gia, cho thấy con học theo hướng cẩn thận và muốn làm đúng trước khi trả lời. 

Điểm cần lưu ý: Hiện tại tốc độ phản xạ lại câu hỏi và tham gia hoạt động của con còn chậm hơn so với nhịp chung của lớp, đặc biệt ở các hoạt động luyện tập hội thoại. Con khá sợ nói sai và ngại trả lời dù đã biết đáp án. Qua quan sát, cô nhận thấy con có tâm lý sợ bị chú ý và thiếu tự tin khi bị nhận xét góp ý, nên thường chọn im lặng để tránh sai thay vì thử trả lời. Điều này khiến khả năng phản xạ ngôn ngữ của con chưa phát huy hết khả năng thật sự.`

const DEFAULT_SECTION_A2_TEXT = `Từ vựng & Phonics: Con nhớ khá tốt các từ vựng: touch, smell và Letter U: umbrella, up. Tuy nhiên con vẫn còn nhầm lẫn các từ see, hear và chưa nhớ chắc Letter T: tiger, tent.

Cấu trúc & Mẫu câu: Con hiện chưa phản xạ được mẫu câu I see with my … và vẫn cần cô nhắc lại nhiều lần trước khi có thể sử dụng đúng cấu trúc.`

const DEFAULT_SECTION_B1_TEXT = getAiSynthesizedNextMonthPlan(8, 10)

const MONTH_OPTIONS = [
  { value: '4_5_2026', label: 'Báo cáo Tháng 4 & Kế hoạch Tháng 5/2026', current: 'Tháng 4', next: 'Tháng 5', dateStr: '01/04/2026 đến 30/04/2026' },
  { value: '5_6_2026', label: 'Báo cáo Tháng 5 & Kế hoạch Tháng 6/2026', current: 'Tháng 5', next: 'Tháng 6', dateStr: '01/05/2026 đến 31/05/2026' },
  { value: '6_7_2026', label: 'Báo cáo Tháng 6 & Kế hoạch Tháng 7/2026', current: 'Tháng 6', next: 'Tháng 7', dateStr: '01/06/2026 đến 30/06/2026' },
  { value: '7_8_2026', label: 'Báo cáo Tháng 7 & Kế hoạch Tháng 8/2026', current: 'Tháng 7', next: 'Tháng 8', dateStr: '01/07/2026 đến 31/07/2026' },
]

export function ClassesStudentMonthlyReportOverlayPanel({
  student,
  onClose,
}: ClassesStudentMonthlyReportOverlayPanelProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState('4_5_2026')
  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  const initialReport = useMemo(() => {
    return getStudentMonthlyReports(student.id || student.name).find(
      (r) => r.monthOptionValue === '4_5_2026' || r.monthKey.includes('Tháng 4')
    )
  }, [student])

  const [awardBadge, setAwardBadge] = useState(() => initialReport?.awardBadge || 'CHIẾN BINH BỨT PHÁ')
  const [teacherName, setTeacherName] = useState(() => initialReport?.teacherName || 'Ms.Chloe')
  const [sectionA1Content, setSectionA1Content] = useState(() => initialReport?.sectionA1Content || DEFAULT_SECTION_A1_TEXT)
  const [sectionA2Content, setSectionA2Content] = useState(() => initialReport?.sectionA2Content || DEFAULT_SECTION_A2_TEXT)
  const [sectionB1Content, setSectionB1Content] = useState(() => initialReport?.sectionB1Content || DEFAULT_SECTION_B1_TEXT)
  const [sectionB2StartLesson, setSectionB2StartLesson] = useState(() => initialReport?.sectionB2StartLesson || 8)
  const [sectionB2EndLesson, setSectionB2EndLesson] = useState(() => initialReport?.sectionB2EndLesson || 10)
  const [sectionB2Weeks, setSectionB2Weeks] = useState<WeekReviewItem[]>(() => initialReport?.sectionB2Weeks || DEFAULT_SECTION_B2_WEEKS)
  const [isSynthesizingAi, setIsSynthesizingAi] = useState(false)
  const [isSaved, setIsSaved] = useState(() => Boolean(initialReport))
  const [isEditing, setIsEditing] = useState(() => !initialReport)

  const handleMonthChange = (newKey: string) => {
    setSelectedMonthKey(newKey)
    const monthConfig = MONTH_OPTIONS.find((m) => m.value === newKey) || MONTH_OPTIONS[0]
    const report = getStudentMonthlyReports(student.id || student.name).find(
      (r) => r.monthOptionValue === newKey || r.monthKey.includes(monthConfig.current)
    )
    if (report) {
      setIsSaved(true)
      setIsEditing(false)
      setAwardBadge(report.awardBadge)
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
      setAwardBadge('CHIẾN BINH BỨT PHÁ')
      setTeacherName('Ms.Chloe')
      setSectionA1Content(DEFAULT_SECTION_A1_TEXT)
      setSectionA2Content(DEFAULT_SECTION_A2_TEXT)
      setSectionB1Content(DEFAULT_SECTION_B1_TEXT)
      setSectionB2StartLesson(8)
      setSectionB2EndLesson(10)
      setSectionB2Weeks(DEFAULT_SECTION_B2_WEEKS)
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
    const newB1Content = getDirectLessonPlanForRange(startNum, sectionB2EndLesson)
    setSectionB1Content(newB1Content)
  }

  // Step 1: End lesson change
  const handleEndLessonChange = (endNum: number) => {
    setSectionB2EndLesson(endNum)
    const newB1Content = getDirectLessonPlanForRange(sectionB2StartLesson, endNum)
    setSectionB1Content(newB1Content)
  }

  // Step 2: AI Synthesize next month plan for Section 1
  const handleAiSynthesizeNextMonthPlan = () => {
    setIsSynthesizingAi(true)
    setTimeout(() => {
      setIsSynthesizingAi(false)
      const synthesizedText = getAiSynthesizedNextMonthPlan(sectionB2StartLesson, sectionB2EndLesson)
      setSectionB1Content(synthesizedText)
      toast.success(`✨ AI đã tổng hợp thành công nội dung bài học tháng tới (Bài ${sectionB2StartLesson} đến Bài ${sectionB2EndLesson})!`)
    }, 400)
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
      monthTitle: `BÁO CÁO HỌC TẬP CHUYÊN SÂU ${activeMonthConfig.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${activeMonthConfig.next.toUpperCase()}`,
      dateStr: activeMonthConfig.dateStr,
      awardBadge,
      teacherName,
      sectionA1Content,
      sectionA2Content,
      sectionAContent: `${sectionA1Content}\n\n${sectionA2Content}`,
      sectionB1Content,
      sectionB2StartLesson,
      sectionB2EndLesson,
      sectionB2Weeks,
      sectionBContent: `${sectionB1Content}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
      isCurrent: selectedMonthKey === '4_5_2026',
    })

    toast.success(`Đã lưu Báo cáo Chuyên sâu ${activeMonthConfig.current} cho học viên ${student.name}`)
  }

  return (
    <>
      <aside className="flex min-h-0 flex-col overflow-hidden w-full h-full bg-background relative z-10 animate-in fade-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-border/60 pb-2.5 pt-1 mb-2 pr-1">
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="text-xs md:text-sm font-extrabold text-foreground truncate">
              BÁO CÁO CHUYÊN SÂU
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

          {/* Teacher Note Line with Pencil Icon */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Tuyên dương:</span>
              {isEditing ? (
                <Select value={awardBadge} onValueChange={setAwardBadge}>
                  <SelectTrigger className="h-7 text-xs font-black bg-amber-400 text-amber-950 border-amber-500 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AWARD_BADGES.map((b) => (
                      <SelectItem key={b} value={b} className="text-xs font-bold">
                        🏆 {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase">
                  🏆 {awardBadge}
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="pt-2 border-t border-amber-400/20 flex items-start gap-2 text-sm text-muted-foreground italic">
                <Pencil className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 not-italic stroke-[2.5] mt-0.5" />
                <span>
                  Rino Edu xin chúc mừng con <strong className="text-primary font-bold not-italic">{student.name}</strong> đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết từ GV{' '}
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Tên Giáo viên"
                    className="inline-block w-28 text-center text-sm font-bold text-primary border-b border-primary/40 bg-transparent focus:outline-none not-italic"
                  />.
                </span>
              </div>
            ) : (
              <div className="pt-1.5 border-t border-amber-400/20 text-xs text-foreground/90 leading-relaxed">
                Chúc mừng con <strong className="text-primary font-bold">{student.name}</strong> đã hoàn thành xuất sắc kỳ học từ GV <strong className="text-primary font-bold">{teacherName}</strong>.
              </div>
            )}
          </div>

          {/* Section A (Tách 2 phần A1 & A2) */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
              A - BÁO CÁO HỌC TẬP CHUYÊN SÂU {activeMonthConfig.current.toUpperCase()}
            </h4>

            {/* Sub-section A1: 1. Nhận xét chung */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                1. Nhận xét chung
              </label>
              {isEditing ? (
                <textarea
                  rows={5}
                  value={sectionA1Content}
                  onChange={(e) => setSectionA1Content(e.target.value)}
                  placeholder="Nhập 'Điểm nổi bật: ...' và 'Điểm cần lưu ý: ...'"
                  className="w-full text-sm p-3.5 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y"
                />
              ) : (
                <div className="w-full text-sm p-3.5 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                  {sectionA1Content || <span className="italic text-muted-foreground/60">Chưa có nhận xét.</span>}
                </div>
              )}
            </div>

            {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                2. Nhận xét về kết quả học tập
              </label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={sectionA2Content}
                  onChange={(e) => setSectionA2Content(e.target.value)}
                  placeholder="Nhập 'Từ vựng & Phonics: ...' và 'Cấu trúc & Mẫu câu: ...'"
                  className="w-full text-sm p-3.5 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans resize-y"
                />
              ) : (
                <div className="w-full text-sm p-3.5 rounded-xl border border-border/40 bg-muted/20 text-foreground leading-relaxed font-sans whitespace-pre-line">
                  {sectionA2Content || <span className="italic text-muted-foreground/60">Chưa có nhận xét.</span>}
                </div>
              )}
            </div>
          </div>

          {/* Section B */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
              B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
            </h4>

            {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                  1. Nội dung bài học tháng tới
                </label>

                {/* Step 1 & Step 2 Controls chỉ hiện khi isEditing */}
                {isEditing && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-muted-foreground">Bài:</span>
                    <Select value={String(sectionB2StartLesson)} onValueChange={(v) => handleStartLessonChange(Number(v))}>
                      <SelectTrigger className="h-7 text-xs w-16 bg-background px-2">
                        <SelectValue />
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

                    <Select value={String(sectionB2EndLesson)} onValueChange={(v) => handleEndLessonChange(Number(v))}>
                      <SelectTrigger className="h-7 text-xs w-16 bg-background px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_LESSONS_REVIEW.map((l) => (
                          <SelectItem key={l.lessonNumber} value={String(l.lessonNumber)} className="text-xs">
                            Bài {l.lessonNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* AI Synthesize Button */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAiSynthesizeNextMonthPlan}
                      disabled={isSynthesizingAi}
                      className="h-7 text-xs font-bold px-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md gap-1"
                      title="Tự động biên tập nội dung ngôn ngữ tự nhiên"
                    >
                      {isSynthesizingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />}
                      <span>AI Tổng hợp</span>
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <textarea
                  rows={6}
                  value={sectionB1Content}
                  onChange={(e) => setSectionB1Content(e.target.value)}
                  placeholder="Nhập hoặc bấm 'Cập nhật' / 'AI Tổng hợp' để biên tập nội dung..."
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
              <div className="flex items-center gap-3 text-xs">
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

              <Button
                type="button"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </Button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
