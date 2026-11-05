/* ─── QC Check & Incident Remediation Domain Types ────────────
   Unified Incident Architecture: Continuous Quality Control,
   3 Target Groups (Teacher, Facility, Operations/CS),
   2 Sources (Manual, System Auto-detect),
   Single & Batch Logging, Non-linear Lifecycle & Auto/Manual Closure.
*/

export type QcTargetGroup = 'teacher' | 'facility' | 'operations'
export type QcSourceType = 'manual' | 'system'
export type QcClosureMethod = 'manual' | 'system_auto'

export type QcEvaluationCriteria =
  | 'class_operations'
  | 'staff_conduct'
  | 'five_star_service'
  | 'attendance'
  | 'student_care'
  | 'facility_quality'
  | 'feedback'
  | 'pedagogy'
  | 'safety_hygiene'

export type QcErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export type QcErrorStatus =
  | 'open'
  | 'correcting'
  | 'corrected'
  | 'closed'
  | 'cancelled'
  | 'not_met'

export type QcCheckType = 'daily' | 'patrol' | 'monthly'

export type QcCheckStatus =
  | 'draft'
  | 'published'
  | 'correcting'
  | 'closed'
  | 'cancelled'
  | 'completed_closed'
  | 'not_met'
  | 'completed'

/* ─── Labels & Configurations ───────────────────────────── */

export const QC_TARGET_GROUP_LABELS: Record<QcTargetGroup, string> = {
  teacher: 'Giáo viên',
  facility: 'Cơ sở vật chất',
  operations: 'Vận hành',
}

export const QC_SOURCE_LABELS: Record<QcSourceType, string> = {
  manual: 'Thủ công',
  system: 'Hệ thống tự tạo',
}

export const QC_CRITERIA_LABELS: Record<QcEvaluationCriteria, string> = {
  class_operations: 'Lỗi vận hành lớp học',
  staff_conduct: 'Lỗi tác phong nhân sự',
  five_star_service: 'Lỗi dịch vụ 5 sao',
  attendance: 'Điểm danh',
  student_care: 'Chăm sóc học viên',
  facility_quality: 'Chất lượng CSVC',
  feedback: 'Nhận xét học viên',
  pedagogy: 'Tác phong giảng dạy',
  safety_hygiene: 'An toàn & Vệ sinh',
}

export const QC_TARGET_GROUP_CRITERIA: Record<QcTargetGroup, QcEvaluationCriteria[]> = {
  teacher: ['class_operations', 'attendance', 'pedagogy', 'feedback'],
  facility: ['five_star_service', 'facility_quality', 'safety_hygiene'],
  operations: ['staff_conduct', 'student_care', 'attendance', 'feedback'],
}

export const QC_ERROR_SEVERITY_LABELS: Record<QcErrorSeverity, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Nghiêm trọng',
}

export const QC_ERROR_STATUS_LABELS: Record<QcErrorStatus, string> = {
  open: 'Mở',
  correcting: 'Đang khắc phục',
  corrected: 'Chờ duyệt',
  closed: 'Đã đóng',
  cancelled: 'Đã hủy',
  not_met: 'Chưa đáp ứng',
}

export type QcActionTaken = 'private_message' | 'public_group' | 'direct_warning' | 'penalty_record'
export type QcCmConfirmation = 'pending' | 'approved' | 'rejected'
export type QcFinalStatus = 'closed_reminded' | 'closed_explained' | 'confirmed_violation' | 'monitoring'

export const QC_ACTION_LABELS: Record<QcActionTaken, string> = {
  private_message: 'Đã nhắc nhở qua TN riêng',
  public_group: 'Đã nhắc nhở trong nhóm chung',
  direct_warning: 'Nhắc nhở trực tiếp',
  penalty_record: 'Lập biên bản vi phạm',
}

export const QC_CM_CONFIRM_LABELS: Record<QcCmConfirmation, string> = {
  pending: 'Chờ CM xác nhận',
  approved: 'CM chấp thuận',
  rejected: 'CM không đồng ý',
}

export const QC_FINAL_STATUS_LABELS: Record<QcFinalStatus, string> = {
  closed_reminded: 'Đã nhắc nhở',
  closed_explained: 'Chấp nhận giải trình (Miễn phạt)',
  confirmed_violation: 'Chốt vi phạm',
  monitoring: 'Đang theo dõi tái phạm',
}

export const QC_ERROR_TYPE_LABELS: Record<string, string> = {
  process: 'Quy trình',
  facility: 'Cơ sở vật chất',
  personnel: 'Nhân sự',
  equipment: 'Thiết bị',
  safety: 'An toàn',
  hygiene: 'Vệ sinh',
}

export const QC_CHECK_TYPE_LABELS: Record<QcCheckType, string> = {
  daily: 'Hàng ngày',
  patrol: 'Đột xuất',
  monthly: 'Hàng tháng',
}

export const QC_CHECK_STATUS_LABELS: Record<QcCheckStatus, string> = {
  draft: 'Nháp',
  published: 'Đã phát hành',
  correcting: 'Đang khắc phục',
  closed: 'Đã đóng',
  cancelled: 'Đã hủy',
  completed_closed: 'Hoàn thành đóng lỗi',
  not_met: 'Chưa đáp ứng',
  completed: 'Hoàn thành',
}

export const QC_CHECK_STATUS_ORDER: QcCheckStatus[] = [
  'draft',
  'published',
  'correcting',
  'closed',
  'completed_closed',
  'not_met',
  'completed',
  'cancelled',
]

/* ─── Inspector / Actor ──────────────────────────────────── */

export interface Inspector {
  id: string
  name: string
  avatar?: string
  role?: string
}

export const INSPECTOR_OPTIONS: Inspector[] = [
  { id: 'ins_01', name: 'Trần Văn Kiên', role: 'Thanh tra viên' },
  { id: 'ins_02', name: 'Lê Thị Hạnh', role: 'Quản lý chất lượng' },
  { id: 'ins_03', name: 'Phạm Thanh Tùng', role: 'Giám đốc chi nhánh' },
  { id: 'ins_04', name: 'Nguyễn Thị Mai', role: 'Tổ trưởng chuyên môn' },
  { id: 'ins_05', name: 'Hoàng Thị Lan', role: 'Thanh tra viên' },
]

