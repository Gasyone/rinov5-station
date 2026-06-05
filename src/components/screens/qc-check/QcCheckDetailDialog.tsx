'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  CheckCheck,
  ShieldCheck,
  Calendar,
  MapPin,
  MessageSquare,
  History,
  Send,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react'
import { StatusBadge, Panel, InfoField, ConfirmDialog, EmptyState } from '@/components/shared'
import {
  QC_CHECK_STATUS_LABELS,
  QC_CHECK_STATUS_ORDER,
  QC_ERROR_TYPE_LABELS,
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
  type QcCheckEvent,
  type QcCheckStatus,
  type QcErrorStatus,
  type QcError,
  type Inspector,
} from '@/mocks/qcChecks'
import {
  formatDate,
  formatDateTime,
  formatShortDate,
  getQcTypeLabel,
  getQcStatusLabel,
  getQcStatusSemantic,
  getInitials,
  getCalculatedStatus,
} from './qcCheckHelpers'
import { QcCheckErrorDialog, type QcErrorForm } from './QcCheckErrorDialog'
import { isErrorOverdue, getErrorBadgeSemantic } from './qcCheckTypes'

const QC_STATUS_STEP_MAP: Record<QcCheckStatus, number> = {
  draft: 0,
  published: 1,
  correcting: 2,
  closed: 3,
  completed_closed: 4,
  cancelled: 5,
  not_met: 6,
  completed: 7,
}

interface QcCheckDetailDialogProps {
  event: QcCheckEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddError: (eventId: string, form: QcErrorForm) => void
  onUpdateError: (eventId: string, errorId: string, status: QcErrorStatus) => void
  onPublish: (eventId: string) => void
  onCloseEvent: (eventId: string) => void
  onCancelEvent: (eventId: string) => void
  onNotMet: (eventId: string) => void
  currentUserId: string
  onEditError: (eventId: string, errorId: string, form: QcErrorForm) => void
  onAddComment: (eventId: string, commentContent: string) => void
  onDeleteError?: (eventId: string, errorId: string) => void
}

