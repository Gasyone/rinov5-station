'use client'

import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { ClassSession } from '@/mocks/calendarSchedule'

interface ProgramLevelTreeFilterProps {
  subjects: string[]
  levelsBySubject: Record<string, string[]>
  allSessions?: ClassSession[]
  selectedSubjectLevels: Record<string, string[]>
  onToggleSubject: (subject: string) => void
  onToggleLevel: (subject: string, level: string) => void
  searchable?: boolean
  showCount?: boolean
}

/**
 * ProgramLevelTreeFilter:
 * Cấu trúc TreeView chọn Chương trình & Trình độ (chuẩn hóa tương tự Cơ sở & Phòng học).
 * - Cấp cha: Chương trình / Môn học (VD: Tiếng Anh, Toán tư duy...)
 * - Cấp con: Trình độ (VD: Pre-K, Level 1, Level 2, Lớp 1, Lớp 2...)
 * - Hỗ trợ mở rộng / thu gọn, chọn nhanh toàn bộ hoặc từng trình độ (indeterminate state).
 */
export function ProgramLevelTreeFilter({
  subjects,
  levelsBySubject,
  allSessions,
  selectedSubjectLevels,
  onToggleSubject,
  onToggleLevel,
  showCount = false,
}: ProgramLevelTreeFilterProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    // Mặc định mở rộng tất cả chương trình để người dùng dễ dàng thao tác
    const initial: Record<string, boolean> = {}
    subjects.forEach((s) => {
      initial[s] = true
    })
    return initial
  })

  const toggleExpand = (subject: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }))
  }

  return (
    <div className="space-y-1 pt-1">
      <div className="space-y-1">
        {subjects.map((subject) => {
          const levels = levelsBySubject[subject] || []
          const selectedLevels = selectedSubjectLevels[subject] || []
          const isFullyChecked = levels.length > 0 && levels.every((lvl) => selectedLevels.includes(lvl))
          const isPartiallyChecked = !isFullyChecked && selectedLevels.length > 0
          const isExpanded = Boolean(expandedSubjects[subject])

          const subjectSessionCount = allSessions
            ? allSessions.filter((s) => s.subject === subject).length
            : 0

          return (
            <div key={subject} className="rounded-md transition-colors">
              {/* Parent: Chương trình / Môn học */}
              <div
                className={cn(
                  'flex items-center justify-between py-1 px-1.5 rounded transition-colors group select-none',
                  isFullyChecked || isPartiallyChecked
                    ? 'bg-primary/8 text-foreground'
                    : 'hover:bg-muted/40 text-foreground/90'
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleExpand(subject)}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-transform shrink-0 cursor-pointer"
                    title={isExpanded ? 'Thu gọn trình độ' : 'Mở rộng trình độ'}
                  >
                    <ChevronRight
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        isExpanded && 'rotate-90 text-foreground'
                      )}
                    />
                  </button>

                  <Checkbox
                    checked={isFullyChecked ? true : isPartiallyChecked ? 'indeterminate' : false}
                    onCheckedChange={() => onToggleSubject(subject)}
                    className={cn(
                      'h-3.5 w-3.5 rounded transition-all shrink-0',
                      isFullyChecked || isPartiallyChecked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border/80 bg-background'
                    )}
                  />

                  <span
                    onClick={() => toggleExpand(subject)}
                    className="text-xs font-semibold truncate cursor-pointer hover:text-primary transition-colors flex-1"
                    title={subject}
                  >
                    {subject}
                  </span>
                </div>

                {showCount && (
                  <span className="text-[11px] text-muted-foreground font-medium shrink-0 ml-1.5">
                    {subjectSessionCount}
                  </span>
                )}
              </div>

              {/* Children: Danh sách trình độ thuộc chương trình (Indented with vertical guide line) */}
              {isExpanded && levels.length > 0 && (
                <div className="ml-3 pl-3.5 border-l border-border/60 py-0.5 my-0.5 space-y-0.5 animate-in slide-in-from-top-1 duration-150">
                  {levels.map((level) => {
                    const isLevelChecked = selectedLevels.includes(level)
                    const levelCount = allSessions
                      ? allSessions.filter((s) => s.subject === subject && s.level === level).length
                      : 0

                    return (
                      <label
                        key={level}
                        className={cn(
                          'flex items-center justify-between py-1 px-1.5 rounded text-xs cursor-pointer select-none transition-colors',
                          isLevelChecked
                            ? 'bg-primary/10 text-foreground font-medium'
                            : 'hover:bg-muted/40 text-foreground/80'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Checkbox
                            checked={isLevelChecked}
                            onCheckedChange={() => onToggleLevel(subject, level)}
                            className={cn(
                              'h-3 w-3 rounded transition-all shrink-0',
                              isLevelChecked
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-border/70 bg-background'
                            )}
                          />
                          <span className="text-[11px] truncate" title={level}>
                            {level}
                          </span>
                        </div>
                        {showCount && (
                          <span className="text-[10px] text-muted-foreground/75 font-normal shrink-0 ml-1.5">
                            {levelCount}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {subjects.length === 0 && (
          <div className="py-2 px-2 text-center text-xs italic text-muted-foreground">
            Không có chương trình hoặc trình độ phù hợp
          </div>
        )}
      </div>
    </div>
  )
}
