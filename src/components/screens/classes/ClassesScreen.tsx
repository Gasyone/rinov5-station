'use client'

import { useState } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterSheetPanel } from '@/components/filters'
import { ConfirmDialog } from '@/components/shared'
import { mockClassRecords, CLASS_CATEGORIES, type ClassRecord } from '@/mocks/classRecords'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ClassFilterState, ClassStatusFilter } from './classesHelpers'
import { countClassesByStatus, filterClasses, STATUS_SEMANTIC_MAP } from './classesHelpers'
import { ClassesToolbar } from './ClassesToolbar'
import { ClassesTable } from './ClassesTable'

export function ClassesScreen() {
  const user = useAuthStore((s) => s.user)
  const isTeacherRole = user?.role === 'teacher'

  const [classes, setClasses] = useState<ClassRecord[]>(() => [...mockClassRecords])
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<ClassStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ClassFilterState>({
    branches: [],
    levels: [],
    teachers: [],
    rooms: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const [deleteDialog, setDeleteDialog] = useState<ClassRecord | null>(null)
  const [detailClassId, setDetailClassId] = useState('')

  const branchOptions = [...new Set(mockClassRecords.map((c) => c.branch))].sort()

  const baseForStatus = classes.filter((c) => {
    if (activeBranch !== 'all' && c.branch !== activeBranch) return false
    return true
  })

  const filteredClasses = filterClasses(classes, {
    search: searchTerm,
    branch: activeBranch,
    status: activeStatus,
    extra: filters,
  })

  const activeFilterCount =
    filters.branches.length + filters.levels.length + filters.teachers.length + filters.rooms.length

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const detailClass = classes.find((c) => c.id === detailClassId) ?? null

  const toggleFilterValue = <T extends string>(group: keyof ClassFilterState, value: T) => {
    setPage(1)
    setFilters((current) => {
      const currentValues = current[group] as T[]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...current, [group]: nextValues }
    })
  }

  const toggleSelectAll = (checked: boolean, ids: string[]) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
      return next
    })
  }

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const handleDelete = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id))
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next })
    setDeleteDialog(null)
  }

  const filterSections = [
    {
      id: 'branches',
      title: 'Chi nhánh',
      options: branchOptions.map((b) => ({ value: b, label: b })),
    },
    {
      id: 'levels',
      title: 'Trình độ',
      options: [...new Set(mockClassRecords.map((c) => c.level))].sort().map((l) => ({ value: l, label: l })),
    },
    {
      id: 'teachers',
      title: 'Giáo viên',
      options: [...new Set(mockClassRecords.map((c) => c.teacher))].sort().map((t) => ({ value: t, label: t })),
    },
    {
      id: 'rooms',
      title: 'Phòng học',
      options: [...new Set(mockClassRecords.map((c) => c.room))].sort().map((r) => ({ value: r, label: r })),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ClassesToolbar
        activeStatus={activeStatus}
        activeBranch={activeBranch}
        searchTerm={searchTerm}
        branchOptions={branchOptions}
        baseForStatus={baseForStatus}
        activeFilterCount={activeFilterCount}
        isTeacherRole={isTeacherRole}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        onBranchChange={(b) => { setActiveBranch(b); setPage(1) }}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateClass={() => {}}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filteredClasses.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <ClassesTable
            classes={pagedClasses}
            selectedIds={selectedIds}
            onToggleAll={toggleSelectAll}
            onToggleOne={toggleSelectOne}
            onRowClick={setDetailClassId}
            onEdit={() => {}}
            onDelete={(id) => { setDeleteDialog(classes.find((c) => c.id === id) ?? null) }}
            onView={setDetailClassId}
            onOpenClass={() => {}}
            onCancelClass={() => {}}
          />
        </DataTableFrame>
      </div>

      <FilterSheetPanel
        open={isFilterOpen}
        sections={filterSections}
        description="Kết hợp bộ lọc theo chi nhánh, trình độ, giáo viên và phòng học."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleFilterValue('branches', value)
          if (sectionId === 'levels') toggleFilterValue('levels', value)
          if (sectionId === 'teachers') toggleFilterValue('teachers', value)
          if (sectionId === 'rooms') toggleFilterValue('rooms', value)
        }}
        onClearAll={() => {
          setFilters({ branches: [], levels: [], teachers: [], rooms: [] })
          setPage(1)
        }}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(o) => { if (!o) setDeleteDialog(null) }}
        title="Xóa lớp học"
        description={deleteDialog ? `Bạn có chắc muốn xóa lớp "${deleteDialog.name}"? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={() => { if (deleteDialog) handleDelete(deleteDialog.id) }}
      />
    </div>
  )
}
