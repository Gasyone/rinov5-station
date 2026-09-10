export interface ScreenConfig {
  label: string
  description: string
}

export const screens: Record<string, ScreenConfig> = {
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
  crm_my_leads: {
    label: 'Lead của tôi',
    description: 'Danh sách Lead và khách hàng tiềm năng được phân bổ cho cá nhân tư vấn phụ trách',
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
    label: 'Quản lý đơn hàng',
    description: 'Quản lý đơn đăng ký học, trạng thái thanh toán và phát hành biên nhận/hóa đơn',
  },
  order_fulfillment: {
    label: 'Bàn giao & Giao hàng',
    description: 'Quản lý danh sách bàn giao sách giáo trình, học liệu, quà tặng tại cơ sở và theo dõi vận đơn giao tận nơi',
  },
  payment_receipts: {
    label: 'Thanh toán',
    description: 'Quản lý danh sách các phiếu thanh toán (phiếu thu, phiếu chi/hoàn tiền), lịch sử giao dịch và biên nhận',
  },
  products: {
    label: 'Quản lý sản phẩm',
    description: 'Danh mục các khóa học, gói học phí, combo và chương trình đào tạo thương mại',
  },
  campaigns: {
    label: 'Quản lý Chiến dịch',
    description: 'Thiết lập chiến dịch khuyến mại, quy tắc giảm giá, ngân sách, phân bổ chi phí và điều kiện áp dụng SKU',
  },
  promotions: {
    label: 'Quản lý Khuyến mãi',
    description: 'Cấu hình chính sách chiết khấu, mã giảm giá/voucher và quản lý suất học bổng',
  },
  design_system: {
    label: 'Design System',
    description: 'Thư viện thành phần giao diện và hướng dẫn quy chuẩn thiết kế',
  },
  class_placement: {
    label: 'Xếp lớp học viên',
    description: 'Danh sách học viên chờ xếp lớp, gói học và thao tác phân bổ vào lớp học',
  },
  students: {
    label: 'Quản lý Học viên',
    description: 'Hồ sơ học viên 360°, thông tin cá nhân, học lực, điểm danh và lịch sử đào tạo',
  },
  mdm_households: {
    label: 'Quản lý Khách hàng & Hộ gia đình',
    description: 'Quản lý danh sách Hộ gia đình, thông tin Phụ huynh (Bố, Mẹ), liên kết các con và công nợ gia đình',
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
  job_titles: {
    label: 'Chức danh',
    description: 'Quản lý danh mục chức danh công việc, định mức và phân bổ/gán nhân sự theo vị trí',
  },
  care_conditions_config: {
    label: 'Danh mục chăm sóc',
    description: 'Cấu hình Quy tắc & Điều kiện Chăm sóc Học viên (Nguồn chỉ số CSDL, Tiêu chí, SLA & Phân công vai trò phụ trách)',
  },
  system_config: {
    label: 'Cấu hình hệ thống',
    description: 'Thiết lập thông tin quyền và ma trận phân quyền Phân hệ Station',
  },
  lead_lifecycle_config: {
    label: 'Cấu hình Phễu & Kho Lead',
    description: 'Quản lý Kho dữ liệu tiếp nhận, Trạng thái phễu tuyển sinh, Mã cuộc gọi tương tác và Ma trận chuyển dịch dữ liệu',
  },
  permissions: {
    label: 'Nhóm quyền',
    description: 'Quản lý Topic phân loại, Nhóm quyền và Ma trận cấp phép hành động RBAC & Data Scope',
  },
  support_tickets: {
    label: 'Quản lý Ticket & Chất lượng',
    description: 'Ghi nhận và xử lý phản ánh, khiếu nại và yêu cầu hỗ trợ từ học viên/phụ huynh',
  },
  branches: {
    label: 'Quản lý cơ sở',
    description: 'Quản lý danh sách cơ sở/chi nhánh, phòng học, sức chứa, giờ hoạt động và cấu hình vận hành cơ sở',
  },
  org_structure: {
    label: 'Sơ đồ tổ chức',
    description: 'Quản lý cây sơ đồ tổ chức, cơ cấu phòng ban và phân bổ nhân sự theo khối/vùng/chi nhánh',
  },
}
