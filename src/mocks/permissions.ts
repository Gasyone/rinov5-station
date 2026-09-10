export type DataScope = 'personal' | 'team' | 'branch' | 'global' | ''

export interface PermissionActionState {
  access: boolean
  create: boolean
  edit: boolean
  delete: boolean
  export: boolean
  viewAll?: boolean
}

export interface PermissionFeatureItem {
  featureKey: string
  featureName: string
  moduleGroupKey: string
  moduleGroupName: string
  parentKey?: string
  level?: number
  hasChildren?: boolean
  isStation?: boolean
  isCrm?: boolean
  supportedActions: {
    access?: boolean
    create?: boolean
    edit?: boolean
    delete?: boolean
    export?: boolean
    viewAll?: boolean
  }
  defaultScope: DataScope
  allowedScopes?: DataScope[]
  description?: string
}

export interface RolePermissionMatrixItem {
  featureKey: string
  actions: PermissionActionState
  scope: DataScope
}

export interface PermissionRole {
  id: string
  topicId: string
  name: string
  code: string
  description: string
  userCount: number
  updatedAt: string
  permissions: RolePermissionMatrixItem[]
}

export interface PermissionTopic {
  id: string
  name: string
  code: string
  description?: string
  color?: string
}

/**
 * Danh mục toàn bộ các Phân hệ và Tính năng nghiệp vụ chuẩn (gồm cả CRM Core cũ và Station mới)
 */
