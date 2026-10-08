'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import {
  FilterGroupAsidePanel,
  createFilterGroup,
  getSchoolFilterGroup,
  getLevelFilterGroup,
  getTeacherFilterGroup,
  getRoomFilterGroup,
  getSubjectFilterGroup,
  getProgramFilterGroup,
  getLearningPathFilterGroup,
  getSyllabusFilterGroup,
  getPackageFilterGroup,
} from '@/components/filters'
import { FieldLabel, ConfirmDialog } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ClassFilterState, ClassStatusFilter } from './classesHelpers'
import { filterClasses, getSubjectByLevel, getClassSpecialCareCount, getClassAttendanceRate, getClassHomeworkRate, sortClassesByOperationalPriority } from './classesHelpers'
import { ClassesToolbar, type ClassProblemFilter } from './ClassesToolbar'
import { ClassesTable } from './ClassesTable'
import { ClassesCreateDialog } from './ClassesCreateDialog'
import { ClassesDetailDialog } from './detail/ClassesDetailDialog'


export function ClassesScreen() {
  const user = useAuthStore((s) => s.user)
  const isTeacherRole = user?.role === 'teacher'

  const [classes, setClasses] = useState<ClassRecord[]>(() => {
    return mockClassRecords.map((c) => {
      const status = c.status === 'mo_chieu_sinh' ? ('cho_khai_giang' as const) : c.status
      return { ...c, status }
    })
  })
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeSubject, setActiveSubject] = useState('all')
  const [activeGrade, setActiveGrade] = useState('all')
  const [activeStatus, setActiveStatus] = useState<ClassStatusFilter>('all')
  const [activeProblemFilter, setActiveProblemFilter] = useState<ClassProblemFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ClassFilterState>({
    branches: [],
    levels: [],
    teachers: [],
    rooms: [],
    weekdays: [],
    times: [],
    subjects: [],
    programs: [],
    learningPaths: [],
    syllabuses: [],
    packages: [],
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

  const searchParams = useSearchParams()
  const classIdFromUrl = searchParams?.get('id') || null

  const [deleteDialog, setDeleteDialog] = useState<ClassRecord | null>(null)
  const [detailClassId, setDetailClassId] = useState(() => {
    if (classIdFromUrl) {
      const found = mockClassRecords.find((c) => c.id === classIdFromUrl || c.code === classIdFromUrl)
      return found ? found.id : ''
    }
    return ''
  })
  const [detailEditMode, setDetailEditMode] = useState(false)
  const [detailInitialTab, setDetailInitialTab] = useState('roster')
  const [detailRoadmapWizard, setDetailRoadmapWizard] = useState(false)
  const [detailStudentSelect, setDetailStudentSelect] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleOpenDetail = (
    id: string,
    options?: {
      editMode?: boolean
      initialTab?: string
      roadmapWizard?: boolean
      studentSelect?: boolean
    }
  ) => {
    setDetailClassId(id)
    setDetailEditMode(options?.editMode ?? false)
    setDetailInitialTab(options?.initialTab ?? 'roster')
    setDetailRoadmapWizard(options?.roadmapWizard ?? false)
    setDetailStudentSelect(options?.studentSelect ?? false)
  }

  const branchOptions = [...new Set(mockClassRecords.map((c) => c.branch).filter(Boolean))].sort()

  const baseForStatus = classes.filter((c) => {
    if (activeBranch !== 'all' && c.branch !== activeBranch) return false
    if (activeSubject !== 'all' && getSubjectByLevel(c.level) !== activeSubject) return false
    return true
  })

  let filteredClasses = filterClasses(classes, {
    search: searchTerm,
    branch: activeBranch,
    status: activeStatus,
    subject: activeSubject,
    extra: filters,
  })

  if (activeProblemFilter === 'special_care') {
    filteredClasses = filteredClasses.filter((c) => getClassSpecialCareCount(c) > 0)
  } else if (activeProblemFilter === 'unassigned_teacher') {
    filteredClasses = filteredClasses.filter((c) => !c.teacher || c.teacher === 'Chưa gán' || c.teacher.trim() === '')
  } else if (activeProblemFilter === 'low_acs') {
    filteredClasses = filteredClasses.filter((c) => c.status !== 'nhap' && c.maxStudents > 0 && (c.enrolledStudents / c.maxStudents) < 0.5)
  } else if (activeProblemFilter === 'low_attendance') {
    filteredClasses = filteredClasses.filter((c) => c.status !== 'nhap' && c.status !== 'cho_khai_giang' && getClassAttendanceRate(c) < 85)
  } else if (activeProblemFilter === 'low_homework') {
    filteredClasses = filteredClasses.filter((c) => c.status !== 'nhap' && c.status !== 'cho_khai_giang' && getClassHomeworkRate(c) < 80)
  }

  if (activeSubject === 'math' && activeGrade !== 'all') {
    filteredClasses = filteredClasses.filter((c) => {
      if (c.grade) {
        return c.grade.toLowerCase() === activeGrade.toLowerCase()
      }
      const levelLower = c.level?.toLowerCase() || ''
      const nameLower = c.name?.toLowerCase() || ''
      if (activeGrade === 'lớp 1') {
        return levelLower.includes('kindi') || nameLower.includes('1')
      }
      if (activeGrade === 'lớp 2') {
        return levelLower.includes('primary') || nameLower.includes('2')
      }
      if (activeGrade === 'lớp 3') {
        return nameLower.includes('3')
      }
      if (activeGrade === 'lớp 4') {
        return nameLower.includes('4')
      }
      if (activeGrade === 'lớp 5') {
        return nameLower.includes('5')
      }
    })
  }

  // Sắp xếp mặc định thông minh theo thứ tự ưu tiên vận hành (Smart Operational Sort)
  filteredClasses = sortClassesByOperationalPriority(filteredClasses)

  const activeFilterCount =
    filters.branches.length +
    filters.levels.length +
    filters.teachers.length +
    filters.rooms.length +
    filters.weekdays.length +
    filters.times.length +
    filters.subjects.length +
    filters.programs.length +
    filters.learningPaths.length +
    filters.syllabuses.length +
    filters.packages.length +
    filters.statuses.length +
    filters.dateRanges.length +
    (filters.studentSearch.trim() ? 1 : 0)

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

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

  const filterGroups = [
    getSchoolFilterGroup('branches', filters.branches, undefined, branchOptions),
    getLevelFilterGroup(filters.levels, undefined, [...new Set(mockClassRecords.map((c) => c.level).filter(Boolean))].sort()),
    getTeacherFilterGroup(filters.teachers, undefined, [...new Set(mockClassRecords.map((c) => c.teacher).filter((t) => t && t !== '—'))].sort()),
    getRoomFilterGroup(filters.rooms, undefined, [...new Set(mockClassRecords.map((c) => c.room).filter((r) => r && r !== '—'))].sort()),
    getSubjectFilterGroup(filters.subjects),
    getProgramFilterGroup(filters.programs),
    getLearningPathFilterGroup(filters.learningPaths),
    getSyllabusFilterGroup(filters.syllabuses),
    getPackageFilterGroup(filters.packages),
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
        activeProblemFilter={activeProblemFilter}
        activeBranch={activeBranch}
        activeSubject={activeSubject}
        activeGrade={activeGrade}
        searchTerm={searchTerm}
        branchOptions={branchOptions}
        baseForStatus={baseForStatus}
        activeFilterCount={activeFilterCount}
        isTeacherRole={isTeacherRole}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        onProblemFilterChange={(pf) => { setActiveProblemFilter(pf); setPage(1) }}
        onBranchChange={(b) => { setActiveBranch(b); setPage(1) }}
        onSubjectChange={(sub) => { setActiveSubject(sub); setActiveGrade('all'); setPage(1) }}
        onGradeChange={(g) => { setActiveGrade(g); setPage(1) }}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateClass={() => setIsCreateOpen(true)}
      />

      {/* Container Nội dung Lớp học & Panel Bộ Lọc Ghim Cạnh Phải */}
      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-2.5 pt-0.5 pb-2 lg:px-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          <ClassesTable
            classes={pagedClasses}
            selectedIds={selectedIds}
            onToggleAll={toggleSelectAll}
            onToggleOne={toggleSelectOne}
            onRowClick={(id) => handleOpenDetail(id, { editMode: false })}
            onView={(id) => handleOpenDetail(id, { editMode: false })}
            onEdit={(id) => handleOpenDetail(id, { editMode: true })}
            onManageRoadmap={(id) => handleOpenDetail(id, { editMode: false, initialTab: 'roadmap', roadmapWizard: true })}
            onAddStudent={(id) => handleOpenDetail(id, { editMode: false, initialTab: 'roster', studentSelect: true })}
            onDelete={(id) => { setDeleteDialog(classes.find((c) => c.id === id) ?? null) }}
            className="flex-1"
            pagination={{
              page: currentPage,
              total: filteredClasses.length,
              pageSize: pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
              selectedCount: selectedIds.size,
              onClearSelection: () => setSelectedIds(new Set()),
            }}
          />
        </div>

        {/* Panel bộ lọc ghim cạnh phải chuẩn màn Đơn hàng */}
        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc lớp học"
            groups={filterGroups}
            onClose={() => setIsFilterOpen(false)}
            onToggle={(sectionId, value) => {
              if (sectionId === 'branches') toggleFilterValue('branches', value)
              if (sectionId === 'levels') toggleFilterValue('levels', value)
              if (sectionId === 'teachers') toggleFilterValue('teachers', value)
              if (sectionId === 'rooms') toggleFilterValue('rooms', value)
              if (sectionId === 'weekdays') toggleFilterValue('weekdays', value)
              if (sectionId === 'times') toggleFilterValue('times', value)
              if (sectionId === 'subjects') toggleFilterValue('subjects', value)
              if (sectionId === 'programs') toggleFilterValue('programs', value)
              if (sectionId === 'learningPaths') toggleFilterValue('learningPaths', value)
              if (sectionId === 'syllabuses') toggleFilterValue('syllabuses', value)
              if (sectionId === 'packages') toggleFilterValue('packages', value)
              if (sectionId === 'statuses') toggleFilterValue('statuses', value)
              if (sectionId === 'dateRanges') toggleFilterValue('dateRanges', value)
            }}
            onClearAll={() => {
              setFilters({
                branches: [],
                levels: [],
                teachers: [],
                rooms: [],
                weekdays: [],
                times: [],
                subjects: [],
                programs: [],
                learningPaths: [],
                syllabuses: [],
                packages: [],
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
            <div className="border-b border-border/40 pb-3 pt-1">
              <FieldLabel label="Tìm theo học viên">
                <Input
                  id="student-search-input"
                  placeholder="Nhập tên, SĐT hoặc mã học viên..."
                  value={filters.studentSearch}
                  onChange={(e) => handleStudentSearchChange(e.target.value)}
                  className="mt-1 h-7 text-xs"
                />
              </FieldLabel>
            </div>
          </FilterGroupAsidePanel>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(o) => { if (!o) setDeleteDialog(null) }}
        title="Xóa lớp học"
        description={deleteDialog ? `Bạn có chắc muốn xóa lớp "${deleteDialog.name}"? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={() => { if (deleteDialog) handleDelete(deleteDialog.id) }}
      />

      <ClassesCreateDialog
        key={isCreateOpen ? "open" : "closed"}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(newClass) => {
          setClasses((prev) => [newClass, ...prev])
          setIsCreateOpen(false)
        }}
      />

      <ClassesDetailDialog
        open={!!detailClassId}
        onOpenChange={(open) => {
          if (!open) {
            setDetailClassId('')
            setDetailEditMode(false)
            setDetailInitialTab('roster')
            setDetailRoadmapWizard(false)
            setDetailStudentSelect(false)
          }
        }}
        initialEditMode={detailEditMode}
        initialTab={detailInitialTab}
        initialRoadmapWizard={detailRoadmapWizard}
        initialStudentSelect={detailStudentSelect}
        cls={classes.find((c) => c.id === detailClassId) ?? null}
        onEdit={(id) => {
          setDetailClassId('')
          handleOpenDetail(id, { editMode: true })
        }}
        onSave={(updatedClass) => {
          const now = new Date()
          const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
          let finalStatus = updatedClass.status
          if (updatedClass.endDate && updatedClass.endDate <= todayStr && finalStatus !== 'huy' && finalStatus !== 'nhap') {
            finalStatus = 'huy'
          }
          setClasses((prev) =>
            prev.map((c) => (c.id === updatedClass.id ? { ...updatedClass, status: finalStatus } : c))
          )
        }}
        onStatusChange={(id, newStatus) => {
          setClasses((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus, enrolledStudents: newStatus === 'huy' ? 0 : c.enrolledStudents } : c))
          )
        }}
      />
    </div>
  )
}
