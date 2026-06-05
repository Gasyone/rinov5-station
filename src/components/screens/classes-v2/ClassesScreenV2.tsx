'use client'

import { useState } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  getSchoolFilterGroup,
  getLevelFilterGroup,
  getTeacherFilterGroup,
  getRoomFilterGroup,
  getSubjectFilterGroup,
  getProgramFilterGroup,
} from '@/components/filters'
import { FieldLabel } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/shared'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ClassFilterState, ClassStatusFilter } from './classesHelpers'
import { filterClasses } from './classesHelpers'
import { ClassesToolbar } from './ClassesToolbar'
import { ClassesTable } from './ClassesTable'
import { ClassesCreateDialog } from './ClassesCreateDialog'
import { ClassesDetailSheet } from './ClassesDetailSheet'

export function ClassesScreenV2() {
  const user = useAuthStore((s) => s.user)
  const isTeacherRole = user?.role === 'teacher'

  const [classes, setClasses] = useState<ClassRecord[]>(() =>
    mockClassRecords.map((c) =>
      c.status === 'mo_chieu_sinh' ? { ...c, status: 'cho_khai_giang' as const } : c
    )
  )
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<ClassStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ClassFilterState>({
    branches: [],
    levels: [],
    teachers: [],
    rooms: [],
    classTypes: [],
    weekdays: [],
    times: [],
    subjects: [],
    programs: [],
    statuses: [],
    dateRanges: [],
    studentSearch: '',
  })

  const handleStudentSearchChange = (value: string) => {
    setPage(1)
    setFilters((current) => ({
      ...current,
      studentSearch: value,
    }))
  }
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const [deleteDialog, setDeleteDialog] = useState<ClassRecord | null>(null)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [detailClassId, setDetailClassId] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editClassId, setEditClassId] = useState('')

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
    filters.branches.length +
    filters.levels.length +
    filters.teachers.length +
    filters.rooms.length +
    filters.classTypes.length +
    filters.weekdays.length +
    filters.times.length +
    filters.subjects.length +
    filters.programs.length +
    filters.statuses.length +
    filters.dateRanges.length +
    (filters.studentSearch.trim() ? 1 : 0)

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
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  const handleDelete = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id))
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next })
    setDeleteDialog(null)
  }

  const handleBulkDelete = () => {
    setClasses((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    setSelectedIds(new Set())
    setBulkDeleteConfirm(false)
  }

  const filterGroups = [
    getSchoolFilterGroup('branches', filters.branches, undefined, branchOptions),
    getLevelFilterGroup(filters.levels, undefined, [...new Set(mockClassRecords.map((c) => c.level))].sort()),
    getTeacherFilterGroup(filters.teachers, undefined, [...new Set(mockClassRecords.map((c) => c.teacher))].sort()),
    getRoomFilterGroup(filters.rooms, undefined, [...new Set(mockClassRecords.map((c) => c.room))].sort()),
    getSubjectFilterGroup(filters.subjects),
    getProgramFilterGroup(filters.programs),
    createFilterGroup({
      id: 'classTypes',
      title: 'Loại lớp học',
      options: [
        { value: 'Chính thức', label: 'Lớp chính thức' },
        { value: 'Workshop', label: 'Buổi chuyên đề (Workshop)' },
      ],
      selectedValues: filters.classTypes,
    }),
    createFilterGroup({
      id: 'weekdays',
      title: 'Ngày học trong tuần',
      options: [
        { value: 'Thứ 2', label: 'Thứ Hai' },
        { value: 'Thứ 3', label: 'Thứ Ba' },
        { value: 'Thứ 4', label: 'Thứ Tư' },
        { value: 'Thứ 5', label: 'Thứ Năm' },
        { value: 'Thứ 6', label: 'Thứ Sáu' },
        { value: 'Thứ 7', label: 'Thứ Bảy' },
        { value: 'Chủ nhật', label: 'Chủ nhật' },
      ],
      selectedValues: filters.weekdays,
    }),
    createFilterGroup({
      id: 'times',
      title: 'Ca học',
      options: [
        { value: 'sang', label: 'Ca Sáng (Trước 12:00)' },
        { value: 'chieu', label: 'Ca Chiều (12:00 - 17:30)' },
        { value: 'toi', label: 'Ca Tối (Sau 17:30)' },
      ],
      selectedValues: filters.times,
    }),
    createFilterGroup({
      id: 'statuses',
      title: 'Trạng thái',
      options: [
        { value: 'nhap', label: 'Nháp' },
        { value: 'cho_khai_giang', label: 'Chờ khai giảng' },
        { value: 'dang_hoc', label: 'Đang học' },
        { value: 'tam_dung', label: 'Tạm nghỉ' },
        { value: 'huy', label: 'Đã kết thúc' },
      ],
      selectedValues: filters.statuses,
    }),
    createFilterGroup({
      id: 'dateRanges',
      title: 'Thời gian khai giảng',
      options: [
        { value: 'this_month', label: 'Khai giảng tháng này' },
        { value: 'next_month', label: 'Khai giảng tháng sau' },
        { value: 'past', label: 'Đã khai giảng' },
      ],
      selectedValues: filters.dateRanges,
    }),
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
        selectedIds={selectedIds}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        onBranchChange={(b) => { setActiveBranch(b); setPage(1) }}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateClass={() => setIsCreateOpen(true)}
        onBulkDelete={() => setBulkDeleteConfirm(true)}
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
            onView={setDetailClassId}
            onEdit={(id) => setEditClassId(id)}
            onDelete={(id) => { setDeleteDialog(classes.find((c) => c.id === id) ?? null) }}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        groups={filterGroups}
        description="Kết hợp bộ lọc để tìm kiếm lớp học chính xác."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleFilterValue('branches', value)
          if (sectionId === 'levels') toggleFilterValue('levels', value)
          if (sectionId === 'teachers') toggleFilterValue('teachers', value)
          if (sectionId === 'rooms') toggleFilterValue('rooms', value)
          if (sectionId === 'classTypes') toggleFilterValue('classTypes', value)
          if (sectionId === 'weekdays') toggleFilterValue('weekdays', value)
          if (sectionId === 'times') toggleFilterValue('times', value)
          if (sectionId === 'subjects') toggleFilterValue('subjects', value)
          if (sectionId === 'programs') toggleFilterValue('programs', value)
          if (sectionId === 'statuses') toggleFilterValue('statuses', value)
          if (sectionId === 'dateRanges') toggleFilterValue('dateRanges', value)
        }}
        onClearAll={() => {
          setFilters({
            branches: [],
            levels: [],
            teachers: [],
            rooms: [],
            classTypes: [],
            weekdays: [],
            times: [],
            subjects: [],
            programs: [],
            statuses: [],
            dateRanges: [],
            studentSearch: '',
          })
          setPage(1)
        }}
        onClearSection={(sectionId) => {
          setFilters((current) => ({
            ...current,
            [sectionId]: [],
          }))
          setPage(1)
        }}
      >
        <div className="border-b border-border pb-4">
          <FieldLabel label="Tìm theo học viên">
            <Input
              id="student-search-input"
              placeholder="Nhập tên, SĐT hoặc mã học viên..."
              value={filters.studentSearch}
              onChange={(e) => handleStudentSearchChange(e.target.value)}
              className="mt-1"
            />
          </FieldLabel>
        </div>
      </FilterGroupSheetPanel>

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(o) => { if (!o) setDeleteDialog(null) }}
        title="Xóa lớp học"
        description={deleteDialog ? `Bạn có chắc muốn xóa lớp "${deleteDialog.name}"? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={() => { if (deleteDialog) handleDelete(deleteDialog.id) }}
      />

      <ConfirmDialog
        open={bulkDeleteConfirm}
        onOpenChange={setBulkDeleteConfirm}
        title="Xóa nhiều lớp học"
        description={`Bạn có chắc muốn xóa ${selectedIds.size} lớp học đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={handleBulkDelete}
      />

      <ClassesCreateDialog
        key={isCreateOpen ? "create" : editClassId ? `edit-${editClassId}` : "closed"}
        open={isCreateOpen || !!editClassId}
        onOpenChange={(o) => {
          if (!o) {
            setIsCreateOpen(false)
            setEditClassId('')
          }
        }}
        editClassId={editClassId || undefined}
        onSuccess={(newClass) => {
          if (editClassId) {
            setClasses((prev) => prev.map((c) => (c.id === editClassId ? { ...c, ...newClass } : c)))
            setEditClassId('')
          } else {
            setClasses((prev) => [newClass, ...prev])
            setIsCreateOpen(false)
          }
        }}
      />

      <ClassesDetailSheet
        cls={detailClass}
        open={!!detailClassId}
        onOpenChange={(o) => { if (!o) setDetailClassId('') }}
        onEdit={(id) => {
          setDetailClassId('')
          setEditClassId(id)
        }}
        onClassesChange={setClasses}
      />
    </div>
  )
}
