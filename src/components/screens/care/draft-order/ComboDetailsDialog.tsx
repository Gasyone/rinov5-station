'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ComboSubItem } from './draftOrderTypes'

interface ComboDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comboName: string
  subItems?: ComboSubItem[]
}

const DEFAULT_SUB_ITEMS: ComboSubItem[] = [
  {
    productName: '[Gia sư] Tiếng anh 1:4 _ 24 buổi _ GV VN',
    type: 'Gia sư',
    duration: '24 buổi',
    quantity: 1,
    discountPolicy: '--',
  },
  {
    productName: '[Gia sư][TH] Toán Tư Duy 1:6 (24 buổi)',
    type: 'Gia sư',
    duration: '24 buổi',
    quantity: 1,
    discountPolicy: '--',
  },
]

export function ComboDetailsDialog({
  open,
  onOpenChange,
  comboName,
  subItems,
}: ComboDetailsDialogProps) {
  const displayItems = subItems && subItems.length > 0 ? subItems : DEFAULT_SUB_ITEMS
  const displayName = comboName || 'Combo Tiếng anh CAM 1:4 + Toán tư duy ARCHIMEDES 1:6 _ 3 THÁNG (2025)'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[760px] p-0 gap-0 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 pb-3 bg-white dark:bg-zinc-900 border-b border-border/60">
          <DialogTitle className="text-base font-bold text-foreground tracking-tight">
            Thông tin combo
          </DialogTitle>
          <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
            Combo <strong className="text-foreground font-bold">{displayName}</strong> bao gồm{' '}
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{displayItems.length}</strong> sản phẩm
          </p>
        </DialogHeader>

        {/* Table Content (Matches Attached Screenshot) */}
        <div className="p-5 space-y-4">
          <div className="border border-indigo-100 dark:border-indigo-900/60 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-indigo-50/80 dark:bg-indigo-950/60 border-b border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                  <th className="py-2.5 px-3.5 font-bold">Tên sản phẩm</th>
                  <th className="py-2.5 px-3 text-center font-bold w-20">Loại</th>
                  <th className="py-2.5 px-3 text-center font-bold w-28">Thời hạn học</th>
                  <th className="py-2.5 px-3 text-center font-bold w-20">Số lượng</th>
                  <th className="py-2.5 px-3 text-center font-bold w-36">Chính sách ưu đãi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {displayItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-medium text-muted-foreground dark:text-zinc-300">
                      {item.productName}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground">
                      {item.type}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground">
                      {item.duration}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground font-semibold">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground italic">
                      {item.discountPolicy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Right Action Button: ĐÓNG */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase px-7 py-2 rounded-md shadow-sm cursor-pointer transition-all h-9"
            >
              ĐÓNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
