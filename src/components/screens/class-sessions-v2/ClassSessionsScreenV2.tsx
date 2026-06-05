'use client'

import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { mockClassSessions, getClassSessions, getTeachers } from '@/mocks/classSessions'
import { ClassSessionsToolbar } from './ClassSessionsToolbar'
import { SessionTable } from './SessionTable'
import { groupSessionsByClass } from './classSessionHelpers'

type SessionStatusId = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'audited' | 'rescheduled' | 'makeup' | 'cancelled'

export function ClassSessionsScreenV2() {
  const [activeStatus, setActiveStatus] = useState<SessionStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<Record<string, Set<string>>>({})

  const filteredSessions = useMemo(
    () =>
      getClassSessions({
        search: searchQuery,
        branch: branchFilter === 'all' || !branchFilter ? undefined : branchFilter,
        status: activeStatus === 'all' ? undefined : activeStatus,
      }),
    [searchQuery, branchFilter, activeStatus],
  )

  const groups = useMemo(() => groupSessionsByClass(filteredSessions), [filteredSessions])

  const filterGroups = useMemo<FilterGroupConfig[]>(() => {
    const allTeachers = getTeachers(mockClassSessions)
    return [
      createFilterGroup({
        id: 'teacher',
        options: allTeachers,
        selectedValues: filterState.teacher,
        getOptionCount: (teacher) => mockClassSessions.filter((session) => session.teacher === teacher).length,
      }),
      createFilterGroup({
        id: 'dateRange',
        options: [
          { label: 'Tuần này', value: 'this_week', count: 5 },
          { label: 'Tuần sau', value: 'next_week', count: 4 },
          { label: 'Tháng này', value: 'this_month', count: 15 },
        ],
        selectedValues: filterState.dateRange,
      }),
      createFilterGroup({
        id: 'conflict',
        options: [
          { label: 'Có xung đột', value: 'has_conflict', count: 1 },
        ],
        selectedValues: filterState.conflict,
      }),
    ]
  }, [filterState])

  const handleAction = useCallback((action: string, session: { code: string; topic: string; date: string }) => {
    switch (action) {
      case 'attendance':
        toast.info(`Mở điểm danh: ${session.topic} (${session.date})`)
        break
      case 'cancel':
        toast.success(`Đã hủy buổi ${session.code}`)
        break
      case 'reschedule':
        toast.info(`Dời lịch buổi ${session.code}`)
        break
      case 'makeup':
        toast.success(`Đã tạo buổi học bù cho ${session.code}`)
        break
    }
  }, [])

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
    setBranchFilter('')
  }, [])

  const handleFilterApply = useCallback(() => {
    setFilterOpen(false)
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ClassSessionsToolbar
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branchFilter={branchFilter}
        onBranchChange={setBranchFilter}
        onFilterOpen={() => setFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        {filteredSessions.length > 0 ? (
          <SessionTable
            groups={groups}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onAction={handleAction}
          />
        ) : (
          <EmptyState
            title="Không có buổi học nào"
            description="Không có session nào phù hợp với bộ lọc hiện tại."
          />
        )}

        <FilterGroupSheetPanel
          open={filterOpen}
          onOpenChange={setFilterOpen}
          title="Bộ lọc buổi học"
          groups={filterGroups}
          onToggle={handleFilterToggle}
          onClearAll={handleFilterClear}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  )
}
