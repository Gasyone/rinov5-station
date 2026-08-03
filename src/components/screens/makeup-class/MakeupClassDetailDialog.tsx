'use client'

import { CalendarDays, Clock, User, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InfoField, Panel, StatusBadge, AppAvatar, ConfirmDialog } from '@/components/shared'

import { cn } from '@/lib/utils'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import {
  formatMakeupDate,
  getMakeupStatusLabel,
  isExpiryApproaching,
  isExpired,
} from './makeupClassHelpers'
import { useState } from 'react'

interface MakeupClassDetailDialogProps {
  request: MakeupClassRequest | null
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onCancel?: (id: string) => void
  onMarkCompleted?: (id: string) => void
  onMarkAbsent?: (id: string) => void
}

export function MakeupClassDetailDialog({
  request,
  onOpenChange,
  onApprove,
  onReject,
  onCancel,
  onMarkCompleted,
  onMarkAbsent,
}: MakeupClassDetailDialogProps) {
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; description: string } | null>(null)

  if (!request) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

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

  return (
    <>
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent className="grid h-[80vh] max-h-[720px] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0 px-6 pb-3 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-semibold">Phiếu học bù</span>
                  <StatusBadge status={request.status} label={getMakeupStatusLabel(request.status)} />
                  <Badge variant="outline" className="rounded-md font-mono">{request.id}</Badge>
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-2">
                  <span>{request.studentName}</span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span>{request.program}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-6 pb-4">
            {/* Thông tin học viên */}
            <section className="grid gap-x-8 gap-y-2 shrink-0 border-y border-border py-3 sm:grid-cols-3">
              <InfoField label="Học viên" value={request.studentName} supporting={request.customerId} />
              <InfoField label="Gia đình" value={request.familyName} supporting={request.familyPhone} />
              <InfoField label="Trường" value={request.school} />
            </section>

            {/* Buổi nghỉ (lớp gốc) */}
            <Panel title="Buổi nghỉ (Lớp gốc)" icon={<CalendarDays className="h-4 w-4" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoField label="Lớp" value={request.originalClassName} supporting={request.originalClassId} />
                <InfoField label="Buổi" value={request.originalSessionName} />
                <InfoField label="Thời gian" value={formatMakeupDate(request.originalSessionDate)} />
                <InfoField label="Lý do nghỉ" value={request.absenceReason} />
              </div>
            </Panel>

            {/* Buổi bù */}
            <Panel title="Buổi bù" icon={<CalendarDays className="h-4 w-4" />}>
              {request.makeupClassName ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoField label="Lớp bù" value={request.makeupClassName} supporting={request.makeupClassId} />
                  <InfoField label="Buổi" value={request.makeupSessionName ?? '—'} />
                  <InfoField label="Thời gian" value={formatMakeupDate(request.makeupSessionDate ?? '')} />
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border px-3 py-2">
                  <p className="text-sm italic text-muted-foreground">Chưa xếp lịch bù</p>
                </div>
              )}
            </Panel>

            {/* Hạn bù */}
            <Panel title="Thời hạn" icon={<Clock className="h-4 w-4" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoField
                  label="Hạn chót học bù"
                  value={
                    <span className={cn(
                      'font-medium',
                      expired ? 'text-red-600 dark:text-red-400' : expiryWarning ? 'text-amber-600 dark:text-amber-400' : ''
                    )}>
                      {formatMakeupDate(request.expiryDate)}
                      {expired && ' (Đã hết hạn)'}
                      {expiryWarning && !expired && ' (Sắp hết hạn)'}
                    </span>
                  }
                />
                <InfoField label="Ngày tạo phiếu" value={formatMakeupDate(request.createdAt)} />
              </div>
            </Panel>

            {/* Người phụ trách */}
            <Panel title="Phụ trách" icon={<User className="h-4 w-4" />}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex min-w-0 items-center gap-3">
                  <AppAvatar name={request.creator} size="md" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Người tạo</p>
                    <p className="truncate text-sm font-semibold">{request.creator}</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  <AppAvatar name={request.owner} size="md" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Người phụ trách</p>
                    <p className="truncate text-sm font-semibold">{request.owner}</p>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Ghi chú */}
            {request.notes && (
              <Panel title="Ghi chú" icon={<FileText className="h-4 w-4" />}>
                <p className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">{request.notes}</p>
              </Panel>
            )}

            {/* Lịch sử thao tác */}
            <Panel title="Lịch sử thao tác">
              <div className="space-y-2">
                {request.auditLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/30">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/30" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold">{log.author}</span>
                        <span className="text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm">{log.action}</p>
                      {log.detail && (
                        <p className="text-xs text-muted-foreground">{log.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-6 py-3">
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
                  onClick={() => setConfirmAction({
                    type: 'approve',
                    label: 'Duyệt phiếu bù',
                    description: `Xác nhận duyệt phiếu học bù ${request.id} cho học viên ${request.studentName}?`,
                  })}
                >
                  Duyệt phiếu
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
                  Vắng mặt
                </Button>
                <Button
                  size="sm"
                  onClick={() => setConfirmAction({
                    type: 'completed',
                    label: 'Hoàn thành buổi bù',
                    description: `Xác nhận học viên ${request.studentName} đã hoàn thành buổi bù?`,
                  })}
                >
                  Hoàn thành
                </Button>
              </>
            )}
            {(request.status === 'cho_duyet' || request.status === 'da_xep_lich') && (
              <Button
                variant="ghost"
                size="sm"
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
    </>
  )
}
