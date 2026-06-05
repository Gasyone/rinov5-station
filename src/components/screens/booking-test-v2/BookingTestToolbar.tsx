'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  SubjectSegmentedControl,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { BookingSubject, BookingTest } from '@/mocks/bookingTests'
import { BOOKING_SUBJECTS, STATUS_CONFIG } from './bookingTestConstants'
import { countStatus, getSubjectLabel } from './bookingTestHelpers'
import type { StatusTileId } from './bookingTestTypes'

interface BookingTestToolbarProps {
  activeSubject: BookingSubject
  activeSchool: string
  activeStatus: StatusTileId
  searchTerm: string
  schoolOptions: string[]
  baseForStatus: BookingTest[]
  activeFilterCount: number
  isTeacherRole: boolean
  onSubjectChange: (subject: BookingSubject) => void
  onSchoolChange: (school: string) => void
  onStatusChange: (status: StatusTileId) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreateBooking: () => void
}

export function BookingTestToolbar({
  activeSubject,
  activeSchool,
  activeStatus,
  searchTerm,
  schoolOptions,
  baseForStatus,
  activeFilterCount,
  isTeacherRole,
  onSubjectChange,
  onSchoolChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
  onCreateBooking,
}: BookingTestToolbarProps) {
  const tiles: StatusTile<StatusTileId>[] = [
    {
      id: 'all',
      label: 'Tất cả',
      count: countStatus(baseForStatus, 'all'),
      semantic: 'neutral',
    },
    ...STATUS_CONFIG.filter((status) => activeSubject !== 'math' || status.id !== 'interviewed').map((status) => ({
      id: status.id as StatusTileId,
      label: status.label,
      count: countStatus(baseForStatus, status.id),
      status: status.status,
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-border/40 bg-background px-4 py-3 lg:px-6">
      {/* Row 1: Status Tiles */}
      <div className="w-full overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      {/* Row 2: Toolbar Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Subject & Branch Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <SubjectSegmentedControl
            value={activeSubject}
            subjects={BOOKING_SUBJECTS}
            getLabel={getSubjectLabel}
            onValueChange={onSubjectChange}
          />
          <BranchSelect
            value={activeSchool}
            branches={schoolOptions}
            onValueChange={onSchoolChange}
            className="h-9 min-w-40 text-sm"
          />
        </div>

        {/* Right side: Search, Filters & Action Button */}
        <div className="flex items-center justify-end gap-2 self-stretch sm:self-auto">
          <div className="flex-1 sm:flex-initial">
            <ExpandableSearch
              value={searchTerm}
              onValueChange={onSearchChange}
              label="Tìm lịch test"
              placeholder="Tìm tên học viên, số điện thoại, mã lịch..."
              inputClassName="w-full sm:w-64"
            />
          </div>
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          {!isTeacherRole ? (
            <Button size="sm" onClick={onCreateBooking}>
              <Plus className="h-4 w-4 mr-1.5" />
              Tạo lịch test
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
