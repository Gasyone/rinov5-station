'use client'

import { useState } from 'react'
import {
  BookOpen,
  Clock,
  Layers,
  MapPin,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/mocks/products'

interface ProductComboPopoverProps {
  product: Product
  className?: string
}

export function ProductComboPopover({ product, className }: ProductComboPopoverProps) {
  const [open, setOpen] = useState(false)
  const items = product.comboItems ?? []

  if (items.length === 0) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer select-none mt-0.5',
            className
          )}
          title="Bấm để xem danh sách sản phẩm trong combo"
        >
          <Layers className="h-3 w-3 shrink-0" />
          <span>{items.length} sản phẩm trong combo</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[390px] sm:w-[430px] max-w-[95vw] p-3 text-xs shadow-xl border bg-background z-50 rounded-xl space-y-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title Danh sách sản phẩm */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-foreground">
              Danh sách sản phẩm trong combo ({items.length})
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
            {product.code}
          </span>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-3 py-0.5 max-h-72 overflow-y-auto pr-0.5 scrollbar-thin">
          {items.map((item, idx) => {
            return (
              <div
                key={idx}
                className="space-y-1.5 text-xs pb-2.5 border-b border-border/40 last:border-0 last:pb-0"
              >
                {/* Dòng 1: Icon + Tên sản phẩm + Phân loại (Gia Hạn/Mua mới) */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 flex-1 min-w-0">
                    <BookOpen className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-medium text-xs text-foreground leading-snug truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                    </div>
                  </div>

                  {item.orderType && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shrink-0 font-sans">
                      {item.orderType}
                    </span>
                  )}
                </div>

                {/* Dòng 2: Thời lượng (6 tháng...) + Giá gốc & Giá ưu đãi */}
                <div className="flex items-center justify-between text-xs pl-5 gap-2 flex-wrap">
                  {item.duration ? (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span className="font-medium text-foreground">{item.duration}</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground ml-auto">
                    {item.originalPrice !== item.discountPrice && (
                      <span>
                        Giá gốc:{' '}
                        <span className="line-through font-mono">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      </span>
                    )}
                    {item.originalPrice !== item.discountPrice && <span>•</span>}
                    <span>
                      Ưu đãi:{' '}
                      <strong className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.discountPrice)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
