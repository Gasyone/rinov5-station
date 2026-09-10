'use client'

import { useState } from 'react'
import {
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  GraduationCap,
  Store,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { Order } from '@/mocks/orders'
import {
  addOrderFulfillment,
  type DeliveryMethod,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'

interface QuickCreateFulfillmentDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (updatedOrder: Order) => void
}

function FulfillmentFormInner({
  order,
  onClose,
  onSuccess,
}: {
  order: Order
  onClose: () => void
  onSuccess: (updatedOrder: Order) => void
}) {
  const parent = order.customerName || order.studentName || 'Phụ huynh'
  const phone = order.customerPhone || '0982700818'
  const addr = order.shippingAddress || `Cơ sở ${order.branch}`

  const [method, setMethod] = useState<DeliveryMethod>('pickup')
  const [recipientName, setRecipientName] = useState(parent)
  const [recipientPhone, setRecipientPhone] = useState(phone)
  const [shippingAddress, setShippingAddress] = useState(addr)
  const [carrier, setCarrier] = useState('Viettel Post')
  const [notes, setNotes] = useState(`Bàn giao & kích hoạt học liệu cho đơn ${order.orderNo}`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dlvId = `DLV-2026-${String(Date.now()).slice(-4)}`
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    // 1. Tạo bản ghi chuyển giao SP/DV mới (sinh dữ liệu bên menu Bàn giao & Giao hàng)
    const newRecord: OrderFulfillmentRecord = {
      id: dlvId,
      sourceType: 'order',
      sourceTitle: `Đơn hàng ${order.orderNo}`,
      orderNo: order.orderNo,
      coursePackageName: order.items[0]?.productName,
      customerName: recipientName || order.studentName,
      customerPhone: recipientPhone || '0982700818',
      studentName: order.studentName,
      branch: order.branch,
      deliveryMethod: method,
      shippingAddress: method === 'shipping' ? shippingAddress : `Nhận tại cơ sở ${order.branch}`,
      recipientName: recipientName || order.studentName,
      recipientPhone: recipientPhone || '0982700818',
      recipientRole: 'Phụ huynh',
      status: method === 'pickup' ? 'handed_over' : 'shipping',
      products: order.items.map((item, idx) => ({
        id: `prd-${item.productId || idx}`,
        name: item.productName,
        category: item.fulfillmentType === 'physical' ? 'textbook' : 'learning_material',
        quantity: item.quantity || 1,
        unit: item.fulfillmentType === 'physical' ? 'Bộ' : 'Buổi',
      })),
      carrier: method === 'shipping' ? carrier : undefined,
      handoverDate: dateStr,
      handoverBy: `Lễ tân ${order.branch}`,
      notes: notes || `Bàn giao theo đơn ${order.orderNo}`,
      createdAt: `${timeStr} - ${dateStr}`,
    }
    addOrderFulfillment(newRecord)

    // 2. Cập nhật Order: Đánh dấu các món đã được kích hoạt / bàn giao
    const updatedItems = order.items.map((item) => ({
      ...item,
      activationStatus: 'activated' as const,
      handoverStatus: 'handed_over' as const,
      sessionsGranted: item.sessionsTotal || 48,
    }))

    const updatedOrder: Order = {
      ...order,
      items: updatedItems,
      updatedAt: now.toISOString(),
    }

    onSuccess(updatedOrder)
    toast.success(`Đã tạo phiếu giao hàng ${dlvId} thành công! Dữ liệu đã được ghi nhận vào menu Bàn giao & Giao hàng.`)
    onClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-base font-semibold">
          <Truck className="h-5 w-5 text-blue-600" />
          <span>Tạo phiếu chuyển giao SP/DV</span>
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          Lập phiếu xuất kho, kích hoạt gói học hoặc gửi giao hàng cho đơn <strong className="font-mono text-foreground">{order.orderNo}</strong>.
          Dữ liệu sẽ lưu tự động vào menu Bàn giao & Giao hàng.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-1 text-xs">
        {/* Danh sách SP/DV cần bàn giao */}
        <div className="rounded-lg bg-muted/40 p-3 border border-border/60 space-y-2">
          <span className="font-medium text-foreground block text-xs">
            Sản phẩm & Dịch vụ trong đơn ({order.items.length}):
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded bg-background border border-border/50 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.fulfillmentType === 'physical' ? (
                    <Package className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  ) : (
                    <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  <span className="truncate font-normal text-foreground">{item.productName}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  SL: {item.quantity || 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hình thức giao nhận */}
        <div className="space-y-1.5">
          <label className="font-medium text-foreground">Hình thức giao nhận:</label>
          <Select value={method} onValueChange={(val) => setMethod(val as DeliveryMethod)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pickup">
                <div className="flex items-center gap-2">
                  <Store className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Nhận trực tiếp tại cơ sở ({order.branch})</span>
                </div>
              </SelectItem>
              <SelectItem value="shipping">
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Giao hàng tận nơi (Chuyển phát nhanh)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thông tin người nhận */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-muted-foreground">Người nhận:</label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Tên người nhận..."
              className="h-8 text-xs"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground">Số điện thoại:</label>
            <Input
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="Số điện thoại..."
              className="h-8 text-xs font-mono"
              required
            />
          </div>
        </div>

        {/* Nếu là giao tận nơi */}
        {method === 'shipping' && (
          <>
            <div className="space-y-1">
              <label className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Địa chỉ giao hàng:</span>
              </label>
              <Input
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, đường, phường, quận..."
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground">Đơn vị vận chuyển:</label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viettel Post">Viettel Post</SelectItem>
                  <SelectItem value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</SelectItem>
                  <SelectItem value="Giao Hàng Tiết Kiệm (GHTK)">Giao Hàng Tiết Kiệm (GHTK)</SelectItem>
                  <SelectItem value="Giao hàng nội bộ trung tâm">Giao hàng nội bộ trung tâm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Ghi chú */}
        <div className="space-y-1">
          <label className="text-muted-foreground">Ghi chú giao nhận / kích hoạt:</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú cho bộ phận bàn giao..."
            className="h-8 text-xs"
          />
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Xác nhận tạo phiếu giao</span>
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export function QuickCreateFulfillmentDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: QuickCreateFulfillmentDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-5">
        <FulfillmentFormInner
          key={order.id}
          order={order}
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
