'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterSheetPanel,
  type FilterSection,
} from '@/components/filters'
import { ConfirmDialog } from '@/components/shared'
import type { User } from '@/mocks/users'
import {
  buildEmptyUser,
  filterUsers,
  getInitialUsers,
  getUserBranches,
  getUserRoles,
  nextUserId,
} from './usersHelpers'
import {
  ROLE_LABELS,
  type UserFilterState,
  type UserStatusFilter,
} from './usersTypes'
import { UsersToolbar } from './UsersToolbar'
import { UsersTable } from './UsersTable'
import { UsersFormDialog } from './UsersFormDialog'

type DialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; user: User }

type Confirmation =
  | { kind: 'delete'; user: User }
  | { kind: 'toggle-lock'; user: User }

export function UsersScreen() {
  const [users, setUsers] = useState<User[]>(() => getInitialUsers())
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<UserStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<UserFilterState>({
    branches: [],
    roles: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const branches = useMemo(() => getUserBranches(users), [users])
  const roles = useMemo(() => getUserRoles(users), [users])

  const filtered = useMemo(
    () =>
      filterUsers(users, {
        search: searchTerm,
        branch: activeBranch,
        status: activeStatus,
        extra: filters,
      }),
    [users, searchTerm, activeBranch, activeStatus, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount = filters.branches.length + filters.roles.length

  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'branches',
        title: 'Branch',
        options: branches.map((b) => ({
          value: b,
          label: b,
          count: users.filter((u) => u.branch === b).length,
          checked: filters.branches.includes(b),
        })),
      },
      {
        id: 'roles',
        title: 'Role',
        options: roles.map((r) => ({
          value: r,
          label: ROLE_LABELS[r],
          count: users.filter((u) => u.role === r).length,
          checked: filters.roles.includes(r),
        })),
      },
    ],
    [branches, roles, users, filters]
  )

  const toggleArray = <K extends keyof UserFilterState>(
    key: K,
    value: UserFilterState[K][number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as UserFilterState
    })
  }

  const handleSubmit = (value: Omit<User, 'id'> & { id?: string }) => {
    if (dialog.mode === 'edit') {
      setUsers((current) =>
        current.map((u) => (u.id === dialog.user.id ? { ...u, ...value, id: u.id } : u))
      )
      toast.success(`Updated ${value.fullName}`)
    } else {
      const id = nextUserId(users)
      const created: User = { ...buildEmptyUser(), ...value, id }
      setUsers((current) => [created, ...current])
      toast.success(`Added ${value.fullName}`)
    }
    setDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (confirmation?.kind !== 'delete') return
    const name = confirmation.user.fullName
    setUsers((current) => current.filter((u) => u.id !== confirmation.user.id))
    setConfirmation(null)
    toast.success(`Removed ${name}`)
  }

  const handleConfirmToggleLock = () => {
    if (confirmation?.kind !== 'toggle-lock') return
    const target = confirmation.user
    const willLock = target.status !== 'locked'
    setUsers((current) =>
      current.map((u) =>
        u.id === target.id ? { ...u, status: willLock ? 'locked' : 'active' } : u
      )
    )
    setConfirmation(null)
    toast.success(`${willLock ? 'Locked' : 'Unlocked'} ${target.fullName}`)
  }

  const dialogInitial =
    dialog.mode === 'edit' ? { ...dialog.user } : { ...buildEmptyUser() }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <UsersToolbar
        users={users}
        branches={branches}
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreate={() => setDialog({ mode: 'create' })}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <UsersTable
            users={paged}
            onRowClick={(user) => setDialog({ mode: 'edit', user })}
            onEdit={(user) => setDialog({ mode: 'edit', user })}
            onToggleLock={(user) => setConfirmation({ kind: 'toggle-lock', user })}
            onDelete={(user) => setConfirmation({ kind: 'delete', user })}
          />
        </DataTableFrame>
      </div>

      <FilterSheetPanel
        open={isFilterOpen}
        title="User filters"
        description="Filter by branch and role."
        sections={filterSections}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleArray('branches', value)
          if (sectionId === 'roles') toggleArray('roles', value as User['role'])
        }}
        onClearAll={() => {
          setFilters({ branches: [], roles: [] })
          setPage(1)
        }}
      />

      <UsersFormDialog
        key={dialog.mode === 'edit' ? `edit-${dialog.user.id}` : `create-${dialog.mode}`}
        open={dialog.mode !== 'closed'}
        mode={dialog.mode === 'edit' ? 'edit' : 'create'}
        initial={dialogInitial}
        branches={branches}
        onOpenChange={(open) => {
          if (!open) setDialog({ mode: 'closed' })
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={confirmation?.kind === 'delete'}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null)
        }}
        variant="destructive"
        title={`Remove ${confirmation?.kind === 'delete' ? confirmation.user.fullName : 'user'}?`}
        description="This deletes the user account from the demo data set."
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={confirmation?.kind === 'toggle-lock'}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null)
        }}
        variant={
          confirmation?.kind === 'toggle-lock' && confirmation.user.status !== 'locked'
            ? 'destructive'
            : 'default'
        }
        title={
          confirmation?.kind === 'toggle-lock' && confirmation.user.status === 'locked'
            ? `Unlock ${confirmation.user.fullName}?`
            : `Lock ${confirmation?.kind === 'toggle-lock' ? confirmation.user.fullName : 'user'}?`
        }
        description={
          confirmation?.kind === 'toggle-lock' && confirmation.user.status === 'locked'
            ? 'The user can sign in again immediately after unlocking.'
            : 'A locked user cannot sign in until you unlock them.'
        }
        confirmLabel={
          confirmation?.kind === 'toggle-lock' && confirmation.user.status === 'locked'
            ? 'Unlock'
            : 'Lock'
        }
        onConfirm={handleConfirmToggleLock}
      />
    </div>
  )
}
