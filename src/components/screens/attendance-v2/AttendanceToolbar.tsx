'use client'

import { useMemo } from 'react'
import { BranchSelect, ExpandableSearch, FilterIconButton, SYSTEM_BRANCHES } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockAttendanceRecords, getAttendanceRecords, getAttendanceCounts } from '@/mocks/attendanceRecords'
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
  const branches = SYSTEM_BRANCHES

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
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-4 py-3 lg:px-6">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BranchSelect
          value={branchFilter}
          branches={branches}
          onValueChange={onBranchChange}
        />
        <ExpandableSearch
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Tìm lớp, GV, topic, mã session..."
          inputClassName="sm:w-64"
        />
        <FilterIconButton onClick={onFilterOpen} />
      </div>
    </div>
  )
}
