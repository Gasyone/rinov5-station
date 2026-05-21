'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import type { User } from '@/mocks/users'
import { ROLE_LABELS } from './usersTypes'

const STATUS_OPTIONS: Array<{ value: User['status']; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'locked', label: 'Locked' },
]

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as User['role'][]).map((value) => ({
  value,
  label: ROLE_LABELS[value],
}))

interface UsersFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Omit<User, 'id'> & { id?: string }
  branches: string[]
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Omit<User, 'id'> & { id?: string }) => void
}

export function UsersFormDialog({
  open,
  mode,
  initial,
  branches,
  onOpenChange,
  onSubmit,
}: UsersFormDialogProps) {
  // `initial` is captured at mount; parent remounts via `key` to reset between records.
  const [value, setValue] = useState(initial)

  const isValid =
    value.email.trim() &&
    value.username.trim() &&
    value.fullName.trim() &&
    value.branch.trim()

  const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add user' : 'Edit user'}</DialogTitle>
          <DialogDescription>
            Users authenticate against the mock auth provider. Password is not stored.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <FieldLabel label="Full name" required>
            <Input value={value.fullName} onChange={(e) => update('fullName', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Username" required>
            <Input value={value.username} onChange={(e) => update('username', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Email" required>
            <Input
              type="email"
              value={value.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Phone">
            <Input value={value.phone ?? ''} onChange={(e) => update('phone', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Role" required>
            <ToolbarSelect
              value={value.role}
              ariaLabel="Role"
              options={ROLE_OPTIONS}
              onValueChange={(v) => update('role', v as User['role'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Status">
            <ToolbarSelect
              value={value.status}
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              onValueChange={(v) => update('status', v as User['status'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Branch" required className="md:col-span-2">
            <ToolbarSelect
              value={value.branch}
              ariaLabel="Branch"
              options={[
                { value: '', label: 'Select branch' },
                ...branches.map((b) => ({ value: b, label: b })),
              ]}
              onValueChange={(v) => update('branch', v)}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Avatar URL" className="md:col-span-2">
            <Input
              value={value.avatar ?? ''}
              onChange={(e) => update('avatar', e.target.value)}
              placeholder="https://..."
            />
          </FieldLabel>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!isValid} onClick={() => onSubmit(value)}>
            {mode === 'create' ? 'Create' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
