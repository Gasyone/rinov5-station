'use client'

import React from 'react'
import {
  Building2,
  BookOpen,
  Calendar,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  Copy,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  formatPhoneMask3Last,
  type StudentScheduleSummary,
} from './DigiStudentListPanel'
import type {
  DigiStudentProfile,
  DigiStudentPackage,
  DigiLessonItem,
} from '@/mocks/digiSchedule'

export interface DatePreset {
  key: string
  label: string
  dateDisplay: string
}

export interface LessonScheduleItem {
  lesson: DigiLessonItem
  slotStartTime: string
  slotEndTime: string
  slotInfo: {
    occupied: number
    capacity: number
    isFull: boolean
    remaining: number
  }
}

interface DigiScheduleMatchingPanelProps {
  selectedStudents: DigiStudentProfile[]
  activeStudent: DigiStudentProfile | null
  studentSchedulesMap: Record<string, StudentScheduleSummary>
  selectedPackage: DigiStudentPackage | null
  onSelectPackage: (pkg: DigiStudentPackage) => void
  selectedDateKey: string
  onSelectDateKey: (dateKey: string) => void
  presetDates: DatePreset[]
  isCustomDate: boolean
  selectedLessonIds: string[]
  onToggleLesson: (lessonId: string) => void
  onToggleSelectAll: () => void
  lessonScheduleItems: LessonScheduleItem[]
  roomCapacity: number
  hasOverCapacity: boolean
  dateInputRef: React.RefObject<HTMLInputElement | null>
}

