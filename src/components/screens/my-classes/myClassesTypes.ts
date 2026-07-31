import type { ClassRecord } from '@/mocks/classRecords'

export type MyClassesViewMode = 'grid' | 'table'

export interface MyClassesFilterState {
  search: string
  status: string
  branch: string
  level: string
  viewMode: MyClassesViewMode
}

export const MY_CLASSES_STATUS_TILES = [
  { id: 'all', label: 'Tất cả lớp của tôi' },
  { id: 'dang_hoc', label: 'Đang giảng dạy' },
  { id: 'cho_khai_giang', label: 'Sắp khai giảng' },
  { id: 'tam_dung', label: 'Tạm dừng' },
  { id: 'huy', label: 'Đã kết thúc' },
]
