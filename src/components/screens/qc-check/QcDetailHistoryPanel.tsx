'use client'

import React from 'react'
import {
  History,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bot,
  UserCheck,
  ZoomIn,
} from 'lucide-react'
import type { QcIncident, QcRemediationRound } from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'
import { formatStaffName, getCriteriaTagMeta, getTagStyle } from './qcPersonnelHelpers'
import { cn } from '@/lib/utils'

export interface QcDetailHistoryPanelProps {
  incident: QcIncident
  pastRounds: QcRemediationRound[]
  onZoomImage: (url: string) => void
}

export function QcDetailHistoryPanel({
  incident,
  pastRounds,
  onZoomImage,
}: QcDetailHistoryPanelProps) {
  const tagMeta = getCriteriaTagMeta(incident.criteria)
  const { badgeClass } = getTagStyle(incident)
  const hasHistory = pastRounds.length > 0 || (incident.logs && incident.logs.length > 0)

  if (!hasHistory) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-3 text-center text-xs text-muted-foreground">
        <History className="h-4 w-4 mx-auto mb-1 opacity-50" />
        Chưa có lịch sử xử lý trước đó. Sự cố đang ở lượt xử lý đầu tiên.
      </div>
    )
  }

  return (
    <div className="space-y-2.5 text-left pt-2 border-t border-border/50">
      {/* Header Lịch sử phẳng */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Lịch sử ghi nhận & khắc phục ({pastRounds.length + 1} mốc)</span>
        </span>
      </div>

      {/* Danh sách các lần xử lý (PHẲNG, KHÔNG cuộn lồng) */}
      <div className="space-y-2.5">
        {pastRounds.map((rnd, idx) => {
          const isRejected = rnd.reviewStatus === 'rejected'
          const isApproved = rnd.reviewStatus === 'approved'

          return (
            <div
              key={rnd.id || idx}
              className="rounded-lg border border-border/60 bg-background p-2.5 text-xs space-y-2"
            >
              {/* Header của lần này: THẺ VI PHẠM + Lần xử lý + Người giải trình + Thời gian nộp */}
              <div className="flex items-center justify-between text-[11px] border-b border-border/40 pb-1.5 flex-wrap gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  {/* Thẻ ghi nhận lỗi gắn trực tiếp vào mốc lịch sử */}
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0',
                      badgeClass
                    )}
                  >
                    {tagMeta.abbrev} {tagMeta.label}
                    {incident.recurrenceCount && incident.recurrenceCount > 1
                      ? ` (${incident.recurrenceCount})`
                      : ''}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {incident.code}
                  </span>
                  <span className="text-[10px] text-primary font-bold px-1.5 py-0.2 rounded bg-primary/10">
                    Lần {rnd.roundNumber || idx + 1}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-semibold text-foreground">
                    {formatStaffName(rnd.submittedBy)}
                  </span>
                </div>

                <span className="text-muted-foreground text-[10px]">
                  {formatDateTime(rnd.submittedAt)}
                </span>
              </div>

              {/* Nội dung giải trình của nhân sự */}
              <div className="space-y-0.5">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Nội dung báo cáo khắc phục:
                </span>
                <p className="text-foreground leading-relaxed font-normal">{rnd.action}</p>
              </div>

              {/* Bằng chứng / Minh chứng */}
              {rnd.evidence && (
                <p className="text-[11px] text-muted-foreground italic">
                  Minh chứng: &ldquo;{rnd.evidence}&rdquo;
                </p>
              )}

              {/* Ảnh minh chứng của lần khắc phục này (có click zoom) */}
              {rnd.image && (
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    Ảnh bằng chứng khắc phục:
                  </span>
                  <div
                    className="relative inline-block rounded-md overflow-hidden border border-border group cursor-pointer"
                    onClick={() => onZoomImage(rnd.image || '')}
                    title="Bấm để xem ảnh phóng to"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rnd.image}
                      alt={`Minh chứng lần ${rnd.roundNumber || idx + 1}`}
                      className="h-16 w-28 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Link nếu có */}
              {rnd.link && (
                <div className="pt-0.5">
                  <a
                    href={rnd.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium border rounded px-1.5 py-0.5 bg-background"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {rnd.link}
                  </a>
                </div>
              )}

              {/* Hành động phòng ngừa lặp lại */}
              {rnd.preventiveAction && (
                <div className="rounded border border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-1.5 text-[11px] space-y-0.5">
                  <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3 text-amber-600 shrink-0" />
                    Biện pháp phòng ngừa tái diễn:
                  </span>
                  <p className="text-amber-950 dark:text-amber-200">{rnd.preventiveAction}</p>
                </div>
              )}

              {/* Đánh giá nghiệm thu của QC cho lần này */}
              {rnd.reviewedBy && (
                <div
                  className={cn(
                    'mt-1 rounded p-1.5 border space-y-0.5 text-[11px]',
                    isRejected
                      ? 'border-destructive/30 bg-destructive/5 text-destructive dark:bg-destructive/10'
                      : 'border-emerald-200 bg-emerald-50/60 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300'
                  )}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1">
                      {isRejected ? (
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      <span>Thẩm định: {formatStaffName(rnd.reviewedBy)} (QC)</span>
                      <span className="text-[10px] px-1 rounded uppercase font-bold">
                        [{isRejected ? 'CHƯA ĐẠT' : isApproved ? 'ĐẠT' : 'CHỜ DUYỆT'}]
                      </span>
                    </div>
                    <span className="text-[10px] font-normal opacity-80">
                      {formatDateTime(rnd.reviewedAt)}
                    </span>
                  </div>

                  {rnd.reviewNote && (
                    <p className="leading-snug text-foreground/90 pl-4.5 pt-0.5">
                      {rnd.reviewNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* ─── MỐC GHI NHẬN BAN ĐẦU ─── */}
        <div className="rounded-lg border border-border/60 bg-background/80 p-2.5 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] border-b border-border/40 pb-1.5 flex-wrap gap-1">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              {/* Thẻ ghi nhận lỗi */}
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0',
                  badgeClass
                )}
              >
                {tagMeta.abbrev} {tagMeta.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{incident.code}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">
                Ghi nhận ban đầu
              </span>
              <span className="text-muted-foreground">•</span>
              <div className="inline-flex items-center gap-1 font-semibold text-foreground">
                {incident.source === 'system' ? (
                  <Bot className="h-3 w-3 text-primary shrink-0" />
                ) : (
                  <UserCheck className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
                <span>{formatStaffName(incident.issuedBy)}</span>
              </div>
            </div>

            <span className="text-muted-foreground text-[10px]">
              {formatDateTime(incident.createdAt)}
            </span>
          </div>

          {/* Mô tả lỗi ban đầu */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Mô tả sự cố hiện trường:
            </span>
            <p className="text-foreground/90 leading-relaxed font-normal">
              {incident.description}
            </p>
          </div>

          {incident.evidence && (
            <p className="text-[11px] text-muted-foreground italic">
              Bằng chứng hệ thống: &ldquo;{incident.evidence}&rdquo;
            </p>
          )}

          {/* Ảnh bằng chứng hiện trường ban đầu (có click zoom) */}
          {incident.evidenceImage && (
            <div className="space-y-1 pt-0.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase">
                Ảnh hiện trường vi phạm:
              </span>
              <div
                className="relative inline-block rounded-md overflow-hidden border border-border group cursor-pointer"
                onClick={() => onZoomImage(incident.evidenceImage || '')}
                title="Bấm để xem ảnh hiện trường phóng to"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={incident.evidenceImage}
                  alt="Ảnh hiện trường ban đầu"
                  className="h-16 w-28 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
