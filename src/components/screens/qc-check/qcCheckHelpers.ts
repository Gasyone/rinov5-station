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

/* ─── Tự động sắp xếp sự cố đa tầng (Auto-Sort by Status, Severity, Deadline & Recency) ─── */

export type QcSortMode = 'severity_deadline' | 'deadline_severity' | 'newest' | 'oldest'

export const SEVERITY_WEIGHT: Record<QcErrorSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

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

/**
 * Tự động sắp xếp danh sách sự cố theo các yếu tố nghiệp vụ đa tầng:
 * 1. Bậc 0: Sự cố mới ghi nhận tức thì (< 15 phút) -> Đẩy lên đầu danh sách để kiểm tra ngay
 * 2. Bậc 1: Trạng thái hành động (Active vs Inactive) -> Các lỗi còn đang xử lý (open, pending_approval, correcting, not_met) ưu tiên trước lỗi đã đóng (closed) hoặc đã hủy (cancelled)
 * 3. Bậc 2 (Cấp 1): Mức độ vi phạm (Critical -> High -> Medium -> Low)
 * 4. Bậc 3 (Cấp 2): Thời hạn SLA / Deadline (Quá hạn / Đến hạn hôm nay / Hạn gần nhất lên đầu)
 * 5. Bậc 4: Thời gian tạo mới nhất (createdAt giảm dần)
 */
export function sortQcIncidents(incidents: QcIncident[]): QcIncident[] {
  const now = Date.now()
  const FIFTEEN_MINUTES = 15 * 60 * 1000

  return [...incidents].sort((a, b) => {
    // Bậc 0: Ưu tiên sự cố mới ghi nhận (trong vòng 15 phút) lên dòng đầu bảng để người dùng kiểm tra ngay
    const timeA = new Date(a.createdAt).getTime()
    const timeB = new Date(b.createdAt).getTime()
    const isRecentA = !isNaN(timeA) && now - timeA < FIFTEEN_MINUTES ? 1 : 0
    const isRecentB = !isNaN(timeB) && now - timeB < FIFTEEN_MINUTES ? 1 : 0

    if (isRecentA !== isRecentB) {
      return isRecentB - isRecentA
    }
    if (isRecentA && isRecentB) {
      return timeB - timeA
    }

    // Bậc 1: Active trước Inactive (Đã đóng/Đã hủy xếp xuống sau)
    const isInactiveA = a.status === 'closed' || a.status === 'cancelled' ? 1 : 0
    const isInactiveB = b.status === 'closed' || b.status === 'cancelled' ? 1 : 0
    if (isInactiveA !== isInactiveB) {
      return isInactiveA - isInactiveB
    }

    // Bậc 2 (Cấp 1): Mức độ vi phạm (Critical -> High -> Medium -> Low)
    const sevA = SEVERITY_WEIGHT[a.severity] ?? 0
    const sevB = SEVERITY_WEIGHT[b.severity] ?? 0
    if (sevA !== sevB) {
      return sevB - sevA
    }

    // Bậc 3 (Cấp 2): Thời hạn SLA (Quá hạn / Đến hạn hôm nay / Hạn gần nhất lên đầu)
    const dlA = getDeadlineTimestamp(a)
    const dlB = getDeadlineTimestamp(b)
    if (dlA !== dlB) {
      return dlA - dlB
    }

    // Bậc 4: Mới tạo lên trước
    return timeB - timeA
  })
}

/* ─── Incident Quick Templates by Target Group & Criteria ─── */

export interface QuickTemplateItem {
  title: string
  criteria: QcEvaluationCriteria
  severity: QcErrorSeverity
  desc: string
}

