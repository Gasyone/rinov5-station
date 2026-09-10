'use client'

import React, { useState, useMemo } from 'react'
import {
  MOCK_DATA_POOLS,
  MOCK_PIPELINE_STAGES,
} from './leadLifecycleMockData'
import {
  PipelineStageConfig,
  PipelineSubStatusConfig,
  DataPoolConfig,
} from './leadLifecycleTypes'
import { getStagePhase } from './leadLifecycleHelpers'
import { LeadLifecyclePipelineTab } from './LeadLifecyclePipelineTab'
import { LeadLifecycleDiagramView } from './LeadLifecycleDiagramView'
import { LeadLifecyclePoolModal } from './LeadLifecyclePoolModal'
import { LeadLifecycleFormDialog } from './LeadLifecycleFormDialog'
import { LeadLifecycleSubStatusDialog } from './LeadLifecycleSubStatusDialog'
import { ConfirmDialog } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Database,
  ChevronsUpDown,
  Network,
  ListFilter,
} from 'lucide-react'
import { toast } from 'sonner'

export const LeadLifecycleConfigScreen: React.FC = () => {
  // Master data states
  const [stages, setStages] = useState<PipelineStageConfig[]>(MOCK_PIPELINE_STAGES)
  const [pools, setPools] = useState<DataPoolConfig[]>(MOCK_DATA_POOLS)

  // Pool Management Modal state
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false)

  // Dual View Mode: 'diagram' or 'list'
  const [viewMode, setViewMode] = useState<'diagram' | 'list'>('diagram')

  // Filter states
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [originFilter, setOriginFilter] = useState('all')

  // Expanded stages state (mặc định mở 3 bước đầu)
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    () => new Set(['stage-new', 'stage-qt', 'stage-tad'])
  )

  // Dialog states for Stage / Pool
  const [dialogType, setDialogType] = useState<'stage' | 'pool'>('stage')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<PipelineStageConfig | null>(null)
  const [editingPool, setEditingPool] = useState<DataPoolConfig | null>(null)

  // Dialog states for Sub-Status
  const [isSubStatusDialogOpen, setIsSubStatusDialogOpen] = useState(false)
  const [subStatusStage, setSubStatusStage] = useState<PipelineStageConfig | null>(null)
  const [editingSubStatus, setEditingSubStatus] = useState<PipelineSubStatusConfig | null>(null)

  // Confirm delete pool
  const [deletingPoolId, setDeletingPoolId] = useState<string | null>(null)
  const [isConfirmDeletePoolOpen, setIsConfirmDeletePoolOpen] = useState(false)

  // Confirm delete stage
  const [deletingStageId, setDeletingStageId] = useState<string | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  // Confirm delete sub-status
  const [deletingSubStatusInfo, setDeletingSubStatusInfo] = useState<{
    stageId: string
    subStatusId: string
  } | null>(null)
  const [isConfirmDeleteSubStatusOpen, setIsConfirmDeleteSubStatusOpen] = useState(false)

  // Expansion handlers
  const toggleExpand = (stageId: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev)
      if (next.has(stageId)) {
        next.delete(stageId)
      } else {
        next.add(stageId)
      }
      return next
    })
  }

  const handleToggleExpandAll = () => {
    if (expandedStages.size === filteredStages.length) {
      setExpandedStages(new Set())
    } else {
      setExpandedStages(new Set(filteredStages.map((s) => s.id)))
    }
  }

  // Filter logic
  const filteredStages = useMemo(() => {
    return stages
      .filter((stage) => {
        if (phaseFilter !== 'all') {
          const stagePhase = getStagePhase(stage)
          if (stagePhase !== phaseFilter) {
            return false
          }
        }
        if (typeFilter !== 'all' && stage.stageType !== typeFilter) {
          return false
        }
        if (originFilter !== 'all') {
          const hasMatchingSub = (stage.subStatuses || []).some(
            (sub) => sub.origin === originFilter
          )
          if (!hasMatchingSub) return false
        }
        return true
      })
      .sort((a, b) => a.order - b.order)
  }, [stages, phaseFilter, typeFilter, originFilter])

  // Handlers for stages
  const handleAddNewStage = () => {
    setEditingStage(null)
    setDialogType('stage')
    setIsFormOpen(true)
  }

  const handleEditStage = (stage: PipelineStageConfig) => {
    setEditingStage(stage)
    setDialogType('stage')
    setIsFormOpen(true)
  }

  const handleDeleteStage = (stageId: string) => {
    setDeletingStageId(stageId)
    setIsConfirmDeleteOpen(true)
  }

  const confirmDeleteStage = () => {
    if (!deletingStageId) return
    setStages((prev) => prev.filter((s) => s.id !== deletingStageId))
    toast.success('Đã xóa trạng thái phễu thành công')
    setIsConfirmDeleteOpen(false)
    setDeletingStageId(null)
  }

  const handleMoveStage = (stageId: string, direction: 'up' | 'down') => {
    setStages((prev) => {
      const index = prev.findIndex((s) => s.id === stageId)
      if (index === -1) return prev
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === prev.length - 1) return prev

      const targetIndex = direction === 'up' ? index - 1 : index + 1
      const updated = [...prev]
      const temp = updated[index]
      updated[index] = updated[targetIndex]
      updated[targetIndex] = temp

      // Update order property
      return updated.map((item, idx) => ({ ...item, order: idx + 1 }))
    })
    toast.info('Đã cập nhật thứ tự bước phễu')
  }

  const handleSaveStage = (savedStage: PipelineStageConfig) => {
    setStages((prev) => {
      const exists = prev.some((s) => s.id === savedStage.id)
      if (exists) {
        return prev.map((s) => (s.id === savedStage.id ? { ...savedStage, subStatuses: s.subStatuses } : s))
      }
      return [...prev, { ...savedStage, subStatuses: [] }].map((item, idx) => ({
        ...item,
        order: idx + 1,
      }))
    })
    toast.success('Đã lưu cấu hình trạng thái phễu')
  }

  // Handlers for Sub-statuses
  const handleAddNewSubStatus = (stage: PipelineStageConfig) => {
    setSubStatusStage(stage)
    setEditingSubStatus(null)
    setIsSubStatusDialogOpen(true)
  }

  const handleEditSubStatus = (
    stage: PipelineStageConfig,
    subStatus: PipelineSubStatusConfig
  ) => {
    setSubStatusStage(stage)
    setEditingSubStatus(subStatus)
    setIsSubStatusDialogOpen(true)
  }

  const handleSaveSubStatus = (stageId: string, subStatus: PipelineSubStatusConfig) => {
    if (subStatus.origin === 'system') {
      toast.error('Không thể sửa đổi nhãn liên kết hệ thống')
      return
    }
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage
        const existingSubs = stage.subStatuses || []
        const exists = existingSubs.some((s) => s.id === subStatus.id)
        const updatedSubs = exists
          ? existingSubs.map((s) => (s.id === subStatus.id ? subStatus : s))
          : [...existingSubs, subStatus]
        return {
          ...stage,
          subStatuses: updatedSubs,
        }
      })
    )
    toast.success('Đã lưu cấu hình nhãn trạng thái con')
  }

  const handleDeleteSubStatus = (stageId: string, subStatusId: string) => {
    const targetStage = stages.find((s) => s.id === stageId)
    const targetSub = targetStage?.subStatuses?.find((s) => s.id === subStatusId)
    if (targetSub?.origin === 'system' || targetSub?.isSystemCore) {
      toast.error('Nhãn liên kết hệ thống không thể xóa')
      return
    }
    setDeletingSubStatusInfo({ stageId, subStatusId })
    setIsConfirmDeleteSubStatusOpen(true)
  }

  const confirmDeleteSubStatus = () => {
    if (!deletingSubStatusInfo) return
    const { stageId, subStatusId } = deletingSubStatusInfo
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage
        return {
          ...stage,
          subStatuses: (stage.subStatuses || []).filter((s) => s.id !== subStatusId),
        }
      })
    )
    toast.success('Đã xóa nhãn trạng thái con')
    setIsConfirmDeleteSubStatusOpen(false)
    setDeletingSubStatusInfo(null)
  }

  const handleToggleSubStatusActive = (stageId: string, subStatusId: string) => {
    const targetStage = stages.find((s) => s.id === stageId)
    const targetSub = targetStage?.subStatuses?.find((s) => s.id === subStatusId)
    if (targetSub?.origin === 'system' || targetSub?.isSystemCore) {
      toast.warning('Nhãn liên kết hệ thống luôn hoạt động tự động theo nghiệp vụ')
      return
    }
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage
        return {
          ...stage,
          subStatuses: (stage.subStatuses || []).map((s) =>
            s.id === subStatusId ? { ...s, isActive: !s.isActive } : s
          ),
        }
      })
    )
    toast.info('Đã cập nhật trạng thái kích hoạt của nhãn')
  }

  // Handlers for pools
  const handleAddNewPool = () => {
    setEditingPool(null)
    setDialogType('pool')
    setIsFormOpen(true)
  }

  const handleEditPool = (pool: DataPoolConfig) => {
    setEditingPool(pool)
    setDialogType('pool')
    setIsFormOpen(true)
  }

  const handleSavePool = (savedPool: DataPoolConfig) => {
    setPools((prev) => {
      const exists = prev.some((p) => p.id === savedPool.id)
      if (exists) {
        return prev.map((p) => (p.id === savedPool.id ? savedPool : p))
      }
      return [...prev, savedPool]
    })
    toast.success('Đã lưu cấu hình Kho Dữ liệu')
  }

  // Pool deletion handlers
  const handleDeletePool = (poolId: string) => {
    setDeletingPoolId(poolId)
    setIsConfirmDeletePoolOpen(true)
  }

  const confirmDeletePool = () => {
    if (!deletingPoolId) return
    setPools((prev) => prev.filter((p) => p.id !== deletingPoolId))
    toast.success('Đã xóa kho dữ liệu thành công')
    setIsConfirmDeletePoolOpen(false)
    setDeletingPoolId(null)
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-y-auto space-y-4 px-4 py-3 lg:px-6 pb-12 custom-scrollbar">
      {/* Top Single Header Toolbar: Filters on Left, Actions on Right */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Left: Dual View Switcher & Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dual-view Switcher */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('diagram')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
                viewMode === 'diagram'
                  ? 'bg-background text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Sơ đồ quy trình</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Danh sách chi tiết</span>
            </button>
          </div>

          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="h-8 text-xs w-[150px] bg-background">
              <SelectValue placeholder="Nhóm giai đoạn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhóm</SelectItem>
              <SelectItem value="T0">[T0] Tiếp nhận</SelectItem>
              <SelectItem value="T1">[T1] Tư vấn</SelectItem>
              <SelectItem value="T2">[T2] Test &amp; Học thử</SelectItem>
              <SelectItem value="T3">[T3] Chốt deal</SelectItem>
              <SelectItem value="T4">[T4] Vận đơn &amp; Thu phí</SelectItem>
              <SelectItem value="T5">[T5] Thành công</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 text-xs w-[140px] bg-background">
              <SelectValue placeholder="Loại trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="in_progress">Đang tiến hành</SelectItem>
              <SelectItem value="won">Thành công (Won)</SelectItem>
              <SelectItem value="global_lost">Thất bại (Lost)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="h-8 text-xs w-[150px] bg-background">
              <SelectValue placeholder="Loại nhãn con" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại nhãn</SelectItem>
              <SelectItem value="system">⚙️ Nhãn Hệ thống</SelectItem>
              <SelectItem value="custom">✏️ Nhãn Tùy biến</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === 'list' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleExpandAll}
              className="h-8 text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground bg-background"
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
              <span>
                {expandedStages.size === filteredStages.length ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
              </span>
            </Button>
          )}
        </div>

        {/* Right: Actions (Kho Dữ liệu Modal, Thêm trạng thái, Stats badge) */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPoolModalOpen(true)}
            className="h-8 text-xs gap-1.5 cursor-pointer border-pink-200 text-pink-700 bg-pink-50/50 hover:bg-pink-100 hover:text-pink-800 dark:bg-pink-950/30 dark:border-pink-900/50 dark:text-pink-300 shadow-2xs"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Kho dữ liệu ({pools.length})</span>
          </Button>

          <Button
            onClick={handleAddNewStage}
            size="sm"
            className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm trạng thái</span>
          </Button>
        </div>
      </div>

      {/* Main Screen Content: Sơ đồ quy trình (Diagram) hoặc Danh sách thẻ Accordion (List) */}
      {viewMode === 'diagram' ? (
        <LeadLifecycleDiagramView
          stages={filteredStages}
          onEditStage={handleEditStage}
          onAddNewSubStatus={handleAddNewSubStatus}
          onEditSubStatus={handleEditSubStatus}
        />
      ) : (
        <LeadLifecyclePipelineTab
          stages={filteredStages}
          onEditStage={handleEditStage}
          onDeleteStage={handleDeleteStage}
          onMoveStage={handleMoveStage}
          onAddNewSubStatus={handleAddNewSubStatus}
          onEditSubStatus={handleEditSubStatus}
          onDeleteSubStatus={handleDeleteSubStatus}
          onToggleSubStatusActive={handleToggleSubStatusActive}
          expandedStages={expandedStages}
          onToggleExpand={toggleExpand}
        />
      )}

      {/* Modal Quản lý Kho Dữ liệu */}
      <LeadLifecyclePoolModal
        open={isPoolModalOpen}
        onOpenChange={setIsPoolModalOpen}
        pools={pools}
        onAddNewPool={handleAddNewPool}
        onEditPool={handleEditPool}
        onDeletePool={handleDeletePool}
      />

      {/* Form Dialog for Stage / Pool */}
      <LeadLifecycleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        type={dialogType}
        initialStage={editingStage}
        initialPool={editingPool}
        onSaveStage={handleSaveStage}
        onSavePool={handleSavePool}
      />

      {/* Dialog for Sub-Status */}
      <LeadLifecycleSubStatusDialog
        open={isSubStatusDialogOpen}
        onOpenChange={setIsSubStatusDialogOpen}
        stage={subStatusStage}
        initialSubStatus={editingSubStatus}
        onSaveSubStatus={handleSaveSubStatus}
      />

      {/* Confirm Delete Stage Dialog */}
      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="Xác nhận xóa trạng thái phễu"
        description="Bạn có chắc chắn muốn xóa trạng thái này khỏi quy trình tuyển sinh? Các hồ sơ Lead đang ở trạng thái này sẽ được chuyển về bước Mới tiếp nhận."
        confirmLabel="Xóa trạng thái"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={confirmDeleteStage}
      />

      {/* Confirm Delete Sub-Status Dialog */}
      <ConfirmDialog
        open={isConfirmDeleteSubStatusOpen}
        onOpenChange={setIsConfirmDeleteSubStatusOpen}
        title="Xác nhận xóa nhãn trạng thái con"
        description="Bạn có chắc chắn muốn xóa nhãn trạng thái này? Thao tác này sẽ gỡ bỏ nhãn khỏi danh mục và không thể hoàn tác."
        confirmLabel="Xóa nhãn"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={confirmDeleteSubStatus}
      />

      {/* Confirm Delete Pool Dialog */}
      <ConfirmDialog
        open={isConfirmDeletePoolOpen}
        onOpenChange={setIsConfirmDeletePoolOpen}
        title="Xác nhận xóa kho dữ liệu"
        description="Bạn có chắc chắn muốn xóa kho dữ liệu này? Các nguồn tiếp nhận liên kết với kho này có thể cần được định tuyến lại."
        confirmLabel="Xóa kho"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={confirmDeletePool}
      />
    </div>
  )
}
