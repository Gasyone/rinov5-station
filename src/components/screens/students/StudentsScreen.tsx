'use client'

import { useMemo, useState } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, type FilterGroupConfig, getSchoolFilterGroup, getTeacherFilterGroup, getProgramFilterGroup, getSubjectFilterGroup, getSaleFilterGroup, getClassTypeFilterGroup, getClassFilterGroup, getRemainingSessionsFilterGroup, getGenderFilterGroup } from '@/components/filters'
import { StudentsToolbar } from './StudentsToolbar'
import { StudentsTable } from './StudentsTable'
import { StudentTicketDialog } from './StudentTicketDialog'
import { StudentDetailDialog } from './detail/StudentDetailDialog'
import type { StudentStatusId } from './studentTypes'
import { filterStudents, getInitialStudents } from './studentsHelpers'
import { INITIAL_FILTER_STATE, type StudentFilterState } from './studentsTypes'

export function StudentsScreen() {
  const [activeStatus, setActiveStatus] = useState<StudentStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [activeTicketStudentId, setActiveTicketStudentId] = useState<string | null>(null)
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)

  // Advanced Filter Sheet States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<StudentFilterState>(INITIAL_FILTER_STATE)

  const allStudents = useMemo(() => getInitialStudents(), [])

  // Level options generated dynamically from the mock data
  const levelOptions = useMemo(() => {
    return Array.from(new Set(allStudents.map((s) => s.level))).filter(Boolean).sort()
  }, [allStudents])

  // Subject options
  const subjectOptions = useMemo(() => [
    { value: 'english', label: 'Tiếng Anh' },
    { value: 'math', label: 'Toán học' },
    { value: 'stem', label: 'STEM Robotics' },
    { value: 'japanese', label: 'Tiếng Nhật' },
  ], [])

  // Programs options generated dynamically from the mock data
  const programOptions = useMemo(() => {
    const list: string[] = []
    allStudents.forEach((s) => {
      s.enrolledClasses?.forEach((c) => {
        if (c.programName && !list.includes(c.programName)) {
          list.push(c.programName)
        }
      })
    })
    return list.sort()
  }, [allStudents])

  // Classes options generated dynamically from the mock data
  const classOptions = useMemo(() => {
    const list: string[] = []
    allStudents.forEach((s) => {
      s.enrolledClasses?.forEach((c) => {
        if (c.className && !list.includes(c.className)) {
          list.push(c.className)
        }
      })
    })
    return list.sort()
  }, [allStudents])

  // Build the Filter Sheet configuration
  const filterGroups: FilterGroupConfig[] = useMemo(() => [
    getSchoolFilterGroup('branches', filters.branches),
    {
      id: 'levels',
      title: 'Trình độ học tập',
      options: levelOptions,
      selectedValues: filters.levels,
    },
    getSubjectFilterGroup(filters.subjects, undefined, subjectOptions),
    getProgramFilterGroup(filters.programs, undefined, programOptions),
    getClassFilterGroup(filters.classes, undefined, classOptions),
    getClassTypeFilterGroup(filters.classTypes),
    getTeacherFilterGroup(filters.teachers),
    getSaleFilterGroup(filters.sales),
    getRemainingSessionsFilterGroup(filters.remainingSessionsRange),
    getGenderFilterGroup(filters.genders),
  ], [filters, levelOptions, subjectOptions, programOptions, classOptions])

  // Core toggle, clear, and reset callbacks for the Filter Sheet
  const handleToggleFilter = (sectionId: string, value: string) => {
    setFilters((prev) => {
      const key = sectionId as keyof StudentFilterState
      const current = prev[key] as string[]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return {
        ...prev,
        [key]: next,
      }
    })
    setPage(1)
  }

  const handleClearSection = (sectionId: string) => {
    setFilters((prev) => ({
      ...prev,
      [sectionId]: [],
    }))
    setPage(1)
  }

  const handleClearAll = () => {
    setFilters(INITIAL_FILTER_STATE)
    setPage(1)
  }

  // Filter students based on all active filter layers
  const filtered = useMemo(
    () =>
      filterStudents(allStudents, {
        search: searchQuery,
        branch: branchFilter,
        status: activeStatus,
        extra: filters,
      }),
    [allStudents, searchQuery, branchFilter, activeStatus, filters],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <StudentsToolbar
        activeStatus={activeStatus}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1) }}
        branchFilter={branchFilter}
        onBranchChange={(b) => { setBranchFilter(b); setPage(1) }}
        onFilterOpen={() => setIsFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <StudentsTable
            students={paged}
            selectedIds={selectedIds}
            onToggleAll={(checked, ids) => setSelectedIds(checked ? new Set(ids) : new Set())}
            onToggleOne={(id, checked) => {
              setSelectedIds((cur) => {
                const next = new Set(cur)
                if (checked) next.add(id)
                else next.delete(id)
                return next
              })
            }}
            onCreateTicket={(id) => setActiveTicketStudentId(id)}
            onView={(id) => setActiveStudentId(id)}
          />
        </DataTableFrame>
      </div>

      {/* Advanced Filter Sheet */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        groups={filterGroups}
        onToggle={handleToggleFilter}
        onClearAll={handleClearAll}
        onClearSection={handleClearSection}
      />

      <StudentDetailDialog
        studentId={activeStudentId}
        open={!!activeStudentId}
        onOpenChange={(open) => {
          if (!open) setActiveStudentId(null)
        }}
        onCreateTicket={(id) => setActiveTicketStudentId(id)}
      />

      {activeTicketStudentId && (
        <StudentTicketDialog
          studentId={activeTicketStudentId}
          open={!!activeTicketStudentId}
          onOpenChange={(open) => {
            if (!open) setActiveTicketStudentId(null)
          }}
        />
      )}
    </div>
  )
}
