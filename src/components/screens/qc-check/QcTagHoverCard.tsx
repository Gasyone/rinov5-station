'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Image as ImageIcon, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QcIncident } from '@/mocks/qcChecks'
import {
  QC_CRITERIA_LABELS,
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
} from '@/mocks/qcChecks'
import { getCriteriaTagMeta, getTagStyle, formatStaffName } from './qcPersonnelHelpers'
import { formatDateTime, formatShortDate, isToday } from './qcCheckHelpers'
import { isIncidentOverdue } from './qcCheckTypes'
import { getStatusBadgeClass } from '@/lib/statusColors'

export interface QcTagHoverCardProps {
  incident: QcIncident
  children?: React.ReactNode
  onViewDetail?: (incidentId: string) => void
}

function renderDeadlineBadge(incident: QcIncident) {
  const isClosed = incident.status === 'closed'
  if (isClosed) {
    return (
      <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">
        Đã hoàn thành
      </span>
    )
  }

  if (!incident.deadline) {
    return (
      <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">
        Không giới hạn SLA
      </span>
    )
  }

  const isOverdue = isIncidentOverdue(incident)
  const isDueToday = isToday(incident.deadline)
  const deadlineStr = formatDateTime(incident.deadline)

  if (isOverdue) {
    return (
      <span className="font-normal text-red-600 dark:text-red-400 text-xs shrink-0 whitespace-nowrap">
        Quá hạn: {deadlineStr}
      </span>
    )
  }

  if (isDueToday) {
    return (
      <span className="font-normal text-amber-600 dark:text-amber-400 text-xs shrink-0 whitespace-nowrap">
        Đến hạn: {deadlineStr}
      </span>
    )
  }

  return (
    <span className="font-normal text-muted-foreground text-xs shrink-0 whitespace-nowrap">
      Hạn: {deadlineStr}
    </span>
  )
}

export function QcTagHoverCard({ incident, children, onViewDetail }: QcTagHoverCardProps) {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const tagMeta = getCriteriaTagMeta(incident.criteria)
  const { badgeClass, isCompleted } = getTagStyle(incident)

  const severityClass =
    incident.severity === 'critical'
      ? getStatusBadgeClass('error')
      : incident.severity === 'high'
        ? getStatusBadgeClass('warning')
        : incident.severity === 'medium'
          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
          : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300'

  const statusBadge = getStatusBadgeClass(incident.status)

  // Title: use specific incident title or fallback to criteria label
  const displayTitle = incident.title || QC_CRITERIA_LABELS[incident.criteria]

  return (
    <>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <span
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail?.(incident.id)
            }}
            className="inline-flex cursor-pointer"
          >
            {children || (
              <Badge
                variant="outline"
                className={cn(
                  'text-xs px-1.5 py-0 h-5 font-normal flex items-center gap-1 shrink-0 border whitespace-nowrap rounded shadow-none cursor-pointer transition-opacity hover:opacity-85',
                  badgeClass
                )}
              >
                <span className={cn('text-xs font-normal', isCompleted && 'line-through opacity-70')}>
                  {tagMeta.abbrev}
                </span>
                <span className={cn('text-xs font-normal opacity-90', isCompleted && 'line-through opacity-60')}>
                  {tagMeta.label}
                  {incident.recurrenceCount && incident.recurrenceCount > 1 ? ` (${incident.recurrenceCount})` : ''}
                </span>
              </Badge>
            )}
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          side="top"
          className="w-80 p-3 bg-popover/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl text-xs z-50 space-y-2 whitespace-normal text-left"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetail?.(incident.id)
          }}
        >
          {/* Header: Abbrev badge + Title on left (no code), Deadline SLA on right */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={cn('px-1.5 py-0.5 rounded text-xs font-bold border shrink-0', badgeClass)}>
                {tagMeta.abbrev}
              </span>
              <span className="font-medium text-foreground text-xs truncate" title={displayTitle}>
                {displayTitle}
                {incident.recurrenceCount && incident.recurrenceCount > 1 ? ` (${incident.recurrenceCount})` : ''}
              </span>
            </div>
            {renderDeadlineBadge(incident)}
          </div>

          {/* Status, Severity & Context (Lớp • Buổi • Phòng • Ảnh) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className={cn('text-xs px-1.5 py-0 h-4.5 font-normal', severityClass)}>
              Mức: {QC_ERROR_SEVERITY_LABELS[incident.severity]}
            </Badge>
            <Badge variant="outline" className={cn('text-xs px-1.5 py-0 h-4.5 font-normal', statusBadge)}>
              {QC_ERROR_STATUS_LABELS[incident.status]}
            </Badge>
            {incident.className && (
              <span className="text-xs text-muted-foreground font-normal">
                {incident.className}
                {incident.sessionNumber ? ` • Buổi ${incident.sessionNumber}` : ''}
                {incident.roomId ? ` • ${incident.roomId}` : ''}
              </span>
            )}
            {(incident.evidenceImage || incident.evidenceLink) && (
              <span className="text-xs text-muted-foreground font-normal inline-flex items-center gap-0.5">
                <ImageIcon className="h-3 w-3 text-muted-foreground/70" />
                <span>Có ảnh</span>
              </span>
            )}
          </div>

          {/* Violation Description (unbolded) */}
          <div className="text-xs leading-snug">
            <p className="text-foreground/90 font-normal">
              <span className="text-muted-foreground font-normal">Nội dung vi phạm: </span>
              <span className="text-foreground font-normal">{incident.description}</span>
            </p>
          </div>

          {/* Evidence Image Thumbnail Preview */}
          {incident.evidenceImage && (
            <div className="pt-0.5">
              <div
                className="relative h-24 w-full rounded-md overflow-hidden border border-border/70 cursor-pointer group bg-muted/30"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewImageUrl(incident.evidenceImage || null)
                }}
                title="Bấm để mở ảnh lớn"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={incident.evidenceImage}
                  alt="Minh chứng vi phạm"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-normal gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Bấm để xem ảnh lớn</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer: Reporter (clean without parentheses) & Created Date + Click prompt */}
          <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-normal">
              Bởi: <span className="text-foreground font-normal">{formatStaffName(incident.issuedBy)}</span>
              {incident.createdAt && (
                <>
                  <span className="mx-1">•</span>
                  <span>{formatShortDate(incident.createdAt)}</span>
                </>
              )}
            </span>
            <span className="text-primary font-normal hover:underline cursor-pointer">
              Mở chi tiết &rarr;
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Lightbox Modal for Hover Card Image */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
          onClick={(e) => {
            e.stopPropagation()
            setPreviewImageUrl(null)
          }}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 right-0 flex items-center gap-2">
              <a
                href={previewImageUrl}
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
                onClick={() => setPreviewImageUrl(null)}
                className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-base"
                title="Đóng xem ảnh"
              >
                &times;
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt="Minh chứng vi phạm"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </>
  )
}
