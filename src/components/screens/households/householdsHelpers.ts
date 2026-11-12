import { mockHouseholds, type Household } from '@/mocks/households'
import type { HouseholdFilterState, HouseholdTierFilter } from './householdsTypes'

export function getInitialHouseholds(): Household[] {
  return [...mockHouseholds]
}

export function getHouseholdBranches(items: Household[]) {
  return Array.from(new Set(items.map((h) => h.branch))).filter(Boolean).sort()
}

export function countHouseholdsByTier(items: Household[], tier: HouseholdTierFilter): number {
  if (tier === 'all') return items.length
  return items.filter((h) => h.tier === tier).length
}

export function filterHouseholds(
  items: Household[],
  filters: {
    search: string
    branch: string
    tier: HouseholdTierFilter
    extra: HouseholdFilterState
  }
): Household[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((h) => {
    if (filters.branch !== 'all' && h.branch !== filters.branch) return false
    if (filters.tier !== 'all' && h.tier !== filters.tier) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(h.branch))
      return false
    if (filters.extra.tiers.length > 0 && !filters.extra.tiers.includes(h.tier))
      return false
    if (query) {
      const haystack = [
        h.code,
        h.familyName,
        h.primaryParentName,
        h.primaryPhone,
        h.primaryEmail ?? '',
        h.address,
        ...h.members.map((m) => m.name),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}
