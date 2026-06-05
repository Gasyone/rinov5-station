'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge, Panel, InfoField } from '@/components/shared'
import {
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
  QC_ERROR_TYPE_LABELS,
  INSPECTOR_OPTIONS,
} from '@/mocks/qcChecks'
import type { QcExtendedError, QcErrorStatus } from './qcRemediationTypes'
import { formatDate, formatDateTime } from './qcRemediationHelpers'
import { isErrorOverdue } from './qcRemediationTypes'

const STATUS_BUTTONS: Array<{ status: QcErrorStatus; label: string; variant?: 'default' | 'outline' | 'destructive'; disabled?: (error: QcExtendedError) => boolean }> = [
  {
    status: 'correcting',
    label: 'Đang khắc phục',
    variant: 'outline',
    disabled: (e) => e.status === 'correcting' || e.status === 'corrected' || e.status === 'closed',
  },
  {
    status: 'corrected',
    label: 'Đã khắc phục',
    variant: 'outline',
    disabled: (e) => e.status === 'corrected' || e.status === 'closed',
  },
  {
    status: 'closed',
    label: 'Đóng lỗi',
    variant: 'default',
    disabled: (e) => e.status !== 'corrected',
  },
  {
    status: 'not_met',
    label: 'Chưa đáp ứng',
    variant: 'destructive',
    disabled: (e) => e.status === 'closed' || e.status === 'not_met',
  },
]

interface QcRemediationDetailDialogProps {
  error: QcExtendedError | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateError: (errorId: string, status: QcErrorStatus) => void
  onUpdateCorrectiveAction: (errorId: string, correctiveAction: string, correctiveEvidence: string) => void
  currentUserId: string
}

