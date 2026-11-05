'use client'

import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sun,
  Moon,
  Zap,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BranchSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import { DAILY_BRANCH_OPTIONS, type DailyCheckShift } from '@/mocks/dailyCheck'

export interface ShiftProgressStats {
  total: number
  checked: number
  pass: number
  fail: number
  isCompleted: boolean
}

export interface DailyCheckExecutionToolbarProps {
  selectedBranch: string
  onSelectBranch: (branch: string) => void
  selectedShift: DailyCheckShift
  onSelectShift: (shift: DailyCheckShift) => void
  weekOffset: number
  onPrevWeek: () => void
  onNextWeek: () => void
  onResetWeek: () => void
  weekRangeLabel: string
  onPassAll: () => void
  daytimeStats: ShiftProgressStats
  closingStats: ShiftProgressStats
  onOpenCatalog?: () => void
}

export function DailyCheckExecutionToolbar({
  selectedBranch,
  onSelectBranch,
  selectedShift,
  onSelectShift,
  weekOffset,
  onPrevWeek,
  onNextWeek,
  onResetWeek,
  weekRangeLabel,
  onPassAll,
  daytimeStats,
  closingStats,
  onOpenCatalog,
}: DailyCheckExecutionToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* ─── LEFT: CHỌN CƠ SỞ & CHUYỂN CA (HIỂN THỊ STATS & ICON CHECK) ─── */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div data-explain="branch-select" className="flex items-center gap-1.5">
          <BranchSelect
            value={selectedBranch}
            onValueChange={onSelectBranch}
            branches={DAILY_BRANCH_OPTIONS}
            includeAll={false}
            className="bg-background border border-input shadow-xs text-foreground font-medium text-xs h-8 px-2.5 rounded-md min-w-[155px]"
          />
        </div>

        {/* Shift Switcher gọn: chỉ hiển thị icon đã check hoặc chưa check */}
        <div
          data-explain="shift-switcher"
          className="flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/50 text-xs"
        >
          {/* Nút Ca Sáng (Đầu ca) */}
          <button
            type="button"
            onClick={() => onSelectShift('dau_ca')}
            className={cn(
              'flex items-center gap-1.5 py-1 px-2.5 rounded-md cursor-pointer transition-colors text-xs font-normal',
              selectedShift === 'dau_ca'
                ? 'bg-background text-foreground shadow-xs font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={daytimeStats.isCompleted ? 'Đầu ca (Sáng): Đã kiểm tra' : 'Đầu ca (Sáng): Chưa kiểm tra'}
          >
            <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Đầu ca (Sáng)</span>
            {daytimeStats.isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            )}
          </button>

          {/* Nút Ca Tối (Cuối ca) */}
          <button
            type="button"
            onClick={() => onSelectShift('cuoi_ca')}
            className={cn(
              'flex items-center gap-1.5 py-1 px-2.5 rounded-md cursor-pointer transition-colors text-xs font-normal',
              selectedShift === 'cuoi_ca'
                ? 'bg-background text-foreground shadow-xs font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={closingStats.isCompleted ? 'Cuối ca (Tối): Đã kiểm tra' : 'Cuối ca (Tối): Chưa kiểm tra'}
          >
            <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>Cuối ca (Tối)</span>
            {closingStats.isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* ─── CENTER: ĐIỀU HƯỚNG TUẦN ─── */}
      <div data-explain="week-navigator" className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevWeek}
          className="h-8 w-8 p-0 cursor-pointer"
          title="Tuần trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-xs font-semibold px-2.5 py-1 bg-background rounded-md border border-border/60 flex items-center gap-1.5 shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>
            {weekOffset === 0 ? `Tuần này (${weekRangeLabel})` : `Tuần (${weekRangeLabel})`}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onNextWeek}
          className="h-8 w-8 p-0 cursor-pointer"
          title="Tuần sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {weekOffset !== 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onResetWeek}
            className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Về tuần này
          </Button>
        )}
      </div>

      {/* ─── RIGHT: DANH MỤC ĐÁNH GIÁ & ĐẠT TẤT CẢ ─── */}
      <div className="flex items-center gap-2">
        {onOpenCatalog && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCatalog}
            data-explain="catalog-btn"
            className="h-8 gap-1.5 text-xs font-medium cursor-pointer border-border hover:bg-muted shadow-2xs"
            title="Xem & thiết lập danh mục đánh giá chuẩn 5 sao"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>Danh mục đánh giá</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={onPassAll}
          data-explain="pass-all-btn"
          className="h-8 gap-1.5 text-xs font-medium cursor-pointer border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>Đạt tất cả</span>
        </Button>
      </div>
    </div>
  )
}
