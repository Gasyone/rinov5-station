'use client'

import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared'
import { FilterSheetPanel } from '@/components/filters'
import type { FilterSection } from '@/components/filters'
import { mockClassSessions, getClassSessions, getTeachers } from '@/mocks/classSessions'
import { ClassSessionsToolbar } from './ClassSessionsToolbar'
import { SessionTable } from './SessionTable'
import { groupSessionsByClass } from './classSessionHelpers'

type SessionStatusId = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'audited' | 'rescheduled' | 'makeup' | 'cancelled'

export function ClassSessionsScreen() {
  const [activeStatus, setActiveStatus] = useState<SessionStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<Record<string, Set<string>>>({})

  const filteredSessions = useMemo(
    () =>
      getClassSessions({
        search: searchQuery,
        branch: branchFilter || undefined,
        status: activeStatus === 'all' ? undefined : activeStatus,
      }),
    [searchQuery, branchFilter, activeStatus],
  )

  const groups = useMemo(() => groupSessionsByClass(filteredSessions), [filteredSessions])

  const filterSections: FilterSection[] = useMemo(() => {
    const allTeachers = getTeachers(mockClassSessions)
    return [
      {
        id: 'teacher',
        title: 'Giáo viên',
        options: allTeachers.map((t) => ({
          label: t,
          value: t,
          count: mockClassSessions.filter((s) => s.teacher === t).length,
          checked: filterState.teacher?.has(t) ?? false,
        })),
      },
      {
        id: 'dateRange',
        title: 'Khoảng thời gian',
        options: [
          { label: 'Tuần này', value: 'this_week', count: 5, checked: filterState.dateRange?.has('this_week') ?? false },
          { label: 'Tuần sau', value: 'next_week', count: 4, checked: filterState.dateRange?.has('next_week') ?? false },
          { label: 'Tháng này', value: 'this_month', count: 15, checked: filterState.dateRange?.has('this_month') ?? false },
        ],
      },
      {
        id: 'conflict',
        title: 'Xung đột',
        options: [
          { label: 'Có xung đột', value: 'has_conflict', count: 1, checked: filterState.conflict?.has('has_conflict') ?? false },
        ],
      },
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

        <FilterSheetPanel
          open={filterOpen}
          onOpenChange={setFilterOpen}
          title="Bộ lọc buổi học"
          sections={filterSections}
          onToggle={handleFilterToggle}
          onClearAll={handleFilterClear}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  )
}
