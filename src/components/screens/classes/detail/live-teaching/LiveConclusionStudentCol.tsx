'use client'

import React, { useState } from 'react'
import { Star, ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { RosterStudent } from '../classesDetailTypes'
import { getAvatarColor, getInitials } from '../classesSessionDetailHelpers'
import { getStudentNameParts } from '../classesDetailHelpers'
import { CAMBRIDGE_REMINDERS } from '../cambridgeFeedbackConstants'
import type { LiveConclusionStudentEval, LiveQuickTag } from './liveTeachingTypes'

interface LiveConclusionStudentColProps {
  student: RosterStudent
  evalData: LiveConclusionStudentEval
  appliedTags: LiveQuickTag[]
  liveNote?: string
  isDone: boolean
  onUpdateField: <K extends keyof LiveConclusionStudentEval>(
    studentId: string,
    field: K,
    value: LiveConclusionStudentEval[K]
  ) => void
}

const HOMEWORK_PILL_OPTIONS = [
  { value: 'Done', label: 'Hoàn thành', activeClass: 'bg-emerald-600 text-white border-emerald-600' },
  { value: 'Partly Done', label: '1 phần', activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'Not Yet', label: 'Chưa làm', activeClass: 'bg-rose-500 text-white border-rose-500' },
  { value: 'No Homework', label: 'K.có', activeClass: 'bg-zinc-600 text-white border-zinc-600' },
]

export function LiveConclusionStudentCol({
  student,
  evalData,
  appliedTags,
  liveNote,
  isDone,
  onUpdateField,
}: LiveConclusionStudentColProps) {
  const [isReminderOpen, setIsReminderOpen] = useState(false)
  const nameParts = getStudentNameParts(student)
  const selectedReminders = evalData.reminders || []

  const handleToggleReminder = (rem: string) => {
    const exists = selectedReminders.includes(rem)
    const next = exists ? selectedReminders.filter((r) => r !== rem) : [...selectedReminders, rem]
    onUpdateField(student.id, 'reminders', next)
  }

  return (
    <div className="space-y-2.5 text-xs">
      {/* ── 1. Student Identity Header ── */}
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs',
            getAvatarColor(student.id)
          )}
        >
          {getInitials(nameParts.hasEnglishName ? nameParts.englishName! : student.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-xs text-foreground truncate">
              {nameParts.hasEnglishName
                ? `${nameParts.englishName} (${nameParts.vietnameseName})`
                : nameParts.vietnameseName}
            </p>
            {isDone && (
              <span
                className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs"
                title="Đã hoàn thành nhận xét"
              >
                <Check className="h-2.5 w-2.5 stroke-[3px]" />
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground">{student.code}</p>
        </div>
      </div>

      {/* Tags collected during class */}
      <div className="flex flex-wrap items-center gap-1 pt-0.5">
        {appliedTags.length > 0 ? (
          appliedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className={cn('text-[10px] font-semibold px-1.5 py-0 rounded-md', tag.colorClass)}
            >
              {tag.icon} {tag.shortLabel}
            </Badge>
          ))
        ) : (
          <span className="text-[10px] text-muted-foreground italic">Chưa có tag trong giờ</span>
        )}
      </div>

      {liveNote && (
        <div className="text-[10.5px] bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 p-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 line-clamp-2">
          📌 <strong>Tốc ký:</strong> {liveNote}
        </div>
      )}

      {/* ── 2. Attitude (Thái độ học tập 1-5 sao) ── */}
      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            Thái độ ({evalData.attitude || 4}★)
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {evalData.attitude === 5
              ? 'Tích cực'
              : evalData.attitude === 4
                ? 'Tốt'
                : evalData.attitude === 3
                  ? 'Bình thường'
                  : 'Cần chú ý'}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onUpdateField(student.id, 'attitude', star)}
              className="p-0.5 focus:outline-none cursor-pointer"
              title={`${star} sao`}
            >
              <Star
                className={cn(
                  'h-4 w-4 transition-all',
                  star <= (evalData.attitude || 4)
                    ? 'fill-amber-400 text-amber-400 scale-105'
                    : 'text-zinc-300 dark:text-zinc-700 hover:text-amber-300'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Dual Homework: App & Book ── */}
      <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
        {/* App HW */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            📱 BTVN App:
          </span>
          <div className="flex items-center gap-0.5">
            {HOMEWORK_PILL_OPTIONS.map((opt) => {
              const isSelected = (evalData.homeworkApp || 'Done') === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdateField(student.id, 'homeworkApp', opt.value)}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[9.5px] font-bold border transition-all cursor-pointer',
                    isSelected
                      ? `${opt.activeClass} shadow-2xs`
                      : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100'
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Book HW */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            📖 BTVN Sách:
          </span>
          <div className="flex items-center gap-0.5">
            {HOMEWORK_PILL_OPTIONS.map((opt) => {
              const isSelected = (evalData.homeworkBook || 'Done') === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdateField(student.id, 'homeworkBook', opt.value)}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[9.5px] font-bold border transition-all cursor-pointer',
                    isSelected
                      ? `${opt.activeClass} shadow-2xs`
                      : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100'
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Nền nếp & Nhắc nhở (Default Collapsed) ── */}
      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setIsReminderOpen(!isReminderOpen)}
          className={cn(
            'w-full flex items-center justify-between px-2 py-1 rounded-lg border text-[10.5px] font-semibold transition-colors cursor-pointer',
            selectedReminders.length > 0
              ? 'bg-amber-50 dark:bg-amber-950/25 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
              : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100'
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            <AlertTriangle
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                selectedReminders.length > 0 ? 'text-amber-500' : 'text-zinc-400'
              )}
            />
            <span className="truncate">Nền nếp & Nhắc nhở</span>
            {selectedReminders.length > 0 && (
              <Badge className="h-3.5 px-1 text-[8.5px] font-bold bg-amber-500 text-white rounded-full shrink-0">
                {selectedReminders.length}
              </Badge>
            )}
          </span>
          {isReminderOpen ? <ChevronUp className="h-3.5 w-3.5 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0" />}
        </button>

        {/* Collapsed preview */}
        {!isReminderOpen && selectedReminders.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {selectedReminders.slice(0, 2).map((rem, idx) => (
              <span
                key={idx}
                className="text-[9px] text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/60 truncate max-w-[190px]"
              >
                • {rem}
              </span>
            ))}
            {selectedReminders.length > 2 && (
              <span className="text-[9px] text-muted-foreground font-medium">
                +{selectedReminders.length - 2} khác
              </span>
            )}
          </div>
        )}

        {/* Expanded Reminders Panel */}
        {isReminderOpen && (
          <div className="mt-1.5 p-2 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-amber-200/40">
              <span className="text-[9.5px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                Chọn nhắc nhở nề nếp:
              </span>
              <button
                type="button"
                onClick={() => setIsReminderOpen(false)}
                className="text-[9.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Đóng ▴
              </button>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar pr-0.5">
              {CAMBRIDGE_REMINDERS.map((reminder) => {
                const isChecked = selectedReminders.includes(reminder)
                return (
                  <div
                    key={reminder}
                    onClick={() => handleToggleReminder(reminder)}
                    className="flex items-start gap-1.5 cursor-pointer text-[10px] select-none hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
                  >
                    <div
                      className={cn(
                        'h-3 w-3 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                      )}
                    >
                      {isChecked && <Check className="h-2 w-2 stroke-[3px]" />}
                    </div>
                    <span
                      className={cn(
                        'leading-tight',
                        isChecked
                          ? 'font-bold text-amber-900 dark:text-amber-200'
                          : 'text-zinc-600 dark:text-zinc-400'
                      )}
                    >
                      {reminder}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="pt-0.5">
              <Input
                value={evalData.otherReminder || ''}
                onChange={(e) => onUpdateField(student.id, 'otherReminder', e.target.value)}
                placeholder="Nhắc nhở khác..."
                className="text-[9.5px] h-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
