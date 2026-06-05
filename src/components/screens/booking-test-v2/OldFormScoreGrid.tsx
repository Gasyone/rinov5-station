'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
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
}

function formatOldFormPointLabel(value: number): string {
  return value === 0.5 ? '0,5' : String(value)
}

export function OldFormScoreGrid({
  oldForm,
  resultHref,
  readOnly,
  onScoreSelect,
  onToggleSkip,
  totalScore,
}: OldFormScoreGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-8">
          <p className="text-lg font-bold">
            Chấm điểm : <span className="text-primary">{formatAssessmentScore(totalScore)}</span> / 32
          </p>
          <p className="text-lg font-bold">Speaking Level :</p>
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
            {oldForm.isSkipped ? 'ĐÃ BỎ QUA' : 'TÍCH BỎ QUA'}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg bg-background ring-1 ring-border/70">
        <div className="grid min-w-[1180px] grid-cols-[5rem_1fr]">
          <div className="row-span-4 flex items-center justify-center bg-muted px-2 text-sm font-bold">
            Điểm
          </div>
          <div className="grid grid-cols-[2.5rem_repeat(32,minmax(2.5rem,1fr))] bg-background">
            <div />
            {OLD_FORM_COLUMNS.map((col) => (
              <div key={col} className="flex items-center justify-center py-3 text-sm">
                {col}
              </div>
            ))}
          </div>

          {SCORE_ROW_OPTIONS.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[2.5rem_repeat(32,minmax(2.5rem,1fr))] border-t border-border/40 bg-background"
            >
              <div className="flex items-center justify-center text-sm">
                {formatOldFormPointLabel(row.value)}
              </div>
              {OLD_FORM_COLUMNS.map((col) => {
                const isAnswered = typeof oldForm.scoreSelections[col] === 'number'
                const isSelected = oldForm.scoreSelections[col] === row.value
                const isDisabled = Boolean(readOnly || (oldForm.isSkipped && !isAnswered))
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
                      label={`${col} - ${formatOldFormPointLabel(row.value)}`}
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
