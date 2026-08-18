'use client'

import React, { useState } from 'react'
import {
  ArrowRightLeft,
  Banknote,
  CircleDollarSign,
  ExternalLink,
  Receipt,
  Truck,
  User,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Order } from '@/mocks/orders'
import type { DetailedOrder } from '../care/student-orders/studentOrdersTypes'
import { ProductConversionDialog } from './ProductConversionDialog'
import { AddPaymentDialog } from './AddPaymentDialog'

interface OrderDetailDialogProps {
  order: Order | DetailedOrder | null
  onOpenChange: (open: boolean) => void
  onCancel?: (order: Order) => void
}

export function OrderDetailDialog({
  order,
  onOpenChange,
  onCancel,
}: OrderDetailDialogProps) {
  const [isConversionOpen, setIsConversionOpen] = useState(false)
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)

  if (!order) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

  // Fallback defaults for rich UI fidelity
  const customerName = (order as any).customerName || order.studentName || 'Nhữ Đình Sơn'
  const customerPhone = (order as any).customerPhone || '0982700818'
  const shippingAddress =
    (order as any).shippingAddress ||
    'thôn An Đồng, xã Thượng Hồng, Phường Đa Phúc, Quận Dương Kinh, Hải Phòng'
  const paymentTag =
    (order as any).paymentMethodTag ||
    (order.status === 'completed' ? 'T5-Đã nhận COD' : 'T3-COD')
  const paymentOption = (order as any).paymentOption || 'MỘT LẦN'

  const receiptNumber = (order as any).receiptNumber || 'TNX00000244278'
  const receiptTime = (order as any).receiptTime || '19:50:40 - 17/03/2026'
  const receiptAmount =
    (order as any).receiptAmount ||
    (order as any).totalPaidAmount ||
    (order as any).paidAmount ||
    order.finalAmount ||
    5350000
  const receiptMethod =
    (order as any).receiptMethod ||
    (order.paymentMethod === 'bank_transfer'
      ? 'BANK'
      : order.paymentMethod === 'cash'
        ? 'COD'
        : 'ONLINE')
  const receiptStatus = (order as any).receiptStatus || 'THÀNH CÔNG'

  const totalAmount = order.totalAmount || order.finalAmount || 5550000
  const discountAmount = order.discountAmount || 0
  const finalAmount = order.finalAmount || totalAmount
  const paidAmount =
    (order as any).totalPaidAmount ??
    (order as any).paidAmount ??
    finalAmount
  const remainingAmount =
    (order as any).remainingAmount ??
    (finalAmount > paidAmount ? finalAmount - paidAmount : 0)

