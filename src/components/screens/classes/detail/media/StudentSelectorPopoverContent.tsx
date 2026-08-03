'use client'

import React, { useState, useMemo } from 'react'
import { Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { RosterStudentOption, SessionMediaItem } from './classesSessionMediaTypes'

export interface StudentSelectorPopoverContentProps {
  title?: string
  subtitle?: string
  rosterStudents: RosterStudentOption[]
  selectedStudentIds?: string[]
  selectedSingleId?: string
  isFilterMode?: boolean
  showClassWideOption?: boolean
  allCount?: number
  items?: SessionMediaItem[]
  onSelectOption: (id: string | 'all' | 'class_wide') => void
}

export function StudentSelectorPopoverContent({
  title = 'Gắn học viên',
  subtitle,
  rosterStudents,
  selectedStudentIds = [],
  selectedSingleId,
  isFilterMode = false,
  showClassWideOption = true,
  allCount = 0,
  items = [],
  onSelectOption,
}: StudentSelectorPopoverContentProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return rosterStudents
    const q = searchQuery.toLowerCase()
    return rosterStudents.filter(
      (st) => st.name.toLowerCase().includes(q) || (st.code && st.code.toLowerCase().includes(q))
    )
  }, [rosterStudents, searchQuery])

  return (
    <div className="w-72 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 text-left">
      {/* Title & Subtitle Header */}
      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0.5 mb-2">
        <p className="text-xs font-bold text-foreground">{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground italic">{subtitle}</p>}
      </div>

      {/* Search Input with Icon */}
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm học viên..."
          className="pl-8 h-8 text-xs rounded-xl border-sky-300 dark:border-sky-700 focus-visible:ring-sky-500 bg-zinc-50/50 dark:bg-zinc-800/40"
        />
      </div>

      {/* Options List */}
      <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
        {/* Option: Tất cả tệp (Filter Mode only) */}
        {isFilterMode && (
          <div
            onClick={() => onSelectOption('all')}
            className={cn(
              'flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs font-semibold',
              selectedSingleId === 'all'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">📁</span>
              <span>Tất cả tệp ({allCount})</span>
            </div>
            {selectedSingleId === 'all' && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />}
          </div>
        )}

        {/* Option: Cả lớp */}
        {showClassWideOption && (
          <div
            onClick={() => onSelectOption('class_wide')}
            className={cn(
              'flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs font-semibold',
              isFilterMode
                ? selectedSingleId === 'class_wide'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
                : selectedStudentIds.length === 0
                ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-foreground'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🌐</span>
              <span>
                Dành cho cả lớp {isFilterMode ? `(${items.filter((i) => i.taggedStudentIds.length === 0).length})` : ''}
              </span>
            </div>
            {((isFilterMode && selectedSingleId === 'class_wide') || (!isFilterMode && selectedStudentIds.length === 0)) && (
              <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />
            )}
          </div>
        )}

        {/* Individual Students */}
        {filtered.map((st) => {
          const isSelected = isFilterMode
            ? selectedSingleId === st.id
            : selectedStudentIds.includes(st.id)
          const bg = st.colorBg || 'bg-amber-100 dark:bg-amber-950/60'
          const text = st.colorText || 'text-amber-800 dark:text-amber-300'
          const count = items.filter((i) => i.taggedStudentIds.includes(st.id)).length

          return (
            <div
              key={st.id}
              onClick={() => onSelectOption(st.id)}
              className={cn(
                'flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors text-xs',
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`h-7 w-7 rounded-full ${bg} ${text} flex items-center justify-center font-bold text-[11px] shrink-0 border`}>
                  {st.initials || st.name.slice(0, 1)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate block font-semibold text-xs">{st.name}</span>
                  {st.code && <span className="text-[9px] text-muted-foreground font-mono">{st.code}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isFilterMode && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    {count}
                  </span>
                )}
                {isSelected && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-3 italic">Không tìm thấy học viên</p>
        )}
      </div>
    </div>
  )
}
