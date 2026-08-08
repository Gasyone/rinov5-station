'use client'

import React, { useState } from 'react'
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
import { toast } from 'sonner'
import { MOCK_VOUCHERS, type VoucherItem } from './voucherData'

export { MOCK_VOUCHERS } from './voucherData'
export type { VoucherItem } from './voucherData'

interface VoucherSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alreadyAppliedVouchers?: VoucherItem[]
  onApplyVouchers: (selectedVouchers: VoucherItem[]) => void
}

export function VoucherSelectionDialog({
  open,
  onOpenChange,
  alreadyAppliedVouchers = [],
  onApplyVouchers,
}: VoucherSelectionDialogProps) {
  const [searchCode, setSearchCode] = useState('')
  const [selectedVoucherIds, setSelectedVoucherIds] = useState<string[]>(
    alreadyAppliedVouchers.map((v) => v.id)
  )
  const [activeViewingVoucher, setActiveViewingVoucher] = useState<VoucherItem | null>(
    alreadyAppliedVouchers.length > 0 ? alreadyAppliedVouchers[0] : null
  )

  const directVouchers = MOCK_VOUCHERS.filter((v) => v.discountType === 'direct')
  const buyXGetYVouchers = MOCK_VOUCHERS.filter((v) => v.discountType === 'buy_x_get_y')
  const percentageVouchers = MOCK_VOUCHERS.filter((v) => v.discountType === 'percentage')

  const toggleSelectVoucher = (v: VoucherItem) => {
    setActiveViewingVoucher(v)
    setSelectedVoucherIds((prev) =>
      prev.includes(v.id) ? prev.filter((id) => id !== v.id) : [...prev, v.id]
    )
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
    onApplyVouchers(selectedObjList)
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
          {/* Top Search bar + KIỂM TRA button (shrink-0) */}
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

          {/* 2-Column Content: Independent left & right scrolling panels */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch overflow-hidden">
            {/* ── LEFT 7 COLS: Left panel scroll ── */}
            <div className="md:col-span-7 h-full overflow-y-auto pr-1.5 space-y-4 scrollbar-thin">
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
                        className={`border rounded-xl p-0 flex items-stretch cursor-pointer transition-all overflow-hidden ${
                          isSelected
                            ? 'border-sky-500 dark:border-sky-400 bg-sky-50/20 dark:bg-sky-950/20 ring-1 ring-sky-400/50'
                            : isActive
                            ? 'border-sky-300 dark:border-sky-700'
                            : 'border-border/80 hover:border-border'
                        }`}
                      >
                        {/* UNIFORM FIXED BADGE BOX WIDTH: w-[100px] shrink-0 */}
                        <div className="w-[100px] shrink-0 bg-emerald-100 dark:bg-emerald-950/60 border-r border-emerald-200 dark:border-emerald-900 p-2.5 flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-300">
                          <Percent className="h-6 w-6 mb-1" />
                          <span className="text-[9.5px] font-mono font-bold tracking-tighter text-center truncate max-w-full uppercase">
                            {v.code}
                          </span>
                        </div>

                        <div className="p-3 flex-1 flex items-center justify-between gap-2 min-w-0">
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs font-bold text-foreground leading-snug truncate">
                              {v.title}
                            </p>
                            {v.applicableTargetText && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80">
                                {v.applicableTargetText}
                              </span>
                            )}
                            <p className="text-[10.5px] text-muted-foreground truncate">
                              Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Hạn dùng: {v.expiryText}
                            </p>
                          </div>

                          <div className="pl-1 shrink-0">
                            {isSelected ? (
                              <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/40 bg-background" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* GROUP 2: MUA X TẶNG Y */}
              {buyXGetYVouchers.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">
                      MUA X TẶNG Y
                    </h4>
                    <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
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
                        className={`border rounded-xl p-0 flex items-stretch cursor-pointer transition-all overflow-hidden ${
                          isSelected
                            ? 'border-sky-500 dark:border-sky-400 bg-sky-50/20 dark:bg-sky-950/20 ring-1 ring-sky-400/50'
                            : isActive
                            ? 'border-sky-300 dark:border-sky-700'
                            : 'border-border/80 hover:border-border'
                        }`}
                      >
                        {/* UNIFORM FIXED BADGE BOX WIDTH: w-[100px] shrink-0 */}
                        <div className="w-[100px] shrink-0 bg-sky-100 dark:bg-sky-950/70 border-r border-sky-200 dark:border-sky-900 p-2.5 flex flex-col items-center justify-center text-sky-700 dark:text-sky-300">
                          <Package className="h-6 w-6 mb-1" />
                          <span className="text-[9.5px] font-mono font-bold tracking-tighter text-center truncate max-w-full uppercase">
                            {v.code}
                          </span>
                        </div>

                        <div className="p-3 flex-1 flex items-center justify-between gap-2 min-w-0">
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs font-bold text-foreground leading-snug truncate">
                              {v.title}
                            </p>
                            <p className="text-[10.5px] text-muted-foreground truncate">
                              Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Hạn dùng: {v.expiryText}
                            </p>
                          </div>

                          <div className="pl-1 shrink-0">
                            {isSelected ? (
                              <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/40 bg-background" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* GROUP 3: GIẢM GIÁ THEO % */}
              {percentageVouchers.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">
                      GIẢM GIÁ THEO %
                    </h4>
                    <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
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
                        className={`border rounded-xl p-0 flex items-stretch cursor-pointer transition-all overflow-hidden ${
                          isSelected
                            ? 'border-sky-500 dark:border-sky-400 bg-sky-50/20 dark:bg-sky-950/20 ring-1 ring-sky-400/50'
                            : isActive
                            ? 'border-sky-300 dark:border-sky-700'
                            : 'border-border/80 hover:border-border'
                        }`}
                      >
                        {/* UNIFORM FIXED BADGE BOX WIDTH: w-[100px] shrink-0 */}
                        <div className="w-[100px] shrink-0 bg-emerald-100 dark:bg-emerald-950/60 border-r border-emerald-200 dark:border-emerald-900 p-2.5 flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-300">
                          <Percent className="h-6 w-6 mb-1" />
                          <span className="text-[9.5px] font-mono font-bold tracking-tighter text-center truncate max-w-full uppercase">
                            {v.code}
                          </span>
                        </div>

                        <div className="p-3 flex-1 flex items-center justify-between gap-2 min-w-0">
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs font-bold text-foreground leading-snug truncate">
                              {v.title}
                            </p>
                            {v.applicableTargetText && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80">
                                {v.applicableTargetText}
                              </span>
                            )}
                            <p className="text-[10.5px] text-muted-foreground truncate">
                              Đơn tối thiểu: {formatCurrency(v.minOrderValue)} | Hạn dùng: {v.expiryText}
                            </p>
                          </div>

                          <div className="pl-1 shrink-0">
                            {isSelected ? (
                              <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/40 bg-background" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT 5 COLS: FIXED RIGHT PANEL WITH INTERNAL SCROLL ── */}
            <div className="md:col-span-5 h-full flex flex-col min-h-0 space-y-2">
              <h4 className="shrink-0 text-xs font-bold text-foreground uppercase tracking-tight">
                Chi tiết khuyến mại
              </h4>

              {activeViewingVoucher ? (
                <div className="flex-1 overflow-y-auto border border-sky-300 dark:border-sky-800 bg-sky-50/10 dark:bg-sky-950/20 rounded-xl p-4 space-y-3 text-xs scrollbar-thin pr-2">
                  <div>
                    <span className="font-normal text-muted-foreground text-xs block">Tên chiến dịch</span>
                    <p className="font-normal text-foreground text-xs pt-0.5">{activeViewingVoucher.title}</p>
                  </div>

                  <div>
                    <span className="font-normal text-muted-foreground text-xs block">Mô tả</span>
                    <p className="font-normal text-foreground text-xs pt-0.5">{activeViewingVoucher.description}</p>
                  </div>

                  <div>
                    <span className="font-normal text-muted-foreground text-xs block">Loại chiến dịch</span>
                    <p className="font-normal text-foreground text-xs pt-0.5">{activeViewingVoucher.campaignType}</p>
                  </div>

                  <div>
                    <span className="font-normal text-muted-foreground text-xs block">Giá trị giảm</span>
                    <p className="font-normal text-foreground text-xs pt-0.5">
                      {activeViewingVoucher.discountType === 'direct'
                        ? formatCurrency(activeViewingVoucher.discountValue)
                        : activeViewingVoucher.discountType === 'percentage'
                        ? `${activeViewingVoucher.discountValue} (%)`
                        : activeViewingVoucher.giftText || 'Tặng suất học bổng'}
                    </p>
                  </div>

                  <div>
                    <span className="font-normal text-muted-foreground text-xs block">Loại hình áp dụng</span>
                    <p className="font-normal text-foreground text-xs pt-0.5">{activeViewingVoucher.applicableCategoryText}</p>
                  </div>

                  <div>
                    <span className="font-normal text-muted-foreground text-xs block">Thời gian áp dụng</span>
                    <p className="font-normal text-foreground text-xs pt-0.5">{activeViewingVoucher.appliedDateText}</p>
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-border/40">
                    <span className="font-normal text-muted-foreground text-xs block pb-0.5">Điều kiện áp dụng</span>
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

        {/* Compact Modal Footer */}
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
      </DialogContent>
    </Dialog>
  )
}
