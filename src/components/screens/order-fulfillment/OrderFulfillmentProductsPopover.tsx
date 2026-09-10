'use client'

import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  FileText,
  Gift,
  MapPin,
  Package,
  Shirt,
  User,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  PRODUCT_CATEGORY_MAP,
  type FulfillmentProductCategory,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'

interface OrderFulfillmentProductsPopoverProps {
  record: OrderFulfillmentRecord
  className?: string
}

function getProductCategoryIcon(category: FulfillmentProductCategory) {
  switch (category) {
    case 'textbook':
      return <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
    case 'learning_material':
      return <FileText className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
    case 'gift':
      return <Gift className="h-3.5 w-3.5 text-pink-500 shrink-0" />
    case 'uniform':
      return <Shirt className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
    case 'kit':
      return <Package className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
    default:
      return <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
  }
}

export function OrderFulfillmentProductsPopover({
  record,
  className,
}: OrderFulfillmentProductsPopoverProps) {
  const [open, setOpen] = useState(false)
  const products = record.products || []
  const hasMultipleProducts = products.length > 1
  const firstProduct = products[0]

  if (!firstProduct) {
    return <span className="text-muted-foreground text-xs">—</span>
  }

  const totalQuantity = products.reduce((acc, p) => acc + (p.quantity || 1), 0)
  const distinctCategories = Array.from(
    new Set(products.map((p) => PRODUCT_CATEGORY_MAP[p.category] || p.category))
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'min-w-0 text-xs rounded-md transition-colors select-none cursor-pointer group/pkg hover:bg-muted/40 p-1 -m-1',
            className
          )}
          onClick={(e) => e.stopPropagation()}
          title="Nhấp xem chi tiết danh sách sản phẩm bàn giao"
        >
          {/* Dòng 1: Nếu 1 SP thì hiển thị thẳng tên SP; Nếu nhiều SP thì là "[N] sản phẩm" */}
          {hasMultipleProducts ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <Package className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-semibold text-foreground group-hover/pkg:text-primary text-xs truncate">
                {products.length} sản phẩm
              </span>
              <ChevronDown
                className={cn(
                  'h-3 w-3 text-muted-foreground/80 shrink-0 transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 min-w-0">
              <p
                className="truncate font-medium text-foreground group-hover/pkg:text-primary group-hover/pkg:underline text-xs"
                title={firstProduct.name}
              >
                {firstProduct.name}
              </p>
            </div>
          )}

          {/* Dòng 2: Số lượng hiện vật & Phân loại danh mục (xác định 100% thuộc tính sản phẩm) */}
          {hasMultipleProducts ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 min-w-0 truncate">
              <span className="font-mono font-medium text-foreground text-[11px] shrink-0">
                Tổng {totalQuantity} món
              </span>
              <span className="text-muted-foreground/40 shrink-0 font-light">•</span>
              <span
                className="text-[11px] text-muted-foreground truncate"
                title={`Tổng ${totalQuantity} hiện vật thuộc các danh mục: ${distinctCategories.join(', ')}`}
              >
                {distinctCategories.join(', ')}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 min-w-0">
              <span className="font-mono text-foreground font-medium text-[11px] shrink-0">
                SL: {firstProduct.quantity} {firstProduct.unit}
              </span>
              <span className="text-muted-foreground/40 shrink-0 font-light">•</span>
              <span className="text-[11px] text-muted-foreground truncate">
                {PRODUCT_CATEGORY_MAP[firstProduct.category] || firstProduct.category}
              </span>
            </div>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[380px] sm:w-[440px] max-w-[95vw] p-3 text-xs shadow-xl border bg-background z-50 rounded-xl space-y-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title Danh sách sản phẩm bàn giao */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-1.5 min-w-0">
            <Package className="h-4 w-4 text-primary shrink-0" />
            <span className="font-bold text-xs text-foreground truncate">
              Danh sách sản phẩm bàn giao ({products.length})
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">
            {record.id}
          </span>
        </div>

        {/* Danh sách từng sản phẩm */}
        <div className="space-y-2.5 py-0.5 max-h-72 overflow-y-auto pr-0.5 divide-y divide-border/40">
          {products.map((p, idx) => {
            const categoryLabel = PRODUCT_CATEGORY_MAP[p.category] || p.category
            return (
              <div key={p.id || idx} className={cn('space-y-1 text-xs', idx > 0 && 'pt-2')}>
                {/* Dòng 1: Icon category + Tên sản phẩm + Phân loại badge + Số lượng */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {getProductCategoryIcon(p.category)}
                    <span
                      className="font-medium text-xs text-foreground leading-snug truncate"
                      title={p.name}
                    >
                      {p.name}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shrink-0 font-sans">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs shrink-0 font-sans ml-auto">
                    <span className="text-muted-foreground text-xs">
                      SL: <strong className="font-semibold font-mono text-foreground">{p.quantity}</strong> {p.unit}
                    </span>
                  </div>
                </div>

                {/* Dòng 2: Cơ sở và Người thụ hưởng */}
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pl-5.5 pt-0.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    <span className="truncate text-[11px]">
                      Cơ sở: <span className="font-medium text-foreground">{record.branch}</span>
                    </span>
                  </div>
                  {record.studentName && (
                    <div className="flex items-center gap-1 text-xs shrink-0">
                      <User className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span className="text-[11px]">
                        Học viên: <span className="font-medium text-foreground">{record.studentName}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer: Tổng số lượng */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-muted-foreground text-[11px]">
          <span>
            Tổng số loại: <strong className="font-medium text-foreground">{products.length}</strong>
          </span>
          <span>
            Tổng hiện vật: <strong className="font-semibold text-foreground font-mono">{totalQuantity}</strong>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
