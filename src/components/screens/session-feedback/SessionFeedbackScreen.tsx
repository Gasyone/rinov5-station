'use client'

import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { mockSessionFeedback, getSessionFeedback } from '@/mocks/sessionFeedback'
import { SessionFeedbackToolbar } from './SessionFeedbackToolbar'
import { SessionFeedbackTable } from './SessionFeedbackTable'
import { FeedbackFormDialog } from './FeedbackFormDialog'
import { groupFeedbackBySession } from './sessionFeedbackHelpers'
import type { FeedbackStatusId } from './sessionFeedbackTypes'
import type { SessionFeedback } from '@/mocks/sessionFeedback'

export function SessionFeedbackScreen() {
  const [activeStatus, setActiveStatus] = useState<FeedbackStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<Record<string, Set<string>>>({})
  const [selectedFeedback, setSelectedFeedback] = useState<SessionFeedback | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filteredFeedback = useMemo(() => {
    const classFilters = filterState.class?.size ? [...filterState.class] : undefined
    const teacherFilters = filterState.teacher?.size ? [...filterState.teacher] : undefined
    const homeworkFilters = filterState.homework?.size ? [...filterState.homework] : undefined
    const attendanceFilters = filterState.attendance?.size ? [...filterState.attendance] : undefined

    const results = getSessionFeedback({
      search: searchQuery,
      branch: branchFilter === 'all' || !branchFilter ? undefined : branchFilter,
      status: activeStatus === 'all' ? undefined : activeStatus,
    })

    return results.filter((f) => {
      if (classFilters?.length && !classFilters.includes(f.className)) return false
      if (teacherFilters?.length && !teacherFilters.includes(f.teacher)) return false
      if (homeworkFilters?.length && !homeworkFilters.includes(f.homeworkStatus)) return false
      if (attendanceFilters?.length && !attendanceFilters.includes(f.attendance)) return false
      return true
    })
  }, [searchQuery, activeStatus, branchFilter, filterState])

  const groups = useMemo(() => groupFeedbackBySession(filteredFeedback), [filteredFeedback])

  const filterGroups = useMemo<FilterGroupConfig[]>(() => {
    const allClasses = [...new Set(mockSessionFeedback.map((f) => f.className))].sort()
    const allTeachers = [...new Set(mockSessionFeedback.map((f) => f.teacher))].sort()
    return [
      createFilterGroup({
        id: 'class',
        options: allClasses,
        selectedValues: filterState.class,
        getOptionCount: (className) => mockSessionFeedback.filter((feedback) => feedback.className === className).length,
      }),
      createFilterGroup({
        id: 'teacher',
        options: allTeachers,
        selectedValues: filterState.teacher,
        getOptionCount: (teacher) => mockSessionFeedback.filter((feedback) => feedback.teacher === teacher).length,
      }),
      createFilterGroup({
        id: 'homework',
        options: [
          { label: 'Đã nộp', value: 'done', count: mockSessionFeedback.filter((f) => f.homeworkStatus === 'done').length },
          { label: 'Chưa nộp', value: 'missing', count: mockSessionFeedback.filter((f) => f.homeworkStatus === 'missing').length },
          { label: 'Nộp muộn', value: 'late', count: mockSessionFeedback.filter((f) => f.homeworkStatus === 'late').length },
          { label: 'Nộp một phần', value: 'partial', count: mockSessionFeedback.filter((f) => f.homeworkStatus === 'partial').length },
        ],
        selectedValues: filterState.homework,
      }),
      createFilterGroup({
        id: 'attendance',
        options: [
          { label: 'Có mặt', value: 'present', count: mockSessionFeedback.filter((f) => f.attendance === 'present').length },
          { label: 'Vắng', value: 'absent', count: mockSessionFeedback.filter((f) => f.attendance === 'absent').length },
          { label: 'Đến muộn', value: 'late', count: mockSessionFeedback.filter((f) => f.attendance === 'late').length },
          { label: 'Có phép', value: 'excused', count: mockSessionFeedback.filter((f) => f.attendance === 'excused').length },
        ],
        selectedValues: filterState.attendance,
      }),
    ]
  }, [filterState])

  const handleOpenForm = useCallback((feedback: SessionFeedback) => {
    setSelectedFeedback(feedback)
    setFormOpen(true)
  }, [])

  const handleSaveFeedback = useCallback(() => {
    toast.success('Đã lưu nhận xét')
    setFormOpen(false)
  }, [])

  const handleFilterToggle = useCallback((sectionId: string, value: string) => {
    setFilterState((prev) => {
      const current = prev[sectionId] ?? new Set<string>()
      const next = new Set(current)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, [sectionId]: next }
    })
  }, [])

  const handleFilterClear = useCallback(() => {
    setFilterState({})
  }, [])

  const handleFilterApply = useCallback(() => {
    setFilterOpen(false)
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <SessionFeedbackToolbar
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branchFilter={branchFilter}
        onBranchChange={setBranchFilter}
        onFilterOpen={() => setFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        {groups.length > 0 ? (
          <SessionFeedbackTable
            groups={groups}
            onOpenFeedbackForm={handleOpenForm}
          />
        ) : (
          <EmptyState
            title="Không có nhận xét nào"
            description="Không có feedback nào phù hợp với bộ lọc hiện tại."
          />
        )}

        <FilterGroupSheetPanel
          open={filterOpen}
          onOpenChange={setFilterOpen}
          title="Bộ lọc nhận xét"
          groups={filterGroups}
          onToggle={handleFilterToggle}
          onClearAll={handleFilterClear}
          onApply={handleFilterApply}
        />
      </div>

      <FeedbackFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        feedback={selectedFeedback}
        onSave={handleSaveFeedback}
      />
    </div>
  )
}
