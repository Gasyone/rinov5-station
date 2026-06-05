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
//   {
//     id: 'group_dashboard',
//     label: 'Dashboard',
//     icon: Home,
//     items: [
//       { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard' },
//     ],
//   },
  {
    id: 'group_calendar',
    label: 'Lịch biểu',
    icon: CalendarDays,
    items: [
      { id: 'calendar_class_schedule', label: 'Lịch học', href: '/app/calendar_class_schedule' },
      { id: 'calendar_event_schedule', label: 'Lịch sự kiện', href: '/app/calendar_event_schedule' },
      { id: 'my_schedule', label: 'Lịch của tôi', href: '/app/my_schedule' },
      { id: 'work_registration', label: 'Đăng ký lịch', href: '/app/work_registration' },
    ],
  },
  {
    id: 'group_workspace_hidden',
    label: 'Workspace',
    icon: Home,
    hiddenInSidebar: true,
    items: [
      { id: 'design_system', label: 'Design System', href: '/app/design_system', hiddenInSidebar: true },
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
      { id: 'booking_test', label: 'Kiểm tra/Trải nghiệm', href: '/app/booking_test' },
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
    id: 'group_class_management',
    label: 'Vận hành lớp học',
    icon: GraduationCap,
    items: [
      { id: 'classes', label: 'Lớp học', href: '/app/classes' },
      { id: 'students', label: 'Học viên', href: '/app/students' },
      { id: 'leave_reserve', label: 'Bảo lưu & Chuyển lớp', href: '/app/leave_reserve' },
      { id: 'attendance', label: 'Điểm danh', href: '/app/attendance' },
    ],
  },
  {
    id: 'group_operations',
    label: 'Vận hành',
    icon: Briefcase,
    hiddenInSidebar: true,
    items: [],
  },
  {
    id: 'group_care',
    label: 'Chăm sóc',
    icon: MessageSquare,
    items: [

      { id: 'student_operations_alert', label: 'Theo dõi vận hành', href: '/app/student_operations_alert' },
      { id: 'renewal', label: 'Tái phí học viên', href: '/app/renewal' },
      { id: 'today_care', label: 'Phiếu chăm sóc', href: '/app/today_care' },
      { id: 'care_schedule', label: 'Lịch hẹn chăm sóc', href: '/app/care_schedule' },
      { id: 'care_rule_engine', label: 'Quy tắc chăm sóc', href: '/app/care_rule_engine' },
    ],
  },
  {
    id: 'group_quality',
    label: 'Quản lý chất lượng',
    icon: ShieldCheck,
    items: [
      { id: 'qc_check', label: 'Kiểm tra chất lượng', href: '/app/qc_check' },
      { id: 'qc_remediation', label: 'Khắc phục', href: '/app/qc_remediation' },
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
  {
    id: 'group_calendar_v2',
    label: 'Lịch biểu v2',
    icon: CalendarDays,
    items: [
      { id: 'calendar_class_schedule_v2', label: 'Lịch học', href: '/app/calendar_class_schedule_v2' },
      { id: 'calendar_event_schedule_v2', label: 'Lịch sự kiện', href: '/app/calendar_event_schedule_v2' },
      { id: 'my_schedule_v2', label: 'Lịch của tôi', href: '/app/my_schedule_v2' },
      { id: 'work_registration_v2', label: 'Đăng ký lịch', href: '/app/work_registration_v2' },
    ],
  },
  {
    id: 'group_enrollment_v2',
    label: 'Tuyển sinh v2',
    icon: GraduationCap,
    items: [
      { id: 'booking_test_v2', label: 'Kiểm tra/ Trải nghiệm', href: '/app/booking_test_v2' },
      { id: 'trial_class_v2', label: 'Lớp học thử', href: '/app/trial_class_v2' },
      { id: 'event_management_new_v2', label: 'Quản lý sự kiện', href: '/app/event_management_new_v2' },
    ],
  },
  {
    id: 'group_class_management_v2',
    label: 'Vận hành lớp học v2',
    icon: GraduationCap,
    items: [
      { id: 'classes_v2', label: 'Lớp học', href: '/app/classes_v2' },
      { id: 'students_v2', label: 'Học viên', href: '/app/students_v2' },
      { id: 'teachers_v2', label: 'Giáo viên', href: '/app/teachers_v2' },
      { id: 'leave_reserve_v2', label: 'Bảo lưu & Chuyển lớp', href: '/app/leave_reserve_v2' },
    ],
  },
  {
    id: 'group_session_management_v2',
    label: 'Quản lý buổi học v2',
    icon: CalendarDays,
    items: [
      { id: 'class_sessions_v2', label: 'Buổi học', href: '/app/class_sessions_v2' },
      { id: 'attendance_v2', label: 'Điểm danh', href: '/app/attendance_v2' },
      { id: 'session_feedback_v2', label: 'Nhận xét', href: '/app/session_feedback_v2' },
    ],
  },
]

export const allMenuItems = navigationGroups.flatMap((group) => group.items)

export function getNavigationGroupsForRole(role?: string | null): NavigationGroup[] {
  return navigationGroups
    .filter((group) => !group.allowedRoles || (role ? group.allowedRoles.includes(role) : false))
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.allowedRoles || (role ? item.allowedRoles.includes(role) : false)
      ),
    }))
    .filter((group) => group.items.length > 0)
}
