'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/format'
import { PlusCircle } from 'lucide-react'

interface AddPaymentModalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderNo: string
  remainingAmount?: number
  onAddPayment: (amount: number, method: string, note: string) => void
}

export function AddPaymentModalDialog({
  open,
  onOpenChange,
  orderNo,
  remainingAmount = 4200000,
  onAddPayment,
}: AddPaymentModalDialogProps) {
  const [amount, setAmount] = useState<number>(remainingAmount > 0 ? remainingAmount : 4200000)
  const [method, setMethod] = useState<'BANK' | 'COD' | 'CASH'>('BANK')
  const [note, setNote] = useState<string>(`TNX00000${Math.floor(100000 + Math.random() * 900000)}`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount <= 0) {
      return
    }
    onAddPayment(amount, method, note)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
            <PlusCircle className="h-5 w-5" />
            Ghi Nhận Thanh Toán Thêm ({orderNo})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Số tiền thanh toán thêm (VNĐ)
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số tiền..."
              className="h-10 text-sm font-mono font-bold"
            />
            {remainingAmount > 0 && (
              <p className="text-[11px] text-slate-500">
                Gợi ý còn nợ: <strong className="text-orange-600 font-mono">{formatCurrency(remainingAmount)}</strong>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Phương thức thanh toán
            </Label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'BANK' | 'COD' | 'CASH')}
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="BANK">Chuyển khoản Ngân hàng (BANK)</option>
              <option value="COD">Thu tiền tận nơi (COD)</option>
              <option value="CASH">Tiền mặt tại trung tâm (CASH)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Mã phiếu thu / Ghi chú
            </Label>
            <Input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập mã phiếu thu hoặc ghi chú..."
              className="h-10 text-xs font-mono"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Xác Nhận Thanh Toán
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
