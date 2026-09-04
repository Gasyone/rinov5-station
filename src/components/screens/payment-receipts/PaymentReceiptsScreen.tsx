'use client'

import { useState, useMemo } from 'react'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  ReceivableItem,
  ReceiptType,
  PaymentMethod,
  TransactionType,
  mockPaymentReceipts,
  mockReceivables,
} from '@/mocks/paymentReceipts'
import { StatusTiles } from '@/components/shared'
import {
  ExpandableSearch,
  BranchSelect,
  InlineSelect,
  SegmentedControl,
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaymentReceiptsTable } from './PaymentReceiptsTable'
import { ReceivablesTable } from './ReceivablesTable'
import { PaymentReceiptDetailDialog } from './PaymentReceiptDetailDialog'
import { PaymentReceiptCreateDialog } from './PaymentReceiptCreateDialog'
import { PaymentReceiptPayMoreDialog } from './PaymentReceiptPayMoreDialog'
import {
  PaymentReceiptsFilterState,
  STATUS_TILES,
  FilterStatus,
} from './paymentReceiptsTypes'

type MainMode = 'receivables' | 'receipts'

const MAIN_MODE_OPTIONS: { value: MainMode; label: string }[] = [
  { value: 'receivables', label: '📋 Khoản cần thu' },
  { value: 'receipts', label: '🧾 Phiếu thanh toán' },
]

const BRANCH_OPTIONS = [
  'Chi nhánh Quận 1',
  'Chi nhánh Cầu Giấy',
  'Chi nhánh Quận 7',
  'Chi nhánh Thảo Điền',
]

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
  const [mainMode, setMainMode] = useState<MainMode>('receipts')
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockPaymentReceipts)
  const [receivables, setReceivables] = useState<ReceivableItem[]>(mockReceivables)

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

  // Pre-fill state for Create Dialog from a ReceivableItem
  const [prefillOrderCode, setPrefillOrderCode] = useState<string>('')

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

  // Lọc danh sách Khoản cần thu
  const filteredReceivables = useMemo(() => {
    return receivables.filter((rec) => {
      if (filters.branch !== 'all' && rec.branch !== filters.branch) return false
      if (filters.receiptType !== 'all' && rec.receiptType !== filters.receiptType) return false
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim()
        const match =
          rec.orderCode.toLowerCase().includes(q) ||
          rec.studentName.toLowerCase().includes(q) ||
          rec.parentName.toLowerCase().includes(q) ||
          rec.phone.includes(q) ||
          rec.packageName.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [receivables, filters])

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

    // Nếu tạo từ khoản cần thu, xóa khỏi danh sách cần thu
    if (prefillOrderCode) {
      setReceivables((prev) => prev.filter((r) => r.orderCode !== prefillOrderCode))
      setPrefillOrderCode('')
    }
  }

  const handleCreateFromReceivableItem = (item: ReceivableItem) => {
    setPrefillOrderCode(item.orderCode)
    setCreateInitialType('receipt')
    setIsCreateOpen(true)
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
    const count = mainMode === 'receivables' ? filteredReceivables.length : filteredReceipts.length
    toast.success(`Đã xuất báo cáo ${mainMode === 'receivables' ? 'khoản cần thu' : 'phiếu thanh toán'} (${count} dòng) thành công!`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2.5 pl-4 pt-3 lg:pl-6 pr-0 pb-0 overflow-hidden">
      {/* Khối Toolbar & Filters bên trên */}
      <div className="pr-4 lg:pr-6 flex flex-col gap-2.5 shrink-0">
        {/* HÀNG 1: 2 TAB CHÍNH NẰM Ở ĐẦU -> Chọn cơ sở -> Lọc Thu/Chi/Loại/PTTT | Search -> Xuất Excel -> Nút Lập phiếu */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-0.5">
          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            {/* 🌟 2 TAB CHÍNH: KHOẢN CẦN THU vs PHIẾU THANH TOÁN (ĐÃ BỎ CHỮ THU & ĐỐI SOÁT) */}
            <SegmentedControl
              value={mainMode}
              options={MAIN_MODE_OPTIONS}
              onValueChange={(val: MainMode) => {
                setMainMode(val)
                setCurrentPage(1)
              }}
              className="bg-muted p-0.5"
            />

            {/* 1. Chọn cơ sở */}
            <BranchSelect
              value={filters.branch}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, branch: val }))
                setCurrentPage(1)
              }}
              branches={BRANCH_OPTIONS}
              className="w-[140px] shrink-0"
            />

            {/* 2. Lọc Thu / Chi (Chỉ ở tab Phiếu thanh toán) */}
            {mainMode === 'receipts' && (
              <InlineSelect
                value={filters.transactionType}
                onValueChange={(val: string) => {
                  setFilters((prev) => ({ ...prev, transactionType: val as TransactionType | 'all' }))
                  setCurrentPage(1)
                }}
                options={TRANSACTION_TYPE_FILTER_OPTIONS}
                className="w-[145px] shrink-0"
              />
            )}

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

            {/* 4. Lọc phương thức thanh toán (chỉ hiển thị ở Tab Phiếu thanh toán) */}
            {mainMode === 'receipts' && (
              <InlineSelect
                value={filters.paymentMethod}
                onValueChange={(val: string) => {
                  setFilters((prev) => ({ ...prev, paymentMethod: val as PaymentMethod | 'all' }))
                  setCurrentPage(1)
                }}
                options={METHOD_FILTER_OPTIONS}
                className="w-[150px] shrink-0"
              />
            )}
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

            {/* 6. Nút Xuất Excel */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4" />
              <span>Xuất Excel</span>
            </Button>

            {/* 7. Nút Lập phiếu thanh toán mới */}
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8"
              onClick={() => {
                setPrefillOrderCode('')
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
        {mainMode === 'receipts' && (
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
                  'px-2.5 py-1 rounded-md text-xs transition-colors border select-none',
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
                  'px-2.5 py-1 rounded-md text-xs transition-colors border select-none',
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
                  'px-2.5 py-1 rounded-md text-xs transition-colors border select-none',
                  filters.quickCondition === 'deposit'
                    ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                    : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
                )}
              >
                Cọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bảng dữ liệu: Đổi động theo Tab Chế độ đang chọn */}
      <div className="flex-1 min-h-0 w-full pr-0 pb-0">
        {mainMode === 'receivables' ? (
          <ReceivablesTable
            receivables={filteredReceivables}
            totalItems={filteredReceivables.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onCreateReceiptForItem={handleCreateFromReceivableItem}
          />
        ) : (
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
        )}
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
        onSuccess={handleCreateReceipt}
      />

      {/* Modal Lập Phiếu thanh toán mới */}
      <PaymentReceiptCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateReceipt={handleCreateReceipt}
        initialTransactionType={createInitialType}
      />
    </div>
  )
}

