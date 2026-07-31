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
  calendar_class_schedule_v2: lazy(async () => {
    const { CalendarClassScheduleV2Screen } = await import('@/components/screens/calendar-class-v2/CalendarClassScheduleV2Screen')
    return { default: CalendarClassScheduleV2Screen }
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
  calendar_room_schedule: lazy(async () => {
    const { CalendarRoomScheduleScreen } = await import('@/components/screens/calendar-room/CalendarRoomScheduleScreen')
    return { default: CalendarRoomScheduleScreen }
  }),
  classes: lazy(async () => {
    const { ClassesScreen } = await import('@/components/screens/classes/ClassesScreen')
    return { default: ClassesScreen }
  }),
  orders: lazy(async () => {
    const { OrdersScreen } = await import('@/components/screens/orders/OrdersScreen')
    return { default: OrdersScreen }
  }),
  care_conditions_config: lazy(async () => {
    const { CareConditionsConfigScreen } = await import('@/components/screens/care-conditions-config/CareConditionsConfigScreen')
    return { default: CareConditionsConfigScreen }
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
  event_management_new: lazy(async () => {
    const { EventManagementNewScreen } = await import('@/components/screens/event-management-new/EventManagementNewScreen')
    return { default: EventManagementNewScreen }
  }),

  class_sessions: lazy(async () => {
    const { ClassSessionsScreen } = await import('@/components/screens/class-sessions/ClassSessionsScreen')
    return { default: ClassSessionsScreen }
  }),

  teachers: lazy(async () => {
    const { TeachersScreen } = await import('@/components/screens/teachers/TeachersScreen')
    return { default: TeachersScreen }
  }),
  leave_reserve: lazy(async () => {
    const { LeaveReserveScreen } = await import('@/components/screens/leave-reserve/LeaveReserveScreen')
    return { default: LeaveReserveScreen }
  }),
  student_operations_alert: lazy(async () => {
    const { OperationsAlertScreen } = await import('@/components/screens/care/OperationsAlertScreen')
    return { default: OperationsAlertScreen }
  }),
  renewal: lazy(async () => {
    const { RenewalScreen } = await import('@/components/screens/care/renewal/RenewalScreen')
    return { default: RenewalScreen }
  }),

  session_feedback: lazy(async () => {
    const { SessionFeedbackScreen } = await import('@/components/screens/session-feedback/SessionFeedbackScreen')
    return { default: SessionFeedbackScreen }
  }),
  qc_check: lazy(async () => {
    const { QcCheckScreen } = await import('@/components/screens/qc-check/QcCheckScreen')
    return { default: QcCheckScreen }
  }),
  qc_remediation: lazy(async () => {
    const { QcRemediationScreen } = await import('@/components/screens/qc-remediation/QcRemediationScreen')
    return { default: QcRemediationScreen }
  }),
  system_config: lazy(async () => {
    const { SystemConfigScreen } = await import('@/components/screens/system-config/SystemConfigScreen')
    return { default: SystemConfigScreen }
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
          className="h-full px-3 py-3 lg:px-3"
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
