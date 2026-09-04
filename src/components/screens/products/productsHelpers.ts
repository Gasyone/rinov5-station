import { mockProducts, type Product, type ProductCategory } from '@/mocks/products'
import type { ProductFilterState, ProductStatusFilter } from './productsTypes'

export function getInitialProducts(): Product[] {
  return [...mockProducts]
}

export function getProductCategories(items: Product[]): ProductCategory[] {
  return Array.from(new Set(items.map((p) => p.category))) as ProductCategory[]
}

export function getProductGroups(items: Product[]): string[] {
  return Array.from(new Set(items.map((p) => p.group))).sort()
}

export function filterProducts(
  items: Product[],
  filters: {
    search: string
    status?: ProductStatusFilter
    extra?: ProductFilterState
  }
): Product[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((p) => {
    if (filters.status && filters.status !== 'all' && p.status !== filters.status) {
      return false
    }
    if (
      filters.extra?.categories &&
      filters.extra.categories.length > 0 &&
      !filters.extra.categories.includes(p.category)
    ) {
      return false
    }
    if (
      filters.extra?.groups &&
      filters.extra.groups.length > 0 &&
      !filters.extra.groups.includes(p.group)
    ) {
      return false
    }
    if (query) {
      const haystack = [
        p.name,
        p.code,
        p.group,
        p.unit,
        p.duration,
        p.createdBy,
        p.description ?? '',
        p.tags?.join(' ') ?? '',
        p.vouchers?.join(' ') ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function countProductsByStatus(
  items: Product[],
  status: ProductStatusFilter,
  contextFilters?: {
    search: string
    extra?: ProductFilterState
  }
): number {
  const filteredContext = filterProducts(items, {
    search: contextFilters?.search ?? '',
    extra: contextFilters?.extra,
  })

  if (status === 'all') return filteredContext.length
  return filteredContext.filter((p) => p.status === status).length
}

export function buildEmptyProduct(): Omit<Product, 'id'> {
  return {
    name: '',
    code: '',
    category: 'course',
    group: 'Station NEW (mkt)',
    price: 0,
    unit: 'Khóa',
    duration: 'Sau 3 tháng',
    status: 'active',
    createdBy: 'Admin Hệ thống',
    createdAt: new Date().toISOString().slice(0, 10),
    description: '',
    tags: [],
  }
}

