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
import type { Organization } from '@/mocks/organizations'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { Home, Building2, UserCheck } from 'lucide-react'

interface OrganizationFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Organization
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Organization) => void
}

export function OrganizationFormDialog({
  open,
  mode,
  initial,
  onOpenChange,
  onSubmit,
}: OrganizationFormDialogProps) {
  const [value, setValue] = useState<Organization>(initial)

  useEffect(() => {
    setValue(initial)
  }, [initial, open])

  const isFamily = value.type === 'family'
  const isValid =
    value.name.trim() &&
    value.primaryContactName.trim() &&
    value.primaryPhone.trim() &&
    value.address.trim()

  const update = <K extends keyof Organization>(key: K, next: Organization[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl text-xs">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Thêm mới đối tượng tổ chức / hộ gia đình'
              : 'Chỉnh sửa thông tin đối tượng'}
          </DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin tổ chức/gia đình và đầu mối liên hệ cá nhân trực tiếp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Chọn loại đối tượng */}
          <div>
            <FieldLabel required label="Phân loại đối tượng" />
            <div className="mt-1">
              <SegmentedControl
                options={[
                  {
                    value: 'family',
                    label: '🏡 Hộ gia đình',
                  },
                  {
                    value: 'organization',
                    label: '🏢 Tổ chức / Doanh nghiệp',
                  },
                ]}
                value={value.type}
                onValueChange={(val) => {
                  const nextType = val as 'family' | 'organization'
                  setValue((prev) => ({
                    ...prev,
                    type: nextType,
                    category: nextType === 'family' ? 'Hộ gia đình' : 'Doanh nghiệp B2B',
                    primaryContactRole: nextType === 'family' ? 'Mẹ' : 'Trưởng phòng Hợp tác',
                  }))
                }}
              />
            </div>
          </div>

          {/* 2. Tên đối tượng & Cơ sở */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel
                required
                label={isFamily ? 'Tên hộ gia đình' : 'Tên tổ chức / doanh nghiệp'}
              />
              <Input
                value={value.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={
                  isFamily
                    ? 'VD: Gia đình Chị Hương Thảo & Anh Hùng'
                    : 'VD: Trường Song ngữ Vinschool Smart City'
                }
                className="mt-1 h-8 text-xs"
                required
              />
            </div>

            <div>
              <FieldLabel required label="Cơ sở liên kết chính" />
              <div className="mt-1">
                <Select
                  value={value.branch}
                  onValueChange={(val) => update('branch', val)}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Chọn cơ sở" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_BRANCHES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Nếu là Doanh nghiệp/Tổ chức: Mã số thuế & Loại hình */}
          {!isFamily && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sky-50/40 dark:bg-sky-950/20 p-2.5 rounded-lg border border-sky-200 dark:border-sky-900">
              <div>
                <FieldLabel label="Mã số thuế (MST)" />
                <Input
                  value={value.taxCode ?? ''}
                  onChange={(e) => update('taxCode', e.target.value)}
                  placeholder="VD: 0106889911"
                  className="mt-1 h-8 text-xs font-mono bg-background"
                />
              </div>
              <div>
                <FieldLabel label="Phân loại liên kết" />
                <Input
                  value={value.category ?? ''}
                  onChange={(e) => update('category', e.target.value)}
                  placeholder="Trường học / Doanh nghiệp B2B..."
                  className="mt-1 h-8 text-xs bg-background"
                />
              </div>
            </div>
          )}

          {/* 3. Người đại diện (Luôn là cá nhân) */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              <span>Người đại diện / Đầu mối liên hệ (Luôn là cá nhân)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel required label="Họ và tên người đại diện" />
                <Input
                  value={value.primaryContactName}
                  onChange={(e) => update('primaryContactName', e.target.value)}
                  placeholder="VD: Đỗ Thị Hương Thảo"
                  className="mt-1 h-8 text-xs bg-background"
                  required
                />
              </div>

              <div>
                <FieldLabel label="Vai trò / Chức danh" />
                <Input
                  value={value.primaryContactRole}
                  onChange={(e) => update('primaryContactRole', e.target.value)}
                  placeholder={isFamily ? 'VD: Mẹ / Bố' : 'VD: Trưởng phòng Đối ngoại'}
                  className="mt-1 h-8 text-xs bg-background"
                />
              </div>

              <div>
                <FieldLabel required label="Số điện thoại cá nhân" />
                <Input
                  value={value.primaryPhone}
                  onChange={(e) => update('primaryPhone', e.target.value)}
                  placeholder="VD: 0912888203"
                  className="mt-1 h-8 text-xs bg-background font-mono"
                  required
                />
              </div>

              <div>
                <FieldLabel label="Email liên hệ" />
                <Input
                  type="email"
                  value={value.primaryEmail ?? ''}
                  onChange={(e) => update('primaryEmail', e.target.value)}
                  placeholder="thao.do@gmail.com"
                  className="mt-1 h-8 text-xs bg-background"
                />
              </div>
            </div>
          </div>

          {/* 4. ĐỊA CHỈ TRỤ SỞ / CƯ TRÚ (BẮT BUỘC) */}
          <div>
            <FieldLabel required label="Địa chỉ trụ sở / Nơi cư trú" />
            <Input
              value={value.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="VD: Phường Tây Mỗ, Quận Nam Từ Liêm, TP. Hà Nội"
              className="mt-1 h-8 text-xs"
              required
            />
          </div>

          {/* 5. Phân hạng & Ghi chú */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Phân hạng đối tượng" />
              <div className="mt-1">
                <Select
                  value={value.tier}
                  onValueChange={(val) => update('tier', val as Organization['tier'])}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Chọn hạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <FieldLabel label="Nhân viên phụ trách" />
              <Input
                value={value.assignedSale ?? ''}
                onChange={(e) => update('assignedSale', e.target.value)}
                placeholder="VD: Trần Thị Sale"
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <FieldLabel label="Ghi chú hợp tác / hoàn cảnh gia đình" />
            <Textarea
              value={value.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Ghi chú thêm về nhu cầu học tập, cam kết hoặc chính sách ưu đãi..."
              rows={2}
              className="mt-1 text-xs"
            />
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
            <Button type="submit" size="sm" disabled={!isValid}>
              {mode === 'create' ? 'Tạo đối tượng' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
