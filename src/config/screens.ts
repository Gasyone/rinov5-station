export interface ScreenConfig {
  label: string
  description: string
}

export const screens: Record<string, ScreenConfig> = {
  dashboard: {
    label: 'Dashboard',
    description: 'Overview of key metrics and activities',
  },
  calendar_class_schedule: {
    label: 'Class Schedule',
    description: 'Manage and view class schedules',
  },
  calendar_event_schedule: {
    label: 'Event Schedule',
    description: 'Manage and view event schedules',
  },
  my_schedule: {
    label: 'My Schedule',
    description: 'View your personal schedule',
  },
  booking_test: {
    label: 'Booking Test',
    description: 'Manage booking tests',
  },
  trial_class: {
    label: 'Trial Class',
    description: 'Manage trial class sessions',
  },
  orders: {
    label: 'Orders',
    description: 'View and manage orders',
  },
  receipts: {
    label: 'Receipts',
    description: 'View and manage receipts',
  },
  placement_test: {
    label: 'Placement Test',
    description: 'Manage placement tests',
  },
  students: {
    label: 'Students',
    description: 'Manage student records',
  },
  classes: {
    label: 'Classes',
    description: 'Manage classes',
  },
  class_assignment: {
    label: 'Class Assignment',
    description: 'Assign students to classes',
  },
  hr_employees: {
    label: 'Employees',
    description: 'Manage employee records',
  },
  branch_list: {
    label: 'Branches',
    description: 'View and manage branches',
  },
  org_structure: {
    label: 'Org Structure',
    description: 'View organizational structure',
  },
  products: {
    label: 'Products',
    description: 'Manage products',
  },
  product_groups: {
    label: 'Product Groups',
    description: 'Manage product groups',
  },
  combos: {
    label: 'Combos',
    description: 'Manage product combos',
  },
  program_management: {
    label: 'Program Management',
    description: 'Manage academic programs',
  },
  syllabus: {
    label: 'Syllabus',
    description: 'Manage syllabus content',
  },
  curriculum: {
    label: 'Curriculum',
    description: 'Manage curriculum',
  },
  users: {
    label: 'Users',
    description: 'Manage system users',
  },
  permissions: {
    label: 'Permissions',
    description: 'Manage user permissions',
  },
}
