'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  Eye,
  Info,
  MapPin,
  PackageCheck,
  Truck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import {
  FULFILLMENT_STATUS_MAP,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'
import {
  extractDateOnly,
  getDeliveryProgressInfo,
} from './orderFulfillmentHelpers'
import { OrderFulfillmentProductsPopover } from './OrderFulfillmentProductsPopover'
import { OrderFulfillmentPodPopover } from './OrderFulfillmentPodPopover'
import { OrderFulfillmentRecipientCell } from './OrderFulfillmentRecipientCell'

interface OrderFulfillmentTableProps {
  records: OrderFulfillmentRecord[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewDetail: (record: OrderFulfillmentRecord) => void
  onAction: (record: OrderFulfillmentRecord) => void
  onBulkHandover: (selectedIds: string[]) => void
}

export function OrderFulfillmentTable({
  records,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onAction,
  onBulkHandover,
}: OrderFulfillmentTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const startIdx = (currentPage - 1) * pageSize
  const paginatedRecords = records.slice(startIdx, startIdx + pageSize)

  const isAllSelected =
    paginatedRecords.length > 0 &&
    paginatedRecords.every((r) => selectedIds.includes(r.id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedRecords.map((r) => r.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIds = paginatedRecords.map((r) => r.id)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const handleCopyPhone = (e: React.MouseEvent, phone: string | undefined, id: string) => {
    e.stopPropagation()
    if (!phone) return
    navigator.clipboard?.writeText(phone)
    setCopiedId(id)
    toast.success(`Đã sao chép SĐT: ${phone}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyText = (
    e: React.MouseEvent,
    text: string,
    id: string,
    label: string
  ) => {
    e.stopPropagation()
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    toast.success(`Đã sao chép ${label}: ${text}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative flex flex-col h-full w-full">
        <DataTableFrame
          className="rounded-t-lg rounded-b-none border-b-0 border-r-0 h-full w-full"
          footer={
            <DataTablePagination
              page={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          }
        >
          <Table className="w-full table-fixed" containerClassName="overflow-visible min-h-full">
            <TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur-xs shadow-2xs">
              <TableRow className="bg-muted/60 border-b border-border/80">
                <TableHead className="w-[40px] px-3 shrink-0 sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Chọn tất cả phiếu giao hàng"
                  />
                </TableHead>
                <TableHead className="w-[15%] min-w-[140px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Vận đơn</TableHead>
                <TableHead className="w-[18%] min-w-[170px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Căn cứ & Nguồn xuất</TableHead>
                <TableHead className="w-[12%] min-w-[120px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Phiếu xuất kho</TableHead>
                <TableHead className="w-[17%] min-w-[160px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Người nhận</TableHead>
                <TableHead className="w-[17%] min-w-[155px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Sản phẩm bàn giao</TableHead>
                <TableHead className="w-[13%] min-w-[130px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Kênh giao & POD</TableHead>
                <TableHead className="w-[96px] min-w-[96px] max-w-[96px] shrink-0 sticky top-0 right-0 z-30 bg-muted/95 backdrop-blur-xs text-center px-2 border-b border-border/80">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>

          <TableBody>
            {paginatedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                  Không tìm thấy phiếu giao nhận nào phù hợp bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((rc, idx) => {
                const isSelected = selectedIds.includes(rc.id)
                const isPickup = rc.deliveryMethod === 'pickup'
                const displayCode = rc.trackingCode || rc.id
                const dateOnly = extractDateOnly(rc.createdAt)
                const { ncc, progress, isExternal } = getDeliveryProgressInfo(rc)
                const totalPodCount = (rc.podImages?.length || 0) + (rc.attachments?.length || 0)

                return (
                  <TableRow
                    key={rc.id}
                    className={cn(
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/15'
                        : idx % 2 === 1
                          ? 'bg-muted/20 dark:bg-zinc-800/20'
                          : 'bg-background',
                      'hover:bg-muted/40 dark:hover:bg-muted/30 transition-colors group cursor-pointer'
                    )}
                    onClick={() => onViewDetail(rc)}
                  >
                    {/* CHECKBOX */}
                    <TableCell className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(rc.id, Boolean(checked))}
                        aria-label={`Chọn phiếu ${rc.id}`}
                      />
                    </TableCell>

                    {/* CỘT 1: VẬN ĐƠN (MÃ VẬN ĐƠN: NGOÀI THÌ NGOÀI, TRONG THÌ TRONG + NGƯỜI TẠO & NGÀY CÙNG HÀNG BỎ GIỜ + ICON ACTION ẨN, CHỈ HIỆN KHI HOVER) */}
                    <TableCell className="py-2.5 text-xs">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className="font-mono font-bold text-primary hover:underline text-xs truncate"
                            title={displayCode}
                          >
                            {displayCode}
                          </span>
                          <div className="text-[11px] text-muted-foreground truncate" title={`${rc.handoverBy || 'Lễ tân cơ sở'} • ${dateOnly}`}>
                            <span>{rc.handoverBy || 'Lễ tân cơ sở'}</span>
                            {dateOnly && <span> • {dateOnly}</span>}
                          </div>
                        </div>

                        {/* Các icon thao tác: Thường ẩn, chỉ hiện khi hover dòng */}
                        <div
                          className="flex items-center gap-0.5 shrink-0 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rc.status !== 'handed_over' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 text-primary hover:bg-primary/10 rounded cursor-pointer"
                              onClick={() => onAction(rc)}
                              title={isPickup ? 'Xác nhận bàn giao tại quầy' : 'Cập nhật vận đơn giao hàng'}
                            >
                              {isPickup ? (
                                <PackageCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Truck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                              )}
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                            onClick={() => onViewDetail(rc)}
                            title="Xem chi tiết phiếu"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    {/* CỘT 2: CĂN CỨ & NGUỒN XUẤT */}
                    <TableCell className="py-2.5 text-xs">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        {rc.sourceType === 'order' ? (
                          <>
                            {/* Dòng 1: Mã đơn hàng (monospace, bold, sao chép) */}
                            <div
                              className="flex items-center gap-1.5 min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span
                                className="font-mono font-bold text-foreground hover:text-primary transition-colors text-xs truncate"
                                title={`Mã đơn hàng: ${rc.orderNo || 'Chưa có mã'}`}
                              >
                                {rc.orderNo || 'Chưa có mã'}
                              </span>
                              {rc.orderNo && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-3.5 w-3.5 p-0 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                  onClick={(e) =>
                                    handleCopyText(e, rc.orderNo || '', `ord-${rc.id}`, 'mã đơn')
                                  }
                                  title={
                                    copiedId === `ord-${rc.id}`
                                      ? 'Đã sao chép mã đơn!'
                                      : 'Sao chép mã đơn hàng'
                                  }
                                  aria-label="Sao chép mã đơn hàng"
                                >
                                  {copiedId === `ord-${rc.id}` ? (
                                    <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Copy className="h-2.5 w-2.5" />
                                  )}
                                </Button>
                              )}
                            </div>
                            {/* Dòng 2 (Đề xuất): Tên gói học / Khóa học đào tạo */}
                            <span
                              className="text-[11px] text-muted-foreground truncate"
                              title={rc.coursePackageName || 'Combo giáo trình / học liệu'}
                            >
                              {rc.coursePackageName || 'Combo giáo trình khóa học'}
                            </span>
                          </>
                        ) : (
                          <>
                            {/* Dòng 1: Badge phân loại nguồn + Mã căn cứ (sao chép) */}
                            <div
                              className="flex items-center gap-1.5 min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] py-0 px-1.5 font-medium shrink-0',
                                  rc.sourceType === 'care_gift' &&
                                    'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800',
                                  rc.sourceType === 'reward' &&
                                    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
                                  rc.sourceType === 'event' &&
                                    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
                                  rc.sourceType === 'direct_issue' &&
                                    'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                                )}
                              >
                                {rc.sourceType === 'care_gift'
                                  ? 'Quà CSKH'
                                  : rc.sourceType === 'reward'
                                    ? 'Khen thưởng'
                                    : rc.sourceType === 'event'
                                      ? 'Sự kiện'
                                      : 'Tại quầy'}
                              </Badge>
                              {rc.sourceCode && (
                                <div className="flex items-center gap-0.5 min-w-0">
                                  <span
                                    className="font-mono font-semibold text-foreground text-[11px] truncate"
                                    title={`Mã căn cứ: ${rc.sourceCode}`}
                                  >
                                    {rc.sourceCode}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-3.5 w-3.5 p-0 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                    onClick={(e) =>
                                      handleCopyText(
                                        e,
                                        rc.sourceCode || '',
                                        `src-${rc.id}`,
                                        'mã căn cứ'
                                      )
                                    }
                                    title={
                                      copiedId === `src-${rc.id}`
                                        ? 'Đã sao chép mã!'
                                        : 'Sao chép mã căn cứ'
                                    }
                                    aria-label="Sao chép mã căn cứ"
                                  >
                                    {copiedId === `src-${rc.id}` ? (
                                      <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <Copy className="h-2.5 w-2.5" />
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                            {/* Dòng 2 (Đề xuất): Tên sự kiện / Chiến dịch tri ân / Lý do khen thưởng */}
                            <span
                              className="text-[11px] text-muted-foreground truncate"
                              title={rc.sourceTitle || 'Quà tặng / Học liệu trung tâm'}
                            >
                              {rc.sourceTitle || 'Quà tặng / Học liệu'}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* CỘT 3: PHIẾU XUẤT KHO (TÁCH RIÊNG KHỎI CĂN CỨ & NGUỒN XUẤT) */}
                    <TableCell className="py-2.5 text-xs">
                      {rc.stockExportCode ? (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div
                            className="flex items-center gap-1 min-w-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span
                              className="font-mono font-bold text-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/70 text-[11px] hover:text-primary transition-colors truncate"
                              title={`Phiếu xuất kho: ${rc.stockExportCode}`}
                            >
                              {rc.stockExportCode}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-3.5 w-3.5 p-0 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                              onClick={(e) =>
                                handleCopyText(
                                  e,
                                  rc.stockExportCode || '',
                                  `pxk-${rc.id}`,
                                  'mã PXK'
                                )
                              }
                              title={copiedId === `pxk-${rc.id}` ? 'Đã sao chép!' : 'Sao chép mã PXK'}
                              aria-label="Sao chép mã phiếu xuất kho"
                            >
                              {copiedId === `pxk-${rc.id}` ? (
                                <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="h-2.5 w-2.5" />
                              )}
                            </Button>
                          </div>
                          <span
                            className="text-[10.5px] text-muted-foreground truncate"
                            title={`Kho cơ sở: ${rc.branch}`}
                          >
                            Kho: {rc.branch}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 text-xs italic">—</span>
                      )}
                    </TableCell>

                    {/* CỘT 4: NGƯỜI NHẬN (HỖ TRỢ MODE ĐƠN LẺ & MODE X NGƯỜI NHẬN CHO ĐƠN PHÁT CẢ LỚP) */}
                    <TableCell className="py-2.5 text-xs">
                      <OrderFulfillmentRecipientCell
                        record={rc}
                        copiedId={copiedId}
                        onCopyPhone={handleCopyPhone}
                      />
                    </TableCell>

                    {/* CỘT 4: SẢN PHẨM BÀN GIAO (MỞ RỘNG DANH SÁCH NẾU NHIỀU - POPOVER CHUẨN MÀN ĐƠN HÀNG) */}
                    <TableCell className="py-2.5 text-xs">
                      <OrderFulfillmentProductsPopover record={rc} />
                    </TableCell>

                    {/* CỘT 5: KÊNH GIAO & POD (KÊNH VẬN CHUYỂN, TIẾN TRÌNH & BẰNG CHỨNG GIAO NHẬN) */}
                    <TableCell className="py-2.5 text-xs">
                      <div className="flex flex-col gap-1 min-w-0">
                        {/* Dòng 1: Kênh giao vận & Tiến trình (Có Tooltip hover xem chi tiết) */}
                        <div onClick={(e) => e.stopPropagation()} className="min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-help transition-colors truncate max-w-full">
                                <span className="font-semibold text-foreground/90 shrink-0">{ncc}:</span>
                                <span className="truncate underline decoration-dotted decoration-muted-foreground/60">{progress}</span>
                                <Info className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="start"
                              className="max-w-xs p-2.5 space-y-1.5 text-xs shadow-xl bg-popover text-popover-foreground border border-border"
                            >
                              {isExternal ? (
                                // THÔNG TIN ĐƠN HÀNG NCC (BÊN NGOÀI 3PL)
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between gap-2 border-b pb-1 font-semibold text-primary">
                                    <span className="flex items-center gap-1">
                                      <Truck className="h-3.5 w-3.5" />
                                      <span>ĐVVC: {rc.carrier}</span>
                                    </span>
                                    {rc.trackingCode && (
                                      <span className="font-mono text-[10px] text-muted-foreground">{rc.trackingCode}</span>
                                    )}
                                  </div>
                                  <div className="space-y-1 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Tiến trình:</span>
                                      <span className="font-medium text-foreground">{progress}</span>
                                    </div>
                                    {rc.shipperName && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bưu tá giao:</span>
                                        <span className="font-medium text-foreground">{rc.shipperName}</span>
                                      </div>
                                    )}
                                    {rc.shipperPhone && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">SĐT bưu tá:</span>
                                        <span className="font-mono text-foreground">{rc.shipperPhone}</span>
                                      </div>
                                    )}
                                    {rc.completedAt && (
                                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Hoàn tất lúc:</span>
                                        <span className="font-mono font-medium">{rc.completedAt}</span>
                                      </div>
                                    )}
                                    {totalPodCount > 0 && (
                                      <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 pt-1 border-t">
                                        <span>Bằng chứng POD:</span>
                                        <span className="font-medium font-mono">Đã lưu {totalPodCount} tệp</span>
                                      </div>
                                    )}
                                    {rc.shippingAddress && (
                                      <div className="text-[10px] text-muted-foreground pt-1 border-t">
                                        <span>Địa chỉ: {rc.shippingAddress}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                // THÔNG TIN TIẾN TRÌNH BÀN GIAO NỘI BỘ TẠI CƠ SỞ
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between gap-2 border-b pb-1 font-semibold text-emerald-700 dark:text-emerald-400">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      <span>Bàn giao tại quầy cơ sở</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">{rc.id}</span>
                                  </div>
                                  <div className="space-y-1 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Điểm bàn giao:</span>
                                      <span className="font-medium text-foreground">{rc.branch}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Phụ trách:</span>
                                      <span className="font-medium text-foreground">{rc.handoverBy || 'Lễ tân cơ sở'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Người nhận:</span>
                                      <span className="font-medium text-foreground">{rc.recipientName || rc.customerName}</span>
                                    </div>
                                    {rc.completedAt && (
                                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Ký nhận lúc:</span>
                                        <span className="font-mono font-medium">{rc.completedAt}</span>
                                      </div>
                                    )}
                                    {totalPodCount > 0 && (
                                      <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 pt-1 border-t">
                                        <span>Bằng chứng POD:</span>
                                        <span className="font-medium font-mono">Đã lưu {totalPodCount} tệp</span>
                                      </div>
                                    )}
                                    {rc.notes && (
                                      <div className="text-[10px] text-muted-foreground pt-1 border-t">
                                        <span>Ghi chú: {rc.notes}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Dòng 2: Nút Popover xem nhanh Bằng chứng POD hoặc nhãn xám Chưa có POD */}
                        <OrderFulfillmentPodPopover record={rc} />
                      </div>
                    </TableCell>

                    {/* CỘT 7: TRẠNG THÁI (CỐ ĐỊNH PHẢI, THU HẸP, MÀU ĐỒNG BỘ THEO DÒNG BẢNG) */}
                    <TableCell
                      className={cn(
                        'py-2.5 px-2 text-xs w-[96px] min-w-[96px] max-w-[96px] shrink-0 sticky right-0 z-10 text-center',
                        isSelected
                          ? 'bg-primary/10 dark:bg-primary/15'
                          : idx % 2 === 1
                            ? 'bg-muted/30 dark:bg-zinc-800/30 group-hover:bg-muted/40'
                            : 'bg-background group-hover:bg-muted/40'
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        className={cn(
                          'text-[11px] py-0.5 px-1.5 font-medium whitespace-nowrap inline-flex justify-center',
                          getStatusBadgeClass(rc.status)
                        )}
                      >
                        {FULFILLMENT_STATUS_MAP[rc.status] || rc.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </DataTableFrame>

      {/* THANH THAO TÁC HÀNG LOẠT (BULK ACTION BAR) */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-full shadow-2xl border border-zinc-700/60 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Đã chọn{' '}
              <strong className="font-mono text-emerald-400 dark:text-emerald-600">
                {selectedIds.length}
              </strong>{' '}
              phiếu
            </span>
          </div>
          <div className="h-4 w-px bg-zinc-700 dark:bg-zinc-300" />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-7 text-xs px-3 font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 gap-1.5 cursor-pointer shadow-xs"
            onClick={() => onBulkHandover(selectedIds)}
          >
            <PackageCheck className="h-3.5 w-3.5" />
            <span>Bàn giao hàng loạt</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2 text-zinc-400 hover:text-zinc-100 dark:hover:text-zinc-900 cursor-pointer"
            onClick={() => setSelectedIds([])}
          >
            Bỏ chọn
          </Button>
        </div>
      )}
    </div>
    </TooltipProvider>
  )
}
