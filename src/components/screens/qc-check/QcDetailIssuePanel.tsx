'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  ExternalLink,
  Info,
  AlertCircle,
  AlertTriangle,
  Flame,
  Plus,
  ChevronRight,
} from 'lucide-react'
import type { QcIncident } from '@/mocks/qcChecks'
import {
  QC_TARGET_GROUP_LABELS,
  QC_CRITERIA_LABELS,
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
} from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'
import { getCriteriaTagMeta, getTagStyle, formatStaffName } from './qcPersonnelHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { isIncidentOverdue } from './qcCheckTypes'
import { cn } from '@/lib/utils'

const SEVERITY_CONFIG = {
  low: { icon: Info, label: 'Thấp', color: 'text-emerald-600 dark:text-emerald-400' },
  medium: { icon: AlertCircle, label: 'Trung bình', color: 'text-blue-600 dark:text-blue-400' },
  high: { icon: AlertTriangle, label: 'Cao', color: 'text-amber-600 dark:text-amber-400' },
  critical: { icon: Flame, label: 'Nghiêm trọng', color: 'text-rose-600 dark:text-rose-400' },
}

export interface QcDetailIssuePanelProps {
  incidents: QcIncident[]
  activeIncident: QcIncident
  onSelectIncident: (incidentId: string) => void
  onZoomImage: (url: string) => void
  onCreateNewIssue?: () => void
}

