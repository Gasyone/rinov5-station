'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  SegmentedControl,
} from '@/components/controls'
import type { Organization } from '@/mocks/organizations'
import {
  ORGANIZATION_TYPE_TABS,
  type OrganizationTypeFilter,
} from './organizationsTypes'
import { countOrgsByType } from './organizationsHelpers'

interface OrganizationsToolbarProps {
  organizations: Organization[]
  branches: string[]
  activeBranch: string
  activeType: OrganizationTypeFilter
  searchTerm: string
  onBranchChange: (branch: string) => void
  onTypeChange: (type: OrganizationTypeFilter) => void
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export function OrganizationsToolbar({
  organizations,
  branches,
  activeBranch,
  activeType,
  searchTerm,
  onBranchChange,
  onTypeChange,
  onSearchChange,
  onCreate,
}: OrganizationsToolbarProps) {
  const typeOptions = ORGANIZATION_TYPE_TABS.map((tab) => ({
    value: tab.id,
    label: `${tab.label} (${countOrgsByType(organizations, tab.id)})`,
  }))

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-background px-3 py-2.5 border-b border-border/60">
      {/* Phân loại Hộ gia đình vs Tổ chức/Doanh nghiệp + Lọc Cơ sở */}
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={typeOptions}
          value={activeType}
          onValueChange={(val) => onTypeChange(val as OrganizationTypeFilter)}
        />

        <BranchSelect
          branches={branches}
          value={activeBranch}
          onValueChange={onBranchChange}
          placeholder="Tất cả cơ sở"
        />
      </div>

      {/* Tìm kiếm & Nút thêm mới */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm kiếm tổ chức & gia đình"
          placeholder="Tìm tên, mã, MST, người đại diện, SĐT, địa chỉ..."
          inputClassName="sm:w-64 text-xs h-8"
        />

        <Button
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs font-medium shadow-xs cursor-pointer"
          onClick={onCreate}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm đối tượng</span>
        </Button>
      </div>
    </div>
  )
}
