'use client'

import React, { RefObject, useMemo, useState } from 'react'
import {
  Users,
  CalendarDays,
  ChevronDown,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

import type { RosterStudentOption, SessionMediaItem } from './classesSessionMediaTypes'
import {
  parseDateString,
  formatDateToDisplay,
  formatDateToISO,
} from './classesSessionMediaTypes'
import { StudentSelectorPopoverContent } from './StudentSelectorPopoverContent'

export interface ClassesSessionMediaToolbarProps {
  isAllSelected: boolean
  filteredItems: SessionMediaItem[]
  selectedItemIds: string[]
  setSelectedItemIds: React.Dispatch<React.SetStateAction<string[]>>
  selectedStudentFilter: string
  setSelectedStudentFilter: (id: string) => void
  selectedStudentFilterLabel: string
  rosterStudents: RosterStudentOption[]
  items: SessionMediaItem[]
  dateFilterPreset: string
  setDateFilterPreset: (preset: string) => void
  dateFilterLabel: string
  customStartDate: string
  setCustomStartDate: (val: string) => void
  customEndDate: string
  setCustomEndDate: (val: string) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBulkDeleteConfirm: () => void
  handleBatchTagStudents: (studentId: string | 'all' | 'class_wide') => void
  className: string
}

export function ClassesSessionMediaToolbar({
  isAllSelected,
  filteredItems,
  selectedItemIds,
  setSelectedItemIds,
  selectedStudentFilter,
  setSelectedStudentFilter,
  selectedStudentFilterLabel,
  rosterStudents,
  items,
  dateFilterPreset,
  setDateFilterPreset,
  dateFilterLabel,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  fileInputRef,
  handleFileChange,
  handleBulkDeleteConfirm,
  handleBatchTagStudents,
  className,
}: ClassesSessionMediaToolbarProps) {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)

  const selectedRange: DateRange | undefined = useMemo(() => {
    const from = customStartDate ? parseDateString(customStartDate) ?? undefined : undefined
    const to = customEndDate ? parseDateString(customEndDate) ?? undefined : undefined
    if (!from && !to) return undefined
    return { from, to }
  }, [customStartDate, customEndDate])

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setCustomStartDate('')
      setCustomEndDate('')
      setDateFilterPreset('all')
      return
    }
    if (range.from) {
      setCustomStartDate(formatDateToISO(range.from))
      setDateFilterPreset('custom')
    } else {
      setCustomStartDate('')
    }
    if (range.to) {
      setCustomEndDate(formatDateToISO(range.to))
      setDateFilterPreset('custom')
    } else {
      setCustomEndDate('')
    }
  }

  const handlePresetSelect = (presetId: string) => {
    setDateFilterPreset(presetId)
    if (presetId === 'all') {
      setCustomStartDate('')
      setCustomEndDate('')
    } else if (presetId === '7days') {
      setCustomStartDate('2026-05-03')
      setCustomEndDate('2026-05-09')
    } else if (presetId === '30days') {
      setCustomStartDate('2026-04-10')
      setCustomEndDate('2026-05-09')
    } else if (presetId === 'this_month') {
      setCustomStartDate('2026-05-01')
      setCustomEndDate('2026-05-31')
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
      {/* Left: Checkbox Select All + Filters (Student & Date Range) */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium shrink-0">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItemIds(filteredItems.map((i) => i.id))
            } else {
              setSelectedItemIds([])
            }
          }}
          title="Chọn tất cả"
          className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-2xs"
        />

        <span className="font-bold text-foreground me-1">Lọc:</span>

        {/* 1. STUDENT FILTER POPOVER */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-8 px-2.5 text-xs font-semibold border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl gap-1.5 shadow-2xs cursor-pointer text-foreground"
            >
              <Users className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="truncate max-w-[150px]">{selectedStudentFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0 border-0 bg-transparent shadow-none z-[9999]">
            <StudentSelectorPopoverContent
              title="Lọc theo học viên"
              rosterStudents={rosterStudents}
              selectedSingleId={selectedStudentFilter}
              isFilterMode={true}
              allCount={items.length}
              items={items}
              onSelectOption={(id) => setSelectedStudentFilter(id)}
            />
          </PopoverContent>
        </Popover>

        {/* 2. DATE RANGE FILTER POPOVER (SHADCN CALENDAR RANGE - NO NATIVE INPUT) */}
        <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className={cn(
                'h-8 px-2.5 text-xs font-semibold border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl gap-1.5 shadow-2xs cursor-pointer text-foreground transition-colors',
                dateFilterPreset !== 'all' && 'border-sky-300 dark:border-sky-700 bg-sky-50/60 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="truncate max-w-[170px]">{dateFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="w-auto p-0 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-[9999] overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 dark:divide-zinc-800">
              {/* Left Column: Quick Presets */}
              <div className="w-full sm:w-38 p-3 bg-zinc-50/60 dark:bg-zinc-950/40 flex flex-col justify-between shrink-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Khoảng thời gian
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: '7days', label: '7 ngày qua' },
                      { id: '30days', label: '30 ngày qua' },
                      { id: 'this_month', label: 'Tháng 5/2026' },
                    ].map((p) => {
                      const isActive = dateFilterPreset === p.id
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePresetSelect(p.id)}
                          className={cn(
                            'px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer flex items-center justify-between',
                            isActive
                              ? 'bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800'
                              : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          )}
                        >
                          <span>{p.label}</span>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {dateFilterPreset !== 'all' && (
                  <div className="pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800 mt-3">
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('all')}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium cursor-pointer"
                    >
                      Đặt lại mặc định
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Range Calendar */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {customStartDate && customEndDate ? (
                      <span className="text-sky-700 dark:text-sky-400 font-bold">
                        {formatDateToDisplay(customStartDate)} – {formatDateToDisplay(customEndDate)}
                      </span>
                    ) : customStartDate ? (
                      <span>
                        Từ {formatDateToDisplay(customStartDate)} (chọn ngày kết thúc)
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Chọn khoảng ngày trên lịch:</span>
                    )}
                  </div>
                  {(customStartDate || customEndDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomStartDate('')
                        setCustomEndDate('')
                        setDateFilterPreset('all')
                      }}
                      className="text-[11px] text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Xóa chọn
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-950">
                  <Calendar
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleRangeSelect}
                    defaultMonth={
                      customStartDate ? parseDateString(customStartDate) ?? new Date(2026, 4, 1) : new Date(2026, 4, 1)
                    }
                    numberOfMonths={1}
                    className="p-1"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] text-muted-foreground italic">
                    * Click chọn ngày bắt đầu và kết thúc
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    className="h-7 px-3 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg cursor-pointer shadow-xs"
                    onClick={() => setIsDatePopoverOpen(false)}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Right: Dynamic Actions (Xóa, Gắn HV appear ONLY when items checked) + Tải lên */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Show Xóa & Gắn HV ONLY when 1 or more items are checked */}
        {selectedItemIds.length > 0 && (
          <div className="flex items-center gap-1.5 animate-fade-in">
            {/* Button Xóa */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleBulkDeleteConfirm}
              className="h-7 px-3 text-xs font-bold border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-rose-600 hover:border-rose-400 dark:hover:border-rose-600 rounded-lg cursor-pointer transition-all shadow-2xs"
            >
              Xóa
            </Button>

            {/* Button Gắn HV (BULK TAG POPOVER) */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-7 px-3 text-xs font-bold border-sky-400 dark:border-sky-600 bg-transparent text-[#0284c7] dark:text-sky-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-sky-700 hover:border-sky-500 rounded-lg cursor-pointer transition-all shadow-2xs"
                >
                  Gắn HV
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 border-0 bg-transparent shadow-none z-[9999]">
                <StudentSelectorPopoverContent
                  title={`Gắn học viên cho ${selectedItemIds.length} tệp đã chọn`}
                  subtitle={`Danh sách thuộc lớp ${className}`}
                  rosterStudents={rosterStudents}
                  showClassWideOption={true}
                  onSelectOption={(id) => handleBatchTagStudents(id)}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Button Tải lên */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 px-2.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-lg cursor-pointer transition-colors gap-1"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Tải lên</span>
        </Button>
      </div>
    </div>
  )
}