export const SYSTEM_PERMISSION_FEATURES: PermissionFeatureItem[] = [
  // ==========================================
  // I. KHÁCH HÀNG (CRM Core & Station)
  // ==========================================
  {
    featureKey: 'crm_customer_info',
    featureName: 'Thông tin khách hàng / Lead',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true, export: true, viewAll: true },
    defaultScope: '',
    description: 'Xem, thêm mới, sửa thông tin hồ sơ khách hàng tiềm năng và học viên',
  },
  {
    featureKey: 'crm_transfer_owner',
    featureName: 'Chuyển người phụ trách',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, edit: true },
    defaultScope: '',
    description: 'Bàn giao, điều phối lead giữa các chuyên viên tư vấn / CSKH',
  },
  {
    featureKey: 'crm_transfer_relation',
    featureName: 'Chuyển mối quan hệ & Hộ gia đình',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, edit: true },
    defaultScope: '',
    description: 'Gộp hộ gia đình, liên kết phụ huynh và học viên',
  },
  {
    featureKey: 'crm_transfer_warehouse',
    featureName: 'Chuyển kho',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Phân loại lead vào các kho rác, kho nóng, kho tiềm năng',
  },
  {
    featureKey: 'crm_search_all',
    featureName: 'Tìm kiếm tất cả',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Tìm kiếm không giới hạn số điện thoại và hồ sơ khách hàng',
  },
  {
    featureKey: 'crm_merge_contact',
    featureName: 'Gộp contact',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Gộp các contact trùng số điện thoại hoặc email trên hệ thống',
  },
  {
    featureKey: 'crm_admin_search',
    featureName: 'Tìm kiếm cấp admin',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Tra cứu toàn quyền không che số điện thoại cho cấp quản lý',
  },
  {
    featureKey: 'crm_hide_notes_log',
    featureName: 'Ẩn log ghi chú',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Cấu hình ẩn các dòng nhật ký ghi chú nhạy cảm',
  },
  {
    featureKey: 'crm_lock_inline_edit',
    featureName: 'Khóa edit thông tin trực tiếp trên dashboard',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Chặn việc sửa trực tiếp các ô thông tin trên bảng',
  },
  {
    featureKey: 'crm_download_full_info',
    featureName: 'Download thông tin khách hàng full',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Xuất file excel đầy đủ toàn bộ trường dữ liệu khách hàng',
  },
  {
    featureKey: 'crm_care_contact',
    featureName: 'Chăm sóc contact',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Ghi log cuộc gọi, tạo lịch nhắc chăm sóc khách hàng',
  },
  {
    featureKey: 'crm_transfer_agent_warehouse',
    featureName: 'Chuyển kho Thường / Đại lý',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Chuyển đổi nguồn lead giữa kênh nội bộ và kênh đối tác đại lý',
  },
  {
    featureKey: 'crm_create_bot_call',
    featureName: 'Tạo chiến dịch BOT CALL',
    moduleGroupKey: 'crm',
    moduleGroupName: 'KHÁCH HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Lập chiến dịch gọi tự động hàng loạt qua tổng đài AI',
  },

  // ==========================================
  // II. QUẢN LÝ NGƯỜI DÙNG & LỊCH TRÌNH
  // ==========================================
  {
    featureKey: 'usr_users',
    featureName: 'Người dùng',
    moduleGroupKey: 'user_mgmt',
    moduleGroupName: 'QUẢN LÝ NGƯỜI DÙNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true, viewAll: true },
    defaultScope: '',
    description: 'Quản lý tài khoản đăng nhập và nhân sự hệ thống',
  },
  {
    featureKey: 'usr_departments',
    featureName: 'Phòng ban',
    moduleGroupKey: 'user_mgmt',
    moduleGroupName: 'QUẢN LÝ NGƯỜI DÙNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Cơ cấu tổ chức cây phòng ban, chi nhánh và tổ nhóm',
  },
  {
    featureKey: 'usr_kpi',
    featureName: 'KPI',
    moduleGroupKey: 'user_mgmt',
    moduleGroupName: 'QUẢN LÝ NGƯỜI DÙNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Giao chỉ tiêu doanh thu, số cuộc gọi và KPI theo tháng',
  },
  {
    featureKey: 'usr_work_schedule',
    featureName: 'Lịch làm việc',
    moduleGroupKey: 'user_mgmt',
    moduleGroupName: 'QUẢN LÝ NGƯỜI DÙNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true, viewAll: true },
    defaultScope: '',
    description: 'Thời khóa biểu làm việc và ca trực hàng tuần',
  },
  {
    featureKey: 'usr_appointments',
    featureName: 'Lịch hẹn',
    moduleGroupKey: 'user_mgmt',
    moduleGroupName: 'QUẢN LÝ NGƯỜI DÙNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true, viewAll: true },
    defaultScope: '',
    description: 'Lịch hẹn tiếp đón phụ huynh và học viên tại trung tâm',
  },

  // ==========================================
  // III. QUẢN LÝ SẢN PHẨM & GÓI HỌC
  // ==========================================
  {
    featureKey: 'prd_products',
    featureName: 'Sản phẩm',
    moduleGroupKey: 'product_mgmt',
    moduleGroupName: 'QUẢN LÝ SẢN PHẨM',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Quản lý khóa học đơn lẻ, học liệu và giáo trình',
  },
  {
    featureKey: 'prd_groups',
    featureName: 'Nhóm sản phẩm',
    moduleGroupKey: 'product_mgmt',
    moduleGroupName: 'QUẢN LÝ SẢN PHẨM',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Phân loại môn học (Toán, Anh, Văn, Kỹ năng sống...)',
  },
  {
    featureKey: 'prd_combos',
    featureName: 'Combo',
    moduleGroupKey: 'product_mgmt',
    moduleGroupName: 'QUẢN LÝ SẢN PHẨM',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Gói học dài hạn kết hợp nhiều môn hoặc nhiều cấp độ',
  },

  // ==========================================
  // IV. CALL CENTER (TỔNG ĐÀI)
  // ==========================================
  {
    featureKey: 'call_logs',
    featureName: 'Danh sách cuộc gọi',
    moduleGroupKey: 'call_center',
    moduleGroupName: 'CALL CENTER',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, viewAll: true },
    defaultScope: '',
    description: 'Lịch sử cuộc gọi đi, cuộc gọi đến và thời lượng đàm thoại',
  },
  {
    featureKey: 'call_report_general',
    featureName: 'Báo cáo chung',
    moduleGroupKey: 'call_center',
    moduleGroupName: 'CALL CENTER',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Thống kê tổng số phút gọi, tỉ lệ nhấc máy toàn trung tâm',
  },
  {
    featureKey: 'call_report_staff',
    featureName: 'Báo cáo nhân viên',
    moduleGroupKey: 'call_center',
    moduleGroupName: 'CALL CENTER',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Năng suất gọi của từng chuyên viên tư vấn / CSKH',
  },
  {
    featureKey: 'call_recordings',
    featureName: 'Ghi âm',
    moduleGroupKey: 'call_center',
    moduleGroupName: 'CALL CENTER',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, export: true },
    defaultScope: '',
    description: 'Nghe lại và tải file ghi âm cuộc gọi để kiểm soát chất lượng QA',
  },
  {
    featureKey: 'call_auto',
    featureName: 'Auto call',
    moduleGroupKey: 'call_center',
    moduleGroupName: 'CALL CENTER',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Tự động quay số theo danh sách lead phân bổ',
  },

  // ==========================================
  // V. ĐƠN HÀNG & HỌC PHÍ
  // ==========================================
  {
    featureKey: 'ord_orders',
    featureName: 'Đơn hàng',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true, export: true, viewAll: true },
    defaultScope: '',
    description: 'Lập đơn hàng khóa học, áp dụng mã ưu đãi và tính học phí',
  },
  {
    featureKey: 'ord_rollback_v1',
    featureName: 'Quay về luồng đơn cũ ( V1 )',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Chuyển sang giao diện tạo đơn phiên bản cũ',
  },
  {
    featureKey: 'ord_ctv_create',
    featureName: 'CTV tạo đơn',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Cho phép cộng tác viên nhập đơn hàng trực tiếp',
  },
  {
    featureKey: 'ord_view_account',
    featureName: 'Xem tài khoản',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Tra cứu số dư ví học phí và công nợ',
  },
  {
    featureKey: 'ord_confirm_payment',
    featureName: 'Xác nhận thanh toán',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Duyệt chuyển khoản, in phiếu thu tiền học phí',
  },
  {
    featureKey: 'ord_edit_all',
    featureName: 'Sửa mọi đơn hàng',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Quyền đặc quyền sửa đơn hàng đã hoàn tất',
  },
  {
    featureKey: 'ord_export_accounting',
    featureName: 'Export kế toán',
    moduleGroupKey: 'order_mgmt',
    moduleGroupName: 'ĐƠN HÀNG',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Xuất file đối soát doanh thu phục vụ phần mềm kế toán MISA/Fast',
  },

  // ==========================================
  // VI. BÁO CÁO DOANH THU & HIỆU SUẤT
  // ==========================================
  {
    featureKey: 'rpt_general',
    featureName: 'Báo cáo chung',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Dashboard tổng quan số liệu toàn doanh nghiệp',
  },
  {
    featureKey: 'rpt_accounts',
    featureName: 'Báo cáo tài khoản',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, viewAll: true },
    defaultScope: '',
    description: 'Báo cáo doanh số theo từng tài khoản nhân sự',
  },
  {
    featureKey: 'rpt_modules',
    featureName: 'Báo cáo module',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Thống kê theo từng module sản phẩm',
  },
  {
    featureKey: 'rpt_departments',
    featureName: 'Báo cáo phòng ban',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Báo cáo doanh số theo phòng ban / chi nhánh',
  },
  {
    featureKey: 'rpt_best_staff',
    featureName: 'Báo cáo nhân viên xuất sắc',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Bảng vinh danh Top Seller và CSKH tiêu biểu',
  },
  {
    featureKey: 'rpt_team_lead',
    featureName: 'Báo cáo trưởng nhóm',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Hiệu quả quản lý và tỷ lệ chuyển đổi của các team',
  },
  {
    featureKey: 'rpt_revenue',
    featureName: 'Báo cáo doanh thu',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Báo cáo doanh thu thực thu, công nợ và hoàn phí',
  },
  {
    featureKey: 'rpt_personal_achievement',
    featureName: 'Báo cáo thành tích cá nhân',
    moduleGroupKey: 'reports_mgmt',
    moduleGroupName: 'BÁO CÁO',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Theo dõi tiến độ hoàn thành chỉ tiêu cá nhân',
  },

  // ==========================================
  // VII. ĐỐI TÁC & CỘNG TÁC VIÊN
  // ==========================================
  {
    featureKey: 'ptn_dashboard_partner',
    featureName: 'Dashboard Partner',
    moduleGroupKey: 'partner_mgmt',
    moduleGroupName: 'ĐỐI TÁC',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Bảng điều khiển dành riêng cho Giám đốc đối tác',
  },
  {
    featureKey: 'ptn_department_reports',
    featureName: 'Báo cáo phòng ban trực thuộc',
    moduleGroupKey: 'partner_mgmt',
    moduleGroupName: 'ĐỐI TÁC',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Thống kê kết quả mạng lưới đại lý liên kết',
  },
  {
    featureKey: 'ptn_dashboard_ctv',
    featureName: 'Dashboard CTV',
    moduleGroupKey: 'partner_mgmt',
    moduleGroupName: 'ĐỐI TÁC',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Cổng thông tin tra cứu hoa hồng cho cộng tác viên',
  },
  {
    featureKey: 'ptn_ctv_reports',
    featureName: 'Báo cáo CTV',
    moduleGroupKey: 'partner_mgmt',
    moduleGroupName: 'ĐỐI TÁC',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Tổng hợp số lượng lead và đơn hàng thành công từ CTV',
  },
  {
    featureKey: 'ptn_ctv_policy',
    featureName: 'Chính sách CTV',
    moduleGroupKey: 'partner_mgmt',
    moduleGroupName: 'ĐỐI TÁC',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, viewAll: true },
    defaultScope: '',
    description: 'Cấu hình tỷ lệ % chiết khấu hoa hồng giới thiệu học viên',
  },

  // ==========================================
  // VIII. MARKETING & CHIẾN DỊCH
  // ==========================================
  {
    featureKey: 'mkt_marketer_reports',
    featureName: 'Báo cáo marketer',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, viewAll: true },
    defaultScope: '',
    description: 'Chi phí CPL, CPA theo từng chuyên viên Marketing',
  },
  {
    featureKey: 'mkt_content_reports',
    featureName: 'Báo cáo content',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, viewAll: true },
    defaultScope: '',
    description: 'Hiệu quả bài viết và tương tác bài quảng cáo',
  },
  {
    featureKey: 'mkt_daily_registrations',
    featureName: 'Báo cáo đăng ký theo ngày',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Biểu đồ tăng trưởng số lượng đăng ký tư vấn hàng ngày',
  },
  {
    featureKey: 'mkt_messenger_reports',
    featureName: 'Báo cáo messenger',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Số hội thoại inbox Fanpage và tỷ lệ lấy được SĐT',
  },
  {
    featureKey: 'mkt_short_link',
    featureName: 'Short link',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true },
    defaultScope: '',
    description: 'Tạo link rút gọn gắn mã UTM tracking nguồn quảng cáo',
  },
  {
    featureKey: 'mkt_content_code',
    featureName: 'Khai báo mã content',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Danh mục mã bài viết quảng cáo',
  },
  {
    featureKey: 'mkt_campaigns',
    featureName: 'Chiến dịch & Khuyến mại',
    moduleGroupKey: 'marketing_mgmt',
    moduleGroupName: 'MARKETING',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Mã giảm giá, voucher và chương trình ưu đãi học phí',
  },

  // ==========================================
  // IX. CÀI ĐẶT DỮ LIỆU CRM
  // ==========================================
  {
    featureKey: 'set_customers',
    featureName: 'Khách hàng',
    moduleGroupKey: 'data_settings',
    moduleGroupName: 'CÀI ĐẶT DỮ LIỆU',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Cấu hình các trường thông tin động của hồ sơ khách hàng',
  },
  {
    featureKey: 'set_customer_sources',
    featureName: 'Nguồn khách hàng',
    moduleGroupKey: 'data_settings',
    moduleGroupName: 'CÀI ĐẶT DỮ LIỆU',
    isStation: false,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Danh mục nguồn lead (Facebook, Google, Giới thiệu, Hotline...)',
  },

  // ==========================================
  // X. TUYỂN SINH & XẾP LỚP (STATION)
  // ==========================================
  {
    featureKey: 'adm_booking_test',
    featureName: 'Lịch Kiểm tra / Booking Test',
    moduleGroupKey: 'admissions',
    moduleGroupName: 'TUYỂN SINH & XẾP LỚP (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true, delete: true, export: true, viewAll: true },
    defaultScope: '',
    description: 'Đặt lịch hẹn đánh giá năng lực đầu vào và nhập điểm test',
  },
  {
    featureKey: 'adm_trial_class',
    featureName: 'Lịch Học thử (Trial Class)',
    moduleGroupKey: 'admissions',
    moduleGroupName: 'TUYỂN SINH & XẾP LỚP (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true },
    defaultScope: '',
    description: 'Ghép học viên trải nghiệm vào 1 buổi của lớp chính thức',
  },
  {
    featureKey: 'adm_class_placement',
    featureName: 'Xếp lớp Học viên mới',
    moduleGroupKey: 'admissions',
    moduleGroupName: 'TUYỂN SINH & XẾP LỚP (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, edit: true },
    defaultScope: '',
    description: 'Ghép học viên vào lớp chính thức sau khi hoàn tất đóng phí',
  },

  // ==========================================
  // XI. VẬN HÀNH LỚP HỌC (STATION)
  // ==========================================
  {
    featureKey: 'ops_classes',
    featureName: 'Quản lý Lớp học',
    moduleGroupKey: 'operations',
    moduleGroupName: 'VẬN HÀNH LỚP HỌC (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true, delete: true, export: true, viewAll: true },
    defaultScope: '',
    description: 'Tạo lớp, cập nhật phòng học, đổi giáo viên, chia ca học',
  },
  {
    featureKey: 'ops_attendance_evaluation',
    featureName: 'Điểm danh & Đánh giá buổi học',
    moduleGroupKey: 'operations',
    moduleGroupName: 'VẬN HÀNH LỚP HỌC (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, edit: true, export: true },
    defaultScope: '',
    description: 'Điểm danh chuyên cần, chấm bài tập về nhà, ghi nhận xét',
  },
  {
    featureKey: 'ops_leave_reserve',
    featureName: 'Bảo lưu & Nghỉ phép học viên',
    moduleGroupKey: 'operations',
    moduleGroupName: 'VẬN HÀNH LỚP HỌC (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true },
    defaultScope: '',
    description: 'Tiếp nhận và duyệt đơn xin nghỉ phép, tạm dừng gói học',
  },
  {
    featureKey: 'ops_makeup_class',
    featureName: 'Quản lý & Sắp xếp Học bù',
    moduleGroupKey: 'operations',
    moduleGroupName: 'VẬN HÀNH LỚP HỌC (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true },
    defaultScope: '',
    description: 'Tạo ca học bù, xếp lịch học bù cho học viên vắng có phép',
  },

  // ==========================================
  // XII. CHĂM SÓC HỌC VIÊN & TÁI PHÍ (STATION)
  // ==========================================
  {
    featureKey: 'care_operations_alert',
    featureName: 'Cảnh báo & Vận hành Chăm sóc',
    moduleGroupKey: 'care',
    moduleGroupName: 'CHĂM SÓC HỌC VIÊN & TÁI PHÍ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true, export: true, viewAll: true },
    defaultScope: '',
    description: 'Xử lý các ca cảnh báo học tập, gọi điện chăm sóc, ghi log cuộc gọi',
  },
  {
    featureKey: 'care_dispatcher',
    featureName: 'Điều phối & Gán nhân sự CSKH',
    moduleGroupKey: 'care',
    moduleGroupName: 'CHĂM SÓC HỌC VIÊN & TÁI PHÍ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, edit: true },
    defaultScope: '',
    description: 'Phân công học viên cho các chuyên viên CSKH phụ trách',
  },
  {
    featureKey: 'care_renewal',
    featureName: 'Quản lý Tái phí & Phễu gia hạn',
    moduleGroupKey: 'care',
    moduleGroupName: 'CHĂM SÓC HỌC VIÊN & TÁI PHÍ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, edit: true, export: true },
    defaultScope: '',
    description: 'Theo dõi hạn học dự kiến, chăm sóc tái phí theo tháng T, T+1',
  },
  {
    featureKey: 'care_tickets',
    featureName: 'Quản lý Ticket & Khiếu nại dịch vụ',
    moduleGroupKey: 'care',
    moduleGroupName: 'CHĂM SÓC HỌC VIÊN & TÁI PHÍ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Tiếp nhận phản ánh chất lượng và theo dõi SLA giải quyết khiếu nại',
  },

  // ==========================================
  // XIII. LỊCH BIỂU & NHÂN SỰ CƠ SỞ (STATION)
  // ==========================================
  {
    featureKey: 'hr_my_schedule',
    featureName: 'Lịch của tôi & Đăng ký ca',
    moduleGroupKey: 'hr_schedule',
    moduleGroupName: 'LỊCH BIỂU & NHÂN SỰ CƠ SỞ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true },
    defaultScope: '',
    description: 'Xem thời khóa biểu cá nhân, đăng ký lịch làm việc hàng tuần',
  },
  {
    featureKey: 'hr_teacher_assignment',
    featureName: 'Phân công Giảng dạy & Duyệt dạy thay',
    moduleGroupKey: 'hr_schedule',
    moduleGroupName: 'LỊCH BIỂU & NHÂN SỰ CƠ SỞ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, edit: true, export: true },
    defaultScope: '',
    description: 'Phân công giáo viên chủ nhiệm, duyệt báo nghỉ và giáo viên dạy thay',
  },
  {
    featureKey: 'hr_employees_directory',
    featureName: 'Hồ sơ Nhân sự & Hợp đồng',
    moduleGroupKey: 'hr_schedule',
    moduleGroupName: 'LỊCH BIỂU & NHÂN SỰ CƠ SỞ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true, delete: true, export: true },
    defaultScope: '',
    description: 'Quản lý danh sách giáo viên, trợ giảng, nhân viên trung tâm',
  },
  {
    featureKey: 'hr_reports_exec',
    featureName: 'Báo cáo Vận hành Cơ sở',
    moduleGroupKey: 'hr_schedule',
    moduleGroupName: 'LỊCH BIỂU & NHÂN SỰ CƠ SỞ (STATION)',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, export: true },
    defaultScope: '',
    description: 'Báo cáo chuyên cần, doanh thu, KPI chăm sóc, tổng số buổi dạy',
  },

  // ==========================================
  // XIV. CẤU HÌNH HỆ THỐNG
  // ==========================================
  {
    featureKey: 'sys_care_conditions',
    featureName: 'Danh mục Điều kiện Chăm sóc',
    moduleGroupKey: 'sys_config',
    moduleGroupName: 'CẤU HÌNH HỆ THỐNG',
    isStation: true,
    isCrm: false,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Cấu hình quy tắc kích hoạt cảnh báo, SLA giờ, vai trò phụ trách',
  },
  {
    featureKey: 'sys_permissions_matrix',
    featureName: 'Quản lý Nhóm quyền & Ma trận Phân quyền',
    moduleGroupKey: 'sys_config',
    moduleGroupName: 'CẤU HÌNH HỆ THỐNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Định nghĩa Topic, Nhóm quyền (Roles), cấp phép hành động và Data Scope',
  },
  {
    featureKey: 'sys_user_accounts',
    featureName: 'Quản lý Tài khoản & Gán Role',
    moduleGroupKey: 'sys_config',
    moduleGroupName: 'CẤU HÌNH HỆ THỐNG',
    isStation: true,
    isCrm: true,
    supportedActions: { access: true, create: true, edit: true, delete: true },
    defaultScope: '',
    description: 'Tạo tài khoản đăng nhập, gán nhóm quyền, khóa/mở khóa tài khoản',
  },
]