interface OrderDetailItem {
  productId: string
  productName: string
  categoryName: string
  programName: string
  teacherType: string
  packageType: string
  isRenewal: boolean
  isCompleted: boolean
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
  studentName?: string
  voucherCode?: string
  voucherDiscount?: number
  bonusText?: string
}

  const detailedItems = (order as any).detailedItems
  const items: OrderDetailItem[] =
    detailedItems && detailedItems.length > 0
      ? detailedItems.map((di: any) => ({
          productId: di.productId || 'p-1',
          productName: di.productName || 'Khóa học',
          categoryName: 'Sản phẩm gia sư',
          programName: 'Tiếng Anh IELTS',
          teacherType: 'Việt Nam',
          packageType: di.durationText || '1:6 - 48 buổi',
          isRenewal: di.orderType === 'Gia hạn',
          isCompleted: true,
          quantity: di.quantity || 1,
          unitPrice: di.unitPrice || finalAmount,
          discount: 0,
          subtotal: di.subtotal || di.unitPrice || finalAmount,
          studentName: di.studentName || order.studentName,
          voucherCode: 'IELGH24091',
          voucherDiscount: 0,
          bonusText: di.bonusText,
        }))
      : order.items && order.items.length > 0
        ? order.items.map((it: any) => ({
            productId: it.productId,
            productName: it.productName,
            categoryName: it.categoryName || 'Sản phẩm gia sư',
            programName: it.programName || 'Tiếng Anh IELTS',
            teacherType: it.teacherType || 'Việt Nam',
            packageType: it.packageType || '1:6 - 48 buổi',
            isRenewal: it.isRenewal ?? true,
            isCompleted: true,
            quantity: it.quantity || 1,
            unitPrice: it.unitPrice || finalAmount,
            discount: it.discount || 0,
            subtotal: it.subtotal || it.unitPrice || finalAmount,
            studentName: it.studentName || order.studentName,
            voucherCode: it.voucherCode || 'IELGH24091',
            voucherDiscount: it.voucherDiscount || discountAmount,
            bonusText: it.bonusText,
          }))
        : [
            {
              productId: 'p-booster-48',
              productName: '[IE_TUTOR][THCS] Skill booster_1:6_48 buổi',
              categoryName: 'Sản phẩm gia sư',
              programName: 'Tiếng Anh IELTS',
              teacherType: 'Việt Nam',
              packageType: '1:6 - 48 buổi',
              isRenewal: true,
              isCompleted: true,
              quantity: 1,
              unitPrice: totalAmount,
              discount: discountAmount,
              subtotal: finalAmount,
              studentName: order.studentName || 'Nhữ Thị Tường Vy',
              voucherCode: 'IELGH24091',
              voucherDiscount: discountAmount,
              bonusText: undefined,
            },
          ]

  const canConvertProduct =
    (order as any).canConvertProduct ??
    (!(order as any).isExpired &&
      (order as any).remainingSessions !== 0 &&
      !(order as any).paymentMethodTag?.toLowerCase().includes('hết buổi') &&
      !items.some((it: any) => it.isExpired || it.remainingSessions === 0))

  return (
    <>
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-[98vw] sm:max-w-[1440px] h-[90vh] flex flex-col p-0 gap-0 bg-zinc-50 dark:bg-zinc-950 text-foreground border border-border rounded-xl shadow-2xl overflow-hidden"
        >
          {/* ── 1. MODAL TOP HEADER BAR ── */}
          <DialogHeader className="p-3 px-4 pb-2 bg-transparent shrink-0 space-y-1.5 border-b border-border/60">
            {/* Row 1: Header Line with Red $ Icon, Title, Badge & Close Button */}
            <div className="flex items-center justify-between m-0 p-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="h-6.5 w-6.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                  $
                </div>
                <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Thông tin đơn hàng</span>
                  <span className="font-mono text-foreground font-bold">{order.orderNo}</span>
                </DialogTitle>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-2xs',
                    paymentTag.includes('1 phần') || paymentTag.includes('T4')
                      ? 'bg-rose-600 text-white'
                      : 'bg-lime-400 text-zinc-900 dark:bg-lime-500 dark:text-zinc-950'
                  )}
                >
                  {paymentTag}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                title="Đóng modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Row 2: Customer & Shipping Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full pt-0.5">
              {/* Card 1: Khách hàng */}
              <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-lg p-2.5 px-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900 shrink-0">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400 block tracking-normal">
                      Khách hàng
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {customerName} - <span className="font-mono text-muted-foreground">{customerPhone}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-sky-600 hover:text-sky-700 dark:text-sky-400 text-[11px] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem chi tiết thông tin</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              {/* Card 2: Giao Hàng */}
              <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-lg p-2.5 px-3.5 flex items-center gap-2.5 shadow-2xs">
                <div className="h-7 w-7 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900 shrink-0">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400 block tracking-normal">
                    Giao Hàng
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {customerName} - <span className="font-mono text-muted-foreground">{customerPhone}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {shippingAddress}
                  </p>
                </div>
              </div>
            </div>

            <DialogDescription className="sr-only">
              Chi tiết thông tin đơn hàng và lịch sử thanh toán {order.orderNo}
            </DialogDescription>
          </DialogHeader>

          {/* ── 2. MODAL MAIN BODY CONTENT (SCROLLABLE) ── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT COLUMN: SẢN PHẨM MUA (Col 8) */}
              <div className="lg:col-span-8 space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-0.5 min-h-[30px]">
                  <h3 className="font-bold text-sm text-foreground">Sản phẩm mua</h3>
                  {canConvertProduct && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsConversionOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs h-7.5 px-3 rounded-lg gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      <span>CHUYỂN ĐỔI SẢN PHẨM</span>
                    </Button>
                  )}
                </div>

                {/* Product Items Breakdown Boxes with Top Child Header Banner */}
                {items.map((item, idx) => (
                  <div
                    key={item.productId || idx}
                    className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden text-left space-y-0"
                  >
                    {/* ── CHILD GROUP TOP BANNER (Đồng bộ với màn Tạo đơn) ── */}
                    <div className="flex items-center justify-between gap-3 flex-wrap bg-indigo-50 dark:bg-indigo-950/80 p-2.5 px-3.5 border-b border-indigo-200/60 dark:border-indigo-900/60">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="h-6.5 w-6.5 rounded-full bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-medium text-xs shrink-0 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs">
                          <User className="h-3.5 w-3.5" />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                            Sản phẩm dành cho con:
                          </span>
                          <span className="px-3 py-1 bg-white dark:bg-zinc-900 rounded-md border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold text-foreground">
                            {item.studentName || order.studentName || 'Lê Nguyễn Bảo Hân'}
                          </span>
                          <span className="text-xs text-indigo-900/80 dark:text-indigo-200/80 font-normal ml-1 flex items-center gap-1.5 flex-wrap">
                            <span>
                              ( Tài khoản:{' '}
                              <strong className="font-semibold text-indigo-950 dark:text-indigo-100">
                                {customerPhone}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Đơn tạo gần nhất:{' '}
                              <strong className="font-semibold text-indigo-950 dark:text-indigo-100">
                                {(order as any).createdAt
                                  ? new Date((order as any).createdAt).toLocaleDateString('vi-VN')
                                  : '25/07/2026'}
                              </strong>{' '}
                              )
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Body Content */}
                    <div className="p-4 space-y-3">
                      {/* Item Row 1: Header Category + Checkboxes + Status Badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap border-b pb-2.5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-xs text-rose-600 dark:text-rose-400">
                            {item.categoryName || 'Sản phẩm gia sư'}
                          </span>
                          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                            <label className="flex items-center gap-1 cursor-default">
                              <input
                                type="checkbox"
                                disabled
                                checked={!item.isRenewal}
                                className="rounded border-zinc-300"
                              />
                              <span>Mua mới</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-default">
                              <input
                                type="checkbox"
                                disabled
                                checked={Boolean(item.isRenewal ?? true)}
                                className="rounded border-zinc-300"
                              />
                              <span className="font-medium text-foreground">Gia hạn</span>
                            </label>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded border border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-bold">
                          ĐÃ HOÀN TẤT
                        </span>
                      </div>

                      {/* Item Row 2: Sub-info (Chương trình, Giáo viên, Gói, Cơ sở) */}
                      <div className="grid grid-cols-4 gap-3 text-[11.5px] text-muted-foreground">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            CHƯƠNG TRÌNH
                          </div>
                          <div className="font-medium text-foreground text-xs pt-0.5">
                            {item.programName || 'Tiếng Anh IELTS'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            GIÁO VIÊN
                          </div>
                          <div className="font-medium text-foreground text-xs pt-0.5">
                            {item.teacherType || 'Việt Nam'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            GÓI
                          </div>
                          <div className="font-medium text-foreground text-xs pt-0.5">
                            {item.packageType || '1:6 - 48 buổi'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            CƠ SỞ
                          </div>
                          <div className="font-medium text-foreground text-xs pt-0.5">
                            {order.branch || 'RinoEdu Nguyễn Tuân'}
                          </div>
                        </div>
                      </div>

                      {/* Item Row 3: Product Values Table Breakdown */}
                      <div className="grid grid-cols-12 gap-2 text-[11.5px] pt-1.5 border-t">
                        <div className="col-span-4">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            SẢN PHẨM
                          </div>
                          <div className="font-semibold text-foreground text-xs pt-0.5">
                            {item.productName}
                          </div>
                        </div>
                        <div className="col-span-1 text-center">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            SỐ GÓI
                          </div>
                          <div className="font-medium text-foreground text-xs pt-0.5">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            ĐƠN GIÁ
                          </div>
                          <div className="font-mono font-medium text-foreground text-xs pt-0.5">
                            {formatCurrency(item.unitPrice)}
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            KHUYẾN MẠI
                          </div>
                          <div className="font-mono font-medium text-rose-600 dark:text-rose-400 text-xs pt-0.5">
                            {formatCurrency(item.discount || 0)}
                          </div>
                        </div>
                        <div className="col-span-3 text-right">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            THÀNH TIỀN
                          </div>
                          <div className="font-mono font-bold text-foreground text-xs pt-0.5">
                            {formatCurrency(item.subtotal)}
                          </div>
                        </div>
                      </div>

                      {/* Item Row 4: Applied Voucher / Bonus Policy */}
                      <div className="pt-2 flex items-center justify-between gap-2 flex-wrap border-t text-xs">
                        {item.bonusText ? (
                          <div className="flex items-center gap-4 flex-wrap text-xs">
                            <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                              CHÍNH SÁCH ƯU ĐÃI
                            </span>
                            <span className="text-foreground font-medium text-xs">
                              {item.bonusText}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground text-[11px]">
                              KHUYẾN MẠI ÁP DỤNG:
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-mono font-semibold text-[11px]">
                              {item.voucherCode || 'IELGH24091'}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              Giảm giá sản phẩm:{' '}
                              <strong className="font-mono text-foreground">
                                {formatCurrency(item.voucherDiscount || 200000)}
                              </strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN: THÔNG TIN THANH TOÁN (Col 4) */}
              <div className="lg:col-span-4 rounded-xl border overflow-hidden bg-card shadow-2xs text-left">
                {/* Header with Pink Background */}
                <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/40 px-3.5 py-2.5 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5">
                  <span>$</span>
                  <span>Thông tin thanh toán</span>
                </div>

                <div className="p-3.5 space-y-3 text-xs">
                  {/* Total & Discount */}
                  <div className="space-y-1.5 text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>• Tổng giá trị đơn hàng</span>
                      <span className="font-mono font-semibold text-foreground">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Tổng tiền được giảm</span>
                      <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                        {formatCurrency(discountAmount)}
                      </span>
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  {/* Payment Requirements */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">• SỐ TIỀN CẦN THANH TOÁN</span>
                      <span className="font-mono font-semibold text-foreground">
                        {remainingAmount > 0 ? formatCurrency(remainingAmount) : '--'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">• SỐ TIỀN ĐÃ THANH TOÁN</span>
                      <span className="font-mono font-bold text-foreground">
                        {formatCurrency(paidAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Method & Options Select Boxes */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">• Hình thức thanh toán</span>
                      <span className="px-2.5 py-1 rounded-md border bg-muted/30 text-foreground font-medium text-[11px]">
                        {paymentOption}
                      </span>
                    </div>
                    {paymentOption !== 'NHIỀU LẦN' && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">• Phương thức thanh toán</span>
                        <span className="px-2.5 py-1 rounded-md border bg-muted/30 text-foreground font-medium text-[11px]">
                          {receiptMethod}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Deposit Options Checkboxes if Applicable */}
                  {(paymentOption === 'NHIỀU LẦN' || (order as any).hasDepositStudyNow || (order as any).hasDepositPre || paymentTag.toLowerCase().includes('cọc')) && (
                    <div className="flex items-center justify-end gap-3 text-[11px] pt-0.5">
                      <label className="flex items-center gap-1.5 cursor-default text-muted-foreground">
                        <input
                          type="checkbox"
                          disabled
                          checked={Boolean((order as any).hasDepositPre)}
                          className="rounded border-zinc-300 text-blue-600"
                        />
                        <span>Cọc trước tiền</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-default text-foreground font-medium">
                        <input
                          type="checkbox"
                          disabled
                          checked={Boolean((order as any).hasDepositStudyNow ?? true)}
                          className="rounded border-zinc-300 text-blue-600"
                        />
                        <span>Cọc học luôn</span>
                      </label>
                    </div>
                  )}

                  {/* Nút Thanh toán thêm & Hủy phần còn lại (Đặt ở TRÊN lịch sử phiếu thu) */}
                  {remainingAmount > 0 && (
                    <div className="pt-2.5 pb-1 space-y-2">
                      <Button
                        type="button"
                        onClick={() => setIsAddPaymentOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 uppercase shadow-2xs rounded-md cursor-pointer tracking-wider"
                      >
                        <span>THANH TOÁN THÊM</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          toast.info(
                            `Đã xác nhận yêu cầu hủy phần công nợ còn lại (${formatCurrency(remainingAmount)}) cho đơn ${order.orderNo}!`
                          )
                        }}
                        className="w-full bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs h-9 uppercase shadow-2xs rounded-md cursor-pointer tracking-wider"
                      >
                        <span>HỦY PHẦN CÒN LẠI</span>
                      </Button>
                    </div>
                  )}

                  {/* Multiple Transaction Receipts List (Lịch sử các phiếu thu - Gộp 2 dòng) */}
                  <div className="space-y-2 pt-1">
                    {((order as any).receipts && (order as any).receipts.length > 0
                      ? (order as any).receipts
                      : [
                          {
                            id: 'rc-default-1',
                            code: receiptNumber,
                            amount: receiptAmount,
                            method: receiptMethod,
                            timestamp: receiptTime,
                            status: receiptStatus,
                          },
                        ]
                    ).map((rc: any) => {
                      const isSuccess = rc.status?.toUpperCase() === 'THÀNH CÔNG'
                      const isCancelled = rc.status?.toUpperCase() === 'HỦY'

                      return (
                        <div
                          key={rc.id || rc.code}
                          className={cn(
                            'p-2.5 rounded-r-lg border-l-2 space-y-1.5 text-[11px] transition-all',
                            isSuccess
                              ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                              : isCancelled
                                ? 'border-l-rose-500 bg-rose-50/15 dark:bg-rose-950/15 opacity-85'
                                : 'border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/20'
                          )}
                        >
                          {/* Dòng 1: Thời gian + (Phiếu thu) và Mã phiếu thu: Số tiền (VNĐ) */}
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={cn(
                                  'h-2 w-2 rounded-full shrink-0 inline-block',
                                  isSuccess
                                    ? 'bg-emerald-500'
                                    : isCancelled
                                      ? 'bg-rose-500'
                                      : 'bg-amber-500'
                                )}
                              />
                              <span className="font-mono text-[10.5px] text-muted-foreground">
                                {rc.timestamp} (Phiếu thu)
                              </span>
                            </div>
                            <div className="flex items-center gap-1 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                              <span>
                                {rc.code}: {formatCurrency(rc.amount)} (VNĐ)
                              </span>
                              <Receipt className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            </div>
                          </div>

                          {/* Dòng 2: Phương thức thanh toán + Trạng thái thanh toán */}
                          <div className="flex items-center justify-between gap-2 text-muted-foreground text-[10.5px] pt-1 border-t border-border/40">
                            <span>
                              Phương thức: <strong className="text-foreground font-semibold">{rc.method}</strong>
                            </span>
                            <span>
                              Trạng thái:{' '}
                              <span
                                className={cn(
                                  'font-bold uppercase',
                                  isSuccess
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : isCancelled
                                      ? 'text-rose-600 dark:text-rose-400'
                                      : 'text-amber-600 dark:text-amber-400'
                                )}
                              >
                                {rc.status}
                              </span>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 3. PRODUCT CONVERSION SUB-DIALOG ── */}
      <ProductConversionDialog
        order={order}
        open={isConversionOpen}
        onOpenChange={setIsConversionOpen}
      />

      {/* ── 4. ADD PAYMENT POPUP DIALOG ── */}
      <AddPaymentDialog
        order={order}
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
      />
    </>
  )
}