export function getInspectorById(id: string): Inspector | undefined {
  return INSPECTOR_OPTIONS.find((i) => i.id === id)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

/* ─── Comment & Audit Log ────────────────────────────────── */

export interface QcComment {
  id: string
  userId: string
  userName: string
  userRole?: string
  content: string
  createdAt: string
}

export interface QcLog {
  id: string
  userId: string
  userName: string
  action: string
  details?: string
  createdAt: string
}

/* ─── Multi-Round Remediation & Review (2 Cấp) ─────────────── */

export interface QcRemediationRound {
  id: string
  roundNumber: number
  // Cấp 1: Người nhập
  submittedBy: string
  submittedAt: string
  action: string
  evidence?: string
  image?: string
  link?: string
  preventiveAction?: string
  // Cấp 2: Người duyệt
  reviewedBy?: string
  reviewedAt?: string
  reviewStatus?: 'approved' | 'rejected'
  reviewNote?: string
}

/* ─── Core Entity: QC Quality Incident ───────────────────── */

export interface QcIncident {
  id: string
  code: string
  title: string
  targetGroup: QcTargetGroup
  criteria: QcEvaluationCriteria
  source: QcSourceType

  // Context: Campus, Class, Session, Room
  branch: string
  classId?: string
  className?: string
  subject?: string
  sessionNumber?: number
  sessionDate?: string
  sessionInfo?: string
  roomId?: string

  // Associated Actors
  teacherId?: string
  teacherName?: string
  csmId?: string
  csmName?: string

  // Incident Details & Evidence
  description: string
  severity: QcErrorSeverity
  status: QcErrorStatus
  recurrenceCount: number
  evidence: string
  evidenceImage?: string
  evidenceLink?: string

  // Remediation & Assignment
  assignee: string
  issuedBy: string
  createdAt: string
  deadline?: string

  // Operational Action, Explanation & CM Confirmation (Google Sheet Mirror)
  repeatCount?: number
  actionTaken?: QcActionTaken
  explanation?: string
  cmConfirmation?: QcCmConfirmation
  cmConfirmationNote?: string
  finalStatus?: QcFinalStatus
  sourceDailyCheckId?: string

  // Corrective Action & Verification Proof
  correctiveAction?: string
  correctiveEvidence?: string
  correctiveImage?: string
  correctiveLink?: string
  preventiveAction?: string
  completionDate?: string
  remediationRounds?: QcRemediationRound[]

  // Closure
  closureMethod?: QcClosureMethod
  closedBy?: string
  closedAt?: string

  notes?: string
  comments: QcComment[]
  logs: QcLog[]

  // Backwards compatibility fields
  qcEventId?: string
  eventCode?: string
  eventName?: string
  itemId?: string
  itemLabel?: string
  errorType?: QcErrorType
  requiresCorrectiveAction?: boolean
}

// Backwards compatibility alias
export type QcError = QcIncident
export type QcErrorType = 'process' | 'facility' | 'personnel' | 'equipment' | 'safety' | 'hygiene'
export type QcCheckItemCategory = 'classroom' | 'teacher' | 'facility' | 'hygiene' | 'safety' | 'equipment'

export const QC_CHECK_CATEGORIES: Array<{ id: QcCheckItemCategory; label: string }> = [
  { id: 'classroom', label: 'Lớp học' },
  { id: 'teacher', label: 'Giáo viên' },
  { id: 'facility', label: 'Cơ sở vật chất' },
  { id: 'hygiene', label: 'Vệ sinh' },
  { id: 'safety', label: 'An toàn' },
  { id: 'equipment', label: 'Thiết bị' },
]

export const QC_CHECK_ITEMS: Array<{ id: string; label: string; category: QcCheckItemCategory }> = [
  { id: 'item_01', label: 'Sĩ số lớp đúng kế hoạch', category: 'classroom' },
  { id: 'item_02', label: 'Giáo viên đúng giờ, đủ giáo án', category: 'teacher' },
  { id: 'item_03', label: 'Phòng học sạch sẽ, đủ ánh sáng', category: 'facility' },
  { id: 'item_04', label: 'Nhà vệ sinh sạch, đủ dụng cụ', category: 'hygiene' },
  { id: 'item_05', label: 'Thoát hiểm rõ ràng, không vật cản', category: 'safety' },
  { id: 'item_06', label: 'Máy chiếu, loa, micro hoạt động tốt', category: 'equipment' },
  { id: 'item_07', label: 'Bảng viết sạch, phấn/bút đủ', category: 'classroom' },
  { id: 'item_08', label: 'Giáo viên tương tác tốt với học viên', category: 'teacher' },
  { id: 'item_09', label: 'Điều hòa, quạt hoạt động bình thường', category: 'facility' },
  { id: 'item_10', label: 'Khu vực chờ gọn gàng, an toàn', category: 'safety' },
  { id: 'item_11', label: 'Máy tính, phần mềm học tập ổn định', category: 'equipment' },
  { id: 'item_12', label: 'Rửa tay, khử khuẩn đầy đủ', category: 'hygiene' },
]

/* ─── Mock Incidents Data ────────────────────────────────── */

export const mockQcIncidents: QcIncident[] = [
  {
    id: 'inc_001',
    code: 'QC-2026-001',
    title: 'Đèn điện chưa được tắt hết khi ra về',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    description: 'Đèn điện chưa được tắt hết khi ra về',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: '166.jpg',
    evidenceImage: '/mocks/qc/166.jpg',
    assignee: 'VanLT4',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-16T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-16T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-16T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_001_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Đèn điện chưa được tắt hết khi ra về', createdAt: '2026-06-16T09:00:00Z' },
      { id: 'log_001_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-16T16:30:00Z' },
    ],
  },
  {
    id: 'inc_002',
    code: 'QC-2026-002',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Linh Đàm',
    csmName: 'HongPT',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'HongPT.jpg',
    evidenceImage: '/mocks/qc/HongPT.jpg',
    assignee: 'HongPT',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-16T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-16T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-16T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_002_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-06-16T09:00:00Z' },
      { id: 'log_002_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-16T16:30:00Z' },
    ],
  },
  {
    id: 'inc_003',
    code: 'QC-2026-003',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Linh Đàm',
    csmName: 'NhiBU',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'AnhNTN33 và NhiBU.jpg',
    evidenceImage: '/mocks/qc/AnhNTN33 và NhiBU.jpg',
    assignee: 'NhiBU',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-16T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-16T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-16T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_003_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-06-16T09:00:00Z' },
      { id: 'log_003_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-16T16:30:00Z' },
    ],
  },
  {
    id: 'inc_004',
    code: 'QC-2026-004',
    title: 'CS mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Linh Đàm',
    csmName: 'AnhNTN33',
    description: 'CS mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'AnhNTN33 và NhiBU.jpg',
    evidenceImage: '/mocks/qc/AnhNTN33 và NhiBU.jpg',
    assignee: 'AnhNTN33',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-16T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-16T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-16T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_004_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: CS mặc sai đồng phục quy định', createdAt: '2026-06-16T09:00:00Z' },
      { id: 'log_004_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-16T16:30:00Z' },
    ],
  },
  {
    id: 'inc_005',
    code: 'QC-2026-005',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    csmName: 'AnVT2',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'AnVT2.jpg',
    evidenceImage: '/mocks/qc/AnVT2.jpg',
    assignee: 'AnVT2',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-16T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-16T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-16T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_005_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-06-16T09:00:00Z' },
      { id: 'log_005_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-16T16:30:00Z' },
    ],
  },
  {
    id: 'inc_006',
    code: 'QC-2026-006',
    title: 'Đèn điện chưa được tắt hết khi ra về',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    description: 'Đèn điện chưa được tắt hết khi ra về',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 2,
    evidence: 'NVS vẫn còn điện.jpg',
    evidenceImage: '/mocks/qc/NVS vẫn còn điện.jpg',
    assignee: 'VanLT4',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-18T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở trong nhóm chung',
    completionDate: '2026-06-18T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-18T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_006_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Đèn điện chưa được tắt hết khi ra về', createdAt: '2026-06-18T09:00:00Z' },
      { id: 'log_006_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở trong nhóm chung', createdAt: '2026-06-18T16:30:00Z' },
    ],
  },
  {
    id: 'inc_007',
    code: 'QC-2026-007',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    csmName: 'BinhNQ',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'Trang phục không phù hợp MT giáo dục.jpg',
    evidenceImage: '/mocks/qc/Trang phục không phù hợp MT giáo dục.jpg',
    assignee: 'BinhNQ',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-25T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-25T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-25T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_007_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-06-25T09:00:00Z' },
      { id: 'log_007_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-25T16:30:00Z' },
    ],
  },
  {
    id: 'inc_008',
    code: 'QC-2026-008',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    csmName: 'AnhHT6',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'Sale mặc không đúng tác phong NS khi tiếp khách.jpg',
    evidenceImage: '/mocks/qc/Sale mặc không đúng tác phong NS khi tiếp khách.jpg',
    assignee: 'AnhHT6',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-30T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-06-30T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-30T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_008_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-06-30T09:00:00Z' },
      { id: 'log_008_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-06-30T16:30:00Z' },
    ],
  },
  {
    id: 'inc_009',
    code: 'QC-2026-009',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'KDV',
    csmName: 'MaiNTN6, ThuyPT9, PhuongNT1',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'NS KDV không đeo nametag trong khi làm việc.jpg',
    evidenceImage: '/mocks/qc/NS KDV không đeo nametag trong khi làm việc.jpg',
    assignee: 'MaiNTN6, ThuyPT9, PhuongNT1',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-30T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở trong nhóm chung',
    completionDate: '2026-06-30T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-30T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_009_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-06-30T09:00:00Z' },
      { id: 'log_009_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở trong nhóm chung', createdAt: '2026-06-30T16:30:00Z' },
    ],
  },
  {
    id: 'inc_010',
    code: 'QC-2026-010',
    title: 'Đã checklist nhưng cơ sở vẫn bừa bộn',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: 'Tonkin',
    description: 'Đã checklist nhưng cơ sở vẫn bừa bộn',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'rác KV lễ tân tràn đầy ra ngoài.jpg',
    evidenceImage: '/mocks/qc/rác KV lễ tân tràn đầy ra ngoài.jpg',
    assignee: 'QuangBD',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-06-30T09:00:00Z',
    correctiveAction: 'Nhắc nhở trực tiếp',
    completionDate: '2026-06-30T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-06-30T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_010_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Đã checklist nhưng cơ sở vẫn bừa bộn', createdAt: '2026-06-30T09:00:00Z' },
      { id: 'log_010_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Nhắc nhở trực tiếp', createdAt: '2026-06-30T16:30:00Z' },
    ],
  },
  {
    id: 'inc_011',
    code: 'QC-2026-011',
    title: 'TV tắt không đúng cách nên tự bật cả đêm',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: 'Tonkin',
    description: 'TV tắt không đúng cách nên tự bật cả đêm',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'TV tắt không đúng cách nên tự bật cả đêm.jpg',
    evidenceImage: '/mocks/qc/TV tắt không đúng cách nên tự bật cả đêm.jpg',
    assignee: 'QuangBD',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-01T09:00:00Z',
    correctiveAction: 'Nhắc nhở trực tiếp',
    completionDate: '2026-07-01T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-01T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_011_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: TV tắt không đúng cách nên tự bật cả đêm', createdAt: '2026-07-01T09:00:00Z' },
      { id: 'log_011_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Nhắc nhở trực tiếp', createdAt: '2026-07-01T16:30:00Z' },
    ],
  },
  {
    id: 'inc_012',
    code: 'QC-2026-012',
    title: 'TV tắt không đúng cách nên tự bật cả đêm',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: 'Tonkin',
    description: 'TV tắt không đúng cách nên tự bật cả đêm',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 2,
    evidence: 'TV bật qua đêm.jpg',
    evidenceImage: '/mocks/qc/TV bật qua đêm.jpg',
    assignee: 'QuangBD',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-08T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở trong nhóm chung',
    completionDate: '2026-07-08T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-08T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_012_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: TV tắt không đúng cách nên tự bật cả đêm', createdAt: '2026-07-08T09:00:00Z' },
      { id: 'log_012_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở trong nhóm chung', createdAt: '2026-07-08T16:30:00Z' },
    ],
  },
  {
    id: 'inc_013',
    code: 'QC-2026-013',
    title: 'Sale/CS mặc không đúng tác phong quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Linh Đàm',
    csmName: 'ThuyNT, HongPT',
    description: 'Sale/CS mặc không đúng tác phong quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'NS không sơ vin đúng tác phong.jpg',
    evidenceImage: '/mocks/qc/NS không sơ vin đúng tác phong.jpg',
    assignee: 'ThuyNT, HongPT',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-09T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-07-09T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-09T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_013_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale/CS mặc không đúng tác phong quy định', createdAt: '2026-07-09T09:00:00Z' },
      { id: 'log_013_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-07-09T16:30:00Z' },
    ],
  },
  {
    id: 'inc_014',
    code: 'QC-2026-014',
    title: 'Sale/CS mặc không đúng tác phong quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    csmName: 'NamPT1',
    description: 'Sale/CS mặc không đúng tác phong quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'NS không sơ vin đúng tác phong quy định.jpg',
    evidenceImage: '/mocks/qc/NS không sơ vin đúng tác phong quy định.jpg',
    assignee: 'NamPT1',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-09T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-07-09T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-09T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_014_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale/CS mặc không đúng tác phong quy định', createdAt: '2026-07-09T09:00:00Z' },
      { id: 'log_014_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-07-09T16:30:00Z' },
    ],
  },
  {
    id: 'inc_015',
    code: 'QC-2026-015',
    title: 'Sale/CS mặc không đúng tác phong quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Vin SA1',
    csmName: 'ThomDT, TrangNP',
    description: 'Sale/CS mặc không đúng tác phong quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'NS không đeo nametag, sơ vin đúng tác phong quy định.jpg',
    evidenceImage: '/mocks/qc/NS không đeo nametag, sơ vin đúng tác phong quy định.jpg',
    assignee: 'ThomDT, TrangNP',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-09T09:00:00Z',
    correctiveAction: 'Nhắc nhở trực tiếp',
    completionDate: '2026-07-09T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-09T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_015_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale/CS mặc không đúng tác phong quy định', createdAt: '2026-07-09T09:00:00Z' },
      { id: 'log_015_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Nhắc nhở trực tiếp', createdAt: '2026-07-09T16:30:00Z' },
    ],
  },
  {
    id: 'inc_016',
    code: 'QC-2026-016',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'KDV',
    csmName: 'MaiNTN6',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'Sale không mặc đúng đồng phục quy định.jpg',
    evidenceImage: '/mocks/qc/Sale không mặc đúng đồng phục quy định.jpg',
    assignee: 'MaiNTN6',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-10T09:00:00Z',
    correctiveAction: 'Nhắc nhở trực tiếp',
    completionDate: '2026-07-10T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-10T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_016_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-07-10T09:00:00Z' },
      { id: 'log_016_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Nhắc nhở trực tiếp', createdAt: '2026-07-10T16:30:00Z' },
    ],
  },
  {
    id: 'inc_017',
    code: 'QC-2026-017',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'KDV',
    csmName: 'ChiPTM, ThuyPT9',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'NS KDV mặc sai quy định đồng phục.jpg',
    evidenceImage: '/mocks/qc/NS KDV mặc sai quy định đồng phục.jpg',
    assignee: 'ChiPTM, ThuyPT9',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-07-11T09:00:00Z',
    correctiveAction: 'Đã nhắc nhở qua TN riêng',
    completionDate: '2026-07-11T17:00:00Z',
    closureMethod: 'manual',
    closedBy: 'Ban Đảm bảo Chất lượng (QC)',
    closedAt: '2026-07-11T17:30:00Z',
    comments: [],
    logs: [
      { id: 'log_017_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-07-11T09:00:00Z' },
      { id: 'log_017_2', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Thực hiện hành động xử lý', details: 'Đã nhắc nhở qua TN riêng', createdAt: '2026-07-11T16:30:00Z' },
    ],
  },
  {
    id: 'inc_018',
    code: 'QC-2026-018',
    title: 'Trợ giảng mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Vin SA1',
    csmName: 'Trợ giảng (Vin SA1)',
    description: 'Trợ giảng mặc sai đồng phục quy định',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_02102026 Trợ giảng lớp SA1_TA_00010 mặc sai đồng phục quy định.jpg',
    evidenceImage: '/mocks/qc/SA1_02102026 Trợ giảng lớp SA1_TA_00010 mặc sai đồng phục quy định.jpg',
    assignee: 'Trợ giảng (Vin SA1)',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-02T09:00:00Z',
    deadline: '2026-10-02T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_018_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Trợ giảng mặc sai đồng phục quy định', createdAt: '2026-10-02T09:00:00Z' },
    ],
  },
  {
    id: 'inc_019',
    code: 'QC-2026-019',
    title: 'Nhân sự không đeo bảng tên trong khi tiếp phụ huynh',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Tonkin',
    csmName: 'ThuyPT9',
    description: 'Nhân sự không đeo bảng tên trong khi tiếp phụ huynh',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'Tonkin_03102026 Nhân sự ThuyPT9 không đeo bảng tên trong lúc trao đổi với phụ huynh.jpg',
    evidenceImage: '/mocks/qc/Tonkin_03102026 Nhân sự ThuyPT9 không đeo bảng tên trong lúc trao đổi với phụ huynh.jpg',
    assignee: 'ThuyPT9',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-03T09:00:00Z',
    deadline: '2026-10-03T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_019_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Nhân sự không đeo bảng tên trong khi tiếp phụ huynh', createdAt: '2026-10-03T09:00:00Z' },
    ],
  },
  {
    id: 'inc_020',
    code: 'QC-2026-020',
    title: 'CS mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Linh Đàm',
    csmName: 'AnhNTT3',
    description: 'CS mặc sai đồng phục quy định',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'TK_03102026 CS AnhNTT3 mặc sai đồng phục theo quy định.jpg',
    evidenceImage: '/mocks/qc/TK_03102026 CS AnhNTT3 mặc sai đồng phục theo quy định.jpg',
    assignee: 'AnhNTT3',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-03T09:00:00Z',
    deadline: '2026-10-03T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_020_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: CS mặc sai đồng phục quy định', createdAt: '2026-10-03T09:00:00Z' },
    ],
  },
  {
    id: 'inc_021',
    code: 'QC-2026-021',
    title: 'Nhân sự không đeo bảng tên trong khi tiếp phụ huynh',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Vin SA1',
    csmName: 'ThuyLTM',
    description: 'Nhân sự không đeo bảng tên trong khi tiếp phụ huynh',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_03102026 Nhân sự sale không đeo nametag trong lúc tiếp phụ huynh.jpg',
    evidenceImage: '/mocks/qc/SA1_03102026 Nhân sự sale không đeo nametag trong lúc tiếp phụ huynh.jpg',
    assignee: 'ThuyLTM',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-03T09:00:00Z',
    deadline: '2026-10-03T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_021_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Nhân sự không đeo bảng tên trong khi tiếp phụ huynh', createdAt: '2026-10-03T09:00:00Z' },
    ],
  },
  {
    id: 'inc_022',
    code: 'QC-2026-022',
    title: 'Giáo viên để học sinh lớp Kindie đứng lên bàn nhảy',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    subject: 'Kindie',
    teacherName: 'Roman',
    description: 'Giáo viên để học sinh lớp Kindie đứng lên bàn nhảy',
    severity: 'high',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_05102026 Giáo viên để học sinh lớp Kindie đứng lên bàn nhảy.jpg',
    evidenceImage: '/mocks/qc/170NT_05102026 Giáo viên để học sinh lớp Kindie đứng lên bàn nhảy.jpg',
    assignee: 'Roman',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-05T09:00:00Z',
    deadline: '2026-10-05T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_022_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Giáo viên để học sinh lớp Kindie đứng lên bàn nhảy', createdAt: '2026-10-05T09:00:00Z' },
    ],
  },
  {
    id: 'inc_023',
    code: 'QC-2026-023',
    title: 'Trợ giảng lớp SA1_TA_00004 nhiều lần dùng điện thoại trong lớp học',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    teacherName: 'Trợ giảng (Vin SA1)',
    description: 'Trợ giảng lớp SA1_TA_00004 nhiều lần dùng điện thoại trong lớp học',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_05102026 Trợ giảng lớp SA1_TA_00004 nhiều lần dùng điện thoại trong lớp học.mp4',
    evidenceLink: '/mocks/qc/SA1_05102026 Trợ giảng lớp SA1_TA_00004 nhiều lần dùng điện thoại trong lớp học.mp4',
    assignee: 'Trợ giảng (Vin SA1)',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-05T09:00:00Z',
    deadline: '2026-10-05T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_023_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Trợ giảng lớp SA1_TA_00004 nhiều lần dùng điện thoại trong lớp học', createdAt: '2026-10-05T09:00:00Z' },
    ],
  },
  {
    id: 'inc_024',
    code: 'QC-2026-024',
    title: 'Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    teacherName: 'Đỗ Bảo Ngọc',
    description: 'Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59',
    severity: 'high',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'LĐ_06102026 Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59.mp4',
    evidenceLink: '/mocks/qc/LĐ_06102026 Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59.mp4',
    assignee: 'Đỗ Bảo Ngọc',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-06T09:00:00Z',
    deadline: '2026-10-06T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_024_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59', createdAt: '2026-10-06T09:00:00Z' },
    ],
  },
  {
    id: 'inc_025',
    code: 'QC-2026-025',
    title: 'Lớp SA1_TA_00011 giờ vào lớp 17:30 - 19:00 tuy nhiên GV 18:00 mới tới lớp dạy',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    teacherName: 'FATIH KESKIN',
    description: 'Lớp SA1_TA_00011 giờ vào lớp 17:30 - 19:00 tuy nhiên GV 18:00 mới tới lớp dạy',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'Lớp SA1_TA_00011 giờ vào lớp 17:30 - 19:00 tuy nhiên GV 18:00 mới tới lớp dạy.mp4',
    evidenceLink: '/mocks/qc/Lớp SA1_TA_00011 giờ vào lớp 17:30 - 19:00 tuy nhiên GV 18:00 mới tới lớp dạy.mp4',
    assignee: 'FATIH KESKIN',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-07T09:00:00Z',
    deadline: '2026-10-07T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_025_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp SA1_TA_00011 giờ vào lớp 17:30 - 19:00 tuy nhiên GV 18:00 mới tới lớp dạy', createdAt: '2026-10-07T09:00:00Z' },
    ],
  },
  {
    id: 'inc_026',
    code: 'QC-2026-026',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    csmName: 'HauTB',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_08102026 Sale HauTB mặc sai đồng phục theo quy định.jpg',
    evidenceImage: '/mocks/qc/170NT_08102026 Sale HauTB mặc sai đồng phục theo quy định.jpg',
    assignee: 'HauTB',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-07T09:00:00Z',
    deadline: '2026-10-07T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_026_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-10-07T09:00:00Z' },
    ],
  },
  {
    id: 'inc_027',
    code: 'QC-2026-027',
    title: 'Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:55 mới vào lớp dạy',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    teacherName: 'Trần Hồng Thiệp',
    description: 'Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:55 mới vào lớp dạy',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:55 mới vào lớp dạy.mp4',
    evidenceLink: '/mocks/qc/Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:55 mới vào lớp dạy.mp4',
    assignee: 'Trần Hồng Thiệp',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-07T09:00:00Z',
    deadline: '2026-10-07T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_027_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:55 mới vào lớp dạy', createdAt: '2026-10-07T09:00:00Z' },
    ],
  },
  {
    id: 'inc_028',
    code: 'QC-2026-028',
    title: 'CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    description: 'CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_08102026 CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30.mp4',
    evidenceLink: '/mocks/qc/170NT_08102026 CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30.mp4',
    assignee: 'ChiTTK3',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-08T09:00:00Z',
    deadline: '2026-10-08T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_028_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30', createdAt: '2026-10-08T09:00:00Z' },
    ],
  },
  {
    id: 'inc_029',
    code: 'QC-2026-029',
    title: 'Trợ giảng mặc sai đồng phục quy định',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    description: 'Trợ giảng mặc sai đồng phục quy định',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_09102026 Trợ giảng mặc sai đồng phục quy định.jpg',
    evidenceImage: '/mocks/qc/170NT_09102026 Trợ giảng mặc sai đồng phục quy định.jpg',
    assignee: 'Bộ phận Lễ tân & CSVC',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-09T09:00:00Z',
    deadline: '2026-10-09T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_029_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Trợ giảng mặc sai đồng phục quy định', createdAt: '2026-10-09T09:00:00Z' },
    ],
  },
  {
    id: 'inc_030',
    code: 'QC-2026-030',
    title: 'Bàn lễ tân để giấy và cốc bừa bộn trong khi tiếp phụ huynh',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    teacherName: 'Nhân sự vận hành (170 Nguyễn Tuân)',
    description: 'Bàn lễ tân để giấy và cốc bừa bộn trong khi tiếp phụ huynh',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_10102025 Bàn lễ tân để giấy và cốc bừa bộn trong khi tiếp phụ huynh.jpg',
    evidenceImage: '/mocks/qc/170NT_10102025 Bàn lễ tân để giấy và cốc bừa bộn trong khi tiếp phụ huynh.jpg',
    assignee: 'Nhân sự vận hành (170 Nguyễn Tuân)',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-10T09:00:00Z',
    deadline: '2026-10-10T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_030_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Bàn lễ tân để giấy và cốc bừa bộn trong khi tiếp phụ huynh', createdAt: '2026-10-10T09:00:00Z' },
    ],
  },
  {
    id: 'inc_031',
    code: 'QC-2026-031',
    title: 'Lớp LD_TA_00019 giờ vào lớp 17:45 - 19:15 tuy nhiên GV 18:07 mới vào lớp dạy',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    teacherName: 'FATIH KESKIN',
    description: 'Lớp LD_TA_00019 giờ vào lớp 17:45 - 19:15 tuy nhiên GV 18:07 mới vào lớp dạy',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 2,
    evidence: 'Lớp LD_TA_00019 giờ vào lớp 17:45 - 19:15 tuy nhiên GV 18:07 mới vào lớp dạy.mp4',
    evidenceLink: '/mocks/qc/Lớp LD_TA_00019 giờ vào lớp 17:45 - 19:15 tuy nhiên GV 18:07 mới vào lớp dạy.mp4',
    assignee: 'FATIH KESKIN',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-10T09:00:00Z',
    deadline: '2026-10-10T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_031_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TA_00019 giờ vào lớp 17:45 - 19:15 tuy nhiên GV 18:07 mới vào lớp dạy', createdAt: '2026-10-10T09:00:00Z' },
    ],
  },
  {
    id: 'inc_032',
    code: 'QC-2026-032',
    title: 'Lớp TK_TOAN_00002: TA Trúc Anh dùng điện thoại làm việc riêng trong lớp cả buổi',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Tonkin',
    teacherName: 'Trúc Anh',
    description: 'Lớp TK_TOAN_00002: TA Trúc Anh dùng điện thoại làm việc riêng trong lớp cả buổi',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'Lớp TK_TOAN_00002: TA Trúc Anh dùng điện thoại làm việc riêng trong lớp cả buổi.mp4',
    evidenceLink: '/mocks/qc/Lớp TK_TOAN_00002: TA Trúc Anh dùng điện thoại làm việc riêng trong lớp cả buổi.mp4',
    assignee: 'Trúc Anh',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-10T09:00:00Z',
    deadline: '2026-10-10T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_032_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp TK_TOAN_00002: TA Trúc Anh dùng điện thoại làm việc riêng trong lớp cả buổi', createdAt: '2026-10-10T09:00:00Z' },
    ],
  },
  {
    id: 'inc_033',
    code: 'QC-2026-033',
    title: 'Lớp LD_TOAN_00009 giờ vào lớp 17:30- 19:20 tuy nhiên GV 17:40 mới vào lớp dạy',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    teacherName: 'Trần Hồng Thiệp',
    description: 'Lớp LD_TOAN_00009 giờ vào lớp 17:30- 19:20 tuy nhiên GV 17:40 mới vào lớp dạy',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 2,
    evidence: 'Lớp LD_TOAN_00009 giờ vào lớp 17:30- 19:20 tuy nhiên GV 17:40 mới vào lớp dạy.mp4',
    evidenceLink: '/mocks/qc/Lớp LD_TOAN_00009 giờ vào lớp 17:30- 19:20 tuy nhiên GV 17:40 mới vào lớp dạy.mp4',
    assignee: 'Trần Hồng Thiệp',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-10T09:00:00Z',
    deadline: '2026-10-10T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_033_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00009 giờ vào lớp 17:30- 19:20 tuy nhiên GV 17:40 mới vào lớp dạy', createdAt: '2026-10-10T09:00:00Z' },
    ],
  },
  {
    id: 'inc_034',
    code: 'QC-2026-034',
    title: 'Nhân sự không đeo bảng tên trong khi tiếp phụ huynh',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: 'Tonkin',
    csmName: 'ThuyPT9',
    description: 'Nhân sự không đeo bảng tên trong khi tiếp phụ huynh',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 2,
    evidence: 'TK_11102026 Nhân sự không đeo name tag trong khi tiếp phụ huynh.jpg',
    evidenceImage: '/mocks/qc/TK_11102026 Nhân sự không đeo name tag trong khi tiếp phụ huynh.jpg',
    assignee: 'ThuyPT9',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-11T09:00:00Z',
    deadline: '2026-10-11T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_034_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Nhân sự không đeo bảng tên trong khi tiếp phụ huynh', createdAt: '2026-10-11T09:00:00Z' },
    ],
  },
  {
    id: 'inc_035',
    code: 'QC-2026-035',
    title: 'Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:57',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    teacherName: 'Đỗ Bảo Ngọc',
    description: 'Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:57',
    severity: 'high',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'LD_13102026 Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:57.mp4',
    evidenceLink: '/mocks/qc/LD_13102026 Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:57.mp4',
    assignee: 'Đỗ Bảo Ngọc',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-13T09:00:00Z',
    deadline: '2026-10-13T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_035_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00031 giờ 19:40 - 21:10 GV cho tan sớm từ 20:57', createdAt: '2026-10-13T09:00:00Z' },
    ],
  },
  {
    id: 'inc_036',
    code: 'QC-2026-036',
    title: 'Lớp LD_TOAN_00030 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    teacherName: 'Trần Hồng Thiệp',
    description: 'Lớp LD_TOAN_00030 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59',
    severity: 'high',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'LĐ_13102026 Lớp LD_TOAN_00030 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59.mp4',
    evidenceLink: '/mocks/qc/LĐ_13102026 Lớp LD_TOAN_00030 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59.mp4',
    assignee: 'Trần Hồng Thiệp',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-13T09:00:00Z',
    deadline: '2026-10-13T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_036_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00030 giờ 19:40 - 21:10 GV cho tan sớm từ 20:59', createdAt: '2026-10-13T09:00:00Z' },
    ],
  },
  {
    id: 'inc_037',
    code: 'QC-2026-037',
    title: 'Trợ giảng mặc sai đồng phục quy định',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    teacherName: 'Trợ giảng (Vin SA1)',
    description: 'Trợ giảng mặc sai đồng phục quy định',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_13102026 Trợ giảng mặc sai đồng phục quy định.jpg',
    evidenceImage: '/mocks/qc/SA1_13102026 Trợ giảng mặc sai đồng phục quy định.jpg',
    assignee: 'Trợ giảng (Vin SA1)',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-13T09:00:00Z',
    deadline: '2026-10-13T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_037_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Trợ giảng mặc sai đồng phục quy định', createdAt: '2026-10-13T09:00:00Z' },
    ],
  },
  {
    id: 'inc_038',
    code: 'QC-2026-038',
    title: 'Sale mặc sai đồng phục quy định',
    targetGroup: 'operations',
    criteria: 'staff_conduct',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    csmName: 'HauTB',
    description: 'Sale mặc sai đồng phục quy định',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_13102026 Sale mặc sai đồng phục quy định.jpg',
    evidenceImage: '/mocks/qc/170NT_13102026 Sale mặc sai đồng phục quy định.jpg',
    assignee: 'HauTB',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-13T09:00:00Z',
    deadline: '2026-10-13T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_038_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Sale mặc sai đồng phục quy định', createdAt: '2026-10-13T09:00:00Z' },
    ],
  },
  {
    id: 'inc_039',
    code: 'QC-2026-039',
    title: 'Lớp SA1_KINDIE_0003 GV mặc trang phục không phù hợp trong lớp học',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    classId: 'SA1_KINDIE_0003',
    className: 'SA1_KINDIE_0003',
    subject: 'Kindie',
    teacherName: 'Maria',
    description: 'Lớp SA1_KINDIE_0003 GV mặc trang phục không phù hợp trong lớp học',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_14102016 Lớp SA1_KINDIE_0003 GV mặc trang phục không phù hợp trong lớp học.jpg',
    evidenceImage: '/mocks/qc/SA1_14102016 Lớp SA1_KINDIE_0003 GV mặc trang phục không phù hợp trong lớp học.jpg',
    assignee: 'Maria',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-14T09:00:00Z',
    deadline: '2026-10-14T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_039_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp SA1_KINDIE_0003 GV mặc trang phục không phù hợp trong lớp học', createdAt: '2026-10-14T09:00:00Z' },
    ],
  },
  {
    id: 'inc_040',
    code: 'QC-2026-040',
    title: 'Lớp SA1_TA_00008 giờ 17:45 - 19:15 tuy nhiên GV 18:00 mới tới lớp',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    classId: 'SA1_TA_00008',
    className: 'SA1_TA_00008',
    subject: 'Tiếng Anh',
    teacherName: 'COVER_TA VINSA1',
    description: 'Lớp SA1_TA_00008 giờ 17:45 - 19:15 tuy nhiên GV 18:00 mới tới lớp',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_14102026 Lớp SA1_TA_00008 giờ 17:45 - 19:15 tuy nhiên GV 18:00 mới tới lớp.mp4',
    evidenceLink: '/mocks/qc/SA1_14102026 Lớp SA1_TA_00008 giờ 17:45 - 19:15 tuy nhiên GV 18:00 mới tới lớp.mp4',
    assignee: 'COVER_TA VINSA1',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-14T09:00:00Z',
    deadline: '2026-10-14T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_040_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp SA1_TA_00008 giờ 17:45 - 19:15 tuy nhiên GV 18:00 mới tới lớp', createdAt: '2026-10-14T09:00:00Z' },
    ],
  },
  {
    id: 'inc_041',
    code: 'QC-2026-041',
    title: 'Lớp TK_TOAN_00013 TA Trúc Anh dùng điện thoại liên tục trong giờ',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Tonkin',
    classId: 'TK_TOAN_00013',
    className: 'TK_TOAN_00013',
    subject: 'Toán tư duy',
    teacherName: 'Trúc Anh',
    description: 'Lớp TK_TOAN_00013 TA Trúc Anh dùng điện thoại liên tục trong giờ',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'TK_14102026 Lớp TK_TOAN_00013 TA Trúc Anh dùng điện thoại liên tục trong giờ.mp4',
    evidenceLink: '/mocks/qc/TK_14102026 Lớp TK_TOAN_00013 TA Trúc Anh dùng điện thoại liên tục trong giờ.mp4',
    assignee: 'Trúc Anh',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-14T09:00:00Z',
    deadline: '2026-10-14T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_041_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp TK_TOAN_00013 TA Trúc Anh dùng điện thoại liên tục trong giờ', createdAt: '2026-10-14T09:00:00Z' },
    ],
  },
  {
    id: 'inc_042',
    code: 'QC-2026-042',
    title: 'Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:56 mới vào lớp',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    classId: 'LD_TOAN_00018',
    className: 'LD_TOAN_00018',
    subject: 'Toán tư duy',
    teacherName: 'Trần Hồng Thiệp',
    description: 'Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:56 mới vào lớp',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'LD_14102026 Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:56 mới vào lớp.mp4',
    evidenceLink: '/mocks/qc/LD_14102026 Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:56 mới vào lớp.mp4',
    assignee: 'Trần Hồng Thiệp',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-14T09:00:00Z',
    deadline: '2026-10-14T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_042_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00018 giờ vào lớp 17:40 - 19:10 tuy nhiên GV 17:56 mới vào lớp', createdAt: '2026-10-14T09:00:00Z' },
    ],
  },
  {
    id: 'inc_043',
    code: 'QC-2026-043',
    title: 'Lớp SA1_TA_00001 TA dùng điện thoại liên tục trong giờ',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    classId: 'SA1_TA_00001',
    className: 'SA1_TA_00001',
    subject: 'Tiếng Anh',
    teacherName: 'Trợ giảng (SA1_TA_00001)',
    description: 'Lớp SA1_TA_00001 TA dùng điện thoại liên tục trong giờ',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_15102026 Lớp SA1_TA_00001 TA dùng điện thoại liên tục trong giờ.mp4',
    evidenceLink: '/mocks/qc/SA1_15102026 Lớp SA1_TA_00001 TA dùng điện thoại liên tục trong giờ.mp4',
    assignee: 'Trợ giảng (SA1_TA_00001)',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-15T09:00:00Z',
    deadline: '2026-10-15T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_043_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp SA1_TA_00001 TA dùng điện thoại liên tục trong giờ', createdAt: '2026-10-15T09:00:00Z' },
    ],
  },
  {
    id: 'inc_044',
    code: 'QC-2026-044',
    title: 'Lớp TK_TA_00001 giờ vào lớp 19:30 - 21:00 tuy nhiên 19:58 GV mới vào lớp',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Tonkin',
    classId: 'TK_TA_00001',
    className: 'TK_TA_00001',
    subject: 'Tiếng Anh',
    teacherName: 'Newway 3',
    description: 'Lớp TK_TA_00001 giờ vào lớp 19:30 - 21:00 tuy nhiên 19:58 GV mới vào lớp',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'TK_16102026 Lớp TK_TA_00001 giờ vào lớp 19:30 - 21:00 tuy nhiên 19:58 GV mới vào lớp.mp4',
    evidenceLink: '/mocks/qc/TK_16102026 Lớp TK_TA_00001 giờ vào lớp 19:30 - 21:00 tuy nhiên 19:58 GV mới vào lớp.mp4',
    assignee: 'Newway 3',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-16T09:00:00Z',
    deadline: '2026-10-16T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_044_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp TK_TA_00001 giờ vào lớp 19:30 - 21:00 tuy nhiên 19:58 GV mới vào lớp', createdAt: '2026-10-16T09:00:00Z' },
    ],
  },
  {
    id: 'inc_045',
    code: 'QC-2026-045',
    title: 'Bàn lễ tân để giấy và nước uống bừa bộn trong khung giờ tiếp phụ huynh',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    description: 'Bàn lễ tân để giấy và nước uống bừa bộn trong khung giờ tiếp phụ huynh',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: '170NT_16102026 Bàn lễ tân để giấy và nước uống bừa bộn trong khung giờ tiếp phụ huynh.jpg',
    evidenceImage: '/mocks/qc/170NT_16102026 Bàn lễ tân để giấy và nước uống bừa bộn trong khung giờ tiếp phụ huynh.jpg',
    assignee: 'ChiTTK3',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-16T09:00:00Z',
    deadline: '2026-10-16T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_045_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Bàn lễ tân để giấy và nước uống bừa bộn trong khung giờ tiếp phụ huynh', createdAt: '2026-10-16T09:00:00Z' },
    ],
  },
  {
    id: 'inc_046',
    code: 'QC-2026-046',
    title: 'Lớp TK_TOAN_00002 TA Trúc Anh dùng điện thoại liên tục trong giờ',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Tonkin',
    classId: 'TK_TOAN_00002',
    className: 'TK_TOAN_00002',
    subject: 'Toán tư duy',
    teacherName: 'Trúc Anh',
    description: 'Lớp TK_TOAN_00002 TA Trúc Anh dùng điện thoại liên tục trong giờ',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 2,
    evidence: 'TK_17102026 Lớp TK_TOAN_00002 TA Trúc Anh dùng điện thoại liên tục trong giờ.mp4',
    evidenceLink: '/mocks/qc/TK_17102026 Lớp TK_TOAN_00002 TA Trúc Anh dùng điện thoại liên tục trong giờ.mp4',
    assignee: 'Trúc Anh',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-17T09:00:00Z',
    deadline: '2026-10-17T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_046_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp TK_TOAN_00002 TA Trúc Anh dùng điện thoại liên tục trong giờ', createdAt: '2026-10-17T09:00:00Z' },
    ],
  },
  {
    id: 'inc_047',
    code: 'QC-2026-047',
    title: 'CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30',
    targetGroup: 'facility',
    criteria: 'five_star_service',
    source: 'manual',
    branch: '170 Nguyễn Tuân',
    description: 'CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 2,
    evidence: '170NT_18102026 CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30.mp4',
    evidenceLink: '/mocks/qc/170NT_18102026 CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30.mp4',
    assignee: 'ChiTTK3',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-18T09:00:00Z',
    deadline: '2026-10-18T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_047_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: CS không checklist cơ sở để tivi phòng học tầng 2 tự bật từ 12h trưa đến 17h30', createdAt: '2026-10-18T09:00:00Z' },
    ],
  },
  {
    id: 'inc_048',
    code: 'QC-2026-048',
    title: 'Lớp LD_TOAN_00001 giờ vào lớp 10:00 - 12:00 tuy nhiên 11:06 GV mới vào lớp dạy',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Linh Đàm',
    classId: 'LD_TOAN_00001',
    className: 'LD_TOAN_00001',
    subject: 'Toán tư duy',
    teacherName: 'Đỗ Bảo Ngọc',
    description: 'Lớp LD_TOAN_00001 giờ vào lớp 10:00 - 12:00 tuy nhiên 11:06 GV mới vào lớp dạy',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'LD_18102026 Lớp LD_TOAN_00001 giờ vào lớp 10:00 - 12:00 tuy nhiên 11:06 GV mới vào lớp dạy.mp4',
    evidenceLink: '/mocks/qc/LD_18102026 Lớp LD_TOAN_00001 giờ vào lớp 10:00 - 12:00 tuy nhiên 11:06 GV mới vào lớp dạy.mp4',
    assignee: 'Đỗ Bảo Ngọc',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-18T09:00:00Z',
    deadline: '2026-10-18T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_048_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp LD_TOAN_00001 giờ vào lớp 10:00 - 12:00 tuy nhiên 11:06 GV mới vào lớp dạy', createdAt: '2026-10-18T09:00:00Z' },
    ],
  },
  {
    id: 'inc_049',
    code: 'QC-2026-049',
    title: 'Lớp SA1_KINDIE_0004 giờ vào lớp 17:45 - 19h15 tuy nhiên 18:02 GV mới vào lớp',
    targetGroup: 'teacher',
    criteria: 'class_operations',
    source: 'manual',
    branch: 'Vin SA1',
    classId: 'SA1_KINDIE_0004',
    className: 'SA1_KINDIE_0004',
    subject: 'Kindie',
    teacherName: 'Newway 5',
    description: 'Lớp SA1_KINDIE_0004 giờ vào lớp 17:45 - 19h15 tuy nhiên 18:02 GV mới vào lớp',
    severity: 'low',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'SA1_19102026 Lớp SA1_KINDIE_0004 giờ vào lớp 17:45 - 19h15 tuy nhiên 18:02 GV mới vào lớp.mp4',
    evidenceLink: '/mocks/qc/SA1_19102026 Lớp SA1_KINDIE_0004 giờ vào lớp 17:45 - 19h15 tuy nhiên 18:02 GV mới vào lớp.mp4',
    assignee: 'Newway 5',
    issuedBy: 'Ban Đảm bảo Chất lượng (QC)',
    createdAt: '2026-10-19T09:00:00Z',
    deadline: '2026-10-19T18:00:00Z',
    comments: [],
    logs: [
      { id: 'log_049_1', userId: 'ins_01', userName: 'Ban QC Offline', action: 'Ghi nhận sự cố từ kiểm tra cơ sở / camera', details: 'Phát hiện: Lớp SA1_KINDIE_0004 giờ vào lớp 17:45 - 19h15 tuy nhiên 18:02 GV mới vào lớp', createdAt: '2026-10-19T09:00:00Z' },
    ],
  },
]

