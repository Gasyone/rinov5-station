'use client'

import {
  Check,
  Copy,
  Eye,
  Gift,
  Percent,
  Tag,
  Ticket,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { PromotionDiscountType, PromotionItem } from '@/mocks/promotions'
import {
  PROMOTION_STATUS_LABELS,
  PROMOTION_TYPE_LABELS,
} from './promotionsTypes'
import {
  formatDiscountDisplay,
  getUsageSummary,
} from './promotionsHelpers'

interface PromotionsTableProps {
  items: PromotionItem[]
  selectedIds: string[]
  onToggleSelectAll: (checked: boolean) => void
  onToggleSelectRow: (id: string, checked: boolean) => void
  onRowClick: (item: PromotionItem) => void
  onView: (item: PromotionItem) => void
}

function DiscountIcon({ type }: { type: PromotionDiscountType }) {
  switch (type) {
    case 'percentage':
      return <Percent className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
    case 'direct':
      return <Tag className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
    case 'buy_x_get_y':
      return <Gift className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
    default:
      return <Ticket className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
  }
}

export function PromotionsTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onRowClick,
  onView,
}: PromotionsTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Đã sao chép mã: ${code}`)
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev))
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <EmptyState
          icon={<Ticket className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy mã khuyến mãi nào"
          description="Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc phân loại."
        />
      </div>
    )
  }

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <Table containerClassName="min-w-full" className="min-w-[1050px]">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {/* Cột 1: Checkbox + Mã & Tên chương trình */}
          <TableHead className="min-w-[320px] max-w-[400px]">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => onToggleSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả mã"
              />
              <span>Mã khuyến mãi & Tên chương trình</span>
            </div>
          </TableHead>

          {/* Cột 2: Phân loại */}
          <TableHead className="min-w-[130px]">Phân loại</TableHead>

          {/* Cột 3: Mức chiết khấu */}
          <TableHead className="min-w-[150px]">Mức giảm</TableHead>

          {/* Cột 4: Hạn mức / Đã dùng */}
          <TableHead className="min-w-[170px]">Hạn mức & Đã dùng</TableHead>

          {/* Cột 5: Cơ sở / Phạm vi */}
          <TableHead className="min-w-[160px]">Cơ sở áp dụng</TableHead>

          {/* Cột 6: Thời hạn */}
          <TableHead className="min-w-[140px]">Thời hạn</TableHead>

          {/* Cột 7: Trạng thái */}
          <TableHead className="min-w-[130px]">Trạng thái</TableHead>

          {/* Cột 8: Thao tác */}
          <TableHead className="w-[80px] text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((promo) => {
          const isSelected = selectedIds.includes(promo.id)
          const isCopied = copiedCode === promo.code
          const usage = getUsageSummary(promo)
          const typeSemantic = promo.type === 'public' ? 'ma_chung' : 'ma_rieng'

          return (
            <TableRow
              key={promo.id}
              className={cn(
                'group/row cursor-pointer transition-colors',
                isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
              )}
              onClick={() => onRowClick(promo)}
            >
              {/* CỘT 1: CHECKBOX + MÃ CODE MONO + TÊN CHƯƠNG TRÌNH + MÔ TẢ */}
              <TableCell className="px-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onToggleSelectRow(promo.id, Boolean(checked))
                    }
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Chọn mã ${promo.code}`}
                    className="mt-1 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    {/* Hàng 1: Code pill + Nút copy */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-foreground bg-muted/80 px-2 py-0.5 rounded border border-border/80">
                        {promo.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(e, promo.code)}
                        className={cn(
                          'p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors cursor-pointer',
                          isCopied && 'text-emerald-600 dark:text-emerald-400'
                        )}
                        title="Sao chép mã"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Hàng 2: Tên chương trình */}
                    <p
                      className="mt-1 line-clamp-1 text-xs font-semibold text-foreground transition-colors hover:text-primary"
                      title={promo.name}
                    >
                      {promo.name}
                    </p>

                    {/* Hàng 3: Mô tả vắn tắt */}
                    <p
                      className="line-clamp-1 text-xs text-muted-foreground"
                      title={promo.description}
                    >
                      {promo.description}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* CỘT 2: PHÂN LOẠI (MÃ CHUNG / MÃ RIÊNG) */}
              <TableCell>
                <Badge
                  className={cn(
                    'rounded-md text-xs font-medium',
                    getStatusBadgeClass(typeSemantic)
                  )}
                >
                  {PROMOTION_TYPE_LABELS[promo.type]}
                </Badge>
              </TableCell>

              {/* CỘT 3: MỨC GIẢM CHIẾT KHẤU */}
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <DiscountIcon type={promo.discountType} />
                  <span className="font-mono text-xs font-bold text-foreground">
                    {formatDiscountDisplay(promo)}
                  </span>
                </div>
                {promo.minOrderValue > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Đơn từ {promo.minOrderValue.toLocaleString('vi-VN')} ₫
                  </p>
                )}
              </TableCell>

              {/* CỘT 4: HẠN MỨC / ĐÃ DÙNG */}
              <TableCell>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-xs">
                      {promo.type === 'public' ? 'Lượt dùng' : 'Số lượng'}
                    </span>
                    <span className="font-mono font-medium text-foreground text-xs">
                      {promo.usedCount} / {usage.total > 0 ? usage.total.toLocaleString('vi-VN') : '∞'} {usage.label}
                    </span>
                  </div>

                  {/* Thanh tiến độ mini */}
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        usage.percent >= 90
                          ? 'bg-red-500'
                          : usage.percent >= 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      )}
                      style={{ width: `${Math.max(4, usage.percent)}%` }}
                    />
                  </div>
                </div>
              </TableCell>

              {/* CỘT 5: CƠ SỞ ÁP DỤNG */}
              <TableCell>
                <p className="text-xs font-medium text-foreground truncate max-w-[150px]" title={promo.branch}>
                  {promo.branch}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]" title={promo.applicableCategoryText}>
                  {promo.applicableCategoryText}
                </p>
              </TableCell>

              {/* CỘT 6: THỜI HẠN */}
              <TableCell>
                <p className="text-xs font-medium text-foreground">
                  {promo.validTo === 'Không giới hạn' ? 'Không giới hạn' : `Đến ${promo.validTo}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Từ {promo.validFrom}
                </p>
              </TableCell>

              {/* CỘT 7: TRẠNG THÁI */}
              <TableCell>
                <Badge
                  className={cn(
                    'rounded-md text-xs',
                    getStatusBadgeClass(promo.status)
                  )}
                >
                  {PROMOTION_STATUS_LABELS[promo.status]}
                </Badge>
              </TableCell>

              {/* CỘT 8: THAO TÁC */}
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Xem chi tiết"
                    onClick={() => onView(promo)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
