'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  SubjectSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { BookingSubject, BookingTest } from '@/mocks/bookingTests'
import { BookingTestConditionFilters, type ConditionFilterItem } from './BookingTestConditionFilters'
import { STATUS_CONFIG } from './bookingTestConstants'
import { countStatus, getSubjectLabel } from './bookingTestHelpers'
import type { StatusTileId } from './bookingTestTypes'

interface BookingTestToolbarProps {
  activeSubject: string
  activeSchool: string
  activeStatus: StatusTileId
  searchTerm: string
  schoolOptions: string[]
  baseForStatus: BookingTest[]
  activeFilterCount: number
  isTeacherRole?: boolean
  onSubjectChange: (subject: string) => void
  onSchoolChange: (school: string) => void
  onStatusChange: (status: StatusTileId) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreateBooking?: () => void
}

export function BookingTestToolbar({
  activeSubject,
  activeSchool,
  activeStatus,
  searchTerm,
  schoolOptions,
  baseForStatus,
  activeFilterCount,
  isTeacherRole = false,
  onSubjectChange,
  onSchoolChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
  onCreateBooking,
}: BookingTestToolbarProps) {
  const mainStatusIds: StatusTileId[] = [
    'booked_assessment',
    'completed',
    'failed',
    'cancelled',
  ]

  const conditionStatusIds: StatusTileId[] = [
    'unassigned_teacher',
    'checkin',
    ...(activeSubject === 'math' ? [] : ['interviewed' as StatusTileId]),
    'tested',
  ]

  const mainTiles: StatusTile<StatusTileId>[] = [
    {
      id: 'all',
      label: 'Tất cả',
      count: countStatus(baseForStatus, 'all'),
      semantic: 'neutral',
    },
    ...mainStatusIds.map((id) => {
      const config = STATUS_CONFIG.find((s) => s.id === id)!
      return {
        id,
        label: config.label,
        count: countStatus(baseForStatus, id),
        status: config.status,
      }
    }),
  ]

  const conditionItems: ConditionFilterItem[] = conditionStatusIds.map((id) => {
    const config = STATUS_CONFIG.find((s) => s.id === id)!
    return {
      id,
      label: config.label,
      count: countStatus(baseForStatus, id),
      status: config.status,
    }
  })

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-3 py-3 lg:px-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            options={[
              { value: 'all', label: 'Tất cả môn' },
              { value: 'english', label: 'Tiếng Anh' },
              { value: 'math', label: 'Toán học' }
            ]}
            className="h-9 min-w-36 text-sm"
          />

          <BranchSelect
            value={activeSchool}
            branches={schoolOptions}
            onValueChange={onSchoolChange}
            className="h-9 min-w-40 text-sm"
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
          {!isTeacherRole && (
            onCreateBooking ? (
              <Button size="sm" onClick={onCreateBooking}>
                <Plus className="h-4 w-4" />
                Tạo lịch test
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/app/booking_test/create">
                  <Plus className="h-4 w-4" />
                  Tạo lịch test
                </Link>
              </Button>
            )
          )}
        </div>
      </div>


      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <StatusTiles
          tiles={mainTiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          noOverflowCollapse
        />

        <BookingTestConditionFilters
          items={conditionItems}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>
    </div>
  )
}
