'use client'

import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockSessionFeedback, getFeedbackCounts } from '@/mocks/sessionFeedback'
import { useMemo } from 'react'
import type { FeedbackStatusId } from './sessionFeedbackTypes'

interface SessionFeedbackToolbarProps {
  activeStatus: FeedbackStatusId
  onStatusChange: (status: FeedbackStatusId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  onFilterOpen: () => void
}

export function SessionFeedbackToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  onFilterOpen,
}: SessionFeedbackToolbarProps) {
  const statusCounts = useMemo(() => getFeedbackCounts(mockSessionFeedback), [])

  const branches = useMemo(
    () => [...new Set(mockSessionFeedback.map((f) => f.branch))].filter(Boolean),
    []
  )

  const tiles: StatusTile<FeedbackStatusId>[] = useMemo(
    () => [
      {
        id: 'all' as FeedbackStatusId,
        label: 'Tất cả',
        count: mockSessionFeedback.length,
        semantic: 'neutral',
      },
      {
        id: 'completed' as FeedbackStatusId,
        label: 'Đã nhận xét',
        count: statusCounts.completed ?? 0,
        status: 'feedback_completed',
      },
      {
        id: 'pending' as FeedbackStatusId,
        label: 'Chưa nhận xét',
        count: statusCounts.pending ?? 0,
        status: 'feedback_pending',
      },
      {
        id: 'needs_follow_up' as FeedbackStatusId,
        label: 'Cần theo dõi',
        count: statusCounts.needs_follow_up ?? 0,
        status: 'feedback_needs_follow_up',
      },
    ],
    [statusCounts],
  )

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-4 py-3 lg:px-6">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => {
            if (activeStatus === id && id !== 'all') {
              onStatusChange('all')
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
        />
        <ExpandableSearch
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Tìm HV, lớp, GV, mã buổi..."
          inputClassName="sm:w-56"
        />
        <FilterIconButton onClick={onFilterOpen} />
      </div>
    </div>
  )
}