import { mockOrganizations, type Organization } from '@/mocks/organizations'
import type { OrganizationTierFilter, OrganizationTypeFilter } from './organizationsTypes'

export function getInitialOrganizations(): Organization[] {
  return [...mockOrganizations]
}

export function countOrgsByType(
  items: Organization[],
  type: OrganizationTypeFilter
): number {
  if (type === 'all') return items.length
  return items.filter((o) => o.type === type).length
}

export function countOrgsByTier(
  items: Organization[],
  tier: OrganizationTierFilter
): number {
  if (tier === 'all') return items.length
  return items.filter((o) => o.tier === tier).length
}

export function getOrganizationBranches(items: Organization[]): string[] {
  return Array.from(new Set(items.map((o) => o.branch))).filter(Boolean).sort()
}

export function filterOrganizations(
  items: Organization[],
  filters: {
    search: string
    branch: string
    type: OrganizationTypeFilter
    tier: OrganizationTierFilter
  }
): Organization[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((org) => {
    if (filters.branch !== 'all' && org.branch !== filters.branch) return false
    if (filters.type !== 'all' && org.type !== filters.type) return false
    if (filters.tier !== 'all' && org.tier !== filters.tier) return false

    if (query) {
      const haystack = [
        org.name,
        org.code,
        org.primaryContactName,
        org.primaryContactRole,
        org.primaryPhone,
        org.primaryEmail ?? '',
        org.address,
        org.taxCode ?? '',
        org.notes ?? '',
        ...(org.members?.map((m) => m.name) ?? []),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function buildEmptyOrganization(): Organization {
  return {
    id: `ORG-${Date.now()}`,
    code: `ORG-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'family',
    name: '',
    category: 'Hộ gia đình',
    primaryContactName: '',
    primaryContactRole: 'Mẹ',
    primaryPhone: '',
    primaryEmail: '',
    address: '',
    branch: 'CS6 Vinsmart Tonkin',
    membersCount: { parents: 1, children: 1 },
    members: [],
    totalSpent: 0,
    totalDebt: 0,
    tier: 'Standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
