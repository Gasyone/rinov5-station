'use client'

import React from 'react'
import { Search, X, Check, Users, Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { DigiStudentProfile } from '@/mocks/digiSchedule'

export function formatPhoneMask3Last(phone: string): string {
  if (!phone) return '****---'
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.length >= 3) {
    return `****${digits.slice(-3)}`
  }
  const suffix = phone.replace(/\*/g, '').slice(-3)
  return `****${suffix.padStart(3, '0')}`
}

export const AVATAR_COLORS = [
  'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800',
  'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
]

export function getInitial(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-1)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
}

export interface StudentScheduleSummary {
  lessonCount: number
  timeRange?: string
}

interface DigiStudentListPanelProps {
  students: DigiStudentProfile[]
  selectedStudents: DigiStudentProfile[]
  activeStudentId: string | null
  studentSchedulesMap: Record<string, StudentScheduleSummary>
  onToggleStudent: (student: DigiStudentProfile) => void
  onSetActiveStudent: (studentId: string) => void
  onClearAllStudents: () => void
  searchText: string
  onSearchChange: (text: string) => void
  allStudentsCount: number
}

export function DigiStudentListPanel({
  students,
  selectedStudents,
  activeStudentId,
  studentSchedulesMap,
  onToggleStudent,
  onSetActiveStudent,
  onClearAllStudents,
  searchText,
  onSearchChange,
  allStudentsCount,
}: DigiStudentListPanelProps) {
  const selectedCount = selectedStudents.length

  return (
    <div className="w-full md:w-[390px] lg:w-[420px] shrink-0 border-b md:border-b-0 md:border-r border-border/70 flex flex-col min-h-0 bg-muted/5">
      {/* 1. Header & Tìm kiếm */}
      <div className="p-3.5 space-y-2.5 border-b border-border/60 bg-card/60 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>Danh sách học viên</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={onClearAllStudents}
                className="text-[10.5px] font-medium text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                Bỏ chọn ({selectedCount})
              </button>
            )}
            <Badge
              variant={selectedCount > 0 ? 'default' : 'secondary'}
              className={cn(
                'text-[10px] px-1.5 py-0 font-medium',
                selectedCount > 0 && 'bg-primary text-primary-foreground'
              )}
            >
              {selectedCount > 0
                ? `Đã chọn ${selectedCount}/${allStudentsCount}`
                : `${students.length}/${allStudentsCount}`}
            </Badge>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm tên, tên tiếng Anh hoặc SĐT..."
            className="w-full h-8.5 pl-8 pr-7 text-xs border border-border/80 rounded-lg bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/70"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Danh sách học viên cuộn dọc */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {students.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic flex flex-col items-center gap-2">
            <Users className="h-8 w-8 text-muted-foreground/40 stroke-1" />
            <span>Không tìm thấy học viên phù hợp</span>
          </div>
        ) : (
          students.map((student, idx) => {
            const isSelected = selectedStudents.some((s) => s.id === student.id)
            const isActive = student.id === activeStudentId
            const scheduleSummary = studentSchedulesMap[student.id]
            const hasScheduledLessons = (scheduleSummary?.lessonCount || 0) > 0

            return (
              <div
                key={student.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (isSelected && !isActive) {
                    onSetActiveStudent(student.id)
                  } else {
                    onToggleStudent(student)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (isSelected && !isActive) {
                      onSetActiveStudent(student.id)
                    } else {
                      onToggleStudent(student)
                    }
                  }
                }}
                className={cn(
                  'group flex items-center justify-between p-1.5 rounded-xl border transition-all cursor-pointer select-none text-left gap-2.5 overflow-hidden',
                  isSelected
                    ? isActive
                      ? 'border-primary bg-primary/[0.09] shadow-2xs ring-2 ring-primary/40'
                      : 'border-primary/60 bg-primary/[0.04]'
                    : 'border-transparent hover:border-border hover:bg-card'
                )}
              >
                {/* Cột trái: Avatar vuông gần sát mép cạnh */}
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-bold shrink-0 shadow-2xs transition-transform',
                    AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  )}
                >
                  {getInitial(student.name)}
                </div>

                {/* Cột giữa: Duy trì chính xác 2 dòng thông tin */}
                <div className="min-w-0 flex-1 py-0.5">
                  {/* Dòng 1: Tên học viên + Tên tiếng Anh */}
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={cn(
                        'text-xs font-bold truncate transition-colors',
                        isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                      )}
                    >
                      {student.name}
                    </span>
                    {student.englishName && (
                      <span className="text-[11px] text-muted-foreground italic truncate">
                        ({student.englishName})
                      </span>
                    )}
                  </div>

                  {/* Dòng 2: SĐT (chỉ hiện 3 số cuối ****xxx) + Nút Copy • Cơ sở */}
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 truncate">
                    <div className="inline-flex items-center gap-1 shrink-0 font-mono">
                      <span>{formatPhoneMask3Last(student.phoneMasked)}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard?.writeText(student.phoneMasked || '')
                          toast.success(`Đã sao chép SĐT: ${formatPhoneMask3Last(student.phoneMasked)}`)
                        }}
                        className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title="Sao chép số điện thoại"
                      >
                        <Copy className="h-2.5 w-2.5" />
                      </button>
                    </div>
                    <span>•</span>
                    <span className="truncate">{student.branch}</span>
                  </div>
                </div>

                {/* Cột phải: Check chọn ở trên, Gói Digi / Lịch đã chọn ở góc dưới */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5 pl-1 gap-1">
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleStudent(student)
                    }}
                    className={cn(
                      'flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-all cursor-pointer',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                        : 'border-muted-foreground/30 bg-background/60 group-hover:border-primary/60'
                    )}
                    title={isSelected ? 'Bỏ chọn' : 'Chọn học viên'}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>

                  {hasScheduledLessons ? (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 font-bold leading-tight whitespace-nowrap border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                      {scheduleSummary.lessonCount} bài ({scheduleSummary.timeRange})
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] px-1.5 py-0 font-medium leading-tight whitespace-nowrap',
                        isSelected
                          ? 'border-primary/40 text-primary bg-primary/10'
                          : 'text-muted-foreground/90 bg-muted/40 border-border/60'
                      )}
                    >
                      {student.packages?.length || 1} gói Digi
                    </Badge>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
