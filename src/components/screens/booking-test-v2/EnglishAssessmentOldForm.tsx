'use client'

import type { ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  GRAMMAR_ERROR_OPTIONS,
  OLD_FORM_COLUMNS,
  OPEN_QUESTION_OPTIONS,
  VOCAB_LEVEL_OPTIONS,
} from './bookingTestConstants'
import { OldFormScoreGrid } from './OldFormScoreGrid'
import { EnglishAssessmentOldFormSpeechSections } from './EnglishAssessmentOldFormSpeechSections'
import { AssessmentChoiceControl } from './AssessmentChoiceControl'
import type { AssessmentDraft, AssessmentOldFormDraft, ScoreValue } from './bookingTestTypes'

interface EnglishAssessmentOldFormProps {
  draft: AssessmentDraft
  resultHref?: string
  readOnly?: boolean
  onDraftChange: (draft: AssessmentDraft | ((current: AssessmentDraft) => AssessmentDraft)) => void
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h4 className="text-base font-semibold text-foreground">{children}</h4>
}

function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[22rem_1fr] lg:gap-4">
      <span className="self-center text-sm text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  )
}

export function EnglishAssessmentOldForm({
  draft,
  resultHref,
  readOnly,
  onDraftChange,
}: EnglishAssessmentOldFormProps) {
  const oldForm = draft.oldForm
  const totalScore = OLD_FORM_COLUMNS.reduce((sum, col) => {
    const value = oldForm.scoreSelections[col]
    return typeof value === 'number' ? sum + value : sum
  }, 0)

  const updateOldForm = (updates: Partial<AssessmentOldFormDraft>) => {
    if (readOnly) return
    onDraftChange((current: AssessmentDraft) => ({
      ...current,
      oldForm: { ...current.oldForm, ...updates },
    }))
  }

  const handleOldScoreSelect = (column: string, value: ScoreValue) => {
    if (readOnly) return
    onDraftChange((current: AssessmentDraft) => {
      const next = { ...current.oldForm.scoreSelections }
      next[column] = current.oldForm.scoreSelections[column] === value ? '' : value
      return { ...current, oldForm: { ...current.oldForm, scoreSelections: next } }
    })
  }

  const toggleArrayField = (field: keyof AssessmentOldFormDraft, key: string) => {
    if (readOnly) return
    const arr = oldForm[field] as string[]
    updateOldForm({
      [field]: arr.includes(key) ? arr.filter((item) => item !== key) : [...arr, key],
    })
  }

  return (
    <div className="space-y-6">
      <OldFormScoreGrid
        oldForm={oldForm}
        resultHref={resultHref}
        readOnly={readOnly}
        totalScore={totalScore}
        onScoreSelect={handleOldScoreSelect}
        onToggleSkip={() => updateOldForm({ isSkipped: !oldForm.isSkipped })}
      />

      <section className="space-y-4">
        <SectionLabel>Kiến thức từ vựng</SectionLabel>
        <FormRow label="Vốn từ của con ở mức: *">
          <div className="flex flex-wrap items-center gap-2">
            {VOCAB_LEVEL_OPTIONS.map((option) => {
              const isSelected = oldForm.vocabLevel === option.value
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                    readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 font-medium text-primary'
                      : cn('bg-muted/30', !readOnly && 'hover:bg-muted/50')
                  )}
                >
                  <AssessmentChoiceControl
                    checked={isSelected}
                    disabled={readOnly}
                    label={option.label}
                    onToggle={() =>
                      updateOldForm({
                        vocabLevel: isSelected
                          ? ''
                          : (option.value as AssessmentOldFormDraft['vocabLevel']),
                      })
                    }
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </FormRow>
        <FormRow label="Con nhớ và sử dụng được các từ vựng về chủ đề: *">
          <Input
            placeholder="Nhập tên chủ đề"
            value={oldForm.vocabRemembered}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ vocabRemembered: event.target.value })}
          />
        </FormRow>
        <FormRow label="Con chưa nắm được và sử dụng các từ vựng về chủ đề: *">
          <Input
            placeholder="Phân cách các từ bằng dấu chấm phẩy ;"
            value={oldForm.vocabForgotten}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ vocabForgotten: event.target.value })}
          />
        </FormRow>
      </section>

      <section className="space-y-4">
        <SectionLabel>Kiến thức ngữ pháp</SectionLabel>
        <FormRow label="Con nhớ và sử dụng được cấu trúc: *">
          <Input
            placeholder="Phân cách các cấu trúc bằng dấu chấm phẩy ;"
            value={oldForm.grammarRemembered}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ grammarRemembered: event.target.value })}
          />
        </FormRow>
        <FormRow label="Con chưa nắm được và sử dụng linh hoạt cấu trúc: *">
          <Input
            placeholder="Phân cách các cấu trúc bằng dấu chấm phẩy ;"
            value={oldForm.grammarForgotten}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ grammarForgotten: event.target.value })}
          />
        </FormRow>
        <FormRow label="Những lỗi nhỏ con cần cải thiện khi nói: *">
          <div className="grid gap-2">
            {GRAMMAR_ERROR_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  'flex min-h-10 items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-sm transition',
                  readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={oldForm.grammarErrors.includes(option.key)}
                  disabled={readOnly}
                  onCheckedChange={() => toggleArrayField('grammarErrors', option.key)}
                  className="shrink-0"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </FormRow>
        <FormRow label="Mô tả chi tiết hơn về lỗi của con:">
          <Textarea
            rows={3}
            placeholder="Viết mô tả chi tiết"
            value={oldForm.grammarDetail}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ grammarDetail: event.target.value })}
            className="resize-none"
          />
        </FormRow>
        <FormRow label="Câu hỏi tư duy, mở rộng: *">
          <div className="flex flex-wrap items-center gap-2">
            {OPEN_QUESTION_OPTIONS.map((option) => {
              const isSelected = oldForm.openQuestion === option.value
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                    readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 font-medium text-primary'
                      : cn('bg-muted/30', !readOnly && 'hover:bg-muted/50')
                  )}
                >
                  <AssessmentChoiceControl
                    checked={isSelected}
                    disabled={readOnly}
                    label={option.label}
                    onToggle={() =>
                      updateOldForm({
                        openQuestion: isSelected
                          ? ''
                          : (option.value as AssessmentOldFormDraft['openQuestion']),
                      })
                    }
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </FormRow>
      </section>

      <EnglishAssessmentOldFormSpeechSections
        oldForm={oldForm}
        readOnly={readOnly}
        updateOldForm={updateOldForm}
        toggleArrayField={toggleArrayField}
      />
    </div>
  )
}
