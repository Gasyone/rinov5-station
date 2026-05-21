'use client'

import { useMemo } from 'react'
import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockAttendanceRecords, getAttendanceRecords, getAttendanceCounts, getAttendanceBranches } from '@/mocks/attendanceRecords'
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatusId } from './attendanceTypes'

interface AttendanceToolbarProps {
  activeStatus: AttendanceStatusId
  onStatusChange: (status: AttendanceStatusId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  onFilterOpen: () => void
}

export function AttendanceToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  onFilterOpen,
}: AttendanceToolbarProps) {
  const branches = useMemo(
    () => getAttendanceBranches(mockAttendanceRecords),
    [],
  )

  const allRecords = useMemo(() => getAttendanceRecords({}), [])
  const statusCounts = useMemo(() => getAttendanceCounts(allRecords), [allRecords])

  const tiles: StatusTile<AttendanceStatusId>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: allRecords.length, semantic: 'neutral' },
      ...ATTENDANCE_STATUS_CONFIG.map((cfg) => ({
        id: cfg.id,
        label: cfg.label,
        count: statusCounts[cfg.statusKey] ?? 0,
        status: cfg.statusKey,
      })),
    ],
    [allRecords.length, statusCounts],
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
            placeholder="Tìm lớp, GV, topic, mã session..."
            inputClassName="sm:w-64"
          />
          <FilterIconButton onClick={onFilterOpen} />
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
