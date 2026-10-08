'use client'

import React, { useState, useMemo, useId } from 'react'
import { Check, Plus, X, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StudentFormState } from './classesBulkFeedbackTypes'
import {
  MATH_EVALUATION_OPTIONS,
  MathThinkingSkillConfig,
} from './mathThinkingTypes'

interface SkillOptionSelectorProps {
  label: string
  icon: React.ReactNode
  labelColor: 'emerald' | 'amber'
  defaultSuggestions: string[]
  customOptions?: string[]
  value: string
  onChange: (newValue: string) => void
  onAddCustom?: (text: string) => void
  onRemoveCustom?: (text: string) => void
  readOnly?: boolean
}

/**
 * Smart parser that safely splits comma or semicolon separated values,
 * while preserving known suggestions that contain internal commas.
 */
export function parseSelectedOptions(value: string, knownSuggestions: string[]): string[] {
  if (!value || !value.trim()) return []

  // If semicolon is used as delimiter
  if (value.includes(';')) {
    return value
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  // If matches exactly one known suggestion
  if (knownSuggestions.includes(value.trim())) {
    return [value.trim()]
  }

  // Greedily match known suggestions from longest to shortest
  const sorted = [...knownSuggestions].filter(Boolean).sort((a, b) => b.length - a.length)
  let remaining = value.trim()
  const matched: string[] = []

  for (const sug of sorted) {
    if (sug && remaining.includes(sug)) {
      matched.push(sug)
      remaining = remaining.replace(sug, '').trim()
    }
  }

  // Any remaining fragments separated by comma
  if (remaining) {
    const leftovers = remaining
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && s !== ';')
    matched.push(...leftovers)
  }

  if (matched.length > 0) {
    return matched
  }

  return [value.trim()]
}

export function SkillOptionSelector({
  label,
  icon,
  labelColor,
  defaultSuggestions,
  customOptions = [],
  value,
  onChange,
  onAddCustom,
  onRemoveCustom,
  readOnly = false,
}: SkillOptionSelectorProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const datalistId = useId()

  const allKnown = useMemo(() => {
    return Array.from(new Set([...defaultSuggestions, ...customOptions]))
  }, [defaultSuggestions, customOptions])

  const selectedItems = useMemo(() => {
    return parseSelectedOptions(value, allKnown)
  }, [value, allKnown])

  const handleRemoveOption = (opt: string) => {
    if (readOnly) return
    onRemoveCustom?.(opt)
    const next = selectedItems.filter((i) => i !== opt)
    onChange(next.join(', '))
  }

  const handleAddSubmit = () => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    onAddCustom?.(trimmed)
    if (!selectedItems.includes(trimmed)) {
      const next = [...selectedItems, trimmed]
      onChange(next.join(', '))
    }
    setCustomInput('')
    setIsAdding(false)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide',
            labelColor === 'emerald'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400'
          )}
        >
          {icon}
          <span>{label}</span>
          {selectedItems.length > 0 && (
            <span
              className={cn(
                'ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold leading-none',
                labelColor === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              )}
            >
              {selectedItems.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {selectedItems.map((opt) => (
          <span
            key={opt}
            className={cn(
              'text-xs px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1.5 select-none font-medium shadow-2xs',
              labelColor === 'emerald'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
            )}
          >
            <Check
              className={cn(
                'h-3 w-3 stroke-[3px] shrink-0',
                labelColor === 'emerald'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}
            />
            <span>{opt}</span>
            {!readOnly && (
              <button
                type="button"
                onClick={() => handleRemoveOption(opt)}
                className="text-muted-foreground/60 hover:text-rose-500 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
                title="Xóa lựa chọn này"
              >
                <X className="h-2.5 w-2.5 stroke-[2.5px]" />
              </button>
            )}
          </span>
        ))}

        {!readOnly && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="border border-dashed border-zinc-300 dark:border-zinc-700 text-muted-foreground hover:text-foreground hover:border-zinc-400 bg-transparent text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Thêm</span>
          </button>
        )}
      </div>

      {isAdding && !readOnly && (
        <div className="flex items-center gap-1.5 pt-1 w-full max-w-md">
          <Input
            type="text"
            autoFocus
            list={datalistId}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSubmit()
              } else if (e.key === 'Escape') {
                setIsAdding(false)
                setCustomInput('')
              }
            }}
            placeholder="Nhập nội dung nhận xét..."
            className="h-8 text-xs bg-background border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5"
          />
          <datalist id={datalistId}>
            {defaultSuggestions.map((sug) => (
              <option key={sug} value={sug} />
            ))}
          </datalist>
          <Button
            type="button"
            size="sm"
            onClick={handleAddSubmit}
            className="h-8 px-3 text-xs shrink-0 rounded-lg"
          >
            Thêm
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false)
              setCustomInput('')
            }}
            className="h-8 px-2 text-xs shrink-0 text-muted-foreground hover:text-foreground"
          >
            Hủy
          </Button>
        </div>
      )}
    </div>
  )
}

export interface MathThinkingSkillItemProps {
  skill: MathThinkingSkillConfig
  formState: StudentFormState
  onUpdateField: (field: keyof StudentFormState, value: StudentFormState[keyof StudentFormState]) => void
  readOnly: boolean
  errorMessage?: string
  customOptions?: { strength: string[]; weakness: string[] }
  onAddCustomOption?: (skillId: string, type: 'strength' | 'weakness', text: string) => void
  onRemoveCustomOption?: (skillId: string, type: 'strength' | 'weakness', text: string) => void
}

export function MathThinkingSkillItem({
  skill,
  formState,
  onUpdateField,
  readOnly,
  errorMessage,
  customOptions,
  onAddCustomOption,
  onRemoveCustomOption,
}: MathThinkingSkillItemProps) {
  const currentRating = formState[skill.ratingKey] as number | undefined
  const strengthValue = (formState[skill.strengthKey] as string) || ''
  const weaknessValue = (formState[skill.weaknessKey] as string) || ''

  return (
    <div
      className={cn(
        'p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-3 transition-all shadow-2xs',
        errorMessage && 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-300/80 dark:border-rose-800/80'
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

      {/* 2 mục Thành thạo & Cần luyện thêm: không cần viền */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <SkillOptionSelector
          label="Thành thạo"
          icon={<Check className="h-3.5 w-3.5 stroke-[3px]" />}
          labelColor="emerald"
          defaultSuggestions={skill.suggestions.strength}
          customOptions={customOptions?.strength || []}
          value={strengthValue}
          onChange={(newVal) => onUpdateField(skill.strengthKey, newVal)}
          onAddCustom={(text) => onAddCustomOption?.(skill.id, 'strength', text)}
          onRemoveCustom={(text) => onRemoveCustomOption?.(skill.id, 'strength', text)}
          readOnly={readOnly}
        />

        <SkillOptionSelector
          label="Cần luyện thêm"
          icon={<span className="text-xs">⚠️</span>}
          labelColor="amber"
          defaultSuggestions={skill.suggestions.weakness}
          customOptions={customOptions?.weakness || []}
          value={weaknessValue}
          onChange={(newVal) => onUpdateField(skill.weaknessKey, newVal)}
          onAddCustom={(text) => onAddCustomOption?.(skill.id, 'weakness', text)}
          onRemoveCustom={(text) => onRemoveCustomOption?.(skill.id, 'weakness', text)}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}
