'use client'

import { CalendarDays, Clock, XCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TrialClass, TrialClassStatus } from '@/mocks/trialClasses'
import type { AssignDialogMode } from './trialClassTypes'

interface TrialClassDetailActionsProps {
  trial: TrialClass
  onAssign: (mode: AssignDialogMode) => void
  onOpenCancel: () => void
  onOpenReschedule: () => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

function canCancelStatus(status: TrialClassStatus): boolean {
  return !['cancelled', 'completed', 'no_show', 'reschedule'].includes(status)
}

export function TrialClassDetailActions({
  trial,
  onAssign,
  onOpenCancel,
  onOpenReschedule,
  onApprove,
  onReject,
}: TrialClassDetailActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {trial.status === 'pending_approval' && onApprove && onReject && (
        <>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onApprove(trial.id)}>
            <Check className="h-4 w-4" />
            Chấp thuận ghép
          </Button>
          <Button variant="destructive" onClick={() => onReject(trial.id)}>
            <X className="h-4 w-4" />
            Từ chối ghép
          </Button>
        </>
      )}
      {canCancelStatus(trial.status) && trial.status !== 'pending_approval' && (
        <Button variant="destructive" onClick={onOpenCancel}>
          <XCircle className="h-4 w-4" />
          Hủy lịch
        </Button>
      )}
      {trial.status === 'completed' && (
        <span className="text-xs text-muted-foreground">Đã hoàn thành</span>
      )}
      {trial.status === 'no_show' && (
        <span className="text-xs text-muted-foreground">Không đến</span>
      )}
      {trial.status === 'cancelled' && (
        <span className="text-xs text-muted-foreground">Đã hủy</span>
      )}
      {trial.status === 'rejected' && (
        <span className="text-xs text-muted-foreground">Bị từ chối ghép lớp</span>
      )}
      {(trial.status === 'pending_approval' || trial.status === 'reschedule' || trial.status === 'rejected' || trial.sessions.length === 0) && (
        <Button variant="outline" onClick={() => onAssign({ mode: 'assign', trialId: trial.id })}>
          <CalendarDays className="h-4 w-4" />
          {trial.status === 'reschedule' || trial.previousSession ? 'Ghép lại lớp' : 'Ghép lớp'}
        </Button>
      )}
      {trial.status === 'confirmed' && (
        <Button variant="outline" onClick={() => onAssign({ mode: 'reschedule', trialId: trial.id })}>
          <Clock className="h-4 w-4" />
          Đổi buổi
        </Button>
      )}
      {(trial.status === 'confirmed') && (
        <Button variant="outline" onClick={onOpenReschedule}>
          <Clock className="h-4 w-4" />
          Yêu cầu đổi lịch
        </Button>
      )}
    </div>
  )
}
