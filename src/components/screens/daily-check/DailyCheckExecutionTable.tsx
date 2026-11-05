'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import {
  Check,
  X,
  Camera,
  EyeOff,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DailyCheckCategoryRow } from './DailyCheckCategoryRow'
import { getItemAvatarInfo } from './dailyCheckStandards'
import type { DailyStandardTarget } from './DailyCheckStandardDialog'
import type {
  DailyCatalogItem,
  DailyClosingTask,
  DailyCheckShift,
} from '@/mocks/dailyCheck'
import type { CalendarDayInfo } from './dailyCheckTypes'

export interface DailyDaySummaryScore {
  activeTotal: number
  passCount: number
  failCount: number
  skippedCount: number
  isEvaluated: boolean
}

export interface EvidenceTargetData {
  type: 'item' | 'category'
  name: string
  group: string
  dateStr: string
  isPastDay?: boolean
  photos?: string[]
}

export interface DailyCheckExecutionTableProps {
  selectedShift: DailyCheckShift
  weekDays: CalendarDayInfo[]
  getDaySummaryScore: (dateStr: string) => DailyDaySummaryScore | null
  activeDaytimeGrouped: Record<string, DailyCatalogItem[]>
  activeClosingGrouped: Record<string, DailyClosingTask[]>
  collapsedCategories: string[]
  onToggleCollapseCategory: (group: string) => void
  isAllCollapsed: boolean
  onToggleAllCategories: () => void
  onSkipCategory: (group: string) => void
  onSkipCriterion: (name: string, group: string) => void
  getCategoryPhotos: (group: string, dateStr: string) => string[]
  getItemPhotos: (itemName: string, dateStr?: string) => string[]
  getItemTodayStatus: (itemName: string) => 'pass' | 'fail' | 'pending'
  onSetItemStatus: (itemName: string, status: 'pass' | 'fail') => void
  getHistoricalItemStatus: (
    dateStr: string,
    itemName: string
  ) => { status: 'pass' | 'fail' | 'not_submitted'; note?: string; photos?: string[] }
  onOpenEvidence: (target: EvidenceTargetData) => void
  onOpenStandard: (target: DailyStandardTarget) => void
}

