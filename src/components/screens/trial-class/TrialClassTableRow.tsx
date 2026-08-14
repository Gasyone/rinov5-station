'use client'

import { FileText, Check, X, ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge, ContactCell, PersonnelCell, StudentProfileHoverCard, type StudentProfileItem } from '@/components/shared'
import { SessionHoverCard, type GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import type { TrialClass } from '@/mocks/trialClasses'
import {
  getInitials,
  getTrialFamilyMembers,
  getTrialStatusLabel,
  formatSessionDateTimeRange,
  formatTimeOnly,
  getEndTime,
  buildTrialSessionData,
} from './trialClassHelpers'


interface TrialClassTableRowProps {
  trial: TrialClass
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onRequestReschedule?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassTableRow({
  trial,
  isSelected,
  onToggle,
  onRowClick,
  onOpenAssignReschedule,
  onApprove,
  onReject,
}: TrialClassTableRowProps) {
  const familyMembers = getTrialFamilyMembers(trial)
  const primaryFamilyMember = familyMembers.find((member: import('@/mocks/trialClasses').TrialClassFamilyMember) => member.isPrimary) ?? familyMembers[0]
  const sessionData = buildTrialSessionData(trial)

  const studentProfile: StudentProfileItem = {
    id: trial.customerId,
    name: trial.studentName,
    branch: trial.branch || trial.school,
    parentName: primaryFamilyMember.name || trial.familyName,
    parentPhone: primaryFamilyMember.phone || trial.familyPhone,
  }

  return (
    <TableRow
      className="group cursor-pointer border-b-0"
      onClick={() => onRowClick(trial.id)}
    >
      <TableCell
        className="sticky left-0 z-30 w-12 min-w-12 max-w-12 overflow-hidden bg-background text-center group-hover:bg-muted/50"
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(trial.id, Boolean(checked))}
        />
      </TableCell>

      <TableCell className="sticky left-12 z-20 w-80 min-w-80 max-w-80 overflow-hidden bg-background group-hover:bg-muted/50">
        <div className="relative z-10 max-w-full overflow-hidden pr-24">
          <div className="flex min-w-0 items-center gap-3">
            <div onClick={(event) => event.stopPropagation()}>
              <StudentProfileHoverCard student={studentProfile} align="start" side="right">
                <div className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                  {getInitials(trial.studentName)}
                </div>
              </StudentProfileHoverCard>
            </div>

            <div className="min-w-0">
              <p
                className="truncate font-semibold cursor-pointer hover:text-primary hover:underline text-foreground"
                title={trial.studentName}
                onClick={() => onRowClick(trial.id)}
              >
                {trial.studentName}
              </p>
              <div className="flex min-w-0 items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs text-muted-foreground">{trial.id}</span>
                <Badge variant="secondary" className="h-4 rounded px-1 text-[10px] uppercase shrink-0">
                  {trial.subject}
                </Badge>
              </div>
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

            {trial.sessions.length > 0 && (trial.status === 'confirmed' || trial.status === 'pending_approval') && onOpenAssignReschedule && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Đổi buổi học"
                aria-label={`Đổi buổi học cho ${trial.studentName}`}
                onClick={() => onOpenAssignReschedule(trial.id)}
                className="bg-transparent shadow-none hover:bg-primary/10"
              >
                <ArrowRightLeft className="h-4 w-4 text-primary" />
              </Button>
            )}
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
            <p className="truncate text-sm font-medium" title={trial.sessions[0].className}>
              {trial.sessions[0].className}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
              <ClassCodeHoverCell
                classCode={trial.sessions[0].classId}
                subject={trial.subject}
                level={trial.program}
                teacherCode={trial.owner}
                schedule={formatSessionDateTimeRange(trial.sessions[0].trialDate)}
              />
              <span>·</span>
              <span className="truncate">{trial.program}</span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">Chưa ghép</span>
        )}
      </TableCell>

      <TableCell>
        {sessionData && trial.sessions.length > 0 ? (
          <div className="space-y-0.5">
            <p className="truncate text-sm font-medium">{trial.sessions[0].sessionName}</p>
            <div onClick={(e) => e.stopPropagation()}>
              <SessionHoverCard session={sessionData} side="bottom">
                <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                  {formatSessionDateTimeRange(trial.sessions[0].trialDate)}
                </p>
              </SessionHoverCard>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">Chưa xếp lịch</span>
        )}
      </TableCell>

      <TableCell onClick={(event) => event.stopPropagation()}>
        {trial.status === 'completed' ? (
          <a
            href={`/app/trial_class/feedback/${trial.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Xem nhận xét</span>
          </a>
        ) : trial.sessions.length > 0 ? (
          <span className="text-muted-foreground text-xs italic">Chờ nhận xét</span>
        ) : (
          <span className="text-muted-foreground text-xs italic">—</span>
        )}
      </TableCell>

      <TableCell>
        {trial.owner && trial.owner !== '—' ? (
          <div className="space-y-0.5">
            <PersonnelCell
              items={[{ name: trial.owner }]}
              size="sm"
              mode="single"
            />
            <p className="truncate text-xs text-muted-foreground" title={trial.branch || trial.school}>
              {trial.branch || trial.school}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">—</span>
        )}
      </TableCell>

      <TableCell>
        <div className="flex flex-col items-start gap-0.5">
          <StatusBadge
            status={trial.status === 'reschedule' ? 'confirmed' : trial.status}
            label={getTrialStatusLabel(trial.status)}
          />
          {trial.status === 'reschedule' && (
            <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              Cần đổi lịch
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
