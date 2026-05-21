'use client'

import { Suspense, lazy, use } from 'react'
import { EmptyState, ModuleLoadingSkeleton } from '@/components/shared'
import { screens } from '@/config/screens'

const SCREEN_MAP: Record<string, ReturnType<typeof lazy>> = {
  booking_test: lazy(async () => {
    const { BookingTestScreen } = await import('@/components/screens/booking-test/BookingTestScreen')
    return { default: BookingTestScreen }
  }),
  calendar_class_schedule: lazy(async () => {
    const { CalendarClassScheduleScreen } = await import('@/components/screens/CalendarClassScheduleScreen')
    return { default: CalendarClassScheduleScreen }
  }),
  calendar_event_schedule: lazy(async () => {
    const { CalendarEventScheduleScreen } = await import('@/components/screens/CalendarEventScheduleScreen')
    return { default: CalendarEventScheduleScreen }
  }),
  my_schedule: lazy(async () => {
    const { MyScheduleScreen } = await import('@/components/screens/MyScheduleScreen')
    return { default: MyScheduleScreen }
  }),
  work_registration: lazy(async () => {
    const { WorkRegistrationScreen } = await import('@/components/screens/work-registration/WorkRegistrationScreen')
    return { default: WorkRegistrationScreen }
  }),
  students: lazy(async () => {
    const { StudentsScreen } = await import('@/components/screens/students/StudentsScreen')
    return { default: StudentsScreen }
  }),
  classes: lazy(async () => {
    const { ClassesScreen } = await import('@/components/screens/classes/ClassesScreen')
    return { default: ClassesScreen }
  }),
  orders: lazy(async () => {
    const { OrdersScreen } = await import('@/components/screens/orders/OrdersScreen')
    return { default: OrdersScreen }
  }),
  hr_employees: lazy(async () => {
    const { EmployeesScreen } = await import('@/components/screens/employees/EmployeesScreen')
    return { default: EmployeesScreen }
  }),
  products: lazy(async () => {
    const { ProductsScreen } = await import('@/components/screens/products/ProductsScreen')
    return { default: ProductsScreen }
  }),
  users: lazy(async () => {
    const { UsersScreen } = await import('@/components/screens/users/UsersScreen')
    return { default: UsersScreen }
  }),
  contact_directory: lazy(async () => {
    const { ContactsScreen } = await import('@/components/screens/contacts/ContactsScreen')
    return { default: ContactsScreen }
  }),
  trial_class: lazy(async () => {
    const { TrialClassScreen } = await import('@/components/screens/trial-class/TrialClassScreen')
    return { default: TrialClassScreen }
  }),

  class_sessions: lazy(async () => {
    const { ClassSessionsScreen } = await import('@/components/screens/class-sessions/ClassSessionsScreen')
    return { default: ClassSessionsScreen }
  }),
  attendance: lazy(async () => {
    const { AttendanceScreen } = await import('@/components/screens/attendance/AttendanceScreen')
    return { default: AttendanceScreen }
  }),
  teachers: lazy(async () => {
    const { TeachersScreen } = await import('@/components/screens/teachers/TeachersScreen')
    return { default: TeachersScreen }
  }),
  leave_reserve: lazy(async () => {
    const { LeaveReserveScreen } = await import('@/components/screens/leave-reserve/LeaveReserveScreen')
    return { default: LeaveReserveScreen }
  }),
  today_care: lazy(async () => {
    const { SupportTicketsScreen } = await import('@/components/screens/care/SupportTicketsScreen')
    return { default: SupportTicketsScreen }
  }),
  care_rule_engine: lazy(async () => {
    const { CareRuleEngineScreen } = await import('@/components/screens/care/CareRuleEngineScreen')
    return { default: CareRuleEngineScreen }
  }),
}

export default function MenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = use(params)
  const Screen = SCREEN_MAP[menuId]
  const screenConfig = screens[menuId]

  return (
    <div className="h-full min-h-0">
      {Screen ? (
        <Suspense fallback={<ModuleLoadingSkeleton className="h-full" />}>
          <Screen />
        </Suspense>
      ) : (
        <EmptyState
          className="h-full px-4 py-3 lg:px-6"
          title={screenConfig?.label ?? 'Screen is not ready'}
          description={
            screenConfig
              ? `${screenConfig.description}. This demo screen is registered but not implemented yet.`
              : 'This menu is not registered in the screen catalog yet.'
          }
        />
      )}
    </div>
  )
}
