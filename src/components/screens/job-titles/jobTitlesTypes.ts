import type { JobTitle } from '@/mocks/jobTitles'

export type { JobTitle }

export interface JobTitlesFilterState {
  search: string
  department: string
  status: 'all' | 'active' | 'inactive'
  capacity: 'all' | 'filled' | 'under_capacity'
}

export const JOB_TITLE_DEPARTMENTS = [
  { value: 'all', label: 'Tất cả Khối / Phòng ban', selectedLabel: 'Tất cả Khối' },
  { value: 'Phòng Đào tạo', label: 'Phòng Đào tạo' },
  { value: 'Ban Giám đốc', label: 'Ban Giám đốc' },
  { value: 'Customer Care', label: 'Customer Care' },
  { value: 'Phòng Tuyển sinh', label: 'Phòng Tuyển sinh' },
  { value: 'Kế toán & Tài chính', label: 'Kế toán & Tài chính' },
  { value: 'IT & Kỹ thuật', label: 'IT & Kỹ thuật' },
  { value: 'Hành chính & Lễ tân', label: 'Hành chính & Lễ tân' },
]

export const CAPACITY_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả Định mức', selectedLabel: 'Tất cả Định mức' },
  { value: 'filled', label: 'Đạt định mức' },
  { value: 'under_capacity', label: 'Thiếu nhân sự' },
]

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả Trạng thái', selectedLabel: 'Tất cả Trạng thái' },
  { value: 'active', label: 'Đang áp dụng' },
  { value: 'inactive', label: 'Tạm ngưng' },
]
