'use client'

import { useState } from 'react'
import {
  Camera,
  CheckCircle2,
  PackageCheck,
  Paperclip,
  Truck,
  Upload,
  User,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'

interface OrderFulfillmentActionDialogProps {
  record: OrderFulfillmentRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (updatedRecord: OrderFulfillmentRecord) => void
}

const CARRIER_OPTIONS = [
  { value: 'GHTK (Giao Hàng Tiết Kiệm)', label: 'GHTK (Giao Hàng Tiết Kiệm)' },
  { value: 'Viettel Post', label: 'Viettel Post' },
  { value: 'Shopee Xpress', label: 'Shopee Xpress' },
  { value: 'Ahamove', label: 'Ahamove (Giao siêu tốc)' },
  { value: 'Đơn vị vận chuyển khác', label: 'Đơn vị vận chuyển khác' },
]

export function OrderFulfillmentActionDialog({
  record,
  open,
  onOpenChange,
  onSuccess,
}: OrderFulfillmentActionDialogProps) {
  if (!record) return null

  const isPickup = record.deliveryMethod === 'pickup'

  return isPickup ? (
    <PickupHandoverForm
      record={record}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  ) : (
    <ShippingUpdateForm
      record={record}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  )
}

function PickupHandoverForm({
  record,
  open,
  onOpenChange,
  onSuccess,
}: OrderFulfillmentActionDialogProps & { record: OrderFulfillmentRecord }) {
  const [recipient, setRecipient] = useState<string>(record.recipientName || `Phụ huynh: ${record.customerName}`)
  const [handoverBy, setHandoverBy] = useState<string>(record.handoverBy || 'Lễ tân trạm')
  const [podImage, setPodImage] = useState<string>(record.podImages?.[0] || '')
  const [notes, setNotes] = useState<string>(record.notes || '')

  const handleSubmit = () => {
    const updated: OrderFulfillmentRecord = {
      ...record,
      status: 'handed_over',
      recipientName: recipient,
      handoverBy,
      podImages: podImage ? [podImage] : record.podImages,
      handoverDate: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      notes,
    }
    onSuccess(updated)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <PackageCheck className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Xác nhận Bàn giao tại cơ sở
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Phiếu bàn giao {record.id} • Đơn hàng {record.orderNo} ({record.branch})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2 text-xs">
          {/* Danh mục sản phẩm bàn giao */}
          <div className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-2">
            <span className="font-semibold text-foreground text-xs block">
              Sản phẩm học viên nhận ({record.products.length} món):
            </span>
            <ul className="space-y-1 text-xs text-foreground/90">
              {record.products.map((p, idx) => (
                <li key={p.id || idx} className="flex items-center justify-between">
                  <span>• {p.name}</span>
                  <span className="font-mono font-medium text-muted-foreground">
                    x{p.quantity} {p.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <FieldLabel label="Người nhận hàng thực tế" required={true}>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="VD: Phụ huynh Nguyễn Thị Hoa / Học viên..."
              className="text-xs h-8"
            />
          </FieldLabel>

          <FieldLabel label="Nhân viên bàn giao" required={true}>
            <Input
              value={handoverBy}
              onChange={(e) => setHandoverBy(e.target.value)}
              placeholder="VD: Lễ tân trạm Cầu Giấy"
              className="text-xs h-8"
            />
          </FieldLabel>

          <FieldLabel label="Bằng chứng ký nhận / Biên bản (POD)">
            {podImage ? (
              <div className="relative rounded-lg overflow-hidden border border-border p-1.5 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={podImage}
                    alt="Bằng chứng ký nhận"
                    className="h-10 w-16 object-cover rounded"
                  />
                  <div className="text-[11px]">
                    <span className="font-medium text-foreground block">Ảnh chụp ký nhận / Giao hàng</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Đã đính kèm tệp</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => setPodImage('')}
                  title="Xóa ảnh"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5 w-full border-dashed text-muted-foreground hover:text-foreground justify-center"
                onClick={() => setPodImage('https://images.unsplash.com/photo-1554415707-9e4466b88738?w=500&auto=format&fit=crop&q=80')}
              >
                <Camera className="h-3.5 w-3.5 text-primary" />
                <span>Đính kèm ảnh chụp ký nhận mẫu</span>
              </Button>
            )}
          </FieldLabel>

          <FieldLabel label="Ghi chú bàn giao">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú khi phụ huynh/học viên ký nhận..."
              className="text-xs min-h-[60px] resize-none"
            />
          </FieldLabel>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Đóng
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Xác nhận đã bàn giao</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ShippingUpdateForm({
  record,
  open,
  onOpenChange,
  onSuccess,
}: OrderFulfillmentActionDialogProps & { record: OrderFulfillmentRecord }) {
  const [carrier, setCarrier] = useState<string>(record.carrier || 'GHTK (Giao Hàng Tiết Kiệm)')
  const [trackingCode, setTrackingCode] = useState<string>(record.trackingCode || '')
  const [shippingStatus, setShippingStatus] = useState<string>(record.status)
  const [podImage, setPodImage] = useState<string>(record.podImages?.[0] || '')
  const [notes, setNotes] = useState<string>(record.notes || '')

  const handleSubmit = () => {
    const updated: OrderFulfillmentRecord = {
      ...record,
      carrier,
      trackingCode,
      status: shippingStatus as OrderFulfillmentRecord['status'],
      podImages: podImage ? [podImage] : record.podImages,
      notes,
    }
    onSuccess(updated)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Truck className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Cập nhật Vận đơn Giao hàng tận nơi
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Phiếu vận đơn {record.id} • Đơn hàng {record.orderNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2 text-xs">
          {/* Địa chỉ giao hàng */}
          <div className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{record.customerName} - {record.customerPhone}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              📍 {record.shippingAddress || 'Chưa cập nhật địa chỉ giao hàng'}
            </p>
          </div>

          <FieldLabel label="Đơn vị vận chuyển" required={true}>
            <InlineSelect
              value={carrier}
              onValueChange={setCarrier}
              options={CARRIER_OPTIONS}
              ariaLabel="Đơn vị vận chuyển"
            />
          </FieldLabel>

          <FieldLabel label="Mã vận đơn (Tracking No)" required={true}>
            <Input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="VD: GHTK-HCM-12345678"
              className="text-xs h-8 font-mono"
            />
          </FieldLabel>

          <FieldLabel label="Trạng thái giao vận" required={true}>
            <InlineSelect
              value={shippingStatus}
              onValueChange={setShippingStatus}
              options={[
                { value: 'shipping', label: '🚚 Đang giao hàng' },
                { value: 'handed_over', label: '✅ Đã giao thành công' },
                { value: 'returned', label: '❌ Trả lại / Giao thất bại' },
              ]}
              ariaLabel="Trạng thái giao vận"
            />
          </FieldLabel>

          <FieldLabel label="Bằng chứng giao hàng / Biên bản gửi bưu cục (POD)">
            {podImage ? (
              <div className="relative rounded-lg overflow-hidden border border-border p-1.5 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={podImage}
                    alt="Biên lai gửi hàng"
                    className="h-10 w-16 object-cover rounded"
                  />
                  <div className="text-[11px]">
                    <span className="font-medium text-foreground block">Ảnh bưu kiện / Hóa đơn bưu cục</span>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400">Đã đính kèm tệp</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => setPodImage('')}
                  title="Xóa ảnh"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5 w-full border-dashed text-muted-foreground hover:text-foreground justify-center"
                onClick={() => setPodImage('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&auto=format&fit=crop&q=80')}
              >
                <Camera className="h-3.5 w-3.5 text-primary" />
                <span>Đính kèm ảnh vận đơn / Biên lai bưu tá</span>
              </Button>
            )}
          </FieldLabel>

          <FieldLabel label="Ghi chú điều phối giao hàng">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú giao nhận / thời gian hẹn phụ huynh..."
              className="text-xs min-h-[55px] resize-none"
            />
          </FieldLabel>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Đóng
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            className="text-xs h-8 bg-primary text-primary-foreground gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Lưu cập nhật</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
