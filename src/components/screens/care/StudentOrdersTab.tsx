import React, { useMemo, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Order } from '@/mocks/orders'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
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
  const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({})
  const [isDraftEditorOpen, setIsDraftEditorOpen] = useState(false)
  const [editingDraftOrder, setEditingDraftOrder] = useState<DetailedOrder | null>(null)
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null)

  const [customDraftOrders, setCustomDraftOrders] = useState<DetailedOrder[]>([])

  const initialOrders = useMemo(() => getStudentOrders(studentId, studentName), [studentId, studentName])
  const transfers = useMemo(() => getFeeTransfers(studentId, studentName), [studentId, studentName])

  // Combine custom draft orders with initial mock orders
  const orders = useMemo(() => {
    return [...customDraftOrders, ...initialOrders]
  }, [customDraftOrders, initialOrders])

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

  const draftOrders = useMemo(() => orders.filter(isDraftOrder), [orders, isDraftOrder])
  const currentOrders = useMemo(() => orders.filter(isCurrentPackageOrder), [orders, isCurrentPackageOrder])
  const purchasedOrders = useMemo(() => orders.filter(isPurchasedOrder), [orders, isPurchasedOrder])

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
    <div className="space-y-5 text-left select-none">
      {/* ── SECTION: GÓI HIỆN TẠI + NÚT TẠO ĐƠN TRÊN CÙNG ── */}
      {currentOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-0.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <span>Gói hiện tại</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[11px] font-mono font-bold">
                  {currentOrders.length}
                </span>
              </div>
              <span className="text-[11px] font-normal text-muted-foreground italic hidden sm:inline">
                (Gói học đang áp dụng & sắp tái phí)
              </span>
            </div>

            {/* Button Tạo đơn ở trên cùng, bên phải cùng dòng với Gói hiện tại */}
            <Button
              type="button"
              onClick={() => {
                setEditingDraftOrder(null)
                setIsDraftEditorOpen(true)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 h-8.5 rounded-lg shadow-2xs cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo đơn</span>
            </Button>
          </div>
          <div className="space-y-3.5">
            {currentOrders.map((order) => (
              <StudentOrderCardItem
                key={order.id}
                order={order}
                isDraft={false}
                isCurrent={true}
                isPaymentsExpanded={expandedPayments[order.id] ?? false}
                draftOrders={draftOrders}
                onToggleExpandPayments={toggleExpandPayments}
                onViewDetail={handleViewDetail}
                onCreateDraftFromPackage={handleCreateDraftFromPackage}
                onScrollToOrder={scrollToOrder}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 3: GÓI ĐÃ MUA ── */}
      {purchasedOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300">
              <span>Gói đã mua</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[11px] font-mono font-bold">
                {purchasedOrders.length}
              </span>
            </div>
            <span className="text-[11px] font-normal text-muted-foreground italic">
              (Lịch sử các gói đã mua & hoàn thành)
            </span>
          </div>
          <div className="space-y-3.5">
            {purchasedOrders.map((order) => (
              <StudentOrderCardItem
                key={order.id}
                order={order}
                isDraft={false}
                isCurrent={false}
                isPaymentsExpanded={expandedPayments[order.id] ?? false}
                draftOrders={draftOrders}
                onToggleExpandPayments={toggleExpandPayments}
                onViewDetail={handleViewDetail}
                onCreateDraftFromPackage={handleCreateDraftFromPackage}
                onScrollToOrder={scrollToOrder}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 4: LỊCH SỬ CHUYỂN PHÍ ── */}
      {transfers.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between py-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-muted-foreground">
              <span>Lịch sử chuyển phí</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono font-bold text-foreground">
                {transfers.length}
              </span>
            </div>
            <span className="text-[11px] font-normal text-muted-foreground italic">
              (Giao dịch chuyển số buổi giữa các gói)
            </span>
          </div>
          <div className="space-y-3.5">
            {transfers.map((tf) => (
              <StudentFeeTransferItem
                key={tf.id}
                transfer={tf}
                onScrollToOrder={scrollToOrder}
              />
            ))}
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
