/**
 * Types & Interfaces for Care Conditions Catalog Config (`PL-CSKH-01`)
 */

export type ConditionCategory = 'chuyen_can' | 'hoc_tap' | 'dich_vu' | 'rui_ro' | 'hanh_trinh'

export type ConditionNature = 'dac_biet' | 'dinh_ky' | 'theo_hanh_trinh' | 'theo_moc' | 'theo_yeu_cau' | 'tai_phi'

export type PrimaryStaffRole = 'CS' | 'GV' | 'QLCM' | 'QLCS'

export type ConditionPriority = 'urgent' | 'high' | 'medium' | 'low'

export type TriggerSource =
  | 'curriculum_path' // Lộ trình - Khung chương trình
  | 'class_db' // CSDL Lớp học
  | 'attendance_session' // CSDL Buổi học
  | 'exam_grade' // CSDL Điểm Kiểm tra
  | 'homework_db' // CSDL BTVN
  | 'attitude_rating' // CSDL Thái độ (Rating sao)
  | 'subscription_package' // Gói đăng ký
  | 'periodic_time' // Định kỳ - Theo thời gian
  | 'student_account' // Học viên & Tài khoản

export type TriggerOperator = 'gte' | 'lte' | 'eq' | 'milestone' | 'status_change'

export interface StructuredTriggerRule {
  source: TriggerSource
  sourceLabel: string
  metric: string // e.g. 'nghi_khong_phep', 'thieu_btvn', 'diem_bai_thi', 'sub_buoi_con_lai'
  metricLabel: string
  metricUnit?: string // e.g. 'buổi', 'điểm', '%', 'sao', 'mốc', 'ngày'
  operator?: TriggerOperator
  operatorLabel?: string
  thresholdValue?: number
  milestoneType?: 'theo_buoi' | 'theo_loai_buoi' | 'theo_moc_cap_do'
  milestoneValue?: string // e.g. "1; 5; 10" or "buoi_project"
  windowRange?: string // e.g. '8_buoi_gan_nhat', 'toan_khoa', '30_ngay'
  windowRangeLabel?: string
  scope?: string // e.g. 'theo_tung_mon', 'toan_trung_tam', 'theo_khung_chuong_trinh'
  scopeLabel?: string
  slaType?: string
  slaUnit?: 'hours' | 'days'
  slaValueInput?: number
  slaHoursInput?: number
}

export interface CareConditionConfig {
  id: string
  code: string // e.g. 'ĐB-01', 'ĐB-02', 'TH-01', 'ĐK-01'
  name: string // Title/Trigger condition description
  category: ConditionCategory
  nature: ConditionNature
  natureLabel: string
  primaryRole: PrimaryStaffRole
  primaryRoleLabel: string
  assignedRoles?: PrimaryStaffRole[] // Danh sách các vai trò cùng phụ trách chăm sóc
  completionPolicy?: 'any_role' | 'all_roles' // Quy tắc hoàn thành: Bất kỳ vai trò (OR) vs Tất cả vai trò (AND)
  slaHours: number
  slaLabel: string
  priority: ConditionPriority
  dataProvidedToParent?: string // Dữ liệu cung cấp cho PH
  focusContent: string[] // Nội dung chăm sóc trọng tâm
  isActive: boolean // Đang áp dụng vs Tạm dừng
  triggerRule?: StructuredTriggerRule // Cấu hình quy tắc tự động kích hoạt có cấu trúc
  autoTriggerRule?: string // Mô tả quy tắc tự động kích hoạt hiển thị
  createdAt: string
  updatedAt: string
}

export interface CareConditionsFilterState {
  search: string
  category: string
  nature: string
  primaryRole: string
  priority: string
  status: 'all' | 'active' | 'inactive'
  metricSource?: string
}
