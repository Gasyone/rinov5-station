import type { Household } from '@/mocks/households'

export type HouseholdTierFilter = 'all' | Household['tier']

export interface HouseholdFilterState {
  branches: string[]
  tiers: Array<Household['tier']>
}

export const HOUSEHOLD_TIER_TABS: Array<{
  id: HouseholdTierFilter
  label: string
}> = [
  { id: 'all', label: 'Tất cả hộ gia đình' },
  { id: 'VIP', label: 'Gia đình VIP' },
  { id: 'Gold', label: 'Gia đình Gold' },
  { id: 'Standard', label: 'Standard' },
]
