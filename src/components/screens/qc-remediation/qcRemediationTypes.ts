import type { QcErrorType, QcErrorSeverity } from '@/mocks/qcChecks'

export type QcErrorStatus = 'open' | 'correcting' | 'corrected' | 'closed' | 'cancelled' | 'not_met'
export type ErrorStatusFilter = 'all' | QcErrorStatus | 'overdue'

export interface QcExtendedError {
  id: string
  code: string
  qcEventId: string
  eventCode: string
  eventName: string
  branch: string
  itemId: string
  itemLabel: string
  errorType: QcErrorType
  description: string
  severity: QcErrorSeverity
  status: QcErrorStatus
  recurrenceCount: number
  requiresCorrectiveAction: boolean
  evidence: string
  evidenceLink?: string
  evidenceImage?: string
  correctiveAction: string
  correctiveEvidence: string
  correctiveLink?: string
  correctiveImage?: string
  assignee: string
  issuedBy: string
  notes: string
  createdAt: string
  completionDate?: string
  deadline?: string
  closedBy?: string
  closedAt?: string
}

export interface FilterState {
  branches: string[]
  types: QcErrorType[]
  severities: QcErrorSeverity[]
}

export const REPAIR_STATUS_TILES: Array<{ id: ErrorStatusFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'open', label: 'Mở' },
  { id: 'correcting', label: 'Đang khắc phục' },
  { id: 'corrected', label: 'Đã khắc phục' },
  { id: 'not_met', label: 'Chưa đáp ứng' },
  { id: 'closed', label: 'Đã đóng' },
  { id: 'overdue', label: 'Trễ' },
]

export function computeErrorStatusTotal(allErrors: QcExtendedError[], filterId: ErrorStatusFilter): number {
  if (filterId === 'all') return allErrors.length
  if (filterId === 'overdue') return allErrors.filter((e) => isErrorOverdue(e)).length
  return allErrors.filter((e) => e.status === filterId).length
}

export function isErrorOverdue(error: QcExtendedError): boolean {
  if (error.status === 'cancelled') return false

  const deadlineDate = error.deadline ? new Date(error.deadline) : null

  if (deadlineDate) {
    if (error.status === 'closed' || error.status === 'corrected') {
      const finishTime = error.completionDate
        ? new Date(error.completionDate)
        : error.closedAt
          ? new Date(error.closedAt)
          : null
      if (finishTime) {
        return finishTime.getTime() > deadlineDate.getTime()
      }
      return false
    }
    const now = new Date()
    return now.getTime() > deadlineDate.getTime()
  }

  const created = new Date(error.createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (error.requiresCorrectiveAction && diffDays > 3) return true
  if (!error.requiresCorrectiveAction && diffDays > 1) return true
  return false
}

export function getErrorBadgeSemantic(error: QcExtendedError): string {
  if (isErrorOverdue(error)) return 'qc_error_overdue'
  return `qc_error_${error.status}`
}

export const BRANCH_OPTIONS = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]
