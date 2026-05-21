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
    label: 'Lịch lớp học',
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
    label: 'Đăng ký lịch làm việc',
    description: 'Đăng ký lịch cá nhân và quản lý lịch nhân viên theo trung tâm',
  },
  booking_test: {
    label: 'Đặt lịch test',
    description: 'Quản lý lịch kiểm tra đầu vào',
  },
  trial_class: {
    label: 'Lớp học thử',
    description: 'Quản lý buổi học thử',
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
    description: 'Quản lý lớp học',
  },
  class_sessions: {
    label: 'Buổi học',
    description: 'Quản lý và theo dõi buổi học',
  },

  attendance: {
    label: 'Điểm danh',
    description: 'Kiểm duyệt điểm danh toàn trung tâm',
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
    label: 'Bảo lưu & Nghỉ phép',
    description: 'Quản lý yêu cầu bảo lưu học tập và nghỉ phép của học viên',
  },
  today_care: {
    label: 'Phiếu chăm sóc',
    description: 'Xử lý các phiếu hỗ trợ và yêu cầu chăm sóc học viên hàng ngày',
  },
  care_rule_engine: {
    label: 'Quy tắc chăm sóc',
    description: 'Thiết lập quy tắc sinh phiếu tự động dựa trên hành vi học viên',
  },
}
