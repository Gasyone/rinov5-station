/* ─── QC Check Domain Types ─────────────────────────────────
   Full rewrite: event name, multi-inspectors, new statuses,
   error code, error type, recurrence, overdue tracking.
*/

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

export type QcErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export type QcErrorStatus =
  | 'open'
  | 'correcting'
  | 'corrected'
  | 'closed'
  | 'cancelled'
  | 'not_met'

export type QcErrorType = 'process' | 'facility' | 'personnel' | 'equipment' | 'safety' | 'hygiene'

export type QcCheckItemCategory =
  | 'classroom'
  | 'teacher'
  | 'facility'
  | 'hygiene'
  | 'safety'
  | 'equipment'

/* ─── Labels ─────────────────────────────────────────────── */

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

export const QC_ERROR_SEVERITY_LABELS: Record<QcErrorSeverity, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Nghiêm trọng',
}

export const QC_ERROR_STATUS_LABELS: Record<QcErrorStatus, string> = {
  open: 'Mở',
  correcting: 'Đang khắc phục',
  corrected: 'Đã khắc phục',
  closed: 'Đã đóng',
  cancelled: 'Đã hủy',
  not_met: 'Chưa đáp ứng',
}

export const QC_ERROR_TYPE_LABELS: Record<QcErrorType, string> = {
  process: 'Quy trình',
  facility: 'Cơ sở vật chất',
  personnel: 'Nhân sự',
  equipment: 'Thiết bị',
  safety: 'An toàn',
  hygiene: 'Vệ sinh',
}

/* ─── Categories & Items ─────────────────────────────────── */

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

/* ─── Inspector ──────────────────────────────────────────── */

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

/* ─── Error ──────────────────────────────────────────────── */

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

export interface QcError {
  id: string
  code: string
  qcEventId: string
  eventCode: string
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
  deadline?: string
  completionDate?: string
  closedBy?: string
  closedAt?: string
}

/* ─── Event ──────────────────────────────────────────────── */

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
  errors: QcError[]
  comments: QcComment[]
  logs: QcLog[]
  notes: string
  createdAt: string
  publishedAt?: string
  completedAt?: string
}

/* ─── Mock Data ──────────────────────────────────────────── */

