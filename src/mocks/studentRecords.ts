import type { BookingTest } from '@/mocks/bookingTests'

export function readStudentBookings(bookings: ReadonlyArray<BookingTest>) {
  return {
    trials: bookings,
    error: null as { message: string } | null,
  }
}

export type StudentBookingsState = ReturnType<typeof readStudentBookings>
export type BookingUpdater =
  | readonly BookingTest[]
  | ((current: readonly BookingTest[]) => BookingTest[])

export function applyStudentBooking(
  booking: BookingTest,
  updates: Partial<BookingTest>,
): BookingTest {
  return { ...booking, ...updates }
}

export type StudentStatus = 'active' | 'inactive' | 'pending' | 'graduated' | 'transferred'

export interface ParentRecord {
  name: string
  phone: string
  relation: string
}

export interface AttendanceRecord {
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
}

export interface StudentRecord {
  id: string
  code: string
  name: string
  email: string
  phone: string
  gender: 'Male' | 'Female' | 'Other'
  dob: string
  status: StudentStatus
  enrolledClass?: string
  branch: string
  level: string
  parentName?: string
  parentPhone?: string
  parent?: ParentRecord
  enrollmentDate: string
  attendance?: AttendanceRecord[]
  notes?: string
}
