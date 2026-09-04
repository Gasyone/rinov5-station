'use client'

import {
  Calendar,
  DollarSign,
  Edit,
  Layers,
  Percent,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react'
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
import type { CampaignItem } from '@/mocks/campaigns'
import {
  CAMPAIGN_APPLY_TYPE_LABELS,
  CAMPAIGN_DISCOUNT_TYPE_LABELS,
  CAMPAIGN_PRODUCT_FORM_LABELS,
  CAMPAIGN_STATUS_LABELS,
} from './campaignsTypes'
import {
  formatCampaignDateTime,
  formatCampaignDiscount,
} from './campaignsHelpers'

interface CampaignDetailDialogProps {
  open: boolean
  campaign: CampaignItem | null
  onOpenChange: (open: boolean) => void
  onEdit?: (campaign: CampaignItem) => void
}

export function CampaignDetailDialog({
  open,
  campaign,
  onOpenChange,
  onEdit,
}: CampaignDetailDialogProps) {
  if (!campaign) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] sm:max-w-[800px] max-h-[85vh] flex flex-col p-0 gap-0 bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="shrink-0 p-4 px-6 bg-card border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-foreground truncate">
                {campaign.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {campaign.code}
                </span>
                <Badge
                  className={cn(
                    'rounded-md text-xs font-medium',
                    getStatusBadgeClass(campaign.applyType)
                  )}
                >
                  {CAMPAIGN_APPLY_TYPE_LABELS[campaign.applyType]}
                </Badge>
                <StatusBadge
                  status={campaign.status}
                  label={CAMPAIGN_STATUS_LABELS[campaign.status]}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(campaign)
                }}
                className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Edit className="size-3.5" />
                <span>Chỉnh sửa</span>
              </Button>
            )}

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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mô tả */}
          {campaign.description && (
            <div className="rounded-lg bg-muted/40 p-3.5 border border-border/60">
              <p className="text-xs text-foreground leading-relaxed">
                {campaign.description}
              </p>
            </div>
          )}

          {/* Panel 1: Quy tắc chiết khấu & Mã khuyến mại */}
          <Panel title="Mức chiết khấu & Mã liên kết" icon={<Percent className="size-4 text-emerald-600" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoField
                label="Loại chiến dịch"
                value={CAMPAIGN_DISCOUNT_TYPE_LABELS[campaign.campaignType]}
              />
              <InfoField
                label="Mức giảm giá"
                value={
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatCampaignDiscount(campaign)}
                  </span>
                }
              />
              <InfoField
                label="Mã khuyến mại gắn kèm"
                value={
                  <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                    {campaign.promoCode}
                  </span>
                }
              />
              <InfoField
                label="Số lượt tối đa / User"
                value={<span className="font-mono font-semibold">{campaign.maxUsagePerUser} lượt</span>}
              />
              <InfoField
                label="Tự động hiển thị"
                value={campaign.autoDisplay ? 'Tự động hiển thị giỏ hàng' : 'Không tự động (nhập tay)'}
              />
              <InfoField
                label="Quy tắc cộng dồn"
                value={campaign.limitRule === 'dong_thoi' ? 'Áp dụng đồng thời' : 'Áp dụng duy nhất (không cộng dồn)'}
              />
            </div>
          </Panel>

          {/* Panel 2: Phân bổ Nguồn chi phí */}
          <Panel title="Phân bổ Nguồn chi phí" icon={<DollarSign className="size-4 text-sky-600" />}>
            <div className="space-y-2">
              <div className="overflow-hidden rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-2 px-3 text-left font-semibold">Nguồn chi phí</th>
                      <th className="py-2 px-3 text-right font-semibold">Tỷ lệ chịu chi phí (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {campaign.costAllocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-muted/20">
                        <td className="py-2 px-3 font-medium text-foreground">{alloc.source}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-primary">{alloc.percentage} %</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>

          {/* Panel 3: Điều kiện kích hoạt & Whitelist SKU */}
          <Panel title="Điều kiện áp dụng & Sản phẩm (SKU)" icon={<Tag className="size-4 text-amber-600" />}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoField
                  label="Giá trị đơn hàng tối thiểu"
                  value={campaign.minOrderValue > 0 ? formatCurrency(campaign.minOrderValue) : 'Không giới hạn'}
                />
                <InfoField
                  label="Loại hình áp dụng"
                  value={campaign.applyScope === 'sku' ? 'Theo sản phẩm (SKU)' : 'Toàn bộ danh mục'}
                />
                <InfoField
                  label="Hình thức sản phẩm"
                  value={CAMPAIGN_PRODUCT_FORM_LABELS[campaign.productForm]}
                />
              </div>

              {campaign.applicableSkus && campaign.applicableSkus.length > 0 && (
                <div className="pt-2 border-t border-border/40 space-y-1.5">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-muted-foreground" />
                    Danh sách sản phẩm (SKU) được phép áp dụng ({campaign.applicableSkus.length}):
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border/60">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="py-1.5 px-3 text-left font-semibold w-28">Mã SKU</th>
                          <th className="py-1.5 px-3 text-left font-semibold">Tên sản phẩm / Khóa học</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {campaign.applicableSkus.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/20">
                            <td className="py-1.5 px-3 font-mono font-bold text-primary">{item.sku}</td>
                            <td className="py-1.5 px-3 font-medium text-foreground">{item.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {/* Panel 4: Thời hạn & Ngân sách */}
          <Panel title="Thời hạn & Ngân sách" icon={<Calendar className="size-4 text-violet-600" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoField
                label="Thời gian bắt đầu"
                value={<span className="font-mono">{formatCampaignDateTime(campaign.startDate)}</span>}
              />
              <InfoField
                label="Thời gian kết thúc"
                value={<span className="font-mono">{formatCampaignDateTime(campaign.endDate)}</span>}
              />
              <InfoField
                label="Ngân sách tối đa"
                value={campaign.budget ? formatCurrency(campaign.budget) : 'Không giới hạn'}
              />
              <InfoField
                label="Người tạo & Khởi tạo lúc"
                value={
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{campaign.createdBy} ({campaign.createdAt})</span>
                  </div>
                }
              />
            </div>
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
