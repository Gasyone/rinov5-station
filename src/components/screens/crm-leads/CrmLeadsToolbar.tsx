'use client'
import { useMemo } from 'react'
import { Plus, Layers, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Lead } from '@/mocks/crmLeads'
import type { DataPoolConfig } from '@/components/screens/lead-lifecycle-config/leadLifecycleTypes'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  ToolbarSelect,
} from '@/components/controls'
import {
  SOURCE_OPTIONS,
  ASSIGNMENT_OPTIONS,
  FOLLOW_UP_OPTIONS,
  type StatusTileMode,
} from './crmLeadsTypes'
import { CrmLeadsSmartcardPopover } from './CrmLeadsSmartcardPopover'

interface CrmLeadsToolbarProps {
  leads: Lead[]
  viewScope: 'my' | 'all'
  statusTileMode?: StatusTileMode
  onToggleTileMode?: () => void
  pools?: DataPoolConfig[]
  pool?: string
  onPoolChange?: (val: string) => void
  branch?: string
  onBranchChange?: (val: string) => void
  source: string
  onSourceChange: (val: string) => void
  assignment: string
  onAssignmentChange: (val: string) => void
  followUp: string
  onFollowUpChange: (val: string) => void
  search: string
  onSearchChange: (val: string) => void
  activeFilterCount?: number
  onOpenFilters?: () => void
  onCreateClick?: () => void
}

export function CrmLeadsToolbar({
  leads,
  viewScope,
  statusTileMode = 'main',
  onToggleTileMode,
  pools = [],
  pool = 'all',
  onPoolChange,
  branch = 'all',
  onBranchChange,
  source,
  onSourceChange,
  assignment,
  onAssignmentChange,
  followUp,
  onFollowUpChange,
  search,
  onSearchChange,
  activeFilterCount = 0,
  onOpenFilters,
  onCreateClick,
}: CrmLeadsToolbarProps) {
  const dynamicPoolOptions = useMemo(() => {
    const baseOptions = [
      { value: 'all', label: 'Tất cả kho' },
      { value: 'pool-t', label: 'Kho T (Telesales)' },
      { value: 'pool-m', label: 'Kho M (Marketing)' },
      { value: 'pool-c', label: 'Kho CC (CSKH / Tái phí)' },
      { value: 'pool-g', label: 'Kho G (Giới thiệu)' },
    ]
    if (pools && pools.length > 0) {
      const activePools = pools
        .filter((p) => p.isActive !== false)
        .map((p) => ({
          value: p.id,
          label: `${p.name} (${p.code})`,
        }))
      return [{ value: 'all', label: 'Tất cả kho' }, ...activePools]
    }
    return baseOptions
  }, [pools])

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      {/* Bộ lọc bên trái: Nút đổi Mode, Cơ sở, Kho Dữ liệu, Nguồn Lead & Bộ lọc ngữ cảnh */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Nút chuyển đổi Mode Cấp 1 (viên thuốc) vs All (dạng bảng) đặt trước Cơ sở */}
        {onToggleTileMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleTileMode}
            className={cn(
              "h-8 gap-1.5 text-xs font-medium cursor-pointer transition-colors px-2.5",
              statusTileMode === 'all'
                ? "bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                : "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
            )}
            title={
              statusTileMode === 'main'
                ? "Đang xem: Cấp 1 (Tab viên thuốc). Bấm để chuyển sang All"
                : "Đang xem: All. Bấm để chuyển sang Cấp 1 (Tab viên thuốc)"
            }
          >
            {statusTileMode === 'main' ? (
              <>
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Cấp 1</span>
              </>
            ) : (
              <>
                <Table className="w-3.5 h-3.5 text-purple-600" />
                <span>All</span>
              </>
            )}
          </Button>
        )}

        {/* Chọn cơ sở */}
        {onBranchChange && (
          <BranchSelect
            value={branch}
            onValueChange={onBranchChange}
            className="h-8 min-w-36 text-xs"
          />
        )}

        {/* Kho Dữ Liệu (Pool Selector: Kho T, Kho M, Kho CC, Kho G) */}
        {onPoolChange && (
          <ToolbarSelect
            value={pool}
            onValueChange={onPoolChange}
            options={dynamicPoolOptions}
            className="h-8 min-w-36 text-xs font-medium"
          />
        )}

        {/* Nguồn Lead (Facebook Ads, Hotline, Sự kiện, Referral...) */}
        <ToolbarSelect
          value={source}
          onValueChange={onSourceChange}
          options={SOURCE_OPTIONS}
          className="h-8 min-w-36 text-xs"
        />

        {/* Quản lý Lead (all) -> Hiện lọc Phân bổ */}
        {viewScope === 'all' && (
          <ToolbarSelect
            value={assignment}
            onValueChange={onAssignmentChange}
            options={ASSIGNMENT_OPTIONS}
            className="h-8 min-w-36 text-xs"
          />
        )}

        {/* Lead của tôi (my) -> Hiện lọc Lịch chăm sóc/Nhắc việc cho Sale */}
        {viewScope === 'my' && (
          <ToolbarSelect
            value={followUp}
            onValueChange={onFollowUpChange}
            options={FOLLOW_UP_OPTIONS}
            className="h-8 min-w-36 text-xs"
          />
        )}
      </div>

      {/* Tìm kiếm, Filter nâng cao, Nút tạo mới & Smartcard Popover đặt cạnh nhau bên phải */}
      <div className="flex flex-wrap items-center gap-2">
        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          placeholder="Tìm theo Phụ huynh, SĐT, Tên con..."
          inputClassName="sm:w-56"
        />

        {onOpenFilters && (
          <FilterIconButton
            count={activeFilterCount}
            onClick={onOpenFilters}
            label="Bộ lọc nâng cao"
          />
        )}

        <Button
          size="sm"
          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer text-xs"
          onClick={onCreateClick}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          <span>Tạo mới Lead</span>
        </Button>

        {/* Smartcard Popover hiển thị chỉ số phễu & hiệu suất đặt ở ngoài cùng bên phải */}
        <CrmLeadsSmartcardPopover leads={leads} viewScope={viewScope} />
      </div>
    </div>
  )
}

