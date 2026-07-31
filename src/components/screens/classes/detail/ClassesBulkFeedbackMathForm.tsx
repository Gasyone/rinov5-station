'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface StudentFormState {
  homeworkApp: string
  homeworkBook: string
  absorption: number
  participation: number
  evaluation: number
  strength: string
  weakness: string
  otherNotes: string
  reminders: string[]
  otherReminder: string
  tone: string
  generatedFeedback: string
  isSent: boolean
  internalNote: string
  vocabulary: number
  grammar: number
  speaking: number
  pronunciation: number
  attitude: number
  vocabGoodNotes: string
  vocabImproveNotes: string
  grammarGoodNotes: string
  grammarImproveNotes: string
  speakingGoodNotes: string
  speakingImproveNotes: string
  pronGoodNotes: string
  pronImproveNotes: string
  aiUsesLeft?: number
}

interface ClassesBulkFeedbackMathFormProps {
  formState: StudentFormState
  onUpdateField: (field: keyof StudentFormState, value: StudentFormState[keyof StudentFormState]) => void
  onGenerateFeedback: () => void
  onSendFeedback: () => void
  studentName: string
  studentCode: string
  classLevel: string
  sessionTopic: string
  readOnly?: boolean
}

const MATH_RATING_OPTIONS = [
  { value: 1, label: '1 - Yếu' },
  { value: 2, label: '2 - Trung bình' },
  { value: 3, label: '3 - Khá' },
  { value: 4, label: '4 - Tốt' },
  { value: 5, label: '5 - Tuyệt vời' },
]

const MATH_IMPROVEMENT_OPTIONS = [
  'Vào lớp đúng giờ (tự động cập nhật)',
  'Hoàn thành bài tập về nhà trên App',
  'Hoàn thành bài tập Workbook (Không tích nếu không có bài tập Workbook)',
  'Cần tập trung hơn và không làm việc riêng trong lớp',
  'Tự tin tương tác với thầy cô và các bạn trong lớp',
  'Không tắt cam trong buổi học',
  'Kiểm tra lại chất lượng mạng internet',
  'Sửa lỗi cam',
  'Sửa lỗi mic',
  'Tránh ngồi học nơi có nhiều tiếng ồn, nhiều người qua lại',
  'Lễ phép với thầy cô',
]

