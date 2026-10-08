import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Order } from '@/mocks/orders'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
import { DepositOrderModal } from './deposit-order/DepositOrderModal'
import { DraftOrderEditorDialog } from './DraftOrderEditorDialog'
import { ConfirmDialog } from '@/components/shared'
import { toast } from 'sonner'
import {
  type DetailedOrder,
  type DetailedOrderItem,
  type FeeTransferRecord,
  type OrderPaymentTransaction,
  type StudentOrdersTabProps,
  getStudentOrders,
  getFeeTransfers,
} from './student-orders/studentOrdersTypes'
import { StudentOrderCardItem } from './student-orders/StudentOrderCardItem'
import { StudentFeeTransferItem } from './student-orders/StudentFeeTransferItem'

// Re-export types & helpers for backward compatibility with other screens
export type {
  DetailedOrder,
  DetailedOrderItem,
  FeeTransferRecord,
  OrderPaymentTransaction,
  StudentOrdersTabProps,
}
export { getStudentOrders, getFeeTransfers }

export function StudentOrdersTab({
  studentId,
  studentName,
  initialOrders: propInitialOrders,
  initialTransfers: propInitialTransfers,
  onOpenCreateOrder,
}: StudentOrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [, setIsDetailOpen] = useState(false)
  const [depositModal, setDepositModal] = useState<{
    open: boolean
    mode: 'deposit' | 'completion'
    order?: DetailedOrder | null
  }>({ open: false, mode: 'deposit', order: null })
  const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({})
  const [isDraftEditorOpen, setIsDraftEditorOpen] = useState(false)
  const [editingDraftOrder, setEditingDraftOrder] = useState<DetailedOrder | null>(null)
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null)

  const [customDraftOrders, setCustomDraftOrders] = useState<DetailedOrder[]>([])
  const [showOtherChildrenOrders, setShowOtherChildrenOrders] = useState(false)

  const initialOrders = useMemo(() => {
    if (propInitialOrders !== undefined) {
      return propInitialOrders
    }
    return getStudentOrders(studentId, studentName)
  }, [propInitialOrders, studentId, studentName])

  const transfers = useMemo(() => {
    if (propInitialTransfers !== undefined) {
      return propInitialTransfers
    }
    return getFeeTransfers(studentId, studentName)
  }, [propInitialTransfers, studentId, studentName])

  // Combine custom draft orders with initial mock orders (deduplicated by id / orderNo)
  const orders = useMemo(() => {
    const draftIds = new Set(customDraftOrders.map((o) => o.id))
    const draftOrderNos = new Set(customDraftOrders.map((o) => o.orderNo).filter(Boolean))
    const nonDuplicatedInitial = initialOrders.filter(
      (o) => !draftIds.has(o.id) && (!o.orderNo || !draftOrderNos.has(o.orderNo))
    )
    return [...customDraftOrders, ...nonDuplicatedInitial]
  }, [customDraftOrders, initialOrders])

  // Có đơn hàng của con khác trong gia đình hoặc đơn có sản phẩm của con khác
  const hasOtherChildrenOrders = useMemo(() => {
    return orders.some(
      (o) =>
        o.isOtherChild ||
        o.detailedItems?.some(
          (item) =>
            item.studentName &&
            studentName &&
            item.studentName.trim().toLowerCase() !== studentName.trim().toLowerCase()
        )
    )
  }, [orders, studentName])

  // Tự động tích chọn nếu bé hiện tại không có đơn riêng nhưng có đơn của con khác
  useEffect(() => {
    const ownCount = orders.filter((o) => !o.isOtherChild).length
    const siblingCount = orders.filter((o) => o.isOtherChild).length
    if (ownCount === 0 && siblingCount > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowOtherChildrenOrders(true)
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (showOtherChildrenOrders) return orders
    return orders.filter((o) => !o.isOtherChild)
  }, [orders, showOtherChildrenOrders])

  // Không có đơn hàng nháp trong hệ thống Rinov5
  const isDraftOrder = useCallback((): boolean => false, [])

  const draftOrders = useMemo(() => filteredOrders.filter(isDraftOrder), [filteredOrders, isDraftOrder])

  // Merge all orders and fee transfers into unified historical timeline items
  const timelineItems = useMemo(() => {
    type TimelineItem =
      | { type: 'order'; order: DetailedOrder; timestamp: number }
      | { type: 'transfer'; transfer: FeeTransferRecord; timestamp: number }

    const items: TimelineItem[] = []

    const parseDateToMs = (dateStr?: string): number => {
      if (!dateStr) return 0
      if (dateStr.includes('-')) {
        const parts = dateStr.split('T')[0].split('-')
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            return new Date(dateStr).getTime()
          } else {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime()
          }
        }
      }
      return new Date(dateStr).getTime() || 0
    }

    filteredOrders.forEach((o) => {
      items.push({
        type: 'order',
        order: o,
        timestamp: parseDateToMs(o.saleDate || o.createdAt),
      })
    })

    transfers.forEach((t) => {
      items.push({
        type: 'transfer',
        transfer: t,
        timestamp: parseDateToMs(t.transferDate),
      })
    })

    items.sort((a, b) => b.timestamp - a.timestamp)
    return items
  }, [filteredOrders, transfers])

  const toggleExpandPayments = useCallback((orderId: string) => {
    setExpandedPayments((prev) => ({
      ...prev,
      [orderId]: !(prev[orderId] ?? false),
    }))
  }, [])

  const handleViewDetail = useCallback((order: DetailedOrder) => {
    if (order.status === 'pending' || order.id.includes('DRAFT') || order.paymentMethodTag?.includes('Đơn nháp')) {
      setEditingDraftOrder(order)
      setIsDraftEditorOpen(true)
    } else {
      setSelectedOrder(order)
      setIsDetailOpen(true)
    }
  }, [])

  const handleCreateDraftFromPackage = useCallback(
    (sourceOrder: DetailedOrder, item?: DetailedOrderItem) => {
      const orderId = `OD-${Math.floor(1000 + Math.random() * 9000)}`
      const sourceNo = sourceOrder.orderNo || sourceOrder.id
      const sourcePkg = item?.productName || sourceOrder.detailedItems?.[0]?.productName || 'Gói học tái phí'

      const newOrder: DetailedOrder = {
        id: orderId,
        orderNo: orderId,
        studentId: studentId,
        studentName: studentName,
        sourceOrderNo: sourceNo,
        sourcePackageName: sourcePkg,
        totalAmount: item ? item.unitPrice : 0,
        discountAmount: 0,
        finalAmount: item ? item.unitPrice : 0,
        paymentMethod: 'cash',
        paymentStatus: 'unpaid',
        status: 'pending',
        branch: sourceOrder.branch || 'RinoEdu Nguyễn Tuân',
        saleBy: 'Trần Nguyễn CSM',
        saleRep: 'Trần Nguyễn CSM',
        saleDate: new Date().toLocaleDateString('vi-VN'),
        createdAt: new Date().toISOString(),
        paymentMethodTag: 'Chờ thanh toán',
        totalPaidAmount: 0,
        isCurrentPackage: true,
        detailedItems: [
          {
            productId: item?.productId || 'p-new',
            productName: sourcePkg,
            quantity: 1,
            unitPrice: item?.unitPrice || 0,
            subtotal: item?.unitPrice || 0,
            studentName: studentName,
            orderType: 'Gia hạn',
            durationText: item?.durationText || '40 buổi',
          },
        ],
        items: [
          {
            productId: item?.productId || 'p-new',
            productName: sourcePkg,
            quantity: 1,
            unitPrice: item?.unitPrice || 0,
            subtotal: item?.unitPrice || 0,
          },
        ],
        payments: [],
      }

      sourceOrder.linkedDraftOrderNo = orderId
      setCustomDraftOrders((prev) => [newOrder, ...prev])
      setEditingDraftOrder(newOrder)
      setIsDraftEditorOpen(true)
    },
    [studentId, studentName]
  )

  const handleDeleteDraftOrder = useCallback((orderId: string) => {
    setCustomDraftOrders((prev) => prev.filter((o) => o.id !== orderId))
    setDeletingDraftId(null)
    toast.success('Đã xóa đơn hàng')
  }, [])

  const handleSaveDraftSuccess = useCallback((newOrder: DetailedOrder) => {
    setCustomDraftOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === newOrder.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = newOrder
        return copy
      }
      return [newOrder, ...prev]
    })
  }, [])

  const handleCreateCompletionOrder = useCallback(
    (sourceOrder: DetailedOrder) => {
      setDepositModal({
        open: true,
        mode: 'completion',
        order: sourceOrder,
      })
    },
    []
  )

  const handleCreateNewOrder = useCallback(() => {
    if (onOpenCreateOrder) {
      onOpenCreateOrder()
      return
    }
    setEditingDraftOrder(null)
    setIsDraftEditorOpen(true)
  }, [onOpenCreateOrder])

  const scrollToOrder = useCallback((orderNo: string) => {
    const el = document.getElementById(`order-card-${orderNo}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-sky-500', 'transition-all')
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-sky-500')
      }, 2500)
    } else {
      toast.info(`Thông tin đơn hàng ${orderNo}`)
    }
  }, [])

  return (
    <div className="space-y-1.5 text-left">
      {/* ── TOP TOOLBAR: Xem đơn các con khác (đưa ra đầu) ── Nút Tạo đơn (bên phải) ── */}
      <div className="flex items-center justify-between py-0 text-[11px] flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Checkbox mở rộng xem đơn hàng của các con khác (đưa ra đầu) */}
          {hasOtherChildrenOrders && (
            <label className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground cursor-pointer select-none hover:text-foreground">
              <input
                type="checkbox"
                checked={showOtherChildrenOrders}
                onChange={(e) => setShowOtherChildrenOrders(e.target.checked)}
                className="rounded border-border text-sky-600 focus:ring-sky-500 h-3 w-3 cursor-pointer accent-sky-600"
              />
              <span>Xem đơn các con khác</span>
            </label>
          )}
        </div>

        {/* Button Tạo đơn ở bên phải */}
        <Button
          type="button"
          onClick={handleCreateNewOrder}
          variant="outline"
          className="h-6 px-2 text-[11px] font-medium border-border/80 hover:bg-muted text-foreground flex items-center gap-1 shrink-0 cursor-pointer shadow-3xs"
        >
          <Plus className="h-3 w-3" />
          <span>Tạo đơn</span>
        </Button>
      </div>

      {/* ── DANH SÁCH TẤT CẢ ĐƠN HÀNG & PHIẾU CHUYỂN PHÍ (DÒNG THỜI GIAN THỐNG NHẤT) ── */}
      {timelineItems.length > 0 ? (
        <div className="space-y-1.5">
          {timelineItems.map((item) => {
            if (item.type === 'order') {
              return (
                <StudentOrderCardItem
                  key={item.order.id}
                  order={item.order}
                  isDraft={false}
                  isCurrent={false}
                  isPaymentsExpanded={expandedPayments[item.order.id] ?? false}
                  showOtherChildren={showOtherChildrenOrders}
                  draftOrders={draftOrders}
                  onToggleExpandPayments={toggleExpandPayments}
                  onViewDetail={handleViewDetail}
                  onCreateDraftFromPackage={handleCreateDraftFromPackage}
                  onCreateCompletionOrder={handleCreateCompletionOrder}
                  onAddPayment={handleViewDetail}
                  onScrollToOrder={scrollToOrder}
                />
              )
            }
            return (
              <StudentFeeTransferItem
                key={item.transfer.id}
                transfer={item.transfer}
                onScrollToOrder={scrollToOrder}
              />
            )
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/15 text-center text-xs text-muted-foreground">
          Chưa có đơn hàng nào được ghi nhận.
        </div>
      )}

      {/* Order Detail Modal Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null)
            setIsDetailOpen(open)
          }}
        />
      )}

      {/* Deposit & Completion Order Modal Dialog */}
      <DepositOrderModal
        open={depositModal.open}
        onOpenChange={(open) => setDepositModal((prev) => ({ ...prev, open }))}
        initialMode={depositModal.mode}
        order={depositModal.order}
        orderNo={depositModal.order?.orderNo || 'DH653961'}
        studentName={depositModal.order?.studentName || studentName}
        studentPhone="0963355809"
        existingDepositAmount={depositModal.order?.totalPaidAmount || 6000000}
      />

      {/* Draft Order Editor Modal Dialog */}
      <DraftOrderEditorDialog
        open={isDraftEditorOpen}
        onOpenChange={setIsDraftEditorOpen}
        studentId={studentId}
        studentName={studentName}
        existingOrder={editingDraftOrder}
        onSaveSuccess={handleSaveDraftSuccess}
        onDeleteDraft={(orderId) => setDeletingDraftId(orderId)}
      />

      {/* Confirm Delete Draft Dialog */}
      <ConfirmDialog
        open={!!deletingDraftId}
        onOpenChange={(open) => {
          if (!open) setDeletingDraftId(null)
        }}
        title="Xác nhận xóa đơn nháp gia hạn"
        description="Bạn có chắc chắn muốn xóa đơn nháp gia hạn này? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa đơn nháp"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={() => {
          if (deletingDraftId) handleDeleteDraftOrder(deletingDraftId)
        }}
      />
    </div>
  )
}
