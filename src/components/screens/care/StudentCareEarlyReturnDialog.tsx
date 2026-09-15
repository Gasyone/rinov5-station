'use client'

import React, { useState, useMemo } from 'react'
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
  BookOpen,
  Info,
  Clock,
  School,
  CheckCircle2,
} from 'lucide-react'
import { mockClassRecords } from '@/mocks/classRecords'

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

const QUICK_REASONS = [
  'Phụ huynh chủ động thu xếp được thời gian sớm',
  'Học viên đã kết thúc việc cá nhân, muốn quay lại học ngay',
  'Muốn học tiếp để theo kịp tiến độ cùng các bạn trong lớp',
  'Theo kết quả tư vấn và định hướng của chuyên viên CSKH',
]

export function StudentCareEarlyReturnDialog({
  open,
  onOpenChange,
  studentName,
  studentCode = 'HV-2024-0012',
  packageName,
  className = 'Toán tư duy Archimedes 5',
  classCode = 'LD_TOAN_00010',
  isHoldingClass = true,
  expectedReturnDate = '16/09/2026',
  reserveDuration = '15/06/2026 ➔ 15/09/2026',
  remainingSessions = 14,
  branchName = 'RinoEdu Nguyễn Tuân',
  onSuccess,
}: StudentCareEarlyReturnDialogProps) {
  const [returnDate, setReturnDate] = useState('2026-07-28')
  const [selectedClassCode, setSelectedClassCode] = useState(classCode)
  const [keepExistingClass, setKeepExistingClass] = useState(isHoldingClass)
  const [reason, setReason] = useState(
    'Phụ huynh chủ động liên hệ thông báo học viên đã thu xếp được thời gian và đề xuất cho con đi học lại trước hạn bảo lưu.'
  )
  const [notes, setNotes] = useState(
    'Đã trao đổi xác nhận với phụ huynh. Đề nghị Giáo vụ kích hoạt lại danh sách điểm danh và thông báo cho Giáo viên phụ trách lớp.'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Danh sách các lớp khả dụng cùng cơ sở để lựa chọn nếu không tiếp tục lớp cũ
  const availableClasses = useMemo(() => {
    return mockClassRecords.filter(
      (c) => c.status === 'dang_hoc' || c.status === 'mo_chieu_sinh'
    )
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!returnDate) {
      toast.error('Vui lòng chọn ngày học viên đi học lại')
      return
    }
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do đi học lại trước hạn')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(`Đã ghi nhận yêu cầu đi học lại trước hạn cho học viên ${studentName}!`, {
        description: `Ngày đi học lại: ${returnDate} • Lớp tiếp nhận: ${keepExistingClass ? classCode : selectedClassCode}`,
      })
      onOpenChange(false)
      onSuccess?.()
    }, 350)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] text-left p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <RotateCcw className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base font-semibold text-foreground">
              Xác nhận đi học lại trước hạn
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Đề xuất kích hoạt lại tiến trình học tập cho học viên trước ngày kết thúc bảo lưu dự kiến.
          </p>
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
              <div className="relative">
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>
            </FieldLabel>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1.5 rounded-md border border-sky-200/60 dark:border-sky-900/40">
              <Info className="h-3.5 w-3.5 shrink-0 text-sky-600" />
              <span>
                Học viên đi học lại sớm hơn dự kiến ban đầu ({expectedReturnDate}). Tiến trình học và thời hạn gói sẽ được hệ thống tự động cập nhật.
              </span>
            </div>
          </div>

          {/* Lớp học tiếp nhận */}
          <div className="space-y-2">
            <FieldLabel label="Lớp học tiếp nhận">
              {isHoldingClass ? (
                <div className="space-y-2">
                  <div
                    onClick={() => setKeepExistingClass(true)}
                    className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      keepExistingClass
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                        : 'border-border bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                        <span>Tiếp tục học lớp cũ đã giữ chỗ: {classCode}</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        {className} • Cơ sở: {branchName}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                      Đã giữ chỗ
                    </span>
                  </div>

                  <div
                    onClick={() => setKeepExistingClass(false)}
                    className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all space-y-2 ${
                      !keepExistingClass
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                        : 'border-border bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <School className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Chuyển sang lớp khác tại cơ sở</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">Tùy chọn ghép lớp</span>
                    </div>

                    {!keepExistingClass && (
                      <select
                        value={selectedClassCode}
                        onChange={(e) => setSelectedClassCode(e.target.value)}
                        className="w-full text-xs h-8 px-2 rounded border border-border bg-background text-foreground"
                      >
                        {availableClasses.map((c) => (
                          <option key={c.id} value={c.code}>
                            {c.code} - {c.name} ({c.schedule})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <select
                    value={selectedClassCode}
                    onChange={(e) => setSelectedClassCode(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-md border border-border bg-background text-foreground"
                  >
                    {availableClasses.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} - {c.name} ({c.schedule})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-muted-foreground block">
                    Do học viên bảo lưu rút khỏi lớp nên cần chọn lớp tiếp nhận mới.
                  </span>
                </div>
              )}
            </FieldLabel>
          </div>

          {/* Lý do đi học lại sớm */}
          <div className="space-y-2">
            <FieldLabel label="Lý do đi học lại sớm">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {QUICK_REASONS.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReason(r)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do đi học lại trước hạn..."
                className="text-xs min-h-[64px] resize-none"
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
                className="text-xs min-h-[50px] resize-none"
              />
            </FieldLabel>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
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
