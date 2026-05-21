'use client'

import { CalendarDays, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TrialClass, TrialClassStatus } from '@/mocks/trialClasses'
import type { AssignDialogMode } from './trialClassTypes'

interface TrialClassDetailActionsProps {
  trial: TrialClass
  onAssign: (mode: AssignDialogMode) => void
  onOpenCancel: () => void
  onOpenReschedule: () => void
}

function canCancelStatus(status: TrialClassStatus): boolean {
  return !['cancelled', 'completed', 'no_show'].includes(status)
}

export function TrialClassDetailActions({
  trial,
  onAssign,
  onOpenCancel,
  onOpenReschedule,
}: TrialClassDetailActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCancelStatus(trial.status) && (
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
      {(trial.status === 'pending_confirmation' || trial.status === 'reschedule' || trial.sessions.length === 0) && (
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
      {(trial.status === 'confirmed' || trial.status === 'pending_confirmation') && (
        <Button variant="outline" onClick={onOpenReschedule}>
          <Clock className="h-4 w-4" />
          Yêu cầu đổi lịch
        </Button>
      )}
    </div>
  )
}
