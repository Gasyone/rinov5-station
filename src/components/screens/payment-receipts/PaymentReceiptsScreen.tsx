'use client'

import { useState, useMemo } from 'react'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  ReceiptType,
  PaymentMethod,
  TransactionType,
  mockPaymentReceipts,
} from '@/mocks/paymentReceipts'
import { StatusTiles } from '@/components/shared'
import {
  ExpandableSearch,
  BranchSelect,
  FilterIconButton,
  InlineSelect,
  SYSTEM_BRANCHES,
} from '@/components/controls'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
  getSchoolFilterGroup,
} from '@/components/filters'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaymentReceiptsTable } from './PaymentReceiptsTable'
import { PaymentReceiptDetailDialog } from './PaymentReceiptDetailDialog'
import { PaymentReceiptCreateDialog } from './PaymentReceiptCreateDialog'
import { PaymentReceiptPayMoreDialog } from './PaymentReceiptPayMoreDialog'
import {
  PaymentReceiptsFilterState,
  STATUS_TILES,
  FilterStatus,
} from './paymentReceiptsTypes'

const TRANSACTION_TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả loại phiếu' },
  { value: 'receipt', label: '📥 Phiếu thu' },
  { value: 'payment_voucher', label: '📤 Phiếu chi / Hoàn' },
]

const TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả mục đích' },
  { value: 'deposit', label: 'Cọc giữ chỗ' },
  { value: 'tuition_full', label: 'Thu đủ học phí' },
  { value: 'installment', label: 'Kỳ trả góp' },
  { value: 'event_fee', label: 'Phí sự kiện' },
  { value: 'refund', label: 'Hoàn tiền / Trả lại' },
  { value: 'other', label: 'Khoản khác' },
]

const METHOD_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả phương thức' },
  { value: 'qr_transfer', label: 'Chuyển khoản QR' },
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'pos_card', label: 'Cà thẻ POS' },
  { value: 'bank_transfer', label: 'Chuyển khoản NH' },
]

