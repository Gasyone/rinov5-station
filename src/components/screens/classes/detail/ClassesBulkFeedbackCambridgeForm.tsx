'use client'

import { useRef } from 'react'
import { Check, X, Sparkles, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface StudentFormState {
  homeworkApp: string
  homeworkBook: string
  evaluation: number
  strength: string
  weakness: string
  otherNotes: string
  reminders: string[]
  otherReminder: string
  tone: string
  generatedFeedback: string
  isSent: boolean
  vocabulary: number
  grammar: number
  speaking: number
  pronunciation: number
  attitude: number

  // Dynamic sub-notes
  vocabGoodNotes: string
  vocabImproveNotes: string
  grammarGoodNotes: string
  grammarImproveNotes: string
  speakingGoodNotes: string
  speakingImproveNotes: string
  pronGoodNotes: string
  pronImproveNotes: string
}

interface ClassesBulkFeedbackCambridgeFormProps {
  formState: StudentFormState
  onUpdateField: <K extends keyof StudentFormState>(field: K, value: StudentFormState[K]) => void
  onGenerateFeedback: () => void
  onSendFeedback: () => void
  studentName: string
  studentCode: string
  readOnly?: boolean
}

const CAMBRIDGE_HOMEWORK_OPTIONS = [
  { value: 'Done', label: 'Done', type: 'done' },
  { value: 'Partly Done', label: 'Partly Done', type: 'partly' },
  { value: 'Not Yet', label: 'Not Yet', type: 'not_yet' },
  { value: 'No Homework', label: 'No Homework', type: 'none' },
]

const CAMBRIDGE_EVALUATION_OPTIONS = [
  { value: 1, label: '1 - Poor' },
  { value: 2, label: '2 - Needs Improvement' },
  { value: 3, label: '3 - Below Expectations' },
  { value: 4, label: '4 - Meets Expectations' },
  { value: 5, label: '5 - Exceeds Expectations' },
]

const CAMBRIDGE_REMINDERS = [
  "Attend class on time (automatically updated)",
  "Pay more attention and don't do your own work in class",
  "Be confident in interacting with the teacher and classmates in class",
  "Do not turn off the camera frequently",
  "Need a better internet connection",
  "Need to fix camera",
  "Need to fix micro",
  "Avoid studying in noisy and crowded places.",
  "Be polite to teachers",
  "Adjust the camera properly",
  "Sit upright with proper posture",
]

const CAMBRIDGE_SUGGESTIONS: Record<
  'vocabulary' | 'grammar' | 'speaking' | 'pronunciation',
  Record<number, { good: string[]; improve: string[] }>
> = {
  vocabulary: {
    1: {
      good: ['tries to repeat after teacher', 'shows effort in speaking', 'listens and imitates sounds'],
      improve: ['needs strong support to remember words', 'struggles to recall past words', 'forgets quickly after lessons', 'needs more listening and repetition practice', 'limited vocabulary for simple topics']
    },
    2: {
      good: ['recognizes some learned words', 'tries to name pictures with help', 'remembers a few familiar words'],
      improve: ['forgets or mixes up words', 'needs help to pronounce clearly', 'needs more word practice', 'rarely uses learned words', 'depends on teacher\'s support to recall']
    },
    3: {
      good: ['remembers basic words from lessons', 'understands meanings through pictures', 'uses simple familiar words'],
      improve: ['confuses old and new words', 'forgets words without review', 'needs support to use words in context', 'needs regular vocabulary revision', 'slow to recall new vocabulary']
    },
    4: {
      good: ['uses familiar words correctly', 'recalls vocabulary from past lessons', 'uses words in short sentences', 'understands teacher\'s prompts easily'],
      improve: ['needs reminders to use full sentences', 'sometimes slow to recall new words', 'can expand vocabulary further']
    },
    5: {
      good: ['uses a wide range of familiar words', 'remembers new words quickly', 'uses vocabulary fluently and accurately', 'recalls past words easily', 'speaks confidently with varied words'],
      improve: ['encourage use in longer or more complex sentences', 'challenge with advanced vocabulary', 'continue expanding word range']
    }
  },
  grammar: {
    1: {
      good: ['tries to repeat short phrases', 'understands simple commands', 'shows effort to speak'],
      improve: ['unable to form short phrases', 'needs more listening and repetition', 'needs help using simple sentences', 'limited sentence awareness']
    },
    2: {
      good: ['follows sentence patterns with help', 'uses short phrases correctly with guidance', 'tries to respond using short patterns'],
      improve: ['needs help forming longer sentences', 'still makes grammar mistakes', 'needs regular review and correction', 'forgets structure easily']
    },
    3: {
      good: ['uses short, correct phrases with help', 'tries to follow sentence patterns', 'applies simple grammar rules'],
      improve: ['still mixes up word order', 'needs consistent review and correction', 'responses lack completeness']
    },
    4: {
      good: ['forms simple sentences clearly', 'applies patterns in different contexts'],
      improve: ['needs to add more complete responses', 'still needs correction on minor errors']
    },
    5: {
      good: ['speaks short sentences naturally', 'adjusts sentence forms correctly', 'applies patterns in different contexts', 'maintains good accuracy'],
      improve: ['maintain accuracy while speaking faster']
    }
  },
  speaking: {
    1: {
      good: ['tries to answer when asked', 'responds with single words', 'shows effort to speak'],
      improve: ['often quiet or shy', 'needs more confidence', 'needs frequent prompting', 'short or unclear answers']
    },
    2: {
      good: ['speaks when prompted', 'answers short questions with help', 'can recall some learned words'],
      improve: ['pauses or stops mid-sentence', 'speaks softly or unclearly', 'needs practice in full answers', 'needs more speaking turns']
    },
    3: {
      good: ['says short learned phrases', 'tries to speak independently', 'uses vocabulary from lessons'],
      improve: ['limited sentence length', 'needs more spontaneous speech', 'may rely on teacher\'s help', 'pronunciation sometimes unclear']
    },
    4: {
      good: ['speaks clearly with correct structure', 'expresses ideas simply', 'joins class speaking confidently'],
      improve: ['needs longer sentences', 'should add more details', 'may hesitate occasionally']
    },
    5: {
      good: ['speaks clearly and naturally', 'uses vocabulary fluently', 'expresses ideas flexibly', 'joins class speaking confidently'],
      improve: ['needs exposure to more speaking tasks']
    }
  },
  pronunciation: {
    1: {
      good: ["tries to copy teacher's sounds", "listens carefully to pronunciation models"],
      improve: ['sounds unclear or incomplete', 'needs slow and repeated drills', 'skips ending sounds', 'confuses similar sounds', 'tone not natural', 'limited awareness of word stress']
    },
    2: {
      good: ['produces some common sounds correctly', 'tries to correct self when guided'],
      improve: ['still confuses several sounds', 'often drops ending sounds', 'tone not natural yet', 'limited awareness of word stress']
    },
    3: {
      good: ['pronounces most learned words clearly', "copies teacher's sounds accurately", 'includes ending sounds with guidance'],
      improve: ['sometimes drops endings', 'needs to improve stress and tone']
    },
    4: {
      good: ['pronounces words clearly and evenly', 'keeps stress and tone', 'includes ending sounds when speaking', 'natural mouth movement'],
      improve: ['needs focus on tricky sounds', 'refine intonation naturally']
    },
    5: {
      good: ['speaks with clear, natural sounds', 'keeps stress and tone well', 'includes all ending sounds', 'shows strong sound awareness'],
      improve: ['refine intonation for expressiveness', 'maintain fluency at higher speed']
    }
  }
}

interface PerformanceEvaluationTagInputProps {
  value: string
  onChange: (newVal: string) => void
  placeholder?: string
  readOnly?: boolean
  theme: 'sky' | 'rose'
}

function PerformanceEvaluationTagInput({
  value,
  onChange,
  placeholder = 'Note ...',
  readOnly = false,
  theme,
}: PerformanceEvaluationTagInputProps) {
  const tags = value ? value.split(',').map((t) => t.trim()).filter(Boolean) : []
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddCustom = (text: string) => {
    if (readOnly) return
    const cleaned = text.trim()
    if (!cleaned) return
    if (tags.includes(cleaned)) return
    const nextTags = [...tags, cleaned]
    onChange(nextTags.join(', '))
  }

  const handleDeleteTag = (index: number) => {
    if (readOnly) return
    const nextTags = tags.filter((_, idx) => idx !== index)
    onChange(nextTags.join(', '))
  }

  const isSky = theme === 'sky'

  const chipBg = isSky
    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/85 hover:bg-sky-100/50'
    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/85 hover:bg-rose-100/50'

  const badgeBg = isSky
    ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-200/50'
    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-200/50'

  return (
    <div
      onClick={() => {
        if (!readOnly) inputRef.current?.focus()
      }}
      className="min-h-9 flex flex-wrap items-center gap-1.5 p-1.5 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] relative cursor-text select-none focus-within:ring-1 focus-within:ring-zinc-950 dark:focus-within:ring-zinc-300 focus-within:border-transparent transition-all"
    >
      {/* First Tag */}
      {tags.length > 0 && (
        <span className={cn("inline-flex items-center gap-1 border rounded px-1.5 py-0.5 font-medium max-w-[140px] shrink-0", chipBg)}>
          <span className="truncate flex-1">{tags[0]}</span>
          {!readOnly && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteTag(0)
              }}
              className="text-muted-foreground hover:text-rose-500 rounded-full focus:outline-none shrink-0"
            >
              <X className="h-3 w-3 stroke-[2.5px]" />
            </button>
          )}
        </span>
      )}

      {/* +N badge with hover list */}
      {tags.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn("relative group border rounded px-1.5 py-0.5 font-bold cursor-pointer transition-all shrink-0", badgeBg)}
        >
          +{tags.length - 1}

          {/* Popup */}
          <div className="absolute z-50 top-full mt-1.5 right-0 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 p-2 rounded-xl shadow-lg w-64 space-y-1 text-left hidden group-hover:block transition-all duration-150">
            <p className="text-[10px] text-muted-foreground font-semibold border-b border-zinc-100 dark:border-zinc-850 pb-1 mb-1.5 px-1">
              Attached tags ({tags.length})
            </p>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-0.5">
              {tags.map((tag, idx) => {
                if (idx === 0) return null
                return (
                  <div key={idx} className={cn("flex items-center justify-between gap-1.5 border rounded px-1.5 py-0.5 font-medium", chipBg)}>
                    <span className="truncate flex-1 text-[11px]">{tag}</span>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTag(idx)
                        }}
                        className="text-muted-foreground hover:text-rose-500 rounded-full focus:outline-none shrink-0"
                      >
                        <X className="h-3 w-3 stroke-[2.5px]" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Custom input */}
      <input
        ref={inputRef}
        type="text"
        disabled={readOnly}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent border-none outline-none min-w-[50px] text-[11px] placeholder:text-muted-foreground focus:ring-0 p-0 h-5"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            const target = e.currentTarget
            handleAddCustom(target.value)
            target.value = ''
          }
        }}
        onBlur={(e) => {
          const target = e.currentTarget
          handleAddCustom(target.value)
          target.value = ''
        }}
      />
    </div>
  )
}

