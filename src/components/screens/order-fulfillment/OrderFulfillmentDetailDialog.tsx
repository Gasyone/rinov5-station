/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import {
  Camera,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Package,
  Paperclip,
  Printer,
  ShieldCheck,
  StickyNote,
  Store,
  User,
  ZoomIn,
} from 'lucide-react'
import { toast } from 'sonner'
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
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  if (!record) return null

  const isPickup = record.deliveryMethod === 'pickup'
  const totalQuantity = record.products.reduce((acc, p) => acc + (p.quantity || 0), 0)
  const totalFiles = (record.podImages?.length || 0) + (record.attachments?.length || 0)

  const handleCopy = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard?.writeText(text)
    toast.success(`Đã sao chép ${label}: ${text}`)
  }

  const handlePrintSlip = () => {
    toast.success(`Đã gửi lệnh in phiếu giao hàng: ${record.id}`, {
      description: 'Phiếu giao nhận và kiểm đếm đã sẵn sàng trên máy in mặc định.',
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-[96vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border border-border rounded-2xl shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* ================= 1. ACCESSIBLE HEADER BAR (1 DÒNG DUY NHẤT) ================= */}
          <DialogHeader className="shrink-0 px-6 py-3.5 border-b border-border/80 bg-background text-left">
            <div className="flex items-center justify-between gap-3 pr-6">
              <DialogTitle className="text-sm font-normal text-muted-foreground flex items-center gap-1.5">
                <span>Chi tiết giao vận:</span>
                <span className="font-mono font-bold text-foreground text-sm">{record.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(record.id, 'Mã phiếu')}
                  className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors cursor-pointer ml-0.5"
                  title="Sao chép mã phiếu"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Chi tiết phiếu giao vận {record.id}
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* ================= 2. BODY: SPLIT LEFT-RIGHT PANELS ================= */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* ================= LEFT PANEL (7 COLS): HÀNG HÓA & BẰNG CHỨNG ================= */}
              <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
                {/* 1. DANH MỤC SẢN PHẨM & HỌC LIỆU */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                      <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>Danh mục sản phẩm & học liệu bàn giao</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                      <span className="bg-muted px-2 py-0.5 rounded-full border border-border/60 font-semibold text-foreground">
                        {record.products.length} mặt hàng
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">{totalQuantity} món</span>
                    </div>
                  </div>

                  <div className="border border-border/70 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/60 text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="py-2 px-3 text-left font-semibold w-10">STT</th>
                          <th className="py-2 px-3 text-left font-semibold">Tên sản phẩm / Giáo trình</th>
                          <th className="py-2 px-3 text-left font-semibold w-28">Phân loại</th>
                          <th className="py-2 px-3 text-right font-semibold w-24">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {record.products.map((p, idx) => (
                          <tr key={p.id || idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-foreground">
                              <span>{p.name}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-normal py-0 px-1.5 bg-muted/40"
                              >
                                {PRODUCT_CATEGORY_MAP[p.category] || p.category}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground">
                              {p.quantity} <span className="text-muted-foreground text-[11px] font-normal">{p.unit}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30 border-t border-border/60 text-[11px] font-medium text-muted-foreground">
                        <tr>
                          <td colSpan={3} className="py-2 px-3 text-right">
                            Tổng số lượng bàn giao:
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                            {totalQuantity} món
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* 2. BẰNG CHỨNG GIAO NHẬN (PROOF OF DELIVERY - POD) */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                      <Camera className="h-4 w-4 text-primary" />
                      <span>Bằng chứng giao nhận & Ký nhận (POD)</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full border border-border/60">
                      {totalFiles} tệp đính kèm
                    </span>
                  </div>

                  {/* Ảnh chụp thực tế */}
                  {record.podImages && record.podImages.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-[11px] font-medium text-muted-foreground block">
                        Ảnh chụp thực tế & Phiếu ký nhận:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {record.podImages.map((imgUrl, i) => (
                          <div
                            key={i}
                            className="group relative rounded-lg overflow-hidden border border-border/70 bg-muted/40 aspect-video flex items-center justify-center cursor-pointer transition-all hover:border-primary hover:shadow-xs"
                            onClick={() => setZoomImage(imgUrl)}
                          >
                            {!failedImages[i] ? (
                              <img
                                src={imgUrl}
                                alt={`Ảnh POD ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={() =>
                                  setFailedImages((prev) => ({ ...prev, [i]: true }))
                                }
                              />
                            ) : (
                              /* Fallback Card khi URL ảnh bị lỗi / offline */
                              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-muted/60 text-muted-foreground">
                                <FileText className="h-6 w-6 text-primary/70 mb-1" />
                                <span className="text-[11px] font-semibold text-foreground">
                                  Ảnh POD #{i + 1}
                                </span>
                                <span className="text-[9px] text-muted-foreground/80">
                                  Bấm để xem chứng từ
                                </span>
                              </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium gap-1.5 backdrop-blur-[1px]">
                              <ZoomIn className="h-3.5 w-3.5" />
                              <span>Phóng to</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Tài liệu / Biên bản scan đính kèm */}
                  {record.attachments && record.attachments.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-medium text-muted-foreground block">
                        Biên bản / Tài liệu scan đính kèm:
                      </span>
                      <div className="space-y-1.5">
                        {record.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/70 text-xs hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                              <div className="min-w-0">
                                <span
                                  className="font-medium text-foreground truncate block"
                                  title={att.name}
                                >
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
                              className="h-7 px-2.5 text-xs text-primary hover:text-primary/90 hover:bg-primary/10 gap-1.5 shrink-0 cursor-pointer"
                              onClick={() => {
                                if (att.url) window.open(att.url, '_blank')
                                else toast.info(`Mở tệp: ${att.name}`)
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

                  {/* Khi chưa có bằng chứng */}
                  {(!record.podImages || record.podImages.length === 0) &&
                    (!record.attachments || record.attachments.length === 0) && (
                      <div className="py-3 px-3 text-center text-muted-foreground text-xs bg-muted/15 rounded-lg border border-dashed border-border/70 flex items-center justify-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground/60" />
                        <span>Chưa có ảnh chụp hoặc biên bản ký nhận (POD) đính kèm</span>
                      </div>
                    )}
                </div>

                {/* 3. GHI CHÚ BÀN GIAO */}
                {record.notes && (
                  <div className="rounded-xl border border-amber-200/50 dark:border-amber-900/40 bg-amber-50/25 dark:bg-amber-950/15 p-3 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-xs text-amber-900 dark:text-amber-200">
                      <StickyNote className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Ghi chú bàn giao:</span>
                    </div>
                    <p className="text-xs text-amber-950/90 dark:text-amber-100 pl-5 leading-relaxed">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* ================= RIGHT PANEL (5 COLS): THÔNG TIN PHIẾU, NGƯỜI NHẬN & TIẾN ĐỘ ================= */}
              <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
                {/* 1. THÔNG TIN PHIẾU & CĂN CỨ XUẤT */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Thông tin phiếu & Căn cứ xuất</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] py-0 px-2 font-medium border',
                          getStatusBadgeClass(record.status)
                        )}
                      >
                        {FULFILLMENT_STATUS_MAP[record.status] || record.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] py-0 px-2 font-normal"
                      >
                        {DELIVERY_METHOD_MAP[record.deliveryMethod] || (isPickup ? 'Nhận tại quầy' : 'Giao hàng')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* Căn cứ xuất / Đơn hàng */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground shrink-0">Căn cứ xuất:</span>
                      <div className="flex items-center gap-1 text-right font-medium text-foreground">
                        {record.orderNo ? (
                          <span className="font-mono">{record.orderNo}</span>
                        ) : record.sourceTitle ? (
                          <span>{record.sourceTitle}</span>
                        ) : (
                          <span>Xuất theo đợt</span>
                        )}
                        {record.coursePackageName && (
                          <span className="text-muted-foreground font-normal text-[11px]">
                            ({record.coursePackageName})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phiếu xuất kho liên kết */}
                    {record.stockExportCode && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground shrink-0">Phiếu xuất kho:</span>
                        <div className="flex items-center gap-1 font-mono font-medium text-foreground">
                          <span>{record.stockExportCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(record.stockExportCode || '', 'Mã PXK')}
                            className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                            title="Sao chép mã PXK"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Cơ sở thực hiện */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground shrink-0">Cơ sở:</span>
                      <span className="font-medium text-foreground">{record.branch}</span>
                    </div>

                    {/* Thời điểm tạo */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground shrink-0">Thời điểm tạo:</span>
                      <span className="font-mono text-muted-foreground text-[11px]">{record.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* 2. THÔNG TIN NGƯỜI NHẬN & ĐỊA CHỈ */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span>Thông tin người nhận & Địa chỉ</span>
                    </div>
                    {record.recipientRole && (
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                        {record.recipientRole}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Người nhận chính */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-muted-foreground shrink-0 w-24">Người nhận:</span>
                      <div className="flex flex-col items-end gap-0.5 text-right">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <span>{record.recipientName || record.customerName}</span>
                          <span className="font-mono font-normal text-muted-foreground">•</span>
                          <span className="font-mono font-medium">{record.recipientPhone || record.customerPhone}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                record.recipientPhone || record.customerPhone,
                                'SĐT người nhận'
                              )
                            }
                            className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                            title="Sao chép SĐT"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        {record.customerName &&
                          record.recipientName &&
                          record.customerName !== record.recipientName && (
                            <span className="text-[11px] text-muted-foreground">
                              Khách đặt: {record.customerName} ({record.customerPhone})
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Học viên thụ hưởng */}
                    <div className="flex items-start justify-between gap-3 pt-2.5 border-t border-border/40">
                      <span className="text-muted-foreground shrink-0 w-24">Học viên:</span>
                      <div className="text-right">
                        {record.recipientStudents && record.recipientStudents.length > 0 ? (
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground flex items-center justify-end gap-1">
                              <GraduationCap className="h-3.5 w-3.5 text-primary" />
                              <span>{record.recipientStudents.length} học viên nhận</span>
                              {record.targetClass && (
                                <span className="text-muted-foreground font-normal">
                                  ({record.targetClass})
                                </span>
                              )}
                            </div>
                            <div className="max-h-28 overflow-y-auto space-y-1 pt-1 pr-0.5">
                              {record.recipientStudents.map((st, idx) => (
                                <div
                                  key={idx}
                                  className="text-[11px] text-muted-foreground flex items-center justify-end gap-2"
                                >
                                  <span className="font-medium text-foreground">
                                    {idx + 1}. {st.name}
                                  </span>
                                  {st.phone && <span className="font-mono text-[10px]">{st.phone}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold text-foreground">{record.studentName}</span>
                        )}
                      </div>
                    </div>

                    {/* Địa điểm / Địa chỉ nhận hàng */}
                    <div className="pt-2.5 border-t border-border/40 space-y-2.5">
                      {isPickup ? (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground shrink-0 w-24">Địa điểm nhận:</span>
                          <div className="text-right">
                            <div className="font-semibold text-foreground flex items-center justify-end gap-1">
                              <Store className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{record.branch}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Quầy Lễ tân trạm (Xuất trình mã phiếu hoặc SĐT khi nhận)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {record.shippingAddress && (
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-muted-foreground shrink-0 w-24">Địa chỉ giao:</span>
                              <div className="text-right flex flex-col items-end gap-0.5">
                                <span className="font-medium text-foreground leading-snug">
                                  {record.shippingAddress}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(record.shippingAddress || '', 'Địa chỉ')}
                                  className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer mt-0.5"
                                >
                                  <Copy className="h-2.5 w-2.5" />
                                  <span>Sao chép địa chỉ</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {(record.carrier || record.trackingCode) && (
                            <div className="flex items-center justify-between gap-3 pt-1">
                              <span className="text-muted-foreground shrink-0 w-24">Vận đơn:</span>
                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                {record.carrier && (
                                  <Badge variant="outline" className="text-[11px] py-0 px-1.5 font-medium">
                                    {record.carrier}
                                  </Badge>
                                )}
                                {record.trackingCode && (
                                  <div className="flex items-center gap-1 font-mono font-semibold text-primary">
                                    <span>{record.trackingCode}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(record.trackingCode || '', 'Mã vận đơn')}
                                      className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                                      title="Sao chép mã vận đơn"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                                {record.trackingUrl && (
                                  <a
                                    href={record.trackingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] underline text-primary hover:text-primary/80 inline-flex items-center gap-0.5"
                                    title="Mở liên kết tra cứu trực tuyến"
                                  >
                                    <span>Tra cứu</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {record.shipperName && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground shrink-0 w-24">Bưu tá:</span>
                              <span className="font-medium text-foreground">
                                {record.shipperName}{' '}
                                {record.shipperPhone && (
                                  <span className="font-mono text-muted-foreground text-[11px]">
                                    ({record.shipperPhone})
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. TIẾN ĐỘ & NHẬT KÝ XỬ LÝ */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>Tiến độ & Nhật ký xử lý</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Người thực hiện:</span>
                      <span className="font-medium text-foreground">
                        {record.handoverBy || record.carrier || 'Chưa cập nhật'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Thời gian bàn giao:</span>
                      <span className="font-mono text-foreground font-medium">
                        {record.handoverDate || record.completedAt || 'Chưa hoàn tất'}
                      </span>
                    </div>

                    {record.slaHours && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Cam kết SLA:</span>
                        <span className="font-mono text-foreground">{record.slaHours} giờ</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 3. FOOTER BAR ================= */}
          <DialogFooter className="shrink-0 px-6 py-3 border-t border-border/80 bg-muted/20 flex flex-row items-center justify-between gap-2">
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrintSlip}
                className="text-xs h-8 gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>In phiếu bàn giao</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs h-8 cursor-pointer"
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
                  className="text-xs h-8 bg-primary text-primary-foreground gap-1.5 cursor-pointer hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isPickup ? 'Xác nhận bàn giao' : 'Cập nhật vận đơn'}</span>
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= LIGHTBOX ZOOM MODAL CHO ẢNH POD ================= */}
      {zoomImage && (
        <Dialog open={Boolean(zoomImage)} onOpenChange={() => setZoomImage(null)}>
          <DialogContent className="sm:max-w-2xl p-2 bg-black/95 border-none text-white overflow-hidden flex flex-col items-center">
            <div className="w-full flex items-center justify-between px-2 py-1 text-xs text-zinc-300">
              <span className="font-medium">Xem ảnh bằng chứng bàn giao (POD)</span>
              <a
                href={zoomImage}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline text-primary-foreground hover:text-white flex items-center gap-1"
              >
                <span>Mở ảnh gốc</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="relative max-h-[75vh] w-full flex items-center justify-center p-2">
              <img
                src={zoomImage}
                alt="Ảnh phóng to POD"
                className="max-h-[72vh] max-w-full object-contain rounded-md"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
