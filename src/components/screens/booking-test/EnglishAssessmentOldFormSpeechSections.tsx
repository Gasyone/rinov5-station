'use client'

import type { ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  FLUENCY_PAIRS,
  PRONUNCIATION_ERROR_OPTIONS,
} from './bookingTestConstants'
import { AssessmentChoiceControl } from './AssessmentChoiceControl'
import type { AssessmentOldFormDraft } from './bookingTestTypes'

interface SpeechSectionsProps {
  oldForm: AssessmentOldFormDraft
  readOnly?: boolean
  updateOldForm: (updates: Partial<AssessmentOldFormDraft>) => void
  toggleArrayField: (field: keyof AssessmentOldFormDraft, key: string) => void
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h4 className="text-base font-semibold text-foreground">{children}</h4>
}

function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[14rem_1fr] lg:gap-4">
      <span className="self-center text-sm text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  )
}

export function EnglishAssessmentOldFormSpeechSections({
  oldForm,
  readOnly,
  updateOldForm,
  toggleArrayField,
}: SpeechSectionsProps) {
  return (
    <>
      <section className="space-y-4">
        <SectionLabel>Phát âm</SectionLabel>
        <FormRow label="Lỗi phát âm thường gặp">
          <div className="flex flex-wrap items-center gap-2">
            {PRONUNCIATION_ERROR_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  'flex min-h-10 items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-sm transition',
                  readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={oldForm.pronunciationErrors.includes(option.key)}
                  disabled={readOnly}
                  onCheckedChange={() => toggleArrayField('pronunciationErrors', option.key)}
                  className="shrink-0"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </FormRow>
        <FormRow label="Chi tiết phát âm">
          <Textarea
            rows={3}
            placeholder="Mô tả chi tiết lỗi phát âm..."
            value={oldForm.pronunciationDetail}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ pronunciationDetail: event.target.value })}
            className="resize-none"
          />
        </FormRow>
      </section>

      <section className="space-y-4">
        <SectionLabel>Độ lưu loát</SectionLabel>
        <div className="space-y-2">
          {FLUENCY_PAIRS.map((pair) => (
            <div key={pair.key} className="grid gap-2 sm:grid-cols-2">
              {[
                { value: 'positive' as const, label: pair.positive },
                { value: 'negative' as const, label: pair.negative },
              ].map((option) => {
                const isSelected = oldForm.fluencyAnswers[pair.key] === option.value
                return (
                  <label
                    key={`${pair.key}-${option.value}`}
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
                          fluencyAnswers: {
                            ...oldForm.fluencyAnswers,
                            [pair.key]: isSelected ? '' : option.value,
                          },
                        })
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionLabel>Nhận xét chung</SectionLabel>
        <FormRow label="Đánh giá tổng quan">
          <Textarea
            rows={4}
            placeholder="Nhận xét chung về buổi đánh giá..."
            value={oldForm.generalComment}
            disabled={readOnly}
            onChange={(event) => updateOldForm({ generalComment: event.target.value })}
            className="resize-none"
          />
        </FormRow>
      </section>
    </>
  )
}
