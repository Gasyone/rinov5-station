'use client'

import React, { useState } from 'react'
import { Star, Check, AlertCircle, ChevronDown, ChevronUp, Edit3, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CAMBRIDGE_SUGGESTIONS } from '../cambridgeFeedbackConstants'
import { MATH_THINKING_SKILLS } from '../mathThinkingTypes'
import type { LiveConclusionStudentEval } from './liveTeachingTypes'

interface LiveConclusionSkillsCardProps {
  studentId: string
  evalData: LiveConclusionStudentEval
  isMath: boolean
  onUpdateField: <K extends keyof LiveConclusionStudentEval>(
    studentId: string,
    field: K,
    value: LiveConclusionStudentEval[K]
  ) => void
}

interface SkillItemConfig {
  key: string
  label: string
  icon?: string
}

const ENGLISH_SKILLS: SkillItemConfig[] = [
  { key: 'vocabulary', label: '1. Vocabulary (Từ vựng)' },
  { key: 'grammar', label: '2. Grammar / Mẫu câu' },
  { key: 'speaking', label: '3. Speaking & Fluency' },
  { key: 'pronunciation', label: '4. Pronunciation (Phát âm)' },
]

const MATH_SKILLS: SkillItemConfig[] = [
  { key: 'mathBasic', label: '1. Tư duy cơ bản' },
  { key: 'mathLogic', label: '2. Tư duy Logic' },
  { key: 'mathMath', label: '3. Tư duy Toán học' },
  { key: 'mathCreative', label: '4. Sáng tạo Domino' },
  { key: 'mathCritical', label: '5. Phản biện GQVĐ' },
]

