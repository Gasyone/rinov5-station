import type { Class } from '@/mocks/classes'

export type ClassStatusFilter = 'all' | Class['status']

export interface ClassFilterState {
  branches: string[]
  levels: string[]
  teachers: string[]
}

export const CLASS_STATUS_TABS: Array<{
  id: ClassStatusFilter
  label: string
  status?: Class['status']
}> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'upcoming', label: 'Upcoming', status: 'upcoming' },
  { id: 'completed', label: 'Completed', status: 'completed' },
  { id: 'cancelled', label: 'Cancelled', status: 'cancelled' },
]
