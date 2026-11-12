import type { Organization, OrganizationType } from '@/mocks/organizations'

export type OrganizationTypeFilter = 'all' | OrganizationType
export type OrganizationTierFilter = 'all' | Organization['tier']

export const ORGANIZATION_TYPE_TABS: Array<{
  id: OrganizationTypeFilter
  label: string
}> = [
  { id: 'all', label: 'Tất cả đối tượng' },
  { id: 'family', label: 'Hộ gia đình' },
  { id: 'organization', label: 'Tổ chức / Doanh nghiệp' },
]

export const ORGANIZATION_TIER_TABS: Array<{
  id: OrganizationTierFilter
  label: string
}> = [
  { id: 'all', label: 'Tất cả phân hạng' },
  { id: 'VIP', label: 'VIP' },
  { id: 'Gold', label: 'Gold' },
  { id: 'Standard', label: 'Standard' },
]
