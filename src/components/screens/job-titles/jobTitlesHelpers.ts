import type { JobTitle, JobTitlesFilterState } from './jobTitlesTypes'
import type { Employee } from '@/mocks/employees'
import type { AvatarStackItem } from '@/components/shared'

export function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const first = parts[0][0]
  const last = parts[parts.length - 1][0]
  return `${first}${last}`.toUpperCase()
}

export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '—'
  const trimmed = phone.trim()
  if (trimmed.length <= 6) return trimmed
  return `${trimmed.slice(0, 3)}****${trimmed.slice(-3)}`
}

export interface HeadcountMetrics {
  percentage: number
  isUnder: boolean
  isFilled: boolean
  label: string
}

export function getHeadcountMetrics(assignedCount: number, targetCount: number): HeadcountMetrics {
  const target = targetCount > 0 ? targetCount : 1
  const percentage = Math.round((assignedCount / target) * 100)
  const isUnder = assignedCount < targetCount
  const isFilled = assignedCount >= targetCount
  const label = `${assignedCount}/${targetCount}`

  return {
    percentage,
    isUnder,
    isFilled,
    label,
  }
}

export function mapEmployeesToAvatarStack(
  employeeIds: string[],
  allEmployees: Employee[]
): { items: AvatarStackItem[]; employees: Employee[] } {
  const employeeMap = new Map(allEmployees.map((e) => [e.id, e]))
  const matchedEmployees: Employee[] = []
  const items: AvatarStackItem[] = []

  for (const id of employeeIds) {
    const emp = employeeMap.get(id)
    if (emp) {
      matchedEmployees.push(emp)
      items.push({
        label: emp.name,
        initials: getInitials(emp.name),
      })
    }
  }

  return { items, employees: matchedEmployees }
}

export function filterJobTitles(
  items: JobTitle[],
  filters: JobTitlesFilterState
): JobTitle[] {
  return items.filter((item) => {
    // 1. Department filter
    if (filters.department && filters.department !== 'all' && item.department !== filters.department) {
      return false
    }

    // 2. Capacity filter
    if (filters.capacity && filters.capacity !== 'all') {
      const isUnder = item.assignedEmployeeIds.length < item.targetHeadcount
      if (filters.capacity === 'under_capacity' && !isUnder) return false
      if (filters.capacity === 'filled' && isUnder) return false
    }

    // 3. Status filter
    if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
      return false
    }

    // 4. Search query
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      const matchName = item.name.toLowerCase().includes(q)
      const matchCode = item.code.toLowerCase().includes(q)
      const matchDept = item.department.toLowerCase().includes(q)
      const matchDesc = item.description.toLowerCase().includes(q)
      if (!matchName && !matchCode && !matchDept && !matchDesc) return false
    }

    return true
  })
}
