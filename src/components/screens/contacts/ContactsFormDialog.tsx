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
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { BranchSelect, ToolbarSelect } from '@/components/controls'
import type { Contact } from '@/mocks/contacts'
import { SOURCE_LABELS } from './contactsTypes'

const STATUS_OPTIONS: Array<{ value: Contact['status']; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
]

const SOURCE_OPTIONS = (Object.keys(SOURCE_LABELS) as Contact['source'][]).map(
  (value) => ({ value, label: SOURCE_LABELS[value] })
)

interface ContactsFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Omit<Contact, 'id'> & { id?: string }
  branches: string[]
  assignees: string[]
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Omit<Contact, 'id'> & { id?: string }) => void
}

export function ContactsFormDialog({
  open,
  mode,
  initial,
  branches,
  assignees,
  onOpenChange,
  onSubmit,
}: ContactsFormDialogProps) {
  // `initial` is captured at mount; parent remounts via `key` to reset between records.
  const [value, setValue] = useState(initial)

  const isValid = value.name.trim() && value.phone.trim() && value.branch.trim()

  const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add contact' : 'Edit contact'}</DialogTitle>
          <DialogDescription>
            Track a CRM lead through the pipeline. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <FieldLabel label="Full name" required>
            <Input value={value.name} onChange={(e) => update('name', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Phone" required>
            <Input value={value.phone} onChange={(e) => update('phone', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Email">
            <Input
              type="email"
              value={value.email ?? ''}
              onChange={(e) => update('email', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Interest">
            <Input
              value={value.interest ?? ''}
              onChange={(e) => update('interest', e.target.value)}
              placeholder="IELTS / TOEIC / Tiếng Nhật..."
            />
          </FieldLabel>
          <FieldLabel label="Source">
            <ToolbarSelect
              value={value.source}
              ariaLabel="Source"
              options={SOURCE_OPTIONS}
              onValueChange={(v) => update('source', v as Contact['source'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Status">
            <ToolbarSelect
              value={value.status}
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              onValueChange={(v) => update('status', v as Contact['status'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="School" required>
            <BranchSelect
              value={value.branch}
              branches={branches}
              variant="inline"
              includeAll={false}
              placeholder="Select school"
              ariaLabel="School"
              onValueChange={(v) => update('branch', v)}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Assigned to">
            <ToolbarSelect
              value={value.assignedTo}
              ariaLabel="Assigned to"
              options={[
                { value: '', label: 'Unassigned' },
                ...assignees.map((a) => ({ value: a, label: a })),
              ]}
              onValueChange={(v) => update('assignedTo', v)}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Notes" className="md:col-span-2">
            <Textarea
              rows={3}
              value={value.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
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
