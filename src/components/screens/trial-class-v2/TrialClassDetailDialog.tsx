'use client'

import { useState } from 'react'
import { CalendarDays, CheckCircle, Copy, ExternalLink, Phone, PhoneCall, PlusCircle, RefreshCw, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldLabel, InfoField, Panel, StatusBadge } from '@/components/shared'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { TrialClass } from '@/mocks/trialClasses'
import { formatTrialDate, getTrialStatusLabel, maskPhone } from './trialClassHelpers'
import type { AssignDialogMode } from './trialClassTypes'
import { TrialClassCancelDialog } from './TrialClassCancelDialog'
import { TrialClassDetailActions } from './TrialClassDetailActions'
import { TrialClassDetailSidePanel } from './TrialClassDetailSidePanel'
import { TrialClassRescheduleDialog } from './TrialClassRescheduleDialog'

interface TrialClassDetailDialogProps {
  trial: TrialClass | null
  onOpenChange: (open: boolean) => void
  onCopy: (text: string, key: string) => void
  copiedKey: string
  onAssign: (mode: AssignDialogMode) => void
  onRequestReschedule: (trialId: string, reason: string, notes: string) => void
  onUpdateTrial: (trialId: string, updater: (trial: TrialClass) => TrialClass) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassDetailDialog({
  trial,
  onOpenChange,
  onCopy,
  copiedKey,
  onAssign,
  onRequestReschedule,
  onUpdateTrial,
  onApprove,
  onReject,
}: TrialClassDetailDialogProps) {
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCancelOpen(false)
      setRescheduleOpen(false)
    }
    onOpenChange(open)
  }

  if (!trial) {
    return (
      <Dialog open={false} onOpenChange={handleOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

  const warningTone = getStatusColors('warning')
  const isPendingReschedule = trial.status === 'reschedule'
  const activeSessions = isPendingReschedule ? [] : trial.sessions
  const releasedSession = trial.previousSession ?? (isPendingReschedule ? trial.sessions[0] : undefined)

  return (
    <>
      <Dialog open onOpenChange={handleOpenChange}>
        <DialogContent className="grid h-[85vh] max-h-[800px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="shrink-0 px-6 pb-3 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-semibold">{trial.trialName}</span>
                  <StatusBadge status={trial.status} label={getTrialStatusLabel(trial.status)} />
                  <Badge variant="outline" className="rounded-md font-mono">{trial.id}</Badge>
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-2">
                  <span>{trial.studentName}</span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span>{trial.program}</span>
                  {activeSessions.length > 0 && (
                    <>
                      <span className="text-muted-foreground">&middot;</span>
                      <span>{activeSessions.length} buổi học</span>
                    </>
                  )}
                </DialogDescription>
              </div>
              <div className="shrink-0 pr-8">
                <TrialClassDetailActions
                  trial={trial}
                  onAssign={onAssign}
                  onOpenCancel={() => setCancelOpen(true)}
                  onOpenReschedule={() => setRescheduleOpen(true)}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              </div>
            </div>
          </DialogHeader>

          <div className="flex min-h-0 flex-col gap-4 overflow-hidden px-6 pb-4">
            <section className="grid gap-x-8 gap-y-2 shrink-0 border-y border-border py-3 sm:grid-cols-3">
              <InfoField label="Học viên" value={trial.studentName} supporting={trial.customerId} />
              <InfoField label="Lần học" value={trial.attempt} />
              <InfoField label="Trường" value={trial.school} />
            </section>

            <div className="grid min-h-0 flex-1 gap-6 overflow-hidden lg:grid-cols-[1fr_320px]">
              <main className="min-h-0 space-y-5 overflow-y-auto pr-2">
                <Panel title="Thông tin liên hệ" icon={<Phone className="h-4 w-4" />}>
                  <div className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{trial.familyName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <PhoneCall className="h-3 w-3 text-muted-foreground" />
                        <p className="font-mono text-xs text-muted-foreground">
                          {maskPhone(trial.familyPhone)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onCopy(trial.familyPhone, `detail-family-${trial.id}`)}
                      title="Sao chép số điện thoại"
                    >
                      {copiedKey === `detail-family-${trial.id}` ? (
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </Panel>

                <Panel title="Lớp & Buổi học" icon={<CalendarDays className="h-4 w-4" />}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel label="Thông tin ghép lớp">
                        {activeSessions.length > 0 ? (
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm font-semibold">Đã ghép {activeSessions.length} buổi học</span>
                              {trial.status !== 'completed' && trial.status !== 'cancelled' && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onAssign({ mode: 'reschedule', trialId: trial.id })}>
                                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Đổi lịch
                                </Button>
                              )}
                            </div>
                            <div className="space-y-1.5 py-1">
                              {activeSessions.map((s, idx) => (
                                <div key={idx} className="flex flex-col rounded-md p-2.5 transition-colors hover:bg-muted/50">
                                  <div className="flex items-start justify-between mb-1.5">
                                    <span className="text-sm font-semibold text-foreground">{s.className}</span>
                                    <span className="font-mono text-[10px] text-muted-foreground">{s.classId}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-muted-foreground">{s.sessionName} <span className="ml-0.5 font-mono">({s.sessionId})</span></span>
                                    <span className="font-medium">{formatTrialDate(s.trialDate)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-md border border-dashed border-border px-3 py-2 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground italic">Chưa ghép lớp</p>
                            <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={() => onAssign({ mode: 'assign', trialId: trial.id })}>
                              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                              Ghép lớp
                            </Button>
                          </div>
                        )}
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Môn học">
                        <p className="rounded-md bg-muted px-3 py-2 font-medium text-sm">{trial.subject}</p>
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Phòng học">
                        <p className="rounded-md bg-muted px-3 py-2 font-medium text-sm">Chưa xếp phòng</p>
                      </FieldLabel>
                    </div>
                  </div>

                  {releasedSession && (
                    <div className={cn('mt-3 rounded-md border border-border px-3 py-2', warningTone.bg)}>
                      <p className={cn('mb-1 text-[10px] font-bold uppercase tracking-wide', warningTone.text)}>
                        Lớp cũ (đã giải phóng)
                      </p>
                      <div className="grid gap-1 text-xs">
                        <span className="font-medium">{releasedSession.className} <span className="font-mono text-muted-foreground">({releasedSession.classId})</span></span>
                        <span className="text-muted-foreground">{releasedSession.sessionName} &middot; {formatTrialDate(releasedSession.trialDate)}</span>
                      </div>
                    </div>
                  )}
                </Panel>

                <Panel title="Phụ trách" icon={<User className="h-4 w-4" />}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarFallback className="rounded-lg">{trial.creator.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Sale</p>
                        <p className="truncate text-sm font-semibold">{trial.creator}</p>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarFallback className="rounded-lg">{trial.owner.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Người phụ trách</p>
                        <p className="truncate text-sm font-semibold">{trial.owner}</p>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="Kết quả nhận xét từ Giáo viên" icon={<ExternalLink className="h-4 w-4" />}>
                  {trial.feedback ? (
                    <div className="flex items-center gap-2 py-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a href={trial.feedback.resultLink || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                        Xem chi tiết kết quả đánh giá ({trial.feedback.rating}/5 sao)
                      </a>
                    </div>
                  ) : (
                    <div className="py-2">
                      <p className="text-sm text-muted-foreground italic">Chờ kết quả...</p>
                    </div>
                  )}
                </Panel>
              </main>

              <TrialClassDetailSidePanel
                trial={trial}
                onUpdateTrial={onUpdateTrial}
              />
            </div>
          </div>


        </DialogContent>
      </Dialog>

      <TrialClassCancelDialog
        open={cancelOpen}
        trial={trial}
        onOpenChange={setCancelOpen}
        onUpdateTrial={onUpdateTrial}
      />

      <TrialClassRescheduleDialog
        open={rescheduleOpen}
        trial={trial}
        onOpenChange={setRescheduleOpen}
        onRequestReschedule={onRequestReschedule}
      />
    </>
  )
}
