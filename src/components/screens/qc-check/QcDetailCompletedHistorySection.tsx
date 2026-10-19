'use client'

import React, { useState } from 'react'
import { History, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QcIncident, QcRemediationRound } from '@/mocks/qcChecks'
import { QC_CRITERIA_LABELS } from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'
import { formatStaffName } from './qcPersonnelHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { RemediationRoundCard } from './QcDetailHistoryPanel'
import { QcTagHoverCard } from './QcTagHoverCard'

export interface QcDetailCompletedHistorySectionProps {
  completedIncidents: QcIncident[]
  activeIncidentId?: string
  getRoundsForIncident: (incident: QcIncident) => QcRemediationRound[]
  onSelectIncident?: (incidentId: string) => void
  onZoomImage: (url: string) => void
  onReopenIncident?: (incidentId: string) => void
}

function CompletedIncidentCluster({
  incident,
  isSelected,
  rounds,
  onSelectIncident,
  onZoomImage,
  onReopenIncident,
}: {
  incident: QcIncident
  isSelected: boolean
  rounds: QcRemediationRound[]
  onSelectIncident?: (incidentId: string) => void
  onZoomImage: (url: string) => void
  onReopenIncident?: (incidentId: string) => void
}) {
  const [isOlderExpanded, setIsOlderExpanded] = useState<boolean>(false)

  // Lần khắc phục đã được duyệt Đạt (thường là lần cuối cùng hoặc lần có reviewStatus === 'approved')
  const approvedRound =
    [...rounds].reverse().find((r) => r.reviewStatus === 'approved') ||
    rounds[rounds.length - 1]

  // Các lần phản hồi/chăm sóc trước đó (những lần bị trả về/chưa đạt)
  const olderRounds = approvedRound
    ? rounds.filter((r) => r.id !== approvedRound.id)
    : rounds.slice(0, -1)

  const olderRejectedCount = olderRounds.filter((r) => r.reviewStatus === 'rejected').length
  const displayTitle = incident.title || QC_CRITERIA_LABELS[incident.criteria]

  return (
    <div
      id={`completed-cluster-${incident.id}`}
      className={cn(
        'rounded-xl border bg-card p-3 shadow-2xs space-y-2 text-left transition-all',
        isSelected
          ? 'border-primary ring-1 ring-primary/40 bg-primary/[0.015]'
          : 'border-border/70 hover:border-border'
      )}
    >
      {/* ─── Header cụm: Tag vi phạm + Tiêu đề lỗi + Badge Đã đóng + Nút Mở lại ─── */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/50 flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <div onClick={(e) => e.stopPropagation()}>
            <QcTagHoverCard incident={incident} onViewDetail={onSelectIncident} />
          </div>

          <span
            className={cn(
              'text-xs truncate max-w-[320px]',
              isSelected ? 'font-semibold text-foreground' : 'font-medium text-foreground/90'
            )}
            title={displayTitle}
          >
            {displayTitle}
          </span>

          {isSelected && (
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
              Đang xem
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              'text-[10px] px-1.5 py-0.2 rounded font-normal shrink-0',
              getStatusBadgeClass('qc_error_closed')
            )}
          >
            Đã đóng
          </span>

          {incident.closedAt && (
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Đóng: {formatDateTime(incident.closedAt)}
            </span>
          )}

          {onReopenIncident && (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="h-5 px-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer font-normal"
              onClick={() => onReopenIncident(incident.id)}
              title="Mở lại phúc tra cho sự cố này"
            >
              <RotateCcw className="h-3 w-3 mr-0.5" />
              Mở lại
            </Button>
          )}
        </div>
      </div>

      {/* ─── Body cụm: Lần khắc phục đã đạt nghiệm thu ─── */}
      {approvedRound ? (
        <RemediationRoundCard rnd={approvedRound} onZoomImage={onZoomImage} />
      ) : (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-2 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Đã nghiệm thu đạt và đóng hoàn tất</span>
          </div>
          {incident.correctiveAction && (
            <p className="text-foreground leading-snug">{incident.correctiveAction}</p>
          )}
          {incident.closedBy && (
            <p className="text-[11px] text-muted-foreground">
              Người đóng: {formatStaffName(incident.closedBy)}
            </p>
          )}
        </div>
      )}

      {/* ─── Footer cụm: Mở rộng các lần chăm sóc/phản hồi trước đó trong cụm lỗi này ─── */}
      {olderRounds.length > 0 && (
        <div className="space-y-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setIsOlderExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer select-none py-0.5 group transition-colors"
            title={isOlderExpanded ? 'Thu gọn các lần trước đó' : 'Mở rộng xem các lần trước đó'}
          >
            <History className="h-3.5 w-3.5 text-primary shrink-0 transition-transform group-hover:scale-110" />
            <span>Lịch sử các lần phản hồi trước đó</span>

            {olderRejectedCount > 0 ? (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/25">
                {olderRejectedCount} lần chưa đạt
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
                {olderRounds.length} lần
              </span>
            )}

            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-primary transition-transform duration-200',
                isOlderExpanded && 'rotate-180'
              )}
            />
          </button>

          {isOlderExpanded && (
            <div className="space-y-1.5 pl-2 border-l-2 border-primary/20 animate-in fade-in-50 duration-150">
              {olderRounds.map((rnd, idx) => (
                <RemediationRoundCard
                  key={rnd.id || `old_cluster_${incident.id}_${idx}`}
                  rnd={rnd}
                  onZoomImage={onZoomImage}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function QcDetailCompletedHistorySection({
  completedIncidents,
  activeIncidentId,
  getRoundsForIncident,
  onSelectIncident,
  onZoomImage,
  onReopenIncident,
}: QcDetailCompletedHistorySectionProps) {
  if (!completedIncidents || completedIncidents.length === 0) return null

  return (
    <div className="space-y-2.5 text-left pt-1">
      {/* ─── SECTION TITLE ─── */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lịch sử khắc phục
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            {completedIncidents.length} lỗi đã đóng
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Các xử lý đã hoàn thành / đã nghiệm thu đạt
        </span>
      </div>

      {/* ─── CÁC CỤM LỊCH SỬ KHẮC PHỤC (LỖI 1 LỖI 1 CỤM) ─── */}
      <div className="space-y-2.5">
        {completedIncidents.map((inc) => {
          const isSelected = inc.id === activeIncidentId
          const rounds = getRoundsForIncident(inc)

          return (
            <CompletedIncidentCluster
              key={inc.id}
              incident={inc}
              isSelected={isSelected}
              rounds={rounds}
              onSelectIncident={onSelectIncident}
              onZoomImage={onZoomImage}
              onReopenIncident={onReopenIncident}
            />
          )
        })}
      </div>
    </div>
  )
}
