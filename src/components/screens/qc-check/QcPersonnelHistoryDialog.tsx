'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  History,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QcIncident, QcRemediationRound } from '@/mocks/qcChecks'
import { QC_CRITERIA_LABELS } from '@/mocks/qcChecks'
import { formatShortDate } from './qcCheckHelpers'
import { formatStaffName } from './qcPersonnelHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { RemediationRoundCard } from './QcDetailHistoryPanel'
import { QcTagHoverCard } from './QcTagHoverCard'

export interface QcPersonnelHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  personnelName: string
  personnelCode?: string
  role?: string
  completedIncidents: QcIncident[]
  getRoundsForIncident: (incident: QcIncident) => QcRemediationRound[]
  onZoomImage: (url: string) => void
  onReopenIncident: (incidentId: string) => void
}

function HistoryIncidentCluster({
  incident,
  rounds,
  onZoomImage,
  onReopenIncident,
}: {
  incident: QcIncident
  rounds: QcRemediationRound[]
  onZoomImage: (url: string) => void
  onReopenIncident: (incidentId: string) => void
}) {
  const [isOlderExpanded, setIsOlderExpanded] = useState<boolean>(false)

  // Lần khắc phục đã đạt nghiệm thu
  const approvedRound =
    [...rounds].reverse().find((r) => r.reviewStatus === 'approved') ||
    rounds[rounds.length - 1]

  const olderRounds = approvedRound
    ? rounds.filter((r) => r.id !== approvedRound.id)
    : rounds.slice(0, -1)

  const olderRejectedCount = olderRounds.filter((r) => r.reviewStatus === 'rejected').length
  const displayTitle = incident.title || QC_CRITERIA_LABELS[incident.criteria]

  return (
    <div className="rounded-xl border border-border/80 bg-card p-3 sm:p-3.5 shadow-2xs text-left transition-all hover:border-border">
      {/* ─── Chia 2 cột: Cột trái (Lỗi) & Cột phải (Lịch sử khắc phục) luôn đi cùng nhau trong 1 section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* ─── CỘT TRÁI (LỖI VI PHẠM) - col-span-5 ─── */}
        <div className="lg:col-span-5 space-y-2 flex flex-col min-w-0 pr-0 lg:pr-2.5 lg:border-r lg:border-border/60">
          {/* Header lỗi: Tag + Tiêu đề + Trạng thái */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <QcTagHoverCard incident={incident} />

            <span
              className="text-xs font-semibold text-foreground leading-snug break-words"
              title={displayTitle}
            >
              {displayTitle}
            </span>

            <span
              className={cn(
                'text-[10px] px-1.5 py-0.2 rounded font-normal shrink-0',
                getStatusBadgeClass('qc_error_closed')
              )}
            >
              Đã đóng
            </span>
          </div>

          {/* Bối cảnh: Lớp / Buổi / Phòng / Thời gian ghi nhận & đóng */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground border border-border/40">
            {incident.className && (
              <span>
                Lớp: <strong className="text-foreground font-medium">{incident.className}</strong>
              </span>
            )}
            {(incident.sessionNumber || incident.sessionInfo) && (
              <span>• Buổi {incident.sessionNumber || incident.sessionInfo}</span>
            )}
            {incident.roomId && <span>• {incident.roomId}</span>}
            {incident.branch && <span>• {incident.branch}</span>}
            <span>• Ghi nhận: {formatShortDate(incident.createdAt)}</span>
            {incident.closedAt && (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                • Đóng: {formatShortDate(incident.closedAt)}
              </span>
            )}
          </div>

          {/* Nội dung mô tả vi phạm */}
          {incident.description && (
            <p className="bg-background/90 p-2.5 rounded-md border border-border/50 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </p>
          )}

          {/* Bằng chứng vi phạm ban đầu (ảnh minh chứng) */}
          {(incident.evidenceImage || incident.correctiveImage) && (
            <div className="pt-0.5">
              <div
                className="relative rounded-md overflow-hidden border border-border/70 max-w-[200px] cursor-pointer group"
                onClick={() => onZoomImage(incident.evidenceImage || incident.correctiveImage!)}
                title="Bấm để phóng to ảnh vi phạm ban đầu"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={incident.evidenceImage || incident.correctiveImage}
                  alt="Bằng chứng vi phạm ban đầu"
                  className="w-full h-auto max-h-24 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-medium">
                  Xem ảnh vi phạm
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── CỘT PHẢI (LỊCH SỬ KHẮC PHỤC) - col-span-7 ─── */}
        <div className="lg:col-span-7 space-y-2 flex flex-col min-w-0 pl-0 lg:pl-1">
          {/* Header kết quả khắc phục + Nút Mở lại */}
          <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kết quả khắc phục đã nghiệm thu</span>
            </div>

            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="h-5 px-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer font-normal shrink-0"
              onClick={() => onReopenIncident(incident.id)}
              title="Mở lại phúc tra cho sự cố này"
            >
              <RotateCcw className="h-3 w-3 mr-0.5" />
              Mở lại
            </Button>
          </div>

          {/* Lần khắc phục đã đạt nghiệm thu */}
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

          {/* Footer cụm: Mở rộng các lần phản hồi trước đó (nếu có lần chưa đạt) */}
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
                      key={rnd.id || `hist_${incident.id}_${idx}`}
                      rnd={rnd}
                      onZoomImage={onZoomImage}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function QcPersonnelHistoryDialog({
  open,
  onOpenChange,
  personnelName,
  personnelCode,
  role,
  completedIncidents,
  getRoundsForIncident,
  onZoomImage,
  onReopenIncident,
}: QcPersonnelHistoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [monthFilter, setMonthFilter] = useState('all')

  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>()
    // Defaults for demo
    monthSet.add('2026-10')
    monthSet.add('2026-09')
    completedIncidents.forEach((inc) => {
      const d = inc.closedAt || inc.createdAt
      if (d && d.length >= 7) {
        monthSet.add(d.substring(0, 7))
      }
    })
    return Array.from(monthSet).sort().reverse()
  }, [completedIncidents])

  const filteredIncidents = useMemo(() => {
    return completedIncidents.filter((inc) => {
      if (searchTerm) {
        const text = `${inc.title} ${inc.code} ${inc.criteria} ${inc.description}`.toLowerCase()
        if (!text.includes(searchTerm.toLowerCase().trim())) return false
      }
      if (monthFilter !== 'all') {
        const dateStr = inc.closedAt || inc.createdAt || ''
        if (!dateStr.startsWith(monthFilter)) return false
      }
      return true
    })
  }, [completedIncidents, searchTerm, monthFilter])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl w-full p-4 flex flex-col max-h-[90vh] overflow-hidden text-foreground gap-3"
        showCloseButton
      >
        {/* Header Modal */}
        <DialogHeader className="p-0 pb-1 shrink-0 border-b border-border/60">
          <div className="flex items-center justify-between gap-3 text-left pr-8">
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <span>Lịch sử chất lượng & Hồ sơ khắc phục</span>
              </DialogTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="font-semibold text-foreground">{personnelName}</span>
                {personnelCode && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-primary font-medium">{personnelCode}</span>
                  </>
                )}
                {role && (
                  <>
                    <span>•</span>
                    <span>{role}</span>
                  </>
                )}
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {completedIncidents.length} sự cố đã hoàn thành đóng
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar: Tìm kiếm & Lọc chu kỳ tháng (CÙNG HÀNG) */}
        <div className="flex items-center justify-between gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tiêu đề, mã lỗi, nội dung..."
              className="h-8 text-xs w-full rounded-md border border-input bg-background px-2.5 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">Chu kỳ:</span>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="h-8 text-xs rounded-md border border-input bg-background px-2.5 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-foreground font-normal"
            >
              <option value="all">Tất cả các tháng ({completedIncidents.length})</option>
              {availableMonths.map((m) => {
                const [year, month] = m.split('-')
                return (
                  <option key={m} value={m}>
                    Tháng {month}/{year}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Danh sách các cụm lịch sử khắc phục (Mỗi cụm 1 section chia 2 cột: Trái Lỗi, Phải Khắc phục) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5">
          {filteredIncidents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground space-y-1">
              <Filter className="h-6 w-6 text-muted-foreground/60 mx-auto" />
              <p className="font-medium text-foreground">Không tìm thấy sự cố nào</p>
              <p>Chưa có sự cố nào đã đóng phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            filteredIncidents.map((inc) => {
              const rounds = getRoundsForIncident(inc)
              return (
                <HistoryIncidentCluster
                  key={inc.id}
                  incident={inc}
                  rounds={rounds}
                  onZoomImage={onZoomImage}
                  onReopenIncident={(id) => {
                    onReopenIncident(id)
                    onOpenChange(false)
                  }}
                />
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
