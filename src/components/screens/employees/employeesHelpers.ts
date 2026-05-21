import { mockEmployees, type Employee } from '@/mocks/employees'
import type { EmployeeFilterState, EmployeeStatusFilter } from './employeesTypes'

export function getInitialEmployees(): Employee[] {
  return [...mockEmployees]
}

export function getEmployeeBranches(items: Employee[]) {
  return Array.from(new Set(items.map((e) => e.branch))).sort()
}

export function getEmployeeDepartments(items: Employee[]) {
  return Array.from(new Set(items.map((e) => e.department))).sort()
}

export function getEmployeeContractTypes(items: Employee[]) {
  return Array.from(new Set(items.map((e) => e.contractType))).sort()
}

export function countEmployeesByStatus(items: Employee[], status: EmployeeStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((e) => e.status === status).length
}

export function filterEmployees(
  items: Employee[],
  filters: {
    search: string
    branch: string
    status: EmployeeStatusFilter
    extra: EmployeeFilterState
  }
): Employee[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((e) => {
    if (filters.branch !== 'all' && e.branch !== filters.branch) return false
    if (filters.status !== 'all' && e.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(e.branch))
      return false
    if (
      filters.extra.departments.length > 0 &&
      !filters.extra.departments.includes(e.department)
    )
      return false
    if (
      filters.extra.contractTypes.length > 0 &&
      !filters.extra.contractTypes.includes(e.contractType)
    )
      return false
    if (query) {
      const haystack = [e.name, e.email, e.phone, e.position, e.department, e.id]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextEmployeeId(items: Employee[]): string {
  const max = items.reduce((acc, e) => {
    const numeric = Number.parseInt(e.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `e${max + 1}`
}

export function buildEmptyEmployee(): Omit<Employee, 'id'> {
  return {
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    department: '',
    position: '',
    branch: '',
    status: 'probation',
    salary: 0,
    hireDate: new Date().toISOString().slice(0, 10),
    contractType: 'Full-time',
  }
}
