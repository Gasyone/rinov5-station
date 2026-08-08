import React from 'react'
import { DollarSign, Globe } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'

interface DraftOrderPaymentSummaryProps {
  subtotalAmount: number
  totalDiscount: number
  finalAmount: number
  totalPaidAmount?: number
  paymentOption: 'MOT_LAN' | 'NHIEU_LAN'
  setPaymentOption: (val: 'MOT_LAN' | 'NHIEU_LAN') => void
  paymentMethod: 'COD' | 'BANK'
  setPaymentMethod: (val: 'COD' | 'BANK') => void
  onSubmit: () => void
  onCreateLandingPage?: () => void
  onAddPaymentMore?: () => void
  onCancelRemaining?: () => void
  isEditing?: boolean
  orderNo?: string
}

export function DraftOrderPaymentSummary({
  subtotalAmount,
  totalDiscount,
  finalAmount,
  totalPaidAmount = 4200000,
  paymentOption,
  setPaymentOption,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  onCreateLandingPage,
  onAddPaymentMore,
  onCancelRemaining,
  isEditing,
  orderNo,
}: DraftOrderPaymentSummaryProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-xl overflow-hidden shadow-sm sticky top-0">
      {/* Indigo Banner Title */}
      <div className="bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/60 p-3 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        <h4 className="font-bold text-rose-800 dark:text-rose-300 text-xs uppercase tracking-wide">
          Thông tin thanh toán
        </h4>
      </div>

      <div className="p-3.5 space-y-3 text-xs">
        {/* Financial Line Metrics */}
        <div className="space-y-1.5 pb-2.5 border-b border-border/40">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>• Tổng giá trị đơn hàng</span>
            <span className="font-bold font-mono text-foreground">{formatCurrency(subtotalAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span>• Tổng tiền được giảm</span>
            <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
              {formatCurrency(totalDiscount)}
            </span>
          </div>
        </div>

        {/* Số tiền cần thanh toán & Đã thanh toán */}
        <div className="space-y-1 py-0.5 border-b border-border/40 pb-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
              • SỐ TIỀN CẦN THANH TOÁN
            </span>
            <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 text-xs">
              {formatCurrency(finalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
              • SỐ TIỀN ĐÃ THANH TOÁN
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white text-xs">
              {formatCurrency(totalPaidAmount)}
            </span>
          </div>
        </div>

        {/* Payment Options Controls - MỖI THÔNG TIN 1 DÒNG & BẰNG NHAU (w-[130px]) */}
        <div className="space-y-2 pt-1 border-b border-border/40 pb-2.5">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs font-medium text-muted-foreground shrink-0">
              Hình thức thanh toán
            </Label>
            <select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value as 'MOT_LAN' | 'NHIEU_LAN')}
              className="h-8 w-[130px] px-2 bg-background border border-input rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-foreground shrink-0"
            >
              <option value="MOT_LAN">Một lần</option>
              <option value="NHIEU_LAN">Nhiều lần</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs font-medium text-muted-foreground shrink-0">
              Phương thức thanh toán
            </Label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'BANK')}
              className="h-8 w-[130px] px-2 bg-background border border-input rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-foreground shrink-0"
            >
              <option value="COD">COD</option>
              <option value="BANK">Chuyển khoản</option>
            </select>
          </div>
        </div>

        {/* Transaction History Timeline Box (CHỈ HIỆN KHI ĐÃ CÓ THANH TOÁN > 0) */}
        {totalPaidAmount > 0 && (
          <div className="p-2 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 space-y-1 text-[11px] font-mono">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-semibold text-[10.5px]">
              <span>🎯 08:24:51 - 12/06/2026 (Phiếu thu)</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white">
              TNX00000259835: <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaidAmount)}</span>
            </div>
            <div className="text-[10.5px] text-slate-500 flex justify-between font-sans">
              <span>Phương thức: <strong>{paymentMethod === 'BANK' ? 'Chuyển khoản' : 'COD'}</strong></span>
              <span className="text-emerald-600 font-bold">THÀNH CÔNG</span>
            </div>
          </div>
        )}

        {/* Bottom Action Buttons Area: TÁCH RÕ 2 CASE (TẠO ĐƠN MỚI VS ĐÃ THANH TOÁN 1 PHẦN) */}
        <div className="pt-1 space-y-2">
          {totalPaidAmount === 0 ? (
            /* CASE 1: TẠO ĐƠN MỚI (CHƯA CÓ THANH TOÁN) */
            <Button
              type="button"
              onClick={onSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase py-2.5 rounded-md shadow-md transition-all h-10 cursor-pointer tracking-wide"
            >
              TẠO ĐƠN
            </Button>
          ) : totalPaidAmount < finalAmount ? (
            /* CASE 2: ĐÃ THANH TOÁN 1 PHẦN (CÓ THỂ THANH TOÁN THÊM HOẶC HỦY PHẦN CÒN LẠI) */
            <>
              <Button
                type="button"
                onClick={onAddPaymentMore || onSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase py-2.5 rounded-md shadow-md transition-all h-10 cursor-pointer tracking-wide"
              >
                THANH TOÁN THÊM
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={onCancelRemaining || onSubmit}
                className="w-full bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs uppercase py-2.5 rounded-md shadow-sm transition-all h-9 cursor-pointer tracking-wide"
              >
                HỦY PHẦN CÒN LẠI
              </Button>
            </>
          ) : (
            /* CASE 3: ĐÃ THANH TOÁN 100% */
            <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-center font-bold text-xs uppercase tracking-wide">
              ✓ Đã Thanh Toán 100%
            </div>
          )}

          {onCreateLandingPage && (
            <Button
              type="button"
              variant="outline"
              onClick={onCreateLandingPage}
              className="w-full border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 font-bold text-xs h-9 rounded-md transition-all cursor-pointer shadow-2xs mt-1"
              title="Tạo & Mở trang Landing Page Báo Giá"
            >
              <Globe className="h-3.5 w-3.5 mr-1 text-sky-600 dark:text-sky-400" />
              Tạo Page
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
