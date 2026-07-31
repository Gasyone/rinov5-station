'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Sparkles, Target, UsersRound } from 'lucide-react'
import { toast } from 'sonner'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import { ConfirmDialog, MetricTile } from '@/components/shared'
import type { Contact } from '@/mocks/contacts'
import {
  buildEmptyContact,
  filterContacts,
  getContactAssignees,
  getContactBranches,
  getContactSources,
  getInitialContacts,
  getPipelineSummary,
  nextContactId,
} from './contactsHelpers'
import {
  SOURCE_LABELS,
  type ContactFilterState,
  type ContactStatusFilter,
} from './contactsTypes'
import { ContactsToolbar } from './ContactsToolbar'
import { ContactsTable } from './ContactsTable'
import { ContactsFormDialog } from './ContactsFormDialog'

type DialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; contact: Contact }

export function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>(() => getInitialContacts())
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<ContactStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ContactFilterState>({
    branches: [],
    sources: [],
    assignees: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)

  const branches = useMemo(() => getContactBranches(contacts), [contacts])
  const sources = useMemo(() => getContactSources(contacts), [contacts])
  const assignees = useMemo(() => getContactAssignees(contacts), [contacts])

  const filtered = useMemo(
    () =>
      filterContacts(contacts, {
        search: searchTerm,
        branch: activeBranch,
        status: activeStatus,
        extra: filters,
      }),
    [contacts, searchTerm, activeBranch, activeStatus, filters]
  )

  const summary = useMemo(() => getPipelineSummary(filtered), [filtered])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.branches.length + filters.sources.length + filters.assignees.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'branches',
        options: branches,
        selectedValues: filters.branches,
        getOptionCount: (branch) => contacts.filter((c) => c.branch === branch).length,
      }),
      createFilterGroup({
        id: 'sources',
        options: sources,
        selectedValues: filters.sources,
        getOptionLabel: (source) => SOURCE_LABELS[source as Contact['source']],
        getOptionCount: (source) => contacts.filter((c) => c.source === source).length,
      }),
      createFilterGroup({
        id: 'assignees',
        options: assignees,
        selectedValues: filters.assignees,
        getOptionCount: (assignee) => contacts.filter((c) => c.assignedTo === assignee).length,
      }),
    ],
    [branches, sources, assignees, contacts, filters]
  )

  const toggleArray = <K extends keyof ContactFilterState>(
    key: K,
    value: ContactFilterState[K][number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as ContactFilterState
    })
  }

  const handleSubmit = (value: Omit<Contact, 'id'> & { id?: string }) => {
    if (dialog.mode === 'edit') {
      setContacts((current) =>
        current.map((c) =>
          c.id === dialog.contact.id ? { ...c, ...value, id: c.id } : c
        )
      )
      toast.success(`Updated ${value.name}`)
    } else {
      const id = nextContactId(contacts)
      const created: Contact = { ...buildEmptyContact(), ...value, id }
      setContacts((current) => [created, ...current])
      toast.success(`Added ${value.name}`)
    }
    setDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const name = deleteTarget.name
    setContacts((current) => current.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success(`Removed ${name}`)
  }

  const dialogInitial =
    dialog.mode === 'edit' ? { ...dialog.contact } : { ...buildEmptyContact() }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ContactsToolbar
        contacts={contacts}
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

      <div className="grid shrink-0 gap-3 px-3 pb-3 sm:grid-cols-2 lg:grid-cols-4 lg:px-3">
        <MetricTile label="Filtered leads" value={summary.total} icon={UsersRound} />
        <MetricTile label="Fresh leads" value={summary.fresh} icon={Sparkles} />
        <MetricTile label="Qualified" value={summary.qualified} icon={Target} />
        <MetricTile
          label="Converted"
          value={`${summary.converted} · ${summary.conversionRate}%`}
          icon={CheckCircle2}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 lg:px-3 lg:pb-3">
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
          <ContactsTable
            contacts={paged}
            onRowClick={(contact) => setDialog({ mode: 'edit', contact })}
            onEdit={(contact) => setDialog({ mode: 'edit', contact })}
            onDelete={setDeleteTarget}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Contact filters"
        description="Filter by branch, source, and assigned sales rep."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleArray('branches', value)
          if (sectionId === 'sources') toggleArray('sources', value as Contact['source'])
          if (sectionId === 'assignees') toggleArray('assignees', value)
        }}
        onClearAll={() => {
          setFilters({ branches: [], sources: [], assignees: [] })
          setPage(1)
        }}
      />

      <ContactsFormDialog
        key={dialog.mode === 'edit' ? `edit-${dialog.contact.id}` : `create-${dialog.mode}`}
        open={dialog.mode !== 'closed'}
        mode={dialog.mode === 'edit' ? 'edit' : 'create'}
        initial={dialogInitial}
        branches={branches}
        assignees={assignees}
        onOpenChange={(open) => {
          if (!open) setDialog({ mode: 'closed' })
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        variant="destructive"
        title={`Remove ${deleteTarget?.name ?? 'contact'}?`}
        description="This deletes the lead from the demo CRM data set."
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
