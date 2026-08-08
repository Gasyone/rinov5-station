'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { RotateCcw, Trash2, Tag, Info, Minus, Plus, User, Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { PRODUCT_CATALOG, type DraftOrderItem } from './draftOrderTypes'
import { ComboDetailsDialog } from './ComboDetailsDialog'
import { VoucherSelectionDialog } from './VoucherSelectionDialog'
import { MOCK_VOUCHERS, type VoucherItem } from './voucherData'
import { CustomSelect } from './CustomSelect'

function ActivationMethodControl({
  value,
  activationDate,
  onChange,
  onDateChange,
}: {
  value: string
  activationDate?: string
  onChange: (val: string) => void
  onDateChange: (date: string) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options = [
    { value: 'KÍCH HOẠT KHI LÊN ĐƠN', label: 'Kích hoạt khi lên đơn' },
    { value: 'HỌC SINH TỰ KÍCH HOẠT', label: 'Học sinh tự kích hoạt' },
    { value: 'HẸN NGÀY KÍCH HOẠT', label: 'Hẹn ngày kích hoạt' },
  ]

  const currentOpt = options.find((o) => o.value === value) || options[0]

  return (
    <div className="flex items-center gap-3 flex-wrap w-full">
      <div className="space-y-1 min-w-[240px] flex-1 max-w-sm">
        <Label className="text-xs font-medium text-muted-foreground">
          Phương thức kích hoạt<span className="text-rose-500 ml-0.5">*</span>
        </Label>

        <div ref={containerRef} className="relative w-full">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-9 px-3 py-1 flex items-center justify-between text-xs transition-all border border-input rounded-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-tight truncate pr-2">
              {currentOpt.value}
            </span>
            <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
              {value && (
                <X
                  className="h-3.5 w-3.5 hover:text-rose-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange('KÍCH HOẠT KHI LÊN ĐƠN')
                  }}
                />
              )}
              {isOpen ? (
                <ChevronUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </div>
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-1 w-full min-w-[240px] bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-xl z-[110] p-1 space-y-0.5">
              {options.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {value === 'HẸN NGÀY KÍCH HOẠT' && (
        <div className="space-y-1 w-48">
          <Label className="text-xs font-medium text-muted-foreground">
            Ngày kích hoạt<span className="text-rose-500 ml-0.5">*</span>
          </Label>
          <input
            type="date"
            value={activationDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          />
        </div>
      )}
    </div>
  )
}

interface DraftOrderCardItemProps {
  item: DraftOrderItem
  onUpdate: (id: string, updates: Partial<DraftOrderItem>) => void
  onRemove: (id: string) => void
  onReset: (id: string) => void
}

export function DraftOrderCardItem({
  item,
  onUpdate,
  onRemove,
  onReset,
}: DraftOrderCardItemProps) {
  const [isComboModalOpen, setIsComboModalOpen] = useState(false)
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  const [appliedVouchers, setAppliedVouchers] = useState<VoucherItem[]>([])

  const filteredCatalog = PRODUCT_CATALOG.filter((p) => p.category === item.category)
  const currentCatalogItem = filteredCatalog.find((p) => p.code === item.productCode)

  const isProgramWithCenter =
    item.program?.toLowerCase().includes('station') ||
    item.program?.toLowerCase().includes('toán tư duy')

  const handleApplyVouchers = (selectedList: VoucherItem[]) => {
    setAppliedVouchers(selectedList)

    const calcDiscount = selectedList.reduce((sum, v) => {
      if (v.discountType === 'direct') {
        return sum + v.discountValue
      } else {
        return sum + Math.round((item.unitPrice * item.quantity * v.discountValue) / 100)
      }
    }, 0)

    onUpdate(item.id, { discount: calcDiscount })
  }

  const handleProductChange = (code: string) => {
    const matched = PRODUCT_CATALOG.find((p) => p.code === code)
    if (matched) {
      onUpdate(item.id, {
        productCode: matched.code,
        productName: matched.name,
        unitPrice: matched.price,
        program: matched.program,
        teacher: matched.teacher,
        packageType: matched.packageType,
        center: matched.center || item.center || 'Rino Linh Đàm',
        isCustomPrice: matched.isCustomPrice,
        priceRangePlaceholder: matched.priceRangePlaceholder,
        discount: Math.round(matched.price * 0.1),
      })
    } else {
      onUpdate(item.id, { productCode: code })
    }
  }

  const handleShowComboDetails = () => {
    setIsComboModalOpen(true)
  }

  const isCustomPrice = !!(item.productCode && (item.isCustomPrice || currentCatalogItem?.isCustomPrice))
  const rangePlaceholder = item.priceRangePlaceholder || currentCatalogItem?.priceRangePlaceholder || '6.500.000 (đ) - 14.500.000 (đ)'

  return (
    <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-xl p-3.5 space-y-3 shadow-2xs hover:border-border transition-all">
      {/* ── CARD HEADER: TITLE + ORDER TYPE + CHỌN CON GROUPING ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-normal">
            {item.categoryName}
          </span>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <Checkbox
                checked={item.isNew}
                onCheckedChange={(checked) =>
                  onUpdate(item.id, {
                    isNew: !!checked,
                    isRenewal: !checked,
                  })
                }
              />
              <span>Mua mới</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <Checkbox
                checked={item.isRenewal}
                onCheckedChange={(checked) =>
                  onUpdate(item.id, {
                    isRenewal: !checked,
                    isNew: !checked,
                  })
                }
              />
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">Gia hạn</span>
            </label>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onReset(item.id)}
            className="p-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded transition-colors cursor-pointer"
            title="Làm mới sản phẩm"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-1 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
            title="Xóa sản phẩm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── CARD CONTENT BY CATEGORY ── */}

      {/* 1. SẢN PHẨM KHÓA HỌC */}
      {item.category === 'khoa_hoc' && (
        <div className="space-y-3">
          {/* CÙNG 1 HÀNG: Sản phẩm | Số gói | Đơn giá | Khuyến mại | Thành tiền */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-end">
            <div className="lg:col-span-4 space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Sản phẩm
              </Label>
              <CustomSelect
                value={item.productCode}
                onChange={(val) => handleProductChange(val)}
                is3Line={true}
                placeholder="Chọn..."
                options={filteredCatalog.map((prod) => ({
                  value: prod.code,
                  label: prod.name,
                  subtext1: prod.program || 'Chương trình Khóa học',
                  subtext2: `${prod.teacher} - ${prod.packageType}`,
                }))}
              />
            </div>

            <div className="lg:col-span-2 space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Số gói
              </Label>
              <div className="flex items-center h-9 border border-input rounded-md overflow-hidden bg-background shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                  className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-r border-input transition-colors cursor-pointer shrink-0"
                  title="Giảm số lượng"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdate(item.id, {
                      quantity: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-full text-center text-xs font-semibold focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
                  className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-l border-input transition-colors cursor-pointer shrink-0"
                  title="Tăng số lượng"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Đơn giá
              </Label>
              {isCustomPrice ? (
                <Input
                  type="text"
                  value={item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
                    onUpdate(item.id, { unitPrice: val })
                  }}
                  placeholder={rangePlaceholder}
                  className="h-9 px-1.5 text-xs font-normal placeholder:font-normal placeholder:not-italic placeholder:text-[9.5px] placeholder:text-zinc-400 focus:ring-indigo-500 truncate"
                  title={rangePlaceholder}
                />
              ) : (
                <div className="h-9 flex items-center justify-end text-xs font-semibold text-foreground">
                  {formatCurrency(item.unitPrice)}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Khuyến mại
              </Label>
              <div className="h-9 flex items-center justify-end text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                -{formatCurrency(item.discount)}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Thành tiền
              </Label>
              <div className="h-9 flex items-center justify-end text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {formatCurrency(item.unitPrice * item.quantity - item.discount)}
              </div>
            </div>
          </div>

          <div className="pt-1">
            <ActivationMethodControl
              value={item.activationMethod || 'KÍCH HOẠT KHI LÊN ĐƠN'}
              activationDate={item.activationDate}
              onChange={(val) => onUpdate(item.id, { activationMethod: val })}
              onDateChange={(date) => onUpdate(item.id, { activationDate: date })}
            />
          </div>
        </div>
      )}

      {/* 2. SẢN PHẨM COMBO */}
      {item.category === 'combo' && (
        <div className="space-y-3">
          {/* CÙNG 1 HÀNG: Sản phẩm | Số gói | Đơn giá | Khuyến mại | Thành tiền */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-end">
            <div className="lg:col-span-4 space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                  Sản phẩm
                </Label>
                <button
                  type="button"
                  onClick={handleShowComboDetails}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  <Info className="h-3 w-3 text-sky-500" />
                  <span>Chi tiết combo</span>
                </button>
              </div>

              <CustomSelect
                value={item.productCode}
                onChange={(val) => handleProductChange(val)}
                is3Line={true}
                placeholder="Chọn..."
                options={filteredCatalog.map((prod) => ({
                  value: prod.code,
                  label: prod.name,
                  subtext1: prod.program || 'Chương trình Combo',
                  subtext2: `${prod.teacher} - ${prod.packageType}`,
                }))}
              />
            </div>

            {/* Quantity Stepper with Minus & Plus buttons */}
            <div className="lg:col-span-2 space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Số gói
              </Label>
              <div className="flex items-center h-9 border border-input rounded-md overflow-hidden bg-background shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                  className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-r border-input transition-colors cursor-pointer shrink-0"
                  title="Giảm số lượng"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdate(item.id, {
                      quantity: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-full text-center text-xs font-semibold focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
                  className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-l border-input transition-colors cursor-pointer shrink-0"
                  title="Tăng số lượng"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Đơn giá
              </Label>
              {isCustomPrice ? (
                <Input
                  type="text"
                  value={item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
                    onUpdate(item.id, { unitPrice: val })
                  }}
                  placeholder={rangePlaceholder}
                  className="h-9 px-1.5 text-xs font-normal placeholder:font-normal placeholder:not-italic placeholder:text-[9.5px] placeholder:text-zinc-400 focus:ring-indigo-500 truncate"
                  title={rangePlaceholder}
                />
              ) : (
                <div className="h-9 flex items-center justify-end text-xs font-semibold text-foreground">
                  {formatCurrency(item.unitPrice)}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Khuyến mại
              </Label>
              <div className="h-9 flex items-center justify-end text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                -{formatCurrency(item.discount)}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Thành tiền
              </Label>
              <div className="h-9 flex items-center justify-end text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {formatCurrency(item.unitPrice * item.quantity - item.discount)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SẢN PHẨM GIA SƯ / STATION */}
      {item.category === 'gia_su' && (
        <div className="space-y-3">
          {/* Row 1: Chương trình | Giáo viên | Gói | Cơ sở */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Chương trình
              </Label>
              <CustomSelect
                value={item.program}
                onChange={(val) => onUpdate(item.id, { program: val })}
                options={[
                  { value: 'Chương trình Station', label: 'Chương trình Station' },
                  { value: 'Chương trình Station Grammar', label: 'Chương trình Station Grammar' },
                  { value: 'Chương trình Toán tư duy', label: 'Chương trình Toán tư duy' },
                  { value: 'Chương trình Toán tư duy Tutor', label: 'Chương trình Toán tư duy Tutor' },
                  { value: 'Tiếng Anh IELTS', label: 'Tiếng Anh IELTS' },
                  { value: 'CHƯƠNG TRÌNH IELTS (AI)', label: 'CHƯƠNG TRÌNH IELTS (AI)' },
                  { value: 'Toán Duo CLC', label: 'Toán Duo CLC' },
                  { value: 'Tiếng Anh Kindie Tutor', label: 'Tiếng Anh Kindie Tutor' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Giáo viên
              </Label>
              <CustomSelect
                value={item.teacher}
                onChange={(val) => onUpdate(item.id, { teacher: val })}
                options={[
                  { value: 'Việt Nam', label: 'Việt Nam' },
                  { value: 'Native', label: 'Native' },
                  { value: 'Phil', label: 'Phil' },
                  { value: '1:1 - Phil', label: '1:1 - Phil' },
                  { value: 'Digital', label: 'Digital' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Gói
              </Label>
              <CustomSelect
                value={item.packageType}
                onChange={(val) => onUpdate(item.id, { packageType: val })}
                options={[
                  { value: '1:10 - 48 buổi', label: '1:10 - 48 buổi' },
                  { value: '1:10 - 24 buổi', label: '1:10 - 24 buổi' },
                  { value: '1:10 - 1 buổi', label: '1:10 - 1 buổi' },
                  { value: '72 buổi', label: '72 buổi' },
                  { value: '48 buổi', label: '48 buổi' },
                  { value: '24 buổi', label: '24 buổi' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <Label
                className={`text-xs font-medium ${
                  isProgramWithCenter ? 'text-muted-foreground' : 'text-muted-foreground/50'
                }`}
              >
                Cơ sở
              </Label>
              <CustomSelect
                disabled={!isProgramWithCenter}
                placeholder={isProgramWithCenter ? 'Chọn cơ sở...' : 'Không áp dụng'}
                value={isProgramWithCenter ? item.center || 'Rino Linh Đàm' : ''}
                onChange={(val) => onUpdate(item.id, { center: val })}
                options={[
                  { value: 'Rino Linh Đàm', label: 'Rino Linh Đàm' },
                  { value: 'Rino An Khánh', label: 'Rino An Khánh' },
                  { value: 'Rino Vin SA1', label: 'Rino Vin SA1' },
                  { value: 'Trường Tech Test', label: 'Trường Tech Test' },
                  { value: 'Chi nhánh Tràng Tiền - Hà Nội', label: 'Chi nhánh Tràng Tiền - Hà Nội' },
                ]}
              />
            </div>
          </div>

          {/* Row 2 (CÙNG 1 HÀNG): Sản phẩm | Số gói | Đơn giá | Khuyến mại | Thành tiền */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-end pt-1">
            <div className="lg:col-span-4 space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Sản phẩm
              </Label>
              <CustomSelect
                value={item.productCode}
                onChange={(val) => handleProductChange(val)}
                is3Line={true}
                placeholder="Chọn..."
                options={filteredCatalog.map((prod) => ({
                  value: prod.code,
                  label: prod.name,
                  subtext1: prod.program || 'Chương trình Station',
                  subtext2: `${prod.teacher} - ${prod.packageType}`,
                }))}
              />
            </div>

            {/* Stepper Số gói */}
            <div className="lg:col-span-2 space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Số gói
              </Label>
              <div className="flex items-center h-9 border border-input rounded-md overflow-hidden bg-background shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                  className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-r border-input transition-colors cursor-pointer shrink-0"
                  title="Giảm số lượng"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdate(item.id, {
                      quantity: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-full text-center text-xs font-semibold focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
                  className="h-full px-2 text-zinc-600 hover:text-indigo-600 hover:bg-muted/50 border-l border-input transition-colors cursor-pointer shrink-0"
                  title="Tăng số lượng"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Đơn giá */}
            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Đơn giá
              </Label>
              {isCustomPrice ? (
                <Input
                  type="text"
                  value={item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
                    onUpdate(item.id, { unitPrice: val })
                  }}
                  placeholder={rangePlaceholder}
                  className="h-9 px-1.5 text-xs font-normal placeholder:font-normal placeholder:not-italic placeholder:text-[9.5px] placeholder:text-zinc-400 focus:ring-indigo-500 truncate"
                  title={rangePlaceholder}
                />
              ) : (
                <div className="h-9 flex items-center justify-end text-xs font-semibold text-foreground">
                  {formatCurrency(item.unitPrice)}
                </div>
              )}
            </div>

            {/* Khuyến mại */}
            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Khuyến mại
              </Label>
              <div className="h-9 flex items-center justify-end text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                -{formatCurrency(item.discount)}
              </div>
            </div>

            {/* Thành tiền */}
            <div className="lg:col-span-2 space-y-1 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                Thành tiền
              </Label>
              <div className="h-9 flex items-center justify-end text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {formatCurrency(item.unitPrice * item.quantity - item.discount)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1-LINE VOUCHER SECTION (Button first, no top border, no label) ── */}
      <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsVoucherModalOpen(true)}
          className="text-sky-600 border-sky-300 dark:text-sky-400 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/40 hover:bg-sky-100 text-xs font-medium rounded-md gap-1.5 h-7 px-3 cursor-pointer shrink-0"
        >
          <Tag className="h-3.5 w-3.5 text-sky-500" />
          <span>
            {appliedVouchers.length > 0
              ? `Chọn khuyến mại (${appliedVouchers.length})`
              : 'Chọn khuyến mại'}
          </span>
        </Button>

        {appliedVouchers.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {appliedVouchers.map((v) => {
              const itemDiscount =
                v.discountType === 'direct'
                  ? v.discountValue
                  : Math.round((item.unitPrice * item.quantity * v.discountValue) / 100)

              return (
                <span
                  key={v.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/80 shadow-2xs text-xs font-mono font-semibold"
                >
                  <span>{v.code}</span>
                  <span className="font-sans text-[11px] text-amber-700 dark:text-amber-400 font-normal">
                    (-{formatCurrency(itemDiscount)})
                  </span>
                </span>
              )
            })}
          </div>
        ) : (
          <span className="text-xs italic text-muted-foreground">Chưa chọn khuyến mại</span>
        )}
      </div>

      {/* ── VOUCHER SELECTION DIALOG ── */}
      <VoucherSelectionDialog
        open={isVoucherModalOpen}
        onOpenChange={setIsVoucherModalOpen}
        alreadyAppliedVouchers={appliedVouchers}
        onApplyVouchers={handleApplyVouchers}
      />

      {/* ── COMBO DETAILS DIALOG ── */}
      {item.category === 'combo' && (
        <ComboDetailsDialog
          open={isComboModalOpen}
          onOpenChange={setIsComboModalOpen}
          comboName={item.productName}
          subItems={currentCatalogItem?.subItems}
        />
      )}
    </div>
  )
}