export function DigiScheduleMatchingPanel({
  selectedStudents,
  activeStudent,
  selectedPackage,
  onSelectPackage,
  selectedDateKey,
  onSelectDateKey,
  presetDates,
  isCustomDate,
  selectedLessonIds,
  onToggleLesson,
  onToggleSelectAll,
  lessonScheduleItems,
  roomCapacity,
  hasOverCapacity,
  dateInputRef,
}: DigiScheduleMatchingPanelProps) {
  // 1. Trạng thái chưa chọn học viên nào
  if (selectedStudents.length === 0 || !activeStudent) {
    return (
      <div className="flex-1 min-w-0 min-h-0 flex flex-col items-center justify-center p-8 text-center bg-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-inner">
          <UserCheck className="h-8 w-8 stroke-[1.75]" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">
          Chưa chọn học viên
        </h3>
        <p className="text-xs text-muted-foreground max-w-[300px] leading-relaxed">
          Vui lòng tích chọn học viên từ danh sách bên trái để cấu hình gói học, ngày học và ghép khung giờ độc lập cho từng người.
        </p>
      </div>
    )
  }

  const isMulti = selectedStudents.length > 1

  return (
    <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-card overflow-hidden">
      {/* 1. Header: Trái: Đang ghép lịch cho (dòng 1) -> X học viên (dòng 2) | Phải: Đang cấu hình (dòng 1) -> SĐT + Cơ sở (dòng 2) */}
      <div className="px-4 py-2.5 bg-primary/[0.04] border-b border-border/60 flex items-center justify-between gap-3 shrink-0">
        {/* Cột trái: Đang ghép lịch cho -> X học viên */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground leading-tight">
              Đang ghép lịch cho:
            </span>
            <span className="text-xs font-bold text-primary leading-tight mt-0.5">
              {selectedStudents.length} học viên
            </span>
          </div>
        </div>

        {/* Cột phải: Đang cấu hình (dòng 1) -> SĐT + Cơ sở (dòng 2) */}
        <div className="flex flex-col items-end text-right min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
            <span className="text-muted-foreground font-normal text-[11px]">Đang cấu hình:</span>
            <span className="text-primary truncate">{activeStudent.name}</span>
            {activeStudent.englishName && (
              <span className="text-muted-foreground italic text-[11px] font-normal">
                ({activeStudent.englishName})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground font-mono mt-0.5">
            <span>{formatPhoneMask3Last(activeStudent.phoneMasked)}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard?.writeText(activeStudent.phoneMasked || '')
                toast.success(`Đã sao chép SĐT: ${formatPhoneMask3Last(activeStudent.phoneMasked)}`)
              }}
              className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Sao chép số điện thoại"
            >
              <Copy className="h-2.5 w-2.5" />
            </button>
            <span>•</span>
            <span className="truncate max-w-[140px]">{activeStudent.branch}</span>
          </div>
        </div>
      </div>

      {/* 2. Form cấu hình chi tiết riêng cho học viên đang active */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
        {/* 1. Gói học của riêng activeStudent */}
        <div className="space-y-1.5">
          <label className="text-xs font-normal text-muted-foreground block">
            Gói học {isMulti && `(${activeStudent.name})`}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeStudent.packages.map((pkg) => {
              const isSelected = selectedPackage?.packageId === pkg.packageId
              return (
                <div
                  key={pkg.packageId}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectPackage(pkg)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectPackage(pkg)
                    }
                  }}
                  className={cn(
                    'relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-left',
                    isSelected
                      ? 'border-primary bg-primary/[0.05] ring-2 ring-primary/20 shadow-2xs'
                      : 'border-border/80 bg-background hover:border-primary/40 hover:bg-accent/30'
                  )}
                >
                  {/* Radio Circle Indicator */}
                  <div
                    className={cn(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40 bg-background'
                    )}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-foreground truncate">
                      {pkg.packageName}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                      <Building2 className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span className="truncate">Cơ sở: {activeStudent.branch}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">
                      {pkg.availableLessons.length} bài học tiếp theo • {pkg.availableLessons.length * 30} phút
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Ngày học (Chọn ngày sẽ tự động đổi bài và tịnh tiến bài học) */}
        <div className="space-y-1.5">
          <label className="text-xs font-normal text-muted-foreground block">
            Ngày học
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {presetDates.map((d) => {
              const isSelected = selectedDateKey === d.key
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => onSelectDateKey(d.key)}
                  className={cn(
                    'flex flex-col items-center justify-center py-1.5 px-2 rounded-xl border text-xs transition-all cursor-pointer select-none leading-tight min-h-[42px]',
                    isSelected
                      ? 'border-primary bg-primary/[0.08] text-primary ring-1 ring-primary/30 shadow-2xs font-bold'
                      : 'border-border/80 bg-background hover:bg-accent/40 text-foreground'
                  )}
                >
                  <span className={cn('text-[11px] font-medium', isSelected ? 'text-primary' : 'text-foreground')}>
                    {d.label}
                  </span>
                  <span className={cn('text-[10px] mt-0.5', isSelected ? 'text-primary font-bold' : 'text-muted-foreground')}>
                    {d.dateDisplay}
                  </span>
                </button>
              )
            })}

            {/* Nút 5: Chọn ngày khác */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const input = dateInputRef.current
                  if (input) {
                    try {
                      input.showPicker()
                    } catch {
                      input.focus()
                    }
                  }
                }}
                className={cn(
                  'w-full h-full min-h-[42px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl border text-xs transition-all cursor-pointer select-none leading-tight',
                  isCustomDate
                    ? 'border-primary bg-primary/[0.08] text-primary ring-1 ring-primary/30 shadow-2xs font-bold'
                    : 'border-border/80 bg-background hover:bg-accent/40 text-foreground'
                )}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className={cn('text-[11px] font-medium', isCustomDate ? 'text-primary' : 'text-foreground')}>
                    {isCustomDate ? 'Ngày đã chọn' : 'Ngày khác'}
                  </span>
                </div>
                <span className={cn('text-[10px] mt-0.5', isCustomDate ? 'text-primary font-bold' : 'text-muted-foreground')}>
                  {isCustomDate ? selectedDateKey.split('-').reverse().slice(0, 2).join('/') : 'Tùy chọn...'}
                </span>
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDateKey}
                onChange={(e) => e.target.value && onSelectDateKey(e.target.value)}
                className="absolute inset-0 opacity-0 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Bài học & Khung giờ (Được lọc và tịnh tiến tự động theo ngày học) */}
        {selectedPackage && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-normal text-muted-foreground">
                  Bài học & Khung giờ {isMulti && `(${activeStudent.name})`}
                </span>
                <span className="text-[10px] font-normal text-muted-foreground/70">
                  (Dung lượng: {roomCapacity} chỗ/ca)
                </span>
              </div>
            </div>

            {/* Danh sách từng bài học đi liền với khung giờ và số chỗ */}
            <div className="border border-border/80 rounded-xl overflow-hidden divide-y divide-border/60 bg-background">
              {/* Header thanh công cụ chọn tất cả */}
              <div className="flex items-center justify-between px-3 py-2 bg-muted/40 text-[11px] font-semibold text-muted-foreground">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="flex items-center gap-2 hover:text-foreground cursor-pointer text-left font-bold"
                >
                  <input
                    type="checkbox"
                    checked={
                      lessonScheduleItems.length > 0 &&
                      lessonScheduleItems.every((item) => selectedLessonIds.includes(item.lesson.lessonId))
                    }
                    onChange={onToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-border text-primary cursor-pointer accent-primary"
                  />
                  <span>Chọn tất cả ({lessonScheduleItems.length} bài)</span>
                </button>
                <span>Khung giờ & Chỗ trống</span>
              </div>

              {lessonScheduleItems.map(({ lesson, slotStartTime, slotEndTime, slotInfo }) => {
                const isChecked = selectedLessonIds.includes(lesson.lessonId)
                const isFull = slotInfo.isFull

                return (
                  <div
                    key={lesson.lessonId}
                    role="button"
                    tabIndex={0}
                    onClick={() => !isFull && onToggleLesson(lesson.lessonId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (!isFull) onToggleLesson(lesson.lessonId)
                      }
                    }}
                    className={cn(
                      'flex items-center justify-between p-3 gap-3 transition-colors select-none cursor-pointer text-xs',
                      isChecked ? 'bg-primary/[0.03]' : 'hover:bg-accent/40',
                      isFull && 'opacity-60 bg-muted/20 cursor-not-allowed'
                    )}
                  >
                    {/* Cột trái: Checkbox + Tên bài học */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isFull}
                        onChange={() => onToggleLesson(lesson.lessonId)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-border text-primary cursor-pointer accent-primary shrink-0"
                      />
                      <div className="min-w-0">
                        <span
                          className={cn(
                            'font-bold block truncate',
                            isChecked ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {lesson.lessonName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Thời lượng: {lesson.durationMinutes} phút
                        </span>
                      </div>
                    </div>

                    {/* Cột phải: Thời gian + Chỗ trống */}
                    <div className="flex flex-col items-end gap-0.5 shrink-0 text-right min-w-[120px]">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {slotStartTime} - {slotEndTime}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold',
                          isFull
                            ? 'text-red-600 dark:text-red-400 font-bold'
                            : slotInfo.remaining <= 2
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {isFull
                          ? `Hết chỗ (${slotInfo.occupied}/${slotInfo.capacity})`
                          : `${slotInfo.occupied}/${slotInfo.capacity} chỗ (Còn ${slotInfo.remaining})`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {hasOverCapacity && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-3.5 py-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Một số khung giờ đã chọn đã hết chỗ trống.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
