'use client'

import { useState } from 'react'
import {
  Clock,
  ExternalLink,
  Layers,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { formatCurrency } from './paymentReceiptsHelpers'
import { PaymentReceipt, ReceiptOrderItem } from '@/mocks/paymentReceipts'

interface PaymentReceiptOrderPopoverProps {
  receipt: PaymentReceipt
  className?: string
}

function normalizeReceiptItems(receipt: PaymentReceipt): ReceiptOrderItem[] {
  if (receipt.items && receipt.items.length > 0) {
    return receipt.items
  }

  // Check if receipt.orderCode has multiple comma-separated orders
  if (receipt.orderCode && receipt.orderCode.includes(',')) {
    const codes = receipt.orderCode.split(',').map((c) => c.trim()).filter(Boolean)
    if (codes.length > 1) {
      const students = receipt.studentName.split(',').map((s) => s.trim())
      return codes.map((code, idx) => ({
        orderCode: code,
        studentName: students[idx] || students[0] || receipt.studentName,
        packageName: 'Gói Tiếng Anh Chuẩn Quốc Tế',
        packageType: 'Mua mới',
        durationText: '30 buổi',
        bonusText: '--',
        branch: receipt.branch,
        quantity: 1,
        allocatedAmount: Math.round(receipt.amount / codes.length),
        orderTotalAmount: Math.round(receipt.orderTotalAmount / codes.length),
        orderRemainingAmount: Math.round(receipt.orderRemainingAmount / codes.length),
      }))
    }
  }

  const effectiveOrderCode = receipt.orderCode || 'OD832004'

  // Fallback 1 package item based on order code & student
  const defaultPackageName = effectiveOrderCode.includes('9230')
    ? 'Gói SuperKids 12T'
    : effectiveOrderCode.includes('9231')
      ? 'Gói Flyers Intensive'
      : effectiveOrderCode.includes('9234')
        ? 'Gói IELTS Junior 1N'
        : effectiveOrderCode.includes('9232')
          ? 'Gói Movers Bán Trú 1N'
          : effectiveOrderCode.includes('9235')
            ? 'Gói SuperKids 6T'
            : effectiveOrderCode.includes('9236')
              ? '[Gia sư] Tiếng anh 1:4 _ 30 buổi'
              : effectiveOrderCode.includes('9241')
                ? 'Gói Kindy Mẫu Giáo 1N'
                : effectiveOrderCode.includes('9242')
                  ? 'Gói IELTS Special 1N'
                  : 'Gói Tiếng Anh Chuẩn Quốc Tế'

  return [
    {
      orderCode: effectiveOrderCode,
      studentName: receipt.studentName,
      packageName: defaultPackageName,
      packageType: receipt.receiptType === 'tuition_full' ? 'Gia Hạn' : 'Mua mới',
      durationText: '30 buổi',
      bonusText: '--',
      branch: receipt.branch,
      quantity: 1,
      allocatedAmount: receipt.amount,
      orderTotalAmount: receipt.orderTotalAmount,
      orderRemainingAmount: receipt.orderRemainingAmount,
    },
  ]
}

export function PaymentReceiptOrderPopover({
  receipt,
  className,
}: PaymentReceiptOrderPopoverProps) {
  const [open, setOpen] = useState(false)
  const items = normalizeReceiptItems(receipt)
  const hasMultipleOrders = items.length > 1
  const primaryOrderCode = (items[0]?.orderCode || receipt.orderCode || 'OD832004').replace('OD-DRAFT-', 'OD-')
  const extraOrdersCount = items.length - 1

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'min-w-0 text-xs cursor-pointer group/pkg hover:bg-muted/40 p-1 -m-1 rounded-md transition-colors select-none text-left',
            className
          )}
          title={
            hasMultipleOrders
              ? `Nhấp xem ${items.length} đơn hàng trong phiếu thanh toán này`
              : 'Nhấp xem chi tiết đơn hàng & số tiền'
          }
        >
          {/* Dòng 1: Tên đơn hàng / Mã đơn + Icon nhiều đơn & Badge N+ nếu có */}
          <div className="flex items-center gap-1.5 min-w-0">
            {hasMultipleOrders ? (
              <>
                <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate font-mono font-medium text-foreground group-hover/pkg:text-primary group-hover/pkg:underline text-[12px]">
                  {primaryOrderCode}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
                  +{extraOrdersCount}
                </span>
              </>
            ) : (
              <span className="truncate font-mono font-medium text-foreground group-hover/pkg:text-primary group-hover/pkg:underline text-[12px]">
                {primaryOrderCode}
              </span>
            )}
          </div>

          {/* Dòng 2: Số tiền của đơn hàng */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-normal">
            <span>Tổng đơn:</span>
            <span className="font-mono text-foreground">
              {formatCurrency(receipt.orderTotalAmount)}
            </span>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[340px] sm:w-[370px] max-w-[95vw] p-3 text-xs shadow-xl border bg-background z-50 rounded-xl space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title Danh sách đơn hàng */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
          <div className="flex items-center gap-1.5">
            {hasMultipleOrders && <Layers className="h-3.5 w-3.5 text-primary shrink-0" />}
            <span className="font-semibold text-xs text-foreground">
              Danh sách đơn hàng ({items.length})
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Tổng: {formatCurrency(receipt.orderTotalAmount)}
          </span>
        </div>

        {/* Danh sách các đơn hàng và số tiền */}
        <div className="space-y-1.5 py-0.5 max-h-64 overflow-y-auto pr-0.5 divide-y divide-border/40">
          {items.map((item, idx) => {
            const converted = item.convertedSessions || item.durationText || '30 buổi'

            return (
              <div
                key={`${item.orderCode}-${idx}`}
                className={cn('text-xs space-y-1', idx > 0 && 'pt-2')}
              >
                {/* Dòng 1: Tên học viên • Mã đơn (bên trái) --- Tổng tiền đơn (cạnh phải) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="font-medium text-foreground">{item.studentName}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <a
                      href={`/quote/${item.orderCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-primary hover:underline inline-flex items-center gap-0.5 text-xs"
                      title={`Mở đơn ${item.orderCode}`}
                    >
                      <span>{item.orderCode}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  </div>

                  {/* Cạnh phải là tổng tiền */}
                  <div className="font-mono font-semibold text-foreground shrink-0 text-xs">
                    {formatCurrency(item.orderTotalAmount)}
                  </div>
                </div>

                {/* Dòng 2: Thu đợt này (bên trái) --- Quy đổi số buổi (cạnh phải) */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="text-emerald-700 dark:text-emerald-400 font-mono font-medium">
                    Thu đợt này: +{formatCurrency(item.allocatedAmount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    <span>Quy đổi: {converted}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
