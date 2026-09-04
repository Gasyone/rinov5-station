'use client'

import {
  Check,
  Copy,
  Edit,
  Eye,
  Percent,
  Sparkles,
  Tag,
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
import type { CampaignDiscountType, CampaignItem } from '@/mocks/campaigns'
import {
  CAMPAIGN_APPLY_TYPE_LABELS,
  CAMPAIGN_DISCOUNT_TYPE_LABELS,
  CAMPAIGN_STATUS_LABELS,
} from './campaignsTypes'
import {
  formatCampaignDateTime,
  formatCampaignDiscount,
} from './campaignsHelpers'

interface CampaignsTableProps {
  items: CampaignItem[]
  selectedIds: string[]
  onToggleSelectAll: (checked: boolean) => void
  onToggleSelectRow: (id: string, checked: boolean) => void
  onRowClick: (item: CampaignItem) => void
  onEdit: (item: CampaignItem) => void
  onView: (item: CampaignItem) => void
}

function CampaignTypeIcon({ type }: { type: CampaignDiscountType }) {
  if (type === 'giam_theo_phantram') {
    return <Percent className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
  }
  return <Tag className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
}

export function CampaignsTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onRowClick,
  onEdit,
  onView,
}: CampaignsTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Đã sao chép mã khuyến mại: ${code}`)
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev))
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <EmptyState
          icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy chiến dịch nào"
          description="Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc phân loại."
        />
      </div>
    )
  }

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <Table containerClassName="min-w-full" className="min-w-[1100px]">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {/* Cột 1: Checkbox + Tên chiến dịch */}
          <TableHead className="min-w-[320px] max-w-[420px]">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => onToggleSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả chiến dịch"
              />
              <span>Tên chiến dịch</span>
            </div>
          </TableHead>

          {/* Cột 2: Loại chiến dịch */}
          <TableHead className="min-w-[170px]">Loại chiến dịch</TableHead>

          {/* Cột 3: Hình thức áp dụng */}
          <TableHead className="min-w-[140px]">Hình thức áp dụng</TableHead>

          {/* Cột 4: Mã khuyến mại */}
          <TableHead className="min-w-[190px]">Mã khuyến mại</TableHead>

          {/* Cột 5: Thời gian bắt đầu */}
          <TableHead className="min-w-[160px]">Thời gian bắt đầu</TableHead>

          {/* Cột 6: Thời gian kết thúc */}
          <TableHead className="min-w-[160px]">Thời gian kết thúc</TableHead>

          {/* Cột 7: Trạng thái */}
          <TableHead className="min-w-[130px]">Trạng thái</TableHead>

          {/* Cột 8: Thao tác */}
          <TableHead className="w-[100px] text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((camp) => {
          const isSelected = selectedIds.includes(camp.id)
          const isCopied = copiedCode === camp.promoCode

          return (
            <TableRow
              key={camp.id}
              className={cn(
                'group/row cursor-pointer transition-colors',
                isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
              )}
              onClick={() => onRowClick(camp)}
            >
              {/* CỘT 1: CHECKBOX + TÊN CHIẾN DỊCH + MÃ CHIẾN DỊCH & MÔ TẢ */}
              <TableCell className="px-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onToggleSelectRow(camp.id, Boolean(checked))
                    }
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Chọn chiến dịch ${camp.name}`}
                    className="mt-1 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                        {camp.code}
                      </span>
                      <p
                        className="line-clamp-1 text-xs font-semibold text-foreground transition-colors hover:text-primary"
                        title={camp.name}
                      >
                        {camp.name}
                      </p>
                    </div>

                    <p
                      className="line-clamp-1 text-xs text-muted-foreground mt-0.5"
                      title={camp.description}
                    >
                      {camp.description}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* CỘT 2: LOẠI CHIẾN DỊCH */}
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <CampaignTypeIcon type={camp.campaignType} />
                  <span className="text-xs font-medium text-foreground">
                    {CAMPAIGN_DISCOUNT_TYPE_LABELS[camp.campaignType]}
                  </span>
                </div>
                <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCampaignDiscount(camp)}
                </p>
              </TableCell>

              {/* CỘT 3: HÌNH THỨC ÁP DỤNG (MÃ RIÊNG / MÃ CHUNG) */}
              <TableCell>
                <Badge
                  className={cn(
                    'rounded-md text-xs font-medium',
                    getStatusBadgeClass(camp.applyType)
                  )}
                >
                  {CAMPAIGN_APPLY_TYPE_LABELS[camp.applyType]}
                </Badge>
              </TableCell>

              {/* CỘT 4: MÃ KHUYẾN MẠI */}
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-foreground bg-muted/80 px-2 py-0.5 rounded border border-border/80">
                    {camp.promoCode}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(e, camp.promoCode)}
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
              </TableCell>

              {/* CỘT 5: THỜI GIAN BẮT ĐẦU */}
              <TableCell>
                <span className="font-mono text-xs text-foreground">
                  {formatCampaignDateTime(camp.startDate)}
                </span>
              </TableCell>

              {/* CỘT 6: THỜI GIAN KẾT THÚC */}
              <TableCell>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatCampaignDateTime(camp.endDate)}
                </span>
              </TableCell>

              {/* CỘT 7: TRẠNG THÁI */}
              <TableCell>
                <Badge
                  className={cn(
                    'rounded-md text-xs',
                    getStatusBadgeClass(camp.status)
                  )}
                >
                  {CAMPAIGN_STATUS_LABELS[camp.status]}
                </Badge>
              </TableCell>

              {/* CỘT 8: THAO TÁC (CHỈNH SỬA / XEM) */}
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Xem chi tiết"
                    onClick={() => onView(camp)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Chỉnh sửa chiến dịch"
                    onClick={() => onEdit(camp)}
                  >
                    <Edit className="h-4 w-4" />
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
