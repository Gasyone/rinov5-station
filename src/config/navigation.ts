import {
  CalendarDays,
  GraduationCap,
  BarChart3,
  Briefcase,
  Wallet,
  Package,
  BookOpen,
  Settings,
  MessageSquare,
  ShieldCheck,
  Database,
  Users,
  Home,
  type LucideIcon,
} from 'lucide-react'

export interface MenuItem {
  id: string
  label: string
  icon?: LucideIcon
  href: string
  allowedRoles?: string[]
  hiddenInSidebar?: boolean
}

export interface NavigationGroup {
  id: string
  label: string
  icon: LucideIcon
  items: MenuItem[]
  hiddenInSidebar?: boolean
  allowedRoles?: string[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: 'group_calendar',
    label: 'Lịch biểu',
    icon: CalendarDays,
    items: [
      { id: 'calendar_class_schedule', label: 'Lịch lớp học', href: '/app/calendar_class_schedule' },
      { id: 'calendar_event_schedule', label: 'Lịch sự kiện', href: '/app/calendar_event_schedule' },
      { id: 'my_schedule', label: 'Lịch của tôi', href: '/app/my_schedule' },
    ],
  },
  {
    id: 'group_workspace_hidden',
    label: 'Workspace',
    icon: Home,
    hiddenInSidebar: true,
    items: [
      { id: 'design_system', label: 'Design System', href: '/app/design_system', hiddenInSidebar: true },
      { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', hiddenInSidebar: true },
    ],
  },
  {
    id: 'group_customers',
    label: 'Khách hàng',
    icon: Users,
    hiddenInSidebar: true,
    items: [
      { id: 'contact_directory', label: 'Danh bạ liên hệ', href: '/app/contact_directory' },
      { id: 'contact_shared_directory', label: 'Danh bạ chung', href: '/app/contact_shared_directory' },
      { id: 'contact_interactions', label: 'Tương tác', href: '/app/contact_interactions' },
      { id: 'contact_followups', label: 'Theo dõi', href: '/app/contact_followups' },
      { id: 'contact_settings', label: 'Cài đặt liên hệ', href: '/app/contact_settings' },
    ],
  },
  {
    id: 'group_enrollment',
    label: 'Tuyển sinh',
    icon: GraduationCap,
    items: [
      { id: 'booking_test', label: 'Đặt lịch test', href: '/app/booking_test' },
      { id: 'trial_class', label: 'Lớp học thử', href: '/app/trial_class' },
      { id: 'event_management_new', label: 'Quản lý sự kiện', href: '/app/event_management_new' },
    ],
  },
  {
    id: 'group_sales',
    label: 'Bán hàng',
    icon: BarChart3,
    hiddenInSidebar: true,
    items: [
      { id: 'placement_test', label: 'Bài kiểm tra đầu vào', href: '/app/placement_test' },
      { id: 'sales_event', label: 'Sự kiện bán hàng', href: '/app/sales_event' },
      { id: 'orders', label: 'Đơn hàng', href: '/app/orders' },
      { id: 'receipts', label: 'Biên lai', href: '/app/receipts' },
      { id: 'sales_report', label: 'Báo cáo bán hàng', href: '/app/sales_report' },
    ],
  },
  {
    id: 'group_operations',
    label: 'Vận hành',
    icon: Briefcase,
    items: [
      { id: 'class_assignment', label: 'Phân lớp', href: '/app/class_assignment' },
      { id: 'students', label: 'Học viên', href: '/app/students' },
      { id: 'classes', label: 'Lớp học', href: '/app/classes' },
      { id: 'teachers', label: 'Giáo viên', href: '/app/teachers' },
      { id: 'leave_reserve', label: 'Bảo lưu', href: '/app/leave_reserve' },
      { id: 'attendance', label: 'Điểm danh', href: '/app/attendance' },
    ],
  },
  {
    id: 'group_care',
    label: 'Chăm sóc',
    icon: MessageSquare,
    hiddenInSidebar: true,
    items: [
      { id: 'student_care_new', label: 'Chăm sóc học viên mới', href: '/app/student_care_new' },
      { id: 'care_schedule', label: 'Lịch chăm sóc', href: '/app/care_schedule' },
      { id: 'today_care', label: 'Hôm nay', href: '/app/today_care', hiddenInSidebar: true },
      { id: 'new_student_care', label: 'Học viên mới', href: '/app/new_student_care' },
      { id: 'at_risk_care', label: 'Có nguy cơ', href: '/app/at_risk_care', hiddenInSidebar: true },
      { id: 'expiring_soon_care', label: 'Sắp hết hạn', href: '/app/expiring_soon_care', hiddenInSidebar: true },
      { id: 'renewal', label: 'Gia hạn', href: '/app/renewal' },
      { id: 'overdue_care', label: 'Quá hạn', href: '/app/overdue_care', hiddenInSidebar: true },
      { id: 'special_care', label: 'Chăm sóc đặc biệt', href: '/app/special_care' },
      { id: 'care_event', label: 'Sự kiện chăm sóc', href: '/app/care_event' },
      { id: 'care_rule_engine', label: 'Quy tắc chăm sóc', href: '/app/care_rule_engine' },
    ],
  },
  {
    id: 'group_quality',
    label: 'Chất lượng',
    icon: ShieldCheck,
    hiddenInSidebar: true,
    items: [
      { id: 'teacher_qc', label: 'Quản lý giáo viên', href: '/app/teacher_qc' },
      { id: 'facility_checklist', label: 'Kiểm tra cơ sở', href: '/app/facility_checklist' },
      { id: 'quality_issues', label: 'Vấn đề chất lượng', href: '/app/quality_issues' },
    ],
  },
  {
    id: 'group_products',
    label: 'Sản phẩm',
    icon: Package,
    hiddenInSidebar: true,
    items: [
      { id: 'products', label: 'Danh sách sản phẩm', href: '/app/products' },
      { id: 'product_groups', label: 'Nhóm sản phẩm', href: '/app/product_groups' },
      { id: 'combos', label: 'Gói combo', href: '/app/combos' },
      { id: 'product_settings', label: 'Cài đặt sản phẩm', href: '/app/product_settings' },
    ],
  },
  {
    id: 'group_academic',
    label: 'Học thuật',
    icon: BookOpen,
    items: [
      { id: 'program_management', label: 'Quản lý chương trình', href: '/app/program_management' },
      { id: 'learning_path', label: 'Lộ trình học', href: '/app/learning_path' },
      { id: 'syllabus', label: 'Đề cương', href: '/app/syllabus' },
      { id: 'lesson_components', label: 'Thành phần bài học', href: '/app/lesson_components' },
      { id: 'skill_category', label: 'Nhóm kỹ năng', href: '/app/skill_category' },
      { id: 'curriculum', label: 'Chương trình giảng dạy', href: '/app/curriculum' },
      { id: 'academic_settings', label: 'Cài đặt học thuật', href: '/app/academic_settings' },
    ],
  },
  {
    id: 'group_hr',
    label: 'Nhân sự',
    icon: Wallet,
    items: [
      { id: 'hr_employees', label: 'Nhân viên', href: '/app/hr_employees' },
      { id: 'branch_list', label: 'Chi nhánh', href: '/app/branch_list' },
      { id: 'org_structure', label: 'Cơ cấu tổ chức', href: '/app/org_structure' },
      { id: 'payroll', label: 'Bảng lương', href: '/app/payroll', hiddenInSidebar: true },
      { id: 'reward_penalty', label: 'Khen thưởng / Kỷ luật', href: '/app/reward_penalty', hiddenInSidebar: true },
      { id: 'system_config', label: 'Cấu hình hệ thống', href: '/app/system_config' },
    ],
  },
  {
    id: 'group_reports',
    label: 'Báo cáo',
    icon: BarChart3,
    hiddenInSidebar: true,
    items: [
      { id: 'chain_report', label: 'Báo cáo chuỗi', href: '/app/chain_report' },
      { id: 'regional_report', label: 'Báo cáo khu vực', href: '/app/regional_report' },
      { id: 'branch_report', label: 'Báo cáo chi nhánh', href: '/app/branch_report' },
      { id: 'advanced_report', label: 'Báo cáo nâng cao', href: '/app/advanced_report' },
    ],
  },
  {
    id: 'group_master_data',
    label: 'Dữ liệu gốc',
    icon: Database,
    items: [
      { id: 'profile_individuals', label: 'Cá nhân', href: '/app/profile_individuals' },
      { id: 'profile_organizations', label: 'Tổ chức', href: '/app/profile_organizations', hiddenInSidebar: true },
      { id: 'profile_family', label: 'Gia đình', href: '/app/profile_family' },
    ],
  },
  {
    id: 'group_system',
    label: 'Hệ thống',
    icon: Settings,
    items: [
      { id: 'users', label: 'Người dùng', href: '/app/users' },
      { id: 'devices', label: 'Thiết bị', href: '/app/devices', hiddenInSidebar: true },
      { id: 'permissions', label: 'Phân quyền', href: '/app/permissions' },
    ],
  },
]

export const allMenuItems = navigationGroups.flatMap((group) => group.items)
