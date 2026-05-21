'use client'

import { useMemo } from 'react'
import { mockEmployees } from '@/mocks/employees'
import { mockStudents } from '@/mocks/students'
import type { BookingTest } from '@/mocks/bookingTests'
import { STATUS_CONFIG, FILTER_CONDITIONS } from './bookingTestConstants'
import {
  countStatus,
  getMemberList,
  isTeacherEmployeeName,
  matchesStatusTile,
  uniqueSorted,
} from './bookingTestHelpers'
import type { FilterState, StatusTileId } from './bookingTestTypes'
import type { BookingStatus, BookingSubject } from '@/mocks/bookingTests'
import type { FilterSection } from '@/components/filters'

interface UseBookingTestDataArgs {
  bookings: BookingTest[]
  activeSubject: BookingSubject
  activeSchool: string
  activeStatus: StatusTileId
  searchTerm: string
  filters: FilterState
}

/**
 * Derives memoized lookups and filtered slices used by `BookingTestScreen`.
 * Extracted to keep the orchestrator under the 300-line cap (DS §10.1).
 */
export function useBookingTestData({
  bookings,
  activeSubject,
  activeSchool,
  activeStatus,
  searchTerm,
  filters,
}: UseBookingTestDataArgs) {
  const schoolOptions = useMemo(
    () => uniqueSorted(bookings.map((booking) => booking.school)),
    [bookings]
  )

  const teacherOptions = useMemo(() => {
    const fromBookings = bookings
      .flatMap((booking) => [booking.teacher, booking.tester])
      .filter(Boolean) as string[]
    const fromEmployees = mockEmployees
      .filter((employee) => employee.status === 'active')
      .filter((employee) => isTeacherEmployeeName(`${employee.position} ${employee.department}`))
      .map((employee) => employee.name)
    return uniqueSorted([...fromBookings, ...fromEmployees])
  }, [bookings])

  const studentOptions = useMemo(
    () =>
      mockStudents.map((student) => ({
        id: student.id,
        label: student.name,
        familyName: student.parentName || `Gia đình ${student.name}`,
        phone: student.parentPhone || student.phone || '',
      })),
    []
  )

  const baseForStatus = useMemo(
    () =>
      bookings.filter((booking) => {
        if (booking.subject !== activeSubject) return false
        if (activeSchool !== 'all' && booking.school !== activeSchool) return false
        return true
      }),
    [activeSchool, activeSubject, bookings]
  )

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return bookings.filter((booking) => {
      if (booking.subject !== activeSubject) return false
      if (activeSchool !== 'all' && booking.school !== activeSchool) return false
      if (!matchesStatusTile(booking, activeStatus)) return false
      if (filters.schools.length > 0 && !filters.schools.includes(booking.school)) return false
      if (filters.statuses.length > 0 && !filters.statuses.includes(booking.status)) return false
      if (
        filters.teachers.length > 0 &&
        !filters.teachers.some((teacher) => getMemberList(booking).includes(teacher))
      ) {
        return false
      }
      if (filters.conditions.length > 0) {
        const conditionMatched = filters.conditions.some((condition) => {
          if (condition === 'interviewed')
            return booking.status === 'started_assessment' && Boolean(booking.isInterviewed)
          if (condition === 'tested')
            return booking.status === 'started_assessment' && Boolean(booking.isTested)
          return booking.status === 'failed'
        })
        if (!conditionMatched) return false
      }
      if (normalizedSearch) {
        const haystack = [
          booking.childName,
          booking.familyName,
          booking.phone,
          booking.id,
          booking.school,
          booking.classroom,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(normalizedSearch)) return false
      }
      return true
    })
  }, [activeSchool, activeStatus, activeSubject, bookings, filters, searchTerm])

  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'schools',
        title: 'Trường / trung tâm',
        options: schoolOptions.map((school) => ({
          value: school,
          label: school,
          count: bookings.filter((booking) => booking.school === school).length,
          checked: filters.schools.includes(school),
        })),
      },
      {
        id: 'statuses',
        title: 'Trạng thái',
        options: STATUS_CONFIG.filter(
          (status) => !['interviewed', 'tested', 'unassigned_teacher'].includes(status.id)
        ).map((status) => ({
          value: status.id,
          label: status.label,
          count: bookings.filter((booking) => booking.status === status.id).length,
          checked: filters.statuses.includes(status.id as BookingStatus),
        })),
      },
      {
        id: 'conditions',
        title: 'Điều kiện khác',
        options: FILTER_CONDITIONS.map((condition) => ({
          value: condition.id,
          label: condition.label,
          count: countStatus(bookings, condition.id),
          checked: filters.conditions.includes(condition.id),
        })),
      },
      {
        id: 'teachers',
        title: 'Giáo viên',
        options: teacherOptions.map((teacher) => ({
          value: teacher,
          label: teacher,
          count: bookings.filter((booking) => getMemberList(booking).includes(teacher)).length,
          checked: filters.teachers.includes(teacher),
        })),
      },
    ],
    [bookings, filters, schoolOptions, teacherOptions]
  )

  const activeFilterCount =
    filters.schools.length +
    filters.statuses.length +
    filters.conditions.length +
    filters.teachers.length

  return {
    schoolOptions,
    teacherOptions,
    studentOptions,
    baseForStatus,
    filteredBookings,
    filterSections,
    activeFilterCount,
  }
}
