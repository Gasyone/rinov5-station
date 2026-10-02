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
  type WorkRegistrationTab,
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
}: WorkRegistrationToolbarProps) {
  const showSearch = activeTab === 'staff' || activeTab === 'roster'

  return (
    <div className="flex flex-col gap-2 px-3 py-2 lg:px-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SegmentedControl
            value={activeTab}
            options={WORK_TAB_OPTIONS}
            onValueChange={onTabChange}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'staff' || activeTab === 'roster' ? (
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
              label={activeTab === 'roster' ? 'Tìm người dùng, giáo viên' : 'Tìm lịch nhân viên'}
              placeholder={activeTab === 'roster' ? 'Tìm nhân sự, giáo viên...' : 'Tìm nhân viên...'}
              inputClassName="sm:w-64"
            />
          ) : null}
          {activeTab === 'mine' ? (
            <div className="flex items-center gap-3">
              {/* CHÚ THÍCH PHÂN ĐỊNH LỊCH ĐƯỢC ĐƯA LÊN CẠNH BUTTON CẢNH BÁO */}
              <div className="hidden sm:flex items-center gap-3 text-xs mr-1 bg-muted/40 px-2.5 py-1 rounded-md border border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-0.5">Phân định:</span>

                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-xs border-2 border-dashed border-emerald-500 bg-emerald-100 dark:bg-emerald-950/80" />
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Chờ lưu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-xs border border-indigo-500 bg-indigo-100 dark:bg-indigo-950/80 border-l-[3px] border-l-indigo-600" />
                  <span className="text-xs text-indigo-950 dark:text-indigo-200 font-semibold">Lớp dạy</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenWarnings}
                className="h-8 shrink-0 cursor-pointer font-semibold gap-1.5 border-amber-500/60 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 hover:border-amber-600 hover:text-amber-900 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60 transition-colors shadow-2xs"
              >
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Cảnh báo
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
