'use client'

import React from 'react'
import { Check, X, Sparkles, Star, AlertCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StudentFormState } from './classesBulkFeedbackTypes'
import {
  MATH_THINKING_SKILLS,
  MATH_ATTITUDE_LABELS,
  MATH_HOMEWORK_OPTIONS,
  MATH_EVALUATION_OPTIONS,
  MATH_REMINDERS_COL_1,
  MATH_REMINDERS_COL_2,
  MathThinkingSkillConfig,
} from './mathThinkingTypes'

export type { StudentFormState }

interface ClassesBulkFeedbackMathTestFormProps {
  formState: StudentFormState
  onUpdateField: (field: keyof StudentFormState, value: StudentFormState[keyof StudentFormState]) => void
  onGenerateFeedback: () => void
  onSendFeedback: () => void
  studentName: string
  studentCode: string
  classLevel?: string
  sessionTopic?: string
  readOnly?: boolean
  errors?: Record<string, string>
}

interface TestThinkingSkillItemProps {
  skill: MathThinkingSkillConfig
  formState: StudentFormState
  onUpdateField: (field: keyof StudentFormState, value: StudentFormState[keyof StudentFormState]) => void
  readOnly: boolean
  errorMessage?: string
}

function TestThinkingSkillItem({
  skill,
  formState,
  onUpdateField,
  readOnly,
  errorMessage,
}: TestThinkingSkillItemProps) {
  const currentRating = formState[skill.ratingKey] as number | undefined
  const strengthValue = (formState[skill.strengthKey] as string) || ''
  const weaknessValue = (formState[skill.weaknessKey] as string) || ''

  // Tạm ẩn gợi ý nhận xét theo yêu cầu
  /*
  const handleAddTag = (fieldKey: keyof StudentFormState, tagText: string) => {
    if (readOnly) return
    const currentVal = (formState[fieldKey] as string) || ''
    const newVal = currentVal
      ? currentVal.endsWith(', ') || currentVal.endsWith(',')
        ? `${currentVal}${tagText}`
        : `${currentVal}, ${tagText}`
      : tagText
    onUpdateField(fieldKey, newVal)
  }
  */

  return (
    <div
      className={cn(
        'space-y-2 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 transition-all rounded-xl',
        errorMessage && 'bg-rose-50/20 dark:bg-rose-950/10 p-2.5 border border-rose-300/80 dark:border-rose-800/80 shadow-2xs'
      )}
    >
      {/* Dòng trên: Title bên trái, Chỉ số rating bên phải */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-sm font-bold text-foreground shrink-0 flex items-center gap-1.5">
          <span className="text-base leading-none">{skill.icon}</span>
          <span>{skill.label}</span>
          <span className="text-rose-500">*</span>
        </span>

        {/* Rating Options cạnh phải title tư duy */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0 flex-nowrap">
          {MATH_EVALUATION_OPTIONS.map((opt) => {
            const isChecked = currentRating === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                disabled={readOnly}
                onClick={() => onUpdateField(skill.ratingKey, isChecked ? undefined : opt.value)}
                className="flex items-center gap-1 text-xs transition-all cursor-pointer select-none disabled:cursor-default hover:text-foreground whitespace-nowrap"
              >
                <span
                  className={cn(
                    'h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all',
                    isChecked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : errorMessage
                        ? 'border-rose-400 dark:border-rose-600 bg-background'
                        : 'border-zinc-300 dark:border-zinc-600 bg-background'
                  )}
                >
                  {isChecked && (
                    <Check className="h-2.5 w-2.5 stroke-[3px]" />
                  )}
                </span>
                <span
                  className={cn(
                    isChecked ? 'font-bold text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dòng dưới: Mô tả ở dưới */}
      <p className="text-xs text-muted-foreground -mt-0.5">
        {skill.description}
      </p>

      {/* Thông báo lỗi nếu thiếu đánh giá bắt buộc (*) */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-1 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Amber callout container for Strength & Weakness */}
      <div className="border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl p-3.5 space-y-2.5">
        <p className="text-xs font-medium text-muted-foreground">
          Thêm nhận xét chi tiết để khích lệ và giúp học sinh cải thiện điểm yếu cho{' '}
          <strong className="text-foreground">{skill.shortLabel}</strong>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Strength */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              <Check className="h-4 w-4 stroke-[3px]" />
              Phần làm tốt & nắm vững dạng bài
            </label>
            <Input
              value={strengthValue}
              onChange={(e) => onUpdateField(skill.strengthKey, e.target.value)}
              disabled={readOnly}
              placeholder="ví dụ: tính toán nhanh, suy luận logic..."
              className="text-sm h-9 bg-background border-zinc-200 dark:border-zinc-800 rounded-lg placeholder:text-muted-foreground/45 placeholder:font-normal"
            />
            {/* Tạm ẩn Suggestion Chips */}
            {/* <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skill.suggestions.strength.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleAddTag(skill.strengthKey, tag)}
                  className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-md px-2 py-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer select-none transition-colors disabled:cursor-default"
                >
                  + {tag}
                </button>
              ))}
            </div> */}
          </div>

          {/* Weakness */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              <span className="text-sm">⚠️</span>
              Phần cần ôn luyện lại
            </label>
            <Input
              value={weaknessValue}
              onChange={(e) => onUpdateField(skill.weaknessKey, e.target.value)}
              disabled={readOnly}
              placeholder="ví dụ: dạng toán có lời văn, nhầm dấu..."
              className="text-sm h-9 bg-background border-zinc-200 dark:border-zinc-800 rounded-lg placeholder:text-muted-foreground/45 placeholder:font-normal"
            />
            {/* Tạm ẩn Suggestion Chips */}
            {/* <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skill.suggestions.weakness.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleAddTag(skill.weaknessKey, tag)}
                  className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 rounded-md px-2 py-0.5 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer select-none transition-colors disabled:cursor-default"
                >
                  + {tag}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClassesBulkFeedbackMathTestForm({
  formState,
  onUpdateField,
  onGenerateFeedback,
  onSendFeedback,
  studentName,
  studentCode,
  classLevel,
  sessionTopic,
  readOnly = false,
  errors = {},
}: ClassesBulkFeedbackMathTestFormProps) {
  const handleToggleReminder = (item: string) => {
    if (readOnly) return
    const prev = formState.reminders || []
    const next = prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    onUpdateField('reminders', next)
  }

  const attitudeScore = formState.attitude || 3
  const attitudeLabel = MATH_ATTITUDE_LABELS[attitudeScore] || '3 - Chưa đạt'

  return (
    <div className="space-y-4 max-w-[850px] mx-auto pb-4">
      {/* Header section with student info */}
      <div className="flex items-center justify-between pb-1 shrink-0">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Nhận xét bài kiểm tra: <span className="text-primary">{studentName}</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Mã học viên: {studentCode}</p>
        </div>
        {formState.isSent && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
            <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
            Đã gửi nhận xét
          </span>
        )}
      </div>

      {/* 1. ⭐ THÁI ĐỘ LÀM BÀI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-zinc-100 dark:border-zinc-800/80 pt-1">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
          <span>Thái độ làm bài kiểm tra</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium mr-1.5">
            {attitudeLabel}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={readOnly}
                onClick={() => onUpdateField('attitude', star)}
                className="p-1 focus:outline-none disabled:cursor-default"
              >
                <Star
                  className={cn(
                    'h-5 w-5 transition-all cursor-pointer',
                    star <= attitudeScore
                      ? 'fill-amber-400 text-amber-400 scale-105'
                      : 'text-zinc-300 dark:text-zinc-650 hover:text-amber-300'
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ✏️ BÀI TẬP VỀ NHÀ / ÔN TẬP */}
      <div className="space-y-2 pb-1 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <span className="text-orange-500 text-sm">✏️</span>
          <span>Bài tập chuẩn bị</span>
        </div>

        <div className="space-y-2">
          {/* Row 1: Bài tập ôn tập trên app */}
          <div
            className={cn(
              'p-2 rounded-xl transition-all',
              errors.homeworkApp && 'bg-rose-50/20 dark:bg-rose-950/10 border border-rose-300/80 dark:border-rose-800/80 shadow-2xs'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-0.5 bg-transparent gap-2">
              <span className="text-xs font-bold text-foreground">
                Bài tập trên ứng dụng <span className="text-rose-500">*</span>
              </span>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {MATH_HOMEWORK_OPTIONS.map((opt) => {
                  const isChecked =
                    formState.homeworkApp === opt.value || formState.homeworkApp === opt.altValue
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={readOnly}
                      onClick={() => onUpdateField('homeworkApp', opt.value)}
                      className="flex items-center gap-1.5 text-xs transition-all cursor-pointer select-none disabled:cursor-default"
                    >
                      <span
                        className={cn(
                          'h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-all bg-background',
                          isChecked
                            ? 'border-zinc-900 dark:border-zinc-100'
                            : errors.homeworkApp
                              ? 'border-rose-400 dark:border-rose-600'
                              : 'border-zinc-300 dark:border-zinc-600'
                        )}
                      >
                        {isChecked && (
                          <div className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                        )}
                      </span>
                      {opt.type === 'done' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          <Check className="h-3 w-3 stroke-[3px]" /> Hoàn thành
                        </span>
                      )}
                      {opt.type === 'partly' && (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          <span className="text-xs leading-none">♦</span> Hoàn thành 1 phần
                        </span>
                      )}
                      {opt.type === 'not_yet' && (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          <X className="h-3 w-3 stroke-[3px]" /> Chưa làm
                        </span>
                      )}
                      {opt.type === 'none' && (
                        <span
                          className={cn(
                            'text-xs font-semibold',
                            isChecked ? 'text-foreground font-bold' : 'text-muted-foreground'
                          )}
                        >
                          Không có
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            {errors.homeworkApp && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-1 rounded-lg mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.homeworkApp}</span>
              </div>
            )}
          </div>

          {/* Row 2: Bài tập trong sách */}
          <div
            className={cn(
              'p-2 rounded-xl transition-all',
              errors.homeworkBook && 'bg-rose-50/20 dark:bg-rose-950/10 border border-rose-300/80 dark:border-rose-800/80 shadow-2xs'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-0.5 bg-transparent gap-2">
              <span className="text-xs font-bold text-foreground">
                Bài tập trong sách <span className="text-rose-500">*</span>
              </span>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {MATH_HOMEWORK_OPTIONS.map((opt) => {
                  const isChecked =
                    formState.homeworkBook === opt.value || formState.homeworkBook === opt.altValue
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={readOnly}
                      onClick={() => onUpdateField('homeworkBook', opt.value)}
                      className="flex items-center gap-1.5 text-xs transition-all cursor-pointer select-none disabled:cursor-default"
                    >
                      <span
                        className={cn(
                          'h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-all bg-background',
                          isChecked
                            ? 'border-zinc-900 dark:border-zinc-100'
                            : errors.homeworkBook
                              ? 'border-rose-400 dark:border-rose-600'
                              : 'border-zinc-300 dark:border-zinc-600'
                        )}
                      >
                        {isChecked && (
                          <div className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                        )}
                      </span>
                      {opt.type === 'done' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          <Check className="h-3 w-3 stroke-[3px]" /> Hoàn thành
                        </span>
                      )}
                      {opt.type === 'partly' && (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          <span className="text-xs leading-none">♦</span> Hoàn thành 1 phần
                        </span>
                      )}
                      {opt.type === 'not_yet' && (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          <X className="h-3 w-3 stroke-[3px]" /> Chưa làm
                        </span>
                      )}
                      {opt.type === 'none' && (
                        <span
                          className={cn(
                            'text-xs font-semibold',
                            isChecked ? 'text-foreground font-bold' : 'text-muted-foreground'
                          )}
                        >
                          Không có
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            {errors.homeworkBook && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-1 rounded-lg mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.homeworkBook}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. ⭐ ĐÁNH GIÁ NĂNG LỰC TƯ DUY TOÁN HỌC */}
      <div className="space-y-3 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-sm uppercase tracking-wider text-muted-foreground">
            <Star className="h-4 w-4 text-primary fill-primary shrink-0" />
            <span>Đánh giá 5 bậc tư duy toán học</span>
          </div>
        </div>

        {/* Lesson summary banner */}
        <div className="p-3 rounded-lg bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/50 text-sm text-[#0369a1] dark:text-sky-400 space-y-0.5">
          <div className="font-bold">Nội dung bài học:</div>
          <div>
            {classLevel
              ? `Level: ${classLevel} — ${sessionTopic || 'Subtraction within 10'}`
              : sessionTopic || 'Level: Math Kindi — Subtraction within 10'}
          </div>
        </div>

        {/* Thinking Skill Sections (Tách thành từng dòng/section riêng biệt) */}
        <div className="space-y-3.5 pt-1">
          {MATH_THINKING_SKILLS.map((skill) => (
            <TestThinkingSkillItem
              key={skill.id}
              skill={skill}
              formState={formState}
              onUpdateField={onUpdateField}
              readOnly={readOnly}
              errorMessage={errors[skill.ratingKey]}
            />
          ))}
        </div>
      </div>

      {/* 4. ⭐ KHÁC */}
      <div className="space-y-1.5 pb-1 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-primary fill-primary shrink-0" />
          <span>Khác</span>
        </div>
        <Input
          value={formState.otherNotes}
          onChange={(e) => onUpdateField('otherNotes', e.target.value)}
          disabled={readOnly}
          placeholder="Ghi chú khác..."
          className="text-xs h-8.5 bg-background border-zinc-200 dark:border-zinc-800 rounded-lg placeholder:text-muted-foreground/45 placeholder:font-normal"
        />
      </div>

      {/* 5. ⭐ NHẮC NHỞ */}
      <div className="space-y-2 pb-1 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-primary fill-primary shrink-0" />
          <span>Nhắc nhở</span>
        </div>
        <div className="space-y-2 pt-0.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {/* Column 1 */}
            <div className="space-y-2">
              {MATH_REMINDERS_COL_1.map((item) => {
                const isChecked = (formState.reminders || []).includes(item)
                return (
                  <div
                    key={item}
                    onClick={() => handleToggleReminder(item)}
                    className="flex items-start gap-2 cursor-pointer text-xs select-none hover:text-primary transition-colors text-muted-foreground"
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        isChecked
                          ? 'bg-primary border-primary text-white'
                          : 'border-zinc-300 bg-background'
                      )}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3px]" />}
                    </div>
                    <span className={cn(isChecked && 'text-foreground font-medium')}>{item}</span>
                  </div>
                )
              })}
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              {MATH_REMINDERS_COL_2.map((item) => {
                const isChecked = (formState.reminders || []).includes(item)
                return (
                  <div
                    key={item}
                    onClick={() => handleToggleReminder(item)}
                    className="flex items-start gap-2 cursor-pointer text-xs select-none hover:text-primary transition-colors text-muted-foreground"
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        isChecked
                          ? 'bg-primary border-primary text-white'
                          : 'border-zinc-300 bg-background'
                      )}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3px]" />}
                    </div>
                    <span className={cn(isChecked && 'text-foreground font-medium')}>{item}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <Input
            value={formState.otherReminder}
            onChange={(e) => onUpdateField('otherReminder', e.target.value)}
            disabled={readOnly}
            placeholder="Nhập nội dung nhắc nhở khác..."
            className="text-xs h-8.5 bg-background border-zinc-200 dark:border-zinc-800 rounded-lg mt-1 placeholder:text-muted-foreground/45 placeholder:font-normal"
          />
        </div>
      </div>

      {/* 6. AI Tone & Actions & Textarea */}
      <div className="space-y-2.5 pt-1">
        {!readOnly && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap text-xs">
              <span className="font-bold text-foreground">Giọng văn:</span>
              <button
                type="button"
                onClick={() => onUpdateField('tone', 'friendly')}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none"
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border flex items-center justify-center',
                    formState.tone === 'friendly' || !formState.tone
                      ? 'border-primary text-primary'
                      : 'border-zinc-300'
                  )}
                >
                  {(formState.tone === 'friendly' || !formState.tone) && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <span
                  className={cn(
                    (formState.tone === 'friendly' || !formState.tone) &&
                      'text-foreground font-medium'
                  )}
                >
                  Vui vẻ, hào hứng
                </span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateField('tone', 'formal')}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none"
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border flex items-center justify-center',
                    formState.tone === 'formal'
                      ? 'border-primary text-primary'
                      : 'border-zinc-300'
                  )}
                >
                  {formState.tone === 'formal' && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className={cn(formState.tone === 'formal' && 'text-foreground font-medium')}>
                  Chững chạc, chuẩn mực
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs text-muted-foreground">
                Bạn có thể tạo lại nhận xét thêm {formState.aiUsesLeft ?? 2} lần
              </span>
              <Button
                type="button"
                onClick={onGenerateFeedback}
                className="gap-1.5 text-xs h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Tạo Nhận Xét
              </Button>
            </div>
          </div>
        )}

        {/* Feedback preview & edit textarea */}
        <div className="space-y-1.5">
          <Textarea
            value={formState.generatedFeedback}
            onChange={(e) => onUpdateField('generatedFeedback', e.target.value)}
            readOnly={readOnly}
            placeholder="Nội dung nhận xét chi tiết..."
            className="text-xs min-h-[140px] bg-background border-zinc-200 dark:border-zinc-800 font-sans leading-relaxed rounded-xl shadow-2xs focus-visible:ring-primary/20 p-3 placeholder:text-muted-foreground/45 placeholder:font-normal"
          />
        </div>

        {/* Submit row */}
        <div className="pt-2 flex items-center justify-between">
          {!readOnly && (
            <Button
              type="button"
              onClick={onSendFeedback}
              className="h-8 px-5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            >
              Gửi nhận xét
            </Button>
          )}

          {formState.isSent && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <Check className="h-4 w-4 stroke-[3px]" />
              Đã gửi nhận xét
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
