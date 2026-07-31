'use client'

import { useState } from 'react'
import { X, Loader2, ExternalLink, Sparkles, Link as LinkIcon, FileText, Pencil, Upload } from 'lucide-react'
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
import { StudentMonthlyReportLandingDialog } from './StudentMonthlyReportLandingDialog'
import {
  MOCK_LESSONS_REVIEW,
  getReviewContentForRange,
  getAiSynthesizedNextMonthPlan,
  getDirectLessonPlanForRange,
  WeekReviewItem,
  DEFAULT_SECTION_B2_WEEKS,
} from './monthlyReportHelpers'

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
  const [awardBadge, setAwardBadge] = useState('CHIẾN BINH BỨT PHÁ')
  const [teacherName, setTeacherName] = useState('Ms.Chloe')
  const [sectionA1Content, setSectionA1Content] = useState(DEFAULT_SECTION_A1_TEXT)
  const [sectionA2Content, setSectionA2Content] = useState(DEFAULT_SECTION_A2_TEXT)
  const [sectionB1Content, setSectionB1Content] = useState(DEFAULT_SECTION_B1_TEXT)
  const [sectionB2StartLesson, setSectionB2StartLesson] = useState(8)
  const [sectionB2EndLesson, setSectionB2EndLesson] = useState(10)
  const [sectionB2Weeks, setSectionB2Weeks] = useState<WeekReviewItem[]>(DEFAULT_SECTION_B2_WEEKS)
  const [isSynthesizingAi, setIsSynthesizingAi] = useState(false)
  const [isSaved, setIsSaved] = useState(true)
  const [isOpenLanding, setIsOpenLanding] = useState(false)

  const activeMonthConfig = MONTH_OPTIONS.find((m) => m.value === selectedMonthKey) || MONTH_OPTIONS[0]

  const handleUpdateWeek = (wIdx: number, fields: Partial<WeekReviewItem>) => {
    const updated = [...sectionB2Weeks]
    updated[wIdx] = { ...updated[wIdx], ...fields }
    setSectionB2Weeks(updated)
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
      const inputEl = document.getElementById(`doc-link-input-overlay-w${wIdx}`) as HTMLInputElement | null
      if (inputEl) {
        inputEl.focus()
        inputEl.select()
      }
    }, 50)
  }

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
    toast.success(`Đã lưu Báo cáo Chuyên sâu ${activeMonthConfig.current} cho học viên ${student.name}`)
  }

  return (
    <>
      <aside className="flex min-h-0 flex-col overflow-hidden w-full h-full bg-background relative z-10 animate-in fade-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-border/60 pb-2.5 pt-1 mb-2 pr-1">
          <div className="min-w-0">
            <h3 className="text-xs md:text-sm font-extrabold text-foreground truncate">
              BÁO CÁO CHUYÊN SÂU & KẾ HOẠCH HỌC TẬP
            </h3>
            <p className="text-[11px] text-muted-foreground truncate">{student.name} ({student.code})</p>
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
            <Select value={selectedMonthKey} onValueChange={setSelectedMonthKey}>
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
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-2 text-xs text-muted-foreground italic">
            <Pencil className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 not-italic stroke-[2.5] mt-0.5" />
            <span>
              Rino Edu xin chúc mừng con <strong className="text-primary font-bold not-italic">{student.name}</strong> đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết và định hướng bứt phá từ giáo viên phụ trách{' '}
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Tên Giáo viên"
                className="inline-block w-24 text-center text-xs font-bold text-primary border-b border-primary/40 bg-transparent focus:outline-none not-italic"
              />.
            </span>
          </div>

          {/* Award Badge */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Danh hiệu tuyên dương:</label>
            <Select value={awardBadge} onValueChange={setAwardBadge}>
              <SelectTrigger className="h-8 text-xs font-black bg-amber-400 text-amber-950 border-amber-500 rounded-lg">
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
          </div>

          {/* Section A (Tách 2 phần A1 & A2) */}
          <div className="space-y-3 pt-1 border-t">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wide">
              A - BÁO CÁO HỌC TẬP CHUYÊN SÂU {activeMonthConfig.current.toUpperCase()}
            </h4>

            {/* Sub-section A1: 1. Nhận xét chung */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                1. Nhận xét chung
              </label>
              <textarea
                rows={5}
                value={sectionA1Content}
                onChange={(e) => setSectionA1Content(e.target.value)}
                placeholder="Nhập 'Điểm nổi bật: ...' và 'Điểm cần lưu ý: ...'"
                className="w-full text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                2. Nhận xét về kết quả học tập
              </label>
              <textarea
                rows={4}
                value={sectionA2Content}
                onChange={(e) => setSectionA2Content(e.target.value)}
                placeholder="Nhập 'Từ vựng & Phonics: ...' và 'Cấu trúc & Mẫu câu: ...'"
                className="w-full text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Section B */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wide">
              B - KẾ HOẠCH HỌC TẬP CẢI THIỆN {activeMonthConfig.next.toUpperCase()}
            </h4>

            {/* Sub-section 1: Nội dung bài học tháng tới (Ô 01) */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                  1. Nội dung bài học tháng tới
                </label>

                {/* Step 1 & Step 2 Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-muted-foreground">Bài:</span>
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
                    className="h-7 text-[11px] font-bold px-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md gap-1"
                    title="Tự động biên tập nội dung ngôn ngữ tự nhiên"
                  >
                    {isSynthesizingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />}
                    <span>AI Tổng hợp</span>
                  </Button>
                </div>
              </div>

              <textarea
                rows={6}
                value={sectionB1Content}
                onChange={(e) => setSectionB1Content(e.target.value)}
                placeholder="Nhập hoặc bấm 'Cập nhật' / 'AI Tổng hợp' để biên tập nội dung..."
                className="w-full text-xs p-3 rounded-xl border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Sub-section 2: Nội dung ôn tập riêng (ẢNH & TEXT CÙNG HÀNG, HOVER ĐỂ UPLOAD / PASTE LINK) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
                  2. Nội dung ôn tập riêng
                </label>
              </div>

              <div className="space-y-3">
                {sectionB2Weeks.map((week, wIdx) => (
                  <div key={week.weekNum} className="p-3 rounded-xl border border-amber-400/30 bg-amber-500/5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wide">
                        Tuần {week.weekNum}
                      </span>

                      {/* Display Mode vs Edit Mode for Link */}
                      {week.docLink && !editingLinkMap[wIdx] ? (
                        <div className="flex items-center gap-1 bg-primary/10 hover:bg-primary/15 text-primary px-2.5 py-0.5 rounded-lg border border-primary/20 transition-all max-w-[220px]">
                          <a
                            href={week.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold hover:underline inline-flex items-center gap-1 min-w-0 truncate"
                            title={week.docLink}
                          >
                            <LinkIcon className="h-3 w-3 shrink-0 text-primary" />
                            <span className="truncate">
                              {week.docLink.includes('drive.google.com') ? 'Tài liệu Google Drive' : week.docLink}
                            </span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleStartEditingLink(wIdx)}
                            className="text-muted-foreground hover:text-foreground text-[9px] font-semibold ms-1 px-1 py-0.2 rounded hover:bg-background/80 transition-colors flex items-center gap-0.5 shrink-0"
                            title="Dán link khác"
                          >
                            <Pencil className="h-2.5 w-2.5" />
                            <span>Sửa</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="relative flex items-center min-w-0 flex-1">
                            <LinkIcon className="h-3 w-3 absolute left-2 text-amber-600 dark:text-amber-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`doc-link-input-overlay-w${wIdx}`}
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
                              placeholder="Dán link tài liệu Drive..."
                              className="text-[11px] pl-7 pr-2 py-0.5 w-full rounded-lg border border-amber-400/40 bg-background focus:border-primary focus:outline-none font-mono"
                            />
                          </div>
                          {week.docLink && (
                            <button
                              type="button"
                              onClick={() => setEditingLinkMap((prev) => ({ ...prev, [wIdx]: false }))}
                              className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-md hover:bg-primary/90 transition-colors shrink-0"
                            >
                              Xong
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SAME ROW: Image box (hover upload/paste) + Textarea */}
                    <div className="flex items-start gap-2.5">
                      <div className="relative h-20 w-24 rounded-lg overflow-hidden border border-amber-400/30 bg-background shrink-0 group cursor-pointer">
                        {week.thumbnailUrl ? (
                          <img src={week.thumbnailUrl} alt={`Thumb ${week.weekNum}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-amber-600 bg-amber-50 dark:bg-amber-950/20">
                            <FileText className="h-5 w-5 mb-0.5" />
                            <span className="text-[9px] font-bold">Thêm ảnh</span>
                          </div>
                        )}

                        {/* Hover Mask */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1 text-white">
                          <label className="flex items-center gap-1 text-[9px] font-bold bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded cursor-pointer w-full justify-center">
                            <Upload className="h-2.5 w-2.5" />
                            <span>Upload</span>
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
                            className="flex items-center gap-1 text-[9px] font-bold bg-primary/80 hover:bg-primary px-1.5 py-0.5 rounded cursor-pointer w-full justify-center"
                          >
                            <LinkIcon className="h-2.5 w-2.5" />
                            <span>Dán Link</span>
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={week.content}
                        onChange={(e) => handleUpdateWeek(wIdx, { content: e.target.value })}
                        placeholder={`Nội dung ôn tập Tuần ${week.weekNum}...`}
                        className="flex-1 text-xs p-2.5 rounded-lg border border-border/80 bg-background focus:border-primary focus:outline-none leading-relaxed font-sans min-w-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Bottom Footer */}
        <div className="pt-2.5 border-t mt-2 shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            {isSaved ? (
              <button
                type="button"
                onClick={() => setIsOpenLanding(true)}
                className="flex items-center gap-1 text-primary hover:underline font-bold text-xs cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Xem Landing Page</span>
              </button>
            ) : null}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs font-bold px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs"
          >
            LƯU BÁO CÁO
          </Button>
        </div>
      </aside>

      {/* Landing Page Preview Modal */}
      <StudentMonthlyReportLandingDialog
        open={isOpenLanding}
        onOpenChange={setIsOpenLanding}
        student={student}
        monthTitle={`BÁO CÁO HỌC TẬP CHUYÊN SÂU ${activeMonthConfig.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${activeMonthConfig.next.toUpperCase()}`}
        dateStr={activeMonthConfig.dateStr}
        awardBadge={awardBadge}
        teacherName={teacherName}
        sectionAContent={`${sectionA1Content}\n\n${sectionA2Content}`}
        sectionA1Content={sectionA1Content}
        sectionA2Content={sectionA2Content}
        sectionB1Content={sectionB1Content}
        sectionB2Weeks={sectionB2Weeks}
      />
    </>
  )
}
