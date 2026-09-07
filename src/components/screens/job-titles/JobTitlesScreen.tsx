'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  DataTableFrame,
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import { ConfirmDialog, StatusTile } from '@/components/shared'
import {
  mockJobTitles,
  addJobTitle,
  updateJobTitle,
  deleteJobTitle,
} from '@/mocks/jobTitles'
import { JobTitlesToolbar } from './JobTitlesToolbar'
import { JobTitlesTable } from './JobTitlesTable'
import { JobTitleAssignModal } from './JobTitleAssignModal'
import { JobTitleFormDialog } from './JobTitleFormDialog'
import { filterJobTitles } from './jobTitlesHelpers'
import type { JobTitle, JobTitlesFilterState } from './jobTitlesTypes'

export function JobTitlesScreen() {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>(() => [...mockJobTitles])

  // Filter state
  const [filters, setFilters] = useState<JobTitlesFilterState>({
    search: '',
    department: 'all',
    status: 'all',
    capacity: 'all',
  })

  // Status tile active ID
  const [activeTileId, setActiveTileId] = useState<string>('all')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedForAssign, setSelectedForAssign] = useState<JobTitle | null>(null)

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedForEdit, setSelectedForEdit] = useState<JobTitle | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<JobTitle | null>(null)

  // 1. Dynamic Status Tiles based on Department and Search filters (RULE-5 compliance)
  const statusTiles: StatusTile<string>[] = useMemo(() => {
    // Base items matching current department and search
    const baseItems = jobTitles.filter((item) => {
      if (filters.department && filters.department !== 'all' && item.department !== filters.department) {
        return false
      }
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase()
        if (!item.name.toLowerCase().includes(q) && !item.code.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })

    const total = baseItems.length
    const activeCount = baseItems.filter((i) => i.status === 'active').length
    const filledCount = baseItems.filter((i) => i.assignedEmployeeIds.length >= i.targetHeadcount).length
    const underCount = baseItems.filter((i) => i.assignedEmployeeIds.length < i.targetHeadcount).length
    const inactiveCount = baseItems.filter((i) => i.status === 'inactive').length

    return [
      { id: 'all', label: 'Tất cả chức danh', count: total, semantic: 'neutral' as const },
      { id: 'active', label: 'Đang áp dụng', count: activeCount, semantic: 'success' as const },
      { id: 'filled', label: 'Đạt định mức', count: filledCount, semantic: 'info' as const },
      { id: 'under_capacity', label: 'Thiếu nhân sự', count: underCount, semantic: 'warning' as const },
      { id: 'inactive', label: 'Tạm ngưng', count: inactiveCount, semantic: 'neutral' as const },
    ]
  }, [jobTitles, filters.department, filters.search])

  // Tile Selection Handler
  const handleTileSelect = (tileId: string) => {
    setActiveTileId(tileId)
    setPage(1)
    if (tileId === 'all') {
      setFilters((prev) => ({ ...prev, status: 'all', capacity: 'all' }))
    } else if (tileId === 'active') {
      setFilters((prev) => ({ ...prev, status: 'active', capacity: 'all' }))
    } else if (tileId === 'inactive') {
      setFilters((prev) => ({ ...prev, status: 'inactive', capacity: 'all' }))
    } else if (tileId === 'filled') {
      setFilters((prev) => ({ ...prev, capacity: 'filled', status: 'all' }))
    } else if (tileId === 'under_capacity') {
      setFilters((prev) => ({ ...prev, capacity: 'under_capacity', status: 'all' }))
    }
  }

  // Filter change handler
  const handleFilterChange = (newFilters: JobTitlesFilterState) => {
    setFilters(newFilters)
    setPage(1)
  }

  // Computed filtered items
  const filteredItems = useMemo(() => {
    return filterJobTitles(jobTitles, filters)
  }, [jobTitles, filters])

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, page, pageSize])

  // Actions
  const handleOpenAssignModal = (item: JobTitle) => {
    setSelectedForAssign(item)
    setAssignModalOpen(true)
  }

  const handleSaveAssignments = (jobTitleId: string, assignedIds: string[]) => {
    updateJobTitle(jobTitleId, { assignedEmployeeIds: assignedIds })
    setJobTitles((prev) =>
      prev.map((jt) => (jt.id === jobTitleId ? { ...jt, assignedEmployeeIds: assignedIds } : jt))
    )
    if (selectedForAssign?.id === jobTitleId) {
      setSelectedForAssign((prev) => (prev ? { ...prev, assignedEmployeeIds: assignedIds } : null))
    }
  }

  const handleOpenCreateDialog = () => {
    setFormMode('create')
    setSelectedForEdit(null)
    setFormDialogOpen(true)
  }

  const handleOpenEditDialog = (item: JobTitle) => {
    setFormMode('edit')
    setSelectedForEdit(item)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = (data: {
    code: string
    name: string
    department: string
    targetHeadcount: number
    description: string
    status: 'active' | 'inactive'
  }) => {
    if (formMode === 'create') {
      const created = addJobTitle(data)
      setJobTitles((prev) => [created, ...prev])
      toast.success(`Đã thêm mới chức danh "${data.name}" (${data.code})`)
    } else if (selectedForEdit) {
      const updated = updateJobTitle(selectedForEdit.id, data)
      if (updated) {
        setJobTitles((prev) => prev.map((jt) => (jt.id === updated.id ? updated : jt)))
        toast.success(`Đã cập nhật thông tin chức danh "${data.name}"`)
      }
    }
  }

  const handlePromptDelete = (item: JobTitle) => {
    setItemToDelete(item)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.assignedEmployeeIds.length > 0) {
      toast.error(
        `Không thể xóa chức danh "${itemToDelete.name}" vì đang có ${itemToDelete.assignedEmployeeIds.length} nhân sự đảm nhiệm. Vui lòng gỡ hết nhân sự trước khi xóa!`
      )
      setDeleteConfirmOpen(false)
      return
    }

    deleteJobTitle(itemToDelete.id)
    setJobTitles((prev) => prev.filter((jt) => jt.id !== itemToDelete.id))
    toast.success(`Đã xóa chức danh "${itemToDelete.name}"`)
    setItemToDelete(null)
    setDeleteConfirmOpen(false)
  }

  return (
    <div className="flex flex-col h-full min-h-0 px-4 py-3 lg:px-6">
      {/* 1. TOOLBAR & STATUS TILES */}
      <JobTitlesToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        statusTiles={statusTiles}
        activeTileId={activeTileId}
        onTileSelect={handleTileSelect}
        onOpenCreateDialog={handleOpenCreateDialog}
      />

      {/* 2. DATA TABLE FRAME */}
      <div className="flex-1 min-h-0 mt-2">
        <DataTableFrame className="h-full">
          <JobTitlesTable
            items={paginatedItems}
            onOpenAssignModal={handleOpenAssignModal}
            onEdit={handleOpenEditDialog}
            onDelete={handlePromptDelete}
          />
        </DataTableFrame>
      </div>

      {/* 3. PAGINATION FOOTER */}
      <div className="shrink-0 pt-2">
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          total={filteredItems.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setPage(1)
          }}
        />
      </div>

      {/* 4. MODALS */}
      <JobTitleAssignModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        jobTitle={selectedForAssign}
        onSaveAssignments={handleSaveAssignments}
      />

      <JobTitleFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        mode={formMode}
        initialData={selectedForEdit}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa chức danh công việc"
        description={
          itemToDelete?.assignedEmployeeIds && itemToDelete.assignedEmployeeIds.length > 0
            ? `Chức danh "${itemToDelete?.name}" đang có ${itemToDelete.assignedEmployeeIds.length} nhân sự đảm nhiệm. Hệ thống sẽ chặn thao tác xóa này.`
            : `Bạn có chắc chắn muốn xóa vĩnh viễn chức danh "${itemToDelete?.name}" (${itemToDelete?.code})? Thao tác này không thể hoàn tác.`
        }
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default JobTitlesScreen
