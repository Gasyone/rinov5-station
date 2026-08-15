'use client'

import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/format'
import type { DepositProductItem } from './depositOrderTypes'

interface DepositProductTableProps {
  products: DepositProductItem[]
  onUpdateProduct: (id: string, updates: Partial<DepositProductItem>) => void
  onAddProduct: () => void
  onRemoveProduct: (id: string) => void
  studentName: string
}

const PROGRAM_OPTIONS = [
  'Tiếng Anh IELTS',
  'Tiếng Anh Cambridge',
  'Tiếng Anh Giao tiếp',
  'Toán Tư Duy',
  'Ngữ Văn',
]

const TEACHER_OPTIONS: Array<'Việt Nam' | 'Bản ngữ' | 'Philippines'> = [
  'Việt Nam',
  'Bản ngữ',
  'Philippines',
]

const PACKAGE_OPTIONS = [
  '1:6 : 72 buổi',
  '1:6 : 48 buổi',
  '1:6 : 36 buổi',
  '1:1 : 40 buổi',
  '1:1 : 24 buổi',
]

const PRODUCT_NAME_OPTIONS = [
  { id: 'p-1', name: '[IE_TUTOR][THCS] Skill Plus 1:6 72 buổi', price: 7200000 },
  { id: 'p-2', name: '[IE_TUTOR][THCS] Skill booster_1:6_48 buổi', price: 5550000 },
  { id: 'p-3', name: '[STATION] Tiếng Anh Cambridge Primary_48 buổi', price: 5350000 },
  { id: 'p-4', name: '[Station] Toán tư duy ( 48 buổi )', price: 6800000 },
]

export function DepositProductTable({
  products,
  onUpdateProduct,
  onAddProduct,
  onRemoveProduct,
  studentName,
}: DepositProductTableProps) {
  const totalAmount = products.reduce((acc, p) => acc + p.subtotal, 0)

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
          SẢN PHẨM GIA SƯ
        </span>
      </div>

      {/* Table Container */}
      <div className="border rounded-xl bg-card overflow-x-auto shadow-2xs">
        <table className="w-full text-xs text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="bg-muted/40 border-b text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-2.5 px-3 w-24">Loại đơn</th>
              <th className="py-2.5 px-3 w-36">Chương trình</th>
              <th className="py-2.5 px-3 w-28">Loại GV</th>
              <th className="py-2.5 px-3 w-28">Gói</th>
              <th className="py-2.5 px-3">Chọn sản phẩm</th>
              <th className="py-2.5 px-2 text-center w-16">Số lượng</th>
              <th className="py-2.5 px-3 text-right w-28">Thành tiền</th>
              <th className="py-2.5 px-3 w-32">Tên con</th>
              <th className="py-2.5 px-2 text-center w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 font-sans">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                {/* Loại đơn */}
                <td className="p-2.5">
                  <Select
                    value={item.orderType}
                    onValueChange={(val: any) =>
                      onUpdateProduct(item.id, { orderType: val })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gia hạn" className="text-xs">
                        Gia hạn
                      </SelectItem>
                      <SelectItem value="Mua mới" className="text-xs">
                        Mua mới
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>

                {/* Chương trình */}
                <td className="p-2.5">
                  <Select
                    value={item.program}
                    onValueChange={(val) => onUpdateProduct(item.id, { program: val })}
                  >
                    <SelectTrigger className="h-8 text-xs truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAM_OPTIONS.map((prg) => (
                        <SelectItem key={prg} value={prg} className="text-xs">
                          {prg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Loại giáo viên */}
                <td className="p-2.5">
                  <Select
                    value={item.teacherType}
                    onValueChange={(val: any) =>
                      onUpdateProduct(item.id, { teacherType: val })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEACHER_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Gói */}
                <td className="p-2.5">
                  <Select
                    value={item.packageType}
                    onValueChange={(val) => onUpdateProduct(item.id, { packageType: val })}
                  >
                    <SelectTrigger className="h-8 text-xs truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PACKAGE_OPTIONS.map((pkg) => (
                        <SelectItem key={pkg} value={pkg} className="text-xs">
                          {pkg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Chọn sản phẩm */}
                <td className="p-2.5">
                  <Select
                    value={item.productId}
                    onValueChange={(val) => {
                      const found = PRODUCT_NAME_OPTIONS.find((p) => p.id === val)
                      if (found) {
                        onUpdateProduct(item.id, {
                          productId: found.id,
                          productName: found.name,
                          unitPrice: found.price,
                          subtotal: found.price * item.quantity,
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs truncate font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_NAME_OPTIONS.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id} className="text-xs">
                          <span className="font-medium">{prod.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Số lượng */}
                <td className="p-2.5 text-center">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, Number(e.target.value))
                      onUpdateProduct(item.id, {
                        quantity: qty,
                        subtotal: item.unitPrice * qty,
                      })
                    }}
                    className="h-8 w-14 text-center text-xs font-mono"
                  />
                </td>

                {/* Thành tiền */}
                <td className="p-2.5 text-right font-mono font-semibold text-foreground">
                  {formatCurrency(item.subtotal)}
                </td>

                {/* Tên con */}
                <td className="p-2.5">
                  <Input
                    value={item.studentName || studentName}
                    onChange={(e) => onUpdateProduct(item.id, { studentName: e.target.value })}
                    className="h-8 text-xs"
                  />
                </td>

                {/* Xóa */}
                <td className="p-2.5 text-center">
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(item.id)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Xóa dòng"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Row & Totals */}
      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <Button
          type="button"
          size="sm"
          onClick={onAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 px-3 rounded-lg gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>THÊM SẢN PHẨM</span>
        </Button>

        <div className="text-right space-y-1 text-xs">
          <div className="text-muted-foreground">
            TỔNG:{' '}
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="text-muted-foreground">
            TỔNG GIÁ TRỊ ĐƠN HÀNG:{' '}
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-base">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
