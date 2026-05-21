'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  SegmentedControl,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { BookingSubject, BookingTest } from '@/mocks/bookingTests'
import { STATUS_CONFIG } from './bookingTestConstants'
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
    ...STATUS_CONFIG.map((status) => ({
      id: status.id as StatusTileId,
      label: status.label,
      count: countStatus(baseForStatus, status.id),
      status: status.status,
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={activeSubject}
            options={(['english', 'math'] as BookingSubject[]).map((subject) => ({
              value: subject,
              label: getSubjectLabel(subject),
            }))}
            onValueChange={onSubjectChange}
          />

          <BranchSelect
            value={activeSchool}
            branches={schoolOptions}
            allLabel="Tất cả cơ sở"
            ariaLabel="Cơ sở"
            onValueChange={onSchoolChange}
            className="h-9 min-w-44 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm lịch test"
            placeholder="Tìm tên học viên, số điện thoại, mã lịch..."
            inputClassName="sm:w-64"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          {!isTeacherRole ? (
            <Button size="sm" onClick={onCreateBooking}>
              <Plus className="h-4 w-4" />
              Tạo lịch test
            </Button>
          ) : null}
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
