'use client'

import { useMemo, useState } from 'react'
import { Banknote, CheckCircle, ReceiptText, Wallet } from 'lucide-react'
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
import { ConfirmDialog, MetricTile } from '@/components/shared'
import type { Order } from '@/mocks/orders'
import {
  filterOrders,
  getInitialOrders,
  getOrderBranches,
  getOrderPaymentMethods,
  getOrderPaymentStatuses,
  sumOrders,
  sumOrdersPaid,
} from './ordersHelpers'
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderFilterState,
  type OrderStatusFilter,
} from './ordersTypes'
import { OrdersToolbar } from './OrdersToolbar'
import { OrdersTable } from './OrdersTable'
import { OrderDetailDialog } from './OrderDetailDialog'

export function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>(() => getInitialOrders())
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<OrderStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<OrderFilterState>({
    branches: [],
    paymentMethods: [],
    paymentStatuses: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [detail, setDetail] = useState<Order | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)

  const branches = useMemo(() => getOrderBranches(orders), [orders])
  const paymentMethods = useMemo(() => getOrderPaymentMethods(orders), [orders])
  const paymentStatuses = useMemo(() => getOrderPaymentStatuses(orders), [orders])

  const filtered = useMemo(
    () =>
      filterOrders(orders, {
        search: searchTerm,
        branch: activeBranch,
        status: activeStatus,
        extra: filters,
      }),
    [orders, searchTerm, activeBranch, activeStatus, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.branches.length +
    filters.paymentMethods.length +
    filters.paymentStatuses.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      getSchoolFilterGroup(
        'branches',
        filters.branches,
        (branch) => orders.filter((o) => o.branch === branch).length,
        branches
      ),
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
    [branches, paymentMethods, paymentStatuses, orders, filters]
  )

  const toggleArray = <K extends keyof OrderFilterState>(key: K, value: OrderFilterState[K][number]) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      const exists = arr.includes(value as string)
      return {
        ...current,
        [key]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      } as OrderFilterState
    })
  }

  const handleCancel = (order: Order) => setCancelTarget(order)

  const handleConfirmCancel = () => {
    if (!cancelTarget) return
    const id = cancelTarget.id
    setOrders((current) =>
      current.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o))
    )
    setCancelTarget(null)
    setDetail(null)
    toast.success(`Cancelled ${cancelTarget.orderNo}`)
  }

  const metrics = useMemo(
    () => ({
      total: filtered.length,
      revenue: sumOrdersPaid(filtered),
      outstanding: sumOrders(filtered) - sumOrdersPaid(filtered),
      completed: filtered.filter((o) => o.status === 'completed').length,
    }),
    [filtered]
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <OrdersToolbar
        orders={orders}
        branches={branches}
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="grid shrink-0 gap-3 px-4 pb-3 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <MetricTile label="Filtered orders" value={metrics.total} icon={ReceiptText} />
        <MetricTile
          label="Paid revenue"
          value={metrics.revenue.toLocaleString('vi-VN')}
          icon={Banknote}
        />
        <MetricTile
          label="Outstanding"
          value={metrics.outstanding.toLocaleString('vi-VN')}
          icon={Wallet}
        />
        <MetricTile label="Completed" value={metrics.completed} icon={CheckCircle} />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 lg:px-6 lg:pb-6">
        <DataTableFrame
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
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Order filters"
        description="Filter by branch, payment method, and payment status."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleArray('branches', value)
          if (sectionId === 'paymentMethods')
            toggleArray('paymentMethods', value as Order['paymentMethod'])
          if (sectionId === 'paymentStatuses')
            toggleArray('paymentStatuses', value as Order['paymentStatus'])
        }}
        onClearAll={() => {
          setFilters({ branches: [], paymentMethods: [], paymentStatuses: [] })
          setPage(1)
        }}
      />

      <OrderDetailDialog
        order={detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null)
        }}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null)
        }}
        variant="destructive"
        title={`Cancel ${cancelTarget?.orderNo ?? 'order'}?`}
        description="The order moves to Cancelled status. This change is local to the demo data set."
        confirmLabel="Cancel order"
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
