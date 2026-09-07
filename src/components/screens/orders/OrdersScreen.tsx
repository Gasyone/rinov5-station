'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
  getSchoolFilterGroup,
} from '@/components/filters'
import { ConfirmDialog } from '@/components/shared'
import { SYSTEM_BRANCHES } from '@/components/controls'
import type { Order } from '@/mocks/orders'
import {
  calculateOrderMetrics,
  filterOrders,
  getInitialOrders,
  getOrderEffectiveStatus,
  getOrderPaymentMethods,
  getOrderPaymentStatuses,
  getOrderStatusLabel,
} from './ordersHelpers'
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderFilterState,
  type OrderStatusFilter,
  type PackageTypeFilter,
  type PaymentConditionFilter,
} from './ordersTypes'
import { OrdersToolbar } from './OrdersToolbar'
import { OrdersTable } from './OrdersTable'
import { OrderDetailDialog } from './OrderDetailDialog'

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
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [detail, setDetail] = useState<Order | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)

  const paymentMethods = useMemo(() => getOrderPaymentMethods(orders), [orders])
  const paymentStatuses = useMemo(() => getOrderPaymentStatuses(orders), [orders])

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
    filters.orderStatuses.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      getSchoolFilterGroup(
        'branches',
        filters.branches,
        (branch) => orders.filter((o) => o.branch === branch).length,
        SYSTEM_BRANCHES
      ),
      createFilterGroup({
        id: 'orderStatuses',
        title: 'Trạng thái đơn hàng',
        options: ['completed', 'processing', 'pending', 'cancelled', 'refunded'] as Array<Order['status']>,
        selectedValues: filters.orderStatuses,
        getOptionLabel: (status) => getOrderStatusLabel(status as Order['status']),
        getOptionCount: (status) =>
          orders.filter((o) => getOrderEffectiveStatus(o) === status).length,
      }),
      createFilterGroup({
        id: 'paymentMethods',
        options: paymentMethods,
        selectedValues: filters.paymentMethods,
        getOptionLabel: (method) => PAYMENT_METHOD_LABELS[method as Order['paymentMethod']],
        getOptionCount: (method) => orders.filter((o) => o.paymentMethod === method).length,
      }),
      createFilterGroup({
        id: 'paymentStatuses',
        options: paymentStatuses,
        selectedValues: filters.paymentStatuses,
        getOptionLabel: (status) => PAYMENT_STATUS_LABELS[status as Order['paymentStatus']],
        getOptionCount: (status) => orders.filter((o) => o.paymentStatus === status).length,
      }),
    ],
    [paymentMethods, paymentStatuses, orders, filters]
  )

  const toggleArray = <K extends keyof OrderFilterState>(key: K, value: OrderFilterState[K][number]) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
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
      <div className="pr-3 lg:pr-4 shrink-0 flex flex-col gap-2">
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
          onOpenFilters={() => setIsFilterOpen(true)}
        />
      </div>

      {/* Bảng Dữ Liệu Đơn Hàng tràn sát mép dưới và mép phải */}
      <div className="min-h-0 flex-1 overflow-hidden pr-0 pb-0 w-full">
        <DataTableFrame
          className="rounded-t-lg rounded-b-none border-b-0 border-r-0 h-full"
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
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc đơn hàng"
        description="Lọc theo cơ sở, phương thức thanh toán và trạng thái thanh toán."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleArray('branches', value)
          if (sectionId === 'orderStatuses')
            toggleArray('orderStatuses', value as Order['status'])
          if (sectionId === 'paymentMethods')
            toggleArray('paymentMethods', value as Order['paymentMethod'])
          if (sectionId === 'paymentStatuses')
            toggleArray('paymentStatuses', value as Order['paymentStatus'])
        }}
        onClearAll={() => {
          setFilters({ branches: [], paymentMethods: [], paymentStatuses: [], orderStatuses: [] })
          setPage(1)
        }}
      />

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
