'use client'

import { CalendarDays, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TrialClass } from '@/mocks/trialClasses'
import type { AssignDialogMode } from './trialClassTypes'

interface TrialClassDetailActionsProps {
  trial: TrialClass
  onAssign?: (mode: AssignDialogMode) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassDetailActions({
  trial,
  onAssign,
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
      {trial.status === 'reschedule' && onAssign && (
        <Button variant="outline" onClick={() => onAssign({ mode: 'assign', trialId: trial.id })}>
          <CalendarDays className="h-4 w-4" />
          Ghép lại lớp
        </Button>
      )}
    </div>
  )
}
