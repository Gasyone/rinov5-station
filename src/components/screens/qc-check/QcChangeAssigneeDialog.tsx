'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UserCog,
  Check,
  Building2,
  Users,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { AppAvatar } from '@/components/shared'
import {
  QcTeacherPickerDialog,
  type AvailableStaff,
} from './QcTeacherPickerDialog'

const REASSIGN_REASONS = [
  { value: 'workload_balance', label: 'Điều phối lại khối lượng công việc (Workload)' },
  { value: 'right_department', label: 'Chuyển giao đúng bộ phận chuyên môn phụ trách' },
  { value: 'staff_leave', label: 'Nhân sự nghỉ phép / Thay đổi ca trực' },
  { value: 'management_request', label: 'Yêu cầu điều chuyển từ Ban Quản lý / QC' },
  { value: 'other', label: 'Lý do nghiệp vụ khác' },
]

export interface QcChangeAssigneeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAssignee: string
  incidentCode: string
  incidentTitle: string
  branchName: string
  targetGroup?: 'teacher' | 'facility' | 'operations'
  onConfirm: (newAssigneeName: string, reason: string, note?: string) => void
}

export function QcChangeAssigneeDialog({
  open,
  onOpenChange,
  currentAssignee,
  incidentCode,
  incidentTitle,
  branchName,
  targetGroup,
  onConfirm,
}: QcChangeAssigneeDialogProps) {
  const [selectedStaff, setSelectedStaff] = useState<AvailableStaff | null>(null)
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false)
  const [reason, setReason] = useState('workload_balance')
  const [handoverNote, setHandoverNote] = useState('')

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedStaff(null)
      setIsPickerModalOpen(false)
      setHandoverNote('')
      setReason('workload_balance')
    }
    onOpenChange(newOpen)
  }

  const handleConfirm = () => {
    if (!selectedStaff) {
      toast.error('Vui lòng chọn nhân sự tiếp nhận phụ trách mới!')
      return
    }

    const reasonObj = REASSIGN_REASONS.find((r) => r.value === reason)
    const reasonLabel = reasonObj?.label || reason

    onConfirm(selectedStaff.name, reasonLabel, handoverNote.trim() || undefined)
    handleOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[540px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden text-left z-50">
          {/* Header Modal */}
          <DialogHeader className="p-4 pb-3 border-b border-border/70 bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <UserCog className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-bold text-foreground">
                  Thay đổi Người phụ trách Khắc phục
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  Mã: <strong className="font-mono text-foreground">{incidentCode}</strong> • {branchName} • {incidentTitle}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body: Section Thay đổi người (gọn gàng, không bị nhồi nhét danh sách giáo viên) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {/* 1. Người phụ trách hiện tại */}
            <div className="p-2.5 rounded-lg border border-border/70 bg-muted/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <AppAvatar name={currentAssignee} size="sm" className="h-8 w-8 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-muted-foreground block">Người đang phụ trách hiện tại:</span>
                  <strong className="text-xs font-bold text-foreground block truncate">
                    {currentAssignee}
                  </strong>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px] font-semibold bg-background shrink-0">
                Đang phụ trách
              </Badge>
            </div>

            {/* 2. Nhân sự tiếp nhận mới (Mở modal nổi để chọn, không nhồi danh sách vào đây) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-foreground text-xs">
                  Người tiếp nhận mới <span className="text-destructive">*</span>
                </label>
                {selectedStaff && (
                  <span className="text-[11px] text-primary font-medium">
                    {selectedStaff.activeIncidentsCount} sự cố đang xử lý
                  </span>
                )}
              </div>

              {selectedStaff ? (
                <div className="p-2.5 rounded-lg border border-primary/50 bg-primary/5 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AppAvatar name={selectedStaff.name} size="sm" className="h-8 w-8 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-foreground text-xs truncate">
                          {selectedStaff.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ({selectedStaff.code})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>{selectedStaff.role}</span>
                        <span>•</span>
                        <span className="truncate flex items-center gap-0.5">
                          <Building2 className="h-2.5 w-2.5" />
                          {selectedStaff.branch}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs shrink-0 cursor-pointer"
                    onClick={() => setIsPickerModalOpen(true)}
                  >
                    Đổi người
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPickerModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground">
                    <UserPlus className="h-4 w-4 text-primary" />
                    <span className="font-medium">Bấm để mở danh sách chọn giáo viên / nhân sự...</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-background text-primary border-primary/30">
                    Chọn giáo viên
                  </Badge>
                </button>
              )}
            </div>

            {/* 3. Lý do đổi người */}
            <div className="space-y-1">
              <label className="font-bold text-foreground text-xs">
                Lý do thay đổi người phụ trách <span className="text-destructive">*</span>
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Chọn lý do điều chuyển" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  {REASSIGN_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="text-xs">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Ghi chú điều chuyển & Bàn giao */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground text-xs">
                Ghi chú điều chuyển & Bàn giao (Tùy chọn)
              </label>
              <Textarea
                rows={2}
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                placeholder="Nhập nội dung dặn dò, tình trạng hiện trường hoặc lý do chi tiết..."
                className="text-xs bg-background"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-3 border-t border-border/70 bg-muted/20 flex items-center justify-between sm:justify-between gap-2">
            <div className="text-[11px] text-muted-foreground italic flex items-center gap-1">
              <Users className="h-3 w-3" />
              Lịch sử điều chuyển sẽ được ghi vào nhật ký sự cố.
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs font-semibold gap-1.5"
                onClick={handleConfirm}
                disabled={!selectedStaff}
              >
                <Check className="h-3.5 w-3.5" />
                Xác nhận đổi người
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal nổi: Chọn giáo viên / nhân sự */}
      <QcTeacherPickerDialog
        open={isPickerModalOpen}
        onOpenChange={setIsPickerModalOpen}
        selectedStaffId={selectedStaff?.id}
        branchName={branchName}
        targetGroup={targetGroup}
        currentAssignee={currentAssignee}
        onSelect={(staff) => {
          setSelectedStaff(staff)
          setIsPickerModalOpen(false)
        }}
      />
    </>
  )
}
