'use client'

import React from 'react'
import { DollarSign } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'

interface DraftOrderPaymentSummaryProps {
  subtotalAmount: number
  totalDiscount: number
  finalAmount: number
  paymentOption: 'MOT_LAN' | 'NHIEU_LAN'
  setPaymentOption: (val: 'MOT_LAN' | 'NHIEU_LAN') => void
  paymentMethod: 'COD' | 'BANK'
  setPaymentMethod: (val: 'COD' | 'BANK') => void
  onSubmit: () => void
}

export function DraftOrderPaymentSummary({
  subtotalAmount,
  totalDiscount,
  finalAmount,
  paymentOption,
  setPaymentOption,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
}: DraftOrderPaymentSummaryProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-xl overflow-hidden shadow-sm sticky top-0">
      {/* Indigo Banner Title */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/70 border-b border-indigo-100 dark:border-indigo-900/80 p-3.5 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">
          Thông tin thanh toán
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Financial Metrics Lines */}
        <div className="space-y-2 pb-3 border-b border-border/40">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>• Tổng giá trị đơn hàng</span>
            <span className="font-bold text-foreground">
              {formatCurrency(subtotalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>• Tổng tiền được giảm</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalDiscount)}
            </span>
          </div>
        </div>

        {/* Số tiền cần thanh toán */}
        <div className="flex justify-between items-center py-1">
          <span className="font-medium text-muted-foreground text-xs">
            • Số tiền cần thanh toán
          </span>
          <span className="font-bold text-indigo-700 dark:text-indigo-300 text-sm">
            {formatCurrency(finalAmount)}
          </span>
        </div>

        {/* Dropdown: Hình thức thanh toán */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-medium text-muted-foreground">
            • Hình thức thanh toán
          </Label>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value as 'MOT_LAN' | 'NHIEU_LAN')}
            className="w-full h-9 rounded-md border border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="MOT_LAN">Một lần</option>
            <option value="NHIEU_LAN">Nhiều lần</option>
          </select>
        </div>

        {/* Dropdown: Phương thức thanh toán */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            • Phương thức thanh toán
          </Label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'BANK')}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="COD">COD</option>
            <option value="BANK">Chuyển khoản (BANK)</option>
          </select>
        </div>

        {/* Bottom Action Button: TẠO ĐƠN */}
        <div className="pt-3">
          <Button
            type="button"
            onClick={onSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase py-3 rounded-md shadow-md transition-all h-11 cursor-pointer"
          >
            TẠO ĐƠN HÀNG NHÁP
          </Button>
        </div>
      </div>
    </div>
  )
}
