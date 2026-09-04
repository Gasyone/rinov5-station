/* eslint-disable @next/next/no-img-element */
'use client'

import {
  BookOpen,
  Calendar,
  Clock,
  Coins,
  GraduationCap,
  Layers,
  Package,
  PenTool,
  Tag,
  Tags,
  Ticket,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/format'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { Product, ProductCategory } from '@/mocks/products'
import { CATEGORY_LABELS, STATUS_LABELS } from './productsTypes'

function CategoryIcon({ category }: { category: ProductCategory }) {
  switch (category) {
    case 'course':
      return <GraduationCap className="h-6 w-6 text-primary" />
    case 'combo':
      return <Layers className="h-6 w-6 text-purple-600" />
    case 'book':
      return <BookOpen className="h-6 w-6 text-sky-600" />
    case 'stationery':
      return <PenTool className="h-6 w-6 text-amber-600" />
    case 'physical_product':
      return <Package className="h-6 w-6 text-emerald-600" />
    case 'service':
      return <Tag className="h-6 w-6 text-violet-600" />
    default:
      return <Package className="h-6 w-6 text-muted-foreground" />
  }
}

interface ProductDetailDialogProps {
  open: boolean
  product: Product | null
  onOpenChange: (open: boolean) => void
  onToggleStatus?: (product: Product) => void
  onOpenVouchers?: (product: Product) => void
}

export function ProductsFormDialog({
  open,
  product,
  onOpenChange,
  onOpenVouchers,
}: ProductDetailDialogProps) {
  if (!product) return null

  const isCombo = product.isCombo || product.category === 'combo'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-bold">
                Chi tiết {isCombo ? 'Gói Combo' : 'Sản phẩm'}
              </DialogTitle>
              {isCombo ? (
                <Badge
                  variant="secondary"
                  className="rounded px-2 py-0.5 text-xs font-semibold border border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                >
                  Gói Combo
                </Badge>
              ) : (
                <Badge variant="outline" className="rounded px-2 py-0.5 text-xs font-normal text-muted-foreground">
                  Sản phẩm đơn lẻ
                </Badge>
              )}
            </div>
            <Badge className={cn('rounded-md text-xs', getStatusBadgeClass(product.status))}>
              {STATUS_LABELS[product.status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Header Card: Square Image + Name + SKU + Group */}
          <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover"
                />
              ) : (
                <CategoryIcon category={product.category} />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {product.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-muted-foreground">
                <span className="font-mono font-semibold text-foreground">
                  Mã SKU: {product.code}
                </span>
                <span>•</span>
                <span>Nhóm: {product.group}</span>
              </div>
            </div>
          </div>

          {/* Grid thông tin chi tiết */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Coins className="h-3.5 w-3.5 text-amber-600" />
                <span>Giá bán lẻ</span>
              </div>
              <p className="mt-1 font-mono text-base font-bold text-foreground">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-sky-600" />
                <span>Đơn vị tính</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {product.unit}
              </p>
            </div>

            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Thời hạn hiệu lực</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {product.duration}
              </p>
            </div>

            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5 text-indigo-600" />
                <span>Loại sản phẩm</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {CATEGORY_LABELS[product.category]}
              </p>
            </div>

            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5 text-foreground/70" />
                <span>Người tạo</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {product.createdBy}
              </p>
            </div>

            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-foreground/70" />
                <span>Ngày tạo</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatDate(product.createdAt)}
              </p>
            </div>
          </div>

          {/* Danh sách sản phẩm trong combo (nếu là Gói Combo) */}
          {isCombo && product.comboItems?.length ? (
            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Layers className="h-3.5 w-3.5 text-purple-600" />
                <span>Sản phẩm thành phần trong Gói Combo ({product.comboItems.length})</span>
              </div>
              <div className="mt-2.5 divide-y divide-border/60 rounded-md border border-border/60 bg-muted/20">
                {product.comboItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 text-xs gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-foreground truncate" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {item.duration ? (
                        <span className="text-muted-foreground font-medium text-xs bg-muted/60 px-1.5 py-0.5 rounded">
                          {item.duration}
                        </span>
                      ) : null}
                      <div className="text-right">
                        {item.originalPrice !== item.discountPrice ? (
                          <span className="text-xs line-through text-muted-foreground font-mono mr-1.5">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        ) : null}
                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(item.discountPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Description */}
          {product.description ? (
            <div className="rounded-md border border-border/70 bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Mô tả chi tiết
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {product.description}
              </p>
            </div>
          ) : null}

          {/* Vouchers / Danh sách khuyến mại */}
          <div className="rounded-md border border-border/70 bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Ticket className="h-3.5 w-3.5 text-amber-600" />
                <span>Khuyến mại & Voucher áp dụng ({product.vouchers?.length ?? 0})</span>
              </div>
              {onOpenVouchers ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary hover:text-primary/90 font-medium cursor-pointer"
                  onClick={() => onOpenVouchers(product)}
                >
                  Mở danh sách khuyến mại
                </Button>
              ) : null}
            </div>
            {product.vouchers?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.vouchers.map((v) => (
                  <Badge
                    key={v}
                    variant="outline"
                    className="rounded-md border-amber-300 bg-amber-50/70 text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300 font-mono text-xs cursor-pointer hover:bg-amber-100"
                    onClick={() => onOpenVouchers?.(product)}
                  >
                    {v}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Chưa có mã khuyến mại riêng. Bấm &quot;Mở danh sách khuyến mại&quot; để tra cứu toàn bộ ưu đãi của trung tâm.
              </p>
            )}
          </div>

          {/* Tags */}
          {product.tags?.length ? (
            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Tags className="h-3.5 w-3.5" />
                <span>Thẻ gắn kèm</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

