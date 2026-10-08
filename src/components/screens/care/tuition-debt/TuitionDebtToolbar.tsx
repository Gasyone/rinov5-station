'use client'

import {
  ExpandableSearch,
  FilterIconButton,
  ToolbarSelect,
  BranchSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { TuitionDebtItem } from './tuitionDebtTypes'

interface TuitionDebtToolbarProps {
  debts: TuitionDebtItem[]
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilterCount: number
  onOpenFilter: () => void
  selectedBranch: string
  onBranchChange: (branch: string) => void
  branchOptions: string[]
  selectedSubject: string
  onSubjectChange: (subject: string) => void
  selectedPaymentPlan: string
  onPaymentPlanChange: (plan: string) => void
  debtStatusTab: string
  onDebtStatusTabChange: (tab: string) => void
  debtStatusTiles: StatusTile<string>[]
}

export function TuitionDebtToolbar({
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onOpenFilter,
  selectedBranch,
  onBranchChange,
  branchOptions,
  selectedSubject,
  onSubjectChange,
  selectedPaymentPlan,
  onPaymentPlanChange,
  debtStatusTab,
  onDebtStatusTabChange,
  debtStatusTiles,
}: TuitionDebtToolbarProps) {
  return (
    <div className="flex flex-col gap-0 bg-background px-3 py-3 lg:px-3">
      {/* Row 1: Branch, Subject, Payment Plan, Search + Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2.5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Branch Selector */}
          <BranchSelect
            value={selectedBranch}
            onValueChange={onBranchChange}
            branches={branchOptions}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[160px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* Subject Selector */}
          <ToolbarSelect
            value={selectedSubject}
            options={[
              { value: 'all', label: 'Tất cả các môn', selectedLabel: 'Tất cả các môn' },
              { value: 'Tiếng Anh', label: 'Tiếng Anh' },
              { value: 'Toán tư duy', label: 'Toán tư duy' },
            ]}
            onValueChange={onSubjectChange}
            className="h-8 text-xs min-w-[140px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* Payment Plan Selector */}
          <ToolbarSelect
            value={selectedPaymentPlan}
            options={[
              { value: 'all', label: 'Tất cả hình thức' },
              { value: 'nhieu_lan', label: 'Thanh toán nhiều lần' },
              { value: 'coc_hoc_luon', label: 'Cọc cho học luôn' },
              { value: 'tra_gop_bank', label: 'Trả góp qua Ngân hàng' },
              { value: 'dong_le', label: 'Đóng lẻ từng đợt' },
            ]}
            onValueChange={onPaymentPlanChange}
            className="h-8 text-xs min-w-[170px]"
          />
        </div>

        {/* Right side: Search & Advanced Filter Button */}
        <div className="flex items-center gap-2 shrink-0">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm theo tên học viên, SĐT, mã đơn..."
          />

          <FilterIconButton
            count={activeFilterCount > 0 ? activeFilterCount : undefined}
            onClick={onOpenFilter}
          />
        </div>
      </div>

      {/* Row 2: Status Tiles */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={debtStatusTiles}
          activeId={debtStatusTab}
          onSelect={(id) =>
            onDebtStatusTabChange(debtStatusTab === id && id !== 'all' ? 'all' : id)
          }
          noOverflowCollapse={true}
          className="flex-nowrap"
          showDot={false}
          hideDot={true}
          coloredCount={true}
        />
      </div>
    </div>
  )
}
