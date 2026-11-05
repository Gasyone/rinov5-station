'use client'

import Link from 'next/link'
import { Plus, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  ToolbarSelect,
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
  selectedAssignee?: 'all' | 'my'
  onAssigneeChange?: (val: 'all' | 'my') => void
  myBookingsCount?: number
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
  selectedAssignee = 'all',
  onAssigneeChange,
  myBookingsCount,
  onSubjectChange,
  onSchoolChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
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
    <div className="flex shrink-0 flex-col gap-1.5 bg-background px-2.5 pt-2 pb-1 lg:px-3">
      {/* Row 1: Selectors (Branch, Subject), Search + Filter + Create Action */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {/* 1. Branch Selector */}
          <BranchSelect
            value={activeSchool}
            branches={schoolOptions}
            onValueChange={onSchoolChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[125px] sm:min-w-[130px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden 2xl:block shrink-0" />

          {/* 2. Subject Selector */}
          <ToolbarSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            options={[
              { value: 'all', label: 'Tất cả các môn', selectedLabel: 'Tất cả các môn' },
              { value: 'english', label: 'Tiếng Anh' },
              { value: 'math', label: 'Toán học' },
            ]}
            className="h-8 text-xs min-w-[110px] sm:min-w-[115px]"
            ariaLabel="Chọn môn học"
            placeholder="Môn học"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm kiếm..."
            inputClassName="w-32 sm:w-36 lg:w-44 xl:w-52 2xl:w-60 text-xs h-8"
          />
          <FilterIconButton
            count={activeFilterCount > 0 ? activeFilterCount : undefined}
            onClick={onOpenFilters}
          />
          {!isTeacherRole && (
            <Button
              asChild
              size="sm"
              className="h-8 text-xs flex items-center gap-1.5 shadow-xs font-medium cursor-pointer px-2 sm:px-2.5"
            >
              <Link href="/booking-test">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Tạo lịch test</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: "Lịch của tôi" + StatusTiles (Left) + Condition Filters (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {onAssigneeChange && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (selectedAssignee === 'my') {
                    onAssigneeChange('all')
                  } else {
                    onAssigneeChange('my')
                  }
                }}
                className={cn(
                  'h-7 px-2.5 rounded-full text-xs font-normal border inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0',
                  selectedAssignee === 'my'
                    ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs'
                    : 'bg-background border-border text-foreground/80 hover:bg-accent hover:text-foreground'
                )}
                title="Lọc nhanh các lịch test do bạn phụ trách"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Lịch của tôi</span>
                {myBookingsCount !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-xs leading-none',
                      selectedAssignee === 'my'
                        ? 'bg-primary-foreground text-primary font-semibold'
                        : 'bg-muted text-muted-foreground font-normal'
                    )}
                  >
                    {myBookingsCount}
                  </span>
                )}
              </button>

              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            </>
          )}

          <StatusTiles
            tiles={mainTiles}
            activeId={activeStatus}
            onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
            noOverflowCollapse={true}
            compact={true}
            showDot={false}
            hideDot={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        <BookingTestConditionFilters
          items={conditionItems}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>
    </div>
  )
}
