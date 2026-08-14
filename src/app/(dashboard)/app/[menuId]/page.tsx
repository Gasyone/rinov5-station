'use client'

import { Suspense, lazy, use } from 'react'
import { EmptyState, ModuleLoadingSkeleton } from '@/components/shared'
import { screens } from '@/config/screens'

function safeLazy<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await importFn()
    } catch (error: any) {
      if (
        typeof window !== 'undefined' &&
        (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk'))
      ) {
        const hasReloaded = sessionStorage.getItem('chunk_load_reloaded')
        if (!hasReloaded) {
          sessionStorage.setItem('chunk_load_reloaded', 'true')
          window.location.reload()
          return new Promise<{ default: T }>(() => {})
        }
      }
      throw error
    }
  })
}

const SCREEN_MAP: Record<string, ReturnType<typeof lazy>> = {
  booking_test: safeLazy(async () => {
    const { BookingTestScreen } = await import('@/components/screens/booking-test/BookingTestScreen')
    return { default: BookingTestScreen }
  }),
  calendar_class_schedule: safeLazy(async () => {
    const { CalendarClassScheduleScreen } = await import('@/components/screens/CalendarClassScheduleScreen')
    return { default: CalendarClassScheduleScreen }
  }),
  calendar_class_schedule_v2: safeLazy(async () => {
    const { CalendarClassScheduleV2Screen } = await import('@/components/screens/calendar-class-v2/CalendarClassScheduleV2Screen')
    return { default: CalendarClassScheduleV2Screen }
  }),
  calendar_event_schedule: safeLazy(async () => {
    const { CalendarEventScheduleScreen } = await import('@/components/screens/CalendarEventScheduleScreen')
    return { default: CalendarEventScheduleScreen }
  }),
  my_schedule: safeLazy(async () => {
    const { MyScheduleScreen } = await import('@/components/screens/MyScheduleScreen')
    return { default: MyScheduleScreen }
  }),
  work_registration: safeLazy(async () => {
    const { WorkRegistrationScreen } = await import('@/components/screens/work-registration/WorkRegistrationScreen')
    return { default: WorkRegistrationScreen }
  }),
  students: safeLazy(async () => {
    const { StudentsScreen } = await import('@/components/screens/students/StudentsScreen')
    return { default: StudentsScreen }
  }),
  calendar_room_schedule: safeLazy(async () => {
    const { CalendarRoomScheduleScreen } = await import('@/components/screens/calendar-room/CalendarRoomScheduleScreen')
    return { default: CalendarRoomScheduleScreen }
  }),
  classes: safeLazy(async () => {
    const { ClassesScreen } = await import('@/components/screens/classes/ClassesScreen')
    return { default: ClassesScreen }
  }),
  orders: safeLazy(async () => {
    const { OrdersScreen } = await import('@/components/screens/orders/OrdersScreen')
    return { default: OrdersScreen }
  }),
  payment_receipts: safeLazy(async () => {
    const { PaymentReceiptsScreen } = await import('@/components/screens/payment-receipts/PaymentReceiptsScreen')
    return { default: PaymentReceiptsScreen }
  }),
  care_conditions_config: safeLazy(async () => {
    const { CareConditionsConfigScreen } = await import('@/components/screens/care-conditions-config/CareConditionsConfigScreen')
    return { default: CareConditionsConfigScreen }
  }),
  hr_employees: safeLazy(async () => {
    const { EmployeesScreen } = await import('@/components/screens/employees/EmployeesScreen')
    return { default: EmployeesScreen }
  }),
  products: safeLazy(async () => {
    const { ProductsScreen } = await import('@/components/screens/products/ProductsScreen')
    return { default: ProductsScreen }
  }),
  crm_leads: safeLazy(async () => {
    const { CrmLeadsScreen } = await import('@/components/screens/crm-leads/CrmLeadsScreen')
    return { default: CrmLeadsScreen }
  }),
  users: safeLazy(async () => {
    const { UsersScreen } = await import('@/components/screens/users/UsersScreen')
    return { default: UsersScreen }
  }),
  contact_directory: safeLazy(async () => {
    const { ContactsScreen } = await import('@/components/screens/contacts/ContactsScreen')
    return { default: ContactsScreen }
  }),
  trial_class: safeLazy(async () => {
    const { TrialClassScreen } = await import('@/components/screens/trial-class/TrialClassScreen')
    return { default: TrialClassScreen }
  }),
  event_management_new: safeLazy(async () => {
    const { EventManagementNewScreen } = await import('@/components/screens/event-management-new/EventManagementNewScreen')
    return { default: EventManagementNewScreen }
  }),

  class_sessions: safeLazy(async () => {
    const { ClassSessionsScreen } = await import('@/components/screens/class-sessions/ClassSessionsScreen')
    return { default: ClassSessionsScreen }
  }),

  teachers: safeLazy(async () => {
    const { TeachersScreen } = await import('@/components/screens/teachers/TeachersScreen')
    return { default: TeachersScreen }
  }),
  leave_reserve: safeLazy(async () => {
    const { LeaveReserveScreen } = await import('@/components/screens/leave-reserve/LeaveReserveScreen')
    return { default: LeaveReserveScreen }
  }),
  makeup_class: safeLazy(async () => {
    const { MakeupClassScreen } = await import('@/components/screens/makeup-class/MakeupClassScreen')
    return { default: MakeupClassScreen }
  }),
  student_operations_alert: safeLazy(async () => {
    const { OperationsAlertScreen } = await import('@/components/screens/care/OperationsAlertScreen')
    return { default: OperationsAlertScreen }
  }),
  renewal: safeLazy(async () => {
    const { RenewalScreen } = await import('@/components/screens/care/renewal/RenewalScreen')
    return { default: RenewalScreen }
  }),

  session_feedback: safeLazy(async () => {
    const { SessionFeedbackScreen } = await import('@/components/screens/session-feedback/SessionFeedbackScreen')
    return { default: SessionFeedbackScreen }
  }),
  qc_check: safeLazy(async () => {
    const { QcCheckScreen } = await import('@/components/screens/qc-check/QcCheckScreen')
    return { default: QcCheckScreen }
  }),
  qc_remediation: safeLazy(async () => {
    const { QcRemediationScreen } = await import('@/components/screens/qc-remediation/QcRemediationScreen')
    return { default: QcRemediationScreen }
  }),
  system_config: safeLazy(async () => {
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

