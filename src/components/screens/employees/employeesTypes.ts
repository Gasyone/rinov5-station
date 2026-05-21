import type { Employee } from '@/mocks/employees'

export type EmployeeStatusFilter = 'all' | Employee['status']

export interface EmployeeFilterState {
  branches: string[]
  departments: string[]
  contractTypes: Array<Employee['contractType']>
}

export const EMPLOYEE_STATUS_TABS: Array<{
  id: EmployeeStatusFilter
  label: string
  status?: Employee['status']
}> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'probation', label: 'Probation', status: 'probation' },
  { id: 'inactive', label: 'Inactive', status: 'inactive' },
  { id: 'resigned', label: 'Resigned', status: 'resigned' },
]
