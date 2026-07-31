'use client'

import { useState } from 'react'
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
import { Sparkles, Loader2, Check, ExternalLink, Link as LinkIcon, FileText, Pencil, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { RosterStudent } from './classesDetailTypes'
import { StudentMonthlyReportLandingDialog } from './StudentMonthlyReportLandingDialog'
import {
  MOCK_LESSONS_REVIEW,
  getReviewContentForRange,
  getAiSynthesizedNextMonthPlan,
  getDirectLessonPlanForRange,
  WeekReviewItem,
  DEFAULT_SECTION_B2_WEEKS,
} from './monthlyReportHelpers'

interface StudentMonthlyReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: RosterStudent[]
  initialStudentId?: string
}

export interface DetailedMonthlyReportForm {
  monthPeriod: string
  awardBadge: string
  teacherName: string
  sectionAContent: string
  sectionA1Content: string
  sectionA2Content: string
  sectionB1Content: string
  sectionB2StartLesson: number
  sectionB2EndLesson: number
  sectionB2Weeks: WeekReviewItem[]
  sectionB2Content: string
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

const DEFAULT_FILLED_REPORT_FORM: DetailedMonthlyReportForm = {
  monthPeriod: '01/04/2026 đến 30/04/2026',
  awardBadge: 'CHIẾN BINH BỨT PHÁ',
  teacherName: 'Ms.Chloe',
  sectionAContent: `${DEFAULT_SECTION_A1_TEXT}\n\n${DEFAULT_SECTION_A2_TEXT}`,
  sectionA1Content: DEFAULT_SECTION_A1_TEXT,
  sectionA2Content: DEFAULT_SECTION_A2_TEXT,
  sectionB1Content: DEFAULT_SECTION_B1_TEXT,
  sectionB2StartLesson: 8,
  sectionB2EndLesson: 10,
  sectionB2Weeks: DEFAULT_SECTION_B2_WEEKS,
  sectionB2Content: getReviewContentForRange(8, 10),
}

const EMPTY_REPORT_FORM: DetailedMonthlyReportForm = {
  monthPeriod: '01/04/2026 đến 30/04/2026',
  awardBadge: 'CHIẾN BINH BỨT PHÁ',
  teacherName: 'Ms.Chloe',
  sectionAContent: '',
  sectionA1Content: '',
  sectionA2Content: '',
  sectionB1Content: '',
  sectionB2StartLesson: 8,
  sectionB2EndLesson: 10,
  sectionB2Weeks: [
    { weekNum: 1, title: 'Tuần 1', content: '', docLink: '', thumbnailUrl: '' },
    { weekNum: 2, title: 'Tuần 2', content: '', docLink: '', thumbnailUrl: '' },
    { weekNum: 3, title: 'Tuần 3', content: '', docLink: '', thumbnailUrl: '' },
    { weekNum: 4, title: 'Tuần 4', content: '', docLink: '', thumbnailUrl: '' },
  ],
  sectionB2Content: '',
}

const MONTH_OPTIONS = [
  { value: '4_5_2026', label: 'Báo cáo Tháng 4 & Kế hoạch Tháng 5/2026', current: 'Tháng 4', next: 'Tháng 5', dateStr: '01/04/2026 đến 30/04/2026' },
  { value: '5_6_2026', label: 'Báo cáo Tháng 5 & Kế hoạch Tháng 6/2026', current: 'Tháng 5', next: 'Tháng 6', dateStr: '01/05/2026 đến 31/05/2026' },
  { value: '6_7_2026', label: 'Báo cáo Tháng 6 & Kế hoạch Tháng 7/2026', current: 'Tháng 6', next: 'Tháng 7', dateStr: '01/06/2026 đến 30/06/2026' },
  { value: '7_8_2026', label: 'Báo cáo Tháng 7 & Kế hoạch Tháng 8/2026', current: 'Tháng 7', next: 'Tháng 8', dateStr: '01/07/2026 đến 31/07/2026' },
]

export function StudentMonthlyReportDialog({
  open,
  onOpenChange,
  students,
  initialStudentId,
}: StudentMonthlyReportDialogProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('4_5_2026')
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id ?? '')
  )
  const [isSynthesizingAi, setIsSynthesizingAi] = useState<boolean>(false)
  const [isOpenLanding, setIsOpenLanding] = useState<boolean>(false)

  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  // Track created status per student ID
  const [reportStatusMap, setReportStatusMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    students.forEach((s, idx) => {
      map[s.id] = idx % 3 !== 0
    })
    return map
  })

  // Report forms per student
  const [reportsMap, setReportsMap] = useState<Record<string, DetailedMonthlyReportForm>>(() => {
    const map: Record<string, DetailedMonthlyReportForm> = {}
    students.forEach((s, idx) => {
      if (idx % 3 !== 0) {
        map[s.id] = { ...DEFAULT_FILLED_REPORT_FORM }
      } else {
        map[s.id] = { ...EMPTY_REPORT_FORM }
      }
    })
    return map
  })

  const currentForm = reportsMap[selectedStudentId] || { ...EMPTY_REPORT_FORM }
  const isCreated = !!reportStatusMap[selectedStudentId]

  const handleUpdateForm = (fields: Partial<DetailedMonthlyReportForm>) => {
    setReportsMap((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...(prev[selectedStudentId] || EMPTY_REPORT_FORM),
        ...fields,
      },
    }))
  }

  const handleUpdateWeek = (wIdx: number, fields: Partial<WeekReviewItem>) => {
    const updatedWeeks = [...(currentForm.sectionB2Weeks || DEFAULT_SECTION_B2_WEEKS)]
    updatedWeeks[wIdx] = { ...updatedWeeks[wIdx], ...fields }
    handleUpdateForm({ sectionB2Weeks: updatedWeeks })
  }

  const handleUploadImageFile = (wIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      handleUpdateWeek(wIdx, { thumbnailUrl: url })
      toast.success(`Đã tải ảnh lên thành công cho Tuần ${wIdx + 1}!`)
    }
  }

  const [editingLinkMap, setEditingLinkMap] = useState<Record<number, boolean>>({})

  const handleStartEditingLink = (wIdx: number) => {
    setEditingLinkMap((prev) => ({ ...prev, [wIdx]: true }))
    setTimeout(() => {
      const inputEl = document.getElementById(`doc-link-input-dialog-w${wIdx}`) as HTMLInputElement | null
      if (inputEl) {
        inputEl.focus()
        inputEl.select()
      }
    }, 50)
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0]

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
    toast.success(`Đã lưu báo cáo chuyên sâu & kế hoạch học tập cho học viên ${selectedStudent.name}!`)
  }

  const currentWeeks = currentForm.sectionB2Weeks && currentForm.sectionB2Weeks.length > 0
    ? currentForm.sectionB2Weeks
    : EMPTY_REPORT_FORM.sectionB2Weeks

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] xl:max-w-[1240px] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-3xl border bg-background shadow-2xl">
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
              <Select value={selectedMonthKey} onValueChange={setSelectedMonthKey}>
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
            {/* Left Roster Student Sidebar */}
            <div className="w-64 border-r bg-muted/10 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
              <div className="p-3 border-b text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider flex items-center justify-between bg-muted/20">
                <span>HỌC VIÊN IN ROSTER</span>
                <span>TRẠNG THÁI</span>
              </div>

              <div className="divide-y divide-border/40">
                {students.map((student) => {
                  const isSelected = student.id === selectedStudentId
                  const isDone = !!reportStatusMap[student.id]
                  const sInitials = student.name
                    .trim()
                    .split(' ')
                    .map((p) => p[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase()

                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => setSelectedStudentId(student.id)}
                      className={cn(
                        'w-full p-3 flex items-center justify-between text-left transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-primary/10 border-s-4 border-s-primary text-foreground font-bold'
                          : 'hover:bg-muted/30 text-muted-foreground font-medium'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            'h-7 w-7 rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {sInitials}
                        </div>
                        <div className="min-w-0">
                          <div className={cn('text-xs truncate', isSelected && 'font-bold text-primary')}>
                            {student.name}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground/80 truncate">
                            {student.code}
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="shrink-0 ms-1">
                        {isDone ? (
                          <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 italic">—</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Report Detail Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-background">
              {/* Top Banner Notice (Xóa dòng AI gợi ý, giữ dòng Trong thời gian tới kèm Icon bút sửa) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-muted-foreground font-semibold">
                    Kết quả học tập từ <strong className="text-foreground font-bold">{activeMonthConfig.dateStr}</strong>
                  </div>

                  {/* Award Badge Dropdown */}
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
                </div>

                {/* Editable Teacher Note Row with Pencil Icon */}
                <div className="pt-2 border-t border-amber-400/20 flex items-start gap-2 text-xs text-muted-foreground italic">
                  <Pencil className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 not-italic stroke-[2.5] mt-0.5" />
                  <span>
                    Rino Edu xin chúc mừng con <strong className="text-primary font-bold not-italic">{selectedStudent.name}</strong> đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết và định hướng bứt phá từ giáo viên phụ trách{' '}
                    <input
                      type="text"
                      value={currentForm.teacherName}
                      onChange={(e) => handleUpdateForm({ teacherName: e.target.value })}
                      placeholder="Tên Giáo viên"
                      className="inline-block w-28 text-center text-xs font-bold text-primary border-b border-primary/40 bg-transparent focus:outline-none not-italic"
                    />.
                  </span>
                </div>
              </div>

              {/* SECTION A: BÁO CÁO HỌC TẬP CHUYÊN SÂU (TÁCH THÀNH 2 MỤC) */}
              <div className="space-y-4 pt-1 border-t">
                <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                  A - BÁO CÁO HỌC TẬP CHUYÊN SÂU {activeMonthConfig.current.toUpperCase()}
                </h4>

                {/* Sub-section A1: 1. Nhận xét chung */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                    1. Nhận xét chung
                  </label>
                  <textarea
                    rows={6}
                    value={currentForm.sectionA1Content}
                    onChange={(e) => handleUpdateForm({ sectionA1Content: e.target.value })}
                    placeholder="Nhập 'Điểm nổi bật: ...' và 'Điểm cần lưu ý: ...'"
                    className="w-full text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    2. Nhận xét về kết quả học tập
                  </label>
                  <textarea
                    rows={5}
                    value={currentForm.sectionA2Content}
                    onChange={(e) => handleUpdateForm({ sectionA2Content: e.target.value })}
                    placeholder="Nhập 'Từ vựng & Phonics: ...' và 'Cấu trúc & Mẫu câu: ...'"
                    className="w-full text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* SECTION B: KẾ HOẠCH HỌC TẬP CẢI THIỆN */}
              <div className="space-y-4 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                    B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
                  </h4>
                  <span className="text-[11px] font-semibold text-primary">Quy trình 2 bước: Step 1 Chọn bài → Step 2 AI Tổng hợp</span>
                </div>

                {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
                    <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                      1. Nội dung bài học tháng tới
                    </label>

                    {/* Step 1: Chọn Bài bắt đầu -> Kết thúc + Button Cập nhật Ô 1 + Button AI Tổng hợp */}
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
                  </div>

                  <textarea
                    rows={8}
                    value={currentForm.sectionB1Content}
                    onChange={(e) => handleUpdateForm({ sectionB1Content: e.target.value })}
                    placeholder="Nhập hoặc bấm 'Cập nhật' / 'AI Tổng hợp' để tự động cập nhật nội dung bài học..."
                    className="w-full text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Sub-section 2: Nội dung ôn tập riêng (Bỏ "(4 tuần)", Bỏ ô Paste link, Ảnh & Ô nhập chung hàng, Hover để Upload/Paste Link) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-1">
                    <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
                      2. Nội dung ôn tập riêng
                    </label>
                  </div>

                  {/* 4 Weeks Row Blocks (Ảnh to, cùng hàng với Ô nhập text) */}
                  <div className="space-y-3">
                    {currentWeeks.map((week, wIdx) => (
                      <div key={week.weekNum} className="p-3.5 rounded-2xl border border-amber-400/30 bg-amber-500/5 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/40 uppercase tracking-wide">
                            Tuần {week.weekNum}
                          </span>

                          {/* Display Mode vs Edit Mode for Link */}
                          {week.docLink && !editingLinkMap[wIdx] ? (
                            <div className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15 text-primary px-3 py-1 rounded-xl border border-primary/20 transition-all">
                              <a
                                href={week.docLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold hover:underline inline-flex items-center gap-1.5 max-w-[220px] sm:max-w-[340px] truncate"
                                title={week.docLink}
                              >
                                <LinkIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span className="truncate">
                                  {week.docLink.includes('drive.google.com') ? 'Tài liệu Google Drive đính kèm' : week.docLink}
                                </span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>

                              {/* Button to edit/paste another link */}
                              <button
                                type="button"
                                onClick={() => handleStartEditingLink(wIdx)}
                                className="text-muted-foreground hover:text-foreground text-[10px] font-semibold ms-1 px-1.5 py-0.5 rounded hover:bg-background/80 transition-colors flex items-center gap-0.5"
                                title="Dán link khác"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Sửa</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="relative flex items-center">
                                <LinkIcon className="h-3.5 w-3.5 absolute left-2.5 text-amber-600 dark:text-amber-400 pointer-events-none" />
                                <input
                                  type="text"
                                  id={`doc-link-input-dialog-w${wIdx}`}
                                  value={week.docLink || ''}
                                  onChange={(e) => handleUpdateWeek(wIdx, {
                                    docLink: e.target.value,
                                    thumbnailUrl: e.target.value.match(/\.(jpeg|jpg|gif|png|webp)/i) ? e.target.value : (week.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop')
                                  })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && week.docLink) {
                                      setEditingLinkMap((prev) => ({ ...prev, [wIdx]: false }))
                                    }
                                  }}
                                  placeholder="Dán link tài liệu Drive / Website tại đây..."
                                  className="text-[11px] pl-8 pr-2.5 py-1 w-56 sm:w-72 md:w-80 rounded-lg border border-amber-400/40 bg-background focus:border-primary focus:outline-none font-mono shadow-2xs"
                                />
                              </div>
                              {week.docLink && (
                                <button
                                  type="button"
                                  onClick={() => setEditingLinkMap((prev) => ({ ...prev, [wIdx]: false }))}
                                  className="text-xs font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                  Xong
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* SAME ROW: Large Image Box with Hover Actions + Textarea */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                          {/* Large Image Box with Hover Upload/Paste Link Overlay */}
                          <div className="relative h-24 sm:h-28 w-full sm:w-32 md:w-36 rounded-xl overflow-hidden border border-amber-400/40 bg-background shrink-0 shadow-2xs group cursor-pointer">
                            {week.thumbnailUrl ? (
                              <img src={week.thumbnailUrl} alt={`Ảnh Tuần ${week.weekNum}`} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center text-amber-600 bg-amber-50 dark:bg-amber-950/20">
                                <FileText className="h-6 w-6 mb-1" />
                                <span className="text-[10px] font-bold">Thêm ảnh / link</span>
                              </div>
                            )}

                            {/* Hover Actions Mask */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5 text-white">
                              <label className="flex items-center gap-1 text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md cursor-pointer transition-colors w-full justify-center">
                                <Upload className="h-3 w-3" />
                                <span>Upload ảnh</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadImageFile(wIdx, e)}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleStartEditingLink(wIdx)}
                                className="flex items-center gap-1 text-[10px] font-bold bg-primary/80 hover:bg-primary px-2 py-1 rounded-md cursor-pointer transition-colors w-full justify-center"
                              >
                                <LinkIcon className="h-3 w-3" />
                                <span>Dán Link</span>
                              </button>
                            </div>
                          </div>

                          {/* Description Textarea taking remaining width on the SAME ROW */}
                          <div className="flex-1">
                            <textarea
                              rows={4}
                              value={week.content}
                              onChange={(e) => handleUpdateWeek(wIdx, { content: e.target.value })}
                              placeholder={`Nhập nội dung ôn tập Tuần ${week.weekNum}...`}
                              className="w-full h-full min-h-[96px] text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar - Status & Action Buttons */}
          <div className="px-6 py-2.5 border-t bg-muted/10 flex items-center justify-between shrink-0">
            {/* Bottom Left Status & Landing Page Link */}
            <div className="flex items-center gap-3 text-xs">
              {isCreated ? (
                <>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Đã lưu • Đã gửi phụ huynh</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpenLanding(true)}
                    className="flex items-center gap-1 text-primary hover:underline font-bold text-xs cursor-pointer ms-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Xem Landing Page Báo Cáo</span>
                  </button>
                </>
              ) : (
                <span className="text-muted-foreground italic text-xs">Chưa lưu báo cáo tháng</span>
              )}
            </div>

            <div className="flex items-center gap-3 me-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs font-semibold px-4 rounded-lg"
              >
                Đóng
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="text-xs font-bold px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
              >
                LƯU BÁO CÁO CHUYÊN SÂU
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Parent Landing Page Preview Dialog */}
      <StudentMonthlyReportLandingDialog
        open={isOpenLanding}
        onOpenChange={setIsOpenLanding}
        student={selectedStudent}
        monthTitle={`BÁO CÁO HỌC TẬP CHUYÊN SÂU ${activeMonthConfig.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${activeMonthConfig.next.toUpperCase()}`}
        dateStr={activeMonthConfig.dateStr}
        awardBadge={currentForm.awardBadge}
        teacherName={currentForm.teacherName}
        sectionAContent={currentForm.sectionAContent}
        sectionA1Content={currentForm.sectionA1Content}
        sectionA2Content={currentForm.sectionA2Content}
        sectionB1Content={currentForm.sectionB1Content}
        sectionB2Content={currentForm.sectionB2Content}
        sectionB2Weeks={currentWeeks}
      />
    </>
  )
}