const mockQcErrors: QcError[] = [
  {
    id: 'err_01',
    code: 'QC-2026-001.01',
    qcEventId: 'qc_01',
    eventCode: 'QC-2026-001',
    itemId: 'item_02',
    itemLabel: 'Giáo viên đúng giờ, đủ giáo án',
    errorType: 'personnel',
    description: 'Giáo viên đến muộn 15 phút, không mang giáo án buổi 3.',
    severity: 'high',
    status: 'corrected',
    recurrenceCount: 2,
    requiresCorrectiveAction: true,
    evidence: 'Check-in log: 08:15 thay vì 08:00. Xác nhận không có file giáo án.',
    correctiveAction: 'Nhắc nhở trực tiếp. Gửi email xác nhận đúng giờ.',
    correctiveEvidence: 'Email xác nhận ngày 26/05.',
    assignee: 'Nguyễn Thị Mai',
    issuedBy: 'ins_01',
    notes: 'GV lý do kẹt xe, cần theo dõi thêm.',
    createdAt: '2026-05-25T08:20:00',
    deadline: '2026-05-26T17:00:00',
    completionDate: '2026-05-26T10:00:00',
  },
  {
    id: 'err_02',
    code: 'QC-2026-001.02',
    qcEventId: 'qc_01',
    eventCode: 'QC-2026-001',
    itemId: 'item_06',
    itemLabel: 'Máy chiếu, loa, micro hoạt động tốt',
    errorType: 'equipment',
    description: 'Máy chiếu phòng A201 mờ, không chỉnh nét được.',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 0,
    requiresCorrectiveAction: false,
    evidence: 'Ảnh chụp màn hình chiếu mờ, đã thử chỉnh nét nhưng không được.',
    correctiveAction: '',
    correctiveEvidence: '',
    assignee: '',
    issuedBy: 'ins_01',
    notes: 'Phòng A201, cần thay bóng đèn chiếu.',
    createdAt: '2026-05-25T09:00:00',
    deadline: '2026-05-27T17:00:00',
  },
  {
    id: 'err_03',
    code: 'QC-2026-001.03',
    qcEventId: 'qc_01',
    eventCode: 'QC-2026-001',
    itemId: 'item_04',
    itemLabel: 'Nhà vệ sinh sạch, đủ dụng cụ',
    errorType: 'hygiene',
    description: 'WC tầng 2 hết xà phòng, sàn ướt không có biển báo.',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 3,
    requiresCorrectiveAction: true,
    evidence: 'Ảnh chụp WC tầng 2 lúc 10h, không có xà phòng. Sàn ướt.',
    correctiveAction: 'Bổ sung xà phòng và đặt biển báo sàn ướt. Nhắc nhân viên vệ sinh kiểm tra 2 lần/ngày.',
    correctiveEvidence: 'Ảnh chụp lại sau khi bổ sung. Bảng kiểm soát vệ sinh mới.',
    assignee: 'Lê Thị Hương',
    issuedBy: 'ins_01',
    notes: 'Đã xử lý trong ngày.',
    createdAt: '2026-05-25T10:00:00',
    deadline: '2026-05-26T12:00:00',
    completionDate: '2026-05-25T11:30:00',
    closedBy: 'ins_01',
    closedAt: '2026-05-25T14:00:00',
  },
  {
    id: 'err_04',
    code: 'QC-2026-002.01',
    qcEventId: 'qc_02',
    eventCode: 'QC-2026-002',
    itemId: 'item_05',
    itemLabel: 'Thoát hiểm rõ ràng, không vật cản',
    errorType: 'safety',
    description: 'Lối thoát hiểm tầng 3 bị chắn bởi thùng giấy carton.',
    severity: 'critical',
    status: 'closed',
    recurrenceCount: 1,
    requiresCorrectiveAction: true,
    evidence: 'Ảnh chụp lối thoát hiểm tầng 3 bị chắn, khoảng cách còn lại < 60cm.',
    correctiveAction: 'Dọn dẹp thùng giấy ngay. Nhắc nhở bộ phận kho. Ban hành quy định phạt vi phạm.',
    correctiveEvidence: 'Ảnh chụp lối thoát hiểm sau khi dọn dẹp. Biên bản xử lý vi phạm.',
    assignee: 'Phạm Đức Thắng',
    issuedBy: 'ins_02',
    notes: 'Vi phạm nghiêm trọng, xử lý kỷ luật nếu tái phạm.',
    createdAt: '2026-05-24T14:00:00',
    deadline: '2026-05-25T08:00:00',
    completionDate: '2026-05-24T14:45:00',
    closedBy: 'ins_02',
    closedAt: '2026-05-25T09:00:00',
  },
  {
    id: 'err_05',
    code: 'QC-2026-002.02',
    qcEventId: 'qc_02',
    eventCode: 'QC-2026-002',
    itemId: 'item_08',
    itemLabel: 'Giáo viên tương tác tốt với học viên',
    errorType: 'process',
    description: 'Giáo viên ít gọi học viên yếu, chỉ tập trung vào học viên khá.',
    severity: 'high',
    status: 'corrected',
    recurrenceCount: 0,
    requiresCorrectiveAction: true,
    evidence: 'Quan sát tiết học 45 phút: 12/15 lần gọi chỉ dành cho 5 học viên khá.',
    correctiveAction: 'Trao đổi trực tiếp với GV. Gửi tài liệu hướng dẫn kỹ thuật phân bổ câu hỏi.',
    correctiveEvidence: 'Biên bản trao đổi ngày 25/05, GV cam kết cải thiện.',
    assignee: 'Hoàng Thị Lan',
    issuedBy: 'ins_02',
    notes: 'GV tiếp thu tốt, cần theo dõi tiết sau.',
    createdAt: '2026-05-24T16:00:00',
    deadline: '2026-05-26T17:00:00',
    completionDate: '2026-05-25T09:00:00',
  },
  {
    id: 'err_06',
    code: 'QC-2026-003.01',
    qcEventId: 'qc_03',
    eventCode: 'QC-2026-003',
    itemId: 'item_03',
    itemLabel: 'Phòng học sạch sẽ, đủ ánh sáng',
    errorType: 'facility',
    description: 'Phòng B102 có 3 bóng đèn cháy, ánh sáng yếu.',
    severity: 'low',
    status: 'correcting',
    recurrenceCount: 0,
    requiresCorrectiveAction: false,
    evidence: 'Kiểm tra bằng mắt, đếm được 3/8 bóng không sáng.',
    correctiveAction: '',
    correctiveEvidence: '',
    assignee: 'Võ Minh Tuấn',
    issuedBy: 'ins_03',
    notes: 'Đã gửi yêu cầu bảo trì điện.',
    createdAt: '2026-05-20T08:30:00',
    deadline: '2026-05-22T17:00:00',
  },
  {
    id: 'err_07',
    code: 'QC-2026-003.02',
    qcEventId: 'qc_03',
    eventCode: 'QC-2026-003',
    itemId: 'item_09',
    itemLabel: 'Điều hòa, quạt hoạt động bình thường',
    errorType: 'equipment',
    description: 'Điều hòa phòng B102 không lạnh, nhiệt độ phòng 30°C.',
    severity: 'medium',
    status: 'closed',
    recurrenceCount: 2,
    requiresCorrectiveAction: true,
    evidence: 'Nhiệt kế điện tử đo 30°C trong phòng. Điều hòa chạy nhưng không mát.',
    correctiveAction: 'Nạp gas và vệ sinh dàn lạnh. Đề xuất lịch bảo trì mỗi 3 tháng.',
    correctiveEvidence: 'Hóa đơn nạp gas, ảnh chụp nhiệt kế sau sửa: 24°C.',
    assignee: 'Võ Minh Tuấn',
    issuedBy: 'ins_03',
    notes: 'Đã hoàn thành, đề xuất bảo trì định kỳ.',
    createdAt: '2026-05-20T09:15:00',
    deadline: '2026-05-22T17:00:00',
    completionDate: '2026-05-21T10:00:00',
    closedBy: 'ins_03',
    closedAt: '2026-05-22T08:00:00',
  },
  {
    id: 'err_08',
    code: 'QC-2026-003.03',
    qcEventId: 'qc_03',
    eventCode: 'QC-2026-003',
    itemId: 'item_11',
    itemLabel: 'Máy tính, phần mềm học tập ổn định',
    errorType: 'equipment',
    description: '3 máy lab 2 không mở được phần mềm học tiếng Anh.',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 1,
    requiresCorrectiveAction: true,
    evidence: 'Lỗi "License expired" trên PC-L2-05, PC-L2-06, PC-L2-07.',
    correctiveAction: 'Liên hệ vendor gia hạn license. Dự kiến xong trong 2 ngày.',
    correctiveEvidence: '',
    assignee: 'Nguyễn Văn Tùng',
    issuedBy: 'ins_03',
    notes: 'Vendor phản hồi trễ hạn, cần báo cáo lên cấp trên.',
    createdAt: '2026-05-20T10:45:00',
    deadline: '2026-05-22T17:00:00',
    completionDate: '2026-05-25T14:00:00',
  },
  {
    id: 'err_09',
    code: 'QC-2026-005.01',
    qcEventId: 'qc_05',
    eventCode: 'QC-2026-005',
    itemId: 'item_01',
    itemLabel: 'Sĩ số lớp đúng kế hoạch',
    errorType: 'process',
    description: 'Lớp TA-K12 sĩ số vượt quá 20% so với thiết kế phòng học.',
    severity: 'high',
    status: 'not_met',
    recurrenceCount: 1,
    requiresCorrectiveAction: true,
    evidence: 'Sĩ số 24 học viên trong phòng 15m2.',
    correctiveAction: 'Tách lớp hoặc chuyển sang phòng lớn hơn.',
    correctiveEvidence: 'Đề xuất tách lớp bị từ chối do thiếu giáo viên.',
    assignee: 'Nguyễn Thị Mai',
    issuedBy: 'ins_01',
    notes: 'Cần bổ sung giáo viên gấp để tách lớp.',
    createdAt: '2026-05-18T09:00:00',
    deadline: '2026-05-20T17:00:00',
  },
  {
    id: 'err_10',
    code: 'QC-2026-007.01',
    qcEventId: 'qc_07',
    eventCode: 'QC-2026-007',
    itemId: 'item_03',
    itemLabel: 'Phòng học sạch sẽ, đủ ánh sáng',
    errorType: 'facility',
    description: 'Phòng A101 tường bị thấm nước, ẩm mốc góc phòng.',
    severity: 'medium',
    status: 'open',
    recurrenceCount: 0,
    requiresCorrectiveAction: true,
    evidence: 'Ảnh chụp vệt ố thấm góc tường phòng A101.',
    correctiveAction: 'Sơn chống thấm và xử lý ẩm mốc.',
    correctiveEvidence: '',
    assignee: 'Võ Minh Tuấn',
    issuedBy: 'ins_01',
    notes: 'Cần xử lý trước khi mùa mưa bắt đầu.',
    createdAt: '2026-05-27T08:00:00',
    deadline: '2026-05-30T17:00:00',
  },
]

