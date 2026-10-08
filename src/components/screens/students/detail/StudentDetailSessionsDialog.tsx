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

export interface StudentDetailSessionsDialogProps {
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
  const [prevInitial, setPrevInitial] = useState(initialStudiedSessions)
  const [studiedSessions, setStudiedSessions] = useState(initialStudiedSessions)

  if (initialStudiedSessions !== prevInitial) {
    setPrevInitial(initialStudiedSessions)
    setStudiedSessions(initialStudiedSessions)
  }

  const handleSave = () => {
    onSave(studiedSessions)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px] bg-background p-3 sm:p-3.5 rounded-xl border shadow-xl gap-2">
        <DialogHeader className="pb-1.5 border-b border-border/50 text-left">
          <DialogTitle className="text-xs sm:text-[12.5px] font-bold flex items-center gap-1.5 text-foreground leading-tight">
            <Pencil className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" /> Cập nhật số buổi học
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-1 text-left">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Tổng số buổi
              </label>
              <Input
                type="number"
                disabled
                value={totalSessions}
                className="h-7.5 text-xs bg-muted/60 text-muted-foreground cursor-not-allowed font-mono text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Số buổi đã học
              </label>
              <Input
                type="number"
                min={0}
                max={totalSessions}
                value={studiedSessions}
                onChange={(e) => setStudiedSessions(parseInt(e.target.value) || 0)}
                className="h-7.5 text-xs font-mono text-center font-medium"
              />
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5 px-0.5">
            <span>Số buổi còn lại:</span>
            <span className="font-semibold text-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded text-xs">
              {Math.max(0, totalSessions - studiedSessions)} buổi
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-1.5 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-2.5 text-xs cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 px-3 bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-3xs"
          >
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
