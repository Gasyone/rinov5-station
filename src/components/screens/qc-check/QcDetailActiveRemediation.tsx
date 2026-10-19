'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  ShieldAlert,
  Send,
  X,
  ExternalLink,
} from 'lucide-react'
import type { QcIncident, QcRemediationRound } from '@/mocks/qcChecks'
import { QC_ERROR_STATUS_LABELS } from '@/mocks/qcChecks'
import { formatDateTime, formatShortDate } from './qcCheckHelpers'
import { isIncidentOverdue } from './qcCheckTypes'
import { formatStaffName } from './qcPersonnelHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { QcDetailHistoryPanel } from './QcDetailHistoryPanel'
import { QcTagHoverCard } from './QcTagHoverCard'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export interface QcDetailActiveRemediationProps {
  incident: QcIncident
  rounds: QcRemediationRound[]
  pastRounds?: QcRemediationRound[]
  currentAssignee: string
  onSubmitRemediation: (
    action: string,
    evidence: string,
    image?: string,
    preventiveAction?: string,
    link?: string
  ) => void
  onReviewSubmit: (status: 'closed' | 'not_met', note: string) => void
  onReopen: () => void
  onZoomImage: (url: string) => void
}

export function QcDetailActiveRemediation({
  incident,
  rounds,
  pastRounds = [],
  currentAssignee,
  onSubmitRemediation,
  onReviewSubmit,
  onReopen,
  onZoomImage,
}: QcDetailActiveRemediationProps) {
  const isOverdue = incident.status !== 'closed' && isIncidentOverdue(incident)
  const isPendingReview = incident.status === 'corrected'
  const isClosed = incident.status === 'closed'
  const isCancelled = incident.status === 'cancelled'
  const isRecurring =
    (incident.recurrenceCount ?? 0) > 0 || rounds.length > 1 || incident.status === 'not_met'

  const latestPendingRound = rounds.find((r) => !r.reviewedBy) || rounds[rounds.length - 1]

  // Form states for active remediation
  const [inlineAction, setInlineAction] = useState('')
  const [inlineEvidence, setInlineEvidence] = useState('')
  const [inlineImage, setInlineImage] = useState('')
  const [inlineLink, setInlineLink] = useState('')
  const [inlinePreventive, setInlinePreventive] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  // Review note for inspector
  const [reviewNote, setReviewNote] = useState('')

  const handleSendRemediation = () => {
    if (!inlineAction.trim()) return
    onSubmitRemediation(
      inlineAction.trim(),
      inlineEvidence.trim() || 'Đã khắc phục hoàn tất theo yêu cầu.',
      inlineImage || undefined,
      inlinePreventive.trim() || undefined,
      inlineLink.trim() || undefined
    )
    setInlineAction('')
    setInlineEvidence('')
    setInlineImage('')
    setInlineLink('')
    setInlinePreventive('')
    setShowLinkInput(false)
  }

  return (
    <div className="space-y-3 flex flex-col text-left">
      {/* ─── PHẦN 1 (Ở TRÊN): THÔNG TIN LỖI VI PHẠM (ISSUE DETAILS) ─── */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-2.5 text-left">
        {/* Header thông tin lỗi: Tag + Tiêu đề + Trạng thái (không có line, không có nút đổi phụ trách/hủy) */}
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <QcTagHoverCard incident={incident} />

          <span
            className="text-xs font-semibold text-foreground truncate max-w-[460px]"
            title={incident.title}
          >
            {incident.title}
          </span>

          <span
            className={cn(
              'text-[10px] px-1.5 py-0.2 rounded font-normal shrink-0',
              getStatusBadgeClass(incident.status)
            )}
          >
            {QC_ERROR_STATUS_LABELS[incident.status]}
          </span>
        </div>

        {/* Khối Bối cảnh & Thời gian ghi nhận / Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Cột trái: Lớp / Buổi / Phòng / Cơ sở */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-muted-foreground text-[11px] bg-muted/30 p-2 rounded-md">
            {incident.className && (
              <span className="font-medium text-foreground">
                Lớp: {incident.className}
              </span>
            )}
            {(incident.sessionNumber || incident.sessionInfo) && (
              <span>• Buổi {incident.sessionNumber || incident.sessionInfo}</span>
            )}
            {incident.roomId && <span>• {incident.roomId}</span>}
            {incident.branch && <span>• {incident.branch}</span>}
          </div>

          {/* Cột phải: Ghi nhận lúc & Deadline */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <span>Ghi nhận:</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-foreground font-medium cursor-help hover:underline">
                    {formatShortDate(incident.createdAt, false)}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Ghi nhận lúc {formatDateTime(incident.createdAt)}
                </TooltipContent>
              </Tooltip>
              {incident.issuedBy && <span> bởi {formatStaffName(incident.issuedBy)}</span>}
            </div>

            {incident.deadline && incident.status !== 'closed' && (
              <div className="flex items-center gap-1 shrink-0">
                <span>Hạn:</span>
                <span
                  className={cn(
                    'font-medium',
                    isOverdue ? 'text-destructive font-semibold' : 'text-foreground'
                  )}
                >
                  {formatShortDate(incident.deadline)}
                </span>
                {isOverdue && (
                  <span className="text-[10px] text-destructive font-bold">(Quá hạn)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nội dung mô tả vi phạm chi tiết (không có title) */}
        <p className="text-xs text-foreground/95 leading-relaxed whitespace-pre-wrap bg-background p-2.5 rounded-md border border-border/50">
          {incident.description || 'Chưa có mô tả chi tiết từ thanh tra/giám sát chất lượng.'}
        </p>

        {/* Bằng chứng vi phạm ban đầu (chỉ ảnh trực tiếp, không title, không note, không textlink) */}
        {incident.evidenceImage && (
          <div
            className="relative rounded-md overflow-hidden border border-border/70 max-w-[220px] cursor-pointer group"
            onClick={() => onZoomImage(incident.evidenceImage!)}
            title="Bấm để phóng to ảnh vi phạm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={incident.evidenceImage}
              alt="Bằng chứng vi phạm"
              className="w-full h-auto max-h-28 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-medium">
              Xem ảnh phóng to
            </div>
          </div>
        )}
      </div>

      {/* ─── PHẦN 2 (Ở DƯỚI): KHẮC PHỤC & NGHIỆM THU (REMEDIATION & REVIEW) ─── */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-2.5 text-left">
        {/* Header mục: Khắc phục & Nghiệm thu + Badge trạng thái */}
        <div className="flex items-center justify-between gap-2 pb-0.5 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Khắc phục & Nghiệm thu
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
              {isClosed
                ? 'Đã hoàn tất'
                : isPendingReview
                  ? 'Chờ nghiệm thu'
                  : 'Đang xử lý'}
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground">
            Phụ trách: <strong className="text-foreground">{formatStaffName(currentAssignee)}</strong>
          </div>
        </div>

        {/* 1. Trạng thái ĐANG KHẮC PHỤC / CẦN KHẮC PHỤC LẠI */}
        {!isClosed && !isCancelled && !isPendingReview && (
          <div className="space-y-1.5 pt-0.5">
            {/* Ô 1: Phương án và nội dung khắc phục */}
            <textarea
              rows={2}
              value={inlineAction}
              onChange={(e) => setInlineAction(e.target.value)}
              placeholder="Mô tả cụ thể phương án và nội dung đã xử lý khắc phục vi phạm..."
              className="w-full resize-none rounded-md border border-input bg-background p-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />

            {/* Ô 2: Hành động phòng ngừa lặp lại (bắt buộc khi tái diễn / chưa đạt) */}
            {isRecurring && (
              <textarea
                rows={2}
                value={inlinePreventive}
                onChange={(e) => setInlinePreventive(e.target.value)}
                placeholder="Hành động phòng ngừa lặp lại * (Nêu rõ quy trình cải tiến, đào tạo lại...)"
                className="w-full resize-none rounded-md border border-amber-300/80 bg-amber-50/20 dark:border-amber-800/60 dark:bg-amber-950/10 p-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              />
            )}

            {/* Nhập link nếu bấm Thêm link */}
            {showLinkInput && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <LinkIcon className="h-3 w-3 text-primary shrink-0" />
                <input
                  type="text"
                  value={inlineLink}
                  onChange={(e) => setInlineLink(e.target.value)}
                  placeholder="Dán link drive, tài liệu hoặc ảnh minh chứng..."
                  className="h-7 text-xs flex-1 rounded border border-input bg-background px-2"
                />
                <Button
                  size="xs"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => setShowLinkInput(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Thumbnail ảnh minh chứng đã đính kèm */}
            {inlineImage && (
              <div className="relative h-12 w-16 rounded border overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={inlineImage} alt="Ảnh đính kèm" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setInlineImage('')}
                  className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center text-[10px]"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Footer nút hành động: Thêm link, Thêm ảnh, Thời hạn & Nút Khắc phục */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="h-6 text-[11px] gap-1"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                >
                  <LinkIcon className="h-3 w-3" />
                  Thêm link
                </Button>

                <label className="h-6 px-2 text-[11px] font-normal border rounded-md bg-background hover:bg-muted flex items-center gap-1 cursor-pointer transition-colors">
                  <ImageIcon className="h-3 w-3 text-sky-600" />
                  <span>Thêm ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setInlineImage(URL.createObjectURL(file))
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2.5">
                {incident.deadline && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Thời hạn:</span>
                    <span
                      className={isOverdue ? 'text-destructive font-semibold' : 'text-foreground'}
                    >
                      {formatDateTime(incident.deadline)}
                    </span>
                    {isOverdue && (
                      <span className="text-[11px] text-destructive font-bold">(Quá hạn)</span>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  className="h-7 text-xs px-3 gap-1 bg-sky-600 hover:bg-sky-700 text-white font-medium"
                  disabled={!inlineAction.trim()}
                  onClick={handleSendRemediation}
                >
                  <Send className="h-3 w-3" />
                  <span>Khắc phục</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Trạng thái CHỜ NGHIỆM THU (Dành cho QC / Quản lý) */}
        {isPendingReview && (
          <div className="space-y-2 pt-0.5">
            {/* Bản giải trình vừa nộp */}
            {latestPendingRound && (
              <div className="rounded border border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20 p-2 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-900 dark:text-amber-300">
                    {formatStaffName(latestPendingRound.submittedBy)} đã báo cáo khắc phục (Lần{' '}
                    {latestPendingRound.roundNumber}):
                  </span>
                  <span className="text-muted-foreground">
                    {formatDateTime(latestPendingRound.submittedAt)}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed">{latestPendingRound.action}</p>

                {latestPendingRound.image && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onZoomImage(latestPendingRound.image || '')}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium cursor-pointer"
                      title="Bấm để xem ảnh minh chứng"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Ảnh minh chứng</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </button>
                  </div>
                )}

                {latestPendingRound.link && (
                  <div className="pt-0.5">
                    <a
                      href={latestPendingRound.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {latestPendingRound.link}
                    </a>
                  </div>
                )}

                {latestPendingRound.preventiveAction && (
                  <div className="mt-1 pt-1 border-t border-amber-200/60 dark:border-amber-900/60 flex items-start gap-1 text-[11px]">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-amber-900 dark:text-amber-300">
                        Phòng ngừa:{' '}
                      </strong>
                      {latestPendingRound.preventiveAction}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Khung nhập nhận xét & 2 nút duyệt */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Nhập nhận xét nghiệm thu (bắt buộc nêu lý do nếu đánh giá Chưa đạt)..."
                className="w-full resize-none rounded-md border border-input bg-background p-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <div className="flex items-center justify-end gap-2 pt-0.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => onReviewSubmit('not_met', reviewNote)}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Chưa đạt / Yêu cầu làm lại
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  onClick={() => onReviewSubmit('closed', reviewNote)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Duyệt Đạt & Đóng sự cố
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Trạng thái ĐÃ NGHIỆM THU ĐẠT & ĐÓNG */}
        {isClosed && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 p-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Sự cố đã được nghiệm thu đạt và đóng hoàn tất.
            </span>
            <Button
              size="xs"
              variant="ghost"
              className="text-xs text-muted-foreground hover:text-foreground h-6 gap-1"
              onClick={onReopen}
            >
              <RotateCcw className="h-3 w-3" />
              Mở lại phúc tra
            </Button>
          </div>
        )}

        {/* 4. Trạng thái ĐÃ HỦY */}
        {isCancelled && (
          <div className="rounded-md border border-muted bg-muted/30 p-2 text-center text-xs text-muted-foreground">
            Sự cố này đã được hủy bỏ.
          </div>
        )}

        {/* 5. PHẦN LỊCH SỬ PHẢN HỒI TRƯỚC ĐÓ CỦA SỰ CỐ NÀY (CÁC LẦN PHÚC TRA CŨ CỦA CHÍNH LỖI NÀY) */}
        {pastRounds && pastRounds.length > 0 && (
          <div className="border-t border-border/60 pt-3">
            <QcDetailHistoryPanel
              incident={incident}
              pastRounds={pastRounds}
              onZoomImage={onZoomImage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
