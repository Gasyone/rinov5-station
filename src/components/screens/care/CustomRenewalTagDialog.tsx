'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { toast } from 'sonner'
import { Plus, Pencil } from 'lucide-react'

export interface CustomRenewalTag {
  code: string
  name: string
  description: string
  sla: number // days
}

interface CustomRenewalTagDialogProps {
  mode: 'create' | 'edit'
  initialData?: CustomRenewalTag
  trigger: React.ReactNode
  onSave?: (tag: CustomRenewalTag) => void
}

export function CustomRenewalTagDialog({ mode, initialData, trigger, onSave }: CustomRenewalTagDialogProps) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState(initialData?.code || '')
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [sla, setSla] = useState(initialData?.sla?.toString() || '7')

  const resetForm = () => {
    if (mode === 'create') {
      setCode('')
      setName('')
      setDescription('')
      setSla('7')
    } else if (initialData) {
      setCode(initialData.code)
      setName(initialData.name)
      setDescription(initialData.description)
      setSla(initialData.sla.toString())
    }
  }

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (v) resetForm()
  }

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      toast.error('Vui lòng nhập mã và tên thẻ chăm sóc.')
      return
    }
    const tag: CustomRenewalTag = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      sla: parseInt(sla) || 7,
    }
    onSave?.(tag)
    toast.success(mode === 'create' ? `Đã tạo thẻ chăm sóc tái phí "${tag.name}"` : `Đã cập nhật thẻ "${tag.name}"`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            {mode === 'create' ? 'Tạo thẻ Chăm sóc tùy chỉnh' : 'Chỉnh sửa thẻ Chăm sóc'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3.5 py-2">
          <FieldLabel label="Mã thẻ" required>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: CSTP2, TP_VIP..."
              className="h-8 text-xs uppercase"
              maxLength={10}
              disabled={mode === 'edit'}
            />
          </FieldLabel>

          <FieldLabel label="Tên thẻ" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Tái phí VIP, Tái phí Ưu tiên..."
              className="h-8 text-xs"
            />
          </FieldLabel>

          <FieldLabel label="Mô tả">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục đích của thẻ chăm sóc tái phí này..."
              className="text-xs min-h-[64px] resize-none"
              rows={3}
            />
          </FieldLabel>

          <FieldLabel label="SLA (ngày)" required>
            <Input
              type="number"
              value={sla}
              onChange={(e) => setSla(e.target.value)}
              placeholder="7"
              className="h-8 text-xs w-24"
              min={1}
              max={90}
            />
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Thời hạn hoàn thành chăm sóc tối đa
            </span>
          </FieldLabel>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Hủy
            </Button>
          </DialogClose>
          <Button size="sm" className="text-xs h-8" onClick={handleSave}>
            {mode === 'create' ? 'Tạo thẻ' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Compact trigger buttons for use in row hover actions */
export function CreateRenewalTagButton({ onSave }: { onSave?: (tag: CustomRenewalTag) => void }) {
  return (
    <CustomRenewalTagDialog
      mode="create"
      onSave={onSave}
      trigger={
        <Button
          variant="ghost"
          size="icon-xs"
          title="Tạo thẻ chăm sóc tùy chỉnh"
          className="h-6 w-6 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md shrink-0 shadow-none"
        >
          <Plus className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        </Button>
      }
    />
  )
}

export function EditRenewalTagButton({ tag, onSave }: { tag: CustomRenewalTag; onSave?: (tag: CustomRenewalTag) => void }) {
  return (
    <CustomRenewalTagDialog
      mode="edit"
      initialData={tag}
      onSave={onSave}
      trigger={
        <Button
          variant="ghost"
          size="icon-xs"
          title="Chỉnh sửa thẻ chăm sóc"
          className="h-6 w-6 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-md shrink-0 shadow-none"
        >
          <Pencil className="h-3 w-3 text-amber-600 dark:text-amber-400" />
        </Button>
      }
    />
  )
}
