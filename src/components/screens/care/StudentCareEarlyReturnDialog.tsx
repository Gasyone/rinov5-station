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
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel, StatusBadge } from '@/components/shared'
import { toast } from 'sonner'
import {
  RotateCcw,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react'

interface StudentCareEarlyReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName: string
  studentCode?: string
  studentId?: string
  packageName: string
  className?: string
  classCode?: string
  isHoldingClass?: boolean
  expectedReturnDate?: string
  reserveDuration?: string
  remainingSessions?: number
  branchName?: string
  onSuccess?: () => void
}

export function StudentCareEarlyReturnDialog({
  open,
  onOpenChange,
  studentName,
  studentCode = 'HV-2024-0012',
  packageName,
  isHoldingClass = true,
  expectedReturnDate = '16/09/2026',
  reserveDuration = '15/06/2026 ➔ 15/09/2026',
  remainingSessions = 14,
  onSuccess,
}: StudentCareEarlyReturnDialogProps) {
  const [returnDate, setReturnDate] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setReturnDate('')
    setReason('')
    setNotes('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!returnDate) {
      toast.error('Vui lòng chọn ngày học viên đi học lại')
      return
    }
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do đi học lại')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(`Đã ghi nhận yêu cầu đi học lại cho học viên ${studentName}!`, {
        description: `Ngày đi học lại: ${returnDate}`,
      })
      resetForm()
      onOpenChange(false)
      onSuccess?.()
    }, 350)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <RotateCcw className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base font-semibold text-foreground">
              Xác nhận đi học lại trước hạn
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Khối tóm tắt thông tin bảo lưu hiện tại */}
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                Thông tin đợt bảo lưu hiện tại
              </span>
              <StatusBadge
                status="reserve"
                label={isHoldingClass ? 'Bảo lưu giữ lớp' : 'Bảo lưu rút khỏi lớp'}
                className="text-[10px] py-0 px-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
              <div>
                Học viên: <strong className="font-medium text-foreground">{studentName}</strong> ({studentCode})
              </div>
              <div>
                Số buổi còn lại: <strong className="font-medium text-foreground">{remainingSessions} buổi</strong>
              </div>
              <div>
                Thời hạn bảo lưu: <strong className="font-medium text-foreground">{reserveDuration}</strong>
              </div>
              <div>
                Ngày dự kiến gốc: <strong className="font-medium text-amber-700 dark:text-amber-400">{expectedReturnDate}</strong>
              </div>
              <div className="col-span-2">
                Khóa học: <strong className="font-medium text-foreground">{packageName}</strong>
              </div>
            </div>
          </div>

          {/* Ngày đi học lại thực tế */}
          <div className="space-y-1.5">
            <FieldLabel
              label="Ngày đi học lại thực tế"
              description="Ngày học viên bắt đầu quay trở lại học tập (sớm hơn ngày dự kiến gốc)"
            >
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="text-xs h-9"
                required
              />
            </FieldLabel>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1.5 rounded-md border border-sky-200/60 dark:border-sky-900/40">
              <Info className="h-3.5 w-3.5 shrink-0 text-sky-600" />
              <span>
                Học viên đi học lại sớm hơn dự kiến ban đầu ({expectedReturnDate}). Tiến trình học và thời hạn gói sẽ được hệ thống tự động cập nhật.
              </span>
            </div>
          </div>

          {/* Lý do đi học lại */}
          <div className="space-y-1.5">
            <FieldLabel label="Lý do đi học lại">
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do học viên đi học lại..."
                className="text-xs min-h-[72px] resize-none"
                required
              />
            </FieldLabel>
          </div>

          {/* Ghi chú dặn dò nội bộ */}
          <div className="space-y-1.5">
            <FieldLabel label="Ghi chú nội bộ CSKH & Giáo vụ (Tùy chọn)">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú lưu ý giáo viên, tài liệu học tập, ca học..."
                className="text-xs min-h-[60px] resize-none"
              />
            </FieldLabel>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="text-xs cursor-pointer"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs bg-sky-600 hover:bg-sky-700 text-white cursor-pointer font-medium shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đi học lại'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
