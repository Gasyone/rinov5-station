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
  operations: 'Vận hành (CS)',
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
  completionDate?: string

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
    recurrenceCount: 1,
    evidence: 'Ghi nhận tự động từ nhật ký hệ thống: Không có bản ghi điểm danh lúc 20:00.',
    evidenceImage: '',
    evidenceLink: '',
    assignee: 'Thầy Hoàng Minh',
    issuedBy: 'Hệ thống tự động (Bot)',
    createdAt: '2026-10-14T20:00:00',
    deadline: '2026-10-15T12:00:00',
    closureMethod: 'system_auto',
    notes: 'Lỗi phát sinh tự động khi vi phạm thời gian quy định.',
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
    issuedBy: 'Trần Văn Kiên (Thanh tra viên)',
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
    issuedBy: 'Trần Văn Kiên (Thanh tra viên)',
    createdAt: '2026-10-13T17:20:00',
    deadline: '2026-10-14T12:00:00',
    correctiveAction: 'Nhân viên giải trình đi photo tài liệu khẩn cấp.',
    correctiveEvidence: 'Bản giải trình viết tay của nhân viên.',
    closureMethod: 'manual',
    notes: 'QC đánh giá giải trình chưa đạt yêu cầu vì giờ cao điểm bắt buộc phải có ít nhất 1 người cố định tại quầy đón trả.',
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
        action: 'Đánh giá Chưa đạt (Trả lại)',
        details: 'Giải trình không hợp lệ, yêu cầu lập phương án trực thay thế.',
        createdAt: '2026-10-14T10:00:00',
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
    recurrenceCount: 1,
    evidence: 'Biên bản ghi nhận dự giờ đột xuất và log quẹt thẻ ra vào lúc 18h14.',
    assignee: 'Cô Hoàng Thu Thảo',
    issuedBy: 'Nguyễn Thị Mai (Tổ trưởng chuyên môn)',
    createdAt: '2026-10-14T18:20:00',
    deadline: '2026-10-15T12:00:00',
    notes: 'Đã quá hạn thời gian cam kết khắc phục, sự cố đang bị treo.',
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
    issuedBy: 'Trần Văn Kiên (Thanh tra viên)',
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
    issuedBy: 'Trần Văn Kiên (Thanh tra viên)',
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
