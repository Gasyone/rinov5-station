'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ChevronDown,
  Package,
  Check,
} from 'lucide-react'

export interface HistoricalPackageItem {
  id: string
  programName: string // Dòng 1: Tên chương trình (xóa nền, text thường, màu đen)
  packageName: string // Dòng 2: Tên gói (text thường, màu nhạt)
  statusLabel?: string // Cột phải: Nhãn 'Hết buổi' | 'Hết hạn'
  totalSessions?: number
  remainingSessions?: number
}

export interface HistoricalPackagesPopoverProps {
  items: HistoricalPackageItem[]
  selectedId?: string
  onSelect: (item: HistoricalPackageItem) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  triggerClassName?: string
  triggerLabel?: string
  align?: 'start' | 'center' | 'end'
}

export function HistoricalPackagesPopover({
  items,
  selectedId,
  onSelect,
  open,
  onOpenChange,
  className,
  triggerClassName,
  triggerLabel = 'Khác',
  align = 'start',
}: HistoricalPackagesPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen
  const handleOpenChange = onOpenChange || setUncontrolledOpen

  const selectedItem = items.find((i) => i.id === selectedId)
  const isSelected = Boolean(selectedItem)

  if (items.length === 0) return null

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'shrink-0 relative flex flex-col items-start justify-center rounded-lg px-2 py-0.5 text-left transition-all cursor-pointer shadow-3xs h-[34px] min-w-[95px] max-w-[125px]',
            isSelected
              ? 'border border-sky-300 dark:border-sky-700 bg-sky-50/80 dark:bg-sky-950/40 text-foreground'
              : 'border border-border/80 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground',
            triggerClassName
          )}
          title="Danh sách các gói cũ / đã hết buổi hoặc hết hạn"
        >
          <div className="flex items-center gap-1 w-full leading-tight">
            <span className="text-[11px] font-semibold text-foreground">
              {triggerLabel}
            </span>
            <span className="px-1 py-0 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold leading-none">
              {items.length}
            </span>
            <ChevronDown
              className={cn(
                'h-3 w-3 text-muted-foreground ml-auto shrink-0 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </div>
          <span
            className="text-[9.5px] text-muted-foreground font-normal leading-tight pt-0.5 truncate w-full"
            title={selectedItem ? selectedItem.packageName : 'Gói cũ, hết hạn'}
          >
            {selectedItem ? selectedItem.packageName : 'Gói cũ, hết hạn'}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={6}
        className={cn(
          'w-[280px] p-2 rounded-xl border border-border/80 bg-popover shadow-xl space-y-1.5 z-50 text-left',
          className
        )}
      >
        {/* Header: [Icon Package] Gói cũ, hết hạn (N) - text thường, không in hoa, không in đậm */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/50 px-1">
          <div className="flex items-center gap-1.5 text-xs font-normal text-foreground">
            <Package className="h-3.5 w-3.5 text-sky-500 shrink-0" />
            <span>Gói cũ, hết hạn ({items.length})</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-normal shrink-0">
            Chọn để xem
          </span>
        </div>

        {/* Danh sách gói: Tách 2 dòng (Tên chương trình text thường màu đen ở trên, Tên gói text thường màu nhạt ở dưới, Nhãn hết buổi bên phải) */}
        <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
          {items.map((item) => {
            const isCurrent = item.id === selectedId

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item)
                  handleOpenChange(false)
                }}
                className={cn(
                  'flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer group',
                  isCurrent
                    ? 'bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60'
                    : 'hover:bg-muted/50 border border-transparent'
                )}
                title={`${item.programName} - ${item.packageName}`}
              >
                {/* Cột trái: 2 dòng */}
                <div className="flex flex-col min-w-0 flex-1 pr-1">
                  {/* Dòng 1: Tên chương trình (xóa nền, text thường, màu đen) */}
                  <span className="text-xs font-normal text-foreground truncate leading-tight">
                    {item.programName}
                  </span>
                  {/* Dòng 2: Tên gói (text thường, màu nhạt) */}
                  <span className="text-[11px] font-normal text-muted-foreground truncate leading-tight mt-0.5">
                    {item.packageName}
                  </span>
                </div>

                {/* Cột phải: Nhãn hết buổi / hết hạn */}
                <div className="shrink-0 flex items-center gap-1">
                  {item.statusLabel && (
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-background">
                      {item.statusLabel}
                    </span>
                  )}
                  {isCurrent && (
                    <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
