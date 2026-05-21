'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { User } from '@/mocks/users'
import { USER_STATUS_TABS, type UserStatusFilter } from './usersTypes'
import { countUsersByStatus } from './usersHelpers'

interface UsersToolbarProps {
  users: User[]
  branches: string[]
  activeBranch: string
  activeStatus: UserStatusFilter
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onStatusChange: (status: UserStatusFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreate: () => void
}

export function UsersToolbar({
  users,
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
}: UsersToolbarProps) {
  const tiles: StatusTile<UserStatusFilter>[] = USER_STATUS_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: countUsersByStatus(users, tab.id),
    status: tab.status,
    semantic: tab.id === 'all' ? 'neutral' : undefined,
  }))

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-4 py-3 lg:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="All branches"
          ariaLabel="Branch"
          onValueChange={onBranchChange}
          className="h-9 min-w-52 text-sm"
        />
        <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Search users"
            placeholder="Search name, email, username..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          <Button size="sm" onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      <StatusTiles
        tiles={tiles}
        activeId={activeStatus}
        onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
      />
    </div>
  )
}
