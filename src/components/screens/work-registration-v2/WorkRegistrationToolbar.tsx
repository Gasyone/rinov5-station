'use client'

import { AlertTriangle } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  SegmentedControl,
  SubjectSelect,
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import {
  WORK_TAB_OPTIONS,
  WORK_STAFF_LAYOUT_OPTIONS,
  type WorkRegistrationTab,
  type WorkRegistrationStaffLayout,
} from './workRegistrationTypes'

interface WorkRegistrationToolbarProps {
  activeTab: WorkRegistrationTab
  branches: string[]
  subjects: string[]
  activeBranch: string
  subjectFilter: string
  search: string
  onTabChange: (tab: WorkRegistrationTab) => void
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onSearchChange: (search: string) => void
  onOpenWarnings: () => void
  staffLayout: WorkRegistrationStaffLayout
  onStaffLayoutChange: (layout: WorkRegistrationStaffLayout) => void
}

export function WorkRegistrationToolbar({
  activeTab,
  branches,
  subjects,
  activeBranch,
  subjectFilter,
  search,
  onTabChange,
  onBranchChange,
  onSubjectChange,
  onSearchChange,
  onOpenWarnings,
  staffLayout,
  onStaffLayoutChange,
}: WorkRegistrationToolbarProps) {
  const showSearch = activeTab !== 'mine'

  return (
    <div className="flex flex-col gap-3 px-4 py-3 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SegmentedControl
            value={activeTab}
            options={WORK_TAB_OPTIONS}
            onValueChange={onTabChange}
          />
          {activeTab === 'staff' ? (
            <SegmentedControl
              value={staffLayout}
              options={WORK_STAFF_LAYOUT_OPTIONS}
              onValueChange={onStaffLayoutChange}
            />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'staff' ? (
            <BranchSelect
              value={activeBranch}
              branches={branches}
              includeAll={false}
              onValueChange={onBranchChange}
              className="h-8 w-full min-w-0 sm:w-auto sm:min-w-48"
            />
          ) : null}
          {activeTab === 'staff' ? (
            <SubjectSelect
              value={subjectFilter}
              subjects={subjects}
              onValueChange={onSubjectChange}
              ariaLabel="Môn học"
              className="h-8 w-full min-w-0 sm:w-auto sm:min-w-32"
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenWarnings}
            className="h-8 shrink-0"
          >
            <AlertTriangle className="h-4 w-4" />
            Cảnh báo
          </Button>
        </div>
      </div>
    </div>
  )
}
