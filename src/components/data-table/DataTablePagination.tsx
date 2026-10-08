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
  /** Kích thước thanh phân trang: 'default' | 'sm' */
  size?: 'default' | 'sm'
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
  const isSm = size === 'sm'
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const firstRecord = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastRecord = Math.min(safePage * pageSize, total)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 text-muted-foreground bg-muted/20 select-none',
        isSm ? 'px-3 py-0.5 text-xs min-h-7' : 'px-3 py-1 text-[11.5px] min-h-8',
        className
      )}
    >
      {/* Bên trái: Thông tin hiển thị / Trạng thái chọn */}
      <div className="flex items-center gap-2 min-w-0">
        {selectedCount > 0 ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.2 text-xs font-semibold text-primary">
              Đã chọn <strong className="font-mono">{selectedCount}</strong> / {total} dòng
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer transition-colors"
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
      <div className="flex items-center gap-2">
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
                'font-medium bg-background border-border/80 shadow-2xs hover:bg-muted/50 w-auto gap-1 rounded-md',
                isSm ? 'h-6 px-1.5 text-[10.5px]' : 'h-6.5 px-2 text-xs'
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
          'inline-flex items-center rounded-md border border-border/80 bg-background shadow-2xs overflow-hidden divide-x divide-border/60',
          isSm ? 'h-6' : 'h-6.5'
        )}>
          {totalPages > 3 && (
            <button
              type="button"
              aria-label="Trang đầu"
              disabled={safePage === 1}
              onClick={() => onPageChange(1)}
              className={cn(
                'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
                isSm ? 'px-1' : 'px-1.5'
              )}
              title="Trang đầu"
            >
              <ChevronsLeft className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>
          )}

          <button
            type="button"
            aria-label="Trang trước"
            disabled={safePage === 1}
            onClick={() => onPageChange(safePage - 1)}
            className={cn(
              'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
              isSm ? 'px-1' : 'px-1.5'
            )}
            title="Trang trước"
          >
            <ChevronLeft className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          </button>

          <div className={cn(
            'h-full flex items-center justify-center font-mono font-medium text-foreground bg-muted/20',
            isSm ? 'px-1.5 text-[10.5px]' : 'px-2.5 text-xs'
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
              isSm ? 'px-1' : 'px-1.5'
            )}
            title="Trang sau"
          >
            <ChevronRight className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          </button>

          {totalPages > 3 && (
            <button
              type="button"
              aria-label="Trang cuối"
              disabled={safePage === totalPages}
              onClick={() => onPageChange(totalPages)}
              className={cn(
                'h-full text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center',
                isSm ? 'px-1' : 'px-1.5'
              )}
              title="Trang cuối"
            >
              <ChevronsRight className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
