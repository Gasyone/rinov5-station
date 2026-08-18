import React, { useMemo, useState, useCallback } from 'react'
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

export function StudentOrdersTab({ studentId, studentName }: StudentOrdersTabProps) {
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

  const initialOrders = useMemo(() => getStudentOrders(studentId, studentName), [studentId, studentName])
  const transfers = useMemo(() => getFeeTransfers(studentId, studentName), [studentId, studentName])

  // Combine custom draft orders with initial mock orders
  const orders = useMemo(() => {
    return [...customDraftOrders, ...initialOrders]
  }, [customDraftOrders, initialOrders])

  const filteredOrders = useMemo(() => {
    if (showOtherChildrenOrders) return orders
    return orders.filter((o) => !o.isOtherChild)
  }, [orders, showOtherChildrenOrders])

  const isDraftOrder = useCallback((order: DetailedOrder): boolean => {
    return order.id.includes('DRAFT') || order.orderNo.includes('DRAFT') || order.paymentMethodTag?.includes('Đơn nháp') || false
  }, [])

  const isCurrentPackageOrder = useCallback(
    (order: DetailedOrder): boolean => {
      if (isDraftOrder(order)) return false
      return order.orderNo === 'OD800436' || order.paymentStatus === 'unpaid' || order.detailedItems?.some((i) => i.orderType === 'Gia Hạn') || false
    },
    [isDraftOrder]
  )

  const isPurchasedOrder = useCallback(
    (order: DetailedOrder): boolean => {
      return !isDraftOrder(order) && !isCurrentPackageOrder(order)
    },
    [isDraftOrder, isCurrentPackageOrder]
  )

  const draftOrders = useMemo(() => filteredOrders.filter(isDraftOrder), [filteredOrders, isDraftOrder])
  const currentOrders = useMemo(() => filteredOrders.filter(isCurrentPackageOrder), [filteredOrders, isCurrentPackageOrder])
  const purchasedOrders = useMemo(() => filteredOrders.filter(isPurchasedOrder), [filteredOrders, isPurchasedOrder])

  // Merge purchased orders and fee transfers into unified historical timeline items
  const historyTimelineItems = useMemo(() => {
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

    purchasedOrders.forEach((o) => {
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
  }, [purchasedOrders, transfers])

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
      const draftId = `OD-DRAFT-${Math.floor(1000 + Math.random() * 9000)}`
      const sourceNo = sourceOrder.orderNo || sourceOrder.id
      const sourcePkg = item?.productName || sourceOrder.detailedItems?.[0]?.productName || 'Gói học tái phí'

      const newDraft: DetailedOrder = {
        id: draftId,
        orderNo: draftId,
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
        paymentMethodTag: 'COD / Đơn nháp',
        totalPaidAmount: 0,
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

      sourceOrder.linkedDraftOrderNo = draftId
      setCustomDraftOrders((prev) => [newDraft, ...prev])
      setEditingDraftOrder(newDraft)
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
    <div className="space-y-5 text-left">
      {/* ── SECTION: GÓI HIỆN TẠI + CHECKBOX CON KHÁC + NÚT TẠO ĐƠN TRÊN CÙNG ── */}
      {currentOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-0.5 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <span>Gói hiện tại</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[11px] font-mono font-bold">
                {currentOrders.length}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Checkbox mở rộng xem đơn hàng của các con khác */}
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 cursor-pointer select-none hover:text-foreground">
                <input
                  type="checkbox"
                  checked={showOtherChildrenOrders}
                  onChange={(e) => setShowOtherChildrenOrders(e.target.checked)}
                  className="rounded border-border text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer accent-indigo-600"
                />
                <span>Xem đơn các con khác</span>
              </label>

              {/* Button Tạo đơn ở trên cùng */}
              <Button
                type="button"
                onClick={() => {
                  setEditingDraftOrder(null)
                  setIsDraftEditorOpen(true)
                }}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white border border-indigo-200/80 dark:border-indigo-800 font-bold text-xs px-3.5 h-8.5 rounded-lg shadow-2xs cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo đơn</span>
              </Button>
            </div>
          </div>
          <div className="space-y-3.5">
            {currentOrders.map((order) => (
              <StudentOrderCardItem
                key={order.id}
                order={order}
                isDraft={false}
                isCurrent={true}
                isPaymentsExpanded={expandedPayments[order.id] ?? false}
                showOtherChildren={showOtherChildrenOrders}
                draftOrders={draftOrders}
                onToggleExpandPayments={toggleExpandPayments}
                onViewDetail={handleViewDetail}
                onCreateDraftFromPackage={handleCreateDraftFromPackage}
                onCreateCompletionOrder={handleCreateCompletionOrder}
                onAddPayment={handleViewDetail}
                onScrollToOrder={scrollToOrder}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 3: GÓI ĐÃ MUA & LỊCH SỬ CHUYỂN ĐỔI (CHÈN TRỰC TIẾP) ── */}
      {historyTimelineItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-0.5 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300">
              <span>Gói đã mua & Lịch sử chuyển đổi</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[11px] font-mono font-bold">
                {historyTimelineItems.length}
              </span>
            </div>
            <span className="text-[11px] font-normal text-muted-foreground italic">
              ({purchasedOrders.length} gói đã mua &bull; {transfers.length} phiếu chuyển phí)
            </span>
          </div>
          <div className="space-y-3.5">
            {historyTimelineItems.map((item) => {
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
