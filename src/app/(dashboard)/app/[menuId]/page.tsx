'use client'

import { Suspense, lazy, use } from 'react'
import { EmptyState, ModuleLoadingSkeleton } from '@/components/shared'
import { screens } from '@/config/screens'

const SCREEN_MAP: Record<string, ReturnType<typeof lazy>> = {
  booking_test: lazy(async () => {
    const { BookingTestScreen } = await import('@/components/screens/booking-test/BookingTestScreen')
    return { default: BookingTestScreen }
  }),
  booking_test_v2: lazy(async () => {
    const { BookingTestScreenV2 } = await import('@/components/screens/booking-test-v2/BookingTestScreenV2')
    return { default: BookingTestScreenV2 }
  }),
  calendar_class_schedule: lazy(async () => {
    const { CalendarClassScheduleScreen } = await import('@/components/screens/CalendarClassScheduleScreen')
    return { default: CalendarClassScheduleScreen }
  }),
  calendar_class_schedule_v2: lazy(async () => {
    const { CalendarClassScheduleScreenV2 } = await import('@/components/screens/CalendarClassScheduleScreenV2')
    return { default: CalendarClassScheduleScreenV2 }
  }),
  calendar_event_schedule: lazy(async () => {
    const { CalendarEventScheduleScreen } = await import('@/components/screens/CalendarEventScheduleScreen')
    return { default: CalendarEventScheduleScreen }
  }),
  calendar_event_schedule_v2: lazy(async () => {
    const { CalendarEventScheduleScreenV2 } = await import('@/components/screens/CalendarEventScheduleScreenV2')
    return { default: CalendarEventScheduleScreenV2 }
  }),
  my_schedule: lazy(async () => {
    const { MyScheduleScreen } = await import('@/components/screens/MyScheduleScreen')
    return { default: MyScheduleScreen }
  }),
  my_schedule_v2: lazy(async () => {
    const { MyScheduleScreenV2 } = await import('@/components/screens/MyScheduleScreenV2')
    return { default: MyScheduleScreenV2 }
  }),
  work_registration: lazy(async () => {
    const { WorkRegistrationScreen } = await import('@/components/screens/work-registration/WorkRegistrationScreen')
    return { default: WorkRegistrationScreen }
  }),
  work_registration_v2: lazy(async () => {
    const { WorkRegistrationScreenV2 } = await import('@/components/screens/work-registration-v2/WorkRegistrationScreenV2')
    return { default: WorkRegistrationScreenV2 }
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
  trial_class_v2: lazy(async () => {
    const { TrialClassScreenV2 } = await import('@/components/screens/trial-class-v2/TrialClassScreenV2')
    return { default: TrialClassScreenV2 }
  }),
  event_management_new: lazy(async () => {
    const { EventManagementNewScreen } = await import('@/components/screens/event-management-new/EventManagementNewScreen')
    return { default: EventManagementNewScreen }
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
  student_operations_alert: lazy(async () => {
    const { OperationsAlertScreen } = await import('@/components/screens/care/OperationsAlertScreen')
    return { default: OperationsAlertScreen }
  }),
  care_schedule: lazy(async () => {
    const { CareScheduleScreen } = await import('@/components/screens/care/CareScheduleScreen')
    return { default: CareScheduleScreen }
  }),
  care_rule_engine: lazy(async () => {
    const { CareRuleEngineScreen } = await import('@/components/screens/care/CareRuleEngineScreen')
    return { default: CareRuleEngineScreen }
  }),
  session_feedback: lazy(async () => {
    const { SessionFeedbackScreen } = await import('@/components/screens/session-feedback/SessionFeedbackScreen')
    return { default: SessionFeedbackScreen }
  }),
  renewal: lazy(async () => {
    const { RenewalScreen } = await import('@/components/screens/care/renewal/RenewalScreen')
    return { default: RenewalScreen }
  }),
  qc_check: lazy(async () => {
    const { QcCheckScreen } = await import('@/components/screens/qc-check/QcCheckScreen')
    return { default: QcCheckScreen }
  }),
  qc_remediation: lazy(async () => {
    const { QcRemediationScreen } = await import('@/components/screens/qc-remediation/QcRemediationScreen')
    return { default: QcRemediationScreen }
  }),
  classes_v2: lazy(async () => {
    const { ClassesScreenV2 } = await import('@/components/screens/classes-v2/ClassesScreenV2')
    return { default: ClassesScreenV2 }
  }),
  students_v2: lazy(async () => {
    const { StudentsScreenV2 } = await import('@/components/screens/students-v2/StudentsScreenV2')
    return { default: StudentsScreenV2 }
  }),
  teachers_v2: lazy(async () => {
    const { TeachersScreenV2 } = await import('@/components/screens/teachers-v2/TeachersScreenV2')
    return { default: TeachersScreenV2 }
  }),
  leave_reserve_v2: lazy(async () => {
    const { LeaveReserveScreenV2 } = await import('@/components/screens/leave-reserve-v2/LeaveReserveScreenV2')
    return { default: LeaveReserveScreenV2 }
  }),
  class_sessions_v2: lazy(async () => {
    const { ClassSessionsScreenV2 } = await import('@/components/screens/class-sessions-v2/ClassSessionsScreenV2')
    return { default: ClassSessionsScreenV2 }
  }),
  attendance_v2: lazy(async () => {
    const { AttendanceScreenV2 } = await import('@/components/screens/attendance-v2/AttendanceScreenV2')
    return { default: AttendanceScreenV2 }
  }),
  session_feedback_v2: lazy(async () => {
    const { SessionFeedbackScreenV2 } = await import('@/components/screens/session-feedback-v2/SessionFeedbackScreenV2')
    return { default: SessionFeedbackScreenV2 }
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
