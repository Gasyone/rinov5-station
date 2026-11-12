'use client'

import { useState, useEffect } from 'react'
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
import type { Contact } from '@/mocks/contacts'

interface ContactsFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Contact
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Contact) => void
}

export function ContactsFormDialog({
  open,
  mode,
  initial,
  onOpenChange,
  onSubmit,
}: ContactsFormDialogProps) {
  const [value, setValue] = useState<Contact>(initial)

  useEffect(() => {
    setValue(initial)
  }, [initial, open])

  const isValid = value.name.trim() && value.phone.trim()

  const update = <K extends keyof Contact>(key: K, next: Contact[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  const updateRelated = (field: 'name' | 'phone' | 'relationship', val: string) => {
    setValue((current) => ({
      ...current,
      relatedContact: {
        name: current.relatedContact?.name ?? '',
        phone: current.relatedContact?.phone ?? '',
        relationship: current.relatedContact?.relationship ?? 'Mẹ',
        [field]: val,
      },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Thêm liên hệ mới' : 'Chỉnh sửa liên hệ'}
          </DialogTitle>
          <DialogDescription>
            Quản lý thông tin danh bạ phụ huynh và học viên. Các trường dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-1 text-xs">
          {/* Hàng 1: Tên & Tên tiếng Anh */}
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Họ và tên" required>
              <Input
                placeholder="VD: Nguyễn Thu Trang"
                value={value.name}
                onChange={(e) => update('name', e.target.value)}
                className="h-8 text-xs"
              />
            </FieldLabel>
            <FieldLabel label="Tên tiếng Anh / Biệt danh">
              <Input
                placeholder="VD: Hannah"
                value={value.englishName ?? ''}
                onChange={(e) => update('englishName', e.target.value)}
                className="h-8 text-xs"
              />
            </FieldLabel>
          </div>

          {/* Hàng 2: Vai trò & SĐT (Định danh) */}
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Vai trò" required>
              <select
                value={value.role}
                onChange={(e) => update('role', e.target.value as 'parent' | 'student')}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="parent">Phụ huynh</option>
                <option value="student">Học viên</option>
              </select>
            </FieldLabel>
            <FieldLabel label="Số điện thoại (Định danh)" required>
              <Input
                placeholder="VD: 0912345678"
                value={value.phone}
                onChange={(e) => {
                  update('phone', e.target.value)
                  update('id', e.target.value)
                }}
                className="h-8 text-xs font-mono"
              />
            </FieldLabel>
          </div>

          {/* Hàng 3: Email & Ngày sinh */}
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Địa chỉ Email">
              <Input
                type="email"
                placeholder="VD: email@example.com"
                value={value.email ?? ''}
                onChange={(e) => update('email', e.target.value)}
                className="h-8 text-xs"
              />
            </FieldLabel>
            <FieldLabel label="Ngày tháng năm sinh">
              <Input
                type="date"
                value={value.dob ?? ''}
                onChange={(e) => update('dob', e.target.value)}
                className="h-8 text-xs"
              />
            </FieldLabel>
          </div>

          {/* Hàng 4: Người liên kết (Phụ huynh / Con) */}
          <div className="rounded-md border border-border p-3 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground text-xs">
              Thông tin Người liên kết ({value.role === 'student' ? 'Phụ huynh' : 'Con'})
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <FieldLabel label="Họ tên người liên kết">
                  <Input
                    placeholder="VD: Nguyễn Văn A"
                    value={value.relatedContact?.name ?? ''}
                    onChange={(e) => updateRelated('name', e.target.value)}
                    className="h-8 text-xs"
                  />
                </FieldLabel>
              </div>
              <div>
                <FieldLabel label="SĐT người liên kết">
                  <Input
                    placeholder="VD: 0987654321"
                    value={value.relatedContact?.phone ?? ''}
                    onChange={(e) => updateRelated('phone', e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </FieldLabel>
              </div>
              <div>
                <FieldLabel label="Mối quan hệ">
                  <select
                    value={value.relatedContact?.relationship ?? (value.role === 'student' ? 'Mẹ' : 'Con')}
                    onChange={(e) => updateRelated('relationship', e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="Mẹ">Mẹ</option>
                    <option value="Bố">Bố</option>
                    <option value="Con">Con</option>
                    <option value="Người giám hộ">Người giám hộ</option>
                  </select>
                </FieldLabel>
              </div>
            </div>
          </div>

          {/* Địa chỉ cư trú */}
          <FieldLabel label="Địa chỉ cư trú / liên hệ">
            <Input
              placeholder="VD: Số 120 Hoàng Ngân, Cầu Giấy, Hà Nội..."
              value={value.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
              className="h-8 text-xs"
            />
          </FieldLabel>

          {/* Ghi chú */}
          <FieldLabel label="Ghi chú liên lạc">
            <Textarea
              placeholder="Ghi chú về thói quen nghe máy, giờ liên hệ phù hợp..."
              value={value.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              className="text-xs"
            />
          </FieldLabel>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!isValid}
            onClick={() => onSubmit(value)}
          >
            {mode === 'create' ? 'Thêm liên hệ' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
