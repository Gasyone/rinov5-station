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
import { ToolbarSelect } from '@/components/controls'
import type { Employee } from '@/mocks/employees'

const STATUS_OPTIONS: Array<{ value: Employee['status']; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'probation', label: 'Probation' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'resigned', label: 'Resigned' },
]

const CONTRACT_OPTIONS: Array<{ value: Employee['contractType']; label: string }> = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
]

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

interface EmployeesFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Omit<Employee, 'id'> & { id?: string }
  branches: string[]
  departments: string[]
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Omit<Employee, 'id'> & { id?: string }) => void
}

export function EmployeesFormDialog({
  open,
  mode,
  initial,
  branches,
  departments,
  onOpenChange,
  onSubmit,
}: EmployeesFormDialogProps) {
  // `initial` is captured at mount; parent remounts via `key` to reset between records.
  const [value, setValue] = useState(initial)

  const isValid =
    value.name.trim() &&
    value.email.trim() &&
    value.phone.trim() &&
    value.branch.trim() &&
    value.department.trim() &&
    value.position.trim()

  const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'New employee' : 'Edit employee'}</DialogTitle>
          <DialogDescription>
            Required fields are marked with *. Salary is stored in VND.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <FieldLabel label="Full name" required>
            <Input value={value.name} onChange={(e) => update('name', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Email" required>
            <Input
              type="email"
              value={value.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Phone" required>
            <Input value={value.phone} onChange={(e) => update('phone', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Date of birth">
            <Input
              type="date"
              value={value.dob}
              onChange={(e) => update('dob', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Gender">
            <ToolbarSelect
              value={value.gender}
              ariaLabel="Gender"
              options={GENDER_OPTIONS}
              onValueChange={(v) => update('gender', v as Employee['gender'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Status">
            <ToolbarSelect
              value={value.status}
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              onValueChange={(v) => update('status', v as Employee['status'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Department" required>
            <ToolbarSelect
              value={value.department}
              ariaLabel="Department"
              options={[
                { value: '', label: 'Select department' },
                ...departments.map((d) => ({ value: d, label: d })),
              ]}
              onValueChange={(v) => update('department', v)}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Position" required>
            <Input value={value.position} onChange={(e) => update('position', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Branch" required>
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
          <FieldLabel label="Contract type">
            <ToolbarSelect
              value={value.contractType}
              ariaLabel="Contract type"
              options={CONTRACT_OPTIONS}
              onValueChange={(v) => update('contractType', v as Employee['contractType'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Hire date">
            <Input
              type="date"
              value={value.hireDate}
              onChange={(e) => update('hireDate', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Salary (VND)">
            <Input
              type="number"
              min={0}
              value={value.salary}
              onChange={(e) => update('salary', Number(e.target.value) || 0)}
            />
          </FieldLabel>
          <FieldLabel label="Address" className="md:col-span-2">
            <Textarea
              rows={2}
              value={value.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Emergency contact" className="md:col-span-2">
            <Input
              value={value.emergencyContact ?? ''}
              onChange={(e) => update('emergencyContact', e.target.value)}
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