export function QcRemediationDetailDialog({
  error,
  open,
  onOpenChange,
  onUpdateError,
  onUpdateCorrectiveAction,
}: QcRemediationDetailDialogProps) {
  const [remediationText, setRemediationText] = useState('')
  const [remediationEvidence, setRemediationEvidence] = useState('')
  const [actionText, setActionText] = useState('')
  const [actionEvidence, setActionEvidence] = useState('')
  const [activeTab, setActiveTab] = useState('status')

  if (!error) return null

  const isLate = isErrorOverdue(error)
  const assignedInspector = INSPECTOR_OPTIONS.find((i) => i.id === error.assignee)

  const handleSaveRemediation = () => {
    if (remediationText.trim()) {
      onUpdateCorrectiveAction(
        error.id,
        error.requiresCorrectiveAction ? error.correctiveAction : remediationText,
        error.requiresCorrectiveAction ? error.correctiveEvidence : remediationEvidence
      )
      setRemediationText('')
      setRemediationEvidence('')
    }
  }

  const handleSaveAction = () => {
    if (actionText.trim() && error.requiresCorrectiveAction) {
      onUpdateCorrectiveAction(error.id, actionText, actionEvidence)
      setActionText('')
      setActionEvidence('')
    }
  }

  const isNotMet = error.status === 'not_met'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] sm:max-w-3xl overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono rounded text-xs">{error.code}</Badge>
              <span className="text-muted-foreground">—</span>
              <span className="font-medium max-w-[300px] truncate">{error.itemLabel}</span>
            </DialogTitle>
            <div className="flex items-center gap-1.5 ml-auto flex-wrap">
              <StatusBadge
                status={isLate ? 'qc_error_overdue' : error.status === 'not_met' ? 'error' : `qc_error_${error.status}`}
                label={isLate ? 'Quá hạn' : QC_ERROR_STATUS_LABELS[error.status]}
              />
              <Badge className={
                error.severity === 'critical'
                  ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
                  : error.severity === 'high'
                    ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400'
                    : error.severity === 'medium'
                      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
              }>
                {QC_ERROR_SEVERITY_LABELS[error.severity]}
              </Badge>
              <Badge variant="outline" className="rounded text-[10px]">
                {QC_ERROR_TYPE_LABELS[error.errorType]}
              </Badge>
              {error.recurrenceCount > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  Tái phạm: {error.recurrenceCount}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{error.description}</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Trạng thái & Khắc phục</TabsTrigger>
            <TabsTrigger value="action">Hành động khắc phục</TabsTrigger>
            <TabsTrigger value="evidence">Bằng chứng</TabsTrigger>
            <TabsTrigger value="info">Chi tiết</TabsTrigger>
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto px-1 py-4 space-y-4">
            {/* Tab: Trạng thái & Khắc phục */}
            <TabsContent value="status" className="m-0 p-0">
              <div className="space-y-4">
                {/* Status badge info */}
                <Panel title="Trạng thái hiện tại">
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={isLate ? 'qc_error_overdue' : error.status === 'not_met' ? 'error' : `qc_error_${error.status}`}
                      label={isLate ? 'Quá hạn' : QC_ERROR_STATUS_LABELS[error.status]}
                    />
                    {isNotMet && (
                      <span className="text-xs text-destructive font-medium">
                        ⚠ Lỗi chưa đáp ứng tiêu chuẩn — cần cập nhật lại khắc phục
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground space-y-1">
                    <p>Sự kiện: <span className="font-medium text-foreground">{error.eventCode}</span> {error.eventName ? `(${error.eventName})` : ''}</p>
                    <p>Ghi nhận: {formatDateTime(error.createdAt)}</p>
                    {error.completionDate && <p>Hoàn thành khắc phục: {formatDate(error.completionDate)}</p>}
                    {error.closedAt && <p>Đóng: {formatDateTime(error.closedAt)}</p>}
                  </div>
                </Panel>

                {/* Status actions */}
                <Panel title="Cập nhật trạng thái">
                  <div className="flex flex-wrap gap-2">
                    {STATUS_BUTTONS.map((btn) => (
                      <Button
                        key={btn.status}
                        size="sm"
                        variant={btn.variant}
                        disabled={btn.disabled ? btn.disabled(error) : false}
                        onClick={() => onUpdateError(error.id, btn.status)}
                      >
                        {btn.label}
                      </Button>
                    ))}
                  </div>
                  {isNotMet && (
                    <div className="mt-3 rounded-md border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-sm font-medium text-destructive">Trạng thái: Chưa đáp ứng</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Vui lòng cập nhật lại báo cáo khắc phục và hành động khắc phục, sau đó chọn {'"'}Đã khắc phục{'"'} để gửi lại đánh giá.
                      </p>
                    </div>
                  )}
                </Panel>

                {/* Khắc phục section */}
                <Panel title="Báo cáo khắc phục">
                  {error.correctiveEvidence && !error.requiresCorrectiveAction && (
                    <div className="mb-3">
                      <InfoField label="Kết quả khắc phục" value={error.correctiveEvidence || error.correctiveAction} />
                    </div>
                  )}
                  {(!error.correctiveAction || isNotMet) && (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Kết quả khắc phục</label>
                        <Textarea
                          rows={3}
                          value={remediationText}
                          onChange={(e) => setRemediationText(e.target.value)}
                          placeholder="Mô tả kết quả đã khắc phục lỗi..."
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={handleSaveRemediation}
                        disabled={!remediationText.trim()}
                      >
                        {isNotMet ? 'Cập nhật lại khắc phục' : 'Lưu kết quả khắc phục'}
                      </Button>
                    </div>
                  )}
                  {error.correctiveAction && !isNotMet && (
                    <p className="text-sm">Đã hoàn thành khắc phục.</p>
                  )}
                </Panel>
              </div>
            </TabsContent>

            {/* Tab: Hành động khắc phục */}
            <TabsContent value="action" className="m-0 p-0">
              <div className="space-y-4">
                {error.requiresCorrectiveAction ? (
                  <>
                    {error.correctiveAction && (
                      <Panel title="Hành động khắc phục hiện tại">
                        <p className="text-sm">{error.correctiveAction}</p>
                        {error.correctiveEvidence && (
                          <div className="mt-3">
                            <InfoField label="Bằng chứng hành động" value={error.correctiveEvidence} />
                          </div>
                        )}
                      </Panel>
                    )}
                    {(!error.correctiveAction || isNotMet) && (
                      <Panel title={isNotMet ? "Cập nhật hành động khắc phục" : "Thêm hành động khắc phục"}>
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1.5 block text-sm font-medium">Hành động ngăn ngừa tái phạm</label>
                            <Textarea
                              rows={3}
                              value={actionText}
                              onChange={(e) => setActionText(e.target.value)}
                              placeholder="Mô tả hành động đã thực hiện để ngăn ngừa lỗi lặp lại..."
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium">Bằng chứng hành động</label>
                            <Textarea
                              rows={2}
                              value={actionEvidence}
                              onChange={(e) => setActionEvidence(e.target.value)}
                              placeholder="Mô tả bằng chứng: biên bản, ảnh chụp, nhật ký..."
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={handleSaveAction}
                            disabled={!actionText.trim()}
                          >
                            {isNotMet ? 'Cập nhật lại hành động' : 'Lưu hành động khắc phục'}
                          </Button>
                        </div>
                      </Panel>
                    )}
                  </>
                ) : (
                  <Panel title="Hành động khắc phục">
                    <p className="text-sm text-muted-foreground">
                      Lỗi này <span className="font-medium text-foreground">không yêu cầu</span> hành động khắc phục ngăn ngừa.
                      Chỉ cần khắc phục lỗi là đủ.
                    </p>
                  </Panel>
                )}
              </div>
            </TabsContent>

            {/* Tab: Bằng chứng */}
            <TabsContent value="evidence" className="m-0 p-0">
              <div className="space-y-4">
                <Panel title="Bằng chứng lỗi gốc">
                  <InfoField label="Mô tả bằng chứng" value={error.evidence} />
                  {error.evidenceLink && (
                    <InfoField label="Link đính kèm" value={error.evidenceLink} />
                  )}
                  {error.evidenceImage && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Ảnh đính kèm</p>
                      <div className="h-32 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        [Placeholder: Ảnh bằng chứng]
                      </div>
                    </div>
                  )}
                </Panel>

                {error.requiresCorrectiveAction && error.correctiveAction && (
                  <Panel title="Bằng chứng hành động khắc phục">
                    <InfoField label="Hành động" value={error.correctiveAction} />
                    {error.correctiveEvidence && (
                      <InfoField label="Bằng chứng" value={error.correctiveEvidence} />
                    )}
                    {error.correctiveLink && (
                      <InfoField label="Link đính kèm" value={error.correctiveLink} />
                    )}
                    {error.correctiveImage && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Ảnh đính kèm</p>
                        <div className="h-32 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          [Placeholder: Ảnh hành động khắc phục]
                        </div>
                      </div>
                    )}
                  </Panel>
                )}
              </div>
            </TabsContent>

            {/* Tab: Chi tiết */}
            <TabsContent value="info" className="m-0 p-0">
              <div className="space-y-4">
                <Panel title="Thông tin lỗi">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoField label="Mã lỗi" value={error.code} />
                    <InfoField label="Tên lỗi" value={error.itemLabel} />
                    <InfoField label="Mã sự kiện QC" value={error.eventCode} />
                    <InfoField label="Tên sự kiện" value={error.eventName || '—'} />
                    <InfoField label="Chi nhánh" value={error.branch} />
                    <InfoField label="Loại lỗi" value={QC_ERROR_TYPE_LABELS[error.errorType]} />
                    <InfoField label="Người phát hành" value={error.issuedBy} />
                    <InfoField label="Người xử lý" value={assignedInspector?.name || 'Chưa gán'} />
                    <InfoField label="Ngày ghi nhận" value={formatDateTime(error.createdAt)} />
                    {error.completionDate && <InfoField label="Ngày khắc phục" value={formatDate(error.completionDate)} />}
                    {error.closedAt && <InfoField label="Ngày đóng" value={formatDateTime(error.closedAt)} />}
                    {error.deadline && <InfoField label="Hạn xử lý" value={formatDate(error.deadline)} />}
                  </div>
                </Panel>

                <Panel title="Yêu cầu khắc phục">
                  <div className="text-sm space-y-1">
                    <p>Yêu cầu hành động khắc phục: <span className={error.requiresCorrectiveAction ? 'text-destructive font-medium' : 'text-emerald-600 font-medium'}>{error.requiresCorrectiveAction ? 'Có' : 'Không'}</span></p>
                    <p>Số lần tái phạm: <span className="font-medium">{error.recurrenceCount}</span></p>
                    <p>Mức độ: <span className="font-medium">{QC_ERROR_SEVERITY_LABELS[error.severity]}</span></p>
                  </div>
                </Panel>

                {error.notes && (
                  <Panel title="Ghi chú">
                    <p className="text-sm">{error.notes}</p>
                  </Panel>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
