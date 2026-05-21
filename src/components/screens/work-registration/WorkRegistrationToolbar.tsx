'use client'

import { AlertTriangle, ChevronLeft, ChevronRight, Settings2 } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  WORK_TAB_OPTIONS,
  WORK_STAFF_LAYOUT_OPTIONS,
  type WorkRegistrationTab,
  type WorkRegistrationStaffLayout,
} from './workRegistrationTypes'

interface WorkRegistrationToolbarProps {
  activeTab: WorkRegistrationTab
  title: string
  branches: string[]
  activeBranch: string
  search: string
  filterCount: number
  onTabChange: (tab: WorkRegistrationTab) => void
  onBranchChange: (branch: string) => void
  onSearchChange: (search: string) => void
  onOpenFilters: () => void
  onOpenPrioritySetup: () => void
  onOpenWarnings: () => void
  onToday: () => void
  onNavigate: (direction: number) => void
  staffLayout: WorkRegistrationStaffLayout
  onStaffLayoutChange: (layout: WorkRegistrationStaffLayout) => void
}

export function WorkRegistrationToolbar({
  activeTab,
  title,
  branches,
  activeBranch,
  search,
  filterCount,
  onTabChange,
  onBranchChange,
  onSearchChange,
  onOpenFilters,
  onOpenPrioritySetup,
  onOpenWarnings,
  onToday,
  onNavigate,
  staffLayout,
  onStaffLayoutChange,
}: WorkRegistrationToolbarProps) {
  const showSearch = activeTab !== 'mine'

  return (
    <div className="flex flex-col gap-3 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <SegmentedControl
            value={activeTab}
            options={WORK_TAB_OPTIONS}
            onValueChange={onTabChange}
          />
          <Button type="button" variant="ghost" size="sm" onClick={onToday}>
            Hôm nay
          </Button>
          <div className="flex items-center gap-0.5">
            <IconActionButton
              icon={ChevronLeft}
              label="Tuần trước"
              onClick={() => onNavigate(-1)}
              className="size-7"
            />
            <IconActionButton
              icon={ChevronRight}
              label="Tuần sau"
              onClick={() => onNavigate(1)}
              className="size-7"
            />
          </div>
          <h2 className="min-w-0 truncate text-sm font-semibold">{title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BranchSelect
            value={activeBranch}
            branches={branches}
            onValueChange={onBranchChange}
            allLabel="Tất cả trung tâm"
            ariaLabel="Trung tâm"
            className="h-8 min-w-48"
          />
          {showSearch ? (
            <ExpandableSearch
              value={search}
              onValueChange={onSearchChange}
              label="Tìm lịch nhân viên"
              placeholder="Tìm nhân viên..."
              inputClassName="sm:w-64"
            />
          ) : null}
          {activeTab === 'staff' ? (
            <SegmentedControl
              value={staffLayout}
              options={WORK_STAFF_LAYOUT_OPTIONS}
              onValueChange={onStaffLayoutChange}
            />
          ) : null}
          {activeTab === 'staff' ? (
            <FilterIconButton
              count={filterCount}
              label="Lọc đăng ký nhân viên"
              onClick={onOpenFilters}
            />
          ) : null}
          <IconActionButton
            icon={Settings2}
            label="Thiết lập giờ vàng"
            onClick={onOpenPrioritySetup}
            className="size-8"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenWarnings}
            className={cn('h-8')}
          >
            <AlertTriangle className="h-4 w-4" />
            Cảnh báo
          </Button>
        </div>
      </div>
    </div>
  )
}
