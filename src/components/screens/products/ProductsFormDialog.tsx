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
import type { Product } from '@/mocks/products'
import { CATEGORY_LABELS } from './productsTypes'

const STATUS_OPTIONS: Array<{ value: Product['status']; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
]

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as Product['category'][]).map(
  (value) => ({ value, label: CATEGORY_LABELS[value] })
)

interface ProductsFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Omit<Product, 'id'> & { id?: string }
  branches: string[]
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Omit<Product, 'id'> & { id?: string }) => void
}

export function ProductsFormDialog({
  open,
  mode,
  initial,
  branches,
  onOpenChange,
  onSubmit,
}: ProductsFormDialogProps) {
  // `initial` is captured at mount; parent remounts via `key` to reset between records.
  const [value, setValue] = useState(initial)
  const [tagsInput, setTagsInput] = useState((initial.tags ?? []).join(', '))

  const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  const isValid =
    value.name.trim() &&
    value.code.trim() &&
    value.branch.trim() &&
    value.price >= 0

  const handleSubmit = () => {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    onSubmit({ ...value, tags })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'New product' : 'Edit product'}</DialogTitle>
          <DialogDescription>
            Capture the product catalog entry. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <FieldLabel label="Product name" required className="md:col-span-2">
            <Input value={value.name} onChange={(e) => update('name', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="SKU / Code" required>
            <Input value={value.code} onChange={(e) => update('code', e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Category" required>
            <ToolbarSelect
              value={value.category}
              ariaLabel="Category"
              options={CATEGORY_OPTIONS}
              onValueChange={(v) => update('category', v as Product['category'])}
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
          <FieldLabel label="Status">
            <ToolbarSelect
              value={value.status}
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              onValueChange={(v) => update('status', v as Product['status'])}
              className="h-9 min-w-full"
            />
          </FieldLabel>
          <FieldLabel label="Price (VND)" required>
            <Input
              type="number"
              min={0}
              value={value.price}
              onChange={(e) => update('price', Number(e.target.value) || 0)}
            />
          </FieldLabel>
          <FieldLabel label="Duration" description='e.g. "3 tháng" or "1 tiếng"'>
            <Input
              value={value.duration ?? ''}
              onChange={(e) => update('duration', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Tags" description="Comma-separated" className="md:col-span-2">
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </FieldLabel>
          <FieldLabel label="Description" className="md:col-span-2">
            <Textarea
              rows={3}
              value={value.description ?? ''}
              onChange={(e) => update('description', e.target.value)}
            />
          </FieldLabel>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!isValid} onClick={handleSubmit}>
            {mode === 'create' ? 'Create' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
