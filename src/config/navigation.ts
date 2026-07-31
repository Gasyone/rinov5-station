import {
  CalendarDays,
  GraduationCap,
  Briefcase,
  Home,
  Ticket,
  Settings,
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
      { id: 'calendar_class_schedule_v2', label: 'Lịch học V2', href: '/app/calendar_class_schedule_v2' },
      { id: 'calendar_class_schedule', label: 'Lịch học', href: '/app/calendar_class_schedule' },
      { id: 'calendar_event_schedule', label: 'Lịch sự kiện', href: '/app/calendar_event_schedule' },
      { id: 'event_management_new', label: 'Quản lý sự kiện', href: '/app/event_management_new' },
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
    id: 'group_enrollment',
    label: 'Tuyển sinh & Xếp lớp',
    icon: GraduationCap,
    items: [
      { id: 'booking_test', label: 'Kiểm tra/Trải nghiệm', href: '/app/booking_test' },
      { id: 'trial_class', label: 'Lớp học thử', href: '/app/trial_class' },
      { id: 'students', label: 'Xếp lớp học viên', href: '/app/students' },
    ],
  },
  {
    id: 'group_class_management',
    label: 'Vận hành & Chăm sóc',
    icon: GraduationCap,
    items: [
      { id: 'classes', label: 'Quản lý Lớp học', href: '/app/classes' },
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
    id: 'group_hr_exec',
    label: 'Đội ngũ & Điều hành',
    icon: Briefcase,
    items: [
      { id: 'dashboard', label: 'Executive Dashboard', href: '/app/dashboard' },
      { id: 'teacher_assignment', label: 'Phân công Giảng dạy', href: '/app/teacher_assignment' },
      { id: 'hr_employees', label: 'Hồ sơ Nhân sự', href: '/app/hr_employees' },
      { id: 'substitute_payroll', label: 'Duyệt Dạy thay & Lương ca', href: '/app/substitute_payroll' },
      { id: 'reports', label: 'Báo cáo Vận hành', href: '/app/reports' },
    ],
  },
  {
    id: 'group_system_config',
    label: 'Cấu hình Hệ thống',
    icon: Settings,
    items: [
      { id: 'care_conditions_config', label: 'Danh mục chăm sóc', href: '/app/care_conditions_config' },
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
