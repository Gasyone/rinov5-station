'use client'

import { FileText, Check, X, ArrowRightLeft, MoreHorizontal, Eye, RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge, PersonnelCell, StudentProfileHoverCard, ContactCell, type StudentProfileItem } from '@/components/shared'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import { cn } from '@/lib/utils'
import type { TrialClass } from '@/mocks/trialClasses'
import {
  getInitials,
  getTrialFamilyMembers,
  getTrialStatusLabel,
  formatSessionDateTimeRange,
  buildTrialSessionData,
  getAttemptNumber,
  getStudentAgeText,
  getProgramAndLevel,
} from './trialClassHelpers'


interface TrialClassTableRowProps {
  trial: TrialClass
  index: number
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onRequestReschedule?: (id: string) => void
  onOpenAssign?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassTableRow({
  trial,
  index,
  isSelected,
  copiedKey,
  onToggle,
  onRowClick,
  onCopy,
  onOpenAssign,
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

  const isEven = index % 2 === 1
  const rowBgClass = isEven ? 'bg-muted/30 dark:bg-muted/15' : 'bg-background'
  const hoverBgClass = 'group-hover:bg-accent/40 dark:group-hover:bg-accent/30'

  // Opaque solid background specifically for sticky fixed cells to prevent bleed-through when scrolling
  const stickyBgClass = isEven
    ? 'bg-[color-mix(in_srgb,var(--muted)_40%,var(--background))] dark:bg-[color-mix(in_srgb,var(--muted)_25%,var(--background))]'
    : 'bg-background'
  const stickyHoverClass = 'group-hover:bg-[color-mix(in_srgb,var(--accent)_50%,var(--background))] dark:group-hover:bg-[color-mix(in_srgb,var(--accent)_30%,var(--background))]'

  return (
    <TableRow
      className={cn(
        'group cursor-pointer border-b border-border/60 transition-colors h-[48px] [&>td]:py-1.5 [&>td]:px-2.5',
        rowBgClass,
        hoverBgClass
      )}
      onClick={() => onRowClick(trial.id)}
    >
      <TableCell
        className={cn(
          'sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center px-1 transition-colors',
          stickyBgClass,
          stickyHoverClass
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(trial.id, Boolean(checked))}
        />
      </TableCell>

      {/* Cột Học viên: Tên (N), Tuổi & Năm sinh, Trình độ dự kiến, 1 nút action menu */}
      <TableCell
        className={cn(
          'sticky left-8 z-30 w-[240px] min-w-[240px] max-w-[240px] overflow-hidden transition-colors',
          stickyBgClass,
          stickyHoverClass
        )}
      >
        <div className="relative z-10 max-w-full overflow-hidden pr-7">
          <div className="flex min-w-0 items-center gap-2">
            <div onClick={(event) => event.stopPropagation()}>
              <StudentProfileHoverCard student={studentProfile} align="start" side="right">
                <div className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-muted text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                  {getInitials(trial.studentName)}
                </div>
              </StudentProfileHoverCard>
            </div>

            <div className="min-w-0">
              <p
                className="truncate font-medium text-xs text-foreground cursor-pointer hover:text-primary hover:underline leading-tight"
                title={`${trial.studentName} (${getAttemptNumber(trial.attempt)})`}
                onClick={() => onRowClick(trial.id)}
              >
                {trial.studentName} <span className="text-muted-foreground font-normal">({getAttemptNumber(trial.attempt)})</span>
              </p>
              <p
                className="truncate text-xs text-muted-foreground leading-tight mt-0.5"
                title={getStudentAgeText(trial)}
              >
                {getStudentAgeText(trial)}
              </p>
            </div>
          </div>

          {/* 1 Nút thao tác duy nhất, mở list dropdown menu */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded"
                  title="Thao tác"
                  aria-label="Thao tác"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-xs">
                {trial.status === 'pending_approval' && (
                  trial.sessions.length > 0 ? (
                    onApprove && (
                      <DropdownMenuItem
                        onClick={() => onApprove(trial.id)}
                        className="text-emerald-600 focus:text-emerald-700 cursor-pointer text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-2" />
                        Chấp thuận ghép lớp
                      </DropdownMenuItem>
                    )
                  ) : (
                    onOpenAssign && (
                      <DropdownMenuItem
                        onClick={() => onOpenAssign(trial.id)}
                        className="text-emerald-600 focus:text-emerald-700 cursor-pointer text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Ghép lớp & xác nhận
                      </DropdownMenuItem>
                    )
                  )
                )}
                {trial.status === 'pending_approval' && trial.sessions.length > 0 && onReject && (
                  <DropdownMenuItem
                    onClick={() => onReject(trial.id)}
                    className="text-red-600 focus:text-red-700 cursor-pointer text-xs"
                  >
                    <X className="h-3.5 w-3.5 mr-2" />
                    Từ chối ghép lớp
                  </DropdownMenuItem>
                )}
                {trial.sessions.length === 0 && trial.status !== 'pending_approval' && trial.status !== 'rejected' && trial.status !== 'cancelled' && trial.status !== 'no_show' && onOpenAssign && (
                  <DropdownMenuItem
                    onClick={() => onOpenAssign(trial.id)}
                    className="text-primary focus:text-primary cursor-pointer text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    Ghép lớp
                  </DropdownMenuItem>
                )}
                {trial.status === 'rejected' && onOpenAssign && (
                  <DropdownMenuItem
                    onClick={() => onOpenAssign(trial.id)}
                    className="text-primary focus:text-primary cursor-pointer text-xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Ghép lại lớp
                  </DropdownMenuItem>
                )}
                {(trial.sessions.length > 0 || trial.status === 'reschedule') && (trial.status === 'confirmed' || trial.status === 'pending_approval' || trial.status === 'reschedule') && onOpenAssignReschedule && (
                  <DropdownMenuItem
                    onClick={() => onOpenAssignReschedule(trial.id)}
                    className="text-primary focus:text-primary cursor-pointer text-xs"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-2" />
                    Đổi buổi học
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onRowClick(trial.id)}
                  className="cursor-pointer text-xs"
                >
                  <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Xem chi tiết
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </TableCell>

      {/* Cột Liên hệ: Sử dụng ContactCell chuẩn Design System */}
      <TableCell onClick={(event) => event.stopPropagation()}>
        <ContactCell
          name={primaryFamilyMember.name || trial.parentName}
          phone={primaryFamilyMember.phone || trial.familyPhone}
          studentName={trial.studentName}
          masked={true}
          className="gap-0"
          showPhoneIcon={false}
          showCallButton={false}
          showFamilyIcon={false}
          additionalContacts={
            trial.familyMembers && trial.familyMembers.length > 1
              ? trial.familyMembers.map((m) => ({ name: m.name, phone: m.phone }))
              : undefined
          }
        />
      </TableCell>

      {/* Cột Lớp ghép & Buổi học: Dòng 1 là lịch (hover xem detail buổi), Dòng 2 là Chương trình & Level của lớp */}
      <TableCell>
        {trial.sessions.length > 0 ? (
          <div className="space-y-0.5">
            {/* Dòng 1: Lịch (Hover ra detail buổi) */}
            <div onClick={(e) => e.stopPropagation()}>
              {sessionData ? (
                <SessionHoverCard session={sessionData} side="bottom">
                  <p className="truncate text-xs font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer leading-tight">
                    {formatSessionDateTimeRange(trial.sessions[0].trialDate)}
                  </p>
                </SessionHoverCard>
              ) : (
                <p className="truncate text-xs font-normal text-sky-600 dark:text-sky-400 leading-tight">
                  {formatSessionDateTimeRange(trial.sessions[0].trialDate)}
                </p>
              )}
            </div>

            {/* Dòng 2: Chương trình & Level của lớp */}
            <p className="truncate text-xs text-muted-foreground font-normal leading-tight mt-0.5">
              {getProgramAndLevel(trial)}
            </p>
          </div>
        ) : trial.previousSession ? (
          <div className="space-y-0.5">
            <p className="truncate text-xs font-medium text-muted-foreground line-through leading-tight">
              {formatSessionDateTimeRange(trial.previousSession.trialDate)}
            </p>
            <p className="truncate text-xs text-muted-foreground font-normal leading-tight mt-0.5">
              {trial.previousSession.className}
            </p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic leading-tight">
            Chưa xếp lịch
          </span>
        )}
      </TableCell>

      {/* Cột Nhận xét / Thao tác: Hiển thị các hành động duyệt/từ chối, đổi lịch, ghép lại theo trạng thái */}
      <TableCell onClick={(event) => event.stopPropagation()}>
        {trial.status === 'pending_approval' ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {trial.sessions.length > 0 ? (
              <>
                {onApprove && (
                  <Button
                    size="xs"
                    className="h-6 px-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs rounded-md gap-1 shrink-0"
                    title="Xác nhận ghép lớp"
                    onClick={() => onApprove(trial.id)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Xác nhận</span>
                  </Button>
                )}
                {onReject && (
                  <Button
                    variant="outline"
                    size="xs"
                    className="h-6 px-2 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 shadow-xs rounded-md gap-1 shrink-0"
                    title="Từ chối ghép lớp"
                    onClick={() => onReject(trial.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Từ chối</span>
                  </Button>
                )}
              </>
            ) : (
              onOpenAssign && (
                <Button
                  size="xs"
                  className="h-6 px-2.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs rounded-md gap-1 shrink-0"
                  title="Ghép lớp và xác nhận"
                  onClick={() => onOpenAssign(trial.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ghép lớp</span>
                </Button>
              )
            )}
          </div>
        ) : trial.status === 'rejected' ? (
          onOpenAssign ? (
            <Button
              variant="outline"
              size="xs"
              className="h-6 px-2 text-xs font-medium text-foreground hover:bg-muted border-border shadow-xs rounded-md gap-1 shrink-0"
              title={trial.cancelReason || trial.notes ? `Ghép lại (${trial.cancelReason || trial.notes})` : 'Ghép lại lớp học thử'}
              onClick={() => onOpenAssign(trial.id)}
            >
              <RefreshCw className="h-3 w-3 text-muted-foreground" />
              <span>Ghép lại</span>
            </Button>
          ) : (
            <span className="text-muted-foreground text-xs italic font-normal">—</span>
          )
        ) : trial.status === 'reschedule' ? (
          onOpenAssignReschedule ? (
            <Button
              variant="outline"
              size="xs"
              className="h-6 px-2 text-xs font-medium text-foreground hover:bg-muted border-border shadow-xs rounded-md gap-1 shrink-0"
              title={trial.cancelReason || trial.notes ? `Đổi lịch (${trial.cancelReason || trial.notes})` : 'Đổi lịch học thử'}
              onClick={() => onOpenAssignReschedule(trial.id)}
            >
              <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
              <span>Đổi lịch</span>
            </Button>
          ) : (
            <span className="text-muted-foreground text-xs italic font-normal">—</span>
          )
        ) : trial.status === 'completed' ? (
          <a
            href={`/app/trial_class/feedback/${trial.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:underline cursor-pointer leading-tight"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Xem nhận xét</span>
          </a>
        ) : trial.status === 'cancelled' || trial.status === 'no_show' ? (
          <span className="text-muted-foreground text-xs italic font-normal">—</span>
        ) : trial.sessions.length === 0 ? (
          onOpenAssign ? (
            <Button
              size="xs"
              className="h-6 px-2.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs rounded-md gap-1 shrink-0"
              title="Ghép lớp học thử"
              onClick={() => onOpenAssign(trial.id)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ghép lớp</span>
            </Button>
          ) : (
            <span className="text-muted-foreground text-xs italic font-normal">—</span>
          )
        ) : trial.sessions.length > 0 ? (
          <span className="text-muted-foreground text-xs italic font-normal">Chờ nhận xét</span>
        ) : (
          <span className="text-muted-foreground text-xs italic font-normal">—</span>
        )}
      </TableCell>

      {/* Cột Trạng thái: Đặt trước Người phụ trách */}
      <TableCell className="w-28 min-w-28 max-w-32">
        <StatusBadge
          status={trial.status === 'reschedule' ? 'confirmed' : trial.status}
          label={getTrialStatusLabel(trial.status)}
          className="font-normal whitespace-nowrap"
        />
      </TableCell>

      {/* Cột Người phụ trách: Đặt sau Trạng thái */}
      <TableCell>
        {trial.owner && trial.owner !== '—' ? (
          <div className="space-y-0.5">
            <PersonnelCell
              items={[{ name: trial.owner }]}
              size="xs"
              mode="single"
            />
            <p className="truncate text-xs text-muted-foreground font-normal leading-tight mt-0.5" title={trial.branch || trial.school}>
              {trial.branch || trial.school}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic font-normal">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}
