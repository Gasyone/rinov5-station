'use client'

import { useState } from 'react'
import {
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  Info,
  MapPin,
  PackageCheck,
  Paperclip,
  Truck,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  cleanRecipientRole,
  extractDateOnly,
  getDeliveryProgressInfo,
  maskPhoneNumber,
} from './orderFulfillmentHelpers'
import { OrderFulfillmentProductsPopover } from './OrderFulfillmentProductsPopover'

interface OrderFulfillmentTableProps {
  records: OrderFulfillmentRecord[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewDetail: (record: OrderFulfillmentRecord) => void
  onAction: (record: OrderFulfillmentRecord) => void
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

  const handleCopyPhone = (e: React.MouseEvent, phone: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(phone)
    setCopiedId(id)
    toast.success(`Đã sao chép SĐT: ${phone}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <TooltipProvider delayDuration={150}>
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
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px] px-3 shrink-0">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Chọn tất cả phiếu giao hàng"
                />
              </TableHead>
              <TableHead className="w-[18%] min-w-[160px]">Vận đơn</TableHead>
              <TableHead className="w-[16%] min-w-[140px]">Đơn hàng liên kết</TableHead>
              <TableHead className="w-[20%] min-w-[180px]">Người nhận</TableHead>
              <TableHead className="w-[17%] min-w-[150px]">Sản phẩm bàn giao</TableHead>
              <TableHead className="w-[16%] min-w-[145px]">Kênh giao & POD</TableHead>
              <TableHead className="w-[13%] min-w-[120px]">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  Không tìm thấy phiếu giao nhận nào phù hợp bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((rc, idx) => {
                const isSelected = selectedIds.includes(rc.id)
                const isPickup = rc.deliveryMethod === 'pickup'
                const displayCode = rc.trackingCode || rc.id
                const dateOnly = extractDateOnly(rc.createdAt)
                const cleanRole = cleanRecipientRole(rc.recipientRole)
                const { ncc, progress, isExternal } = getDeliveryProgressInfo(rc)
                const totalPodCount = (rc.podImages?.length || 0) + (rc.attachments?.length || 0)
                const updateTime = rc.completedAt || rc.handoverDate || rc.createdAt

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

                    {/* CỘT 2: ĐƠN HÀNG LIÊN KẾT (MÃ ĐƠN + KHÁCH MUA ĐƠN & SĐT LIÊN HỆ CÓ MÃ HÓA & NÚT COPY) */}
                    <TableCell className="py-2.5 text-xs">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span
                          className="font-mono font-bold text-foreground hover:text-primary transition-colors text-xs truncate"
                          title={`Đơn hàng: ${rc.orderNo}`}
                        >
                          {rc.orderNo}
                        </span>
                        <div
                          className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            className="font-medium text-foreground truncate max-w-[95px]"
                            title={`Khách mua đơn: ${rc.customerName}`}
                          >
                            {rc.customerName}
                          </span>
                          <span className="text-muted-foreground/40 font-light">•</span>
                          <span className="font-mono" title={rc.customerPhone}>
                            {maskPhoneNumber(rc.customerPhone)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-3.5 w-3.5 p-0 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                            onClick={(e) => handleCopyPhone(e, rc.customerPhone, `cust-${rc.id}`)}
                            title={copiedId === `cust-${rc.id}` ? 'Đã sao chép SĐT khách mua!' : 'Sao chép SĐT khách mua'}
                            aria-label="Sao chép số điện thoại khách mua"
                          >
                            {copiedId === `cust-${rc.id}` ? (
                              <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="h-2.5 w-2.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    {/* CỘT 3: NGƯỜI NHẬN (TÊN + ROLE BỎ HỌC VIÊN; SĐT + VỊ TRÍ CÙNG 1 DÒNG) */}
                    <TableCell className="py-2.5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        {/* Dòng 1: Tên người nhận + vai trò */}
                        <div className="flex items-center gap-1.5 font-semibold text-foreground truncate" title={rc.recipientName || rc.customerName}>
                          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{rc.recipientName || rc.customerName}</span>
                          {cleanRole && (
                            <span className="text-[10px] font-normal text-muted-foreground px-1 py-0 rounded bg-muted shrink-0">
                              {cleanRole}
                            </span>
                          )}
                        </div>

                        {/* Dòng 2: SĐT mã hóa + Copy + Vị trí (Tại cơ sở / Giao tận nơi) ĐƯA LÊN CÙNG 1 DÒNG */}
                        <div
                          className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5 min-w-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span title={rc.recipientPhone || rc.customerPhone}>
                            {maskPhoneNumber(rc.recipientPhone || rc.customerPhone)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                            onClick={(e) => handleCopyPhone(e, rc.recipientPhone || rc.customerPhone, rc.id)}
                            title={copiedId === rc.id ? 'Đã sao chép SĐT!' : 'Sao chép SĐT'}
                            aria-label="Sao chép số điện thoại"
                          >
                            {copiedId === rc.id ? (
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>

                          <span className="text-muted-foreground/40 font-light">•</span>

                          {isPickup ? (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-sans font-medium truncate"
                              title={`Nhận tại cơ sở: ${rc.branch}`}
                            >
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{rc.branch}</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] text-sky-700 dark:text-sky-400 font-sans font-medium truncate"
                              title={rc.shippingAddress || 'Giao tận nơi'}
                            >
                              <Truck className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[130px]">{rc.shippingAddress || 'Giao tận nơi'}</span>
                            </span>
                          )}
                        </div>
                      </div>
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
                        {totalPodCount > 0 ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/15 px-1.5 py-0.5 rounded border border-primary/20 transition-colors cursor-pointer w-fit"
                                  title="Xem bằng chứng giao nhận (POD)"
                                >
                                  <Camera className="h-2.5 w-2.5" />
                                  <span>POD ({totalPodCount})</span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="end"
                                sideOffset={4}
                                className="w-72 p-3 shadow-xl border bg-popover text-popover-foreground text-xs space-y-2"
                              >
                                <div className="font-semibold text-xs text-foreground flex items-center justify-between border-b pb-1.5">
                                  <span className="flex items-center gap-1.5">
                                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                                    <span>Bằng chứng giao nhận (POD)</span>
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-mono">{rc.id}</span>
                                </div>

                                {/* Danh sách ảnh */}
                                {rc.podImages && rc.podImages.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[11px] font-medium text-muted-foreground">Ảnh chụp ký nhận:</span>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {rc.podImages.map((imgUrl, i) => (
                                        <a
                                          key={i}
                                          href={imgUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="group/img relative aspect-video rounded overflow-hidden border border-border bg-muted block"
                                        >
                                          <img
                                            src={imgUrl}
                                            alt="Ảnh POD"
                                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                                          />
                                          <span className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium">
                                            Phóng to ↗
                                          </span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Danh sách file đính kèm */}
                                {rc.attachments && rc.attachments.length > 0 && (
                                  <div className="space-y-1 pt-1">
                                    <span className="text-[11px] font-medium text-muted-foreground">Tệp đính kèm:</span>
                                    <div className="space-y-1">
                                      {rc.attachments.map((att) => (
                                        <div
                                          key={att.id}
                                          className="flex items-center justify-between p-1.5 rounded bg-muted/50 text-[11px] border border-border/50"
                                        >
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <FileText className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                                            <span className="truncate font-medium text-foreground" title={att.name}>
                                              {att.name}
                                            </span>
                                          </div>
                                          {att.size && (
                                            <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-1">
                                              {att.size}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 italic">
                            Chưa có POD
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* CỘT 6: TRẠNG THÁI (BADGE TRẠNG THÁI & THỜI GIAN CẬP NHẬT CHỮ THƯỜNG MÀU XÁM) */}
                    <TableCell className="py-2.5 text-xs">
                      <div className="flex flex-col gap-1 min-w-0">
                        <Badge className={cn('text-[11px] py-0.5 px-1.5 font-normal w-fit', getStatusBadgeClass(rc.status))}>
                          {FULFILLMENT_STATUS_MAP[rc.status] || rc.status}
                        </Badge>
                        <span
                          className="text-[11px] text-muted-foreground font-normal normal-case truncate"
                          title={`Cập nhật lúc: ${updateTime}`}
                        >
                          {updateTime}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </DataTableFrame>
    </TooltipProvider>
  )
}