export function DailyCheckExecutionTable({
  selectedShift,
  weekDays,
  getDaySummaryScore,
  activeDaytimeGrouped,
  activeClosingGrouped,
  collapsedCategories,
  onToggleCollapseCategory,
  isAllCollapsed,
  onToggleAllCategories,
  onSkipCategory,
  onSkipCriterion,
  getCategoryPhotos,
  getItemPhotos,
  getItemTodayStatus,
  onSetItemStatus,
  getHistoricalItemStatus,
  onOpenEvidence,
  onOpenStandard,
}: DailyCheckExecutionTableProps) {
  // Helper tính điểm Đạt/Tổng của một danh mục theo từng ngày cụ thể
  const getCategoryDayScore = (
    itemNames: string[],
    dateStr: string,
    isToday: boolean
  ): { total: number; pass: number; fail: number; isEvaluated: boolean } | null => {
    if (dateStr > '2026-10-29') return null
    const total = itemNames.length
    let pass = 0
    let fail = 0

    if (isToday) {
      for (const name of itemNames) {
        const st = getItemTodayStatus(name)
        if (st === 'pass') pass++
        else if (st === 'fail') fail++
      }
      return { total, pass, fail, isEvaluated: pass + fail > 0 }
    }

    // Ngày quá khứ
    for (const name of itemNames) {
      const hist = getHistoricalItemStatus(dateStr, name)
      if (hist.status === 'pass') pass++
      else if (hist.status === 'fail') fail++
    }
    return { total, pass, fail, isEvaluated: true }
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <table className="min-w-[1380px] w-full text-xs border-collapse">
        {/* ─── 1. TABLE HEADER (CỐ ĐỊNH TRÊN CÙNG KHI CUỘN DỌC) ─── */}
        <thead className="sticky top-0 z-30 shadow-xs">
          <tr className="border-b border-border/70 bg-muted/95 backdrop-blur-xs">
            {/* Sticky Col 1: Cố định cả trên (top-0) lẫn trái (left-0), z-40 cao nhất */}
            <th data-explain="standards-column" className="p-2.5 px-3 text-left font-medium text-foreground sticky top-0 left-0 bg-muted/95 backdrop-blur-xs z-40 w-[350px] min-w-[350px] border-r border-border shadow-[inset_-1px_0_0_var(--border)] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border/90 after:pointer-events-none relative">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium text-foreground">Hạng mục &amp; Tiêu chuẩn kiểm tra</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    Thống kê Đạt / Tổng số tiêu chí (Bỏ qua)
                  </span>
                </div>

                {/* Button text không viền, màu xanh để Thu gọn / Mở rộng tất cả */}
                <button
                  type="button"
                  onClick={onToggleAllCategories}
                  className="text-[11px] font-normal text-primary hover:text-primary/80 transition-colors cursor-pointer shrink-0"
                  title={isAllCollapsed ? 'Mở rộng tất cả danh mục' : 'Thu gọn tất cả danh mục'}
                >
                  {isAllCollapsed ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}
                </button>
              </div>
            </th>

            {/* 7 Days Columns */}
            {weekDays.map((day) => {
              const score = getDaySummaryScore(day.dateStr)
              return (
                <th
                  key={day.dateStr}
                  className={cn(
                    'p-2.5 px-2 text-center min-w-[145px] w-[145px] border-r border-border/40 last:border-r-0 transition-colors',
                    day.isToday
                      ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                      : 'text-foreground font-normal'
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {/* Dòng 1: TX - Ngày/tháng */}
                    <span className={cn('text-xs font-medium', day.isToday && 'text-primary')}>
                      {day.dayOfWeek} - {day.dayOfMonth}/{day.dateStr.split('-')[1]}
                    </span>

                    {/* Dòng 2: Thống kê Đạt/tổng (và số lượng bỏ qua trong ngoặc) */}
                    {score && score.isEvaluated ? (
                      <span
                        className={cn(
                          'text-[11px] font-normal',
                          score.failCount === 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400 font-medium'
                        )}
                      >
                        {score.passCount}/{score.activeTotal}
                        {score.skippedCount > 0 && (
                          <span className="text-muted-foreground ml-1 font-normal text-[10px]">
                            ({score.skippedCount})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60 font-normal">—</span>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>

        {/* ─── 2. TABLE BODY ─── */}
        <tbody>
          {selectedShift === 'dau_ca' ? (
            /* =================== CA SÁNG =================== */
            Object.entries(activeDaytimeGrouped).map(([grp, items]) => {
              const isCollapsed = collapsedCategories.includes(grp)
              const itemNames = items.map((it) => it.detail)

              return (
                <React.Fragment key={grp}>
                  <DailyCheckCategoryRow
                    group={grp}
                    itemCount={items.length}
                    itemNames={itemNames}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => onToggleCollapseCategory(grp)}
                    onSkipCategory={onSkipCategory}
                    weekDays={weekDays}
                    getCategoryDayScore={getCategoryDayScore}
                    getCategoryPhotos={getCategoryPhotos}
                    onOpenEvidence={onOpenEvidence}
                  />

                  {/* Criteria Rows */}
                  {!isCollapsed &&
                    items.map((it, idx) => {
                      const avatarInfo = getItemAvatarInfo(it.detail, grp)
                      return (
                        <tr
                          key={it.detail}
                          className={cn(
                            'border-b border-border/40 hover:bg-muted/15 transition-colors group/item',
                            idx % 2 === 1 && 'bg-muted/5'
                          )}
                        >
                          {/* Sticky Col 1: Avatar xem tiêu chuẩn, tên chỉ tiêu, yêu cầu, nút ẩn */}
                          <td className="p-2 px-3 sticky left-0 bg-background/95 backdrop-blur-xs z-10 w-[350px] min-w-[350px] border-r border-border shadow-[inset_-1px_0_0_var(--border)] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border/90 after:pointer-events-none relative align-middle">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 min-w-0">
                                {/* Avatar ở phía đầu, bấm vào để mở xem tiêu chuẩn */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenStandard({
                                      type: 'item',
                                      name: it.detail,
                                      group: grp,
                                      requirement: it.requirement,
                                    })
                                  }
                                  className="relative shrink-0 w-8 h-8 rounded-md overflow-hidden border border-border/80 hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer group/avatar mt-0.5 shadow-2xs"
                                  title="Bấm để xem tiêu chuẩn vận hành & ảnh/video mẫu 5 sao"
                                >
                                  <img
                                    src={avatarInfo.avatar}
                                    alt={it.detail}
                                    className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-200"
                                  />
                                  {avatarInfo.hasVideo && (
                                    <span className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                      <Play className="h-2.5 w-2.5 text-white fill-white drop-shadow-xs" />
                                    </span>
                                  )}
                                </button>

                                <div className="space-y-0.5 min-w-0 pr-1">
                                  <p className="font-normal text-foreground/90 text-xs leading-tight">
                                    {it.detail}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                                    {it.requirement || 'Theo tiêu chuẩn vận hành 5 sao.'}
                                  </p>
                                </div>
                              </div>

                              {/* Nút ẩn tiêu chí đơn lẻ */}
                              <button
                                type="button"
                                onClick={() => onSkipCriterion(it.detail, grp)}
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover/item:opacity-100 cursor-pointer shrink-0 mt-0.5"
                                title="Bỏ qua tiêu chí này tại cơ sở này"
                              >
                                <EyeOff className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>

                        {/* 7 Days Columns */}
                        {weekDays.map((day) => {
                          if (day.isToday) {
                            // CỘT HÔM NAY: 1 HÀNG NGANG GỌN GÀNG [Đạt] [Lỗi] [Ảnh]
                            const evalStatus = getItemTodayStatus(it.detail)
                            const itemPhotos = getItemPhotos(it.detail)
                            const hasPhoto = itemPhotos.length > 0

                            return (
                              <td
                                key={day.dateStr}
                                className="p-1 px-2 border-r border-border/40 last:border-r-0 bg-primary/5 align-middle"
                              >
                                <div className="flex items-center justify-between gap-1 w-full">
                                  {/* Cạnh trái: Nút Đạt & Lỗi */}
                                  <div data-explain="today-eval-cell" className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => onSetItemStatus(it.detail, 'pass')}
                                      className={cn(
                                        'h-6 px-1.5 rounded text-[11px] font-normal flex items-center gap-0.5 transition-all cursor-pointer border',
                                        evalStatus === 'pass'
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-medium'
                                          : 'bg-background text-muted-foreground border-border/80 hover:bg-emerald-50 hover:text-emerald-700'
                                      )}
                                      title="Đạt tiêu chuẩn"
                                    >
                                      <Check className="h-3 w-3" />
                                      <span>Đạt</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onSetItemStatus(it.detail, 'fail')}
                                      className={cn(
                                        'h-6 px-1.5 rounded text-[11px] font-normal flex items-center gap-0.5 transition-all cursor-pointer border',
                                        evalStatus === 'fail'
                                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-medium'
                                          : 'bg-background text-muted-foreground border-border/80 hover:bg-rose-50 hover:text-rose-700'
                                      )}
                                      title="Không đạt / Lỗi"
                                    >
                                      <X className="h-3 w-3" />
                                      <span>Lỗi</span>
                                    </button>
                                  </div>

                                  {/* Cạnh phải: Nút Ảnh nằm sát mép phải */}
                                  <button
                                    type="button"
                                    data-explain="evidence-btn"
                                    onClick={() =>
                                      onOpenEvidence({
                                        type: 'item',
                                        name: it.detail,
                                        group: grp,
                                        dateStr: day.dateStr,
                                        isPastDay: false,
                                      })
                                    }
                                    className={cn(
                                      'h-6 px-1.5 rounded text-[10px] flex items-center gap-0.5 transition-colors cursor-pointer border shrink-0',
                                      hasPhoto
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border-blue-300'
                                        : 'bg-background text-muted-foreground/80 border-border/80 hover:bg-muted/70 hover:text-foreground'
                                    )}
                                    title="Đính kèm file / hình ảnh bằng chứng"
                                  >
                                    <Camera className="h-3 w-3" />
                                    <span>{hasPhoto ? itemPhotos.length : '+'}</span>
                                  </button>
                                </div>
                              </td>
                            )
                          }

                          // Tương lai
                          if (day.dateStr > '2026-10-29') {
                            return (
                              <td
                                key={day.dateStr}
                                className="p-2 text-center border-r border-border/40 last:border-r-0 text-muted-foreground/40 align-middle"
                              >
                                —
                              </td>
                            )
                          }

                          // CỘT NGÀY TRƯỚC: Hiển thị kết quả + Nút xem ảnh bằng chứng nếu có
                          const hist = getHistoricalItemStatus(day.dateStr, it.detail)
                          const pastPhotos = hist.photos || []
                          const hasPastPhotos = pastPhotos.length > 0

                          return (
                            <td
                              key={day.dateStr}
                              className="p-1 px-2 border-r border-border/40 last:border-r-0 align-middle"
                            >
                              <div className="flex items-center justify-between gap-1 w-full">
                                {/* Cạnh trái: Trạng thái Đạt / Lỗi */}
                                <div className="flex items-center gap-1">
                                  {hist.status === 'pass' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                      <Check className="h-3 w-3" />
                                      <span>Đạt</span>
                                    </span>
                                  )}
                                  {hist.status === 'fail' && (
                                    <span
                                      className="inline-flex items-center gap-1 text-[11px] font-normal text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800"
                                      title={hist.note || 'Có sự cố'}
                                    >
                                      <X className="h-3 w-3" />
                                      <span>Lỗi</span>
                                    </span>
                                  )}
                                  {hist.status === 'not_submitted' && (
                                    <span className="text-muted-foreground/60 text-[10px]">
                                      Chưa nộp
                                    </span>
                                  )}
                                </div>

                                {/* Cạnh phải: Nút xem ảnh ngày trước */}
                                {hasPastPhotos && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenEvidence({
                                        type: 'item',
                                        name: it.detail,
                                        group: grp,
                                        dateStr: day.dateStr,
                                        isPastDay: true,
                                        photos: pastPhotos,
                                      })
                                    }
                                    className="h-5 px-1.5 rounded text-[10px] flex items-center gap-0.5 font-medium border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 cursor-pointer shrink-0"
                                    title="Xem ảnh bằng chứng lưu trữ"
                                  >
                                    <Camera className="h-2.5 w-2.5" />
                                    <span>{pastPhotos.length}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })
          ) : (
            /* =================== CA TỐI =================== */
            Object.entries(activeClosingGrouped).map(([grp, tasks]) => {
              const isCollapsed = collapsedCategories.includes(grp)
              const itemNames = tasks.map((t) => t.name)

              return (
                <React.Fragment key={grp}>
                  <DailyCheckCategoryRow
                    group={grp}
                    itemCount={tasks.length}
                    itemNames={itemNames}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => onToggleCollapseCategory(grp)}
                    onSkipCategory={onSkipCategory}
                    weekDays={weekDays}
                    getCategoryDayScore={getCategoryDayScore}
                    getCategoryPhotos={getCategoryPhotos}
                    onOpenEvidence={onOpenEvidence}
                  />

                  {/* Tasks Rows */}
                  {!isCollapsed &&
                    tasks.map((task, idx) => {
                      const avatarInfo = getItemAvatarInfo(task.name, grp)
                      return (
                        <tr
                          key={task.id}
                          className={cn(
                            'border-b border-border/40 hover:bg-muted/15 transition-colors group/item',
                            idx % 2 === 1 && 'bg-muted/5'
                          )}
                        >
                          <td className="p-2 px-3 sticky left-0 bg-background/95 backdrop-blur-xs z-10 w-[350px] min-w-[350px] border-r border-border shadow-[inset_-1px_0_0_var(--border)] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border/90 after:pointer-events-none relative align-middle">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 min-w-0">
                                {/* Avatar ở phía đầu, bấm vào để mở xem tiêu chuẩn */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenStandard({
                                      type: 'item',
                                      name: task.name,
                                      group: grp,
                                      requirement: task.description,
                                    })
                                  }
                                  className="relative shrink-0 w-8 h-8 rounded-md overflow-hidden border border-border/80 hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer group/avatar mt-0.5 shadow-2xs"
                                  title="Bấm để xem tiêu chuẩn vận hành & ảnh/video mẫu 5 sao"
                                >
                                  <img
                                    src={avatarInfo.avatar}
                                    alt={task.name}
                                    className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-200"
                                  />
                                  {avatarInfo.hasVideo && (
                                    <span className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                      <Play className="h-2.5 w-2.5 text-white fill-white drop-shadow-xs" />
                                    </span>
                                  )}
                                </button>

                                <div className="space-y-0.5 min-w-0 pr-1">
                                  <p className="font-normal text-foreground/90 text-xs leading-tight">
                                    {task.name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                                    {task.description}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => onSkipCriterion(task.name, grp)}
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover/item:opacity-100 cursor-pointer shrink-0 mt-0.5"
                                title="Bỏ qua nhiệm vụ này tại cơ sở này"
                              >
                                <EyeOff className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>

                        {weekDays.map((day) => {
                          if (day.isToday) {
                            const evalStatus = getItemTodayStatus(task.name)
                            const itemPhotos = getItemPhotos(task.name)
                            const hasPhoto = itemPhotos.length > 0

                            return (
                              <td
                                key={day.dateStr}
                                className="p-1 px-2 border-r border-border/40 last:border-r-0 bg-primary/5 align-middle"
                              >
                                <div className="flex items-center justify-between gap-1 w-full">
                                  {/* Cạnh trái: Nút Đạt & Lỗi */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => onSetItemStatus(task.name, 'pass')}
                                      className={cn(
                                        'h-6 px-1.5 rounded text-[11px] font-normal flex items-center gap-0.5 transition-all cursor-pointer border',
                                        evalStatus === 'pass'
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-medium'
                                          : 'bg-background text-muted-foreground border-border/80 hover:bg-emerald-50 hover:text-emerald-700'
                                      )}
                                      title="Đã hoàn tất"
                                    >
                                      <Check className="h-3 w-3" />
                                      <span>Đạt</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onSetItemStatus(task.name, 'fail')}
                                      className={cn(
                                        'h-6 px-1.5 rounded text-[11px] font-normal flex items-center gap-0.5 transition-all cursor-pointer border',
                                        evalStatus === 'fail'
                                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-medium'
                                          : 'bg-background text-muted-foreground border-border/80 hover:bg-rose-50 hover:text-rose-700'
                                      )}
                                      title="Chưa xong"
                                    >
                                      <X className="h-3 w-3" />
                                      <span>Lỗi</span>
                                    </button>
                                  </div>

                                  {/* Cạnh phải: Nút Ảnh đính kèm */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenEvidence({
                                        type: 'item',
                                        name: task.name,
                                        group: grp,
                                        dateStr: day.dateStr,
                                        isPastDay: false,
                                      })
                                    }
                                    className={cn(
                                      'h-6 px-1.5 rounded text-[10px] flex items-center gap-0.5 transition-colors cursor-pointer border shrink-0',
                                      hasPhoto
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border-blue-300'
                                        : 'bg-background text-muted-foreground/80 border-border/80 hover:bg-muted/70 hover:text-foreground'
                                    )}
                                    title="Đính kèm file / hình ảnh bằng chứng"
                                  >
                                    <Camera className="h-3 w-3" />
                                    <span>{hasPhoto ? itemPhotos.length : '+'}</span>
                                  </button>
                                </div>
                              </td>
                            )
                          }

                          if (day.dateStr > '2026-10-29') {
                            return (
                              <td
                                key={day.dateStr}
                                className="p-2 text-center border-r border-border/40 last:border-r-0 text-muted-foreground/40 align-middle"
                              >
                                —
                              </td>
                            )
                          }

                          const hist = getHistoricalItemStatus(day.dateStr, task.name)
                          const pastPhotos = hist.photos || []
                          const hasPastPhotos = pastPhotos.length > 0

                          return (
                            <td
                              key={day.dateStr}
                              className="p-1 px-2 border-r border-border/40 last:border-r-0 align-middle"
                            >
                              <div className="flex items-center justify-between gap-1 w-full">
                                {/* Cạnh trái: Trạng thái Đạt / Lỗi */}
                                <div className="flex items-center gap-1">
                                  {hist.status === 'pass' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                      <Check className="h-3 w-3" />
                                      <span>Đạt</span>
                                    </span>
                                  )}
                                  {hist.status === 'fail' && (
                                    <span
                                      className="inline-flex items-center gap-1 text-[11px] font-normal text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800"
                                      title={hist.note || 'Có sự cố'}
                                    >
                                      <X className="h-3 w-3" />
                                      <span>Lỗi</span>
                                    </span>
                                  )}
                                  {hist.status === 'not_submitted' && (
                                    <span className="text-muted-foreground/60 text-[10px]">
                                      Chưa nộp
                                    </span>
                                  )}
                                </div>

                                {/* Cạnh phải: Nút xem ảnh ngày trước */}
                                {hasPastPhotos && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenEvidence({
                                        type: 'item',
                                        name: task.name,
                                        group: grp,
                                        dateStr: day.dateStr,
                                        isPastDay: true,
                                        photos: pastPhotos,
                                      })
                                    }
                                    className="h-5 px-1.5 rounded text-[10px] flex items-center gap-0.5 font-medium border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 cursor-pointer shrink-0"
                                    title="Xem ảnh bằng chứng lưu trữ"
                                  >
                                    <Camera className="h-2.5 w-2.5" />
                                    <span>{pastPhotos.length}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
