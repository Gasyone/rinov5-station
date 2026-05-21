'use client'

import Link from 'next/link'
import { Check, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { OLD_FORM_COLUMNS, SCORE_ROW_OPTIONS } from './bookingTestConstants'
import { formatAssessmentScore } from './bookingTestHelpers'
import { AssessmentChoiceControl } from './AssessmentChoiceControl'
import type { AssessmentOldFormDraft, ScoreValue } from './bookingTestTypes'

interface OldFormScoreGridProps {
  oldForm: AssessmentOldFormDraft
  resultHref?: string
  readOnly?: boolean
  onScoreSelect: (column: string, value: ScoreValue) => void
  onToggleSkip: () => void
  totalScore: number
  answeredCount: number
}

export function OldFormScoreGrid({
  oldForm,
  resultHref,
  readOnly,
  onScoreSelect,
  onToggleSkip,
  totalScore,
  answeredCount,
}: OldFormScoreGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-6">
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Điểm</p>
            <p className="text-2xl font-bold leading-none text-primary">
              {formatAssessmentScore(totalScore)}
              <span className="text-sm font-normal text-muted-foreground"> / 32</span>
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Đã chấm</p>
            <p className="text-base font-bold leading-none">{answeredCount} / 32</p>
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
          <Button
            type="button"
            variant={oldForm.isSkipped ? 'secondary' : 'outline'}
            disabled={readOnly}
            onClick={onToggleSkip}
          >
            {oldForm.isSkipped ? 'Đã bỏ qua' : 'Bỏ qua'}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg bg-background ring-1 ring-border/70">
        <div className="min-w-[1100px]">
          <div className="grid grid-cols-[3.5rem_repeat(32,1fr)] bg-muted/40">
            <div className="flex items-center justify-center px-2 py-2.5 text-xs font-bold">
              Câu
            </div>
            {OLD_FORM_COLUMNS.map((col) => (
              <div
                key={col}
                className="flex items-center justify-center py-2.5 text-xs font-bold text-muted-foreground"
              >
                {col}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[3.5rem_repeat(32,1fr)] border-t border-border/50">
            <div className="flex items-center justify-center px-2 py-1.5 text-center text-[10px] font-medium leading-tight text-muted-foreground">
              Đã
              <br />
              chọn
            </div>
            {OLD_FORM_COLUMNS.map((col) => {
              const isAnswered = typeof oldForm.scoreSelections[col] === 'number'
              return (
                <div key={`check-${col}`} className="flex items-center justify-center py-1.5">
                  {isAnswered ? <Check className="h-4 w-4 text-primary" /> : null}
                  {oldForm.isSkipped && !isAnswered ? (
                    <X className="h-4 w-4 text-muted-foreground/60" />
                  ) : null}
                </div>
              )
            })}
          </div>

          {SCORE_ROW_OPTIONS.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[3.5rem_repeat(32,1fr)] border-t border-border/40 bg-muted/10"
            >
              <div className="flex items-center justify-center px-2 py-2 text-xs font-bold">
                {row.value}
              </div>
              {OLD_FORM_COLUMNS.map((col) => {
                const isAnswered = typeof oldForm.scoreSelections[col] === 'number'
                const isSelected = oldForm.scoreSelections[col] === row.value
                const isDisabled = Boolean(readOnly || (oldForm.isSkipped && !isAnswered))
                return (
                  <label
                    key={`${row.key}-${col}`}
                    className={cn(
                      'flex items-center justify-center py-2 transition hover:bg-muted/40',
                      isDisabled
                        ? cn('cursor-not-allowed', readOnly ? 'opacity-80' : 'opacity-45')
                        : 'cursor-pointer'
                    )}
                  >
                    <AssessmentChoiceControl
                      checked={isSelected}
                      disabled={isDisabled}
                      label={`${col} - ${row.value}`}
                      scoreValue={row.value}
                      onToggle={() => onScoreSelect(col, row.value)}
                    />
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
