'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared'
import type { QcIncident, QcErrorStatus, QcRemediationRound } from '@/mocks/qcChecks'
import { QC_ERROR_STATUS_LABELS, mockQcIncidents } from '@/mocks/qcChecks'
import { getIncidentBadgeSemantic, isIncidentOverdue } from './qcCheckTypes'
import { QcChangeAssigneeDialog } from './QcChangeAssigneeDialog'
import { QcDetailProfilePanel } from './QcDetailProfilePanel'
import { QcDetailActiveRemediation } from './QcDetailActiveRemediation'
import { QcPersonnelHistoryDialog } from './QcPersonnelHistoryDialog'
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
  // Combine all incidents available for this subject/personnel in a strictly stable, deterministic order
  const allIncidents = useMemo(() => {
    const map = new Map<string, QcIncident>()
    // 1. Toàn bộ incidents từ personnelGroup (đồng bộ 100% với các thẻ lỗi ngoài danh sách)
    if (personnelGroup?.incidents) {
      personnelGroup.incidents.forEach((inc) => {
        map.set(inc.id, inc)
      })
    }
    // 2. Toàn bộ relatedIncidents
    relatedIncidents.forEach((inc) => {
      map.set(inc.id, inc)
    })
    if (propIncident && !map.has(propIncident.id)) {
      map.set(propIncident.id, propIncident)
    }
    if (event?.errors) {
      event.errors.forEach((err) => {
        if (!map.has(err.id)) map.set(err.id, err as QcIncident)
      })
    }
    const list = Array.from(map.values())
    // Sắp xếp cố định, tuyệt đối không di chuyển vị trí phần tử khi propIncident thay đổi
    return list.sort((a, b) => {
      const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (timeDiff !== 0) return timeDiff
      return a.id.localeCompare(b.id)
    })
  }, [personnelGroup, relatedIncidents, propIncident, event])

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

  // Dedicated history dialog state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Reassignment modal state
  const [isChangeAssigneeOpen, setIsChangeAssigneeOpen] = useState(false)
  const [localAssigneeMap, setLocalAssigneeMap] = useState<Record<string, string>>({})
  const currentAssignee =
    localAssigneeMap[activeIncidentId] ?? activeIncident?.assignee ?? ''

  const [localRoundsMap, setLocalRoundsMap] = useState<Record<string, QcRemediationRound[]>>({})

  // Helper lấy lịch sử các lần khắc phục cho bất kỳ sự cố nào (bảo toàn n lần phản hồi trước đó)
  const getRoundsForIncident = useMemo(() => {
    return (inc: QcIncident): QcRemediationRound[] => {
      if (localRoundsMap[inc.id] && localRoundsMap[inc.id].length > 0) {
        return localRoundsMap[inc.id]
      }
      if (inc.remediationRounds && inc.remediationRounds.length > 0) {
        return inc.remediationRounds
      }
      const mockMatch = mockQcIncidents.find(
        (m) => m.id === inc.id || m.code === inc.code
      )
      if (mockMatch?.remediationRounds && mockMatch.remediationRounds.length > 0) {
        return mockMatch.remediationRounds
      }
      return inc.correctiveAction
        ? [
            {
              id: `round_${inc.id}_01`,
              roundNumber: 1,
              submittedBy: inc.assignee || 'Phạm Đức Thắng',
              submittedAt: inc.completionDate || inc.createdAt,
              action: inc.correctiveAction,
              evidence: inc.correctiveEvidence,
              image: inc.correctiveImage,
              link: inc.correctiveLink,
              preventiveAction: inc.preventiveAction,
              reviewedBy:
                inc.status === 'not_met'
                  ? inc.issuedBy
                  : inc.status === 'closed'
                    ? inc.closedBy || 'Trần Văn Kiên'
                    : undefined,
              reviewedAt:
                inc.closedAt ||
                (inc.status === 'not_met' ? '2026-10-14T10:00:00' : undefined),
              reviewStatus:
                inc.status === 'closed'
                  ? ('approved' as const)
                  : inc.status === 'not_met'
                    ? ('rejected' as const)
                    : undefined,
              reviewNote: inc.notes || inc.comments?.[0]?.content || 'Đã kiểm tra và nghiệm thu đạt.',
            },
          ]
        : []
    }
  }, [localRoundsMap])

  const rounds = activeIncident ? getRoundsForIncident(activeIncident) : []
  const pastRounds = rounds.filter((r) => !!r.reviewedBy || !!r.reviewStatus)

  // Danh sách các lỗi đã đóng / đã hoàn tất của đối tượng nhân sự này
  const completedIncidents = useMemo(() => {
    return allIncidents.filter((i) => i.status === 'closed')
  }, [allIncidents])

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
          className="max-w-5xl 2xl:max-w-6xl w-full p-3.5 sm:p-4 flex flex-col max-h-[92vh] h-auto overflow-hidden text-foreground gap-2"
          showCloseButton
        >
          {/* Header Modal - 1 dòng duy nhất, không đường line, text thường nhỏ gọn */}
          <DialogHeader className="p-0 pb-0.5 shrink-0">
            <div className="flex items-center justify-between gap-3 text-left pr-8">
              <DialogTitle className="text-sm font-normal text-muted-foreground leading-none truncate">
                Chi tiết Chất lượng nhân sự
              </DialogTitle>

              {/* Status and recurrence badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isRecurring && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    Tái diễn ({recurrenceCount})
                  </span>
                )}

                <StatusBadge
                  status={getIncidentBadgeSemantic(activeIncident)}
                  label={QC_ERROR_STATUS_LABELS[activeIncident.status]}
                  className="text-[11px] px-1.5 py-0.5"
                />

                {isOverdue && (
                  <Badge variant="destructive" className="text-[11px] font-semibold px-1.5 py-0.5">
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
                  onZoomImage={setZoomImageUrl}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  onOpenChangeAssignee={(inc) => {
                    handleSelectIncidentInternal(inc.id)
                    setIsChangeAssigneeOpen(true)
                  }}
                  onCancelIncident={(incId) => {
                    onUpdateStatus(incId, 'cancelled')
                  }}
                />
              </div>

              {/* CỘT PHẢI: Khắc phục & Nghiệm thu (col-span-7: Thông tin lỗi ở trên, Khắc phục & Xử lý ở dưới) */}
              <div className="md:col-span-7 flex flex-col gap-3 min-h-0">
                <QcDetailActiveRemediation
                  incident={activeIncident}
                  rounds={rounds}
                  pastRounds={pastRounds}
                  currentAssignee={currentAssignee}
                  onSubmitRemediation={handleSubmitRemediation}
                  onReviewSubmit={handleReviewSubmit}
                  onReopen={() => onUpdateStatus(activeIncident.id, 'correcting')}
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

      {/* Modal Lịch sử vi phạm & khắc phục đã đóng */}
      <QcPersonnelHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        personnelName={
          personnelGroup?.personnelName ||
          activeIncident.teacherName ||
          activeIncident.assignee ||
          'Nhân sự trung tâm'
        }
        personnelCode={personnelGroup?.profile?.code}
        role={personnelGroup?.role}
        completedIncidents={completedIncidents}
        getRoundsForIncident={getRoundsForIncident}
        onZoomImage={setZoomImageUrl}
        onReopenIncident={(incId) => onUpdateStatus(incId, 'correcting')}
      />
    </>
  )
}