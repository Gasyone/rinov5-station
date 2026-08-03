'use client'

import React, { RefObject } from 'react'
import {
  Users,
  CalendarDays,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import type { RosterStudentOption, SessionMediaItem } from './classesSessionMediaTypes'
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

        {/* 2. DATE RANGE FILTER POPOVER */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-8 px-2.5 text-xs font-semibold border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl gap-1.5 shadow-2xs cursor-pointer text-foreground"
            >
              <CalendarDays className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="truncate max-w-[150px]">{dateFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-[9999] space-y-2.5 text-left">
            <div className="text-xs font-bold text-foreground pb-1.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span>Khoảng thời gian</span>
              {dateFilterPreset !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFilterPreset('all')
                    setCustomStartDate('')
                    setCustomEndDate('')
                  }}
                  className="text-[10px] text-sky-600 hover:underline font-normal cursor-pointer"
                >
                  Đặt lại
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: '7days', label: '7 ngày qua' },
                { id: '30days', label: '30 ngày qua' },
                { id: 'this_month', label: 'Tháng 5/2026' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDateFilterPreset(p.id)}
                  className={cn(
                    'px-2 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer',
                    dateFilterPreset === p.id
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground block">Tùy chọn ngày:</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Từ ngày</label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value)
                      setDateFilterPreset('custom')
                    }}
                    className="h-7 text-xs bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Đến ngày</label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => {
                      setCustomEndDate(e.target.value)
                      setDateFilterPreset('custom')
                    }}
                    className="h-7 text-xs bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                  />
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
          <Plus className="h-3.5 w-3.5" />
          <span>Tải lên</span>
        </Button>
      </div>
    </div>
  )
}
