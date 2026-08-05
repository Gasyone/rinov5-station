'use client'

import React, { useState, useMemo } from 'react'
import { CareConditionsConfigToolbar } from './CareConditionsConfigToolbar'
import { CareConditionsConfigTable } from './CareConditionsConfigTable'
import { CareConditionFormDialog } from './CareConditionFormDialog'
import { MOCK_CARE_CONDITIONS } from './careConditionsMockData'
import { CareConditionConfig, CareConditionsFilterState, PrimaryStaffRole } from './careConditionsTypes'
import { StatusTile } from '@/components/shared'
import { toast } from 'sonner'

export const CareConditionsConfigScreen: React.FC = () => {
  const [conditions, setConditions] = useState<CareConditionConfig[]>(MOCK_CARE_CONDITIONS)

  // Filters state
  const [filters, setFilters] = useState<CareConditionsFilterState>({
    search: '',
    category: 'all',
    nature: 'all',
    primaryRole: 'all',
    priority: 'all',
    status: 'all',
  })

  // Pagination states
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Form dialog state
  const [selectedCondition, setSelectedCondition] = useState<CareConditionConfig | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Computed filtered items
  const filteredConditions = useMemo(() => {
    return conditions.filter((item) => {
      // 1. Nature filter (from status tiles)
      if (filters.nature && filters.nature !== 'all' && item.nature !== filters.nature) {
        return false
      }

      // 2. Primary Role filter
      if (filters.primaryRole && filters.primaryRole !== 'all') {
        const itemRoles = item.assignedRoles && item.assignedRoles.length > 0 ? item.assignedRoles : [item.primaryRole]
        if (!itemRoles.includes(filters.primaryRole as PrimaryStaffRole) && item.primaryRole !== filters.primaryRole) {
          return false
        }
      }

      // 3. Priority filter
      if (filters.priority && filters.priority !== 'all' && item.priority !== filters.priority) {
        return false
      }

      // 4. Status filter
      if (filters.status === 'active' && !item.isActive) return false
      if (filters.status === 'inactive' && item.isActive) return false

      // 5. Metric Source filter
      if (filters.metricSource && filters.metricSource !== 'all') {
        const itemSource = item.triggerRule?.source || 'curriculum_path'
        if (itemSource !== filters.metricSource) return false
      }

      // 6. Search query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const matchCode = item.code.toLowerCase().includes(q)
        const matchName = item.name.toLowerCase().includes(q)
        const matchRole = item.primaryRoleLabel.toLowerCase().includes(q)
        if (!matchCode && !matchName && !matchRole) return false
      }

      return true
    })
  }, [conditions, filters])

  // Paginated items
  const paginatedConditions = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredConditions.slice(start, start + pageSize)
  }, [filteredConditions, page, pageSize])

  // Status tiles computation
  const statusTiles: StatusTile<string>[] = useMemo(() => {
    const total = conditions.length
    const dacBiet = conditions.filter((c) => c.nature === 'dac_biet').length
    const taiPhi = conditions.filter((c) => c.nature === 'tai_phi').length
    const hanhTrinh = conditions.filter((c) => c.nature === 'theo_hanh_trinh' || c.nature === 'theo_moc').length
    const dinhKy = conditions.filter((c) => c.nature === 'dinh_ky').length
    const yeuCau = conditions.filter((c) => c.nature === 'theo_yeu_cau').length
    const activeCount = conditions.filter((c) => c.isActive).length

    return [
      { id: 'all', label: 'Tất cả danh mục', count: total, semantic: 'neutral' as const },
      { id: 'dac_biet', label: 'CSĐB · Chăm sóc đặc biệt', count: dacBiet, semantic: 'error' as const },
      { id: 'tai_phi', label: 'TP · Tái phí', count: taiPhi, semantic: 'success' as const },
      { id: 'theo_hanh_trinh', label: 'THT · Theo hành trình học', count: hanhTrinh, semantic: 'info' as const },
      { id: 'dinh_ky', label: 'ĐK · Định kỳ', count: dinhKy, semantic: 'purple' as const },
      { id: 'theo_yeu_cau', label: 'TYC · Theo yêu cầu', count: yeuCau, semantic: 'warning' as const },
    ]
  }, [conditions])

  // Handlers
  const handleToggleStatus = (id: string, newActive: boolean) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newActive, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : c))
    )
    toast.success(`Đã ${newActive ? 'kích hoạt áp dụng' : 'tạm dừng'} mã điều kiện!`)
  }

  const handleBatchToggleStatus = (ids: string[], newActive: boolean) => {
    setConditions((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, isActive: newActive, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : c))
    )
    toast.success(`Đã ${newActive ? 'kích hoạt' : 'tạm dừng'} áp dụng cho ${ids.length} điều kiện được chọn!`)
  }

  const handleDeleteCondition = (id: string) => {
    const target = conditions.find((c) => c.id === id)
    setConditions((prev) => prev.filter((c) => c.id !== id))
    toast.success(`Đã xóa thành công mã điều kiện ${target?.code || ''}!`)
  }

  const handleBatchDelete = (ids: string[]) => {
    setConditions((prev) => prev.filter((c) => !ids.includes(c.id)))
    toast.success(`Đã xóa thành công ${ids.length} điều kiện được chọn!`)
  }

  const handleOpenCreateDialog = () => {
    setSelectedCondition(null)
    setIsFormOpen(true)
  }

  const handleOpenEditDialog = (item: CareConditionConfig) => {
    setSelectedCondition(item)
    setIsFormOpen(true)
  }

  const handleSaveCondition = (data: Partial<CareConditionConfig>) => {
    if (data.id) {
      // Update existing
      setConditions((prev) =>
        prev.map((item) => {
          if (item.id !== data.id) return item
          return {
            ...item,
            ...data,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          } as CareConditionConfig
        })
      )
      toast.success(`Đã cập nhật cấu hình điều kiện ${data.code}!`)
    } else {
      // Create new
      const newCondition: CareConditionConfig = {
        id: `COND-${Date.now()}`,
        code: data.code || 'MỚI-01',
        name: data.name || '',
        category: data.category || 'hoc_tap',
        nature: data.nature || 'dac_biet',
        natureLabel: data.natureLabel || 'Chăm sóc đặc biệt',
        primaryRole: data.primaryRole || 'CS',
        primaryRoleLabel: data.primaryRoleLabel || 'Chuyên viên CS',
        slaHours: data.slaHours || 24,
        slaLabel: data.slaLabel || 'Trong 24 giờ',
        priority: data.priority || 'high',
        dataProvidedToParent: data.dataProvidedToParent,
        focusContent: data.focusContent || [],
        isActive: data.isActive ?? true,
        autoTriggerRule: data.autoTriggerRule,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }
      setConditions((prev) => [newCondition, ...prev])
      toast.success(`Đã thêm mới điều kiện ${newCondition.code} vào danh mục hệ thống!`)
    }
  }

  const handleExportData = () => {
    toast.success(`Đã xuất danh mục ${filteredConditions.length} điều kiện chăm sóc ra file Excel!`)
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3 lg:px-6 h-[calc(100vh-3.5rem)] overflow-hidden flex-1">
      {/* Toolbar & Filters */}
      <CareConditionsConfigToolbar
        filters={filters}
        onFilterChange={setFilters}
        statusTiles={statusTiles}
        totalCount={filteredConditions.length}
        onOpenCreateDialog={handleOpenCreateDialog}
        onExportData={handleExportData}
      />

      {/* Main Table Workspace */}
      <CareConditionsConfigTable
        conditions={paginatedConditions}
        onEditCondition={handleOpenEditDialog}
        onToggleStatus={handleToggleStatus}
        onDeleteCondition={handleDeleteCondition}
        onBatchToggleStatus={handleBatchToggleStatus}
        onBatchDelete={handleBatchDelete}
        pagination={{
          page,
          pageSize,
          total: filteredConditions.length,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size)
            setPage(1)
          },
        }}
      />

      {/* Form Dialog for Create & Edit */}
      {isFormOpen && (
        <CareConditionFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          condition={selectedCondition}
          onSave={handleSaveCondition}
          onDelete={handleDeleteCondition}
        />
      )}
    </div>
  )
}
