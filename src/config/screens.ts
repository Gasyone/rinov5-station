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
    label: 'Lịch học trung tâm',
    description: 'Thời khóa biểu tổng quan các lớp học tại chi nhánh',
  },
  calendar_event_schedule: {
    label: 'Lịch test',
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
  booking_test: {
    label: 'Kiểm tra/Trải nghiệm',
    description: 'Quản lý danh sách học viên đăng ký test đầu vào và lớp học trải nghiệm',
  },
  trial_class: {
    label: 'Lớp học thử',
    description: 'Danh sách và lịch sắp xếp học viên tham gia lớp học thử',
  },
  event_management_new: {
    label: 'Quản lý sự kiện',
    description: 'Quản lý các sự kiện workshop, hội thảo và hoạt động trải nghiệm',
  },
  crm_leads: {
    label: 'Quản lý Lead',
    description: 'Tiếp nhận, phân bổ và theo dõi trạng thái tương tác với Phụ huynh (người đăng ký/thanh toán) và thông tin con (học viên tiềm năng)',
  },
  sales_pipeline: {
    label: 'Cơ hội Bán hàng (Pipeline)',
    description: 'Bảng điều khiển luồng tư vấn Phụ huynh, theo dõi tiến độ test/học thử của con và dự báo doanh số chốt hợp đồng',
  },
  orders: {
    label: 'Đơn hàng & Thu phí',
    description: 'Quản lý đơn đăng ký học, trạng thái thanh toán và phát hành biên nhận/hóa đơn',
  },
  payment_receipts: {
    label: 'Quản lý Phiếu thu',
    description: 'Quản lý danh sách các phiếu thu tiền học phí, cọc giữ chỗ, thanh toán đơn hàng và biên nhận',
  },
  products: {
    label: 'Gói Sản phẩm & Học phí',
    description: 'Danh mục các khóa học, gói học phí, combo và chương trình đào tạo thương mại',
  },
  promotions: {
    label: 'Khuyến mãi & Ưu đãi',
    description: 'Cấu hình chính sách chiết khấu, mã giảm giá/voucher và quản lý suất học bổng',
  },
  design_system: {
    label: 'Design System',
    description: 'Thư viện thành phần giao diện và hướng dẫn quy chuẩn thiết kế',
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
  digi_schedule: {
    label: 'Lịch học digi',
    description: 'Quản lý danh sách đăng ký ca tự học Digi, điều phối phòng học, thiết bị và tiếp đón học viên tại cơ sở',
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
