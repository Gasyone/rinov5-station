'use client'

import Link from 'next/link'
import { Check, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  FEEDBACK_PROMPTS,
  FORM_2025_COLUMNS,
  SCORE_ROW_OPTIONS,
  TEST_TYPE_OPTIONS,
  WEAKNESS_OPTIONS,
} from './bookingTestConstants'
import {
  formatAssessmentScore,
  getSpeakingLevelFromScore,
} from './bookingTestHelpers'
import { AssessmentChoiceControl } from './AssessmentChoiceControl'
import type { AssessmentDraft, FeedbackAnswer, ScoreValue } from './bookingTestTypes'

interface Form2025SectionProps {
  draft: AssessmentDraft
  resultHref?: string
  readOnly?: boolean
  onDraftChange: (draft: AssessmentDraft | ((current: AssessmentDraft) => AssessmentDraft)) => void
}

export function Form2025Section({
  draft,
  resultHref,
  readOnly,
  onDraftChange,
}: Form2025SectionProps) {
  const totalScore = FORM_2025_COLUMNS.reduce((sum, col) => {
    const value = draft.scoreSelections[col]
    return typeof value === 'number' ? sum + value : sum
  }, 0)
  const answeredCount = FORM_2025_COLUMNS.filter(
    (col) => typeof draft.scoreSelections[col] === 'number'
  ).length
  const speakingLevel =
    getSpeakingLevelFromScore(totalScore, answeredCount) || 'Chưa đánh giá'
  const weaknessLimitReached = draft.weaknesses.length >= 3

  const updateDraft = (updates: Partial<AssessmentDraft>) => {
    if (readOnly) return
    onDraftChange((current: AssessmentDraft) => ({ ...current, ...updates }))
  }

  const handleScoreSelect = (column: string, value: ScoreValue) => {
    if (readOnly) return
    onDraftChange((current: AssessmentDraft) => {
      const nextValue = current.scoreSelections[column] === value ? '' : value
      return {
        ...current,
        scoreSelections: { ...current.scoreSelections, [column]: nextValue },
      }
    })
  }

  const setFeedbackAnswer = (key: string, value: FeedbackAnswer) => {
    if (readOnly) return
    onDraftChange((current: AssessmentDraft) => ({
      ...current,
      feedbackAnswers: {
        ...current.feedbackAnswers,
        [key]: current.feedbackAnswers[key] === value ? '' : value,
      },
    }))
  }

  const toggleWeakness = (key: string) => {
    if (readOnly) return
    onDraftChange((current: AssessmentDraft) => {
      const exists = current.weaknesses.includes(key)
      if (exists) {
        return { ...current, weaknesses: current.weaknesses.filter((item) => item !== key) }
      }
      if (current.weaknesses.length >= 3) return current
      return { ...current, weaknesses: [...current.weaknesses, key] }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/30 px-4 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Điểm</p>
            <p className="text-2xl font-bold leading-none text-primary">
              {formatAssessmentScore(totalScore)}
              <span className="text-sm font-normal text-muted-foreground"> / 8</span>
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Cấp độ nói</p>
            <p className="text-base font-bold leading-none">{speakingLevel}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Đã chấm</p>
            <p className="text-base font-bold leading-none">{answeredCount} / 8</p>
          </div>
        </div>
        {resultHref && readOnly ? (
          <Button asChild>
            <Link href={resultHref} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Mở kết quả
            </Link>
          </Button>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <Button
              type="button"
              variant={draft.isSkipped2025 ? 'secondary' : 'outline'}
              disabled={readOnly}
              onClick={() => updateDraft({ isSkipped2025: !draft.isSkipped2025 })}
            >
              {draft.isSkipped2025 ? 'Đã bỏ qua' : 'Bỏ qua'}
            </Button>
            {!draft.isSkipped2025 && answeredCount < FORM_2025_COLUMNS.length ? (
              <p className="text-xs text-destructive">Vui lòng chấm đủ 8 tiêu chí.</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg bg-background ring-1 ring-border/70">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[7rem_repeat(8,1fr)] bg-muted/40 text-sm font-semibold">
            <div className="px-4 py-3">Tiêu chí</div>
            {FORM_2025_COLUMNS.map((col) => (
              <div key={col} className="flex items-center justify-center py-3 text-muted-foreground">
                {col}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[7rem_repeat(8,1fr)] border-t border-border/50">
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground">Đã chọn</div>
            {FORM_2025_COLUMNS.map((col) => {
              const isAnswered = typeof draft.scoreSelections[col] === 'number'
              return (
                <div key={`check-${col}`} className="flex items-center justify-center py-2">
                  {isAnswered ? <Check className="h-4 w-4 text-primary" /> : null}
                  {draft.isSkipped2025 && !isAnswered ? (
                    <X className="h-4 w-4 text-muted-foreground/60" />
                  ) : null}
                </div>
              )
            })}
          </div>

          {SCORE_ROW_OPTIONS.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[7rem_repeat(8,1fr)] border-t border-border/40 bg-muted/10"
            >
              <div className="flex items-center px-4 py-3 text-sm font-semibold">
                {row.label}
              </div>
              {FORM_2025_COLUMNS.map((col) => {
                const isAnswered = typeof draft.scoreSelections[col] === 'number'
                const isSelected = draft.scoreSelections[col] === row.value
                const isDisabled = Boolean(readOnly || (draft.isSkipped2025 && !isAnswered))
                return (
                  <label
                    key={`${row.key}-${col}`}
                    className={cn(
                      'flex items-center justify-center py-3 transition hover:bg-muted/40',
                      isDisabled
                        ? cn('cursor-not-allowed', readOnly ? 'opacity-80' : 'opacity-45')
                        : 'cursor-pointer'
                    )}
                  >
                    <AssessmentChoiceControl
                      checked={isSelected}
                      disabled={isDisabled}
                      label={`${col} - ${row.label}`}
                      scoreValue={row.value}
                      onToggle={() => handleScoreSelect(col, row.value)}
                    />
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <h4 className="text-base font-semibold">Nhận xét của giáo viên</h4>
          <p className="text-sm text-muted-foreground">
            {TEST_TYPE_OPTIONS.find((option) => option.value === draft.testType)?.label}
          </p>
        </div>
        <div className="space-y-3">
          {FEEDBACK_PROMPTS.map((feedback) => (
            <div key={feedback.key} className="grid gap-3 lg:grid-cols-[16rem_1fr]">
              <p className="pt-2 text-sm text-muted-foreground">{feedback.prompt}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { value: 'positive' as const, label: feedback.positive },
                  { value: 'negative' as const, label: feedback.negative },
                ].map((option) => {
                  const isSelected = draft.feedbackAnswers[feedback.key] === option.value
                  return (
                    <label
                      key={`${feedback.key}-${option.value}`}
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
                        onToggle={() => setFeedbackAnswer(feedback.key, option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[16rem_1fr]">
        <div>
          <h4 className="text-base font-semibold">Điểm yếu cần lưu ý</h4>
          <p className="text-sm text-muted-foreground">{draft.weaknesses.length}/3 đã chọn</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {WEAKNESS_OPTIONS.map((option) => {
            const isSelected = draft.weaknesses.includes(option.key)
            const isDisabled = Boolean(readOnly || (weaknessLimitReached && !isSelected))
            return (
              <label
                key={option.key}
                className={cn(
                  'flex min-h-10 items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-sm transition',
                  isDisabled
                    ? cn('cursor-not-allowed', readOnly ? 'opacity-70' : 'opacity-45')
                    : 'cursor-pointer hover:bg-muted/50',
                  isSelected ? 'font-medium text-primary' : ''
                )}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  onCheckedChange={() => toggleWeakness(option.key)}
                  className="shrink-0"
                />
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      </section>
    </div>
  )
}
