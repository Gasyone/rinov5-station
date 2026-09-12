import {
  CalendarDays,
  GraduationCap,
  SlidersHorizontal,
  Home,
  Ticket,
  Settings,
  TrendingUp,
  Package,
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
      { id: 'my_schedule', label: 'Lịch của tôi', href: '/app/my_schedule' },
      { id: 'calendar_class_schedule', label: 'Lịch học trung tâm', href: '/app/calendar_class_schedule' },
      { id: 'digi_schedule', label: 'Lịch học digi', href: '/app/digi_schedule' },
      { id: 'calendar_event_schedule', label: 'Lịch test', href: '/app/calendar_event_schedule' },
      { id: 'work_registration', label: 'Đăng ký lịch', href: '/app/work_registration' },
      { id: 'event_management_new', label: 'Quản lý sự kiện', href: '/app/event_management_new' },
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
    id: 'group_crm_commercial',
    label: 'CRM & Thương mại',
    icon: TrendingUp,
    items: [
      { id: 'crm_my_leads', label: 'Lead của tôi', href: '/app/crm_my_leads' },
      { id: 'crm_leads', label: 'Quản lý Lead', href: '/app/crm_leads' },
      { id: 'orders', label: 'Quản lý đơn hàng', href: '/app/orders' },
      { id: 'payment_receipts', label: 'Thanh toán', href: '/app/payment_receipts' },
    ],
  },
  {
    id: 'group_products_programs',
    label: 'Sản phẩm & Chương trình',
    icon: Package,
    hiddenInSidebar: true,
    items: [
      { id: 'products', label: 'Quản lý sản phẩm', href: '/app/products' },
      { id: 'campaigns', label: 'Quản lý Chiến dịch', href: '/app/campaigns' },
      { id: 'promotions', label: 'Quản lý Khuyến mãi', href: '/app/promotions' },
    ],
  },
  {
    id: 'group_enrollment',
    label: 'Tuyển sinh & Xếp lớp',
    icon: GraduationCap,
    items: [
      { id: 'booking_test', label: 'Kiểm tra/Trải nghiệm', href: '/app/booking_test' },
      { id: 'trial_class', label: 'Lớp học thử', href: '/app/trial_class' },
      { id: 'class_placement', label: 'Xếp lớp học viên', href: '/app/class_placement' },
    ],
  },
  {
    id: 'group_class_management',
    label: 'Vận hành & Chăm sóc',
    icon: GraduationCap,
    items: [
      { id: 'classes', label: 'Quản lý Lớp học', href: '/app/classes' },
      { id: 'order_fulfillment', label: 'Bàn giao & Giao hàng', href: '/app/order_fulfillment' },
      { id: 'leave_reserve', label: 'Bảo lưu & Nghỉ phép', href: '/app/leave_reserve' },
      { id: 'makeup_class', label: 'Học bù học viên', href: '/app/makeup_class' },
      { id: 'student_operations_alert', label: 'Chăm sóc học viên', href: '/app/student_operations_alert' },
      { id: 'renewal', label: 'Tái phí học viên', href: '/app/renewal' },
    ],
  },
  {
    id: 'group_tickets',
    label: 'Ticket & Chất lượng',
    icon: Ticket,
    items: [
      { id: 'support_tickets', label: 'Quản lý Ticket & Chất lượng', href: '/app/support_tickets' },
    ],
  },
  {
    id: 'group_operations_config',
    label: 'Cấu hình Vận hành',
    icon: SlidersHorizontal,
    items: [
      { id: 'branches', label: 'Quản lý cơ sở', href: '/app/branches' },
      { id: 'org_structure', label: 'Sơ đồ tổ chức', href: '/app/org_structure' },
      { id: 'job_titles', label: 'Chức danh', href: '/app/job_titles' },
    ],
  },
  {
    id: 'group_system_config',
    label: 'Cấu hình Hệ thống',
    icon: Settings,
    items: [
      { id: 'system_config', label: 'Cấu hình hệ thống', href: '/app/system_config' },
      { id: 'lead_lifecycle_config', label: 'Cấu hình Phễu & Kho Lead', href: '/app/lead_lifecycle_config' },
      { id: 'care_conditions_config', label: 'Danh mục chăm sóc', href: '/app/care_conditions_config' },
      { id: 'permissions', label: 'Nhóm quyền', href: '/app/permissions' },
    ],
  },
]

export function getNavigationGroupsForRole(role?: string): NavigationGroup[] {
  if (!role) return navigationGroups
  return navigationGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role)),
  }))
}

export const allMenuItems: MenuItem[] = navigationGroups.flatMap((group) => group.items)