export const QUICK_TEMPLATES_MAP: Record<string, QuickTemplateItem[]> = {
  teacher_attendance: [
    { title: 'Quên điểm danh', criteria: 'attendance', severity: 'medium', desc: 'Chưa cập nhật sĩ số và điểm danh sau buổi học theo quy định.' },
    { title: 'Sai lệch sĩ số', criteria: 'attendance', severity: 'high', desc: 'Sĩ số học viên thực tế trong lớp không khớp với danh sách điểm danh.' },
    { title: 'Điểm danh muộn', criteria: 'attendance', severity: 'low', desc: 'Cập nhật điểm danh trễ quá 24h sau khi kết thúc buổi dạy.' },
  ],
  teacher_pedagogy: [
    { title: 'Vào lớp muộn', criteria: 'pedagogy', severity: 'high', desc: 'Giáo viên vào lớp muộn hơn giờ học không có thông báo trước.' },
    { title: 'Không nộp giáo án', criteria: 'pedagogy', severity: 'medium', desc: 'Giáo viên chưa nộp kế hoạch bài dạy trước buổi học.' },
    { title: 'Sai đồng phục', criteria: 'pedagogy', severity: 'low', desc: 'Không mặc đúng đồng phục hoặc tác phong không đạt chuẩn.' },
    { title: 'Rời lớp sớm', criteria: 'pedagogy', severity: 'high', desc: 'Kết thúc buổi dạy và cho học viên ra về sớm hơn quy định.' },
  ],
  teacher_feedback: [
    { title: 'Chưa nhận xét HS', criteria: 'feedback', severity: 'low', desc: 'Chưa hoàn thiện phiếu đánh giá / nhận xét học viên định kỳ.' },
    { title: 'Chưa chấm bài tập', criteria: 'feedback', severity: 'medium', desc: 'Bài tập về nhà của học viên chưa được chấm chữa theo lịch.' },
    { title: 'Nhận xét sơ sài', criteria: 'feedback', severity: 'low', desc: 'Nội dung nhận xét đánh giá học viên chưa chi tiết, không sát thực tế.' },
  ],
  facility_facility_quality: [
    { title: 'Hỏng điều hòa', criteria: 'facility_quality', severity: 'medium', desc: 'Điều hòa không mát hoặc chảy nước gây ảnh hưởng buổi học.' },
    { title: 'Lỗi máy chiếu', criteria: 'facility_quality', severity: 'high', desc: 'Máy chiếu chập chờn, mất tín hiệu kết nối trong giờ dạy.' },
    { title: 'Hỏng bàn ghế', criteria: 'facility_quality', severity: 'low', desc: 'Bàn ghế học sinh bị lung lay hoặc hư hỏng cơ học.' },
    { title: 'Mất loa / mic', criteria: 'facility_quality', severity: 'medium', desc: 'Hệ thống âm thanh hoặc micro không hoạt động trong phòng học.' },
  ],
  facility_safety_hygiene: [
    { title: 'Vệ sinh chưa đạt', criteria: 'safety_hygiene', severity: 'low', desc: 'Khu vực chưa được quét dọn sạch sẽ sau ca học.' },
    { title: 'Sàn trơn trượt', criteria: 'safety_hygiene', severity: 'high', desc: 'Khu vực sảnh/hành lang ẩm ướt, nguy cơ trượt ngã, chưa đặt biển cảnh báo.' },
    { title: 'Rác chưa dọn', criteria: 'safety_hygiene', severity: 'low', desc: 'Thùng rác đầy tràn chưa được thu gom và thay túi rác.' },
    { title: 'Cháy bóng đèn', criteria: 'safety_hygiene', severity: 'medium', desc: 'Đèn chiếu sáng khu vực chập chờn hoặc không sáng, thiếu ánh sáng.' },
  ],
  operations_student_care: [
    { title: 'Chưa CS học viên vắng', criteria: 'student_care', severity: 'medium', desc: 'Chưa gọi điện kiểm tra lý do học sinh nghỉ học và hẹn học bù.' },
    { title: 'Chưa xử lý phản ánh', criteria: 'student_care', severity: 'high', desc: 'Phản ánh của phụ huynh chưa được tiếp nhận xử lý đúng SLA 24h.' },
    { title: 'Chưa xếp lịch bù', criteria: 'student_care', severity: 'medium', desc: 'Học sinh có đơn nghỉ nhưng chưa được điều phối xếp lớp học bù.' },
  ],
  operations_attendance: [
    { title: 'Chưa chốt sĩ số', criteria: 'attendance', severity: 'low', desc: 'Chưa rà soát và cập nhật sĩ số thực tế trên hệ thống.' },
    { title: 'Chưa cập nhật bảo lưu', criteria: 'attendance', severity: 'medium', desc: 'Học viên có đơn bảo lưu nhưng chưa được cập nhật trạng thái lớp.' },
  ],
  operations_feedback: [
    { title: 'Chậm phản hồi tin nhắn', criteria: 'feedback', severity: 'medium', desc: 'Tin nhắn trao đổi của phụ huynh để quá 4 giờ chưa trả lời.' },
    { title: 'Chưa gửi báo cáo tháng', criteria: 'feedback', severity: 'low', desc: 'Chưa xuất và gửi báo cáo học tập định kỳ tháng cho phụ huynh.' },
  ],
}

export function getQuickTemplates(targetGroup: QcTargetGroup, criteria: QcEvaluationCriteria): QuickTemplateItem[] {
  return QUICK_TEMPLATES_MAP[`${targetGroup}_${criteria}`] ?? []
}

export function matchesIncidentSearch(inc: QcIncident, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    inc.code.toLowerCase().includes(q) ||
    inc.title.toLowerCase().includes(q) ||
    inc.description.toLowerCase().includes(q) ||
    (inc.className?.toLowerCase().includes(q) ?? false) ||
    (inc.teacherName?.toLowerCase().includes(q) ?? false) ||
    (inc.csmName?.toLowerCase().includes(q) ?? false) ||
    (inc.roomId?.toLowerCase().includes(q) ?? false) ||
    inc.assignee.toLowerCase().includes(q)
  )
}

