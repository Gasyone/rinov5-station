'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  TransactionType,
  mockPaymentReceipts,
} from '@/mocks/paymentReceipts'
import { PaymentReceiptsToolbar } from './PaymentReceiptsToolbar'
import { PaymentReceiptsTable } from './PaymentReceiptsTable'
import { PaymentReceiptsFilterPanel } from './PaymentReceiptsFilterPanel'
import { PaymentReceiptDetailDialog } from './PaymentReceiptDetailDialog'
import { PaymentReceiptCreateDialog } from './PaymentReceiptCreateDialog'
import { PaymentReceiptPayMoreDialog } from './PaymentReceiptPayMoreDialog'
import {
  PaymentReceiptsFilterState,
  STATUS_TILES,
  ReceiptSortField,
  ReceiptSortDirection,
} from './paymentReceiptsTypes'
import {
  filterReceiptsByTimeRange,
  filterReceiptsByDebt,
  filterReceiptsByAmountRange,
  getReceiptStaffList,
  getReceiptBankAccounts,
  sortReceipts,
} from './paymentReceiptsHelpers'

export function PaymentReceiptsScreen() {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockPaymentReceipts)

  const [filters, setFilters] = useState<PaymentReceiptsFilterState>({
    search: '',
    branch: 'all',
    status: 'all',
    transactionType: 'all',
    receiptType: 'all',
    receiptTypes: [],
    paymentMethod: 'all',
    paymentMethods: [],
    quickCondition: 'all',
    timeRange: 'this_month',
    customStartDate: '2026-08-01',
    customEndDate: '2026-08-25',
    createdBy: 'all',
    createdBys: [],
    bankAccount: 'all',
    bankAccounts: [],
    debtStatus: 'all',
    amountRange: 'all',
  })

  const [sortField, setSortField] = useState<ReceiptSortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<ReceiptSortDirection>('desc')

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)

  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [createInitialType, setCreateInitialType] = useState<TransactionType>('receipt')
  const [isPayMoreOpen, setIsPayMoreOpen] = useState<boolean>(false)
  const [payMoreReceipt, setPayMoreReceipt] = useState<PaymentReceipt | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

  // Danh sách nhân sự và tài khoản trích xuất thực tế từ dữ liệu
  const staffList = useMemo(() => getReceiptStaffList(receipts), [receipts])
  const bankAccountList = useMemo(() => getReceiptBankAccounts(receipts), [receipts])

  const activeFilterCount =
    (filters.timeRange !== 'this_month' && filters.timeRange !== 'all' ? 1 : 0) +
    (filters.createdBys?.length ?? (filters.createdBy !== 'all' ? 1 : 0)) +
    (filters.receiptTypes?.length ?? (filters.receiptType !== 'all' ? 1 : 0)) +
    (filters.paymentMethods?.length ?? (filters.paymentMethod !== 'all' ? 1 : 0)) +
    (filters.bankAccounts?.length ?? (filters.bankAccount !== 'all' ? 1 : 0)) +
    (filters.debtStatus !== 'all' ? 1 : 0) +
    (filters.amountRange !== 'all' ? 1 : 0)

  // Lọc danh sách Phiếu thanh toán
  const filteredReceipts = useMemo(() => {
    let list = filterReceiptsByTimeRange(receipts, filters.timeRange, {
      startDate: filters.customStartDate,
      endDate: filters.customEndDate,
    })

    list = list.filter((r) => {
      if (filters.branch !== 'all' && r.branch !== filters.branch) return false
      if (filters.status !== 'all' && r.status !== filters.status) return false
      if (filters.transactionType !== 'all' && r.transactionType !== filters.transactionType) return false
      if (filters.receiptTypes && filters.receiptTypes.length > 0) {
        if (!filters.receiptTypes.includes(r.receiptType)) return false
      } else if (filters.receiptType !== 'all' && r.receiptType !== filters.receiptType) {
        return false
      }
      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        if (!filters.paymentMethods.includes(r.paymentMethod)) return false
      } else if (filters.paymentMethod !== 'all' && r.paymentMethod !== filters.paymentMethod) {
        return false
      }
      if (filters.createdBys && filters.createdBys.length > 0) {
        if (!filters.createdBys.includes(r.createdBy)) return false
      } else if (filters.createdBy !== 'all' && r.createdBy !== filters.createdBy) {
        return false
      }
      if (filters.bankAccounts && filters.bankAccounts.length > 0) {
        if (!r.bankAccount || !filters.bankAccounts.includes(r.bankAccount)) return false
      } else if (filters.bankAccount !== 'all' && r.bankAccount !== filters.bankAccount) {
        return false
      }
      if (filters.quickCondition === 'cash' && r.paymentMethod !== 'cash') return false
      if (filters.quickCondition === 'transfer' && r.paymentMethod !== 'qr_transfer' && r.paymentMethod !== 'bank_transfer') return false
      if (filters.quickCondition === 'deposit' && r.receiptType !== 'deposit') return false
      if (filters.quickCondition === 'debt' && r.orderRemainingAmount <= 0) return false
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim()
        const match =
          r.code.toLowerCase().includes(q) ||
          r.orderCode.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.parentName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.createdBy.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })

    list = filterReceiptsByDebt(list, filters.debtStatus)
    list = filterReceiptsByAmountRange(list, filters.amountRange)
    return sortReceipts(list, sortField, sortDirection)
  }, [receipts, filters, sortField, sortDirection])

  const statusCounts = useMemo(() => {
    let base = filterReceiptsByTimeRange(receipts, filters.timeRange, {
      startDate: filters.customStartDate,
      endDate: filters.customEndDate,
    })

    base = base.filter((r) => {
      if (filters.branch !== 'all' && r.branch !== filters.branch) return false
      if (filters.transactionType !== 'all' && r.transactionType !== filters.transactionType) return false
      if (filters.receiptTypes && filters.receiptTypes.length > 0) {
        if (!filters.receiptTypes.includes(r.receiptType)) return false
      } else if (filters.receiptType !== 'all' && r.receiptType !== filters.receiptType) {
        return false
      }
      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        if (!filters.paymentMethods.includes(r.paymentMethod)) return false
      } else if (filters.paymentMethod !== 'all' && r.paymentMethod !== filters.paymentMethod) {
        return false
      }
      if (filters.createdBys && filters.createdBys.length > 0) {
        if (!filters.createdBys.includes(r.createdBy)) return false
      } else if (filters.createdBy !== 'all' && r.createdBy !== filters.createdBy) {
        return false
      }
      if (filters.bankAccounts && filters.bankAccounts.length > 0) {
        if (!r.bankAccount || !filters.bankAccounts.includes(r.bankAccount)) return false
      } else if (filters.bankAccount !== 'all' && r.bankAccount !== filters.bankAccount) {
        return false
      }
      if (filters.quickCondition === 'cash' && r.paymentMethod !== 'cash') return false
      if (filters.quickCondition === 'transfer' && r.paymentMethod !== 'qr_transfer' && r.paymentMethod !== 'bank_transfer') return false
      if (filters.quickCondition === 'deposit' && r.receiptType !== 'deposit') return false
      if (filters.quickCondition === 'debt' && r.orderRemainingAmount <= 0) return false
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim()
        return (
          r.code.toLowerCase().includes(q) ||
          r.orderCode.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.parentName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.createdBy.toLowerCase().includes(q)
        )
      }
      return true
    })

    base = filterReceiptsByDebt(base, filters.debtStatus)
    base = filterReceiptsByAmountRange(base, filters.amountRange)

    const counts: Record<string, number> = {
      all: base.length,
      completed: 0,
      pending: 0,
      cancelled: 0,
    }

    base.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++
      }
    })

    return counts
  }, [receipts, filters])

  const tilesWithCounts = useMemo(() => {
    return STATUS_TILES.map((t) => ({
      ...t,
      count: statusCounts[t.countKey] ?? 0,
    }))
  }, [statusCounts])

  const baseReceiptsForMetrics = useMemo(() => {
    return receipts.filter((r) => {
      if (filters.branch !== 'all' && r.branch !== filters.branch) return false
      if (filters.createdBy !== 'all' && r.createdBy !== filters.createdBy) return false
      return true
    })
  }, [receipts, filters.branch, filters.createdBy])

  const handleFilterChange = (updates: Partial<PaymentReceiptsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
    setCurrentPage(1)
  }

  const handleCreateReceipt = (newRcpt: PaymentReceipt) => {
    setReceipts((prev) => [newRcpt, ...prev])
  }

  const handlePayMoreSuccess = (newReceipt?: Partial<PaymentReceipt>) => {
    if (!newReceipt) return
    setReceipts((prev) => [newReceipt as PaymentReceipt, ...prev])
  }

  const handleViewDetail = (rcpt: PaymentReceipt) => {
    setSelectedReceipt(rcpt)
    setIsDetailOpen(true)
  }

  const handlePayMore = (rcpt: PaymentReceipt) => {
    setPayMoreReceipt(rcpt)
    setIsPayMoreOpen(true)
  }

  const handleSortChange = (field: ReceiptSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleExportExcel = () => {
    toast.success(`Đã xuất báo cáo phiếu thanh toán (${filteredReceipts.length} dòng) thành công!`)
  }

  const handleToggle = (
    key: 'createdBys' | 'receiptTypes' | 'paymentMethods' | 'bankAccounts',
    value: string
  ) => {
    setCurrentPage(1)
    setFilters((current) => {
      const arr = (current[key] || []) as string[]
      const exists = arr.includes(value)
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...current, [key]: next }
    })
  }

  const handleClearSection = (key: keyof PaymentReceiptsFilterState) => {
    setCurrentPage(1)
    setFilters((current) => ({
      ...current,
      [key]: Array.isArray(current[key]) ? [] : 'all',
    }))
  }

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      timeRange: 'this_month',
      customStartDate: '2026-08-01',
      customEndDate: '2026-08-25',
      createdBy: 'all',
      createdBys: [],
      receiptType: 'all',
      receiptTypes: [],
      paymentMethod: 'all',
      paymentMethods: [],
      bankAccount: 'all',
      bankAccounts: [],
      debtStatus: 'all',
      amountRange: 'all',
    }))
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2.5 pl-4 pt-3 lg:pl-6 pr-0 pb-0 overflow-hidden">
      <PaymentReceiptsToolbar
        filters={filters}
        activeFilterCount={activeFilterCount}
        isFilterOpen={isFilterOpen}
        tilesWithCounts={tilesWithCounts}
        baseReceiptsForMetrics={baseReceiptsForMetrics}
        onFilterChange={handleFilterChange}
        onToggleFilterPanel={() => setIsFilterOpen((prev) => !prev)}
        onExportExcel={handleExportExcel}
        onCreateReceipt={() => {
          setCreateInitialType('receipt')
          setIsCreateOpen(true)
        }}
      />

      {/* Vùng hiển thị Bảng + Panel bộ lọc ghim song song */}
      <div className="flex flex-1 min-h-0 w-full gap-3 pr-4 lg:pr-6 pb-3 overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <PaymentReceiptsTable
            receipts={filteredReceipts}
            totalItems={filteredReceipts.length}
            currentPage={currentPage}
            pageSize={pageSize}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            onSelectStaff={(staff) => {
              handleToggle('createdBys', staff)
              setIsFilterOpen(true)
            }}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onViewDetail={handleViewDetail}
            onPayMore={handlePayMore}
          />
        </div>

        {/* Panel bộ lọc nâng cao dạng ghim cố định ở cạnh phải bảng */}
        {isFilterOpen && (
          <PaymentReceiptsFilterPanel
            receipts={receipts}
            filters={filters}
            staffList={staffList}
            bankAccountList={bankAccountList}
            onClose={() => setIsFilterOpen(false)}
            onToggle={handleToggle}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onClearSection={handleClearSection}
          />
        )}
      </div>

      <PaymentReceiptDetailDialog
        receipt={selectedReceipt}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <PaymentReceiptPayMoreDialog
        receipt={payMoreReceipt || selectedReceipt}
        open={isPayMoreOpen}
        onOpenChange={setIsPayMoreOpen}
        onSuccess={handlePayMoreSuccess}
      />

      <PaymentReceiptCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateReceipt={handleCreateReceipt}
        initialTransactionType={createInitialType}
      />
    </div>
  )
}
