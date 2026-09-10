import type { JobTitle } from '@/mocks/jobTitles'
import { getOrgDepartmentOptions } from '@/mocks/orgStructure'

export type { JobTitle }

export interface JobTitlesFilterState {
  search: string
  department: string
  status: 'all' | 'active' | 'inactive'
}

export function getJobTitleDepartmentFilterOptions() {
  const orgDepts = getOrgDepartmentOptions()
  return [
    { value: 'all', label: 'Tất cả Khối / Phòng ban', selectedLabel: 'Tất cả Khối' },
    ...orgDepts.map((d) => ({
      value: d.name,
      label: d.label,
      selectedLabel: d.name,
    })),
  ]
}

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả Trạng thái', selectedLabel: 'Tất cả Trạng thái' },
  { value: 'active', label: 'Áp dụng' },
  { value: 'inactive', label: 'Tạm ngưng' },
]
