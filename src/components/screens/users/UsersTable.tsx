'use client'

import { Lock, Mail, ShieldCheck, Unlock, UserRound } from 'lucide-react'
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
} from '@/components/shared'
import { formatDateTime, maskPhone } from '@/lib/format'
import type { User } from '@/mocks/users'
import { ROLE_LABELS } from './usersTypes'

interface UsersTableProps {
  users: User[]
  onRowClick: (user: User) => void
  onEdit: (user: User) => void
  onToggleLock: (user: User) => void
  onDelete: (user: User) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'User' },
  { label: 'Contact', className: 'min-w-52' },
  { label: 'Role', className: 'min-w-40' },
  { label: 'Branch', className: 'min-w-44' },
  { label: 'Last login', className: 'min-w-40' },
  { label: 'Created', className: 'min-w-32' },
  { label: 'Status', className: 'min-w-28' },
  { label: 'Actions', className: 'w-28 text-right' },
]

export function UsersTable({
  users,
  onRowClick,
  onEdit,
  onToggleLock,
  onDelete,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<UserRound className="h-7 w-7 text-muted-foreground" />}
          title="No users match the filters"
          description="Adjust the search, branch, or status filters."
        />
      </div>
    )
  }

  return (
    <Table containerClassName="min-w-full" className="min-w-[1100px]">
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
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="cursor-pointer"
            onClick={() => onRowClick(user)}
          >
            <TableCell>
              <EntityCell
                name={user.fullName}
                supporting={`@${user.username}`}
                avatar={user.avatar}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-xs">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone ? (
                <p className="font-mono text-xs text-muted-foreground">
                  {maskPhone(user.phone)}
                </p>
              ) : null}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-md text-[10px]">
                <ShieldCheck className="mr-1 h-3 w-3" />
                {ROLE_LABELS[user.role]}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{user.branch}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {user.lastLogin ? formatDateTime(user.lastLogin) : '— never —'}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatDateTime(user.createdAt)}
            </TableCell>
            <TableCell>
              <StatusBadge status={user.status} />
            </TableCell>
            <TableCell className="text-right">
              <DataTableActions
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user)}
                extra={[
                  {
                    id: 'toggle-lock',
                    label: user.status === 'locked' ? 'Unlock account' : 'Lock account',
                    icon: user.status === 'locked' ? Unlock : Lock,
                    onClick: () => onToggleLock(user),
                  },
                ]}
                menuLabel="User actions"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
