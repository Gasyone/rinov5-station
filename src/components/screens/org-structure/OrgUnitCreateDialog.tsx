'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { validateUnitCode } from './orgStructureHelpers'
import {
  ORG_UNIT_TYPES,
  type OrgUnit,
  type OrgUnitFormValues,
  type OrgUnitType,
} from './orgStructureTypes'

interface OrgUnitCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingUnits: OrgUnit[]
  defaultParentId?: string
  onSubmit: (newUnitData: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'members'>) => void
}

const INITIAL_FORM: OrgUnitFormValues = {
  code: '',
  name: '',
  type: 'department',
  parentId: '',
  description: '',
}

export function OrgUnitCreateDialog({
  open,
  onOpenChange,
  existingUnits,
  defaultParentId,
  onSubmit,
}: OrgUnitCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Tạo mới Đơn vị Tổ chức</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Thêm Khối, Vùng, Chi nhánh, Phòng ban hoặc Tổ nhóm vào cây sơ đồ tổ chức doanh nghiệp.
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <OrgUnitCreateForm
            existingUnits={existingUnits}
            defaultParentId={defaultParentId}
            onSubmit={(data) => {
              onSubmit(data)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

interface OrgUnitCreateFormProps {
  existingUnits: OrgUnit[]
  defaultParentId?: string
  onSubmit: (newUnitData: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'members'>) => void
  onCancel: () => void
}

function OrgUnitCreateForm({
  existingUnits,
  defaultParentId,
  onSubmit,
  onCancel,
}: OrgUnitCreateFormProps) {
  const [formData, setFormData] = useState<OrgUnitFormValues>(() => ({
    ...INITIAL_FORM,
    parentId: defaultParentId || (existingUnits[0]?.id ?? ''),
  }))
  const [codeError, setCodeError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const handleFieldChange = (field: keyof OrgUnitFormValues, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
    if (field === 'code') setCodeError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const codeErr = validateUnitCode(formData.code, existingUnits)
    if (codeErr) {
      setCodeError(codeErr)
      return
    }

    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập tên đơn vị tổ chức')
      return
    }

    const typeItem = ORG_UNIT_TYPES.find((t) => t.value === formData.type)

    onSubmit({
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      type: formData.type,
      typeLabel: typeItem?.label || 'Phòng ban',
      parentId: formData.parentId || null,
      status: 'active',
      statusLabel: 'Đang hoạt động',
      description: formData.description.trim() || 'Đơn vị phòng ban thuộc sơ đồ tổ chức',
      positions: [] as string[],
    })
  }

  const typeOptions = ORG_UNIT_TYPES.filter((t) => t.value !== 'all').map((t) => ({
    value: t.value,
    label: t.label,
  }))

  const parentOptions = [
    { value: '', label: 'Không có (Cấp cao nhất - BOD)' },
    ...existingUnits.map((u) => ({
      value: u.id,
      label: `${u.name} (${u.code})`,
    })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
      {formError ? (
        <div className="rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">
          {formError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FieldLabel label="Mã đơn vị" required description="Mã viết hoa (VD: ACAD_HN, DEPT_OPS)">
          <Input
            placeholder="VD: ACAD_HN"
            value={formData.code}
            onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
            className="h-8 font-mono text-xs uppercase"
          />
          {codeError ? (
            <span className="text-[11px] text-destructive mt-1 block">{codeError}</span>
          ) : null}
        </FieldLabel>

        <FieldLabel label="Tên đơn vị tổ chức" required>
          <Input
            placeholder="VD: Tổ Đào tạo - Học vụ"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="h-8 text-xs"
          />
        </FieldLabel>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FieldLabel label="Phân loại đơn vị" required>
          <InlineSelect
            value={formData.type}
            options={typeOptions}
            onValueChange={(val) => handleFieldChange('type', val as OrgUnitType)}
            placeholder="Chọn loại hình"
            ariaLabel="Loại hình"
            className="h-8 text-xs"
          />
        </FieldLabel>

        <FieldLabel label="Đơn vị cấp trên trực thuộc">
          <InlineSelect
            value={formData.parentId}
            options={parentOptions}
            onValueChange={(val) => handleFieldChange('parentId', val)}
            placeholder="Chọn đơn vị cha"
            ariaLabel="Đơn vị cha"
            className="h-8 text-xs"
          />
        </FieldLabel>
      </div>

      <FieldLabel label="Mô tả chức năng & nhiệm vụ">
        <Textarea
          placeholder="Ghi chú về phạm vi quản lý và trách nhiệm của đơn vị..."
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="text-xs min-h-[60px]"
        />
      </FieldLabel>

      <DialogFooter className="pt-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button type="submit" size="sm">
          Lưu đơn vị
        </Button>
      </DialogFooter>
    </form>
  )
}
