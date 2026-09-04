'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { PromotionDiscountType, PromotionItem, PromotionType } from '@/mocks/promotions'

interface PromotionsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<PromotionItem>) => void
}

export function PromotionsFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: PromotionsFormDialogProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<PromotionType>('public')
  const [discountType, setDiscountType] = useState<PromotionDiscountType>('direct')
  const [discountValue, setDiscountValue] = useState<number>(500000)
  const [quota, setQuota] = useState<number>(1000)
  const [branch, setBranch] = useState<string>('Toàn hệ thống')
  const [minOrderValue, setMinOrderValue] = useState<number>(0)
  const [validFrom, setValidFrom] = useState<string>('2026-08-01')
  const [validTo, setValidTo] = useState<string>('2026-12-31')
  const [notes, setNotes] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã khuyến mãi')
      return
    }
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên chương trình ưu đãi')
      return
    }

    const newItem: Partial<PromotionItem> = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      type,
      discountType,
      discountValue: Number(discountValue) || 0,
      usageLimit: type === 'public' ? Number(quota) || 1000 : null,
      quantity: type === 'private' ? Number(quota) || 1 : null,
      usedCount: 0,
      status: 'active',
      minOrderValue: Number(minOrderValue) || 0,
      branch,
      applicableCategoryText: 'Tất cả sản phẩm',
      applicableProducts: ['• Tất cả các khóa học tại chi nhánh'],
      validFrom,
      validTo: validTo || 'Không giới hạn',
      createdBy: 'Ban Quản trị RinoEdu',
      createdAt: new Date().toISOString().slice(0, 10),
      notes: notes.trim() || undefined,
    }

    onSubmit(newItem)
    toast.success(`Tạo thành công mã khuyến mãi: ${newItem.code}`)
    onOpenChange(false)

    // Reset form
    setCode('')
    setName('')
    setDescription('')
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[620px] max-h-[85vh] flex flex-col p-0 gap-0 bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
        <DialogHeader className="shrink-0 p-4 px-6 bg-card border-b border-border">
          <DialogTitle className="text-base font-bold text-foreground">
            Tạo mới Mã Khuyến mãi / Suất Ưu đãi
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Radio chọn Loại mã: Mã chung vs Mã riêng */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Phân loại mã ưu đãi *</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as PromotionType)}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <RadioGroupItem value="public" id="type-public" />
                <Label htmlFor="type-public" className="cursor-pointer">
                  <span className="font-semibold text-xs text-foreground block">Mã chung</span>
                  <span className="text-xs text-muted-foreground block">1 mã dùng chung cho nhiều lượt</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <RadioGroupItem value="private" id="type-private" />
                <Label htmlFor="type-private" className="cursor-pointer">
                  <span className="font-semibold text-xs text-foreground block">Mã riêng</span>
                  <span className="text-xs text-muted-foreground block">Số lượng phôi mã cấp cho đối tượng riêng</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Hàng: Mã khuyến mãi & Tên chương trình */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="promo-code" className="text-xs font-semibold">
                Mã khuyến mãi *
              </Label>
              <Input
                id="promo-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: RINOHE2026"
                className="font-mono uppercase text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="promo-name" className="text-xs font-semibold">
                Tên chương trình *
              </Label>
              <Input
                id="promo-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Chào hè 2026 - Giảm 500K"
                className="text-xs"
                required
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="promo-desc" className="text-xs font-semibold">
              Mô tả vắn tắt
            </Label>
            <Textarea
              id="promo-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập thông tin chi tiết về chính sách ưu đãi..."
              className="text-xs min-h-[60px]"
            />
          </div>

          {/* Hàng: Hình thức giảm & Giá trị giảm & Hạn mức */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hình thức giảm</Label>
              <Select
                value={discountType}
                onValueChange={(v) => setDiscountType(v as PromotionDiscountType)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Giảm tiền trực tiếp</SelectItem>
                  <SelectItem value="percentage">Giảm theo %</SelectItem>
                  <SelectItem value="buy_x_get_y">Mua X tặng Y</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="discount-val" className="text-xs font-semibold">
                Giá trị giảm ({discountType === 'percentage' ? '%' : '₫'})
              </Label>
              <Input
                id="discount-val"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quota-val" className="text-xs font-semibold">
                {type === 'public' ? 'Lượt dùng tối đa' : 'Số lượng mã'}
              </Label>
              <Input
                id="quota-val"
                type="number"
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Hàng: Cơ sở áp dụng & Đơn tối thiểu */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Cơ sở áp dụng</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toàn hệ thống">Toàn hệ thống</SelectItem>
                  <SelectItem value="RinoEdu Linh Đàm">RinoEdu Linh Đàm</SelectItem>
                  <SelectItem value="RinoEdu Smart City">RinoEdu Smart City</SelectItem>
                  <SelectItem value="RinoEdu Nguyễn Tuân">RinoEdu Nguyễn Tuân</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="min-order" className="text-xs font-semibold">
                Đơn hàng tối thiểu (₫)
              </Label>
              <Input
                id="min-order"
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(Number(e.target.value))}
                placeholder="0"
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Hàng: Ngày bắt đầu & Ngày kết thúc */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="valid-from" className="text-xs font-semibold">
                Ngày bắt đầu
              </Label>
              <Input
                id="valid-from"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="valid-to" className="text-xs font-semibold">
                Ngày kết thúc
              </Label>
              <Input
                id="valid-to"
                type="date"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <Label htmlFor="promo-notes" className="text-xs font-semibold">
              Ghi chú nội bộ
            </Label>
            <Input
              id="promo-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Cần phê duyệt của Quản lý chi nhánh khi áp dụng"
              className="text-xs"
            />
          </div>

          <div className="shrink-0 pt-4 flex items-center justify-end gap-2.5 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs font-medium cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="h-8 bg-primary text-primary-foreground text-xs font-medium shadow-xs hover:bg-primary/90 cursor-pointer"
            >
              Lưu mã khuyến mãi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
