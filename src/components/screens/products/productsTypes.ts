import type { Product } from '@/mocks/products'

export type ProductStatusFilter = 'all' | Product['status']

export interface ProductFilterState {
  branches: string[]
  categories: Array<Product['category']>
}

export const PRODUCT_STATUS_TABS: Array<{
  id: ProductStatusFilter
  label: string
  status?: Product['status']
}> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'inactive', label: 'Inactive', status: 'inactive' },
  { id: 'archived', label: 'Archived', status: 'archived' },
]

export const CATEGORY_LABELS: Record<Product['category'], string> = {
  course: 'Course',
  book: 'Book',
  service: 'Service',
  combo: 'Combo',
}
