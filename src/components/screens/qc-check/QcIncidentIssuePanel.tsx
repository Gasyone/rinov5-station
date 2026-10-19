'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Info, AlertCircle, AlertTriangle, Flame } from 'lucide-react'
import type { QcIncident } from '@/mocks/qcChecks'
import {
  QC_TARGET_GROUP_LABELS,
  QC_CRITERIA_LABELS,
  QC_ERROR_SEVERITY_LABELS,
} from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'

const SEVERITY_CONFIG = {
  low: { icon: Info, label: 'Thấp', color: 'text-emerald-600 dark:text-emerald-400' },
  medium: { icon: AlertCircle, label: 'Trung bình', color: 'text-blue-600 dark:text-blue-400' },
  high: { icon: AlertTriangle, label: 'Cao', color: 'text-amber-600 dark:text-amber-400' },
  critical: { icon: Flame, label: 'Nghiêm trọng', color: 'text-rose-600 dark:text-rose-400' },
}

function formatStaffName(name?: string): string {
  if (!name) return ''
  return name.replace(/\s*\(.*?\)/g, '').trim()
}

interface QcIncidentIssuePanelProps {
  incident: QcIncident
  onZoomImage: (url: string) => void
}

export function QcIncidentIssuePanel({ incident, onZoomImage }: QcIncidentIssuePanelProps) {
  const sev = SEVERITY_CONFIG[incident.severity]
  const SevIcon = sev.icon

  return (
    <div className="space-y-1.5 rounded-lg border border-border p-2.5 bg-muted/10">
      {/* Header Mục A: Dòng trên là A. Vấn đề + Badges & Nghiêm trọng cạnh phải; Dòng dưới là Người phát hiện + Tạo lúc */}
      <div className="border-b pb-1 space-y-0.5">
        {/* Dòng trên: A. Vấn đề + Phân loại bên trái, Mức độ Nghiêm trọng bên phải */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
              A. Vấn đề
            </span>
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${
                incident.targetGroup === 'teacher'
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : incident.targetGroup === 'facility'
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-teal-200 bg-teal-50 text-teal-700'
              }`}
            >
              {QC_TARGET_GROUP_LABELS[incident.targetGroup]}
            </Badge>
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
              {QC_CRITERIA_LABELS[incident.criteria]}
            </Badge>
          </div>

          {/* Mức độ nghiêm trọng đưa lên cạnh phải, dòng trên */}
          <div className="flex items-center gap-1 shrink-0" title={`Mức độ: ${QC_ERROR_SEVERITY_LABELS[incident.severity]}`}>
            <SevIcon className={`h-4 w-4 ${sev.color}`} />
            <span className={`text-xs font-semibold ${sev.color}`}>
              {sev.label}
            </span>
          </div>
        </div>

        {/* Dòng dưới: Người phát hiện và Tạo lúc CÙNG 1 DÒNG */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            Người phát hiện: <span className="text-foreground font-medium">{formatStaffName(incident.issuedBy)}</span>
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span>
            Tạo lúc: {formatDateTime(incident.createdAt)}
          </span>
        </div>
      </div>

      {/* Thông tin đối tượng lấy chuẩn theo các trường của modal tạo (Giáo viên / CSVC / Vận hành) */}
      {incident.targetGroup === 'teacher' && (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40">
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Lớp học:</span>
            <span className="text-foreground font-normal">{incident.className || 'Chưa cập nhật'}</span>
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Buổi học:</span>
            <span className="text-foreground font-normal">
              {incident.sessionInfo || (incident.sessionNumber ? `Buổi ${incident.sessionNumber}` : 'Buổi 1')}
            </span>
          </span>
        </div>
      )}

      {incident.targetGroup === 'facility' && (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40">
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Phòng học:</span>
            <span className="text-foreground font-normal">{incident.roomId || 'Toàn cơ sở'}</span>
          </span>
          {incident.notes && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground">Thiết bị:</span>
                <span className="text-foreground font-normal">{incident.notes}</span>
              </span>
            </>
          )}
        </div>
      )}

      {incident.targetGroup === 'operations' && (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40">
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Nhân sự:</span>
            <span className="text-foreground font-normal">{formatStaffName(incident.csmName || incident.assignee)}</span>
          </span>
          {incident.className && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground">Lớp học:</span>
                <span className="text-foreground font-normal">{incident.className}</span>
              </span>
            </>
          )}
          {(incident.sessionInfo || incident.sessionNumber) && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground">Buổi học:</span>
                <span className="text-foreground font-normal">
                  {incident.sessionInfo || `Buổi ${incident.sessionNumber}`}
                </span>
              </span>
            </>
          )}
        </div>
      )}

      <div className="space-y-0.5">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          Mô tả vi phạm:
        </span>
        <p className="text-xs sm:text-sm font-normal text-foreground leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Ảnh bằng chứng phẳng, click trực tiếp để mở ảnh */}
      {incident.evidenceImage && (
        <div
          className="relative h-24 sm:h-28 w-full rounded-md overflow-hidden cursor-pointer group"
          onClick={() => onZoomImage(incident.evidenceImage || '')}
          title="Bấm để mở ảnh"
        >
          <img
            src={incident.evidenceImage}
            alt="Bằng chứng hiện trường"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
            Bấm để mở ảnh
          </div>
        </div>
      )}

      {incident.evidenceLink && (
        <div>
          <a
            href={incident.evidenceLink}
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
  )
}
