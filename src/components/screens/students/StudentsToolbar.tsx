'use client'

import { useMemo } from 'react'
import { ListFilter } from 'lucide-react'
import { BranchSelect, ExpandableSearch, FilterIconButton, SubjectSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockStudents, getStudents } from '@/mocks/students'
import { resolveStatusSemantic } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import {
  STUDENT_LIFECYCLE_STATUS_CONFIG,
  STUDENT_QUICK_FILTERS,
  type StudentLifecycleStatusId,
  type StudentQuickFilterId,
} from './studentTypes'
import { getStudentLifecycleStatus } from './studentsHelpers'

interface StudentsToolbarProps {
  activeStatus: StudentLifecycleStatusId
  onStatusChange: (status: StudentLifecycleStatusId) => void
  activeQuickFilter: StudentQuickFilterId
  onQuickFilterChange: (quickFilter: StudentQuickFilterId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  activeSubject: string
  onSubjectChange: (subject: string) => void
  onFilterOpen: () => void
  activeFilterCount?: number
}

export function StudentsToolbar({
  activeStatus,
  onStatusChange,
  activeQuickFilter,
  onQuickFilterChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  activeSubject,
  onSubjectChange,
  onFilterOpen,
  activeFilterCount = 0,
}: StudentsToolbarProps) {
  const branches = useMemo(
    () => [...new Set(mockStudents.map((s) => s.branch))].filter(Boolean),
    [],
  )

  const allStudents = useMemo(() => getStudents({}), [])

  const filteredAllCount = useMemo(() => {
    return allStudents.filter((s) => {
      if (branchFilter !== 'all' && s.branch !== branchFilter) return false
      if (activeSubject !== 'all' && s.subject !== activeSubject) return false
      return true
    }).length
  }, [allStudents, branchFilter, activeSubject])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      wait_for_assignment: 0,
      active: 0,
      reserve: 0,
      session_ended: 0,
    }
    for (const s of allStudents) {
      if (branchFilter !== 'all' && s.branch !== branchFilter) continue
      if (activeSubject !== 'all' && s.subject !== activeSubject) continue
      const lifecycle = getStudentLifecycleStatus(s)
      counts[lifecycle] = (counts[lifecycle] ?? 0) + 1
    }
    return counts
  }, [allStudents, branchFilter, activeSubject])

  const tiles: StatusTile<StudentLifecycleStatusId>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: filteredAllCount, semantic: 'neutral' },
      ...STUDENT_LIFECYCLE_STATUS_CONFIG.map((cfg) => ({
        id: cfg.id,
        label: cfg.label,
        count: statusCounts[cfg.id] ?? 0,
        status: cfg.statusKey,
        semantic: resolveStatusSemantic(cfg.statusKey),
      })),
    ],
    [filteredAllCount, statusCounts],
  )

  return (
    <div className="flex shrink-0 flex-col gap-1.5 bg-background px-2 pt-2 pb-1 lg:px-3">
      {/* Top Row: BranchSelect, SubjectSelect (left) and Search, Filter button (right) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BranchSelect
            value={branchFilter}
            branches={branches}
            onValueChange={onBranchChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 min-w-38 text-xs"
          />

          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            allLabel="Tất cả các môn"
            placeholder="Chọn môn học"
            className="h-8 min-w-32 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            label="Tìm kiếm"
            placeholder="Tìm tên, email, SĐT..."
            inputClassName="sm:w-60 text-xs h-8"
          />
          <FilterIconButton
            count={activeFilterCount > 0 ? activeFilterCount : undefined}
            onClick={onFilterOpen}
          />
        </div>
      </div>

      {/* Row 2: Tab lọc trạng thái (trái) & Bộ lọc nhanh (phải) - chữ thường không in đậm */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pt-0.5">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          compact={true}
          noOverflowCollapse={true}
          showDot={false}
          hideDot={true}
          coloredCount={true}
          fontNormal={true}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />

        {/* Quick Result Filters (Right Aligned, chữ thường không in đậm) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            title="Lọc nhanh"
            aria-label="Lọc nhanh"
            className="inline-flex items-center text-muted-foreground shrink-0 mr-0.5 select-none"
          >
            <ListFilter className="h-3.5 w-3.5" />
          </span>
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {STUDENT_QUICK_FILTERS.map((item) => {
              const isActive = activeQuickFilter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onQuickFilterChange(isActive ? 'all' : item.id)}
                  className={cn(
                    'inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0',
                    isActive
                      ? 'border-primary/50 bg-primary/10 text-primary font-normal border-solid'
                      : 'border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
