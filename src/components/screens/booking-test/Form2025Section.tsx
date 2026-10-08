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
    <div className="space-y-2">
      {/* 1. Score & Level summary */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-md border bg-muted/25 px-3 py-1">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Điểm:</span>
            <span className="text-base font-bold text-primary leading-tight">
              {formatAssessmentScore(totalScore)}
              <span className="text-xs font-normal text-muted-foreground"> / 8</span>
            </span>
          </div>
          <div className="h-3.5 w-px bg-border" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Cấp độ nói:</span>
            <span className="text-xs font-semibold text-foreground leading-tight">{speakingLevel}</span>
          </div>
        </div>
        {resultHref && readOnly ? (
          <Button size="sm" className="h-6.5 px-2.5 text-xs gap-1.5" asChild>
            <Link href={resultHref} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Mở kết quả
            </Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {!draft.isSkipped2025 && answeredCount < FORM_2025_COLUMNS.length ? (
              <p className="text-xs text-destructive">Vui lòng chấm đủ 8 tiêu chí.</p>
            ) : null}
            <Button
              type="button"
              size="sm"
              className="h-6.5 px-2.5 text-xs"
              variant={draft.isSkipped2025 ? 'secondary' : 'outline'}
              disabled={readOnly}
              onClick={() => updateDraft({ isSkipped2025: !draft.isSkipped2025 })}
            >
              {draft.isSkipped2025 ? 'Đã bỏ qua' : 'Bỏ qua'}
            </Button>
          </div>
        )}
      </div>

      {/* 2. Criteria Score Table */}
      <div className="overflow-x-auto rounded-lg border bg-background">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[5.5rem_repeat(8,1fr)] bg-muted/40 text-xs font-semibold">
            <div className="px-3 py-1.5 text-foreground">Tiêu chí</div>
            {FORM_2025_COLUMNS.map((col) => (
              <div key={col} className="flex items-center justify-center py-1.5 text-muted-foreground font-semibold">
                {col}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[5.5rem_repeat(8,1fr)] border-t border-border/50">
            <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Đã chọn</div>
            {FORM_2025_COLUMNS.map((col) => {
              const isAnswered = typeof draft.scoreSelections[col] === 'number'
              return (
                <div key={`check-${col}`} className="flex items-center justify-center py-1">
                  {isAnswered ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                  {draft.isSkipped2025 && !isAnswered ? (
                    <X className="h-3.5 w-3.5 text-muted-foreground/60" />
                  ) : null}
                </div>
              )
            })}
          </div>

          {SCORE_ROW_OPTIONS.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[5.5rem_repeat(8,1fr)] border-t border-border/40 bg-muted/10"
            >
              <div className="flex items-center px-3 py-1 text-xs font-medium text-foreground">
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
                      'flex items-center justify-center py-1 transition hover:bg-muted/40',
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

      {/* 3. Teacher Feedback */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold text-foreground">Nhận xét của giáo viên</h4>
        <div className="space-y-1.5">
          {FEEDBACK_PROMPTS.map((feedback) => (
            <div key={feedback.key} className="grid grid-cols-1 sm:grid-cols-[13rem_1fr] items-center gap-1.5">
              <p className="text-xs text-muted-foreground truncate" title={feedback.prompt}>
                {feedback.prompt}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { value: 'positive' as const, label: feedback.positive },
                  { value: 'negative' as const, label: feedback.negative },
                ].map((option) => {
                  const isSelected = draft.feedbackAnswers[feedback.key] === option.value
                  return (
                    <label
                      key={`${feedback.key}-${option.value}`}
                      className={cn(
                        'flex min-h-7 items-center gap-2 rounded-md px-2 py-1 text-xs transition',
                        readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
                        isSelected
                          ? 'bg-primary/10 font-medium text-primary'
                          : cn('bg-muted/30', !readOnly && 'hover:bg-muted/50')
                      )}
                    >
                      <AssessmentChoiceControl
                        checked={isSelected}
                        disabled={readOnly}
                        label={`${feedback.prompt} ${option.label}`}
                        onToggle={() => setFeedbackAnswer(feedback.key, option.value)}
                      />
                      <span className="truncate">{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Weaknesses */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground">Điểm yếu cần lưu ý</h4>
          <p className="text-xs text-muted-foreground">
            Tối đa 3 lựa chọn · {draft.weaknesses.length}/3 đã chọn
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {WEAKNESS_OPTIONS.map((option) => {
            const isSelected = draft.weaknesses.includes(option.key)
            const isDisabled = Boolean(readOnly || (weaknessLimitReached && !isSelected))
            return (
              <label
                key={option.key}
                className={cn(
                  'flex min-h-7 items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1 text-xs transition',
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
                  className="h-3.5 w-3.5 shrink-0"
                />
                <span className="truncate">{option.label}</span>
              </label>
            )
          })}
        </div>
      </section>
    </div>
  )
}
