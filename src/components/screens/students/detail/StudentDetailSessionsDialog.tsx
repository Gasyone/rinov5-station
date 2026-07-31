'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StudentDetailSessionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalSessions: number
  initialStudiedSessions: number
  onSave: (studiedSessions: number) => void
}

export function StudentDetailSessionsDialog({
  open,
  onOpenChange,
  totalSessions,
  initialStudiedSessions,
  onSave,
}: StudentDetailSessionsDialogProps) {
  const [studiedSessions, setStudiedSessions] = useState(initialStudiedSessions)

  const handleSave = () => {
    onSave(studiedSessions)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-background p-5 rounded-xl border shadow-lg">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-sm font-bold flex items-center gap-1.5">
            <Pencil className="h-4 w-4 text-primary" /> Cập nhật số buổi học
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Tổng số buổi</label>
              <Input
                type="number"
                disabled
                value={totalSessions}
                className="h-9 text-xs bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Số buổi đã học</label>
              <Input
                type="number"
                min={0}
                value={studiedSessions}
                onChange={(e) => setStudiedSessions(parseInt(e.target.value) || 0)}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Số buổi còn lại sẽ được tính tự động:{' '}
            <strong className="text-foreground">{Math.max(0, totalSessions - studiedSessions)} buổi</strong>.
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs cursor-pointer">
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
