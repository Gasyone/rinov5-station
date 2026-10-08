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
import type { BookingTest } from '@/mocks/bookingTests'
import { BookingTestConditionFilters, type ConditionFilterItem } from './BookingTestConditionFilters'
import { STATUS_CONFIG } from './bookingTestConstants'
import { countStatus } from './bookingTestHelpers'
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
    'assessing',
    'completed',
  ]

  const conditionStatusIds: StatusTileId[] = [
    'unassigned_teacher',
    'checkin',
    ...(activeSubject === 'math' ? [] : ['interviewed' as StatusTileId]),
    'tested',
    'failed',
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
    <div className="flex shrink-0 flex-col gap-2 bg-background px-2 py-2.5 lg:px-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BranchSelect
            value={activeSchool}
            branches={schoolOptions}
            onValueChange={onSchoolChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 min-w-38 text-xs"
          />

          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            options={[
              { value: 'all', label: 'Tất cả các môn' },
              { value: 'english', label: 'Tiếng Anh' },
              { value: 'math', label: 'Toán học' }
            ]}
            allLabel="Tất cả các môn"
            placeholder="Chọn môn học"
            className="h-8 min-w-32 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm lịch test"
            placeholder="Tìm tên học viên, số điện thoại, mã lịch..."
            inputClassName="sm:w-60 text-xs h-8"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          {!isTeacherRole && (
            <Button asChild size="sm" className="h-8 gap-1.5 shadow-xs text-xs font-medium cursor-pointer">
              <Link href="/booking-test">
                <Plus className="h-3.5 w-3.5" />
                Tạo lịch test
              </Link>
            </Button>
          )}
        </div>
      </div>


      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <StatusTiles
          tiles={mainTiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          noOverflowCollapse
          compact
          showDot={false}
          hideDot={true}
          coloredCount={true}
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
