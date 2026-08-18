'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Mail, User, Pencil, Check, X, Truck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DepositCustomerInfo } from './depositOrderTypes'

interface DepositCustomerPanelProps {
  customer: DepositCustomerInfo
  onUpdateCustomer: (updates: Partial<DepositCustomerInfo>) => void
}

const PROVINCE_OPTIONS = [
  'Bắc Giang',
  'Hà Nội',
  'Bình Dương',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Đồng Nai',
]

const DISTRICT_OPTIONS: Record<string, string[]> = {
  'Bắc Giang': ['Huyện Lạng Giang', 'Thành phố Bắc Giang', 'Huyện Việt Yên', 'Huyện Hiệp Hòa'],
  'Bình Dương': ['Thị xã Tân Uyên', 'Thành phố Thủ Dầu Một', 'Thành phố Thuận An', 'Thành phố Dĩ An'],
  'Hà Nội': ['Thanh Xuân', 'Hoàn Kiếm', 'Cầu Giấy', 'Ba Đình', 'Đống Đa', 'Hà Đông'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Thành phố Thủ Đức', 'Bình Thạnh'],
  'Hải Phòng': ['Quận Dương Kinh', 'Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân'],
}

const WARD_OPTIONS: Record<string, string[]> = {
  'Huyện Lạng Giang': ['Xã Nghĩa Hưng', 'Thị trấn Kép', 'Xã Tân Dĩnh', 'Xã Mỹ Thái'],
  'Thị xã Tân Uyên': ['Phường Khánh Bình', 'Phường Uyên Hưng', 'Phường Tân Phước Khánh'],
  'Thanh Xuân': ['Phường Thanh Xuân Trung', 'Phường Nhân Chính', 'Phường Khương Mai'],
  'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Đa Kao'],
  'Quận Dương Kinh': ['Phường Đa Phúc', 'Phường Hưng Đạo', 'Phường Anh Dũng'],
}

export function DepositCustomerPanel({
  customer,
  onUpdateCustomer,
}: DepositCustomerPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<DepositCustomerInfo>(customer)

  const handleStartEdit = () => {
    setDraft(customer)
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdateCustomer(draft)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(customer)
    setIsEditing(false)
  }

  const currentDistricts = DISTRICT_OPTIONS[draft.province] || [
    'Huyện Lạng Giang',
    'Quận/Huyện khác',
  ]
  const currentWards = WARD_OPTIONS[draft.district] || [
    'Xã Nghĩa Hưng',
    'Phường/Xã khác',
  ]

  const fullAddressText = [
    customer.detailAddress,
    customer.ward,
    customer.district,
    customer.province,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-xl p-4 shadow-2xs text-left transition-all overflow-visible">
      {/* ── MODE 1: MẶC ĐỊNH - THÔNG TIN NGƯỜI NHẬN (VIEW MODE) ── */}
      {!isEditing ? (
        <div className="space-y-3.5">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900 shrink-0">
                <User className="h-3.5 w-3.5" />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                Thông tin người nhận
              </h4>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="h-7 text-xs px-2.5 gap-1 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer shadow-2xs"
            >
              <Pencil className="h-3 w-3" />
              <span>Sửa</span>
            </Button>
          </div>

          {/* Customer Details Content */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-28 shrink-0">• Họ tên:</span>
              <span className="font-semibold text-foreground">
                {customer.recipientName || 'Phạm nguyên khôi'}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-28 shrink-0">• Số điện thoại:</span>
              <span className="font-mono font-medium text-foreground">
                {customer.phone || '0983055652'}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-28 shrink-0">• Email:</span>
              <span className="text-muted-foreground">
                {customer.email || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-border/40">
              <span className="text-muted-foreground w-28 shrink-0 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                <span>Địa chỉ nhận:</span>
              </span>
              <span className="font-medium text-foreground leading-relaxed">
                {fullAddressText || 'Bắc Giang, Xã Nghĩa Hưng, Huyện Lạng Giang, Bắc Giang'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ── MODE 2: CHỈNH SỬA - ĐỊA CHỈ NHẬN HÀNG (EDIT MODE) ── */
        <div className="space-y-3.5">
          {/* Header Bar: Có nền, bỏ viền icon, bỏ đường line dưới */}
          <div className="-mx-4 -mt-4 p-3 px-4 bg-rose-50/70 dark:bg-rose-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                Địa chỉ nhận hàng (Chỉnh sửa)
              </h4>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              title="Đóng chỉnh sửa"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Grid - Căn chuẩn đều đặn, không thụt thò */}
          <div className="space-y-3 text-xs pt-1">
            {/* Tên người nhận */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Tên người nhận <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={draft.recipientName}
                onChange={(e) => setDraft({ ...draft, recipientName: e.target.value })}
                placeholder="Nhập họ và tên người nhận..."
                className="h-9 text-xs bg-white dark:bg-zinc-900 font-medium w-full"
              />
            </div>

            {/* Số điện thoại & Email (2 cột bằng nhau) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Số điện thoại <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="09..."
                  className="h-9 text-xs bg-white dark:bg-zinc-900 font-mono w-full"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Email
                </Label>
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="email@domain.com"
                  className="h-9 text-xs bg-white dark:bg-zinc-900 w-full"
                />
              </div>
            </div>

            {/* Tỉnh / TP & Quận / Huyện (2 cột bằng nhau) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Tỉnh / TP <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={draft.province}
                  onValueChange={(val) =>
                    setDraft({
                      ...draft,
                      province: val,
                      district: DISTRICT_OPTIONS[val]?.[0] || 'Quận/Huyện khác',
                      ward: WARD_OPTIONS[DISTRICT_OPTIONS[val]?.[0]]?.[0] || 'Phường/Xã khác',
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-900 w-full truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCE_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p} className="text-xs">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Quận / Huyện <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={draft.district}
                  onValueChange={(val) =>
                    setDraft({
                      ...draft,
                      district: val,
                      ward: WARD_OPTIONS[val]?.[0] || 'Phường/Xã khác',
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-900 w-full truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentDistricts.map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phường / Xã (Full width để form cân đối, không thụt thò) */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Phường / Xã <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={draft.ward}
                onValueChange={(val) => setDraft({ ...draft, ward: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-900 w-full truncate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentWards.map((w) => (
                    <SelectItem key={w} value={w} className="text-xs">
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mở rộng ô nhập địa chỉ chi tiết ra */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Địa chỉ chi tiết (số nhà, đường, thôn/ấp...) <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                value={draft.detailAddress}
                onChange={(e) => setDraft({ ...draft, detailAddress: e.target.value })}
                placeholder="Số nhà, tên đường, thôn xóm, khu phố..."
                className="text-xs bg-white dark:bg-zinc-900 min-h-[56px] resize-none w-full leading-relaxed"
              />
            </div>

            {/* Action Buttons: Bỏ đường line trên button, căn chỉnh sạch đẹp */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8.5 text-xs px-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="h-8.5 text-xs px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-2xs cursor-pointer rounded-md"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                <span>Lưu địa chỉ</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
