'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel, StatusBadge } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import type { AssignDialogMode, TrialSessionSelection } from './trialClassTypes'
import { formatTrialDate, getTrialStatusLabel } from './trialClassHelpers'
import { TrialClassSchedulePanel } from './TrialClassSchedulePanel'

interface TrialClassAssignDialogProps {
  mode: AssignDialogMode
  trial: TrialClass | null
  onOpenChange: (open: boolean) => void
  onAssign: (trialId: string, sessions: TrialSessionSelection[], notes: string, rescheduleReason?: string) => void
}

export function TrialClassAssignDialog({
  mode,
  trial,
  onOpenChange,
  onAssign,
}: TrialClassAssignDialogProps) {
  const [selectedSessions, setSelectedSessions] = useState<TrialSessionSelection[]>([])
  const [internalNotes, setInternalNotes] = useState('')

  const isOpen = mode.mode !== 'closed'
  const isReschedule = mode.mode === 'reschedule'

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedSessions([])
      setInternalNotes('')
    }
    onOpenChange(open)
  }

  if (!trial) {
    return (
      <Dialog open={false} onOpenChange={handleOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

  const canConfirm = selectedSessions.length > 0

  const handleConfirm = () => {
    if (!canConfirm || !trial) return
    onAssign(trial.id, selectedSessions, internalNotes)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>{isReschedule ? 'Đổi buổi học' : 'Ghép lớp học thử'}</DialogTitle>
          {!isReschedule && (
            <DialogDescription>
              Tìm lớp phù hợp cho {trial.studentName}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {(trial.sessions.length > 0 || isReschedule) && (
            <div className="p-0">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {isReschedule && trial.sessions.length === 0
                  ? 'Lớp cũ (đã giải phóng)'
                  : 'Thông tin hiện tại'}
              </h4>
              {trial.sessions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Lớp:</span>{' '}
                    <span className="font-medium">
                      {Array.from(new Set(trial.sessions.map(s => s.className))).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Buổi học:</span>{' '}
                    <span className="font-medium">{trial.sessions.length} buổi</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thời gian:</span>{' '}
                    <span className="font-medium">
                      {trial.sessions.length > 0 ? formatTrialDate(trial.sessions[0].trialDate) : ''}
                      {trial.sessions.length > 1 ? ' ...' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trạng thái:</span>{' '}
                    <StatusBadge status={trial.status} label={getTrialStatusLabel(trial.status)} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Chưa từng ghép lớp</p>
              )}
            </div>
          )}

          <section className="p-0">
            <TrialClassSchedulePanel
              program={trial.program}
              selectedSessions={selectedSessions}
              onSelectSession={(session) => {
                setSelectedSessions((current) => {
                  const isAlreadySelected = current.some(
                    (s) => s.classId === session.classId && s.sessionId === session.sessionId
                  )
                  if (current.length > 0 && current[0].classId !== session.classId) {
                    return [session]
                  }
                  if (isAlreadySelected) {
                    return current.filter(
                      (s) => !(s.classId === session.classId && s.sessionId === session.sessionId)
                    )
                  }
                  return [...current, session]
                })
              }}
            />
          </section>
        </div>

        {/* Ghi chú cố định ở footer */}
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

        <DialogFooter className="shrink-0 flex items-center justify-between sm:justify-between pt-2">
          <div className="text-left text-sm text-muted-foreground">
            {selectedSessions.length > 0 ? (
              <span>
                Đã chọn: <strong className="text-foreground">{selectedSessions.length} buổi học</strong>
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
              {isReschedule ? 'Lưu thay đổi' : 'Xác nhận ghép'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
