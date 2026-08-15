'use client'

import React, { useState } from 'react'
import {
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sparkles,
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

interface ProductConversionDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const AVAILABLE_TARGET_PRODUCTS = [
  {
    id: 'tp-1',
    name: '[STATION] Tiếng Anh Cambridge Primary Starters_48 buổi',
    price: 5350000,
    sessions: 48,
  },
  {
    id: 'tp-2',
    name: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
    price: 7550000,
    sessions: 144,
  },
  {
    id: 'tp-3',
    name: '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi',
    price: 8400000,
    sessions: 40,
  },
  {
    id: 'tp-4',
    name: '[Station] Toán tư duy ( 48 buổi )',
    price: 6800000,
    sessions: 48,
  },
]

export function ProductConversionDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: ProductConversionDialogProps) {
  const [selectedTargetProduct, setSelectedTargetProduct] = useState<string>(
    AVAILABLE_TARGET_PRODUCTS[0].id
  )
  const [conversionType, setConversionType] = useState<'equal' | 'upgrade'>('equal')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!order) return null

  const currentItem = order.items?.[0]
  const currentProductName =
    currentItem?.productName || '[IE_TUTOR][THCS] Skill booster_1:6_48 buổi'
  const currentAmount = order.finalAmount || 5350000

  const targetProduct =
    AVAILABLE_TARGET_PRODUCTS.find((p) => p.id === selectedTargetProduct) ||
    AVAILABLE_TARGET_PRODUCTS[0]

  const differenceAmount = Math.max(0, targetProduct.price - currentAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const ticketCode = `CP${Math.floor(10000 + Math.random() * 90000)}`
      toast.success(`Tạo yêu cầu chuyển đổi sản phẩm thành công!`, {
        description: `Mã ticket: ${ticketCode} · Chuyển sang ${targetProduct.name}`,
      })
      onOpenChange(false)
      onSuccess?.()
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl gap-0 shadow-2xl">
        {/* Header with Orange/Amber Accent */}
        <DialogHeader className="bg-amber-500/10 dark:bg-amber-950/40 p-4 border-b border-amber-500/20 text-left">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-2xs">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Chuyển đổi sản phẩm
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Đơn hàng gốc: <strong className="font-mono text-foreground">{order.orderNo}</strong> ({formatCurrency(currentAmount)})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-left">
          {/* Section 1: Gói hiện tại */}
          <div className="p-3 rounded-xl bg-muted/40 border space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-rose-500" />
              Sản phẩm hiện tại trong đơn
            </span>
            <p className="font-semibold text-foreground text-sm leading-snug">
              {currentProductName}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Học viên: <strong className="text-foreground">{order.studentName}</strong></span>
              <span>Giá trị đơn: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(currentAmount)}</strong></span>
            </div>
          </div>

          {/* Section 2: Chọn sản phẩm đích cần đổi sang */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <span>Sản phẩm mới chuyển sang:</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={selectedTargetProduct}
              onValueChange={setSelectedTargetProduct}
            >
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue placeholder="Chọn sản phẩm đích..." />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TARGET_PRODUCTS.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id} className="text-xs">
                    <span className="font-medium">{prod.name}</span> —{' '}
                    <span className="font-mono text-muted-foreground">
                      {formatCurrency(prod.price)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section 3: Quy đổi & Chênh lệch */}
          <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Loại chuyển đổi:</span>
              <span className="font-medium text-foreground">
                {differenceAmount === 0 ? 'Chuyển đổi ngang tiền' : 'Nâng cấp gói (Thanh toán thêm)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Số tiền cọc/phí được quy đổi:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(currentAmount)}
              </span>
            </div>
            {differenceAmount > 0 && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                <span className="font-semibold text-rose-700 dark:text-rose-400">
                  Số tiền cần nộp thêm:
                </span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400 text-sm">
                  {formatCurrency(differenceAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Ghi chú */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Lý do / Ghi chú chuyển đổi
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Phụ huynh có nhu cầu đổi từ IELTS sang Cambridge..."
              className="text-xs h-9"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Đóng
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Đang xử lý...' : 'Xác nhận chuyển đổi'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
