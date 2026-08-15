'use client'

import React, { useState } from 'react'
import {
  Banknote,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  Receipt,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/format'
import type { Order } from '@/mocks/orders'
import type { DetailedOrder } from '../care/student-orders/studentOrdersTypes'

interface AddPaymentDialogProps {
  order: Order | DetailedOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (amount: number, method: string, note?: string) => void
}

export function AddPaymentDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: AddPaymentDialogProps) {
  if (!order) return null

  const totalAmount = order.totalAmount || order.finalAmount || 0
  const finalAmount = order.finalAmount || totalAmount
  const currentPaid = (order as any).totalPaidAmount ?? (order as any).paidAmount ?? 0
  const remaining = Math.max(0, finalAmount - currentPaid)

  const [amount, setAmount] = useState<number>(remaining > 0 ? remaining : 1000000)
  const [method, setMethod] = useState<string>('BANK')
  const [transactionCode, setTransactionCode] = useState<string>(
    `TNX${Math.floor(10000000000 + Math.random() * 90000000000)}`
  )
  const [note, setNote] = useState<string>('Khách hàng thanh toán phần học phí còn lại')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount <= 0) {
      toast.error('Vui lòng nhập số tiền thanh toán hợp lệ!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(
        `Ghi nhận thanh toán thành công ${formatCurrency(amount)} cho đơn ${order.orderNo}!`,
        {
          description: `Mã phiếu thu: ${transactionCode} · Phương thức: ${method}`,
        }
      )
      onOpenChange(false)
      onSuccess?.(amount, method, note)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] sm:max-w-[760px] max-h-[90vh] flex flex-col p-0 gap-0 bg-background text-foreground border border-border rounded-xl shadow-2xl overflow-hidden text-left"
      >
        {/* Header */}
        <DialogHeader className="p-4 bg-emerald-500/10 dark:bg-emerald-950/40 border-b border-emerald-500/20 flex flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
              <Banknote className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Ghi nhận thanh toán thêm
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Đơn hàng: <strong className="font-mono text-foreground">{order.orderNo}</strong> · Học viên:{' '}
                <strong className="text-foreground">{order.studentName}</strong>
              </DialogDescription>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Order Payment Status Overview Card */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl border bg-muted/30">
            <div className="space-y-0.5">
              <span className="text-[10.5px] uppercase font-semibold text-muted-foreground">
                Tổng giá trị đơn
              </span>
              <p className="font-mono font-bold text-foreground text-sm">
                {formatCurrency(finalAmount)}
              </p>
            </div>
            <div className="space-y-0.5 border-l pl-3">
              <span className="text-[10.5px] uppercase font-semibold text-muted-foreground">
                Đã thanh toán
              </span>
              <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {formatCurrency(currentPaid)}
              </p>
            </div>
            <div className="space-y-0.5 border-l pl-3">
              <span className="text-[10.5px] uppercase font-semibold text-muted-foreground">
                Số tiền còn thiếu
              </span>
              <p className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Field 1: Số tiền thanh toán thêm */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>Số tiền thanh toán thêm (VNĐ)</span>
                  <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Nhập số tiền..."
                  className="text-xs h-9 font-mono font-semibold"
                />
              </div>

              {/* Field 2: Phương thức thanh toán */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>Phương thức thanh toán</span>
                  <span className="text-rose-500">*</span>
                </Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder="Chọn phương thức..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK" className="text-xs">
                      Chuyển khoản Ngân hàng (BANK)
                    </SelectItem>
                    <SelectItem value="COD" className="text-xs">
                      Thu tiền tận nơi (COD)
                    </SelectItem>
                    <SelectItem value="CASH" className="text-xs">
                      Tiền mặt tại quầy (CASH)
                    </SelectItem>
                    <SelectItem value="MOMO" className="text-xs">
                      Ví điện tử MoMo
                    </SelectItem>
                    <SelectItem value="POS" className="text-xs">
                      Quẹt thẻ POS / Tín dụng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Field 3: Mã phiếu thu / Mã giao dịch */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>Mã phiếu thu / Giao dịch</span>
                </Label>
                <Input
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  placeholder="Mã phiếu thu..."
                  className="text-xs h-9 font-mono"
                />
              </div>

              {/* Field 4: Ngày giao dịch */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Thời gian ghi nhận
                </Label>
                <Input
                  disabled
                  value={new Date().toLocaleString('vi-VN')}
                  className="text-xs h-9 bg-muted/40"
                />
              </div>
            </div>

            {/* Field 5: Ghi chú */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Ghi chú thanh toán
              </Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Phụ huynh chuyển khoản qua Techcombank..."
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Xác nhận thanh toán'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
