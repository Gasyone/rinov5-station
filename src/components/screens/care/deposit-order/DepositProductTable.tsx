'use client'

import React from 'react'
import { Plus, Trash2, RotateCcw, User, Tag, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/format'
import { CustomSelect } from '../draft-order/CustomSelect'
import type { DepositProductItem } from './depositOrderTypes'

interface DepositProductTableProps {
  products: DepositProductItem[]
  onUpdateProduct: (id: string, updates: Partial<DepositProductItem>) => void
  onAddProduct: () => void
  onRemoveProduct: (id: string) => void
  studentName: string
  customerPhone?: string
}

const PROGRAM_OPTIONS = [
  { value: 'Tiếng Anh IELTS', label: 'Tiếng Anh IELTS' },
  { value: 'Tiếng Anh Cambridge', label: 'Tiếng Anh Cambridge' },
  { value: 'Chương trình Toán tư duy', label: 'Chương trình Toán tư duy' },
  { value: 'Chương trình Station', label: 'Chương trình Station' },
  { value: 'Ngữ Văn', label: 'Ngữ Văn' },
]

const TEACHER_OPTIONS = [
  { value: 'Việt Nam', label: 'Việt Nam' },
  { value: 'Bản ngữ', label: 'Bản ngữ' },
  { value: 'Phil', label: 'Phil' },
]

const PACKAGE_OPTIONS = [
  { value: '1:6 : 72 buổi', label: '1:6 : 72 buổi' },
  { value: '1:6 : 48 buổi', label: '1:6 : 48 buổi' },
  { value: '1:4 _ 30 buổi', label: '1:4 _ 30 buổi' },
  { value: '1:10 - 24 buổi', label: '1:10 - 24 buổi' },
]

const CENTER_OPTIONS = [
  { value: 'RinoEdu Nguyễn Tuân', label: 'RinoEdu Nguyễn Tuân' },
  { value: 'RinoEdu Bắc Giang', label: 'RinoEdu Bắc Giang' },
  { value: 'Rino Linh Đàm', label: 'Rino Linh Đàm' },
  { value: 'Rino An Khánh', label: 'Rino An Khánh' },
]

const PRODUCT_CATALOG: Record<string, { id: string; name: string; price: number; program: string; teacher: string; packageType: string }[]> = {
  'Tiếng Anh IELTS': [
    { id: 'p-iel-72', name: '[IE_TUTOR][THCS] Skill Plus_1:6_72 buổi', price: 6800000, program: 'Tiếng Anh IELTS', teacher: 'Việt Nam', packageType: '1:6 : 72 buổi' },
    { id: 'p-iel-48', name: '[IE_TUTOR][THCS] Skill booster_1:6_48 buổi', price: 5550000, program: 'Tiếng Anh IELTS', teacher: 'Việt Nam', packageType: '1:6 : 48 buổi' },
  ],
  'Tiếng Anh Cambridge': [
    { id: 'p-cam-30', name: '[Gia sư] Tiếng anh 1:4 _ 30 buổi _ GV VN', price: 2990000, program: 'Tiếng Anh Cambridge', teacher: 'Việt Nam', packageType: '1:4 _ 30 buổi' },
    { id: 'p-cam-96', name: '[Gia sư] Tiếng anh 1:4 _ 96 buổi _ GV VN', price: 7980000, program: 'Tiếng Anh Cambridge', teacher: 'Việt Nam', packageType: '1:6 : 72 buổi' },
  ],
  'Chương trình Toán tư duy': [
    { id: 'p-math-48', name: '[Gia sư][TH] Toán Tư Duy 1:6 Einstein (48 buổi)', price: 5800000, program: 'Chương trình Toán tư duy', teacher: 'Việt Nam', packageType: '1:6 : 48 buổi' },
    { id: 'p-math-96', name: '[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn)', price: 10700000, program: 'Chương trình Toán tư duy', teacher: 'Việt Nam', packageType: '1:6 : 72 buổi' },
  ],
  'Chương trình Station': [
    { id: 'p-st-48', name: '[STATION] Tiếng Anh Cambridge Primary_48 buổi', price: 5350000, program: 'Chương trình Station', teacher: 'Việt Nam', packageType: '1:6 : 48 buổi' },
  ],
}

export function DepositProductTable({
  products,
  onUpdateProduct,
  onAddProduct,
  onRemoveProduct,
  studentName,
  customerPhone = '0983055652',
}: DepositProductTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-xl shadow-2xs overflow-visible text-left">
      {/* ── CHILD GROUP TOP BANNER (Đồng bộ chuẩn 100% với màn Tạo đơn hàng) ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-indigo-50 dark:bg-indigo-950/80 p-2.5 px-3.5 border-b border-indigo-200/60 dark:border-indigo-900/60 rounded-t-xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-6.5 w-6.5 rounded-full bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-medium text-xs shrink-0 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs">
            <User className="h-3.5 w-3.5" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
              Sản phẩm dành cho con:
            </span>
            <span className="px-3 py-1 bg-white dark:bg-zinc-900 rounded-md border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold text-foreground">
              {studentName || 'Trương ngọc ánh'}
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
                  14/08/2026
                </strong>{' '}
                )
              </span>
            </span>
          </div>
        </div>

        {/* Nút Thêm sản phẩm */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddProduct}
          className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 hover:bg-indigo-50/50 font-medium text-xs px-3 h-8 rounded-md shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1 text-indigo-600 dark:text-indigo-400" />
          <span>Thêm sản phẩm</span>
        </Button>
      </div>

      {/* ── PRODUCT ITEMS (Chuẩn 100% theo DraftOrderCardItem) ── */}
      <div className="divide-y divide-border/60">
        {products.map((item, idx) => {
          const catalogList = PRODUCT_CATALOG[item.program] || PRODUCT_CATALOG['Tiếng Anh IELTS']
          const currentCatalog = catalogList.find((p) => p.id === item.productId) || catalogList[0]

          return (
            <div key={item.id || idx} className="p-3.5 px-4 space-y-3">
              {/* ── HEADER ROW: SẢN PHẨM GIA SƯ + CHECKBOXES + RESET/DELETE ── */}
              <div className="flex items-center justify-between gap-3 flex-wrap bg-indigo-50/70 dark:bg-indigo-950/40 p-2 px-3 rounded-lg">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-normal">
                    SẢN PHẨM GIA SƯ
                  </span>

                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                      <Checkbox
                        checked={item.orderType === 'Mua mới'}
                        onCheckedChange={() => onUpdateProduct(item.id, { orderType: 'Mua mới' })}
                      />
                      <span className={item.orderType === 'Mua mới' ? 'font-semibold text-indigo-700 dark:text-indigo-300' : ''}>
                        Mua mới
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                      <Checkbox
                        checked={item.orderType === 'Gia hạn'}
                        onCheckedChange={() => onUpdateProduct(item.id, { orderType: 'Gia hạn' })}
                      />
                      <span className={item.orderType === 'Gia hạn' ? 'font-semibold text-indigo-700 dark:text-indigo-300' : ''}>
                        Gia hạn
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const def = PRODUCT_CATALOG['Tiếng Anh IELTS'][0]
                      onUpdateProduct(item.id, {
                        program: def.program,
                        teacherType: def.teacher as any,
                        packageType: def.packageType,
                        productId: def.id,
                        productName: def.name,
                        unitPrice: def.price,
                        quantity: 1,
                        subtotal: def.price,
                      })
                    }}
                    className="p-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded transition-colors cursor-pointer"
                    title="Làm mới sản phẩm"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(item.id)}
                      className="p-1 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* ── ROW 1: CHƯƠNG TRÌNH | GIÁO VIÊN | GÓI | CƠ SỞ ── */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Chương trình
                  </Label>
                  <CustomSelect
                    value={item.program}
                    onChange={(val) => {
                      const matchedList = PRODUCT_CATALOG[val] || PRODUCT_CATALOG['Tiếng Anh IELTS']
                      const firstItem = matchedList[0]
                      onUpdateProduct(item.id, {
                        program: val,
                        productId: firstItem.id,
                        productName: firstItem.name,
                        unitPrice: firstItem.price,
                        teacherType: firstItem.teacher as any,
                        packageType: firstItem.packageType,
                        subtotal: firstItem.price * item.quantity,
                      })
                    }}
                    options={PROGRAM_OPTIONS}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Giáo viên
                  </Label>
                  <CustomSelect
                    value={item.teacherType}
                    onChange={(val) => onUpdateProduct(item.id, { teacherType: val as any })}
                    options={TEACHER_OPTIONS}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Gói
                  </Label>
                  <CustomSelect
                    value={item.packageType}
                    onChange={(val) => onUpdateProduct(item.id, { packageType: val })}
                    options={PACKAGE_OPTIONS}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Cơ sở
                  </Label>
                  <CustomSelect
                    value="RinoEdu Bắc Giang"
                    onChange={() => {}}
                    options={CENTER_OPTIONS}
                  />
                </div>
              </div>

              {/* ── ROW 2 (CÙNG 1 HÀNG): SẢN PHẨM | SỐ GÓI | ĐƠN GIÁ | KHUYẾN MẠI | THÀNH TIỀN ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-end pt-1">
                {/* Sản phẩm (Col 4) */}
                <div className="lg:col-span-4 space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Sản phẩm
                  </Label>
                  <CustomSelect
                    value={item.productId}
                    onChange={(val) => {
                      const matched = catalogList.find((p) => p.id === val)
                      if (matched) {
                        onUpdateProduct(item.id, {
                          productId: matched.id,
                          productName: matched.name,
                          unitPrice: matched.price,
                          subtotal: matched.price * item.quantity,
                        })
                      }
                    }}
                    is3Line={true}
                    options={catalogList.map((p) => ({
                      value: p.id,
                      label: p.name,
                      subtext1: p.program,
                      subtext2: `${p.teacher} - ${p.packageType}`,
                    }))}
                  />
                </div>

                {/* Số gói (Col 2) */}
                <div className="lg:col-span-2 space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Số gói
                  </Label>
                  <div className="flex items-center h-9 border border-input rounded-md overflow-hidden bg-background shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        const newQ = Math.max(1, item.quantity - 1)
                        onUpdateProduct(item.id, {
                          quantity: newQ,
                          subtotal: item.unitPrice * newQ,
                        })
                      }}
                      className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-r border-input transition-colors cursor-pointer shrink-0"
                      title="Giảm số lượng"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const newQ = Math.max(1, parseInt(e.target.value) || 1)
                        onUpdateProduct(item.id, {
                          quantity: newQ,
                          subtotal: item.unitPrice * newQ,
                        })
                      }}
                      className="w-full text-center text-xs font-semibold focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newQ = item.quantity + 1
                        onUpdateProduct(item.id, {
                          quantity: newQ,
                          subtotal: item.unitPrice * newQ,
                        })
                      }}
                      className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-l border-input transition-colors cursor-pointer shrink-0"
                      title="Tăng số lượng"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Đơn giá (Col 2) */}
                <div className="lg:col-span-2 space-y-1 text-right">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Đơn giá
                  </Label>
                  <div className="h-9 flex items-center justify-end text-xs font-semibold text-foreground">
                    {formatCurrency(item.unitPrice)}
                  </div>
                </div>

                {/* Khuyến mại (Col 2) */}
                <div className="lg:col-span-2 space-y-1 text-right">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Khuyến mại
                  </Label>
                  <div className="h-9 flex items-center justify-end text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    0 đ
                  </div>
                </div>

                {/* Thành tiền (Col 2) */}
                <div className="lg:col-span-2 space-y-1 text-right">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Thành tiền
                  </Label>
                  <div className="h-9 flex items-center justify-end text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              </div>

              {/* ── ROW 3: CHỌN KHUYẾN MẠI ── */}
              <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-sky-600 border-sky-300 dark:text-sky-400 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/40 hover:bg-sky-100 text-xs font-medium rounded-md gap-1.5 h-7 px-3 cursor-pointer shrink-0"
                >
                  <Tag className="h-3.5 w-3.5 text-sky-500" />
                  <span>Chọn khuyến mại</span>
                </Button>
                <span className="text-muted-foreground text-[11px] italic">
                  Chưa chọn khuyến mại
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
