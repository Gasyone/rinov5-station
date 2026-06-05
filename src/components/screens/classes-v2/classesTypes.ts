import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_CATEGORIES, CLASS_STATUS_LABELS } from '@/mocks/classRecords'

export type ClassStatusFilter = 'all' | ClassRecord['status']

export interface ClassFilterState {
  branches: string[]
  levels: string[]
  teachers: string[]
  rooms: string[]
}

export const CLASS_STATUS_TABS: Array<{
  id: ClassStatusFilter
  label: string
  status?: ClassRecord['status']
}> = [
  { id: 'all', label: 'Tất cả' },
  ...CLASS_CATEGORIES.map((s) => ({ id: s, label: CLASS_STATUS_LABELS[s], status: s })),
]
