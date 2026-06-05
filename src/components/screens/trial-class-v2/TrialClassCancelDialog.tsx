'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { InlineSelect } from '@/components/controls'
import { ConfirmDialog, FieldLabel } from '@/components/shared'
import type { TrialClass, TrialClassStatus } from '@/mocks/trialClasses'
import { CANCEL_REASONS } from './trialClassConstants'

interface TrialClassCancelDialogProps {
  open: boolean
  trial: TrialClass
  onOpenChange: (open: boolean) => void
  onUpdateTrial: (trialId: string, updater: (trial: TrialClass) => TrialClass) => void
}

export function TrialClassCancelDialog({
  open,
  trial,
  onOpenChange,
  onUpdateTrial,
}: TrialClassCancelDialogProps) {
  const [cancelReason, setCancelReason] = useState('')
  const [cancelNotes, setCancelNotes] = useState('')

  const resetForm = () => {
    setCancelReason('')
    setCancelNotes('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleConfirm = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    onUpdateTrial(trial.id, (current) => ({
      ...current,
      status: 'cancelled' as TrialClassStatus,
      cancelReason,
      notes: cancelNotes || current.notes,
      auditLog: [
        ...current.auditLog,
        {
          timestamp: now,
          author: 'Người dùng hiện tại',
          action: 'Hủy lịch',
          detail: cancelReason,
        },
      ],
    }))
    resetForm()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Hủy lịch học thử?"
      description="Booking này sẽ chuyển sang trạng thái Đã hủy."
      confirmLabel="Xác nhận hủy"
      cancelLabel="Đóng"
      confirmDisabled={!cancelReason}
      variant="destructive"
      onConfirm={handleConfirm}
    >
      <FieldLabel label="Lý do hủy">
        <InlineSelect
          value={cancelReason}
          ariaLabel="Lý do hủy"
          options={[
            { value: '', label: 'Chọn lý do' },
            ...CANCEL_REASONS.map((reason) => ({ value: reason, label: reason })),
          ]}
          onValueChange={setCancelReason}
          className="h-9 border-solid text-sm shadow-xs"
        />
      </FieldLabel>
      <FieldLabel label="Ghi chú (tùy chọn)">
        <Textarea
          rows={2}
          value={cancelNotes}
          onChange={(event) => setCancelNotes(event.target.value)}
          placeholder="Chi tiết thêm..."
        />
      </FieldLabel>
    </ConfirmDialog>
  )
}
