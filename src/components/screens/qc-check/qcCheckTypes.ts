import type {
  QcIncident,
  QcErrorStatus,
  QcTargetGroup,
  QcSourceType,
  QcEvaluationCriteria,
  QcErrorSeverity,
} from '@/mocks/qcChecks'
import { Flame, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type React from 'react'

export const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
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

export type IncidentStatusFilter = 'all' | QcErrorStatus | 'overdue'

export type IncidentDeadlineFilter = 'all' | 'due_soon' | 'not_due' | 'overdue'

export interface FilterState {
  branches: string[]
  targetGroups: QcTargetGroup[]
  sources: QcSourceType[]
  criteriaList: QcEvaluationCriteria[]
  severities: QcErrorSeverity[]
  statuses: QcErrorStatus[]
}

export const BRANCH_OPTIONS = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'Tất cả các môn', selectedLabel: 'Tất cả các môn' },
  { value: 'Tiếng Anh', label: 'Tiếng Anh', selectedLabel: 'Tiếng Anh' },
  { value: 'Toán tư duy', label: 'Toán tư duy', selectedLabel: 'Toán tư duy' },
  { value: 'STEAM', label: 'STEAM', selectedLabel: 'STEAM' },
]

export const CRITERIA_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả loại lỗi', selectedLabel: 'Tất cả loại lỗi' },
  { value: 'attendance', label: 'Điểm danh', selectedLabel: 'Điểm danh' },
  { value: 'student_care', label: 'Chăm sóc học viên', selectedLabel: 'Chăm sóc học viên' },
  { value: 'facility_quality', label: 'Chất lượng CSVC', selectedLabel: 'Chất lượng CSVC' },
  { value: 'feedback', label: 'Nhận xét học viên', selectedLabel: 'Nhận xét học viên' },
  { value: 'pedagogy', label: 'Tác phong giảng dạy', selectedLabel: 'Tác phong giảng dạy' },
  { value: 'safety_hygiene', label: 'An toàn & Vệ sinh', selectedLabel: 'An toàn & Vệ sinh' },
]

export const DEADLINE_FILTER_OPTIONS: Array<{
  value: IncidentDeadlineFilter
  label: string
  selectedLabel?: string
}> = [
  { value: 'all', label: 'Tất cả thời hạn', selectedLabel: 'Tất cả thời hạn' },
  { value: 'due_soon', label: 'Đến hạn', selectedLabel: 'Đến hạn' },
  { value: 'not_due', label: 'Chưa đến hạn', selectedLabel: 'Chưa đến hạn' },
  { value: 'overdue', label: 'Quá hạn', selectedLabel: 'Quá hạn' },
]

export const ADVANCED_STATUS_OPTIONS: Array<{ value: QcErrorStatus; label: string }> = [
  { value: 'open', label: 'Mở' },
  { value: 'correcting', label: 'Đang khắc phục' },
  { value: 'not_met', label: 'Chưa đáp ứng' },
  { value: 'corrected', label: 'Chờ duyệt' },
  { value: 'closed', label: 'Đã đóng' },
  { value: 'cancelled', label: 'Đã hủy' },
]

export const STATUS_TILE_CONFIG: Array<{ id: IncidentStatusFilter; label: string; status: string }> = [
  { id: 'all', label: 'Tất cả', status: 'info' },
  { id: 'open', label: 'Mở', status: 'qc_error_open' },
  { id: 'correcting', label: 'Đang khắc phục', status: 'qc_error_correcting' },
  { id: 'corrected', label: 'Chờ duyệt', status: 'qc_error_corrected' },
  { id: 'closed', label: 'Đã đóng', status: 'qc_error_closed' },
]

export function isIncidentOverdue(incident: QcIncident): boolean {
  if (incident.status === 'closed' || incident.status === 'cancelled' || incident.status === 'corrected') {
    return false
  }
  if (incident.deadline) {
    return new Date().getTime() > new Date(incident.deadline).getTime()
  }
  // Default SLA: 24h if critical/high, 48h if medium/low
  const created = new Date(incident.createdAt).getTime()
  const now = new Date().getTime()
  const hours = (now - created) / (1000 * 60 * 60)
  if (incident.severity === 'critical' || incident.severity === 'high') {
    return hours > 24
  }
  return hours > 48
}

export function getIncidentDeadlineState(incident: QcIncident): 'overdue' | 'due_soon' | 'not_due' | 'completed' {
  if (incident.status === 'closed' || incident.status === 'cancelled') {
    return 'completed'
  }
  const now = new Date().getTime()
  let deadlineTime: number
  if (incident.deadline) {
    deadlineTime = new Date(incident.deadline).getTime()
  } else {
    const created = new Date(incident.createdAt).getTime()
    const slaHours = incident.severity === 'critical' || incident.severity === 'high' ? 24 : 48
    deadlineTime = created + slaHours * 60 * 60 * 1000
  }

  if (now > deadlineTime) {
    return 'overdue'
  }
  const hoursLeft = (deadlineTime - now) / (1000 * 60 * 60)
  if (hoursLeft <= 24) {
    return 'due_soon'
  }
  return 'not_due'
}

export function matchesDeadlineFilter(incident: QcIncident, filter: IncidentDeadlineFilter): boolean {
  if (filter === 'all') return true
  const state = getIncidentDeadlineState(incident)
  if (filter === 'overdue') return state === 'overdue'
  if (filter === 'due_soon') return state === 'due_soon'
  if (filter === 'not_due') return state === 'not_due' || state === 'completed'
  return true
}

export function getIncidentBadgeSemantic(incident: QcIncident): string {
  return `qc_error_${incident.status}`
}

export function computeIncidentStatusTotal(
  incidents: QcIncident[],
  tileId: IncidentStatusFilter,
  includeCancelledInAll: boolean = false
): number {
  if (tileId === 'all') {
    return includeCancelledInAll
      ? incidents.length
      : incidents.filter((inc) => inc.status !== 'cancelled').length
  }
  if (tileId === 'correcting') {
    // 2. Chưa đáp ứng vẫn là đang khắc phục
    return incidents.filter((inc) => inc.status === 'correcting' || inc.status === 'not_met').length
  }
  if (tileId === 'overdue') {
    return incidents.filter((inc) => isIncidentOverdue(inc)).length
  }
  return incidents.filter((inc) => inc.status === tileId).length
}

// Backwards compatibility aliases
export type StatusTileId = IncidentStatusFilter
export const isErrorOverdue = isIncidentOverdue
export const getErrorBadgeSemantic = getIncidentBadgeSemantic
export function STATUS_TILE_CONFIG_EXPORT() {
  return STATUS_TILE_CONFIG
}