export function QcDetailIssuePanel({
  incidents,
  activeIncident,
  onSelectIncident,
  onZoomImage,
  onCreateNewIssue,
}: QcDetailIssuePanelProps) {
  const sev = SEVERITY_CONFIG[activeIncident.severity] || SEVERITY_CONFIG.medium
  const SevIcon = sev.icon
  const hasMultipleIssues = incidents.length > 1

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-2.5 bg-muted/10 h-full">
      {/* 1. Header: Danh sách các vấn đề (Multi-issues selector) nếu có nhiều hơn 1 vấn đề */}
      {hasMultipleIssues ? (
        <div className="space-y-1.5 pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>Các vấn đề của đối tượng</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                {incidents.length}
              </span>
            </span>

            {onCreateNewIssue && (
              <button
                type="button"
                onClick={onCreateNewIssue}
                className="text-xs text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                title="Ghi nhận thêm sự cố mới"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm lỗi</span>
              </button>
            )}
          </div>

          {/* Danh sách thẻ vấn đề để click chọn */}
          <div className="space-y-1 max-h-40 overflow-y-auto pr-0.5">
            {incidents.map((inc) => {
              const isSelected = inc.id === activeIncident.id
              const tagMeta = getCriteriaTagMeta(inc.criteria)
              const { badgeClass } = getTagStyle(inc)
              const isOverdue = inc.status !== 'closed' && isIncidentOverdue(inc)
              const displayTitle = inc.title || QC_CRITERIA_LABELS[inc.criteria]

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className={cn(
                    'flex items-center justify-between gap-1.5 p-1.5 rounded-md border text-xs cursor-pointer transition-all',
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-2xs font-medium text-foreground ring-1 ring-primary/30'
                      : 'border-border/70 bg-background/80 hover:bg-muted/60 text-muted-foreground'
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0',
                        badgeClass
                      )}
                    >
                      {tagMeta.abbrev}
                    </span>
                    <span
                      className="truncate text-xs font-normal"
                      title={`${displayTitle}${inc.recurrenceCount && inc.recurrenceCount > 1 ? ` (${inc.recurrenceCount})` : ''}`}
                    >
                      {displayTitle}
                      {inc.recurrenceCount && inc.recurrenceCount > 1 ? ` (${inc.recurrenceCount})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isOverdue && (
                      <span className="text-[10px] text-destructive font-medium px-1 rounded bg-destructive/10">
                        Quá hạn
                      </span>
                    )}
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded font-normal',
                        getStatusBadgeClass(inc.status)
                      )}
                    >
                      {QC_ERROR_STATUS_LABELS[inc.status]}
                    </span>
                    <ChevronRight
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        isSelected ? 'text-primary translate-x-0.5' : 'text-muted-foreground/50'
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* 2. Chi tiết vấn đề đang chọn */}
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        {/* Header chi tiết vấn đề: A. Vấn đề + Badges bên trái, Mức độ bên phải */}
        <div className="space-y-1 border-b border-border/40 pb-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-0.5">
                A. Vấn đề
              </span>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-normal',
                  activeIncident.targetGroup === 'teacher'
                    ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    : activeIncident.targetGroup === 'facility'
                      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300'
                )}
              >
                {QC_TARGET_GROUP_LABELS[activeIncident.targetGroup]}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs bg-primary/5 text-primary border-primary/20 font-normal"
              >
                {QC_CRITERIA_LABELS[activeIncident.criteria]}
              </Badge>
            </div>

            {/* Mức độ nghiêm trọng */}
            <div
              className="flex items-center gap-1 shrink-0"
              title={`Mức độ: ${QC_ERROR_SEVERITY_LABELS[activeIncident.severity]}`}
            >
              <SevIcon className={cn('h-3.5 w-3.5', sev.color)} />
              <span className={cn('text-xs font-medium', sev.color)}>{sev.label}</span>
            </div>
          </div>

          {/* Dòng người phát hiện & thời gian */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <span>
              Người phát hiện:{' '}
              <span className="text-foreground font-normal">
                {formatStaffName(activeIncident.issuedBy)}
              </span>
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span>Tạo lúc: {formatDateTime(activeIncident.createdAt)}</span>
          </div>
        </div>

        {/* Thông tin bối cảnh (Lớp, Buổi, Phòng) */}
        {activeIncident.targetGroup === 'teacher' && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40">
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">Lớp học:</span>
              <span className="text-foreground font-normal">
                {activeIncident.className || 'Chưa cập nhật'}
              </span>
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">Buổi học:</span>
              <span className="text-foreground font-normal">
                {activeIncident.sessionInfo ||
                  (activeIncident.sessionNumber ? `Buổi ${activeIncident.sessionNumber}` : 'Buổi 1')}
              </span>
            </span>
          </div>
        )}

        {activeIncident.targetGroup === 'facility' && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40">
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">Phòng học:</span>
              <span className="text-foreground font-normal">
                {activeIncident.roomId || 'Toàn cơ sở'}
              </span>
            </span>
            {activeIncident.notes && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground">Thiết bị:</span>
                  <span className="text-foreground font-normal">{activeIncident.notes}</span>
                </span>
              </>
            )}
          </div>
        )}

        {activeIncident.targetGroup === 'operations' && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40">
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">Nhân sự:</span>
              <span className="text-foreground font-normal">
                {formatStaffName(activeIncident.csmName || activeIncident.assignee)}
              </span>
            </span>
            {activeIncident.className && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground">Lớp học:</span>
                  <span className="text-foreground font-normal">{activeIncident.className}</span>
                </span>
              </>
            )}
            {(activeIncident.sessionInfo || activeIncident.sessionNumber) && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground">Buổi:</span>
                  <span className="text-foreground font-normal">
                    {activeIncident.sessionInfo || `Buổi ${activeIncident.sessionNumber}`}
                  </span>
                </span>
              </>
            )}
          </div>
        )}

        {/* Nội dung mô tả chi tiết vi phạm */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Mô tả vi phạm:
          </span>
          <p className="text-xs font-normal text-foreground leading-relaxed whitespace-pre-wrap">
            {activeIncident.description}
          </p>
        </div>

        {/* Ảnh bằng chứng hiện trường */}
        {activeIncident.evidenceImage && (
          <div className="space-y-1 pt-0.5 mt-auto">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Bằng chứng hiện trường:
            </span>
            <div
              className="relative h-24 sm:h-28 w-full rounded-md overflow-hidden cursor-pointer group border border-border/70 bg-muted/30"
              onClick={() => onZoomImage(activeIncident.evidenceImage || '')}
              title="Bấm để mở ảnh lớn"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeIncident.evidenceImage}
                alt="Bằng chứng hiện trường"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Bấm để phóng to</span>
              </div>
            </div>
          </div>
        )}

        {/* Liên kết chứng minh (nếu có) */}
        {activeIncident.evidenceLink && (
          <div className="pt-0.5">
            <a
              href={activeIncident.evidenceLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline border rounded px-2 py-0.5 bg-background font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              Liên kết chứng minh
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
