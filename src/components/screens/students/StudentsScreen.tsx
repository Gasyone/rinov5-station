'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { getStudents } from '@/mocks/students'
import { StudentsToolbar } from './StudentsToolbar'
import { StudentsTable } from './StudentsTable'
import type { StudentStatusId } from './studentTypes'

import { StudentDetailView } from './StudentDetailView'

export function StudentsScreen() {
  const [activeStatus, setActiveStatus] = useState<StudentStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      getStudents({
        search: searchQuery,
        branch: branchFilter || undefined,
        status: activeStatus === 'all' ? undefined : activeStatus,
      }),
    [searchQuery, branchFilter, activeStatus],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (activeStudentId) {
    return (
      <StudentDetailView
        studentId={activeStudentId}
        onBack={() => setActiveStudentId(null)}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <StudentsToolbar
        activeStatus={activeStatus}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1) }}
        branchFilter={branchFilter}
        onBranchChange={(b) => { setBranchFilter(b); setPage(1) }}
        onFilterOpen={() => {}}
        onCreate={() => toast.info('Màn tạo học viên sẽ được phát triển')}
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
            onView={(id) => setActiveStudentId(id)}
          />
        </DataTableFrame>
      </div>
    </div>
  )
}
