import type { Supplier } from '@/mocks/suppliers'

export type SupplierTypeFilter = 'all' | Supplier['type']

export interface SupplierFilterState {
  categories: string[]
  type: SupplierTypeFilter
}

export const SUPPLIER_TYPE_TABS: Array<{
  id: SupplierTypeFilter
  label: string
}> = [
  { id: 'all', label: 'Tất cả đối tượng' },
  { id: 'organization', label: 'Tổ chức / Doanh nghiệp' },
  { id: 'individual', label: 'Cá nhân cung cấp' },
]

export const SUPPLIER_CATEGORIES: Supplier['category'][] = [
  'Sách & Giáo trình',
  'Thiết bị & Công nghệ',
  'Đồng phục & Quà tặng',
  'Ấn phẩm & In ấn',
  'Phần mềm & Học liệu số',
  'Văn phòng phẩm & Cơ sở vật chất',
  'Đào tạo & Khảo thí',
  'Bảo trì & Cơ điện',
]