/**
 * Mô tả ngắn (subtitle) chuẩn hóa cho 8 Phân hệ lớn của Station
 */
export const STATION_MODULE_GROUP_DESCRIPTIONS: Record<string, string> = {
  group_renewal: 'Theo dõi danh sách học viên sắp hết phí, lịch sử tư vấn tái đăng ký và phễu gia hạn',
}

/**
 * Danh mục các tính năng nghiệp vụ chuẩn hóa riêng cho Phân hệ Station (Rinov5)
 * Chỉ giữ lại Phân hệ / Màn hình tác nghiệp "Tái phí học viên"
 */
export const STATION_PERMISSION_FEATURES: PermissionFeatureItem[] = [
  {
    featureKey: 'renewal',
    featureName: 'Tái phí học viên',
    moduleGroupKey: 'group_renewal',
    moduleGroupName: 'TÁI PHÍ HỌC VIÊN',
    level: 1,
    isStation: true,
    supportedActions: { access: true, viewAll: true, create: true, edit: true, delete: false, export: true },
    defaultScope: 'branch',
    description: 'Theo dõi danh sách học viên sắp hết phí và lịch sử tư vấn tái đăng ký',
  },
]

export const MOCK_PERMISSION_TOPICS: PermissionTopic[] = [
  { id: 'topic_sale_tu_hoc', name: 'Sale Tự học', code: 'TOPIC_SALE_TU_HOC', description: 'Nhóm quyền dành cho đội ngũ Tư vấn tuyển sinh chương trình Tự học' },
  { id: 'topic_sale_gia_han', name: 'Sale gia hạn', code: 'TOPIC_SALE_GIA_HAN', description: 'Đội ngũ tư vấn tái phí và gia hạn khóa học' },
  { id: 'topic_sale_thpt', name: 'Sale THPT', code: 'TOPIC_SALE_THPT', description: 'Đội ngũ tư vấn tuyển sinh khối Trung học Phổ thông' },
  { id: 'topic_van_hanh_tu_van', name: 'Vận hành Tư vấn', code: 'TOPIC_OPS_SALE', description: 'Sale Admin, Điều phối đơn hàng và QA Đào tạo' },
  { id: 'topic_doi_tac', name: 'Đối tác_Partner', code: 'TOPIC_PARTNER', description: 'Đại lý phân phối và Giám đốc Kinh doanh Đối tác' },
  { id: 'topic_marketing', name: 'Marketing', code: 'TOPIC_MKT', description: 'Đội ngũ Marketing Digital, Quảng cáo và Quản lý thương hiệu' },
  { id: 'topic_cskh', name: 'CSKH', code: 'TOPIC_CSKH', description: 'Chuyên viên Chăm sóc Khách hàng và Trưởng nhóm CSKH' },
  { id: 'topic_van_don', name: 'Vận đơn', code: 'TOPIC_LOGISTICS', description: 'Giao nhận học liệu, sách và tài liệu học tập' },
  { id: 'topic_dao_tao', name: 'Đào tạo & Giảng dạy', code: 'TOPIC_ACADEMIC', description: 'Giáo viên chính, Giáo viên dạy thay, Trợ giảng và Quản lý chuyên môn' },
  { id: 'topic_quan_ly_co_so', name: 'Quản trị Cơ sở', code: 'TOPIC_BRANCH_MGMT', description: 'Giám đốc Chi nhánh, Quản lý Vận hành và Ban Giám đốc' },
]