export function PaymentReceiptsScreen() {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockPaymentReceipts)

  const [filters, setFilters] = useState<PaymentReceiptsFilterState>({
    search: '',
    branch: 'all',
    status: 'all',
    transactionType: 'all',
    receiptType: 'all',
    paymentMethod: 'all',
    quickCondition: 'all',
  })
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

  const activeFilterCount =
    (filters.branch !== 'all' ? 1 : 0) +
    (filters.transactionType !== 'all' ? 1 : 0) +
    (filters.receiptType !== 'all' ? 1 : 0) +
    (filters.paymentMethod !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0)

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      getSchoolFilterGroup(
        'branches',
        filters.branch !== 'all' ? [filters.branch] : [],
        (b) => receipts.filter((r) => r.branch === b).length,
        SYSTEM_BRANCHES
      ),
      createFilterGroup({
        id: 'transactionType',
        title: 'Loại phiếu giao dịch',
        options: [
          { value: 'receipt', label: '📥 Phiếu thu' },
          { value: 'payment_voucher', label: '📤 Phiếu chi / Hoàn tiền' },
        ],
        selectedValues: filters.transactionType !== 'all' ? [filters.transactionType] : [],
        getOptionCount: (val) => receipts.filter((r) => r.transactionType === val).length,
      }),
      createFilterGroup({
        id: 'receiptType',
        title: 'Mục đích giao dịch',
        options: [
          { value: 'tuition_full', label: 'Thu đủ học phí' },
          { value: 'deposit', label: 'Cọc giữ chỗ' },
          { value: 'installment', label: 'Kỳ trả góp' },
          { value: 'event_fee', label: 'Phí sự kiện' },
          { value: 'refund', label: 'Hoàn tiền / Trả lại' },
          { value: 'other', label: 'Khoản khác' },
        ],
        selectedValues: filters.receiptType !== 'all' ? [filters.receiptType] : [],
        getOptionCount: (val) => receipts.filter((r) => r.receiptType === val).length,
      }),
      createFilterGroup({
        id: 'paymentMethod',
        title: 'Phương thức thanh toán',
        options: [
          { value: 'qr_transfer', label: 'Chuyển khoản QR' },
          { value: 'cash', label: 'Tiền mặt' },
          { value: 'pos_card', label: 'Cà thẻ POS' },
          { value: 'bank_transfer', label: 'Chuyển khoản NH' },
        ],
        selectedValues: filters.paymentMethod !== 'all' ? [filters.paymentMethod] : [],
        getOptionCount: (val) => receipts.filter((r) => r.paymentMethod === val).length,
      }),
      createFilterGroup({
        id: 'status',
        title: 'Trạng thái phiếu',
        options: [
          { value: 'completed', label: 'Thành công' },
          { value: 'pending', label: 'Chờ thanh toán' },
          { value: 'cancelled', label: 'Đã hủy' },
        ],
        selectedValues: filters.status !== 'all' ? [filters.status] : [],
        getOptionCount: (val) => receipts.filter((r) => r.status === val).length,
      }),
    ],
    [receipts, filters]
  )

  // Lọc danh sách Phiếu thanh toán
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      if (filters.branch !== 'all' && r.branch !== filters.branch) return false
      if (filters.status !== 'all' && r.status !== filters.status) return false
      if (filters.transactionType !== 'all' && r.transactionType !== filters.transactionType) return false
      if (filters.receiptType !== 'all' && r.receiptType !== filters.receiptType) return false
      if (filters.paymentMethod !== 'all' && r.paymentMethod !== filters.paymentMethod) return false
      if (filters.quickCondition === 'reconciled' && !r.isReconciled) return false
      if (filters.quickCondition === 'fully_paid' && r.orderRemainingAmount !== 0) return false
      if (filters.quickCondition === 'deposit' && r.receiptType !== 'deposit') return false
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
  }, [receipts, filters])

  // Đếm số lượng đếm theo Status Tile
  const statusCounts = useMemo(() => {
    const base = receipts.filter((r) => {
      if (filters.branch !== 'all' && r.branch !== filters.branch) return false
      if (filters.transactionType !== 'all' && r.transactionType !== filters.transactionType) return false
      if (filters.receiptType !== 'all' && r.receiptType !== filters.receiptType) return false
      if (filters.paymentMethod !== 'all' && r.paymentMethod !== filters.paymentMethod) return false
      if (filters.quickCondition === 'reconciled' && !r.isReconciled) return false
      if (filters.quickCondition === 'fully_paid' && r.orderRemainingAmount !== 0) return false
      if (filters.quickCondition === 'deposit' && r.receiptType !== 'deposit') return false
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim()
        return (
          r.code.toLowerCase().includes(q) ||
          r.orderCode.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.parentName.toLowerCase().includes(q) ||
          r.phone.includes(q)
        )
      }
      return true
    })

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
  }, [receipts, filters.branch, filters.transactionType, filters.receiptType, filters.paymentMethod, filters.quickCondition, filters.search])

  const tilesWithCounts = useMemo(() => {
    return STATUS_TILES.map((t) => ({
      ...t,
      count: statusCounts[t.countKey] ?? 0,
    }))
  }, [statusCounts])

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

  const handleExportExcel = () => {
    toast.success(`Đã xuất báo cáo phiếu thanh toán (${filteredReceipts.length} dòng) thành công!`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2.5 pl-4 pt-3 lg:pl-6 pr-0 pb-0 overflow-hidden">
      {/* Khối Toolbar & Filters bên trên */}
      <div className="pr-4 lg:pr-6 flex flex-col gap-2.5 shrink-0">
        {/* HÀNG 1: Chọn cơ sở -> Lọc Thu/Chi/Loại/PTTT | Search -> Xuất Excel -> Nút Lập phiếu */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-0.5">
          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            {/* 1. Chọn cơ sở */}
            <BranchSelect
              value={filters.branch}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, branch: val }))
                setCurrentPage(1)
              }}
              className="w-[170px] shrink-0"
            />

            {/* 2. Lọc Thu / Chi */}
            <InlineSelect
              value={filters.transactionType}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, transactionType: val as TransactionType | 'all' }))
                setCurrentPage(1)
              }}
              options={TRANSACTION_TYPE_FILTER_OPTIONS}
              className="w-[145px] shrink-0"
            />

            {/* 3. Lọc loại mục đích giao dịch */}
            <InlineSelect
              value={filters.receiptType}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, receiptType: val as ReceiptType | 'all' }))
                setCurrentPage(1)
              }}
              options={TYPE_FILTER_OPTIONS}
              className="w-[140px] shrink-0"
            />

            {/* 4. Lọc phương thức thanh toán */}
            <InlineSelect
              value={filters.paymentMethod}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, paymentMethod: val as PaymentMethod | 'all' }))
                setCurrentPage(1)
              }}
              options={METHOD_FILTER_OPTIONS}
              className="w-[150px] shrink-0"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 5. Ô Tìm kiếm */}
            <ExpandableSearch
              value={filters.search}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, search: val }))
                setCurrentPage(1)
              }}
              placeholder="Tìm Mã TNX, Đơn hàng, Tên..."
            />

            {/* Nút Mở bộ lọc nâng cao */}
            <FilterIconButton
              count={activeFilterCount}
              onClick={() => setIsFilterOpen(true)}
            />

            {/* 6. Nút Xuất Excel */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8 cursor-pointer"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4" />
              <span>Xuất Excel</span>
            </Button>

            {/* 7. Nút Lập phiếu thanh toán mới */}
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8 cursor-pointer"
              onClick={() => {
                setCreateInitialType('receipt')
                setIsCreateOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Lập phiếu mới</span>
            </Button>
          </div>
        </div>

        {/* HÀNG 2: Tab Lọc Trạng Thái (Status Tiles) ở bên trái + Lọc nhanh điều kiện ở cạnh phải */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <StatusTiles
            tiles={tilesWithCounts}
            activeId={filters.status}
            noOverflowCollapse={true}
            className="flex-1 min-w-0"
            onSelect={(id) => {
              setFilters((prev) => ({ ...prev, status: id as FilterStatus }))
              setCurrentPage(1)
            }}
          />

          {/* Cụm Lọc nhanh ở cạnh phải */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs py-0.5">
            <span className="text-xs text-muted-foreground mr-0.5">Lọc nhanh:</span>

            {/* Nút Đã đối soát */}
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  quickCondition: prev.quickCondition === 'reconciled' ? 'all' : 'reconciled',
                }))
                setCurrentPage(1)
              }}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
                filters.quickCondition === 'reconciled'
                  ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                  : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
              )}
            >
              Đã đối soát
            </button>

            {/* Nút Đã tất toán */}
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  quickCondition: prev.quickCondition === 'fully_paid' ? 'all' : 'fully_paid',
                }))
                setCurrentPage(1)
              }}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
                filters.quickCondition === 'fully_paid'
                  ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                  : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
              )}
            >
              Đã tất toán
            </button>

            {/* Nút Cọc */}
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  quickCondition: prev.quickCondition === 'deposit' ? 'all' : 'deposit',
                }))
                setCurrentPage(1)
              }}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
                filters.quickCondition === 'deposit'
                  ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                  : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
              )}
            >
              Cọc
            </button>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu Phiếu thanh toán */}
      <div className="flex-1 min-h-0 w-full pr-0 pb-0">
        <PaymentReceiptsTable
          receipts={filteredReceipts}
          totalItems={filteredReceipts.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onViewDetail={handleViewDetail}
          onPayMore={handlePayMore}
        />
      </div>

      {/* Modal Chi tiết Phiếu thanh toán */}
      <PaymentReceiptDetailDialog
        receipt={selectedReceipt}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* Modal Thanh toán nhiều lần / Thanh toán thêm */}
      <PaymentReceiptPayMoreDialog
        receipt={payMoreReceipt || selectedReceipt}
        open={isPayMoreOpen}
        onOpenChange={setIsPayMoreOpen}
        onSuccess={handlePayMoreSuccess}
      />

      {/* Modal Lập Phiếu thanh toán mới */}
      <PaymentReceiptCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateReceipt={handleCreateReceipt}
        initialTransactionType={createInitialType}
      />

      {/* Modal / Panel Bộ lọc nâng cao */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc nâng cao phiếu thanh toán"
        description="Lọc kết hợp theo cơ sở, loại phiếu, mục đích, phương thức thanh toán và trạng thái."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') {
            setFilters((prev) => ({ ...prev, branch: prev.branch === value ? 'all' : value }))
          }
          if (sectionId === 'transactionType') {
            setFilters((prev) => ({
              ...prev,
              transactionType: prev.transactionType === value ? 'all' : (value as TransactionType),
            }))
          }
          if (sectionId === 'receiptType') {
            setFilters((prev) => ({
              ...prev,
              receiptType: prev.receiptType === value ? 'all' : (value as ReceiptType),
            }))
          }
          if (sectionId === 'paymentMethod') {
            setFilters((prev) => ({
              ...prev,
              paymentMethod: prev.paymentMethod === value ? 'all' : (value as PaymentMethod),
            }))
          }
          if (sectionId === 'status') {
            setFilters((prev) => ({
              ...prev,
              status: prev.status === value ? 'all' : (value as FilterStatus),
            }))
          }
          setCurrentPage(1)
        }}
        onClearAll={() => {
          setFilters({
            search: '',
            branch: 'all',
            status: 'all',
            transactionType: 'all',
            receiptType: 'all',
            paymentMethod: 'all',
            quickCondition: 'all',
          })
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
