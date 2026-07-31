'use client'

import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { getSessionCounts, getBranches, getClassSessions } from '@/mocks/classSessions'
import { useMemo } from 'react'

type SessionStatusId = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'audited' | 'rescheduled' | 'makeup' | 'cancelled'

const STATUS_CONFIG: Array<{ id: SessionStatusId; label: string; statusKey: string }> = [
  { id: 'scheduled', label: 'Đã lên lịch', statusKey: 'scheduled' },
  { id: 'in_progress', label: 'Đang diễn ra', statusKey: 'in_progress' },
  { id: 'completed', label: 'Hoàn thành', statusKey: 'completed' },
  { id: 'audited', label: 'Đã duyệt', statusKey: 'audited' },
  { id: 'rescheduled', label: 'Đã dời lịch', statusKey: 'rescheduled' },
  { id: 'makeup', label: 'Học bù', statusKey: 'makeup' },
  { id: 'cancelled', label: 'Đã hủy', statusKey: 'cancelled' },
]

interface ClassSessionsToolbarProps {
  activeStatus: SessionStatusId
  onStatusChange: (status: SessionStatusId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  onFilterOpen: () => void
}

export function ClassSessionsToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  onFilterOpen,
}: ClassSessionsToolbarProps) {
  const sessions = useMemo(() => getClassSessions({}), [])
  const statusCounts = useMemo(() => getSessionCounts(sessions), [sessions])
  const branches = useMemo(() => getBranches(sessions), [sessions])

  const tiles: StatusTile<SessionStatusId>[] = useMemo(
    () => [
      {
        id: 'all' as SessionStatusId,
        label: 'Tất cả',
        count: sessions.length,
        semantic: 'neutral',
      },
      ...STATUS_CONFIG.map((cfg) => ({
        id: cfg.id,
        label: cfg.label,
        count: statusCounts[cfg.id] ?? 0,
        status: cfg.statusKey,
      })),
    ],
    [sessions.length, statusCounts],
  )

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-3 py-3 lg:px-3">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => {
            if (activeStatus === id && id !== 'all') {
              onStatusChange('all' as SessionStatusId)
            } else {
              onStatusChange(id)
            }
          }}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BranchSelect
          value={branchFilter}
          branches={branches}
          onValueChange={onBranchChange}
          allLabel="Tất cả chi nhánh"
          ariaLabel="Chi nhánh"
        />
        <ExpandableSearch
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Tìm lớp, GV, topic, phòng..."
          inputClassName="sm:w-64"
        />
        <FilterIconButton onClick={onFilterOpen} />
      </div>
    </div>
  )
}
