'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { ConfirmDialog } from '@/components/shared'
import type { Contact } from '@/mocks/contacts'
import {
  buildEmptyContact,
  filterContacts,
  getContactBranches,
  getInitialContacts,
} from './contactsHelpers'
import type {
  ContactBirthdayFilter,
  ContactRoleFilter,
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
  const [activeRole, setActiveRole] = useState<ContactRoleFilter>('all')
  const [activeBirthday, setActiveBirthday] = useState<ContactBirthdayFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)

  const branches = useMemo(() => getContactBranches(contacts), [contacts])

  const filtered = useMemo(
    () =>
      filterContacts(contacts, {
        search: searchTerm,
        branch: activeBranch,
        role: activeRole,
        birthday: activeBirthday,
      }),
    [contacts, searchTerm, activeBranch, activeRole, activeBirthday]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paged.map((c) => c.phone)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleToggleOne = (phone: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(phone)
      else next.delete(phone)
      return next
    })
  }

  const handleSubmit = (value: Contact) => {
    if (dialog.mode === 'edit') {
      setContacts((current) =>
        current.map((c) => (c.phone === dialog.contact.phone ? { ...value } : c))
      )
      toast.success(`Đã cập nhật thông tin liên hệ ${value.name}`)
    } else {
      setContacts((current) => [{ ...value, id: value.phone }, ...current])
      toast.success(`Đã thêm mới liên hệ ${value.name}`)
    }
    setDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const name = deleteTarget.name
    setContacts((current) => current.filter((c) => c.phone !== deleteTarget.phone))
    setDeleteTarget(null)
    toast.success(`Đã xóa liên hệ ${name}`)
  }

  const dialogInitial: Contact =
    dialog.mode === 'edit' ? { ...dialog.contact } : buildEmptyContact()

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ContactsToolbar
        contacts={contacts}
        branches={branches}
        activeBranch={activeBranch}
        activeRole={activeRole}
        activeBirthday={activeBirthday}
        searchTerm={searchTerm}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onRoleChange={(r) => {
          setActiveRole(r)
          setPage(1)
        }}
        onBirthdayChange={(b) => {
          setActiveBirthday(b)
          setPage(1)
        }}
        onSearchChange={(q) => {
          setSearchTerm(q)
          setPage(1)
        }}
        onCreate={() => setDialog({ mode: 'create' })}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DataTableFrame
          className="flex-1 min-h-0"
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              selectedCount={selectedIds.size > 0 ? selectedIds.size : undefined}
              onClearSelection={() => setSelectedIds(new Set())}
              size="sm"
            />
          }
        >
          <ContactsTable
            contacts={paged}
            selectedIds={selectedIds}
            onToggleAll={handleToggleAll}
            onToggleOne={handleToggleOne}
            onRowClick={(contact) => setDialog({ mode: 'edit', contact })}
            onEdit={(contact) => setDialog({ mode: 'edit', contact })}
            onDelete={(contact) => setDeleteTarget(contact)}
          />
        </DataTableFrame>
      </div>

      <ContactsFormDialog
        open={dialog.mode !== 'closed'}
        mode={dialog.mode === 'edit' ? 'edit' : 'create'}
        initial={dialogInitial}
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
        title="Xóa liên hệ"
        description={`Bạn có chắc muốn xóa liên hệ "${deleteTarget?.name}" khỏi hệ thống? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
