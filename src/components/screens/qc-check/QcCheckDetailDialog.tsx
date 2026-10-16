'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  MapPin,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Bot,
  User,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared'
import type { QcIncident, QcErrorStatus } from '@/mocks/qcChecks'
import {
  QC_TARGET_GROUP_LABELS,
  QC_CRITERIA_LABELS,
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
} from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'
import { isIncidentOverdue, getIncidentBadgeSemantic } from './qcCheckTypes'
import { QcCheckCommentsTab } from './QcCheckCommentsTab'
import { QcCheckLogsTab } from './QcCheckLogsTab'

interface QcCheckDetailDialogProps {
  incident?: QcIncident | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus?: (incidentId: string, status: QcErrorStatus) => void
  onUpdateRemediation?: (incidentId: string, action: string, evidence: string, image?: string) => void
  onRecheckSystem?: (incidentId: string) => void
  onAddComment?: (incidentId: string, content: string) => void
  currentUserId?: string
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
  open,
  onOpenChange,
  onUpdateStatus = () => {},
  onUpdateRemediation = () => {},
  onRecheckSystem = () => {},
  onAddComment = () => {},
  event,
}: QcCheckDetailDialogProps) {
  const incident = propIncident ?? (event?.errors?.[0] as QcIncident | undefined) ?? null
  const [activeTab, setActiveTab] = useState('remediation')
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null)
  const [isSubmittingFix, setIsSubmittingFix] = useState(false)
  const [fixAction, setFixAction] = useState('')
  const [fixEvidence, setFixEvidence] = useState('')
  const [fixImage, setFixImage] = useState('')

  if (!incident) return null

  const isOverdue = isIncidentOverdue(incident)

  const handleOpenFixModal = () => {
    setFixAction(incident.correctiveAction || '')
    setFixEvidence(incident.correctiveEvidence || '')
    setFixImage(incident.correctiveImage || '')
    setIsSubmittingFix(true)
  }

  const handleSaveFix = () => {
    if (!fixAction.trim()) {
      alert('Vui lòng nhập mô tả phương án khắc phục.')
      return
    }
    onUpdateRemediation(incident.id, fixAction, fixEvidence, fixImage)
    setIsSubmittingFix(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="grid h-[90vh] max-h-[850px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-5xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <DialogHeader className="shrink-0 px-6 pb-3 pt-5 border-b bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold bg-muted px-2 py-0.5 rounded border">
                    {incident.code}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold ${
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
                  {incident.source === 'system' ? (
                    <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold">
                      <Bot className="h-3 w-3 mr-1" />
                      Hệ thống tự tạo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Thủ công
                    </Badge>
                  )}
                  <StatusBadge
                    status={getIncidentBadgeSemantic(incident)}
                    label={QC_ERROR_STATUS_LABELS[incident.status]}
                  />
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs font-bold animate-pulse">
                      Quá hạn (Treo)
                    </Badge>
                  )}
                </div>

                <DialogTitle className="text-lg font-bold text-foreground">
                  {incident.title}
                </DialogTitle>

                {/* Subheader Context */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {incident.branch}
                  </span>
                  {incident.className && (
                    <span className="flex items-center gap-1">
                      Lớp: <strong className="text-foreground">{incident.className}</strong>
                      {incident.sessionNumber && ` (Buổi ${incident.sessionNumber})`}
                    </span>
                  )}
                  {incident.roomId && (
                    <span>Phòng: <strong className="text-foreground">{incident.roomId}</strong></span>
                  )}
                  {incident.teacherName && (
                    <span>Giáo viên: <strong className="text-foreground">{incident.teacherName}</strong></span>
                  )}
                  {incident.csmName && (
                    <span>CS: <strong className="text-foreground">{incident.csmName}</strong></span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Tạo lúc: {formatDateTime(incident.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Overdue Banner if Treo */}
            {isOverdue && (
              <div className="mt-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-2 text-xs text-red-700 dark:text-red-400 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Sự cố này đang bị TREO do quá thời hạn khắc phục cam kết (SLA). Cần xử lý khẩn cấp!
                </span>
                <span className="font-mono text-xs">
                  Hạn chót: {formatDateTime(incident.deadline)}
                </span>
              </div>
            )}
          </DialogHeader>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-col">
            <div className="flex items-center border-b px-6 bg-muted/20 shrink-0">
              <TabsList className="mb-[-1px] border-0 bg-transparent p-0 gap-6">
                <TabsTrigger
                  value="remediation"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-semibold border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Xử lý sự cố & Bằng chứng
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-semibold border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Trao đổi ({incident.comments?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-semibold border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Nhật ký thao tác ({incident.logs?.length || 0})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Remediation & Proofs */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-5">
              <TabsContent value="remediation" className="m-0 space-y-6">
                {/* 2-Column Split: Left = Issue Evidence, Right = Correction Proof */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Vấn đề & Bằng chứng gốc */}
                  <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/10">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        A. Vấn đề & Bằng chứng lúc phát hiện
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Mức độ: {QC_ERROR_SEVERITY_LABELS[incident.severity]}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Mô tả vi phạm:</span>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {incident.description}
                      </p>
                    </div>

                    <div className="rounded-md border bg-background p-3">
                      <span className="text-xs font-semibold text-muted-foreground block mb-1">
                        Chi tiết bằng chứng:
                      </span>
                      <p className="text-xs italic text-foreground bg-muted/30 p-2 rounded">
                        &ldquo;{incident.evidence}&rdquo;
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {incident.evidenceLink && (
                          <a
                            href={incident.evidenceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline border rounded px-2 py-1 bg-background"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Liên kết chứng minh
                          </a>
                        )}
                        {incident.evidenceImage && (
                          <button
                            type="button"
                            onClick={() => setZoomImageUrl(incident.evidenceImage || null)}
                            className="inline-flex items-center gap-1 text-xs text-foreground hover:text-primary border rounded px-2 py-1 bg-background cursor-pointer"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            Xem ảnh hiện trường
                          </button>
                        )}
                      </div>

                      {incident.evidenceImage && (
                        <div
                          className="relative mt-2.5 h-36 w-full rounded border overflow-hidden cursor-zoom-in group"
                          onClick={() => setZoomImageUrl(incident.evidenceImage || null)}
                        >
                          <img
                            src={incident.evidenceImage}
                            alt="Evidence Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                            Bấm để phóng to
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground pt-1 space-y-1">
                      <div>Người phát hiện: <strong className="text-foreground">{incident.issuedBy}</strong></div>
                      <div>Tạo lúc: {formatDateTime(incident.createdAt)}</div>
                    </div>
                  </div>

                  {/* Right Column: Báo cáo khắc phục */}
                  <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/10">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        B. Báo cáo khắc phục & Nghiệm thu
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Người phụ trách: <strong className="text-foreground">{incident.assignee}</strong>
                      </span>
                    </div>

                    {incident.correctiveAction ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Phương án đã xử lý:</span>
                          <p className="text-sm font-medium text-foreground bg-background p-2.5 rounded border leading-relaxed">
                            {incident.correctiveAction}
                          </p>
                        </div>

                        {incident.correctiveEvidence && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Bằng chứng sau khắc phục:</span>
                            <p className="text-xs italic text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded border border-emerald-200 dark:border-emerald-800">
                              &ldquo;{incident.correctiveEvidence}&rdquo;
                            </p>
                          </div>
                        )}

                        {incident.correctiveImage && (
                          <div
                            className="relative mt-2 h-36 w-full rounded border overflow-hidden cursor-zoom-in group"
                            onClick={() => setZoomImageUrl(incident.correctiveImage || null)}
                          >
                            <img
                              src={incident.correctiveImage}
                              alt="Corrective Proof"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                              Ảnh minh chứng đã sửa xong
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground pt-1 space-y-1">
                          {incident.completionDate && (
                            <div>Hoàn tất lúc: {formatDateTime(incident.completionDate)}</div>
                          )}
                          {incident.closedAt && (
                            <div>
                              Đã đóng lúc: {formatDateTime(incident.closedAt)} ({incident.closureMethod === 'system_auto' ? 'Hệ thống tự động đóng' : `Người đóng: ${incident.closedBy}`})
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-muted-foreground bg-background/50 rounded border border-dashed p-4">
                        <Clock className="h-6 w-6 text-muted-foreground/60" />
                        <p className="text-xs font-medium">Chưa có báo cáo phương án khắc phục.</p>
                        <p className="text-[11px]">Người phụ trách cần tiếp nhận và cập nhật phương án xử lý sự cố.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar for Status Transitions */}
                <div className="rounded-lg border bg-card p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Thao tác xử lý sự cố:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Open -> Start Correcting */}
                    {incident.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => onUpdateStatus(incident.id, 'correcting')}
                      >
                        <Play className="h-3.5 w-3.5" />
                        Tiếp nhận khắc phục
                      </Button>
                    )}

                    {/* Submit / Edit Fix Report */}
                    {(incident.status === 'open' || incident.status === 'correcting' || incident.status === 'not_met') && (
                      <Button
                        size="sm"
                        className="gap-1.5 font-semibold"
                        onClick={handleOpenFixModal}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        {incident.status === 'not_met' ? 'Khắc phục lại & Gửi duyệt' : 'Nộp báo cáo khắc phục'}
                      </Button>
                    )}

                    {/* Review actions for Corrected status */}
                    {incident.status === 'corrected' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-semibold"
                          onClick={() => onUpdateStatus(incident.id, 'closed')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Duyệt đạt (Đóng sự cố)
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1.5 font-semibold"
                          onClick={() => onUpdateStatus(incident.id, 'not_met')}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Trả lại (Chưa đạt)
                        </Button>
                      </>
                    )}

                    {/* Re-check trigger for System Bot issues */}
                    {incident.source === 'system' && incident.status !== 'closed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 gap-1.5 font-medium"
                        onClick={() => onRecheckSystem(incident.id)}
                        title="Kiểm tra lại hệ thống để xem dữ liệu đã được bổ sung chưa"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Quét lại hệ thống (Tự động đóng)
                      </Button>
                    )}

                    {/* Reopen if closed */}
                    {incident.status === 'closed' && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Sự cố đã được nghiệm thu và đóng hoàn tất
                        </span>
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => onUpdateStatus(incident.id, 'correcting')}
                        >
                          Mở lại phúc tra
                        </Button>
                      </div>
                    )}

                    {/* Status is Cancelled */}
                    {incident.status === 'cancelled' && (
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        Sự cố đã được hủy
                      </span>
                    )}

                    {/* Cancel action for open/correcting incidents */}
                    {(incident.status === 'open' || incident.status === 'correcting') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => onUpdateStatus(incident.id, 'cancelled')}
                      >
                        Hủy sự cố
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Comments */}
              <TabsContent value="comments" className="m-0">
                <QcCheckCommentsTab
                  comments={incident.comments || []}
                  onAddComment={(content) => onAddComment(incident.id, content)}
                />
              </TabsContent>

              {/* Tab 3: Logs */}
              <TabsContent value="logs" className="m-0">
                <QcCheckLogsTab logs={incident.logs || []} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal for Image Zoom */}
      {zoomImageUrl && (
        <Dialog open={!!zoomImageUrl} onOpenChange={() => setZoomImageUrl(null)}>
          <DialogContent className="max-w-3xl p-2 bg-black/90 border-0 flex flex-col items-center justify-center">
            <img src={zoomImageUrl} alt="Zoomed Proof" className="max-h-[80vh] w-auto object-contain rounded" />
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-white border-white/20 bg-white/10 hover:bg-white/20"
              onClick={() => setZoomImageUrl(null)}
            >
              Đóng xem ảnh
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Submit Remediation Modal */}
      {isSubmittingFix && (
        <Dialog open={isSubmittingFix} onOpenChange={setIsSubmittingFix}>
          <DialogContent className="max-w-lg p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Báo cáo khắc phục sự cố ({incident.code})
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Mô tả phương án & việc đã xử lý *
                </label>
                <textarea
                  rows={3}
                  value={fixAction}
                  onChange={(e) => setFixAction(e.target.value)}
                  placeholder="Mô tả cụ thể hành động đã làm để khắc phục vi phạm..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Mô tả bằng chứng kết quả
                </label>
                <textarea
                  rows={2}
                  value={fixEvidence}
                  onChange={(e) => setFixEvidence(e.target.value)}
                  placeholder="Mô tả bằng chứng: đã kiểm tra lại, ảnh chụp sau khi dọn..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Đính kèm ảnh minh chứng đã sửa xong
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex h-9 px-3 cursor-pointer items-center justify-center rounded-md border border-border bg-muted/40 hover:bg-muted text-xs font-medium gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Chọn ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFixImage(URL.createObjectURL(file))
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {fixImage && (
                    <div className="h-9 w-12 rounded border overflow-hidden">
                      <img src={fixImage} alt="Fix Proof" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsSubmittingFix(false)}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleSaveFix}>
                Gửi báo cáo khắc phục
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}