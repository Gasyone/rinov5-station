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
import type { OrgStaffMember, OrgUnit } from './orgStructureTypes'

interface OrgStaffTransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUnit: OrgUnit | null
  initialStaff?: OrgStaffMember | null
  initialTitle?: string
  allUnits: OrgUnit[]
  onTransfer: (params: {
    staffId: string
    fromUnitId: string
    toUnitId: string
    newTitle: string
    effectiveDate: string
    note: string
  }) => void
}

export function OrgStaffTransferDialog({
  open,
  onOpenChange,
  currentUnit,
  initialStaff,
  initialTitle,
  allUnits,
  onTransfer,
}: OrgStaffTransferDialogProps) {
  if (!currentUnit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Điều chuyển nhân sự</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Chuyển giao nhân sự sang phòng ban hoặc chi nhánh mới trong sơ đồ tổ chức.
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <OrgStaffTransferForm
            currentUnit={currentUnit}
            initialStaff={initialStaff}
            initialTitle={initialTitle}
            allUnits={allUnits}
            onTransfer={(params) => {
              onTransfer(params)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

interface OrgStaffTransferFormProps {
  currentUnit: OrgUnit
  initialStaff?: OrgStaffMember | null
  initialTitle?: string
  allUnits: OrgUnit[]
  onTransfer: (params: {
    staffId: string
    fromUnitId: string
    toUnitId: string
    newTitle: string
    effectiveDate: string
    note: string
  }) => void
  onCancel: () => void
}

function OrgStaffTransferForm({
  currentUnit,
  initialStaff,
  initialTitle,
  allUnits,
  onTransfer,
  onCancel,
}: OrgStaffTransferFormProps) {
  const defaultStaff = initialStaff || currentUnit.members[0]
  const otherUnit = allUnits.find((u) => u.id !== currentUnit.id)

  const [selectedStaffId, setSelectedStaffId] = useState(() => defaultStaff ? defaultStaff.id : '')
  const [targetUnitId, setTargetUnitId] = useState(() => otherUnit ? otherUnit.id : '')
  const [newTitle, setNewTitle] = useState(() => initialTitle || (defaultStaff ? defaultStaff.title : ''))
  const [effectiveDate, setEffectiveDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const staffOptions = currentUnit.members.map((m) => ({
    value: m.id,
    label: `${m.name} - ${m.title}`,
  }))

  const targetUnitOptions = allUnits
    .filter((u) => u.id !== currentUnit.id)
    .map((u) => ({
      value: u.id,
      label: `${u.name} (${u.code})`,
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedStaffId) {
      setError('Vui lòng chọn nhân sự cần điều chuyển')
      return
    }

    if (!targetUnitId) {
      setError('Vui lòng chọn đơn vị chuyển đến')
      return
    }

    onTransfer({
      staffId: selectedStaffId,
      fromUnitId: currentUnit.id,
      toUnitId: targetUnitId,
      newTitle: newTitle.trim(),
      effectiveDate,
      note: note.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
      {error ? (
        <div className="rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      <FieldLabel label="Nhân sự điều chuyển" required>
        <InlineSelect
          value={selectedStaffId}
          options={staffOptions}
          onValueChange={(val) => {
            setSelectedStaffId(val)
            const st = currentUnit.members.find((m) => m.id === val)
            if (st) setNewTitle(st.title)
          }}
          placeholder="Chọn nhân sự"
          ariaLabel="Nhân sự"
          className="h-8 text-xs"
        />
      </FieldLabel>

      <div className="rounded-md bg-muted/40 p-2.5 text-xs">
        <span className="text-muted-foreground">Đơn vị hiện tại: </span>
        <span className="font-semibold text-foreground">{currentUnit.name}</span>
      </div>

      <FieldLabel label="Chuyển đến đơn vị mới" required>
        <InlineSelect
          value={targetUnitId}
          options={targetUnitOptions}
          onValueChange={setTargetUnitId}
          placeholder="Chọn đơn vị tiếp nhận"
          ariaLabel="Đơn vị chuyển đến"
          className="h-8 text-xs"
        />
      </FieldLabel>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FieldLabel label="Chức danh mới">
          <Input
            placeholder="VD: Chuyên viên Học vụ"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="h-8 text-xs"
          />
        </FieldLabel>

        <FieldLabel label="Ngày hiệu lực" required>
          <Input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="h-8 text-xs"
          />
        </FieldLabel>
      </div>

      <FieldLabel label="Lý do & Quyết định điều chuyển">
        <Textarea
          placeholder="Ghi chú số quyết định bổ nhiệm hoặc lý do điều chuyển công tác..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
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
          Xác nhận chuyển
        </Button>
      </DialogFooter>
    </form>
  )
}
