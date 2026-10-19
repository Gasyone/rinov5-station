'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { QcIncident, QcErrorStatus, QcRemediationRound } from '@/mocks/qcChecks'
import { QC_ERROR_STATUS_LABELS } from '@/mocks/qcChecks'
import { getIncidentBadgeSemantic, isIncidentOverdue } from './qcCheckTypes'
import { QcChangeAssigneeDialog } from './QcChangeAssigneeDialog'
import { QcDetailProfilePanel } from './QcDetailProfilePanel'
import { QcDetailActiveRemediation } from './QcDetailActiveRemediation'
import { QcDetailHistoryPanel } from './QcDetailHistoryPanel'
import { formatStaffName } from './qcPersonnelHelpers'
import type { QcPersonnelGroup } from './qcPersonnelTypes'

export interface QcCheckDetailDialogProps {
  incident?: QcIncident | null
  relatedIncidents?: QcIncident[]
  personnelGroup?: QcPersonnelGroup | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectIncident?: (incidentId: string) => void
  onUpdateStatus?: (
    incidentId: string,
    status: QcErrorStatus,
    reviewNote?: string,
    updatedRounds?: QcRemediationRound[]
  ) => void
  onUpdateRemediation?: (
    incidentId: string,
    action: string,
    evidence: string,
    image?: string,
    preventiveAction?: string,
    link?: string,
    updatedRounds?: QcRemediationRound[]
  ) => void
  onRecheckSystem?: (incidentId: string) => void
  onAddComment?: (incidentId: string, content: string) => void
  onReassign?: (incidentId: string, newAssignee: string, reason: string, note?: string) => void
  onCreateNewIssue?: () => void
  currentUserId?: string
  currentStaffName?: string

  // Backwards compatibility props
  event?: { errors?: QcIncident[] }
  onAddError?: () => void
  onUpdateError?: () => void
  onPublish?: () => void
  onCloseEvent?: () => void
  onCancelEvent?: () => void
  onNotMet?: () => void
  onEditError?: () => void
  onDeleteError?: () => void
}

