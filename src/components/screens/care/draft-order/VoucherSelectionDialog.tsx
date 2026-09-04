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
import { RotateCcw, X, Percent, Check, AlertTriangle, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { MOCK_VOUCHERS, type VoucherItem } from './voucherData'

export { MOCK_VOUCHERS } from './voucherData'
export type { VoucherItem } from './voucherData'

interface VoucherSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alreadyAppliedVouchers?: VoucherItem[]
  onApplyVouchers?: (selectedVouchers: VoucherItem[]) => void
  isReadOnly?: boolean
}

export function VoucherSelectionDialog({
  open,
  onOpenChange,
  alreadyAppliedVouchers = [],
  onApplyVouchers,
  isReadOnly = false,
}: VoucherSelectionDialogProps) {
  const [searchCode, setSearchCode] = useState('')
  const [selectedVoucherIds, setSelectedVoucherIds] = useState<string[]>(
    alreadyAppliedVouchers.map((v) => v.id)
  )
  const [activeViewingVoucher, setActiveViewingVoucher] = useState<VoucherItem | null>(
    alreadyAppliedVouchers.length > 0 ? alreadyAppliedVouchers[0] : MOCK_VOUCHERS[0] ?? null
  )

  const sourceVouchers = isReadOnly ? alreadyAppliedVouchers : MOCK_VOUCHERS
  const directVouchers = sourceVouchers.filter((v) => v.discountType === 'direct')
  const buyXGetYVouchers = sourceVouchers.filter((v) => v.discountType === 'buy_x_get_y')
  const percentageVouchers = sourceVouchers.filter((v) => v.discountType === 'percentage')

  useEffect(() => {
    if (open) {
      if (isReadOnly) {
        setActiveViewingVoucher(alreadyAppliedVouchers[0] ?? null)
      } else {
        setActiveViewingVoucher(
          alreadyAppliedVouchers.length > 0
            ? alreadyAppliedVouchers[0]
            : MOCK_VOUCHERS[0] ?? null
        )
        setSelectedVoucherIds(alreadyAppliedVouchers.map((v) => v.id))
      }
    }
  }, [open, alreadyAppliedVouchers, isReadOnly])

  const toggleSelectVoucher = (v: VoucherItem) => {
    setActiveViewingVoucher(v)
    if (!isReadOnly) {
      setSelectedVoucherIds((prev) =>
        prev.includes(v.id) ? prev.filter((id) => id !== v.id) : [...prev, v.id]
      )
    }
  }

  const handleTestCode = () => {
    if (!searchCode.trim()) {
      toast.error('Vui lòng nhập mã khuyến mại')
      return
    }
    const found = MOCK_VOUCHERS.find(
      (v) => v.code.toLowerCase() === searchCode.trim().toLowerCase()
    )
    if (found) {
      if (!selectedVoucherIds.includes(found.id)) {
        setSelectedVoucherIds((prev) => [...prev, found.id])
      }
      setActiveViewingVoucher(found)
      toast.success(`Áp dụng thành công mã: ${found.code}`)
    } else {
      toast.error(`Mã khuyến mại "${searchCode}" không khả dụng hoặc đã hết hạn`)
    }
  }

  const handleRefresh = () => {
    toast.success('Tải lại thành công', {
      icon: '✔',
    })
  }

  const handleConfirmApply = () => {
    const selectedObjList = MOCK_VOUCHERS.filter((v) => selectedVoucherIds.includes(v.id))
    onApplyVouchers?.(selectedObjList)
    toast.success(`Đã áp dụng ${selectedObjList.length} khuyến mại vào đơn hàng`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[95vw] sm:max-w-[960px] h-[90vh] max-h-[820px] flex flex-col p-0 gap-0 bg-white dark:bg-zinc-900 border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Compact Header Bar (shrink-0) */}
        <DialogHeader className="shrink-0 p-2.5 px-4 bg-white dark:bg-zinc-900 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm font-bold text-foreground">
            Danh sách khuyến mại
          </DialogTitle>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-1 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-full cursor-pointer transition-colors"
              title="Tải lại danh sách"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body: Locked fixed height frame (flex-1 min-h-0) */}
        <div className="flex-1 min-h-0 p-4 px-5 space-y-3 flex flex-col overflow-hidden">
          {/* Top Search bar + KIỂM TRA button (Chỉ hiển thị khi KHÔNG phải isReadOnly) */}
          {!isReadOnly ? (
            <div className="shrink-0 flex items-center gap-2">
              <Input
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Nhập mã khuyến mại của trung tâm hoặc của khách hàng"
                className="h-10 text-xs bg-muted/20 border-input"
              />
              <Button
                type="button"
                onClick={handleTestCode}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 h-10 uppercase shadow-xs shrink-0 cursor-pointer"
              >
                KIỂM TRA
              </Button>
            </div>
          ) : null}

          {/* 2-Column Content: Independent left & right scrolling panels */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch overflow-hidden">
            {/* ── LEFT 7 COLS: Left panel scroll ── */}
            <div className="md:col-span-7 h-full overflow-y-auto pr-1.5 space-y-4 scrollbar-thin">
              {sourceVouchers.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center p-6 border border-dashed border-border/80 rounded-xl bg-muted/10">
                  <Percent className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-xs font-semibold text-foreground">Không có khuyến mại nào</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[240px]">
                    Sản phẩm này hiện chưa áp dụng chương trình ưu đãi nào.
                  </p>
                </div>
              ) : null}

              {/* GROUP 1: GIẢM GIÁ TRỰC TIẾP */}
              {directVouchers.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">
                    GIẢM GIÁ TRỰC TIẾP
                  </h4>

                  {directVouchers.map((v) => {
                    const isSelected = selectedVoucherIds.includes(v.id)
                    const isActive = activeViewingVoucher?.id === v.id

                    return (
                      <div
                        key={v.id}
                        onClick={() => toggleSelectVoucher(v)}
                        className={cn(
                          'flex items-stretch rounded-xl border transition-all cursor-pointer overflow-hidden bg-card shadow-2xs select-none',
                          isActive
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-border/80 hover:border-border'
                        )}
                      >
                        {/* Left voucher ticket tag (% icon + code) */}
                        <div className="w-[84px] shrink-0 bg-emerald-100 dark:bg-emerald-950/60 flex flex-col items-center justify-center p-2 text-center border-r border-dashed border-emerald-300 dark:border-emerald-800">
                          <Percent className="h-5 w-5 text-emerald-700 dark:text-emerald-400 mb-1 stroke-[2.5]" />
                          <span
                            className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate max-w-full"
                            title={v.code}
                          >
                            {v.code}
                          </span>
                        </div>

                        {/* Right Content */}
                        <div className="flex-1 p-2.5 flex items-center justify-between gap-3 min-w-0 bg-white dark:bg-zinc-900">
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-bold text-foreground truncate" title={v.title}>
                              {v.title}
                            </p>
                            {v.applicableTargetText && (
                              <span className="inline-block text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                                {v.applicableTargetText}
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Hạn dùng: {v.expiryText}
                            </p>
                          </div>

                          {/* Checkbox indicator */}
                          {!isReadOnly ? (
                            <div
                              className={cn(
                                'h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors',
                                isSelected
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-muted-foreground/40 bg-transparent'
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* GROUP 2: MUA X TẶNG Y */}
              {buyXGetYVouchers.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">
                      MUA X TẶNG Y
                    </h4>
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Khuyến mại này không cộng dồn khi mua số lượng lớn gói Gia sư
                    </span>
                  </div>

                  {buyXGetYVouchers.map((v) => {
                    const isSelected = selectedVoucherIds.includes(v.id)
                    const isActive = activeViewingVoucher?.id === v.id

                    return (
                      <div
                        key={v.id}
                        onClick={() => toggleSelectVoucher(v)}
                        className={cn(
                          'flex items-stretch rounded-xl border transition-all cursor-pointer overflow-hidden bg-card shadow-2xs select-none',
                          isActive
                            ? 'border-sky-500 ring-2 ring-sky-500/20'
                            : 'border-border/80 hover:border-border'
                        )}
                      >
                        {/* Left voucher ticket tag (Gift box icon + code) */}
                        <div className="w-[84px] shrink-0 bg-sky-100 dark:bg-sky-950/60 flex flex-col items-center justify-center p-2 text-center border-r border-dashed border-sky-300 dark:border-sky-800">
                          <Package className="h-5 w-5 text-sky-700 dark:text-sky-400 mb-1" />
                          <span
                            className="font-mono text-xs font-bold text-sky-900 dark:text-sky-200 truncate max-w-full"
                            title={v.code}
                          >
                            {v.code}
                          </span>
                        </div>

                        {/* Right Content */}
                        <div className="flex-1 p-2.5 flex items-center justify-between gap-3 min-w-0 bg-white dark:bg-zinc-900">
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-bold text-foreground truncate" title={v.title}>
                              {v.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Hạn dùng: {v.expiryText}
                            </p>
                          </div>

                          {!isReadOnly ? (
                            <div
                              className={cn(
                                'h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors',
                                isSelected
                                  ? 'bg-sky-600 border-sky-600 text-white'
                                  : 'border-muted-foreground/40 bg-transparent'
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* GROUP 3: GIẢM GIÁ THEO % */}
              {percentageVouchers.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">
                      GIẢM GIÁ THEO %
                    </h4>
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Thứ tự chọn khuyến mại có thể ảnh hưởng đến thành tiền sau cùng
                    </span>
                  </div>

                  {percentageVouchers.map((v) => {
                    const isSelected = selectedVoucherIds.includes(v.id)
                    const isActive = activeViewingVoucher?.id === v.id

                    return (
                      <div
                        key={v.id}
                        onClick={() => toggleSelectVoucher(v)}
                        className={cn(
                          'flex items-stretch rounded-xl border transition-all cursor-pointer overflow-hidden bg-card shadow-2xs select-none',
                          isActive
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-border/80 hover:border-border'
                        )}
                      >
                        <div className="w-[84px] shrink-0 bg-emerald-100 dark:bg-emerald-950/60 flex flex-col items-center justify-center p-2 text-center border-r border-dashed border-emerald-300 dark:border-emerald-800">
                          <Percent className="h-5 w-5 text-emerald-700 dark:text-emerald-400 mb-1 stroke-[2.5]" />
                          <span
                            className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-200 truncate max-w-full"
                            title={v.code}
                          >
                            {v.code}
                          </span>
                        </div>

                        <div className="flex-1 p-2.5 flex items-center justify-between gap-3 min-w-0 bg-white dark:bg-zinc-900">
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-bold text-foreground truncate" title={v.title}>
                              {v.title}
                            </p>
                            {v.applicableTargetText && (
                              <span className="inline-block text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                                {v.applicableTargetText}
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Hạn dùng: {v.expiryText}
                            </p>
                          </div>

                          {!isReadOnly ? (
                            <div
                              className={cn(
                                'h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors',
                                isSelected
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-muted-foreground/40 bg-transparent'
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT 5 COLS: Chi tiết khuyến mại preview panel ── */}
            <div className="md:col-span-5 h-full flex flex-col min-h-0">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-tight mb-2 shrink-0">
                CHI TIẾT KHUYẾN MẠI
              </h4>

              {activeViewingVoucher ? (
                <div className="flex-1 min-h-0 border border-sky-400/80 dark:border-sky-600/80 rounded-xl p-3.5 overflow-y-auto bg-sky-50/20 dark:bg-sky-950/10 space-y-3 scrollbar-thin">
                  <div>
                    <span className="text-xs text-muted-foreground">Tên chiến dịch</span>
                    <p className="text-xs font-bold text-foreground leading-snug">
                      {activeViewingVoucher.title}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Mô tả</span>
                    <p className="text-xs text-foreground font-medium">
                      {activeViewingVoucher.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Loại chiến dịch</span>
                    <p className="text-xs text-foreground font-bold">
                      {activeViewingVoucher.campaignType}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Giá trị giảm</span>
                    <p className="text-xs text-foreground font-bold font-mono">
                      {activeViewingVoucher.discountType === 'percentage'
                        ? `${activeViewingVoucher.discountValue} (%)`
                        : activeViewingVoucher.discountType === 'direct'
                        ? formatCurrency(activeViewingVoucher.discountValue)
                        : activeViewingVoucher.giftText || 'Quà tặng kèm'}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Loại hình áp dụng</span>
                    <p className="text-xs text-foreground font-medium">
                      {activeViewingVoucher.applicableCategoryText}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Thời gian áp dụng</span>
                    <p className="text-xs text-foreground font-medium">
                      {activeViewingVoucher.appliedDateText}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-border/60 space-y-1.5">
                    <span className="text-xs font-bold text-foreground">Điều kiện áp dụng</span>
                    <p className="font-normal text-foreground text-xs">
                      Giá trị đơn hàng tối thiểu: {formatCurrency(activeViewingVoucher.minOrderValue)}
                    </p>
                    <p className="font-normal text-foreground text-xs">
                      Loại sản phẩm: Mua mới và Gia hạn
                    </p>
                    <p className="font-normal text-foreground text-xs pt-1">
                      Danh sách sản phẩm áp dụng:
                    </p>
                    <ul className="font-normal text-foreground text-xs space-y-0.5 pl-1">
                      {activeViewingVoucher.applicableProducts.map((p, idx) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border border-border/60 rounded-xl p-8 text-center text-xs italic text-muted-foreground bg-muted/10 flex items-center justify-center">
                  Ấn vào khuyến mại cụ thể để xem thông tin chi tiết
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Modal Footer (Chỉ hiển thị khi KHÔNG phải isReadOnly) */}
        {!isReadOnly ? (
          <div className="p-2.5 px-4 bg-white dark:bg-zinc-900 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              {selectedVoucherIds.length > 0
                ? `Đã chọn ${selectedVoucherIds.length} khuyến mại`
                : 'Chưa chọn khuyến mại'}
            </span>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase px-5 h-8 rounded-md shadow-xs cursor-pointer"
              >
                HỦY
              </Button>
              <Button
                type="button"
                onClick={handleConfirmApply}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-5 h-8 rounded-md shadow-xs cursor-pointer"
              >
                ÁP DỤNG
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
