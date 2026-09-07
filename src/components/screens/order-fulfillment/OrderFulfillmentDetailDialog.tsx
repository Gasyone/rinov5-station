'use client'

import {
  Camera,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  Package,
  Paperclip,
  Truck,
  User,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import {
  FULFILLMENT_STATUS_MAP,
  DELIVERY_METHOD_MAP,
  PRODUCT_CATEGORY_MAP,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'

interface OrderFulfillmentDetailDialogProps {
  record: OrderFulfillmentRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenAction?: (record: OrderFulfillmentRecord) => void
}

export function OrderFulfillmentDetailDialog({
  record,
  open,
  onOpenChange,
  onOpenAction,
}: OrderFulfillmentDetailDialogProps) {
  if (!record) return null

  const isPickup = record.deliveryMethod === 'pickup'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-5 text-xs text-foreground">
        {/* HEADER */}
        <DialogHeader className="pr-6 pb-2 border-b space-y-1">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <DialogTitle className="flex items-center gap-2 text-base font-bold font-mono text-primary">
              <span>{record.id}</span>
              <Badge className={`text-xs py-0.5 px-2 font-medium ${getStatusBadgeClass(record.status)}`}>
                {FULFILLMENT_STATUS_MAP[record.status] || record.status}
              </Badge>
            </DialogTitle>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Tạo lúc: {record.createdAt}</span>
            </div>
          </div>

          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 pt-0.5 flex-wrap">
            <span>Liên kết đơn hàng:</span>
            <span className="font-mono font-bold text-foreground">
              {record.orderNo}
            </span>
            {record.coursePackageName && (
              <span className="text-foreground font-medium">({record.coursePackageName})</span>
            )}
            <span>• {record.branch}</span>
            {record.paymentStatus && (
              <Badge className={cn('text-[10px] py-0 px-1.5 font-medium border', getStatusBadgeClass(record.paymentStatus))}>
                {record.paymentStatus === 'paid' ? 'Đã thu 100%' : record.paymentStatus === 'partially_paid' ? 'Cọc 50%' : 'Chưa thu'}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* THÔNG TIN KHÁCH HÀNG & NGƯỜI NHẬN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Khách hàng & Học viên */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Thông tin khách hàng & Người nhận</span>
              </span>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Khách mua đơn:</span>
                  <span className="font-semibold text-foreground">
                    {record.customerName} <span className="font-mono text-muted-foreground font-normal">({record.customerPhone})</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Người nhận hàng:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{record.recipientName || record.customerName}</span>
                    {record.recipientRole && (
                      <span className="text-[10px] px-1 py-0 rounded bg-muted text-muted-foreground">
                        {record.recipientRole}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>SĐT người nhận:</span>
                  <span className="font-mono font-semibold text-foreground">{record.recipientPhone || record.customerPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Học viên sử dụng:</span>
                  <span className="font-medium text-foreground">{record.studentName}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Phương thức nhận & Địa chỉ & Shipper */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                {isPickup ? (
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Truck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                )}
                <span>Hình thức: {DELIVERY_METHOD_MAP[record.deliveryMethod]}</span>
              </span>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Địa điểm nhận:</span>
                  <span className="font-medium text-foreground">
                    {isPickup ? record.branch : 'Giao hàng tận nơi'}
                  </span>
                </div>
                {!isPickup && record.shippingAddress && (
                  <div className="text-xs pt-0.5 text-foreground/90">
                    <span className="text-muted-foreground">Địa chỉ: </span>
                    {record.shippingAddress}
                  </div>
                )}
                {record.carrier && (
                  <div className="flex items-center justify-between pt-0.5">
                    <span>Đơn vị ship (3PL):</span>
                    <span className="font-medium text-foreground">{record.carrier}</span>
                  </div>
                )}
                {record.trackingCode && (
                  <div className="flex items-center justify-between">
                    <span>Mã vận đơn:</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-sky-700 dark:text-sky-300">
                      <span>{record.trackingCode}</span>
                      {record.trackingUrl && (
                        <a
                          href={record.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] underline text-primary hover:text-primary/80 font-normal"
                        >
                          (Tra cứu)
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {record.shipperName && (
                  <div className="flex items-center justify-between pt-0.5 border-t border-border/40">
                    <span>Bưu tá / Shipper:</span>
                    <span className="font-medium text-foreground">
                      {record.shipperName} {record.shipperPhone && `(${record.shipperPhone})`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DANH MỤC SẢN PHẨM BÀN GIAO */}
          <div className="space-y-2">
            <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
              <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Danh mục sản phẩm bàn giao ({record.products.length} món)</span>
            </span>

            <div className="border border-border/70 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/60 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-2 px-3 text-left font-semibold">Tên sản phẩm / Giáo trình</th>
                    <th className="py-2 px-3 text-left font-semibold">Phân loại</th>
                    <th className="py-2 px-3 text-right font-semibold">Số lượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {record.products.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-muted/30">
                      <td className="py-2.5 px-3 font-medium text-foreground">{p.name}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {PRODUCT_CATEGORY_MAP[p.category] || p.category}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground">
                        {p.quantity} {p.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BẰNG CHỨNG GIAO NHẬN (PROOF OF DELIVERY - POD) */}
          <div className="p-3.5 bg-muted/30 rounded-xl border border-border/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-primary" />
                <span>Bằng chứng giao nhận & Ký nhận (Proof of Delivery - POD)</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {((record.podImages?.length || 0) + (record.attachments?.length || 0))} tệp
              </span>
            </div>

            {/* Gallery ảnh chụp ký nhận / bưu kiện */}
            {record.podImages && record.podImages.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">Ảnh chụp thực tế:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {record.podImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="group relative rounded-lg overflow-hidden border border-border/70 bg-muted/60 aspect-video"
                    >
                      <img
                        src={imgUrl}
                        alt={`Ảnh POD ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium gap-1"
                        title="Xem ảnh gốc độ phân giải cao"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Xem ảnh lớn</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Tài liệu / Biên bản giao nhận đính kèm */}
            {record.attachments && record.attachments.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-muted-foreground">Biên bản / Tài liệu scan:</span>
                <div className="space-y-1.5">
                  {record.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/70 text-xs hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-medium text-foreground truncate block" title={att.name}>
                            {att.name}
                          </span>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                            {att.size && <span>{att.size}</span>}
                            {att.uploadedAt && <span>• Tải lên: {att.uploadedAt}</span>}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-primary hover:text-primary/90 hover:bg-primary/10 gap-1 shrink-0"
                        onClick={() => {
                          if (att.url) window.open(att.url, '_blank')
                        }}
                      >
                        <Download className="h-3 w-3" />
                        <span>Tải về</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Trạng thái chưa có bằng chứng */}
            {(!record.podImages || record.podImages.length === 0) &&
              (!record.attachments || record.attachments.length === 0) && (
                <div className="py-4 text-center text-muted-foreground text-[11px] bg-background/50 rounded-lg border border-dashed border-border">
                  <Paperclip className="h-4 w-4 mx-auto mb-1 text-muted-foreground/50" />
                  <span>Chưa có ảnh chụp hoặc biên bản ký nhận đính kèm.</span>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                    Ảnh chụp và biên bản bàn giao sẽ được lưu vết khi hoàn tất bàn giao.
                  </p>
                </div>
              )}
          </div>

          {/* LỊCH SỬ BÀN GIAO & GHI CHÚ */}
          <div className="p-3 bg-muted/20 rounded-xl border border-border/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Người bàn giao / Đơn vị thực hiện:</span>
              <span className="font-medium text-foreground">
                {record.handoverBy || record.carrier || 'Chưa cập nhật'}
              </span>
            </div>
            {record.handoverDate && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Thời gian bàn giao:</span>
                <span className="font-mono text-foreground">{record.handoverDate}</span>
              </div>
            )}
            {record.notes && (
              <div className="pt-1 border-t border-border/40 text-muted-foreground">
                <span className="font-semibold text-foreground">Ghi chú: </span>
                <span>{record.notes}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Đóng
          </Button>

          {record.status !== 'handed_over' && onOpenAction && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onOpenAction(record)
              }}
              className="text-xs h-8 bg-primary text-primary-foreground gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isPickup ? 'Xác nhận bàn giao' : 'Cập nhật vận đơn'}</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
