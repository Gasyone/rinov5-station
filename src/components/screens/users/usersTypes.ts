import type { User } from '@/mocks/users'

export type UserStatusFilter = 'all' | User['status']

export interface UserFilterState {
  branches: string[]
  roles: Array<User['role']>
}

export const USER_STATUS_TABS: Array<{
  id: UserStatusFilter
  label: string
  status?: User['status']
}> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'inactive', label: 'Inactive', status: 'inactive' },
  { id: 'locked', label: 'Locked', status: 'locked' },
]

export const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Administrator',
  branch_manager: 'Branch Manager',
  sale: 'Sales',
  csm: 'Customer Success',
  teacher: 'Teacher',
}
