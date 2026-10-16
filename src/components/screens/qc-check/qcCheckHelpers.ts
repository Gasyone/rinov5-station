import type {
  QcIncident,
  QcTargetGroup,
  QcSourceType,
  QcEvaluationCriteria,
  QcErrorSeverity,
  QcErrorStatus,
} from '@/mocks/qcChecks'
import {
  QC_TARGET_GROUP_LABELS,
  QC_SOURCE_LABELS,
  QC_CRITERIA_LABELS,
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
} from '@/mocks/qcChecks'

export const BRANCH_OPTIONS = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]

export function formatShortDate(dateStr?: string, includeYear = true): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()
    return includeYear ? `${day}/${month}/${year}` : `${day}/${month}`
  } catch {
    return dateStr
  }
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return false
    const now = new Date()
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  } catch {
    return false
  }
}

export function formatDateTime(dateTimeStr?: string): string {
  if (!dateTimeStr) return '—'
  try {
    const d = new Date(dateTimeStr)
    if (isNaN(d.getTime())) return dateTimeStr
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()
    const hours = d.getHours().toString().padStart(2, '0')
    const mins = d.getMinutes().toString().padStart(2, '0')
    return `${hours}:${mins} ${day}/${month}/${year}`
  } catch {
    return dateTimeStr
  }
}

export function generateIncidentCode(existingIncidents: QcIncident[]): string {
  const year = new Date().getFullYear()
  const count = existingIncidents.length + 1
  return `QC-${year}-${count.toString().padStart(3, '0')}`
}

export function getTargetGroupLabel(group: QcTargetGroup): string {
  return QC_TARGET_GROUP_LABELS[group] ?? group
}

export function getSourceLabel(source: QcSourceType): string {
  return QC_SOURCE_LABELS[source] ?? source
}

export function getCriteriaLabel(criteria: QcEvaluationCriteria): string {
  return QC_CRITERIA_LABELS[criteria] ?? criteria
}

export function getSeverityLabel(severity: QcErrorSeverity): string {
  return QC_ERROR_SEVERITY_LABELS[severity] ?? severity
}

export function getStatusLabel(status: QcErrorStatus): string {
  return QC_ERROR_STATUS_LABELS[status] ?? status
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
]

export function getAvatarColor(idOrName: string = ''): string {
  let hash = 0
  for (let i = 0; i < idOrName.length; i++) {
    hash = (hash << 5) - hash + idOrName.charCodeAt(i)
    hash |= 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Backwards compatibility helper
export function getCalculatedStatus(item: { status: string }): string {
  return item.status
}
export function getQcTypeLabel(type: string): string {
  return type
}
export function getQcStatusLabel(status: string): string {
  return status
}
export function getQcStatusSemantic(status: string): string {
  return `qc_${status}`
}
export function formatDate(d: string): string {
  return formatShortDate(d)
}

/* ─── 2-Tier Incident Sorting: Level 1 Severity, Level 2 Deadline ─── */

export type QcSortMode = 'severity_deadline' | 'deadline_severity' | 'newest' | 'oldest'

export const SEVERITY_WEIGHT: Record<QcErrorSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const SORT_OPTIONS: Array<{
  value: QcSortMode
  label: string
  selectedLabel?: string
}> = [
  {
    value: 'severity_deadline',
    label: '⚡ Mức độ → Thời hạn (Mặc định)',
    selectedLabel: 'Mức độ → Thời hạn',
  },
  {
    value: 'deadline_severity',
    label: '⏰ Thời hạn → Mức độ',
    selectedLabel: 'Thời hạn → Mức độ',
  },
  {
    value: 'newest',
    label: '🆕 Mới ghi nhận nhất',
    selectedLabel: 'Mới ghi nhận',
  },
  {
    value: 'oldest',
    label: '⏳ Cũ nhất trước',
    selectedLabel: 'Cũ nhất trước',
  },
]

export function getDeadlineTimestamp(incident: QcIncident): number {
  if (incident.deadline) {
    const t = new Date(incident.deadline).getTime()
    if (!isNaN(t)) return t
  }
  const created = new Date(incident.createdAt).getTime()
  if (!isNaN(created)) {
    const slaHours = incident.severity === 'critical' || incident.severity === 'high' ? 24 : 48
    return created + slaHours * 60 * 60 * 1000
  }
  return Infinity
}

export function sortQcIncidents(
  incidents: QcIncident[],
  sortMode: QcSortMode = 'severity_deadline'
): QcIncident[] {
  return [...incidents].sort((a, b) => {
    if (sortMode === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortMode === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }

    if (sortMode === 'deadline_severity') {
      // Cấp 1: Thời hạn (Active trước Closed, Thời hạn gấp nhất lên đầu)
      const isInactiveA = a.status === 'closed' || a.status === 'cancelled' ? 1 : 0
      const isInactiveB = b.status === 'closed' || b.status === 'cancelled' ? 1 : 0
      if (isInactiveA !== isInactiveB) return isInactiveA - isInactiveB

      const dlA = getDeadlineTimestamp(a)
      const dlB = getDeadlineTimestamp(b)
      if (dlA !== dlB) return dlA - dlB

      // Cấp 2: Mức độ (Nghiêm trọng -> Cao -> Trung bình -> Thấp)
      const sevA = SEVERITY_WEIGHT[a.severity] ?? 0
      const sevB = SEVERITY_WEIGHT[b.severity] ?? 0
      return sevB - sevA
    }

    // Mặc định: 'severity_deadline' (Cơ chế 2 cấp: Mức độ ở trên cùng, Thời hạn ở thứ 2)
    // Cấp 1: Mức độ vi phạm (Critical -> High -> Medium -> Low)
    const sevA = SEVERITY_WEIGHT[a.severity] ?? 0
    const sevB = SEVERITY_WEIGHT[b.severity] ?? 0
    if (sevA !== sevB) {
      return sevB - sevA
    }

    // Cấp 2: Thời hạn (Active trước Closed, Quá hạn / Đến hạn hôm nay / Hạn gần nhất lên đầu)
    const isInactiveA = a.status === 'closed' || a.status === 'cancelled' ? 1 : 0
    const isInactiveB = b.status === 'closed' || b.status === 'cancelled' ? 1 : 0
    if (isInactiveA !== isInactiveB) return isInactiveA - isInactiveB

    const dlA = getDeadlineTimestamp(a)
    const dlB = getDeadlineTimestamp(b)
    if (dlA !== dlB) {
      return dlA - dlB
    }

    // Tiêu chí phụ: Mới tạo lên trước
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
