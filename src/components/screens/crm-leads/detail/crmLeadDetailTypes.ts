export type DropStageId = 'moi_tiep_nhan' | 'dang_tu_van' | 'hen_trai_nghiem' | 'cho_chot'

export interface DropReason {
  id: string
  stageId: DropStageId
  label: string
  suggestedAction: string
  coolingOffDays: number
}

export const DROP_STAGE_OPTIONS: { id: DropStageId; label: string; stepNumber: number }[] = [
  { id: 'moi_tiep_nhan', label: 'Chặng 1: Mới tiếp nhận & Tiếp cận', stepNumber: 1 },
  { id: 'dang_tu_van', label: 'Chặng 2: Đang tư vấn', stepNumber: 2 },
  { id: 'hen_trai_nghiem', label: 'Chặng 3: Đánh giá & Học thử', stepNumber: 3 },
  { id: 'cho_chot', label: 'Chặng 4: Chờ chốt deal', stepNumber: 4 },
]

export const DROP_REASONS_MAP: Record<DropStageId, DropReason[]> = {
  moi_tiep_nhan: [
    {
      id: 'DROP_INVALID_PHONE',
      stageId: 'moi_tiep_nhan',
      label: 'Sai số điện thoại / Số không tồn tại',
      suggestedAction: 'Đóng lead & Đánh dấu số không hợp lệ',
      coolingOffDays: 0,
    },
    {
      id: 'DROP_NO_ANSWER_3X',
      stageId: 'moi_tiep_nhan',
      label: 'Không nghe máy quá 3 lần (KNM)',
      suggestedAction: 'Gửi kịch bản Zalo/SMS tự động sau 7 ngày',
      coolingOffDays: 14,
    },
    {
      id: 'DROP_ACCIDENTAL_FORM',
      stageId: 'moi_tiep_nhan',
      label: 'Nhầm lẫn / Không có nhu cầu đăng ký',
      suggestedAction: 'Lưu kho lạnh',
      coolingOffDays: 60,
    },
    {
      id: 'DROP_DUPLICATE',
      stageId: 'moi_tiep_nhan',
      label: 'Trùng lặp liên hệ với hồ sơ khác',
      suggestedAction: 'Hợp nhất hồ sơ liên hệ',
      coolingOffDays: 0,
    },
  ],
  dang_tu_van: [
    {
      id: 'DROP_LOCATION_FAR',
      stageId: 'dang_tu_van',
      label: 'Nhà quá xa cơ sở, không tiện đưa đón',
      suggestedAction: 'Gợi ý chuyển chi nhánh gần hơn hoặc học trực tuyến',
      coolingOffDays: 90,
    },
    {
      id: 'DROP_AGE_MISMATCH',
      stageId: 'dang_tu_van',
      label: 'Độ tuổi chưa phù hợp khóa học',
      suggestedAction: 'Lưu kho nuôi dưỡng theo độ tuổi đến kỳ sau',
      coolingOffDays: 180,
    },
    {
      id: 'DROP_PRICE_INQUIRY_ONLY',
      stageId: 'dang_tu_van',
      label: 'Chỉ khảo sát giá / Đang tham khảo',
      suggestedAction: 'Gửi bộ tài liệu định kỳ và nuôi dưỡng nhẹ',
      coolingOffDays: 30,
    },
    {
      id: 'DROP_PROGRAM_MISMATCH',
      stageId: 'dang_tu_van',
      label: 'Định hướng học tập khác (Cần gia sư 1:1, online)',
      suggestedAction: 'Lưu kho chương trình đặc biệt',
      coolingOffDays: 60,
    },
  ],
  hen_trai_nghiem: [
    {
      id: 'DROP_TEST_NO_SHOW',
      stageId: 'hen_trai_nghiem',
      label: 'Vắng buổi kiểm tra / Không đến (No-show)',
      suggestedAction: 'Liên hệ lại sau 24h để đặt lịch bù',
      coolingOffDays: 7,
    },
    {
      id: 'DROP_TEST_RESULT_REJECT',
      stageId: 'hen_trai_nghiem',
      label: 'Không đồng ý với kết quả kiểm tra năng lực',
      suggestedAction: 'Tư vấn viên trao đổi chuyên môn lại cùng Giáo viên trưởng',
      coolingOffDays: 14,
    },
    {
      id: 'DROP_KID_DISLIKE',
      stageId: 'hen_trai_nghiem',
      label: 'Bé không thích phòng học / Không hợp giáo viên',
      suggestedAction: 'Đề xuất đổi lớp thử với giáo viên khác',
      coolingOffDays: 30,
    },
    {
      id: 'DROP_SCHEDULE_CONFLICT',
      stageId: 'hen_trai_nghiem',
      label: 'Trùng lịch học trường chính khóa',
      suggestedAction: 'Chờ mở ca học mới vào kỳ sau',
      coolingOffDays: 60,
    },
  ],
  cho_chot: [
    {
      id: 'DROP_PRICE_TOO_HIGH',
      stageId: 'cho_chot',
      label: 'Học phí vượt ngân sách gia đình',
      suggestedAction: 'Đề xuất gói học bổng hoặc chính sách trả góp',
      coolingOffDays: 30,
    },
    {
      id: 'DROP_COMPETITOR_CHOSEN',
      stageId: 'cho_chot',
      label: 'Đã đăng ký trung tâm đối thủ cạnh tranh',
      suggestedAction: 'Ghi nhận lý do chọn đối thủ & Chăm sóc lại sau 6 tháng',
      coolingOffDays: 180,
    },
    {
      id: 'DROP_POSTPONE_TERM',
      stageId: 'cho_chot',
      label: 'Hoãn kế hoạch (Chờ hết học kỳ / Chờ hè)',
      suggestedAction: 'Kích hoạt lại trước mùa tuyển sinh 1 tháng',
      coolingOffDays: 90,
    },
    {
      id: 'DROP_FINANCIAL_ISSUE',
      stageId: 'cho_chot',
      label: 'Gia đình có phát sinh tài chính đột xuất',
      suggestedAction: 'Giữ ưu đãi hiện tại trong 30 ngày',
      coolingOffDays: 45,
    },
  ],
}

export interface DropRecord {
  stageId: DropStageId
  stageLabel: string
  reasonId: string
  reasonLabel: string
  droppedAt: string
  droppedBy: string
  note?: string
  reCareDate?: string
}

export interface SalesCycle {
  cycleId: string
  cycleNumber: number
  title: string
  status: 'active' | 'converted' | 'dropped'
  startDate: string
  endDate?: string
  assignedSales: string
  outcomeNote?: string
}

export interface OpsHandoffInfo {
  isHandoffCompleted: boolean
  studentCode?: string
  enrolledDate?: string
  currentClass?: string
  className?: string
  academicOfficer?: string
  teacherName?: string
  attendanceRate?: string
  sessionsLearned?: string
  academicStatus?: 'studying' | 'graduated' | 'paused' | 'dropped'
  daysInactive?: number // Số ngày không có tương tác / học tập
  lastActivityDate?: string
  canReactivate?: boolean
}

export interface CareInteraction {
  id: string
  cycleId: string
  timestamp: string
  staffName: string
  channel: 'call' | 'zalo' | 'direct'
  outcome: 'interested' | 'callback' | 'no_answer' | 'wrong_number' | 'rejected' | 'booked_test'
  outcomeLabel: string
  note: string
  nextAppointment?: string
}
