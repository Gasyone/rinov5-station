'use client'

import React, { useState } from 'react'
import { Award } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  type SemesterStudentEval,
  DEFAULT_EVAL,
} from '../classes/detail/classesSemesterEvaluationHelpers'

function CustomRadio({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 text-left text-xs transition-all cursor-pointer font-medium hover:text-foreground/80 select-none animate-fade-in"
    >
      <span className={cn(
        "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-2xs bg-background",
        checked ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-300 dark:border-zinc-600"
      )}>
        {checked && <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
      </span>
      <span className={cn(checked ? "text-foreground font-bold" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  )
}

function SectionHeader({
  title,
  ratingValue,
  onRatingChange,
}: {
  title: string
  ratingValue: number
  onRatingChange: (val: number) => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#e0f2fe]/60 dark:bg-sky-950/20 rounded-lg shrink-0">
      <span className="text-xs font-bold text-sky-950 dark:text-sky-400 uppercase tracking-wide">{title}</span>
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onRatingChange(val)}
            className="flex items-center gap-1.5 text-xs text-sky-955 dark:text-sky-400 cursor-pointer select-none font-bold"
          >
            <span className={cn(
              "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 bg-background transition-all",
              ratingValue === val ? "border-sky-950 dark:border-sky-400" : "border-zinc-300 dark:border-zinc-600"
            )}>
              {ratingValue === val && <div className="h-2 w-2 rounded-full bg-sky-955 dark:bg-sky-400" />}
            </span>
            <span>{val}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface SemesterEvaluationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName: string
  studentId: string
  month: string
  initialData?: {
    attitude: number
    knowledge: number
    skills: number
    interaction: number
  }
  onUpdate?: (data: {
    attitude: number
    knowledge: number
    skills: number
    interaction: number
  }) => void
}

export function SemesterEvaluationDialog({
  open,
  onOpenChange,
  studentName,
  studentId,
  month,
  initialData,
  onUpdate,
}: SemesterEvaluationDialogProps) {
  // Initialize state based on initialData if provided, otherwise default
  const [evaluation, setEvaluation] = useState<SemesterStudentEval>(() => {
    const base = { ...DEFAULT_EVAL }
    if (initialData) {
      base.conductRating = initialData.attitude
      base.knowledgeRating = initialData.knowledge
      base.skillsRating = initialData.skills
      base.interactionRating = initialData.interaction
    }
    return base
  })



  const handleUpdateField = <K extends keyof SemesterStudentEval>(field: K, value: SemesterStudentEval[K]) => {
    setEvaluation((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdate = () => {
    onUpdate?.({
      attitude: evaluation.conductRating,
      knowledge: evaluation.knowledgeRating,
      skills: evaluation.skillsRating,
      interaction: evaluation.interactionRating,
    })
    toast.success(`Đã cập nhật đánh giá cuối kỳ ${month} cho học viên ${studentName}!`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[900px] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-background border rounded-2xl shadow-2xl">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b shrink-0 flex flex-row items-center justify-between gap-4 bg-background select-none">
          <div className="flex items-center gap-2 min-w-0">
            <Award className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Semester Evaluation / Đánh giá cuối kỳ &mdash; {studentName} ({studentId})
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">Thời gian đánh giá: {month}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-950 scrollbar-thin text-left">
          <div className="space-y-6 max-w-[850px] mx-auto pb-8">
            {/* Header Banner */}
            <div className="flex items-center justify-between pb-3 shrink-0 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Nhận xét cho học viên: <span className="text-primary">{studentName}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Mã học viên: {studentId}</p>
              </div>
            </div>
          
          {/* Section 1: Ý THỨC HỌC TẬP */}
          <div className="space-y-4">
            <SectionHeader
              title="Ý thức học tập"
              ratingValue={evaluation.conductRating}
              onRatingChange={(val) => handleUpdateField('conductRating', val)}
            />

            <div className="space-y-4 pt-2 px-1.5">
              {/* Attendance options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent">
                <CustomRadio
                  checked={evaluation.conductAttendance === 'full'}
                  onChange={() => handleUpdateField('conductAttendance', 'full')}
                  label="Đi học đầy đủ"
                />
                <CustomRadio
                  checked={evaluation.conductAttendance === 'not_full'}
                  onChange={() => handleUpdateField('conductAttendance', 'not_full')}
                  label="Chưa đi học đầy đủ"
                />
              </div>

              {/* Punctuality options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent border-t border-dashed border-border/60 pt-3">
                <CustomRadio
                  checked={evaluation.conductPunctual === 'on_time'}
                  onChange={() => handleUpdateField('conductPunctual', 'on_time')}
                  label="Đi học đúng giờ"
                />
                <CustomRadio
                  checked={evaluation.conductPunctual === 'late'}
                  onChange={() => handleUpdateField('conductPunctual', 'late')}
                  label="Vẫn còn đi học muộn"
                />
              </div>

              {/* Homework options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent border-t border-dashed border-border/60 pt-3">
                <CustomRadio
                  checked={evaluation.conductHw === 'done'}
                  onChange={() => handleUpdateField('conductHw', 'done')}
                  label="Hoàn thành đầy đủ BTVN"
                />
                <CustomRadio
                  checked={evaluation.conductHw === 'not_done'}
                  onChange={() => handleUpdateField('conductHw', 'not_done')}
                  label="Chưa hoàn thành đầy đủ BTVN"
                />
              </div>

              {/* Focus options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent border-t border-dashed border-border/60 pt-3">
                <CustomRadio
                  checked={evaluation.conductFocus === 'focus'}
                  onChange={() => handleUpdateField('conductFocus', 'focus')}
                  label="Tập trung trong lớp học"
                />
                <CustomRadio
                  checked={evaluation.conductFocus === 'distracted'}
                  onChange={() => handleUpdateField('conductFocus', 'distracted')}
                  label="Có lúc chưa tập trung trong lớp học"
                />
              </div>

              {/* Active options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent border-t border-dashed border-border/60 pt-3">
                <CustomRadio
                  checked={evaluation.conductActive === 'active'}
                  onChange={() => handleUpdateField('conductActive', 'active')}
                  label="Sôi nổi, hào hứng trong buổi học"
                />
                <CustomRadio
                  checked={evaluation.conductActive === 'passive'}
                  onChange={() => handleUpdateField('conductActive', 'passive')}
                  label="Cần được động viên, khích lệ thường xuyên"
                />
              </div>
            </div>
          </div>

          {/* Section 2: KIẾN THỨC */}
          <div className="space-y-4 pt-2">
            <SectionHeader
              title="Kiến thức"
              ratingValue={evaluation.knowledgeRating}
              onRatingChange={(val) => handleUpdateField('knowledgeRating', val)}
            />

            <div className="space-y-4 pt-2 px-1.5">
              {/* Vốn từ vựng Title & Radios */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-foreground">Vốn từ vựng</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1">
                  <CustomRadio
                    checked={evaluation.vocabLevel === 'rich'}
                    onChange={() => handleUpdateField('vocabLevel', 'rich')}
                    label="Vốn từ vựng phong phú"
                  />
                  <CustomRadio
                    checked={evaluation.vocabLevel === 'basic'}
                    onChange={() => handleUpdateField('vocabLevel', 'basic')}
                    label="Vốn từ vựng cơ bản"
                  />
                  <CustomRadio
                    checked={evaluation.vocabLevel === 'needs_improvement'}
                    onChange={() => handleUpdateField('vocabLevel', 'needs_improvement')}
                    label="Cần trau dồi vốn từ vựng"
                  />
                </div>
              </div>

              {/* Vocabulary Textareas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Các chủ điểm từ vựng con nhớ và sử dụng linh hoạt</span>
                  <Textarea
                    value={evaluation.vocabLearned}
                    onChange={(e) => handleUpdateField('vocabLearned', e.target.value)}
                    placeholder="Điền các chủ điểm từ vựng phân cách bởi dấu chấm phẩy ;"
                    className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs py-2 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Các chủ điểm từ vựng con chưa ghi nhớ</span>
                  <Textarea
                    value={evaluation.vocabNotLearned}
                    onChange={(e) => handleUpdateField('vocabNotLearned', e.target.value)}
                    placeholder="Các chủ điểm từ vựng HS chưa ghi nhớ"
                    className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs py-2 resize-none"
                  />
                </div>
              </div>

              {/* Vốn ngữ pháp Title & Radios */}
              <div className="space-y-2 pt-2 border-t border-dashed border-border/60">
                <span className="block text-xs font-bold text-foreground">Vốn ngữ pháp</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1">
                  <CustomRadio
                    checked={evaluation.grammarLevel === 'proficient'}
                    onChange={() => handleUpdateField('grammarLevel', 'proficient')}
                    label="Sử dụng các cấu trúc ngữ pháp thành thạo"
                  />
                  <CustomRadio
                    checked={evaluation.grammarLevel === 'basic'}
                    onChange={() => handleUpdateField('grammarLevel', 'basic')}
                    label="Sử dụng các cấu trúc ngữ pháp cơ bản"
                  />
                  <CustomRadio
                    checked={evaluation.grammarLevel === 'needs_improvement'}
                    onChange={() => handleUpdateField('grammarLevel', 'needs_improvement')}
                    label="Cần trau dồi các cấu trúc ngữ pháp"
                  />
                </div>
              </div>

              {/* Grammar Textareas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Các cấu trúc ngữ pháp con đã thành thạo</span>
                  <Textarea
                    value={evaluation.grammarLearned}
                    onChange={(e) => handleUpdateField('grammarLearned', e.target.value)}
                    placeholder="Các cấu trúc cách nhau bởi ;"
                    className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs py-2 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Các cấu trúc ngữ pháp con chưa thành thạo</span>
                  <Textarea
                    value={evaluation.grammarNotLearned}
                    onChange={(e) => handleUpdateField('grammarNotLearned', e.target.value)}
                    placeholder="Các cấu trúc cách nhau bởi ;"
                    className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs py-2 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: KỸ NĂNG */}
          <div className="space-y-4 pt-2">
            <SectionHeader
              title="Kỹ năng"
              ratingValue={evaluation.skillsRating}
              onRatingChange={(val) => handleUpdateField('skillsRating', val)}
            />

            <div className="space-y-4 pt-2 px-1.5">
              {/* Kỹ năng nghe */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-foreground">Kỹ năng nghe</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                  <CustomRadio
                    checked={evaluation.listeningReaction === 'good'}
                    onChange={() => handleUpdateField('listeningReaction', 'good')}
                    label="Nghe hiểu và phản xạ tốt đối với các yêu cầu của thầy cô"
                  />
                  <CustomRadio
                    checked={evaluation.listeningReaction === 'slow'}
                    onChange={() => handleUpdateField('listeningReaction', 'slow')}
                    label="Con phản xạ còn chậm trước các yêu cầu của thầy cô"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.listeningPractice === 'proficient'}
                    onChange={() => handleUpdateField('listeningPractice', 'proficient')}
                    label="Thực hành thành thạo các dạng bài nghe"
                  />
                  <CustomRadio
                    checked={evaluation.listeningPractice === 'needs_practice'}
                    onChange={() => handleUpdateField('listeningPractice', 'needs_practice')}
                    label="Cần rèn luyện thêm các dạng bài nghe khác nhau để cải thiện kỹ năng nghe"
                  />
                </div>
              </div>

              {/* Kỹ năng nói */}
              <div className="space-y-3 pt-3 border-t border-dashed border-border/60">
                <span className="block text-xs font-bold text-foreground">Kỹ năng nói</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                  <CustomRadio
                    checked={evaluation.speakingVolume === 'loud'}
                    onChange={() => handleUpdateField('speakingVolume', 'loud')}
                    label="Con có giọng nói to, rõ ràng"
                  />
                  <CustomRadio
                    checked={evaluation.speakingVolume === 'soft'}
                    onChange={() => handleUpdateField('speakingVolume', 'soft')}
                    label="Giọng nói đôi khi nhỏ và không rõ ràng"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.speakingPronunciation === 'correct'}
                    onChange={() => handleUpdateField('speakingPronunciation', 'correct')}
                    label="Phát âm đúng, đặc biệt là các âm cuối"
                  />
                  <CustomRadio
                    checked={evaluation.speakingPronunciation === 'incorrect'}
                    onChange={() => handleUpdateField('speakingPronunciation', 'incorrect')}
                    label="Phát âm chưa hoàn toàn chính xác, đặc biệt là các âm cuối"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.speakingFluency === 'fluent'}
                    onChange={() => handleUpdateField('speakingFluency', 'fluent')}
                    label="Có khả năng nói trôi chảy, lưu loát"
                  />
                  <CustomRadio
                    checked={evaluation.speakingFluency === 'hesitant'}
                    onChange={() => handleUpdateField('speakingFluency', 'hesitant')}
                    label="Cần chú ý ngữ điệu nói, thỉnh thoảng còn nói ngập ngừng, chưa lưu loát"
                  />
                </div>
              </div>

              {/* Kỹ năng đọc */}
              <div className="space-y-3 pt-3 border-t border-dashed border-border/60">
                <span className="block text-xs font-bold text-foreground">Kỹ năng đọc</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                  <CustomRadio
                    checked={evaluation.readingComprehension === 'good'}
                    onChange={() => handleUpdateField('readingComprehension', 'good')}
                    label="Đọc hiểu tốt và làm đúng yêu cầu đề bài"
                  />
                  <CustomRadio
                    checked={evaluation.readingComprehension === 'needs_improvement'}
                    onChange={() => handleUpdateField('readingComprehension', 'needs_improvement')}
                    label="Cần nắm vững toàn bộ yêu cầu đề bài để hiểu và trả lời đúng"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.readingDetail === 'good'}
                    onChange={() => handleUpdateField('readingDetail', 'good')}
                    label="Hiểu được nội dung chính và chi tiết quan trọng của bài đọc"
                  />
                  <CustomRadio
                    checked={evaluation.readingDetail === 'poor'}
                    onChange={() => handleUpdateField('readingDetail', 'poor')}
                    label="Chưa hiểu được nội dung chính và chi tiết quan trọng trong bài đọc"
                  />
                </div>
              </div>

              {/* Kỹ năng viết */}
              <div className="space-y-3 pt-3 border-t border-dashed border-border/60">
                <span className="block text-xs font-bold text-foreground">Kỹ năng viết</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                  <CustomRadio
                    checked={evaluation.writingSpelling === 'correct'}
                    onChange={() => handleUpdateField('writingSpelling', 'correct')}
                    label="Viết đúng chính tả"
                  />
                  <CustomRadio
                    checked={evaluation.writingSpelling === 'incorrect'}
                    onChange={() => handleUpdateField('writingSpelling', 'incorrect')}
                    label="Đôi khi viết sai chính tả"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.writingVocab === 'rich'}
                    onChange={() => handleUpdateField('writingVocab', 'rich')}
                    label="Sử dụng từ vựng phong phú"
                  />
                  <CustomRadio
                    checked={evaluation.writingVocab === 'limited'}
                    onChange={() => handleUpdateField('writingVocab', 'limited')}
                    label="Từ vựng sử dụng chưa đa dạng"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.writingExpression === 'clear'}
                    onChange={() => handleUpdateField('writingExpression', 'clear')}
                    label="Diễn đạt ý tưởng rõ ràng và mạch lạc"
                  />
                  <CustomRadio
                    checked={evaluation.writingExpression === 'unclear'}
                    onChange={() => handleUpdateField('writingExpression', 'unclear')}
                    label="Diễn đạt ý tưởng chưa rõ ràng và mạch lạc"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/40 pt-2">
                  <CustomRadio
                    checked={evaluation.writingGrammar === 'correct'}
                    onChange={() => handleUpdateField('writingGrammar', 'correct')}
                    label="Viết đúng ngữ pháp và cấu trúc câu"
                  />
                  <CustomRadio
                    checked={evaluation.writingGrammar === 'incorrect'}
                    onChange={() => handleUpdateField('writingGrammar', 'incorrect')}
                    label="Còn mắc lỗi viết chưa đúng ngữ pháp và cấu trúc câu"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: TƯƠNG TÁC */}
          <div className="space-y-4 pt-2 pb-6">
            <SectionHeader
              title="Tương tác"
              ratingValue={evaluation.interactionRating}
              onRatingChange={(val) => handleUpdateField('interactionRating', val)}
            />

            <div className="space-y-4 pt-2 px-1.5">
              {/* Hoạt động lớp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                <CustomRadio
                  checked={evaluation.interClassActivity === 'active'}
                  onChange={() => handleUpdateField('interClassActivity', 'active')}
                  label="Tích cực tham gia các hoạt động"
                />
                <CustomRadio
                  checked={evaluation.interClassActivity === 'inactive'}
                  onChange={() => handleUpdateField('interClassActivity', 'inactive')}
                  label="Ít tham gia các hoạt động"
                />
              </div>

              {/* Chăm chú nghe giảng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/60 pt-3">
                <CustomRadio
                  checked={evaluation.interFocus === 'attentive'}
                  onChange={() => handleUpdateField('interFocus', 'attentive')}
                  label="Chăm chú nghe giảng"
                />
                <CustomRadio
                  checked={evaluation.interFocus === 'inattentive'}
                  onChange={() => handleUpdateField('interFocus', 'inattentive')}
                  label="Chưa chăm chú nghe giảng"
                />
              </div>

              {/* Phát biểu ý kiến */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 border-t border-dashed border-border/60 pt-3">
                <CustomRadio
                  checked={evaluation.interContribution === 'voluntary'}
                  onChange={() => handleUpdateField('interContribution', 'voluntary')}
                  label="Hăng hái giơ tay phát biểu"
                />
                <CustomRadio
                  checked={evaluation.interContribution === 'forced'}
                  onChange={() => handleUpdateField('interContribution', 'forced')}
                  label="Ít tương tác và chưa chủ động phát biểu"
                />
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2.5 shrink-0 bg-background select-none">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUpdate}
            className="text-xs h-9 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer"
          >
            Cập nhật
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