export function ClassesBulkFeedbackMathForm({
  formState,
  onUpdateField,
  onGenerateFeedback,
  onSendFeedback,
  studentName,
  studentCode,
  readOnly = false,
}: ClassesBulkFeedbackMathFormProps) {
  return (
    <div className="space-y-5 max-w-[850px] mx-auto pb-4">
      {/* Banner / Current student title */}
      <div className="flex items-center justify-between pb-1 shrink-0">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Nhận xét cho học viên: <span className="text-primary">{studentName}</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Mã học viên: {studentCode}</p>
        </div>
        {formState.isSent && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
            <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
            Đã hoàn thành nhận xét
          </span>
        )}
      </div>

      {/* BƯỚC 1: ĐÁNH GIÁ */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 bg-background">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
          BƯỚC 1: ĐÁNH GIÁ
        </h4>

        {/* 1. Khả năng tiếp thu * */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Khả năng tiếp thu <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {MATH_RATING_OPTIONS.map((opt) => {
              const isChecked = (formState.absorption || 4) === opt.value
              return (
                <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`absorption-math-${studentCode}`}
                    checked={isChecked}
                    disabled={readOnly}
                    onChange={() => onUpdateField('absorption', opt.value)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  <span className={cn(isChecked ? 'font-bold text-foreground' : 'text-muted-foreground')}>
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* 2. Tham gia vào các hoạt động trong lớp * */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Tham gia vào các hoạt động trong lớp <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {MATH_RATING_OPTIONS.map((opt) => {
              const isChecked = (formState.participation || 4) === opt.value
              return (
                <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`participation-math-${studentCode}`}
                    checked={isChecked}
                    disabled={readOnly}
                    onChange={() => onUpdateField('participation', opt.value)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  <span className={cn(isChecked ? 'font-bold text-foreground' : 'text-muted-foreground')}>
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* 3. Giải quyết vấn đề & trình bày * */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Giải quyết vấn đề & trình bày <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {MATH_RATING_OPTIONS.map((opt) => {
              const isChecked = (formState.evaluation || 4) === opt.value
              return (
                <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`evaluation-math-${studentCode}`}
                    checked={isChecked}
                    disabled={readOnly}
                    onChange={() => onUpdateField('evaluation', opt.value)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  <span className={cn(isChecked ? 'font-bold text-foreground' : 'text-muted-foreground')}>
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* 2 inputs: Con hiểu phương pháp & Con cần luyện tập thêm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Con hiểu phương pháp và cách trình bày về dạng bài
            </label>
            <Input
              value={formState.strength}
              onChange={(e) => onUpdateField('strength', e.target.value)}
              disabled={readOnly}
              placeholder="Dạng bài ..."
              className="text-xs h-9 bg-background border-zinc-300 dark:border-zinc-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Con cần luyện tập thêm về dạng bài
            </label>
            <Input
              value={formState.weakness}
              onChange={(e) => onUpdateField('weakness', e.target.value)}
              disabled={readOnly}
              placeholder="Dạng bài..."
              className="text-xs h-9 bg-background border-zinc-300 dark:border-zinc-700"
            />
          </div>
        </div>

        {/* Nhận xét thêm (nếu có) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground">
            Nhận xét thêm (nếu có)
          </label>
          <Textarea
            value={formState.otherNotes}
            onChange={(e) => onUpdateField('otherNotes', e.target.value)}
            disabled={readOnly}
            placeholder="Nhận xét ..."
            className="text-xs min-h-[50px] bg-background border-zinc-300 dark:border-zinc-700 resize-none"
          />
        </div>

        {/* Những vấn đề cần cải thiện để buổi học đạt kết quả tốt hơn (nếu có) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">
            Những vấn đề cần cải thiện để buổi học đạt kết quả tốt hơn (nếu có)
          </label>
          <div className="space-y-1.5 pl-1">
            {MATH_IMPROVEMENT_OPTIONS.map((item) => {
              const isChecked = (formState.reminders || []).includes(item)
              return (
                <label
                  key={item}
                  className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={readOnly}
                    onChange={() => {
                      const prev = formState.reminders || []
                      const next = isChecked
                        ? prev.filter((r) => r !== item)
                        : [...prev, item]
                      onUpdateField('reminders', next)
                    }}
                    className="accent-primary h-3.5 w-3.5 rounded"
                  />
                  <span className={cn(isChecked ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                    {item}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Button Lưu Lại */}
        {!readOnly && (
          <div className="pt-1">
            <Button
              type="button"
              onClick={() => toast.success(`Đã lưu đánh giá cho học viên ${studentName}!`)}
              className="h-8 px-5 text-xs font-bold rounded-lg bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
            >
              Lưu Lại
            </Button>
          </div>
        )}
      </div>

      {/* BƯỚC 2: NHẬN XẾT */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 bg-background">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
          BƯỚC 2: NHẬN XẾT
        </h4>

        {/* Giọng văn & AI Button row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-foreground">Giọng văn viết</span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name={`tone-math-${studentCode}`}
                checked={formState.tone === 'concise'}
                disabled={readOnly}
                onChange={() => onUpdateField('tone', 'concise')}
                className="accent-primary h-3.5 w-3.5"
              />
              <span className={cn(formState.tone === 'concise' ? 'font-bold text-foreground' : 'text-muted-foreground')}>
                Ngắn gọn, súc tích
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name={`tone-math-${studentCode}`}
                checked={formState.tone === 'friendly' || !formState.tone}
                disabled={readOnly}
                onChange={() => onUpdateField('tone', 'friendly')}
                className="accent-primary h-3.5 w-3.5"
              />
              <span className={cn(formState.tone === 'friendly' || !formState.tone ? 'font-bold text-foreground' : 'text-muted-foreground')}>
                Gần gũi, thân thiện
              </span>
            </label>
          </div>

          {!readOnly && (
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs font-semibold text-rose-500">
                Còn {formState.aiUsesLeft ?? 3} lần dùng AI
              </span>
              <Button
                type="button"
                onClick={onGenerateFeedback}
                className="h-8 px-4 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
              >
                Tạo Nhận Xét
              </Button>
            </div>
          )}
        </div>

        {/* Editable feedback textarea */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground">
            Giáo viên có thể chỉnh sửa nhận xét
          </label>
          <Textarea
            value={formState.generatedFeedback}
            onChange={(e) => onUpdateField('generatedFeedback', e.target.value)}
            disabled={readOnly}
            placeholder="Nhận xét ..."
            className="text-xs min-h-[120px] bg-background border-zinc-300 dark:border-zinc-700 resize-y"
          />
        </div>

        {/* Button Gửi Nhận Xét */}
        {!readOnly && (
          <div className="pt-1 flex items-center justify-between">
            <Button
              type="button"
              onClick={onSendFeedback}
              className="h-9 px-6 text-xs font-bold rounded-lg bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
            >
              Gửi Nhận Xét
            </Button>

            {formState.isSent && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Check className="h-4 w-4 stroke-[3px]" />
                Đã gửi
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
