'use client'

import React, { useState } from 'react'
import {
  History,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react'
import type { QcIncident, QcRemediationRound } from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'
import { formatStaffName } from './qcPersonnelHelpers'
import { cn } from '@/lib/utils'

export interface QcDetailHistoryPanelProps {
  incident: QcIncident
  pastRounds: QcRemediationRound[]
  onZoomImage: (url: string) => void
}

export function RemediationRoundCard({
  rnd,
  onZoomImage,
}: {
  rnd: QcRemediationRound
  onZoomImage: (url: string) => void
}) {
  const isRejected = rnd.reviewStatus === 'rejected'
  const isApproved = rnd.reviewStatus === 'approved'

  return (
    <div
      className={cn(
        'rounded-lg border p-2 space-y-1.5 text-xs transition-all',
        isRejected
          ? 'border-destructive/25 bg-destructive/[0.02]'
          : 'border-border/60 bg-muted/20'
      )}
    >
      {/* Header: Trạng thái + Người phụ trách (trái) | Bằng chứng đính kèm + Thời gian (phải) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.2 rounded border inline-flex items-center gap-1 shrink-0',
              isRejected
                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                : isApproved
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border-border bg-muted text-muted-foreground'
            )}
          >
            {isRejected ? (
              <>
                <XCircle className="h-3 w-3 text-destructive" />
                Chưa đạt
              </>
            ) : isApproved ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Đạt
              </>
            ) : (
              'Chờ duyệt'
            )}
          </span>

          <span className="font-semibold text-foreground text-xs">
            {formatStaffName(rnd.submittedBy)}
          </span>
        </div>

        {/* Bằng chứng đính kèm (ngắn gọn) đưa lên trước thời gian */}
        <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-[11px]">
          {rnd.image && (
            <button
              type="button"
              onClick={() => onZoomImage(rnd.image!)}
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium cursor-pointer"
              title="Bấm để xem ảnh bằng chứng"
            >
              <ImageIcon className="h-3 w-3 text-primary shrink-0" />
              <span>Ảnh đính kèm</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
            </button>
          )}

          {rnd.link && (
            <a
              href={rnd.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
            >
              <LinkIcon className="h-3 w-3 text-primary shrink-0" />
              <span>Link</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
            </a>
          )}

          {(rnd.image || rnd.link) && rnd.submittedAt && <span>•</span>}

          {rnd.submittedAt && (
            <span>{formatDateTime(rnd.submittedAt)}</span>
          )}
        </div>
      </div>

      {/* Nội dung phương án (khoảng cách gọn, không nhãn) */}
      <p className="text-foreground leading-snug whitespace-pre-wrap font-normal">
        {rnd.action}
      </p>

      {/* Phòng ngừa lặp lại: [giải pháp] */}
      {rnd.preventiveAction && (
        <p className="text-xs text-foreground/90 leading-snug font-normal">
          <strong className="font-semibold text-foreground">Phòng ngừa lặp lại:</strong>{' '}
          {rnd.preventiveAction}
        </p>
      )}

      {/* Đánh giá thẩm định của QC (khoảng cách gọn, có nội dung trực tiếp ở dưới) */}
      {rnd.reviewedBy && (
        <div
          className={cn(
            'rounded-md p-1.5 border space-y-0.5 text-xs',
            isRejected
              ? 'border-destructive/30 bg-destructive/5 text-destructive dark:bg-destructive/10'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300'
          )}
        >
          <div className="flex items-center justify-between font-semibold text-[11px]">
            <div className="flex items-center gap-1">
              {isRejected ? (
                <XCircle className="h-3 w-3 text-destructive shrink-0" />
              ) : (
                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
              )}
              <span>QC Thẩm định: {formatStaffName(rnd.reviewedBy)}</span>
            </div>
            {rnd.reviewedAt && (
              <span className="text-[10px] font-normal opacity-85">
                {formatDateTime(rnd.reviewedAt)}
              </span>
            )}
          </div>

          {rnd.reviewNote && (
            <p className="text-xs text-foreground/95 font-normal leading-snug pl-4">
              {rnd.reviewNote}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function QcDetailHistoryPanel({
  pastRounds,
  onZoomImage,
}: QcDetailHistoryPanelProps) {
  // Trạng thái thu gọn/mở rộng các lần cũ hơn lần gần nhất
  const [isOlderExpanded, setIsOlderExpanded] = useState<boolean>(false)

  if (!pastRounds || pastRounds.length === 0) return null

  // Lần khắc phục gần nhất (phần tử cuối cùng)
  const latestPastRound = pastRounds[pastRounds.length - 1]
  // Các lần trước đó (những lần cũ hơn)
  const olderPastRounds = pastRounds.slice(0, -1)
  const olderRejectedCount = olderPastRounds.filter((r) => r.reviewStatus === 'rejected').length

  return (
    <div className="space-y-2 text-left">
      {/* ─── 1. HIỂN THỊ LẦN KHẮC PHỤC GẦN NHẤT ─── */}
      <RemediationRoundCard
        rnd={latestPastRound}
        onZoomImage={onZoomImage}
      />

      {/* ─── 2. CÁC LẦN TRƯỚC ĐÓ MỞ RỘNG BỞI TEXTLINK THU GỌN/MỞ RỘNG ─── */}
      {olderPastRounds.length > 0 && (
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
                {olderPastRounds.length} lần
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
              {olderPastRounds.map((rnd, idx) => (
                <RemediationRoundCard
                  key={rnd.id || `old_rnd_${idx}`}
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
