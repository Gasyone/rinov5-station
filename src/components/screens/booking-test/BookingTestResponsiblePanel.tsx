'use client'

import { useMemo, useState } from 'react'
import { UserRound } from 'lucide-react'
import { Panel } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'
import type { Employee } from '@/mocks/employees'
import { BookingTestStaffCard } from './BookingTestStaffCard'
import { BookingTestEmployeePickerDialog } from './BookingTestEmployeePickerDialog'
import {
  findEmployeeByName,
  getActiveEmployeesBySchool,
  resolveBookingBranch,
} from './bookingTestStaffHelpers'

interface BookingTestResponsiblePanelProps {
  booking: BookingTest
  onUpdateBooking: (bookingId: string, updater: (booking: BookingTest) => BookingTest) => void
}

export function BookingTestResponsiblePanel({
  booking,
  onUpdateBooking,
}: BookingTestResponsiblePanelProps) {
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const branchName = resolveBookingBranch(booking.school)
  const branchEmployees = useMemo(
    () => getActiveEmployeesBySchool(booking.school),
    [booking.school]
  )
  const creatorName = booking.createdBy || booking.ops || 'Quản trị hệ thống'
  const creatorEmployee = findEmployeeByName(creatorName)
  const teacherEmployee = findEmployeeByName(booking.teacher)

  const selectTeacher = (employee: Employee) => {
    onUpdateBooking(booking.id, (current) => ({
      ...current,
      teacher: employee.name,
      tester: employee.name,
    }))
    setTeacherPickerOpen(false)
  }

  return (
    <>
      <Panel title="Phụ trách" icon={<UserRound className="h-4 w-4" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <BookingTestStaffCard
            label="Người đặt"
            name={creatorName}
            employee={creatorEmployee}
          />
          <BookingTestStaffCard
            label="Giáo viên"
            name={booking.teacher}
            employee={teacherEmployee}
            placeholder="Chưa gán giáo viên"
            clickable
            onClick={() => setTeacherPickerOpen(true)}
          />
        </div>
      </Panel>

      <BookingTestEmployeePickerDialog
        open={teacherPickerOpen}
        employees={branchEmployees}
        branchName={branchName}
        selectedName={booking.teacher}
        onOpenChange={setTeacherPickerOpen}
        onSelect={selectTeacher}
      />
    </>
  )
}
