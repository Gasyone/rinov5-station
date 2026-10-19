'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  UserCog,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  ShieldAlert,
  Send,
  X,
  ExternalLink,
  Flame,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react'
import type { QcIncident, QcRemediationRound } from '@/mocks/qcChecks'
import { QC_TARGET_GROUP_LABELS } from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'
import { isIncidentOverdue } from './qcCheckTypes'
import { formatStaffName, getCriteriaTagMeta, getTagStyle } from './qcPersonnelHelpers'
import { cn } from '@/lib/utils'

const SEVERITY_CONFIG = {
  critical: {
    label: 'Khẩn cấp',
    color: 'text-destructive',
    icon: Flame,
  },
  high: {
    label: 'Cao',
    color: 'text-orange-600 dark:text-orange-400',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Trung bình',
    color: 'text-amber-600 dark:text-amber-400',
    icon: AlertCircle,
  },
  low: {
    label: 'Thấp',
    color: 'text-sky-600 dark:text-sky-400',
    icon: Info,
  },
}

export interface QcDetailActiveRemediationProps {
  incident: QcIncident
  rounds: QcRemediationRound[]
  currentAssignee: string
  onOpenChangeAssignee: () => void
  onCancelIncident: () => void
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
  currentAssignee,
  onOpenChangeAssignee,
  onCancelIncident,
  onSubmitRemediation,
  onReviewSubmit,
  onReopen,
  onZoomImage,
}: QcDetailActiveRemediationProps) {
  const isOverdue = incident.status !== 'closed' && isIncidentOverdue(incident)
  const isPendingReview = incident.status === 'corrected'
  const isClosed = incident.status === 'closed'
  const isCancelled = incident.status === 'cancelled'
  const isRecurring = (incident.recurrenceCount ?? 0) > 0 || rounds.length > 1 || incident.status === 'not_met'

  // Current round index: past rounds count + 1
  const currentRoundNumber = rounds.length + 1
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

  const tagMeta = getCriteriaTagMeta(incident.criteria)
  const { badgeClass } = getTagStyle(incident)
  const sev = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.medium
  const SevIcon = sev.icon

  return (
    <div className="space-y-2.5 text-left">
      {/* ─── CARD A: THÔNG TIN SỰ CỐ ĐANG XEM (Phẳng, tinh tế) ─── */}
      <div className="rounded-lg border border-border/60 bg-background p-2.5 space-y-1.5">
        {/* Hàng 1: Thẻ vi phạm + Mã + Đối tượng + Mức độ */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn('px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0', badgeClass)}>
              {tagMeta.abbrev} {tagMeta.label}
              {incident.recurrenceCount && incident.recurrenceCount > 1 ? ` (${incident.recurrenceCount})` : ''}
            </span>
            <span className="font-mono text-xs font-semibold text-primary">{incident.code}</span>
            <Badge variant="outline" className="text-[11px] font-normal">
              {QC_TARGET_GROUP_LABELS[incident.targetGroup]}
            </Badge>
          </div>

          <div className="flex items-center gap-1 shrink-0" title={`Mức độ: ${sev.label}`}>
            <SevIcon className={cn('h-3.5 w-3.5', sev.color)} />
            <span className={cn('text-xs font-semibold', sev.color)}>{sev.label}</span>
          </div>
        </div>

        {/* Tiêu đề lỗi */}
        <h3 className="text-sm font-bold text-foreground leading-snug">
          {incident.title}
        </h3>

        {/* Thông tin bối cảnh Lớp / Buổi / Phòng */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-xs border border-border/40 text-muted-foreground">
          {incident.className && (
            <span className="flex items-center gap-1">
              <span>Lớp:</span>
              <span className="text-foreground font-medium">{incident.className}</span>
            </span>
          )}
          {(incident.sessionInfo || incident.sessionNumber) && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>Buổi:</span>
                <span className="text-foreground font-medium">
                  {incident.sessionInfo || `Buổi ${incident.sessionNumber}`}
                </span>
              </span>
            </>
          )}
          {incident.roomId && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>Phòng:</span>
                <span className="text-foreground font-medium">{incident.roomId}</span>
              </span>
            </>
          )}
          <span className="ml-auto text-[10px]">
            Phát hiện bởi: <span className="text-foreground font-medium">{formatStaffName(incident.issuedBy)}</span>
          </span>
        </div>

        {/* Mô tả vi phạm */}
        <div className="space-y-0.5 pt-0.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Mô tả vi phạm:
          </span>
          <p className="text-xs text-foreground/90 leading-relaxed font-normal whitespace-pre-wrap">
            {incident.description}
          </p>
        </div>
      </div>

      {/* ─── CARD B: LẦN ĐANG KHẮC PHỤC HIỆN TẠI (Phẳng, không viền hộp lồng) ─── */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        {/* Header Mục B: Tiêu đề + Nhãn lần xử lý + Nút hủy sự cố */}
        <div className="pb-1.5 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Khắc phục & Nghiệm thu
              </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
              {isClosed
                ? 'Đã hoàn tất'
                : isPendingReview
                  ? 'Chờ nghiệm thu'
                  : `Lần ${currentRoundNumber} - Đang xử lý`}
            </span>
          </div>

          {!isClosed && !isCancelled && (
            <Button
              size="xs"
              variant="ghost"
              className="h-5 px-1.5 text-[11px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer font-medium"
              onClick={onCancelIncident}
              title="Hủy sự cố này"
            >
              Hủy sự cố
            </Button>
          )}
        </div>

        {/* Dòng Phụ trách và Thời hạn SLA CÙNG MỘT HÀNG */}
        <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-muted-foreground shrink-0">Phụ trách:</span>
            <span
              className="text-foreground font-semibold truncate max-w-[170px]"
              title={currentAssignee}
            >
              {formatStaffName(currentAssignee)}
            </span>
            {!isClosed && !isCancelled && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-5 w-5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full shrink-0"
                title="Thay đổi người phụ trách"
                onClick={onOpenChangeAssignee}
              >
                <UserCog className="h-3.5 w-3.5 text-primary" />
              </Button>
            )}
          </div>

          {incident.deadline && (
            <div className="flex items-center gap-1 text-xs shrink-0 text-muted-foreground">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>Thời hạn:</span>
              <span className={isOverdue ? 'text-destructive font-semibold' : 'text-foreground'}>
                {formatDateTime(incident.deadline)}
              </span>
              {isOverdue && (
                <span className="text-[11px] text-destructive font-bold">(Quá hạn)</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BODY LẦN ĐANG XỬ LÝ */}

      {/* 1. Trạng thái ĐANG KHẮC PHỤC / CẦN KHẮC PHỤC LẠI */}
      {(!isClosed && !isCancelled && !isPendingReview) && (
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {currentRoundNumber > 1 ? `Khắc phục lại (Lần ${currentRoundNumber})` : 'Báo cáo phương án khắc phục:'}
            </span>
            {isRecurring && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Bắt buộc cả phòng ngừa
              </Badge>
            )}
          </div>

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

          {/* Footer nút hành động: Thêm link, Thêm ảnh, Gửi khắc phục */}
          <div className="flex items-center justify-between pt-1">
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

            <Button
              size="sm"
              className="h-7 text-xs px-3 gap-1 bg-sky-600 hover:bg-sky-700 text-white font-medium"
              disabled={!inlineAction.trim()}
              onClick={handleSendRemediation}
            >
              <Send className="h-3 w-3" />
              <span>{currentRoundNumber > 1 ? 'Khắc phục & Gửi lại' : 'Gửi báo cáo khắc phục'}</span>
            </Button>
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
                  {formatStaffName(latestPendingRound.submittedBy)} đã báo cáo khắc phục (Lần {latestPendingRound.roundNumber}):
                </span>
                <span className="text-muted-foreground">{formatDateTime(latestPendingRound.submittedAt)}</span>
              </div>
              <p className="text-foreground leading-relaxed">{latestPendingRound.action}</p>

              {latestPendingRound.image && (
                <div className="pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={latestPendingRound.image}
                    alt="Minh chứng vừa gửi"
                    className="h-16 w-24 object-cover rounded border cursor-pointer hover:opacity-90"
                    onClick={() => onZoomImage(latestPendingRound.image || '')}
                  />
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
                    <strong className="font-semibold text-amber-900 dark:text-amber-300">Phòng ngừa: </strong>
                    {latestPendingRound.preventiveAction}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Khung nhập nhận xét & 2 nút duyệt */}
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Đánh giá nghiệm thu của QC:
            </span>
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
      </div>
    </div>
  )
}
