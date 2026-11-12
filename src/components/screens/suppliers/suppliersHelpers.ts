import { mockSuppliers, type Supplier } from '@/mocks/suppliers'
import type { SupplierTypeFilter } from './suppliersTypes'

export function getInitialSuppliers(): Supplier[] {
  return [...mockSuppliers]
}

export function countSuppliersByType(items: Supplier[], type: SupplierTypeFilter): number {
  if (type === 'all') return items.length
  return items.filter((s) => s.type === type).length
}

export function getSupplierCategories(items: Supplier[]): string[] {
  return Array.from(new Set(items.map((s) => s.category))).filter(Boolean).sort()
}

export function filterSuppliers(
  items: Supplier[],
  filters: {
    search: string
    type: SupplierTypeFilter
    category: string
  }
): Supplier[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((s) => {
    if (filters.type !== 'all' && s.type !== filters.type) return false
    if (filters.category !== 'all' && s.category !== filters.category) return false

    if (query) {
      const haystack = [
        s.name,
        s.orgName ?? '',
        s.taxCode ?? '',
        s.category,
        s.contactPersonName,
        s.contactPersonRole,
        s.contactPhone,
        s.contactEmail ?? '',
        s.address,
        s.notes ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function buildEmptySupplier(): Supplier {
  return {
    id: `sup-${Date.now()}`,
    type: 'organization',
    name: '',
    category: 'Sách & Giáo trình',
    contactPersonName: '',
    contactPersonRole: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
}
