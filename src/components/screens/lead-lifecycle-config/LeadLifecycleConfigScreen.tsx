'use client'

import React, { useState, useMemo } from 'react'
import { useLeadLifecycleStore } from '@/stores/useLeadLifecycleStore'
import {
  PipelineStageConfig,
  PipelineSubStatusConfig,
  DataPoolConfig,
} from './leadLifecycleTypes'
import { LeadLifecyclePipelineTab } from './LeadLifecyclePipelineTab'
import { LeadLifecycleDiagramView } from './LeadLifecycleDiagramView'
import { LeadLifecyclePoolModal } from './LeadLifecyclePoolModal'
import { LeadLifecycleFormDialog } from './LeadLifecycleFormDialog'
import { LeadLifecycleSubStatusDialog } from './LeadLifecycleSubStatusDialog'
import { ConfirmDialog } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
  RotateCcw,
  PhoneCall,
  Megaphone,
  RefreshCw,
  Gift,
  Copy,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'

export const LeadLifecycleConfigScreen: React.FC = () => {
  // Master data từ central Zustand store
  const {
    selectedPoolId,
    setSelectedPoolId,
    stagesByPool,
    stages,
    pools,
    setStages,
    setPools,
    copyStagesFromPool,
    resetPoolStagesToDefault,
  } = useLeadLifecycleStore()

  // Current active pool
  const currentPool = useMemo(() => {
    return (
      pools.find((p) => p.id === selectedPoolId) ||
      pools[0] || {
        id: 'pool-t',
        code: 'T',
        name: 'Kho T (Telesales)',
      }
    )
  }, [pools, selectedPoolId])

  const getPoolStageCount = (poolId: string) => {
    const list = stagesByPool[poolId]
    return list ? list.length : 0
  }

  const getPoolIcon = (code: string) => {
    const c = code.toUpperCase()
    if (c === 'T') return <PhoneCall className="h-3.5 w-3.5 shrink-0" />
    if (c === 'M') return <Megaphone className="h-3.5 w-3.5 shrink-0" />
    if (c === 'CC' || c === 'C') return <RefreshCw className="h-3.5 w-3.5 shrink-0" />
    if (c === 'G') return <Gift className="h-3.5 w-3.5 shrink-0" />
    return <Database className="h-3.5 w-3.5 shrink-0" />
  }

  // Pool Management Modal state
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false)

  // Copy stages template modal state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [copySourcePoolId, setCopySourcePoolId] = useState('')

  const handleOpenCopyDialog = () => {
    const other = pools.find((p) => p.id !== selectedPoolId)
    if (other) {
      setCopySourcePoolId(other.id)
    }
    setIsCopyModalOpen(true)
  }

  const handleConfirmCopy = () => {
    if (!copySourcePoolId) return
    copyStagesFromPool(copySourcePoolId, selectedPoolId)
    const src = pools.find((p) => p.id === copySourcePoolId)
    toast.success(
      `Đã sao chép bộ trạng thái từ ${src?.name || 'kho'} sang ${currentPool.name}`
    )
    setIsCopyModalOpen(false)
  }

  // Dual View Mode: 'diagram' or 'list'
  const [viewMode, setViewMode] = useState<'diagram' | 'list'>('diagram')

  // Filter states
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

  // Filter logic: lọc theo loại nhãn con (slice tạo bản sao an toàn trước khi sort)
  const filteredStages = useMemo(() => {
    return stages
      .filter((stage) => {
        if (originFilter !== 'all') {
          const hasMatchingSub = (stage.subStatuses || []).some(
            (sub) => sub.origin === originFilter
          )
          if (!hasMatchingSub) return false
        }
        return true
      })
      .slice()
      .sort((a, b) => a.order - b.order)
  }, [stages, originFilter])

  const handleToggleExpandAll = () => {
    if (expandedStages.size === filteredStages.length) {
      setExpandedStages(new Set())
    } else {
      setExpandedStages(new Set(filteredStages.map((s) => s.id)))
    }
  }

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
    toast.success(`Đã lưu trạng thái vào ${currentPool.name}`)
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
            s.id === subStatusId ? { ...s, ...partialActive(s.isActive) } : s
          ),
        }
      })
    )
    toast.info('Đã cập nhật trạng thái kích hoạt của nhãn')
  }

  const partialActive = (currActive: boolean) => ({ isActive: !currActive })

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
    <div className="flex flex-col h-full w-full min-h-0 overflow-y-auto space-y-3.5 px-4 py-3 lg:px-6 pb-12 custom-scrollbar">
      {/* 1. THANH CHỌN KHO DỮ LIỆU TIẾP NHẬN (POOL SELECTOR TABS) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 rounded-xl border border-border/80 bg-card shadow-2xs">
        {/* Danh sách các kho dạng thẻ pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 shrink-0 hidden md:inline">
            Kho dữ liệu:
          </span>
          {pools.map((p) => {
            const isSelected = p.id === selectedPoolId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPoolId(p.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground border-border/50 bg-background hover:bg-muted/60'
                )}
              >
                {getPoolIcon(p.code)}
                <span>{p.name}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {p.code}
                </span>
              </button>
            )
          })}
        </div>

        {/* Nút Quản lý Kho Dữ Liệu */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPoolModalOpen(true)}
            className="h-8 text-xs gap-1.5 cursor-pointer border-pink-200 text-pink-700 bg-pink-50/50 hover:bg-pink-100 hover:text-pink-800 dark:bg-pink-950/30 dark:border-pink-900/50 dark:text-pink-300 shadow-2xs"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Quản lý Kho ({pools.length})</span>
          </Button>
        </div>
      </div>

      {/* 2. TOOLBAR ĐIỀU KHIỂN: VIEW SWITCHER, BỘ LỌC NHÃN & THÊM TRẠNG THÁI */}
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

        {/* Right: Sao chép, Khôi phục & Thêm trạng thái vào kho đang chọn */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenCopyDialog}
            className="h-8 text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground bg-background"
            title="Sao chép toàn bộ bộ trạng thái từ một kho khác sang kho này"
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sao chép từ kho khác</span>
            <span className="sm:hidden">Sao chép</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              resetPoolStagesToDefault(selectedPoolId)
              toast.success(`Đã khôi phục bộ trạng thái mặc định cho ${currentPool.name}`)
            }}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            title={`Khôi phục các bước phễu của ${currentPool.name} về mẫu ban đầu`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
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

      {/* 4. MAIN SCREEN CONTENT: SƠ ĐỒ HOẶC DANH SÁCH ACCORDION */}
      {viewMode === 'diagram' ? (
        <LeadLifecycleDiagramView
          stages={stages}
          originFilter={originFilter as 'all' | 'system' | 'custom'}
          onEditStage={handleEditStage}
          onAddNewSubStatus={handleAddNewSubStatus}
          onEditSubStatus={handleEditSubStatus}
          onDeleteSubStatus={handleDeleteSubStatus}
        />
      ) : (
        <LeadLifecyclePipelineTab
          stages={filteredStages}
          originFilter={originFilter as 'all' | 'system' | 'custom'}
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

      {/* 5. MODAL QUẢN LÝ KHO DỮ LIỆU */}
      <LeadLifecyclePoolModal
        open={isPoolModalOpen}
        onOpenChange={setIsPoolModalOpen}
        pools={pools}
        onAddNewPool={handleAddNewPool}
        onEditPool={handleEditPool}
        onDeletePool={handleDeletePool}
        onSelectPoolToConfigure={(poolId) => {
          setSelectedPoolId(poolId)
          toast.info(`Đã chuyển sang cấu hình kho ${pools.find((p) => p.id === poolId)?.name || ''}`)
        }}
        getPoolStageCount={getPoolStageCount}
      />

      {/* 6. MODAL SAO CHÉP BỘ TRẠNG THÁI TỪ KHO KHÁC */}
      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader className="pb-3 border-b border-border/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Copy className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  Sao chép Bộ trạng thái Phễu
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Sao chép toàn bộ các bước và nhãn con từ kho khác sang{' '}
                  <strong className="text-foreground">{currentPool.name}</strong>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-amber-900 dark:text-amber-200">
              <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Hành động này sẽ thay thế toàn bộ danh sách trạng thái hiện tại của{' '}
                <strong>{currentPool.name}</strong> bằng bản sao các trạng thái từ kho nguồn được chọn bên dưới.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-foreground block">
                Chọn kho nguồn để sao chép:
              </label>
              <Select value={copySourcePoolId} onValueChange={setCopySourcePoolId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Chọn kho nguồn..." />
                </SelectTrigger>
                <SelectContent>
                  {pools
                    .filter((p) => p.id !== selectedPoolId)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.code}) - {getPoolStageCount(p.id)} bước
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCopyModalOpen(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmCopy}
              disabled={!copySourcePoolId}
              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
            >
              Xác nhận sao chép
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. FORM DIALOG CHO STAGE / POOL */}
      <LeadLifecycleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        type={dialogType}
        initialStage={editingStage}
        initialPool={editingPool}
        poolName={currentPool.name}
        onSaveStage={handleSaveStage}
        onSavePool={handleSavePool}
      />

      {/* 8. DIALOG CHO SUB-STATUS */}
      <LeadLifecycleSubStatusDialog
        open={isSubStatusDialogOpen}
        onOpenChange={setIsSubStatusDialogOpen}
        stage={subStatusStage}
        initialSubStatus={editingSubStatus}
        onSaveSubStatus={handleSaveSubStatus}
        onDeleteSubStatus={handleDeleteSubStatus}
      />

      {/* 9. CONFIRM DIALOGS */}
      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="Xác nhận xóa trạng thái phễu"
        description="Bạn có chắc chắn muốn xóa trạng thái này khỏi quy trình của kho hiện tại? Các hồ sơ Lead đang ở trạng thái này sẽ được chuyển về bước Mới tiếp nhận."
        confirmLabel="Xóa trạng thái"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={confirmDeleteStage}
      />

      <ConfirmDialog
        open={isConfirmDeleteSubStatusOpen}
        onOpenChange={setIsConfirmDeleteSubStatusOpen}
        title="Xác nhận xóa nhãn trạng thái con"
        description="Bạn có chắc chắn muốn xóa nhãn trạng thái này? Thao tác này sẽ gỡ bỏ nhãn khỏi danh mục của kho hiện tại và không thể hoàn tác."
        confirmLabel="Xóa nhãn"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={confirmDeleteSubStatus}
      />

      <ConfirmDialog
        open={isConfirmDeletePoolOpen}
        onOpenChange={setIsConfirmDeletePoolOpen}
        title="Xác nhận xóa kho dữ liệu"
        description="Bạn có chắc chắn muốn xóa kho dữ liệu này? Toàn bộ cấu hình bộ trạng thái của kho này sẽ được dọn dẹp."
        confirmLabel="Xóa kho"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={confirmDeletePool}
      />
    </div>
  )
}
