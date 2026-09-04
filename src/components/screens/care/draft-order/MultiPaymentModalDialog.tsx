'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Info, X } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { DraftOrderItem } from './draftOrderTypes'

export interface ConvertedItemState {
  itemId: string
  productName: string
  childAccount: string
  totalSessions: number
  convertedSessions: number
  unitSessionPrice: number
  amount: number
  hasOneSessionPackage: boolean
}

export interface MultiPaymentData {
  amount: number
  method: 'COD' | 'BANK'
  isConversion: boolean
  convertedItems: ConvertedItemState[]
  totalConvertedAmount: number
}

interface MultiPaymentModalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalAmount: number
  items: DraftOrderItem[]
  studentName?: string
  initialAmount?: number
  initialMethod?: 'COD' | 'BANK'
  showConversionTable?: boolean
  onContinue: (paymentData: MultiPaymentData) => void
}

export function MultiPaymentModalDialog({
  open,
  onOpenChange,
  totalAmount,
  items,
  studentName = 'Vuongtesst002',
  initialAmount,
  initialMethod = 'COD',
  showConversionTable = true,
  onContinue,
}: MultiPaymentModalDialogProps) {
  const [payAmountStr, setPayAmountStr] = useState<string>(() =>
    initialAmount ? String(initialAmount) : ''
  )
  const [payMethod, setPayMethod] = useState<'COD' | 'BANK'>(initialMethod)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize conversion items
  const [conversionItems, setConversionItems] = useState<ConvertedItemState[]>([])

  useEffect(() => {
    if (open) {
      const defaultAmount = initialAmount || (totalAmount > 0 ? Math.round(totalAmount / 2) : 5000000)
      setPayAmountStr(defaultAmount ? String(defaultAmount) : '')
      setPayMethod(initialMethod)
      setErrorMessage(null)

      // Map draft order items to conversion rows
      if (items && items.length > 0) {
        const rows: ConvertedItemState[] = items.map((item, idx) => {
          // Extract session numbers from packageType or defaults
          const sessionMatch = item.packageType?.match(/\d+/)
          const totalSessions = sessionMatch ? parseInt(sessionMatch[0], 10) : 120
          const hasOneSession = item.category === 'gia_su' || item.productName?.toLowerCase().includes('1:1')
          const unitSessionPrice = totalSessions > 0 ? Math.round(item.unitPrice / totalSessions) : 0

          return {
            itemId: item.id || `row-${idx}`,
            productName: item.productName || item.productCode || 'STATION 03',
            childAccount: item.childAccount || studentName,
            totalSessions,
            convertedSessions: 0,
            unitSessionPrice,
            amount: 0,
            hasOneSessionPackage: hasOneSession,
          }
        })
        setConversionItems(rows)
      } else {
        // Fallback default sample row if items array is empty
        setConversionItems([
          {
            itemId: 'default-row-1',
            productName: 'STATION 03',
            childAccount: studentName,
            totalSessions: 120,
            convertedSessions: 0,
            unitSessionPrice: 0,
            amount: 0,
            hasOneSessionPackage: false,
          },
        ])
      }
    }
  }, [open, totalAmount, items, studentName, initialAmount, initialMethod])

  const handleConvertedSessionsChange = (itemId: string, valStr: string) => {
    const sessions = parseInt(valStr, 10) || 0
    setConversionItems((prev) =>
      prev.map((row) => {
        if (row.itemId === itemId) {
          const validSessions = Math.max(0, Math.min(row.totalSessions, sessions))
          const calculatedAmount = validSessions * row.unitSessionPrice
          return {
            ...row,
            convertedSessions: validSessions,
            amount: calculatedAmount,
          }
        }
        return row
      })
    )
  }

  const totalConvertedAmount = conversionItems.reduce((sum, item) => sum + item.amount, 0)

  const handleContinue = () => {
    const num = parseFloat(payAmountStr.replace(/\D/g, ''))
    if (!payAmountStr || isNaN(num) || num <= 0) {
      setErrorMessage('Nhập số tiền thanh toán lần 1 là bắt buộc')
      return
    }
    if (totalAmount > 0 && num > totalAmount) {
      setErrorMessage(`Số tiền thanh toán lần 1 không được vượt quá ${formatCurrency(totalAmount)}`)
      return
    }

    setErrorMessage(null)
    onContinue({
      amount: num,
      method: payMethod,
      isConversion: showConversionTable,
      convertedItems: conversionItems,
      totalConvertedAmount,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] sm:max-w-[900px] p-0 bg-white dark:bg-zinc-950 text-foreground border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="p-4 px-6 pb-3 flex flex-row items-center justify-between border-b border-border/40">
          <DialogTitle className="text-sm font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">
            THANH TOÁN NHIỀU LẦN
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Row 1: Số tiền còn lại & Info Banner */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 shrink-0">
              • SỐ TIỀN CÒN LẠI CẦN THANH TOÁN:{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(totalAmount)} (đ)
              </span>
            </div>

            <div className="flex-1 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200/70 dark:border-sky-900/60 rounded-md p-2 px-3 text-xs flex items-center gap-2">
              <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>
                Hoàn tất thanh toán đơn hàng sẽ tự động mở khóa toàn bộ hạn học, bao gồm hạn học gốc và cả ưu đãi, khuyến mại
              </span>
            </div>
          </div>

          {/* Row 2: Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
            {/* Input Số tiền */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 shrink-0">
                  • SỐ TIỀN THANH TOÁN LẦN 1*:
                </span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={payAmountStr}
                    onChange={(e) => {
                      setPayAmountStr(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    placeholder="Nhập số tiền thanh toán"
                    className="h-8 text-xs font-mono font-medium border-rose-300 focus-visible:ring-rose-400"
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium pl-2">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Select Phương thức thanh toán */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-zinc-200 shrink-0">
                • Phương thức thanh toán
              </span>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as 'COD' | 'BANK')}
                className="h-8 flex-1 px-3 bg-white dark:bg-zinc-900 border border-input rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
              >
                <option value="COD">COD</option>
                <option value="BANK">BANK</option>
              </select>
            </div>
          </div>

          {/* Row 3: Bảng Quy đổi hạn học (Cọc học luôn) */}
          {showConversionTable && (
            <div className="space-y-2 pt-2">
              <div className="border border-border/80 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
                      <th className="p-2.5 px-3">Gói học thử</th>
                      <th className="p-2.5 px-3">Tên con</th>
                      <th className="p-2.5 px-3">Thời hạn</th>
                      <th className="p-2.5 px-3">Thời hạn đã quy đổi</th>
                      <th className="p-2.5 px-3">Nhập thời hạn muốn quy đổi</th>
                      <th className="p-2.5 px-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {conversionItems.map((row) => (
                      <tr key={row.itemId} className="hover:bg-muted/20">
                        <td className="p-2.5 px-3 font-medium text-foreground">
                          <div>{row.productName}</div>
                          {!row.hasOneSessionPackage && (
                            <div className="text-xs text-rose-500 font-normal mt-0.5">
                              Không có gói 1 buổi tương ứng để quy đổi.
                            </div>
                          )}
                        </td>
                        <td className="p-2.5 px-3 text-foreground">{row.childAccount}</td>
                        <td className="p-2.5 px-3 text-foreground">{row.totalSessions} (Buổi)</td>
                        <td className="p-2.5 px-3 text-foreground">{row.convertedSessions} (Buổi)</td>
                        <td className="p-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min={0}
                              max={row.totalSessions}
                              value={row.convertedSessions || 0}
                              onChange={(e) => handleConvertedSessionsChange(row.itemId, e.target.value)}
                              className="h-7 w-20 text-xs font-mono text-center"
                            />
                            <span className="text-muted-foreground">(Buổi)</span>
                          </div>
                        </td>
                        <td className="p-2.5 px-3 text-right font-mono font-medium text-foreground">
                          {formatCurrency(row.amount)} (đ)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary of conversion */}
              <div className="text-right text-xs font-medium text-slate-800 dark:text-zinc-200 pr-2">
                * Tổng tiền quy đổi lần này:{' '}
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totalConvertedAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <Button
              type="button"
              onClick={handleContinue}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold uppercase text-xs px-8 h-9 rounded-md shadow-sm transition-all cursor-pointer"
            >
              TIẾP TỤC
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="bg-[#be123c] hover:bg-[#9f1239] text-white font-bold uppercase text-xs px-8 h-9 rounded-md shadow-sm transition-all cursor-pointer"
            >
              HỦY
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
