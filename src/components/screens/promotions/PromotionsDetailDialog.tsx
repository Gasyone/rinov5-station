'use client'

import {
  Check,
  Clock,
  Copy,
  Layers,
  MapPin,
  Percent,
  Tag,
  Ticket,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InfoField, Panel, StatusBadge } from '@/components/shared'
import { formatCurrency } from '@/lib/format'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { PromotionItem } from '@/mocks/promotions'
import {
  PROMOTION_DISCOUNT_TYPE_LABELS,
  PROMOTION_STATUS_LABELS,
  PROMOTION_TYPE_LABELS,
} from './promotionsTypes'
import {
  formatDiscountDisplay,
  getUsageSummary,
} from './promotionsHelpers'

interface PromotionsDetailDialogProps {
  open: boolean
  promotion: PromotionItem | null
  onOpenChange: (open: boolean) => void
}

export function PromotionsDetailDialog({
  open,
  promotion,
  onOpenChange,
}: PromotionsDetailDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!promotion) return null

  const usage = getUsageSummary(promotion)
  const isPublic = promotion.type === 'public'
  const typeSemantic = isPublic ? 'ma_chung' : 'ma_rieng'

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promotion.code)
    setCopied(true)
    toast.success(`Đã sao chép mã khuyến mãi: ${promotion.code}`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] sm:max-w-[760px] max-h-[85vh] flex flex-col p-0 gap-0 bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header bar */}
        <DialogHeader className="shrink-0 p-4 px-6 bg-card border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Ticket className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-foreground truncate">
                {promotion.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {promotion.code}
                </span>
                <Badge
                  className={cn(
                    'rounded-md text-xs font-medium',
                    getStatusBadgeClass(typeSemantic)
                  )}
                >
                  {PROMOTION_TYPE_LABELS[promotion.type]}
                </Badge>
                <StatusBadge
                  status={promotion.status}
                  label={PROMOTION_STATUS_LABELS[promotion.status]}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Dialog Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mô tả chương trình */}
          {promotion.description && (
            <div className="rounded-lg bg-muted/40 p-3.5 border border-border/60">
              <p className="text-xs text-foreground leading-relaxed">
                {promotion.description}
              </p>
            </div>
          )}

          {/* Panel 1: Thông số chiết khấu & Điều kiện */}
          <Panel title="Thông số chiết khấu & Điều kiện" icon={<Percent className="size-4 text-emerald-600" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Hình thức chiết khấu"
                value={PROMOTION_DISCOUNT_TYPE_LABELS[promotion.discountType]}
              />
              <InfoField
                label="Mức giảm giá"
                value={
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatDiscountDisplay(promotion)}
                  </span>
                }
              />
              <InfoField
                label="Đơn hàng tối thiểu"
                value={
                  promotion.minOrderValue > 0
                    ? formatCurrency(promotion.minOrderValue)
                    : 'Không yêu cầu'
                }
              />
            </div>
          </Panel>

          {/* Panel 2: Hạn mức & Tiến độ sử dụng */}
          <Panel title="Hạn mức & Tiến độ sử dụng" icon={<Tag className="size-4 text-sky-600" />}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoField
                  label={isPublic ? 'Tổng lượt dùng tối đa' : 'Tổng số lượng phôi mã'}
                  value={
                    <span className="font-mono font-semibold">
                      {usage.total > 0 ? `${usage.total.toLocaleString('vi-VN')} ${usage.label}` : 'Không giới hạn'}
                    </span>
                  }
                />
                <InfoField
                  label="Đã sử dụng"
                  value={
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {usage.used.toLocaleString('vi-VN')} {usage.label}
                    </span>
                  }
                />
                <InfoField
                  label="Còn lại khả dụng"
                  value={
                    <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                      {usage.total > 0 ? `${usage.remaining.toLocaleString('vi-VN')} ${usage.label}` : 'Không giới hạn'}
                    </span>
                  }
                />
              </div>

              {/* Progress bar */}
              {usage.total > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tiến độ tiêu thụ mã</span>
                    <span className="font-mono font-medium">{usage.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        usage.percent >= 90
                          ? 'bg-red-500'
                          : usage.percent >= 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      )}
                      style={{ width: `${Math.max(2, usage.percent)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {/* Panel 3: Phạm vi & Danh mục áp dụng */}
          <Panel title="Phạm vi & Danh mục áp dụng" icon={<MapPin className="size-4 text-amber-600" />}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoField label="Cơ sở áp dụng" value={promotion.branch} />
                <InfoField
                  label="Phân loại chương trình"
                  value={promotion.applicableCategoryText}
                />
              </div>

              {promotion.applicableProducts && promotion.applicableProducts.length > 0 && (
                <div className="pt-2 border-t border-border/40">
                  <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-muted-foreground" />
                    Danh sách sản phẩm / Khóa học áp dụng:
                  </p>
                  <ul className="space-y-1 pl-1">
                    {promotion.applicableProducts.map((prod, idx) => (
                      <li key={idx} className="text-xs text-foreground font-medium">
                        {prod}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Panel>

          {/* Panel 4: Thông tin thời hạn & Người tạo */}
          <Panel title="Thời hạn & Nhật ký khởi tạo" icon={<Clock className="size-4 text-violet-600" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoField
                label="Thời gian hiệu lực"
                value={`Từ ${promotion.validFrom} đến ${promotion.validTo}`}
              />
              <InfoField
                label="Người tạo & Khởi tạo lúc"
                value={
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{promotion.createdBy} ({promotion.createdAt})</span>
                  </div>
                }
              />
            </div>

            {promotion.notes && (
              <div className="mt-3 pt-2 border-t border-border/40">
                <InfoField label="Ghi chú nội bộ" value={promotion.notes} />
              </div>
            )}
          </Panel>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-3 px-6 bg-card border-t border-border flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs font-medium cursor-pointer"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