export function QcCheckDetailDialog({
  event,
  open,
  onOpenChange,
  onAddError,
  onUpdateError,
  onPublish,
  onCloseEvent,
  onCancelEvent,
  currentUserId,
  onEditError,
  onAddComment,
  onDeleteError,
}: QcCheckDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('errors')
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)

  // Edit error states
  const [editingError, setEditingError] = useState<QcError | null>(null)
  
  // Comment state
  const [commentText, setCommentText] = useState('')

  // Lightbox state for zoom images
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingErrorId, setDeletingErrorId] = useState('')

  if (!event) return null

  const hasErrors = event.errors.length > 0
  const correctedCount = event.errors.filter(
    (e) => e.status === 'corrected' || e.status === 'closed'
  ).length
  const openCount = event.errors.filter((e) => e.status === 'open').length
  const overdueCount = event.errors.filter((e) => isErrorOverdue(e)).length
  const correctiveActionDone = event.errors.filter((e) => e.correctiveAction).length

  const handleSendComment = () => {
    if (!commentText.trim()) return
    onAddComment(event.id, commentText)
    setCommentText('')
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="grid h-[85vh] max-h-[820px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-6xl" onOpenAutoFocus={(e) => e.preventDefault()}>
          {/* Header */}
          <DialogHeader className="shrink-0 px-6 pb-3 pt-5 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <DialogTitle className="flex flex-wrap items-center gap-2 text-lg">
                  {event.name || <span className="italic text-muted-foreground">Đợt kiểm tra</span>}
                  {(() => {
                    const calculatedStatus = getCalculatedStatus(event)
                    return <StatusBadge status={getQcStatusSemantic(calculatedStatus)} label={getQcStatusLabel(calculatedStatus)} />
                  })()}
                  <Badge variant="outline" className="rounded-md font-mono text-xs">
                    {event.code}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.status !== 'draft' ? `${formatShortDate(event.date)} ` : ''}{getQcTypeLabel(event.type)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.branch}
                  </span>
                </DialogDescription>
              </div>
              <div className="shrink-0 pr-8">
                <div className="flex items-center gap-2">
                  {event.status === 'draft' && (
                    <Button size="sm" onClick={() => onPublish(event.id)}>
                      <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                      Phát hành
                    </Button>
                  )}
                  {['publish', 'correcting'].includes(event.status) && (
                    <Button size="sm" variant="outline" onClick={() => onCloseEvent(event.id)}>
                      Đóng đợt QC
                    </Button>
                  )}
                  {event.status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => setCancelConfirmOpen(true)}>
                      Hủy
                    </Button>
                  )}
                  {/* No overall not_met button here */}
                </div>
              </div>
            </div>
            {/* Inspectors */}
            <div className="mt-2 flex items-center gap-2">
              {event.inspectors.map((ins: Inspector) => (
                <div key={ins.id} className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {getInitials(ins.name)}
                  </div>
                  <span className="text-xs">{ins.name}</span>
                  {ins.role && <span className="text-xs text-muted-foreground">— {ins.role}</span>}
                </div>
              ))}
            </div>
          </DialogHeader>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-col">
            <div className="flex items-center border-b px-6 bg-transparent">
              <TabsList className="mb-[-1px] border-0 bg-transparent p-0 gap-6">
                <TabsTrigger
                  value="errors"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-medium border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Lỗi ({event.errors.length})
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-medium border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Trao đổi ({event.comments?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-medium border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Nhật ký ({event.logs?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none px-1 py-3 text-sm font-medium border-b-2 border-transparent bg-transparent text-muted-foreground shadow-none"
                >
                  Thông tin đợt
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {/* Errors Tab (Full Width) */}
              <TabsContent value="errors" className="m-0 h-full p-0 overflow-y-auto">
                <div className="flex min-h-0 flex-col px-6 pt-4 pb-6">
                  <div className="mb-4 flex items-center justify-between gap-4 border-b pb-3">
                    {hasErrors && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm items-center">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Chưa xử lý (Mở): <span className="font-semibold text-red-600">{openCount}</span>
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          Đang sửa: <span className="font-semibold text-amber-600">{event.errors.filter(e => e.status === 'correcting').length}</span>
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          Đã khắc phục: <span className="font-semibold text-emerald-600">{event.errors.filter(e => e.status === 'corrected').length}</span>
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          Đã đóng: <span className="font-semibold text-slate-600">{event.errors.filter(e => e.status === 'closed').length}</span>
                        </span>
                        {overdueCount > 0 && (
                          <span className="text-muted-foreground flex items-center gap-1">
                            Trễ: <span className="font-semibold text-violet-600">{overdueCount}</span>
                          </span>
                        )}
                        {event.publishedAt && (
                          <span className="text-muted-foreground border-l pl-4 text-xs font-medium">
                            Phát hành lúc: {formatDateTime(event.publishedAt)}
                          </span>
                        )}
                      </div>
                    )}
                    {event.status === 'draft' && (
                      <Button size="sm" onClick={() => setErrorDialogOpen(true)}>
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Thêm lỗi mới
                      </Button>
                    )}
                  </div>

                  {!hasErrors ? (
                    <EmptyState
                      title="Chưa có lỗi nào"
                      description="Chưa có lỗi nào được ghi nhận cho đợt kiểm tra này."
                    />
                  ) : (
                    <div className="space-y-4">
                      {event.errors.map((error) => {
                        const isOverdue = isErrorOverdue(error)
                        return (
                          <div
                            key={error.id}
                            className={`rounded-lg border p-4 transition-colors ${
                              isOverdue
                                ? 'border-violet-300 bg-violet-50/10 dark:border-violet-700/50 dark:bg-violet-950/10'
                                : error.status === 'not_met'
                                  ? 'border-red-300 bg-red-50/10 dark:border-red-900/30'
                                  : 'bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                            }`}
                          >
                            {/* Header row */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs text-muted-foreground font-semibold">{error.code}</span>
                                  <span className="font-semibold text-sm truncate">{error.itemLabel}</span>
                                  <Badge variant="outline" className="rounded text-[10px]">
                                    {QC_ERROR_TYPE_LABELS[error.errorType as keyof typeof QC_ERROR_TYPE_LABELS] ?? error.errorType}
                                  </Badge>
                                  <Badge className={isOverdue
                                    ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400'
                                    : error.severity === 'critical'
                                      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
                                      : error.severity === 'high'
                                        ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400'
                                        : error.severity === 'medium'
                                          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                  }>
                                    {isOverdue ? 'Trễ' : QC_ERROR_SEVERITY_LABELS[error.severity]}
                                  </Badge>
                                  <StatusBadge
                                    status={getErrorBadgeSemantic(error)}
                                    label={QC_ERROR_STATUS_LABELS[error.status]}
                                  />
                                </div>
                              </div>
                              
                              {/* Recurrence & Deadline */}
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                {error.recurrenceCount > 0 && (
                                  <Badge variant="destructive" className="shrink-0 text-xs">
                                    Tái phạm: {error.recurrenceCount}
                                  </Badge>
                                )}
                                {error.deadline && (
                                  <span className={`text-[11px] font-medium rounded px-1.5 py-0.5 border ${
                                    isOverdue
                                      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/30 dark:bg-red-950/20 dark:text-red-400'
                                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                  }`}>
                                    Hạn xử lý: {formatShortDate(error.deadline.split('T')[0])} {error.deadline.includes('T') ? error.deadline.split('T')[1].substring(0, 5) : ''}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Vấn đề & Bằng chứng và Thông tin khắc phục */}
                            <div className="grid gap-6 sm:grid-cols-2 mt-2 text-sm">
                              {/* Left: Vấn đề & Bằng chứng */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-muted-foreground block">Vấn đề & Bằng chứng lỗi</span>
                                  {error.createdAt && (
                                    <span className="text-[11px] text-muted-foreground">
                                      Phát hiện: {formatDateTime(error.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-foreground">{error.description}</p>
                                <p className="text-xs text-foreground bg-slate-50 dark:bg-slate-900 p-2.5 rounded-md italic">
                                  &ldquo;{error.evidence}&rdquo;
                                </p>
                                
                                <div className="flex flex-wrap gap-2 pt-0.5">
                                  {error.evidenceLink && (
                                    <a
                                      href={error.evidenceLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline border rounded px-1.5 py-0.5 bg-background"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Tệp đính kèm
                                    </a>
                                  )}
                                  {error.evidenceImage && (
                                    <button
                                      type="button"
                                      onClick={() => setZoomImageUrl(error.evidenceImage || null)}
                                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-primary hover:underline border rounded px-1.5 py-0.5 bg-background dark:text-slate-300"
                                    >
                                      <ImageIcon className="h-3 w-3" />
                                      Ảnh bằng chứng
                                    </button>
                                  )}
                                </div>

                                {error.evidenceImage && (
                                  <div className="relative group w-20 h-16 mt-1 rounded border overflow-hidden cursor-zoom-in" onClick={() => setZoomImageUrl(error.evidenceImage || null)}>
                                    <img src={error.evidenceImage} alt="Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ImageIcon className="h-4 w-4 text-white" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right: Thông tin khắc phục */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-muted-foreground block">Thông tin khắc phục</span>
                                  {error.completionDate && (
                                    <span className="text-[11px] text-muted-foreground">
                                      Khắc phục lúc: {formatDateTime(error.completionDate)}
                                    </span>
                                  )}
                                </div>
                                {error.requiresCorrectiveAction ? (
                                  <div className="space-y-2">
                                    {error.correctiveAction ? (
                                      <InfoField label="Phương án" value={error.correctiveAction} valueClassName="text-xs" />
                                    ) : (
                                      <p className="text-xs italic text-muted-foreground">Chưa cập nhật phương án.</p>
                                    )}
                                    
                                    {error.correctiveEvidence && (
                                      <div className="mt-1">
                                        <span className="text-[11px] font-medium text-muted-foreground block mb-0.5">Bằng chứng khắc phục:</span>
                                        <p className="text-xs text-foreground bg-emerald-50/20 dark:bg-emerald-950/10 p-2 rounded border border-emerald-100 dark:border-emerald-900/30 italic">
                                          &ldquo;{error.correctiveEvidence}&rdquo;
                                        </p>
                                      </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {error.correctiveLink && (
                                        <a
                                          href={error.correctiveLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline border rounded px-1.5 py-0.5 bg-background dark:text-emerald-400"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                          Link báo cáo
                                        </a>
                                      )}
                                      {error.correctiveImage && (
                                        <button
                                          type="button"
                                          onClick={() => setZoomImageUrl(error.correctiveImage || null)}
                                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline border border-emerald-200 rounded px-1.5 py-0.5 bg-background dark:text-emerald-300"
                                        >
                                          <ImageIcon className="h-3 w-3" />
                                          Ảnh khắc phục
                                        </button>
                                      )}
                                    </div>

                                    {error.correctiveImage && (
                                      <div className="relative group w-20 h-16 mt-1 rounded border overflow-hidden cursor-zoom-in" onClick={() => setZoomImageUrl(error.correctiveImage || null)}>
                                        <img src={error.correctiveImage} alt="Correction proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <ImageIcon className="h-4 w-4 text-white" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs italic text-muted-foreground">Không phát sinh hành động khắc phục.</p>
                                )}
                              </div>
                            </div>

                            {/* Metadata Info Row */}
                            <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 rounded">
                              <InfoField label="Người phát hiện" value={event.inspectors.find(i => i.id === error.issuedBy)?.name || '—'} />
                              <InfoField label="Người phụ trách" value={error.assignee || '—'} />
                              {error.notes && <InfoField label="Ghi chú" value={error.notes} />}
                              {isOverdue && <span className="ml-auto text-red-600 font-semibold flex items-center gap-1 text-[11px]">⚠ Quá hạn khắc phục</span>}
                              {!isOverdue && error.closedAt && (
                                <span className="ml-auto text-[11px]">Đóng lỗi lúc: {formatDateTime(error.closedAt)}</span>
                              )}
                            </div>

                            {/* Action Buttons inside Card */}
                            {((error.status === 'corrected' && error.issuedBy === currentUserId) ||
                              error.status === 'not_met' ||
                              event.status === 'draft') && (
                              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                                {event.status === 'draft' ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-primary hover:text-primary-foreground border-primary/50 hover:bg-primary gap-1"
                                      onClick={() => setEditingError(error)}
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                      Chỉnh sửa
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="gap-1"
                                      onClick={() => {
                                        setDeletingErrorId(error.id)
                                        setDeleteConfirmOpen(true)
                                      }}
                                    >
                                      <AlertTriangle className="h-3.5 w-3.5" />
                                      Xóa lỗi
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {error.status === 'corrected' && error.issuedBy === currentUserId && (
                                      <>
                                        <Button
                                          size="sm"
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                          onClick={() => onUpdateError(event.id, error.id, 'closed')}
                                        >
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                          Đạt (Đóng lỗi)
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          className="gap-1"
                                          onClick={() => onUpdateError(event.id, error.id, 'not_met')}
                                        >
                                          <AlertTriangle className="h-3.5 w-3.5" />
                                          Chưa đáp ứng
                                        </Button>
                                      </>
                                    )}
                                    {error.status === 'not_met' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-primary hover:text-primary-foreground border-primary/50 hover:bg-primary gap-1"
                                        onClick={() => setEditingError(error)}
                                      >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Chỉnh sửa & Gửi lại
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="m-0 h-full p-0 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {!event.comments || event.comments.length === 0 ? (
                    <EmptyState
                      title="Chưa có trao đổi nào"
                      description="Hãy bắt đầu cuộc trao đổi thảo luận với những người liên quan ở đợt QC này."
                       icon={<MessageSquare className="h-5 w-5" />}
                    />
                  ) : (
                    <div className="space-y-4">
                      {event.comments.map((comm) => (
                        <div key={comm.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card max-w-3xl">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {getInitials(comm.userName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="font-semibold text-sm">{comm.userName}</span>
                              {comm.userRole && (
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                  {comm.userRole}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground">
                                {formatDateTime(comm.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-foreground whitespace-pre-line">{comm.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex gap-3 items-end">
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Nhập nội dung trao đổi, phản hồi của bạn..."
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendComment()
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleSendComment} className="gap-1.5 h-10 shrink-0">
                    <Send className="h-4 w-4" />
                    Gửi
                  </Button>
                </div>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="m-0 h-full p-0 overflow-y-auto">
                <div className="px-6 py-5">
                  {!event.logs || event.logs.length === 0 ? (
                    <EmptyState
                      title="Chưa có lịch sử"
                      description="Chưa ghi nhận hoạt động nào cho cuộc kiểm tra."
                       icon={<History className="h-5 w-5" />}
                    />
                  ) : (
                    <div className="relative border-l pl-4 border-slate-200 dark:border-slate-800 space-y-6 ml-2 pt-2">
                      {event.logs.map((log) => {
                        let icon = <History className="h-3 w-3" />
                        let bgClass = 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'

                        if (log.action.includes('Tạo')) {
                          icon = <Plus className="h-3.5 w-3.5" />
                          bgClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                        } else if (log.action.includes('Phát hành')) {
                          icon = <ShieldCheck className="h-3.5 w-3.5" />
                          bgClass = 'bg-primary/20 text-primary dark:bg-primary/10 dark:text-primary-foreground'
                        } else if (log.action.includes('lỗi') || log.action.includes('Ghi nhận')) {
                          icon = <AlertTriangle className="h-3.5 w-3.5" />
                          bgClass = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
                        } else if (log.action.includes('khắc phục') || log.action.includes('Chỉnh sửa')) {
                          icon = <Play className="h-3.5 w-3.5" />
                          bgClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        } else if (log.action.includes('Đạt') || log.action.includes('Đóng')) {
                          icon = <CheckCheck className="h-3.5 w-3.5" />
                          bgClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        }

                        return (
                          <div key={log.id} className="relative">
                            {/* Dot icon */}
                            <div className={`absolute -left-7 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border bg-background ${bgClass}`}>
                              {icon}
                            </div>
                            
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-baseline gap-x-2">
                                <span className="font-semibold text-sm text-foreground">{log.action}</span>
                                <span className="text-xs text-muted-foreground">— thực hiện bởi</span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.userName}</span>
                              </div>
                              {log.details && (
                                <p className="mt-1 text-xs text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded border border-dashed border-slate-200/50 max-w-2xl">
                                  {log.details}
                                </p>
                              )}
                              <span className="text-[10px] text-muted-foreground block mt-1 font-mono">
                                {formatDateTime(log.createdAt)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Information Tab */}
              <TabsContent value="info" className="m-0 h-full p-0 overflow-y-auto">
                <div className="px-6 py-4 space-y-4">
                  <Panel title="Thông tin đợt kiểm tra">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoField label="Mã QC" value={event.code} />
                      <InfoField label="Tên cuộc kiểm tra" value={event.name || '—'} />
                      <InfoField label="Loại" value={getQcTypeLabel(event.type)} />
                      {event.status !== 'draft' && (
                        <InfoField label="Ngày kiểm tra" value={formatDate(event.date)} />
                      )}
                      <InfoField label="Chi nhánh" value={event.branch} />
                      <InfoField label="Người kiểm tra" value={event.inspectors.map((i: Inspector) => i.name).join(', ')} />
                      <InfoField
                        label="Khu vực"
                        value={event.areas.length > 0 ? event.areas.join(', ') : '—'}
                      />
                      <InfoField label="Tạo lúc" value={formatDateTime(event.createdAt)} />
                      {event.publishedAt && (
                        <InfoField label="Phát hành lúc" value={formatDateTime(event.publishedAt)} />
                      )}
                      {event.completedAt && (
                        <InfoField label="Hoàn thành lúc" value={formatDateTime(event.completedAt)} />
                      )}
                    </div>
                  </Panel>

                  <Panel title="Lộ trình">
                    <div className="flex flex-wrap gap-2">
                      {QC_CHECK_STATUS_ORDER.map((step) => {
                        const stepNum = QC_STATUS_STEP_MAP[step]
                        const currentStep = QC_STATUS_STEP_MAP[event.status]
                        const isPast = stepNum <= currentStep && event.status !== 'cancelled'
                        const isCurrent = step === event.status
                        return (
                          <div
                            key={step}
                            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                              isCurrent
                                ? 'bg-primary text-primary-foreground font-medium'
                                : isPast
                                  ? 'bg-muted text-foreground'
                                  : 'bg-muted/30 text-muted-foreground'
                            }`}
                          >
                            {isPast && !isCurrent && <CheckCheck className="h-3 w-3" />}
                            {QC_CHECK_STATUS_LABELS[step]}
                          </div>
                        )
                      })}
                    </div>
                  </Panel>

                  {event.notes && (
                    <Panel title="Ghi chú">
                      <p className="text-sm">{event.notes}</p>
                    </Panel>
                  )}

                  <Panel title="Thống kê lỗi">
                    <div className="grid gap-3 sm:grid-cols-5">
                      <InfoField label="Tổng lỗi" value={String(event.errors.length)} />
                      <InfoField label="Mở" value={String(openCount)} />
                      <InfoField label="Đang xử lý" value={String(event.errors.filter((e) => e.status === 'correcting').length)} />
                      <InfoField label="Đã xử lý" value={String(correctedCount)} />
                      <InfoField label="Hành động HK" value={String(correctiveActionDone)} />
                    </div>
                  </Panel>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Error Dialog / Correction Dialog */}
      <QcCheckErrorDialog
        open={!!editingError}
        onOpenChange={(open) => { if (!open) setEditingError(null) }}
        initialData={editingError}
        mode="edit"
        onSubmit={(form) => {
          if (editingError) {
            onEditError(event.id, editingError.id, form)
            setEditingError(null)
          }
        }}
      />

      {/* Create Error Dialog */}
      <QcCheckErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        onSubmit={(form) => {
          onAddError(event.id, form)
          setErrorDialogOpen(false)
        }}
      />

      {/* Image Lightbox Viewer Dialog */}
      <Dialog open={!!zoomImageUrl} onOpenChange={(open) => { if (!open) setZoomImageUrl(null) }}>
        <DialogContent className="max-w-4xl p-1 bg-black overflow-hidden flex items-center justify-center border-none h-fit">
          {zoomImageUrl && (
            <div className="relative group max-h-[85vh] w-full flex items-center justify-center">
              <img src={zoomImageUrl} alt="Zoomed proof" className="max-h-[80vh] object-contain max-w-full rounded" />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-3 rounded-md text-xs backdrop-blur-xs max-w-md truncate">
                <p className="font-semibold mb-0.5">Bằng chứng hình ảnh đính kèm</p>
                <p className="opacity-80 truncate">{zoomImageUrl}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title="Hủy đợt QC"
        description={`Bạn có chắc muốn hủy đợt kiểm tra ${event.code}? Hành động này không thể hoàn tác.`}
        confirmLabel="Xác nhận hủy"
        variant="destructive"
        onConfirm={() => {
          onCancelEvent(event.id)
          setCancelConfirmOpen(false)
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa ghi nhận lỗi"
        description="Bạn có chắc chắn muốn xóa ghi nhận lỗi này không? Hành động này không thể khôi phục."
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={() => {
          if (onDeleteError) {
            onDeleteError(event.id, deletingErrorId)
          }
          setDeleteConfirmOpen(false)
        }}
      />
    </>
  )
}