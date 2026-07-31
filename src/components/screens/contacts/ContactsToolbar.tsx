'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { Contact } from '@/mocks/contacts'
import {
  CONTACT_STATUS_TABS,
  type ContactStatusFilter,
} from './contactsTypes'
import { countContactsByStatus } from './contactsHelpers'

interface ContactsToolbarProps {
  contacts: Contact[]
  branches: string[]
  activeBranch: string
  activeStatus: ContactStatusFilter
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onStatusChange: (status: ContactStatusFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreate: () => void
}

export function ContactsToolbar({
  contacts,
  branches,
  activeBranch,
  activeStatus,
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
  onCreate,
}: ContactsToolbarProps) {
  const tiles: StatusTile<ContactStatusFilter>[] = CONTACT_STATUS_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: countContactsByStatus(contacts, tab.id),
    status: tab.status,
    semantic: tab.id === 'all' ? 'neutral' : undefined,
  }))

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-3 py-3 lg:px-3">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="All branches"
          ariaLabel="Branch"
          onValueChange={onBranchChange}
          className="h-9 min-w-40 text-sm"
        />
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Search contacts"
          placeholder="Search name, phone, interest..."
          inputClassName="sm:w-72"
        />
        <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        <Button size="sm" onClick={onCreate}>
          <Plus className="h-4 w-4" />
          Add contact
        </Button>
      </div>
    </div>
  )
}