export function QcCheckDetailDialog({
  incident: propIncident,
  relatedIncidents = [],
  personnelGroup,
  open,
  onOpenChange,
  onSelectIncident,
  onUpdateStatus = () => {},
  onUpdateRemediation = () => {},
  onReassign,
  onCreateNewIssue,
  currentStaffName = 'Trần Văn Kiên',
  event,
}: QcCheckDetailDialogProps) {
  // Combine all incidents available for this subject/personnel
  const allIncidents = useMemo(() => {
    const list: QcIncident[] = []
    const first = propIncident ?? (event?.errors?.[0] as QcIncident | undefined) ?? null
    if (first) list.push(first)
    relatedIncidents.forEach((inc) => {
      if (!list.some((existing) => existing.id === inc.id)) {
        list.push(inc)
      }
    })
    return list
  }, [propIncident, relatedIncidents, event])

  // Track active selected incident inside the dialog without cascading effects
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const activeIncidentId =
    (selectedIncidentId && allIncidents.some((i) => i.id === selectedIncidentId))
      ? selectedIncidentId
      : (propIncident?.id || allIncidents[0]?.id || '')

  const activeIncident = useMemo(() => {
    return (
      allIncidents.find((i) => i.id === activeIncidentId) ||
      propIncident ||
      allIncidents[0] ||
      null
    )
  }, [allIncidents, activeIncidentId, propIncident])

  // Lightbox zoom state
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null)

  // Reassignment modal state
  const [isChangeAssigneeOpen, setIsChangeAssigneeOpen] = useState(false)
  const [localAssigneeMap, setLocalAssigneeMap] = useState<Record<string, string>>({})
  const currentAssignee =
    localAssigneeMap[activeIncidentId] ?? activeIncident?.assignee ?? ''

  // Derive initial rounds for the active incident
  const derivedRounds: QcRemediationRound[] = useMemo(() => {
    if (!activeIncident) return []
    return activeIncident.remediationRounds?.length
      ? activeIncident.remediationRounds
      : activeIncident.correctiveAction
        ? [
            {
              id: 'round_01',
              roundNumber: 1,
              submittedBy: activeIncident.assignee || 'Phạm Đức Thắng',
              submittedAt: activeIncident.completionDate || activeIncident.createdAt,
              action: activeIncident.correctiveAction,
              evidence: activeIncident.correctiveEvidence,
              image: activeIncident.correctiveImage,
              link: activeIncident.correctiveLink,
              preventiveAction: activeIncident.preventiveAction,
              reviewedBy:
                activeIncident.status === 'not_met'
                  ? activeIncident.issuedBy
                  : activeIncident.status === 'closed'
                    ? activeIncident.closedBy
                    : undefined,
              reviewedAt:
                activeIncident.closedAt ||
                (activeIncident.status === 'not_met' ? '2026-10-14T10:00:00' : undefined),
              reviewStatus:
                activeIncident.status === 'closed'
                  ? ('approved' as const)
                  : activeIncident.status === 'not_met'
                    ? ('rejected' as const)
                    : undefined,
              reviewNote: activeIncident.notes || activeIncident.comments?.[0]?.content,
            },
          ]
        : []
  }, [activeIncident])

  const [localRoundsMap, setLocalRoundsMap] = useState<Record<string, QcRemediationRound[]>>({})
  const rounds = localRoundsMap[activeIncidentId] ?? derivedRounds
  const pastRounds = rounds.filter((r) => !!r.reviewedBy)

  if (!activeIncident) return null

  const isOverdue = activeIncident.status !== 'closed' && isIncidentOverdue(activeIncident)
  const recurrenceCount = activeIncident.recurrenceCount ?? (rounds.length > 1 ? rounds.length : 1)
  const isRecurring = recurrenceCount > 1 || activeIncident.status === 'not_met'

  const handleSelectIncidentInternal = (id: string) => {
    setSelectedIncidentId(id)
    onSelectIncident?.(id)
  }

  // Handle remediation submission
  const handleSubmitRemediation = (
    action: string,
    evidence: string,
    image?: string,
    preventiveAction?: string,
    link?: string
  ) => {
    const newRoundNumber = rounds.length + 1
    const newRound: QcRemediationRound = {
      id: `round_${Date.now()}`,
      roundNumber: newRoundNumber,
      submittedBy: currentAssignee || currentStaffName,
      submittedAt: new Date().toISOString(),
      action,
      evidence,
      image,
      preventiveAction,
      link,
    }
    const nextRounds = [...rounds, newRound]
    setLocalRoundsMap((prev) => ({ ...prev, [activeIncident.id]: nextRounds }))
    onUpdateRemediation(
      activeIncident.id,
      action,
      evidence,
      image,
      preventiveAction,
      link,
      nextRounds
    )
  }

  // Handle review decision (QC)
  const handleReviewSubmit = (reviewStatus: 'closed' | 'not_met', note: string) => {
    const now = new Date().toISOString()
    const updatedRounds = rounds.map((r, i) => {
      if (i === rounds.length - 1) {
        return {
          ...r,
          reviewedBy: currentStaffName,
          reviewedAt: now,
          reviewStatus: reviewStatus === 'closed' ? ('approved' as const) : ('rejected' as const),
          reviewNote: note,
        }
      }
      return r
    })
    setLocalRoundsMap((prev) => ({ ...prev, [activeIncident.id]: updatedRounds }))
    onUpdateStatus(activeIncident.id, reviewStatus, note, updatedRounds)
  }

  // Reassign handler
  const handleConfirmReassign = (newAssignee: string, reason: string, note?: string) => {
    setLocalAssigneeMap((prev) => ({ ...prev, [activeIncident.id]: newAssignee }))
    onReassign?.(activeIncident.id, newAssignee, reason, note)
    setIsChangeAssigneeOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-5xl 2xl:max-w-6xl w-full p-4 sm:p-5 flex flex-col max-h-[92vh] h-auto overflow-hidden text-foreground gap-2.5"
          showCloseButton
        >
          {/* Header Modal */}
          <DialogHeader className="p-0 border-b border-border/60 pb-2.5 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
              <div className="space-y-0.5 min-w-0 pr-6">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground leading-snug truncate">
                  Chi tiết sự cố & Hồ sơ kiểm tra chất lượng
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{activeIncident.branch}</span>
                  <span>•</span>
                  <span>
                    Đối tượng: <strong className="text-foreground font-semibold">{formatStaffName(activeIncident.teacherName || activeIncident.assignee)}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-medium text-foreground bg-muted px-1.5 py-0.2 rounded">
                    {allIncidents.length} sự cố ghi nhận
                  </span>
                </div>
              </div>

              {/* Status and recurrence badges */}
              <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center pr-6 sm:pr-0">
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded border',
                    isRecurring
                      ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-border bg-muted/60 text-muted-foreground'
                  )}
                >
                  {recurrenceCount} lần
                </span>

                <StatusBadge
                  status={getIncidentBadgeSemantic(activeIncident)}
                  label={QC_ERROR_STATUS_LABELS[activeIncident.status]}
                />

                {isOverdue && (
                  <Badge variant="destructive" className="text-xs font-semibold px-2 py-0.5">
                    Quá hạn
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Body Modal: Phương án 1 (Master-Detail 2 cột: Cột trái Các vấn đề ~ 38%, Cột phải Khắc phục & Lịch sử ~ 62%) */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              {/* CỘT TRÁI: Hồ sơ đối tượng, Thống kê vi phạm & Lịch sử vi phạm (col-span-5) */}
              <div className="md:col-span-5 flex flex-col min-h-0">
                <QcDetailProfilePanel
                  personnelGroup={personnelGroup}
                  activeIncident={activeIncident}
                  incidents={allIncidents}
                  onSelectIncident={handleSelectIncidentInternal}
                  onCreateNewIssue={onCreateNewIssue}
                />
              </div>

              {/* CỘT PHẢI: Khắc phục & Nghiệm thu (col-span-7) */}
              <div className="md:col-span-7 flex flex-col gap-2.5 min-h-0">
                {/* 1. Khu vực Trên: Lần đang khắc phục hiện tại (lần đang xử lý) */}
                <QcDetailActiveRemediation
                  incident={activeIncident}
                  rounds={rounds}
                  currentAssignee={currentAssignee}
                  onOpenChangeAssignee={() => setIsChangeAssigneeOpen(true)}
                  onCancelIncident={() => onUpdateStatus(activeIncident.id, 'cancelled')}
                  onSubmitRemediation={handleSubmitRemediation}
                  onReviewSubmit={handleReviewSubmit}
                  onReopen={() => onUpdateStatus(activeIncident.id, 'correcting')}
                  onZoomImage={setZoomImageUrl}
                />

                {/* 2. Khu vực Dưới: Lịch sử lỗi và các lần khắc phục trước đó */}
                <QcDetailHistoryPanel
                  incident={activeIncident}
                  pastRounds={pastRounds}
                  onZoomImage={setZoomImageUrl}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal for Image Zoom */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 right-0 flex items-center gap-2">
              <a
                href={zoomImageUrl}
                target="_blank"
                rel="noreferrer"
                className="h-7 px-2.5 rounded bg-white/15 hover:bg-white/25 text-white text-xs inline-flex items-center gap-1.5 transition-colors"
                title="Mở ảnh gốc trong tab mới"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Mở ảnh gốc
              </a>
              <button
                type="button"
                onClick={() => setZoomImageUrl(null)}
                className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-base"
                title="Đóng xem ảnh"
              >
                &times;
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImageUrl}
              alt="Minh chứng"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Modal Thay đổi người phụ trách */}
      {activeIncident && (
        <QcChangeAssigneeDialog
          open={isChangeAssigneeOpen}
          onOpenChange={setIsChangeAssigneeOpen}
          currentAssignee={currentAssignee}
          incidentCode={activeIncident.code}
          incidentTitle={activeIncident.title}
          branchName={activeIncident.branch}
          targetGroup={activeIncident.targetGroup}
          onConfirm={handleConfirmReassign}
        />
      )}
    </>
  )
}