import type { Product, ProductCategory } from '@/mocks/products'

export type ProductStatusFilter = 'all' | Product['status']

export interface ProductFilterState {
  categories: ProductCategory[]
  groups: string[]
}

export const PRODUCT_STATUS_TABS: Array<{
  id: ProductStatusFilter
  label: string
  status?: Product['status']
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ' , status: 'pending' },
  { id: 'active', label: 'Đang hoạt động', status: 'active' },
  { id: 'inactive', label: 'Ngừng hoạt động', status: 'inactive' },
]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  course: 'Khóa học',
  combo: 'Gói combo',
  book: 'Sách & Giáo trình',
  stationery: 'Văn phòng phẩm',
  physical_product: 'Thiết bị & Học cụ',
  service: 'Dịch vụ & Test',
}

export const STATUS_LABELS: Record<Product['status'], string> = {
  active: 'Đang hoạt động',
  pending: 'Chờ',
  inactive: 'Ngừng hoạt động',
}

