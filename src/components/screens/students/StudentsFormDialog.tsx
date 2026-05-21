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
import type { Student } from '@/mocks/students'

const STATUS_OPTIONS: Array<{ value: Student['status']; label: string }> = [
  { value: 'pending_payment', label: 'Chờ thanh toán' },
  { value: 'draft_class', label: 'Lớp nháp' },
  { value: 'wait_for_assignment', label: 'Chờ xếp lớp' },
  { value: 'enroll_later', label: 'Xếp lớp sau' },
  { value: 'pending_transfer', label: 'Chờ chuyển lớp' },
  { value: 'fee_transfer', label: 'Chuyển phí' },
  { value: 'awaiting_opening', label: 'Chờ khai giảng' },
  { value: 'trial', label: 'Học thử' },
  { value: 'active', label: 'Đang học' },
  { value: 'reserve', label: 'Bảo lưu' },
  { value: 'session_ended', label: 'Hết buổi' },
]

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

interface StudentsFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Omit<Student, 'id'> & { id?: string }
  branches: string[]
  levels: string[]
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Omit<Student, 'id'> & { id?: string }) => void
}

export function StudentsFormDialog({
  open,
  mode,
  initial,
  branches,
  levels,
  onOpenChange,
  onSubmit,
}: StudentsFormDialogProps) {
  // `initial` is captured at mount. The parent remounts the dialog (via `key`)
  // whenever the target record changes, so this avoids a useEffect/setState sync.
  const [value, setValue] = useState(initial)

  const isValid = value.name.trim() && value.email.trim() && value.branch.trim() && value.level.trim()

  const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add student' : 'Edit student'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Capture a new student record. All fields marked with * are required.'
              : 'Update the student record. Changes are saved to the in-memory mock data.'}
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
          <FieldLabel label="Phone">
            <Input value={value.phone ?? ''} onChange={(e) => update('phone', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Date of birth">
            <Input type="date" value={value.dob} onChange={(e) => update('dob', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Gender">
            <ToolbarSelect
              value={value.gender}
              ariaLabel="Gender"
              options={GENDER_OPTIONS}
              onValueChange={(v) => update('gender', v as Student['gender'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Status">
            <ToolbarSelect
              value={value.status}
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              onValueChange={(v) => update('status', v as Student['status'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Branch" required>
            <ToolbarSelect
              value={value.branch}
              ariaLabel="Branch"
              options={[
                { value: '', label: 'Select branch' },
                ...branches.map((branch) => ({ value: branch, label: branch })),
              ]}
              onValueChange={(v) => update('branch', v)}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Level" required>
            <ToolbarSelect
              value={value.level}
              ariaLabel="Level"
              options={[
                { value: '', label: 'Select level' },
                ...levels.map((level) => ({ value: level, label: level })),
              ]}
              onValueChange={(v) => update('level', v)}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Enrolled class">
            <Input
              value={value.enrolledClass ?? ''}
              onChange={(e) => update('enrolledClass', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Enrollment date">
            <Input
              type="date"
              value={value.enrollmentDate}
              onChange={(e) => update('enrollmentDate', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Parent name">
            <Input
              value={value.parentName ?? ''}
              onChange={(e) => update('parentName', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Parent phone">
            <Input
              value={value.parentPhone ?? ''}
              onChange={(e) => update('parentPhone', e.target.value)}
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
