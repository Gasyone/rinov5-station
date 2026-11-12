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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldLabel } from '@/components/shared'
import { SegmentedControl } from '@/components/controls'
import type { Supplier } from '@/mocks/suppliers'
import { SUPPLIER_CATEGORIES } from './suppliersTypes'
import { Building2, UserCheck } from 'lucide-react'

interface SupplierFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Supplier
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Supplier) => void
}

export function SupplierFormDialog({
  open,
  mode,
  initial,
  onOpenChange,
  onSubmit,
}: SupplierFormDialogProps) {
  const [value, setValue] = useState<Supplier>(initial)

  useEffect(() => {
    setValue(initial)
  }, [initial, open])

  const isOrg = value.type === 'organization'
  const isValid =
    value.name.trim() &&
    value.contactPersonName.trim() &&
    value.contactPhone.trim()

  const update = <K extends keyof Supplier>(key: K, next: Supplier[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  const updateBank = (field: 'bankName' | 'accountNumber' | 'accountHolder', val: string) => {
    setValue((current) => ({
      ...current,
      bankInfo: {
        bankName: current.bankInfo?.bankName ?? '',
        accountNumber: current.bankInfo?.accountNumber ?? '',
        accountHolder: current.bankInfo?.accountHolder ?? '',
        [field]: val,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Thêm mới nhà cung cấp / đối tượng'
              : 'Chỉnh sửa đối tượng cung cấp'}
          </DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin đối tượng và thông tin người liên hệ cá nhân trực tiếp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Chọn loại đối tượng */}
          <div>
            <FieldLabel required label="Phân loại đối tượng cung cấp" />
            <div className="mt-1">
              <SegmentedControl
                options={[
                  {
                    value: 'organization',
                    label: '🏢 Tổ chức / Doanh nghiệp',
                  },
                  {
                    value: 'individual',
                    label: '👤 Cá nhân cung cấp',
                  },
                ]}
                value={value.type}
                onValueChange={(val) =>
                  update('type', val as 'organization' | 'individual')
                }
              />
            </div>
          </div>

          {/* 2. Tên đối tượng & Lĩnh vực */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel
                required
                label={isOrg ? 'Tên đối tượng / công ty' : 'Họ và tên đối tượng'}
              />
              <Input
                value={value.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={
                  isOrg ? 'VD: Công ty CP Sách Cambridge VN' : 'VD: Thầy Robert Johnson'
                }
                className="mt-1"
                required
              />
            </div>

            <div>
              <FieldLabel required label="Lĩnh vực cung cấp" />
              <div className="mt-1">
                <Select
                  value={value.category}
                  onValueChange={(val) => update('category', val as Supplier['category'])}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Chọn lĩnh vực" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 3. Thông tin tổ chức (Nếu là Organization) */}
          {isOrg && (
            <div className="rounded-lg border border-sky-200 bg-sky-50/40 dark:border-sky-900 dark:bg-sky-950/20 p-3 space-y-3">
              <div className="flex items-center gap-1.5 font-semibold text-sky-900 dark:text-sky-300">
                <Building2 className="h-3.5 w-3.5" />
                <span>Thông tin pháp nhân tổ chức</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel label="Mã số thuế (MST)" />
                  <Input
                    value={value.taxCode ?? ''}
                    onChange={(e) => update('taxCode', e.target.value)}
                    placeholder="VD: 0108998822"
                    className="mt-1 bg-background font-mono"
                  />
                </div>
                <div>
                  <FieldLabel label="Website công ty" />
                  <Input
                    value={value.website ?? ''}
                    onChange={(e) => update('website', e.target.value)}
                    placeholder="https://..."
                    className="mt-1 bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel label="Tên pháp nhân đầy đủ" />
                  <Input
                    value={value.orgName ?? ''}
                    onChange={(e) => update('orgName', e.target.value)}
                    placeholder="VD: Công ty Cổ phần Sách & Học liệu Cambridge Việt Nam"
                    className="mt-1 bg-background"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Người liên hệ (Luôn là cá nhân) */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              <span>Người liên hệ phụ trách (Luôn là cá nhân)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel required label="Họ và tên người liên hệ" />
                <Input
                  value={value.contactPersonName}
                  onChange={(e) => update('contactPersonName', e.target.value)}
                  placeholder="VD: Nguyễn Văn Tuấn"
                  className="mt-1 bg-background"
                  required
                />
              </div>

              <div>
                <FieldLabel label="Chức danh / Vị trí" />
                <Input
                  value={value.contactPersonRole}
                  onChange={(e) => update('contactPersonRole', e.target.value)}
                  placeholder="VD: Giám đốc phân phối / Kỹ sư bảo trì"
                  className="mt-1 bg-background"
                />
              </div>

              <div>
                <FieldLabel required label="Số điện thoại cá nhân" />
                <Input
                  value={value.contactPhone}
                  onChange={(e) => update('contactPhone', e.target.value)}
                  placeholder="VD: 0918882233"
                  className="mt-1 bg-background font-mono"
                  required
                />
              </div>

              <div>
                <FieldLabel label="Email liên hệ" />
                <Input
                  type="email"
                  value={value.contactEmail ?? ''}
                  onChange={(e) => update('contactEmail', e.target.value)}
                  placeholder="tuan.nguyen@cambridgebooks.vn"
                  className="mt-1 bg-background"
                />
              </div>
            </div>
          </div>

          {/* 5. Địa chỉ & Tài khoản ngân hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Địa chỉ liên hệ / giao dịch" />
              <Input
                value={value.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Số nhà, đường, quận, tỉnh..."
                className="mt-1"
              />
            </div>
            <div>
              <FieldLabel label="Tên ngân hàng" />
              <Input
                value={value.bankInfo?.bankName ?? ''}
                onChange={(e) => updateBank('bankName', e.target.value)}
                placeholder="VD: Vietcombank"
                className="mt-1"
              />
            </div>
            <div>
              <FieldLabel label="Số tài khoản ngân hàng" />
              <Input
                value={value.bankInfo?.accountNumber ?? ''}
                onChange={(e) => updateBank('accountNumber', e.target.value)}
                placeholder="0011004455667"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <FieldLabel label="Chủ tài khoản" />
              <Input
                value={value.bankInfo?.accountHolder ?? ''}
                onChange={(e) => updateBank('accountHolder', e.target.value)}
                placeholder="NGUYEN VAN TUAN"
                className="mt-1 uppercase"
              />
            </div>
          </div>

          {/* 6. Ghi chú */}
          <div>
            <FieldLabel label="Ghi chú hợp tác / điều khoản chiết khấu" />
            <Textarea
              value={value.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Ghi chú về năng lực cung cấp, chính sách chiết khấu, lịch bảo hành..."
              rows={2}
              className="mt-1 text-xs"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={!isValid}>
              {mode === 'create' ? 'Tạo đối tượng' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
