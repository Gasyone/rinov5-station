'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Check, X, Pencil, Link2, ShoppingBag } from 'lucide-react'

interface StudentRenewalLinkedOrderRowProps {
  orderInfo: {
    orderCode?: string
    packageName?: string
    packageAmount?: string
    paymentTerm?: string
  } | null
  suggestedOrders: Array<{ orderNo: string; packageName: string; amountText: string }>
  onLinkOrder: (code: string) => void
  onUnlinkOrder: () => void
}

export function StudentRenewalLinkedOrderRow({
  orderInfo,
  suggestedOrders,
  onLinkOrder,
  onUnlinkOrder,
}: StudentRenewalLinkedOrderRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [orderCodeInput, setOrderCodeInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setOrderCodeInput(orderInfo?.orderCode || '')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setOrderCodeInput('')
  }

  const handleSubmit = () => {
    const trimmed = orderCodeInput.trim()
    if (!trimmed) return
    onLinkOrder(trimmed)
    setIsEditing(false)
    setOrderCodeInput('')
  }

  return (
    <div className="text-xs select-none py-1">
      {isEditing ? (
        // Ô nhập trực tiếp trên dòng - không mở modal, có thể sửa
        <div className="flex items-center gap-2 p-1.5 rounded-lg border border-sky-300 dark:border-sky-700 bg-sky-50/70 dark:bg-sky-950/40 w-full flex-wrap animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-1.5 shrink-0 font-semibold text-sky-800 dark:text-sky-300">
            <Link2 className="h-3.5 w-3.5" />
            <span>Mã đơn hàng:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
            <input
              ref={inputRef}
              type="text"
              list="renewal-order-suggestions"
              value={orderCodeInput}
              onChange={(e) => setOrderCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit()
                } else if (e.key === 'Escape') {
                  handleCancelEdit()
                }
              }}
              placeholder="Nhập hoặc chọn mã đơn (VD: OD832001)..."
              className="h-7 flex-1 px-2 text-xs rounded-md border border-sky-300 dark:border-sky-700 bg-white dark:bg-zinc-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-3xs"
            />
            <datalist id="renewal-order-suggestions">
              {suggestedOrders.map((ord) => (
                <option key={ord.orderNo} value={ord.orderNo}>
                  {ord.packageName} - {ord.amountText}
                </option>
              ))}
            </datalist>

            <Button
              type="button"
              size="xs"
              disabled={!orderCodeInput.trim()}
              onClick={handleSubmit}
              className="h-7 px-2.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-md cursor-pointer shrink-0 inline-flex items-center gap-1 shadow-3xs"
              title="Lưu liên kết đơn hàng"
            >
              <Check className="h-3 w-3" />
              <span>Lưu</span>
            </Button>

            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground rounded-md cursor-pointer shrink-0"
              title="Hủy thao tác"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : orderInfo?.orderCode ? (
        // Đã liên kết đơn hàng - Hiển thị tên gói, giá trị thanh toán (Tổng thanh toán), có icon sửa trực tiếp trên dòng
        <div className="flex items-center justify-between gap-2 text-xs py-0.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 text-xs">
            <span className="font-semibold text-muted-foreground text-xs shrink-0 flex items-center gap-1">
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Đơn hàng liên kết:</span>
            </span>

            <a
              href={`/quote/${orderInfo.orderCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
              title="Xem chi tiết đơn hàng báo giá"
            >
              {orderInfo.orderCode}
            </a>

            <span className="text-muted-foreground">•</span>

            <span
              className="font-medium text-foreground truncate max-w-[220px]"
              title={orderInfo.packageName}
            >
              {orderInfo.packageName}
            </span>

            {orderInfo.packageAmount && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  TT: {orderInfo.packageAmount}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {/* Icon sửa mã đơn trực tiếp trên dòng */}
            <button
              type="button"
              onClick={handleStartEdit}
              className="p-1 text-muted-foreground hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded transition-colors cursor-pointer"
              title="Sửa mã đơn hàng trực tiếp trên dòng"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* Icon hủy liên kết */}
            <button
              type="button"
              onClick={onUnlinkOrder}
              className="p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors cursor-pointer"
              title="Hủy liên kết đơn hàng này"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Ban đầu đơn hàng trống - Có icon thêm đơn hàng để nhập mã đơn hàng liên kết trực tiếp trên dòng
        <div className="flex items-center justify-between gap-2 text-xs py-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-muted-foreground text-xs shrink-0 flex items-center gap-1">
              <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Đơn hàng liên kết:</span>
            </span>
            <span className="text-xs text-muted-foreground/80 italic">
              Chưa có đơn hàng
            </span>
          </div>

          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 px-2 py-1 rounded-md border border-dashed border-sky-300 dark:border-sky-700 transition-colors cursor-pointer shrink-0 shadow-3xs"
            title="Nhập mã đơn hàng trực tiếp trên dòng (không mở modal)"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm đơn hàng</span>
          </button>
        </div>
      )}
    </div>
  )
}
