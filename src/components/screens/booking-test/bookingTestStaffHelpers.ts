import { mockEmployees, type Employee } from '@/mocks/employees'

const SCHOOL_BRANCH_MAP: Record<string, string> = {
  'Rino Nguyễn Tuân': 'Chi nhánh Hà Nội',
  'Rino Linh Đàm': 'Chi nhánh Hà Nội',
  'Rino Tô Ký': 'Chi nhánh Hồ Chí Minh',
  'Rino Bình Thạnh': 'Chi nhánh Hồ Chí Minh',
  'Rino SmartCity': 'Chi nhánh Hồ Chí Minh',
  'Rino Online': 'Toàn hệ thống',
}

export function resolveBookingBranch(school: string) {
  return SCHOOL_BRANCH_MAP[school] ?? school
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
