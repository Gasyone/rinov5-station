'use client'

import { Phone, PlusCircle, FileText, RefreshCw, Check, X, ArrowRightLeft } from 'lucide-react'
import { useCallStore } from '@/stores/useCallStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge, ContactCell, PersonnelCell } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import {
  getInitials,
  getTrialFamilyMembers,
  getTrialStatusLabel,
} from './trialClassHelpers'
import { TrialClassSessionsPopover } from './TrialClassSessionsPopover'
import type { AssignDialogMode } from './trialClassTypes'

interface TrialClassTableRowProps {
  trial: TrialClass
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onAssign?: (mode: AssignDialogMode) => void
  onRequestReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

function formatTrialDateShort(dateStr: string): string {
  if (!dateStr) return '—'
  const [date] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return '—'
  return `${parts[2]}/${parts[1]}`
}

function formatTrialTime(dateStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split(' ')
  return parts[1] ?? '—'
}

export function TrialClassTableRow({
  trial,
  isSelected,
  onToggle,
  onRowClick,
  onAssign,
  onRequestReschedule,
  onApprove,
  onReject,
}: TrialClassTableRowProps) {
  const startCall = useCallStore((s) => s.startCall)
  const familyMembers = getTrialFamilyMembers(trial)
  const primaryFamilyMember = familyMembers.find((member: import('@/mocks/trialClasses').TrialClassFamilyMember) => member.isPrimary) ?? familyMembers[0]

  return (
    <TableRow
      className="group cursor-pointer border-b-0"
      onClick={() => onRowClick(trial.id)}
    >
      <TableCell
        className="sticky left-0 z-30 w-12 min-w-12 max-w-12 overflow-hidden bg-background text-center group-hover:bg-muted"
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(trial.id, Boolean(checked))}
        />
      </TableCell>

      <TableCell className="sticky left-12 z-20 w-84 min-w-84 max-w-84 overflow-hidden bg-background group-hover:bg-muted">
        <div className="relative z-10 max-w-full overflow-hidden pr-24">
          <div className="min-w-0 space-y-1.5">
            <p className="truncate font-semibold" title={trial.program}>
              {trial.program}
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{trial.id}</span>
              <Badge variant="secondary" className="h-4 rounded px-1 text-[10px] uppercase">
                {trial.subject}
              </Badge>
            </div>
          </div>

          <div
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
            onClick={(event) => event.stopPropagation()}
          >
            {trial.status === 'pending_approval' && onApprove && onReject && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Chấp thuận ghép lớp"
                  aria-label={`Chấp thuận ghép lớp cho ${trial.studentName}`}
                  onClick={() => onApprove(trial.id)}
                  className="bg-transparent shadow-none hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/30"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Từ chối ghép lớp"
                  aria-label={`Từ chối ghép lớp cho ${trial.studentName}`}
                  onClick={() => onReject(trial.id)}
                  className="bg-transparent shadow-none hover:bg-red-50 text-red-600 dark:hover:bg-red-950/30"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {trial.sessions.length === 0 && trial.status !== 'reschedule' && trial.status !== 'rejected' && onAssign && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Ghép lớp"
                aria-label={`Ghép lớp cho ${trial.studentName}`}
                onClick={() => onAssign({ mode: 'assign', trialId: trial.id })}
                className="bg-transparent shadow-none hover:bg-primary/10"
              >
                <PlusCircle className="h-4 w-4 text-primary" />
              </Button>
            )}
            {trial.status === 'rejected' && onAssign && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Ghép lớp (Từ chối trước đó)"
                aria-label={`Ghép lớp cho ${trial.studentName}`}
                onClick={() => onAssign({ mode: 'assign', trialId: trial.id })}
                className="bg-transparent shadow-none hover:bg-primary/10"
              >
                <PlusCircle className="h-4 w-4 text-primary" />
              </Button>
            )}
            {onAssign && (trial.status === 'reschedule' || (trial.sessions.length > 0 && trial.status !== 'pending_approval')) && (
              <Button
                variant="ghost"
                size="icon-sm"
                title={trial.status === 'reschedule' ? 'Ghép lại lớp' : 'Đổi buổi học'}
                aria-label={trial.status === 'reschedule' ? 'Ghép lại lớp' : 'Đổi buổi học'}
                onClick={() =>
                  onAssign(
                    trial.status === 'reschedule'
                      ? { mode: 'assign', trialId: trial.id }
                      : { mode: 'reschedule', trialId: trial.id }
                  )
                }
                className="bg-transparent shadow-none hover:bg-primary/10"
              >
                <ArrowRightLeft className="h-4 w-4 text-primary" />
              </Button>
            )}
            {trial.sessions.length > 0 && (trial.status === 'confirmed' || trial.status === 'pending_approval') && onRequestReschedule && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Yêu cầu đổi lịch"
                aria-label={`Yêu cầu đổi lịch cho ${trial.studentName}`}
                onClick={() => onRequestReschedule(trial.id)}
                className="bg-transparent shadow-none hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                <RefreshCw className="h-4 w-4 text-amber-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              title="Gọi điện"
              aria-label={`Gọi ${trial.studentName}`}
              onClick={() => {
                startCall({
                  studentId: trial.customerId,
                  studentName: trial.studentName,
                  parentPhone: trial.familyPhone,
                  parentName: trial.familyName,
                })
              }}
              className="bg-transparent shadow-none hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground">
            {getInitials(trial.studentName)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{trial.studentName}</p>
            <p className="font-mono text-xs text-muted-foreground">{trial.customerId}</p>
          </div>
        </div>
      </TableCell>

      <TableCell onClick={(event) => event.stopPropagation()}>
        <ContactCell
          name={primaryFamilyMember.name}
          phone={primaryFamilyMember.phone}
          studentId={trial.customerId}
          studentName={trial.studentName}
          masked={true}
          additionalContacts={familyMembers.length > 1 ? familyMembers : []}
        />
      </TableCell>

      <TableCell>
        <span className="font-medium text-xs text-muted-foreground">{trial.attempt}</span>
      </TableCell>



      <TableCell>
        {trial.sessions.length > 0 ? (
          <div className="space-y-0.5">
            <p className="font-medium text-sm truncate" title={trial.sessions[0].className}>{trial.sessions[0].className}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{trial.sessions[0].classId}</p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">Chưa ghép</span>
        )}
      </TableCell>

      <TableCell>
        {trial.sessions.length > 0 ? (
          <div className="space-y-1">
            {trial.sessions.length > 1 && (
              <div className="flex items-center gap-1">
                <p className="font-semibold text-[11px] text-primary uppercase">{trial.sessions.length} buổi học</p>
                <TrialClassSessionsPopover sessions={trial.sessions} />
              </div>
            )}
            <div className="space-y-0.5">
              <p className="font-medium text-sm">{trial.sessions[0].sessionName}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{trial.sessions[0].sessionId}</p>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">—</span>
        )}
      </TableCell>

      <TableCell>
        {trial.sessions.length > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              {trial.sessions.length > 1 && <span className="text-[10px] text-muted-foreground uppercase">Từ:</span>}
              <span className="font-medium text-sm leading-none">{formatTrialTime(trial.sessions[0].trialDate)} {formatTrialDateShort(trial.sessions[0].trialDate)}</span>
            </div>
            {trial.sessions.length > 1 && (
              <div className="flex items-center gap-1.5 border-t border-border/50 pt-1.5 mt-1.5">
                <span className="text-[10px] text-muted-foreground uppercase">Đến:</span>
                <span className="font-medium text-sm leading-none">{formatTrialTime(trial.sessions[trial.sessions.length - 1].trialDate)} {formatTrialDateShort(trial.sessions[trial.sessions.length - 1].trialDate)}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">—</span>
        )}
      </TableCell>

      <TableCell onClick={(event) => event.stopPropagation()}>
        {trial.status === 'completed' ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-primary border-primary/20 hover:bg-primary/5"
          >
            <a href={`/app/trial_class/feedback/${trial.id}`} target="_blank" rel="noopener noreferrer">
              <FileText className="h-3.5 w-3.5" />
              Xem nhận xét
            </a>
          </Button>
        ) : trial.sessions.length > 0 ? (
          <span className="text-muted-foreground text-xs italic">Chờ nhận xét</span>
        ) : (
          <span className="text-muted-foreground text-xs italic">—</span>
        )}
      </TableCell>

      <TableCell>
        <PersonnelCell
          items={[trial.creator, trial.owner].filter(Boolean).map((name) => ({ name }))}
          size="sm"
          mode="stack"
        />
      </TableCell>

      <TableCell>
        <StatusBadge status={trial.status} label={getTrialStatusLabel(trial.status)} />
      </TableCell>
    </TableRow>
  )
}