export const mockQcCheckEvents: QcCheckEvent[] = [
  {
    id: 'qc_01',
    code: 'QC-2026-001',
    name: 'Kiểm tra chất lượng sáng thứ Hai',
    type: 'daily',
    status: 'completed',
    date: '2026-05-25',
    branch: 'RinoEdu Nguyễn Tuân',
    inspectors: [INSPECTOR_OPTIONS[0], INSPECTOR_OPTIONS[1]],
    areas: ['Tầng 1', 'Tầng 2'],
    errors: mockQcErrors.filter((e) => e.qcEventId === 'qc_01'),
    comments: [
      {
        id: 'comm_01',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        userRole: 'Thanh tra viên',
        content: 'Lỗi giáo viên đi muộn đã có email giải trình từ tổ chuyên môn.',
        createdAt: '2026-05-25T09:30:00',
      },
      {
        id: 'comm_02',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        userRole: 'Quản lý chất lượng',
        content: 'Đã duyệt báo cáo và nhắc nhở bộ phận vận hành lưu ý nhà vệ sinh tầng 2.',
        createdAt: '2026-05-26T10:15:00',
      },
    ],
    logs: [
      {
        id: 'log_01',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Tạo đợt QC',
        createdAt: '2026-05-25T07:30:00',
      },
      {
        id: 'log_02',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Phát hành đợt QC',
        createdAt: '2026-05-25T08:00:00',
      },
      {
        id: 'log_03',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Ghi nhận lỗi',
        details: 'QC-2026-001.01: Giáo viên đi muộn 15 phút',
        createdAt: '2026-05-25T08:20:00',
      },
      {
        id: 'log_04',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Đóng đợt QC',
        createdAt: '2026-05-26T16:00:00',
      },
    ],
    notes: 'Kiểm tra thường nhật buổi sáng.',
    createdAt: '2026-05-25T07:30:00',
    publishedAt: '2026-05-25T08:00:00',
    completedAt: '2026-05-26T16:00:00',
  },
  {
    id: 'qc_02',
    code: 'QC-2026-002',
    name: 'Kiểm tra đột xuất sau khiếu nại phụ huynh',
    type: 'patrol',
    status: 'published',
    date: '2026-05-24',
    branch: 'RinoEdu Linh Đàm',
    inspectors: [INSPECTOR_OPTIONS[1], INSPECTOR_OPTIONS[4]],
    areas: ['Tầng 2', 'Tầng 3'],
    errors: mockQcErrors.filter((e) => e.qcEventId === 'qc_02'),
    comments: [
      {
        id: 'comm_03',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        userRole: 'Quản lý chất lượng',
        content: 'Yêu cầu dọn dẹp ngay các thùng các-tông chắn lối thoát hiểm tầng 3.',
        createdAt: '2026-05-24T14:10:00',
      },
      {
        id: 'comm_04',
        userId: 'ins_05',
        userName: 'Hoàng Thị Lan',
        userRole: 'Thanh tra viên',
        content: 'Đã xử lý xong, lối thoát hiểm đã thông thoáng.',
        createdAt: '2026-05-24T14:50:00',
      },
    ],
    logs: [
      {
        id: 'log_05',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Tạo đợt QC',
        createdAt: '2026-05-24T13:00:00',
      },
      {
        id: 'log_06',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Phát hành đợt QC',
        createdAt: '2026-05-24T13:30:00',
      },
      {
        id: 'log_07',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Ghi nhận lỗi',
        details: 'QC-2026-002.01: Thùng giấy chắn lối thoát hiểm',
        createdAt: '2026-05-24T14:00:00',
      },
    ],
    notes: 'Kiểm tra đột xuất sau phản ánh của phụ huynh.',
    createdAt: '2026-05-24T13:00:00',
    publishedAt: '2026-05-24T13:30:00',
    completedAt: '2026-05-25T17:00:00',
  },
  {
    id: 'qc_03',
    code: 'QC-2026-003',
    name: 'Kiểm tra chất lượng định kỳ tháng 5',
    type: 'monthly',
    status: 'published',
    date: '2026-05-20',
    branch: 'RinoEdu Smart City',
    inspectors: [INSPECTOR_OPTIONS[2]],
    areas: ['Tầng 1', 'Tầng 2', 'Phòng lab'],
    errors: mockQcErrors.filter((e) => e.qcEventId === 'qc_03'),
    comments: [],
    logs: [
      {
        id: 'log_08',
        userId: 'ins_03',
        userName: 'Phạm Thanh Tùng',
        action: 'Tạo đợt QC',
        createdAt: '2026-05-20T07:00:00',
      },
      {
        id: 'log_09',
        userId: 'ins_03',
        userName: 'Phạm Thanh Tùng',
        action: 'Phát hành đợt QC',
        createdAt: '2026-05-20T08:00:00',
      },
    ],
    notes: 'Kiểm tra định kỳ tháng 5/2026.',
    createdAt: '2026-05-20T07:00:00',
    publishedAt: '2026-05-20T08:00:00',
  },
  {
    id: 'qc_04',
    code: 'QC-2026-004',
    name: '',
    type: 'daily',
    status: 'draft',
    date: '2026-05-27',
    branch: 'RinoEdu Nguyễn Tuân',
    inspectors: [INSPECTOR_OPTIONS[0]],
    areas: [],
    errors: [],
    comments: [],
    logs: [
      {
        id: 'log_10',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Tạo đợt QC (Nháp)',
        createdAt: '2026-05-27T07:00:00',
      },
    ],
    notes: '',
    createdAt: '2026-05-27T07:00:00',
  },
  {
    id: 'qc_05',
    code: 'QC-2026-005',
    name: 'Đánh giá đột xuất sĩ số lớp học',
    type: 'patrol',
    status: 'published',
    date: '2026-05-18',
    branch: 'RinoEdu Nguyễn Tuân',
    inspectors: [INSPECTOR_OPTIONS[0]],
    areas: ['Phòng học 102'],
    errors: mockQcErrors.filter((e) => e.qcEventId === 'qc_05'),
    comments: [],
    logs: [
      {
        id: 'log_11',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Tạo đợt QC',
        createdAt: '2026-05-18T08:00:00',
      },
      {
        id: 'log_12',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Phát hành đợt QC',
        createdAt: '2026-05-18T08:30:00',
      },
    ],
    notes: 'Kiểm tra đột xuất sĩ số theo phản hồi.',
    createdAt: '2026-05-18T08:00:00',
    publishedAt: '2026-05-18T08:30:00',
  },
  {
    id: 'qc_06',
    code: 'QC-2026-006',
    name: 'Kiểm tra đột xuất tuần 3 tháng 5',
    type: 'patrol',
    status: 'cancelled',
    date: '2026-05-15',
    branch: 'RinoEdu Linh Đàm',
    inspectors: [INSPECTOR_OPTIONS[1]],
    areas: [],
    errors: [],
    comments: [],
    logs: [
      {
        id: 'log_13',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Tạo đợt QC',
        createdAt: '2026-05-15T09:00:00',
      },
      {
        id: 'log_14',
        userId: 'ins_02',
        userName: 'Lê Thị Hạnh',
        action: 'Hủy đợt QC',
        createdAt: '2026-05-15T10:00:00',
      },
    ],
    notes: 'Hủy do chi nhánh bận sự kiện tuyển sinh.',
    createdAt: '2026-05-15T09:00:00',
  },
  {
    id: 'qc_07',
    code: 'QC-2026-007',
    name: 'Kiểm tra chất lượng sáng thứ Tư',
    type: 'daily',
    status: 'published',
    date: '2026-05-27',
    branch: 'RinoEdu Nguyễn Tuân',
    inspectors: [INSPECTOR_OPTIONS[0]],
    areas: ['Phòng A101'],
    errors: mockQcErrors.filter((e) => e.qcEventId === 'qc_07'),
    comments: [],
    logs: [
      {
        id: 'log_15',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Tạo đợt QC',
        createdAt: '2026-05-27T07:30:00',
      },
      {
        id: 'log_16',
        userId: 'ins_01',
        userName: 'Trần Văn Kiên',
        action: 'Phát hành đợt QC',
        createdAt: '2026-05-27T08:00:00',
      },
    ],
    notes: 'Chưa phát sinh báo cáo khắc phục.',
    createdAt: '2026-05-27T07:30:00',
    publishedAt: '2026-05-27T08:00:00',
  },
]

/* ─── Helpers ────────────────────────────────────────────── */

export function getQcBranches(): string[] {
  return [...new Set(mockQcCheckEvents.map((e) => e.branch))].sort()
}

export function getQcCheckEvents(filters?: {
  search?: string
  type?: string
  status?: string
  branch?: string
}): QcCheckEvent[] {
  return mockQcCheckEvents.filter((e) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const nameMatch = e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)
      const inspectorMatch = e.inspectors.some((i) => i.name.toLowerCase().includes(q))
      const branchMatch = e.branch.toLowerCase().includes(q)
      if (!nameMatch && !inspectorMatch && !branchMatch) return false
    }
    if (filters?.type && e.type !== filters.type) return false
    if (filters?.status && e.status !== filters.status) return false
    if (filters?.branch && e.branch !== filters.branch) return false
    return true
  })
}

export function getErrorByRecurrence(errorCode: string): number {
  const error = mockQcErrors.find((e) => e.code === errorCode)
  return error?.recurrenceCount ?? 0
}
