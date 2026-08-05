'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel, StatusBadge } from '@/components/shared'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import { TrialClassSchedulePanel } from '@/components/screens/trial-class/TrialClassSchedulePanel'
import type { TrialSessionSelection } from '@/components/screens/trial-class/trialClassTypes'
import { getMakeupStatusLabel, formatDateWithWeekday } from './makeupClassHelpers'

interface MakeupClassAssignDialogProps {
  open: boolean
  request: MakeupClassRequest | null
  onOpenChange: (open: boolean) => void
  onAssign: (
    requestId: string,
    session: TrialSessionSelection,
    notes: string
  ) => void
}

export function MakeupClassAssignDialog({
  open,
  request,
  onOpenChange,
  onAssign,
}: MakeupClassAssignDialogProps) {
  const [selectedSessions, setSelectedSessions] = useState<TrialSessionSelection[]>([])
  const [internalNotes, setInternalNotes] = useState('')

  if (!request) return null

  const isChange = Boolean(request.makeupClassName)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedSessions([])
      setInternalNotes('')
    }
    onOpenChange(isOpen)
  }

  const canConfirm = selectedSessions.length > 0

  const handleConfirm = () => {
    if (!canConfirm || !request || selectedSessions.length === 0) return
    onAssign(request.id, selectedSessions[0], internalNotes)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xs font-normal text-muted-foreground">
            Chi tiết ghép lớp
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          {/* Thông tin hiện tại */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-sm">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Lớp gốc:</span>{' '}
                <span className="font-semibold text-foreground">{request.originalClassName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Buổi học:</span>{' '}
                <span className="font-medium text-foreground">{request.originalSessionName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Thời gian:</span>{' '}
                <span className="font-medium text-foreground">
                  {formatDateWithWeekday(request.originalSessionDate)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Trạng thái:</span>{' '}
                <StatusBadge status={request.status} label={getMakeupStatusLabel(request.status)} />
              </div>
            </div>
          </div>

          {/* Lịch khả dụng (Reusing TrialClassSchedulePanel) */}
          <section className="p-0">
            <TrialClassSchedulePanel
              program={request.program}
              selectedSessions={selectedSessions}
              onSelectSession={(session) => {
                setSelectedSessions([session])
              }}
            />
          </section>
        </div>

        {/* Ghi chú cho giáo viên */}
        <div className="shrink-0 pt-2 pb-1">
          <FieldLabel label="Ghi chú cho giáo viên (tùy chọn)">
            <Textarea
              rows={1.5}
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              placeholder="VD: Bé cần hỗ trợ thêm về phát âm..."
              className="h-12 min-h-12 resize-none text-sm"
            />
          </FieldLabel>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 flex items-center justify-between sm:justify-between pt-2 border-t border-border/50">
          <div className="text-left text-sm text-muted-foreground">
            {selectedSessions.length > 0 ? (
              <span>
                Đã chọn: <strong className="text-foreground">{selectedSessions[0].className} — {selectedSessions[0].sessionName}</strong>
              </span>
            ) : (
              <span>Vui lòng chọn ít nhất 1 buổi học</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={!canConfirm}>
              {isChange ? 'Lưu thay đổi' : 'Xác nhận ghép'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
