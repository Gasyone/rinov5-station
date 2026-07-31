'use client'

import { useMemo, useState } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig, getSchoolFilterGroup, getTeacherFilterGroup, getProgramFilterGroup, getSubjectFilterGroup, getSaleFilterGroup, getClassTypeFilterGroup, getClassFilterGroup, getRemainingSessionsFilterGroup, getGenderFilterGroup } from '@/components/filters'
import { StudentsToolbar } from './StudentsToolbar'
import { StudentsTable } from './StudentsTable'
import { StudentDetailDialog } from './detail/StudentDetailDialog'
import { toast } from 'sonner'
import type { StudentStatusId } from './studentTypes'
import { createStudentFilterOptionCounters, filterStudents, getInitialStudents } from './studentsHelpers'
import { INITIAL_FILTER_STATE, type StudentFilterState } from './studentsTypes'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'

export function StudentsScreen() {
  const [activeStatus, setActiveStatus] = useState<StudentStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)

  // Advanced Filter Sheet States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<StudentFilterState>(INITIAL_FILTER_STATE)

  const allStudents = useMemo(() => getInitialStudents(), [])
  const filterOptionCounts = useMemo(
    () => createStudentFilterOptionCounters(allStudents),
    [allStudents]
  )

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

  // Package options generated dynamically from the mock data
  const packageOptions = useMemo(() => {
    return Array.from(new Set(allStudents.map((s) => s.packageName))).filter(Boolean).sort() as string[]
  }, [allStudents])

  // Custom class type options
  const classTypeOptions = useMemo(() => [
    { value: 'offline', label: 'Lớp Offline' },
    { value: 'online_tutor', label: 'Lớp Online Tutor' },
    { value: 'tutor', label: 'Lớp Tutor' },
    { value: 'station', label: 'Lớp Station' },
    { value: 'online', label: 'Lớp Online' },
  ], [])

  // Build the Filter Sheet configuration
  const filterGroups: FilterGroupConfig[] = useMemo(() => [
    getSchoolFilterGroup('branches', filters.branches, filterOptionCounts.branches),
    createFilterGroup({
      id: 'levels',
      title: 'Trình độ học tập',
      options: levelOptions,
      selectedValues: filters.levels,
      getOptionCount: filterOptionCounts.levels,
    }),
    getSubjectFilterGroup(filters.subjects, filterOptionCounts.subjects, subjectOptions),
    getProgramFilterGroup(filters.programs, filterOptionCounts.programs, programOptions),
    createFilterGroup({
      id: 'packages',
      title: 'Gói đăng ký',
      options: packageOptions,
      selectedValues: filters.packages,
      searchable: true,
      scrollable: true,
      getOptionCount: filterOptionCounts.packages,
    }),
    getClassFilterGroup(filters.classes, filterOptionCounts.classes, classOptions),
    getClassTypeFilterGroup(filters.classTypes, filterOptionCounts.classTypes, classTypeOptions),
    getTeacherFilterGroup(filters.teachers, filterOptionCounts.teachers),
    getSaleFilterGroup(filters.sales, filterOptionCounts.sales),
    getRemainingSessionsFilterGroup(
      filters.remainingSessionsRange,
      filterOptionCounts.remainingSessionsRange
    ),
    getGenderFilterGroup(filters.genders, filterOptionCounts.genders),
    createFilterGroup({
      id: 'dateRanges',
      title: 'Thời gian nhập học',
      options: [
        { value: 'this_month', label: 'Nhập học tháng này' },
        { value: 'last_month', label: 'Nhập học tháng trước' },
        { value: 'past', label: 'Nhập học trước đây' },
      ],
      selectedValues: filters.dateRanges,
      getOptionCount: filterOptionCounts.dateRanges,
      customContent: (
        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Chọn khoảng thời gian
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Từ ngày" className="w-full">
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                  setPage(1)
                }}
                className="h-8 text-xs bg-background"
              />
            </FieldLabel>
            <FieldLabel label="Đến ngày" className="w-full">
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                  setPage(1)
                }}
                className="h-8 text-xs bg-background"
              />
            </FieldLabel>
          </div>
        </div>
      ),
    }),
    createFilterGroup({
      id: 'ageRanges',
      title: 'Khoảng tuổi học viên',
      options: [
        { value: 'pre_starters', label: 'Pre-Starters (<=6 tuổi)' },
        { value: 'starters', label: 'Starters (>6 và <=8 tuổi)' },
        { value: 'mover', label: 'Mover (>8 và <=10 tuổi)' },
        { value: 'flyers', label: 'Flyers (>10 tuổi)' },
      ],
      selectedValues: filters.ageRanges,
      getOptionCount: filterOptionCounts.ageRanges,
    }),
  ], [filters, levelOptions, subjectOptions, programOptions, packageOptions, classOptions, classTypeOptions, filterOptionCounts])

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
    setFilters((prev) => {
      const updated = {
        ...prev,
        [sectionId]: [],
      }
      if (sectionId === 'dateRanges') {
        updated.startDate = ''
        updated.endDate = ''
      }
      return updated
    })
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
        subject: subjectFilter,
        status: activeStatus,
        extra: filters,
      }),
    [allStudents, searchQuery, branchFilter, subjectFilter, activeStatus, filters],
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
        activeSubject={subjectFilter}
        onSubjectChange={(sub) => { setSubjectFilter(sub); setPage(1) }}
        onFilterOpen={() => setIsFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2 lg:px-3 lg:pb-3">
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
            onCreateTicket={(id) => toast.info('Tính năng đang được phát triển!')}
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
        onCreateTicket={(id) => toast.info('Tính năng đang được phát triển!')}
      />
    </div>
  )
}
