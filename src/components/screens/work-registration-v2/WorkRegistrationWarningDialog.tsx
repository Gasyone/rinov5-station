'use client'

import { AlertTriangle, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

interface WorkRegistrationWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const notes = [
  'Chỉ đăng ký những khung giờ bạn thực sự có thể làm việc.',
  'Khung giờ đã được dùng để xếp lịch lớp sẽ bị khóa và phải đi qua luồng đổi lịch.',
  'Giờ vàng là tín hiệu lập kế hoạch theo trung tâm; dùng nút thiết lập riêng trên toolbar để cấu hình.',
]

export function WorkRegistrationWarningDialog({
  open,
  onOpenChange,
}: WorkRegistrationWarningDialogProps) {
  const warning = getStatusColors('warning')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className={cn('h-5 w-5', warning.text)} />
            Cảnh báo đăng ký lịch
          </DialogTitle>
          <DialogDescription>
            Kiểm tra các ràng buộc trước khi lưu lịch khả dụng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note}
              className="flex gap-3 rounded-md border border-border bg-muted/30 p-3 text-sm"
            >
              <Star className={cn('mt-0.5 h-4 w-4 shrink-0', warning.text)} />
              <p>{note}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
