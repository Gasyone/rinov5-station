'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Calendar, UserX } from 'lucide-react'
import {
  DropStageId,
  DROP_STAGE_OPTIONS,
  DROP_REASONS_MAP,
  DropRecord,
} from './crmLeadDetailTypes'
import { Lead } from '@/mocks/crmLeads'

interface CrmLeadDropDialogProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDrop: (dropRecord: DropRecord) => void
}

export function CrmLeadDropDialog({
  lead,
  open,
  onOpenChange,
  onConfirmDrop,
}: CrmLeadDropDialogProps) {
  // Xác định chặng rơi mặc định từ trạng thái lead
  const getDefaultStageId = (status?: string): DropStageId => {
    switch (status) {
      case 'chua_tiep_can':
      case 'moi_tiep_nhan':
        return 'moi_tiep_nhan'
      case 'danh_gia_trai_nghiem':
      case 'hen_trai_nghiem':
        return 'hen_trai_nghiem'
      case 'tiem_nang':
      case 'cho_chot':
        return 'cho_chot'
      default:
        return 'dang_tu_van'
    }
  }

  const [selectedStage, setSelectedStage] = useState<DropStageId>(
    getDefaultStageId(lead?.status)
  )
  const currentReasons = DROP_REASONS_MAP[selectedStage] || []
  const [selectedReasonId, setSelectedReasonId] = useState<string>(
    currentReasons[0]?.id || ''
  )
  const [note, setNote] = useState('')

  const activeReason = currentReasons.find((r) => r.id === selectedReasonId)

  // Tính ngày đề xuất chăm sóc lại
  const calculateReCareDate = (coolingDays: number) => {
    if (coolingDays <= 0) return 'Không chăm sóc lại (Lưu kho lạnh vĩnh viễn)'
    const target = new Date(2026, 7, 25) // Ngày mốc hệ thống 25/08/2026
    target.setDate(target.getDate() + coolingDays)
    const d = String(target.getDate()).padStart(2, '0')
    const m = String(target.getMonth() + 1).padStart(2, '0')
    const y = target.getFullYear()
    return `${d}/${m}/${y} (sau ${coolingDays} ngày)`
  }

  const handleStageChange = (newStage: DropStageId) => {
    setSelectedStage(newStage)
    const reasons = DROP_REASONS_MAP[newStage] || []
    setSelectedReasonId(reasons[0]?.id || '')
  }

  const handleSubmit = () => {
    if (!activeReason || !lead) return

    const stageObj = DROP_STAGE_OPTIONS.find((s) => s.id === selectedStage)
    const record: DropRecord = {
      stageId: selectedStage,
      stageLabel: stageObj?.label || selectedStage,
      reasonId: activeReason.id,
      reasonLabel: activeReason.label,
      droppedAt: '25/08/2026 15:30',
      droppedBy: lead.assignedTo || 'Trần Thị Mai (Sales)',
      note: note.trim() || undefined,
      reCareDate:
        activeReason.coolingOffDays > 0
          ? calculateReCareDate(activeReason.coolingOffDays)
          : undefined,
    }

    onConfirmDrop(record)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <UserX className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">
              Báo rớt / Lưu kho Khách hàng tiềm năng
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Xác định điểm rơi chuẩn hóa giúp hệ thống đo lường tỷ lệ rò rỉ của phễu và
            tự động kích hoạt chu kỳ nuôi dưỡng lại sau này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Thông tin Lead */}
          <div className="bg-muted/40 p-2.5 rounded-lg border border-border flex items-center justify-between">
            <div>
              <span className="text-muted-foreground">Học viên: </span>
              <span className="font-bold text-foreground">{lead?.studentName}</span>
              <span className="text-muted-foreground ml-2">({lead?.code})</span>
            </div>
            <div className="font-mono text-muted-foreground">{lead?.phone}</div>
          </div>

          {/* Chọn chặng rơi */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">1. Chặng quy trình bị rơi (Drop Stage)</Label>
            <Select
              value={selectedStage}
              onValueChange={(val) => handleStageChange(val as DropStageId)}
            >
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue placeholder="Chọn chặng rơi" />
              </SelectTrigger>
              <SelectContent>
                {DROP_STAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chọn lý do rơi chuẩn hóa */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">2. Lý do thất bại chuẩn hóa (Drop Reason)</Label>
            <Select value={selectedReasonId} onValueChange={setSelectedReasonId}>
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent>
                {currentReasons.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id} className="text-xs">
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hướng xử lý gợi ý */}
          {activeReason && (
            <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <AlertCircle className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Hướng xử lý tự động của hệ thống:</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{activeReason.suggestedAction}</p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-violet-700 dark:text-violet-300 pt-0.5">
                <Calendar className="h-3 w-3 shrink-0" />
                <span>Thời gian nuôi dưỡng lại: {calculateReCareDate(activeReason.coolingOffDays)}</span>
              </div>
            </div>
          )}

          {/* Ghi chú chi tiết */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">3. Ghi chú chi tiết từ Tư vấn viên</Label>
            <Textarea
              placeholder="Nhập nội dung trao đổi cụ thể với phụ huynh, phản hồi của bé hoặc lý do phát sinh..."
              className="text-xs min-h-[70px] resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleSubmit}
            className="text-xs cursor-pointer"
          >
            Xác nhận Báo rớt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
