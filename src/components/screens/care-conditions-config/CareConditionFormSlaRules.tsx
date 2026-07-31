'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'

interface SlaRulesProps {
  slaType: string
  setSlaType: (val: string) => void
  slaUnit: 'hours' | 'days'
  setSlaUnit: (val: 'hours' | 'days') => void
  slaValueInput: number
  setSlaValueInput: (val: number) => void
  isSlaValueRequired: boolean
}

export const CareConditionFormSlaRules: React.FC<SlaRulesProps> = ({
  slaType,
  setSlaType,
  slaUnit,
  setSlaUnit,
  slaValueInput,
  setSlaValueInput,
  isSlaValueRequired,
}) => {
  return (
    <div className="space-y-3">
      <FieldLabel label="Phương thức tính Thời hạn SLA chăm sóc">
        <InlineSelect
          value={slaType}
          options={[
            { value: 'fixed_time', label: '⏱️ Cố định theo thời gian (Nhập giá trị)' },
            { value: 'before_event_session', label: '🏫 Trước buổi học bị biến động (Nhập giá trị)' },
            { value: 'at_event_session', label: '📅 Ngay giờ bắt đầu buổi học bị biến động' },
            { value: 'after_event_session', label: '⌛ Sau buổi học bị biến động (Nhập giá trị)' },
            { value: 'before_package_expiry', label: '⏳ Trước ngày gói học hết hạn (Nhập giá trị)' },
            { value: 'at_package_expiry', label: '📅 Ngay ngày gói học hết hạn (23:59)' },
            { value: 'after_package_expiry', label: '⌛ Sau ngày gói học hết hạn (Nhập giá trị)' },
            { value: 'before_next_bill', label: '💰 Trước hạn đóng tiền đợt tiếp theo (Nhập giá trị)' },
            { value: 'before_next_session', label: '⏳ Trước buổi học tiếp theo (Nhập giá trị)' },
            { value: 'at_next_session', label: '📅 Buổi học tiếp theo (Tại giờ học bắt đầu)' },
            { value: 'after_next_session', label: '⌛ Sau buổi học tiếp theo (Nhập giá trị)' },
            { value: 'end_of_month', label: '📆 Đến ngày cuối cùng của tháng' },
          ]}
          onValueChange={(val: string) => setSlaType(val)}
          className="w-full h-8 text-xs font-bold text-primary"
        />
      </FieldLabel>

      {/* Ô NHẬP GIÁ TRỊ THỜI GIAN CÓ DROPDOWN CHỌN ĐƠN VỊ TRỰC TIẾP TRONG Ô */}
      {isSlaValueRequired && (
        <FieldLabel label="Giá trị thời gian xử lý">
          <div className="relative flex items-center">
            <Input
              type="number"
              min={1}
              max={slaUnit === 'days' ? 365 : 720}
              value={slaValueInput}
              onChange={(e) => setSlaValueInput(Number(e.target.value))}
              placeholder={slaUnit === 'days' ? '3' : '24'}
              className="h-8 text-xs font-mono font-bold pr-24"
            />
            <div className="absolute right-1 flex items-center">
              <InlineSelect
                value={slaUnit}
                options={[
                  { value: 'hours', label: 'giờ' },
                  { value: 'days', label: 'ngày' },
                ]}
                onValueChange={(val: string) => setSlaUnit(val as 'hours' | 'days')}
                className="h-6 text-xs border-0 bg-muted/60 hover:bg-muted font-bold text-primary rounded px-2"
              />
            </div>
          </div>
        </FieldLabel>
      )}
    </div>
  )
}
