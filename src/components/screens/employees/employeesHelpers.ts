import { mockEmployees, type Employee } from '@/mocks/employees'
import type { BirthdayInfo, EmployeeBirthdayFilter } from './employeesTypes'

export function getInitialEmployees(): Employee[] {
  // Trong danh bạ nội bộ, chỉ hiển thị nhân sự đang công tác (active / probation), không hiển thị nhân sự đã nghỉ việc
  return mockEmployees.filter((e) => e.status !== 'resigned')
}

export function getEmployeeDepartments(items: Employee[]) {
  return Array.from(new Set(items.map((e) => e.department))).filter(Boolean).sort()
}

export function getEmployeeBranches(items: Employee[]) {
  const branches = new Set<string>()
  for (const e of items) {
    if (e.branch) branches.add(e.branch)
    if (e.branches) {
      e.branches.forEach((b) => branches.add(b))
    }
  }
  return Array.from(branches).filter(Boolean).sort()
}

export function getBirthdayInfo(dobString?: string): BirthdayInfo | null {
  if (!dobString) return null
  const parts = dobString.split('-')
  if (parts.length < 3) return null
  const birthYear = parseInt(parts[0], 10)
  const birthMonth = parseInt(parts[1], 10) - 1 // 0-indexed
  const birthDay = parseInt(parts[2], 10)

  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return null

  const today = new Date()
  const isToday = birthMonth === today.getMonth() && birthDay === today.getDate()
  const isThisMonth = birthMonth === today.getMonth()

  const dayStr = String(birthDay).padStart(2, '0')
  const monthStr = String(birthMonth + 1).padStart(2, '0')
  const fullDob = `${dayStr}/${monthStr}/${birthYear}`
  const formattedDay = `${dayStr}/${monthStr}`

  let age: number | null = today.getFullYear() - birthYear
  const monthDiff = today.getMonth() - birthMonth
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age -= 1
  }
  if (age < 0) age = null

  return {
    isToday,
    isThisMonth,
    hasBirthday: isToday || isThisMonth,
    birthYear,
    fullDob,
    formattedDay,
    age,
  }
}

export function countBirthdayThisMonth(items: Employee[]): number {
  return items.filter((e) => {
    const b = getBirthdayInfo(e.dob)
    return b?.isThisMonth
  }).length
}

export function filterEmployees(
  items: Employee[],
  filters: {
    search: string
    department: string
    branch: string
    birthday: EmployeeBirthdayFilter
  }
): Employee[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((e) => {
    if (filters.department !== 'all' && e.department !== filters.department) return false
    if (
      filters.branch !== 'all' &&
      e.branch !== filters.branch &&
      !(e.branches && e.branches.includes(filters.branch))
    )
      return false

    if (filters.birthday === 'this_month') {
      const b = getBirthdayInfo(e.dob)
      if (!b?.isThisMonth) return false
    } else if (filters.birthday === 'today') {
      const b = getBirthdayInfo(e.dob)
      if (!b?.isToday) return false
    }

    if (query) {
      const haystack = [
        e.name,
        e.email,
        e.phone,
        e.department,
        e.position,
        e.secondaryPosition ?? '',
        e.branch,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}
