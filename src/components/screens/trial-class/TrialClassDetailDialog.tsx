'use client'

import { useState, useMemo } from 'react'
import { CalendarDays, Clock, ExternalLink, CalendarPlus, RefreshCw, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  StatusBadge,
  ConfirmDialog,
  StudentHeaderInfoCard,
  AppAvatar,
} from '@/components/shared'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import type { TrialClass } from '@/mocks/trialClasses'
import { formatSessionDateTimeRange, getTrialStatusLabel, getLeaveReserveTicketForTrial, getTrialFamilyMembers, buildTrialSessionData } from './trialClassHelpers'
import type { AssignDialogMode } from './trialClassTypes'
import { cn } from '@/lib/utils'

interface TrialClassDetailDialogProps {
  trial: TrialClass | null
  onOpenChange: (open: boolean) => void
  onCopy?: (text: string, key: string) => void
  copiedKey?: string
  onOpenAssign?: (mode: AssignDialogMode) => void
  onRequestReschedule?: (trialId: string, reason: string, notes: string) => void
  onUpdateTrial?: (trialId: string, updater: (trial: TrialClass) => TrialClass) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

/** Field item with non-uppercase, sentence-case label */
function DetailField({
  label,
  value,
  supporting,
  className,
}: {
  label: string
  value: React.ReactNode
  supporting?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</div>
      {supporting ? <div className="mt-0.5 truncate text-xs text-muted-foreground">{supporting}</div> : null}
    </div>
  )
}

/** Section card container with rounded gray border and white background */
function DetailCard({
  title,
  icon,
  actions,
  children,
  className,
}: {
  title: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-background p-4 shadow-2xs', className)}>
      <div className="mb-3 flex items-center justify-between gap-3 shrink-0">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          {icon}
          {title}
        </h3>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}

function getAttendanceStatusInfo(t: TrialClass) {
  if (t.status === 'completed') return { text: 'Có mặt', class: 'text-emerald-600 dark:text-emerald-400' }
  if (t.status === 'no_show') return { text: 'Vắng mặt', class: 'text-red-600 dark:text-red-400' }
  if (t.status === 'confirmed') return { text: 'Chưa điểm danh', class: 'text-muted-foreground' }
  if (t.status === 'pending_approval') return { text: 'Chưa ghép lớp', class: 'text-muted-foreground' }
  return { text: 'Chưa điểm danh', class: 'text-muted-foreground' }
}

export function TrialClassDetailDialog({
  trial,
  onOpenChange,
  onOpenAssign,
  onApprove,
  onReject,
}: TrialClassDetailDialogProps) {
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; description: string } | null>(null)
  const [leaveReserveOpen, setLeaveReserveOpen] = useState(false)

  const reserveTicket = useMemo(() => {
    if (!trial) return null
    return getLeaveReserveTicketForTrial(trial.studentName, trial.familyPhone)
  }, [trial])

  const leaveReserveReq = useMemo(() => {
    if (!reserveTicket) return null
    return mockLeaveReserveRequests.find((r) => r.id === reserveTicket.id) ?? mockLeaveReserveRequests[0] ?? null
  }, [reserveTicket])

  if (!trial) return null

  const handleConfirmAction = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'approve') onApprove?.(trial.id)
    if (confirmAction.type === 'reject') onReject?.(trial.id)
    setConfirmAction(null)
  }

  const isPendingReschedule = trial.status === 'reschedule'
  const activeSessions = isPendingReschedule ? [] : trial.sessions
  const releasedSession = trial.previousSession ?? (isPendingReschedule ? trial.sessions[0] : undefined)
  const familyMembers = getTrialFamilyMembers(trial)
  const attendanceInfo = getAttendanceStatusInfo(trial)
  const sessionData = buildTrialSessionData(trial)

  return (
    <>
      <Dialog open={Boolean(trial)} onOpenChange={onOpenChange}>
        <DialogContent className="grid max-h-[88vh] w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-4xl border-none shadow-xl bg-slate-100 dark:bg-slate-900">
          {/* Header — Uniform flat gray background without border line */}
          <DialogHeader className="shrink-0 px-6 pb-0 pt-5">
            <div className="flex flex-col gap-3">
              {/* Row 1: Title (left) & Status Badge (right) */}
              <div className="flex items-center justify-between gap-4 pr-6">
                <DialogTitle className="text-xs font-normal text-muted-foreground">
                  Chi tiết Phiếu học thử
                  <Badge variant="outline" className="ml-1.5 rounded-md font-mono text-[11px] font-normal text-muted-foreground">
                    {trial.id}
                  </Badge>
                </DialogTitle>
                <div className="shrink-0">
                  <StatusBadge status={trial.status} label={getTrialStatusLabel(trial.status)} />
                </div>
              </div>

              {/* Row 2: Student Header Info Card */}
              <StudentHeaderInfoCard
                studentName={trial.studentName}
                status="Học thử"
                address={trial.school || trial.branch}
                parents={familyMembers.map((m) => ({
                  name: m.name,
                  relationship: m.isPrimary ? 'Phụ huynh' : 'Người thân',
                  isPrimary: m.isPrimary,
                  phone: m.phone,
                }))}
                initialNote={trial.notes}
              />
            </div>
          </DialogHeader>

          {/* Body area with uniform flat gray background */}
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto px-6 py-2">
            {/* Grid layout: Left column 60% (col-span-3), Right info column 40% (col-span-2) */}
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-5">
              {/* CỘT TRÁI (60%): Buổi học thử (Lớp ghép) */}
              <div className="flex flex-col gap-4 min-w-0 md:col-span-3">
                {/* 1. Buổi học thử (Lớp ghép) */}
                <DetailCard
                  title="Buổi học thử (Lớp ghép)"
                  icon={<CalendarDays className="h-4 w-4 text-primary" />}
                  actions={
                    activeSessions.length > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10"
                        onClick={() => onOpenAssign?.({ mode: 'reschedule', trialId: trial.id })}
                      >
                        <RefreshCw className="mr-1 h-3.5 w-3.5" />
                        Đổi buổi học
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => onOpenAssign?.({ mode: 'assign', trialId: trial.id })}
                      >
                        <CalendarPlus className="mr-1 h-3.5 w-3.5" />
                        Chọn buổi học
                      </Button>
                    )
                  }
                >
                  {activeSessions.length > 0 ? (
                    <div className="space-y-3">
                      {/* Dòng 1: Cơ sở / Trường (Tách riêng lên trên) */}
                      <DetailField label="Cơ sở / Trường" value={trial.school || trial.branch} />

                      {/* Dòng 2: Lớp ghép | Mã lớp */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Lớp ghép" value={activeSessions[0].className} />
                        <DetailField
                          label="Mã lớp"
                          value={
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <ClassCodeHoverCell
                                classCode={activeSessions[0].classId}
                                subject={trial.subject}
                                level={trial.program}
                                teacherCode={trial.owner}
                                schedule={formatSessionDateTimeRange(activeSessions[0].trialDate)}
                              />
                            </div>
                          }
                        />
                      </div>

                      {/* Dòng 2: Chương trình | Trình độ */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Chương trình" value={trial.subject} />
                        <DetailField label="Trình độ" value={trial.program} />
                      </div>

                      {/* Dòng 3: Tên buổi học | Thời gian học */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Tên buổi học" value={activeSessions[0].sessionName} />
                        <DetailField
                          label="Thời gian học"
                          value={
                            sessionData ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <SessionHoverCard session={sessionData}>
                                  <span className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer text-xs">
                                    {formatSessionDateTimeRange(activeSessions[0].trialDate)}
                                  </span>
                                </SessionHoverCard>
                              </div>
                            ) : (
                              formatSessionDateTimeRange(activeSessions[0].trialDate)
                            )
                          }
                        />
                      </div>

                      {/* Dòng 4: Trạng thái điểm danh | Nhận xét */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField
                          label="Trạng thái điểm danh"
                          value={
                            <span className={cn('font-semibold', attendanceInfo.class)}>
                              {attendanceInfo.text}
                            </span>
                          }
                        />
                        <DetailField
                          label="Nhận xét"
                          value={
                            trial.feedback ? (
                              <a
                                href={trial.feedback.resultLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer text-xs"
                              >
                                <MessageSquare className="h-3 w-3" />
                                <span>Xem nhận xét ({trial.feedback.rating}/5★)</span>
                              </a>
                            ) : (
                              <span className="font-normal text-muted-foreground italic text-xs">Chờ nhận xét</span>
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="group cursor-pointer rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => onOpenAssign?.({ mode: 'assign', trialId: trial.id })}
                    >
                      <p className="text-sm font-semibold text-primary group-hover:underline">
                        Chưa xếp lịch học thử &bull; Thao tác chọn buổi ngay
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Click để mở danh sách lịch khả dụng và chọn buổi học ghép cho học viên.</p>
                    </div>
                  )}
                </DetailCard>

                {/* 2. Buổi cũ / đã giải phóng (nếu có) */}
                {releasedSession && (
                  <DetailCard
                    title="Lớp cũ (Đã giải phóng)"
                    icon={<CalendarDays className="h-4 w-4 text-amber-600" />}
                    className="border-amber-200/80 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/10"
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <DetailField label="Lớp cũ" value={releasedSession.className} supporting={`Mã lớp: ${releasedSession.classId}`} />
                      <DetailField label="Buổi cũ" value={releasedSession.sessionName} supporting={formatSessionDateTimeRange(releasedSession.trialDate)} />
                    </div>
                  </DetailCard>
                )}

                {/* 3. Đề xuất Nghỉ phép / Bảo lưu liên quan (nếu có) */}
                {reserveTicket && (
                  <DetailCard
                    title="Đề xuất Bảo lưu & Nghỉ phép liên quan"
                    icon={<ExternalLink className="h-4 w-4 text-primary" />}
                    actions={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10"
                        onClick={() => setLeaveReserveOpen(true)}
                      >
                        Xem đơn ({reserveTicket.id})
                      </Button>
                    }
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <DetailField
                        label="Loại đơn"
                        value={reserveTicket.type === 'reservation' ? 'Bảo lưu' : 'Nghỉ phép'}
                        supporting={`Trạng thái: ${reserveTicket.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}`}
                      />
                      <DetailField
                        label="Thời gian nghỉ"
                        value={`${reserveTicket.startDate} - ${reserveTicket.endDate}`}
                      />
                    </div>
                    {reserveTicket.reason && (
                      <p className="mt-2 text-xs text-muted-foreground bg-background/60 p-2 rounded border border-border/50">
                        <span className="font-semibold">Lý do:</span> {reserveTicket.reason}
                      </p>
                    )}
                  </DetailCard>
                )}
              </div>

              {/* CỘT PHẢI (40%): Thời hạn & Phụ trách, Lịch sử thao tác */}
              <div className="flex flex-col gap-4 min-w-0 md:col-span-2">
                {/* 1. Thời hạn & Phụ trách */}
                <DetailCard title="Thời hạn & Phụ trách" icon={<Clock className="h-4 w-4 text-primary" />}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 border-b border-border/60 pb-3">
                      <DetailField label="Ngày tạo phiếu" value={trial.auditLog[0]?.timestamp ?? '—'} />
                      <DetailField label="Lần học thử" value={trial.attempt} />
                    </div>

                    <div className="flex items-center gap-3">
                      <AppAvatar name={trial.creator || 'CARE'} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Nguồn tạo (Sale)</p>
                        <p className="truncate text-sm font-semibold text-foreground">{trial.creator || 'Hệ thống CARE'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <AppAvatar name={trial.owner || 'Chưa phân công'} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Người phụ trách</p>
                        <p className="truncate text-sm font-semibold text-foreground">{trial.owner || '—'}</p>
                      </div>
                    </div>
                  </div>
                </DetailCard>

                {/* 2. Lịch sử thao tác */}
                <DetailCard title="Lịch sử thao tác" className="flex-1">
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {trial.auditLog.map((log, idx) => (
                      <div key={idx} className="relative pl-4 border-l-2 border-primary/30 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="font-semibold text-foreground">{log.author}</span>
                          <span className="text-[11px]">{log.timestamp}</span>
                        </div>
                        <p className="font-medium text-foreground mt-0.5">{log.action}</p>
                        {log.detail && <p className="text-muted-foreground text-[11px] mt-0.5">{log.detail}</p>}
                      </div>
                    ))}
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer — Uniform flat gray background without border line */}
          <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-1">
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setConfirmAction({ type: 'reject', label: 'Từ chối ghép lớp', description: 'Bạn có chắc chắn muốn từ chối ghép lớp học thử này?' })}
            >
              Từ chối ghép lớp
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
              {(trial.status === 'pending_approval' || trial.status === 'reschedule') && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => onOpenAssign?.({ mode: trial.status === 'reschedule' ? 'reschedule' : 'assign', trialId: trial.id })}
                >
                  {trial.status === 'reschedule' ? 'Đổi buổi học' : 'Duyệt & Ghép lớp'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={Boolean(confirmAction)}
          onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
          title={confirmAction.label}
          description={confirmAction.description}
          onConfirm={handleConfirmAction}
          variant="destructive"
        />
      )}

      {/* Leave/Reserve Detail Dialog if ticket clicked */}
      {leaveReserveOpen && (
        <LeaveReserveDetailDialog
          open={leaveReserveOpen}
          onOpenChange={setLeaveReserveOpen}
          request={leaveReserveReq}
          readOnly
        />
      )}
    </>
  )
}
