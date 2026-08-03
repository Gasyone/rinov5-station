'use client'

import { Phone, Check, X } from 'lucide-react'
import { useCallStore } from '@/stores/useCallStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  StatusBadge,
  ContactCell,
  PersonnelCell,
  StudentProfileHoverCard,
  type StudentProfileItem,
} from '@/components/shared'
import { SessionHoverCard, type GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import {
  getInitials,
  getMakeupStatusLabel,
  formatDateShort,
  formatTimeOnly,
  getEndTime,
  formatSessionDateTimeRange,
  isExpiryApproaching,
} from './makeupClassHelpers'

interface MakeupClassTableRowProps {
  request: MakeupClassRequest
  isSelected: boolean
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

function buildSessionData(
  req: MakeupClassRequest,
  type: 'original' | 'makeup'
): GenericSessionData {
  const isOrig = type === 'original'
  const dateStr = isOrig ? req.originalSessionDate : (req.makeupSessionDate ?? '')
  const startTime = formatTimeOnly(dateStr)
  const endTime = getEndTime(startTime)
  const timeSlot = endTime ? `${startTime} - ${endTime}` : startTime

  if (isOrig) {
    return {
      id: req.originalClassId,
      className: req.originalClassName,
      classCode: req.originalClassId,
      title: req.originalSessionName,
      subject: req.subject,
      level: req.program,
      branch: req.branch,
      date: req.originalSessionDate,
      timeLabel: startTime,
      endTimeLabel: endTime,
      timeSlot,
      scheduleType: 'class',
    }
  }
  return {
    id: req.makeupClassId ?? '',
    className: req.makeupClassName ?? '',
    classCode: req.makeupClassId ?? '',
    title: req.makeupSessionName ?? '',
    subject: req.subject,
    level: req.program,
    branch: req.branch,
    date: req.makeupSessionDate ?? '',
    timeLabel: startTime,
    endTimeLabel: endTime,
    timeSlot,
    scheduleType: 'class',
  }
}

export function MakeupClassTableRow({
  request,
  isSelected,
  onToggle,
  onRowClick,
  onApprove,
  onReject,
}: MakeupClassTableRowProps) {
  const startCall = useCallStore((s) => s.startCall)
  const expiryWarning = isExpiryApproaching(request.expiryDate)

  const studentProfile: StudentProfileItem = {
    id: request.customerId,
    name: request.studentName,
    branch: request.branch,
    parentName: request.familyName,
    parentPhone: request.familyPhone,
  }

  const originalSession = buildSessionData(request, 'original')
  const makeupSession = request.makeupClassName ? buildSessionData(request, 'makeup') : null

  return (
    <TableRow
      className="group cursor-pointer border-b-0"
      onClick={() => onRowClick(request.id)}
    >
      <TableCell
        className="sticky left-0 z-30 w-12 min-w-12 max-w-12 overflow-hidden bg-background text-center group-hover:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(request.id, Boolean(checked))}
        />
      </TableCell>

      {/* Học viên (sticky) — Name + mã HB + môn học, hover = profile */}
      <TableCell className="sticky left-12 z-20 w-80 min-w-80 max-w-80 overflow-hidden bg-background group-hover:bg-muted">
        <div className="relative z-10 max-w-full overflow-hidden pr-24">
          <div className="flex min-w-0 items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <StudentProfileHoverCard student={studentProfile} align="start" side="right">
              <div className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                {getInitials(request.studentName)}
              </div>
            </StudentProfileHoverCard>
            <div className="min-w-0">
              <StudentProfileHoverCard student={studentProfile} align="start" side="bottom">
                <p className="truncate font-semibold cursor-pointer hover:text-primary hover:underline" title={request.studentName}>
                  {request.studentName}
                </p>
              </StudentProfileHoverCard>
              <div className="flex min-w-0 items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-muted-foreground">{request.id}</span>
                <Badge variant="secondary" className="h-4 rounded px-1 text-[10px] uppercase">
                  {request.subject}
                </Badge>
              </div>
            </div>
          </div>

          {/* Hover actions */}
          <div
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
            onClick={(e) => e.stopPropagation()}
          >
            {request.status === 'cho_duyet' && onApprove && onReject && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Duyệt phiếu bù"
                  aria-label={`Duyệt phiếu bù cho ${request.studentName}`}
                  onClick={() => onApprove(request.id)}
                  className="bg-transparent shadow-none hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/30"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Từ chối phiếu bù"
                  aria-label={`Từ chối phiếu bù cho ${request.studentName}`}
                  onClick={() => onReject(request.id)}
                  className="bg-transparent shadow-none hover:bg-red-50 text-red-600 dark:hover:bg-red-950/30"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              title="Gọi điện"
              aria-label={`Gọi ${request.studentName}`}
              onClick={() => {
                startCall({
                  studentId: request.customerId,
                  studentName: request.studentName,
                  parentPhone: request.familyPhone,
                  parentName: request.familyName,
                })
              }}
              className="bg-transparent shadow-none hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </TableCell>

      {/* Liên hệ */}
      <TableCell onClick={(e) => e.stopPropagation()}>
        <ContactCell
          name={request.familyName}
          phone={request.familyPhone}
          studentId={request.customerId}
          studentName={request.studentName}
          masked={true}
        />
      </TableCell>

      {/* Lớp gốc — Tên lớp, mã lớp (ClassCodeHoverCell -> profile), trình độ */}
      <TableCell>
        <div className="space-y-0.5">
          <p className="truncate text-sm font-medium" title={request.originalClassName}>
            {request.originalClassName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            <ClassCodeHoverCell
              classCode={request.originalClassId}
              subject={request.subject}
              level={request.program}
              teacherCode={request.owner}
              schedule={formatSessionDateTimeRange(request.originalSessionDate)}
            />
            <span>·</span>
            <span className="truncate">{request.program}</span>
          </div>
        </div>
      </TableCell>

      {/* Buổi nghỉ — Tên buổi, Thứ ngày & Giờ bắt đầu-kết thúc, hover = session profile */}
      <TableCell onClick={(e) => e.stopPropagation()}>
        <SessionHoverCard session={originalSession} side="bottom">
          <div className="cursor-pointer space-y-0.5 hover:text-primary">
            <p className="truncate text-sm font-medium">{request.originalSessionName}</p>
            <p className="text-xs text-muted-foreground">
              {formatSessionDateTimeRange(request.originalSessionDate)}
            </p>
          </div>
        </SessionHoverCard>
      </TableCell>

      {/* Lớp ghép — Tên lớp bù, mã lớp (ClassCodeHoverCell -> profile), trình độ */}
      <TableCell>
        {request.makeupClassName && request.makeupClassId ? (
          <div className="space-y-0.5">
            <p className="truncate text-sm font-medium" title={request.makeupClassName}>
              {request.makeupClassName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
              <ClassCodeHoverCell
                classCode={request.makeupClassId}
                subject={request.subject}
                level={request.program}
                teacherCode={request.owner}
                schedule={formatSessionDateTimeRange(request.makeupSessionDate ?? '')}
              />
              <span>·</span>
              <span className="truncate">{request.program}</span>
            </div>
          </div>
        ) : (
          <span className="text-xs italic text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Buổi bù — Tên buổi, Thứ ngày & Giờ bắt đầu-kết thúc, hover = session profile */}
      <TableCell onClick={(e) => e.stopPropagation()}>
        {makeupSession ? (
          <SessionHoverCard session={makeupSession} side="bottom">
            <div className="cursor-pointer space-y-0.5 hover:text-primary">
              <p className="truncate text-sm font-medium">{request.makeupSessionName}</p>
              <p className="text-xs text-muted-foreground">
                {formatSessionDateTimeRange(request.makeupSessionDate ?? '')}
              </p>
            </div>
          </SessionHoverCard>
        ) : (
          <span className="text-xs italic text-muted-foreground">Chưa xếp lịch</span>
        )}
      </TableCell>

      {/* Hạn bù */}
      <TableCell>
        <span className={`text-sm font-medium ${expiryWarning ? 'text-amber-600 dark:text-amber-400' : ''}`}>
          {formatDateShort(request.expiryDate)}
        </span>
      </TableCell>

      {/* Người phụ trách + Cơ sở */}
      <TableCell>
        <div className="space-y-0.5">
          <PersonnelCell
            items={[{ name: request.owner }]}
            size="sm"
            mode="single"
          />
          <p className="truncate text-xs text-muted-foreground" title={request.branch}>
            {request.branch}
          </p>
        </div>
      </TableCell>

      {/* Trạng thái */}
      <TableCell>
        <StatusBadge status={request.status} label={getMakeupStatusLabel(request.status)} />
      </TableCell>
    </TableRow>
  )
}