/* ─── Backwards Compatibility Helpers ───────────────────── */

export interface QcCheckEvent {
  id: string
  code: string
  name: string
  type: QcCheckType
  status: QcCheckStatus
  date: string
  branch: string
  inspectors: Inspector[]
  areas: string[]
  errors: QcIncident[]
  comments: QcComment[]
  logs: QcLog[]
  notes: string
  createdAt: string
  publishedAt?: string
  completedAt?: string
}

export const mockQcCheckEvents: QcCheckEvent[] = [
  {
    id: 'qc_compat_01',
    code: 'QC-2026-001',
    name: 'Tổng hợp sự cố cơ sở Nguyễn Tuân',
    type: 'daily',
    status: 'published',
    date: '2026-10-14',
    branch: 'RinoEdu Nguyễn Tuân',
    inspectors: [INSPECTOR_OPTIONS[0]],
    areas: ['Phòng A201', 'Phòng A203'],
    errors: mockQcIncidents
      .filter((e) => e.branch === 'RinoEdu Nguyễn Tuân')
      .map((e) => ({
        ...e,
        qcEventId: 'qc_compat_01',
        eventCode: 'QC-2026-001',
        eventName: 'Tổng hợp sự cố cơ sở Nguyễn Tuân',
        itemId: 'item_01',
        itemLabel: e.title,
        errorType: (e.targetGroup === 'teacher' ? 'personnel' : e.targetGroup === 'facility' ? 'facility' : 'process') as QcErrorType,
        requiresCorrectiveAction: true,
      })),
    comments: [],
    logs: [],
    notes: 'Tổng hợp sự cố trực tiếp.',
    createdAt: '2026-10-14T08:00:00',
  },
  {
    id: 'qc_compat_02',
    code: 'QC-2026-002',
    name: 'Tổng hợp sự cố cơ sở Linh Đàm',
    type: 'daily',
    status: 'published',
    date: '2026-10-14',
    branch: 'RinoEdu Linh Đàm',
    inspectors: [INSPECTOR_OPTIONS[1]],
    areas: ['Phòng B102', 'Sảnh chính'],
    errors: mockQcIncidents
      .filter((e) => e.branch === 'RinoEdu Linh Đàm')
      .map((e) => ({
        ...e,
        qcEventId: 'qc_compat_02',
        eventCode: 'QC-2026-002',
        eventName: 'Tổng hợp sự cố cơ sở Linh Đàm',
        itemId: 'item_02',
        itemLabel: e.title,
        errorType: (e.targetGroup === 'teacher' ? 'personnel' : e.targetGroup === 'facility' ? 'facility' : 'process') as QcErrorType,
        requiresCorrectiveAction: true,
      })),
    comments: [],
    logs: [],
    notes: 'Tổng hợp sự cố cơ sở Linh Đàm.',
    createdAt: '2026-10-14T08:00:00',
  },
]

export function getQcBranches(): string[] {
  return [...new Set(mockQcIncidents.map((e) => e.branch))].sort()
}

export function getQcCheckEvents(): QcCheckEvent[] {
  return mockQcCheckEvents
}
