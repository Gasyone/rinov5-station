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
import { InlineSelect } from '@/components/controls'
import { FieldLabel } from '@/components/shared'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { TrialClass } from '@/mocks/trialClasses'
import { RESCHEDULE_REASONS } from './trialClassConstants'
import { formatTrialDate } from './trialClassHelpers'

interface TrialClassRescheduleDialogProps {
  open: boolean
  trial: TrialClass
  onOpenChange: (open: boolean) => void
  onRequestReschedule: (trialId: string, reason: string, notes: string) => void
}

export function TrialClassRescheduleDialog({
  open,
  trial,
  onOpenChange,
  onRequestReschedule,
}: TrialClassRescheduleDialogProps) {
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [rescheduleNotes, setRescheduleNotes] = useState('')

  const handleConfirm = () => {
    onRequestReschedule(trial.id, rescheduleReason, rescheduleNotes)
    setRescheduleReason('')
    setRescheduleNotes('')
    onOpenChange(false)
  }

  const warningTone = getStatusColors('warning')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yêu cầu đổi lịch</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ giải phóng slot lớp cũ, chuyển booking về trạng thái chờ.
          </DialogDescription>
        </DialogHeader>
        {trial.sessions.length > 0 ? (
          <div className={cn('rounded-md border border-border px-3 py-2 text-xs', warningTone.bg)}>
            <span className="font-semibold">{trial.sessions[0].className}</span> &middot; {trial.sessions[0].sessionName} &middot; {formatTrialDate(trial.sessions[0].trialDate)}
            {trial.sessions.length > 1 && ` (+${trial.sessions.length - 1} buổi)`}
          </div>
        ) : null}
        <div className="space-y-3">
          <FieldLabel label="Lý do đổi lịch">
            <InlineSelect
              value={rescheduleReason}
              ariaLabel="Lý do đổi lịch"
              options={[
                { value: '', label: 'Chọn lý do' },
                ...RESCHEDULE_REASONS.map((reason) => ({ value: reason, label: reason })),
              ]}
              onValueChange={setRescheduleReason}
              className="h-9 border-solid text-sm shadow-xs"
            />
          </FieldLabel>
          <FieldLabel label="Ghi chú (tùy chọn)">
            <Textarea
              rows={2}
              value={rescheduleNotes}
              onChange={(event) => setRescheduleNotes(event.target.value)}
              placeholder="VD: Khách xin dời sang cuối tuần..."
            />
          </FieldLabel>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleConfirm} disabled={!rescheduleReason}>
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
