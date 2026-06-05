import type { QcCheckEvent, QcCheckStatus, QcError, QcErrorStatus } from '@/mocks/qcChecks'
import { getCalculatedStatus } from './qcCheckHelpers'

export type StatusTileId = 'all' | QcCheckStatus

export interface FilterState {
  branches: string[]
  statuses: string[]
}

const STATUS_TILE_CONFIG: Array<{ id: StatusTileId; label: string; status: string }> = [
  { id: 'all', label: 'Tất cả', status: 'info' },
  { id: 'draft', label: 'Nháp', status: 'qc_draft' },
  { id: 'published', label: 'Đã phát hành', status: 'qc_published' },
  { id: 'correcting', label: 'Đang khắc phục', status: 'qc_correcting' },
  { id: 'closed', label: 'Đã đóng', status: 'qc_closed' },
  { id: 'completed_closed', label: 'Hoàn thành đóng lỗi', status: 'qc_completed_closed' },
  { id: 'cancelled', label: 'Đã hủy', status: 'qc_cancelled' },
  { id: 'not_met', label: 'Chưa đáp ứng', status: 'qc_not_met' },
 ]

const ERROR_STATUS_TILES: Array<{ id: 'all' | QcErrorStatus; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'open', label: 'Mở' },
  { id: 'correcting', label: 'Đang khắc phục' },
  { id: 'corrected', label: 'Đã khắc phục' },
  { id: 'not_met', label: 'Chưa đáp ứng' },
  { id: 'closed', label: 'Đã đóng' },
  { id: 'cancelled', label: 'Đã hủy' },
]

export function computeStatusTotal(events: QcCheckEvent[], tileId: StatusTileId): number {
  if (tileId === 'all') return events.length
  return events.filter((e) => getCalculatedStatus(e) === tileId).length
}

export function isErrorOverdue(error: QcError): boolean {
  if (error.status === 'closed' || error.status === 'cancelled' || error.status === 'corrected') return false
  if (error.deadline) {
    return new Date().getTime() > new Date(error.deadline).getTime()
  }
  const created = new Date(error.createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (error.requiresCorrectiveAction && diffDays > 3) return true
  if (!error.requiresCorrectiveAction && diffDays > 1) return true
  return false
}

export function getErrorBadgeSemantic(error: QcError): string {
  if (isErrorOverdue(error)) return 'qc_error_overdue'
  return `qc_error_${error.status}`
}

export function STATUS_TILE_CONFIG_EXPORT() {
  return STATUS_TILE_CONFIG
}

export function ERROR_STATUS_TILES_EXPORT() {
  return ERROR_STATUS_TILES
}

export const BRANCH_OPTIONS = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]
