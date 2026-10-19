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
  attendance: 'Điểm danh',
  student_care: 'Chăm sóc học viên',
  facility_quality: 'Chất lượng CSVC',
  feedback: 'Nhận xét học viên',
  pedagogy: 'Tác phong giảng dạy',
  safety_hygiene: 'An toàn & Vệ sinh',
}

export const QC_TARGET_GROUP_CRITERIA: Record<QcTargetGroup, QcEvaluationCriteria[]> = {
  teacher: ['attendance', 'pedagogy', 'feedback'],
  facility: ['facility_quality', 'safety_hygiene'],
  operations: ['student_care', 'attendance', 'feedback'],
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
    id: 'inc_01',
    code: 'QC-2026-001',
    title: 'Quá 30 phút sau ca học chưa hoàn tất điểm danh học viên',
    targetGroup: 'teacher',
    criteria: 'attendance',
    source: 'system',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-IEL-01',
    className: 'IELTS Intensive K24',
    subject: 'Tiếng Anh',
    sessionNumber: 3,
    sessionDate: '2026-10-14',
    roomId: 'Phòng A201',
    teacherId: 'tch_01',
    teacherName: 'Thầy Hoàng Minh',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Hệ thống tự động phát hiện lớp IELTS Intensive K24 kết thúc lúc 19:30 ngày 14/10 nhưng sau 30 phút vẫn chưa có thao tác chốt sổ điểm danh của giáo viên.',
    severity: 'high',
    status: 'open',
    recurrenceCount: 2,
    evidence: 'Ghi nhận tự động từ nhật ký hệ thống: Không có bản ghi điểm danh lúc 20:00.',
    evidenceImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
    evidenceLink: '',
    assignee: 'Thầy Hoàng Minh',
    issuedBy: 'Hệ thống tự động (Bot)',
    createdAt: '2026-10-14T20:00:00',
    deadline: '2026-10-15T12:00:00',
    closureMethod: 'system_auto',
    notes: 'Lỗi phát sinh tự động khi vi phạm thời gian quy định. Đã bị QC trả về lần 1 do chưa nhập lý do vắng.',
    remediationRounds: [
      {
        id: 'round_01_1',
        roundNumber: 1,
        submittedBy: 'Thầy Hoàng Minh',
        submittedAt: '2026-10-14T21:00:00',
        action: 'Đã bổ sung chốt sổ điểm danh bù trên ứng dụng quản lý lớp.',
        evidence: 'Ảnh chụp màn hình chốt danh sách học viên trên app.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
        preventiveAction: 'Đặt báo thức điện thoại 19h35 nhắc chốt sổ ngay khi tan lớp.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-14T22:00:00',
        reviewStatus: 'rejected',
        reviewNote: 'Kiểm tra thấy chưa nhập lý do vắng của 2 học sinh và thiếu nhận xét chuyên cần. Yêu cầu nhập đầy đủ trước 12h ngày mai.',
      },
      {
        id: 'round_01_2',
        roundNumber: 2,
        submittedBy: 'Thầy Hoàng Minh',
        submittedAt: '2026-10-15T08:30:00',
        action: 'Đã hoàn tất nhập nhận xét chi tiết 15 học viên và bổ sung giấy phép vắng của 2 bạn.',
        evidence: 'Ảnh chụp danh sách điểm danh và ghi chú phép của phụ huynh.',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600',
        preventiveAction: 'In sẵn phiếu theo dõi chuyên cần tại bàn giáo viên mỗi buổi học.',
      },
    ],
    comments: [
      {
        id: 'comm_01',
        userId: 'tch_01',
        userName: 'Thầy Hoàng Minh',
        userRole: 'Giáo viên',
        content: 'Cuối giờ học viên hỏi bài nhiều nên tôi về muộn và quên bấm xác nhận điểm danh trên app. Sẽ bổ sung ngay sáng nay.',
        createdAt: '2026-10-15T08:15:00',
      },
    ],
    logs: [
      {
        id: 'log_01',
        userId: 'system',
        userName: 'Hệ thống tự động',
        action: 'Tự động tạo sự cố',
        details: 'Phát hiện lớp học kết thúc 30 phút chưa có dữ liệu điểm danh.',
        createdAt: '2026-10-14T20:00:00',
      },
      {
        id: 'log_01_b',
        userId: 'tch_01',
        userName: 'Thầy Hoàng Minh',
        action: 'Báo cáo khắc phục lần 1',
        details: 'Đã bổ sung điểm danh bù trên app.',
        createdAt: '2026-10-14T21:00:00',
      },
      {
        id: 'log_01_c',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        action: 'Đánh giá Chưa đạt',
        details: 'Thiếu lý do vắng của 2 học sinh và nhận xét chuyên cần.',
        createdAt: '2026-10-14T22:00:00',
      },
      {
        id: 'log_01_d',
        userId: 'tch_01',
        userName: 'Thầy Hoàng Minh',
        action: 'Báo cáo khắc phục lần 2',
        details: 'Đã hoàn tất nhận xét và bổ sung lý do vắng.',
        createdAt: '2026-10-15T08:30:00',
      },
    ],
  },
  {
    id: 'inc_01_prev',
    code: 'QC-2026-001B',
    title: 'Không gửi báo cáo nhận xét học viên sau buổi học số 2',
    targetGroup: 'teacher',
    criteria: 'feedback',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-IEL-01',
    className: 'IELTS Intensive K24',
    subject: 'Tiếng Anh',
    sessionNumber: 2,
    sessionDate: '2026-10-10',
    roomId: 'Phòng A201',
    teacherId: 'tch_01',
    teacherName: 'Thầy Hoàng Minh',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Quy định trung tâm yêu cầu gửi nhận xét học viên trong vòng 12h sau ca học, giáo viên chưa gửi báo cáo buổi 2 cho phụ huynh.',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'Chưa có dữ liệu nhận xét buổi 2 trên cổng thông tin phụ huynh.',
    evidenceImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600',
    assignee: 'Thầy Hoàng Minh',
    issuedBy: 'Nguyễn Thị Mai (Tổ trưởng CM)',
    createdAt: '2026-10-11T09:00:00',
    deadline: '2026-10-11T18:00:00',
    correctiveAction: 'Đã hoàn thành gửi nhận xét chi tiết 15 học viên lên hệ thống.',
    correctiveEvidence: 'Toàn bộ 15 học sinh đã có nhận xét và đánh giá sao.',
    correctiveImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    completionDate: '2026-10-11T15:00:00',
    remediationRounds: [
      {
        id: 'round_01_p1',
        roundNumber: 1,
        submittedBy: 'Thầy Hoàng Minh',
        submittedAt: '2026-10-11T14:30:00',
        action: 'Đã hoàn tất gửi nhận xét chi tiết và đánh giá chuyên cần cho 15 học sinh.',
        evidence: 'Ảnh chụp màn hình cổng phụ huynh đã nhận nhận xét.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
        preventiveAction: 'Lên lịch soạn nhận xét ngay sau khi kết thúc buổi học.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-11T16:00:00',
        reviewStatus: 'approved',
        reviewNote: 'Đã kiểm tra nhận xét cá nhân hóa chất lượng tốt. Duyệt đạt và đóng lỗi.',
      },
    ],
    closureMethod: 'manual',
    closedBy: 'Nguyễn Thị Mai',
    closedAt: '2026-10-11T16:00:00',
    notes: 'Đã hoàn tất nghiệm thu và đóng sự cố.',
    comments: [],
    logs: [
      {
        id: 'log_09_a',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        action: 'Ghi nhận sự cố',
        details: 'Chưa gửi nhận xét học viên buổi 2.',
        createdAt: '2026-10-11T09:00:00',
      },
      {
        id: 'log_09_b',
        userId: 'tch_01',
        userName: 'Thầy Hoàng Minh',
        action: 'Báo cáo khắc phục',
        details: 'Đã hoàn tất nhận xét 15 học viên.',
        createdAt: '2026-10-11T14:30:00',
      },
      {
        id: 'log_09_c',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        action: 'Duyệt đạt & Đóng lỗi',
        details: 'Nhận xét chi tiết đạt yêu cầu.',
        createdAt: '2026-10-11T16:00:00',
      },
    ],
  },
  {
    id: 'inc_02',
    code: 'QC-2026-002',
    title: 'Quá 24 giờ sau buổi học đầu tiên chưa gọi điện chăm sóc học viên mới',
    targetGroup: 'operations',
    criteria: 'student_care',
    source: 'system',
    branch: 'RinoEdu Linh Đàm',
    classId: 'CLS-KID-02',
    className: 'Tiếng Anh Mầm Non K12',
    subject: 'Tiếng Anh',
    sessionNumber: 1,
    sessionDate: '2026-10-13',
    roomId: 'Phòng B102',
    teacherId: 'tch_02',
    teacherName: 'Cô Lê Thùy Dung',
    csmId: 'csm_02',
    csmName: 'Lê Thị Hương',
    description: 'Học viên mới Trần Bảo Nam hoàn thành buổi học đầu tiên ngày 13/10 nhưng sau 24h nhân viên CS phụ trách chưa ghi nhận cuộc gọi chăm sóc phụ huynh vào hệ thống.',
    severity: 'medium',
    status: 'correcting',
    recurrenceCount: 0,
    evidence: 'Trạng thái chăm sóc học viên mới vẫn ở trạng thái Chưa liên hệ sau 24h.',
    evidenceImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    assignee: 'Lê Thị Hương',
    issuedBy: 'Hệ thống tự động (Bot)',
    createdAt: '2026-10-14T18:00:00',
    deadline: '2026-10-15T18:00:00',
    correctiveAction: 'Đang liên hệ phụ huynh sau giờ hành chính vì ban ngày phụ huynh bận họp.',
    notes: 'Cần lưu ý gọi lại trước 20h.',
    comments: [],
    logs: [
      {
        id: 'log_02',
        userId: 'system',
        userName: 'Hệ thống tự động',
        action: 'Tự động tạo sự cố',
        details: 'Quá thời hạn SLA chăm sóc buổi đầu 24h.',
        createdAt: '2026-10-14T18:00:00',
      },
      {
        id: 'log_03',
        userId: 'csm_02',
        userName: 'Lê Thị Hương',
        action: 'Tiếp nhận khắc phục',
        details: 'Đã hẹn phụ huynh gọi lại lúc 19h30 tối nay.',
        createdAt: '2026-10-15T09:00:00',
      },
    ],
  },
  {
    id: 'inc_03',
    code: 'QC-2026-003',
    title: 'Nhận xét buổi học sao chép hàng loạt, thiếu phân tích cá nhân hóa',
    targetGroup: 'teacher',
    criteria: 'feedback',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-MATH-05',
    className: 'Toán Tư Duy Bồi Dưỡng T5',
    subject: 'Toán tư duy',
    sessionNumber: 4,
    sessionDate: '2026-10-13',
    roomId: 'Phòng A203',
    teacherId: 'tch_03',
    teacherName: 'Thầy Trần Quang Huy',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Kiểm tra ngẫu nhiên sổ liên lạc buổi 4 phát hiện 12/15 học sinh có nội dung nhận xét hoàn toàn trùng khớp nhau, không ghi rõ điểm mạnh/yếu theo từng em.',
    severity: 'high',
    status: 'corrected',
    recurrenceCount: 2,
    evidence: 'Ảnh chụp màn hình 5 phiếu nhận xét trên ứng dụng di động có nội dung giống hệt nhau từng câu chữ.',
    evidenceImage: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400',
    assignee: 'Thầy Trần Quang Huy',
    issuedBy: 'Nguyễn Thị Mai (Tổ trưởng chuyên môn)',
    createdAt: '2026-10-14T09:00:00',
    deadline: '2026-10-15T17:00:00',
    correctiveAction: 'Đã rà soát lại bài kiểm tra nhanh trên lớp và viết lại đầy đủ 15 nhận xét cá nhân hóa cho từng em theo thang 5 bậc tư duy.',
    correctiveEvidence: 'Đã cập nhật lại nội dung trên hệ thống sổ liên lạc điện tử vào lúc 11:30 ngày 15/10.',
    correctiveImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    completionDate: '2026-10-15T11:30:00',
    notes: 'Đã nộp minh chứng sửa, chờ Chuyên môn duyệt nghiệm thu.',
    comments: [
      {
        id: 'comm_02',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        userRole: 'Tổ trưởng chuyên môn',
        content: 'Yêu cầu thầy Huy nghiêm túc rút kinh nghiệm, phụ huynh lớp này rất quan tâm đến nhận xét từng buổi.',
        createdAt: '2026-10-14T09:30:00',
      },
    ],
    logs: [
      {
        id: 'log_04',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        action: 'Ghi nhận sự cố',
        details: 'Phát hiện nhận xét học sinh sao chép hàng loạt.',
        createdAt: '2026-10-14T09:00:00',
      },
      {
        id: 'log_05',
        userId: 'tch_03',
        userName: 'Thầy Trần Quang Huy',
        action: 'Báo cáo khắc phục',
        details: 'Đã viết lại toàn bộ nhận xét cá nhân hóa.',
        createdAt: '2026-10-15T11:30:00',
      },
    ],
  },
  {
    id: 'inc_04',
    code: 'QC-2026-004',
    title: 'Điều hòa phòng A201 chảy nước nhỏ giọt xuống dãy bàn học sinh',
    targetGroup: 'facility',
    criteria: 'facility_quality',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Tiếng Anh',
    roomId: 'Phòng A201',
    description: 'Dàn lạnh điều hòa số 2 bị nghẹt ống thoát nước ngưng, nước nhỏ thành giọt xuống bàn số 3 dãy ngoài cùng, gây nguy cơ trơn trượt và ướt sách vở học sinh.',
    severity: 'high',
    status: 'closed',
    recurrenceCount: 1,
    evidence: 'Ảnh chụp vũng nước trên mặt bàn và máng điều hòa ứ đọng nước.',
    evidenceImage: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400',
    assignee: 'Võ Minh Tuấn (Kỹ thuật cơ sở)',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-12T14:30:00',
    deadline: '2026-10-13T12:00:00',
    correctiveAction: 'Đã thông ống thoát nước bằng khí nén, vệ sinh dàn lạnh và lưới lọc bụi. Test chạy 45 phút không còn rò rỉ.',
    correctiveEvidence: 'Ảnh chụp dàn lạnh khô ráo sau khi xử lý và biên bản nghiệm thu kỹ thuật.',
    correctiveImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    completionDate: '2026-10-12T17:00:00',
    closureMethod: 'manual',
    closedBy: 'Trần Văn Kiên',
    closedAt: '2026-10-13T09:00:00',
    notes: 'Đã hoàn tất nghiệm thu và đóng lỗi.',
    remediationRounds: [
      {
        id: 'round_04_1',
        roundNumber: 1,
        submittedBy: 'Võ Minh Tuấn (Kỹ thuật cơ sở)',
        submittedAt: '2026-10-12T17:00:00',
        action: 'Đã thông ống thoát nước ngưng bằng khí nén, vệ sinh dàn lạnh và lưới lọc bụi. Đã chạy thử nghiệm 45 phút không còn rò rỉ.',
        evidence: 'Biên bản nghiệm thu kỹ thuật và ảnh chụp dàn lạnh khô ráo.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
        preventiveAction: 'Thêm hạng mục kiểm tra máng thoát nước vào checklist bảo trì 2 tuần/lần.',
        reviewedBy: 'Trần Văn Kiên',
        reviewedAt: '2026-10-13T09:00:00',
        reviewStatus: 'approved',
        reviewNote: 'Đã nghiệm thu hiện trường phòng A201 khô ráo, chạy êm. Duyệt đạt đóng sự cố.',
      },
    ],
    comments: [],
    logs: [
      {
        id: 'log_06',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Ghi nhận sự cố',
        details: 'Điều hòa phòng A201 chảy nước.',
        createdAt: '2026-10-12T14:30:00',
      },
      {
        id: 'log_07',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Duyệt đạt & Đóng sự cố',
        details: 'Kỹ thuật đã xử lý sạch sẽ, nghiệm thu đạt.',
        createdAt: '2026-10-13T09:00:00',
      },
    ],
  },
  {
    id: 'inc_05',
    code: 'QC-2026-005',
    title: 'Không có nhân viên trực đón trả học sinh tại sảnh lúc 17h15',
    targetGroup: 'operations',
    criteria: 'attendance',
    source: 'manual',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Tiếng Anh',
    roomId: 'Sảnh chính tầng 1',
    csmId: 'csm_03',
    csmName: 'Phạm Đức Thắng',
    description: 'Thanh tra đột xuất giờ cao điểm đón học sinh ca chiều lúc 17h15: Quầy lễ tân không có nhân viên CS trực, học sinh mầm non tự ý chạy vào thang máy mà không có người kèm.',
    severity: 'critical',
    status: 'not_met',
    recurrenceCount: 2,
    evidence: 'Ảnh chụp sảnh vắng lúc 17h15 hiển thị trên camera giám sát cơ sở.',
    evidenceImage: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400',
    assignee: 'Phạm Đức Thắng',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-13T17:20:00',
    deadline: '2026-10-14T12:00:00',
    correctiveAction: 'Nhân viên giải trình đi photo tài liệu khẩn cấp.',
    correctiveEvidence: 'Bản giải trình viết tay của nhân viên.',
    closureMethod: 'manual',
    notes: 'QC đánh giá giải trình chưa đạt yêu cầu vì giờ cao điểm bắt buộc phải có ít nhất 1 người cố định tại quầy đón trả.',
    remediationRounds: [
      {
        id: 'round_01',
        roundNumber: 1,
        submittedBy: 'Phạm Đức Thắng',
        submittedAt: '2026-10-13T17:35:00',
        action: 'Nhân viên giải trình đi photo tài liệu khẩn cấp.',
        evidence: 'Bản giải trình viết tay của nhân viên.',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
        preventiveAction: 'Phân công 2 nhân viên luân phiên trực chéo trong khung giờ 16h45 - 17h45.',
        reviewedBy: 'Trần Văn Kiên',
        reviewedAt: '2026-10-14T10:00:00',
        reviewStatus: 'rejected',
        reviewNote: 'Không chấp nhận giải trình đi photo trong khung giờ cao điểm đón học sinh mầm non. Đề nghị Giám đốc chi nhánh phân công lại ca trực và có phương án dự phòng.',
      },
      {
        id: 'round_02',
        roundNumber: 2,
        submittedBy: 'Phạm Đức Thắng',
        submittedAt: '2026-10-14T14:00:00',
        action: 'Đã lập lịch phân công trực đón trả kép (2 người/ca) có chữ ký phê duyệt của Giám đốc chi nhánh Linh Đàm.',
        evidence: 'Bản phân công ca trực niêm yết tại quầy lễ tân có chữ ký GĐ.',
        image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600',
        preventiveAction: 'Quy định không rời vị trí khi chưa có người bàn giao thay thế.',
        reviewedBy: 'Trần Văn Kiên',
        reviewedAt: '2026-10-14T16:30:00',
        reviewStatus: 'rejected',
        reviewNote: 'Lịch trực chưa có chữ ký cam kết của nhân viên trực ca 2. Yêu cầu bổ sung chữ ký đầy đủ trước 17h.',
      },
    ],
    comments: [
      {
        id: 'comm_03',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        userRole: 'Thanh tra viên',
        content: 'Không chấp nhận giải trình đi photo trong khung giờ cao điểm đón học sinh mầm non. Đề nghị Giám đốc chi nhánh phân công lại ca trực và có phương án dự phòng.',
        createdAt: '2026-10-14T10:00:00',
      },
    ],
    logs: [
      {
        id: 'log_08',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Ghi nhận sự cố',
        details: 'Không có nhân viên đón học viên lúc 17h15.',
        createdAt: '2026-10-13T17:20:00',
      },
      {
        id: 'log_09',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Đánh giá Chưa đạt',
        details: 'Giải trình không hợp lệ, yêu cầu lập phương án trực thay thế.',
        createdAt: '2026-10-14T10:00:00',
      },
    ],
  },
  {
    id: 'inc_05_b',
    code: 'QC-2026-005B',
    title: 'Quá 2 giờ chưa liên hệ phụ huynh xác nhận học viên mầm non nghỉ không báo trước',
    targetGroup: 'operations',
    criteria: 'student_care',
    source: 'manual',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Tiếng Anh',
    roomId: 'Quầy CSM tầng 1',
    csmId: 'csm_03',
    csmName: 'Phạm Đức Thắng',
    description: 'Học viên Nguyễn Tuấn Anh (lớp Tiếng Anh Mầm Non K12) vắng mặt không phép ca sáng 08h30, nhưng đến 11h00 nhân viên CSM chưa gọi điện hỏi thăm phụ huynh.',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 1,
    evidence: 'Sổ theo dõi vắng chưa có ghi chú lý do nghỉ của học sinh lúc 11h00.',
    evidenceImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600',
    assignee: 'Phạm Đức Thắng',
    issuedBy: 'Lê Thị Hạnh (Trưởng phòng CSM)',
    createdAt: '2026-10-15T11:15:00',
    deadline: '2026-10-15T15:00:00',
    closureMethod: 'manual',
    notes: 'Cần giải trình nguyên nhân chậm liên hệ và cập nhật tình hình học viên.',
    comments: [],
    logs: [
      {
        id: 'log_05_b1',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Ghi nhận sự cố',
        details: 'Chưa gọi điện phụ huynh học sinh nghỉ không phép.',
        createdAt: '2026-10-15T11:15:00',
      },
    ],
  },
  {
    id: 'inc_06',
    code: 'QC-2026-006',
    title: 'Thùng carton và bàn gãy che chắn hoàn toàn lối thoát hiểm tầng 3',
    targetGroup: 'facility',
    criteria: 'safety_hygiene',
    source: 'manual',
    branch: 'RinoEdu Smart City',
    subject: 'Toán tư duy',
    roomId: 'Hành lang & Thoát hiểm tầng 3',
    description: 'Bộ phận hành chính để 6 thùng carton sách cũ và 2 bàn gãy chắn ngang cửa thoát hiểm tầng 3, khoảng hở còn lại dưới 40cm, vi phạm nghiêm trọng an toàn PCCC.',
    severity: 'critical',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Ảnh chụp cửa thoát hiểm bị chắn kín bởi các kiện hàng.',
    evidenceImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    assignee: 'Nguyễn Văn Tùng (Quản trị cơ sở)',
    issuedBy: 'Lê Thị Hạnh (Quản lý chất lượng)',
    createdAt: '2026-10-11T10:00:00',
    deadline: '2026-10-11T14:00:00',
    correctiveAction: 'Đã huy động dọn dẹp toàn bộ thùng carton về kho dưới tầng hầm, lối thoát hiểm đã thông thoáng 100%.',
    correctiveEvidence: 'Ảnh chụp lối thoát hiểm thông thoáng, không còn bất kỳ vật cản nào.',
    correctiveImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    completionDate: '2026-10-11T11:45:00',
    closureMethod: 'manual',
    closedBy: 'Lê Thị Hạnh',
    closedAt: '2026-10-11T13:00:00',
    notes: 'Đã đóng trong ngày do mức độ nghiêm trọng.',
    comments: [],
    logs: [
      {
        id: 'log_10',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Ghi nhận sự cố khẩn cấp',
        details: 'Lối thoát hiểm tầng 3 bị chắn.',
        createdAt: '2026-10-11T10:00:00',
      },
      {
        id: 'log_11',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Nghiệm thu & Đóng sự cố',
        details: 'Đã dọn dẹp sạch sẽ đúng tiêu chuẩn an toàn.',
        createdAt: '2026-10-11T13:00:00',
      },
    ],
  },
  {
    id: 'inc_07',
    code: 'QC-2026-007',
    title: 'Giáo viên đến muộn 15 phút, không mang giáo án giảng dạy',
    targetGroup: 'teacher',
    criteria: 'pedagogy',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-ENG-03',
    className: 'Tiếng Anh Giao Tiếp E3',
    subject: 'Tiếng Anh',
    sessionNumber: 5,
    sessionDate: '2026-10-14',
    roomId: 'Phòng A101',
    teacherId: 'tch_04',
    teacherName: 'Cô Hoàng Thu Thảo',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Ca học 18h00 nhưng đến 18h15 giáo viên mới có mặt. Khi vào lớp không có slide bài giảng và giáo án in sẵn, phải dùng sách photo của học sinh.',
    severity: 'high',
    status: 'open',
    recurrenceCount: 2,
    evidence: 'Biên bản ghi nhận dự giờ đột xuất và log quẹt thẻ ra vào lúc 18h14.',
    evidenceImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600',
    assignee: 'Cô Hoàng Thu Thảo',
    issuedBy: 'Nguyễn Thị Mai (Tổ trưởng chuyên môn)',
    createdAt: '2026-10-14T18:20:00',
    deadline: '2026-10-15T12:00:00',
    notes: 'Đã bị trả về lần 1 do cần dạy bù 15 phút và cam kết tác phong sư phạm.',
    remediationRounds: [
      {
        id: 'round_07_1',
        roundNumber: 1,
        submittedBy: 'Cô Hoàng Thu Thảo',
        submittedAt: '2026-10-15T09:00:00',
        action: 'Xe máy bị hỏng săm đột xuất trên đường Nguyễn Trãi nên đến trễ 15 phút. Giáo án đã in bổ sung sau ca học.',
        evidence: 'Hóa đơn sửa xe máy và bản in giáo án có ký tên.',
        image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600',
        preventiveAction: 'Chủ động di chuyển sớm hơn 30 phút vào giờ cao điểm.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-15T11:00:00',
        reviewStatus: 'rejected',
        reviewNote: 'Đến muộn 15 phút làm hụt thời lượng buổi học của 12 học sinh. Yêu cầu cô Thảo dạy bù 15 phút vào cuối buổi tới và viết bản cam kết tác phong.',
      },
    ],
    comments: [],
    logs: [
      {
        id: 'log_12',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        action: 'Ghi nhận sự cố',
        details: 'Giáo viên đi muộn và thiếu giáo án giảng dạy.',
        createdAt: '2026-10-14T18:20:00',
      },
      {
        id: 'log_12_b',
        userId: 'tch_04',
        userName: 'Cô Hoàng Thu Thảo',
        action: 'Báo cáo giải trình lần 1',
        details: 'Gửi hóa đơn sửa xe và bản in giáo án.',
        createdAt: '2026-10-15T09:00:00',
      },
      {
        id: 'log_12_c',
        userId: 'ins_04',
        userName: 'Nguyễn Thị Mai',
        action: 'Đánh giá Chưa đạt',
        details: 'Yêu cầu dạy bù 15 phút và gửi bản cam kết tác phong.',
        createdAt: '2026-10-15T11:00:00',
      },
    ],
  },
  {
    id: 'inc_08',
    code: 'QC-2026-008',
    title: 'Máy chiếu phòng B102 mờ sọc ngang, học viên hàng cuối không nhìn rõ',
    targetGroup: 'facility',
    criteria: 'facility_quality',
    source: 'manual',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Tiếng Anh',
    roomId: 'Phòng B102',
    description: 'Máy chiếu Panasonic phòng B102 bị mờ và xuất hiện nhiều sọc ngang nhấp nháy, học viên ngồi dãy sau không đọc được nội dung chữ trên slide.',
    severity: 'medium',
    status: 'correcting',
    recurrenceCount: 0,
    evidence: 'Ảnh chụp màn chiếu phòng B102 bị vỡ màu và sọc ngang.',
    evidenceImage: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400',
    assignee: 'Võ Minh Tuấn (Kỹ thuật cơ sở)',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-15T09:15:00',
    deadline: '2026-10-16T17:00:00',
    correctiveAction: 'Đang kiểm tra dây cáp HDMI và đặt bóng đèn chiếu thay thế.',
    notes: 'Dự kiến hoàn thành trong ngày mai.',
    comments: [],
    logs: [
      {
        id: 'log_13',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Ghi nhận sự cố',
        details: 'Máy chiếu phòng B102 bị mờ sọc.',
        createdAt: '2026-10-15T09:15:00',
      },
    ],
  },
  {
    id: 'inc_09',
    code: 'QC-2026-009',
    title: 'Hồ sơ nghiệm thu an toàn PCCC quý 3 chưa cập nhật chữ ký thẩm duyệt',
    targetGroup: 'operations',
    criteria: 'safety_hygiene',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    subject: 'Tiếng Anh',
    roomId: 'Phòng Quản lý cơ sở',
    description: 'Biên bản kiểm tra an toàn PCCC định kỳ quý 3 tại cơ sở Nguyễn Tuân chưa có xác nhận và chữ ký của kiểm tra viên phụ trách.',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 0,
    evidence: 'Biên bản bản cứng trong sổ lưu hồ sơ hành chính thiếu chữ ký trang 3.',
    evidenceImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600',
    assignee: 'Trần Văn Kiên',
    issuedBy: 'Lê Thị Hạnh (Quản lý chất lượng)',
    createdAt: '2026-10-15T08:30:00',
    deadline: '2026-10-16T17:00:00',
    notes: 'Cần hoàn tất ký số và lưu kho trước ngày mai.',
    comments: [],
    logs: [
      {
        id: 'log_14',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Ghi nhận sự cố',
        details: 'Hồ sơ PCCC quý 3 thiếu chữ ký thẩm duyệt.',
        createdAt: '2026-10-15T08:30:00',
      },
    ],
  },
  {
    id: 'inc_10',
    code: 'QC-2026-010',
    title: 'Chưa đối soát danh mục checklist bàn giao ca trực vận hành cuối tuần',
    targetGroup: 'operations',
    criteria: 'attendance',
    source: 'manual',
    branch: 'RinoEdu Linh Đàm',
    subject: 'Toán tư duy',
    roomId: 'Sảnh tiếp đón',
    description: 'Báo cáo bàn giao ca trực vận hành chủ nhật chưa có xác nhận hoàn thành kiểm tra niêm phong phòng học và kiểm kê tài sản cơ sở.',
    severity: 'low',
    status: 'correcting',
    recurrenceCount: 0,
    evidence: 'Phiếu bàn giao ca trực trên Google Drive để trống phần nhận xét và ký nhận.',
    assignee: 'Trần Văn Kiên',
    issuedBy: 'Phạm Thanh Tùng (Giám đốc chi nhánh)',
    createdAt: '2026-10-14T19:00:00',
    deadline: '2026-10-16T12:00:00',
    correctiveAction: 'Đang liên hệ trưởng ca trực để đối chiếu danh mục tài sản và ký xác nhận bù.',
    notes: 'Đã nhắc nhở ca trực thực hiện đúng quy trình bàn giao.',
    comments: [],
    logs: [
      {
        id: 'log_15',
        userId: 'ins_03',
        userName: 'Phạm Thanh Tùng',
        action: 'Ghi nhận sự cố',
        details: 'Thiếu checklist bàn giao ca trực cuối tuần.',
        createdAt: '2026-10-14T19:00:00',
      },
    ],
  },
  {
    id: 'inc_11',
    code: 'QC-2026-011',
    title: 'Ghi nhận nhầm lẫn phòng học B201 chưa bật điều hòa trước ca học',
    targetGroup: 'facility',
    criteria: 'facility_quality',
    source: 'manual',
    branch: 'RinoEdu Smart City',
    subject: 'STEAM',
    roomId: 'Phòng B201',
    description: 'Báo cáo lúc đầu ghi nhận điều hòa không hoạt động, tuy nhiên sau khi kiểm tra lại thì lớp học được điều chuyển sang phòng Lab B204 theo lịch phân ca đã duyệt.',
    severity: 'low',
    status: 'cancelled',
    recurrenceCount: 0,
    evidence: 'Biên bản đính chính của kiểm tra viên và lịch điều chuyển phòng thực tế.',
    assignee: 'Tổ IT CSVC',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-12T14:00:00',
    closureMethod: 'manual',
    closedBy: 'Trần Văn Kiên',
    closedAt: '2026-10-12T14:30:00',
    notes: 'Sự cố đã được hủy do ghi nhận nhầm lẫn thông tin cơ sở phòng học.',
    comments: [],
    logs: [
      {
        id: 'log_16',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Hủy ghi nhận sự cố',
        details: 'Hủy do phát hiện nhầm phòng sang phòng Lab B204.',
        createdAt: '2026-10-12T14:30:00',
      },
    ],
  },
  {
    id: 'inc_12',
    code: 'QC-2026-012',
    title: 'Nộp sổ điểm danh và phiếu đánh giá muộn ca sáng',
    targetGroup: 'teacher',
    criteria: 'attendance',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-MATH-05',
    className: 'Toán Tư Duy Bồi Dưỡng T5',
    subject: 'Toán tư duy',
    sessionNumber: 3,
    sessionDate: '2026-10-10',
    roomId: 'Phòng A203',
    teacherId: 'tch_03',
    teacherName: 'Thầy Trần Quang Huy',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Giáo viên nộp sổ điểm danh muộn 45 phút sau khi kết thúc ca học sáng ngày 10/10.',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Log hệ thống ghi nhận thời gian bấm hoàn thành lúc 12:45.',
    assignee: 'Thầy Trần Quang Huy',
    issuedBy: 'Nguyễn Thị Mai',
    createdAt: '2026-10-10T13:00:00',
    deadline: '2026-10-11T12:00:00',
    correctiveAction: 'Đã hoàn tất cập nhật danh sách học viên vắng có phép và gửi tin nhắn Zalo cho phụ huynh.',
    closureMethod: 'manual',
    closedBy: 'Nguyễn Thị Mai',
    closedAt: '2026-10-11T10:00:00',
    notes: 'Đã hoàn tất giải trình và đóng nghiệm thu.',
    comments: [],
    logs: [
      {
        id: 'log_17',
        userId: 'tch_03',
        userName: 'Thầy Trần Quang Huy',
        action: 'Nộp giải trình',
        details: 'Đã cập nhật bù danh sách học viên.',
        createdAt: '2026-10-10T16:00:00',
      },
    ],
  },
  {
    id: 'inc_13',
    code: 'QC-2026-013',
    title: 'Quên mang thẻ giáo viên và đồng phục chưa chuẩn quy định',
    targetGroup: 'teacher',
    criteria: 'pedagogy',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-IEL-01',
    className: 'IELTS Intensive K24',
    subject: 'Tiếng Anh',
    sessionNumber: 2,
    sessionDate: '2026-10-11',
    roomId: 'Phòng A201',
    teacherId: 'tch_01',
    teacherName: 'Thầy Hoàng Minh',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Dự giờ đột xuất phát hiện giáo viên mặc áo phông không cổ và không đeo thẻ chức danh.',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Ảnh chụp ghi nhận của thanh tra viên ca 17:30.',
    assignee: 'Thầy Hoàng Minh',
    issuedBy: 'Lê Thị Hạnh',
    createdAt: '2026-10-11T17:45:00',
    deadline: '2026-10-12T12:00:00',
    correctiveAction: 'Đã nhận áo đồng phục sơ mi trung tâm bổ sung tại quầy lễ tân và cam kết mặc đúng quy chuẩn từ các buổi sau.',
    closureMethod: 'manual',
    closedBy: 'Lê Thị Hạnh',
    closedAt: '2026-10-12T09:00:00',
    notes: 'Đã nhắc nhở và đóng sự cố.',
    comments: [],
    logs: [],
  },
  {
    id: 'inc_14',
    code: 'QC-2026-014',
    title: 'Chưa cập nhật phản hồi kết quả học tập tuần của học viên',
    targetGroup: 'operations',
    criteria: 'feedback',
    source: 'manual',
    branch: 'RinoEdu Linh Đàm',
    classId: 'CLS-KID-02',
    className: 'Tiếng Anh Mầm Non K12',
    subject: 'Tiếng Anh',
    sessionNumber: 2,
    sessionDate: '2026-10-14',
    roomId: 'Phòng B102',
    csmId: 'csm_02',
    csmName: 'Lê Thị Hương',
    description: 'Chuyên viên CSM chưa cập nhật tổng hợp kết quả tuần 2 của 4 bé lớp Mầm non K12 lên hệ thống báo cáo phụ huynh.',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 0,
    evidence: 'Bảng theo dõi tiến độ tuần thiếu dữ liệu tuần 2.',
    assignee: 'Lê Thị Hương',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-15T10:00:00',
    deadline: '2026-10-16T18:00:00',
    notes: 'Cần bổ sung hoàn tất trước buổi học tiếp theo.',
    comments: [],
    logs: [],
  },
  {
    id: 'inc_15',
    code: 'QC-2026-015',
    title: 'Không gửi bài tập về nhà và dặn dò sau ca học',
    targetGroup: 'teacher',
    criteria: 'pedagogy',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-ENG-03',
    className: 'Tiếng Anh Giao Tiếp E3',
    subject: 'Tiếng Anh',
    sessionNumber: 6,
    sessionDate: '2026-10-15',
    roomId: 'Phòng A101',
    teacherId: 'tch_04',
    teacherName: 'Cô Hoàng Thu Thảo',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Sau ca học 18h00-19h30, giáo viên không gửi tóm tắt bài giảng và bài tập về nhà lên nhóm phụ huynh theo quy định.',
    severity: 'medium',
    status: 'correcting',
    recurrenceCount: 2,
    evidence: 'Biên bản kiểm tra tin nhắn nhóm lớp ngày 15/10/2026.',
    assignee: 'Cô Hoàng Thu Thảo',
    issuedBy: 'Nguyễn Thị Mai (Tổ trưởng chuyên môn)',
    createdAt: '2026-10-15T20:00:00',
    deadline: '2026-10-16T12:00:00',
    remediationRounds: [
      {
        id: 'round_15_1',
        roundNumber: 1,
        submittedBy: 'Cô Hoàng Thu Thảo',
        submittedAt: '2026-10-16T08:00:00',
        action: 'Đã gửi file PDF bài tập vào nhóm chat Zalo của lớp.',
        evidence: 'Ảnh chụp màn hình nhóm chat phụ huynh.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-16T09:30:00',
        reviewStatus: 'rejected',
        reviewNote: 'File PDF gửi bị lỗi font chữ và thiếu hạn nộp bài. Yêu cầu gửi lại bản chuẩn và ghi rõ hạn nộp.',
      },
      {
        id: 'round_15_2',
        roundNumber: 2,
        submittedBy: 'Cô Hoàng Thu Thảo',
        submittedAt: '2026-10-16T10:15:00',
        action: 'Đã tạo link Google Drive chia sẻ tài liệu bài tập tự luận và trắc nghiệm.',
        evidence: 'Link Google Drive bài tập gửi trong nhóm lớp.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-16T11:00:00',
        reviewStatus: 'rejected',
        reviewNote: 'Link Google Drive bị khóa quyền truy cập, phụ huynh không mở được. Yêu cầu mở quyền xem công khai cho bất kỳ ai có liên kết.',
      },
    ],
    comments: [],
    logs: [],
  },
  {
    id: 'inc_16',
    code: 'QC-2026-016',
    title: 'Không cập nhật điểm thi định kỳ giữa kỳ đúng hạn',
    targetGroup: 'teacher',
    criteria: 'pedagogy',
    source: 'system',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-ENG-04',
    className: 'Tiếng Anh Giao Tiếp B1',
    subject: 'Tiếng Anh',
    sessionNumber: 10,
    sessionDate: '2026-10-12',
    roomId: 'Phòng A102',
    teacherId: 'tch_04',
    teacherName: 'Cô Hoàng Thu Thảo',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Hệ thống tự động phát hiện quá hạn nhập điểm thi giữa kỳ 48 giờ chưa có dữ liệu bảng điểm của 14 học sinh.',
    severity: 'high',
    status: 'corrected',
    recurrenceCount: 1,
    evidence: 'Log hệ thống LMS: Bảng điểm trống lúc 12:00 ngày 14/10/2026.',
    assignee: 'Cô Hoàng Thu Thảo',
    issuedBy: 'Hệ thống tự động (Bot)',
    createdAt: '2026-10-14T12:05:00',
    deadline: '2026-10-15T18:00:00',
    remediationRounds: [
      {
        id: 'round_16_1',
        roundNumber: 1,
        submittedBy: 'Cô Hoàng Thu Thảo',
        submittedAt: '2026-10-15T16:00:00',
        action: 'Đã hoàn tất chấm bài và nhập đầy đủ điểm số cùng lời nhận xét cho 14 học sinh lên hệ thống LMS.',
        evidence: 'Bảng điểm xuất từ hệ thống có chữ ký xác nhận.',
        preventiveAction: 'Lên lịch chấm bài ngay trong ngày diễn ra bài thi để tránh dồn việc.',
      },
    ],
    comments: [],
    logs: [],
  },
  {
    id: 'inc_17',
    code: 'QC-2026-017',
    title: 'Không kiểm tra giáo cụ và âm thanh trước giờ học',
    targetGroup: 'teacher',
    criteria: 'facility_quality',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-ENG-03',
    className: 'Tiếng Anh Giao Tiếp E3',
    subject: 'Tiếng Anh',
    sessionNumber: 3,
    sessionDate: '2026-10-10',
    roomId: 'Phòng A101',
    teacherId: 'tch_04',
    teacherName: 'Cô Hoàng Thu Thảo',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Bắt đầu buổi học nhưng loa bluetooth hết pin và micro không có tiếng, làm gián đoạn buổi học 10 phút.',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Biên bản sự cố kỹ thuật phòng học ngày 10/10/2026.',
    assignee: 'Cô Hoàng Thu Thảo',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-10T18:15:00',
    deadline: '2026-10-11T12:00:00',
    remediationRounds: [
      {
        id: 'round_17_1',
        roundNumber: 1,
        submittedBy: 'Cô Hoàng Thu Thảo',
        submittedAt: '2026-10-11T09:00:00',
        action: 'Đã cắm sạc pin đầy đủ và test âm thanh trước giờ lên lớp 15 phút.',
        evidence: 'Nhật ký kiểm tra thiết bị phòng học có chữ ký nhân viên kỹ thuật.',
        reviewedBy: 'Trần Văn Kiên',
        reviewedAt: '2026-10-11T11:00:00',
        reviewStatus: 'approved',
        reviewNote: 'Đạt yêu cầu. Đã kiểm tra lại thiết bị hoạt động tốt.',
      },
    ],
    comments: [],
    logs: [],
  },
  {
    id: 'inc_18',
    code: 'QC-2026-018',
    title: 'Chậm phản hồi tin nhắn hỏi bài của phụ huynh trên Zalo',
    targetGroup: 'operations',
    criteria: 'student_care',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    csmId: 'csm_03',
    csmName: 'Phạm Đức Thắng',
    description: 'Phụ huynh học sinh Nguyễn An Nhi nhắn hỏi về bài thi thử lúc 09h00 sáng nhưng đến 17h00 mới nhận được phản hồi (quá quy định 2 giờ).',
    severity: 'medium',
    status: 'correcting',
    recurrenceCount: 1,
    evidence: 'Ảnh chụp màn hình tin nhắn Zalo kênh CSKH tiếp nhận.',
    assignee: 'Phạm Đức Thắng',
    issuedBy: 'Nguyễn Thị Mai',
    createdAt: '2026-10-15T17:30:00',
    deadline: '2026-10-16T12:00:00',
    remediationRounds: [
      {
        id: 'round_18_1',
        roundNumber: 1,
        submittedBy: 'Phạm Đức Thắng',
        submittedAt: '2026-10-16T08:30:00',
        action: 'Đã gọi điện trực tiếp xin lỗi phụ huynh và giải thích chi tiết lộ trình thi thử.',
        evidence: 'Ghi âm cuộc gọi và phụ huynh đã hài lòng.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-16T10:00:00',
        reviewStatus: 'rejected',
        reviewNote: 'Chưa cập nhật nội dung giải quyết lên thẻ học viên trên phần mềm CRM.',
      },
      {
        id: 'round_18_2',
        roundNumber: 2,
        submittedBy: 'Phạm Đức Thắng',
        submittedAt: '2026-10-16T11:00:00',
        action: 'Đã tạo ghi chú tương tác hỗ trợ phụ huynh trên CRM.',
        evidence: 'Mã tương tác CRM #99214.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-16T11:45:00',
        reviewStatus: 'rejected',
        reviewNote: 'Ghi nhầm tên học sinh sang lớp khác. Yêu cầu kiểm tra lại đúng học viên Nguyễn An Nhi.',
      },
    ],
    comments: [],
    logs: [],
  },
  {
    id: 'inc_19',
    code: 'QC-2026-019',
    title: 'Quên bàn giao sổ theo dõi xe bus học sinh ca chiều',
    targetGroup: 'operations',
    criteria: 'safety_hygiene',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    csmId: 'csm_03',
    csmName: 'Phạm Đức Thắng',
    description: 'Nhân viên trực sảnh không ký bàn giao danh sách học sinh đi xe tuyến số 3 cho tài xế trước khi xe xuất bến.',
    severity: 'high',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Biên bản bàn giao xe tuyến thiếu chữ ký xác nhận ngày 12/10/2026.',
    assignee: 'Phạm Đức Thắng',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-12T17:15:00',
    deadline: '2026-10-13T12:00:00',
    remediationRounds: [
      {
        id: 'round_19_1',
        roundNumber: 1,
        submittedBy: 'Phạm Đức Thắng',
        submittedAt: '2026-10-13T09:00:00',
        action: 'Đã rà soát điểm danh bù và lập checklist ký bàn giao bắt buộc trước mỗi chuyến xe.',
        evidence: 'Checklist bàn giao mẫu mới có ký duyệt của quản lý cơ sở.',
        reviewedBy: 'Trần Văn Kiên',
        reviewedAt: '2026-10-13T11:00:00',
        reviewStatus: 'approved',
        reviewNote: 'Đã kiểm tra quy trình bàn giao mới, đạt tiêu chuẩn an toàn.',
      },
    ],
    comments: [],
    logs: [],
  },
  {
    id: 'inc_20',
    code: 'QC-2026-020',
    title: 'Quên điểm danh học viên trên ứng dụng trước ca học',
    targetGroup: 'teacher',
    criteria: 'attendance',
    source: 'system',
    branch: 'RinoEdu Nguyễn Tuân',
    classId: 'CLS-ENG-03',
    className: 'Tiếng Anh Giao Tiếp E3',
    subject: 'Tiếng Anh',
    sessionNumber: 1,
    sessionDate: '2026-10-05',
    roomId: 'Phòng A101',
    teacherId: 'tch_04',
    teacherName: 'Cô Hoàng Thu Thảo',
    csmId: 'csm_01',
    csmName: 'Nguyễn Thị Mai',
    description: 'Hệ thống tự động phát hiện lớp E3 đã vào học 30 phút nhưng giáo viên chưa bấm điểm danh học viên trên app điểm danh chuyên cần.',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Log hệ thống: Chưa có bản ghi điểm danh lúc 18:30 ngày 05/10/2026.',
    assignee: 'Cô Hoàng Thu Thảo',
    issuedBy: 'Hệ thống tự động (Bot)',
    createdAt: '2026-10-05T18:35:00',
    deadline: '2026-10-06T09:00:00',
    remediationRounds: [
      {
        id: 'round_20_1',
        roundNumber: 1,
        submittedBy: 'Cô Hoàng Thu Thảo',
        submittedAt: '2026-10-05T20:00:00',
        action: 'Đã hoàn tất điểm danh bù cho 12/12 học sinh và ghi rõ lý do mạng wifi phòng học chập chờn.',
        evidence: 'Bản chụp màn hình app điểm danh đã đồng bộ 100%.',
        reviewedBy: 'Nguyễn Thị Mai',
        reviewedAt: '2026-10-06T08:30:00',
        reviewStatus: 'approved',
        reviewNote: 'Đạt yêu cầu. Đã kiểm tra dữ liệu điểm danh đầy đủ.',
      },
    ],
    closureMethod: 'manual',
    closedBy: 'Nguyễn Thị Mai',
    closedAt: '2026-10-06T08:30:00',
    comments: [],
    logs: [],
  },
  {
    id: 'inc_21',
    code: 'QC-2026-021',
    title: 'Chưa cập nhật kết quả khảo sát sự hài lòng phụ huynh tuần 1',
    targetGroup: 'operations',
    criteria: 'student_care',
    source: 'manual',
    branch: 'RinoEdu Nguyễn Tuân',
    csmId: 'csm_03',
    csmName: 'Phạm Đức Thắng',
    description: 'Báo cáo tổng kết tuần 1 thiếu dữ liệu NPS và 5 ý kiến phản ánh của phụ huynh khối mầm non.',
    severity: 'low',
    status: 'closed',
    recurrenceCount: 0,
    evidence: 'Bảng theo dõi khảo sát NPS tuần 1 còn trống cột phản hồi.',
    assignee: 'Phạm Đức Thắng',
    issuedBy: 'Trần Văn Kiên',
    createdAt: '2026-10-07T16:00:00',
    deadline: '2026-10-08T12:00:00',
    remediationRounds: [
      {
        id: 'round_21_1',
        roundNumber: 1,
        submittedBy: 'Phạm Đức Thắng',
        submittedAt: '2026-10-08T10:00:00',
        action: 'Đã gọi điện thu thập đủ 5 ý kiến phản ánh và nhập dữ liệu NPS hoàn chỉnh lên CRM.',
        evidence: 'File Excel xuất kết quả khảo sát kèm file ghi âm.',
        reviewedBy: 'Trần Văn Kiên',
        reviewedAt: '2026-10-08T11:30:00',
        reviewStatus: 'approved',
        reviewNote: 'Đạt yêu cầu. Đã nghiệm thu báo cáo NPS hoàn tất.',
      },
    ],
    closureMethod: 'manual',
    closedBy: 'Trần Văn Kiên',
    closedAt: '2026-10-08T11:30:00',
    comments: [],
    logs: [],
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
