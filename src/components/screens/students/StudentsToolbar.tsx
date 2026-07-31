'use client'

import { useMemo } from 'react'
import { BranchSelect, ExpandableSearch, FilterIconButton, SubjectSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockStudents, getStudents } from '@/mocks/students'
import { STUDENT_STATUS_CONFIG, type StudentStatusId } from './studentTypes'

interface StudentsToolbarProps {
  activeStatus: StudentStatusId
  onStatusChange: (status: StudentStatusId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  activeSubject: string
  onSubjectChange: (subject: string) => void
  onFilterOpen: () => void
}

export function StudentsToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  activeSubject,
  onSubjectChange,
  onFilterOpen,
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
    const counts: Record<string, number> = {}
    for (const s of allStudents) {
      if (branchFilter !== 'all' && s.branch !== branchFilter) continue
      if (activeSubject !== 'all' && s.subject !== activeSubject) continue
      counts[s.status] = (counts[s.status] ?? 0) + 1
    }
    return counts
  }, [allStudents, branchFilter, activeSubject])

  const tiles: StatusTile<StudentStatusId>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: filteredAllCount, semantic: 'neutral' },
      ...STUDENT_STATUS_CONFIG.map((cfg) => ({
        id: cfg.id,
        label: cfg.label,
        count: statusCounts[cfg.statusKey] ?? 0,
        status: cfg.statusKey,
      })),
    ],
    [filteredAllCount, statusCounts],
  )

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-3 py-3 lg:px-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            className="h-9 min-w-36 text-sm"
          />
          <BranchSelect
            value={branchFilter}
            branches={branches}
            onValueChange={onBranchChange}
            allLabel="Tất cả trường"
            ariaLabel="Trường"
            className="h-9 min-w-40 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm tên, email, SĐT..."
            inputClassName="sm:w-64"
          />
          <FilterIconButton onClick={onFilterOpen} />
        </div>
      </div>

      <div className="overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>
    </div>
  )
}

