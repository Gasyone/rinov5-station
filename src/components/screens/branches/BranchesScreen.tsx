'use client'

import { useState, useMemo } from 'react'
import {
  ConfirmDialog,
  StatusTiles,
} from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { mockBranches, type Branch, type BranchRoom } from '@/mocks/branches'
import { BranchesToolbar } from './BranchesToolbar'
import { BranchesTable } from './BranchesTable'
import { BranchCreateDialog } from './BranchCreateDialog'
import { BranchDetailDialog } from './BranchDetailDialog'
import {
  calculateBranchMetrics,
  filterBranches,
} from './branchesHelpers'
import type { BranchFilterState } from './branchesTypes'

export function BranchesScreen() {
  const [branches, setBranches] = useState<Branch[]>(() => [...mockBranches])
  const [filters, setFilters] = useState<BranchFilterState>({
    search: '',
    status: 'all',
    region: 'all',
    type: 'all',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDetailEditMode, setIsDetailEditMode] = useState(false)
  const [detailInitialTab, setDetailInitialTab] = useState<'facilities' | 'staff'>('facilities')

  // Confirm dialog state for locking/unlocking
  const [confirmTarget, setConfirmTarget] = useState<Branch | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const baseBranchesForCounts = useMemo(() => {
    return filterBranches(branches, { ...filters, status: 'all' })
  }, [branches, filters])

  const metrics = useMemo(() => calculateBranchMetrics(baseBranchesForCounts), [baseBranchesForCounts])

  const filteredBranches = useMemo(() => {
    return filterBranches(branches, filters)
  }, [branches, filters])

  // Pagination slice
  const paginatedBranches = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBranches.slice(start, start + pageSize)
  }, [filteredBranches, currentPage, pageSize])

  const handleFilterChange = (updates: Partial<BranchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
    setCurrentPage(1)
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedBranches.map((b) => b.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleCreateBranch = (newBranchData: Partial<Branch>) => {
    const newBranch: Branch = {
      id: `br-${Date.now()}`,
      code: newBranchData.code || 'BR_NEW',
      name: newBranchData.name || 'Cơ sở mới',
      type: newBranchData.type || 'training_center',
      typeLabel: newBranchData.typeLabel || 'Trung tâm Đào tạo',
      region: newBranchData.region || 'Miền Bắc - Hà Nội',
      province: newBranchData.province || 'Hà Nội',
      district: newBranchData.district || '',
      address: newBranchData.address || '',
      phone: newBranchData.phone || '',
      email: newBranchData.email || '',
      coordinates: newBranchData.coordinates || '',
      status: 'setup',
      statusLabel: 'Mới thiết lập',
      managerId: 'emp-new',
      managerName: newBranchData.managerName || 'Chưa phân công',
      managerPhone: newBranchData.managerPhone || '',
      managerEmail: newBranchData.managerEmail || '',
      roomCount: newBranchData.roomCount || 1,
      totalCapacity: newBranchData.totalCapacity || 20,
      activeClassesCount: 0,
      activeStudentsCount: 0,
      businessHours: newBranchData.businessHours || {
        openTime: '08:00',
        closeTime: '21:30',
        daysOfWeek: 'Thứ 2 - Chủ Nhật',
      },
      rooms: newBranchData.rooms || [],
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          actor: 'Admin Hệ thống',
          action: 'Khởi tạo cơ sở',
          details: 'Tạo mới chi nhánh cơ sở vật chất',
        },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    setBranches((prev) => [newBranch, ...prev])
  }

  const handleToggleStatusClick = (branch: Branch) => {
    setConfirmTarget(branch)
    setIsConfirmOpen(true)
  }

  const handleConfirmStatusChange = () => {
    if (!confirmTarget) return

    const nextStatus = confirmTarget.status === 'active' ? 'inactive' : 'active'
    const nextLabel = nextStatus === 'active' ? 'Đang hoạt động' : 'Tạm dừng'

    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== confirmTarget.id) return b
        return {
          ...b,
          status: nextStatus,
          statusLabel: nextLabel,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: new Date().toLocaleString('vi-VN'),
              actor: 'Admin Hệ thống',
              action: nextStatus === 'active' ? 'Kích hoạt hoạt động' : 'Tạm dừng cơ sở',
              details: `Chuyển trạng thái cơ sở sang ${nextLabel}`,
            },
            ...b.history,
          ],
        }
      })
    )

    if (selectedBranch && selectedBranch.id === confirmTarget.id) {
      setSelectedBranch((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              statusLabel: nextLabel,
            }
          : null
      )
    }

    setIsConfirmOpen(false)
    setConfirmTarget(null)
  }

  const handleAddRoom = (branchId: string, room: BranchRoom) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b
        const updatedRooms = [...b.rooms, room]
        return {
          ...b,
          rooms: updatedRooms,
          roomCount: updatedRooms.length,
          totalCapacity: updatedRooms.reduce((sum, r) => sum + r.capacity, 0),
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: new Date().toLocaleString('vi-VN'),
              actor: 'Admin Hệ thống',
              action: 'Khai báo phòng học',
              details: `Thêm mới ${room.name} (Sức chứa ${room.capacity} HV)`,
            },
            ...b.history,
          ],
        }
      })
    )

    if (selectedBranch && selectedBranch.id === branchId) {
      setSelectedBranch((prev) => {
        if (!prev) return null
        const updatedRooms = [...prev.rooms, room]
        return {
          ...prev,
          rooms: updatedRooms,
          roomCount: updatedRooms.length,
          totalCapacity: updatedRooms.reduce((sum, r) => sum + r.capacity, 0),
        }
      })
    }
  }

  const handleUpdateBranch = (branchId: string, updates: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b
        const updatedBranch: Branch = {
          ...b,
          ...updates,
          updatedAt: new Date().toISOString().slice(0, 10),
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              actor: 'Admin Hệ thống',
              action: 'Cập nhật thông tin',
              details: 'Cập nhật thuộc tính hồ sơ chi nhánh',
            },
            ...b.history,
          ],
        }
        return updatedBranch
      })
    )

    setSelectedBranch((prev) => (prev && prev.id === branchId ? { ...prev, ...updates } : prev))
  }

  const statusTilesOptions = [
    { id: 'all', label: 'Tất cả cơ sở', count: metrics.total },
    { id: 'active', label: 'Đang hoạt động', count: metrics.active, status: 'active' },
    { id: 'setup', label: 'Mới thiết lập', count: metrics.setup, status: 'setup' },
    { id: 'inactive', label: 'Tạm dừng', count: metrics.inactive, status: 'inactive' },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Toolbar & Status Tiles */}
      <div className="shrink-0 flex flex-col gap-2.5 px-4 pt-3 pb-2 lg:px-6">
        <BranchesToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onCreateClick={() => setIsCreateOpen(true)}
        />

        <StatusTiles
          tiles={statusTilesOptions}
          activeId={filters.status}
          onSelect={(val: string) => handleFilterChange({ status: val })}
        />
      </div>

      {/* Data Table filling full height down to bottom */}
      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3 lg:px-6">
        <DataTableFrame
          className="h-full"
          footer={
            <DataTablePagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredBranches.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
            />
          }
        >
          <BranchesTable
            branches={paginatedBranches}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewDetail={(branch, tab) => {
              setSelectedBranch(branch)
              setIsDetailEditMode(false)
              setDetailInitialTab(tab || 'facilities')
              setIsDetailOpen(true)
            }}
            onEdit={(branch) => {
              setSelectedBranch(branch)
              setIsDetailEditMode(true)
              setDetailInitialTab('facilities')
              setIsDetailOpen(true)
            }}
            onToggleStatus={handleToggleStatusClick}
          />
        </DataTableFrame>
      </div>

      {/* Create Dialog */}
      <BranchCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        existingBranches={branches}
        onSubmit={handleCreateBranch}
      />

      {/* Detail Dialog */}
      <BranchDetailDialog
        branch={selectedBranch}
        open={isDetailOpen}
        initialEditMode={isDetailEditMode}
        initialTab={detailInitialTab}
        onOpenChange={setIsDetailOpen}
        onToggleStatus={handleToggleStatusClick}
        onAddRoom={handleAddRoom}
        onUpdateBranch={handleUpdateBranch}
      />

      {/* Confirm Dialog for Lock/Unlock */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={
          confirmTarget?.status === 'active'
            ? 'Xác nhận tạm dừng hoạt động cơ sở'
            : 'Xác nhận kích hoạt lại cơ sở'
        }
        description={
          confirmTarget?.status === 'active'
            ? `Bạn có chắc chắn muốn chuyển cơ sở "${confirmTarget?.name}" sang trạng thái tạm dừng? Toàn bộ hoạt động xếp lịch học mới tại cơ sở này sẽ bị tạm khóa.`
            : `Kích hoạt lại cơ sở "${confirmTarget?.name}" để cho phép mở lớp và xếp lịch học.`
        }
        confirmLabel={confirmTarget?.status === 'active' ? 'Tạm dừng cơ sở' : 'Kích hoạt'}
        cancelLabel="Hủy bỏ"
        variant={confirmTarget?.status === 'active' ? 'destructive' : 'default'}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  )
}
