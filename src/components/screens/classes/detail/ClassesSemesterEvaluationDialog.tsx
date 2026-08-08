'use client'

import React, { useState, useMemo } from 'react'
import { Check, CheckCircle2, Table, PenSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { RosterStudent } from './classesDetailTypes'
import { getInitials } from './classesSessionDetailHelpers'
import { getStudentNameParts } from './classesDetailHelpers'
import { ClassesSemesterEvaluationTable } from './ClassesSemesterEvaluationTable'
import {
  type SemesterStudentEval,
  EMPTY_EVAL,
} from './classesSemesterEvaluationHelpers'

export type { SemesterStudentEval } from './classesSemesterEvaluationHelpers'

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

interface ClassesSemesterEvaluationDialogProps {
  isOpen: boolean
  onClose: () => void
  students: RosterStudent[]
  fullRoster?: RosterStudent[]
  evalMap: Record<string, SemesterStudentEval>
  onSaveEval: (studentId: string, evaluation: SemesterStudentEval) => void
  sessionTopic?: string
}

export function ClassesSemesterEvaluationDialog({
  isOpen,
  onClose,
  students,
  fullRoster = [],
  evalMap,
  onSaveEval,
  sessionTopic = 'Semester Evaluation',
}: ClassesSemesterEvaluationDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null)
  const [viewMode, setViewMode] = useState<'table' | 'form'>('table')
  const [viewAllAttended, setViewAllAttended] = useState(false)


  const displayedStudents = useMemo(() => {
    if (viewAllAttended && fullRoster && fullRoster.length > 0) {
      return fullRoster
    }
    return students
  }, [viewAllAttended, students, fullRoster])

  const selectedStudent = useMemo(() => {
    return displayedStudents.find((s) => s.id === selectedStudentId) || null
  }, [displayedStudents, selectedStudentId])

  const currentEval = useMemo(() => {
    if (!selectedStudentId) return EMPTY_EVAL
    return evalMap[selectedStudentId] || EMPTY_EVAL
  }, [selectedStudentId, evalMap])

  const handleUpdateField = <K extends keyof SemesterStudentEval>(field: K, value: SemesterStudentEval[K]) => {
    if (!selectedStudentId) return
    onSaveEval(selectedStudentId, {
      ...currentEval,
      [field]: value,
    })
  }

  const handleUpdate = () => {
    if (!selectedStudentId || !selectedStudent) return
    onSaveEval(selectedStudentId, {
      ...currentEval,
      isSubmitted: true,
    })
    toast.success(`Đã cập nhật đánh giá cuối kỳ cho ${selectedStudent.name}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[900px] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-background border rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b shrink-0 flex flex-row items-center justify-between gap-4 bg-background">
          <div>
            <DialogTitle className="text-base font-bold text-foreground">
              Semester Evaluation / Đánh giá cuối kỳ
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Buổi kiểm tra: {sessionTopic}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 pr-10">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  "h-8 px-3 text-xs font-bold gap-1 rounded-lg transition-all",
                  viewMode === 'table'
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Table className="h-3.5 w-3.5" />
                Table
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('form')}
                className={cn(
                  "h-8 px-3 text-xs font-bold gap-1 rounded-lg transition-all",
                  viewMode === 'form'
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <PenSquare className="h-3.5 w-3.5" />
                Form
              </Button>
            </div>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={viewAllAttended}
                onChange={(e) => setViewAllAttended(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-zinc-900"
              />
              <span>View all students attended the class before</span>
            </label>
          </div>
        </DialogHeader>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {viewMode === 'table' ? (
            <ClassesSemesterEvaluationTable
              displayedStudents={displayedStudents}
              evalMap={evalMap}
              onEditStudent={(id) => {
                setSelectedStudentId(id)
                setViewMode('form')
              }}
            />
          ) : (
            <>
              {/* Left Student List Sidebar */}
              <aside className="w-[280px] border-r dark:border-zinc-800 flex flex-col shrink-0 bg-zinc-50/50 dark:bg-zinc-950/20">
                <div className="p-3 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Học sinh ({displayedStudents.length})
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-white dark:bg-zinc-950">
                  {displayedStudents.map((student) => {
                    const isSelected = student.id === selectedStudentId
                    const isSaved = evalMap[student.id]?.isSubmitted
                    const initials = getInitials(student.name)

                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer group",
                          isSelected
                            ? "bg-primary/10 text-primary border-primary/20 font-bold"
                            : "hover:bg-muted/80 text-foreground border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn(
                            "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border",
                            isSelected
                              ? "bg-primary/20 border-primary/20 text-primary"
                              : "bg-muted border-transparent text-muted-foreground group-hover:bg-background"
                          )}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            {(() => {
                              const np = getStudentNameParts(student)
                              if (np.hasEnglishName) {
                                return (
                                  <div className="flex flex-col min-w-0 leading-tight">
                                    <span className="truncate font-bold text-xs">{np.englishName}</span>
                                    <span className="truncate text-[11px] text-muted-foreground font-normal">{np.vietnameseName}</span>
                                  </div>
                                )
                              }
                              return <p className="truncate font-semibold leading-tight">{np.vietnameseName}</p>
                            })()}
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{student.code}</p>
                          </div>
                        </div>
                        {isSaved && (
                          <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-400">
                            <Check className="h-3 w-3 stroke-[3px]" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </aside>

              {/* Right panel: Evaluation form */}
              <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-950 min-w-0 space-y-6">
                {selectedStudent ? (
                  <div className="space-y-6 max-w-[850px] mx-auto pb-8">
                    {/* Header Banner */}
                    <div className="flex items-center justify-between pb-3 shrink-0">
                      <div>
                        <h3 className="text-base font-bold text-foreground">
                          Nhận xét cho học viên: <span className="text-primary">{selectedStudent.name}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Mã học viên: {selectedStudent.code}</p>
                      </div>
                      {currentEval.isSubmitted && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                          <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
                          Đã hoàn thành đánh giá
                        </span>
                      )}
                    </div>

                    {/* Section 1: Ý THỨC HỌC TẬP */}
                    <div className="space-y-4">
                      <SectionHeader
                        title="Ý thức học tập"
                        ratingValue={currentEval.conductRating}
                        onRatingChange={(val) => handleUpdateField('conductRating', val)}
                      />

                      <div className="space-y-4 pt-2">
                        {/* Attendance options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductAttendance === 'full'}
                            onChange={() => handleUpdateField('conductAttendance', 'full')}
                            label="Đi học đầy đủ"
                          />
                          <CustomRadio
                            checked={currentEval.conductAttendance === 'not_full'}
                            onChange={() => handleUpdateField('conductAttendance', 'not_full')}
                            label="Chưa đi học đầy đủ"
                          />
                        </div>

                        {/* Punctuality options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductPunctual === 'on_time'}
                            onChange={() => handleUpdateField('conductPunctual', 'on_time')}
                            label="Đi học đúng giờ"
                          />
                          <CustomRadio
                            checked={currentEval.conductPunctual === 'late'}
                            onChange={() => handleUpdateField('conductPunctual', 'late')}
                            label="Vẫn còn đi học muộn"
                          />
                        </div>

                        {/* Homework options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductHw === 'done'}
                            onChange={() => handleUpdateField('conductHw', 'done')}
                            label="Hoàn thành đầy đủ BTVN"
                          />
                          <CustomRadio
                            checked={currentEval.conductHw === 'not_done'}
                            onChange={() => handleUpdateField('conductHw', 'not_done')}
                            label="Chưa hoàn thành đầy đủ BTVN"
                          />
                        </div>

                        {/* Focus options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductFocus === 'focus'}
                            onChange={() => handleUpdateField('conductFocus', 'focus')}
                            label="Tập trung trong lớp học"
                          />
                          <CustomRadio
                            checked={currentEval.conductFocus === 'distracted'}
                            onChange={() => handleUpdateField('conductFocus', 'distracted')}
                            label="Có lúc chưa tập trung trong lớp học"
                          />
                        </div>

                        {/* Active options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductActive === 'active'}
                            onChange={() => handleUpdateField('conductActive', 'active')}
                            label="Sôi nổi, hào hứng trong buổi học"
                          />
                          <CustomRadio
                            checked={currentEval.conductActive === 'passive'}
                            onChange={() => handleUpdateField('conductActive', 'passive')}
                            label="Cần được động viên, khích lệ thường xuyên"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: KIẾN THỨC */}
                    <div className="space-y-4">
                      <SectionHeader
                        title="Kiến thức"
                        ratingValue={currentEval.knowledgeRating}
                        onRatingChange={(val) => handleUpdateField('knowledgeRating', val)}
                      />

                      <div className="space-y-4 pt-2">
                        {/* Vốn từ vựng Title & Radios */}
                        <div className="space-y-2">
                          <span className="block text-xs font-bold text-foreground">Vốn từ vựng</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.vocabLevel === 'rich'}
                              onChange={() => handleUpdateField('vocabLevel', 'rich')}
                              label="Vốn từ vựng phong phú"
                            />
                            <CustomRadio
                              checked={currentEval.vocabLevel === 'basic'}
                              onChange={() => handleUpdateField('vocabLevel', 'basic')}
                              label="Vốn từ vựng cơ bản"
                            />
                            <CustomRadio
                              checked={currentEval.vocabLevel === 'needs_improvement'}
                              onChange={() => handleUpdateField('vocabLevel', 'needs_improvement')}
                              label="Cần trau dồi vốn từ vựng"
                            />
                          </div>
                        </div>

                        {/* Vocabulary Textareas */}
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <span className="block text-xs font-bold text-foreground">Các chủ điểm từ vựng con nhớ và sử dụng linh hoạt</span>
                            <Textarea
                              value={currentEval.vocabLearned}
                              onChange={(e) => handleUpdateField('vocabLearned', e.target.value)}
                              placeholder="Điền các chủ điểm từ vựng phân cách bởi dấu chấm phẩy ;"
                              className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <span className="block text-xs font-bold text-foreground">Các chủ điểm từ vựng con chưa ghi nhớ</span>
                            <Textarea
                              value={currentEval.vocabNotLearned}
                              onChange={(e) => handleUpdateField('vocabNotLearned', e.target.value)}
                              placeholder="Các chủ điểm từ vựng HS chưa ghi nhớ"
                              className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Vốn ngữ pháp Title & Radios */}
                        <div className="space-y-2 pt-2">
                          <span className="block text-xs font-bold text-foreground">Vốn ngữ pháp</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.grammarLevel === 'proficient'}
                              onChange={() => handleUpdateField('grammarLevel', 'proficient')}
                              label="Sử dụng các cấu trúc ngữ pháp thành thạo"
                            />
                            <CustomRadio
                              checked={currentEval.grammarLevel === 'basic'}
                              onChange={() => handleUpdateField('grammarLevel', 'basic')}
                              label="Sử dụng các cấu trúc ngữ pháp cơ bản"
                            />
                            <CustomRadio
                              checked={currentEval.grammarLevel === 'needs_improvement'}
                              onChange={() => handleUpdateField('grammarLevel', 'needs_improvement')}
                              label="Cần trau dồi các cấu trúc ngữ pháp"
                            />
                          </div>
                        </div>

                        {/* Grammar Textareas */}
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <span className="block text-xs font-bold text-foreground">Các cấu trúc ngữ pháp con đã thành thạo</span>
                            <Textarea
                              value={currentEval.grammarLearned}
                              onChange={(e) => handleUpdateField('grammarLearned', e.target.value)}
                              placeholder="Các cấu trúc cách nhau bởi ;"
                              className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <span className="block text-xs font-bold text-foreground">Các cấu trúc ngữ pháp con chưa thành thạo</span>
                            <Textarea
                              value={currentEval.grammarNotLearned}
                              onChange={(e) => handleUpdateField('grammarNotLearned', e.target.value)}
                              placeholder="Các cấu trúc cách nhau bởi ;"
                              className="text-[11px] min-h-[80px] bg-background border-zinc-200 rounded-lg shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: KỸ NĂNG */}
                    <div className="space-y-4">
                      <SectionHeader
                        title="Kỹ năng"
                        ratingValue={currentEval.skillsRating}
                        onRatingChange={(val) => handleUpdateField('skillsRating', val)}
                      />

                      <div className="space-y-4 pt-2">
                        {/* Kỹ năng nghe */}
                        <div className="space-y-2">
                          <span className="block text-xs font-bold text-foreground">Kỹ năng nghe</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.listeningReaction === 'good'}
                              onChange={() => handleUpdateField('listeningReaction', 'good')}
                              label="Nghe hiểu và phản xạ tốt đối với các yêu cầu của thầy cô"
                            />
                            <CustomRadio
                              checked={currentEval.listeningReaction === 'slow'}
                              onChange={() => handleUpdateField('listeningReaction', 'slow')}
                              label="Con phản xạ còn chậm trước các yêu cầu của thầy cô"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.listeningPractice === 'proficient'}
                              onChange={() => handleUpdateField('listeningPractice', 'proficient')}
                              label="Thực hành thành thạo các dạng bài nghe"
                            />
                            <CustomRadio
                              checked={currentEval.listeningPractice === 'needs_practice'}
                              onChange={() => handleUpdateField('listeningPractice', 'needs_practice')}
                              label="Cần rèn luyện thêm các dạng bài nghe khác nhau để cải thiện kỹ năng nghe"
                            />
                          </div>
                        </div>

                        {/* Kỹ năng nói */}
                        <div className="space-y-2 pt-2">
                          <span className="block text-xs font-bold text-foreground">Kỹ năng nói</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.speakingVolume === 'loud'}
                              onChange={() => handleUpdateField('speakingVolume', 'loud')}
                              label="Con có giọng nói to, rõ ràng"
                            />
                            <CustomRadio
                              checked={currentEval.speakingVolume === 'soft'}
                              onChange={() => handleUpdateField('speakingVolume', 'soft')}
                              label="Giọng nói đôi khi nhỏ và không rõ ràng"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.speakingPronunciation === 'correct'}
                              onChange={() => handleUpdateField('speakingPronunciation', 'correct')}
                              label="Phát âm đúng, đặc biệt là các âm cuối"
                            />
                            <CustomRadio
                              checked={currentEval.speakingPronunciation === 'incorrect'}
                              onChange={() => handleUpdateField('speakingPronunciation', 'incorrect')}
                              label="Phát âm chưa hoàn toàn chính xác, đặc biệt là các âm cuối"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.speakingFluency === 'fluent'}
                              onChange={() => handleUpdateField('speakingFluency', 'fluent')}
                              label="Có khả năng nói trôi chảy, lưu loát"
                            />
                            <CustomRadio
                              checked={currentEval.speakingFluency === 'hesitant'}
                              onChange={() => handleUpdateField('speakingFluency', 'hesitant')}
                              label="Cần chú ý ngữ điệu nói, thỉnh thoảng còn nói ngập ngừng, chưa lưu loát"
                            />
                          </div>
                        </div>

                        {/* Kỹ năng đọc */}
                        <div className="space-y-2 pt-2">
                          <span className="block text-xs font-bold text-foreground">Kỹ năng đọc</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.readingComprehension === 'good'}
                              onChange={() => handleUpdateField('readingComprehension', 'good')}
                              label="Đọc hiểu tốt và làm đúng yêu cầu đề bài"
                            />
                            <CustomRadio
                              checked={currentEval.readingComprehension === 'needs_improvement'}
                              onChange={() => handleUpdateField('readingComprehension', 'needs_improvement')}
                              label="Cần nắm vững toàn bộ yêu cầu đề bài để hiểu và trả lời đúng"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.readingDetail === 'good'}
                              onChange={() => handleUpdateField('readingDetail', 'good')}
                              label="Hiểu được nội dung chính và chi tiết quan trọng của bài đọc"
                            />
                            <CustomRadio
                              checked={currentEval.readingDetail === 'poor'}
                              onChange={() => handleUpdateField('readingDetail', 'poor')}
                              label="Chưa hiểu được nội dung chính và chi tiết quan trọng trong bài đọc"
                            />
                          </div>
                        </div>

                        {/* Kỹ năng viết */}
                        <div className="space-y-2 pt-2">
                          <span className="block text-xs font-bold text-foreground">Kỹ năng viết</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.writingSpelling === 'correct'}
                              onChange={() => handleUpdateField('writingSpelling', 'correct')}
                              label="Viết đúng chính tả"
                            />
                            <CustomRadio
                              checked={currentEval.writingSpelling === 'incorrect'}
                              onChange={() => handleUpdateField('writingSpelling', 'incorrect')}
                              label="Đôi khi viết sai chính tả"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.writingVocab === 'rich'}
                              onChange={() => handleUpdateField('writingVocab', 'rich')}
                              label="Sử dụng từ vựng phong phú"
                            />
                            <CustomRadio
                              checked={currentEval.writingVocab === 'limited'}
                              onChange={() => handleUpdateField('writingVocab', 'limited')}
                              label="Từ vựng sử dụng chưa đa dạng"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.writingExpression === 'clear'}
                              onChange={() => handleUpdateField('writingExpression', 'clear')}
                              label="Diễn đạt ý tưởng rõ ràng và mạch lạc"
                            />
                            <CustomRadio
                              checked={currentEval.writingExpression === 'unclear'}
                              onChange={() => handleUpdateField('writingExpression', 'unclear')}
                              label="Diễn đạt ý tưởng chưa rõ ràng và mạch lạc"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                            <CustomRadio
                              checked={currentEval.writingGrammar === 'correct'}
                              onChange={() => handleUpdateField('writingGrammar', 'correct')}
                              label="Viết đúng ngữ pháp và cấu trúc câu"
                            />
                            <CustomRadio
                              checked={currentEval.writingGrammar === 'incorrect'}
                              onChange={() => handleUpdateField('writingGrammar', 'incorrect')}
                              label="Còn mắc lỗi viết chưa đúng ngữ pháp và cấu trúc câu"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: TƯƠNG TÁC */}
                    <div className="space-y-4">
                      <SectionHeader
                        title="Tương tác"
                        ratingValue={currentEval.interactionRating}
                        onRatingChange={(val) => handleUpdateField('interactionRating', val)}
                      />

                      <div className="space-y-4 pt-2">
                        {/* Hoạt động lớp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                          <CustomRadio
                            checked={currentEval.interClassActivity === 'active'}
                            onChange={() => handleUpdateField('interClassActivity', 'active')}
                            label="Tích cực tham gia các hoạt động"
                          />
                          <CustomRadio
                            checked={currentEval.interClassActivity === 'inactive'}
                            onChange={() => handleUpdateField('interClassActivity', 'inactive')}
                            label="Ít tham gia các hoạt động"
                          />
                        </div>

                        {/* Chăm chú nghe giảng */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                          <CustomRadio
                            checked={currentEval.interFocus === 'attentive'}
                            onChange={() => handleUpdateField('interFocus', 'attentive')}
                            label="Chăm chú nghe giảng"
                          />
                          <CustomRadio
                            checked={currentEval.interFocus === 'inattentive'}
                            onChange={() => handleUpdateField('interFocus', 'inattentive')}
                            label="Chưa chăm chú nghe giảng"
                          />
                        </div>

                        {/* Phát biểu ý kiến */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                          <CustomRadio
                            checked={currentEval.interContribution === 'voluntary'}
                            onChange={() => handleUpdateField('interContribution', 'voluntary')}
                            label="Hăng hái giơ tay phát biểu"
                          />
                          <CustomRadio
                            checked={currentEval.interContribution === 'forced'}
                            onChange={() => handleUpdateField('interContribution', 'forced')}
                            label="Ít tương tác và chưa chủ động phát biểu"
                          />
                        </div>
                      </div>
                    </div>


                    {/* Submit Row */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <Button
                        type="button"
                        onClick={handleUpdate}
                        className="h-9 px-6 text-xs font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800 text-white shrink-0"
                      >
                        Cập Nhật
                      </Button>

                      {currentEval.isSubmitted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                          Đã đánh giá thành công
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic text-xs">
                    Vui lòng chọn một học sinh từ danh sách bên trái để thực hiện đánh giá.
                  </div>
                )}
              </main>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
