export interface ScreenConfig {
  label: string
  description: string
}

export const screens: Record<string, ScreenConfig> = {
  dashboard: {
    label: 'Executive Dashboard',
    description: 'Tổng quan chỉ số điều hành dành cho Quản lý chi nhánh',
  },
  my_schedule: {
    label: 'Lịch của tôi',
    description: 'Sổ tay tác nghiệp ca dạy cá nhân dành cho Giáo viên và Trợ giảng',
  },
  calendar_room_schedule: {
    label: 'Lịch phòng học',
    description: 'Bảng ma trận gán lớp vào phòng học và phát hiện xung đột thời gian',
  },
  calendar_class_schedule: {
    label: 'Lịch học',
    description: 'Thời khóa biểu tổng quan các lớp học tại chi nhánh',
  },
  calendar_class_schedule_v2: {
    label: 'Lịch học V2',
    description: 'Trung tâm điều hành thời khóa biểu, ma trận phòng học, tải trọng giáo viên và phân công trợ giảng toàn trung tâm',
  },
  calendar_event_schedule: {
    label: 'Lịch sự kiện',
    description: 'Quản lý lịch kiểm tra trải nghiệm đầu vào và sự kiện workshop',
  },
  work_registration: {
    label: 'Đăng ký lịch',
    description: 'Đăng ký lịch rảnh cá nhân và quản lý lịch khả dụng nhân sự',
  },

  classes: {
    label: 'Quản lý Lớp học',
    description: 'Quản lý danh sách lớp học, phân công giảng dạy và tiến độ đào tạo',
  },
  students: {
    label: 'Xếp lớp học viên',
    description: 'Danh sách học viên chờ xếp lớp, gói học và lịch sử phân lớp',
  },
  leave_reserve: {
    label: 'Bảo lưu & Nghỉ phép',
    description: 'Xử lý phiếu bảo lưu học phí, đơn xin nghỉ và thủ tục chuyển lớp',
  },
  makeup_class: {
    label: 'Học bù học viên',
    description: 'Quản lý lịch đăng ký học bù, sắp xếp ca học bù và duyệt yêu cầu học bù của học viên',
  },

  student_operations_alert: {
    label: 'Chăm sóc học viên',
    description: 'Ghi nhận và xử lý các ticket cảnh báo học viên vắng mặt, học lực sụt giảm',
  },
  renewal: {
    label: 'Tái phí học viên',
    description: 'Theo dõi danh sách học viên sắp hết phí và lịch sử tư vấn tái đăng ký',
  },
  care_conditions_config: {
    label: 'Danh mục chăm sóc',
    description: 'Cấu hình Quy tắc & Điều kiện Chăm sóc Học viên (Nguồn chỉ số CSDL, Tiêu chí, SLA & Phân công vai trò phụ trách)',
  },
  support_tickets: {
    label: 'Quản lý Ticket & Chất lượng',
    description: 'Ghi nhận và xử lý phản ánh, khiếu nại và yêu cầu hỗ trợ từ học viên/phụ huynh',
  },

  teacher_assignment: {
    label: 'Phân công Giảng dạy',
    description: 'Gán giáo viên chính, trợ giảng và duyệt công thế ca',
  },
  hr_employees: {
    label: 'Hồ sơ Nhân sự',
    description: 'Quản lý hồ sơ giáo viên, trợ giảng và nhân viên chi nhánh',
  },
  substitute_payroll: {
    label: 'Duyệt Dạy thay & Lương ca',
    description: 'Duyệt ca thế dạy và tính toán thù lao giảng dạy theo ca',
  },

  reports: {
    label: 'Báo cáo Vận hành',
    description: 'Thống kê tổng hợp sĩ số, giờ dạy, chuyên cần và doanh thu đào tạo',
  },
}
