import { mockEmployees, type Employee } from '@/mocks/employees'

export function resolveBookingBranch(school: string) {
  if (school === 'Rino Online') return 'Toàn hệ thống'
  return school
}

export function getActiveEmployeesBySchool(school: string) {
  const branch = resolveBookingBranch(school)
  return mockEmployees.filter(
    (employee) => employee.status === 'active' && employee.branch === branch
  )
}

export function findEmployeeByName(name?: string) {
  if (!name) return null
  const normalizedName = name.trim().toLowerCase()
  return mockEmployees.find((employee) => employee.name.toLowerCase() === normalizedName) ?? null
}

export function getPersonTitle(employee: Employee | null) {
  if (!employee) return ''
  return [employee.position, employee.department].filter(Boolean).join(' · ')
}

export function isTeacherLikeEmployee(employee: Employee) {
  const haystack = `${employee.position} ${employee.department}`.toLowerCase()
  return ['teacher', 'teaching', 'tutor', 'academic', 'ielts'].some((token) =>
    haystack.includes(token)
  )
}
