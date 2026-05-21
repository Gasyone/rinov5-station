'use client'

import { CheckCircle, Copy, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import {
  getInitials,
  getTrialFamilyMembers,
  getTrialStatusLabel,
  maskPhone,
} from './trialClassHelpers'
import { TrialClassFamilyPopover } from './TrialClassFamilyPopover'
import { TrialClassSessionsPopover } from './TrialClassSessionsPopover'

interface TrialClassTableRowProps {
  trial: TrialClass
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
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
  copiedKey,
  onToggle,
  onRowClick,
  onCopy,
}: TrialClassTableRowProps) {
  const familyMembers = getTrialFamilyMembers(trial)
  const primaryFamilyMember = familyMembers.find((member) => member.isPrimary) ?? familyMembers[0]

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

      <TableCell className="sticky left-12 z-20 min-w-72 max-w-72 overflow-hidden bg-background group-hover:bg-muted">
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
            <Button
              variant="ghost"
              size="icon-sm"
              title="Gọi điện"
              aria-label={`Gọi ${trial.studentName}`}
              onClick={() => onCopy(trial.familyPhone, `phone-${trial.id}`)}
              className="bg-transparent shadow-none hover:bg-transparent"
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

      <TableCell>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-sm">{trial.familyName}</p>
            {familyMembers.length > 1 ? (
              <TrialClassFamilyPopover
                trial={trial}
                copiedKey={copiedKey}
                onCopy={onCopy}
              />
            ) : null}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {maskPhone(primaryFamilyMember.phone)}
            <Button
              variant="ghost"
              size="icon-xs"
              title="Sao chép số điện thoại"
              onClick={(event) => {
                event.stopPropagation()
                onCopy(primaryFamilyMember.phone, `family-${trial.id}`)
              }}
            >
              {copiedKey === `family-${trial.id}` ? (
                <CheckCircle className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
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

      <TableCell>
        <div className="flex items-center -space-x-2">
          {[trial.creator, trial.owner].map((member) => (
            <div
              key={member}
              title={member}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-foreground"
            >
              {getInitials(member)}
            </div>
          ))}
        </div>
      </TableCell>

      <TableCell>
        <StatusBadge status={trial.status} label={getTrialStatusLabel(trial.status)} />
      </TableCell>
    </TableRow>
  )
}
