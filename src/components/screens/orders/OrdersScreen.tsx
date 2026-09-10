'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import { ConfirmDialog } from '@/components/shared'
import { SYSTEM_BRANCHES } from '@/components/controls'
import type { Order } from '@/mocks/orders'
import {
  calculateOrderMetrics,
  filterOrders,
  getInitialOrders,
} from './ordersHelpers'
import {
  type OrderFilterState,
  type OrderStatusFilter,
  type PackageTypeFilter,
  type PaymentConditionFilter,
} from './ordersTypes'
import { OrdersToolbar } from './OrdersToolbar'
import { OrdersTable } from './OrdersTable'
import { OrderDetailDialog } from './OrderDetailDialog'
import { OrdersFilterPanel } from './OrdersFilterPanel'
import { PaymentReceiptPayMoreDialog } from '../payment-receipts/PaymentReceiptPayMoreDialog'
import { addPaymentReceipt } from '@/mocks/paymentReceipts'
import { QuickCreateFulfillmentDialog } from './QuickCreateFulfillmentDialog'

export function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>(() => getInitialOrders())
  const [activeBranch, setActiveBranch] = useState('all')
  const [activePackageType, setActivePackageType] = useState<PackageTypeFilter>('all')
  const [activeStatus, setActiveStatus] = useState<OrderStatusFilter>('all')
  const [activePaymentCondition, setActivePaymentCondition] = useState<PaymentConditionFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<OrderFilterState>({
    branches: [],
    paymentMethods: [],
    paymentStatuses: [],
    orderStatuses: [],
    packageCategories: [],
    salesStaff: [],
    fulfillmentStatuses: [],
    fulfillmentTypes: [],
    timeRange: 'all',
    customStartDate: '',
    customEndDate: '',
    amountRange: 'all',
    orderNature: 'all',
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [detail, setDetail] = useState<Order | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const [quickPayTarget, setQuickPayTarget] = useState<Order | null>(null)
  const [quickFulfillTarget, setQuickFulfillTarget] = useState<Order | null>(null)

  const baseOrdersForToolbar = useMemo(
    () =>
      filterOrders(orders, {
        search: searchTerm,
        branch: activeBranch,
        status: 'all',
        packageType: activePackageType,
        extra: filters,
      }),
    [orders, searchTerm, activeBranch, activePackageType, filters]
  )

  const filtered = useMemo(
    () =>
      filterOrders(orders, {
        search: searchTerm,
        branch: activeBranch,
        status: activeStatus,
        packageType: activePackageType,
        paymentCondition: activePaymentCondition,
        extra: filters,
      }),
    [orders, searchTerm, activeBranch, activeStatus, activePackageType, activePaymentCondition, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.branches.length +
    filters.paymentMethods.length +
    filters.paymentStatuses.length +
    filters.orderStatuses.length +
    (filters.packageCategories?.length || 0) +
    (filters.salesStaff?.length || 0) +
    (filters.fulfillmentStatuses?.length || 0) +
    (filters.fulfillmentTypes?.length || 0) +
    (filters.timeRange && filters.timeRange !== 'all' ? 1 : 0) +
    (filters.amountRange && filters.amountRange !== 'all' ? 1 : 0) +
    (filters.orderNature && filters.orderNature !== 'all' ? 1 : 0)

  const handleFilterChange = (updates: Partial<OrderFilterState>) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const toggleArray = <K extends keyof OrderFilterState>(
    key: K,
    value: NonNullable<OrderFilterState[K]>[number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = (current[key] || []) as string[]
      const exists = arr.includes(value as string)
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...current, [key]: next } as OrderFilterState
    })
  }

  const handleCancel = (order: Order) => {
    setCancelTarget(order)
  }

  const handleConfirmCancel = () => {
    if (!cancelTarget) return
    setOrders((prev) =>
      prev.map((o) => (o.id === cancelTarget.id ? { ...o, status: 'cancelled' as const } : o))
    )
    toast.success(`Đã hủy đơn hàng ${cancelTarget.orderNo}`)
    setCancelTarget(null)
  }

  const metrics = useMemo(() => calculateOrderMetrics(baseOrdersForToolbar), [baseOrdersForToolbar])

  return (
    <div className="flex h-full w-full flex-col min-h-0 pl-4 lg:pl-6 pr-0 pt-3 pb-0 bg-background overflow-hidden">
      <div className="pr-4 lg:pr-6 shrink-0 flex flex-col gap-2">
        {/* Thanh công cụ tìm kiếm, lọc gói/cơ sở và Smartcard Popover ở góc trên phải */}
        <OrdersToolbar
          orders={baseOrdersForToolbar}
          branches={SYSTEM_BRANCHES}
          activeBranch={activeBranch}
          activePackageType={activePackageType}
          activeStatus={activeStatus}
          activePaymentCondition={activePaymentCondition}
          searchTerm={searchTerm}
          activeFilterCount={activeFilterCount}
          metrics={metrics}
          onBranchChange={(b) => {
            setActiveBranch(b)
            setPage(1)
          }}
          onPackageTypeChange={(pkg) => {
            setActivePackageType(pkg)
            setPage(1)
          }}
          onStatusChange={(s) => {
            setActiveStatus(s)
            setPage(1)
          }}
          onPaymentConditionChange={(cond) => {
            setActivePaymentCondition(cond)
            setPage(1)
          }}
          onSearchChange={(v) => {
            setSearchTerm(v)
            setPage(1)
          }}
          onOpenFilters={() => setIsFilterOpen((prev) => !prev)}
        />
      </div>

      {/* Bảng Dữ Liệu Đơn Hàng & Panel Bộ Lọc Ghim Cạnh Phải */}
      <div className="flex flex-1 min-h-0 w-full gap-3 pr-4 lg:pr-6 pb-3 overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <DataTableFrame
            className="rounded-lg border overflow-hidden bg-card h-full"
            footer={
              <DataTablePagination
                page={currentPage}
                total={filtered.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            }
          >
            <OrdersTable
              orders={paged}
              onRowClick={setDetail}
              onView={setDetail}
              onCancel={handleCancel}
              onAddPayment={setDetail}
              onQuickPay={setQuickPayTarget}
              onQuickFulfill={setQuickFulfillTarget}
            />
          </DataTableFrame>
        </div>

        {/* Panel bộ lọc ghim ở cạnh phải (không phải modal nổi có overlay mờ) */}
        {isFilterOpen && (
          <OrdersFilterPanel
            orders={orders}
            filters={filters}
            onClose={() => setIsFilterOpen(false)}
            onToggle={toggleArray}
            onFilterChange={handleFilterChange}
            onClearAll={() => {
              setFilters({
                branches: [],
                paymentMethods: [],
                paymentStatuses: [],
                orderStatuses: [],
                packageCategories: [],
                salesStaff: [],
                fulfillmentStatuses: [],
                fulfillmentTypes: [],
                timeRange: 'all',
                customStartDate: '',
                customEndDate: '',
                amountRange: 'all',
                orderNature: 'all',
              })
              setPage(1)
            }}
            onClearSection={(key) => {
              setFilters((prev) => ({
                ...prev,
                [key]: key === 'timeRange' || key === 'amountRange' || key === 'orderNature' ? 'all' : [],
                ...(key === 'timeRange' ? { customStartDate: '', customEndDate: '' } : {}),
              }))
              setPage(1)
            }}
          />
        )}
      </div>

      <OrderDetailDialog
        order={detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null)
        }}
        onCancel={handleCancel}
        onUpdateOrder={(updated: Order) => {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
          setDetail(updated)
        }}
      />

      {/* Modal thanh toán nhiều lần / thu khoản nợ còn lại */}
      <PaymentReceiptPayMoreDialog
        order={quickPayTarget}
        open={Boolean(quickPayTarget)}
        onOpenChange={(open) => {
          if (!open) setQuickPayTarget(null)
        }}
        onSuccess={(newReceipt) => {
          if (!quickPayTarget) return
          addPaymentReceipt(newReceipt)
          const newPaid = (quickPayTarget.paidAmount ?? 0) + newReceipt.amount
          const newRemaining = Math.max(0, quickPayTarget.finalAmount - newPaid)
          const isFull = newRemaining === 0
          const updatedOrder: Order = {
            ...quickPayTarget,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            paymentStatus: isFull ? 'paid' : 'partial',
            status: isFull ? 'completed' : quickPayTarget.status,
            paymentHistory: [
              {
                id: newReceipt.id,
                code: newReceipt.code,
                sequenceNo: (quickPayTarget.paymentHistory?.length || 0) + 1,
                amount: newReceipt.amount,
                paymentMethod: newReceipt.paymentMethod,
                paidAt: newReceipt.createdAt,
                note: newReceipt.shippingNote || newReceipt.operationNote,
                reconciliationStatus: 'reconciled',
              },
              ...(quickPayTarget.paymentHistory || []),
            ],
            updatedAt: new Date().toISOString(),
          }
          setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
          if (detail && detail.id === updatedOrder.id) setDetail(updatedOrder)
          setQuickPayTarget(null)
        }}
      />

      {/* Dialog tạo phiếu chuyển giao SP/DV nhanh */}
      <QuickCreateFulfillmentDialog
        order={quickFulfillTarget}
        open={Boolean(quickFulfillTarget)}
        onOpenChange={(open) => {
          if (!open) setQuickFulfillTarget(null)
        }}
        onSuccess={(updatedOrder) => {
          setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
          if (detail && detail.id === updatedOrder.id) setDetail(updatedOrder)
        }}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null)
        }}
        variant="destructive"
        title={`Hủy đơn hàng ${cancelTarget?.orderNo ?? ''}?`}
        description="Đơn hàng sẽ chuyển sang trạng thái Đã hủy."
        confirmLabel="Hủy đơn hàng"
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
