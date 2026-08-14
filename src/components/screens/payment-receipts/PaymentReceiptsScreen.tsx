'use client'

import { useState, useMemo } from 'react'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  ReceivableItem,
  ReceiptType,
  PaymentMethod,
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
import { PaymentReceiptsTable } from './PaymentReceiptsTable'
import { ReceivablesTable } from './ReceivablesTable'
import { PaymentReceiptDetailDialog } from './PaymentReceiptDetailDialog'
import { PaymentReceiptCreateDialog } from './PaymentReceiptCreateDialog'
import {
  PaymentReceiptsFilterState,
  STATUS_TILES,
  FilterStatus,
} from './paymentReceiptsTypes'

type MainMode = 'receivables' | 'receipts'

const MAIN_MODE_OPTIONS: { value: MainMode; label: string }[] = [
  { value: 'receivables', label: '📋 Khoản cần thu' },
  { value: 'receipts', label: '🧾 Phiếu thu & Đối soát' },
]

const BRANCH_OPTIONS = [
  'Chi nhánh Quận 1',
  'Chi nhánh Cầu Giấy',
  'Chi nhánh Quận 7',
  'Chi nhánh Thảo Điền',
]

const TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả khoản thu' },
  { value: 'deposit', label: 'Cọc giữ chỗ' },
  { value: 'tuition_full', label: 'Thu đủ học phí' },
  { value: 'installment', label: 'Kỳ trả góp' },
  { value: 'event_fee', label: 'Phí sự kiện' },
  { value: 'other', label: 'Khoản thu khác' },
]

const METHOD_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả phương thức' },
  { value: 'qr_transfer', label: 'Chuyển khoản QR' },
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'pos_card', label: 'Cà thẻ POS' },
  { value: 'bank_transfer', label: 'Chuyển khoản NH' },
]

export function PaymentReceiptsScreen() {
  const [mainMode, setMainMode] = useState<MainMode>('receivables')
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockPaymentReceipts)
  const [receivables, setReceivables] = useState<ReceivableItem[]>(mockReceivables)

  const [filters, setFilters] = useState<PaymentReceiptsFilterState>({
    search: '',
    branch: 'all',
    status: 'all',
    receiptType: 'all',
    paymentMethod: 'all',
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)

  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)

  // Pre-fill state for Create Dialog from a ReceivableItem
  const [prefillOrderCode, setPrefillOrderCode] = useState<string>('')

  // Lọc danh sách Phiếu thu
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      if (filters.branch !== 'all' && r.branch !== filters.branch) return false
      if (filters.status !== 'all' && r.status !== filters.status) return false
      if (filters.receiptType !== 'all' && r.receiptType !== filters.receiptType) return false
      if (filters.paymentMethod !== 'all' && r.paymentMethod !== filters.paymentMethod) return false
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
      if (filters.receiptType !== 'all' && r.receiptType !== filters.receiptType) return false
      if (filters.paymentMethod !== 'all' && r.paymentMethod !== filters.paymentMethod) return false
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
      pending_verification: 0,
      refunded: 0,
      cancelled: 0,
    }

    base.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++
      }
    })

    return counts
  }, [receipts, filters.branch, filters.receiptType, filters.paymentMethod, filters.search])

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
    setIsCreateOpen(true)
  }

  const handleViewDetail = (rcpt: PaymentReceipt) => {
    setSelectedReceipt(rcpt)
    setIsDetailOpen(true)
  }

  const handleExportExcel = () => {
    const count = mainMode === 'receivables' ? filteredReceivables.length : filteredReceipts.length
    toast.success(`Đã xuất báo cáo ${mainMode === 'receivables' ? 'khoản cần thu' : 'phiếu thu'} (${count} dòng) thành công!`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2.5 pl-4 pt-3 lg:pl-6 pr-0 pb-0 overflow-hidden">
      {/* Khối Toolbar & Filters bên trên */}
      <div className="pr-4 lg:pr-6 flex flex-col gap-2.5 shrink-0">
        {/* HÀNG 1: 2 TAB CHÍNH NẰM Ở ĐẦU -> Chọn cơ sở -> Lọc Loại/PTTT | Search -> Xuất Excel -> Nút Lập phiếu */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-0.5">
          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            {/* 🌟 2 TAB CHÍNH: KHOẢN CẦN THU vs PHIẾU THU & ĐỐI SOÁT (ĐẶT Ở ĐẦU BỘ LỌC) */}
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

            {/* 2. Lọc loại khoản thu */}
            <InlineSelect
              value={filters.receiptType}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, receiptType: val as ReceiptType | 'all' }))
                setCurrentPage(1)
              }}
              options={TYPE_FILTER_OPTIONS}
              className="w-[140px] shrink-0"
            />

            {/* 3. Lọc phương thức thanh toán (chỉ hiển thị ở Tab Phiếu thu) */}
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
            {/* 4. Ô Tìm kiếm */}
            <ExpandableSearch
              value={filters.search}
              onValueChange={(val: string) => {
                setFilters((prev) => ({ ...prev, search: val }))
                setCurrentPage(1)
              }}
              placeholder="Tìm Mã phiếu, Đơn hàng, Tên..."
            />

            {/* 5. Nút Xuất Excel */}
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

            {/* 6. Nút Lập phiếu thu mới */}
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8"
              onClick={() => {
                setPrefillOrderCode('')
                setIsCreateOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Lập phiếu thu mới</span>
            </Button>
          </div>
        </div>

        {/* HÀNG 2: Tab Lọc Trạng Thái (Status Tiles) - Chỉ hiển thị khi xem Phiếu thu & Đối soát */}
        {mainMode === 'receipts' && (
          <StatusTiles
            tiles={tilesWithCounts}
            activeId={filters.status}
            onSelect={(id) => {
              setFilters((prev) => ({ ...prev, status: id as FilterStatus }))
              setCurrentPage(1)
            }}
          />
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
          />
        )}
      </div>

      {/* Modal Chi tiết Phiếu thu */}
      <PaymentReceiptDetailDialog
        receipt={selectedReceipt}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* Modal Lập Phiếu thu mới */}
      <PaymentReceiptCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateReceipt={handleCreateReceipt}
      />
    </div>
  )
}
