'use client'

import { useState } from 'react'
import {
  FileText,
  Check,
  X,
  ArrowRightLeft,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Plus,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  StatusBadge,
  PersonnelCell,
  StudentProfileHoverCard,
  ContactCell,
  type StudentProfileItem,
} from '@/components/shared'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { cn } from '@/lib/utils'
import type { TrialClass } from '@/mocks/trialClasses'
import {
  getInitials,
  getAvatarColor,
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
  onOpenAssign?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onChangeBranch?: (trialId: string, newBranch: string) => void
}

export function TrialClassTableRow({
  trial,
  index,
  isSelected,
  onToggle,
  onRowClick,
  onOpenAssign,
  onOpenAssignReschedule,
  onApprove,
  onReject,
  onChangeBranch,
}: TrialClassTableRowProps) {
  const [branchPopoverOpen, setBranchPopoverOpen] = useState(false)
  const familyMembers = getTrialFamilyMembers(trial)
  const primaryFamilyMember = familyMembers.find((member) => member.isPrimary) ?? familyMembers[0]
  const sessionData = buildTrialSessionData(trial)

  const studentProfile: StudentProfileItem = {
    id: trial.customerId,
    name: trial.studentName,
    branch: trial.branch || trial.school,
    parentName: primaryFamilyMember.name || trial.familyName,
    parentPhone: primaryFamilyMember.phone || trial.familyPhone,
  }

  // Zebra striping synchronized with OperationsAlert / StudentsTable standard
  const isEvenRow = typeof index === 'number' ? index % 2 === 1 : false
  const stickyBgClass = isSelected
    ? '!bg-sky-100 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
  const rowBgClass = isSelected
    ? '!bg-sky-50 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800'

  const currentBranch = trial.branch || trial.school || 'Chưa chọn cơ sở'

  return (
    <tr
      onClick={() => onRowClick(trial.id)}
      className={cn(
        'group cursor-pointer transition-colors align-middle [&>td]:py-1 [&>td]:px-2 xl:[&>td]:px-2.5 2xl:[&>td]:py-2 border-b-0',
        rowBgClass
      )}
    >
      {/* 1. Checkbox */}
      <td
        className={cn(
          'sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center px-1 transition-colors',
          stickyBgClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(trial.id, Boolean(checked))}
          aria-label={`Chọn ${trial.studentName}`}
        />
      </td>

      {/* 2. Cột Học viên */}
      <td
        className={cn(
          'sticky left-8 z-30 w-[230px] min-w-[210px] xl:w-[240px] 2xl:w-[260px] px-2 xl:px-2.5 transition-colors cursor-pointer',
          stickyBgClass
        )}
      >
        <div className="relative flex items-center justify-between gap-2 min-w-0 pr-1 group-hover:pr-8">
          <div className="flex items-center gap-2 2xl:gap-2.5 min-w-0 flex-1">
            <div onClick={(e) => e.stopPropagation()}>
              <StudentProfileHoverCard student={studentProfile} align="start" side="right">
                <div
                  className={cn(
                    'h-6.5 w-6.5 2xl:h-8 2xl:w-8 rounded flex items-center justify-center text-xs 2xl:text-sm font-medium shrink-0 hover:opacity-80 transition-opacity cursor-pointer',
                    getAvatarColor(trial.customerId || trial.id)
                  )}
                >
                  {getInitials(trial.studentName)}
                </div>
              </StudentProfileHoverCard>
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="font-medium text-foreground text-xs 2xl:text-sm truncate hover:underline hover:text-primary leading-tight cursor-pointer"
                title={`${trial.studentName} (${getAttemptNumber(trial.attempt)})`}
                onClick={() => onRowClick(trial.id)}
              >
                {trial.studentName}{' '}
                <span className="text-muted-foreground font-normal">
                  ({getAttemptNumber(trial.attempt)})
                </span>
              </p>
              <p
                className="truncate text-xs text-muted-foreground font-normal leading-none mt-0.5 2xl:mt-1"
                title={getStudentAgeText(trial)}
              >
                {getStudentAgeText(trial)}
              </p>
            </div>
          </div>

          {/* Action dropdown on hover */}
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => e.stopPropagation()}
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
              <DropdownMenuContent align="end" className="w-48 text-xs">
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
                  onClick={() => setBranchPopoverOpen(true)}
                  className="cursor-pointer text-xs"
                >
                  <MapPin className="h-3.5 w-3.5 mr-2 text-rose-500" />
                  Đổi cơ sở tiếp nhận
                </DropdownMenuItem>
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
      </td>

      {/* 3. Cột Liên hệ */}
      <td
        className="w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2 xl:px-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <ContactCell
          name={primaryFamilyMember.name || trial.parentName}
          phone={primaryFamilyMember.phone || trial.familyPhone}
          studentName={trial.studentName}
          masked={true}
          className="gap-0"
          showPhoneIcon={false}
          showCallButton={false}
          showFamilyIcon={false}
          nameClassName="text-xs 2xl:text-sm font-normal text-foreground"
          phoneClassName="text-xs 2xl:text-xs font-mono text-muted-foreground"
          additionalContacts={
            trial.familyMembers && trial.familyMembers.length > 1
              ? trial.familyMembers.map((m) => ({ name: m.name, phone: m.phone }))
              : undefined
          }
        />
      </td>

      {/* 4. Cột Nhu cầu đăng ký (CƠ SỞ XẾP LỚP - Có cơ chế đổi cơ sở) */}
      <td className="w-[230px] min-w-[210px] xl:w-[250px] 2xl:w-[270px] px-2 xl:px-2.5">
        <div className="space-y-1 min-w-0">
          {/* Dòng 1: Chương trình & Môn học */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-xs text-foreground truncate" title={trial.program}>
              {trial.program || 'Chưa chọn CT'}
            </span>
            {trial.subject && (
              <span className="text-xs text-muted-foreground font-normal">
                ({trial.subject})
              </span>
            )}
          </div>

          {/* Dòng 2: Cơ sở tiếp nhận + Cơ chế đổi cơ sở nhanh */}
          <div className="flex items-center gap-1 min-w-0" onClick={(e) => e.stopPropagation()}>
            <Popover open={branchPopoverOpen} onOpenChange={setBranchPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 px-1.5 py-0.5 rounded border border-border/70 transition-colors cursor-pointer max-w-full truncate bg-background/80 shadow-2xs"
                  title={`Cơ sở hiện tại: ${currentBranch}. Bấm để đổi cơ sở tiếp nhận.`}
                >
                  <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                  <span className="truncate font-normal text-xs">{currentBranch}</span>
                  <ChevronDown className="h-2.5 w-2.5 text-muted-foreground/70 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5 text-xs shadow-md">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b mb-1">
                  Chuyển cơ sở tiếp nhận
                </div>
                <div className="space-y-0.5 max-h-56 overflow-y-auto">
                  {SYSTEM_BRANCHES.map((b) => {
                    const isCurrent = (trial.branch || trial.school) === b
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setBranchPopoverOpen(false)
                          onChangeBranch?.(trial.id, b)
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left transition-colors cursor-pointer',
                          isCurrent
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted text-foreground'
                        )}
                      >
                        <span className="truncate">{b}</span>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Dòng 3: Ghi chú lịch rảnh / Nhu cầu xếp lớp */}
          {trial.notes ? (
            <p className="text-xs text-muted-foreground truncate font-normal leading-tight" title={trial.notes}>
              <span className="text-amber-600 dark:text-amber-400 font-medium mr-1">Lưu ý:</span>
              {trial.notes}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground/60 italic font-normal">Chưa có ghi chú ca rảnh</span>
          )}
        </div>
      </td>

      {/* 5. Cột Lớp ghép & Buổi học (Thực tế bố trí) */}
      <td className="w-[200px] min-w-[180px] xl:w-[220px] 2xl:w-[240px] px-2 xl:px-2.5">
        {trial.sessions.length > 0 ? (
          <div className="space-y-0.5">
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
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-normal border border-dashed border-border bg-muted/30 text-muted-foreground">
            Chưa ghép lớp
          </span>
        )}
      </td>

      {/* 6. Cột Nhận xét / Thao tác */}
      <td
        className="w-[150px] min-w-[135px] xl:w-[160px] 2xl:w-[175px] px-2 xl:px-2.5"
        onClick={(event) => event.stopPropagation()}
      >
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
      </td>

      {/* 7. Cột Trạng thái */}
      <td className="w-[125px] min-w-[115px] xl:w-[130px] 2xl:w-[140px] px-2 xl:px-2.5">
        <StatusBadge
          status={trial.status === 'reschedule' ? 'confirmed' : trial.status}
          label={getTrialStatusLabel(trial.status)}
          className="font-normal whitespace-nowrap"
        />
      </td>

      {/* 8. Cột Người phụ trách */}
      <td className="w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2 xl:px-2.5">
        {trial.owner && trial.owner !== '—' ? (
          <div className="space-y-0.5">
            <PersonnelCell
              items={[{ name: trial.owner }]}
              size="xs"
              mode="single"
            />
            <p
              className="truncate text-xs text-muted-foreground font-normal leading-tight mt-0.5"
              title={trial.branch || trial.school}
            >
              {trial.branch || trial.school}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic font-normal">—</span>
        )}
      </td>
    </tr>
  )
}