/**
 * Khởi tạo ma trận phân quyền Phân hệ Station (Tái phí học viên) chuẩn xác cho từng Role
 */
function getRoleStationPermissions(roleId: string): RolePermissionMatrixItem[] {
  return STATION_PERMISSION_FEATURES.map((feat) => {
    let actions: PermissionActionState = {
      access: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
      viewAll: false,
    }
    let scope: DataScope = feat.defaultScope || ''

    if (roleId === 'role_tai_phi_hoc_vien') {
      // Chuyên viên Tái phí học viên: Toàn quyền tác nghiệp tái phí trong chi nhánh
      actions = { access: true, create: true, edit: true, delete: false, export: true, viewAll: true }
      scope = 'branch'
    } else if (roleId === 'role_gia_han_telesale') {
      // Telesale Gia hạn: Xem và cập nhật trao đổi tái phí của cá nhân
      actions = { access: true, create: false, edit: true, delete: false, export: false, viewAll: false }
      scope = 'personal'
    } else if (roleId === 'role_quan_ly_bm') {
      // Giám đốc cơ sở: Toàn quyền quản lý tái phí chi nhánh
      actions = { access: true, create: true, edit: true, delete: true, export: true, viewAll: true }
      scope = 'branch'
    }

    return {
      featureKey: feat.featureKey,
      actions,
      scope,
    }
  })
}

