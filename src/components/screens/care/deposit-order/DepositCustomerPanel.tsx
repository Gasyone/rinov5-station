'use client'

import React from 'react'
import { MapPin, Phone, Mail, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  'Bình Dương',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Đồng Nai',
]

const DISTRICT_OPTIONS: Record<string, string[]> = {
  'Bình Dương': ['Thị xã Tân Uyên', 'Thành phố Thủ Dầu Một', 'Thành phố Thuận An', 'Thành phố Dĩ An', 'Bến Cát'],
  'Hà Nội': ['Thanh Xuân', 'Hoàn Kiếm', 'Cầu Giấy', 'Ba Đình', 'Đống Đa', 'Hà Đông'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Thành phố Thủ Đức', 'Bình Thạnh', 'Tân Bình'],
}

const WARD_OPTIONS: Record<string, string[]> = {
  'Thị xã Tân Uyên': ['Phường Khánh Bình', 'Phường Uyên Hưng', 'Phường Tân Phước Khánh', 'Phường Thái Hòa'],
  'Thanh Xuân': ['Phường Thanh Xuân Trung', 'Phường Nhân Chính', 'Phường Khương Mai'],
  'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Đa Kao'],
}

export function DepositCustomerPanel({
  customer,
  onUpdateCustomer,
}: DepositCustomerPanelProps) {
  const currentDistricts = DISTRICT_OPTIONS[customer.province] || [
    'Thị xã Tân Uyên',
    'Quận/Huyện khác',
  ]
  const currentWards = WARD_OPTIONS[customer.district] || [
    'Phường Khánh Bình',
    'Phường/Xã khác',
  ]

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3.5 shadow-2xs text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b">
        <MapPin className="h-4 w-4 text-rose-500" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
          Địa chỉ nhận hàng
        </h4>
      </div>

      <div className="space-y-3 text-xs">
        {/* Tên người nhận */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Tên người nhận
          </Label>
          <Input
            value={customer.recipientName}
            onChange={(e) => onUpdateCustomer({ recipientName: e.target.value })}
            placeholder="Tên người nhận..."
            className="h-8 text-xs font-medium"
          />
        </div>

        {/* Số điện thoại */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Số Điện thoại
          </Label>
          <Input
            value={customer.phone}
            onChange={(e) => onUpdateCustomer({ phone: e.target.value })}
            placeholder="Số điện thoại..."
            className="h-8 text-xs font-mono"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Email
          </Label>
          <Input
            type="email"
            value={customer.email}
            onChange={(e) => onUpdateCustomer({ email: e.target.value })}
            placeholder="Email nhận hóa đơn..."
            className="h-8 text-xs"
          />
        </div>

        {/* Tỉnh / Thành phố & Quận / Huyện */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t">
          <div className="space-y-1">
            <Label className="text-[10.5px] font-semibold text-muted-foreground">
              Tỉnh/TP
            </Label>
            <Select
              value={customer.province}
              onValueChange={(val) =>
                onUpdateCustomer({
                  province: val,
                  district: DISTRICT_OPTIONS[val]?.[0] || 'Quận/Huyện khác',
                })
              }
            >
              <SelectTrigger className="h-8 text-xs truncate">
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
            <Label className="text-[10.5px] font-semibold text-muted-foreground">
              Quận/Huyện
            </Label>
            <Select
              value={customer.district}
              onValueChange={(val) =>
                onUpdateCustomer({
                  district: val,
                  ward: WARD_OPTIONS[val]?.[0] || 'Phường/Xã khác',
                })
              }
            >
              <SelectTrigger className="h-8 text-xs truncate">
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

        {/* Phường / Xã */}
        <div className="space-y-1">
          <Label className="text-[10.5px] font-semibold text-muted-foreground">
            Phường/Xã
          </Label>
          <Select
            value={customer.ward}
            onValueChange={(val) => onUpdateCustomer({ ward: val })}
          >
            <SelectTrigger className="h-8 text-xs truncate">
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

        {/* Địa chỉ chi tiết */}
        <div className="space-y-1">
          <Label className="text-[10.5px] font-semibold text-muted-foreground">
            Địa chỉ chi tiết (số nhà, đường, thôn...)
          </Label>
          <Input
            value={customer.detailAddress}
            onChange={(e) => onUpdateCustomer({ detailAddress: e.target.value })}
            placeholder="Số nhà, tên đường..."
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  )
}
