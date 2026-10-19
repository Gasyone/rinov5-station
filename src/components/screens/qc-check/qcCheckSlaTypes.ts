import type { QcEvaluationCriteria, QcTargetGroup } from '@/mocks/qcChecks'

export interface QcCriteriaSlaConfig {
  id: string
  criteria: QcEvaluationCriteria
  name: string
  targetGroup: QcTargetGroup
  description: string
  // Thời hạn khắc phục theo mức độ nghiêm trọng (tính bằng giờ)
  slaHours: {
    critical: number // Khẩn cấp / Nghiêm trọng
    high: number     // Cao
    medium: number   // Trung bình
    low: number      // Thấp
  }
  // Ngưỡng lặp lại kích hoạt bắt buộc kế hoạch phòng ngừa
  recurrenceThreshold: number
  // Chu kỳ tính lặp lại (ngày)
  recurrencePeriodDays: number
  // Yêu cầu bắt buộc bằng chứng (ảnh / link)
  requireEvidence: boolean
  // Bắt buộc Cấp 2 nghiệm thu duyệt đạt mới đóng lỗi
  requireApproval: boolean
  // Điểm phạt trừ KPI theo mức độ
  kpiPenaltyPoints: {
    critical: number
    high: number
    medium: number
    low: number
  }
  // Vai trò duyệt mặc định
  defaultReviewerRole: 'qc_inspector' | 'branch_manager' | 'academic_lead'
  isActive: boolean
}

export const DEFAULT_SLA_CONFIGS: QcCriteriaSlaConfig[] = [
  {
    id: 'sla_attendance',
    criteria: 'attendance',
    name: 'Điểm danh',
    targetGroup: 'teacher',
    description: 'Chậm điểm danh lớp học, thiếu điểm danh đón/trả trẻ hoặc sai lệch dữ liệu sỉ số.',
    slaHours: { critical: 6, high: 12, medium: 24, low: 48 },
    recurrenceThreshold: 2,
    recurrencePeriodDays: 30,
    requireEvidence: true,
    requireApproval: true,
    kpiPenaltyPoints: { critical: 5, high: 3, medium: 2, low: 1 },
    defaultReviewerRole: 'qc_inspector',
    isActive: true,
  },
  {
    id: 'sla_pedagogy',
    criteria: 'pedagogy',
    name: 'Tác phong giảng dạy',
    targetGroup: 'teacher',
    description: 'Giáo viên đi muộn, không mang giáo án, sai đồng phục, sử dụng điện thoại trong giờ dạy.',
    slaHours: { critical: 12, high: 24, medium: 48, low: 72 },
    recurrenceThreshold: 2,
    recurrencePeriodDays: 30,
    requireEvidence: true,
    requireApproval: true,
    kpiPenaltyPoints: { critical: 5, high: 4, medium: 2, low: 1 },
    defaultReviewerRole: 'academic_lead',
    isActive: true,
  },
  {
    id: 'sla_feedback',
    criteria: 'feedback',
    name: 'Nhận xét học viên',
    targetGroup: 'teacher',
    description: 'Nhận xét sao chép hàng loạt, thiếu cá nhân hóa, nộp nhận xét buổi học trễ hạn quy định.',
    slaHours: { critical: 12, high: 24, medium: 48, low: 72 },
    recurrenceThreshold: 2,
    recurrencePeriodDays: 30,
    requireEvidence: false,
    requireApproval: true,
    kpiPenaltyPoints: { critical: 3, high: 2, medium: 1, low: 0.5 },
    defaultReviewerRole: 'academic_lead',
    isActive: true,
  },
  {
    id: 'sla_student_care',
    criteria: 'student_care',
    name: 'Chăm sóc học viên',
    targetGroup: 'operations',
    description: 'Chưa gọi điện sau buổi đầu/học sinh nghỉ, chậm xử lý phản hồi khiếu nại của phụ huynh.',
    slaHours: { critical: 12, high: 24, medium: 48, low: 72 },
    recurrenceThreshold: 2,
    recurrencePeriodDays: 30,
    requireEvidence: true,
    requireApproval: true,
    kpiPenaltyPoints: { critical: 4, high: 3, medium: 2, low: 1 },
    defaultReviewerRole: 'branch_manager',
    isActive: true,
  },
  {
    id: 'sla_facility_quality',
    criteria: 'facility_quality',
    name: 'Chất lượng CSVC',
    targetGroup: 'facility',
    description: 'Máy chiếu mờ, điều hòa chảy nước, bàn ghế hỏng, đèn cháy, mất kết nối internet lớp học.',
    slaHours: { critical: 12, high: 24, medium: 72, low: 96 },
    recurrenceThreshold: 3,
    recurrencePeriodDays: 30,
    requireEvidence: true,
    requireApproval: true,
    kpiPenaltyPoints: { critical: 5, high: 3, medium: 1.5, low: 0.5 },
    defaultReviewerRole: 'branch_manager',
    isActive: true,
  },
  {
    id: 'sla_safety_hygiene',
    criteria: 'safety_hygiene',
    name: 'An toàn & Vệ sinh',
    targetGroup: 'facility',
    description: 'Lối thoát hiểm bị chắn, hồ sơ PCCC quá hạn, bình chữa cháy hỏng, vệ sinh phòng học kém.',
    slaHours: { critical: 4, high: 12, medium: 24, low: 48 },
    recurrenceThreshold: 2,
    recurrencePeriodDays: 30,
    requireEvidence: true,
    requireApproval: true,
    kpiPenaltyPoints: { critical: 10, high: 5, medium: 3, low: 1 },
    defaultReviewerRole: 'qc_inspector',
    isActive: true,
  },
]

export const REVIEWER_ROLE_LABELS: Record<'qc_inspector' | 'branch_manager' | 'academic_lead', string> = {
  qc_inspector: 'Thanh tra viên QC',
  branch_manager: 'Trưởng cơ sở (BM)',
  academic_lead: 'Trưởng bộ môn (Academic Lead)',
}
