import type { QcCheckType, QcCheckStatus, QcErrorStatus, QcCheckEvent } from '@/mocks/qcChecks'
import { QC_CHECK_STATUS_LABELS } from '@/mocks/qcChecks'

export const BRANCH_OPTIONS = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]

/**
 * Calculates the dynamic/virtual status of a QC Check event based on its core status and errors.
 * - Stored core statuses: 'draft', 'published', 'completed', 'cancelled'
 * - Calculated virtual statuses:
 *   - If status is 'draft' -> 'draft'
 *   - If status is 'cancelled' -> 'cancelled'
 *   - If status is 'completed' or 'closed' -> 'closed' (Đã đóng)
 *   - If status is 'published':
 *     - If any error is in 'not_met' (Chưa đáp ứng) status -> 'not_met' (Chưa đáp ứng)
 *     - If all errors are 'closed' -> 'closed' (Đã đóng)
 *     - If all errors are 'corrected' or 'closed' -> 'completed_closed' (Hoàn thành đóng lỗi)
 *     - If any error has a correction report or is being corrected -> 'correcting' (Đang khắc phục)
 *     - Else -> 'published' (Đã phát hành)
 */
export function getCalculatedStatus(event: QcCheckEvent): QcCheckStatus {
  if (event.status === 'draft') return 'draft'
  if (event.status === 'cancelled') return 'cancelled'
  if (event.status === 'completed' || event.status === 'closed') return 'closed'

  if (event.status === 'published') {
    const errors = event.errors || []
    if (errors.length === 0) return 'published'

    // 1. If at least 1 error is "Chưa đáp ứng" (not_met)
    if (errors.some((err) => err.status === 'not_met')) {
      return 'not_met'
    }

    // 2. If all errors are closed/approved
    if (errors.every((err) => err.status === 'closed')) {
      return 'closed'
    }

    // 3. If 100% of errors are corrected or closed
    if (errors.every((err) => err.status === 'corrected' || err.status === 'closed')) {
      return 'completed_closed'
    }

    // 4. If any error is being corrected or corrected (has correction report)
    if (
      errors.some(
        (err) =>
          err.status === 'correcting' ||
          err.status === 'corrected' ||
          err.correctiveEvidence ||
          err.correctiveAction
      )
    ) {
      return 'correcting'
    }

    return 'published'
  }

  return event.status
}

export function getQcTypeLabel(type: QcCheckType): string {
  const labels: Record<QcCheckType, string> = {
    daily: 'Hàng ngày',
    patrol: 'Đột xuất',
    monthly: 'Hàng tháng',
  }
  return labels[type]
}

export function getQcStatusLabel(status: QcCheckStatus): string {
  return QC_CHECK_STATUS_LABELS[status] ?? status
}

export function getQcStatusSemantic(status: QcCheckStatus): string {
  const map: Record<QcCheckStatus, string> = {
    draft: 'qc_draft',
    published: 'qc_published',
    correcting: 'qc_correcting',
    closed: 'qc_closed',
    cancelled: 'qc_cancelled',
    completed_closed: 'qc_completed_closed',
    not_met: 'qc_not_met',
    completed: 'qc_closed',
  }
  return map[status]
}

export function getErrorStatusSemantic(status: QcErrorStatus): string {
  const map: Record<QcErrorStatus, string> = {
    open: 'qc_error_open',
    correcting: 'qc_error_correcting',
    corrected: 'qc_error_corrected',
    closed: 'qc_error_closed',
    cancelled: 'qc_error_cancelled',
    not_met: 'qc_not_met',
  }
  return map[status]
}

export function getQcErrorStatusLabel(status: QcErrorStatus): string {
  const map: Record<QcErrorStatus, string> = {
    open: 'Mở',
    correcting: 'Đang khắc phục',
    corrected: 'Đã khắc phục',
    closed: 'Đã đóng',
    cancelled: 'Đã hủy',
    not_met: 'Chưa đáp ứng',
  }
  return map[status]
}

export function getQcErrorStatusSemantic(status: QcErrorStatus): string {
  const map: Record<QcErrorStatus, string> = {
    open: 'qc_error_open',
    correcting: 'qc_error_correcting',
    corrected: 'qc_error_corrected',
    closed: 'qc_error_closed',
    cancelled: 'qc_error_cancelled',
    not_met: 'qc_error_open',
  }
  return map[status]
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const mins = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${mins}`
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${days[d.getDay()]} ${day}/${month}`
}

export function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

export function generateEventCode(existingEvents: Array<{ code: string }>): string {
  const year = new Date().getFullYear()
  const num = (existingEvents.length + 1).toString().padStart(3, '0')
  return `QC-${year}-${num}`
}

export function generateErrorCode(eventCode: string, errorIndex: number): string {
  return `${eventCode}.${errorIndex.toString().padStart(2, '0')}`
}
