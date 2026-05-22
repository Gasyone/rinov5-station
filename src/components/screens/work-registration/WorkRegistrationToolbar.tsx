'use client'

import { AlertTriangle, ChevronLeft, ChevronRight, Settings2 } from 'lucide-react'
import {
  ToolbarSelect,
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
  subjectFilter: string
  search: string
  filterCount: number
  onTabChange: (tab: WorkRegistrationTab) => void
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onSearchChange: (search: string) => void
  onOpenFilters: () => void
  onOpenPrioritySetup: () => void
  onOpenWarnings: () => void
  staffLayout: WorkRegistrationStaffLayout
  onStaffLayoutChange: (layout: WorkRegistrationStaffLayout) => void
}

export function WorkRegistrationToolbar({
  activeTab,
  title,
  branches,
  activeBranch,
  subjectFilter,
  search,
  filterCount,
  onTabChange,
  onBranchChange,
  onSubjectChange,
  onSearchChange,
  onOpenFilters,
  onOpenPrioritySetup,
  onOpenWarnings,
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab !== 'center' ? (
            <ToolbarSelect
              value={activeBranch}
              options={branches.map((branch) => ({ value: branch, label: branch }))}
              onValueChange={onBranchChange}
              ariaLabel="Trung tâm"
              className="h-8 min-w-48"
            />
          ) : null}
          {activeTab === 'staff' ? (
            <ToolbarSelect
              value={subjectFilter}
              options={[
                { value: 'all', label: 'Tất cả môn' },
                { value: 'IELTS', label: 'IELTS' },
                { value: 'Giao tiếp', label: 'Giao tiếp' },
                { value: 'TOEIC', label: 'TOEIC' },
                { value: 'Kids', label: 'Kids' },
                { value: 'Ngữ pháp', label: 'Ngữ pháp' },
              ]}
              onValueChange={onSubjectChange}
              ariaLabel="Môn học"
              className="h-8 min-w-32"
            />
          ) : null}
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
