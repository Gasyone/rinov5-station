'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
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
  onFilterOpen: () => void
  onCreate: () => void
}

export function StudentsToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  onFilterOpen,
  onCreate,
}: StudentsToolbarProps) {
  const branches = useMemo(
    () => [...new Set(mockStudents.map((s) => s.branch))].filter(Boolean),
    [],
  )

  const allStudents = useMemo(() => getStudents({}), [])
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of allStudents) {
      counts[s.status] = (counts[s.status] ?? 0) + 1
    }
    return counts
  }, [allStudents])

  const tiles: StatusTile<StudentStatusId>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: allStudents.length, semantic: 'neutral' },
      ...STUDENT_STATUS_CONFIG.map((cfg) => ({
        id: cfg.id,
        label: cfg.label,
        count: statusCounts[cfg.statusKey] ?? 0,
        status: cfg.statusKey,
      })),
    ],
    [allStudents.length, statusCounts],
  )

  return (
    <div className="flex flex-col gap-2 px-4 py-3 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BranchSelect
            value={branchFilter}
            branches={branches}
            onValueChange={onBranchChange}
            allLabel="Tất cả chi nhánh"
            ariaLabel="Chi nhánh"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm tên, email, SĐT..."
            inputClassName="sm:w-64"
          />
          <FilterIconButton onClick={onFilterOpen} />
          <Button size="sm" onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Thêm học viên
          </Button>
        </div>
      </div>

      <StatusTiles
        tiles={tiles}
        activeId={activeStatus}
        onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
      />
    </div>
  )
}
