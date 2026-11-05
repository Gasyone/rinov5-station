'use client'

import React from 'react'
import { ChevronDown, ChevronRight, RotateCcw, EyeOff, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface SkippedCriterionItem {
  id: string
  name: string
  group: string
}

export interface DailyCheckSkippedSectionProps {
  isOpen: boolean
  onToggle: () => void
  skippedCategories: string[]
  onRestoreCategory: (category: string) => void
  skippedCriteria: SkippedCriterionItem[]
  onRestoreCriterion: (name: string) => void
}

export function DailyCheckSkippedSection({
  isOpen,
  onToggle,
  skippedCategories,
  onRestoreCategory,
  skippedCriteria,
  onRestoreCriterion,
}: DailyCheckSkippedSectionProps) {
  const totalSkipped = skippedCategories.length + skippedCriteria.length

  return (
    <div data-explain="skipped-section" className="border-t border-border/80 bg-muted/20">
      {/* ─── TOGGLE HEADER (MẶC ĐỊNH LUÔN RÚT GỌN) ─── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-2.5 px-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer select-none text-left transition-colors"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <span className="font-semibold text-xs text-muted-foreground">
            Danh sách tiêu chuẩn & danh mục đã bỏ qua ({totalSkipped} mục)
          </span>
          <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
            Không tính vào thống kê
          </Badge>
        </div>

        <span className="text-[11px] text-muted-foreground">
          {isOpen ? 'Thu gọn' : 'Mở rộng để kích hoạt lại'}
        </span>
      </button>

      {/* ─── EXPANDED CONTENT ─── */}
      {isOpen && (
        <div className="p-3.5 space-y-3.5 border-t border-border/60 bg-background/50 animate-in fade-in-0 duration-150">
          {totalSkipped === 0 ? (
            <p className="text-xs text-muted-foreground py-2 text-center">
              Chưa có danh mục hoặc tiêu chí nào bị bỏ qua. Bấm &quot;Ẩn danh mục&quot; hoặc &quot;Ẩn tiêu chí&quot; trên ma trận để bỏ qua các hạng mục không áp dụng tại cơ sở này.
            </p>
          ) : (
            <div className="space-y-3">
              {/* 1. Danh mục đã ẩn */}
              {skippedCategories.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    <span>Danh mục đã ẩn ({skippedCategories.length})</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {skippedCategories.map((grp) => (
                      <div
                        key={grp}
                        className="flex items-center justify-between p-2 px-3 rounded-lg border border-dashed border-border bg-muted/20 text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold text-foreground text-xs truncate block">
                            {grp}
                          </span>
                          <p className="text-[10px] text-muted-foreground">Ẩn toàn bộ danh mục</p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRestoreCategory(grp)}
                          className="h-6 text-xs gap-1 cursor-pointer shrink-0 border-primary/40 text-primary hover:bg-primary/10"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Kích hoạt lại</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Tiêu chí đơn lẻ đã ẩn */}
              {skippedCriteria.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <EyeOff className="h-3 w-3" />
                    <span>Tiêu chí đơn lẻ đã ẩn ({skippedCriteria.length})</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {skippedCriteria.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 px-3 rounded-lg border border-dashed border-border bg-muted/20 text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-medium text-foreground text-xs truncate block" title={item.name}>
                            {item.name}
                          </span>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Thuộc nhóm: {item.group}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRestoreCriterion(item.name)}
                          className="h-6 text-xs gap-1 cursor-pointer shrink-0 border-primary/40 text-primary hover:bg-primary/10"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Kích hoạt lại</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
