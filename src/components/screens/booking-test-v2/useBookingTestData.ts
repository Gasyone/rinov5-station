'use client'

import { useMemo } from 'react'
import { mockEmployees } from '@/mocks/employees'
import { mockStudents } from '@/mocks/students'
import type { BookingTest } from '@/mocks/bookingTests'
import { STATUS_CONFIG, FILTER_CONDITIONS } from './bookingTestConstants'
import {
  countStatus,
  getMemberList,
  getWeekdayLabel,
  isTeacherEmployeeName,
  matchesStatusTile,
  uniqueSorted,
} from './bookingTestHelpers'
import type { FilterState, StatusTileId } from './bookingTestTypes'
import type { BookingSubject } from '@/mocks/bookingTests'
import { createFilterGroup, type FilterGroupConfig } from '@/components/filters'

interface UseBookingTestDataArgs {
  bookings: BookingTest[]
  activeSubject: BookingSubject
  activeSchool: string
  activeStatus: StatusTileId
  searchTerm: string
  filters: FilterState
  userRole?: string
  userName?: string
}

/**
 * Derives memoized lookups and filtered slices used by `BookingTestScreen`.
 * Extracted to keep the orchestrator under the 300-line cap (DS §10.1).
 */
import { SYSTEM_BRANCHES } from '@/components/controls'

export function useBookingTestData({
  bookings,
  activeSubject,
  activeSchool,
  activeStatus,
  searchTerm,
  filters,
  userRole,
  userName,
}: UseBookingTestDataArgs) {
  const schoolOptions = SYSTEM_BRANCHES

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
        if (userRole === 'teacher' && booking.teacher !== userName && booking.tester !== userName) {
          return false
        }
        if (booking.subject !== activeSubject) return false
        if (activeSchool !== 'all' && booking.school !== activeSchool) return false
        return true
      }),
    [activeSchool, activeSubject, bookings, userRole, userName]
  )

  const weekdayOptions = useMemo(() => {
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']
    return days.map((day) => ({
      value: day,
      label: day,
      count: bookings.filter((b) => getWeekdayLabel(b.testTime) === day).length,
      checked: filters.weekdays?.includes(day) ?? false,
    }))
  }, [bookings, filters.weekdays])

  const programOptions = useMemo(() => {
    const programs = uniqueSorted(bookings.map((b) => b.program))
    return programs.map((prog) => ({
      value: prog,
      label: prog,
      count: bookings.filter((b) => b.program === prog).length,
      checked: filters.programs?.includes(prog) ?? false,
    }))
  }, [bookings, filters.programs])

  const subjectOptions = useMemo(() => {
    return [
      {
        value: 'english',
        label: 'Tiếng Anh',
        count: bookings.filter((b) => b.subject === 'english').length,
        checked: filters.subjects?.includes('english') ?? false,
      },
      {
        value: 'math',
        label: 'Toán',
        count: bookings.filter((b) => b.subject === 'math').length,
        checked: filters.subjects?.includes('math') ?? false,
      },
    ]
  }, [bookings, filters.subjects])

  const saleOptions = useMemo(() => {
    const creators = uniqueSorted(bookings.map((b) => b.createdBy))
    return creators.map((creator) => ({
      value: creator,
      label: creator,
      count: bookings.filter((b) => b.createdBy === creator).length,
      checked: filters.sales?.includes(creator) ?? false,
    }))
  }, [bookings, filters.sales])

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return bookings.filter((booking) => {
      if (userRole === 'teacher' && booking.teacher !== userName && booking.tester !== userName) {
        return false
      }
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
      if (
        filters.weekdays &&
        filters.weekdays.length > 0 &&
        !filters.weekdays.includes(getWeekdayLabel(booking.testTime))
      ) {
        return false
      }
      if (
        filters.programs &&
        filters.programs.length > 0 &&
        !filters.programs.includes(booking.program)
      ) {
        return false
      }
      if (
        filters.subjects &&
        filters.subjects.length > 0 &&
        !filters.subjects.includes(booking.subject)
      ) {
        return false
      }
      if (
        filters.sales &&
        filters.sales.length > 0 &&
        !filters.sales.includes(booking.createdBy || '')
      ) {
        return false
      }
      if (filters.conditions.length > 0) {
        const conditionMatched = filters.conditions.some((condition) => {
          if (condition === 'interviewed')
            return booking.status === 'started_assessment' && Boolean(booking.isInterviewed)
          if (condition === 'tested')
            return booking.status === 'started_assessment' && Boolean(booking.isTested)
          if (condition === 'checkin')
            return (
              booking.attendance === 'confirmed' ||
              ['started_assessment', 'completed', 'failed'].includes(booking.status)
            )
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
    }, [activeSchool, activeStatus, activeSubject, bookings, filters, searchTerm, userRole, userName])

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'schools',
        title: 'Trường / trung tâm',
        options: schoolOptions,
        selectedValues: filters.schools,
        getOptionCount: (school) => bookings.filter((booking) => booking.school === school).length,
      }),
      createFilterGroup({
        id: 'statuses',
        options: STATUS_CONFIG.filter(
          (status) => !['interviewed', 'tested', 'unassigned_teacher'].includes(status.id)
        ).map((status) => ({
          value: status.id,
          label: status.label,
          count: bookings.filter((booking) => booking.status === status.id).length,
        })),
        selectedValues: filters.statuses,
      }),
      createFilterGroup({
        id: 'conditions',
        options: FILTER_CONDITIONS.filter(
          (condition) => activeSubject !== 'math' || condition.id !== 'interviewed'
        ).map((condition) => ({
          value: condition.id,
          label: condition.label,
          count: countStatus(bookings, condition.id),
        })),
        selectedValues: filters.conditions,
      }),
      createFilterGroup({
        id: 'teachers',
        options: teacherOptions,
        selectedValues: filters.teachers,
        getOptionCount: (teacher) => bookings.filter((booking) => getMemberList(booking).includes(teacher)).length,
      }),
      createFilterGroup({
        id: 'weekdays',
        options: weekdayOptions,
        selectedValues: filters.weekdays,
      }),
      createFilterGroup({
        id: 'programs',
        title: 'Khung chương trình',
        options: programOptions,
        selectedValues: filters.programs,
      }),
      createFilterGroup({
        id: 'subjects',
        options: subjectOptions,
        selectedValues: filters.subjects,
      }),
      createFilterGroup({
        id: 'sales',
        title: 'Sale',
        options: saleOptions,
        selectedValues: filters.sales,
        searchable: true,
        scrollable: true,
      }),
    ],
    [
      bookings,
      filters,
      schoolOptions,
      teacherOptions,
      activeSubject,
      weekdayOptions,
      programOptions,
      subjectOptions,
      saleOptions,
    ]
  )

  const activeFilterCount =
    filters.schools.length +
    filters.statuses.length +
    filters.conditions.length +
    filters.teachers.length +
    (filters.weekdays?.length ?? 0) +
    (filters.programs?.length ?? 0) +
    (filters.subjects?.length ?? 0) +
    (filters.sales?.length ?? 0)

  return {
    schoolOptions,
    teacherOptions,
    studentOptions,
    baseForStatus,
    filteredBookings,
    filterGroups,
    activeFilterCount,
  }
}
