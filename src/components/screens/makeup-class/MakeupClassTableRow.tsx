'use client'

import { useState } from 'react'
import { Phone, Check, X, MessageSquare } from 'lucide-react'
import { useCallStore } from '@/stores/useCallStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
  formatTimeOnly,
  getEndTime,
  formatSessionDateTimeRange,
  getAttendanceStatusText,
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
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const startCall = useCallStore((s) => s.startCall)

  const studentProfile: StudentProfileItem = {
    id: request.customerId,
    name: request.studentName,
    branch: request.branch,
    parentName: request.familyName,
    parentPhone: request.familyPhone,
  }

  const originalSession = buildSessionData(request, 'original')
  const makeupSession = request.makeupClassName ? buildSessionData(request, 'makeup') : null

  const hasComment = Boolean(request.teacherComment && request.teacherComment !== '—' && request.teacherComment !== 'Chưa có nhận xét buổi bù')
  const attendanceText = getAttendanceStatusText(request)

  return (
    <>
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

        {/* Học viên (sticky) — Avatar hover = profile card, Name click = detail dialog */}
        <TableCell className="sticky left-12 z-20 w-80 min-w-80 max-w-80 overflow-hidden bg-background group-hover:bg-muted">
          <div className="relative z-10 max-w-full overflow-hidden pr-24">
            <div className="flex min-w-0 items-center gap-3">
              {/* Hover on Avatar ONLY for StudentProfileHoverCard */}
              <div onClick={(e) => e.stopPropagation()}>
                <StudentProfileHoverCard student={studentProfile} align="start" side="right">
                  <div className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                    {getInitials(request.studentName)}
                  </div>
                </StudentProfileHoverCard>
              </div>

              {/* Student Name: click opens detail dialog */}
              <div className="min-w-0">
                <p
                  className="truncate font-semibold cursor-pointer hover:text-primary hover:underline text-foreground"
                  title={request.studentName}
                  onClick={() => onRowClick(request.id)}
                >
                  {request.studentName}
                </p>
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

        {/* Lớp gốc */}
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

        {/* Buổi nghỉ — Hover ONLY on time line below, name is plain text */}
        <TableCell>
          <div className="space-y-0.5">
            <p className="truncate text-sm font-medium">{request.originalSessionName}</p>
            <div onClick={(e) => e.stopPropagation()}>
              <SessionHoverCard session={originalSession} side="bottom">
                <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                  {formatSessionDateTimeRange(request.originalSessionDate)}
                </p>
              </SessionHoverCard>
            </div>
          </div>
        </TableCell>

        {/* Lớp ghép */}
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

        {/* Buổi bù — Hover ONLY on time line below, name is plain text */}
        <TableCell>
          {makeupSession ? (
            <div className="space-y-0.5">
              <p className="truncate text-sm font-medium">{request.makeupSessionName}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <SessionHoverCard session={makeupSession} side="bottom">
                  <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                    {formatSessionDateTimeRange(request.makeupSessionDate ?? '')}
                  </p>
                </SessionHoverCard>
              </div>
            </div>
          ) : (
            <span className="text-xs italic text-muted-foreground">Chưa xếp lịch</span>
          )}
        </TableCell>

        {/* Cột Kết quả (Replaces Hạn bù) — Attendance Badge + Teacher Comment Link */}
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={`rounded px-1.5 py-0 text-[11px] font-medium border-0 ${
                attendanceText === 'Có mặt' || attendanceText === 'Đã điểm danh'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : attendanceText === 'Vắng mặt'
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {attendanceText}
            </Badge>

            <div>
              {hasComment ? (
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium underline underline-offset-2 hover:text-primary/80 cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>Xem nhận xét</span>
                </button>
              ) : (
                <span className="text-xs italic text-muted-foreground">Chưa nhận xét</span>
              )}
            </div>
          </div>
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

      {/* Modal Nhận xét của Giáo viên */}
      {feedbackOpen && (
        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Nhận xét buổi học bù</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2 text-sm">
              <div className="flex flex-col gap-1 rounded-lg border border-border/80 bg-muted/30 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Học viên:</span>
                  <span className="font-semibold text-foreground">{request.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lớp ghép:</span>
                  <span className="font-semibold text-foreground">{request.makeupClassName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buổi bù:</span>
                  <span className="font-semibold text-foreground">{request.makeupSessionName || '—'}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Nội dung nhận xét của giáo viên:</p>
                <div className="rounded-lg border border-border/80 bg-background p-3.5 leading-relaxed text-foreground shadow-2xs">
                  {request.teacherComment}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setFeedbackOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
