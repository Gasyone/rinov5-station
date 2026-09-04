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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Package, MessageSquare, X } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export interface OrderConfirmationRecipient {
  name: string
  phone: string
  countryCode: string
  province: string
  district: string
  ward: string
  address: string
}

export interface OrderConfirmationItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
  childAccount: string
  durationText?: string
}

export interface OrderConfirmationSummary {
  paymentOption: 'MOT_LAN' | 'NHIEU_LAN'
  paymentMethod: 'COD' | 'BANK'
  totalAmount: number
  currentPaidAmount: number
  recipient: OrderConfirmationRecipient
  items: OrderConfirmationItem[]
  subtotalAmount: number
  totalDiscount: number
  finalAmount: number
  promotionalGifts?: string[]
}

interface OrderConfirmationModalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: OrderConfirmationSummary
  onConfirmOrder: (finalData: {
    shippingNote: string
    operationNote: string
    recipient: OrderConfirmationRecipient
  }) => void
}

export function OrderConfirmationModalDialog({
  open,
  onOpenChange,
  summary,
  onConfirmOrder,
}: OrderConfirmationModalDialogProps) {
  const [recipient, setRecipient] = useState<OrderConfirmationRecipient>(summary.recipient)
  const [shippingNote, setShippingNote] = useState<string>('')
  const [operationNote, setOperationNote] = useState<string>('')

  useEffect(() => {
    if (open) {
      setRecipient(summary.recipient)
      setShippingNote('')
      setOperationNote('')
    }
  }, [open, summary])

  const handleCreateOrder = () => {
    onConfirmOrder({
      shippingNote,
      operationNote,
      recipient,
    })
  }

  const items = summary.items && summary.items.length > 0
    ? summary.items
    : [
        {
          id: 'fallback-item',
          productName: 'STATION 03',
          quantity: 1,
          unitPrice: summary.finalAmount || 10000000,
          discount: 0,
          subtotal: summary.finalAmount || 10000000,
          childAccount: recipient.name || 'Vuongtesst002',
          durationText: '--',
        },
      ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[98vw] sm:max-w-[1100px] max-h-[92vh] flex flex-col p-0 bg-white dark:bg-zinc-950 text-foreground border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="p-4 px-6 pb-3 flex flex-row items-center justify-between border-b border-border/40 shrink-0">
          <DialogTitle className="text-sm font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">
            VUI LÒNG XÁC NHẬN THÔNG TIN (CHÚ Ý THỜI HẠN, SẢN PHẨM, GIÁ TIỀN, ...)
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Section 1: Top Box - Payment & Shipping Information */}
          <div className="border border-border/80 rounded-lg p-4 bg-slate-50/50 dark:bg-zinc-900/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (8 cols): Payment Type, Method, Delivery Details */}
              <div className="lg:col-span-8 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground font-medium">• Hình thức thanh toán: </span>
                    <strong className="text-foreground uppercase">
                      {summary.paymentOption === 'NHIEU_LAN' ? 'NHIỀU LẦN' : 'MỘT LẦN'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">• Phương thức thanh toán: </span>
                    <strong className="text-foreground uppercase">{summary.paymentMethod}</strong>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 block mb-2">
                    • Thông tin nhận hàng:
                  </span>

                  <div className="space-y-2">
                    {/* Row 1: Tên người nhận, Mã vùng, SĐT */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-5">
                        <Label className="text-xs text-muted-foreground">Tên người nhận</Label>
                        <Input
                          value={recipient.name}
                          onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                          className="h-7 text-xs"
                          placeholder="Nhập tên người nhận"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">Mã vùng</Label>
                        <select
                          value={recipient.countryCode || '+84'}
                          onChange={(e) => setRecipient({ ...recipient, countryCode: e.target.value })}
                          className="w-full h-7 px-2 bg-white dark:bg-zinc-900 border border-input rounded-md text-xs font-medium"
                        >
                          <option value="+84">Việt Nam (+84)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-4">
                        <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
                        <Input
                          value={recipient.phone}
                          onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                          className="h-7 text-xs font-mono"
                          placeholder="Số điện thoại"
                        />
                      </div>
                    </div>

                    {/* Row 2: Tỉnh/TP, Quận/Huyện, Phường/Xã, Địa chỉ chi tiết */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">Tỉnh / T.P</Label>
                        <select
                          value={recipient.province}
                          onChange={(e) => setRecipient({ ...recipient, province: e.target.value })}
                          className="w-full h-7 px-1.5 bg-white dark:bg-zinc-900 border border-input rounded-md text-xs font-medium"
                        >
                          <option value="TP. Hà Nội">TP. Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Bình Dương">Bình Dương</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">Quận/Huyện</Label>
                        <select
                          value={recipient.district}
                          onChange={(e) => setRecipient({ ...recipient, district: e.target.value })}
                          className="w-full h-7 px-1.5 bg-white dark:bg-zinc-900 border border-input rounded-md text-xs font-medium"
                        >
                          <option value="Quận Hoàng Mai">Quận Hoàng Mai</option>
                          <option value="Quận Thanh Xuân">Quận Thanh Xuân</option>
                          <option value="Quận Cầu Giấy">Quận Cầu Giấy</option>
                          <option value="Quận Hoàn Kiếm">Quận Hoàn Kiếm</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">Phường/Xã</Label>
                        <select
                          value={recipient.ward}
                          onChange={(e) => setRecipient({ ...recipient, ward: e.target.value })}
                          className="w-full h-7 px-1.5 bg-white dark:bg-zinc-900 border border-input rounded-md text-xs font-medium"
                        >
                          <option value="Phường Định Công">Phường Định Công</option>
                          <option value="Phường Tràng Tiền">Phường Tràng Tiền</option>
                          <option value="Phường Trung Hòa">Phường Trung Hòa</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">Địa chỉ chi tiết ( số nhà, đườn...)</Label>
                        <Input
                          value={recipient.address}
                          onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
                          className="h-7 text-xs"
                          placeholder="Số nhà, đường..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Total & Current Paid Summary */}
              <div className="lg:col-span-4 flex flex-col justify-start space-y-2 lg:border-l lg:border-border/60 lg:pl-4">
                <div className="text-xs text-foreground">
                  <span className="text-muted-foreground">• Tổng số tiền cần thanh toán: </span>
                  <strong className="font-mono text-slate-900 dark:text-white">
                    {formatCurrency(summary.finalAmount)} (đ)
                  </strong>
                </div>

                <div className="text-xs text-foreground">
                  <span className="text-muted-foreground">• Số tiền thanh toán lần này: </span>
                  <strong className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatCurrency(summary.currentPaidAmount)} (đ)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Products Table */}
          <div className="border border-border/80 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold text-xs">
                  <th className="p-2.5 px-3 w-10 text-center">#</th>
                  <th className="p-2.5 px-3">TÊN SẢN PHẨM</th>
                  <th className="p-2.5 px-3 text-center">SỐ GÓI</th>
                  <th className="p-2.5 px-3 text-right">ĐƠN GIÁ</th>
                  <th className="p-2.5 px-3 text-right">KHUYẾN MÃI</th>
                  <th className="p-2.5 px-3 text-right">THÀNH TIỀN</th>
                  <th className="p-2.5 px-3">TÀI KHOẢN CON</th>
                  <th className="p-2.5 px-3 text-center">THỜI HẠN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="p-2.5 px-3 text-center text-muted-foreground font-mono">({idx + 1})</td>
                    <td className="p-2.5 px-3 font-semibold text-foreground">{item.productName}</td>
                    <td className="p-2.5 px-3 text-center font-mono">{item.quantity}</td>
                    <td className="p-2.5 px-3 text-right font-mono">{formatCurrency(item.unitPrice)} (đ)</td>
                    <td className="p-2.5 px-3 text-right font-mono text-rose-500">{formatCurrency(item.discount)} (đ)</td>
                    <td className="p-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.subtotal)} (đ)
                    </td>
                    <td className="p-2.5 px-3 text-foreground">{item.childAccount}</td>
                    <td className="p-2.5 px-3 text-center text-muted-foreground">{item.durationText || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Totals */}
            <div className="p-3 bg-muted/20 border-t border-border/40 space-y-1 text-right text-xs pr-6">
              <div className="text-muted-foreground">
                Tổng tiền sản phẩm:{' '}
                <span className="font-mono font-medium text-foreground ml-2">
                  {formatCurrency(summary.subtotalAmount)} (đ)
                </span>
              </div>
              <div className="text-muted-foreground">
                Tổng tiền được giảm:{' '}
                <span className="font-mono font-medium text-rose-500 ml-2">
                  {formatCurrency(summary.totalDiscount)} (đ)
                </span>
              </div>
              <div className="text-slate-900 dark:text-white font-bold">
                Tổng thành tiền:{' '}
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm ml-2">
                  {formatCurrency(summary.finalAmount)} (đ)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Promotional Gifts */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
              <Package className="h-4 w-4 text-sky-500" />
              <span>SẢN PHẨM KHUYẾN MẠI TẶNG KÈM</span>
            </div>
            <div className="text-xs text-muted-foreground italic pl-5">
              {summary.promotionalGifts && summary.promotionalGifts.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 not-italic">
                  {summary.promotionalGifts.map((gift, idx) => (
                    <li key={idx} className="text-foreground">{gift}</li>
                  ))}
                </ul>
              ) : (
                'Đơn hàng không áp dụng khuyến mại tặng sản phẩm'
              )}
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Note cho vận đơn</span>
              </div>
              <Textarea
                value={shippingNote}
                onChange={(e) => setShippingNote(e.target.value)}
                placeholder="Ghi chú cho bộ phận vận đơn..."
                className="h-16 text-xs resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Note cho vận hành</span>
              </div>
              <Textarea
                value={operationNote}
                onChange={(e) => setOperationNote(e.target.value)}
                placeholder="Ghi chú cho bộ phận vận hành..."
                className="h-16 text-xs resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              type="button"
              onClick={handleCreateOrder}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold uppercase text-xs px-10 h-9 rounded-md shadow-sm transition-all cursor-pointer tracking-wide"
            >
              TẠO ĐƠN
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="bg-[#be123c] hover:bg-[#9f1239] text-white font-bold uppercase text-xs px-10 h-9 rounded-md shadow-sm transition-all cursor-pointer tracking-wide"
            >
              HỦY
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
