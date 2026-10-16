'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100]

export interface DataTablePaginationProps {
  /** Current page (1-based) */
  page: number
  /** Total record count */
  total: number
  /** Page size (rows per page) */
  pageSize: number
  /** Allowed page sizes — defaults to [20, 50, 100] */
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  className?: string
  /** Selected count (optional) */
  selectedCount?: number
  /** Clear selection callback (optional) */
  onClearSelection?: () => void
  /** Kích thước thanh phân trang: 'default' | 'sm' | 'xs' */
  size?: 'default' | 'sm' | 'xs'
}

/**
 * Standard pagination footer for List Page Pattern.
 *
 * Minimalist Connected design (Linear / Notion style):
 * - Left: Total records or selection state
 * - Right: Compact page size selector + Connected segmented pagination
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function DataTablePagination({
  page,
  total,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  className,
  selectedCount = 0,
  onClearSelection,
  size = 'default',
}: DataTablePaginationProps) {
  const isXs = size === 'xs'
  const isSm = size === 'sm' || isXs
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const firstRecord = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastRecord = Math.min(safePage * pageSize, total)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 text-muted-foreground bg-muted/20 select-none',
        isXs
          ? 'px-2 py-0 text-[10.5px] min-h-0'
          : isSm
          ? 'px-2 py-0 text-[11px] min-h-0'
          : 'px-3 py-1 text-[11.5px] min-h-8',
        className
      )}
    >
      {/* Bên trái: Thông tin hiển thị / Trạng thái chọn */}
      <div className={cn('flex items-center gap-1.5 min-w-0', isXs ? 'text-[10.5px]' : isSm ? 'text-[11px]' : 'text-xs')}>
        {selectedCount > 0 ? (
          <div className="flex items-center gap-1.5">
            <span className={cn(
              'inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 font-semibold text-primary',
              isXs ? 'px-1 py-0 text-[10px]' : isSm ? 'px-1.5 py-0.2 text-[10.5px]' : 'px-1.5 py-0.2 text-xs'
            )}>
              Đã chọn <strong className="font-mono">{selectedCount}</strong> / {total} dòng
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className={cn(
                  'text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer transition-colors',
                  isXs ? 'text-[10px]' : isSm ? 'text-[10.5px]' : 'text-xs'
                )}
              >
                Bỏ chọn
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Hiển thị</span>
            <span className="font-mono font-medium text-foreground">
              {total === 0 ? '0' : `${firstRecord}–${lastRecord}`}
            </span>
            <span>trên</span>
            <span className="font-mono font-semibold text-foreground">{total}</span>
            <span>kết quả</span>
          </div>
        )}
      </div>

      {/* Bên phải: Cụm điều khiển Linear Connected */}
      <div className="flex items-center gap-1.5">
        {/* Bộ chọn số dòng: [ 20 / trang ▾ ] */}
        <div className="flex items-center">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value))
              onPageChange(1)
            }}
          >
            <SelectTrigger
              size="sm"
              className={cn(
                'font-medium bg-background border-border/80 shadow-2xs hover:bg-muted/50 w-auto gap-1',
                isXs
                  ? '!h-5 !py-0 px-1 text-[10px] rounded [&_svg]:!size-2.5'
                  : isSm
                  ? '!h-6 !py-0 px-2 text-[11px] rounded-md [&_svg]:!size-3'
                  : 'h-6.5 px-2 text-xs rounded-md'
              )}
            >
              <span className="font-mono font-semibold">{pageSize}</span>
              <span className="text-muted-foreground">/ trang</span>
            </SelectTrigger>
            <SelectContent align="end">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs">
                  {size} / trang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cụm phân trang nối liền khối (Connected Group Linear) */}
        <div className={cn(
          'inline-flex items-center border border-border/80 bg-background shadow-2xs overflow-hidden divide-x divide-border/60',
          isXs ? 'h-5 rounded' : isSm ? 'h-6 rounded-md' : 'h-6.5 rounded-md'
        )}>
          {totalPages > 3 && (
            <button
              type="button"
              aria-label="Trang đầu"
              disabled={safePage === 1}
              onClick={() => onPageChange(1)}
              className={cn(
                'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
                isXs ? 'px-0.5' : isSm ? 'px-1.5' : 'px-1.5'
              )}
              title="Trang đầu"
            >
              <ChevronsLeft className={isXs ? 'h-2.5 w-2.5' : isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>
          )}

          <button
            type="button"
            aria-label="Trang trước"
            disabled={safePage === 1}
            onClick={() => onPageChange(safePage - 1)}
            className={cn(
              'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
              isXs ? 'px-0.5' : isSm ? 'px-1.5' : 'px-1.5'
            )}
            title="Trang trước"
          >
            <ChevronLeft className={isXs ? 'h-2.5 w-2.5' : isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          </button>

          <div className={cn(
            'h-full flex items-center justify-center font-mono font-medium text-foreground bg-muted/20',
            isXs ? 'px-1 text-[10px]' : isSm ? 'px-2 text-[11px]' : 'px-2.5 text-xs'
          )}>
            {safePage} / {totalPages}
          </div>

          <button
            type="button"
            aria-label="Trang sau"
            disabled={safePage === totalPages}
            onClick={() => onPageChange(safePage + 1)}
            className={cn(
              'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
              isXs ? 'px-0.5' : isSm ? 'px-1.5' : 'px-1.5'
            )}
            title="Trang sau"
          >
            <ChevronRight className={isXs ? 'h-2.5 w-2.5' : isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          </button>

          {totalPages > 3 && (
            <button
              type="button"
              aria-label="Trang cuối"
              disabled={safePage === totalPages}
              onClick={() => onPageChange(totalPages)}
              className={cn(
                'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
                isXs ? 'px-0.5' : isSm ? 'px-1.5' : 'px-1.5'
              )}
              title="Trang cuối"
            >
              <ChevronsRight className={isXs ? 'h-2.5 w-2.5' : isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