const parseSelectedNotes = (notesStr?: string, knownOptions: string[] = []): string[] => {
  if (!notesStr || !notesStr.trim()) return []
  if (notesStr.includes(';')) {
    return notesStr.split(';').map((s) => s.trim()).filter(Boolean)
  }
  if (knownOptions.includes(notesStr.trim())) {
    return [notesStr.trim()]
  }
  if (notesStr.includes(',')) {
    return notesStr.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return [notesStr.trim()]
}

export function LiveConclusionSkillsCard({
  studentId,
  evalData,
  isMath,
  onUpdateField,
}: LiveConclusionSkillsCardProps) {
  // Support independent expand/collapse per skill
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({})

  // Custom options added via "+ Thêm" per skill: { [skillKey]: { good: string[], improve: string[] } }
  const [customOptions, setCustomOptions] = useState<
    Record<string, { good: string[]; improve: string[] }>
  >({})

  // Inline input state for adding a new option
  const [addingState, setAddingState] = useState<{
    skillKey: string
    type: 'good' | 'improve'
  } | null>(null)
  const [newOptionText, setNewOptionText] = useState('')

  const skillsList = isMath ? MATH_SKILLS : ENGLISH_SKILLS

  const handleRateSkill = (skillKey: string, star: number) => {
    onUpdateField(studentId, skillKey as keyof LiveConclusionStudentEval, star)
    setExpandedSkills((prev) => ({
      ...prev,
      [skillKey]: true,
    }))
  }

  const handleToggleExpand = (skillKey: string) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [skillKey]: !prev[skillKey],
    }))
  }

  // Get full suggestions for this skill and current rating
  const getSuggestions = (skillKey: string, rating: number) => {
    if (isMath) {
      const match = MATH_THINKING_SKILLS.find((m) => m.ratingKey === skillKey)
      return {
        good: match?.suggestions?.strength || [
          'Tiếp thu bài học nhanh',
          'Quan sát tốt',
          'Tính toán chính xác',
        ],
        improve: match?.suggestions?.weakness || [
          'Cần nháp cẩn thận',
          'Cần tập trung hơn',
          'Chú ý bước giải',
        ],
      }
    }
    const cambridgeSkill = skillKey as 'vocabulary' | 'grammar' | 'speaking' | 'pronunciation'
    const match = CAMBRIDGE_SUGGESTIONS[cambridgeSkill]?.[rating || 4]
    return {
      good: match?.good || ['Nói tự tin, rõ ràng', 'Hiểu bài nhanh', 'Ghi nhớ tốt'],
      improve: match?.improve || ['Nói to hơn', 'Luyện thêm âm đuôi', 'Nói tròn câu'],
    }
  }

  // Toggle selection for positive / strength option
  const handleToggleGoodOption = (skillKey: string, opt: string, knownOptions: string[]) => {
    const currentSelected = parseSelectedNotes(evalData.skillGoodNotes?.[skillKey], knownOptions)
    const isSelected = currentSelected.includes(opt)
    const nextSelected = isSelected
      ? currentSelected.filter((item) => item !== opt)
      : [...currentSelected, opt]

    onUpdateField(studentId, 'skillGoodNotes', {
      ...(evalData.skillGoodNotes || {}),
      [skillKey]: nextSelected.join('; '),
    })
  }

  // Toggle selection for improvement option
  const handleToggleImproveOption = (skillKey: string, opt: string, knownOptions: string[]) => {
    const currentSelected = parseSelectedNotes(evalData.skillImproveNotes?.[skillKey], knownOptions)
    const isSelected = currentSelected.includes(opt)
    const nextSelected = isSelected
      ? currentSelected.filter((item) => item !== opt)
      : [...currentSelected, opt]

    onUpdateField(studentId, 'skillImproveNotes', {
      ...(evalData.skillImproveNotes || {}),
      [skillKey]: nextSelected.join('; '),
    })
  }

  // Confirm adding a new custom option and immediately select it ("chọn thẳng luôn")
  const handleConfirmAddOption = (
    skillKey: string,
    type: 'good' | 'improve',
    knownOptions: string[]
  ) => {
    const text = newOptionText.trim()
    if (!text) {
      setAddingState(null)
      setNewOptionText('')
      return
    }

    // 1. Add to customOptions
    setCustomOptions((prev) => ({
      ...prev,
      [skillKey]: {
        good:
          type === 'good'
            ? Array.from(new Set([...(prev[skillKey]?.good || []), text]))
            : prev[skillKey]?.good || [],
        improve:
          type === 'improve'
            ? Array.from(new Set([...(prev[skillKey]?.improve || []), text]))
            : prev[skillKey]?.improve || [],
      },
    }))

    // 2. Immediately select it ("chọn thẳng luôn")
    if (type === 'good') {
      const currentSelected = parseSelectedNotes(evalData.skillGoodNotes?.[skillKey], knownOptions)
      if (!currentSelected.includes(text)) {
        const nextSelected = [...currentSelected, text]
        onUpdateField(studentId, 'skillGoodNotes', {
          ...(evalData.skillGoodNotes || {}),
          [skillKey]: nextSelected.join('; '),
        })
      }
    } else {
      const currentSelected = parseSelectedNotes(
        evalData.skillImproveNotes?.[skillKey],
        knownOptions
      )
      if (!currentSelected.includes(text)) {
        const nextSelected = [...currentSelected, text]
        onUpdateField(studentId, 'skillImproveNotes', {
          ...(evalData.skillImproveNotes || {}),
          [skillKey]: nextSelected.join('; '),
        })
      }
    }

    // 3. Reset adding state
    setAddingState(null)
    setNewOptionText('')
  }

  // Delete a custom option
  const handleDeleteCustomOption = (
    skillKey: string,
    type: 'good' | 'improve',
    tag: string,
    knownOptions: string[]
  ) => {
    // Remove from customOptions
    setCustomOptions((prev) => ({
      ...prev,
      [skillKey]: {
        good:
          type === 'good'
            ? (prev[skillKey]?.good || []).filter((t) => t !== tag)
            : prev[skillKey]?.good || [],
        improve:
          type === 'improve'
            ? (prev[skillKey]?.improve || []).filter((t) => t !== tag)
            : prev[skillKey]?.improve || [],
      },
    }))

    // Remove from selected
    if (type === 'good') {
      const currentSelected = parseSelectedNotes(evalData.skillGoodNotes?.[skillKey], knownOptions)
      if (currentSelected.includes(tag)) {
        const nextSelected = currentSelected.filter((t) => t !== tag)
        onUpdateField(studentId, 'skillGoodNotes', {
          ...(evalData.skillGoodNotes || {}),
          [skillKey]: nextSelected.join('; '),
        })
      }
    } else {
      const currentSelected = parseSelectedNotes(
        evalData.skillImproveNotes?.[skillKey],
        knownOptions
      )
      if (currentSelected.includes(tag)) {
        const nextSelected = currentSelected.filter((t) => t !== tag)
        onUpdateField(studentId, 'skillImproveNotes', {
          ...(evalData.skillImproveNotes || {}),
          [skillKey]: nextSelected.join('; '),
        })
      }
    }
  }

  return (
    <div className="space-y-1.5 text-xs">
      {skillsList.map((skill) => {
        const val =
          (evalData[skill.key as keyof LiveConclusionStudentEval] as number | undefined) || 4
        const isExpanded = Boolean(expandedSkills[skill.key])
        const suggestions = getSuggestions(skill.key, val)

        const goodCustom = customOptions[skill.key]?.good || []
        const improveCustom = customOptions[skill.key]?.improve || []

        const knownGood = Array.from(new Set([...suggestions.good, ...goodCustom]))
        const knownImprove = Array.from(new Set([...suggestions.improve, ...improveCustom]))

        const selectedGood = parseSelectedNotes(evalData.skillGoodNotes?.[skill.key], knownGood)
        const selectedImprove = parseSelectedNotes(
          evalData.skillImproveNotes?.[skill.key],
          knownImprove
        )

        const allGoodOptions = Array.from(new Set([...knownGood, ...selectedGood]))
        const allImproveOptions = Array.from(new Set([...knownImprove, ...selectedImprove]))

        const totalSelected = selectedGood.length + selectedImprove.length
        const hasNotes = totalSelected > 0
        const skillShortName = skill.label.replace(/^\d+\.\s*/, '')

        return (
          <div
            key={skill.key}
            className={cn(
              'rounded-xl border transition-all overflow-hidden',
              isExpanded
                ? isMath
                  ? 'border-blue-300 dark:border-blue-800 bg-white dark:bg-zinc-900 shadow-xs'
                  : 'border-purple-300 dark:border-purple-800 bg-white dark:bg-zinc-900 shadow-xs'
                : 'border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900'
            )}
          >
            {/* Main row: Title, stars, notes count badge, toggle button */}
            <div className="p-2 flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-foreground truncate">
                  {skill.label}
                </span>
                {hasNotes && !isExpanded && (
                  <Badge
                    variant="outline"
                    className="h-4 px-1 text-[8.5px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300 bg-emerald-50/80 shrink-0"
                  >
                    Đã chọn ({totalSelected})
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Rating Stars (1-5★) */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleRateSkill(skill.key, st)}
                      className="p-0.5 focus:outline-none cursor-pointer"
                      title={`Chấm ${st} sao & mở lựa chọn`}
                    >
                      <Star
                        className={cn(
                          'h-3.5 w-3.5 transition-all',
                          st <= val
                            ? isMath
                              ? 'fill-blue-600 text-blue-600 scale-105'
                              : 'fill-purple-600 text-purple-600 scale-105'
                            : 'text-zinc-300 dark:text-zinc-700 hover:text-amber-300'
                        )}
                      />
                    </button>
                  ))}
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold w-4 text-right ml-0.5',
                      isMath
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-purple-700 dark:text-purple-400'
                    )}
                  >
                    {val}
                  </span>
                </div>

                {/* Toggle expand button */}
                <button
                  type="button"
                  onClick={() => handleToggleExpand(skill.key)}
                  className={cn(
                    'ml-1 p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer transition-colors',
                    isExpanded && 'bg-zinc-100 dark:bg-zinc-800 text-foreground'
                  )}
                  title={isExpanded ? 'Thu gọn' : 'Mở rộng lựa chọn kỹ năng này'}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <div className="flex items-center gap-0.5 text-[9.5px] font-medium text-primary">
                      <Edit3 className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* ── EXPANDED PANEL: Direct Choices with + Thêm ── */}
            {isExpanded && (
              <div className="p-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5 bg-zinc-50/50 dark:bg-zinc-950/40 animate-in fade-in duration-150">
                {/* 1. Good points / Strength */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 uppercase">
                      <Check className="h-3 w-3 stroke-[2.5px]" /> Điểm tích cực / thế mạnh (
                      {skillShortName}):
                    </span>
                    {selectedGood.length > 0 && (
                      <span className="text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Đã chọn: {selectedGood.length}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {allGoodOptions.map((tag) => {
                      const isSelected = selectedGood.includes(tag)
                      const isCustom = !suggestions.good.includes(tag)

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleGoodOption(skill.key, tag, knownGood)}
                          className={cn(
                            'inline-flex items-center gap-1 text-[9.5px] rounded-md px-2 py-0.5 font-medium transition-all select-none cursor-pointer',
                            isSelected
                              ? 'bg-emerald-600 text-white border border-emerald-600 shadow-2xs font-semibold hover:bg-emerald-700'
                              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-750 hover:border-emerald-300 hover:text-emerald-700 dark:hover:border-emerald-700 dark:hover:text-emerald-300'
                          )}
                          title={isSelected ? 'Bấm để bỏ chọn' : 'Bấm để chọn'}
                        >
                          {isSelected ? (
                            <Check className="h-2.5 w-2.5 stroke-[3px]" />
                          ) : (
                            <span className="text-zinc-400 font-bold">+</span>
                          )}
                          <span>{tag}</span>
                          {isCustom && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCustomOption(skill.key, 'good', tag, knownGood)
                              }}
                              className={cn(
                                'ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
                                isSelected
                                  ? 'text-white/80 hover:text-white'
                                  : 'text-zinc-400 hover:text-red-500'
                              )}
                              title="Xóa lựa chọn này"
                            >
                              <X className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      )
                    })}

                    {/* Inline Input or + Thêm Button */}
                    {addingState?.skillKey === skill.key && addingState?.type === 'good' ? (
                      <div className="inline-flex items-center gap-1 animate-in fade-in duration-150">
                        <Input
                          autoFocus
                          type="text"
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleConfirmAddOption(skill.key, 'good', knownGood)
                            } else if (e.key === 'Escape') {
                              setAddingState(null)
                              setNewOptionText('')
                            }
                          }}
                          placeholder="Nhập nhận xét mới..."
                          className="h-6 text-[10px] w-36 sm:w-44 px-2 py-0.5 rounded-md border-emerald-400 dark:border-emerald-600 bg-white dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleConfirmAddOption(skill.key, 'good', knownGood)}
                          className="h-6 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Check className="h-3 w-3 stroke-[2.5px]" />
                          <span>Thêm</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingState(null)
                            setNewOptionText('')
                          }}
                          className="h-6 w-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Hủy"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingState({ skillKey: skill.key, type: 'good' })
                          setNewOptionText('')
                        }}
                        className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-dashed border-emerald-300 dark:border-emerald-700 rounded-md px-2 py-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer transition-colors shadow-2xs select-none"
                        title="Thêm lựa chọn nhận xét mới"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Areas to improve */}
                <div className="space-y-1 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 uppercase">
                      <AlertCircle className="h-3 w-3" /> Điểm cần rèn luyện thêm (
                      {skillShortName}):
                    </span>
                    {selectedImprove.length > 0 && (
                      <span className="text-[9.5px] font-semibold text-amber-600 dark:text-amber-400">
                        Đã chọn: {selectedImprove.length}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {allImproveOptions.map((tag) => {
                      const isSelected = selectedImprove.includes(tag)
                      const isCustom = !suggestions.improve.includes(tag)

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleImproveOption(skill.key, tag, knownImprove)}
                          className={cn(
                            'inline-flex items-center gap-1 text-[9.5px] rounded-md px-2 py-0.5 font-medium transition-all select-none cursor-pointer',
                            isSelected
                              ? 'bg-amber-600 text-white border border-amber-600 shadow-2xs font-semibold hover:bg-amber-700'
                              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-750 hover:border-amber-300 hover:text-amber-700 dark:hover:border-amber-700 dark:hover:text-amber-300'
                          )}
                          title={isSelected ? 'Bấm để bỏ chọn' : 'Bấm để chọn'}
                        >
                          {isSelected ? (
                            <Check className="h-2.5 w-2.5 stroke-[3px]" />
                          ) : (
                            <span className="text-zinc-400 font-bold">+</span>
                          )}
                          <span>{tag}</span>
                          {isCustom && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCustomOption(skill.key, 'improve', tag, knownImprove)
                              }}
                              className={cn(
                                'ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
                                isSelected
                                  ? 'text-white/80 hover:text-white'
                                  : 'text-zinc-400 hover:text-red-500'
                              )}
                              title="Xóa lựa chọn này"
                            >
                              <X className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      )
                    })}

                    {/* Inline Input or + Thêm Button */}
                    {addingState?.skillKey === skill.key && addingState?.type === 'improve' ? (
                      <div className="inline-flex items-center gap-1 animate-in fade-in duration-150">
                        <Input
                          autoFocus
                          type="text"
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleConfirmAddOption(skill.key, 'improve', knownImprove)
                            } else if (e.key === 'Escape') {
                              setAddingState(null)
                              setNewOptionText('')
                            }
                          }}
                          placeholder="Nhập nhận xét mới..."
                          className="h-6 text-[10px] w-36 sm:w-44 px-2 py-0.5 rounded-md border-amber-400 dark:border-amber-600 bg-white dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleConfirmAddOption(skill.key, 'improve', knownImprove)}
                          className="h-6 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Check className="h-3 w-3 stroke-[2.5px]" />
                          <span>Thêm</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingState(null)
                            setNewOptionText('')
                          }}
                          className="h-6 w-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Hủy"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingState({ skillKey: skill.key, type: 'improve' })
                          setNewOptionText('')
                        }}
                        className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-dashed border-amber-300 dark:border-amber-700 rounded-md px-2 py-0.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer transition-colors shadow-2xs select-none"
                        title="Thêm lựa chọn nhận xét mới"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
