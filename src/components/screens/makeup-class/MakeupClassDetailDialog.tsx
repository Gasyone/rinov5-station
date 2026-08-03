'use client'

import { useState, useMemo } from 'react'
import { CalendarDays, Clock, ExternalLink, CalendarPlus, RefreshCw, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  StatusBadge,
  AppAvatar,
  ConfirmDialog,
  StudentHeaderInfoCard,
} from '@/components/shared'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { MakeupClassAssignDialog } from './MakeupClassAssignDialog'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import type { TrialSessionSelection } from '@/components/screens/trial-class/trialClassTypes'
import { cn } from '@/lib/utils'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import {
  formatMakeupDate,
  formatSessionDateTimeRange,
  getMakeupStatusLabel,
  getAttendanceStatusText,
  isExpiryApproaching,
  isExpired,
} from './makeupClassHelpers'

interface MakeupClassDetailDialogProps {
  request: MakeupClassRequest | null
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onCancel?: (id: string) => void
  onMarkCompleted?: (id: string) => void
  onMarkAbsent?: (id: string) => void
  onAssignSession?: (requestId: string, session: TrialSessionSelection, notes: string) => void
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
      <div className="mb-3 flex items-center justify-between gap-3">
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

export function MakeupClassDetailDialog({
  request,
  onOpenChange,
  onApprove,
  onReject,
  onCancel,
  onMarkCompleted,
  onMarkAbsent,
  onAssignSession,
}: MakeupClassDetailDialogProps) {
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; description: string } | null>(null)
  const [leaveReserveOpen, setLeaveReserveOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [teacherCommentOpen, setTeacherCommentOpen] = useState(false)

  // Find linked leave reserve request or fallback
  const leaveReserveReq = useMemo(() => {
    if (!request) return null
    const targetId = request.leaveRequestId || 'NP-2607-001'
    return mockLeaveReserveRequests.find((r) => r.id === targetId) ?? mockLeaveReserveRequests[0] ?? null
  }, [request])

  // Fix Radix UI accessibility error by returning null when request is not selected
  if (!request) return null

  const expiryWarning = isExpiryApproaching(request.expiryDate)
  const expired = isExpired(request.expiryDate)

  const handleConfirm = () => {
    if (!confirmAction) return
    switch (confirmAction.type) {
      case 'approve': onApprove?.(request.id); break
      case 'reject': onReject?.(request.id); break
      case 'cancel': onCancel?.(request.id); break
      case 'completed': onMarkCompleted?.(request.id); break
      case 'absent': onMarkAbsent?.(request.id); break
    }
    setConfirmAction(null)
  }

  const leaveId = request.leaveRequestId || 'NP-2607-001'

  return (
    <>
      <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
        <DialogContent className="grid h-[88vh] max-h-[800px] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-4xl">
          {/* Header — Uniform flat gray background without border line */}
          <DialogHeader className="shrink-0 bg-muted/40 px-6 pb-2 pt-5">
            <div className="flex flex-col gap-3">
              {/* Row 1: Title (left) & Status Badge (right) */}
              <div className="flex items-center justify-between gap-4 pr-6">
                <DialogTitle className="text-xs font-normal text-muted-foreground">
                  Chi tiết Phiếu học bù
                  <Badge variant="outline" className="ml-1.5 rounded-md font-mono text-[11px] font-normal text-muted-foreground">
                    {request.id}
                  </Badge>
                </DialogTitle>
                <div className="shrink-0">
                  <StatusBadge status={request.status} label={getMakeupStatusLabel(request.status)} />
                </div>
              </div>

              {/* Row 2: Student Header Info Card */}
              <StudentHeaderInfoCard
                studentName={request.studentName}
                address={request.school || request.branch}
                parents={[
                  {
                    name: request.familyName,
                    relationship: 'Phụ huynh',
                    isPrimary: true,
                    phone: request.familyPhone,
                  },
                ]}
                initialNote={request.notes}
              />
            </div>
          </DialogHeader>

          {/* Body area with uniform flat gray background (bg-muted/40) */}
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto bg-muted/40 p-6 pt-2">
            {/* Grid layout: Left column 60% (col-span-3), Right info column 40% (col-span-2) */}
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-5">
              {/* CỘT TRÁI (60%): Buổi bù (Lớp ghép) trước, Buổi nghỉ (Lớp gốc) sau */}
              <div className="flex flex-col gap-4 min-w-0 md:col-span-3">
                {/* 1. Buổi bù (Lớp ghép) */}
                <DetailCard
                  title="Buổi bù (Lớp ghép)"
                  icon={<CalendarDays className="h-4 w-4 text-primary" />}
                  actions={
                    request.makeupClassName ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10"
                        onClick={() => setAssignDialogOpen(true)}
                      >
                        <RefreshCw className="mr-1 h-3.5 w-3.5" />
                        Đổi buổi học
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => setAssignDialogOpen(true)}
                      >
                        <CalendarPlus className="mr-1 h-3.5 w-3.5" />
                        Chọn buổi bù
                      </Button>
                    )
                  }
                >
                  {request.makeupClassName && request.makeupClassId ? (
                    <div className="space-y-3">
                      {/* Dòng 1: Lớp bù ghép | Mã lớp */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Lớp bù ghép" value={request.makeupClassName} />
                        <DetailField
                          label="Mã lớp"
                          value={
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <ClassCodeHoverCell
                                classCode={request.makeupClassId}
                                subject={request.subject}
                                level={request.program}
                                teacherCode={request.owner}
                                schedule={formatSessionDateTimeRange(request.makeupSessionDate ?? '')}
                              />
                            </div>
                          }
                        />
                      </div>

                      {/* Dòng 2: Chương trình | Trình độ */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Chương trình" value={request.subject} />
                        <DetailField label="Trình độ" value={request.program} />
                      </div>

                      {/* Dòng 3: Tên buổi bù | Thời gian bù */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Tên buổi bù" value={request.makeupSessionName ?? '—'} />
                        <DetailField
                          label="Thời gian bù"
                          value={formatSessionDateTimeRange(request.makeupSessionDate ?? '')}
                        />
                      </div>

                      {/* Dòng 4: Trạng thái điểm danh | Nhận xét */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField
                          label="Trạng thái điểm danh"
                          value={
                            <span
                              className={cn(
                                'font-semibold',
                                getAttendanceStatusText(request) === 'Có mặt' || getAttendanceStatusText(request) === 'Đã điểm danh'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : getAttendanceStatusText(request) === 'Vắng mặt'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {getAttendanceStatusText(request)}
                            </span>
                          }
                        />
                        <DetailField
                          label="Nhận xét"
                          value={
                            request.teacherComment && request.teacherComment !== '—' && request.teacherComment !== 'Chưa có nhận xét buổi bù' ? (
                              <button
                                type="button"
                                onClick={() => setTeacherCommentOpen(true)}
                                className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer text-xs"
                              >
                                <MessageSquare className="h-3 w-3" />
                                <span>Xem nhận xét</span>
                              </button>
                            ) : (
                              <span className="font-normal text-muted-foreground italic text-xs">Chưa nhận xét</span>
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="group cursor-pointer rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => setAssignDialogOpen(true)}
                    >
                      <p className="text-sm font-semibold text-primary group-hover:underline">
                        Chưa xếp lịch bù &bull; Thao tác chọn buổi ngay
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Click để mở danh sách lịch khả dụng và chọn buổi học ghép cho học viên.</p>
                    </div>
                  )}
                </DetailCard>

                {/* 2. Buổi nghỉ (Lớp gốc) */}
                <DetailCard title="Buổi nghỉ (Lớp gốc)" icon={<CalendarDays className="h-4 w-4 text-primary" />}>
                  <div className="space-y-3">
                    {/* Dòng 1: Lớp gốc | Mã lớp */}
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Lớp gốc" value={request.originalClassName} />
                      <DetailField
                        label="Mã lớp"
                        value={
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <ClassCodeHoverCell
                              classCode={request.originalClassId}
                              subject={request.subject}
                              level={request.program}
                              teacherCode={request.owner}
                              schedule={formatSessionDateTimeRange(request.originalSessionDate)}
                            />
                          </div>
                        }
                      />
                    </div>

                    {/* Dòng 2: Chương trình | Trình độ */}
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Chương trình" value={request.subject} />
                      <DetailField label="Trình độ" value={request.program} />
                    </div>

                    {/* Dòng 3: Tên buổi nghỉ | Thời gian nghỉ */}
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Tên buổi nghỉ" value={request.originalSessionName} />
                      <DetailField
                        label="Thời gian nghỉ"
                        value={formatSessionDateTimeRange(request.originalSessionDate)}
                      />
                    </div>

                    {/* Dòng 4: Lý do nghỉ | Mã phiếu nghỉ phép (link mở modal detail) */}
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Lý do nghỉ" value={request.absenceReason} />
                      <DetailField
                        label="Mã phiếu nghỉ phép"
                        value={
                          <button
                            type="button"
                            onClick={() => setLeaveReserveOpen(true)}
                            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer"
                          >
                            <span>{leaveId}</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        }
                      />
                    </div>

                    {/* Dòng 5: Ghi chú đổi buổi (ở dưới cùng, full bề ngang) */}
                    <div className="pt-2.5 border-t border-border/50">
                      <DetailField
                        label="Ghi chú đổi buổi"
                        value={
                          <p className="font-normal leading-relaxed text-muted-foreground">
                            {request.exchangeNotes || request.notes || '—'}
                          </p>
                        }
                      />
                    </div>
                  </div>
                </DetailCard>
              </div>

              {/* CỘT PHẢI THÔNG TIN (40%): Thời hạn & Phụ trách (gộp), Ghi chú & Lịch sử */}
              <div className="flex flex-col gap-4 min-w-0 md:col-span-2">
                {/* Thời hạn & Phụ trách (gộp vào 1 section) */}
                <DetailCard title="Thời hạn & Phụ trách" icon={<Clock className="h-4 w-4 text-primary" />}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField
                        label="Hạn chót học bù"
                        value={
                          <span className={cn(
                            'font-semibold',
                            expired ? 'text-red-600 dark:text-red-400' : expiryWarning ? 'text-amber-600 dark:text-amber-400' : ''
                          )}>
                            {formatMakeupDate(request.expiryDate)}
                            {expired && ' (Đã hết hạn)'}
                            {expiryWarning && !expired && ' (Sắp hết hạn)'}
                          </span>
                        }
                      />
                      <DetailField label="Ngày tạo phiếu" value={formatMakeupDate(request.createdAt)} />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-border/50">
                      <div className="flex min-w-0 items-center gap-3">
                        <AppAvatar name={request.creator} size="md" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-muted-foreground">Nguồn tạo</p>
                          <p className="truncate text-sm font-semibold">{request.creator}</p>
                        </div>
                      </div>
                      <div className="flex min-w-0 items-center gap-3">
                        <AppAvatar name={request.owner} size="md" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-muted-foreground">Người phụ trách</p>
                          <p className="truncate text-sm font-semibold">{request.owner}</p>
                          <p className="truncate text-xs text-muted-foreground">{request.branch}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DetailCard>

                {/* Lịch sử thao tác */}
                <DetailCard title="Lịch sử thao tác">
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {request.auditLog.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 rounded-md p-1.5 hover:bg-muted/40 text-xs">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{log.author}</span>
                            <span className="text-muted-foreground">{log.timestamp}</span>
                          </div>
                          <p className="text-muted-foreground font-medium mt-0.5">{log.action}</p>
                          {log.detail && (
                            <p className="text-[11px] text-muted-foreground/80">{log.detail}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer — Uniform flat gray background without border line */}
          <div className="flex shrink-0 items-center justify-between bg-muted/40 px-6 py-4">
            {/* Left side: Destructive Cancel button */}
            <div>
              {(request.status === 'cho_duyet' || request.status === 'da_xep_lich') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => setConfirmAction({
                    type: 'cancel',
                    label: 'Hủy phiếu bù',
                    description: `Xác nhận hủy phiếu học bù ${request.id}?`,
                  })}
                >
                  Hủy phiếu
                </Button>
              )}
            </div>

            {/* Right side: Approve / Reject / Complete / Absent buttons */}
            <div className="flex items-center gap-2">
              {request.status === 'cho_duyet' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
                    onClick={() => setConfirmAction({
                      type: 'reject',
                      label: 'Từ chối phiếu bù',
                      description: `Xác nhận từ chối phiếu học bù ${request.id} cho học viên ${request.studentName}?`,
                    })}
                  >
                    Từ chối
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setAssignDialogOpen(true)}
                  >
                    Duyệt & Xếp lịch bù
                  </Button>
                </>
              )}
              {request.status === 'da_xep_lich' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
                    onClick={() => setConfirmAction({
                      type: 'absent',
                      label: 'Đánh dấu vắng mặt',
                      description: `Xác nhận học viên ${request.studentName} vắng mặt buổi bù?`,
                    })}
                  >
                    Báo vắng mặt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setConfirmAction({
                      type: 'completed',
                      label: 'Hoàn thành buổi bù',
                      description: `Xác nhận học viên ${request.studentName} đã hoàn thành buổi bù?`,
                    })}
                  >
                    Xác nhận hoàn thành
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
        title={confirmAction?.label ?? ''}
        description={confirmAction?.description ?? ''}
        variant="destructive"
        onConfirm={handleConfirm}
      />

      {/* Linked Leave Reserve Detail Dialog when clicking Mã phiếu nghỉ phép */}
      {leaveReserveOpen && (
        <LeaveReserveDetailDialog
          open={leaveReserveOpen}
          onOpenChange={setLeaveReserveOpen}
          request={leaveReserveReq}
          readOnly={true}
        />
      )}

      {/* Session Selection / Change Dialog (Đổi buổi / Ghép lớp) */}
      <MakeupClassAssignDialog
        open={assignDialogOpen}
        request={request}
        onOpenChange={setAssignDialogOpen}
        onAssign={(reqId, session, notes) => {
          onAssignSession?.(reqId, session, notes)
          onApprove?.(reqId)
        }}
      />

      {/* Teacher Comment Dialog */}
      {teacherCommentOpen && (
        <Dialog open={teacherCommentOpen} onOpenChange={setTeacherCommentOpen}>
          <DialogContent className="sm:max-w-md">
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
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Nội dung nhận xét từ giáo viên:</p>
                <div className="rounded-lg border border-border/80 bg-background p-3.5 leading-relaxed text-foreground shadow-2xs">
                  {request.teacherComment}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setTeacherCommentOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
