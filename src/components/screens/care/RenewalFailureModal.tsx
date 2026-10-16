'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { AlertTriangle } from 'lucide-react'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const RENEWAL_FAILURE_REASONS = [
  { value: 'relocation', label: 'Chuyển nơi sinh sống / Đi định cư nước ngoài' },
  { value: 'schedule_conflict', label: 'Trùng lịch học văn hóa / Không thu xếp được lịch' },
  { value: 'financial', label: 'Học phí / Điều kiện tài chính gia đình chưa phù hợp' },
  { value: 'competitor', label: 'Chuyển sang trung tâm khác / Học kèm gia sư' },
  { value: 'pause_study', label: 'Học viên tạm dừng học / Đã hoàn thành mục tiêu' },
  { value: 'unreachable', label: 'Không liên lạc được phụ huynh sau nhiều lần liên hệ' },
  { value: 'other', label: 'Lý do khác (Nhập chi tiết)' },
]

export interface RenewalFailureData {
  reason: string
  notes?: string
  parentOpinion?: string
}

interface RenewalFailureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student?: StudentCareAlert | null
  chatRecipient?: string
  notesPreview?: string
  parentOpinionPreview?: string
  onConfirm: (data: RenewalFailureData) => void
}

export function RenewalFailureModal({
  open,
  onOpenChange,
  student,
  notesPreview = '',
  parentOpinionPreview = '',
  onConfirm,
}: RenewalFailureModalProps) {
  const [selectedReasonKey, setSelectedReasonKey] = useState<string>('relocation')
  const [customReasonText, setCustomReasonText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setSelectedReasonKey('relocation')
      setCustomReasonText('')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const chosenOption = RENEWAL_FAILURE_REASONS.find((r) => r.value === selectedReasonKey)
    let finalReason = chosenOption?.label || selectedReasonKey

    if (selectedReasonKey === 'other') {
      finalReason = customReasonText.trim() || 'Lý do khác'
    }

    setIsSubmitting(true)
    try {
      onConfirm({
        reason: finalReason,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 text-left">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <DialogTitle className="text-sm font-semibold text-foreground">
              Xác nhận thất bại tái phí
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            Bạn có chắc chắn muốn ghi nhận ca tái phí cho học viên{' '}
            <strong className="text-foreground">{student?.studentName}</strong> là{' '}
            <strong className="text-destructive">Thất bại</strong> và lưu vào lịch sử chăm sóc?
          </p>

          {/* Tóm tắt nội dung ghi chú & ý kiến phụ huynh đã nhập ở form trên */}
          {(Boolean(notesPreview.trim()) || Boolean(parentOpinionPreview.trim())) && (
            <div className="p-2.5 rounded-md bg-muted/40 border border-border/50 space-y-1 text-[11.5px] text-muted-foreground">
              {notesPreview.trim() && (
                <p className="line-clamp-2">
                  <span className="font-medium text-foreground">Ghi chú đã nhập:</span> {notesPreview.trim()}
                </p>
              )}
              {parentOpinionPreview.trim() && (
                <p className="line-clamp-1 italic">
                  <span className="font-medium not-italic text-foreground">Ý kiến PH:</span> “{parentOpinionPreview.trim()}”
                </p>
              )}
            </div>
          )}

          {/* Chọn lý do thất bại */}
          <FieldLabel label="Lý do thất bại" required>
            <Select
              value={selectedReasonKey}
              onValueChange={(val) => setSelectedReasonKey(val)}
            >
              <SelectTrigger className="w-full text-xs h-8">
                <SelectValue placeholder="Chọn lý do thất bại..." />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {RENEWAL_FAILURE_REASONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldLabel>

          {/* Nhập lý do khác nếu chọn 'other' */}
          {selectedReasonKey === 'other' && (
            <FieldLabel label="Chi tiết lý do khác" required>
              <Input
                type="text"
                value={customReasonText}
                onChange={(e) => setCustomReasonText(e.target.value)}
                placeholder="Nhập cụ thể nguyên nhân dừng học..."
                className="h-8 text-xs"
                autoFocus
              />
            </FieldLabel>
          )}

          <DialogFooter className="pt-2 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-xs h-8"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting || (selectedReasonKey === 'other' && !customReasonText.trim())}
              className="text-xs font-semibold h-8"
            >
              {isSubmitting ? 'Đang lưu...' : 'Xác nhận thất bại'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
