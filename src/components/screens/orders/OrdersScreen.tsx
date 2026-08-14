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
    toast.success(`Đã hủy đơn hàng ${cancelTarget.orderNo}`)
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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2 pl-3 pt-2 lg:pl-4 pr-0 pb-0 overflow-hidden bg-background">
      <div className="pr-3 lg:pr-4 shrink-0 flex flex-col gap-2">
        {/* Thanh công cụ tìm kiếm và lọc */}
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

        {/* Thẻ Metric Thu hẹp (Smartcards tinh gọn, bỏ badding/margin) */}
        <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Tổng số đơn" value={metrics.total.toString()} icon={ReceiptText} />
          <MetricTile
            label="Doanh thu đã thu"
            value={`${metrics.revenue.toLocaleString('vi-VN')} đ`}
            icon={Banknote}
          />
          <MetricTile
            label="Học phí còn nợ"
            value={`${metrics.outstanding.toLocaleString('vi-VN')} đ`}
            icon={Wallet}
          />
          <MetricTile label="Đơn hoàn tất" value={metrics.completed.toString()} icon={CheckCircle} />
        </div>
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
        title={`Hủy đơn hàng ${cancelTarget?.orderNo ?? ''}?`}
        description="Đơn hàng sẽ chuyển sang trạng thái Đã hủy."
        confirmLabel="Hủy đơn hàng"
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