export const MOCK_PERMISSION_ROLES: PermissionRole[] = [
  {
    id: 'role_tai_phi_hoc_vien',
    topicId: 'topic_sale_gia_han',
    name: 'Tái phí học viên',
    code: 'ROLE_TAI_PHI_HOC_VIEN',
    description: 'Chuyên viên tư vấn tái phí, theo dõi danh sách học viên sắp hết phí và lịch sử tư vấn tái đăng ký',
    userCount: 8,
    updatedAt: '2026-08-15 10:30',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: f.moduleGroupKey === 'care' || f.featureKey === 'ord_orders' || f.featureKey === 'care_renewal',
          create: f.featureKey === 'ord_orders' || f.featureKey === 'care_operations_alert',
          edit: f.featureKey === 'care_renewal' || f.featureKey === 'care_operations_alert',
          delete: false,
          export: f.featureKey === 'care_renewal',
          viewAll: f.featureKey === 'care_renewal',
        },
        scope: f.isStation ? ('branch' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_tai_phi_hoc_vien'),
    ],
  },
  {
    id: 'role_tu_hoc_telesale',
    topicId: 'topic_sale_tu_hoc',
    name: '[Tự học] Telesale',
    code: 'ROLE_TU_HOC_TELESALE',
    description: 'Chuyên viên tư vấn tuyển sinh mảng Tự học, tiếp nhận lead và tạo đơn hàng',
    userCount: 14,
    updatedAt: '2026-08-01 14:30',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: f.moduleGroupKey === 'crm' || f.featureKey === 'ord_orders' || f.featureKey === 'adm_booking_test',
          create: f.featureKey === 'crm_customer_info' || f.featureKey === 'ord_orders' || f.featureKey === 'adm_booking_test',
          edit: f.featureKey === 'crm_customer_info' || f.featureKey === 'ord_orders',
          delete: false,
          export: false,
          viewAll: false,
        },
        scope: f.isStation ? ('personal' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_tu_hoc_telesale'),
    ],
  },
  {
    id: 'role_tu_hoc_s_lead',
    topicId: 'topic_sale_tu_hoc',
    name: '[Tự học] S-lead',
    code: 'ROLE_TU_HOC_S_LEAD',
    description: 'Trưởng nhóm Tư vấn Tuyển sinh mảng Tự học, phân bổ lead và duyệt đơn',
    userCount: 4,
    updatedAt: '2026-08-05 09:15',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: f.moduleGroupKey === 'crm' || f.moduleGroupKey === 'order_mgmt' || f.moduleGroupKey === 'admissions',
          create: true,
          edit: true,
          delete: false,
          export: f.moduleGroupKey === 'crm',
          viewAll: true,
        },
        scope: f.isStation ? ('team' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_tu_hoc_s_lead'),
    ],
  },
  {
    id: 'role_gia_han_telesale',
    topicId: 'topic_sale_gia_han',
    name: '[Gia hạn] Telesale',
    code: 'ROLE_GIA_HAN_TELESALE',
    description: 'Chuyên viên tư vấn tái phí, liên hệ phụ huynh sắp hết hạn học',
    userCount: 8,
    updatedAt: '2026-07-28 16:20',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: f.moduleGroupKey === 'care' || f.featureKey === 'ord_orders',
          create: f.featureKey === 'ord_orders' || f.featureKey === 'care_operations_alert',
          edit: f.featureKey === 'care_renewal' || f.featureKey === 'care_operations_alert',
          delete: false,
          export: false,
          viewAll: false,
        },
        scope: f.isStation ? ('personal' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_gia_han_telesale'),
    ],
  },
  {
    id: 'role_cskh_specialist',
    topicId: 'topic_cskh',
    name: '[CSKH] Chăm sóc khách hàng',
    code: 'ROLE_CSKH_SPECIALIST',
    description: 'Chuyên viên Chăm sóc Khách hàng phụ trách tiếp nhận, xử lý cảnh báo và tương tác định kỳ',
    userCount: 16,
    updatedAt: '2026-08-07 10:15',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: f.moduleGroupKey === 'care' || f.moduleGroupKey === 'operations' || f.featureKey === 'adm_trial_class',
          create: f.featureKey === 'care_operations_alert' || f.featureKey === 'care_tickets',
          edit: f.moduleGroupKey === 'care' || f.featureKey === 'ops_leave_reserve' || f.featureKey === 'ops_makeup_class',
          delete: false,
          export: f.moduleGroupKey === 'care',
          viewAll: false,
        },
        scope: f.isStation ? ('branch' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_cskh_specialist'),
    ],
  },
  {
    id: 'role_dao_tao_gv_chinh',
    topicId: 'topic_dao_tao',
    name: '[Đào tạo] Giáo viên chính',
    code: 'ROLE_TEACHER_PRIMARY',
    description: 'Giáo viên trực tiếp giảng dạy tại lớp, điểm danh, chấm BTVN và đánh giá học thuật',
    userCount: 42,
    updatedAt: '2026-08-06 18:00',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: f.moduleGroupKey === 'operations' || f.featureKey === 'hr_my_schedule' || f.featureKey === 'adm_booking_test',
          create: f.featureKey === 'hr_my_schedule',
          edit: f.featureKey === 'ops_attendance_evaluation' || f.featureKey === 'adm_booking_test',
          delete: false,
          export: false,
          viewAll: false,
        },
        scope: f.isStation ? ('personal' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_dao_tao_gv_chinh'),
    ],
  },
  {
    id: 'role_quan_ly_bm',
    topicId: 'topic_quan_ly_co_so',
    name: '[Quản lý] Giám đốc Cơ sở',
    code: 'ROLE_BRANCH_MANAGER',
    description: 'Giám đốc Chi nhánh quản lý toàn bộ vận hành, nhân sự, tuyển sinh và tài chính cơ sở',
    userCount: 8,
    updatedAt: '2026-08-07 11:00',
    permissions: [
      ...SYSTEM_PERMISSION_FEATURES.map((f) => ({
        featureKey: f.featureKey,
        actions: {
          access: true,
          create: true,
          edit: true,
          delete: f.moduleGroupKey !== 'sys_config',
          export: true,
          viewAll: true,
        },
        scope: f.isStation ? ('branch' as DataScope) : ('' as DataScope),
      })),
      ...getRoleStationPermissions('role_quan_ly_bm'),
    ],
  },
]
