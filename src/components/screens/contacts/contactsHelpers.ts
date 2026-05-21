import { mockContacts, type Contact } from '@/mocks/contacts'
import type { ContactFilterState, ContactStatusFilter } from './contactsTypes'

export function getInitialContacts(): Contact[] {
  return [...mockContacts]
}

export function getContactBranches(items: Contact[]) {
  return Array.from(new Set(items.map((c) => c.branch))).sort()
}

export function getContactSources(items: Contact[]): Contact['source'][] {
  return Array.from(new Set(items.map((c) => c.source))) as Contact['source'][]
}

export function getContactAssignees(items: Contact[]) {
  return Array.from(new Set(items.map((c) => c.assignedTo))).sort()
}

export function countContactsByStatus(items: Contact[], status: ContactStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((c) => c.status === status).length
}

export function filterContacts(
  items: Contact[],
  filters: {
    search: string
    branch: string
    status: ContactStatusFilter
    extra: ContactFilterState
  }
): Contact[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((c) => {
    if (filters.branch !== 'all' && c.branch !== filters.branch) return false
    if (filters.status !== 'all' && c.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(c.branch))
      return false
    if (filters.extra.sources.length > 0 && !filters.extra.sources.includes(c.source))
      return false
    if (
      filters.extra.assignees.length > 0 &&
      !filters.extra.assignees.includes(c.assignedTo)
    )
      return false
    if (query) {
      const haystack = [c.name, c.email ?? '', c.phone, c.interest ?? '', c.id]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextContactId(items: Contact[]): string {
  const max = items.reduce((acc, c) => {
    const numeric = Number.parseInt(c.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `c${max + 1}`
}

export function buildEmptyContact(): Omit<Contact, 'id'> {
  return {
    name: '',
    email: '',
    phone: '',
    source: 'walk_in',
    status: 'new',
    branch: '',
    assignedTo: '',
    interest: '',
    createdAt: new Date().toISOString(),
  }
}

/** Pipeline summary — used by the metric tiles row above the table. */
export function getPipelineSummary(items: Contact[]) {
  return {
    total: items.length,
    fresh: items.filter((c) => c.status === 'new').length,
    qualified: items.filter((c) => c.status === 'qualified').length,
    converted: items.filter((c) => c.status === 'converted').length,
    conversionRate:
      items.length === 0
        ? 0
        : Math.round((items.filter((c) => c.status === 'converted').length / items.length) * 100),
  }
}
