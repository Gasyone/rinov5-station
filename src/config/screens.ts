export interface ScreenConfig {
  label: string
  description: string
}

export const screens: Record<string, ScreenConfig> = {
  dashboard: {
    label: 'Tổng quan',
    description: 'Tổng quan các chỉ số và hoạt động chính',
  },
  calendar_class_schedule: {
    label: 'Lịch học',
    description: 'Quản lý và xem lịch lớp học',
  },
  calendar_event_schedule: {
    label: 'Lịch sự kiện',
    description: 'Quản lý và xem lịch sự kiện',
  },
  my_schedule: {
    label: 'Lịch của tôi',
    description: 'Xem lịch cá nhân',
  },
  work_registration: {
    label: 'Đăng ký lịch',
    description: 'Đăng ký lịch cá nhân và quản lý lịch nhân viên theo trung tâm',
  },
  calendar_class_schedule_v2: {
    label: 'Lịch học',
    description: 'Quản lý và xem lịch lớp học (v2)',
  },
  calendar_event_schedule_v2: {
    label: 'Lịch sự kiện',
    description: 'Quản lý và xem lịch sự kiện (v2)',
  },
  my_schedule_v2: {
    label: 'Lịch của tôi',
    description: 'Xem lịch cá nhân (v2)',
  },
  work_registration_v2: {
    label: 'Đăng ký lịch',
    description: 'Đăng ký lịch cá nhân và quản lý lịch nhân viên theo trung tâm (v2)',
  },
  booking_test: {
    label: 'Kiểm tra/Trải nghiệm',
    description: 'Quản lý lịch kiểm tra đầu vào',
  },
  booking_test_v2: {
    label: 'Kiểm tra/ Trải nghiệm',
    description: 'Quản lý lịch kiểm tra đầu vào (v2)',
  },
  trial_class: {
    label: 'Lớp học thử',
    description: 'Quản lý buổi học thử',
  },
  trial_class_v2: {
    label: 'Lớp học thử',
    description: 'Quản lý buổi học thử (v2)',
  },
  event_management_new: {
    label: 'Quản lý sự kiện',
    description: 'Quản lý danh sách sự kiện tuyển sinh và đón tiếp khách mời',
  },
  event_management_new_v2: {
    label: 'Quản lý sự kiện',
    description: 'Quản lý sự kiện (v2)',
  },
  orders: {
    label: 'Đơn hàng',
    description: 'Xem và quản lý đơn hàng',
  },
  receipts: {
    label: 'Phiếu thu',
    description: 'Xem và quản lý phiếu thu',
  },
  placement_test: {
    label: 'Kiểm tra đầu vào',
    description: 'Quản lý bài kiểm tra đầu vào',
  },
  students: {
    label: 'Học viên',
    description: 'Quản lý hồ sơ học viên',
  },
  classes: {
    label: 'Lớp học',
    description: 'Vận hành lớp học',
  },
  class_sessions: {
    label: 'Buổi học',
    description: 'Quản lý và theo dõi buổi học',
  },

  attendance: {
    label: 'Điểm danh',
    description: 'Kiểm duyệt điểm danh toàn trung tâm',
  },
  session_feedback: {
    label: 'Nhận xét học viên',
    description: 'Quản lý nhận xét và đánh giá học viên theo buổi học',
  },
  teachers: {
    label: 'Giáo viên',
    description: 'Quản lý giáo viên',
  },
  hr_employees: {
    label: 'Nhân viên',
    description: 'Quản lý hồ sơ nhân viên',
  },
  branch_list: {
    label: 'Chi nhánh',
    description: 'Xem và quản lý chi nhánh',
  },
  org_structure: {
    label: 'Cơ cấu tổ chức',
    description: 'Xem sơ đồ tổ chức',
  },
  products: {
    label: 'Sản phẩm',
    description: 'Quản lý sản phẩm',
  },
  product_groups: {
    label: 'Nhóm sản phẩm',
    description: 'Quản lý nhóm sản phẩm',
  },
  combos: {
    label: 'Combo',
    description: 'Quản lý combo sản phẩm',
  },
  program_management: {
    label: 'Chương trình học',
    description: 'Quản lý chương trình học',
  },
  syllabus: {
    label: 'Giáo trình',
    description: 'Quản lý nội dung giáo trình',
  },
  curriculum: {
    label: 'Khung chương trình',
    description: 'Quản lý khung chương trình',
  },
  users: {
    label: 'Người dùng',
    description: 'Quản lý người dùng hệ thống',
  },
  permissions: {
    label: 'Phân quyền',
    description: 'Quản lý quyền người dùng',
  },
  contact_directory: {
    label: 'Danh bạ liên hệ',
    description: 'Quản lý lead CRM và pipeline chăm sóc',
  },
  leave_reserve: {
    label: 'Bảo lưu & Chuyển lớp',
    description: 'Quản lý yêu cầu bảo lưu, chuyển lớp và nghỉ học của học viên',
  },
  today_care: {
    label: 'Phiếu chăm sóc',
    description: 'Xử lý các phiếu hỗ trợ và yêu cầu chăm sóc học viên hàng ngày',
  },
  care_rule_engine: {
    label: 'Quy tắc chăm sóc',
    description: 'Thiết lập quy tắc sinh phiếu tự động dựa trên hành vi học viên',
  },

  student_operations_alert: {
    label: 'Theo dõi vận hành',
    description: 'Giám sát chuyên cần, BTVN, điểm kiểm tra và cảnh báo CSKH',
  },
  care_schedule: {
    label: 'Lịch hẹn chăm sóc',
    description: 'Quản lý lịch hẹn gọi điện và điểm chạm chăm sóc học viên',
  },
  renewal: {
    label: 'Tái phí học viên',
    description: 'Quản lý chiến dịch tái phí, phễu giữ chân học viên và chồng phí tương lai',
  },
  qc_check: {
    label: 'Kiểm tra chất lượng',
    description: 'Tạo đợt QC, ghi nhận lỗi và phát hành báo cáo chất lượng',
  },
  qc_remediation: {
    label: 'Khắc phục',
    description: 'Theo dõi và xử lý các lỗi đã ghi nhận từ các đợt kiểm tra QC',
  },
  classes_v2: {
    label: 'Lớp học',
    description: 'Vận hành lớp học (v2)',
  },
  students_v2: {
    label: 'Học viên',
    description: 'Quản lý hồ sơ học viên (v2)',
  },
  teachers_v2: {
    label: 'Giáo viên',
    description: 'Quản lý giáo viên (v2)',
  },
  leave_reserve_v2: {
    label: 'Bảo lưu & Chuyển lớp',
    description: 'Quản lý yêu cầu bảo lưu, chuyển lớp và nghỉ học của học viên (v2)',
  },
  class_sessions_v2: {
    label: 'Buổi học',
    description: 'Quản lý và theo dõi buổi học (v2)',
  },
  attendance_v2: {
    label: 'Điểm danh',
    description: 'Kiểm duyệt điểm danh toàn trung tâm (v2)',
  },
  session_feedback_v2: {
    label: 'Nhận xét học viên',
    description: 'Quản lý nhận xét và đánh giá học viên theo buổi học (v2)',
  },
  system_config: {
    label: 'Cấu hình hệ thống',
    description: 'Quản lý cấu hình chung, branding và tham số vận hành bảo mật',
  },
}
