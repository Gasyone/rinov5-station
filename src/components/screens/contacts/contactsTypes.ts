import type { Contact } from '@/mocks/contacts'

export type ContactStatusFilter = 'all' | Contact['status']

export interface ContactFilterState {
  branches: string[]
  sources: Array<Contact['source']>
  assignees: string[]
}

export const CONTACT_STATUS_TABS: Array<{
  id: ContactStatusFilter
  label: string
  status?: Contact['status']
}> = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New', status: 'new' },
  { id: 'contacted', label: 'Contacted', status: 'contacted' },
  { id: 'qualified', label: 'Qualified', status: 'qualified' },
  { id: 'converted', label: 'Converted', status: 'converted' },
  { id: 'lost', label: 'Lost', status: 'lost' },
]

export const SOURCE_LABELS: Record<Contact['source'], string> = {
  walk_in: 'Walk-in',
  facebook: 'Facebook',
  referral: 'Referral',
  website: 'Website',
  google: 'Google',
  event: 'Event',
}
