'use client'

import React, { useState } from 'react'
import { PipelineStageConfig, DataPoolConfig } from './leadLifecycleTypes'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldLabel } from '@/components/shared'

interface LeadLifecycleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'stage' | 'pool'
  initialStage?: PipelineStageConfig | null
  initialPool?: DataPoolConfig | null
  poolName?: string
  onSaveStage?: (stage: PipelineStageConfig) => void
  onSavePool?: (pool: DataPoolConfig) => void
}

interface LeadLifecycleFormInnerProps {
  type: 'stage' | 'pool'
  initialStage?: PipelineStageConfig | null
  initialPool?: DataPoolConfig | null
  poolName?: string
  onSaveStage?: (stage: PipelineStageConfig) => void
  onSavePool?: (pool: DataPoolConfig) => void
  onClose: () => void
}

const LeadLifecycleFormInner: React.FC<LeadLifecycleFormInnerProps> = ({
  type,
  initialStage,
  initialPool,
  poolName,
  onSaveStage,
  onSavePool,
  onClose,
}) => {
  // Stage form state
  const [stageName, setStageName] = useState(initialStage?.name ?? '')
  const [stageCode, setStageCode] = useState(initialStage?.code ?? '')
  const [stageColor, setStageColor] = useState(initialStage?.color ?? '#3b82f6')
  const [stageType, setStageType] = useState<PipelineStageConfig['stageType']>(
    initialStage?.stageType ?? 'in_progress'
  )
  const [stagePhaseGroup, setStagePhaseGroup] = useState<PipelineStageConfig['phaseGroup']>(
    () => (initialStage?.phaseGroup && ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'].includes(initialStage.phaseGroup)
      ? initialStage.phaseGroup
      : initialStage?.stageType === 'won' ? 'T5' : initialStage?.stageType === 'global_lost' ? 'terminal' : 'T1')
  )
  const [stageSla, setStageSla] = useState(initialStage?.slaHours?.toString() ?? '24')
  const [stageAction, setStageAction] = useState(initialStage?.actionLabel ?? '')
  const [stageDesc, setStageDesc] = useState(initialStage?.description ?? '')

  // Pool form state
  const [poolNameField, setPoolNameField] = useState(initialPool?.name ?? '')
  const [poolCode, setPoolCode] = useState(initialPool?.code ?? '')
  const [poolUrl, setPoolUrl] = useState(initialPool?.url ?? '')

  const PHASE_LABELS: Record<string, string> = {
    T0: 'Tiếp nhận Lead',
    T1: 'Tư vấn & Chăm sóc',
    T2: 'Đánh giá & Học thử',
    T3: 'Chốt Deal & Nhập học',
    T4: 'Vận đơn & Thu phí',
    T5: 'Thành công & Hoàn tất',
  }

  const handleSave = () => {
    if (type === 'stage') {
      if (!stageName.trim() || !stageCode.trim()) return
      const updatedStage: PipelineStageConfig = {
        id: initialStage ? initialStage.id : `stage-${Date.now()}`,
        name: stageName,
        code: stageCode.toUpperCase(),
        color: stageColor,
        phaseGroup: stagePhaseGroup,
        phaseGroupLabel: PHASE_LABELS[stagePhaseGroup] || 'Quy trình Lead',
        order: initialStage ? initialStage.order : 99,
        stageType: stageType,
        isSystemCore: initialStage ? initialStage.isSystemCore : false,
        slaHours: stageSla ? parseInt(stageSla, 10) : undefined,
        actionLabel: stageAction,
        description: stageDesc,
        isActive: true,
      }
      onSaveStage?.(updatedStage)
    } else {
      if (!poolNameField.trim() || !poolCode.trim()) return
      const updatedPool: DataPoolConfig = {
        id: initialPool ? initialPool.id : `pool-${Date.now()}`,
        name: poolNameField.trim(),
        code: poolCode.trim().toUpperCase(),
        url: poolUrl.trim(),
        leadCount: initialPool ? initialPool.leadCount : 0,
        isActive: true,
      }
      onSavePool?.(updatedPool)
    }
    onClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-base font-semibold text-foreground">
          {type === 'stage'
            ? initialStage
              ? 'Chỉnh sửa Trạng thái Phễu'
              : 'Thêm mới Trạng thái Phễu'
            : initialPool
            ? 'Chỉnh sửa Kho Dữ liệu'
            : 'Thêm mới Kho Dữ liệu'}
        </DialogTitle>
        {type === 'stage' && poolName && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Áp dụng cho: <span className="font-semibold text-foreground">{poolName}</span>
          </p>
        )}
      </DialogHeader>

      {type === 'stage' ? (
        <div className="space-y-3.5 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Tên trạng thái" required>
                <Input
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  placeholder="Ví dụ: Đang tư vấn"
                  className="h-8 text-xs"
                />
              </FieldLabel>
            </div>
            <div>
              <FieldLabel label="Mã code" required>
                <Input
                  value={stageCode}
                  onChange={(e) => setStageCode(e.target.value)}
                  placeholder="Ví dụ: QT"
                  className="h-8 text-xs font-mono uppercase"
                />
              </FieldLabel>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Giai đoạn [T0] - [T5]" required>
                <Select
                  value={stagePhaseGroup}
                  onValueChange={(val) => setStagePhaseGroup(val as PipelineStageConfig['phaseGroup'])}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T0">[T0] Tiếp nhận Lead</SelectItem>
                    <SelectItem value="T1">[T1] Tư vấn &amp; Chăm sóc</SelectItem>
                    <SelectItem value="T2">[T2] Đánh giá &amp; Học thử</SelectItem>
                    <SelectItem value="T3">[T3] Chốt Deal &amp; Nhập học</SelectItem>
                    <SelectItem value="T4">[T4] Vận đơn &amp; Thu phí</SelectItem>
                    <SelectItem value="T5">[T5] Thành công &amp; Hoàn tất</SelectItem>
                  </SelectContent>
                </Select>
              </FieldLabel>
            </div>

            <div>
              <FieldLabel label="Phân loại bước" required>
                <Select
                  value={stageType}
                  onValueChange={(val) => setStageType(val as PipelineStageConfig['stageType'])}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">Đang tiến hành</SelectItem>
                    <SelectItem value="won">Chuyển đổi thành công (Won)</SelectItem>
                    <SelectItem value="global_lost">Thất bại toàn cục (Global Lost)</SelectItem>
                  </SelectContent>
                </Select>
              </FieldLabel>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Màu nhận diện" required>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={stageColor}
                    onChange={(e) => setStageColor(e.target.value)}
                    className="h-8 w-10 p-0.5 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={stageColor}
                    onChange={(e) => setStageColor(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </FieldLabel>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Hạn mức SLA (giờ)">
                <Input
                  type="number"
                  value={stageSla}
                  onChange={(e) => setStageSla(e.target.value)}
                  placeholder="24"
                  className="h-8 text-xs font-mono"
                />
              </FieldLabel>
            </div>

            <div>
              <FieldLabel label="Hành động gợi ý">
                <Input
                  value={stageAction}
                  onChange={(e) => setStageAction(e.target.value)}
                  placeholder="Ví dụ: Gửi báo giá"
                  className="h-8 text-xs"
                />
              </FieldLabel>
            </div>
          </div>

          <div>
            <FieldLabel label="Mô tả chi tiết">
              <Textarea
                value={stageDesc}
                onChange={(e) => setStageDesc(e.target.value)}
                placeholder="Mô tả tiêu chí để đưa khách hàng vào bước này..."
                className="text-xs min-h-[60px]"
              />
            </FieldLabel>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          <div>
            <FieldLabel label="Tên kho" required>
              <Input
                value={poolNameField}
                onChange={(e) => setPoolNameField(e.target.value)}
                placeholder="Ví dụ: Kho M, Kho T, Kho CC..."
                className="h-9 text-xs"
              />
            </FieldLabel>
          </div>

          <div>
            <FieldLabel label="Mã kho" required>
              <Input
                value={poolCode}
                onChange={(e) => setPoolCode(e.target.value.toUpperCase())}
                placeholder="Ví dụ: M, T, C, G..."
                className="h-9 text-xs font-mono uppercase"
              />
            </FieldLabel>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Link Url:</span>
            </div>
            <Input
              value={poolUrl}
              onChange={(e) => setPoolUrl(e.target.value)}
              placeholder="Nhập Url webhook hoặc form..."
              className="h-9 text-xs"
            />
          </div>
        </div>
      )}

      <DialogFooter className="pt-4 border-t flex items-center justify-center gap-3 sm:justify-center">
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="h-9 px-6 text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-white cursor-pointer shadow-xs"
        >
          LƯU LẠI
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-9 px-6 text-xs font-semibold bg-[#e11d48] hover:bg-[#be123c] text-white border-transparent cursor-pointer shadow-xs"
        >
          HỦY BỎ
        </Button>
      </DialogFooter>
    </>
  )
}

export const LeadLifecycleFormDialog: React.FC<LeadLifecycleFormDialogProps> = ({
  open,
  onOpenChange,
  type,
  initialStage,
  initialPool,
  poolName,
  onSaveStage,
  onSavePool,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        {open && (
          <LeadLifecycleFormInner
            key={`${type}-${initialStage?.id ?? initialPool?.id ?? 'new'}`}
            type={type}
            initialStage={initialStage}
            initialPool={initialPool}
            poolName={poolName}
            onSaveStage={onSaveStage}
            onSavePool={onSavePool}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