interface PerformanceEvaluationItemProps {
  label: string
  ratingKey: 'vocabulary' | 'grammar' | 'speaking' | 'pronunciation'
  goodNotesKey: 'vocabGoodNotes' | 'grammarGoodNotes' | 'speakingGoodNotes' | 'pronGoodNotes'
  improveNotesKey: 'vocabImproveNotes' | 'grammarImproveNotes' | 'speakingImproveNotes' | 'pronImproveNotes'
  formState: StudentFormState
  onUpdateField: <K extends keyof StudentFormState>(field: K, value: StudentFormState[K]) => void
  readOnly: boolean
}

function PerformanceEvaluationItem({
  label,
  ratingKey,
  goodNotesKey,
  improveNotesKey,
  formState,
  onUpdateField,
  readOnly,
}: PerformanceEvaluationItemProps) {
  const ratingValue = formState[ratingKey] || 0
  const suggestions = ratingValue > 0 ? CAMBRIDGE_SUGGESTIONS[ratingKey]?.[ratingValue] : null

  const handleTagClick = (fieldKey: typeof goodNotesKey | typeof improveNotesKey, tagText: string) => {
    if (readOnly) return
    const currentVal = formState[fieldKey] || ''
    const newVal = currentVal 
      ? (currentVal.endsWith(', ') || currentVal.endsWith(',') ? `${currentVal}${tagText}` : `${currentVal}, ${tagText}`)
      : tagText
    onUpdateField(fieldKey, newVal)
  }

  return (
    <div className="flex flex-col p-2.5 bg-white dark:bg-zinc-900 rounded-xl gap-2 border border-zinc-100 dark:border-zinc-800/50 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
        <span className="text-xs font-bold text-foreground w-[150px] shrink-0 pt-1">{label}</span>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2.5">
          {CAMBRIDGE_EVALUATION_OPTIONS.map((opt) => {
            const isChecked = ratingValue === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                disabled={readOnly}
                onClick={() => onUpdateField(ratingKey, opt.value)}
                className="flex items-center gap-2 text-left text-[11px] transition-all cursor-pointer font-medium hover:text-foreground/80 select-none disabled:cursor-default"
              >
                <span className={cn(
                  "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-2xs bg-background",
                  isChecked ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-300 dark:border-zinc-600"
                )}>
                  {isChecked && <div className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
                </span>
                <span className={cn(isChecked ? "text-foreground font-bold" : "text-muted-foreground")}>
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {ratingValue > 0 && suggestions && (
        <div className="w-full mt-2 bg-orange-50/40 dark:bg-orange-950/10 border border-orange-200/50 p-4 rounded-xl space-y-3">
          <p className="text-xs font-bold text-foreground">
            Note to motivate or help student to improve in areas of weakness (optional)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Good points */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ✅ Good points
              </label>
              <PerformanceEvaluationTagInput
                value={formState[goodNotesKey] || ''}
                onChange={(newVal) => onUpdateField(goodNotesKey, newVal)}
                placeholder="Note ..."
                readOnly={readOnly}
                theme="sky"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestions.good.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleTagClick(goodNotesKey, tag)}
                    className="text-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 rounded-lg px-2 py-0.5 font-medium hover:bg-sky-100 cursor-pointer select-none transition-colors disabled:cursor-default"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Areas to improve */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                ⚠️ Areas to improve
              </label>
              <PerformanceEvaluationTagInput
                value={formState[improveNotesKey] || ''}
                onChange={(newVal) => onUpdateField(improveNotesKey, newVal)}
                placeholder="Note ..."
                readOnly={readOnly}
                theme="rose"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestions.improve.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleTagClick(improveNotesKey, tag)}
                    className="text-[10px] bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 rounded-lg px-2 py-0.5 font-medium hover:bg-rose-100 cursor-pointer select-none transition-colors disabled:cursor-default"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ClassesBulkFeedbackCambridgeForm({
  formState,
  onUpdateField,
  onGenerateFeedback,
  onSendFeedback,
  studentName,
  studentCode,
  readOnly = false,
}: ClassesBulkFeedbackCambridgeFormProps) {

  const handleToggleReminder = (reminder: string) => {
    if (readOnly) return
    const exists = formState.reminders.includes(reminder)
    const nextReminders = exists
      ? formState.reminders.filter((r) => r !== reminder)
      : [...formState.reminders, reminder]
    onUpdateField('reminders', nextReminders)
  }

  return (
    <div className="space-y-4 max-w-[850px] mx-auto pb-4">
      {/* Banner / Current student title */}
      <div className="flex items-center justify-between pb-1.5 shrink-0">
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



      {/* Section 0: Attitude */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          Attitude
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium mr-1.5">
            {formState.attitude === 1 && '1 - Poor'}
            {formState.attitude === 2 && '2 - Needs Improvement'}
            {formState.attitude === 3 && '3 - Below Expectations'}
            {formState.attitude === 4 && '4 - Meets Expectations'}
            {formState.attitude === 5 && '5 - Exceeds Expectations'}
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
                    "h-5 w-5 transition-all",
                    star <= (formState.attitude || 0)
                      ? "fill-amber-400 text-amber-400 scale-110"
                      : "text-zinc-300 dark:text-zinc-650 hover:text-amber-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Homework */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 pb-1 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <span className="text-orange-500 text-sm">✏️</span>
          Homework
        </div>

        <div className="space-y-2">
          {/* App Homework */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 bg-transparent gap-2">
            <span className="text-xs font-bold text-foreground">Exercise on App *</span>
            <div className="flex flex-wrap items-center gap-5">
              {CAMBRIDGE_HOMEWORK_OPTIONS.map((opt) => {
                const isChecked = formState.homeworkApp === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onUpdateField('homeworkApp', opt.value)}
                    className="flex items-center gap-2 text-xs transition-all cursor-pointer select-none disabled:cursor-default"
                  >
                    <span className={cn(
                      "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-2xs bg-background",
                      isChecked ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-300 dark:border-zinc-600"
                    )}>
                      {isChecked && <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
                    </span>
                    {opt.type === 'done' && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Check className="h-3 w-3 stroke-[3px]" /> Done
                      </span>
                    )}
                    {opt.type === 'partly' && (
                      <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <span className="text-[10px] leading-none">♦</span> Partly Done
                      </span>
                    )}
                    {opt.type === 'not_yet' && (
                      <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <X className="h-3 w-3 stroke-[3px]" /> Not Yet
                      </span>
                    )}
                    {opt.type === 'none' && (
                      <span className={cn("text-[11px] font-semibold", isChecked ? "text-foreground font-bold" : "text-muted-foreground")}>
                        No Homework
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Book Homework */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 bg-transparent gap-2">
            <span className="text-xs font-bold text-foreground">Workbook exercise *</span>
            <div className="flex flex-wrap items-center gap-5">
              {CAMBRIDGE_HOMEWORK_OPTIONS.map((opt) => {
                const isChecked = formState.homeworkBook === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onUpdateField('homeworkBook', opt.value)}
                    className="flex items-center gap-2 text-xs transition-all cursor-pointer select-none disabled:cursor-default"
                  >
                    <span className={cn(
                      "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-2xs bg-background",
                      isChecked ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-300 dark:border-zinc-600"
                    )}>
                      {isChecked && <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
                    </span>
                    {opt.type === 'done' && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Check className="h-3 w-3 stroke-[3px]" /> Done
                      </span>
                    )}
                    {opt.type === 'partly' && (
                      <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <span className="text-[10px] leading-none">♦</span> Partly Done
                      </span>
                    )}
                    {opt.type === 'not_yet' && (
                      <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <X className="h-3 w-3 stroke-[3px]" /> Not Yet
                      </span>
                    )}
                    {opt.type === 'none' && (
                      <span className={cn("text-[11px] font-semibold", isChecked ? "text-foreground font-bold" : "text-muted-foreground")}>
                        No Homework
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Performance Evaluation */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 pb-1 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <span className="text-primary text-sm">🚀</span>
          Performance Evaluation
        </div>

        {/* Lesson Summary banner */}
        <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 text-[11px] text-[#0369a1] dark:text-sky-400 whitespace-pre-line leading-relaxed font-medium space-y-0.5">
          <div className="font-bold">Lesson summary:</div>
          <div>{`- Words: inside, outside, stairs, wall\n- Sentences:\nThe cat is in front of/behind the armchair.\nThe cat is between the desk and the chair.\n- Reading`}</div>
        </div>

        {/* Ratings group */}
        <div className="space-y-2">
          {/* Vocabulary */}
          <PerformanceEvaluationItem
            label="Vocabulary *"
            ratingKey="vocabulary"
            goodNotesKey="vocabGoodNotes"
            improveNotesKey="vocabImproveNotes"
            formState={formState}
            onUpdateField={onUpdateField}
            readOnly={readOnly}
          />

          {/* Grammar / Structures */}
          <PerformanceEvaluationItem
            label="Grammar / Structures *"
            ratingKey="grammar"
            goodNotesKey="grammarGoodNotes"
            improveNotesKey="grammarImproveNotes"
            formState={formState}
            onUpdateField={onUpdateField}
            readOnly={readOnly}
          />

          {/* Speaking */}
          <PerformanceEvaluationItem
            label="Speaking *"
            ratingKey="speaking"
            goodNotesKey="speakingGoodNotes"
            improveNotesKey="speakingImproveNotes"
            formState={formState}
            onUpdateField={onUpdateField}
            readOnly={readOnly}
          />

          {/* Pronunciation */}
          <PerformanceEvaluationItem
            label="Pronunciation *"
            ratingKey="pronunciation"
            goodNotesKey="pronGoodNotes"
            improveNotesKey="pronImproveNotes"
            formState={formState}
            onUpdateField={onUpdateField}
            readOnly={readOnly}
          />
        </div>

        {/* Other text field */}
        <div className="py-1.5 bg-transparent space-y-1">
          <label className="text-[11px] font-bold text-foreground uppercase tracking-wide">Other</label>
          <Input
            value={formState.otherNotes}
            onChange={(e) => onUpdateField('otherNotes', e.target.value)}
            disabled={readOnly}
            placeholder="Note ..."
            className="text-[11px] h-8 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-lg"
          />
        </div>
      </div>

      {/* Section 3: Reminder */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground pb-1">
          <span className="text-amber-500 text-sm">⚠️</span>
          Reminder
        </div>
        <div className="py-1.5 bg-transparent space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {CAMBRIDGE_REMINDERS.map((reminder) => {
              const isChecked = formState.reminders.includes(reminder)
              return (
                <div
                  key={reminder}
                  onClick={() => handleToggleReminder(reminder)}
                  className="flex items-start gap-2 cursor-pointer text-xs select-none hover:text-primary transition-colors text-muted-foreground"
                >
                  <div className={cn(
                    "h-4 w-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                    isChecked ? "bg-primary border-primary text-white" : "border-zinc-300 bg-background"
                  )}>
                    {isChecked && <Check className="h-3 w-3 stroke-[3px]" />}
                  </div>
                  <span className={cn(isChecked && "text-foreground font-medium")}>{reminder}</span>
                </div>
              )
            })}
          </div>
          <div className="space-y-1 pt-1">
            <Input
              value={formState.otherReminder}
              onChange={(e) => onUpdateField('otherReminder', e.target.value)}
              disabled={readOnly}
              placeholder="other issues ..."
              className="text-[11px] h-8.5 bg-background"
            />
          </div>
        </div>
      </div>

      {/* Section 4: AI Editor Controls */}
      <div className="space-y-2.5">
        {!readOnly && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold text-foreground">Writing tone:</span>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateField('tone', 'friendly')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none"
                >
                  <div className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    formState.tone === 'friendly' ? "border-[#e11d48] text-[#e11d48]" : "border-zinc-300"
                  )}>
                    {formState.tone === 'friendly' && <div className="h-2 w-2 rounded-full bg-[#e11d48]" />}
                  </div>
                  <span className={cn(formState.tone === 'friendly' && "text-foreground font-medium")}>Friendly</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateField('tone', 'formal')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none"
                >
                  <div className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    formState.tone === 'formal' ? "border-primary text-primary" : "border-zinc-300"
                  )}>
                    {formState.tone === 'formal' && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <span className={cn(formState.tone === 'formal' && "text-foreground font-medium")}>Formal</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {formState.generatedFeedback ? (
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  3 tries left!
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  You can regenerate feedback 2 more times
                </span>
              )}
              <Button
                onClick={onGenerateFeedback}
                className="gap-1.5 text-xs h-7.5 px-3 rounded-xl"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Generate Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Feedback preview & edit */}
        <div className="space-y-1.5">
          <Textarea
            value={formState.generatedFeedback}
            onChange={(e) => onUpdateField('generatedFeedback', e.target.value)}
            readOnly={readOnly}
            placeholder="Nội dung nhận xét chi tiết..."
            className="text-[11px] min-h-[120px] bg-background border-zinc-200 font-sans leading-relaxed rounded-xl shadow-2xs focus-visible:ring-primary/20"
          />
        </div>

        {/* Submission row */}
        <div className="pt-2 flex items-center justify-between">
          {!readOnly && (
            <Button
              onClick={onSendFeedback}
              className="h-8 px-5 text-xs font-semibold rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white shrink-0"
            >
              Send
            </Button>
          )}

          {formState.isSent && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <Check className="h-4 w-4 stroke-[3px]" />
              Sent
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
