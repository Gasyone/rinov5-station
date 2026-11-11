'use client'

import React from 'react'
import { ChevronDown, ChevronRight, Camera, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CalendarDayInfo } from './dailyCheckTypes'
import type { EvidenceTargetData } from './DailyCheckExecutionTable'
import type { DailyStandardTarget } from './DailyCheckStandardDialog'

export interface DailyCheckCategoryRowProps {
  group: string
  itemCount: number
  itemNames: string[]
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSkipCategory: (group: string) => void
  weekDays: CalendarDayInfo[]
  getCategoryDayScore: (
    itemNames: string[],
    dateStr: string,
    isToday: boolean
  ) => { total: number; pass: number; fail: number; isEvaluated: boolean } | null
  getCategoryPhotos: (group: string, dateStr: string) => string[]
  onOpenEvidence: (target: EvidenceTargetData) => void
  onOpenStandard?: (target: DailyStandardTarget) => void
}

export function DailyCheckCategoryRow({
  group,
  itemCount,
  itemNames,
  isCollapsed,
  onToggleCollapse,
  onSkipCategory,
  weekDays,
  getCategoryDayScore,
  getCategoryPhotos,
  onOpenEvidence,
}: DailyCheckCategoryRowProps) {
  return (
    <tr className="border-b border-border/70 bg-muted/40 group/cat">
      {/* Sticky Col 1: Tên danh mục, số lượng tiêu chí, nút Thu gọn & Ẩn (khi hover) */}
      <td className="sticky left-0 z-20 bg-muted/90 backdrop-blur-xs w-[350px] min-w-[350px] max-w-[350px] border-r border-border p-2 px-3 align-middle">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              onClick={onToggleCollapse}
              className="flex items-center gap-1.5 cursor-pointer select-none text-foreground hover:text-primary transition-colors min-w-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-primary shrink-0" />
              )}

              <span className="font-semibold text-xs uppercase truncate">
                {group}
              </span>
              <span className="text-[11px] font-normal text-muted-foreground/70 shrink-0">
                ({itemCount})
              </span>
            </div>
          </div>

          {/* Nút Ẩn danh mục (chỉ hiển thị khi hover) */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSkipCategory(group)}
            className="h-6 text-[11px] gap-1 px-1.5 text-muted-foreground hover:text-destructive cursor-pointer shrink-0 opacity-0 group-hover/cat:opacity-100 transition-opacity"
            title="Ẩn toàn bộ danh mục này (chuyển vào danh sách bỏ qua)"
          >
            <EyeOff className="h-3 w-3" />
            <span>Ẩn</span>
          </Button>
        </div>
      </td>

      {/* 7 Cột ngày: Thống kê n/n & Nút ảnh từng ngày */}
      {weekDays.map((day) => {
        const catScore = getCategoryDayScore(itemNames, day.dateStr, day.isToday)
        const photos = getCategoryPhotos(group, day.dateStr)
        const hasPhotos = photos.length > 0

        if (day.dateStr > '2026-10-29') {
          return (
            <td
              key={day.dateStr}
              className="p-1.5 text-center w-[110px] min-w-[110px] max-w-[110px] border-r border-border/40 last:border-r-0 text-muted-foreground/30 align-middle text-xs"
            >
              —
            </td>
          )
        }

        return (
          <td
            key={day.dateStr}
            className={cn(
              'p-1.5 px-1.5 align-middle transition-colors text-center',
              day.isToday
                ? 'w-[185px] min-w-[185px] max-w-[185px] bg-primary/[0.04] border-x-2 border-primary/25'
                : 'w-[110px] min-w-[110px] max-w-[110px] border-r border-border/40 last:border-r-0'
            )}
          >
            <div className="flex items-center justify-center gap-1.5 w-full">
              {/* Thống kê nhẹ n/n */}
              {catScore && catScore.isEvaluated ? (
                <span
                  className={cn(
                    'text-[11px] font-mono font-semibold shrink-0',
                    catScore.fail > 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-foreground/80'
                  )}
                  title={`Đạt ${catScore.pass}/${catScore.total} tiêu chí`}
                >
                  {catScore.pass}/{catScore.total}
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground/40 font-mono shrink-0">—</span>
              )}

              {/* Nút Ảnh */}
              {day.isToday ? (
                <button
                  type="button"
                  onClick={() =>
                    onOpenEvidence({
                      type: 'category',
                      name: group,
                      group,
                      dateStr: day.dateStr,
                      isPastDay: false,
                    })
                  }
                  className={cn(
                    'h-5 px-1.5 rounded text-[10px] inline-flex items-center gap-1 transition-colors cursor-pointer border shrink-0',
                    hasPhotos
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border-blue-300'
                      : 'bg-background/80 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground'
                  )}
                  title={`Ảnh minh chứng danh mục ${group} (Hôm nay)`}
                >
                  <Camera className="h-2.5 w-2.5" />
                  <span>{hasPhotos ? `${photos.length} ảnh` : '+ Ảnh'}</span>
                </button>
              ) : hasPhotos ? (
                <button
                  type="button"
                  onClick={() =>
                    onOpenEvidence({
                      type: 'category',
                      name: group,
                      group,
                      dateStr: day.dateStr,
                      isPastDay: true,
                      photos,
                    })
                  }
                  className="h-5 px-1.5 rounded text-[10px] inline-flex items-center gap-1 font-medium border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 cursor-pointer shrink-0"
                  title="Xem ảnh danh mục đã lưu"
                >
                  <Camera className="h-2.5 w-2.5" />
                  <span>{photos.length} ảnh</span>
                </button>
              ) : null}
            </div>
          </td>
        )
      })}
    </tr>
  )
}
