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
import { JobTitleFormDialog } from './JobTitleFormDialog'
import { filterJobTitles } from './jobTitlesHelpers'
import type { JobTitle, JobTitlesFilterState } from './jobTitlesTypes'

export function JobTitlesScreen() {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>(() => [...mockJobTitles])

  // Filter state (chỉ gồm tìm kiếm, khối phòng ban và trạng thái Áp dụng / Tạm ngưng)
  const [filters, setFilters] = useState<JobTitlesFilterState>({
    search: '',
    department: 'all',
    status: 'all',
  })

  // Selected row IDs for checkboxes
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Status tile active ID
  const [activeTileId, setActiveTileId] = useState<string>('all')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // Modals state
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedForEdit, setSelectedForEdit] = useState<JobTitle | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<JobTitle | null>(null)

  // 1. Dynamic Status Tiles (Chỉ gồm Tất cả, Áp dụng, Tạm ngưng)
  const statusTiles: StatusTile<string>[] = useMemo(() => {
    const baseItems = jobTitles.filter((item) => {
      if (
        filters.department &&
        filters.department !== 'all' &&
        item.department !== filters.department &&
        item.orgUnitId !== filters.department
      ) {
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
    const inactiveCount = baseItems.filter((i) => i.status === 'inactive').length

    return [
      { id: 'all', label: 'Tất cả chức danh', count: total, semantic: 'neutral' as const },
      { id: 'active', label: 'Áp dụng', count: activeCount, semantic: 'success' as const },
      { id: 'inactive', label: 'Tạm ngưng', count: inactiveCount, semantic: 'neutral' as const },
    ]
  }, [jobTitles, filters.department, filters.search])

  // Tile Selection Handler
  const handleTileSelect = (tileId: string) => {
    setActiveTileId(tileId)
    setPage(1)
    if (tileId === 'all') {
      setFilters((prev) => ({ ...prev, status: 'all' }))
    } else if (tileId === 'active') {
      setFilters((prev) => ({ ...prev, status: 'active' }))
    } else if (tileId === 'inactive') {
      setFilters((prev) => ({ ...prev, status: 'inactive' }))
    }
  }

  // Filter change handler
  const handleFilterChange = (newFilters: JobTitlesFilterState) => {
    setFilters(newFilters)
    setActiveTileId(newFilters.status)
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

  // Toggle selection for individual row
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Toggle select all on current page
  const handleToggleSelectAll = () => {
    const visibleIds = paginatedItems.map((i) => i.id)
    const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))

    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (isAllSelected) {
        visibleIds.forEach((id) => next.delete(id))
      } else {
        visibleIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  // Actions
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
    orgUnitId?: string
    targetHeadcount?: number
    description: string
    status: 'active' | 'inactive'
    assignedEmployeeIds?: string[]
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
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(itemToDelete.id)
      return next
    })
    toast.success(`Đã xóa chức danh "${itemToDelete.name}"`)
    setItemToDelete(null)
    setDeleteConfirmOpen(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* 1. TOOLBAR & STATUS TILES */}
      <div className="px-4 pt-3 lg:px-6 shrink-0">
        <JobTitlesToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          statusTiles={statusTiles}
          activeTileId={activeTileId}
          onTileSelect={handleTileSelect}
          onOpenCreateDialog={handleOpenCreateDialog}
        />
      </div>

      {/* 2. DATA TABLE FRAME (Bảng sát footer màn/trình duyệt) */}
      <div className="min-h-0 flex-1 overflow-hidden px-4 pt-2 pb-0 lg:px-6">
        <DataTableFrame
          className="h-full rounded-t-lg rounded-b-none border-b-0"
          footer={
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
          }
        >
          <JobTitlesTable
            items={paginatedItems}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onEdit={handleOpenEditDialog}
            onDelete={handlePromptDelete}
          />
        </DataTableFrame>
      </div>

      {/* 4. MODALS */}
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
