import { mockProducts, type Product } from '@/mocks/products'
import type { ProductFilterState, ProductStatusFilter } from './productsTypes'

export function getInitialProducts(): Product[] {
  return [...mockProducts]
}

export function getProductBranches(items: Product[]) {
  return Array.from(new Set(items.map((p) => p.branch))).sort()
}

export function getProductCategories(items: Product[]): Product['category'][] {
  return Array.from(new Set(items.map((p) => p.category))) as Product['category'][]
}

export function countProductsByStatus(items: Product[], status: ProductStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((p) => p.status === status).length
}

export function filterProducts(
  items: Product[],
  filters: {
    search: string
    branch: string
    status: ProductStatusFilter
    extra: ProductFilterState
  }
): Product[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((p) => {
    if (filters.branch !== 'all' && p.branch !== filters.branch) return false
    if (filters.status !== 'all' && p.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(p.branch))
      return false
    if (filters.extra.categories.length > 0 && !filters.extra.categories.includes(p.category))
      return false
    if (query) {
      const haystack = [p.name, p.code, p.description ?? '', p.tags?.join(' ') ?? '']
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextProductId(items: Product[]): string {
  const max = items.reduce((acc, p) => {
    const numeric = Number.parseInt(p.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `p${max + 1}`
}

export function buildEmptyProduct(): Omit<Product, 'id'> {
  return {
    name: '',
    code: '',
    category: 'course',
    price: 0,
    status: 'active',
    branch: 'Toàn hệ thống',
    description: '',
    duration: '',
    tags: [],
    createdAt: new Date().toISOString().slice(0, 10),
  }
}
