'use client'

import { MessageCircle, UsersRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableActions,
  EmptyState,
  EntityCell,
  StatusBadge,
  ContactCell,
} from '@/components/shared'
import { formatDateTime } from '@/lib/format'
import type { Contact } from '@/mocks/contacts'
import { SOURCE_LABELS } from './contactsTypes'

interface ContactsTableProps {
  contacts: Contact[]
  onRowClick: (contact: Contact) => void
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Contact' },
  { label: 'Liên hệ', className: 'min-w-52' },
  { label: 'Source', className: 'min-w-32' },
  { label: 'Interest', className: 'min-w-44' },
  { label: 'Branch', className: 'min-w-44' },
  { label: 'Assigned to', className: 'min-w-36' },
  { label: 'Last interaction', className: 'min-w-40' },
  { label: 'Status', className: 'min-w-28' },
  { label: 'Actions', className: 'w-24 text-right' },
]

export function ContactsTable({
  contacts,
  onRowClick,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<UsersRound className="h-7 w-7 text-muted-foreground" />}
          title="No contacts match the filters"
          description="Adjust search, branch, or status filters."
        />
      </div>
    )
  }

  return (
    <Table containerClassName="min-w-full" className="min-w-[1300px]">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {COLUMNS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="cursor-pointer"
            onClick={() => onRowClick(contact)}
          >
            <TableCell>
              <EntityCell name={contact.name} supporting={contact.id.toUpperCase()} />
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <ContactCell
                phone={contact.phone}
                email={contact.email}
                studentId={contact.id}
                studentName={contact.name}
              />
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-md text-[10px]">
                {SOURCE_LABELS[contact.source]}
              </Badge>
            </TableCell>
            <TableCell>
              <p className="truncate text-sm">{contact.interest ?? '—'}</p>
              {contact.notes ? (
                <p className="flex items-center gap-1 truncate text-xs italic text-muted-foreground">
                  <MessageCircle className="h-3 w-3 shrink-0" />
                  <span className="truncate">{contact.notes}</span>
                </p>
              ) : null}
            </TableCell>
            <TableCell className="text-sm">{contact.branch}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{contact.assignedTo}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {contact.lastInteraction ? formatDateTime(contact.lastInteraction) : '—'}
            </TableCell>
            <TableCell>
              <StatusBadge status={contact.status} />
            </TableCell>
            <TableCell className="text-right">
              <DataTableActions
                onEdit={() => onEdit(contact)}
                onDelete={() => onDelete(contact)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
