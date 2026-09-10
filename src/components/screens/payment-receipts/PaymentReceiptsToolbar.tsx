'use client'

import { Plus, Download } from 'lucide-react'
import type { PaymentReceipt, TransactionType } from '@/mocks/paymentReceipts'
import { StatusTiles } from '@/components/shared'
import {
  ExpandableSearch,
  BranchSelect,
  FilterIconButton,
  InlineSelect,
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaymentReceiptsSmartcardPopover } from './PaymentReceiptsSmartcardPopover'
import {
  PaymentReceiptsFilterState,
  FilterStatus,
} from './paymentReceiptsTypes'

export const TRANSACTION_TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả loại phiếu' },
  { value: 'receipt', label: '📥 Phiếu thu' },
  { value: 'payment_voucher', label: '📤 Phiếu chi / Hoàn' },
]

interface PaymentReceiptsToolbarProps {
  filters: PaymentReceiptsFilterState
  activeFilterCount: number
  isFilterOpen: boolean
  tilesWithCounts: { id: FilterStatus; label: string; count: number }[]
  baseReceiptsForMetrics: PaymentReceipt[]
  onFilterChange: (updates: Partial<PaymentReceiptsFilterState>) => void
  onToggleFilterPanel: () => void
  onExportExcel: () => void
  onCreateReceipt: () => void
}

export function PaymentReceiptsToolbar({
  filters,
  activeFilterCount,
  isFilterOpen,
  tilesWithCounts,
  baseReceiptsForMetrics,
  onFilterChange,
  onToggleFilterPanel,
  onExportExcel,
  onCreateReceipt,
}: PaymentReceiptsToolbarProps) {
  return (
    <div className="pr-4 lg:pr-6 flex flex-col gap-2 shrink-0">
      {/* HÀNG 1: Tối giản với 2 selection chính: Cơ sở & Loại phiếu Thu/Chi | Search -> Bộ lọc nâng cao -> Thống Kê -> Xuất Excel -> Lập phiếu mới */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 py-0.5">
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* 1. Chọn cơ sở */}
          <BranchSelect
            value={filters.branch}
            onValueChange={(val: string) => onFilterChange({ branch: val })}
            className="w-[155px] shrink-0"
          />

          {/* 2. Lọc Loại phiếu (Thu / Chi) */}
          <InlineSelect
            value={filters.transactionType}
            onValueChange={(val: string) =>
              onFilterChange({ transactionType: val as TransactionType | 'all' })
            }
            options={TRANSACTION_TYPE_FILTER_OPTIONS}
            className="w-[150px] shrink-0"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Ô Tìm kiếm */}
          <ExpandableSearch
            value={filters.search}
            onValueChange={(val: string) => onFilterChange({ search: val })}
            placeholder="Tìm Mã TNX, Đơn hàng, Tên..."
          />

          {/* Nút bật/tắt Bộ lọc nâng cao (dạng ghim) */}
          <FilterIconButton
            count={activeFilterCount}
            onClick={onToggleFilterPanel}
            className={cn(
              'cursor-pointer transition-colors',
              isFilterOpen && 'bg-primary/10 text-primary border-primary/40 font-medium'
            )}
          />

          {/* Smartcard Popover Thống kê dòng tiền */}
          <PaymentReceiptsSmartcardPopover
            receipts={baseReceiptsForMetrics}
            timeRange={filters.timeRange}
            onTimeRangeChange={(nextRange) => onFilterChange({ timeRange: nextRange })}
            customStartDate={filters.customStartDate}
            customEndDate={filters.customEndDate}
            onCustomDateChange={(start, end) =>
              onFilterChange({ customStartDate: start, customEndDate: end })
            }
          />

          {/* Nút Xuất Excel */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8 cursor-pointer"
            onClick={onExportExcel}
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </Button>

          {/* Nút Lập phiếu thanh toán mới */}
          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8 cursor-pointer"
            onClick={onCreateReceipt}
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
          onSelect={(id) => onFilterChange({ status: id as FilterStatus })}
        />

        {/* Cụm Lọc nhanh ở cạnh phải */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs py-0.5">
          <span className="text-xs text-muted-foreground mr-0.5">Lọc nhanh:</span>

          <button
            type="button"
            onClick={() =>
              onFilterChange({
                quickCondition: filters.quickCondition === 'cash' ? 'all' : 'cash',
              })
            }
            className={cn(
              'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
              filters.quickCondition === 'cash'
                ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
            )}
          >
            Tiền mặt
          </button>

          <button
            type="button"
            onClick={() =>
              onFilterChange({
                quickCondition: filters.quickCondition === 'transfer' ? 'all' : 'transfer',
              })
            }
            className={cn(
              'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
              filters.quickCondition === 'transfer'
                ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
            )}
          >
            Chuyển khoản QR
          </button>

          <button
            type="button"
            onClick={() =>
              onFilterChange({
                quickCondition: filters.quickCondition === 'deposit' ? 'all' : 'deposit',
              })
            }
            className={cn(
              'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
              filters.quickCondition === 'deposit'
                ? 'bg-primary/10 text-primary border-primary/40 font-medium'
                : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
            )}
          >
            Cọc giữ chỗ
          </button>

          <button
            type="button"
            onClick={() =>
              onFilterChange({
                quickCondition: filters.quickCondition === 'debt' ? 'all' : 'debt',
              })
            }
            className={cn(
              'px-2.5 py-1 rounded-md text-xs transition-colors border select-none cursor-pointer',
              filters.quickCondition === 'debt'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/40 font-medium'
                : 'bg-background hover:bg-muted/60 text-muted-foreground border-border/80'
            )}
          >
            Đơn còn nợ
          </button>
        </div>
      </div>
    </div>
  )
}
