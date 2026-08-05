'use client'

import React from 'react'
import { Plus, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
            { value: 'fixed_time', label: 'Cố định từ khi phát sinh (Nhập số giờ/ngày)' },
            { value: 'before_next_session', label: 'Trước buổi học tiếp theo (Nhập số giờ/ngày)' },
            { value: 'at_next_session', label: 'Buổi học tiếp theo (Tại giờ học bắt đầu)' },
            { value: 'after_next_session', label: 'Sau buổi học tiếp theo (Nhập số giờ/ngày)' },
            { value: 'end_of_month', label: 'Đến ngày cuối cùng của tháng (23:59)' },
            { value: 'custom_date', label: 'Đến mốc ngày cụ thể trong tháng (VD: Ngày 25)' },
          ]}
          onValueChange={(val: string) => setSlaType(val)}
          className="w-full h-8 text-xs font-bold text-primary"
        />
      </FieldLabel>

      {/* Ô NHẬP GIÁ TRỊ THỜI GIAN VỚI BỘ STEPPER +/- & DROPDOWN ĐƠN VỊ CÂN ĐỐI */}
      {isSlaValueRequired && (
        <FieldLabel label="Giá trị thời gian xử lý">
          <div className="flex items-center gap-2 w-full">
            {/* Bộ Stepper: Nút [-], Ô số ở giữa, Nút [+] */}
            <div className="flex items-center border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring flex-1 h-8">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSlaValueInput(Math.max(1, (slaValueInput || 1) - 1))}
                className="h-8 w-9 rounded-none border-r border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Input
                type="number"
                min={1}
                max={slaUnit === 'days' ? 365 : 720}
                value={slaValueInput}
                onChange={(e) => setSlaValueInput(Math.max(1, Number(e.target.value)))}
                placeholder={slaUnit === 'days' ? '3' : '24'}
                className="h-8 border-0 text-center font-mono font-bold text-xs focus-visible:ring-0 focus-visible:ring-offset-0 px-2 rounded-none min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSlaValueInput((slaValueInput || 0) + 1)}
                className="h-8 w-9 rounded-none border-l border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Dropdown Đơn vị (giờ / ngày) với chiều rộng cố định w-28 để không chèn ép Stepper */}
            <div className="w-28 shrink-0">
              <InlineSelect
                value={slaUnit}
                options={[
                  { value: 'hours', label: 'giờ' },
                  { value: 'days', label: 'ngày' },
                ]}
                onValueChange={(val: string) => setSlaUnit(val as 'hours' | 'days')}
                className="h-8 text-xs font-bold text-primary border border-input bg-card px-2.5 rounded-md w-full"
              />
            </div>
          </div>
        </FieldLabel>
      )}
    </div>
  )
}
