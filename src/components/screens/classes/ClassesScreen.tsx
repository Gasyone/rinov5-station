'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterSheetPanel } from '@/components/filters'
import type { FilterSection } from '@/components/filters'
import { mockClasses, getClasses } from '@/mocks/classes'
import type { Class } from '@/mocks/classes'
import { ClassesToolbar } from './ClassesToolbar'
import { ClassesTable } from './ClassesTable'
import { ClassesFormDialog } from './ClassesFormDialog'
import type { StatusTabId } from './classScreenTypes'

const buildEmptyClass = (): Omit<Class, 'id'> & { id?: string } => ({
  name: '',
  level: '',
  branch: '',
  teacher: '',
  maxStudents: 20,
  enrolledStudents: 0,
  startDate: '',
  endDate: '',
  schedule: '',
  room: '',
  status: 'upcoming',
  tuitionFee: 0,
})

import { ClassDetailView } from './ClassDetailView'

export function ClassesScreen() {
  const [classList, setClassList] = useState<Class[]>(mockClasses)
  const [activeStatus, setActiveStatus] = useState<StatusTabId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editClassId, setEditClassId] = useState('')
  const [editForm, setEditForm] = useState<Omit<Class, 'id'> & { id?: string }>(buildEmptyClass())
  const [activeClassId, setActiveClassId] = useState<string | null>(null)

  const branches = useMemo(() => [...new Set(classList.map((c) => c.branch))].filter(Boolean), [classList])
  const levels = useMemo(() => [...new Set(classList.map((c) => c.level))].filter(Boolean), [classList])
  const teachers = useMemo(() => [...new Set(classList.map((c) => c.teacher))].filter(Boolean), [classList])

  const filtered = useMemo(
    () =>
      getClasses({
        search: searchQuery,
        branch: branchFilter || undefined,
        status: activeStatus === 'all' ? undefined : activeStatus,
      }),
    [searchQuery, branchFilter, activeStatus],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const filterSections: FilterSection[] = useMemo(
    () => [
      {
        id: 'level',
        title: 'Trình độ',
        options: levels.map((l) => ({
          label: l,
          value: l,
          count: classList.filter((c) => c.level === l).length,
          checked: false,
        })),
      },
      {
        id: 'teacher',
        title: 'Giáo viên',
        options: teachers.map((t) => ({
          label: t,
          value: t,
          count: classList.filter((c) => c.teacher === t).length,
          checked: false,
        })),
      },
    ],
    [levels, teachers, classList],
  )

  const toggleFilterValue = (_group: string, _value: string) => { setPage(1) }

  const handleCreate = () => {
    setEditForm(buildEmptyClass())
    setIsCreateOpen(true)
  }

  const handleEdit = (classId: string) => {
    const cls = classList.find((c) => c.id === classId)
    if (!cls) return
    setEditForm(cls)
    setEditClassId(classId)
    setIsCreateOpen(true)
  }

  const handleSubmit = (form: Omit<Class, 'id'> & { id?: string }) => {
    if (editClassId) {
      setClassList((prev) =>
        prev.map((c) => (c.id === editClassId ? { ...c, ...form } : c)),
      )
      toast.success(`Đã cập nhật lớp ${form.name}`)
      setEditClassId('')
    } else {
      const id = `c${Date.now()}`
      setClassList((prev) => [{ ...form, id } as Class, ...prev])
      toast.success(`Đã tạo lớp ${form.name}`)
    }
    setIsCreateOpen(false)
  }

  const handleGraduate = (classId: string) => {
    setClassList((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, status: 'completed' as const } : c)),
    )
    toast.success('Đã tốt nghiệp lớp')
  }

  if (activeClassId) {
    const cls = classList.find((c) => c.id === activeClassId)
    if (cls) {
      return (
        <ClassDetailView
          cls={cls}
          onBack={() => setActiveClassId(null)}
        />
      )
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ClassesToolbar
        activeStatus={activeStatus}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          setPage(1)
        }}
        branchFilter={branchFilter}
        onBranchChange={(b) => {
          setBranchFilter(b)
          setPage(1)
        }}
        onFilterOpen={() => {}}
        onCreate={handleCreate}
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
          <ClassesTable
            classes={paged}
            selectedIds={selectedIds}
            onToggleAll={(checked, ids) => {
              setSelectedIds(checked ? new Set(ids) : new Set())
            }}
            onToggleOne={(id, checked) => {
              setSelectedIds((current) => {
                const next = new Set(current)
                if (checked) next.add(id)
                else next.delete(id)
                return next
              })
            }}
            onRowClick={(id) => setActiveClassId(id)}
            onView={(id) => setActiveClassId(id)}
            onEdit={handleEdit}
            onGraduate={handleGraduate}
          />
        </DataTableFrame>
      </div>

      <FilterSheetPanel
        open={false}
        sections={filterSections}
        onOpenChange={() => {}}
        onToggle={toggleFilterValue}
        onClearAll={() => {}}
        onApply={() => {}}
      />

      <ClassesFormDialog
        open={isCreateOpen}
        mode={editClassId ? 'edit' : 'create'}
        initial={editForm}
        branches={branches}
        levels={levels}
        teachers={teachers}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditClassId('')
          }
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
